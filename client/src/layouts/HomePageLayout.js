// src/layouts/HomePageLayout.js
import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation

function HomePageLayout() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location object

    const handleAdminTrigger = () => {
        // This function navigates to the admin login page
        navigate('/admin_login');
    };

    // Determine if the current page is the homepage (path is '/')
    const isHomePage = location.pathname === '/';

    return (
        <div className="homepage-background">
            <div className="overlay"></div>

            {/* This renders the content of your nested route (e.g., HomePage.js) */}
            <Outlet />

            {/* Conditionally render the 'Z' button */}
            {/* It will only show if it's NOT the homepage */}
            {!isHomePage && (
                <div className="admin-trigger" onClick={handleAdminTrigger}>
                    Z
                </div>
            )}
        </div>
    );
}

export default HomePageLayout;