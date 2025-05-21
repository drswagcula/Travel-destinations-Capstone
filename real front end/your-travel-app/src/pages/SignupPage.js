import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDummyUsers, setDummyUsers } from '../data';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Note: Passwords are NOT hashed here - INSECURE!
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const users = getDummyUsers();
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      alert('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: `user${Date.now()}`, // Simple unique ID
      email: email,
      role: 'user', // Default role for new signups
      reviewCount: 0,
      name: name || email.split('@')[0], // Use name if provided, otherwise part of email
      // Password is not stored directly, but conceptually would be hashed and stored securely
    };

    const updatedUsers = [...users, newUser];
    setDummyUsers(updatedUsers); // Update localStorage

    alert('Sign up successful! Please log in.');
    navigate('/login'); // Redirect to login page
  };

  return (
    <main>
      <section id="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-name">Full Name (Optional):</label>
            <input
              type="text"
              id="signup-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="signup-email">Email:</label>
            <input
              type="email"
              id="signup-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password">Password:</label>
            <input
              type="password"
              id="signup-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small>Note: For this demo, any password works with login.</small>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </section>
    </main>
  );
}

export default SignupPage;