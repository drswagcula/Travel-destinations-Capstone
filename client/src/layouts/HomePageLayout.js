// src/layouts/HomePageLayout.js
import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth

function HomePageLayout() {
    const navigate = useNavigate();
    // const location = useLocation(); // Not needed if Z button shows on homepage when logged out
    const { isLoggedIn } = useAuth(); // Get isLoggedIn state from AuthContext

    const handleAdminTrigger = () => {
        // This function navigates to the admin login page
        navigate('/admin_login');
    };

    // Removed the homepage check here to make it simpler,
    // as per your request "only show when im not logged in"
    // const isHomePage = location.pathname === '/';
    // const shouldShowZButton = !isHomePage && !isLoggedIn; // Old logic

    // New logic for showing the Z button: ONLY if the user is NOT logged in
    const shouldShowZButton = !isLoggedIn;

    return (
        <div className="homepage-background">
            <div className="overlay"></div>

            {/* This renders the content of your nested route (e.g., HomePage.js) */}
            <Outlet />

            {/* Conditionally render the 'Z' button based on new logic */}
            {shouldShowZButton && (
                <div className="admin-trigger" onClick={handleAdminTrigger}>
                    Z
                </div>
            )}
        </div>
    );
}

export default HomePageLayout;