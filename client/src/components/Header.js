import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, username, logout } = useAuth();

    const handleSearch = (event) => {
        event.preventDefault();
        // Access the input value directly from the form elements
        const searchTerm = event.target.elements.search.value.trim();

        if (searchTerm) { // Only navigate if a search term is provided
            console.log('Searching for:', searchTerm);
            // Crucial: Ensure the query parameter name matches what SearchResultsPage expects
            // SearchResultsPage expects 'query', so use 'query' here.
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            // Clear the input field after search
            event.target.elements.search.value = ''; 
        } else {
            alert("Please enter a search term."); // Alert if search term is empty
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="main-header"> {/* Added back class from second version */}
            <nav>
                <div className="logo">
                    <Link to="/">YourTravel</Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/destinations">Destinations</Link></li>
                    {/* Add other nav links here if you had them in your original header */}
                    {/* Example: <li><Link to="/about">About</Link></li> */}
                </ul>

                {/* Search Form - directly integrated */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow">
                    <input type="text" name="search" placeholder="Search destinations..." className="form-control" />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                {/* User Auth Links/Buttons */}
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