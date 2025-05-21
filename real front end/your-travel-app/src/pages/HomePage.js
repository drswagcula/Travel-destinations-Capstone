// src/pages/HomePage.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleHomepageLogin = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  const handleAdminTrigger = () => {
    navigate('/admin_login');
  };

  // New handler for the "Forgot Password?" button
  const handleForgotPassword = (event) => {
    event.preventDefault(); // Good practice even for buttons if not type="submit"
    alert('Forgot password functionality coming soon!'); // Placeholder for actual logic (e.g., open modal, navigate to /forgot-password)
  };

  return (
    <>
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
            {/* FIX: Changed <a> with href="#" to a <button> for accessibility */}
            <p><button type="button" onClick={handleForgotPassword} className="link-button">Forgot Password?</button></p>
          </div>
        </div>

        <div className="admin-trigger" onClick={handleAdminTrigger}>
          Z
        </div>
      </div>
      <main>
          <section id="destination-list">
              <h2>Explore Destinations</h2>
              <p>For now, navigate via the header or directly to /destination/paris for an example.</p>
              <div className="destination-card">
                  <img src="https://via.placeholder.com/300/007bff/FFFFFF?Text=Paris" alt="Paris" />
                  <h3>Paris, France</h3>
                  <p>★★★★☆ (4.5)</p>
                  <p>European City, Romantic</p>
                  <Link to="/destination/paris">View Details</Link>
              </div>
          </section>
      </main>
    </>
  );
}

export default HomePage;