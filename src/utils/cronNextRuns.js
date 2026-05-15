/**
 * cronNextRuns.js
 * Calculates the next N upcoming run times for a given cron expression.
 */

const { validateExpression } = require('../validator/expressionValidator');

/**
 * Parse cron fields from expression string.
 * @param {string} expression
 * @returns {string[]}
 */
function parseCronFields(expression) {
  return expression.trim().split(/\s+/);
}

/**
 * Check if a value matches a cron field pattern.
 * @param {number} value
 * @param {string} field
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function matchesField(value, field, min, max) {
  if (field === '*') return true;

  if (field.includes('/')) {
    const [range, step] = field.split('/');
    const start = range === '*' ? min : parseInt(range, 10);
    const stepNum = parseInt(step, 10);
    if ((value - start) % stepNum === 0 && value >= start && value <= max) return true;
    return false;
  }

  if (field.includes(',')) {
    return field.split(',').some(part => matchesField(value, part.trim(), min, max));
  }

  if (field.includes('-')) {
    const [lo, hi] = field.split('-').map(Number);
    return value >= lo && value <= hi;
  }

  return parseInt(field, 10) === value;
}

/**
 * Get the next N run times for a cron expression.
 * @param {string} expression - Cron expression (5 fields)
 * @param {number} [count=5] - Number of upcoming runs to return
 * @param {Date} [fromDate] - Start date (defaults to now)
 * @returns {{ runs: Date[], error: string|null }}
 */
function getNextRuns(expression, count = 5, fromDate = new Date()) {
  const validation = validateExpression(expression);
  if (!validation.valid) {
    return { runs: [], error: validation.error || 'Invalid cron expression' };
  }

  const [minuteF, hourF, domF, monthF, dowF] = parseCronFields(expression);
  const runs = [];
  const cursor = new Date(fromDate);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIterations = 100000;
  let iterations = 0;

  while (runs.length < count && iterations < maxIterations) {
    iterations++;
    const month = cursor.getMonth() + 1;
    const dom = cursor.getDate();
    const hour = cursor.getHours();
    const minute = cursor.getMinutes();
    const dow = cursor.getDay();

    if (
      matchesField(month, monthF, 1, 12) &&
      matchesField(dom, domF, 1, 31) &&
      matchesField(dow, dowF, 0, 6) &&
      matchesField(hour, hourF, 0, 23) &&
      matchesField(minute, minuteF, 0, 59)
    ) {
      runs.push(new Date(cursor));
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return { runs, error: null };
}

module.exports = { getNextRuns, matchesField };
