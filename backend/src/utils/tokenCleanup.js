const TokenBlacklist = require('../models/TokenBlacklist');
const { logger } = require('./logger');

// Removes old and expired tokens from the blacklist to keep the database clean
// Should be run on a schedule (e.g. hourly)
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    const result = await TokenBlacklist.deleteMany({ expiresAt: { $lt: now } });
    logger.info(`Cleaned up ${result.deletedCount} expired tokens from blacklist`);
  } catch (error) {
    logger.error('Error cleaning up token blacklist:', error);
  }
};

module.exports = {
  cleanupExpiredTokens
}; 