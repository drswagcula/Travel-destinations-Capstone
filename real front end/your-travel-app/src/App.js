import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // <--- REMOVE 'Outlet' from here
import { AuthProvider, useAuth } from './AuthContext';

// ... rest of your App.js code

// Import Layouts
import HomePageLayout from './layouts/HomePageLayout';
import AuthPageLayout from './layouts/AuthPageLayout';
import MainLayout from './layouts/MainLayout';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DestinationPage from './pages/DestinationPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItemsPage from './pages/admin/AdminItemsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// A simple wrapper for protected routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    alert('Access Denied. Insufficient permissions.');
    return <Navigate to="/" replace />; // Redirect to home or another page
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Layouts */}
          <Route path="/" element={<HomePageLayout />} />
          <Route element={<AuthPageLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin_login" element={<AdminLoginPage />} />
          </Route>

          {/* Main App Layout (requires Header, Main Content, Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/destinations" element={
              // Placeholder: In a real app, this would be a list of destinations
              // For now, let's redirect to the first destination as a placeholder
              <Navigate to="/destination/paris" replace />
            } />
            <Route path="/destination/:id" element={<DestinationPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Admin and Engineer Specific Routes */}
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