const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Import routes
const courseRouter = require('../../routes/course');


// In-memory MongoDB server setup
let mongoServer;
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/courses', courseRouter);


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

describe('Course Routes', () => {
  test('POST /courses should create a new course', async () => {
    const mockCourse = {
      title: 'Test Course',
      description: 'Test Description',
      price: 99.99,
      duration: '1month',
      skillLevel: 'beginner'
    };

    const res = await request(app)
      .post('/courses')
      .type('form')
      .send(mockCourse);
    
    expect(res.statusCode).toBe(201);
  });

  test('GET /courses should fetch all courses', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.courses)).toBeTruthy();
  });
});