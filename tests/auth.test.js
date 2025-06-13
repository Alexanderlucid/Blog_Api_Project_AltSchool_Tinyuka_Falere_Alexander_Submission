const request = require('supertest');
const app = require('../server'); // Optional if exporting app
const mongoose = require('mongoose');
const User = require('../models/User');

const baseURL = 'http://localhost:3000';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  const user = {
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@example.com',
    password: 'testpass123'
  };

  it('should sign up a new user', async () => {
    const res = await request(baseURL).post('/api/auth/signup').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in the user', async () => {
    const res = await request(baseURL).post('/api/auth/login').send({
      email: user.email,
      password: user.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
