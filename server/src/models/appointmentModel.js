const databasePool = require('../config/database');

const appointmentColumns = `
  id, title, description, venue, appointment_type, status,
  DATE_FORMAT(start_time, '%Y-%m-%d') AS appointment_date,
  TIME_FORMAT(start_time, '%H:%i') AS start_time,
  TIME_FORMAT(end_time, '%H:%i') AS end_time,
  created_at, updated_at`;

async function findAppointmentsByUser(userId) {
  const [appointments] = await databasePool.execute(
    `SELECT ${appointmentColumns} FROM appointments
     WHERE user_id = ? ORDER BY appointments.start_time DESC`,
    [userId]
  );
  return appointments;
}

async function findAppointmentById(userId, appointmentId) {
  const [appointments] = await databasePool.execute(
    `SELECT ${appointmentColumns} FROM appointments
     WHERE id = ? AND user_id = ?`,
    [appointmentId, userId]
  );
  return appointments[0];
}

async function createAppointment(userId, appointment) {
  const [result] = await databasePool.execute(
    `INSERT INTO appointments (user_id, title, description, venue, start_time, end_time, appointment_type, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, appointment.title, appointment.description, appointment.venue, appointment.startDateTime,
      appointment.endDateTime, appointment.appointment_type || 'appointment', appointment.status || 'scheduled']
  );
  return result.insertId;
}

async function updateAppointment(userId, appointmentId, appointment) {
  const [result] = await databasePool.execute(
    `UPDATE appointments
     SET title = ?, description = ?, venue = ?, start_time = ?, end_time = ?, status = ?
     WHERE id = ? AND user_id = ?`,
    [appointment.title, appointment.description, appointment.venue, appointment.startDateTime,
      appointment.endDateTime, appointment.status, appointmentId, userId]
  );
  return result.affectedRows;
}

async function deleteAppointment(userId, appointmentId) {
  const [result] = await databasePool.execute(
    'DELETE FROM appointments WHERE id = ? AND user_id = ?',
    [appointmentId, userId]
  );
  return result.affectedRows;
}

async function findTodayAppointments(userId) {
  const [appointments] = await databasePool.execute(
    `SELECT ${appointmentColumns} FROM appointments
     WHERE user_id = ? AND DATE(start_time) = CURDATE() ORDER BY appointments.start_time`,
    [userId]
  );
  return appointments;
}

async function findUpcomingAppointments(userId) {
  const [appointments] = await databasePool.execute(
    `SELECT ${appointmentColumns} FROM appointments
     WHERE user_id = ? AND start_time > NOW() AND status = 'scheduled'
     ORDER BY appointments.start_time`,
    [userId]
  );
  return appointments;
}

async function searchAppointments(userId, keyword) {
  const searchValue = `%${keyword}%`;
  const [appointments] = await databasePool.execute(
    `SELECT ${appointmentColumns} FROM appointments
     WHERE user_id = ? AND (title LIKE ? OR venue LIKE ? OR description LIKE ?)
     ORDER BY appointments.start_time DESC`,
    [userId, searchValue, searchValue, searchValue]
  );
  return appointments;
}

async function filterAppointments(userId, date, status) {
  let query = `SELECT ${appointmentColumns} FROM appointments WHERE user_id = ?`;
  const values = [userId];

  if (date) {
    query += ' AND DATE(start_time) = ?';
    values.push(date);
  }
  if (status) {
    query += ' AND status = ?';
    values.push(status);
  }
  query += ' ORDER BY appointments.start_time DESC';

  const [appointments] = await databasePool.execute(query, values);
  return appointments;
}

module.exports = {
  findAppointmentsByUser,
  findAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  findTodayAppointments,
  findUpcomingAppointments,
  searchAppointments,
  filterAppointments,
};
