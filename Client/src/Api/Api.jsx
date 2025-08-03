import axios from 'axios';
import { getToken } from './authUtils';

const api = axios.create({
  baseURL: 'https://mealy-17.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No JWT token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signupUser = (userData) => api.post('/api/auth/signup', userData);
export const loginUser = (email, password) => api.post('/api/auth/login', { email, password });


export const placeOrder = (menu_item_id, user_id, quantity = 1) =>
  api.post('/api/orders/cart', { menu_item_id, user_id, quantity });
export const updateOrder = (order_id, user_id) =>
  api.delete(`/api/orders/cart/${order_id}`, { params: { user_id } });
export const fetchTodaysOrder = () => api.get('/api/orders/current');
export const fetchUserOrders = (user_id) =>
  api.get('/api/users/orders', { params: { user_id } });
export const fetchOrderDetails = (user_id) =>
  api.get('/api/orders/user/details', { params: { user_id } });

export const fetchTodayMenu = () => api.get('/api/menu/today');
export const getMenuByDate = (date) => api.get(`/api/menu/${date}`);
export const createMenu = (menuData) => api.post('/api/menu', menuData);
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/api/menu/${menuId}/update`, { items });


export const fetchMeals = () => api.get('/api/meals');
export const createMeal = (mealData) => api.post('/api/meals', mealData);
export const updateMeal = (id, mealData) => api.put(`/api/meals/${id}`, mealData);
export const deleteMeal = (id) => api.delete(`/api/meals/${id}`);

export const fetchNotifications = () => api.get('/api/notifications');

export const fetchUsers = () => api.get('/api/users');
export const createUser = (userData) => api.post('/api/users', userData);
export const updateUser = (id, userData) => api.put(`/api/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
export const fetchUserById = (user_id) => api.get(`/api/users/${user_id}`);

export default api;