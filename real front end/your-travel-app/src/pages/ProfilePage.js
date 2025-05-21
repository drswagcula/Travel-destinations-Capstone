import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { getDummyUsers } from '../data';

function ProfilePage() {
  // FIX: Removed 'userRole' from destructuring because it wasn't directly used
  const { username, isLoggedIn } = useAuth();
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    if (isLoggedIn && username) {
      const users = getDummyUsers();
      // Find the full user object based on the logged-in username (or email for robustness)
      const user = users.find(u => u.name === username); // Assuming username is unique enough for lookup
      setCurrentUserData(user);
    } else {
      setCurrentUserData(null);
    }
  }, [isLoggedIn, username]); // Re-run effect if login status or username changes

  if (!isLoggedIn) {
    return (
      <main>
        <section className="profile-section">
          <h2>Not Logged In</h2>
          <p>Please log in to view your profile.</p>
        </section>
      </main>
    );
  }

  if (!currentUserData) {
    return (
      <main>
        <section className="profile-section">
          <h2>Loading Profile...</h2>
          <p>If you're logged in, there might be an issue fetching your data.</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="profile-section">
        <h2>Your Profile</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {currentUserData.name}</p>
          <p><strong>Email:</strong> {currentUserData.email}</p>
          {/* We use currentUserData.role here, which comes from the fetched user data */}
          <p><strong>Role:</strong> <span className={`user-role user-role-${currentUserData.role}`}>{currentUserData.role}</span></p>
          <p><strong>Reviews Posted:</strong> {currentUserData.reviewCount}</p>
          {/* Add more profile specific information here */}
        </div>
        <button className="edit-profile-btn">Edit Profile</button>
      </section>
    </main>
  );
}

export default ProfilePage;