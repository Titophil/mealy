import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../Api/Api';
import './UserDashboard.css'; // Make sure this file exists

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    pollNotifications();
    const interval = setInterval(pollNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-background-overlay"></div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Hello, {user?.name || 'Mealy User'}!</h2>
          <p className="subtitle">
            Welcome to your personalized Mealy dashboard. Here you can manage your meals and view your order history.
          </p>
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

        <div className="dashboard-data-sections">
          <h3>Notifications ({notificationCount})</h3>
          {notifications.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            notifications.map((note, idx) => (
              <div className="data-card" key={idx}>
                <h4>{note.title}</h4>
                <ul className="data-list">
                  <li>{note.message}</li>
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="logout-section">
          <button className="action-button logout-button" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
