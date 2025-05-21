import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header() {
  const { isLoggedIn, username, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Navigate to homepage after logout
  };

  return (
    <header>
      <h1>YourTravel</h1>
      <nav>
        <input type="text" placeholder="Search destinations..." />
        <button>Search</button>

        {!isLoggedIn ? (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </>
        ) : (
          <>
            <span className="logged-in-username">Hello, {username}!</span>
            <button onClick={handleLogout}>Log Out</button>
            {(userRole === 'admin' || userRole === 'engineer') && (
              <Link to="/admin/dashboard">Dashboard</Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;