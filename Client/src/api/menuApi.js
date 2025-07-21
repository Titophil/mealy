import axios from 'axios';

const API = axios.create({baseURL:'http://localhost:5000'});


export const getMenuByDate = (date) =>API.get(`/menus/${date}`);
export const createMenu = (menuDate) => API.get('/menus',menuDate);

