import React, { createContext, useState, useContext, useEffect } from 'react';
import { seedDatabase, getDummyUsers } from './data'; // Import data utilities

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Traveler');
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    // On app load, check localStorage for existing login session
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedLoggedIn && storedUsername && storedUserRole) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedUserRole);
    }

    // Seed database on initial load if not already seeded
    seedDatabase();
  }, []); // Empty dependency array means this runs once on mount

  const login = (email, password) => {
    const users = getDummyUsers();
    const user = users.find(u => u.email === email);

    if (user && password === 'password') { // Dummy password
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', user.name);
      localStorage.setItem('userRole', user.role);
      setIsLoggedIn(true);
      setUsername(user.name);
      setUserRole(user.role);
      return { success: true, role: user.role };
    } else {
      return { success: false, message: 'Invalid credentials.' };
    }
  };

  const logout = () => {
    localStorage.clear(); // Clear all auth related items
    setIsLoggedIn(false);
    setUsername('Traveler');
    setUserRole('guest');
  };

  const authState = {
    isLoggedIn,
    username,
    userRole,
    login,
    logout,
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