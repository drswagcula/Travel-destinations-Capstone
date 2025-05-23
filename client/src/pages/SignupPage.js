import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming signup also uses AuthContext for register

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth(); // Assuming a register function in AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // In a real app, you'd send this to a backend for user creation
    // For now, let's use a dummy register if you have one, or just navigate
    const result = await register({ name, email, password, role: 'user' }); // Assuming default 'user' role
    if (result.success) {
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } else {
      alert(result.message || 'Signup failed.');
    }
  };

  return (
    <section id="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      <p className="form-text">Already have an account? <Link to="/login" className="form-link">Log In</Link></p>
    </section>
  );
}

export default SignupPage;