// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Get API_BASE_URL from environment variables for Create React App.
// It falls back to a default localhost URL for development if not set.
// This line has been corrected to remove import.meta.env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Optional: Log a warning if the API_BASE_URL is still not found, useful during development
if (!API_BASE_URL) {
  console.warn("AuthContext: REACT_APP_API_BASE_URL environment variable is not set. Please check your .env file or build configuration.");
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user object from backend
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'user', 'admin', 'engineer'
    const [authLoading, setAuthLoading] = useState(true); // New state for auth loading

    // Initialize auth state from session storage on mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const storedUserRole = sessionStorage.getItem('userRole');

        if (storedUser && storedIsLoggedIn && storedUserRole) {
            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(storedIsLoggedIn);
                setUserRole(storedUserRole);
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                logout(); // Clear corrupted data
            }
        }
        setAuthLoading(false); // Auth initialization complete
    }, []);

    // Function to fetch user details from backend (e.g., after login or refresh)
    const fetchUserProfile = async (userId) => {
        try {
            // Include authorization header for protected routes
            const token = sessionStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const userData = await response.json();
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
            return { success: true, user: userData };
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return { success: false, message: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { user: loggedInUser, token } = data;
                setUser(loggedInUser);
                setIsLoggedIn(true);
                setUserRole(loggedInUser.role);

                sessionStorage.setItem('user', JSON.stringify(loggedInUser));
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userRole', loggedInUser.role);
                if (token) {
                    sessionStorage.setItem('authToken', token);
                }

                return { success: true, user: loggedInUser, role: loggedInUser.role };
            } else {
                return { success: false, message: data.message || 'Login failed.' };
            }
        } catch (error) {
            console.error('Login API call failed:', error);
            return { success: false, message: 'Network error or server unreachable.' };
        }
    };

    const register = async ({ name, email, password, role = 'user' }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message || 'Registration successful!' };
            } else {
                return { success: false, message: data.message || 'Registration failed.' };
            }
        } catch (error) {
            console.error('Registration API call failed:', error);
            return { success: false, message: 'Network error or server unreachable.' };
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        setUserRole(null);
        sessionStorage.clear();
        // In a real app, you might also hit a backend logout endpoint here
        // await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    };

    const updateUser = async (updatedUserData) => {
        try {
            const token = sessionStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/users/${updatedUserData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(updatedUserData),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                return { success: true, message: 'Profile updated successfully!' };
            } else {
                return { success: false, message: data.message || 'Failed to update profile.' };
            }
        } catch (error) {
            console.error('Update profile API call failed:', error);
            return { success: false, message: 'Network error or server unreachable.' };
        }
    };

    if (authLoading) {
        return <div>Loading authentication...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, userRole, login, register, logout, updateUser, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);