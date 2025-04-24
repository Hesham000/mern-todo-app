const { validationResult } = require('express-validator');
const { logger } = require('../utils/logger');

/**
 * Middleware for validating request using express-validator
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const validateRequest = (req, res, next) => {
  // Debug incoming request
  logger.debug('Validating request body:', req.body);
  
  // Check validation results
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Log validation errors
    logger.debug('Validation errors:', errors.array());
    
    // If there are validation errors, return them
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  // If validation passes, continue
  logger.debug('Request validation passed');
  next();
};

module.exports = validateRequest; 