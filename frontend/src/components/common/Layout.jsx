import { Box, Container } from '@mui/material';
import Header from './Header';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <Box
      className="bg-pattern min-h-screen flex flex-col"
      sx={{
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="animate-float"
        style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(58, 134, 255, 0.08) 0%, rgba(58, 134, 255, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <motion.div
        className="animate-float"
        animate={{
          y: [0, -15, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse'
          }
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 0, 110, 0.05) 0%, rgba(255, 0, 110, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <motion.div
        className="animate-float"
        animate={{
          y: [0, 20, 0],
          transition: {
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 214, 160, 0.07) 0%, rgba(6, 214, 160, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Header />
      
      <Container 
        component="main" 
        sx={{ 
          py: 4, 
          flexGrow: 1,
          position: 'relative',
          zIndex: 1
        }}
        maxWidth="lg"
      >
        {children}
      </Container>
      
      <Box 
        component="footer"
        className="glass-card"
        sx={{ 
          py: 2, 
          textAlign: 'center',
          mt: 'auto',
          fontSize: '0.875rem',
          color: 'text.secondary',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container>
          Todo App © {new Date().getFullYear()}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 