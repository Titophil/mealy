// File: src/Api/Api.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// -------- AUTH --------
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const signupUser = (userData) => api.post('/auth/signup', userData);

// -------- ORDERS --------
export const placeOrder = (menu_item_id) => api.post('/orders', { menu_item_id });
export const updateOrder = (id, menu_item_id) => api.put(`/orders/${id}`, { menu_item_id });
export const fetchTodaysOrder = () => api.get('/orders/current');
export const fetchUserOrders = () => api.get('/users/orders');

// -------- MENU --------
export const fetchTodayMenu = () => api.get('/menus/today');
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/menus/${menuId}/update`, { items });

// -------- MEALS --------
export const fetchMeals = () => api.get('/meals');
export const createMeal = (mealData) => api.post('/meals', mealData);
export const updateMeal = (id, mealData) => api.put(`/meals/${id}`, mealData);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

// -------- EXTERNAL MEALS --------
export const fetchAllExternalMeals = () => api.get('/meals/external');
export const searchExternalMeals = (query) => api.get(`/meals/external/search?q=${query}`);

// -------- SPOONACULAR MEALS --------
export const fetchSpoonacularMeals = () => api.get('/meals/spoonacular');
