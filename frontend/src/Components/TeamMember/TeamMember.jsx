import React from "react";
import styles from "./Taskmember.module.css";

function TeamMember({ users }) {
  return (
    <aside className={styles.teamMembersContainer}>
      <div className={styles.searchContainer}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search Member"
          aria-label="Search team members"
        />
      </div>
      <div className={styles.membersList}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.User_ID} className={styles.memberRow}>
              <span>{user.User_Name}</span>
              <span>{user.Task_Name || "No Task Assigned"}</span>
            </div>
          ))
        ) : (
          <p>No team members found.</p>
        )}
      </div>
    </aside>
  );
}

export default TeamMember;
