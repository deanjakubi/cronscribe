const express = require('express');
const router = express.Router();
const { validateExpression } = require('../../validator/expressionValidator');

/**
 * POST /api/validate
 * Validates a cron expression and returns validation result with field breakdown
 *
 * Body: { expression: string }
 * Response: { valid: boolean, expression?: string, fields?: object, error?: string }
 */
router.post('/', (req, res) => {
  const { expression } = req.body;

  if (!expression) {
    return res.status(400).json({
      valid: false,
      error: 'Missing required field: expression',
    });
  }

  const result = validateExpression(expression);

  if (!result.valid) {
    return res.status(422).json({
      valid: false,
      expression,
      error: result.error,
    });
  }

  const fieldNames = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
  const fields = expression.trim().split(/\s+/).reduce((acc, value, index) => {
    acc[fieldNames[index]] = value;
    return acc;
  }, {});

  return res.status(200).json({
    valid: true,
    expression: expression.trim(),
    fields,
  });
});

/**
 * GET /api/validate
 * Validates a cron expression passed as a query parameter
 *
 * Query: ?expression=<cron>
 */
router.get('/', (req, res) => {
  const { expression } = req.query;

  if (!expression) {
    return res.status(400).json({
      valid: false,
      error: 'Missing required query parameter: expression',
    });
  }

  const result = validateExpression(expression);

  if (!result.valid) {
    return res.status(422).json({
      valid: false,
      expression,
      error: result.error,
    });
  }

  return res.status(200).json({
    valid: true,
    expression: expression.trim(),
  });
});

module.exports = router;
