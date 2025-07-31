// src/Pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css';

const mealNames = [
  "Grilled Chicken Pasta", "Sushi Platter", "Beef Steak", "Green Curry Chicken",
  "Cheese Pizza", "Spaghetti Bolognese", "Vietnamese Pho", "Hyderabadi Biryani",
  "Veggie Wrap", "Paneer Butter Masala", "Chicken Shawarma", "Roast Turkey",
  "Fish and Chips", "Classic Burger", "Chicken Tikka", "Lasagna",
  "Teriyaki Salmon", "Prawn Tempura", "French Toast", "Greek Salad",
  "Caesar Salad", "Tandoori Chicken", "Mixed Grill Platter"
];

const imageFiles = [
  "penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table.jpg",
  "pexels-catscoming-674574.jpg", "pexels-chevanon-323682.jpg",
  "pexels-chokniti-khongchum-1197604-2280545.jpg", "pexels-enginakyurt-1438672.jpg",
  "pexels-foodie-factor-162291-539451.jpg", "pexels-janetrangdoan-793759.jpg",
  "pexels-karthik-reddy-130698-397913.jpg", "pexels-lum3n-44775-604969.jpg",
  "pexels-mali-64208.jpg", "pexels-marta-dzedyshko-1042863-2067423.jpg",
  "pexels-pascal-claivaz-66964-410648.jpg", "pexels-rajesh-tp-749235-1633525.jpg",
  "pexels-robinstickel-70497.jpg", "pexels-sebastian-coman-photography-1598188-3590401.jpg",
  "pexels-senuscape-728360-2313686.jpg", "pexels-sonnie-wing-2153439649-33133363.jpg",
  "pexels-tahaasamett-7764698.jpg", "pexels-valeriya-1639557.jpg", "pexels-valeriya-1860204.jpg",
  "pexels-valeriya-33106044.jpg", "pexels-vanmalidate-769289.jpg",
  "top-view-table-full-delicious-food-composition.jpg"
];

// Create mock orders using the meals and images
const mockOrders = mealNames.slice(0, 10).map((name, i) => ({
  id: 200 + i,
  status: i % 2 === 0 ? "Delivered" : "Pending",
  date: `2025-07-${20 + i}`,
  items: [
    {
      name,
      price: 500 + i * 50,
      quantity: (i % 3) + 1,
      image: imageFiles[i % imageFiles.length],
    }
  ],
  total: (500 + i * 50) * ((i % 3) + 1),
}));

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={`/images/meals/${item.image}`}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <p>Price: KES {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="order-total">Total: KES {order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
