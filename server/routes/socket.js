const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Message Schema
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model('Message', MessageSchema);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join user's personal room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // Handle incoming messages
  socket.on('send_message', async (messageData) => {
    try {
      // Create and save message to database
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

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/networkapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});