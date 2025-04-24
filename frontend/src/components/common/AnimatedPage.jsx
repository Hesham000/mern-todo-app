import { motion } from 'framer-motion';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

// Page transition settings
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

/**
 * Animated Page wrapper component to add consistent page transitions
 */
const AnimatedPage = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage; 