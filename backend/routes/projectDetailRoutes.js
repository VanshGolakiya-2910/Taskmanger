const express = require('express');
const router = express.Router();
const projectDetailController = require('../Controllers/projectDetailController');

// Route to get a specific project by ID
router.get('/projects/:id', projectDetailController.getProjectDetail);

module.exports = router;
