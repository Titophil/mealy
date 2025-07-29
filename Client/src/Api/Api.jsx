import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to each request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No JWT token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== AUTH ====================
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const signupUser = (userData) => api.post('/auth/signup', userData);

// ==================== ORDERS ====================
export const placeOrder = (menu_item_id) => api.post('/orders', { menu_item_id });
export const updateOrder = (id, menu_item_id) => api.put(`/orders/${id}`, { menu_item_id });
export const fetchTodaysOrder = () => api.get('/orders/current');
export const fetchUserOrders = () => api.get('/orders/user');
export const fetchOrderDetails = (user_id) =>
  api.get('/orders/user/details', { params: { user_id } }); // 🔁 Accepts user_id as query param

// ==================== MENUS ====================
export const fetchTodayMenu = () => api.get('/menus/today');
export const getMenuByDate = (date) => api.get(`/menu/${date}`);
export const createMenu = (menuData) => api.post('/menus', menuData);
export const updateMenuItemStatus = (menuId, items) =>
  api.put(`/menus/${menuId}/update`, { items });

// ==================== MEALS ====================
export const fetchMeals = () => api.get('/meals');
export const createMeal = (mealData) => api.post('/meals', mealData);
export const updateMeal = (id, mealData) => api.put(`/meals/${id}`, mealData);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

// ==================== NOTIFICATIONS ====================
export const fetchNotifications = () => api.get('/notifications');

// ==================== USERS ====================
export const fetchUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// If you want to fetch a specific user by ID
export const fetchUserById = (user_id) => api.get(`/users/${user_id}`); // 👈 optional addition

export default api;
