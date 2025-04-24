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
  Paper,
  Grid,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import SlideIn from '../common/SlideIn';
import FadeIn from '../common/FadeIn';
import LoadingAnimation from '../common/LoadingAnimation';
import useAuth from '../../hooks/useAuth';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading: authLoading, error: authError } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    // Phone validation (optional)
    if (formData.phone.trim() && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the register function from useAuth hook
      const result = await register(formData);
      
      if (result.success) {
        // Redirect to login page after successful registration
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your new account.' 
          } 
        });
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        staggerChildren: 0.08
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
        damping: 24
      }
    }
  };
  
  // Use either local error or auth error
  const displayError = error || authError;
  // Combine local loading state with auth loading state
  const isLoading = loading || authLoading;
  
  return (
    <SlideIn direction="right" distance={30} duration={0.5}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <FadeIn>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Create an Account
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
          onSubmit={handleRegister} 
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={isLoading}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={isLoading}
                />
              </motion.div>
            </Grid>
          </Grid>
          
          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Phone Number (Optional)"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={isLoading}
            />
          </motion.div>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
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
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={isLoading}
                />
              </motion.div>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
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
              startIcon={isLoading ? null : <RegisterIcon />}
            >
              {isLoading ? <LoadingAnimation size={8} duration={0.6} /> : 'Register'}
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <motion.span whileHover={{ color: '#1976d2' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                  >
                    Log In
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

export default RegisterForm; 