import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import ENV from '../utils/env';

// Use environment utility to check if in development mode
const isDev = ENV.IS_DEV;

// Log in development mode only
const logRequest = (method, url, data = null) => {
  if (isDev) {
    console.log(`🔹 API ${method.toUpperCase()}: ${url}`, data ? data : '');
  }
};

const logResponse = (method, url, response) => {
  if (isDev) {
    console.log(`✅ API ${method.toUpperCase()} Response: ${url}`, response);
  }
};

const logError = (method, url, error) => {
  // Always log errors, but with different levels
  if (isDev) {
    console.error(`❌ API ${method.toUpperCase()} Error: ${url}`, error);
  } else {
    // In production, we might send errors to a logging service
    console.error(`API Error: ${method} ${url}`);
  }
};

// Create axios instance with authentication header
const createAuthenticatedAxios = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true
  });
};

// Todo service for API operations
const todoService = {
  // Get all todos with optional filters
  getAllTodos: async (filters = {}) => {
    const url = API_ENDPOINTS.TODOS;
    logRequest('get', url, filters);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.get(url, { params: filters });
      logResponse('get', url, response.data);
      return response.data;
    } catch (error) {
      logError('get', url, error);
      throw error.response?.data || { message: 'Failed to fetch todos' };
    }
  },

  // Get todo statistics 
  getStats: async () => {
    const url = `${API_ENDPOINTS.TODOS}/stats`;
    logRequest('get', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.get(url);
      logResponse('get', url, response.data);
      return response.data;
    } catch (error) {
      logError('get', url, error);
      throw error.response?.data || { message: 'Failed to fetch todo statistics' };
    }
  },

  // Get a specific todo by ID
  getTodoById: async (id) => {
    const url = `${API_ENDPOINTS.TODOS}/${id}`;
    logRequest('get', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.get(url);
      logResponse('get', url, response.data);
      return response.data;
    } catch (error) {
      logError('get', url, error);
      throw error.response?.data || { message: 'Failed to fetch todo' };
    }
  },

  // Create a new todo
  createTodo: async (todoData) => {
    const url = API_ENDPOINTS.TODOS;
    logRequest('post', url, todoData);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.post(url, todoData);
      logResponse('post', url, response.data);
      return response.data;
    } catch (error) {
      logError('post', url, error);
      throw error.response?.data || { message: 'Failed to create todo' };
    }
  },

  // Update a todo
  updateTodo: async (id, todoData) => {
    const url = `${API_ENDPOINTS.TODOS}/${id}`;
    logRequest('put', url, todoData);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.put(url, todoData);
      logResponse('put', url, response.data);
      return response.data;
    } catch (error) {
      logError('put', url, error);
      throw error.response?.data || { message: 'Failed to update todo' };
    }
  },

  // Delete a todo
  deleteTodo: async (id) => {
    const url = `${API_ENDPOINTS.TODOS}/${id}`;
    logRequest('delete', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.delete(url);
      logResponse('delete', url, response.data);
      return response.data;
    } catch (error) {
      logError('delete', url, error);
      throw error.response?.data || { message: 'Failed to delete todo' };
    }
  },

  // Update todo status
  updateTodoStatus: async (id, status) => {
    const url = `${API_ENDPOINTS.TODOS}/${id}/status`;
    logRequest('patch', url, { status });
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.patch(url, { status });
      logResponse('patch', url, response.data);
      
      // Return the data property if it exists, otherwise return the whole response
      return response.data?.data || response.data;
    } catch (error) {
      logError('patch', url, error);
      throw error.response?.data || { message: 'Failed to update todo status' };
    }
  },
  
  // Update todo priority
  updateTodoPriority: async (id, priority) => {
    const url = `${API_ENDPOINTS.TODOS}/${id}/priority`;
    logRequest('patch', url, { priority });
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.patch(url, { priority });
      logResponse('patch', url, response.data);
      return response.data;
    } catch (error) {
      logError('patch', url, error);
      throw error.response?.data || { message: 'Failed to update todo priority' };
    }
  },
  
  // Get todos due today
  getTodosForToday: async () => {
    const url = `${API_ENDPOINTS.TODOS}/today`;
    logRequest('get', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.get(url);
      logResponse('get', url, response.data);
      return response.data;
    } catch (error) {
      logError('get', url, error);
      throw error.response?.data || { message: 'Failed to fetch today\'s todos' };
    }
  },
  
  // Get overdue todos
  getOverdueTodos: async () => {
    const url = `${API_ENDPOINTS.TODOS}/overdue`;
    logRequest('get', url);
    
    try {
      const api = createAuthenticatedAxios();
      const response = await api.get(url);
      logResponse('get', url, response.data);
      return response.data;
    } catch (error) {
      logError('get', url, error);
      throw error.response?.data || { message: 'Failed to fetch overdue todos' };
    }
  }
};

export default todoService; 