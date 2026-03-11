const express = require('express');
const router  = express.Router();
const { pool } = require('../db');

// GET /api/community/posts
router.get('/posts', async (req, res, next) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 10);
    const offset   = (page - 1) * limit;
    const { category } = req.query;

    const hasFilter = category && category !== 'all';
    const params    = hasFilter ? [limit, offset, category] : [limit, offset];
    const where     = hasFilter ? 'WHERE p.category = $3' : '';

    const result = await pool.query(
      `SELECT p.*,
         COUNT(DISTINCT c.id) AS comment_count,
         COUNT(DISTINCT l.id) AS likes_count
       FROM community_posts p
       LEFT JOIN community_comments c ON c.post_id = p.id
       LEFT JOIN community_likes    l ON l.post_id = p.id
       ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM community_posts ${hasFilter ? 'WHERE category = $1' : ''}`,
      hasFilter ? [category] : []
    );

    res.json({ posts: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (err) { next(err); }
});

// POST /api/community/posts
router.post('/posts', async (req, res, next) => {
  try {
    const { clerkUserId, authorName, authorAvatar, content, category = 'general', isSos = false, sosLat, sosLng, sosAddress } = req.body;
    const result = await pool.query(
      `INSERT INTO community_posts
         (clerk_user_id, author_name, author_avatar, content, category, is_sos, sos_lat, sos_lng, sos_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [clerkUserId, authorName, authorAvatar, content.trim(), isSos ? 'sos-alert' : category, isSos, sosLat, sosLng, sosAddress]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// GET /api/community/posts/:id (Post Detail + Comments)
router.get('/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const postRes = await pool.query(`SELECT * FROM community_posts WHERE id=$1`, [id]);
    if (!postRes.rows.length) return res.status(404).json({ error: 'Not found' });
    const commentsRes = await pool.query(`SELECT * FROM community_comments WHERE post_id=$1 ORDER BY created_at ASC`, [id]);
    res.json({ post: postRes.rows[0], comments: commentsRes.rows });
  } catch (err) { next(err); }
});

// POST /api/community/posts/:id/comments
router.post('/posts/:id/comments', async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { clerkUserId, authorName, authorAvatar, content } = req.body;
    const result = await pool.query(
      `INSERT INTO community_comments (post_id, clerk_user_id, author_name, author_avatar, content)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [postId, clerkUserId, authorName, authorAvatar, content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST /api/community/posts/:id/like (Toggle)
router.post('/posts/:id/like', async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { clerkUserId } = req.body;
    const exists = await pool.query(`SELECT id FROM community_likes WHERE post_id=$1 AND clerk_user_id=$2`, [postId, clerkUserId]);
    if (exists.rows.length) {
      await pool.query(`DELETE FROM community_likes WHERE post_id=$1 AND clerk_user_id=$2`, [postId, clerkUserId]);
      return res.json({ liked: false });
    }
    await pool.query(`INSERT INTO community_likes (post_id, clerk_user_id) VALUES ($1, $2)`, [postId, clerkUserId]);
    res.json({ liked: true });
  } catch (err) { next(err); }
});

// POST /api/community/sos-alert (Specific SOS trigger)
router.post('/sos-alert', async (req, res, next) => {
  try {
    const { clerkUserId, authorName, authorAvatar, lat, lng, address } = req.body;
    const content = `🚨 SOS ALERT! I need help at my current location. Please assist me! Address: ${address || `Lat: ${lat}, Lng: ${lng}`}`;
    const result = await pool.query(
      `INSERT INTO community_posts
         (clerk_user_id, author_name, author_avatar, content, category, is_sos, sos_lat, sos_lng, sos_address)
       VALUES ($1,$2,$3,$4,'sos-alert',true,$5,$6,$7) RETURNING *`,
      [clerkUserId, authorName, authorAvatar, content, lat, lng, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
