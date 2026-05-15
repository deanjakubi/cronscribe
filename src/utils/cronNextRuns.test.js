const { parseCronFields, matchesField, getNextRuns } = require('./cronNextRuns');

describe('parseCronFields', () => {
  it('parses a standard cron expression into fields', () => {
    const fields = parseCronFields('0 9 * * 1-5');
    expect(fields).toEqual({ minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' });
  });

  it('throws for expressions with wrong field count', () => {
    expect(() => parseCronFields('* * *')).toThrow();
  });
});

describe('matchesField', () => {
  it('matches wildcard', () => {
    expect(matchesField('*', 5, 0, 59)).toBe(true);
  });

  it('matches exact value', () => {
    expect(matchesField('30', 30, 0, 59)).toBe(true);
    expect(matchesField('30', 15, 0, 59)).toBe(false);
  });

  it('matches range', () => {
    expect(matchesField('1-5', 3, 0, 7)).toBe(true);
    expect(matchesField('1-5', 6, 0, 7)).toBe(false);
  });

  it('matches step with wildcard', () => {
    expect(matchesField('*/15', 0, 0, 59)).toBe(true);
    expect(matchesField('*/15', 15, 0, 59)).toBe(true);
    expect(matchesField('*/15', 7, 0, 59)).toBe(false);
  });

  it('matches step with range', () => {
    expect(matchesField('0-30/10', 10, 0, 59)).toBe(true);
    expect(matchesField('0-30/10', 35, 0, 59)).toBe(false);
  });

  it('matches comma-separated list', () => {
    expect(matchesField('1,3,5', 3, 0, 7)).toBe(true);
    expect(matchesField('1,3,5', 4, 0, 7)).toBe(false);
  });
});

describe('getNextRuns', () => {
  it('returns the correct number of next runs', () => {
    const runs = getNextRuns('0 12 * * *', { count: 3 });
    expect(runs).toHaveLength(3);
  });

  it('returns Date objects', () => {
    const runs = getNextRuns('*/5 * * * *', { count: 2 });
    runs.forEach(r => expect(r).toBeInstanceOf(Date));
  });

  it('returns runs after fromDate', () => {
    const from = new Date('2025-06-01T00:00:00Z');
    const runs = getNextRuns('0 0 1 * *', { count: 2, fromDate: from });
    runs.forEach(r => expect(r.getTime()).toBeGreaterThan(from.getTime()));
  });

  it('each run is strictly after the previous', () => {
    const runs = getNextRuns('0 9 * * 1-5', { count: 5 });
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
    }
  });

  it('throws for invalid expression', () => {
    expect(() => getNextRuns('invalid', { count: 5 })).toThrow();
  });
});
