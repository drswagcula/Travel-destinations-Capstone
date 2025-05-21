import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth(); // Get login status, username, and logout function

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value;
    console.log('Searching for:', searchTerm);
    // In a real app, you'd navigate to a search results page:
    // navigate(`/search?q=${searchTerm}`);
    alert(`Searching for: ${searchTerm} (Functionality not fully implemented)`);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the homepage (login screen) after logout
  };

  return (
    <header>
      <h1><Link to="/">YourTravel</Link></h1>
      <nav>
        <form onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search destinations..." />
          <button type="submit">Search</button>
        </form>

        {/* Conditional Rendering based on login status */}
        {isLoggedIn ? (
          <>
            <span className="logged-in-username">Hello, {username}!</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            {/* You can add a link to the profile page here too */}
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;