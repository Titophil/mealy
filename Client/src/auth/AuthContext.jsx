import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { setToken, getToken, removeToken } from './authUtils';

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
          logout(); // token expired
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
        console.error("Invalid token:", err.message);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      setToken(token);
      setIsAuthenticated(true);
      setUser({
        id: decoded.id || decoded.sub?.id,
        email: decoded.email || decoded.sub?.email,
        name: decoded.name || decoded.sub?.name,
        role: decoded.role || decoded.sub?.role,
      });
    } catch (err) {
      console.error("Login failed:", err.message);
      logout();
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

export const useAuth = () => useContext(AuthContext);
