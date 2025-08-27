import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";

function Login({ setIsAuthenticated, setUserRole }) {  // Ajout de setUserRole dans les props
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);  // Ajout d'un état pour le loading
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        
        if (!email || !password) {
            return handleError('Email and password are required');
        }

        setLoading(true);  // Activation du loading

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            if (result.success && result.token) {
                handleSuccess(result.message);
                localStorage.setItem('token', result.token);
                localStorage.setItem('loggedInUser', result.user.name);
                
                // Stockage des informations supplémentaires de l'utilisateur
                localStorage.setItem('userData', JSON.stringify({
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role || 'user'  // Par défaut 'user' si le rôle n'est pas défini
                }));
                
                setIsAuthenticated(true);
                setUserRole(result.user.role || 'user');  // Mise à jour du rôle dans l'état
                
                // Redirection en fonction du rôle
                if (result.user.role === 'admin') {
                    navigate('/admin');  // Redirection vers le dashboard admin
                } else {
                    navigate('/home');  // Redirection vers la page d'accueil pour les utilisateurs normaux
                }
            } else {
                handleError(result.message || 'Login failed');
            }
        } catch (err) {
            handleError(err.message || 'An error occurred during login');
            console.error('Login error:', err);
        } finally {
            setLoading(false);  // Désactivation du loading
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="auth-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={handleChange}
                            type="email"
                            name="email"
                            autoFocus
                            placeholder="Enter your email.."
                            value={loginInfo.email}
                            className="form-input"
                            disabled={loading}  // Désactivation pendant le chargement
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password.."
                            value={loginInfo.password}
                            className="form-input"
                            disabled={loading}  // Désactivation pendant le chargement
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}  // Désactivation pendant le chargement
                    >
                        {loading ? 'Logging in...' : 'Login'}  
                    </button>
                    <div className="auth-link">
                        Don't have an account? <Link to="/signup">Signup</Link>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </Container>
    );
}

export default Login;