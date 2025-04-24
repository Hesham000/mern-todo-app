import { Box, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Paper 
      elevation={0} 
      className="flex flex-col items-center justify-center p-8 text-center"
      sx={{ minHeight: '60vh' }}
    >
      <Typography 
        variant="h1" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '6rem', sm: '10rem' },
          fontWeight: 'bold',
          color: 'primary.main',
          opacity: 0.2
        }}
      >
        404
      </Typography>
      
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/"
        startIcon={<HomeIcon />}
        size="large"
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </Paper>
  );
};

export default NotFound; 