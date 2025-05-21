import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/style.css'; // Make sure your CSS is imported

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/'); // Redirect to main page or dashboard
    } else {
      alert(result.message);
    }
  };

  return (
    <section id="login-form">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"> {/* Added form-group class */}
          <label htmlFor="email" className="form-label">Email:</label> {/* Added form-label class */}
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control" // Added form-control class
            required
          />
        </div>
        <div className="form-group"> {/* Added form-group class */}
          <label htmlFor="password" className="form-label">Password:</label> {/* Added form-label class */}
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control" // Added form-control class
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Log In</button> {/* Added btn btn-primary classes */}
      </form>
      <p className="form-text">Don't have an account? <Link to="/signup" className="form-link">Sign Up</Link></p> {/* Added form-text and form-link classes */}
    </section>
  );
}

export default LoginPage;