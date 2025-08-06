import axios from 'axios';

const API = axios.create({baseURL:'https://mealy-8-1cv8.onrender.com/api'});


export const getMenuByDate = (date) =>API.get(`/menus/${date}`);
export const createMenu = (menuDate) => API.get('/menus',menuDate);

