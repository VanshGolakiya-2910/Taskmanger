import React, { useState } from 'react';
import './Project.css';

const Projects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        document.getElementById('projectForm').reset();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const leader = document.getElementById('projectLeader').value;
        const priority = document.getElementById('priority').value;
        const description = document.getElementById('description').value;
        const currentDate = new Date().toISOString().split('T')[0];

        const newProject = {
            leader,
            priority,
            description,
            dateAssigned: currentDate,
        };

        setProjects([...projects, newProject]);
        handleCloseModal();
    };

    const handleDeleteProject = (index) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter((_, i) => i !== index);
            setProjects(updatedProjects);
        }
    };

    return (
        <div className="container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">Task Manager</div>
                <ul className="nav-items">
                    <li className="nav-item">Home</li>
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
                    {projects.map((project, index) => (
                        <div className="project-card" key={index}>
                            <button className="delete-btn" onClick={() => handleDeleteProject(index)}>
                                Delete
                            </button>
                            <h3>{project.leader}'s Project</h3>
                            <div className="project-info">Project Leader: {project.leader}</div>
                            <div className="project-info">Priority: {project.priority}</div>
                            <div className="project-info">Date Assigned: {project.dateAssigned}</div>
                            <div className="project-description">{project.description}</div>
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
                                <label htmlFor="projectLeader">Project Leader</label>
                                <input type="text" id="projectLeader" required />
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
                                <label htmlFor="description">Description</label>
                                <textarea id="description" required></textarea>
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
