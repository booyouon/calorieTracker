import request from 'supertest';
import app from '../app'; // Assuming your Express app is exported from this file

describe('GET /', () => {
  it('responds with "Hello, Express with Axios!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Express with Axios!');
  });
});