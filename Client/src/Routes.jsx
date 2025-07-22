import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";
import NotFound from "./Components/NotFound";

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
    path: "*",
    element: <NotFound />,
  },
];
