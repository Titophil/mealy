import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken, removeToken } from '../auth/authUtils';
import { signupUser, loginUser } from '../Api/Api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setIsAuthenticated(true);
          // The backend identity is the main payload, not nested in 'sub'
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
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
      if (!access_token || !user) throw new Error('Invalid signup response');
      setToken(access_token);
      setIsAuthenticated(true);
      setUser(user); // The user object from the response is complete
      return response; // Return the full response for navigation
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const { access_token, user } = response.data;
      if (!access_token || !user) throw new Error('Invalid login response');
      setToken(access_token);
      setIsAuthenticated(true);
      setUser(user);
      return response; // Return the full response for navigation
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
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