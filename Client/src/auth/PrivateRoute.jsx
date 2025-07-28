import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const PrivateRoute = () => {
  const { user, token } = useAuth();
  const { isAuthenticated } = useAuth();

  return (user && token)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
