const cron = require('node-cron');
const databasePool = require('../config/database');
const notificationService = require('./notificationService');
const { reminderEmail, summaryEmail } = require('./emailTemplates');

async function sendDailyReminders() {
  const [users] = await databasePool.execute("SELECT id, full_name, email FROM users WHERE is_active = TRUE");
  for (const user of users) {
    const [appointments] = await databasePool.execute("SELECT title, TIME_FORMAT(start_time, '%H:%i') time FROM appointments WHERE user_id = ? AND DATE(start_time) = CURDATE() AND status = 'scheduled'", [user.id]);
    const [meetings] = await databasePool.execute("SELECT meetings.title, TIME_FORMAT(meetings.start_time, '%H:%i') time FROM meetings INNER JOIN meeting_participants ON meetings.id = meeting_participants.meeting_id WHERE meeting_participants.user_id = ? AND DATE(meetings.start_time) = CURDATE() AND meetings.status = 'scheduled'", [user.id]);
    const [tasks] = await databasePool.execute("SELECT title, TIME_FORMAT(start_time, '%H:%i') time FROM personal_tasks WHERE user_id = ? AND DATE(due_date) = CURDATE() AND status != 'completed' AND start_time IS NOT NULL", [user.id]);
    const items = [...appointments.map((item) => ({ ...item, type: 'Appointment' })), ...meetings.map((item) => ({ ...item, type: 'Meeting' })), ...tasks.map((item) => ({ ...item, type: 'Task' }))];
    if (items.length) await notificationService.send(user, 'reminder', reminderEmail(items));
  }
}
async function sendSummaries(label) {
  const [users] = await databasePool.execute("SELECT id, full_name, email FROM users WHERE is_active = TRUE");
  for (const user of users) {
    const [tasks] = await databasePool.execute("SELECT COUNT(*) total FROM personal_tasks WHERE user_id = ? AND status != 'completed'", [user.id]);
    const [appointments] = await databasePool.execute("SELECT COUNT(*) total FROM appointments WHERE user_id = ? AND start_time > NOW() AND status = 'scheduled'", [user.id]);
    await notificationService.send(user, 'summary', summaryEmail({ 'Open tasks': tasks[0].total, 'Upcoming appointments': appointments[0].total }, label));
  }
}
function startScheduledNotifications() {
  cron.schedule('15 8 * * 1-5', () => sendDailyReminders().catch((error) => console.error('Reminder job failed:', error.message)), { timezone: process.env.CRON_TIMEZONE || 'Asia/Kolkata' });
  cron.schedule('30 17 * * 1-5', () => sendSummaries('Daily').catch((error) => console.error('Summary job failed:', error.message)), { timezone: process.env.CRON_TIMEZONE || 'Asia/Kolkata' });
  cron.schedule('0 17 * * 5', () => sendSummaries('Weekly').catch((error) => console.error('Weekly summary job failed:', error.message)), { timezone: process.env.CRON_TIMEZONE || 'Asia/Kolkata' });
}
module.exports = { startScheduledNotifications, sendDailyReminders, sendSummaries };
