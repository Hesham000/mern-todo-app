import { motion } from 'framer-motion';

/**
 * SlideIn component that animates its children with a slide-in effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.duration - Animation duration in seconds
 * @param {string} props.direction - Direction to slide from ('left', 'right', 'top', 'bottom')
 * @param {number} props.distance - Distance to slide in pixels
 * @param {string} props.className - Additional CSS classes
 */
const SlideIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  direction = 'left',
  distance = 50,
  className = '',
  ...props 
}) => {
  // Determine the initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'right':
        return { x: distance, opacity: 0 };
      case 'top':
        return { y: -distance, opacity: 0 };
      case 'bottom':
        return { y: distance, opacity: 0 };
      case 'left':
      default:
        return { x: -distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1.0] 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn; 