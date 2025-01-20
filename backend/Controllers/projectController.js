const db = require('../db');

// Controller to fetch all projects
const getAllProjects = (req, res) => {
  db.query('SELECT * FROM project', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Controller to add a new project
const addProject = (req, res) => {
  const { Project_Name, Due_Date, Manager_ID, Status, Priority, project_desc } = req.body;

  // Basic validation
  if (!Project_Name || !Due_Date || !Manager_ID || !Status || !Priority || !project_desc) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Get the current date for Assigned_On
  const Assigned_On = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const query = `
    INSERT INTO project (Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority, project_desc)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority, project_desc],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Project added successfully',
        projectId: result.insertId,
      });
    }
  );
};

module.exports = { getAllProjects, addProject };
