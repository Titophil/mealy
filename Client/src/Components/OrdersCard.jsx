import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrdersCard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let fetchCount = 0;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      console.log(`Fetching orders... Count: ${++fetchCount}`);
      try {
        const res = await fetch('/api/orders/details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if (res.status === 401) {
            setError('Unauthorized. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        } else {
          const data = await res.json();
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {};
  }, [navigate]);

  return (
    <div
      className="orders-card"
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '1rem',
        backgroundColor: '#fff',
        maxHeight: '500px',
        overflowY: 'auto',
        width: '100%'
      }}
    >
      <h3 style={{ marginBottom: '1rem' }}>Orders Summary</h3>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div
            key={idx}
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            <p><strong>Customer:</strong> {order.customer_name}</p>
            <p><strong>Food Ordered:</strong> {order.food_name}</p>
            <p><strong>Amount:</strong> KSh {order.amount}</p>
            <p><strong>Phone:</strong> {order.phone_number}</p>
            <p><strong>Paid:</strong> {order.paid ? 'Yes' : 'Pending'}</p>
            <p><strong>Delivered:</strong> {order.delivered ? 'Yes' : 'No'}</p>
            <p><strong>Ordered At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}