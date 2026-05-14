const {
  addEntry,
  getEntries,
  getEntryById,
  deleteEntry,
  clearHistory,
} = require('./cronHistory');

beforeEach(() => {
  clearHistory();
});

describe('cronHistory', () => {
  describe('addEntry', () => {
    it('should add an entry and return it with an id and createdAt', () => {
      const entry = addEntry('every day at noon', '0 12 * * *', 'At 12:00 PM every day');
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('createdAt');
      expect(entry.input).toBe('every day at noon');
      expect(entry.expression).toBe('0 12 * * *');
      expect(entry.description).toBe('At 12:00 PM every day');
    });

    it('should prepend new entries so the latest is first', () => {
      addEntry('first', '* * * * *', 'every minute');
      addEntry('second', '0 0 * * *', 'midnight');
      const entries = getEntries();
      expect(entries[0].input).toBe('second');
      expect(entries[1].input).toBe('first');
    });
  });

  describe('getEntries', () => {
    it('should return an empty array when no history', () => {
      expect(getEntries()).toEqual([]);
    });

    it('should respect the limit parameter', () => {
      for (let i = 0; i < 5; i++) {
        addEntry(`input ${i}`, '* * * * *', 'every minute');
      }
      expect(getEntries(3)).toHaveLength(3);
    });
  });

  describe('getEntryById', () => {
    it('should return the correct entry by id', () => {
      const added = addEntry('every hour', '0 * * * *', 'At minute 0');
      const found = getEntryById(added.id);
      expect(found).toEqual(added);
    });

    it('should return undefined for unknown id', () => {
      expect(getEntryById('nonexistent')).toBeUndefined();
    });
  });

  describe('deleteEntry', () => {
    it('should delete an existing entry and return true', () => {
      const entry = addEntry('every minute', '* * * * *', 'every minute');
      expect(deleteEntry(entry.id)).toBe(true);
      expect(getEntryById(entry.id)).toBeUndefined();
    });

    it('should return false when entry not found', () => {
      expect(deleteEntry('ghost')).toBe(false);
    });
  });

  describe('clearHistory', () => {
    it('should remove all entries', () => {
      addEntry('a', '* * * * *', 'every minute');
      addEntry('b', '0 0 * * *', 'midnight');
      clearHistory();
      expect(getEntries()).toHaveLength(0);
    });
  });
});
