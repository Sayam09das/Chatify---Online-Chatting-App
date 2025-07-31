const http = require('http');
const socketIO = require('socket.io');
const app = require('./app'); // your Express app from app.js

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('📨 Message received:', data);

    // Broadcast message to other clients
    socket.broadcast.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
