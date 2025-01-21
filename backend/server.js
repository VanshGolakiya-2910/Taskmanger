const express = require('express');
const socketIo = require("socket.io");
const http = require('http');
const cors = require('cors');
const { handleConnection } = require('./Controllers/chatController');
const taskRoutes = require('./routes/taskroutes');
const projectRoutes = require('./routes/Projectroutes');
const authRoutes = require('./routes/authRoutes'); 
const projectDetailRoutes = require('./routes/projectDetailRoutes');
const userRoutes = require('./routes/userRoutes'); // Import the user routes

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow the React app to access the server
    methods: ['GET', 'POST'],
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

// All the Routes 
app.use('/api/tasks', taskRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/project', projectDetailRoutes);
app.use('/api/users', userRoutes); // Add the user routes here

// Root URL for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// WebSocket connection handler
io.on('connection', (socket) => {
  handleConnection(socket);
  console.log("A user is Connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
