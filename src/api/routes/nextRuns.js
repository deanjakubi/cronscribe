/**
 * Route handler for /api/next-runs
 * Returns the next N scheduled run times for a given cron expression
 */

const express = require('express');
const router = express.Router();
const { getNextRuns } = require('../../utils/cronNextRuns');
const { validateExpression } = require('../../validator/expressionValidator');

/**
 * POST /api/next-runs
 * Body: { expression: string, count?: number, from?: string (ISO date) }
 * Returns an array of upcoming run times
 */
router.post('/', (req, res) => {
  const { expression, count, from } = req.body;

  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid field: expression (string required)',
    });
  }

  const trimmed = expression.trim();

  // Validate the cron expression before computing runs
  const validation = validateExpression(trimmed);
  if (!validation.valid) {
    return res.status(400).json({
      error: 'Invalid cron expression',
      details: validation.errors,
    });
  }

  // Parse optional count (default 5, max 100)
  let runCount = 5;
  if (count !== undefined) {
    const parsed = parseInt(count, 10);
    if (isNaN(parsed) || parsed < 1) {
      return res.status(400).json({
        error: 'Invalid field: count must be a positive integer',
      });
    }
    runCount = Math.min(parsed, 100);
  }

  // Parse optional from date (default: now)
  let fromDate = new Date();
  if (from !== undefined) {
    const parsed = new Date(from);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({
        error: 'Invalid field: from must be a valid ISO 8601 date string',
      });
    }
    fromDate = parsed;
  }

  try {
    const runs = getNextRuns(trimmed, runCount, fromDate);
    return res.json({
      expression: trimmed,
      count: runs.length,
      from: fromDate.toISOString(),
      nextRuns: runs.map((d) => d.toISOString()),
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to compute next runs',
      details: err.message,
    });
  }
});

/**
 * GET /api/next-runs?expression=...&count=...&from=...
 * Query-param based alternative for simple GET requests
 */
router.get('/', (req, res) => {
  const { expression, count, from } = req.query;

  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid query param: expression',
    });
  }

  const trimmed = expression.trim();

  const validation = validateExpression(trimmed);
  if (!validation.valid) {
    return res.status(400).json({
      error: 'Invalid cron expression',
      details: validation.errors,
    });
  }

  let runCount = 5;
  if (count !== undefined) {
    const parsed = parseInt(count, 10);
    if (isNaN(parsed) || parsed < 1) {
      return res.status(400).json({
        error: 'Invalid query param: count must be a positive integer',
      });
    }
    runCount = Math.min(parsed, 100);
  }

  let fromDate = new Date();
  if (from !== undefined) {
    const parsed = new Date(from);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({
        error: 'Invalid query param: from must be a valid ISO 8601 date string',
      });
    }
    fromDate = parsed;
  }

  try {
    const runs = getNextRuns(trimmed, runCount, fromDate);
    return res.json({
      expression: trimmed,
      count: runs.length,
      from: fromDate.toISOString(),
      nextRuns: runs.map((d) => d.toISOString()),
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to compute next runs',
      details: err.message,
    });
  }
});

module.exports = router;
