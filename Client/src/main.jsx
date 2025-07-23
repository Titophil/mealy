import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { MealProvider } from "./Components/MealContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MealProvider>
        <App />
      </MealProvider>
    </BrowserRouter>
  </React.StrictMode>
);
