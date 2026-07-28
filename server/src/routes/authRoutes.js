const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require('../controllers/authController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, getProfile);
router.post('/logout', authenticateUser, logoutUser);

module.exports = router;
