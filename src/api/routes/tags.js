// tags.js — REST API routes for cron expression tagging

const express = require('express');
const router = express.Router();
const {
  addTag,
  removeTag,
  getByTag,
  getTagsForExpression,
  getAllTags
} = require('../../utils/cronTags');

// GET /tags — list all tags with counts
router.get('/', (req, res) => {
  const tags = getAllTags();
  res.json({ tags });
});

// GET /tags/:tag — get expression ids for a tag
router.get('/:tag', (req, res) => {
  const { tag } = req.params;
  const ids = getByTag(tag);
  res.json({ tag: tag.toLowerCase(), expressionIds: ids });
});

// GET /tags/expression/:id — get tags for an expression
router.get('/expression/:id', (req, res) => {
  const tags = getTagsForExpression(req.params.id);
  res.json({ expressionId: req.params.id, tags });
});

// POST /tags — add a tag to an expression
router.post('/', (req, res) => {
  const { expressionId, tag } = req.body;
  if (!expressionId || !tag) {
    return res.status(400).json({ error: 'expressionId and tag are required' });
  }
  try {
    const result = addTag(expressionId, tag);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tags — remove a tag from an expression
router.delete('/', (req, res) => {
  const { expressionId, tag } = req.body;
  if (!expressionId || !tag) {
    return res.status(400).json({ error: 'expressionId and tag are required' });
  }
  const removed = removeTag(expressionId, tag);
  if (!removed) {
    return res.status(404).json({ error: 'Tag association not found' });
  }
  res.json({ success: true, expressionId, tag: tag.toLowerCase() });
});

module.exports = router;
