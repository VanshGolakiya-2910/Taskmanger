import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';  // Ensure this path is correct for your project structure
import './TaskManager.module.css';

const TaskManager = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        taskName: '',
        assignedOn: '',
        dueDate: '',
        status: '',
        priority: ''
    });
    const [notification, setNotification] = useState('');  // New state for notification

    // Fetch tasks when component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await api.get('http://localhost:5000/api/tasks');
            setTasks(response.data);  // Store tasks in state
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Handle form submission for adding a task
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const taskData = {
            Task_Name: form.taskName,
            Assigned_On: form.assignedOn,
            Due_Date: form.dueDate,
            Status: form.status,
            Priority: form.priority,
            Project_ID: projectId  // Use current project ID
        };

        try {
            await api.post('http://localhost:5000/api/tasks', taskData);  // Send POST request to backend to add a task
            setForm({
                taskName: '',
                assignedOn: '',
                dueDate: '',
                status: '',
                priority: ''
            });  // Reset form
            fetchTasks();  // Fetch tasks again to show updated list
            setNotification('Task is added');  // Show success notification
            setTimeout(() => setNotification(''), 3000);  // Hide notification after 3 seconds
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <div className="task-manager">
            <h1>Task Manager</h1>
            {notification && <div className="notification">{notification}</div>} {/* Show notification */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={form.taskName}
                    onChange={(e) => setForm({ ...form, taskName: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={form.assignedOn}
                    onChange={(e) => setForm({ ...form, assignedOn: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Priority"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    required
                />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default TaskManager;
