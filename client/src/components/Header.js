import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// Assuming you have a CSS file for your header styling
import '../css/style.css';

function Header() {
    const navigate = useNavigate();
    // FIX: Destructure 'user' from useAuth
    const { isLoggedIn, username, logout, user } = useAuth(); 

    const handleSearch = (event) => {
        event.preventDefault();
        const searchTerm = event.target.elements.search.value.trim();

        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            event.target.elements.search.value = '';
        } else {
            alert("Please enter a search term.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="main-header">
            <nav>
                <div className="logo">
                    {/* It was previously 'Your Travel Profile', changed to just 'YourTravel' as in the logo */}
                    <Link to="/profile">YourTravel</Link> 
                </div>
                <ul className="nav-links">
                    <li><Link to="/destinations">Destinations</Link></li>
                  
                    {/* Admin Link - conditionally render only if logged in and user is admin */}
                    {isLoggedIn && user && user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                </ul>

                {/* Search Form - directly integrated */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow">
                    <input type="text" name="search" placeholder="Search destinations..." className="form-control" />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                {/* User Auth Links/Buttons */}
                {isLoggedIn ? (
                    <>
                        {/* Now 'user' is defined, so user.username can be safely accessed */}
                        <span className="logged-in-username">Hello,{user.username || username || 'N/A'}!</span>
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