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

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{formatDate(order?.created_at)}</span>
        <span style={{ fontWeight: 'bold' }}>{order?.status || 'Unknown Status'}</span>
      </div>
      <div>
        <h4>Order ID: {order?.id || 'N/A'}</h4>
        <ul style={{ paddingLeft: '1rem' }}>
          <li>
            1x {order?.menu_name || 'Unknown Item'} (KSh {parseFloat(order?.amount || 0).toFixed(2)})
          </li>
        </ul>
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
          Total: KSh {parseFloat(order?.amount || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;