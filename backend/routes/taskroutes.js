// taskroutes.js
const express = require('express');
const { getAllTasks, addTask,getTaskNameById } = require('../Controllers/taskController');
const router = express.Router();

// Define GET and POST routes for /tasks
router.get('/task', getAllTasks);  // Handle GET requests at /api/tasks
router.post('/task', addTask);     // Handle POST requests at /api/tasks
router.get('/task-name/:taskID',getTaskNameById)

module.exports = router;
