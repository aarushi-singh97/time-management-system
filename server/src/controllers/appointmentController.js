const appointmentModel = require('../models/appointmentModel');
const { hasSchedulingConflict } = require('../services/slotFinderService');
const notificationService = require('../services/notificationService');
const { appointmentEmail } = require('../services/emailTemplates');

const validStatuses = ['scheduled', 'completed', 'cancelled'];

function isValidId(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);
  return parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day;
}

function isValidTime(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${date}T00:00:00`) < today;
}

function validateAppointment(appointment, checkPastDate) {
  const { title, appointment_date: appointmentDate, start_time: startTime, end_time: endTime, status } = appointment;

  if (!title?.trim() || !appointmentDate || !startTime || !endTime) {
    return 'Title, appointment date, start time, and end time are required.';
  }
  if (!isValidDate(appointmentDate)) return 'Please provide a valid appointment date.';
  if (!isValidTime(startTime) || !isValidTime(endTime)) return 'Please provide valid start and end times.';
  if (endTime <= startTime) return 'End time must be later than start time.';
  if (checkPastDate && isPastDate(appointmentDate)) return 'Appointments cannot be created in the past.';
  if (status && !validStatuses.includes(status)) return 'Please provide a valid appointment status.';
  return null;
}

function prepareAppointment(appointment) {
  return {
    title: appointment.title.trim(),
    description: appointment.description?.trim() || null,
    venue: appointment.venue?.trim() || null,
    appointment_type: appointment.appointment_type || 'appointment',
    status: appointment.status || 'scheduled',
    startDateTime: `${appointment.appointment_date} ${appointment.start_time}:00`,
    endDateTime: `${appointment.appointment_date} ${appointment.end_time}:00`,
  };
}

async function getAppointments(request, response, next) {
  try {
    const appointments = await appointmentModel.findAppointmentsByUser(request.user.id);
    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

async function getAppointmentById(request, response, next) {
  try {
    if (!isValidId(request.params.id)) return response.status(400).json({ message: 'Invalid appointment ID.' });
    const appointment = await appointmentModel.findAppointmentById(request.user.id, request.params.id);
    if (!appointment) return response.status(404).json({ message: 'Appointment not found.' });
    response.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
}

async function createAppointment(request, response, next) {
  try {
    const validationMessage = validateAppointment(request.body || {}, true);
    if (validationMessage) return response.status(400).json({ message: validationMessage });
    const conflict = await hasSchedulingConflict(request.user.id, request.body.appointment_date, request.body.start_time, request.body.end_time);
    if (conflict) return response.status(409).json({ message: 'You already have another engagement during this time.' });
    const appointmentId = await appointmentModel.createAppointment(request.user.id, prepareAppointment(request.body));
    await notificationService.send(request.user, 'appointment', appointmentEmail(request.body, 'Created'));
    response.status(201).json({ message: 'Appointment created successfully.', id: appointmentId });
  } catch (error) {
    next(error);
  }
}

async function editAppointment(request, response, next) {
  try {
    if (!isValidId(request.params.id)) return response.status(400).json({ message: 'Invalid appointment ID.' });
    const validationMessage = validateAppointment(request.body || {}, false);
    if (validationMessage) return response.status(400).json({ message: validationMessage });
    const conflict = await hasSchedulingConflict(request.user.id, request.body.appointment_date, request.body.start_time, request.body.end_time, request.params.id);
    if (conflict) return response.status(409).json({ message: 'You already have another engagement during this time.' });
    const updatedRows = await appointmentModel.updateAppointment(request.user.id, request.params.id, prepareAppointment(request.body));
    if (!updatedRows) return response.status(404).json({ message: 'Appointment not found.' });
    await notificationService.send(request.user, 'appointment', appointmentEmail(request.body, 'Updated'));
    response.status(200).json({ message: 'Appointment updated successfully.' });
  } catch (error) {
    next(error);
  }
}

async function removeAppointment(request, response, next) {
  try {
    if (!isValidId(request.params.id)) return response.status(400).json({ message: 'Invalid appointment ID.' });
    const appointment = await appointmentModel.findAppointmentById(request.user.id, request.params.id);
    const deletedRows = await appointmentModel.deleteAppointment(request.user.id, request.params.id);
    if (!deletedRows) return response.status(404).json({ message: 'Appointment not found.' });
    await notificationService.send(request.user, 'appointment', appointmentEmail({ ...appointment, appointment_date: String(appointment.start_time).slice(0, 10), start_time: String(appointment.start_time).slice(11, 16), end_time: String(appointment.end_time).slice(11, 16) }, 'Cancelled'));
    response.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

async function getTodayAppointments(request, response, next) {
  try {
    const appointments = await appointmentModel.findTodayAppointments(request.user.id);
    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

async function getUpcomingAppointments(request, response, next) {
  try {
    const appointments = await appointmentModel.findUpcomingAppointments(request.user.id);
    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

async function searchAppointments(request, response, next) {
  try {
    const keyword = request.query.keyword?.trim();
    if (!keyword) return response.status(400).json({ message: 'A search keyword is required.' });
    const appointments = await appointmentModel.searchAppointments(request.user.id, keyword);
    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

async function filterAppointments(request, response, next) {
  try {
    const { date, status } = request.query;
    if (date && !isValidDate(date)) return response.status(400).json({ message: 'Please provide a valid filter date.' });
    if (status && !validStatuses.includes(status)) return response.status(400).json({ message: 'Please provide a valid filter status.' });
    const appointments = await appointmentModel.filterAppointments(request.user.id, date, status);
    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAppointments, getAppointmentById, createAppointment, editAppointment, removeAppointment, getTodayAppointments, getUpcomingAppointments, searchAppointments, filterAppointments };
