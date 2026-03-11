require('dotenv').config();
const { pool } = require('./index');

async function randomize() {
  const client = await pool.connect();

  try {
    console.log('🎲 Randomising safety attributes for all road_segments...');

    // Uses PostgreSQL random() — every row gets independent random values:
    //   lighting       → random BOOLEAN
    //   crowd_level    → random pick from {'low','medium','high'}
    //   incidents_reported → random INT 0–8
    //   cctv_present   → random BOOLEAN
    const result = await client.query(`
      UPDATE road_segments
      SET
        lighting = (random() > 0.5),
        crowd_level = (ARRAY['low','medium','high'])[floor(random() * 3 + 1)],
        incidents_reported = floor(random() * 9)::int,
        cctv_present = (random() > 0.5),
        last_updated = NOW()
    `);

    console.log(`✅ Updated ${result.rowCount} road segments with random safety data`);

    // Show a sample to verify
    const sample = await client.query(`
      SELECT id, road_name, lighting, crowd_level, incidents_reported, cctv_present
      FROM road_segments
      ORDER BY random()
      LIMIT 10
    `);
    console.log('\n📊 Random sample of updated rows:');
    console.table(sample.rows);

  } catch (err) {
    console.error('❌ Randomisation failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

randomize();
