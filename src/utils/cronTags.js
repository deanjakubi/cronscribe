// cronTags.js — Tag management for cron expressions

let tags = {}; // { tagName: [expressionId, ...] }

function addTag(expressionId, tag) {
  if (!expressionId || !tag || typeof tag !== 'string') {
    throw new Error('expressionId and tag are required');
  }
  const normalized = tag.trim().toLowerCase();
  if (!normalized) throw new Error('Tag cannot be empty');
  if (!tags[normalized]) tags[normalized] = [];
  if (!tags[normalized].includes(expressionId)) {
    tags[normalized].push(expressionId);
  }
  return { tag: normalized, expressionId };
}

function removeTag(expressionId, tag) {
  const normalized = tag.trim().toLowerCase();
  if (!tags[normalized]) return false;
  const idx = tags[normalized].indexOf(expressionId);
  if (idx === -1) return false;
  tags[normalized].splice(idx, 1);
  if (tags[normalized].length === 0) delete tags[normalized];
  return true;
}

function getByTag(tag) {
  const normalized = tag.trim().toLowerCase();
  return tags[normalized] ? [...tags[normalized]] : [];
}

function getTagsForExpression(expressionId) {
  return Object.entries(tags)
    .filter(([, ids]) => ids.includes(expressionId))
    .map(([tag]) => tag);
}

function getAllTags() {
  return Object.keys(tags).map(tag => ({
    tag,
    count: tags[tag].length
  }));
}

function clearTags() {
  tags = {};
}

module.exports = {
  addTag,
  removeTag,
  getByTag,
  getTagsForExpression,
  getAllTags,
  clearTags
};
