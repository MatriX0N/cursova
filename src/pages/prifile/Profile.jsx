import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import styles from "./Profile.module.scss";

function Profile() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) return null;

  return (
    <article className={styles.profileCard}>
      {user.picture && <img src={user.picture} alt={user.name} className={styles.avatar} />}
      <h2>{user.name}</h2>
      <p className={styles.email}>{user.email}</p>

      <div className={styles.details}>
        <p><strong>Username:</strong> {user.nickname}</p>
      </div>
    </article>
  );
}

export default Profile;