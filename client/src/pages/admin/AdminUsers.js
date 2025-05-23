import React, { useState, useEffect } from 'react';
import { getDummyUsers, setDummyUsers } from '../../data';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getDummyUsers());
  }, []);

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setDummyUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setDummyUsers(updatedUsers);
      setUsers(updatedUsers);
      alert('User deleted successfully!');
    }
  };

  return (
    <section className="admin-panel-section">
      <h2>Manage Users</h2>
      <div className="admin-list-grid">
        {users.map(user => (
          <div key={user.id} className="admin-user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Role: <span className={`user-role user-role-${user.role}`}>{user.role}</span></p>
            <p>Reviews: {user.reviewCount || 0}</p>
            <div className="admin-item-actions">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="form-control" // Apply form-control here as well
                style={{ width: 'auto', display: 'inline-block', marginRight: '10px' }} // Inline style for fitting
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="engineer">engineer</option>
              </select>
              <button onClick={() => handleDelete(user.id)} className="btn btn-danger delete-btn">Delete</button> {/* Added btn btn-danger */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminUsers;