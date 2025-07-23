import axios from 'axios';

// Axios instance for Flask backend
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if available
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

// Optional: External meals (from public API wrapped in Flask backend)
export const fetchAllExternalMeals = () => api.get('/api/meals/external');
export const searchExternalMeals = (query) =>
  api.get(`/api/meals/external/search?q=${query}`);

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
