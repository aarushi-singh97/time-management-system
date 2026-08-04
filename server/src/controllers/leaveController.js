const databasePool = require('../config/database');
const notificationService = require('../services/notificationService');
const { leaveEmail } = require('../services/emailTemplates');

function validId(id) { return Number.isInteger(Number(id)) && Number(id) > 0; }
function validDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return false;
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
}
function validDates(startDate, endDate) { return validDate(startDate) && validDate(endDate) && endDate >= startDate; }

async function getLeaves(request, response, next) {
  try {
    const isExecutive = request.user.role === 'executive';
    const query = isExecutive
      ? 'SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC'
      : 'SELECT leave_requests.*, users.full_name FROM leave_requests INNER JOIN users ON users.id = leave_requests.user_id ORDER BY leave_requests.created_at DESC';
    const [leaves] = await databasePool.execute(query, isExecutive ? [request.user.id] : []);
    response.json({ leaves });
  } catch (error) { next(error); }
}

async function createLeave(request, response, next) {
  try {
    const { leave_type: leaveType = 'annual', reason, start_date: startDate, end_date: endDate } = request.body || {};
    if (!['annual', 'sick', 'personal', 'other'].includes(leaveType) || !validDates(startDate, endDate)) return response.status(400).json({ message: 'Provide a valid leave type and date range.' });
    const [result] = await databasePool.execute('INSERT INTO leave_requests (user_id, leave_type, reason, start_date, end_date) VALUES (?, ?, ?, ?, ?)', [request.user.id, leaveType, reason?.trim() || null, startDate, endDate]);
    await notificationService.send(request.user, 'leave', leaveEmail({ start_date: startDate, end_date: endDate, reason }, 'Submitted'));
    response.status(201).json({ message: 'Leave request submitted successfully.', id: result.insertId });
  } catch (error) { next(error); }
}

async function updateLeave(request, response, next) {
  try {
    const { leave_type: leaveType, reason, start_date: startDate, end_date: endDate } = request.body || {};
    if (!validId(request.params.id) || !['annual', 'sick', 'personal', 'other'].includes(leaveType) || !validDates(startDate, endDate)) return response.status(400).json({ message: 'Provide valid leave details.' });
    const [result] = await databasePool.execute("UPDATE leave_requests SET leave_type = ?, reason = ?, start_date = ?, end_date = ? WHERE id = ? AND user_id = ? AND status = 'pending'", [leaveType, reason?.trim() || null, startDate, endDate, request.params.id, request.user.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Pending leave request not found.' });
    const [leaves] = await databasePool.execute('SELECT leave_requests.*, users.id user_id, users.full_name, users.email FROM leave_requests INNER JOIN users ON users.id = leave_requests.user_id WHERE leave_requests.id = ?', [request.params.id]);
    await notificationService.send({ id: leaves[0].user_id, full_name: leaves[0].full_name, email: leaves[0].email }, 'leave', leaveEmail(leaves[0], status === 'approved' ? 'Approved' : 'Rejected'));
    response.json({ message: 'Leave request updated successfully.' });
  } catch (error) { next(error); }
}

async function cancelLeave(request, response, next) {
  try {
    const [result] = await databasePool.execute("UPDATE leave_requests SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'pending'", [request.params.id, request.user.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Pending leave request not found.' });
    response.json({ message: 'Leave request cancelled successfully.' });
  } catch (error) { next(error); }
}

async function reviewLeave(request, response, next) {
  try {
    const status = request.params.action === 'approve' ? 'approved' : request.params.action === 'reject' ? 'rejected' : null;
    if (!status || !validId(request.params.id)) return response.status(400).json({ message: 'Invalid leave action.' });
    const [result] = await databasePool.execute("UPDATE leave_requests SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ? AND status = 'pending'", [status, request.user.id, request.params.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Pending leave request not found.' });
    response.json({ message: `Leave request ${status}.` });
  } catch (error) { next(error); }
}

module.exports = { getLeaves, createLeave, updateLeave, cancelLeave, reviewLeave };
