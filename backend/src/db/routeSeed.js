require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./index');

async function seed() {
  const client = await pool.connect();

  try {
    const jsonPath = path.join(__dirname, '../../../abhaya_road_ids_coords.json');
    console.log(`📂 Reading road data from: ${jsonPath}`);

    const roadData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📊 Loaded ${roadData.length} roads from JSON`);

    console.log('🧹 Clearing existing road_segments...');
    await client.query('TRUNCATE road_segments RESTART IDENTITY CASCADE');

    console.log('🌱 Seeding road_segments with real coordinates...');

    // Batch insertion for performance
    const batchSize = 100;
    for (let i = 0; i < roadData.length; i += batchSize) {
      const batch = roadData.slice(i, i + batchSize);

      const values = [];
      const queries = batch.map((road, index) => {
        const roadName = `road_${i + index + 1}`;
        const osmId = road.road_id;

        // Convert coordinates to GeoJSON LineString [lon, lat]
        const coordinates = road.coordinates.map(c => [c.lon, c.lat]);
        const geojson = JSON.stringify({
          type: 'LineString',
          coordinates: coordinates
        });

        const offset = index * 3;
        values.push(roadName, osmId, geojson);
        return `($${offset + 1}, $${offset + 2}, ST_GeomFromGeoJSON($${offset + 3}))`;
      });

      const queryText = `
        INSERT INTO road_segments (road_name, osm_id, geom)
        VALUES ${queries.join(', ')}
      `;

      await client.query(queryText, values);
      process.stdout.write(`\r✅ Inserted ${Math.min(i + batchSize, roadData.length)} / ${roadData.length} roads...`);
    }
    console.log('\n✨ Seeding complete!');

    // Verify
    const count = await client.query('SELECT COUNT(*) FROM road_segments');
    console.log(`✅ Total records in road_segments: ${count.rows[0].count}`);

    const sample = await client.query(`
      SELECT road_name, road_type, base_score, final_safety_score
      FROM v_road_safety
      LIMIT 10
    `);
    console.log('\n📊 Sample of seeded roads:');
    console.table(sample.rows);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
