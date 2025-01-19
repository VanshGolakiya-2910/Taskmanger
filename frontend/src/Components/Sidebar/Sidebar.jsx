import React from 'react';
import styles from './Sidebar.module.css';

const menuItems = [
  { id: 1, label: 'Home' },
  { id: 2, label: 'Projects' },
  { id: 3, label: 'Chat' },
  { id: 4, label: 'Settings' }
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>Task Manager</h1>
      <h2 className={styles.menuTitle}>Menu</h2>
      <nav className={styles.navigation}>
        {menuItems.map(item => (
          <div key={item.id} className={styles.menuItem}>
            <div className={styles.menuIcon} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};