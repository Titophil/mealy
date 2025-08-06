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


// User pages
import OrderForm from "./Pages/OrderForm";
import TodaysOrder from "./Pages/TodaysOrder";
import UserDashboard from "./Pages/UserDashboard.jsx";
import OrderHistory from "./Pages/OrderHistory.jsx";



// Shared
import PrivateRoute from "./auth/PrivateRoute.jsx";
import NotFound from "./Components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected User Routes (already using PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/user/orders" element={<OrderHistory />} />
        <Route path="/user/order" element={<OrderForm />} />
        <Route path="/user/order/current" element={<TodaysOrder />} />
        <Route path="/menu" element={<Menuviewer />} />
        <Route path="/order" element={<OrderForm />} />
      </Route>

 
      <Route element={<PrivateRoute requiredRole="admin" />}>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Overview />} /> 
          <Route path="overview" element={<Overview />} /> 
          <Route path="orders" element={<OrdersCard />} /> 
          <Route path="meals" element={<Meals />} /> 
          <Route path="meals/add" element={<MealForm />} /> 
          <Route path="menu-viewer" element={<Menuviewer />} /> 
          <Route path="revenue" element={<Revenue />} /> 
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
