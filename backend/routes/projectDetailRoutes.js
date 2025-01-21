const express = require('express');
const   router = express.Router();
const { getProjectDetail } = require('../Controllers/projectDetailController');

// Route to get a specific project by ID
router.get('/:id', getProjectDetail); // Remove the `/project` prefix

module.exports = router;
