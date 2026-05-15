const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/convert', require('./routes/convert'));
app.use('/validate', require('./routes/validate'));
app.use('/history', require('./routes/history'));
app.use('/favorites', require('./routes/favorites'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: process.env.npm_package_version || '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode < 500 ? err.message : 'Internal server error';
  res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`cronscribe API listening on port ${PORT}`);
  });
}

module.exports = app;
