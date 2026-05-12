const { parse, parseTime } = require('./naturalLanguageParser');

describe('naturalLanguageParser', () => {
  describe('parse()', () => {
    it('throws if input is not a string', () => {
      expect(() => parse(null)).toThrow('Input must be a non-empty string');
      expect(() => parse(123)).toThrow('Input must be a non-empty string');
    });

    it('parses "every minute"', () => {
      expect(parse('every minute')).toBe('* * * * *');
    });

    it('parses "every hour"', () => {
      expect(parse('every hour')).toBe('0 * * * *');
    });

    it('parses "every day at midnight"', () => {
      expect(parse('every day at midnight')).toBe('0 0 * * *');
    });

    it('parses "every day at noon"', () => {
      expect(parse('every day at noon')).toBe('0 12 * * *');
    });

    it('parses "every 5 minutes"', () => {
      expect(parse('every 5 minutes')).toBe('*/5 * * * *');
    });

    it('parses "every 2 hours"', () => {
      expect(parse('every 2 hours')).toBe('0 */2 * * *');
    });

    it('parses "every day at 9am"', () => {
      expect(parse('every day at 9am')).toBe('0 9 * * *');
    });

    it('parses "every day at 3:30pm"', () => {
      expect(parse('every day at 3:30pm')).toBe('30 15 * * *');
    });

    it('parses "every monday at 8am"', () => {
      expect(parse('every monday at 8am')).toBe('0 8 * * 1');
    });

    it('parses "every friday at 5:00pm"', () => {
      expect(parse('every friday at 5:00pm')).toBe('0 17 * * 5');
    });

    it('parses "on the 1st of each month at 9am"', () => {
      expect(parse('on the 1st of each month at 9am')).toBe('0 9 1 * *');
    });

    it('parses "on the 15th of each month at 12:00pm"', () => {
      expect(parse('on the 15th of each month at 12:00pm')).toBe('0 12 15 * *');
    });

    it('throws for unrecognized input', () => {
      expect(() => parse('do something weird')).toThrow('Unable to parse schedule');
    });
  });

  describe('parseTime()', () => {
    it('parses 12-hour time with am', () => {
      expect(parseTime('9am')).toEqual({ hours: 9, minutes: 0 });
    });

    it('parses 12-hour time with pm', () => {
      expect(parseTime('3pm')).toEqual({ hours: 15, minutes: 0 });
    });

    it('parses time with minutes', () => {
      expect(parseTime('10:45am')).toEqual({ hours: 10, minutes: 45 });
    });

    it('handles midnight edge case (12am)', () => {
      expect(parseTime('12am')).toEqual({ hours: 0, minutes: 0 });
    });

    it('returns null for invalid time string', () => {
      expect(parseTime('noon')).toBeNull();
    });
  });
});
