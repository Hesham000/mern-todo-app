import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, ChecklistRtl as ListIcon } from '@mui/icons-material';

const EmptyState = ({ message = "You don't have any todos yet." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        className="glass-card"
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <motion.div
          className="animate-float"
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: 'reverse' 
          }}
        >
          <ListIcon 
            sx={{ 
              fontSize: 100, 
              color: 'primary.main',
              opacity: 0.7,
              mb: 2
            }} 
          />
        </motion.div>
        
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          No Todos Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
        >
          {message} Get started by creating your first todo!
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              component={Link}
              to="/add"
              startIcon={<AddIcon />}
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Create Todo
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default EmptyState; 