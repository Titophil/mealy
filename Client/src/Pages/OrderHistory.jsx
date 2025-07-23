import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../Api/Api.jsx';
import OrderCard from '../Components/OrderCard.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Please log in to view your order history.');
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserOrders();
        setOrders(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load order history.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div>
        <h2>Your Order History</h2>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Your Order History</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet. Time to explore the menu!</p>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;