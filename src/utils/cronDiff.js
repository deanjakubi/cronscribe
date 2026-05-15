/**
 * cronDiff.js
 * Utility to compare two cron expressions and describe their differences.
 */

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

/**
 * Parse a cron expression into its component fields.
 * @param {string} expression
 * @returns {object}
 */
function parseCronFields(expression) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(`Invalid cron expression: "${expression}"`);
  }
  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
}

/**
 * Compare two cron field values.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function fieldsEqual(a, b) {
  return a === b;
}

/**
 * Compute differences between two cron expressions.
 * @param {string} exprA
 * @param {string} exprB
 * @returns {{ field: string, from: string, to: string }[]}
 */
function diffExpressions(exprA, exprB) {
  const fieldsA = parseCronFields(exprA);
  const fieldsB = parseCronFields(exprB);
  const diffs = [];

  for (const field of FIELD_NAMES) {
    if (!fieldsEqual(fieldsA[field], fieldsB[field])) {
      diffs.push({
        field,
        from: fieldsA[field],
        to: fieldsB[field],
      });
    }
  }

  return diffs;
}

/**
 * Check if two cron expressions are equivalent.
 * @param {string} exprA
 * @param {string} exprB
 * @returns {boolean}
 */
function areEquivalent(exprA, exprB) {
  return diffExpressions(exprA, exprB).length === 0;
}

module.exports = { parseCronFields, diffExpressions, areEquivalent };
