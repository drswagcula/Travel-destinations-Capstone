import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // Import SignupPage
import DestinationPage from './pages/DestinationPage'; // Import DestinationPage
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItemsPage from './pages/admin/AdminItemsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage'; // Import AdminUsersPage
import Footer from './components/Footer'; // Import Footer

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
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> {/* Route for Signup */}
          <Route path="/destination/:id" element={<DestinationPage />} /> {/* Route for Destination Detail */}

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Admin and Engineer Specific Routes */}
          <Route path="/admin_login" element={<AdminLoginPage />} />
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

          {/* Fallback for unknown routes */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
        <Footer /> {/* Include Footer */}
      </AuthProvider>
    </Router>
  );
}

export default App;