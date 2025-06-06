// components/ZButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext'; // No longer needed for this functionality

function ZButton() {
    // We no longer need to check isLoggedIn or user roles
    // const { isLoggedIn, user } = useAuth();

    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate directly to the Admin Login page
        navigate('/admin_login');
    };

    // The button will always be rendered, as it's for everyone to see
    return (
        <button className="btn-z" onClick={handleClick}>
            Z
        </button>
    );
}

export default ZButton;