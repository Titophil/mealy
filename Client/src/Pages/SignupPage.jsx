import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signupUser } from '../Api/Api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setSignupError('');
    try {
      const response = await signupUser(data);
      login(response.token, response.user);

      const isAdminEmail = data.email.endsWith('.admin@gmail.com');
      if (isAdminEmail) {
        navigate('/admin');
      } else {
        navigate('/login');
      }

    } catch (error) {
      setSignupError(error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} placeholder="Name" required />
        <input {...register('email')} type="email" placeholder="Email" required />
        <input {...register('password')} type="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {signupError && <p>{signupError}</p>}
      </form>
    </div>
  );
};

export default SignupPage;
