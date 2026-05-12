const { buildCronExpression } = require('./cronBuilder');

describe('buildCronExpression', () => {
  test('returns wildcard expression when schedule is empty', () => {
    expect(buildCronExpression({})).toBe('* * * * *');
  });

  test('sets minute field correctly', () => {
    expect(buildCronExpression({ minute: 30 })).toBe('30 * * * *');
  });

  test('sets hour and minute fields correctly', () => {
    expect(buildCronExpression({ minute: 0, hour: 9 })).toBe('0 9 * * *');
  });

  test('sets dayOfWeek field correctly (0 = Sunday)', () => {
    expect(buildCronExpression({ minute: 0, hour: 8, dayOfWeek: 1 })).toBe('0 8 * * 1');
  });

  test('sets all five fields correctly', () => {
    const schedule = { minute: 15, hour: 14, dayOfMonth: 1, month: 6, dayOfWeek: 3 };
    expect(buildCronExpression(schedule)).toBe('15 14 1 6 3');
  });

  test('handles step on minute field (every N minutes)', () => {
    expect(buildCronExpression({ step: { field: 'minute', value: 15 } })).toBe('*/15 * * * *');
  });

  test('handles step on hour field', () => {
    expect(buildCronExpression({ step: { field: 'hour', value: 2 } })).toBe('* */2 * * *');
  });

  test('throws RangeError for out-of-range minute', () => {
    expect(() => buildCronExpression({ minute: 60 })).toThrow(RangeError);
  });

  test('throws RangeError for out-of-range hour', () => {
    expect(() => buildCronExpression({ hour: 24 })).toThrow(RangeError);
  });

  test('throws RangeError for out-of-range dayOfWeek', () => {
    expect(() => buildCronExpression({ dayOfWeek: 7 })).toThrow(RangeError);
  });

  test('throws RangeError for out-of-range month', () => {
    expect(() => buildCronExpression({ month: 13 })).toThrow(RangeError);
  });

  test('throws TypeError when schedule is null', () => {
    expect(() => buildCronExpression(null)).toThrow(TypeError);
  });

  test('throws TypeError when schedule is not an object', () => {
    expect(() => buildCronExpression('every day')).toThrow(TypeError);
  });
});
