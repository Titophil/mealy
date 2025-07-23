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

export const appRoutes = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { index: true, element: <Overview /> },
      { path: "overview", element: <Overview /> },
      { path: "orders", element: <OrdersCard /> },
      { path: "meals", element: <Meals /> },
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

export default appRoutes;
