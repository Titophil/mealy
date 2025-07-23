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

// ============================
// Auth APIs
// ============================

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const signupUser = (userData) => api.post('/auth/signup', userData);

// ============================
// Meal APIs
// ============================

export const getMeals = () => api.get('/meals');
export const createMeal = (meal) => api.post('/meals', meal);
export const updateMeal = (id, meal) => api.put(`/meals/${id}`, meal);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

// ============================
// Menu APIs
// ============================

export const getMenuByDate = (date) => api.get(`/menus/${date}`);
export const createMenu = (menuData) => api.post('/menus', menuData);
export const fetchTodayMenu = () => api.get('/menu/today');
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/menu/${menuId}/update`, { items });

// ============================
// Order APIs
// ============================

export const placeOrder = (menu_item_id) => api.post('/orders', { menu_item_id });
export const updateOrder = (id, menu_item_id) => api.put(`/orders/${id}`, { menu_item_id });
export const fetchTodaysOrder = () => api.get('/orders/current');
export const fetchUserOrders = () => api.get('/user/orders');
