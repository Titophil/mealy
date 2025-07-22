import React from "react";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./Routes"; // ✅ this is correct
import "./App.css"; // Import your global styles
import "./Components/admin.css"; // Import admin styles



function App() {
  return (
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
  );
}

export default App;
