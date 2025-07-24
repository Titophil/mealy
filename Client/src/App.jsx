import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PublicLandingPage from './pages/public/PublicLandingPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import OrderHistory from './pages/user/OrderHistory.jsx';
import './App.css'; 
import { AuthProvider } from './auth/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;