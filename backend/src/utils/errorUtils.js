/**
 * Wrapper function to catch async errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a new AppError
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {AppError} - Custom error object
 */
const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

module.exports = {
  catchAsync,
  AppError,
  createError
}; 