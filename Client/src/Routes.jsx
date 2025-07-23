import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import PublicLandingPage from "./Pages/PublicLandingPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";

// Admin
import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import MenuBuilder from "./Components/MenuBuilder";

// User & Order
import OrderForm from "./Pages/OrderForm";
import TodaysOrder from "./Pages/TodaysOrder";
import UserDashboard from "./Pages/UserDashboard.jsx";
import OrderHistory from "./Pages/OrderHistory.jsx";

// Auth
import PrivateRoute from "./auth/PrivateRoute.jsx";

// Shared
import NotFound from "./Components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/admin" />} />

      {/* Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/landing" element={<PublicLandingPage />} />

      {/* Admin Pages */}
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="orders" element={<OrdersCard />} />
        <Route path="meals" element={<Meals />} />
        <Route path="menu-builder" element={<MenuBuilder />} />
        <Route path="revenue" element={<Revenue />} />
      </Route>

      {/* User Pages (Protected) */}
      <Route element={<PrivateRoute />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/orders" element={<OrderHistory />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/order/current" element={<TodaysOrder />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
