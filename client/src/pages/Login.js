import React, { useState } from 'react';
import axios from '../axios'; 
import { useNavigate } from 'react-router-dom';
import './first.css'; 

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); 

        try {
            if (isLogin) {
                const response = await axios.post('/api/users/login', { email, password });
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                const response = await axios.post('/api/users/register', { name, email, password,confirmPassword });
                localStorage.setItem('token', response.data.token);
                 setIsLogin(true);  
                setEmail(''); 
                setPassword('');
                setName('');
                setConfirmPassword('');
            }
        } catch (err) {
          console.log(err)
            setError(err.response?.data?.message || 'An error occurred');
            console.error('Auth error:', err);
        }
    };

    return (
        <section className="wrapper">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <div className="login-signup-container">
                <div className="brand">
                    <p>Let's Begin</p>
                </div>
                <div className="form-container">
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <div className="input-field">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="input-field">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <div className="input-field">
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                    </form>
                    <button className="google-login">Sign in with Google</button>
                    <p onClick={handleToggle} className="toggle-link">
                        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;
