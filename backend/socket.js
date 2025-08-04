const socketIO = require('socket.io');
const Message = require('./Models/Message'); // Import Message model

// Store connected users: userId -> socketId
const onlineUsers = new Map();

function initializeSocket(server) {
  // Initialize Socket.IO with CORS config
  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // 🟢 User joins with userId
    socket.on('addUser', (userId) => {
      if (!userId) return;

      // Disconnect previous socket if user is already connected
      const existingSocketId = onlineUsers.get(userId);
      if (existingSocketId && existingSocketId !== socket.id) {
        io.to(existingSocketId).disconnectSockets(true);
      }

      // Store userId on socket and update map
      socket.data.userId = userId;
      onlineUsers.set(userId, socket.id);

      console.log(`✅ User added: ${userId} with socket ID: ${socket.id}`);

      // Check for undelivered messages and send them
      checkAndSendUndeliveredMessages(userId, io);

      // Notify all clients (including new one)
      io.emit('getUsers', Array.from(onlineUsers.keys()));
    });

    // 📤 User sends a message
    socket.on('sendMessage', async ({ chatId, message }) => {
      if (!chatId || !message || !message.receiver) {
        console.log('⚠️ Invalid message payload');
        return;
      }

      // Validate that sender exists (either from message.sender or socket.data.userId)
      const senderId = message.sender || socket.data.userId;
      if (!senderId) {
        console.log('⚠️ Message sender is missing');
        console.log('Message object:', message);
        return;
      }

      console.log('📤 Message:', message);
      console.log('🌐 Online users:', onlineUsers);

      const receiverId = message.receiver;
      const receiverSocketId = onlineUsers.get(receiverId);

      try {
        // Always store the message in the database
        const newMessage = new Message({
          senderId: senderId,
          receiverId: receiverId,
          message: message.text,
          timestamp: new Date()
        });

        await newMessage.save();
        console.log('💾 Message saved to database');

        // Add database ID and timestamp to message object
        const messageToSend = {
          _id: newMessage._id,
          text: message.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: senderId,
          receiver: receiverId,
          timestamp: newMessage.timestamp
        };

        if (receiverSocketId) {
          // Receiver is online, send real-time message
          io.to(receiverSocketId).emit('receiveMessage', { chatId: senderId, message: messageToSend });
          console.log(`📤 Message sent to online user ${receiverId}`);
        } else {
          // Receiver is offline, message will be delivered when they come online
          console.log(`⚠️ Receiver (${receiverId}) is offline, message stored for later delivery`);
        }
      } catch (error) {
        console.error('❌ Error saving message:', error);
      }
    });

    // 🔴 User disconnects
    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      console.log('❌ Client disconnected:', socket.id);

      if (userId && onlineUsers.has(userId)) {
        console.log(`🧹 Removing user ${userId}`);
        onlineUsers.delete(userId);

        // Notify all remaining clients
        io.emit('getUsers', Array.from(onlineUsers.keys()));
      }
    });
  });
}

// Function to check for undelivered messages and send them to online users
async function checkAndSendUndeliveredMessages(userId, io) {
  try {
    // Find undelivered messages for this user
    const undeliveredMessages = await Message.find({
      receiverId: userId
    }).sort({ timestamp: 1 });

    if (undeliveredMessages.length > 0) {
      console.log(`📬 Found ${undeliveredMessages.length} undelivered messages for user ${userId}`);
      
      // Send each undelivered message
      for (const msg of undeliveredMessages) {
        const chatId = msg.senderId.toString(); // ChatId is the sender's ID
        const message = {
          _id: msg._id,
          text: msg.message,
          time: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.senderId,
          receiver: msg.receiverId,
          timestamp: msg.timestamp
        };
        
        const receiverSocketId = onlineUsers.get(userId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', { chatId: chatId, message: message });
          console.log(`📬 Delivered stored message to user ${userId}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error checking undelivered messages:', error);
  }
}

module.exports = { initializeSocket };
