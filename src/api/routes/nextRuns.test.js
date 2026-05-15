const request = require('supertest');
const express = require('express');
const nextRunsRouter = require('./nextRuns');

const app = express();
app.use(express.json());
app.use('/next-runs', nextRunsRouter);

describe('POST /next-runs', () => {
  it('returns next runs for a valid cron expression', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: '0 9 * * 1-5' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('expression', '0 9 * * 1-5');
    expect(res.body).toHaveProperty('nextRuns');
    expect(Array.isArray(res.body.nextRuns)).toBe(true);
    expect(res.body.nextRuns.length).toBeGreaterThan(0);
  });

  it('respects custom count parameter', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: '*/15 * * * *', count: 3 });
    expect(res.status).toBe(200);
    expect(res.body.nextRuns).toHaveLength(3);
  });

  it('respects custom fromDate parameter', async () => {
    const fromDate = '2025-01-01T00:00:00.000Z';
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: '0 0 1 * *', fromDate, count: 2 });
    expect(res.status).toBe(200);
    expect(res.body.nextRuns.length).toBe(2);
    res.body.nextRuns.forEach(dateStr => {
      expect(new Date(dateStr).getTime()).toBeGreaterThanOrEqual(new Date(fromDate).getTime());
    });
  });

  it('returns 400 for missing expression', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid cron expression', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: 'not a cron' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid count (too large)', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: '* * * * *', count: 1000 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid fromDate', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: '0 12 * * *', fromDate: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('defaults count to 5 when not provided', async () => {
    const res = await request(app)
      .post('/next-runs')
      .send({ expression: '0 0 * * *' });
    expect(res.status).toBe(200);
    expect(res.body.nextRuns).toHaveLength(5);
  });
});
