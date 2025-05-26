import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Optional: Set timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for auth tokens or error handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Add auth token from localStorage if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;