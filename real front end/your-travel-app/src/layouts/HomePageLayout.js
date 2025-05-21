// src/layouts/HomePageLayout.js
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet

function HomePageLayout() {
    const navigate = useNavigate();

    const handleAdminTrigger = () => {
        // Keep this if you want the 'Z' trigger to be part of the layout
        navigate('/admin_login');
    };

    return (
        <div className="homepage-background">
            <div className="overlay"></div>

            {/* This is where the content of your nested route (e.g., HomePage.js) will be rendered */}
            <Outlet /> {/* <-- THIS IS CRUCIAL: It renders the child component */}

            {/* The admin trigger can remain here as it's part of the layout's interaction */}
            <div className="admin-trigger" onClick={handleAdminTrigger}>
                Z
            </div>
        </div>
    );
}

export default HomePageLayout;