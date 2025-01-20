// server.js or app.js
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskroutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

// Use taskRoutes with the base /api/tasks URL
app.use('/api/tasks', taskRoutes); // Task-related routes

// Define other routes as needed
app.use('/api/auth', authRoutes); // Auth-related routes

// Root URL for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
