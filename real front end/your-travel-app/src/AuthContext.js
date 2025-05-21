// In src/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { seedDatabase, getDummyUsers } from './data'; // Import data utilities

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Traveler');
  const [userRole, setUserRole] = useState('guest');
  const [currentUser, setCurrentUser] = useState(null); // Added state to hold the full user object

  useEffect(() => {
    // On app load, check localStorage for existing login session
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve full user object

    if (storedLoggedIn && storedUsername && storedUserRole && storedUser) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedUserRole);
      setCurrentUser(storedUser); // Set current user
    }

    // Seed database on initial load if not already seeded
    seedDatabase();
  }, []); // Empty dependency array means this runs once on mount

  // Added a function to update user data in context and local storage
  const updateUser = (updatedUserData) => {
    setCurrentUser(updatedUserData);
    setUsername(updatedUserData.name); // Update username if name changes
    setUserRole(updatedUserData.role); // Update role if role changes
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    localStorage.setItem('username', updatedUserData.name);
    localStorage.setItem('userRole', updatedUserData.role);
  };

  const login = (email, password) => {
    console.log("Attempting login with email:", email, "and password:", password);
    const users = getDummyUsers();
    console.log("Dummy users:", users);

    // *** MODIFIED LINE HERE: Convert both to lowercase for comparison ***
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    console.log("Found user:", user);

    if (user && password === '0000') {
      console.log("Login successful! User:", user);
      setIsLoggedIn(true);
      setUsername(user.name);
      setUserRole(user.role);
      setCurrentUser(user);

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', user.name);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, message: 'Login successful!', role: user.role };
    } else {
      console.log("Login failed. User found:", !!user, "Password match:", password === '0000');
      return { success: false, message: 'Invalid credentials.' };
    }
  };

  const register = ({ name, email, password, role = 'user' }) => {
    const users = getDummyUsers();
    // Consider adding .toLowerCase() here too for consistency during registration lookup
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(), // Store email as lowercase for consistency
      password,
      role,
      reviewCount: 0,
      comments: [],
      reviews: []
    };
    users.push(newUser);
    localStorage.setItem('dummyUsers', JSON.stringify(users));
    return { success: true, message: 'Registration successful!' };
  };


  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername('Traveler');
    setUserRole('guest');
    setCurrentUser(null);
  };

  const authState = {
    isLoggedIn,
    username,
    userRole,
    user: currentUser,
    login,
    logout,
    register,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};