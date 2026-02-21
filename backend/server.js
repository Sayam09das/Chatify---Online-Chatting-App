const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User');
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

// Track connected users: Map<userId, socketId>
const connectedUsers = new Map();

// Helper to format last seen
const formatLastSeen = (date) => {
  if (!date) return 'unknown';
  
  const now = new Date();
  const lastSeen = new Date(date);
  const diffMs = now - lastSeen;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  
  return lastSeen.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short',
    year: lastSeen.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  // Handle user authentication/connection
  socket.on('addUser', async (userId) => {
    if (!userId) return;
    
    // Add to connected users map
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Join user's personal room
    socket.join(`user_${userId}`);
    
    // Update database: user is online
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
    
    // Broadcast to all clients that this user is online
    io.emit('userOnline', { 
      userId, 
      isOnline: true 
    });
    
    console.log(`User ${userId} connected. Total connected: ${connectedUsers.size}`);
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
  socket.on('sendMessage', (data) => {
    const { chatId, message } = data;
    // Broadcast to the conversation room
    io.to(`conversation_${chatId}`).emit('receiveMessage', { 
      chatId, 
      message 
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { chatId, userId, userName } = data;
    socket.to(`conversation_${chatId}`).emit('userTyping', { 
      userId, 
      userName,
      chatId 
    });
  });

  // Handle stop typing
  socket.on('stopTyping', (data) => {
    const { chatId, userId } = data;
    socket.to(`conversation_${chatId}`).emit('userStopTyping', { 
      userId,
      chatId 
    });
  });

  // Get user's online status
  socket.on('getUserStatus', async (targetUserId, callback) => {
    try {
      const user = await User.findById(targetUserId).select('isOnline lastSeen');
      if (user) {
        callback({
          userId: targetUserId,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen,
          lastSeenFormatted: formatLastSeen(user.lastSeen)
        });
      } else {
        callback({ error: 'User not found' });
      }
    } catch (error) {
      callback({ error: error.message });
    }
  });

  // Get multiple users' statuses
  socket.on('getUsersStatus', async (userIds, callback) => {
    try {
      const users = await User.find({ _id: { $in: userIds } })
        .select('isOnline lastSeen')
        .lean();
      
      const statuses = {};
      users.forEach(user => {
        statuses[user._id.toString()] = {
          isOnline: user.isOnline,
          lastSeen: user.lastSeen,
          lastSeenFormatted: formatLastSeen(user.lastSeen)
        };
      });
      
      callback(statuses);
    } catch (error) {
      callback({ error: error.message });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    const userId = socket.userId;
    
    if (userId) {
      // Remove from connected users
      connectedUsers.delete(userId);
      
      // Update database: user is offline
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Error updating user offline status:', error);
      }
      
      // Broadcast to all clients that this user is offline
      io.emit('userOffline', { 
        userId, 
        isOnline: false,
        lastSeen: new Date()
      });
      
      console.log(`User ${userId} disconnected. Total connected: ${connectedUsers.size}`);
    }
    
    console.log('Socket disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);
app.set('connectedUsers', connectedUsers);

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

