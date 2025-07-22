// src/Components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./admin.css";

export default function Header() {
  return (
    <header className="app-header">
      <h1 className="logo">🍴 Mealy</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
