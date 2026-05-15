const request = require('supertest');
const express = require('express');
const diffRouter = require('./diff');

const app = express();
app.use(express.json());
app.use('/api/diff', diffRouter);

describe('POST /api/diff', () => {
  it('returns 400 if expressionA is missing', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionB: '0 10 * * *' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/expressionA/);
  });

  it('returns 400 if expressionB is missing', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionA: '0 9 * * *' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/expressionB/);
  });

  it('returns 400 for invalid expressionA', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionA: '99 9 * * *', expressionB: '0 9 * * *' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid expressionA/);
  });

  it('returns 400 for invalid expressionB', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionA: '0 9 * * *', expressionB: '0 99 * * *' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid expressionB/);
  });

  it('returns equivalent=true for identical expressions', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionA: '0 9 * * *', expressionB: '0 9 * * *' });
    expect(res.status).toBe(200);
    expect(res.body.equivalent).toBe(true);
    expect(res.body.differences).toHaveLength(0);
  });

  it('returns differences for distinct expressions', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionA: '0 9 * * 1', expressionB: '0 17 * * 5' });
    expect(res.status).toBe(200);
    expect(res.body.equivalent).toBe(false);
    expect(res.body.differences.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('descriptionA');
    expect(res.body).toHaveProperty('descriptionB');
  });

  it('includes correct field names in differences', async () => {
    const res = await request(app)
      .post('/api/diff')
      .send({ expressionA: '0 9 * * *', expressionB: '0 10 * * *' });
    expect(res.status).toBe(200);
    const fields = res.body.differences.map((d) => d.field);
    expect(fields).toContain('hour');
  });
});
