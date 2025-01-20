const express = require('express');
const { getAllProjects, addProject } = require('../controllers/projectController');

const router = express.Router();

// GET all projects
router.get('/', getAllProjects);

// POST to add a new project
router.post('/', addProject);

module.exports = router;
