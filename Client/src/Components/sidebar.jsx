// Sidebar.jsx
import { NavLink } from 'react-router-dom';
import './admin.css';


export default function Sidebar() {
 return (
   <div className="sidebar">
     <h2>Admin Panel</h2>
     <nav>
       <ul>
         <li>
           <NavLink
             to="/admin/overview"
             className={({ isActive }) => (isActive ? "active" : "")}
           >
             Overview
           </NavLink>
         </li>
         <li>
           <NavLink
             to="/admin/orders"
             className={({ isActive }) => (isActive ? "active" : "")}
           >
             Orders
           </NavLink>
         </li>
         <li>
           <NavLink
             to="/admin/meals"
             className={({ isActive }) => (isActive ? "active" : "")}
           >
             Meals
           </NavLink>
         </li>
         <li>
           <NavLink
             to="/admin/revenue"
             className={({ isActive }) => (isActive ? "active" : "")}
           >
             Revenue
           </NavLink>
         </li>
                  <li>
           <NavLink
             to="/admin/menu-builder"
             className={({ isActive }) => (isActive ? "active" : "")}
           >
             Menu Builder
           </NavLink>
         </li>
       </ul>
     </nav>
   </div>
 );
}
