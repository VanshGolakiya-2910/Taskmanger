const db = require("../db");

// Controller to fetch details of a specific project
const getProjectDetail = (req, res) => {
  const { id } = req.params; // Get the project ID from the request parameters

  const query = "SELECT * FROM project WHERE Project_ID = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(results[0]); // Return the first result (should be only one project)
  });
};

module.exports = { getProjectDetail };
