import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/style.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("LoginPage: Attempting login for email:", email);

        const result = await login(email, password);
        if (result.success) {
            console.log("LoginPage: Login successful, navigating to /profile");
            navigate('/profile');
        } else {
            console.log("LoginPage: Login failed, showing alert:", result.message);
            alert(result.message);
        }
    };

    if (authLoading) {
        return (
            <main>
                <section id="login-form">
                    <h2>Loading authentication...</h2>
                    <p>Please wait.</p>
                </section>
            </main>
        );
    }

    return (
        <section id="login-form" className="login-page-container">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary">Log In</button>
            </form>
            <p className="form-text">Don't have an account? <Link to="/signup" className="form-link">Sign Up</Link></p>
        </section>
    );
}

export default LoginPage;