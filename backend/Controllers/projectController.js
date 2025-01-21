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
    try {
        const { Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority, project_desc } = req.body;

        if (!Project_Name || !Assigned_On || !Due_Date ||
            !Manager_ID || !Status || Priority === undefined || !project_desc) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const query = `
            INSERT INTO project (Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority, project_desc) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        db.query(query, [Project_Name, Assigned_On, Due_Date, Manager_ID, Status, Priority, project_desc], (err, result) => {
            if (err) {
                console.error('Error inserting project:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: 'Project added successfully',
                projectId: result.insertId,
            });
        });
    } catch (e) {
        console.error('Invalid JSON input:', req.body);
        res.status(400).json({ error: 'Invalid JSON format' });
    }
};

module.exports = { getAllProjects, addProject };
