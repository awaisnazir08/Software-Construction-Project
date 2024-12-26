const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Import routes
const authRouter = require('../../routes/auth');
const courseRouter = require('../../routes/course');
const orderRouter = require('../../routes/order');
const productRouter = require('../../routes/product');

// In-memory MongoDB server setup
let mongoServer;
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/auth', authRouter);
app.use('/courses', courseRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);

// Setup MongoDB memory server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
});

// Cleanup MongoDB memory server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


// Auth Tests
describe('Auth Routes', () => {
  test('POST /auth/register should create a new user', async () => {
    const mockUser = {
      username: 'newuser',
      password: 'password123',
    };

    const res = await request(app)
      .post('/auth/register')
      .send(mockUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.username).toBe(mockUser.username);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /auth/login should authenticate a user and return a token', async () => {
    const mockUser = {
      username: 'existinguser',
      password: 'password123',
    };

    await request(app)
      .post('/auth/register')
      .send(mockUser);

    const res = await request(app)
      .post('/auth/login')
      .send(mockUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.data.username).toBe(mockUser.username);
  });



});
