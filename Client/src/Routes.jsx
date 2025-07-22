import { Navigate } from "react-router-dom";
import NotFound from "./Components/NotFound";
import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import MenuBuilder from "./Components/MenuBuilder";
// import MenuViewer from "../Components/MenuViewer";

import React from "react";

export const appRoutes = [
  {
    path: "/",
    element: <Navigate to="/admin" />, // 👈 Redirect root path
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        index: true, // 👈 This makes /admin default to Overview
        element: <Overview />
      },
      { path: "overview", element: <Overview /> },
      { path: "orders", element: <OrdersCard /> },
      { path: "meals", element: <Meals /> },
      { path: "revenue", element: <Revenue /> },
      { path: "menu-builder", element: <MenuBuilder /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default appRoutes;
