import axios from 'axios';
import { getToken } from '../auth/authUtils';

const api = axios.create({
  baseURL: '/api', 
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

// Auth
export const signupUser = async (userData) => {
  try {
    const response = await api.post('api/auth/signup', userData);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('api/auth/login', { email, password });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Orders
export const placeOrder = (menu_item_id, user_id, quantity = 1) =>
  api.post('/orders/cart', { menu_item_id, user_id, quantity });

export const updateOrder = (order_id, user_id) =>
  api.delete(`/orders/cart/${order_id}`, { params: { user_id } });

export const fetchTodaysOrder = () => api.get('/orders/current');
export const fetchUserOrders = (user_id) =>
  api.get('/users/orders', { params: { user_id } });
export const fetchOrderDetails = (user_id) =>
  api.get('/orders/user/details', { params: { user_id } });

// Menu
export const fetchTodayMenu = () => api.get('/menu/today');
export const getMenuByDate = (date) => api.get(`/menu/${date}`);
export const createMenu = (menuData) => api.post('/menu', menuData);
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/menu/${menuId}/update`, { items });

// Meals
export const fetchMeals = () => api.get('/meals');
export const createMeal = (mealData) => api.post('/meals', mealData);
export const updateMeal = (id, mealData) => api.put(`/meals/${id}`, mealData);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

// Notifications
export const fetchNotifications = () => api.get('/notifications');

// Users
export const fetchUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const fetchUserById = (user_id) => api.get(`/users/${user_id}`);

// Payments
export const initiatePayment = (paymentData) => api.post('/payments/initiate', paymentData);

export default api;
