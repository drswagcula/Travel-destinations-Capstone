// components/ZButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // <--- Import useAuth

function ZButton() {
    const { isLoggedIn } = useAuth(); // <--- Get isLoggedIn state from AuthContext
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate directly to the Admin Login page
        navigate('/admin_login');
    };

    // If the user is logged in, we return null, meaning the button will not be rendered.
    if (isLoggedIn) {
        return null;
    }

    // If the user is NOT logged in, we render the button.
    return (
        <button className="btn-z" onClick={handleClick}>
            Z
        </button>
    );
}

export default ZButton;