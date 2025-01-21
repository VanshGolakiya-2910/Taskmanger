const db = require("../db");

// Controller to fetch all projects
const getAllProjects = (req, res) => {
  db.query("SELECT * FROM project", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Controller to add a new project
const addProject = (req, res) => {
  const { Project_Name, Due_Date, Manager_ID, Status, Priority, project_desc } =
    req.body;

  // Basic validation
  if (
    !Project_Name ||
    !Due_Date ||
    !Manager_ID ||
    !Status ||
    !Priority ||
    !project_desc
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Get the current date for Assigned_On
  const Assigned_On = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const query = `
    INSERT INTO project (Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority, project_desc)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      Project_Name,
      Assigned_On,
      Due_Date,
      Manager_ID,
      Status,
      Priority,
      project_desc,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Project added successfully",
        projectId: result.insertId,
      });
    }
  );
};
// Controller to delete a project
const deleteProject = (req, res) => {
  const { id } = req.params; // Get project ID from request params

  const query = "DELETE FROM project WHERE Project_ID = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  });
};



module.exports = { getAllProjects, addProject, deleteProject };
