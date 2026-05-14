/**
 * history.js
 * Express router for the /history endpoint.
 * Provides GET, DELETE (single), and DELETE (all) operations.
 */

const express = require('express');
const router = express.Router();
const { getEntries, getEntryById, deleteEntry, clearHistory } = require('../../utils/cronHistory');

/**
 * GET /history
 * Returns recent conversion history.
 * Query param: limit (default 10, max 50)
 */
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const entries = getEntries(limit);
  res.json({ success: true, count: entries.length, history: entries });
});

/**
 * GET /history/:id
 * Returns a single history entry by id.
 */
router.get('/:id', (req, res) => {
  const entry = getEntryById(req.params.id);
  if (!entry) {
    return res.status(404).json({ success: false, error: 'History entry not found.' });
  }
  res.json({ success: true, entry });
});

/**
 * DELETE /history/:id
 * Deletes a single history entry by id.
 */
router.delete('/:id', (req, res) => {
  const deleted = deleteEntry(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'History entry not found.' });
  }
  res.json({ success: true, message: 'Entry deleted.' });
});

/**
 * DELETE /history
 * Clears all history entries.
 */
router.delete('/', (req, res) => {
  clearHistory();
  res.json({ success: true, message: 'History cleared.' });
});

module.exports = router;
