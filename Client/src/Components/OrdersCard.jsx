import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../Api/Api'; // Adjust the import path as needed
 // Install via: npm i jwt-decode

const OrdersCard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view orders.');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded?.user_id;

      if (!userId) {
        setError('Invalid token or missing user ID.');
        return;
      }

      const response = await fetchOrderDetails(userId); // ✅ Pass userId
      setOrders(response.data || []); // Ensure fallback
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.message || 'An error occurred while fetching orders.');
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // UI remains unchanged
};

export default OrdersCard;