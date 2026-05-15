/**
 * diff.js
 * Route handler for comparing two cron expressions.
 */

const express = require('express');
const router = express.Router();
const { diffExpressions, areEquivalent } = require('../../utils/cronDiff');
const { validateExpression } = require('../../validator/expressionValidator');
const { describe } = require('../../utils/cronDescriber');

/**
 * POST /api/diff
 * Body: { expressionA: string, expressionB: string }
 * Returns differences between two cron expressions.
 */
router.post('/', (req, res) => {
  const { expressionA, expressionB } = req.body;

  if (!expressionA || !expressionB) {
    return res.status(400).json({
      error: 'Both expressionA and expressionB are required.',
    });
  }

  const validationA = validateExpression(expressionA);
  if (!validationA.valid) {
    return res.status(400).json({
      error: `Invalid expressionA: ${validationA.errors.join(', ')}`,
    });
  }

  const validationB = validateExpression(expressionB);
  if (!validationB.valid) {
    return res.status(400).json({
      error: `Invalid expressionB: ${validationB.errors.join(', ')}`,
    });
  }

  try {
    const diffs = diffExpressions(expressionA, expressionB);
    const equivalent = areEquivalent(expressionA, expressionB);

    return res.json({
      expressionA,
      expressionB,
      equivalent,
      differences: diffs,
      descriptionA: describe(expressionA),
      descriptionB: describe(expressionB),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
