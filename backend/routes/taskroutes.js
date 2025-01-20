// taskroutes.js
const express = require('express');
const { getAllTasks, addTask } = require('../Controllers/taskController');
const router = express.Router();

// Define GET and POST routes for /tasks
router.get('/', getAllTasks);  // Handle GET requests at /api/tasks
router.post('/', addTask);     // Handle POST requests at /api/tasks

module.exports = router;
