import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <h1>Mealy</h1>
        <div>
          <Link to="/user/dashboard">Dashboard</Link>
          <Link to="/user/orders">Order History</Link>
          <Link to="/menu">Today's Menu</Link>
          <Link to="/order">Place Order</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div>
        <h2>Hello, {user?.name || 'Mealy User'}!</h2>
        <p>Welcome to your personalized Mealy dashboard. Here you can manage your meals and view your order history.</p>

        <div>
          <div>
            <h3>Your Orders</h3>
            <p>View all your past and current orders.</p>
            <Link to="/user/orders">View Order History</Link>
          </div>

          <div>
            <h3>Today's Menu</h3>
            <p>Check out what delicious meals are available today.</p>
            <Link to="/menu">See Menu</Link>
          </div>

          <div>
            <h3>Place an Order</h3>
            <p>Ready to order? Place your meal request for today.</p>
            <Link to="/order">Order Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
