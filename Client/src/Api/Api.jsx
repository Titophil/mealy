import axios from 'axios';
import { getToken } from '../auth/authUtils';


const API_BASE_URL = 'https://mealy-8-1cv8.onrender.com/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------- AUTH -------------------
export const signupUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response;
  } catch (error) {
    console.error('Signup error:', error.response || error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error;
  }
};

// ------------------- ORDERS -------------------
export const placeOrder = (menu_item_id, user_id, quantity = 1) =>
  api.post('/orders/cart', { menu_item_id, user_id, quantity });

export const updateOrder = (order_id, user_id) =>
  api.delete(`/orders/cart/${order_id}`, { params: { user_id } });

export const fetchTodaysOrder = () => api.get('/orders/current');

export const fetchUserOrders = () => api.get('/orders');

export const fetchOrderDetails = (user_id) =>
  api.get('/orders/user/details', { params: { user_id } });

// ------------------- MENU -------------------
export const fetchTodayMenu = () => api.get('/menu/today');
export const getMenuByDate = (date) => api.get(`/menu/${date}`);
export const createMenu = (menuData) => api.post('/menu', menuData);
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/menu/${menuId}/update`, { items });

// ------------------- MEALS -------------------
export const fetchMeals = () => api.get('/meals');
export const createMeal = (mealData) => api.post('/meals', mealData);
export const updateMeal = (id, mealData) => api.put(`/meals/${id}`, mealData);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

// ------------------- NOTIFICATIONS -------------------
export const fetchNotifications = () => api.get('/notifications');

// ------------------- USERS -------------------
export const fetchUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const fetchUserById = (user_id) => api.get(`/users/${user_id}`);

// ------------------- PAYMENTS -------------------
export const initiatePayment = (paymentData) => api.post('/payments/initiate', paymentData);

// ------------------- ADMIN -------------------

export const fetchAdminOverview = async () => {
  try {
    // Assuming the backend route is now /api/admin/overview
    const response = await api.get('/admin/overview');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin overview:', error.response || error);
    throw error;
  }
};

// New function to fetch admin revenue data
export const fetchAdminRevenue = async () => {
  try {
    // Assuming the backend route is now /api/admin/revenue
    const response = await api.get('/admin/revenue');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin revenue:', error.response || error);
    throw error;
  }
};

export default api;
