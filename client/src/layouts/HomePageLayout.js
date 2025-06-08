// src/layouts/HomePageLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
function HomePageLayout() {
    return (
        <div className="homepage-background">
            <div className="overlay"></div>
            <Outlet />
        </div>
    );
}
export default HomePageLayout;