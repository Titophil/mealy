import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { fetchTodayMenu, fetchUserOrders } from '../../Api/Api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [todayMenu, setTodayMenu] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingDashboardData, setLoadingDashboardData] = useState(true);
  const [errorDashboardData, setErrorDashboardData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated) return;

      setLoadingDashboardData(true);
      setErrorDashboardData(null);
      try {
        const menuResponse = await fetchTodayMenu();
        setTodayMenu(menuResponse.data);

        const ordersResponse = await fetchUserOrders();
        setUserOrders(ordersResponse.data);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setErrorDashboardData("Failed to load some dashboard data. Please try again.");
      } finally {
        setLoadingDashboardData(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated]);

  const userName = user && user.name ? user.name : 'Mealy User';
  const userRole = user && user.role ? user.role : 'customer';

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-background-overlay"></div>
      <div className="container dashboard-content">
        <div className="dashboard-header">
          <h2>Hello, {userName}!</h2>
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

        <div className="dashboard-data-sections">
          <h3>Your Dashboard Summary</h3>
          {loadingDashboardData ? (
            <p>Loading your personalized data...</p>
          ) : errorDashboardData ? (
            <p className="error-message">{errorDashboardData}</p>
          ) : (
            <>
              <div className="data-card">
                <h4>Today's Menu Highlights</h4>
                {todayMenu.length > 0 ? (
                  <ul className="data-list">
                    {todayMenu.slice(0, 3).map(item => (
                      <li key={item.id}>
                        {item.name} - ${item.price.toFixed(2)}
                      </li>
                    ))}
                    {todayMenu.length > 3 && (
                      <p><Link to="/menu">View all menu items</Link></p>
                    )}
                  </ul>
                ) : (
                  <p>No menu items available for today. Check back later!</p>
                )}
              </div>

              <div className="data-card">
                <h4>Your Latest Orders</h4>
                {userOrders.length > 0 ? (
                  <ul className="data-list">
                    {userOrders.slice(0, 3).map(order => (
                      <li key={order.id}>
                        Order #{order.id} - Status: {order.status || 'Pending'}
                      </li>
                    ))}
                    {userOrders.length > 3 && (
                      <p><Link to="/user/orders">View all your orders</Link></p>
                    )}
                  </ul>
                ) : (
                  <p>You haven't placed any orders yet. <Link to="/order">Place your first order!</Link></p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;