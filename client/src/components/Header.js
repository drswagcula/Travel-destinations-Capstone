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
      <h1><Link to="/">YourTravel</Link></h1> {/* "YourTravel" link is always present */}
      <nav>
        {/* Search bar and Search button are always present */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow">
          <input type="text" name="search" placeholder="Search destinations..." className="form-control" />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Conditional Rendering based on login status */}
        {isLoggedIn ? (
          <>
            <span className="logged-in-username">Hello, {username}!</span>
            <button onClick={handleLogout} className="btn btn-danger logout-button">Logout</button>
            {/* Removed the <Link to="/profile">Profile</Link> here as requested */}
          </>
        ) : (
          <>
            <Link to="/login" className="form-link">Log In</Link>
            <Link to="/signup" className="form-link">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;