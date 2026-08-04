const databasePool = require('../config/database');
const transporter = require('../config/email');

const settingColumn = { appointment: 'appointment_emails', meeting: 'meeting_emails', leave: 'leave_emails', reminder: 'reminder_emails', summary: 'summary_emails' };
function mailReady() { return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD); }
async function log(userId, type, subject, status, errorMessage = null) { await databasePool.execute('INSERT INTO notification_logs (user_id, notification_type, subject, delivery_status, error_message) VALUES (?, ?, ?, ?, ?)', [userId, type, subject, status, errorMessage]); }
async function enabled(userId, type) {
  const [rows] = await databasePool.execute('SELECT * FROM notification_settings WHERE user_id = ?', [userId]);
  return !rows[0] || rows[0][settingColumn[type]];
}
async function send(user, type, email) {
  if (!user?.email) return;
  if (!(await enabled(user.id, type))) return log(user.id, type, email.subject, 'skipped', 'Disabled by user');
  if (!mailReady()) return log(user.id, type, email.subject, 'skipped', 'SMTP is not configured');
  try { await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to: user.email, subject: email.subject, html: email.html }); await log(user.id, type, email.subject, 'sent'); }
  catch (error) { await log(user.id, type, email.subject, 'failed', error.message.slice(0, 255)); console.error(`Email to ${user.email} failed:`, error.message); }
}
async function getSettings(userId) { const [rows] = await databasePool.execute('SELECT appointment_emails, meeting_emails, leave_emails, reminder_emails, summary_emails FROM notification_settings WHERE user_id = ?', [userId]); return rows[0] || { appointment_emails: true, meeting_emails: true, leave_emails: true, reminder_emails: true, summary_emails: true }; }
async function saveSettings(userId, settings) { await databasePool.execute('INSERT INTO notification_settings (user_id, appointment_emails, meeting_emails, leave_emails, reminder_emails, summary_emails) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE appointment_emails = VALUES(appointment_emails), meeting_emails = VALUES(meeting_emails), leave_emails = VALUES(leave_emails), reminder_emails = VALUES(reminder_emails), summary_emails = VALUES(summary_emails)', [userId, settings.appointment_emails, settings.meeting_emails, settings.leave_emails, settings.reminder_emails, settings.summary_emails]); }
module.exports = { send, getSettings, saveSettings };
