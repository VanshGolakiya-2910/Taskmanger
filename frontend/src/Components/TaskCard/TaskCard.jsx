  import React from 'react';
  import styles from './TaskCard.module.css';

  export const TaskCard = ({ task }) => {
    console.log(task)
    const priorityClass = task.priority ? styles[task.priority.toLowerCase()] : '';

    return (
      <div className={styles.taskCard}>
        <div className={styles.taskHeader}>
          <h3 className={styles.taskTitle}>{task.Task_Name}</h3>
          <span className={`${styles.priority} ${priorityClass}`}>
            {task.Priority}
          </span>
        </div>
        <div className={styles.taskDetails}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Members:</span>
            <span>{task.members}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Date added:</span>
            <span>{task.Due_Date}</span>
          </div>
          {task.dueDate && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Due date:</span>
              <span>{task.dueDate}</span>
            </div>
          )}
        </div>
      </div>
    );
  };
