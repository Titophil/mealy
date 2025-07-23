import React from 'react';

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div>
      <div>
        <span>{formatDate(order.orderDate)}</span>
        <span>{order.status}</span>
      </div>
      <div>
        <h4>Order ID: {order.orderId}</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.mealName} (${item.price.toFixed(2)} each)
            </li>
          ))}
        </ul>
        <div>
          <strong>Total: ${calculateTotalPrice(order.items)}</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;