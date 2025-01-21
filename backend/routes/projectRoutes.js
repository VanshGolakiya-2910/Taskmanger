const express = require('express');
const { getAllProjects, addProject } = require('../Controllers/ProjectController');
const router = express.Router();

router.get('/', getAllProjects);
router.post('/', addProject);

module.exports = router; // Ensure this exports the router
