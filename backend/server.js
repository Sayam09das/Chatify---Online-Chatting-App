const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room (user's personal room for notifications)
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their personal room`);
  });

  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // Leave a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`User left conversation: ${conversationId}`);
  });

  // Handle sending a message
  socket.on('send_message', (data) => {
    const { conversationId, message } = data;
    // Broadcast to the conversation room
    io.to(`conversation_${conversationId}`).emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { conversationId, userId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_typing', { userId });
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    const { conversationId, userId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_stop_typing', { userId });
  });

  // Handle online status
  socket.on('user_online', (userId) => {
    socket.broadcast.emit('user_status_change', { userId, status: 'online' });
  });

  // Handle offline status
  socket.on('user_offline', (userId) => {
    socket.broadcast.emit('user_status_change', { userId, status: 'offline' });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Continue without database for development
    console.log('Running without database connection');
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO is ready for connections`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
};

startServer();

