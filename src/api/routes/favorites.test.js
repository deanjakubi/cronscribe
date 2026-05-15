const request = require('supertest');
const express = require('express');
const favoritesRouter = require('./favorites');
const { clearFavorites } = require('../../utils/cronFavorites');

const app = express();
app.use(express.json());
app.use('/favorites', favoritesRouter);

beforeEach(() => {
  clearFavorites();
});

describe('GET /favorites', () => {
  it('should return empty list initially', async () => {
    const res = await request(app).get('/favorites');
    expect(res.status).toBe(200);
    expect(res.body.favorites).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it('should return all favorites', async () => {
    await request(app).post('/favorites').send({ expression: '* * * * *', label: 'Test' });
    const res = await request(app).get('/favorites');
    expect(res.body.count).toBe(1);
  });
});

describe('POST /favorites', () => {
  it('should create a favorite', async () => {
    const res = await request(app)
      .post('/favorites')
      .send({ expression: '0 9 * * 1', label: 'Monday 9am', description: 'Weekly' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.label).toBe('Monday 9am');
  });

  it('should return 400 if expression is missing', async () => {
    const res = await request(app).post('/favorites').send({ label: 'Test' });
    expect(res.status).toBe(400);
  });

  it('should return 400 if label is missing', async () => {
    const res = await request(app).post('/favorites').send({ expression: '* * * * *' });
    expect(res.status).toBe(400);
  });
});

describe('GET /favorites/:id', () => {
  it('should return a favorite by id', async () => {
    const created = await request(app).post('/favorites').send({ expression: '0 0 * * *', label: 'Midnight' });
    const res = await request(app).get(`/favorites/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.label).toBe('Midnight');
  });

  it('should return 404 for unknown id', async () => {
    const res = await request(app).get('/favorites/999');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /favorites/:id', () => {
  it('should update a favorite', async () => {
    const created = await request(app).post('/favorites').send({ expression: '* * * * *', label: 'Old Label' });
    const res = await request(app).patch(`/favorites/${created.body.id}`).send({ label: 'New Label' });
    expect(res.status).toBe(200);
    expect(res.body.label).toBe('New Label');
  });

  it('should return 404 for unknown id', async () => {
    const res = await request(app).patch('/favorites/999').send({ label: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /favorites/:id', () => {
  it('should delete a favorite', async () => {
    const created = await request(app).post('/favorites').send({ expression: '* * * * *', label: 'To Delete' });
    const res = await request(app).delete(`/favorites/${created.body.id}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 for unknown id', async () => {
    const res = await request(app).delete('/favorites/999');
    expect(res.status).toBe(404);
  });
});
