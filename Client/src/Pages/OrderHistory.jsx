import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../Api/Api';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await fetchOrderDetails();
        const data = res.data;
        console.log("Order details fetched:", JSON.stringify(data, null, 2));
        if (!Array.isArray(data)) {
          setError(`Invalid response format from server: ${JSON.stringify(data)}`);
          setOrders([]);
        } else {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        console.error("Order fetch error:", err.response?.data || err.message);
        if (err?.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err?.response?.status === 404) {
          setError('No orders found.');
          setOrders([]);
        } else {
          setError(`Server error: ${err.response?.data?.error || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  return (
    <div className="orders-card" style={{
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '1rem',
      backgroundColor: '#fff',
      maxHeight: '500px',
      overflowY: 'auto',
      width: '100%'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Order History</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={order.order_id || idx} style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <p><strong>Order ID:</strong> {order.order_id}</p>
            <p><strong>Menu Item:</strong> {order.menu_item}</p>
            <p><strong>Price:</strong> ${order.price}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Ordered At:</strong> {new Date(order.order_date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}