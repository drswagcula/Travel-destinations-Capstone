import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Ensure this path is correct

// Import Layouts
import HomePageLayout from './layouts/HomePageLayout';
import AuthPageLayout from './layouts/AuthPageLayout';
import MainLayout from './layouts/MainLayout';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItemsPage from './pages/admin/AdminItemsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';

// Import the new ZButton component
import ZButton from './components/ZButton'; // Make sure the path is correct

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
                {/* Routes are defined here */}
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
                        {/* If you have an engineer-specific tools page */}
                        <Route path="/engineer-tools" element={
                            <ProtectedRoute allowedRoles={['engineer']}>
                                {/* Replace with your actual Engineer Tools Component */}
                                <h2>Engineer Tools Page (Placeholder)</h2>
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<h2>404 Not Found</h2>} />
                </Routes>

                {/* The ZButton is rendered here, outside of the Routes */}
                {/* This ensures it's always present in the DOM, allowing fixed positioning */}
                {/* It will automatically show/hide based on user role via its internal logic */}
                <ZButton />

            </AuthProvider>
        </Router>
    );
}

export default App;