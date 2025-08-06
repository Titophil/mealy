import axios from 'axios';

// Ensure this API instance also uses the correct base URL
const API = axios.create({ baseURL: 'https://mealy-8-1cv8.onrender.com/api' });

export const getMenuByDate = (date) => API.get(`/menu/${date}`);


export const createMenu = (menuData) => API.post('/menu', menuData);


export const fetchMeals = () => API.get('/meals');

