// HomePage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/style.css';

function HomePage() {
    console.log("HomePage component is rendering!");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggedIn, authLoading, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("HomePage: handleSubmit called.");
        console.log("HomePage: Attempting login for email:", email);

        const result = await login(email, password);

        console.log("HomePage: Login result:", result);

        if (result.success) {
            console.log("HomePage: Login successful, navigating to /profile");
            navigate('/profile');
        } else {
            console.log("HomePage: Login failed, showing alert:", result.message);
            alert(result.message);
        }
    };

    // isAdminOrEngineer is still useful here if you need other conditional elements
    // based on role within HomePage itself, but not for the Z button anymore.
    const isAdminOrEngineer = user && (user.role === 'admin' || user.role === 'engineer');
    console.log("HomePage: Current user:", user);
    console.log("HomePage: Is Admin or Engineer:", isAdminOrEngineer);

    if (authLoading) {
        return (
            <main>
                <section id="home-login-form">
                    <h2>Loading...</h2>
                    <p>Checking authentication status.</p>
                </section>
            </main>
        );
    }

    if (isLoggedIn) {
        console.log("HomePage: User is already logged in.");
        return (
            <main>
                <section>
                    <h2>Welcome Back!</h2>
                    <p>You are already logged in. Go to your <Link to="/profile">Profile Page</Link>.</p>
                    {/* Removed Z button from here */}
                </section>
            </main>
        );
    }

    console.log("HomePage: User is not logged in, displaying login form.");
    return (
        <main>
            <section id="home-login-form">
                <h2>Log In to Your Travel Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="home-email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="home-email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="home-password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="home-password"
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
            {/* Removed Z button from here */}
        </main>
    );
}

export default HomePage;