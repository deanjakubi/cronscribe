const request = require('supertest');
const express = require('express');
const historyRouter = require('./history');
const { addEntry, clearHistory } = require('../../utils/cronHistory');

const app = express();
app.use(express.json());
app.use('/history', historyRouter);

beforeEach(() => {
  clearHistory();
});

describe('GET /history', () => {
  it('should return empty history initially', async () => {
    const res = await request(app).get('/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.history).toEqual([]);
  });

  it('should return added entries', async () => {
    addEntry('every day at noon', '0 12 * * *', 'At 12:00 PM');
    const res = await request(app).get('/history');
    expect(res.body.count).toBe(1);
    expect(res.body.history[0].input).toBe('every day at noon');
  });

  it('should respect the limit query parameter', async () => {
    for (let i = 0; i < 5; i++) addEntry(`input ${i}`, '* * * * *', 'every minute');
    const res = await request(app).get('/history?limit=2');
    expect(res.body.history).toHaveLength(2);
  });
});

describe('GET /history/:id', () => {
  it('should return a specific entry by id', async () => {
    const entry = addEntry('every hour', '0 * * * *', 'At minute 0');
    const res = await request(app).get(`/history/${entry.id}`);
    expect(res.status).toBe(200);
    expect(res.body.entry.id).toBe(entry.id);
  });

  it('should return 404 for unknown id', async () => {
    const res = await request(app).get('/history/unknown-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /history/:id', () => {
  it('should delete an existing entry', async () => {
    const entry = addEntry('every minute', '* * * * *', 'every minute');
    const res = await request(app).delete(`/history/${entry.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 when deleting non-existent entry', async () => {
    const res = await request(app).delete('/history/ghost');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /history', () => {
  it('should clear all history', async () => {
    addEntry('a', '* * * * *', 'every minute');
    addEntry('b', '0 0 * * *', 'midnight');
    const res = await request(app).delete('/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const check = await request(app).get('/history');
    expect(check.body.history).toHaveLength(0);
  });
});
