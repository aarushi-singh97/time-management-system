const databasePool = require('../config/database');

function getRange(query) {
  const today = new Date();
  const toDate = (date) => date.toISOString().slice(0, 10);
  const start = new Date(today); start.setHours(0, 0, 0, 0);
  if (query.startDate && query.endDate) return { start: query.startDate, end: query.endDate };
  if (query.period === 'week') start.setDate(start.getDate() - start.getDay());
  if (query.period === 'month') start.setDate(1);
  if (query.period === 'year') start.setMonth(0, 1);
  return { start: toDate(start), end: toDate(today) };
}

function userScope(user, column = 'user_id') {
  return user.role === 'executive' ? { where: ` AND ${column} = ?`, values: [user.id] } : { where: '', values: [] };
}

async function one(sql, values = []) { const [rows] = await databasePool.execute(sql, values); return rows[0]; }

async function getDashboardReport(user) {
  const scope = userScope(user, 'appointments.user_id');
  const meetingScope = user.role === 'executive'
    ? { join: ' INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id', where: ' AND meeting_participants.user_id = ?', values: [user.id] }
    : { join: '', where: '', values: [] };
  const taskScope = userScope(user, 'user_id');
  const leaveScope = userScope(user, 'user_id');
  const [appointments, meetings, projects, leaves, tasks, completed, pending, upcomingMeetings, upcomingAppointments] = await Promise.all([
    one(`SELECT COUNT(*) total FROM appointments WHERE 1=1${scope.where}`, scope.values),
    one(`SELECT COUNT(*) total FROM meetings${meetingScope.join} WHERE 1=1${meetingScope.where}`, meetingScope.values),
    one('SELECT COUNT(*) total FROM projects'), one(`SELECT COUNT(*) total FROM leave_requests WHERE 1=1${leaveScope.where}`, leaveScope.values),
    one(`SELECT COUNT(*) total FROM personal_tasks WHERE 1=1${taskScope.where}`, taskScope.values),
    one(`SELECT COUNT(*) total FROM personal_tasks WHERE status = 'completed'${taskScope.where}`, taskScope.values),
    one(`SELECT COUNT(*) total FROM personal_tasks WHERE status != 'completed'${taskScope.where}`, taskScope.values),
    one(`SELECT COUNT(*) total FROM meetings${meetingScope.join} WHERE meetings.start_time > NOW() AND meetings.status = 'scheduled'${meetingScope.where}`, meetingScope.values),
    one(`SELECT COUNT(*) total FROM appointments WHERE start_time > NOW() AND status = 'scheduled'${scope.where}`, scope.values),
  ]);
  return { totalAppointments: appointments.total, totalMeetings: meetings.total, totalProjects: projects.total, totalLeaveRequests: leaves.total, totalPersonalTasks: tasks.total, completedTasks: completed.total, pendingTasks: pending.total, upcomingMeetings: upcomingMeetings.total, upcomingAppointments: upcomingAppointments.total };
}

async function getAnalytics(user, query) {
  const range = getRange(query); const scope = userScope(user); const appointmentScope = userScope(user, 'user_id');
  const meetingScope = user.role === 'executive' ? { join: ' INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id', where: ' AND meeting_participants.user_id = ?', values: [user.id] } : { join: '', where: '', values: [] };
  const [appointments, meetings, leaves, tasks, projects, appointmentTrend, meetingTrend, taskTrend] = await Promise.all([
    one(`SELECT SUM(DATE(start_time)=CURDATE()) today, SUM(YEARWEEK(start_time, 1)=YEARWEEK(CURDATE(), 1)) week, SUM(YEAR(start_time)=YEAR(CURDATE()) AND MONTH(start_time)=MONTH(CURDATE())) month FROM appointments WHERE 1=1${appointmentScope.where}`, appointmentScope.values),
    one(`SELECT SUM(DATE(meetings.start_time)=CURDATE()) today, SUM(YEARWEEK(meetings.start_time, 1)=YEARWEEK(CURDATE(), 1)) week, SUM(YEAR(meetings.start_time)=YEAR(CURDATE()) AND MONTH(meetings.start_time)=MONTH(CURDATE())) month FROM meetings${meetingScope.join} WHERE 1=1${meetingScope.where}`, meetingScope.values),
    one(`SELECT SUM(status='pending') pending, SUM(status='approved') approved, SUM(status='rejected') rejected FROM leave_requests WHERE 1=1${scope.where}`, scope.values),
    one(`SELECT SUM(status='completed') completed, SUM(status!='completed') pending, SUM(status!='completed' AND due_date < CURDATE()) overdue FROM personal_tasks WHERE 1=1${scope.where}`, scope.values),
    one("SELECT SUM(status='active') active, SUM(status='completed') completed FROM projects"),
    trend('appointments', 'start_time', appointmentScope, range), trend(`meetings${meetingScope.join}`, 'meetings.start_time', meetingScope, range), trend('personal_tasks', 'due_date', scope, range),
  ]);
  return { range, appointments, meetings, leaves, tasks, projects, charts: { appointments: appointmentTrend, meetings: meetingTrend, taskCompletion: taskTrend, leaveRequests: [leaves], projectStatus: [projects] } };
}

async function trend(table, dateColumn, scope, range) {
  const [rows] = await databasePool.execute(`SELECT DATE(${dateColumn}) AS date, COUNT(*) AS total FROM ${table} WHERE ${dateColumn} >= ? AND ${dateColumn} < DATE_ADD(?, INTERVAL 1 DAY)${scope.where} GROUP BY DATE(${dateColumn}) ORDER BY date`, [range.start, range.end, ...scope.values]);
  return rows;
}

module.exports = { getDashboardReport, getAnalytics, getRange };
