const notificationService = require('../services/notificationService');
const keys = ['appointment_emails', 'meeting_emails', 'leave_emails', 'reminder_emails', 'summary_emails'];
async function getSettings(request, response, next) { try { response.json({ settings: await notificationService.getSettings(request.user.id) }); } catch (error) { next(error); } }
async function updateSettings(request, response, next) { try { const settings = request.body || {}; if (!keys.every((key) => typeof settings[key] === 'boolean')) return response.status(400).json({ message: 'All notification settings must be true or false.' }); await notificationService.saveSettings(request.user.id, settings); response.json({ message: 'Notification settings updated.' }); } catch (error) { next(error); } }
module.exports = { getSettings, updateSettings };
