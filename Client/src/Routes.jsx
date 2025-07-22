import NotFound from "./Components/NotFound";
import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import MealList from "./Components/MealList";
import MealForm from "./Components/MealForm";
import React from "react";

export const appRoutes = [
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
      { path: "meals", element: <MealList /> },
      { path: "meals/add", element: <MealForm /> },
      { path: "revenue", element: <Revenue /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default appRoutes;
