import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { placeOrder } from '../Api/Api'; // ✅ Ensure correct path
import OrderSuccessModal from '../Components/OrderSuccessModal'; // ✅ Ensure correct path
import { useAuth } from '../auth/AuthContext'; // ✅ Ensure correct path

const OrderForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        menu_item_id: data.menuItemId, // ✅ match backend expected key
        quantity: Number(data.quantity), // ✅ convert to number if backend expects it
      };
      await placeOrder(payload); // ✅ send object, not raw input
      setOrderSuccess(true);
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="menuItemId">Menu Item ID</label>
          <input
            type="text"
            id="menuItemId"
            {...register('menuItemId', { required: 'Menu Item ID is required' })}
          />
          {errors.menuItemId && <p className="error">{errors.menuItemId.message}</p>}
        </div>

        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            {...register('quantity', { required: 'Quantity is required', min: 1 })}
          />
          {errors.quantity && <p className="error">{errors.quantity.message}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      {orderSuccess && (
        <OrderSuccessModal onClose={() => setOrderSuccess(false)} />
      )}

      <Link to="/user/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default OrderForm;
