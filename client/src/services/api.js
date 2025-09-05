import axios from 'axios';

// API base URL - will use environment variable in production if available
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Only log in development
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

// Create axios instance with optimized configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token and performance tracking
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date() };
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.log(`Request to: ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic and performance monitoring
api.interceptors.response.use(
  (response) => {
    // Log performance metrics in development
    if (import.meta.env.DEV && response.config.metadata) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`Request to ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Retry logic for network errors
    if (!originalRequest._retry && error.code === 'NETWORK_ERROR') {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= 3) {
        // Exponential backoff
        const delay = Math.pow(2, originalRequest._retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }
    
    // Only log detailed errors in development
    if (import.meta.env.DEV) {
      console.error('Response error:', error);
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
      } else if (error.request) {
        console.log('No response received:', error.request);
      }
    }
    
    // Handle authentication errors
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