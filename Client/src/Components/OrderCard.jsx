import React from 'react';

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const calculateTotalPrice = (items) => {
    if (!Array.isArray(items)) return '0.00';
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{formatDate(order?.orderDate)}</span>
        <span style={{ fontWeight: 'bold' }}>{order?.status || 'Unknown Status'}</span>
      </div>

      <div>
        <h4>Order ID: {order?.orderId || 'N/A'}</h4>
        <ul style={{ paddingLeft: '1rem' }}>
          {(order?.items || []).map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.mealName} (${parseFloat(item.price).toFixed(2)} each)
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
          Total: ${calculateTotalPrice(order?.items)}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
