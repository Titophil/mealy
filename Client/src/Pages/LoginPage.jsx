
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/AuthContext';
import { loginUser } from '../Api/Api';
import './LoginPage.css';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError(null);


    try {
      const apiResponse = await loginUser(data.email, data.password);
      
      if (apiResponse.data && apiResponse.data.token && apiResponse.data.user) {
        login(apiResponse.data.token, apiResponse.data.user);
        navigate('/user/dashboard');

      } else {
        setLoginError('Login response missing token or user data.');
      }
    } catch (error) {
      console.error("Login attempt failed:", error);
      setLoginError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back to Mealy!</h2>
        <p className="subtitle">Log in to manage your orders.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          {loginError && <p className="error-message server-error">{loginError}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="signup-link-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

    </div>
  );
};


export default LoginPage;

