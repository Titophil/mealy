import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Api';
import { useAuth } from '../AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(email, password);
      const success = await login(res.data.token);
      if (success) {
        const isAdmin = res.data.user.role === 'admin';
        navigate(isAdmin ? '/admin' : '/userDashboard');
      } else {
        setError('Failed to authenticate token');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <p className="subtitle">Welcome back! Please enter your credentials.</p>
        {(error || authError) && <p className="error">{error || authError}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="signup-link-text">
          Don’t have an account? <a href="/register">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;