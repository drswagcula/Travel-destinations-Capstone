import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);
    if (result.success && (result.role === 'admin' || result.role === 'engineer')) {
      navigate('/admin/dashboard');
    } else if (result.success) {
        alert('You do not have admin/engineer privileges.');
        navigate('/'); // Logged in but not admin, send to regular homepage
    } else {
      alert(result.message);
    }
  };

  return (
    <main>
      <section id="admin-login-form" className="login-box-container">
        <div className="login-box">
          <h2>Admin / Engineer Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email">Email:</label>
              <input
                type="email"
                id="admin-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password">Password:</label>
              <input
                type="password"
                id="admin-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Log In as Admin/Engineer</button>
          </form>
          <p><Link to="/">Back to Homepage</Link></p>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;