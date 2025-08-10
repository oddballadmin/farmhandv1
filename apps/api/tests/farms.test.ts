import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';

describe('farms', () => {
  const app = createApp();

  it('lists default seed', async () => {
    const res = await request(app).get('/api/farms');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('creates a farm', async () => {
    const res = await request(app).post('/api/farms').send({ name: 'New Farm', location: 'Hills' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New Farm');
  });
});
