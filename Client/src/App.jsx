import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import PublicLandingPage from './pages/public/PublicLandingPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import OrderHistory from './pages/user/OrderHistory.jsx';


import { AuthProvider, useAuth } from './auth/AuthContext.jsx'; 

import './App.css';

const AppNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand-logo">Mealy</Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/user/dashboard">Dashboard</Link></li>
                <li><Link to="/user/orders">My Orders</Link></li>
                {/* Potentially add admin links here if user.role === 'admin' */}
                {user?.role === 'admin' && (
                  <li><Link to="/admin/dashboard">Admin Panel</Link></li>
                  // Add more specific admin links (meals, menus, etc.) as they are implemented
                )}
                <li><button onClick={handleLogout} className="nav-logout-button">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Log In</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};


function App() {
  return (
    <Router>
      <div className="app-container">
        <AuthProvider>
          <AppNavbar /> 

          <main className="main-content">
            <Routes>
              <Route path="/" element={<PublicLandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/orders" element={<OrderHistory />} />

              {/* Add other routes for admin, menu, order forms etc. */}
            </Routes>
          </main>
        </AuthProvider>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Mealy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;