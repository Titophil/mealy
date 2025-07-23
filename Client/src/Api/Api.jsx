import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your backend prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Use 'token', not 'item'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example named exports for specific actions
export const placeOrder = (menu_item_id) =>
  api.post('/orders', { menu_item_id });

export const updateOrder = (id, menu_item_id) =>
  api.put(`/orders/${id}`, { menu_item_id });

export const fetchTodaysOrder = () => api.get('/orders/current');

// Export default for generic usage
export default api;
