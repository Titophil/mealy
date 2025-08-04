// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, signupUser } from '../Api/Api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const token = response.data.access_token || response.data.token;
      const user = response.data.user;

      if (!token || !user) throw new Error('Invalid login response');

      setToken(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await signupUser(name, email, password, role);
      const token = response.data.access_token || response.data.token;
      const user = response.data.user;

      if (!token || !user) throw new Error('Invalid signup response');

      setToken(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
