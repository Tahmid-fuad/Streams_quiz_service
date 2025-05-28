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

export const getProfile = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
  return response.data;
};

export const changeName = async ({ email, password, newName }) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.CHANGE_NAME, {
    email,
    password,
    newName,
  });
  return response.data;
};

export const changeEmail = async ({ email, password, newEmail }) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.CHANGE_EMAIL, {
    email,
    password,
    newEmail,
  });
  return response.data;
};

export const switchUserRole = async ({ email, newRole }) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.SWITCH_ROLE, {
    email,
    newRole,
  });
  return response.data;
};

export const changePassword = (data) => {
  return axiosInstance.patch(API_ENDPOINTS.CHANGE_PASS, data);
};