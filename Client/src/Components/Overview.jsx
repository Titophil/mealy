
import React, { useEffect, useState } from "react";
import './admin.css';
import { useNavigate } from "react-router-dom";
import RevenueChart from './Revenue'; // You’ll create this next
import OrdersCard from "./OrdersCard";



export default function Overview() {
 const navigate = useNavigate();
 const [data, setData] = useState({
   pending_orders: 0,
   todays_revenue: 0,
   available_meals: 0,
 });


 useEffect(() => {
   fetch("/admin/overview", {
     headers: {
       Authorization: `Bearer ${localStorage.getItem('token')}`
     }
   })
     .then(res => res.json())
     .then(setData)
     .catch(err => console.error("Failed to fetch dashboard data", err));
 }, []);


 const sections = [
   {
     title: "Orders",
     path: "/admin/orders",
     value: data.pending_orders
   },
   {
     title: "Today's Revenue",
     path: "/admin/revenue",
     value: `Ksh ${data.todays_revenue.toFixed(2)}`
   },
   {
     title: "Available Meals",
     path: "/admin/meals",
     value: data.available_meals
   }
 ];


 return (
   <div className="overview-container">
     <div className="dashboard-cards">
       {sections.map((section, i) => (
         <div
           key={i}
           className="dashboard-card"
           onClick={() => navigate(section.path)}
         >
           <h3>{section.title}</h3>
           <p>{section.value}</p>
         </div>
       ))}
     </div>


     <div className="overview-widgets">
       <div className="revenue-chart-container">
         <RevenueChart />
       </div>
       <div className="orders-card-container">
         <OrdersCard/>
       </div>
     </div>
   </div>
 );
}


