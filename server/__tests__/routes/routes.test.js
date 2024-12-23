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

describe('Order Routes', () => {
  test('POST /orders should create a new order', async () => {
    const mockOrder = {
      userId: new mongoose.Types.ObjectId().toString(),
      items: [{
        id: '12345',
        name: 'Test Item',
        price: 99.99,
        quantity: 2
      }],
      date: new Date().toLocaleString(),
      total: 199.98
    };

    const res = await request(app)
      .post('/orders')
      .send(mockOrder);

    expect(res.statusCode).toBe(201);
  });

  test('GET /orders should fetch user orders', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get('/orders')
      .query({ userId });
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

describe('Product Routes', () => {

  const fs = require('fs');

// Function to log to a file
const logToFile = (data) => {
  fs.appendFileSync('logs.txt', `${new Date().toISOString()} - ${JSON.stringify(data, null, 2)}\n\n`);
};

test('GET /orders should fetch user orders', async () => {
  const mockOrder = {
    userId: new mongoose.Types.ObjectId().toString(),
    items: [{
      id: '12345',
      name: 'Test Item',
      price: 99.99,
      quantity: 2
    }],
    date: new Date().toLocaleString(),
    total: 199.98
  };

  // Log the sent order data to a file
  logToFile({ action: 'Sent Order Data', order: mockOrder });

  const createRes = await request(app)
    .post('/orders')
    .send(mockOrder);

  expect(createRes.statusCode).toBe(201);

  // Log the response data to a file
  logToFile({ action: 'Response After POST', response: createRes.body });

  const res = await request(app)
    .get('/orders')
    .query({ userId: mockOrder.userId });

  // Log the received data to a file
  logToFile({ action: 'Received Orders Data', response: res.body });

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBeTruthy();
  expect(res.body.length).toBeGreaterThan(0);

  const orderWithoutId = { ...res.body[0] };
  delete orderWithoutId._id;

  expect(orderWithoutId).toMatchObject({
    userId: mockOrder.userId,
    items: mockOrder.items,
    total: mockOrder.total,
    date: mockOrder.date
  });
});

  test('POST /products should create a new product', async () => {
    const mockProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99,
      category: 'textiles',
      image: null
    };

    const res = await request(app)
      .post('/products')
      .type('form')
      .send(mockProduct);
    
    expect(res.statusCode).toBe(201);
  });

  test('GET /products should fetch all products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.products)).toBeTruthy();
  });

  
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

  test('GET /auth/me should return the authenticated user', async () => {
    const mockUser = {
      username: 'existinguser',
      password: 'password123',
    };

    await request(app)
      .post('/auth/register')
      .send(mockUser);

    const resLogin = await request(app)
      .post('/auth/login')
      .send(mockUser);

    const token = resLogin.body.token;

    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', mockUser.username);
  });


  
});
