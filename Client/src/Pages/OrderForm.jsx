import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../Api/Api';
import OrderSuccessModal from '../Components/OrderSuccessModal';

const OrderForm = () => {
  const [menuItemId, setMenuItemId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to place an order.');
      navigate('/login');
      return;
    }

    try {
      await placeOrder({ menu_item_id: menuItemId });
      setSuccess(true);
      setMenuItemId('');
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Order failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded bg-white">
      <h2 className="text-2xl font-semibold mb-4">Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Menu Item ID"
          className="w-full p-2 border rounded mb-2"
          value={menuItemId}
          onChange={(e) => setMenuItemId(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={!menuItemId}
        >
          Submit
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <OrderSuccessModal isOpen={success} onClose={() => setSuccess(false)} />
    </div>
  );
};

export default OrderForm;