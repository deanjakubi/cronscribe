/**
 * cronBuilder.js
 * Converts parsed natural language schedule objects into valid cron expressions.
 */

const DEFAULT_FIELD = '*';

/**
 * Pads a number to two digits (used for validation display, not cron itself).
 */
function validateRange(value, min, max, fieldName) {
  if (value < min || value > max) {
    throw new RangeError(`${fieldName} value ${value} is out of range [${min}, ${max}]`);
  }
}

/**
 * Build a cron expression from a parsed schedule object.
 *
 * Expected shape of `schedule`:
 * {
 *   minute: number | null,
 *   hour: number | null,
 *   dayOfMonth: number | null,
 *   month: number | null,
 *   dayOfWeek: number | null,   // 0 (Sun) – 6 (Sat)
 *   step: { field: string, value: number } | null
 * }
 *
 * @param {object} schedule
 * @returns {string} cron expression (5 fields)
 */
function buildCronExpression(schedule) {
  if (!schedule || typeof schedule !== 'object') {
    throw new TypeError('schedule must be a non-null object');
  }

  let minute = DEFAULT_FIELD;
  let hour = DEFAULT_FIELD;
  let dayOfMonth = DEFAULT_FIELD;
  let month = DEFAULT_FIELD;
  let dayOfWeek = DEFAULT_FIELD;

  if (schedule.minute != null) {
    validateRange(schedule.minute, 0, 59, 'minute');
    minute = String(schedule.minute);
  }

  if (schedule.hour != null) {
    validateRange(schedule.hour, 0, 23, 'hour');
    hour = String(schedule.hour);
  }

  if (schedule.dayOfMonth != null) {
    validateRange(schedule.dayOfMonth, 1, 31, 'dayOfMonth');
    dayOfMonth = String(schedule.dayOfMonth);
  }

  if (schedule.month != null) {
    validateRange(schedule.month, 1, 12, 'month');
    month = String(schedule.month);
  }

  if (schedule.dayOfWeek != null) {
    validateRange(schedule.dayOfWeek, 0, 6, 'dayOfWeek');
    dayOfWeek = String(schedule.dayOfWeek);
  }

  // Handle step expressions like "every 5 minutes" -> */5 * * * *
  if (schedule.step) {
    const { field, value } = schedule.step;
    validateRange(value, 1, 59, 'step value');
    const stepExpr = `*/${value}`;
    if (field === 'minute') minute = stepExpr;
    else if (field === 'hour') hour = stepExpr;
    else if (field === 'dayOfMonth') dayOfMonth = stepExpr;
    else if (field === 'month') month = stepExpr;
  }

  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

module.exports = { buildCronExpression };
