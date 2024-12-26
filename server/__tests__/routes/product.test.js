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