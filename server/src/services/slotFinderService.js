const databasePool = require('../config/database');

const OFFICE_START = 9 * 60;
const OFFICE_END = 18 * 60;

function toMinutes(time) {
  const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

async function getBusyPeriods(userIds, date, excludedAppointmentId, excludedMeetingId) {
  if (userIds.length === 0) return [];
  const placeholders = userIds.map(() => '?').join(', ');
  const dayStart = `${date} 00:00:00`;
  const dayEnd = `${date} 23:59:59`;
  const values = [...userIds, dayEnd, dayStart];
  const appointmentCondition = excludedAppointmentId ? ' AND id != ?' : '';
  if (excludedAppointmentId) values.push(excludedAppointmentId);
  const [appointments] = await databasePool.execute(
    `SELECT user_id, TIME_FORMAT(start_time, '%H:%i') AS start_time, TIME_FORMAT(end_time, '%H:%i') AS end_time, title
     FROM appointments WHERE user_id IN (${placeholders}) AND status = 'scheduled'
     AND start_time <= ? AND end_time >= ?${appointmentCondition}`,
    values
  );

  const meetingValues = [...userIds, dayEnd, dayStart];
  const meetingCondition = excludedMeetingId ? ' AND meetings.id != ?' : '';
  if (excludedMeetingId) meetingValues.push(excludedMeetingId);
  const [meetings] = await databasePool.execute(
    `SELECT meeting_participants.user_id, TIME_FORMAT(meetings.start_time, '%H:%i') AS start_time,
     TIME_FORMAT(meetings.end_time, '%H:%i') AS end_time, meetings.title
     FROM meetings INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id
     WHERE meeting_participants.user_id IN (${placeholders}) AND meetings.status = 'scheduled'
     AND meetings.start_time <= ? AND meetings.end_time >= ?${meetingCondition}`,
    meetingValues
  );

  const [leaves] = await databasePool.execute(
    `SELECT user_id, '09:00' AS start_time, '18:00' AS end_time, 'Approved leave' AS title
     FROM leave_requests WHERE user_id IN (${placeholders}) AND status = 'approved'
     AND start_date <= ? AND end_date >= ?`,
    [...userIds, date, date]
  );

  const [tasks] = await databasePool.execute(
    `SELECT user_id, TIME_FORMAT(start_time, '%H:%i') AS start_time, TIME_FORMAT(end_time, '%H:%i') AS end_time, title
     FROM personal_tasks WHERE user_id IN (${placeholders}) AND DATE(due_date) = ?
     AND start_time IS NOT NULL AND end_time IS NOT NULL AND status != 'completed'`,
    [...userIds, date]
  );

  return [...appointments, ...meetings, ...leaves, ...tasks].map((period) => ({
    ...period,
    start: toMinutes(period.start_time),
    end: toMinutes(period.end_time),
  }));
}

async function hasSchedulingConflict(userId, date, startTime, endTime, excludedAppointmentId, excludedMeetingId) {
  const busyPeriods = await getBusyPeriods([userId], date, excludedAppointmentId, excludedMeetingId);
  return busyPeriods.some((period) => overlaps(toMinutes(startTime), toMinutes(endTime), period.start, period.end));
}

async function findCommonSlots(userIds, date, duration) {
  const busyPeriods = await getBusyPeriods(userIds, date);
  const availableSlots = [];

  // Checking in 30-minute steps keeps the algorithm easy to understand and explain.
  for (let start = OFFICE_START; start + duration <= OFFICE_END; start += 30) {
    const end = start + duration;
    const isBusy = busyPeriods.some((period) => overlaps(start, end, period.start, period.end));
    if (!isBusy) availableSlots.push({ startTime: toTime(start), endTime: toTime(end) });
  }

  return { availableSlots, busyPeriods };
}

module.exports = { hasSchedulingConflict, findCommonSlots };
