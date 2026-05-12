const request = require('supertest');
const express = require('express');
const convertRouter = require('./convert');

jest.mock('../../parser/naturalLanguageParser', () => ({
  parse: jest.fn()
}));

jest.mock('../../converter/cronBuilder', () => ({
  buildCronExpression: jest.fn()
}));

const { parse } = require('../../parser/naturalLanguageParser');
const { buildCronExpression } = require('../../converter/cronBuilder');

const app = express();
app.use(express.json());
app.use('/api', convertRouter);

describe('POST /api/convert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when expression is missing', async () => {
    const res = await request(app).post('/api/convert').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/expression/);
  });

  it('returns 400 when expression is not a string', async () => {
    const res = await request(app).post('/api/convert').send({ expression: 42 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when expression is blank', async () => {
    const res = await request(app).post('/api/convert').send({ expression: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/blank/);
  });

  it('returns 400 when expression exceeds 256 characters', async () => {
    const long = 'a'.repeat(257);
    const res = await request(app).post('/api/convert').send({ expression: long });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/256/);
  });

  it('returns 422 when parser cannot understand the expression', async () => {
    parse.mockReturnValue(null);
    const res = await request(app).post('/api/convert').send({ expression: 'gibberish schedule' });
    expect(res.status).toBe(422);
    expect(res.body.error).toMatch(/Could not understand/);
  });

  it('returns 200 with cron expression on success', async () => {
    parse.mockReturnValue({ minute: 0, hour: 9, dayOfMonth: '*', month: '*', dayOfWeek: '*' });
    buildCronExpression.mockReturnValue('0 9 * * *');

    const res = await request(app).post('/api/convert').send({ expression: 'every day at 9am' });
    expect(res.status).toBe(200);
    expect(res.body.cron).toBe('0 9 * * *');
    expect(res.body.description).toBe('every day at 9am');
  });

  it('returns 500 when an unexpected error is thrown', async () => {
    parse.mockImplementation(() => { throw new Error('unexpected'); });
    const res = await request(app).post('/api/convert').send({ expression: 'every hour' });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Internal server error/);
  });
});
