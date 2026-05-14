const request = require('supertest');
const express = require('express');
const validateRoute = require('./validate');

const app = express();
app.use(express.json());
app.use('/validate', validateRoute);

describe('POST /validate', () => {
  it('should return valid for a correct cron expression', async () => {
    const res = await request(app)
      .post('/validate')
      .send({ expression: '0 9 * * 1-5' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.expression).toBe('0 9 * * 1-5');
  });

  it('should return invalid for a malformed cron expression', async () => {
    const res = await request(app)
      .post('/validate')
      .send({ expression: '99 99 99 99 99' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return 400 when expression is missing', async () => {
    const res = await request(app)
      .post('/validate')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should handle wildcard expressions', async () => {
    const res = await request(app)
      .post('/validate')
      .send({ expression: '* * * * *' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  it('should validate step expressions', async () => {
    const res = await request(app)
      .post('/validate')
      .send({ expression: '*/15 * * * *' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  it('should return human-readable description when valid', async () => {
    const res = await request(app)
      .post('/validate')
      .send({ expression: '0 12 * * *' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.description).toBeDefined();
  });
});
