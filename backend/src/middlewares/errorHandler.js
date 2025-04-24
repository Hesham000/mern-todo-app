const keys = require('../config/keys');

/**
 * Error response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} stack - Error stack trace (only in development)
 * @returns {Object} Error response object
 */
const errorResponse = (statusCode, message, stack) => {
  const response = {
    success: false,
    error: {
      statusCode,
      message
    }
  };

  // Only include stack trace in development environment
  if (keys.environment === 'development' && stack) {
    response.error.stack = stack;
  }

  return response;
};

/**
 * Not found error middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  res.status(statusCode).json(errorResponse(statusCode, message, err.stack));
};

module.exports = {
  notFound,
  errorHandler
}; 