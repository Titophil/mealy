import React from "react";
import NotFound from "./Components/NotFound";
import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import OrderForm from "./Components/OrderForm";
import TodaysOrder from "./Components/TodaysOrder";
import PrivateRoute from "./Components/PrivateRoute";
import MealList from "./Components/MealList";
import MealForm from "./Components/MealForm";

export const appRoutes = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { index: true, element: <Overview /> },
      { path: "overview", element: <Overview /> },
      { path: "orders", element: <OrdersCard /> },
      { path: "meals", element: <MealList /> },
      { path: "meals/add", element: <MealForm /> },
      { path: "revenue", element: <Revenue /> },
    ],
  },
  {
    path: "/order",
    element: (
      <PrivateRoute>
        <OrderForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/order/current",
    element: (
      <PrivateRoute>
        <TodaysOrder />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
