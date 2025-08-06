import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth(); 

 
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (requiredRole && (!user || user.role !== requiredRole)) {

    return <Navigate to="/userdashboard" replace />; 
  }


  return <Outlet />;
};

export default PrivateRoute;
