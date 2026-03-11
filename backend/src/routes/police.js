const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// ─────────────────────────────────────────────────────────────────
// GET /api/police/nearest?lat=&lng=
// Returns nearest police station with distance
// ─────────────────────────────────────────────────────────────────
router.get('/nearest', async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters are required' });
    }

    const result = await pool.query(
      `SELECT
         id,
         name,
         phone,
         address,
         ST_Distance(
           geom::geography,
           ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
         ) AS distance_meters
       FROM police_stations
       WHERE active = true
       ORDER BY geom::geography <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
       LIMIT 1`,
      [parseFloat(lng), parseFloat(lat)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active police stations found' });
    }

    const station = result.rows[0];
    res.json({
      id: station.id,
      name: station.name,
      phone: station.phone,
      address: station.address,
      distance_meters: parseFloat(station.distance_meters),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
