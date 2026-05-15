const express = require('express');
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  getFavoriteById,
  updateFavorite,
  deleteFavorite,
} = require('../../utils/cronFavorites');

// GET /favorites
router.get('/', (req, res) => {
  const all = getFavorites();
  res.json({ favorites: all, count: all.length });
});

// GET /favorites/:id
router.get('/:id', (req, res) => {
  const entry = getFavoriteById(req.params.id);
  if (!entry) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.json(entry);
});

// POST /favorites
router.post('/', (req, res) => {
  const { expression, label, description } = req.body;

  if (!expression || !label) {
    return res.status(400).json({ error: 'expression and label are required' });
  }

  try {
    const entry = addFavorite({ expression, label, description });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /favorites/:id
router.patch('/:id', (req, res) => {
  const { label, description, expression } = req.body;
  const updated = updateFavorite(req.params.id, { label, description, expression });
  if (!updated) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.json(updated);
});

// DELETE /favorites/:id
router.delete('/:id', (req, res) => {
  const deleted = deleteFavorite(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.status(204).send();
});

module.exports = router;
