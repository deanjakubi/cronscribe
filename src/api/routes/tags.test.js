const request = require('supertest');
const express = require('express');
const tagsRouter = require('./tags');
const { clearTags } = require('../../utils/cronTags');

const app = express();
app.use(express.json());
app.use('/tags', tagsRouter);

beforeEach(() => clearTags());

describe('GET /tags', () => {
  it('returns empty tags list initially', async () => {
    const res = await request(app).get('/tags');
    expect(res.status).toBe(200);
    expect(res.body.tags).toEqual([]);
  });

  it('returns tags after adding some', async () => {
    await request(app).post('/tags').send({ expressionId: 'e1', tag: 'daily' });
    const res = await request(app).get('/tags');
    expect(res.body.tags).toHaveLength(1);
    expect(res.body.tags[0].tag).toBe('daily');
  });
});

describe('GET /tags/:tag', () => {
  it('returns expression ids for a tag', async () => {
    await request(app).post('/tags').send({ expressionId: 'e1', tag: 'weekly' });
    const res = await request(app).get('/tags/weekly');
    expect(res.status).toBe(200);
    expect(res.body.expressionIds).toContain('e1');
  });

  it('returns empty array for unknown tag', async () => {
    const res = await request(app).get('/tags/unknown');
    expect(res.status).toBe(200);
    expect(res.body.expressionIds).toEqual([]);
  });
});

describe('GET /tags/expression/:id', () => {
  it('returns tags for a given expression id', async () => {
    await request(app).post('/tags').send({ expressionId: 'e2', tag: 'monthly' });
    const res = await request(app).get('/tags/expression/e2');
    expect(res.status).toBe(200);
    expect(res.body.tags).toContain('monthly');
  });
});

describe('POST /tags', () => {
  it('adds a tag successfully', async () => {
    const res = await request(app)
      .post('/tags')
      .send({ expressionId: 'e3', tag: 'backup' });
    expect(res.status).toBe(201);
    expect(res.body.tag).toBe('backup');
  });

  it('returns 400 if expressionId is missing', async () => {
    const res = await request(app).post('/tags').send({ tag: 'daily' });
    expect(res.status).toBe(400);
  });

  it('returns 400 if tag is missing', async () => {
    const res = await request(app).post('/tags').send({ expressionId: 'e1' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /tags', () => {
  it('removes a tag association', async () => {
    await request(app).post('/tags').send({ expressionId: 'e4', tag: 'hourly' });
    const res = await request(app)
      .delete('/tags')
      .send({ expressionId: 'e4', tag: 'hourly' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 if tag association not found', async () => {
    const res = await request(app)
      .delete('/tags')
      .send({ expressionId: 'e99', tag: 'ghost' });
    expect(res.status).toBe(404);
  });

  it('returns 400 if body fields are missing', async () => {
    const res = await request(app).delete('/tags').send({});
    expect(res.status).toBe(400);
  });
});
