import NotFound from "./Components/NotFound";
import Admin from "./Pages/Admin";
import Overview from "./Components/Overview";
import OrdersCard from "./Components/OrdersCard";
import Meals from "./Components/Meals";
import Revenue from "./Components/Revenue";

export const appRoutes = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
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

export default appRoutes;
