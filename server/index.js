require('dotenv').config(); // Secures variables
const app = require('./utils/app'); // Backend App (server)
const mongo = require('./utils/mongo'); // MongoDB (database)
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const authRoutes = require('./routes/auth');
const networkRoutes = require('./routes/network');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const courseRoutes = require('./routes/course');
const setupRoutes = require('./routes/setup');
const cors = require('cors');

const express = require('express'); // Import express
const path = require('path'); // Import path for static file serving


const PORT = process.env.PORT || 8080;

async function bootstrap() {
  // Connect to MongoDB
  await mongo.connect();

  // Create HTTP server
  const server = http.createServer(app);

  // Initialize Socket.IO with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"], // Add your frontend URLs
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join user's personal room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    // Handle incoming messages
    socket.on('send_message', async (messageData) => {
      try {
        // Create and save message to database
        const Message = require('./models/Message'); // Ensure you have a Message model
        const newMessage = new Message({
          sender: messageData.senderId,
          receiver: messageData.receiverId,
          content: messageData.content
        });

        await newMessage.save();

        // Emit message to receiver's room
        io.to(messageData.receiverId).emit('receive_message', {
          senderId: messageData.senderId,
          content: messageData.content,
          timestamp: new Date()
        });

        // Optionally, emit to sender for confirmation
        socket.emit('message_sent', { status: 'success' });
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Fetch message history
    socket.on('get_messages', async (data) => {
      try {
        const Message = require('./models/Message');
        const messages = await Message.find({
          $or: [
            { sender: data.userId, receiver: data.otherUserId },
            { sender: data.otherUserId, receiver: data.userId }
          ]
        }).sort({ timestamp: 1 });

        socket.emit('message_history', messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  app.use(cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));


  // Routes
  app.get('/', (req, res) => res.status(200).json({ message: 'Hello World!' }));
  app.get('/healthz', (req, res) => res.status(200).send());
  app.use('/auth', authRoutes);
  app.use('/network', networkRoutes);
  app.use('/sell/product',productRoutes);
  app.use('/order',orderRoutes);
  app.use('/sell/course', courseRoutes);
  app.use('/setup/', setupRoutes);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Start server
  server.listen(PORT, () => {
    console.log(`✅ Server is listening on port: ${PORT}`);
  });

  // Export io for potential use in other parts of the application
  module.exports = { io };
}

bootstrap().catch(console.error);