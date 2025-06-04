import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/style.css';

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, authLoading } = useAuth(); // Added authLoading
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("SignupPage: Attempting registration for email:", email);

        // The actual registration logic is now in AuthContext
        const result = await register({ name, email, password, role: 'user' });

        if (result.success) {
            console.log("SignupPage: Registration successful, navigating to /login");
            alert('Account created successfully! Please log in.');
            navigate('/login');
        } else {
            console.log("SignupPage: Registration failed, showing alert:", result.message);
            alert(result.message || 'Signup failed.');
        }
    };

    // If auth is still loading, show a loading message
    if (authLoading) {
        return (
            <main>
                <section id="signup-form">
                    <h2>Loading...</h2>
                    <p>Checking authentication status.</p>
                </section>
            </main>
        );
    }

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