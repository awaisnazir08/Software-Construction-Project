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
