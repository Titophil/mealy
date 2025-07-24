import React, { createContext, useState, useEffect, useContext } from 'react';
import { setToken, getToken, removeToken } from './authUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    
    const token = getToken();
    if (token) {
      
      setIsAuthenticated(true);
      
      setUser({  });
    }
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    removeToken(); 
    setIsAuthenticated(false);
    setUser(null)
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