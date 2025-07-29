import { Outlet } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import "../Components/admin.css"; // Main layout styling

export default function Admin() {
  return (
    <div className="admin-layout app-background">
   
      <div className="admin-content">
        <Sidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
     
    </div>
  );
}
