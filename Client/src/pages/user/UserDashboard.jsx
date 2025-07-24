import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './UserDashboard.css'; 

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 
  const handleLogout = () => {
    logout();      
    navigate('/'); 
  };

  return (
    <div className="user-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h2>Hello, {user?.name || 'Mealy User'}!</h2>
          <p className="subtitle">Welcome to your personalized Mealy dashboard. Here you can manage your meals and view your order history.</p>
        </div>

        <div className="dashboard-actions-grid">
          <div className="action-card">
            <h3>Your Orders</h3>
            <p>View all your past and current orders.</p>
            <Link to="/user/orders" className="action-button">View Order History</Link>
          </div>

          <div className="action-card">
            <h3>Today's Menu</h3>
            <p>Check out what delicious meals are available today.</p>
            <Link to="/menu" className="action-button">See Menu</Link>
          </div>

          <div className="action-card">
            <h3>Place an Order</h3>
            <p>Ready to order? Place your meal request for today.</p>
            <Link to="/order" className="action-button">Order Now</Link>
          </div>
        </div>

        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;