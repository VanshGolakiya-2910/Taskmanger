import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import './TaskManger.module.css';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await api.get('/tasks');
        setTasks(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/tasks', form);
        setForm({ title: '', description: '', dueDate: '' });
        fetchTasks();
    };

    return (
        <div className="task-manager">
            <h1>Task Manager</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    required
                />
                <button type="submit">Add Task</button>
            </form>

            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
