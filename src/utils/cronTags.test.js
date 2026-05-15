const {
  addTag,
  removeTag,
  getByTag,
  getTagsForExpression,
  getAllTags,
  clearTags
} = require('./cronTags');

beforeEach(() => clearTags());

describe('addTag', () => {
  it('adds a tag for an expression id', () => {
    const result = addTag('expr-1', 'daily');
    expect(result).toEqual({ tag: 'daily', expressionId: 'expr-1' });
  });

  it('normalizes tag to lowercase', () => {
    const result = addTag('expr-1', 'Daily');
    expect(result.tag).toBe('daily');
  });

  it('does not duplicate expression ids under same tag', () => {
    addTag('expr-1', 'daily');
    addTag('expr-1', 'daily');
    expect(getByTag('daily')).toHaveLength(1);
  });

  it('throws if expressionId is missing', () => {
    expect(() => addTag(null, 'daily')).toThrow();
  });

  it('throws if tag is empty string', () => {
    expect(() => addTag('expr-1', '   ')).toThrow();
  });
});

describe('removeTag', () => {
  it('removes a tag association', () => {
    addTag('expr-1', 'daily');
    const result = removeTag('expr-1', 'daily');
    expect(result).toBe(true);
    expect(getByTag('daily')).toHaveLength(0);
  });

  it('returns false if tag does not exist', () => {
    expect(removeTag('expr-1', 'nonexistent')).toBe(false);
  });

  it('deletes tag key when no expressions remain', () => {
    addTag('expr-1', 'daily');
    removeTag('expr-1', 'daily');
    expect(getAllTags().find(t => t.tag === 'daily')).toBeUndefined();
  });
});

describe('getByTag', () => {
  it('returns expression ids for a tag', () => {
    addTag('expr-1', 'weekly');
    addTag('expr-2', 'weekly');
    expect(getByTag('weekly')).toEqual(['expr-1', 'expr-2']);
  });

  it('returns empty array for unknown tag', () => {
    expect(getByTag('unknown')).toEqual([]);
  });
});

describe('getTagsForExpression', () => {
  it('returns all tags for a given expression', () => {
    addTag('expr-1', 'daily');
    addTag('expr-1', 'work');
    const result = getTagsForExpression('expr-1');
    expect(result).toContain('daily');
    expect(result).toContain('work');
  });

  it('returns empty array if expression has no tags', () => {
    expect(getTagsForExpression('expr-99')).toEqual([]);
  });
});

describe('getAllTags', () => {
  it('returns all tags with counts', () => {
    addTag('expr-1', 'daily');
    addTag('expr-2', 'daily');
    addTag('expr-3', 'weekly');
    const all = getAllTags();
    const daily = all.find(t => t.tag === 'daily');
    expect(daily.count).toBe(2);
  });
});
