const {
  addFavorite,
  getFavorites,
  getFavoriteById,
  updateFavorite,
  deleteFavorite,
  clearFavorites,
} = require('./cronFavorites');

beforeEach(() => {
  clearFavorites();
});

describe('addFavorite', () => {
  it('should add a favorite and return it with an id', () => {
    const fav = addFavorite({ expression: '0 9 * * 1', label: 'Weekly Monday', description: 'Every Monday at 9am' });
    expect(fav).toHaveProperty('id');
    expect(fav.expression).toBe('0 9 * * 1');
    expect(fav.label).toBe('Weekly Monday');
    expect(fav).toHaveProperty('createdAt');
  });

  it('should throw if expression is missing', () => {
    expect(() => addFavorite({ label: 'test' })).toThrow('expression is required');
  });

  it('should throw if label is missing', () => {
    expect(() => addFavorite({ expression: '* * * * *' })).toThrow('label is required');
  });
});

describe('getFavorites', () => {
  it('should return all favorites', () => {
    addFavorite({ expression: '* * * * *', label: 'Every minute' });
    addFavorite({ expression: '0 0 * * *', label: 'Daily midnight' });
    expect(getFavorites()).toHaveLength(2);
  });

  it('should return empty array when no favorites', () => {
    expect(getFavorites()).toEqual([]);
  });
});

describe('getFavoriteById', () => {
  it('should return a favorite by id', () => {
    const fav = addFavorite({ expression: '0 12 * * *', label: 'Noon daily' });
    expect(getFavoriteById(fav.id)).toEqual(fav);
  });

  it('should return null for unknown id', () => {
    expect(getFavoriteById('999')).toBeNull();
  });
});

describe('updateFavorite', () => {
  it('should update label and description', () => {
    const fav = addFavorite({ expression: '0 6 * * *', label: 'Morning' });
    const updated = updateFavorite(fav.id, { label: 'Early Morning', description: 'Updated' });
    expect(updated.label).toBe('Early Morning');
    expect(updated.description).toBe('Updated');
    expect(updated).toHaveProperty('updatedAt');
  });

  it('should return null for unknown id', () => {
    expect(updateFavorite('999', { label: 'x' })).toBeNull();
  });
});

describe('deleteFavorite', () => {
  it('should delete a favorite by id', () => {
    const fav = addFavorite({ expression: '* * * * *', label: 'Test' });
    expect(deleteFavorite(fav.id)).toBe(true);
    expect(getFavoriteById(fav.id)).toBeNull();
  });

  it('should return false for unknown id', () => {
    expect(deleteFavorite('999')).toBe(false);
  });
});
