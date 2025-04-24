import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const response = await authService.getProfile();
        // Handle different response formats
        const userData = response.data || response;
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid auth data
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      
      // Extract token and user from response (handling different response formats)
      const token = response.token || (response.data && response.data.token);
      const userData = response.user || (response.data && response.data.user) || response;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    
    // Format user data to match backend expectations
    const formattedData = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      ...(userData.phone && { phone: userData.phone })
    };
    
    try {
      const response = await authService.register(formattedData);
      
      // Don't automatically log in after registration
      return { success: true, data: response.data || response };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      // Call logout API to invalidate token on server
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear regardless of API success
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };
  
  // Helper function to get the user's name from the backend format
  const getUserName = () => {
    if (!user) return { firstName: '', lastName: '' };
    
    // Handle case where firstName/lastName are already on the user object
    if (user.firstName && user.lastName) {
      return { firstName: user.firstName, lastName: user.lastName };
    }
    
    const nameParts = user.name ? user.name.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return { firstName, lastName };
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      loading,
      error,
      login,
      register,
      logout,
      getUserName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 