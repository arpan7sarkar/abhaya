require('dotenv').config();
const { pool } = require('./index');

async function randomize() {
  const client = await pool.connect();

  try {
    console.log('🎲 Randomising safety attributes for all road_segments...');

    // Weighted random distributions:
    //   lighting         → 80% true, 20% false
    //   crowd_level      → 80% medium, 10% low, 10% high
    //   incidents_reported → 80% low (0-3), 20% higher (4-8)
    //   cctv_present     → 60% true, 40% false
    const result = await client.query(`
      UPDATE road_segments
      SET
        lighting = (random() < 0.8),
        crowd_level = CASE
          WHEN random() < 0.1  THEN 'low'
          WHEN random() < 0.89 THEN 'medium'
          ELSE 'high'
        END,
        incidents_reported = CASE
          WHEN random() < 0.8 THEN floor(random() * 4)::int
          ELSE floor(random() * 5 + 4)::int
        END,
        cctv_present = (random() < 0.6),
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
