// src/Components/Footer.jsx
import React from "react";
import "./admin.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Mealy. All rights reserved.</p>
    </footer>
  );
}
