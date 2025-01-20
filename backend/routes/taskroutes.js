// taskRoutes.js
const express = require('express');
const { getAllTasks, getTasksByProject, addTask } = require('../Controllers/taskController');
const router = express.Router();

// Define GET and POST routes for /tasks
router.get('/', getAllTasks);  // Handle GET requests at /api/tasks
router.get('/project/:projectId', getTasksByProject); // Handle GET requests for tasks by project ID
router.post('/', addTask);     // Handle POST requests at /api/tasks

module.exports = router;
