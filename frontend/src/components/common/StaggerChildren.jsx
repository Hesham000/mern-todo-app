import { motion } from 'framer-motion';

/**
 * StaggerChildren component that animates a group of elements with a staggered effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {number} props.staggerDelay - Delay between each child animation in seconds
 * @param {number} props.initialDelay - Initial delay before starting animations in seconds
 * @param {string} props.className - Additional CSS classes
 */
const StaggerChildren = ({ 
  children, 
  staggerDelay = 0.1, 
  initialDelay = 0,
  className = '',
  ...props 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };
  
  // Check if children is an array
  const childArray = Array.isArray(children) ? children : [children];
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      {...props}
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerChildren; 