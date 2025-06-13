const request = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');

const baseURL = 'http://localhost:3000';

let token = '';
let blogId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Create and login user
  const user = {
    first_name: 'Blog',
    last_name: 'Tester',
    email: 'blogtester@example.com',
    password: 'password'
  };

  await request(baseURL).post('/api/auth/signup').send(user);
  const res = await request(baseURL).post('/api/auth/login').send({
    email: user.email,
    password: user.password
  });
  token = res.body.token;
});

afterAll(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Blog Routes', () => {
  it('should create a blog in draft state', async () => {
    const res = await request(baseURL)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        description: 'A blog test',
        body: 'This is a test blog body',
        tags: ['test', 'blog']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.blog).toHaveProperty('title', 'Test Blog');
    blogId = res.body.blog._id;
  });

  it('should publish the blog', async () => {
    const res = await request(baseURL)
      .patch(`/api/blogs/${blogId}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.blog.state).toBe('published');
  });

  it('should retrieve published blog', async () => {
    const res = await request(baseURL).get(`/api/blogs/${blogId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Blog');
  });
});
