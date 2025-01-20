const express = require('express');
const { signup, login } = require('../Controllers/authController');
const router = express.Router();

// Route for signup
router.post('/signup', signup);

// Route for login
router.post('/login', login);

module.exports = router;
