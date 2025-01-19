import React from 'react';
import styles from './TeamMembers.module.css';

export const TeamMembers = () => {
  return (
    <aside className={styles.teamMembersContainer}>
      <h2 className={styles.title}>Team Members</h2>
      <div className={styles.searchContainer}>
        <input 
          type="search"
          className={styles.searchInput}
          placeholder="Search Member"
          aria-label="Search team members"
        />
      </div>
      <div className={styles.membersList}>
        <div className={styles.memberRow}>
          <span>Member</span>
          <button className={styles.addButton}>+ Add</button>
        </div>
        <div className={styles.memberRow}>
          <span>Member</span>
          <span>Task 1</span>
        </div>
        <div className={styles.memberRow}>
          <span>Member</span>
          <span>Task 1</span>
        </div>
      </div>
    </aside>
  );
};