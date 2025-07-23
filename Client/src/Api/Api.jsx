import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// --- AUTH ---
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const signupUser = (userData) => api.post('/auth/signup', userData);

// --- ORDERS ---
export const placeOrder = (menu_item_id) => api.post('/orders', { menu_item_id });
export const updateOrder = (id, menu_item_id) => api.put(`/orders/${id}`, { menu_item_id });
export const fetchTodaysOrder = () => api.get('/orders/current');
export const fetchUserOrders = () => api.get('/user/orders');

// --- MENUS ---
export const fetchTodayMenu = () => api.get('/menu/today');
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/menu/${menuId}/update`, { items });

// Add more grouped APIs here...
