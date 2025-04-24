const mongoose = require('mongoose');
const keys = require('./keys');

/**
 * Database connection function
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(keys.mongodbUri, {
      // Setting the connection options is no longer needed in mongoose 6+
      // These options are now default
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 