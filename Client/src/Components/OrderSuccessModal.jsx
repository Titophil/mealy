import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { placeOrder } from '../Api/Api';
import OrderSuccessModal from '../Components/OrderSuccessModal';
import { useAuth } from '../auth/AuthContext';

const OrderForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    if (!user) return;

    setLoading(true);
    setSubmitError('');
    try {
      const payload = {
        menu_item_id: data.menuItemId,
        quantity: Number(data.quantity),
      };
      await placeOrder(payload);
      setOrderSuccess(true);
      reset(); // ✅ Reset form fields
    } catch (error) {
      console.error('Failed to place order:', error);
      setSubmitError(error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="order-form-container">
        <p>You must be logged in to place an order.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="order-form-container">
      <h2>Place Your Order</h2>

      {submitError && <p className="error">{submitError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="order-form">
        <div className="form-group">
          <label htmlFor="menuItemId">Menu Item ID</label>
          <input
            type="text"
            id="menuItemId"
            {...register('menuItemId', { required: 'Menu Item ID is required' })}
          />
          {errors.menuItemId && <p className="error">{errors.menuItemId.message}</p>}
        </div>

        <div className="form-group">
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

      <Link to="/user/dashboard" className="back-link">Back to Dashboard</Link>
    </div>
  );
};

export default OrderForm;
