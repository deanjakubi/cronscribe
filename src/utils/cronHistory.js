/**
 * cronHistory.js
 * In-memory store for recent cron conversion history with basic CRUD operations.
 */

const MAX_HISTORY = 50;

let history = [];

/**
 * Add a new entry to the conversion history.
 * @param {string} input - Natural language input
 * @param {string} expression - Resulting cron expression
 * @param {string} description - Human-readable description
 * @returns {object} The created history entry
 */
function addEntry(input, expression, description) {
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    input,
    expression,
    description,
    createdAt: new Date().toISOString(),
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }
  return entry;
}

/**
 * Retrieve all history entries.
 * @param {number} limit - Max number of entries to return
 * @returns {object[]}
 */
function getEntries(limit = 10) {
  return history.slice(0, Math.min(limit, MAX_HISTORY));
}

/**
 * Find a history entry by id.
 * @param {string} id
 * @returns {object|undefined}
 */
function getEntryById(id) {
  return history.find((e) => e.id === id);
}

/**
 * Delete a history entry by id.
 * @param {string} id
 * @returns {boolean} True if deleted, false if not found
 */
function deleteEntry(id) {
  const index = history.findIndex((e) => e.id === id);
  if (index === -1) return false;
  history.splice(index, 1);
  return true;
}

/**
 * Clear all history entries.
 */
function clearHistory() {
  history = [];
}

module.exports = { addEntry, getEntries, getEntryById, deleteEntry, clearHistory };
