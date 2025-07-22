import axios from 'axios'




const api = axios.create({
   baseURL: 'http://localhost:5000',
})


api.interceptors.request.use((config) => {
   const token = localStorage.getItem('item')
   if (token) config.headers.Authorization = `Bearer- ${token}`
   return config
})


export const getMenuByDate = (date) =>API.get(`/menus/${date}`);
export const createMenu = (menuDate) => API.get('/menus',menuDate);
export const getMeals = () => api.get('/meals');
export const createMeal = (meal) => api.post('/meals', meal);
export const updateMeal = (id, meal) => api.put(`/meals/${id}`, meal);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

export default api