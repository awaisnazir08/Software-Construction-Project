const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { User } = require('../models/Account');
const { Conversation, Message } = require('../routes/chat');

class ChatServer {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ["GET", "POST"]
      }
    });

    this.connectedUsers = new Map();
  }

  init() {
    this.io.on('connection', (socket) => {
      console.log('New client connected');

      // User Authentication and Online Status
      socket.on('authenticate', async (userId) => {
        try {
          await User.findByIdAndUpdate(userId, { 
            isOnline: true, 
            lastActive: new Date() 
          });
          
          this.connectedUsers.set(userId, socket.id);
          
          // Broadcast user's online status to connections
          socket.broadcast.emit('userOnlineStatus', {
            userId,
            status: true
          });
        } catch (error) {
          console.error('Authentication error:', error);
        }
      });

      // Send Message
      socket.on('sendMessage', async (messageData) => {
        try {
          const { senderId, receiverId, content } = messageData;

          // Find or create conversation
          let conversation = await Conversation.findOne({
            participants: { 
              $all: [senderId, receiverId] 
            }
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: [senderId, receiverId]
            });
          }

          const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content
          });

          conversation.messages.push(newMessage);
          conversation.lastMessage = newMessage;

          await conversation.save();

          // Emit to receiver if online
          const receiverSocketId = this.connectedUsers.get(receiverId);
          if (receiverSocketId) {
            this.io.to(receiverSocketId).emit('newMessage', newMessage);
          }

          // Confirm message sent to sender
          socket.emit('messageSent', newMessage);
        } catch (error) {
          console.error('Message send error:', error);
        }
      });

      // Disconnect Handling
      socket.on('disconnect', async () => {
        for (let [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            await User.findByIdAndUpdate(userId, { 
              isOnline: false, 
              lastActive: new Date() 
            });

            this.connectedUsers.delete(userId);
            
            // Broadcast offline status
            socket.broadcast.emit('userOnlineStatus', {
              userId,
              status: false
            });
            break;
          }
        }
        console.log('Client disconnected');
      });
    });
  }
}

module.exports = ChatServer;