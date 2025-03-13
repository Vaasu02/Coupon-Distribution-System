import axios from 'axios';

const BASE_URL = 'https://coupon-distribution-system-wvqi.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message });
  }
);

export default api; 