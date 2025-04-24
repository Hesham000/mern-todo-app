import { Box, Typography, Chip } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import ENV from '../../utils/env';

const AppInfo = () => {
  // Get environment values using our utility
  const environment = ENV.ENV;
  const version = ENV.VERSION;
  
  // Set color based on environment
  const getEnvColor = () => {
    switch (environment) {
      case 'production':
        return 'success';
      case 'staging':
        return 'warning';
      default:
        return 'info';
    }
  };
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        opacity: 0.7
      }}
    >
      <Typography variant="caption" color="textSecondary">
        v{version}
      </Typography>
      <Chip
        size="small"
        label={environment}
        color={getEnvColor()}
        icon={<InfoIcon fontSize="small" />}
        variant="outlined"
        sx={{ height: 24 }}
      />
    </Box>
  );
};

export default AppInfo; 