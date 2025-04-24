import { motion } from 'framer-motion';
import { Box } from '@mui/material';

/**
 * A custom loading animation using Framer Motion
 * 
 * @param {Object} props - Component props
 * @param {string} props.color - Color of the loading dots
 * @param {number} props.size - Size of the loading dots in pixels
 * @param {number} props.duration - Animation duration in seconds
 */
const LoadingAnimation = ({ 
  color = '#1976d2',
  size = 12,
  duration = 0.5,
  ...props 
}) => {
  // Animation variants for the dots
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [-10, 0, -10] }
  };
  
  // Animation transition for the dots
  const dotTransition = (delay) => ({
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
    delay
  });
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        py: 2
      }}
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%'
          }}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={dotTransition(index * 0.15)}
        />
      ))}
    </Box>
  );
};

export default LoadingAnimation; 