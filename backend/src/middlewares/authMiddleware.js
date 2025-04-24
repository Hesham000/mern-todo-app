const passport = require('passport');
const { createError } = require('../utils/errorUtils');
const TokenBlacklist = require('../models/TokenBlacklist');

// Authentication middleware that protects routes requiring login
const protect = async (req, res, next) => {
  // Extract token from header if present
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
    
    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return next(createError('Token has been revoked', 401));
    }
  }

  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(createError('Authentication error', 401));
    }
    
    if (!user) {
      return next(
        createError(
          info && info.message ? info.message : 'Not authorized, no token or invalid token',
          401
        )
      );
    }
    
    // Set user in request object
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to restrict access to admin users only
const admin = (req, res, next) => {
  // Check if user exists and has admin role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(createError('Not authorized as admin', 403));
  }
};

module.exports = {
  protect,
  admin
}; 