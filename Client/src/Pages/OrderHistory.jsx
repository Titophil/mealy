import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
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

    const fetchOrders = async (retryCount = 0) => {
      console.log(`Fetching orders... Count: ${++fetchCount}`);
      try {
        const res = await fetch('/api/orders/details', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Ensure cookies are sent
        });
        console.log('Response status:', res.status, 'URL:', res.url);
        if (!res.ok) {
          const text = await res.text();
          console.error('Non-JSON response:', text.slice(0, 200));
          if (res.status === 401) {
            setError('Unauthorized. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else if (res.status === 404) {
            setError('Orders endpoint not found.');
            setOrders([]);
          } else if (res.status >= 500 && retryCount < 1) { // Limit to 1 retry
            console.log(`Retrying fetch... Attempt ${retryCount + 2}`);
            setTimeout(() => fetchOrders(retryCount + 1), 1000);
            return;
          } else {
            setError(`Server error: ${res.status} ${res.statusText}`);
          }
          setOrders([]);
        } else {
          const data = await res.json();
          console.log('Response data:', data);
          if (!Array.isArray(data)) {
            console.error('Expected an array, received:', data);
            setError('Invalid response format from server.');
            setOrders([]);
          } else {
            setOrders(data);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
        if (err.name === 'TypeError' && retryCount < 1) { // Limit to 1 retry
          console.log(`Retrying fetch... Attempt ${retryCount + 2}`);
          setTimeout(() => fetchOrders(retryCount + 1), 1000);
        } else {
          setError(`Failed to fetch orders: ${err.message}`);
          setOrders([]);
        }
      } finally {
        if (retryCount === 0) {
          setLoading(false);
        }
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
      <h3 style={{ marginBottom: '1rem' }}>Order History</h3>

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
            <p><strong>Customer:</strong> {order.customer_name || 'N/A'}</p>
            <p><strong>Food Ordered:</strong> {order.food_name || 'N/A'}</p>
            <p><strong>Amount:</strong> KSh {order.amount || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.phone_number || 'N/A'}</p>
            <p><strong>Paid:</strong> {order.paid ? 'Yes' : 'Pending'}</p>
            <p><strong>Delivered:</strong> {order.delivered ? 'Yes' : 'No'}</p>
            <p><strong>Ordered At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}