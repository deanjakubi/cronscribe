/**
 * Validates cron expressions for correctness
 */

const FIELD_RANGES = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 },
};

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

const MONTH_ALIASES = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const DOW_ALIASES = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

function resolveAlias(value, aliases) {
  const lower = value.toLowerCase();
  return aliases[lower] !== undefined ? String(aliases[lower]) : value;
}

function validateField(field, fieldName) {
  const { min, max } = FIELD_RANGES[fieldName];
  const aliases = fieldName === 'month' ? MONTH_ALIASES : fieldName === 'dayOfWeek' ? DOW_ALIASES : {};

  if (field === '*') return { valid: true };

  // Handle step values e.g. */5 or 1-5/2
  if (field.includes('/')) {
    const [range, step] = field.split('/');
    const stepNum = parseInt(step, 10);
    if (isNaN(stepNum) || stepNum < 1) {
      return { valid: false, error: `Invalid step value in field '${fieldName}': ${field}` };
    }
    if (range !== '*') {
      const rangeResult = validateField(range, fieldName);
      if (!rangeResult.valid) return rangeResult;
    }
    return { valid: true };
  }

  // Handle lists e.g. 1,2,3
  if (field.includes(',')) {
    for (const part of field.split(',')) {
      const result = validateField(part.trim(), fieldName);
      if (!result.valid) return result;
    }
    return { valid: true };
  }

  // Handle ranges e.g. 1-5
  if (field.includes('-')) {
    const [startRaw, endRaw] = field.split('-');
    const start = parseInt(resolveAlias(startRaw, aliases), 10);
    const end = parseInt(resolveAlias(endRaw, aliases), 10);
    if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
      return { valid: false, error: `Invalid range in field '${fieldName}': ${field}` };
    }
    return { valid: true };
  }

  // Handle plain values
  const resolved = resolveAlias(field, aliases);
  const num = parseInt(resolved, 10);
  if (isNaN(num) || num < min || num > max) {
    return { valid: false, error: `Value out of range in field '${fieldName}': ${field} (expected ${min}-${max})` };
  }

  return { valid: true };
}

function validateExpression(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    return { valid: false, error: 'Expression must be a non-empty string' };
  }

  const fields = expression.trim().split(/\s+/);

  if (fields.length !== 5) {
    return { valid: false, error: `Expected 5 fields, got ${fields.length}` };
  }

  for (let i = 0; i < fields.length; i++) {
    const result = validateField(fields[i], FIELD_NAMES[i]);
    if (!result.valid) return result;
  }

  return { valid: true };
}

module.exports = { validateExpression, validateField, FIELD_RANGES };
