import React from 'react';
import styles from './Sidebar.module.css';

// Updated menu items with icon classes
const menuItems = [
  { id: 1, label: 'Home', icon: 'bi bi-house' },
  { id: 2, label: 'Projects', icon: 'bi bi-clipboard' },
  { id: 3, label: 'Chat', icon: 'bi bi-chat' },
  { id: 4, label: 'Settings', icon: 'bi bi-gear' }
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>Task Manager</h1>
      <h2 className={styles.menuTitle}>Menu</h2>
      <nav className={styles.navigation}>
        {menuItems.map(item => (
          <div key={item.id} className={styles.menuItem}>
            <i className={`${item.icon} ${styles.menuIcon}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};
