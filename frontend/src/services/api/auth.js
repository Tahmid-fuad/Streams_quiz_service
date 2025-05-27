import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { jwtDecode } from 'jwt-decode'; // Use named import

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Decode token to get role
      const decoded = jwtDecode(response.data.token);
      return {
        ...response.data,
        role: decoded.role, // Add role to response
      };
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

// Function to check token validity and extract user data
export const checkToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return null;
    }
    // Optionally fetch fresh profile data
    const profile = await getUserProfile();
    return {
      name: profile.name,
      email: profile.email,
      role: decoded.role,
    };
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};