// src/Components/AppNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

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
                <li><Link to="/userDashboard">Dashboard</Link></li>
                <li><Link to="/user/orders">My Orders</Link></li>
                {user?.role === 'admin' && (
                  <li><Link to="/admin">Admin Panel</Link></li>
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

export default AppNavbar;
