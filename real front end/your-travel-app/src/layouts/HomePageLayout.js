import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// No Header or Footer imported here, as this is a full-screen landing page

function HomePageLayout() {
  const navigate = useNavigate();

  const handleHomepageLogin = (event) => {
    event.preventDefault();
    // For this demo, we redirect to the dedicated login page.
    // In a more complex app, you might handle login directly here using the AuthContext's login function.
    navigate('/login');
  };

  const handleAdminTrigger = () => {
    navigate('/admin_login');
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    alert('Forgot password functionality coming soon!');
  };

  return (
    <div className="homepage-background">
      <div className="overlay"></div>

      <div className="login-container">
        <div className="login-box">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleHomepageLogin}>
            <div className="form-group">
              <label htmlFor="homepage-email">Email / Username</label>
              <input type="text" id="homepage-email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="homepage-password">Password</label>
              <input type="password" id="homepage-password" name="password" required />
            </div>
            <button type="submit" className="login-button">Log In</button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <p><button type="button" onClick={handleForgotPassword} className="link-button">Forgot Password?</button></p>
        </div>
      </div>

      <div className="admin-trigger" onClick={handleAdminTrigger}>
        Z
      </div>
    </div>
  );
}

export default HomePageLayout;