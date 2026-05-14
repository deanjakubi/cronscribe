const { describe } = require('./cronDescriber');

describe('cronDescriber', () => {
  describe('describe()', () => {
    it('should describe a wildcard expression', () => {
      const result = describe('* * * * *');
      expect(result).toMatch(/every minute/i);
    });

    it('should describe a step-based minute expression', () => {
      const result = describe('*/15 * * * *');
      expect(result).toMatch(/every 15 minutes/i);
    });

    it('should describe a specific time each day', () => {
      const result = describe('0 9 * * *');
      expect(result).toMatch(/9/i);
    });

    it('should describe a weekday range', () => {
      const result = describe('0 9 * * 1-5');
      expect(result).toMatch(/monday/i);
      expect(result).toMatch(/friday/i);
    });

    it('should describe a specific day of month', () => {
      const result = describe('0 0 1 * *');
      expect(result).toMatch(/day 1/i);
    });

    it('should describe a specific month', () => {
      const result = describe('0 0 1 6 *');
      expect(result).toMatch(/june/i);
    });

    it('should return error message for invalid part count', () => {
      const result = describe('0 9 *');
      expect(result).toMatch(/invalid/i);
    });

    it('should describe noon daily', () => {
      const result = describe('0 12 * * *');
      expect(result).toMatch(/12/i);
    });
  });
});
