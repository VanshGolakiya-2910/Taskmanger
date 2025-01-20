import React, { useState, useEffect } from "react";
import "./Home.css"; // Assuming Home.css is used for styling
import CustomCalendar from "../../Components/CutomCalendar/CustomCalendar"; // Import CustomCalendar component
import axios from "axios";
import { TaskCard } from "../../Components/TaskCard/TaskCard"; // Import the TaskCard component

const Homepage = () => {
  // State to store the tasks
  const [tasks, setTasks] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        const allTasks = response.data;
        
        // Filter tasks based on priority 1
        const priorityTasks = allTasks.filter(task => task.Priority === 1); // Assuming task has a 'Priority' field
        setTasks(allTasks); // Set all tasks in state
        setPriorityTasks(priorityTasks); // Set high-priority tasks in state
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div className="sidebar">
        <div className="logo">Task Manager</div>
        <ul className="nav-items">
          <li className="nav-item">Home</li>
          <li className="nav-item">Tasks</li>
          <li className="nav-item">Calendar</li>
          <li className="nav-item">Reports</li>
          <li className="nav-item">Settings</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="quadrants">
          <div className="quadrant">
            <h2 className="task-heading">Priority Tasks</h2>
            <div className="task-list">
              {priorityTasks.length > 0 ? (
                priorityTasks.map((task) => (
                  <TaskCard key={task.Task_ID} task={task} /> // Use TaskCard for each task
                ))
              ) : (
                <p>No priority tasks available</p>
              )}
            </div>
          </div>

          <div className="quadrant">
            {/* Use CustomCalendar Component */}
            <CustomCalendar />
          </div>

          <div className="bottom-row">
            <div className="bottom-left">
              <h2 className="task-heading">Ongoing/Pending Tasks</h2>
              <div className="task-list">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard key={task.Task_ID} task={task} /> // Use TaskCard for each task
                  ))
                ) : (
                  <p>No ongoing tasks</p>
                )}
              </div>
            </div>

            <div className="bottom-right">
              <h2 className="task-heading">Completed Tasks</h2>
              {/* Add completed tasks here if available */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
