const express = require('express');
const controller = require('../controllers/notificationController');
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();
router.use(authenticateUser);
router.get('/settings', controller.getSettings);
router.put('/settings', controller.updateSettings);
module.exports = router;
