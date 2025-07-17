import { Outlet } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Components/admin.css"; // Main layout styling

export default function Admin() {
  return (
    <div className="admin-layout app-background">
      <Header />
      <div className="admin-content">
        <Sidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
