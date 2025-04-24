import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Grid,
  Alert
} from '@mui/material';
import { AccountCircle as AccountIcon, Save as SaveIcon } from '@mui/icons-material';
import { formatDate } from '../utils/dateUtils';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import AnimatedPage from '../components/common/AnimatedPage';
import FadeIn from '../components/common/FadeIn';
import LoadingAnimation from '../components/common/LoadingAnimation';

const Profile = () => {
  const { user, getUserName, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = getUserName();
      const fullName = `${firstName} ${lastName}`.trim();
      
      setFormData(prev => ({
        ...prev,
        name: fullName || user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, getUserName]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // If changing password, validate password fields
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return false;
      }
      
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Split name into first name and last name
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Send update to API
      const updatedData = {
        firstName,
        lastName,
        email: formData.email
      };
      
      // Update profile
      await authService.updateProfile(updatedData);
      
      // If password fields are filled, update password separately
      if (formData.currentPassword && formData.newPassword) {
        await authService.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      }
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const isLoading = loading || authLoading;
  
  // Show loading while user data is being fetched
  if (authLoading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingAnimation size={15} duration={0.7} />
      </Box>
    );
  }
  
  return (
    <AnimatedPage>
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <FadeIn>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
                  <AccountIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" component="h1" gutterBottom>
                  {user?.name || formData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {formatDate(new Date(user?.createdAt || Date.now()))}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 4 }} />
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </Grid>
                </Grid>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Change Password
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? null : <SaveIcon />}
                    sx={{ minWidth: 120 }}
                  >
                    {isLoading ? <LoadingAnimation size={8} duration={0.6} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </FadeIn>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Profile; 