import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
// Removed Header and Footer imports, as they won't be rendered by this layout
// import Header from '../components/Header';
// import Footer from '../components/Footer';

function AuthPageLayout() {
  return (
  
    <div className="homepage-background"> {/* Apply background styles */}
      <div className="overlay"></div> {/* Apply overlay styles */}
      {/* The login-container will center the actual form content */}
      <div className="login-container">
        <Outlet /> {/* This is where LoginPage, SignupPage, AdminLoginPage will render */}
      </div>
    </div>
  );
}

export default AuthPageLayout;