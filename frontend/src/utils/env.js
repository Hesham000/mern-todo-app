/**
 * Environment utilities for accessing and checking environment variables
 */

// API_URL fallback for development
const API_URL_FALLBACK = 'http://localhost:5000/api/v1';

// Get an environment variable with a fallback value
export const getEnv = (key, fallback = '') => {
  return process.env[`REACT_APP_${key}`] || fallback;
};

// Check if the current environment is production
export const isProd = () => {
  return getEnv('ENV') === 'production';
};

// Check if the current environment is development
export const isDev = () => {
  return getEnv('ENV') === 'development' || !getEnv('ENV');
};

// Get the API URL
export const getApiUrl = () => {
  return getEnv('API_URL', API_URL_FALLBACK);
};

// Get the app version
export const getVersion = () => {
  return getEnv('VERSION', '1.0.0');
};

// Export an object with all the environment values
export const ENV = {
  API_URL: getApiUrl(),
  ENV: getEnv('ENV', 'development'),
  VERSION: getVersion(),
  IS_PROD: isProd(),
  IS_DEV: isDev()
};

export default ENV; 