import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Project.css';

const Projects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    // Fetch projects from API when component mounts
    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/project');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Open modal for adding new project
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Close modal after submitting or canceling
    const handleCloseModal = () => {
        setIsModalOpen(false);
        document.getElementById('projectForm').reset();
    };

    // Handle form submission for new project
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const projectName = document.getElementById('projectName').value;
        const assignedOn = document.getElementById('assignedOn').value;
        const dueDate = document.getElementById('dueDate').value;
        const managerID = document.getElementById('managerID').value;
        const status = document.getElementById('status').value;
        const priority = document.getElementById('priority').value;
        const projectDesc = document.getElementById('projectDesc').value;
    
        const newProject = {
            Project_Name: projectName,
            Assigned_On: assignedOn,
            Due_Date: dueDate,
            Manager_ID: managerID,
            Status: status,
            Priority: priority,
            project_desc: projectDesc
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/project', newProject, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Project added:', response.data); // Check the response in console
            fetchProjects(); // Re-fetch the projects after adding the new one
            handleCloseModal();
        } catch (error) {
            console.error('Error adding project:', error.response ? error.response.data : error.message);
        }
    };

    // Handle project deletion
    const handleDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                // DELETE request to remove the project
                await axios.delete(`http://localhost:5000/api/project/${id}`);
                fetchProjects(); // Re-fetch the projects after deletion
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    // Fetch projects when the component mounts
    React.useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">Task Manager</div>
                <ul className="nav-items">
                    <li className="nav-item">Home    
                    </li>
                    <li className="nav-item">Project</li>
                    <li className="nav-item">Chat</li>
                    <li className="nav-item">Setting</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <button className="add-project" onClick={handleOpenModal}>
                    <span>+</span>
                    <span>New Project</span>
                </button>

                {/* Projects Grid */}
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div className="project-card" key={project.Project_ID}>
                            <button className="delete-btn" onClick={() => handleDeleteProject(project.Project_ID)}>
                                Delete
                            </button>
                            <Link to={`/project/${project.Project_ID}`} className="project-link">
                                <h3>{project.Project_Name}</h3>
                                <div className="project-info">Project Name: {project.Project_Name}</div>
                                <div className="project-info">Assigned On: {project.Assigned_On}</div>
                                <div className="project-info">Due Date: {project.Due_Date}</div>
                                <div className="project-info">Manager ID: {project.Manager_ID}</div>
                                <div className="project-info">Status: {project.Status}</div>
                                <div className="project-info">Priority: {project.Priority}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="modal" onClick={(e) => e.target.className === 'modal' && handleCloseModal()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Project</h2>
                            <button className="close-btn" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        <form id="projectForm" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="projectName">Project Name</label>
                                <input type="text" id="projectName" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="assignedOn">Assigned On</label>
                                <input type="date" id="assignedOn" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <input type="date" id="dueDate" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="managerID">Manager ID</label>
                                <input type="text" id="managerID" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select id="status" required>
                                    <option value="">Select Status</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="priority">Priority</label>
                                <select id="priority" required>
                                    <option value="">Select Priority</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="projectDesc">Project Description</label>
                                <textarea id="projectDesc" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Create Project</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
