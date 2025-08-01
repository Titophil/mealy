import axios from 'axios';

const API = axios.create({baseURL:'https://mealy-17.onrender.com'});


export const getMenuByDate = (date) =>API.get(`/menus/${date}`);
export const createMenu = (menuDate) => API.get('/menus',menuDate);

