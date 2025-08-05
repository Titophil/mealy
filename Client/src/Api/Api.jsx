import axios from 'axios';
import { getToken } from '../auth/authUtils';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to all outgoing requests
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

// ------------------- AUTH -------------------
export const signupUser = async (userData) => {
  try {
    console.log('Making signup request to:', '/auth/signup');
    const response = await api.post('/auth/signup', userData);
    console.log('Signup response:', {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Making login request to:', '/auth/login');
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

// ------------------- ORDERS -------------------
export const placeOrder = (menu_item_id, user_id, quantity = 1) =>
  api.post('/orders/cart', { menu_item_id, user_id, quantity });

export const updateOrder = (order_id, user_id) =>
  api.delete(`/orders/cart/${order_id}`, { params: { user_id } });

export const fetchTodaysOrder = () => api.get('/orders/current');
export const fetchUserOrders = (user_id) =>
  api.get('/users/orders', { params: { user_id } });

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

export default api;
