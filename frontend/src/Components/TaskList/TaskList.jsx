import React from 'react';
import { TaskCard } from './TaskCard';
import styles from './TaskList.module.css';

const tasks = [
  {
    id: 1,
    title: 'Task 1',
    priority: 'Medium',
    members: 'no. of member on this task',
    dateAdded: '12/04/2021',
    dueDate: '12/04/2021'
  },
  {
    id: 2,
    title: 'Task 2',
    priority: 'Low',
    members: 'Artur',
    dateAdded: '12/04/2021'
  },
  {
    id: 3,
    title: 'Task 3',
    priority: 'High',
    members: 'Adyl, Artur',
    dateAdded: '12/04/2021',
    dueDate: '12/04/2021'
  }
];

export const TaskList = () => {
  return (
    <section className={styles.taskListContainer}>
      <div className={styles.taskListHeader}>
        <h2 className={styles.title}>Tasks</h2>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/bbe86f4115e4bfd846ecf248a18019ece6a0830bc6c7bcf4e0c374a256fab30f?apiKey=3e25b05d1fd543b9870cb114cf23b083&" 
          alt="Add task" 
          className={styles.addIcon}
        />
      </div>
      <div className={styles.taskList}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
};