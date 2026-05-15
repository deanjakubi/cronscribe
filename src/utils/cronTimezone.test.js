const { convertTimezone, getSupportedTimezones, getOffsetHours } = require('./cronTimezone');

describe('cronTimezone', () => {
  describe('getSupportedTimezones', () => {
    it('returns an array of timezone strings', () => {
      const tzs = getSupportedTimezones();
      expect(Array.isArray(tzs)).toBe(true);
      expect(tzs).toContain('UTC');
      expect(tzs).toContain('US/Eastern');
      expect(tzs).toContain('Asia/Tokyo');
    });
  });

  describe('getOffsetHours', () => {
    it('returns 0 for UTC', () => {
      expect(getOffsetHours('UTC')).toBe(0);
    });

    it('returns correct offset for US/Eastern', () => {
      expect(getOffsetHours('US/Eastern')).toBe(-5);
    });

    it('throws for unsupported timezone', () => {
      expect(() => getOffsetHours('Mars/Olympus')).toThrow('Unsupported timezone');
    });
  });

  describe('convertTimezone', () => {
    it('returns same expression when timezones are equal', () => {
      expect(convertTimezone('0 9 * * *', 'UTC', 'UTC')).toBe('0 9 * * *');
    });

    it('shifts hour forward correctly', () => {
      const result = convertTimezone('0 9 * * *', 'UTC', 'Asia/Tokyo');
      expect(result).toBe('0 18 * * *');
    });

    it('shifts hour backward correctly', () => {
      const result = convertTimezone('0 9 * * *', 'UTC', 'US/Eastern');
      expect(result).toBe('0 4 * * *');
    });

    it('preserves wildcard minute and hour', () => {
      const result = convertTimezone('* * * * *', 'UTC', 'US/Pacific');
      expect(result).toBe('* * * * *');
    });

    it('preserves day, month, and weekday fields', () => {
      const result = convertTimezone('30 14 1 6 2', 'UTC', 'Europe/Paris');
      const parts = result.split(' ');
      expect(parts[2]).toBe('1');
      expect(parts[3]).toBe('6');
      expect(parts[4]).toBe('2');
    });

    it('throws on invalid expression', () => {
      expect(() => convertTimezone('bad expr', 'UTC', 'US/Eastern')).toThrow();
    });

    it('throws on unsupported timezone', () => {
      expect(() => convertTimezone('0 9 * * *', 'UTC', 'Fake/Zone')).toThrow('Unsupported timezone');
    });
  });
});
