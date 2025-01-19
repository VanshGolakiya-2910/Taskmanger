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

module.exports = { getAllTasks };
