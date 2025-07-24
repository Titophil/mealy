
import React, { useEffect, useState } from "react";
import api from '../Api/Api';
import "./admin.css";


const AdminDashboard = () => {
 const [meals, setMeals] = useState([]);
 const [revenue, setRevenue] = useState(0);
 const [totalOrders, setTotalOrders] = useState(0);
 const [orders, setOrders] = useState([]); // 👈 new
 const [selectedDate, setSelectedDate] = useState(() =>
   new Date().toISOString().slice(0, 10)
 );




 // Meals
 useEffect(() => {
   axios.get(`/api/menu/${selectedDate}`)
     .then((res) => {
       const items = res.data?.items || [];
       setMeals(items);
     })
     .catch((err) => {
       console.error("Meal fetch error:", err);
       setMeals([]);
     });
 }, [selectedDate]);


 // Orders
 useEffect(() => {
   axios.get("/api/admin/order")
     .then((res) => {
       setOrders(res.data || []);
     })
     .catch((err) => {
       console.error("Order fetch error:", err);
     });
 }, []);


 return (
   <div className="dashboard-container">
     <h1>Admin Dashboard</h1>


     {/* Overview */}
     <div className="dashboard-section">
       <h2>Overview</h2>
       <div className="dashboard-cards">
         <div className="dashboard-card">
           <h3>Total Revenue</h3>
           <p>Ksh {revenue}</p>
         </div>
         <div className="dashboard-card">
           <h3>Total Orders</h3>
           <p>{totalOrders}</p>
         </div>
         <div className="dashboard-card">
           <h3>Total Meals</h3>
           <p>{meals.length}</p>
         </div>
         <div className="dashboard-card">
           <h3>Orders Today</h3>
           <p>{orders.length}</p>
         </div>
       </div>
     </div>


     {/* Meals by Date */}
     <div className="dashboard-section">
       <h2>Meals by Date</h2>
       <input
         type="date"
         value={selectedDate}
         onChange={(e) => setSelectedDate(e.target.value)}
         style={{ marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem" }}
       />
       <div className="dashboard-cards">
         {meals.length > 0 ? (
           meals.map((meal, index) => (
             <div className="dashboard-card" key={index}>
               <h3>{meal}</h3>
             </div>
           ))
         ) : (
           <p>No meals found for this date.</p>
         )}
       </div>
     </div>
   </div>
 );
};


export default AdminDashboard;
