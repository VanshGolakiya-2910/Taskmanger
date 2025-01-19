import React from 'react';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/538c0355d503495f24fb6fbe9a40bb2074069bd3b17d119815fb7c1c230d948c?apiKey=3e25b05d1fd543b9870cb114cf23b083&" 
          alt="Search icon" 
          className={styles.searchIcon}
        />
        <input 
          type="search"
          className={styles.searchInput}
          placeholder="Search"
          aria-label="Search tasks"
        />
      </div>
      <div className={styles.userSection}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/5c43f5a2b4d0700ce4cc26c510c872f23f3167a3014f7b14f0122b93369df2ef?apiKey=3e25b05d1fd543b9870cb114cf23b083&"
          alt="Notifications"
          className={styles.notificationIcon}
        />
        <div className={styles.userProfile}>
          <div className={styles.avatar} />
          <span className={styles.userName}>User Profile</span>
        </div>
      </div>
    </header>
  );
};