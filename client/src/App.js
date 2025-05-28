import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Import Layouts
import HomePageLayout from './layouts/HomePageLayout';
import AuthPageLayout from './layouts/AuthPageLayout';
import MainLayout from './layouts/MainLayout';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// REMOVED: import DestinationPage from './pages/DestinationPage'; // This file does not exist
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItemsPage from './pages/admin/AdminItemsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';

// Correct import for the page that lists ALL destinations
import DestinationsPage from './pages/DestinationsPage'; // This is correct, it exists and lists all.

// You NEED a page to display a SINGLE destination's details.
// Assuming you will create this file: src/pages/DestinationDetailPage.js
// If you've named it something else, adjust this import.
import DestinationDetailPage from './pages/DestinationDetailPage';


// A simple wrapper for protected routes
// This component should be defined OUTSIDE the App function to prevent re-creation on every render.
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isLoggedIn, userRole } = useAuth();

    if (!isLoggedIn) {
        // Redirect to login if not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect if user does not have allowed roles
        alert('Access Denied. Insufficient permissions.');
        return <Navigate to="/" replace />; // Redirect to home or another page
    }

    return children; // Render the protected content
};


function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Layouts */}
                    <Route path="/" element={<HomePageLayout />}>
                        <Route index element={<HomePage />} />
                    </Route>

                    <Route element={<AuthPageLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/admin_login" element={<AdminLoginPage />} />
                    </Route>

                    {/* Main App Layout (requires Header, Main Content, Footer) */}
                    <Route element={<MainLayout />}>
                        {/* Route for displaying ALL destinations */}
                        <Route path="/destinations" element={<DestinationsPage />} />

                        {/* Route for displaying a SINGLE destination's details */}
                        {/* This expects you to create src/pages/DestinationDetailPage.js */}
                        <Route path="/destination/:id" element={<DestinationDetailPage />} />

                        {/* Protected Profile Page */}
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />
                        {/* Search Results Page */}
                        <Route path="/search" element={<SearchResultsPage />} />


                        {/* Admin and Engineer Specific Routes (Protected) */}
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute allowedRoles={['admin', 'engineer']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/items" element={
                            <ProtectedRoute allowedRoles={['admin', 'engineer']}>
                                <AdminItemsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                            <ProtectedRoute allowedRoles={['admin', 'engineer']}>
                                <AdminUsersPage />
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<h2>404 Not Found</h2>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;