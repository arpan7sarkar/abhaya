const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const roadsRouter = require('./routes/roads');
const policeRouter = require('./routes/police');
const communityRouter = require('./routes/community');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ───────────────────────────────────────────────────
app.use(cors());                // allow all origins for now
app.use(express.json());        // parse JSON bodies

// ── Health check ────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/roads', roadsRouter);
app.use('/api/police', policeRouter);
app.use('/api/community', communityRouter);

// ── Global error handler (must be last) ─────────────────────────
app.use(errorHandler);

module.exports = app;
