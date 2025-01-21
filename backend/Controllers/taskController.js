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

// Controller to fetch tasks for a specific project
const getTasksByProject = (req, res) => {
  const projectId = req.params.projectId; // Extract projectId from the URL

  db.query('SELECT * FROM task WHERE Project_ID = ?', [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this project' });
    }

    res.json(results); // Return the tasks for the specified project
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
const getTaskNameById = (req, res) => {
  const { taskId } = req.params;

  const query = 'SELECT Task_Name FROM task WHERE Task_ID = ?';
  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error('Error fetching Task Name:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(200).json({ taskName: results[0].Task_Name });
    } else {
      return res.status(404).json({ error: 'Task not found' });
    }
  });
};

module.exports = { getAllTasks, getTasksByProject, addTask , getTaskNameById}; // Export the functions
