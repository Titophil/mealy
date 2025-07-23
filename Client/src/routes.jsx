import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import OrderHistory from './pages/user/OrderHistory.jsx';
import PrivateRoute from './auth/PrivateRoute.jsx';
import PublicLandingPage from './pages/public/PublicLandingPage.jsx';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/orders" element={<OrderHistory />} />
      </Route>

      <Route path="*" element={<h2>404: Page Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;