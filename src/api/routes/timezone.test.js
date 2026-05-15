const request = require('supertest');
const express = require('express');
const timezoneRouter = require('./timezone');

const app = express();
app.use(express.json());
app.use('/api/timezone', timezoneRouter);

describe('GET /api/timezone/list', () => {
  it('returns a list of supported timezones', async () => {
    const res = await request(app).get('/api/timezone/list');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.timezones)).toBe(true);
    expect(res.body.timezones).toContain('UTC');
    expect(res.body.timezones.length).toBeGreaterThan(5);
  });
});

describe('POST /api/timezone/convert', () => {
  it('converts a cron expression between timezones', async () => {
    const res = await request(app).post('/api/timezone/convert').send({
      expression: '0 9 * * *',
      fromTimezone: 'UTC',
      toTimezone: 'Asia/Tokyo',
    });
    expect(res.status).toBe(200);
    expect(res.body.original).toBe('0 9 * * *');
    expect(res.body.converted).toBe('0 18 * * *');
    expect(res.body.fromTimezone).toBe('UTC');
    expect(res.body.toTimezone).toBe('Asia/Tokyo');
  });

  it('returns 400 when expression is missing', async () => {
    const res = await request(app).post('/api/timezone/convert').send({
      fromTimezone: 'UTC',
      toTimezone: 'US/Eastern',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/expression is required/);
  });

  it('returns 400 when fromTimezone is missing', async () => {
    const res = await request(app).post('/api/timezone/convert').send({
      expression: '0 9 * * *',
      toTimezone: 'US/Eastern',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/fromTimezone is required/);
  });

  it('returns 400 when toTimezone is missing', async () => {
    const res = await request(app).post('/api/timezone/convert').send({
      expression: '0 9 * * *',
      fromTimezone: 'UTC',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/toTimezone is required/);
  });

  it('returns 400 for unsupported timezone', async () => {
    const res = await request(app).post('/api/timezone/convert').send({
      expression: '0 9 * * *',
      fromTimezone: 'UTC',
      toTimezone: 'Fake/Zone',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Unsupported timezone/);
  });

  it('returns same expression when timezones match', async () => {
    const res = await request(app).post('/api/timezone/convert').send({
      expression: '30 6 * * 1',
      fromTimezone: 'UTC',
      toTimezone: 'UTC',
    });
    expect(res.status).toBe(200);
    expect(res.body.converted).toBe('30 6 * * 1');
  });
});
