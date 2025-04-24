// API URL
export const API_URL = process.env.REACT_APP_API_URL;

// Todo status options
export const TODO_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Todo priority options
export const TODO_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme'
};

// Environment variables
export const IS_DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';
export const ENABLE_ANALYTICS = process.env.REACT_APP_ENABLE_ANALYTICS === 'true'; 