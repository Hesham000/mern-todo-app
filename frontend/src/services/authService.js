import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import ENV from '../utils/env';
import { STORAGE_KEYS } from '../utils/constants';

// Environment check for logging
const isDev = ENV.IS_DEV;

// Log in development mode only
const logRequest = (method, url, data = null) => {
  if (isDev) {
    console.log(`🔹 AUTH API ${method.toUpperCase()}: ${url}`, data ? data : '');
  }
};

const logResponse = (method, url, response) => {
  if (isDev) {
    console.log(`✅ AUTH API ${method.toUpperCase()} Response: ${url}`, response);
  }
};

const logError = (method, url, error) => {
  // Always log errors, but with different levels
  if (isDev) {
    console.error(`❌ AUTH API ${method.toUpperCase()} Error: ${url}`, error);
  } else {
    // In production, we might send errors to a logging service
    console.error(`AUTH API Error: ${method} ${url}`);
  }
};

// Create axios instance with authentication header
const createAuthenticatedAxios = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true
  });
};

// Authentication service for API operations
const authService = {
  // Register a new user
  register: async (userData) => {
    const url = API_ENDPOINTS.AUTH.REGISTER;
    logRequest('post', url, { ...userData, password: '***' });
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.post(url, userData);
      logResponse('post', url, response.data);
      return response.data;
    } catch (error) {
      logError('post', url, error);
      throw error.response?.data || { message: 'Registration failed. Please try again.' };
    }
  },
  
  // Log in a user
  login: async (credentials) => {
    const url = API_ENDPOINTS.AUTH.LOGIN;
    logRequest('post', url, { ...credentials, password: '***' });
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.post(url, credentials);
      
      // Save token in localStorage if it's in response
      if (response.data && response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      }
      
      logResponse('post', url, response.data);
      return response.data;
    } catch (error) {
      logError('post', url, error);
      throw error.response?.data || { message: 'Login failed. Please check your credentials.' };
    }
  },
  
  // Log out a user
  logout: async () => {
    const url = API_ENDPOINTS.AUTH.LOGOUT;
    logRequest('post', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.post(url);
      
      // Remove token from localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      
      logResponse('post', url, response.data);
      return response.data;
    } catch (error) {
      logError('post', url, error);
      // Still remove token and consider logout successful even if API fails
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return { success: true, message: 'Logged out successfully' };
    }
  },
  
  // Get current user profile
  getProfile: async () => {
    const url = API_ENDPOINTS.AUTH.PROFILE;
    logRequest('get', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.get(url);
      logResponse('get', url, response.data);
      return response.data;
    } catch (error) {
      logError('get', url, error);
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    const url = API_ENDPOINTS.AUTH.PROFILE;
    logRequest('put', url, userData);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.put(url, userData);
      logResponse('put', url, response.data);
      return response.data;
    } catch (error) {
      logError('put', url, error);
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
  
  // Change user password
  changePassword: async (passwordData) => {
    const url = `${API_ENDPOINTS.AUTH.PROFILE}/password`;
    logRequest('put', url, { ...passwordData, currentPassword: '***', newPassword: '***' });
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.put(url, passwordData);
      logResponse('put', url, { success: true });
      return response.data;
    } catch (error) {
      logError('put', url, error);
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },
  
  // Check if the user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
};

export default authService; 