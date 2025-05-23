import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/style.css';

function HomePage() {
    console.log("HomePage component is rendering!");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("HomePage: handleSubmit called.");
        console.log("HomePage: Email state:", email);
        console.log("HomePage: Password state:", password);

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

    if (isLoggedIn) {
        console.log("HomePage: User is already logged in.");
        return (
            <main>
                <section>
                    <h2>Welcome Back!</h2>
                    <p>You are already logged in. Go to your <Link to="/profile">Profile Page</Link>.</p>
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
                {/* REMOVED: <p className="form-text">Are you an admin/engineer? <Link to="/admin_login" className="form-link">Admin/Engineer Login</Link></p> */}
            </section>
        </main>
    );
}

export default HomePage;