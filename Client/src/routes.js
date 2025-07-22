import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import UserDashboard from './pages/user/UserDashboard';
import OrderHistory from './pages/user/OrderHistory';
import PrivateRoute from './auth/PrivateRoute';

import PublicLandingPage from './pages/public/PublicLandingPage';


const AppRoutes = () => {
  return (
    <Routes>
      {}
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {}
      {}


      {}
      <Route element={<PrivateRoute />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/orders" element={<OrderHistory />} />
        {}
        {}
        {}
        {}
      </Route>

      {}
      <Route element={<PrivateRoute />}>
        {}
        {}
      </Route>

      {}
      <Route path="*" element={<h2>404: Page Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;