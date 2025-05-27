import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const login = async (credentials) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

export const signup = async (userData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.SIGNUP, userData);
  return response.data;
};

export const getRole = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ROLE);
  return response.data;
};