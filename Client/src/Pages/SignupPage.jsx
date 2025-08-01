import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signupUser } from '../Api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './SignupPage.css';

const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setSignupError('');
    try {
      const response = await signupUser(data);
      const success = await login(response.data.access_token);
      if (success) {
        const isAdmin = response.data.user.role === 'admin';
        navigate(isAdmin ? '/admin' : '/userDashboard');
      } else {
        setSignupError('Failed to authenticate token');
      }
    } catch (error) {
      setSignupError(error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <p className="subtitle">Create your account to get started</p>
        {(signupError || authError) && <p className="error">{signupError || authError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="Enter a password"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="login-link-text">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;