import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.SIGNUP, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during signup' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};