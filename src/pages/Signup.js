import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import { handleError, handleSuccess } from "../utils";

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        
        if (!name || !email || !password) {
            return handleError('Name, email and password are required');
        }

        try {
            const response = await fetch("http://localhost:8000/auth/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });

            const result = await response.json();
            const { success, message, error } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0]?.message;
                handleError(details || 'Validation error');
            } else {
                handleError(message || 'Signup failed');
            }
        } catch (err) {
            handleError(err.message || 'An error occurred during signup');
            console.error('Signup error:', err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="auth-container">
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="name"
                            autoFocus
                            placeholder="Enter your name.."
                            value={signupInfo.name}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email.."
                            value={signupInfo.email}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password.."
                            value={signupInfo.password}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="auth-button">Signup</button>
                    <div className="auth-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </Container>
    );
}

export default Signup;