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
    const user = users.find(u => u.email === email);
    console.log("Found user:", user);

    // For dummy login, we check if user exists and password is 'password'
    if (user && password === 'password') { // Assuming all dummy users have 'password' as their password
      console.log("Login successful! User:", user);
      setIsLoggedIn(true);
      setUsername(user.name);
      setUserRole(user.role);
      setCurrentUser(user); // Store the full user object

      // Store login state in localStorage
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', user.name);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('user', JSON.stringify(user)); // Store full user object

      return { success: true, message: 'Login successful!' }; // <-- ADD THIS RETURN STATEMENT
    } else {
      console.log("Login failed. User found:", !!user, "Password match:", password === 'password');
      return { success: false, message: 'Invalid credentials.' };
    }
  };

  // Assuming you also need a register function for SignupPage
  const register = ({ name, email, password, role = 'user' }) => {
    const users = getDummyUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`, // Simple unique ID
      name,
      email,
      password, // In a real app, hash this!
      role,
      reviewCount: 0,
      comments: [], // Assuming users might have comments
      reviews: [] // Assuming users might have reviews
    };
    users.push(newUser);
    localStorage.setItem('dummyUsers', JSON.stringify(users)); // Update dummy users in localStorage
    return { success: true, message: 'Registration successful!' };
  };


  const logout = () => {
    localStorage.clear(); // Clear all auth related items
    setIsLoggedIn(false);
    setUsername('Traveler');
    setUserRole('guest');
    setCurrentUser(null); // Clear current user
  };

  const authState = {
    isLoggedIn,
    username,
    userRole,
    user: currentUser, // Provide the full user object
    login,
    logout,
    register, // Add register to the context
    updateUser, // Add updateUser to the context
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