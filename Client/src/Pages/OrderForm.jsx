import { useState } from 'react';
import { placeOrder } from '../Api/Api.jsx'; // ✅ Ensure the correct file extension
import OrderSuccessModal from '../Components/OrderSuccessModal'; // ✅ Capital 'C' in Components

const OrderForm = () => {
  const [menuItemId, setMenuItemId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await placeOrder(menuItemId);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Order failed');
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
