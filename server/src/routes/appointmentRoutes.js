const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticateUser, authorizeRoles('executive'));
router.get('/today', appointmentController.getTodayAppointments);
router.get('/upcoming', appointmentController.getUpcomingAppointments);
router.get('/search', appointmentController.searchAppointments);
router.get('/filter', appointmentController.filterAppointments);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.editAppointment);
router.delete('/:id', appointmentController.removeAppointment);

module.exports = router;
