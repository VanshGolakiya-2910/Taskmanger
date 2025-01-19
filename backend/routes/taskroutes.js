const express = require('express');
const { getAllTasks } = require('../Controllers/taskController');
const router = express.Router();

router.get('/tasks', getAllTasks);

module.exports = router;
