const databasePool = require('../config/database');

async function getCount(query) {
  const [rows] = await databasePool.execute(query);
  return rows[0].total;
}

async function getAdminDashboard(request, response, next) {
  try {
    const dashboardData = {
      totalUsers: await getCount('SELECT COUNT(*) AS total FROM users'),
      totalExecutives: await getCount("SELECT COUNT(*) AS total FROM users WHERE role = 'executive'"),
      totalSecretaries: await getCount("SELECT COUNT(*) AS total FROM users WHERE role = 'secretary'"),
      totalMeetings: await getCount('SELECT COUNT(*) AS total FROM meetings'),
      totalAppointments: await getCount('SELECT COUNT(*) AS total FROM appointments'),
      totalLeaveRequests: await getCount('SELECT COUNT(*) AS total FROM leave_requests'),
      totalProjects: await getCount('SELECT COUNT(*) AS total FROM projects'),
    };

    response.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
}

async function getSecretaryDashboard(request, response, next) {
  try {
    const [todayMeetings] = await databasePool.execute(
      `SELECT id, title, venue, start_time, end_time
       FROM meetings WHERE DATE(start_time) = CURDATE() AND status = 'scheduled'
       ORDER BY start_time`
    );
    const [upcomingMeetings] = await databasePool.execute(
      `SELECT id, title, venue, start_time, end_time
       FROM meetings WHERE start_time > NOW() AND status = 'scheduled'
       ORDER BY start_time LIMIT 5`
    );

    response.status(200).json({
      todayMeetings,
      upcomingMeetings,
      totalExecutives: await getCount("SELECT COUNT(*) AS total FROM users WHERE role = 'executive'"),
      pendingLeaveRequests: await getCount("SELECT COUNT(*) AS total FROM leave_requests WHERE status = 'pending'"),
      meetingRequests: await getCount("SELECT COUNT(*) AS total FROM meeting_participants WHERE response_status = 'pending'"),
      availableMeetingRooms: [],
    });
  } catch (error) {
    next(error);
  }
}

async function getExecutiveDashboard(request, response, next) {
  try {
    const userId = request.user.id;
    const [todayAppointments] = await databasePool.execute(
      `SELECT id, title, venue, start_time, end_time, appointment_type
       FROM appointments WHERE user_id = ? AND DATE(start_time) = CURDATE()
       ORDER BY start_time`,
      [userId]
    );
    const [todayMeetings] = await databasePool.execute(
      `SELECT meetings.id, meetings.title, meetings.venue, meetings.start_time, meetings.end_time
       FROM meetings
       INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id
       WHERE meeting_participants.user_id = ? AND DATE(meetings.start_time) = CURDATE()
         AND meetings.status = 'scheduled'
       ORDER BY meetings.start_time`,
      [userId]
    );
    const [upcomingMeetings] = await databasePool.execute(
      `SELECT meetings.id, meetings.title, meetings.venue, meetings.start_time, meetings.end_time
       FROM meetings
       INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id
       WHERE meeting_participants.user_id = ? AND meetings.start_time > NOW()
         AND meetings.status = 'scheduled'
       ORDER BY meetings.start_time LIMIT 5`,
      [userId]
    );
    const [personalTasks] = await databasePool.execute(
      `SELECT id, title, due_date, priority, status
       FROM personal_tasks WHERE user_id = ? AND status != 'completed'
       ORDER BY due_date IS NULL, due_date LIMIT 5`,
      [userId]
    );
    const [leaveRequests] = await databasePool.execute(
      `SELECT id, leave_type, start_date, end_date, status
       FROM leave_requests WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    response.status(200).json({
      todayAppointments,
      todayMeetings,
      upcomingMeetings,
      personalTasks,
      leaveStatus: leaveRequests[0] || null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAdminDashboard, getSecretaryDashboard, getExecutiveDashboard };
