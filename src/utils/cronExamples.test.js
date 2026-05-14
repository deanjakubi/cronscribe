const {
  getAll,
  getByCategory,
  getById,
  getCategories,
  CATEGORIES,
} = require('./cronExamples');

describe('cronExamples', () => {
  describe('getAll', () => {
    it('should return an array of examples', () => {
      const examples = getAll();
      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
    });

    it('each example should have required fields', () => {
      const examples = getAll();
      examples.forEach((ex) => {
        expect(ex).toHaveProperty('id');
        expect(ex).toHaveProperty('expression');
        expect(ex).toHaveProperty('description');
        expect(ex).toHaveProperty('naturalLanguage');
        expect(ex).toHaveProperty('category');
      });
    });
  });

  describe('getByCategory', () => {
    it('should return examples for a valid category', () => {
      const results = getByCategory('daily');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((ex) => expect(ex.category).toBe('daily'));
    });

    it('should return null for an invalid category', () => {
      const results = getByCategory('nonexistent');
      expect(results).toBeNull();
    });

    it('should return weekly examples', () => {
      const results = getByCategory('weekly');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should return a specific example by id', () => {
      const example = getById('every-minute');
      expect(example).not.toBeNull();
      expect(example.expression).toBe('* * * * *');
      expect(example.id).toBe('every-minute');
    });

    it('should return null for unknown id', () => {
      const example = getById('does-not-exist');
      expect(example).toBeNull();
    });

    it('should return the correct expression for every-hour', () => {
      const example = getById('every-hour');
      expect(example.expression).toBe('0 * * * *');
    });
  });

  describe('getCategories', () => {
    it('should return an array of category strings', () => {
      const cats = getCategories();
      expect(Array.isArray(cats)).toBe(true);
      expect(cats).toContain('daily');
      expect(cats).toContain('weekly');
    });

    it('should match the exported CATEGORIES constant', () => {
      expect(getCategories()).toEqual(CATEGORIES);
    });
  });
});
