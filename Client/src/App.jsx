import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { appRoutes } from "./Routes";
import { MealProvider } from "./Components/MealContext";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./App.css";
import "./Components/admin.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MealProvider>
          <Routes>
            {appRoutes.map((route, i) => {
              if (!route.path || !route.element) return null;

              if (route.children) {
                return (
                  <Route key={i} path={route.path} element={route.element}>
                    {route.children.map((child, j) => (
                      <Route
                        key={`${i}-${j}`}
                        path={child.path}
                        element={child.element}
                        index={child.index || false}
                      />
                    ))}
                  </Route>
                );
              }

              return <Route key={i} path={route.path} element={route.element} />;
            })}
          </Routes>
        </MealProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
