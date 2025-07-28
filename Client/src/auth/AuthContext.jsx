// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { setToken, getToken, removeToken } from './authUtils';
import { jwtDecode } from 'jwt-decode'; // Ensure this import is correct

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired.");
          removeToken();
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setIsAuthenticated(true);
          // When component mounts, user data is decoded from the token
          setUser({
            id: decoded.sub.id || decoded.id,
            email: decoded.sub.email || decoded.email,
            name: decoded.sub.name || decoded.name,
            role: decoded.sub.role || decoded.role
          });
        }
      } catch (err) {
        console.error("Invalid token on mount:", err); // Specific message for clarity
        removeToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  // Corrected: login function accepts both token and userData
  const login = (token, userData) => {
    setToken(token); // Store the raw token string
    try {
      const decoded = jwtDecode(token); // Attempt to decode the token string
      setIsAuthenticated(true);
      // Use provided userData if available, otherwise decode from token's 'sub' claim
      setUser(userData || {
        id: decoded.sub.id || decoded.id, // Handle 'sub' structure from Flask-JWT-Extended
        email: decoded.sub.email || decoded.email,
        name: decoded.sub.name || decoded.name,
        role: decoded.sub.role || decoded.role
      });
    } catch (err) {
      console.error("Failed to decode token after login:", err); // Original error point
      removeToken(); // Clear token if invalid
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};