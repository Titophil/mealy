// src/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./Layout.css"; // For background image and layout styles

export default function Layout() {
  return (
    <div className="app-background">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
