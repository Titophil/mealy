import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import OrderForm from './pages/OrderForm';
import TodaysOrder from './pages/TodaysOrder';
import OrderSuccessModal from './components/OrderSuccessModal';
import PrivateRoute from './auth/PrivateRoute';
import './index.css'; 
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <OrderForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/order/current"
          element={
            <PrivateRoute>
              <TodaysOrder />
            </PrivateRoute>
          }
        />

        {/* Optional Success Modal */}
        <Route path="/order/success" element={<OrderSuccessModal />} />

        {/* Default Route Redirect */}
        <Route path="*" element={<Navigate to="/order" replace />} />
      </Routes>
    </Router>
  );
}

export default App;