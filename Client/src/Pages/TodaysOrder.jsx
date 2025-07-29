import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTodaysOrder } from '../Api/Api';

const TodaysOrder = () => {
  const [order, setOrder] = useState(null);
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

    const fetchOrder = async (retryCount = 0) => {
      console.log('Fetching today\'s order...');
      try {
        const res = await fetchTodaysOrder();
        console.log('Response data:', res.data);
        setOrder(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch today\'s order:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response?.status === 404) {
          setOrder(null);
          setError('No order found for today.');
        } else if (err.response?.status >= 500 && retryCount < 1) {
          console.log(`Retrying fetch... Attempt ${retryCount + 2}`);
          setTimeout(() => fetchOrder(retryCount + 1), 1000);
        } else {
          setError(`Server error: ${err.response?.data?.error || err.message}`);
        }
      } finally {
        if (retryCount === 0) {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white shadow rounded">
      {error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : order ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Today's Order</h2>
          <p><strong>Food:</strong> {order.menu_name || 'N/A'}</p>
          <p><strong>Menu Item ID:</strong> {order.menu_item_id || 'N/A'}</p>
          <p><strong>Amount:</strong> KSh {order.amount || 'N/A'}</p>
          <p><strong>Customer:</strong> {order.customer_name || 'N/A'}</p>
          <p><strong>Phone:</strong> {order.phone_number || 'N/A'}</p>
          <p><strong>Status:</strong> {order.status || 'N/A'}</p>
          <p><strong>Paid:</strong> {order.paid ? 'Yes' : 'Pending'}</p>
          <p><strong>Delivered:</strong> {order.delivered ? 'Yes' : 'No'}</p>
          <p><strong>Order Time:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</p>
        </>
      ) : (
        <p className="text-center">No order placed today.</p>
      )}
    </div>
  );
};

export default TodaysOrder;