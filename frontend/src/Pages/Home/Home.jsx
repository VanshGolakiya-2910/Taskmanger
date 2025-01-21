import React, { useState, useEffect } from "react";
import styles from "./Home.module.css"; // Importing module CSS
import CustomCalendar from "../../Components/CutomCalendar/CustomCalendar";
import axios from "axios";
import { TaskCard } from "../../Components/TaskCard/TaskCard";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [tasks, setTasks] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try { 
        const response = await axios.get("http://localhost:5000/api/tasks");
        const allTasks = response.data;
        const priorityTasks = allTasks.filter((task) => task.Priority === 1);
        setTasks(allTasks);
        setPriorityTasks(priorityTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>Task Manager</div>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/task-manager">Tasks</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/project">Project</Link>
          </li>
          <li className={styles.navItem}>Notification</li>
          <li className={styles.navItem}>Settings</li>
        </ul>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.quadrants}>
          <div className={styles.quadrant}>
            <h2 className={styles.taskHeading}>Priority Tasks</h2>
            <div className={styles.taskList}>
              {priorityTasks.length > 0 ? (
                priorityTasks.map((task) => (
                  <TaskCard key={task.Task_ID} task={task} />
                ))
              ) : (
                <p>No priority tasks available</p>
              )}
            </div>
          </div>

          <div className={styles.quadrant}>
            <CustomCalendar />
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.bottomLeft}>
              <h2 className={styles.taskHeading}>Ongoing/Pending Tasks</h2>
              <div className={styles.taskList}>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard key={task.Task_ID} task={task} />
                  ))
                ) : (
                  <p>No ongoing tasks</p>
                )}
              </div>
            </div>

            <div className={styles.bottomRight}>
              <h2 className={styles.taskHeading}>Completed Tasks</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
