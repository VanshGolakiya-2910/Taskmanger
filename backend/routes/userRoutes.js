const express = require('express');
const { getAllUsers  , assignProjectToUser , getUsersByProject } = require('../Controllers/userController');
const router = express.Router();

// Define GET route for /users to fetch all users
router.get('/', getAllUsers);
router.post('/assign-project', assignProjectToUser);
router.get('/project/:projectID', getUsersByProject);
module.exports = router;
