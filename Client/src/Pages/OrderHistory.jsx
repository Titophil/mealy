// src/Pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../Api/Api';
import OrderCard from '../Components/OrderCard';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view orders.');
          navigate('/login');
          return;
        }

        const response = await fetchOrderDetails();
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setError(null);
        } else {
          setError('Unexpected response format.');
          setOrders([]);
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err?.response?.status === 400) {
          setError('Bad request: Invalid request format.');
        } else if (err?.response?.status === 404) {
          setError('No orders found.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  return (
    <div className="order-history-page">
      <div className="order-history-overlay"></div>

      <div className="order-history-content">
        <h2>Order History</h2>

        {loading && <div className="loading-message">Loading orders...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="empty-message">No orders found.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="order-card-container">
            {orders.map((order, idx) => (
              <OrderCard key={idx} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
