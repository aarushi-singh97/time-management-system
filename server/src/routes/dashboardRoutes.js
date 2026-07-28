const express = require('express');
const {
  getAdminDashboard,
  getSecretaryDashboard,
  getExecutiveDashboard,
} = require('../controllers/dashboardController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/admin', authenticateUser, authorizeRoles('admin'), getAdminDashboard);
router.get('/secretary', authenticateUser, authorizeRoles('secretary'), getSecretaryDashboard);
router.get('/executive', authenticateUser, authorizeRoles('executive'), getExecutiveDashboard);

module.exports = router;
