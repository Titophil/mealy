// src/Components/OrderCard.jsx
import React from 'react';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-KE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-date">{formattedDate}</span>
        <span className={`order-status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <div className="order-details">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Item:</strong> {order.menu_name} (KSh {order.amount.toFixed(2)})
        </p>
        <p>
          <strong>Total:</strong> KSh {order.amount.toFixed(2)}
        </p>
        {order.image && (
          <img
            src={order.image}
            alt={order.menu_name}
            className="order-image"
          />
        )}
      </div>
    </div>
  );
};

export default OrderCard;
