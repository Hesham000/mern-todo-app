const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

/**
 * Generate a JWT token
 * @param {string} userId - The ID of the user
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, keys.jwtSecret, {
    expiresIn: keys.jwtExpire
  });
};

/**
 * Generate a response with token and user data
 * @param {Object} user - User model instance
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Response object with token and user data
 */
const generateTokenResponse = (user, statusCode = 200) => {
  // Generate token
  const token = generateToken(user._id);

  // Return response
  return {
    statusCode,
    body: {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    }
  };
};

module.exports = {
  generateToken,
  generateTokenResponse
}; 