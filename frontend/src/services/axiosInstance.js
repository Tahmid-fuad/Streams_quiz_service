import axios from 'axios';

const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const quizAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_QUIZ_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

quizAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { authAxiosInstance, quizAxiosInstance };