const express = require('express');
const router = express.Router();
const {
  convertTimezone,
  getSupportedTimezones,
} = require('../../utils/cronTimezone');

/**
 * GET /api/timezone/list
 * Returns all supported timezones
 */
router.get('/list', (req, res) => {
  const timezones = getSupportedTimezones();
  res.json({ timezones });
});

/**
 * POST /api/timezone/convert
 * Body: { expression, fromTimezone, toTimezone }
 * Converts a cron expression from one timezone to another
 */
router.post('/convert', (req, res) => {
  const { expression, fromTimezone, toTimezone } = req.body || {};

  if (!expression) {
    return res.status(400).json({ error: 'expression is required' });
  }
  if (!fromTimezone) {
    return res.status(400).json({ error: 'fromTimezone is required' });
  }
  if (!toTimezone) {
    return res.status(400).json({ error: 'toTimezone is required' });
  }

  try {
    const converted = convertTimezone(expression, fromTimezone, toTimezone);
    res.json({
      original: expression,
      converted,
      fromTimezone,
      toTimezone,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
