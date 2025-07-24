import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { signupUser } from '../../api/auth';
import './SignupPage.css';

const SignupPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');
  const [loading, setLoading] = useState(false);

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    setSignupError('');
    try {
      const response = await signupUser(data);
      // login(response.token, response.user);
      navigate('/login');
    } catch (error) {
      setSignupError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Join Mealy Today!</h2>
        <p>Create your account to start ordering delicious meals.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>

          {signupError && <p>{signupError}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;