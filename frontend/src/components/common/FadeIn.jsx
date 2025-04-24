import { motion } from 'framer-motion';

/**
 * FadeIn component that animates its children with a fade-in effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.duration - Animation duration in seconds
 * @param {string} props.className - Additional CSS classes
 */
const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration, 
        delay, 
        ease: 'easeOut' 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn; 