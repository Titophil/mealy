import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import { MealProvider } from "./Components/MealContext";
import { AuthProvider } from "./auth/AuthContext";
import AppNavbar from "./Components/AppNavbar";
import Footer from "./Components/Footer"; // Optional footer
import "./App.css";
import "./Components/admin.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MealProvider>
          <div className="app-container">
            <AppNavbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </MealProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
