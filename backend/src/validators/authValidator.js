const { body } = require('express-validator');
const { logger } = require('../utils/logger');

// Debug each validation field independently
const debugValidation = (value, { req }) => {
  logger.debug(`Validation value: ${value}`);
  return true;
};

/**
 * Validation rules for user registration
 */
const registerValidator = [
  body('name')
    .custom(debugValidation)
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .custom(debugValidation)
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    }),
    
  body('password')
    .custom(debugValidation)
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  body('phone')
    .custom(debugValidation)
    .notEmpty()
    .withMessage('Phone number is required')
    .custom(value => {
      // Simple regex for phone validation - allows more formats
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
      logger.debug(`Phone validation: ${value}, matches: ${phoneRegex.test(value)}`);
      if (!phoneRegex.test(value)) {
        throw new Error('Please enter a valid phone number');
      }
      return true;
    })
];

/**
 * Validation rules for user login
 */
const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    }),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  registerValidator,
  loginValidator
}; 