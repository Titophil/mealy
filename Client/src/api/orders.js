import axios from "axios";
import { getToken } from '../auth/authUtils'; 

const API_BASE_URL = 'http://localhost:5000/api'; 

export const fetchUserOrders = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`${API_BASE_URL}/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Fetch user orders error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to fetch order history';
  }
};