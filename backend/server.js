const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM project');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Example for adding data
app.post('/add-project', async (req, res) => {
  const { Project_ID, Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO project (Project_ID, Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Project_ID, Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority]
    );
    res.json({ message: 'Project added successfully', result });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
const PORT = 5000; // Backend server port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
