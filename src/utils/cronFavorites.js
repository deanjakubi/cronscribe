const favorites = new Map();

let nextId = 1;

function addFavorite({ expression, description, label }) {
  if (!expression || typeof expression !== 'string') {
    throw new Error('expression is required and must be a string');
  }
  if (!label || typeof label !== 'string') {
    throw new Error('label is required and must be a string');
  }

  const id = String(nextId++);
  const entry = {
    id,
    expression: expression.trim(),
    description: description || '',
    label: label.trim(),
    createdAt: new Date().toISOString(),
  };

  favorites.set(id, entry);
  return entry;
}

function getFavorites() {
  return Array.from(favorites.values());
}

function getFavoriteById(id) {
  return favorites.get(String(id)) || null;
}

function updateFavorite(id, updates) {
  const entry = favorites.get(String(id));
  if (!entry) return null;

  const updated = {
    ...entry,
    ...(updates.label !== undefined ? { label: updates.label.trim() } : {}),
    ...(updates.description !== undefined ? { description: updates.description } : {}),
    ...(updates.expression !== undefined ? { expression: updates.expression.trim() } : {}),
    updatedAt: new Date().toISOString(),
  };

  favorites.set(String(id), updated);
  return updated;
}

function deleteFavorite(id) {
  return favorites.delete(String(id));
}

function clearFavorites() {
  favorites.clear();
  nextId = 1;
}

module.exports = {
  addFavorite,
  getFavorites,
  getFavoriteById,
  updateFavorite,
  deleteFavorite,
  clearFavorites,
};
