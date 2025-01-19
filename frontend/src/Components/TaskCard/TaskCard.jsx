import React from 'react';
import styles from './TaskCard.module.css';

export const TaskCard = ({ task }) => {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
          {task.priority}
        </span>
      </div>
      <div className={styles.taskDetails}>
        <div className={styles.detailRow}>
          <span className={styles.label}>Members:</span>
          <span>{task.members}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Date added:</span>
          <span>{task.dateAdded}</span>
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