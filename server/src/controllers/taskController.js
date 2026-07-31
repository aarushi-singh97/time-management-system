const databasePool = require('../config/database');

function validId(id) { return Number.isInteger(Number(id)) && Number(id) > 0; }
function validTime(time) { return !time || /^([01]\d|2[0-3]):[0-5]\d$/.test(time); }
function prepareTask(data) {
  return [data.title.trim(), data.description?.trim() || null, data.task_date ? `${data.task_date} 00:00:00` : null, data.start_time || null, data.end_time || null, data.priority || 'medium', data.status || 'pending'];
}
function validateTask(data) {
  if (!data.title?.trim() || !data.task_date) return 'Title and task date are required.';
  if (!validTime(data.start_time) || !validTime(data.end_time) || (data.start_time && data.end_time && data.end_time <= data.start_time)) return 'Please provide valid task times.';
  if (!['low', 'medium', 'high'].includes(data.priority || 'medium')) return 'Please provide a valid priority.';
  return null;
}

async function getTasks(request, response, next) {
  try {
    const [tasks] = await databasePool.execute("SELECT id, title, description, DATE_FORMAT(due_date, '%Y-%m-%d') AS task_date, TIME_FORMAT(start_time, '%H:%i') AS start_time, TIME_FORMAT(end_time, '%H:%i') AS end_time, priority, status, created_at FROM personal_tasks WHERE user_id = ? ORDER BY due_date DESC", [request.user.id]);
    response.json({ tasks });
  } catch (error) { next(error); }
}

async function createTask(request, response, next) {
  try {
    const message = validateTask(request.body || {});
    if (message) return response.status(400).json({ message });
    const values = prepareTask(request.body);
    const [result] = await databasePool.execute('INSERT INTO personal_tasks (user_id, title, description, due_date, start_time, end_time, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [request.user.id, ...values]);
    response.status(201).json({ message: 'Task created successfully.', id: result.insertId });
  } catch (error) { next(error); }
}

async function updateTask(request, response, next) {
  try {
    const message = validateTask(request.body || {});
    if (!validId(request.params.id) || message) return response.status(400).json({ message: message || 'Invalid task ID.' });
    const [result] = await databasePool.execute('UPDATE personal_tasks SET title = ?, description = ?, due_date = ?, start_time = ?, end_time = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?', [...prepareTask(request.body), request.params.id, request.user.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Task not found.' });
    response.json({ message: 'Task updated successfully.' });
  } catch (error) { next(error); }
}

async function deleteTask(request, response, next) {
  try {
    const [result] = await databasePool.execute('DELETE FROM personal_tasks WHERE id = ? AND user_id = ?', [request.params.id, request.user.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Task not found.' });
    response.json({ message: 'Task deleted successfully.' });
  } catch (error) { next(error); }
}

async function completeTask(request, response, next) {
  try {
    const [result] = await databasePool.execute("UPDATE personal_tasks SET status = 'completed', completed_at = NOW() WHERE id = ? AND user_id = ?", [request.params.id, request.user.id]);
    if (!result.affectedRows) return response.status(404).json({ message: 'Task not found.' });
    response.json({ message: 'Task marked as completed.' });
  } catch (error) { next(error); }
}

module.exports = { getTasks, createTask, updateTask, deleteTask, completeTask };
