

import React from "react";
import { Routes, Route } from "react-router-dom";

// Public pages
import PublicLandingPage from "./Pages/PublicLandingPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";

// Admin components
import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Revenue from "./Components/Revenue";
import Meals from "./Components/Meals";
import MealForm from "./Components/MealForm";
import Menuviewer from "./Components/MenuViewer";

// User + Order pages
import OrderForm from "./Pages/OrderForm";
import TodaysOrder from "./Pages/TodaysOrder";
import UserDashboard from "./Pages/UserDashboard.jsx";
import OrderHistory from "./Pages/OrderHistory.jsx";

// Shared components
import PrivateRoute from "./auth/PrivateRoute.jsx";
import NotFound from "./Components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

  {/* Admin Pages */}
  <Route path="/admin" element={<Admin />}>
    <Route index element={<Overview />} />
    <Route path="overview" element={<Overview />} />
    <Route path="orders" element={<OrdersCard />} />
    <Route path="meals" element={<Meals />} />
   
    <Route path="revenue" element={<Revenue />} />
    <Route path="menu-viewer" element={<Menuviewer />} />
  </Route>

  {/* User Private Routes */}
  <Route element={<PrivateRoute />}>
    <Route path="/user/dashboard" element={<UserDashboard />} />
    <Route path="/user/orders" element={<OrderHistory />} />
    <Route path="/user/menu-viewer" element={<Menuviewer />} />
    <Route path="/order" element={<OrderForm />} />
    <Route path="/order/current" element={<TodaysOrder />} />
    
  </Route>

  <Route element={<PrivateRoute />}>
  <Route path="/user/dashboard" element={<UserDashboard />} />
</Route>

  {/* 404 Fallback */}
  <Route path="*" element={<NotFound />} />
</Routes>
  );
};

export default AppRoutes;