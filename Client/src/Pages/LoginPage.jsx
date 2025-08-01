// src/Pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      

      const token = res.data.token;
      login(token);

      // Redirect based on role
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/userDashboard');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <p className="subtitle">Welcome back! Please enter your credentials.</p>

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
