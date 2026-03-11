const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('render.com') || process.env.DATABASE_URL.includes('elephantsql.com'))
    ? { rejectUnauthorized: false }
    : false,
});

// ── initDB: extensions → tables → indexes → triggers → views ──
async function initDB() {
  const client = await pool.connect();

  try {
    // ── Extensions ──────────────────────────────────────────────
    await client.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgrouting;`);

    // Log PostGIS version
    const pgisVersion = await client.query(`SELECT PostGIS_Version();`);
    console.log(`✅ PostGIS version: ${pgisVersion.rows[0].postgis_version}`);

    // ── Table 1: police_stations ────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS police_stations (
        id            SERIAL          PRIMARY KEY,
        name          VARCHAR(255)    NOT NULL,
        phone         VARCHAR(20),
        address       TEXT,
        geom          GEOMETRY(Point, 4326)   NOT NULL,
        active        BOOLEAN         DEFAULT true,
        created_at    TIMESTAMP       DEFAULT NOW()
      );
    `);

    // ── Table 2: road_segments ──────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS road_segments (
        id                      SERIAL          PRIMARY KEY,
        road_name               VARCHAR(255)    NOT NULL,
        osm_id                  BIGINT          UNIQUE,
        road_type               VARCHAR(20)     CHECK (road_type IN ('main', 'street', 'lane', 'alley')),
        geom                    GEOMETRY(LineString, 4326)  NOT NULL,
        safety_score            NUMERIC(3,1)    CHECK (safety_score BETWEEN 0 AND 10) DEFAULT 5.0,
        lighting                BOOLEAN         DEFAULT false,
        crowd_level             VARCHAR(10)     CHECK (crowd_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
        incidents_reported      INT             DEFAULT 0,
        cctv_present            BOOLEAN         DEFAULT false,
        nearest_police_id       INT             REFERENCES police_stations(id),
        police_distance_meters  NUMERIC(8,2),
        last_updated            TIMESTAMP       DEFAULT NOW(),
        created_at              TIMESTAMP       DEFAULT NOW()
      );
    `);

    // Spatial index on road geometry
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_road_geom
        ON road_segments USING GIST(geom);
    `);

    // Index on safety_score
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_safety_score
        ON road_segments(safety_score DESC);
    `);

    // ── Table 3: users ──────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL          PRIMARY KEY,
        name          VARCHAR(255),
        phone         VARCHAR(20)     UNIQUE NOT NULL,
        email         VARCHAR(255)    UNIQUE,
        created_at    TIMESTAMP       DEFAULT NOW()
      );
    `);

    // ── Table 4: incident_reports ───────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS incident_reports (
        id            SERIAL          PRIMARY KEY,
        road_id       INT             REFERENCES road_segments(id),
        user_id       INT             REFERENCES users(id),
        description   TEXT,
        geom          GEOMETRY(Point, 4326),
        reported_at   TIMESTAMP       DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_incident_geom
        ON incident_reports USING GIST(geom);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_incident_road
        ON incident_reports(road_id);
    `);

    // ── Table 5: route_requests ─────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS route_requests (
        id              SERIAL          PRIMARY KEY,
        user_id         INT             REFERENCES users(id),
        origin          GEOMETRY(Point, 4326)   NOT NULL,
        destination     GEOMETRY(Point, 4326)   NOT NULL,
        requested_at    TIMESTAMP       DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_route_origin
        ON route_requests USING GIST(origin);
    `);

    // ── Function + Trigger: police proximity ────────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION update_police_proximity()
      RETURNS TRIGGER AS $$
      BEGIN
        SELECT
          ps.id,
          ST_Distance(NEW.geom::geography, ps.geom::geography)
        INTO
          NEW.nearest_police_id,
          NEW.police_distance_meters
        FROM police_stations ps
        WHERE ps.active = true
        ORDER BY ST_Distance(NEW.geom::geography, ps.geom::geography)
        LIMIT 1;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Drop + recreate trigger (safe for re-runs)
    await client.query(`
      DROP TRIGGER IF EXISTS trg_police_proximity ON road_segments;
    `);
    await client.query(`
      CREATE TRIGGER trg_police_proximity
        BEFORE INSERT OR UPDATE ON road_segments
        FOR EACH ROW
        EXECUTE FUNCTION update_police_proximity();
    `);

    // ── Function + Trigger: incident count sync ─────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_incident_count()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE road_segments
        SET
          incidents_reported = (
            SELECT COUNT(*) FROM incident_reports
            WHERE road_id = NEW.road_id
          ),
          last_updated = NOW()
        WHERE id = NEW.road_id;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS trg_incident_count ON incident_reports;
    `);
    await client.query(`
      CREATE TRIGGER trg_incident_count
        AFTER INSERT ON incident_reports
        FOR EACH ROW
        EXECUTE FUNCTION sync_incident_count();
    `);

    // ── View: v_road_safety ─────────────────────────────────────
    await client.query(`
      CREATE OR REPLACE VIEW v_road_safety AS
      SELECT
        rs.id,
        rs.road_name,
        rs.road_type,
        rs.geom,
        rs.safety_score                                           AS base_score,
        rs.lighting,
        rs.crowd_level,
        rs.incidents_reported,
        rs.cctv_present,
        ps.name                                                   AS nearest_police_station,
        rs.police_distance_meters,
        rs.last_updated,

        ROUND(
          LEAST(10,
            rs.safety_score
            + CASE WHEN rs.lighting       THEN 1.0  ELSE 0.0 END
            + CASE WHEN rs.cctv_present   THEN 1.0  ELSE 0.0 END
            + CASE
                WHEN rs.crowd_level = 'high'   THEN  1.0
                WHEN rs.crowd_level = 'low'    THEN -1.0
                ELSE 0.0
              END
            + GREATEST(0, 2.0 - (COALESCE(rs.police_distance_meters, 9999) / 1500.0))
            - LEAST(3.0, rs.incidents_reported * 0.5)
          )
          * CASE
              WHEN EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Kolkata') >= 22
                OR EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Kolkata') <=  5
              THEN 0.7
              ELSE 1.0
            END
        , 1) AS final_safety_score,

        ROUND(
          10 - LEAST(10,
            rs.safety_score
            + CASE WHEN rs.lighting     THEN 1.0 ELSE 0.0 END
            + CASE WHEN rs.cctv_present THEN 1.0 ELSE 0.0 END
            + CASE WHEN rs.crowd_level = 'high' THEN 1.0
                   WHEN rs.crowd_level = 'low'  THEN -1.0 ELSE 0.0 END
            + GREATEST(0, 2.0 - (COALESCE(rs.police_distance_meters, 9999) / 1500.0))
            - LEAST(3.0, rs.incidents_reported * 0.5)
          )
          * CASE
              WHEN EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Kolkata') >= 22 OR EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Kolkata') <= 5
              THEN 0.7 ELSE 1.0
            END
        , 2) AS routing_cost

      FROM road_segments rs
      LEFT JOIN police_stations ps ON ps.id = rs.nearest_police_id;
    `);

    console.log('✅ Database initialised — all tables, indexes, triggers & views ready');
  } catch (err) {
    console.error('❌ Database initialisation failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
