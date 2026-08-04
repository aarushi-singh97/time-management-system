const databasePool = require('../config/database');
const { findCommonSlots, hasSchedulingConflict } = require('../services/slotFinderService');
const notificationService = require('../services/notificationService');
const { meetingEmail } = require('../services/emailTemplates');

function isPositiveId(value) { return Number.isInteger(Number(value)) && Number(value) > 0; }
function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return false;
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
}
function isValidTime(time) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(time); }

function validateMeeting(data) {
  if (!data.title?.trim() || !data.meeting_date || !data.start_time || !data.end_time) return 'Title, date, start time, and end time are required.';
  if (!isValidDate(data.meeting_date) || !isValidTime(data.start_time) || !isValidTime(data.end_time)) return 'Please provide a valid meeting date and time.';
  if (data.end_time <= data.start_time) return 'End time must be later than start time.';
  if (!Array.isArray(data.participant_ids) || data.participant_ids.length === 0) return 'Select at least one executive.';
  if (new Set(data.participant_ids.map(Number)).size !== data.participant_ids.length || !data.participant_ids.every(isPositiveId)) return 'Meeting participants must be unique valid users.';
  return null;
}

async function participantsAreExecutives(participantIds) {
  const uniqueIds = [...new Set(participantIds.map(Number))];
  const placeholders = uniqueIds.map(() => '?').join(', ');
  const [users] = await databasePool.execute(
    `SELECT id FROM users WHERE id IN (${placeholders}) AND role = 'executive' AND is_active = TRUE`,
    uniqueIds
  );
  return users.length === uniqueIds.length;
}

async function notifyParticipants(participantIds, meeting, action) {
  const placeholders = participantIds.map(() => '?').join(', ');
  const [users] = await databasePool.execute(`SELECT id, full_name, email FROM users WHERE id IN (${placeholders})`, participantIds);
  await Promise.all(users.map((user) => notificationService.send(user, 'meeting', meetingEmail(meeting, action))));
}

async function getExecutives(request, response, next) {
  try {
    const [executives] = await databasePool.execute("SELECT id, full_name, email FROM users WHERE role = 'executive' AND is_active = TRUE ORDER BY full_name");
    response.json({ executives });
  } catch (error) { next(error); }
}

async function getMeetings(request, response, next) {
  try {
    const isExecutive = request.user.role === 'executive';
    const query = isExecutive
      ? `SELECT DISTINCT meetings.*, projects.project_name FROM meetings
         INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id
         LEFT JOIN projects ON meetings.project_id = projects.id
         WHERE meeting_participants.user_id = ? ORDER BY meetings.start_time DESC`
      : `SELECT meetings.*, projects.project_name FROM meetings LEFT JOIN projects ON meetings.project_id = projects.id ORDER BY meetings.start_time DESC`;
    const [meetings] = await databasePool.execute(query, isExecutive ? [request.user.id] : []);
    response.json({ meetings });
  } catch (error) { next(error); }
}

async function getDateMeetings(request, response, next) {
  try {
    const isUpcoming = request.path === '/upcoming';
    const isExecutive = request.user.role === 'executive';
    const dateCondition = isUpcoming ? 'meetings.start_time > NOW()' : 'DATE(meetings.start_time) = CURDATE()';
    const query = isExecutive
      ? `SELECT meetings.* FROM meetings INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id WHERE meeting_participants.user_id = ? AND ${dateCondition} AND meetings.status = 'scheduled' ORDER BY meetings.start_time`
      : `SELECT meetings.* FROM meetings WHERE ${dateCondition} AND meetings.status = 'scheduled' ORDER BY meetings.start_time`;
    const [meetings] = await databasePool.execute(query, isExecutive ? [request.user.id] : []);
    response.json({ meetings });
  } catch (error) { next(error); }
}

async function getMeetingById(request, response, next) {
  try {
    if (!isPositiveId(request.params.id)) return response.status(400).json({ message: 'Invalid meeting ID.' });
    const [meetings] = await databasePool.execute('SELECT * FROM meetings WHERE id = ?', [request.params.id]);
    const meeting = meetings[0];
    if (!meeting) return response.status(404).json({ message: 'Meeting not found.' });
    if (request.user.role === 'executive') {
      const [participants] = await databasePool.execute('SELECT 1 FROM meeting_participants WHERE meeting_id = ? AND user_id = ?', [meeting.id, request.user.id]);
      if (!participants.length) return response.status(403).json({ message: 'You cannot view this meeting.' });
    }
    const [participants] = await databasePool.execute('SELECT users.id, users.full_name, users.email, meeting_participants.response_status FROM meeting_participants INNER JOIN users ON users.id = meeting_participants.user_id WHERE meeting_participants.meeting_id = ?', [meeting.id]);
    response.json({ meeting, participants });
  } catch (error) { next(error); }
}

async function findSlots(request, response, next) {
  try {
    const { executiveIds, date, duration } = request.body || {};
    if (!Array.isArray(executiveIds) || executiveIds.length === 0 || !isValidDate(date) || !Number.isInteger(Number(duration)) || Number(duration) <= 0) return response.status(400).json({ message: 'Executives, a valid date, and a positive duration are required.' });
    if (new Set(executiveIds.map(Number)).size !== executiveIds.length || !executiveIds.every(isPositiveId)) return response.status(400).json({ message: 'Executive IDs must be unique and valid.' });
    if (!(await participantsAreExecutives(executiveIds))) return response.status(400).json({ message: 'Select active executive users only.' });
    const result = await findCommonSlots(executiveIds.map(Number), date, Number(duration));
    response.json({ availableSlots: result.availableSlots });
  } catch (error) { next(error); }
}

async function createMeeting(request, response, next) {
  try {
    const validationMessage = validateMeeting(request.body || {});
    if (validationMessage) return response.status(400).json({ message: validationMessage });
    const data = request.body;
    if (!(await participantsAreExecutives(data.participant_ids))) return response.status(400).json({ message: 'Select active executive users only.' });
    for (const userId of data.participant_ids) {
      if (await hasSchedulingConflict(Number(userId), data.meeting_date, data.start_time, data.end_time)) return response.status(409).json({ message: 'One or more executives already have an engagement during this time.' });
    }
    const [result] = await databasePool.execute(
      'INSERT INTO meetings (title, agenda, venue, start_time, end_time, project_id, scheduled_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.title.trim(), data.purpose?.trim() || null, data.venue?.trim() || null, `${data.meeting_date} ${data.start_time}:00`, `${data.meeting_date} ${data.end_time}:00`, data.project_id || null, request.user.id]
    );
    for (const userId of data.participant_ids) await databasePool.execute('INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)', [result.insertId, Number(userId)]);
    await notifyParticipants(data.participant_ids, data, 'Invitation');
    response.status(201).json({ message: 'Meeting scheduled successfully.', id: result.insertId });
  } catch (error) { next(error); }
}

async function updateMeeting(request, response, next) {
  try {
    if (!isPositiveId(request.params.id)) return response.status(400).json({ message: 'Invalid meeting ID.' });
    const validationMessage = validateMeeting(request.body || {});
    if (validationMessage) return response.status(400).json({ message: validationMessage });
    const data = request.body;
    if (!(await participantsAreExecutives(data.participant_ids))) return response.status(400).json({ message: 'Select active executive users only.' });
    const [existing] = await databasePool.execute('SELECT id FROM meetings WHERE id = ?', [request.params.id]);
    if (!existing.length) return response.status(404).json({ message: 'Meeting not found.' });

    for (const userId of data.participant_ids) {
      if (await hasSchedulingConflict(Number(userId), data.meeting_date, data.start_time, data.end_time, null, request.params.id)) {
        return response.status(409).json({ message: 'One or more executives already have an engagement during this time.' });
      }
    }

    await databasePool.execute(
      'UPDATE meetings SET title = ?, agenda = ?, venue = ?, start_time = ?, end_time = ?, project_id = ? WHERE id = ?',
      [data.title.trim(), data.purpose?.trim() || null, data.venue?.trim() || null, `${data.meeting_date} ${data.start_time}:00`, `${data.meeting_date} ${data.end_time}:00`, data.project_id || null, request.params.id]
    );
    await databasePool.execute('DELETE FROM meeting_participants WHERE meeting_id = ?', [request.params.id]);
    for (const userId of data.participant_ids) await databasePool.execute('INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)', [request.params.id, Number(userId)]);
    await notifyParticipants(data.participant_ids, data, 'Updated');
    response.json({ message: 'Meeting updated successfully.' });
  } catch (error) { next(error); }
}

async function cancelMeeting(request, response, next) {
  try {
    if (!isPositiveId(request.params.id)) return response.status(400).json({ message: 'Invalid meeting ID.' });
    const [participants] = await databasePool.execute('SELECT users.id, users.full_name, users.email FROM users INNER JOIN meeting_participants ON users.id = meeting_participants.user_id WHERE meeting_participants.meeting_id = ?', [request.params.id]);
    const [meetings] = await databasePool.execute('SELECT title, DATE_FORMAT(start_time, \'%Y-%m-%d\') meeting_date, TIME_FORMAT(start_time, \'%H:%i\') start_time, TIME_FORMAT(end_time, \'%H:%i\') end_time, venue FROM meetings WHERE id = ?', [request.params.id]);
    const [result] = await databasePool.execute("UPDATE meetings SET status = 'cancelled' WHERE id = ?", [request.params.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Meeting not found.' });
    await Promise.all(participants.map((user) => notificationService.send(user, 'meeting', meetingEmail(meetings[0], 'Cancelled'))));
    response.json({ message: 'Meeting cancelled successfully.' });
  } catch (error) { next(error); }
}

module.exports = { getExecutives, getMeetings, getDateMeetings, getMeetingById, findSlots, createMeeting, updateMeeting, cancelMeeting };
