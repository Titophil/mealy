import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import MealList from "./Components/MealList";
import MealForm from "./Components/MealForm";
import React from "react";
import NotFound from "./Components/NotFound";

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
    path: "*",
    element: <NotFound />,
  },
];
