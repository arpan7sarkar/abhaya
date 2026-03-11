require('dotenv').config();
const { pool } = require('./index');

async function seedPolice() {
    const client = await pool.connect();

    try {
        console.log('🧹 Clearing existing police_stations...');
        await client.query('TRUNCATE police_stations RESTART IDENTITY CASCADE');

        console.log('🌱 Seeding police_stations...');

        const stations = [
            {
                name: 'Barasat Police Station',
                phone: '033 2552 3543',
                address: 'KNC Road, Barasat, Kolkata, West Bengal 700124',
                lng: 88.4873,
                lat: 22.7188
            }
        ];

        for (const ps of stations) {
            await client.query(
                `INSERT INTO police_stations (name, phone, address, geom)
         VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))`,
                [ps.name, ps.phone, ps.address, ps.lng, ps.lat]
            );
        }

        const count = await client.query('SELECT COUNT(*) FROM police_stations');
        console.log(`✅ Seeded ${count.rows[0].count} police stations`);

    } catch (err) {
        console.error('❌ Police seed failed:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seedPolice();
