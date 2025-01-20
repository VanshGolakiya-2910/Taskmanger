const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes'); // Task routes
const authRoutes = require('./routes/authRoutes'); // Auth routes
const projectRoutes = require('./routes/projectRoutes'); // Project routes

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/tasks', taskRoutes); // Task-related routes
app.use('/api/auth', authRoutes); // Auth-related routes
app.use('/api/projects', projectRoutes); // Project-related routes

// Root URL for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
