import axios from 'axios';
import { API_URL, STORAGE_KEYS, IS_DEBUG } from './constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow cookies to be sent with requests
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in debug mode
    if (IS_DEBUG) {
      console.log(`🔷 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    if (IS_DEBUG) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log responses in debug mode
    if (IS_DEBUG) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log errors in debug mode
    if (IS_DEBUG) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        error: error.message
      });
    }
    
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      // Clear all auth related data
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      
      // Only redirect to login if not already there and not a logout request
      if (window.location.pathname !== '/login' && !error.config.url.includes('/logout')) {
        console.warn('Authentication token expired or invalid. Redirecting to login page.');
        window.location.href = '/login';
      }
    }
    
    // Handle server errors (500)
    if (error.response && error.response.status >= 500) {
      console.error('Server error occurred. Please try again later.');
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Please check your connection or the backend server might be offline.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const AUTH_API = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

export const TODO_API = {
  getAll: (params) => api.get('/todos', { params }),
  getById: (id) => api.get(`/todos/${id}`),
  create: (todoData) => api.post('/todos', todoData),
  update: (id, todoData) => api.put(`/todos/${id}`, todoData),
  delete: (id) => api.delete(`/todos/${id}`),
  getStats: () => api.get('/todos/stats'),
  updateStatus: (id, status) => api.patch(`/todos/${id}/status`, { status }),
  updatePriority: (id, priority) => api.patch(`/todos/${id}/priority`, { priority }),
};

export const USER_API = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/password', passwordData),
};

export default api; 