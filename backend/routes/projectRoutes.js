const express = require('express');
const { getAllProjects, addProject } = require('../Controllers/ProjectController');
const router = express.Router();

router.get('/projects', getAllProjects);
router.post('/projects', addProject);

module.exports = router; // Ensure this exports the router
