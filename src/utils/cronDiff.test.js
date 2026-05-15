const { parseCronFields, diffExpressions, areEquivalent } = require('./cronDiff');

describe('parseCronFields', () => {
  it('parses a valid cron expression into fields', () => {
    const fields = parseCronFields('0 9 * * 1');
    expect(fields).toEqual({
      minute: '0',
      hour: '9',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '1',
    });
  });

  it('throws on invalid expression', () => {
    expect(() => parseCronFields('0 9 *')).toThrow('Invalid cron expression');
  });

  it('handles complex expressions', () => {
    const fields = parseCronFields('*/15 0-6 1,15 * 1-5');
    expect(fields.minute).toBe('*/15');
    expect(fields.hour).toBe('0-6');
    expect(fields.dayOfMonth).toBe('1,15');
    expect(fields.dayOfWeek).toBe('1-5');
  });
});

describe('diffExpressions', () => {
  it('returns empty array for identical expressions', () => {
    expect(diffExpressions('0 9 * * 1', '0 9 * * 1')).toEqual([]);
  });

  it('detects a single field difference', () => {
    const diffs = diffExpressions('0 9 * * 1', '0 10 * * 1');
    expect(diffs).toHaveLength(1);
    expect(diffs[0]).toEqual({ field: 'hour', from: '9', to: '10' });
  });

  it('detects multiple field differences', () => {
    const diffs = diffExpressions('0 9 * * 1', '30 18 * * 5');
    expect(diffs).toHaveLength(3);
    const fields = diffs.map((d) => d.field);
    expect(fields).toContain('minute');
    expect(fields).toContain('hour');
    expect(fields).toContain('dayOfWeek');
  });

  it('detects wildcard vs value difference', () => {
    const diffs = diffExpressions('* * * * *', '0 0 * * *');
    expect(diffs).toHaveLength(2);
  });
});

describe('areEquivalent', () => {
  it('returns true for identical expressions', () => {
    expect(areEquivalent('0 0 * * *', '0 0 * * *')).toBe(true);
  });

  it('returns false for different expressions', () => {
    expect(areEquivalent('0 9 * * 1', '0 10 * * 1')).toBe(false);
  });

  it('returns true for wildcard expressions', () => {
    expect(areEquivalent('* * * * *', '* * * * *')).toBe(true);
  });
});
