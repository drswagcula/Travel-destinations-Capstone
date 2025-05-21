import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <section className="admin-dashboard-section">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-links">
        <Link to="/admin/destinations" className="dashboard-card">
          <h3>Manage Destinations</h3>
          <p>Add, edit, or delete travel destinations.</p>
        </Link>
        <Link to="/admin/users" className="dashboard-card">
          <h3>Manage Users</h3>
          <p>View, edit, or delete user accounts.</p>
        </Link>
        <Link to="/admin/reviews" className="dashboard-card">
          <h3>Manage Reviews & Comments</h3>
          <p>Moderate user-submitted content.</p>
        </Link>
        {/* Add more admin links as needed */}
      </div>
    </section>
  );
}

export default AdminDashboard;