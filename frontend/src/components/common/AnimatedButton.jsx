import { motion } from 'framer-motion';
import { Button } from '@mui/material';

/**
 * AnimatedButton component that adds hover and tap animations to MUI Button
 * 
 * @param {Object} props - Component props, extends MUI Button props
 * @param {string} props.scaleAmount - Scale amount on hover (default: 1.05)
 * @param {boolean} props.withHover - Whether to enable hover animations (default: true)
 * @param {boolean} props.withTap - Whether to enable tap animations (default: true)
 * @param {Object} props.hoverStyles - Custom hover styles to apply
 */
const AnimatedButton = ({ 
  children, 
  scaleAmount = 1.05,
  withHover = true,
  withTap = true,
  hoverStyles = {},
  ...props 
}) => {
  // Default hover animation
  const defaultHoverAnimation = withHover ? {
    scale: scaleAmount,
    transition: { duration: 0.2 },
    ...hoverStyles
  } : {};

  // Default tap animation
  const defaultTapAnimation = withTap ? {
    scale: 0.98,
    transition: { duration: 0.1 }
  } : {};

  return (
    <motion.div
      whileHover={defaultHoverAnimation}
      whileTap={defaultTapAnimation}
      style={{ display: 'inline-block' }}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton; 