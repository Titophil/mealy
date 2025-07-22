import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Update to match backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const placeOrder = (menu_item_id) => API.post('/orders', { menu_item_id });
export const updateOrder = (id, menu_item_id) => API.put(`/orders/${id}`, { menu_item_id });
export const fetchTodaysOrder = () => API.get('/orders/current');
