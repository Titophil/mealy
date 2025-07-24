import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PublicLandingPage from './pages/PublicLandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import OrderHistory from './pages/OrderHistory';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="container">
            <Link to="/" className="brand-logo">Mealy</Link>
            <nav>
              <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Log In</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<PublicLandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            
             <Route path="/user/dashboard" element={<UserDashboard />} />
             <Route path="/user/orders" element={<OrderHistory />} />

          </Routes>
        </main>

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