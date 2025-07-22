import { Outlet } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import "../Components/admin.css"; // ✅ corrected import


export default function Admin() {
 return (
   <div className="admin-layout">
     <Sidebar />
     <main className="admin-main">
       <Outlet />
     </main>
   </div>
 );
}
