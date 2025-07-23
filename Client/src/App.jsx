import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes"; // default export
import { MealProvider } from "./Components/MealContext";
import { AuthProvider } from "./auth/AuthContext";
import "./App.css";
import "./Components/admin.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MealProvider>
          <AppRoutes />
        </MealProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
