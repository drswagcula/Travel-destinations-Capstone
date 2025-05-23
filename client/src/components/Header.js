import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value.trim(); // Added .trim() to remove whitespace

    if (searchTerm) { // Only navigate if a search term is provided
      console.log('Searching for:', searchTerm);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`); // Navigate to a search results page
    } else {
      alert("Please enter a search term."); // Alert if search term is empty
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <h1><Link to="/destinations">YourTravel</Link></h1>
      <nav>
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow">
          <input type="text" name="search" placeholder="Search destinations..." className="form-control" />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {isLoggedIn ? (
          <>
            <span className="logged-in-username">Hello, {username}!</span>
            <button onClick={handleLogout} className="btn btn-danger logout-button">Logout</button>
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