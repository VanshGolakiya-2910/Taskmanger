const db = require('../db');

// Controller to fetch all users
const getAllUsers = (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
const mysql = require('mysql');

// Function to assign project to a user
// In userController.js
const assignProjectToUser = (req, res) => {
    const { userID, projectID } = req.body;

    // Check if the user exists
    const userQuery = 'SELECT * FROM user WHERE User_ID = ?';
    db.query(userQuery, [userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user with the projectID
        const updateQuery = 'UPDATE user SET Project_ID = ? WHERE User_ID = ?';
        db.query(updateQuery, [projectID, userID], (err, updateResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error updating user project' });
            }
            res.status(200).json({ message: 'Project assigned to user successfully' });
        });
    });
};


const getUsersByProject = (req, res) => {
    const { projectID } = req.params;  // Get Project_ID from the request parameters

    // Query to fetch users with the given Project_ID
    const query = 'SELECT * FROM user WHERE Project_ID = ?';

    db.query(query, [projectID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching users' });
        }

        // If no users found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found for this project' });
        }

        // Return the users for the specified project
        res.status(200).json(results);
    });
};
module.exports = { getAllUsers , assignProjectToUser ,getUsersByProject };
