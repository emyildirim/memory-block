import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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