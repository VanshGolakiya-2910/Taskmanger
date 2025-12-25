const db = require('../db');

// Controller to fetch all tasks
const getAllTasks = (req, res) => {
  db.query('SELECT * FROM task', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Controller to add a new task
const addTask = (req, res) => {
  const { Task_Name, Due_Date, Project_ID, Status, Priority } = req.body;

  // Basic validation
  if (!Task_Name || !Due_Date || !Project_ID || !Status || !Priority) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Get the current date for Assigned_On
  const Assigned_On = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const query = `
    INSERT INTO task (Task_Name, Assigned_On, Due_Date, Project_ID, Status, Priority)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [Task_Name, Assigned_On, Due_Date, Project_ID, Status, Priority], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Task added successfully',
      taskId: result.insertId,
    });
  });
};

module.exports = { getAllTasks, addTask }; // Make sure both functions are exported
