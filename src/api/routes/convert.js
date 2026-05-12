const express = require('express');
const router = express.Router();
const { parse } = require('../../parser/naturalLanguageParser');
const { buildCronExpression } = require('../../converter/cronBuilder');

/**
 * POST /api/convert
 * Converts a natural language schedule description to a cron expression.
 *
 * Body: { "expression": "every day at 9am" }
 * Response: { "cron": "0 9 * * *", "description": "every day at 9am" }
 */
router.post('/convert', (req, res) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid field: "expression" must be a non-empty string.'
    });
  }

  const trimmed = expression.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({
      error: '"expression" must not be blank.'
    });
  }

  if (trimmed.length > 256) {
    return res.status(400).json({
      error: '"expression" must not exceed 256 characters.'
    });
  }

  try {
    const parsed = parse(trimmed);

    if (!parsed) {
      return res.status(422).json({
        error: 'Could not understand the schedule expression. Please rephrase and try again.'
      });
    }

    const cron = buildCronExpression(parsed);

    return res.status(200).json({
      cron,
      description: trimmed
    });
  } catch (err) {
    console.error('[convert] Unexpected error:', err.message);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

module.exports = router;
