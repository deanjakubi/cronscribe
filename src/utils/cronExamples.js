/**
 * cronExamples.js
 * Provides a curated set of common cron expression examples
 * with natural language descriptions and use cases.
 */

const EXAMPLES = [
  {
    id: 'every-minute',
    expression: '* * * * *',
    description: 'Every minute',
    naturalLanguage: 'every minute',
    category: 'frequent',
  },
  {
    id: 'every-5-minutes',
    expression: '*/5 * * * *',
    description: 'Every 5 minutes',
    naturalLanguage: 'every 5 minutes',
    category: 'frequent',
  },
  {
    id: 'every-hour',
    expression: '0 * * * *',
    description: 'Every hour at minute 0',
    naturalLanguage: 'every hour',
    category: 'hourly',
  },
  {
    id: 'every-day-midnight',
    expression: '0 0 * * *',
    description: 'Every day at midnight',
    naturalLanguage: 'every day at midnight',
    category: 'daily',
  },
  {
    id: 'every-day-noon',
    expression: '0 12 * * *',
    description: 'Every day at noon',
    naturalLanguage: 'every day at noon',
    category: 'daily',
  },
  {
    id: 'every-weekday',
    expression: '0 9 * * 1-5',
    description: 'Every weekday at 9:00 AM',
    naturalLanguage: 'every weekday at 9am',
    category: 'weekly',
  },
  {
    id: 'every-monday',
    expression: '0 0 * * 1',
    description: 'Every Monday at midnight',
    naturalLanguage: 'every monday at midnight',
    category: 'weekly',
  },
  {
    id: 'first-of-month',
    expression: '0 0 1 * *',
    description: 'First day of every month at midnight',
    naturalLanguage: 'first day of every month at midnight',
    category: 'monthly',
  },
  {
    id: 'every-january',
    expression: '0 0 1 1 *',
    description: 'Every January 1st at midnight',
    naturalLanguage: 'every january 1st at midnight',
    category: 'yearly',
  },
];

const CATEGORIES = ['frequent', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'];

function getAll() {
  return EXAMPLES;
}

function getByCategory(category) {
  if (!CATEGORIES.includes(category)) {
    return null;
  }
  return EXAMPLES.filter((ex) => ex.category === category);
}

function getById(id) {
  return EXAMPLES.find((ex) => ex.id === id) || null;
}

function getCategories() {
  return CATEGORIES;
}

module.exports = { getAll, getByCategory, getById, getCategories, CATEGORIES };
