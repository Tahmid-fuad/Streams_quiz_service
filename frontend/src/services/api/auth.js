import { authAxiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const login = async (credentials) => {
  const response = await authAxiosInstance.post(
    API_ENDPOINTS.LOGIN,
    credentials
  );
  return response.data;
};

export const signup = async (userData) => {
  const response = await authAxiosInstance.post(API_ENDPOINTS.SIGNUP, userData);
  return response.data;
};

export const authenticateUser = async (token) => {
  try {
    const { data } = await authAxiosInstance.get(API_ENDPOINTS.AUTH, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data?.user;
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};

export const getProfile = async () => {
  const response = await authAxiosInstance.get(API_ENDPOINTS.PROFILE);
  return response.data;
};

export const changeEmail = async ({ email, password, newEmail }) => {
  const response = await authAxiosInstance.patch(API_ENDPOINTS.CHANGE_EMAIL, {
    email,
    password,
    newEmail,
  });
  return response.data;
};

export const updateUser = async (data) => {
  const response = await authAxiosInstance.patch(
    API_ENDPOINTS.UPDATE_USER,
    data
  );
  return response.data;
};

export const changePassword = (data) => {
  return authAxiosInstance.patch(API_ENDPOINTS.CHANGE_PASS, data);
};
