const User = require('../models/User');
const { generateTokenResponse } = require('../utils/generateToken');
const { createError } = require('../utils/errorUtils');
const TokenBlacklist = require('../models/TokenBlacklist');

// Creates a new user account in the system
// Returns the user data with authentication token on success
// Throws an error if the email is already registered
const registerUser = async (userData) => {
  const { name, email, phone, password } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw createError('User already exists', 400);
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    phone,
    password
  });

  // Return user data with token
  if (user) {
    return generateTokenResponse(user, 201);
  } else {
    throw createError('Invalid user data', 400);
  }
};

// Authenticates a user with email and password
// Returns user data and JWT token on successful login
const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    return generateTokenResponse(user);
  } else {
    throw createError('Invalid email or password', 401);
  }
};

// Retrieves the profile information for a specific user
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
  } else {
    throw createError('User not found', 404);
  }
};

// Updates a user's profile information like name, email, and phone
// Validates that email isn't already in use if it's being changed
const updateUserProfile = async (userId, userData) => {
  const { name, email, phone } = userData;

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if email is already taken (if email is changed)
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      throw createError('Email already in use', 400);
    }
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // Save updated user
  const updatedUser = await user.save();

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role
  };
};

// Changes a user's password after verifying the current password
// Ensures new password meets minimum security requirements
const changeUserPassword = async (userId, currentPassword, newPassword) => {
  // Find user by ID with password
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    throw createError('Current password is incorrect', 401);
  }

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    throw createError('New password must be at least 6 characters', 400);
  }

  // Set new password
  user.password = newPassword;
  await user.save();
};

// Get a list of all users - restricted to admins
const getAllUsers = async () => {
  const users = await User.find().select('-__v');
  
  return users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  }));
};

// Fetch detailed information for a specific user by ID
// For admin use
const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };
  } else {
    throw createError('User not found', 404);
  }
};

// Update any user's information - admin function
// Can modify name, email, phone and role
const updateUser = async (userId, userData) => {
  const { name, email, phone, role } = userData;

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if email is already taken (if email is changed)
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      throw createError('Email already in use', 400);
    }
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (role && ['user', 'admin'].includes(role)) user.role = role;

  // Save updated user
  const updatedUser = await user.save();

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role
  };
};

// Permanently removes a user from the system - admin only
const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  await user.deleteOne();
};

// Adds a token to the blacklist to invalidate it during logout
// Tokens are stored with expiration to prevent DB bloat
const blacklistToken = async (token, userId) => {
  await TokenBlacklist.create({
    token,
    user: userId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Store for 24 hours
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blacklistToken
}; 