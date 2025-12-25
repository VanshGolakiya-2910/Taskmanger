const express = require('express');
const { getAllTasks, addTask } = require('../Controllers/taskController');
const router = express.Router();

router.get('/tasks', getAllTasks);
router.post('/tasks', addTask);  // Add this line to handle POST requests

module.exports = router;
