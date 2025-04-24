const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const keys = require('../config/keys');

/**
 * Custom middleware to sanitize MongoDB query inputs
 * Prevents NoSQL injection attacks
 */
const mongoSanitize = (req, res, next) => {
  if (!req.body) return next();

  const sanitizeObj = (obj) => {
    const result = {};
    Object.keys(obj).forEach(key => {
      // Skip sanitization for email and date fields
      if (key === 'email' || key === 'dueDate') {
        result[key] = obj[key];
        return;
      }

      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = sanitizeObj(obj[key]);
      } else if (Array.isArray(obj[key])) {
        result[key] = obj[key].map(item => {
          if (item && typeof item === 'object') {
            return sanitizeObj(item);
          }
          return sanitizeValue(item);
        });
      } else {
        result[key] = sanitizeValue(obj[key]);
      }
    });
    return result;
  };

  const sanitizeValue = (val) => {
    if (val === '$' || val === '.') {
      return '_';
    }
    if (typeof val === 'string') {
      return val.replace(/\$|\./g, '_');
    }
    return val;
  };

  req.body = sanitizeObj(req.body);
  req.query = sanitizeObj(req.query);
  req.params = sanitizeObj(req.params);

  next();
};

/**
 * Apply security middlewares to express app
 * @param {Express} app - Express app instance
 */
const applySecurityMiddleware = (app) => {
  // 1. Set secure HTTP headers
  app.use(helmet());

  // 2. Custom sanitize data to prevent NoSQL injection
  app.use(mongoSanitize);

  // 3. Rate limiting - more generous limits in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 1000 : 100, // Higher limit in development
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      success: false,
      message: 'Too many requests, please try again later.'
    }
  });
  
  // Apply rate limiting to API routes
  app.use(`/api/${keys.apiVersion}`, apiLimiter);

  // 4. Auth routes limiter (more strict, but still more generous in development)
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: isDevelopment ? 50 : 5, // Higher limit in development
    message: {
      success: false, 
      message: 'Too many login attempts, please try again after an hour'
    }
  });
  
  // Apply stricter rate limiting to auth routes
  app.use(`/api/${keys.apiVersion}/auth/login`, authLimiter);
  app.use(`/api/${keys.apiVersion}/auth/register`, authLimiter);
};

module.exports = applySecurityMiddleware; 