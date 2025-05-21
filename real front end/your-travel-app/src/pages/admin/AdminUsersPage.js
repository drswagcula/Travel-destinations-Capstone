import React, { useState, useEffect } from 'react';
import { getDummyUsers, setDummyUsers } from '../../data';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  // In a more complex app, you might have a UserModal similar to ItemModal

  useEffect(() => {
    setUsers(getDummyUsers());
  }, []);

  // For simplicity, editing users will just be an alert, but could open a modal
  const handleEditUser = (user) => {
    alert(`Editing user: ${user.name} (Email: ${user.email}). \n\nImplementation for editing user details would go here.`);
    // In a real app, you'd open a modal and pass 'user' data to it
  };

  const handleDeleteUser = (id) => {
    if (window.confirm(`Are you sure you want to delete user with ID: ${id}?`)) {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      setDummyUsers(updatedUsers); // Update localStorage
      alert('User deleted.');
    }
  };

  return (
    <main className="admin-main-content">
      <section className="admin-panel-section">
        <h2>Manage Users</h2>
        {/* <button className="add-new-btn" onClick={() => alert('Add new user functionality needed')}>Add New User</button> */}

        <div id="adminUserList" className="admin-list-grid">
          {users.map(user => (
            <div className="admin-user-card" key={user.id}>
              <div>
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> <span className={`user-role user-role-${user.role}`}>{user.role}</span></p>
                <p><strong>Reviews:</strong> {user.reviewCount}</p>
              </div>
              <div className="admin-item-actions">
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminUsersPage;