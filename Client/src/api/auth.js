import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; 

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Login failed';
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data; 
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Signup failed';
  }
};