const express = require('express');
const { getAllProjects, addProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

// GET all projects
router.get('/', getAllProjects);

// POST to add a new project
router.post('/', addProject);

// DELETE project by ID
router.delete('/:id', deleteProject);  // Add this line to handle DELETE request for project deletion

module.exports = router;
