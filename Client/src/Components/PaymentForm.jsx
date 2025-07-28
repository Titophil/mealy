import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/payment/initiate', {
        phone: phone.startsWith('0') ? `254${phone.slice(1)}` : phone,
        amount
      });
      console.log('STK Push Response:', response.data);
      if (response.data.response.ResponseCode === '0') {
        alert('STK Push initiated. Check your phone to complete payment.');
        // Navigate to order confirmation or dashboard after a delay
        setTimeout(() => navigate('/user/orders'), 5000);
      } else {
        setError('Failed to initiate payment. Try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Pay with M-Pesa</h2>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          placeholder="Phone (e.g., 0712345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Initiating Payment...' : 'Pay Now'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;