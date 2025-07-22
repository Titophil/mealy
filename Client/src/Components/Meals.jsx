import React, { useEffect, useState } from "react";
import './admin.css';
import axios from "axios";


export default function Meals() {
 const [menu, setMenu] = useState(null);
 const [error, setError] = useState("");
 const today = new Date().toISOString().slice(0, 10);


 useEffect(() => {
   axios.get(`http://localhost:5000/menu/${today}`)
     .then((response) => {
       setMenu(response.data);
     })
     .catch((error) => {
       console.error("Error fetching today's menu:", error);
       setError("Failed to load today's menu.");
     });
 }, []);


 const markAsDone = (index) => {
   const updatedItems = [...menu.items];
   updatedItems[index] = { name: updatedItems[index].name, status: "Done" };


   axios.put(`http://localhost:5000/menu/${menu.id}/update`, { items: updatedItems })
     .then(() => {
       setMenu(prev => ({ ...prev, items: updatedItems }));
     })
     .catch(err => {
       console.error("Failed to update item status:", err);
       alert("Failed to update item.");
     });
 };


 return (
   <div className="meals-container">
     <h2 className="meals-title">Today's Menu ({today})</h2>


     {error && <p className="error-message">{error}</p>}


     {!menu ? (
       <p>No menu available for today.</p>
     ) : (
       <div className="menu-card">
         <h3>{menu.menu_date}</h3>
         <ul>
           {menu.items.map((item, index) => (
             <li key={index} className="menu-item">
               <span>{item.name ?? item} — {item.status === "Done" ? "✅" : "❌"}</span>
               {item.status !== "Done" && (
                 <button className="mark-done-btn" onClick={() => markAsDone(index)}>
                   Mark as Done
                 </button>
               )}
             </li>
           ))}
         </ul>
       </div>
     )}
   </div>
 );
}
