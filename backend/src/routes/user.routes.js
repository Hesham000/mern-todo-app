const express = require('express');
const { 
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.route('/profile')
  .put(protect, updateProfile);

router.route('/password')
  .put(protect, changePassword);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router; 