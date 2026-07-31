const express = require('express');
const meetingController = require('../controllers/meetingController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticateUser);
router.get('/today', meetingController.getDateMeetings);
router.get('/upcoming', meetingController.getDateMeetings);
router.get('/executives', authorizeRoles('secretary', 'admin'), meetingController.getExecutives);
router.post('/find-slots', authorizeRoles('secretary', 'admin'), meetingController.findSlots);
router.get('/', meetingController.getMeetings);
router.get('/:id', meetingController.getMeetingById);
router.post('/', authorizeRoles('secretary', 'admin'), meetingController.createMeeting);
router.put('/:id/cancel', authorizeRoles('secretary', 'admin'), meetingController.cancelMeeting);

module.exports = router;
