const express = require('express');
const leaveController = require('../controllers/leaveController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticateUser);
router.get('/', leaveController.getLeaves);
router.post('/', authorizeRoles('executive'), leaveController.createLeave);
router.put('/:id', authorizeRoles('executive'), leaveController.updateLeave);
router.delete('/:id', authorizeRoles('executive'), leaveController.cancelLeave);
router.put('/:id/:action', authorizeRoles('secretary', 'admin'), leaveController.reviewLeave);

module.exports = router;
