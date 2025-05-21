import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Relative path adjusted

function AdminDashboard() {
  const { username, userRole } = useAuth(); // AuthContext already handles access check via ProtectedRoute

  return (
    <main className="admin-main-content">
      <section className="admin-dashboard-section">
        <h2 id="dashboardWelcome">Welcome, {username} ({userRole})!</h2>
        <p>Manage content and users for YourTravel.</p>

        <div className="dashboard-links">
          <Link to="/admin/items" className="dashboard-card">
            <h3>Manage Destinations</h3>
            <p>Add, edit, or remove travel destinations.</p>
          </Link>
          <Link to="/admin/users" className="dashboard-card">
            <h3>Manage Users</h3>
            <p>View user details and roles.</p>
          </Link>
          {/* Add more links for other admin features */}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;