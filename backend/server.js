const http = require('http');
const app = require('./app'); // Import your Express app
const { initializeSocket } = require('./socket');

const server = http.createServer(app);


initializeSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
