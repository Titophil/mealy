import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { setToken, getToken, removeToken } from './authUtils';
import { signupUser, loginUser } from '../Api/Api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token && typeof token === 'string') {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout(); // Token expired
        } else {
          setIsAuthenticated(true);
          setUser({
            id: decoded.id || decoded.sub?.id,
            email: decoded.email || decoded.sub?.email,
            name: decoded.name || decoded.sub?.name,
            role: decoded.role || decoded.sub?.role,
          });
        }
      } catch (err) {
        console.error('Invalid token:', err.message);
        logout();
      }
    }
  }, []);

  const signup = async (userData) => {
    try {
      const response = await signupUser(userData);
      const { access_token, user } = response.data;
      setToken(access_token);
      setIsAuthenticated(true);
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      return response;
    } catch (err) {
      console.error('Signup failed:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;
      setToken(token);
      setIsAuthenticated(true);
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      return response;
    } catch (err) {
      console.error('Login failed:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      throw err;
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);