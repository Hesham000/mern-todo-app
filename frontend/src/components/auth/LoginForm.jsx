import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import SlideIn from '../common/SlideIn';
import FadeIn from '../common/FadeIn';
import LoadingAnimation from '../common/LoadingAnimation';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the login function from useAuth hook
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to home page on successful login
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Animation variants for form fields
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  // Use either local error or auth error
  const displayError = error || authError;
  // Combine local loading state with auth loading state
  const isLoading = loading || authLoading;
  
  return (
    <SlideIn distance={30} duration={0.5}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <FadeIn>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Log In
          </Typography>
        </FadeIn>
        
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {displayError}
            </Alert>
          </motion.div>
        )}
        
        <Box 
          component={motion.form}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleLogin} 
          noValidate
        >
          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handlePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              startIcon={isLoading ? null : <LoginIcon />}
            >
              {isLoading ? <LoadingAnimation size={8} duration={0.6} /> : 'Log In'}
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <motion.span whileHover={{ color: '#1976d2' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/register')}
                    disabled={isLoading}
                  >
                    Sign Up
                  </Button>
                </motion.span>
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </SlideIn>
  );
};

export default LoginForm; 