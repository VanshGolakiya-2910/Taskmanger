import React from 'react';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';

// Updated menu items with complete routes
const menuItems = [
  { id: 1, label: 'Home', icon: 'bi bi-house', route: '/home' },
  { id: 2, label: 'Projects', icon: 'bi bi-clipboard', route: '/project' },
  { id: 3, label: 'Chat', icon: 'bi bi-chat', route: '/home' },
  { id: 4, label: 'Settings', icon: 'bi bi-gear', route: '/home' }
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>Task Manager</h1>
      <h2 className={styles.menuTitle}>Menu</h2>
      <nav className={styles.navigation}>
        {menuItems.map(item => (
          <Link to={item.route} key={item.id} className={styles.menuItem}>
            <i className={`${item.icon} ${styles.menuIcon}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
