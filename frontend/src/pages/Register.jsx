import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Box, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';
import AnimatedPage from '../components/common/AnimatedPage';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <AnimatedPage>
      <Container maxWidth="md">
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
            Create Your Account
          </Typography>
          
          <RegisterForm />
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Register; 