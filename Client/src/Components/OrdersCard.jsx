import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../Api/Api'; // adjust the path if needed

const OrdersCard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view orders.');
        navigate('/login');
        return;
      }

      const response = await fetchOrderDetails(); // Axios handles headers
      setOrders(response.data.orders || []); // ✅ updated line
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.message || 'An error occurred while fetching orders.');
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="orders-card">
      <h3>Orders</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.food_name} - KSh {order.amount} ({order.status})
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersCard;
