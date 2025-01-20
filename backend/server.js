const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskroutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

// API route for tasks
app.use('/api', taskRoutes);

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/api/tasks', (req, res) => {
  try {
    const { Task_Name, Due_Date, Project_ID, Status, Priority } = req.body;

    // Validate required fields
    if (!Task_Name || !Due_Date || !Project_ID || !Status || !Priority) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get the current date for Assigned_On
    const Assigned_On = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // SQL query to insert the new task into the database
    const query = `
      INSERT INTO tasks (Task_Name, Assigned_On, Due_Date, Project_ID, Status, Priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the query with parameters
    db.query(
      query,
      [Task_Name, Assigned_On, Due_Date, Project_ID, Status, Priority],
      (err, result) => {
        if (err) {
          console.error('Error adding task:', err);
          return res.status(500).json({ message: 'Error adding task', error: err.message });
        }

        // Respond with success and the newly created task's ID
        res.status(201).json({
          message: 'Task created successfully',
          taskId: result.insertId, // The auto-incremented Task_ID
        });
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

