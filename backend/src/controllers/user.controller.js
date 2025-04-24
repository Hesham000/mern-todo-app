const userService = require('../services/userService');
const { catchAsync } = require('../utils/errorUtils');

// Update the current user's profile information
exports.updateProfile = catchAsync(async (req, res) => {
  const userData = await userService.updateUserProfile(req.user._id, req.body);
  res.status(200).json({
    success: true,
    data: userData
  });
});

// Change the authenticated user's password
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  await userService.changeUserPassword(req.user._id, currentPassword, newPassword);
  
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// Get all users - admin only
exports.getUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// Get a specific user by ID - admin only
exports.getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Update a specific user - admin only
exports.updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Delete a user account - admin only
exports.deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
}); 