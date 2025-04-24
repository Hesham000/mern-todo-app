import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Box, Typography, Alert } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import useAuth from '../hooks/useAuth';
import AnimatedPage from '../components/common/AnimatedPage';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || '';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <AnimatedPage>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h4" 
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            gutterBottom 
            align="center"
            sx={{ mb: 4 }}
          >
            Welcome Back
          </Typography>
          
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Alert severity="success" sx={{ mb: 4 }}>
                {message}
              </Alert>
            </motion.div>
          )}
          
          <LoginForm />
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Login; 