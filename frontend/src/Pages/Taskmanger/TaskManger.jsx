import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import './TaskManager.module.css';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        taskName: '',
        assignedOn: '',
        dueDate: '',
        projectId: '',
        status: '',
        priority: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('http://localhost:5000/api/tasks');
            setTasks(response.data);  // Store the tasks in state
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const taskData = {
            Task_Name: form.taskName,
            Assigned_On: form.assignedOn,
            Due_Date: form.dueDate,
            Project_ID: form.projectId,
            Status: form.status,
            Priority: form.priority
        };

        try {
            await api.post('http://localhost:5000/api/tasks', taskData);  // Send POST request to backend to add a task
            setForm({
                taskName: '',
                assignedOn: '',
                dueDate: '',
                projectId: '',
                status: '',
                priority: ''
            });  // Reset form
            fetchTasks();  // Fetch tasks again to show updated list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <div className="task-manager">
            <h1>Task Manager</h1>
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
                    placeholder="Project ID"
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
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

            <ul>
                {tasks.map((task) => (
                    <li key={task.Task_ID}>
                        <h3>{task.Task_Name}</h3>
                        <p>Assigned On: {new Date(task.Assigned_On).toLocaleDateString()}</p>
                        <p>Due Date: {new Date(task.Due_Date).toLocaleDateString()}</p>
                        <p>Project ID: {task.Project_ID}</p>
                        <p>Status: {task.Status}</p>
                        <p>Priority: {task.Priority}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
