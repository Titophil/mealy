import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLandingPage from "./pages/public/PublicLandingPage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import SignupPage from "./pages/public/SignupPage.jsx";

import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import MealList from "./Components/MealList";
import MealForm from "./Components/MealForm";

import OrderForm from "./Components/OrderForm";
import TodaysOrder from "./Components/TodaysOrder";
import PrivateRoute from "./Components/PrivateRoute";

import UserDashboard from "./pages/user/UserDashboard.jsx";
import OrderHistory from "./pages/user/OrderHistory.jsx";
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
        <Route path="meals" element={<MealList />} />
        <Route path="meals/add" element={<MealForm />} />
        <Route path="revenue" element={<Revenue />} />
      </Route>

      {/* User Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/orders" element={<OrderHistory />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/order/current" element={<TodaysOrder />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
