import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/style.css'; // Ensure your CSS is imported

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);
    if (result.success && (result.role === 'admin' || result.role === 'engineer')) {
      console.log("AdminLoginPage: Login successful, navigating to /admin/dashboard");
      navigate('/admin/dashboard');
    } else if (result.success) {
      console.log("AdminLoginPage: Login successful but user not admin/engineer, showing alert.");
      alert('You do not have admin/engineer privileges.');
      navigate('/'); // Logged in but not admin/engineer, send to regular homepage
    } else {
      console.log("AdminLoginPage: Login failed, showing alert:", result.message);
      alert(result.message);
    }
  };

  return (
    // This structure explicitly mirrors the HomePage's likely layout:
    // Fullscreen background, overlay, and then a centered login-container
    // which holds the login-box.
    <div className="homepage-background">
      <div className="overlay"></div>
      <div className="login-container">
        {/* The login-box now wraps the form content for consistent styling */}
        <div className="login-box">
          <h2>Admin / Engineer Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-email" className="form-label">Email:</label>
              <input
                type="email"
                id="admin-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">Password:</label>
              <input
                type="password"
                id="admin-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            {/* Using the specific "login-button" class as defined in your CSS for .login-box */}
            <button type="submit" className="login-button">Log In as Admin/Engineer</button>
          </form>
          <p className="form-text">
            <Link to="/" className="form-link">Back to Homepage</Link>
          </p>
        </div> {/* End of .login-box */}
      </div> {/* End of .login-container */}
    </div> // End of .homepage-background
  );
}

export default AdminLoginPage;