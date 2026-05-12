const { validateExpression, validateField } = require('./expressionValidator');

describe('validateField', () => {
  test('accepts wildcard for any field', () => {
    expect(validateField('*', 'minute')).toEqual({ valid: true });
  });

  test('accepts valid numeric values within range', () => {
    expect(validateField('30', 'minute')).toEqual({ valid: true });
    expect(validateField('23', 'hour')).toEqual({ valid: true });
    expect(validateField('12', 'month')).toEqual({ valid: true });
  });

  test('rejects values out of range', () => {
    expect(validateField('60', 'minute').valid).toBe(false);
    expect(validateField('24', 'hour').valid).toBe(false);
    expect(validateField('0', 'dayOfMonth').valid).toBe(false);
    expect(validateField('13', 'month').valid).toBe(false);
  });

  test('accepts valid range expressions', () => {
    expect(validateField('1-5', 'dayOfWeek')).toEqual({ valid: true });
    expect(validateField('6-12', 'month')).toEqual({ valid: true });
  });

  test('rejects invalid range expressions', () => {
    expect(validateField('5-1', 'minute').valid).toBe(false);
    expect(validateField('0-60', 'minute').valid).toBe(false);
  });

  test('accepts step expressions', () => {
    expect(validateField('*/15', 'minute')).toEqual({ valid: true });
    expect(validateField('0-12/2', 'hour')).toEqual({ valid: true });
  });

  test('rejects invalid step values', () => {
    expect(validateField('*/0', 'minute').valid).toBe(false);
    expect(validateField('*/abc', 'hour').valid).toBe(false);
  });

  test('accepts list expressions', () => {
    expect(validateField('1,15,30,45', 'minute')).toEqual({ valid: true });
    expect(validateField('mon,wed,fri', 'dayOfWeek')).toEqual({ valid: true });
  });

  test('accepts month and day-of-week aliases', () => {
    expect(validateField('jan', 'month')).toEqual({ valid: true });
    expect(validateField('dec', 'month')).toEqual({ valid: true });
    expect(validateField('sun', 'dayOfWeek')).toEqual({ valid: true });
    expect(validateField('sat', 'dayOfWeek')).toEqual({ valid: true });
  });
});

describe('validateExpression', () => {
  test('validates a correct cron expression', () => {
    expect(validateExpression('0 9 * * 1-5')).toEqual({ valid: true });
    expect(validateExpression('*/15 * * * *')).toEqual({ valid: true });
    expect(validateExpression('0 0 1 1 *')).toEqual({ valid: true });
  });

  test('rejects expressions with wrong number of fields', () => {
    expect(validateExpression('* * * *').valid).toBe(false);
    expect(validateExpression('* * * * * *').valid).toBe(false);
  });

  test('rejects empty or non-string input', () => {
    expect(validateExpression('').valid).toBe(false);
    expect(validateExpression(null).valid).toBe(false);
    expect(validateExpression(42).valid).toBe(false);
  });

  test('returns descriptive error messages', () => {
    const result = validateExpression('60 * * * *');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/minute/);
  });

  test('rejects expressions with out-of-range fields', () => {
    expect(validateExpression('0 25 * * *').valid).toBe(false);
    expect(validateExpression('0 0 32 * *').valid).toBe(false);
  });
});
