import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const fetchTodaysOrder = async (retryCount = 0) => {
      console.log('Fetching today\'s order...');
      try {
        const res = await fetch('/orders/current', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
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
            setOrder(null);
            setError('No order found for today.');
          } else if (res.status >= 500 && retryCount < 1) {
            console.log(`Retrying fetch... Attempt ${retryCount + 2}`);
            setTimeout(() => fetchTodaysOrder(retryCount + 1), 1000);
            return;
          } else {
            setError(`Server error: ${res.status} ${res.statusText}`);
          }
        } else {
          const data = await res.json();
          console.log('Response data:', data);
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch today\'s order:', err);
        if (err.name === 'TypeError' && retryCount < 1) {
          console.log(`Retrying fetch... Attempt ${retryCount + 2}`);
          setTimeout(() => fetchTodaysOrder(retryCount + 1), 1000);
        } else {
          setError(`Failed to fetch today\'s order: ${err.message}`);
        }
      } finally {
        if (retryCount === 0) {
          setLoading(false);
        }
      }
    };

    fetchTodaysOrder();

    return () => {};
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white shadow rounded">
      {error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : order ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Today's Order</h2>
          <p><strong>Food:</strong> {order.food_name || 'N/A'}</p>
          {order.menu_item_id && <p><strong>Menu Item ID:</strong> {order.menu_item_id}</p>}
          <p><strong>Amount:</strong> KSh {order.amount || 'N/A'}</p>
          <p><strong>Customer:</strong> {order.customer_name || 'N/A'}</p>
          <p><strong>Phone:</strong> {order.phone_number || 'N/A'}</p>
          <p><strong>Status:</strong> {order.status || 'N/A'}</p>
          <p><strong>Paid:</strong> {order.paid ? 'Yes' : 'Pending'}</p>
          <p><strong>Delivered:</strong> {order.delivered ? 'Yes' : 'No'}</p>
          <p><strong>Order Time:</strong> {new Date(order.order_date).toLocaleString()}</p>
        </>
      ) : (
        <p className="text-center">No order placed today.</p>
      )}
    </div>
  );
};

export default TodaysOrder;