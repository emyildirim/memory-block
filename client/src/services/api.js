import axios from 'axios';

// API base URL - will use environment variable in production if available
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL); // Debug the API URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies for auth
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Request to: ${config.url}`); // Debug request URL
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    // Log more details about the error
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    }
    
    // Don't redirect on 401 for login/register endpoints
    if (error.response?.status === 401 && 
        !error.config.url.includes('/auth/login') && 
        !error.config.url.includes('/auth/register')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Memory endpoints
export const memoryAPI = {
  getAll: (params) => api.get('/memories', { params }),
  getById: (id) => api.get(`/memories/${id}`),
  create: (memoryData) => api.post('/memories', memoryData),
  update: (id, memoryData) => api.put(`/memories/${id}`, memoryData),
  delete: (id) => api.delete(`/memories/${id}`),
  search: (query, filter) => api.get('/memories', { params: { query, filter } }),
  exportCSV: () => api.get('/memories/export', { responseType: 'blob' }),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  deleteAccount: () => api.delete('/user/account'),
};

export default api; 