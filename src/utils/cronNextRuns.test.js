const { getNextRuns, matchesField } = require('./cronNextRuns');

describe('matchesField', () => {
  test('wildcard matches any value', () => {
    expect(matchesField(5, '*', 0, 59)).toBe(true);
    expect(matchesField(0, '*', 0, 59)).toBe(true);
  });

  test('exact value match', () => {
    expect(matchesField(5, '5', 0, 59)).toBe(true);
    expect(matchesField(6, '5', 0, 59)).toBe(false);
  });

  test('range match', () => {
    expect(matchesField(3, '1-5', 0, 59)).toBe(true);
    expect(matchesField(6, '1-5', 0, 59)).toBe(false);
  });

  test('list match', () => {
    expect(matchesField(15, '10,15,30', 0, 59)).toBe(true);
    expect(matchesField(20, '10,15,30', 0, 59)).toBe(false);
  });

  test('step match', () => {
    expect(matchesField(0, '*/15', 0, 59)).toBe(true);
    expect(matchesField(15, '*/15', 0, 59)).toBe(true);
    expect(matchesField(30, '*/15', 0, 59)).toBe(true);
    expect(matchesField(7, '*/15', 0, 59)).toBe(false);
  });

  test('step with start', () => {
    expect(matchesField(5, '5/10', 0, 59)).toBe(true);
    expect(matchesField(15, '5/10', 0, 59)).toBe(true);
    expect(matchesField(6, '5/10', 0, 59)).toBe(false);
  });
});

describe('getNextRuns', () => {
  const baseDate = new Date('2024-01-15T10:00:00Z');

  test('returns error for invalid expression', () => {
    const result = getNextRuns('invalid');
    expect(result.error).not.toBeNull();
    expect(result.runs).toHaveLength(0);
  });

  test('returns correct number of runs', () => {
    const result = getNextRuns('* * * * *', 5, baseDate);
    expect(result.error).toBeNull();
    expect(result.runs).toHaveLength(5);
  });

  test('every minute expression returns sequential minutes', () => {
    const result = getNextRuns('* * * * *', 3, baseDate);
    expect(result.runs[0].getMinutes()).toBe(1);
    expect(result.runs[1].getMinutes()).toBe(2);
    expect(result.runs[2].getMinutes()).toBe(3);
  });

  test('specific minute expression', () => {
    const from = new Date('2024-01-15T10:00:00Z');
    const result = getNextRuns('30 * * * *', 2, from);
    expect(result.error).toBeNull();
    expect(result.runs[0].getMinutes()).toBe(30);
    expect(result.runs[1].getMinutes()).toBe(30);
    expect(result.runs[0].getHours()).not.toBe(result.runs[1].getHours());
  });

  test('defaults count to 5', () => {
    const result = getNextRuns('* * * * *', undefined, baseDate);
    expect(result.runs).toHaveLength(5);
  });

  test('returns Date objects', () => {
    const result = getNextRuns('0 12 * * *', 1, baseDate);
    expect(result.runs[0]).toBeInstanceOf(Date);
  });
});
