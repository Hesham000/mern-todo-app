// API configuration
import ENV from '../utils/env';

// Use the API URL from environment utility
const API_URL = ENV.API_URL;

export const API_ENDPOINTS = {
  TODOS: `${API_URL}/todos`,
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    LOGOUT: `${API_URL}/auth/logout`,
    PROFILE: `${API_URL}/auth/me`
  }
};

export default API_URL; 