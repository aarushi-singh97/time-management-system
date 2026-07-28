-- Sample records for the Time Management System.
-- Run database/schema.sql before this file.

USE time_management_system;

-- The sample password for every user is: password123
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
  (1, 'Ananya Sharma', 'admin@tms.local', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
  (2, 'Riya Verma', 'secretary@tms.local', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'secretary'),
  (3, 'Arjun Mehta', 'arjun@tms.local', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'executive'),
  (4, 'Kavya Nair', 'kavya@tms.local', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'executive'),
  (5, 'Rahul Singh', 'rahul@tms.local', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'executive');

INSERT INTO projects (id, project_name, description, start_date, end_date, status, created_by) VALUES
  (1, 'Client Portal Upgrade', 'Improving the company client portal before the yearly review.', '2026-07-01', '2026-10-31', 'active', 1);

INSERT INTO appointments (user_id, title, description, venue, start_time, end_time, appointment_type) VALUES
  (3, 'Client call', 'Discuss portal feedback with the client.', 'Online', '2026-08-03 10:00:00', '2026-08-03 10:30:00', 'appointment'),
  (4, 'Prepare budget notes', 'Prepare notes for the monthly budget review.', 'Office', '2026-08-03 14:00:00', '2026-08-03 15:00:00', 'important_job'),
  (5, 'Doctor appointment', 'Routine health check-up.', 'City Clinic', '2026-08-04 09:00:00', '2026-08-04 10:00:00', 'personal');

INSERT INTO meetings (id, title, agenda, venue, start_time, end_time, status, project_id, scheduled_by) VALUES
  (1, 'Portal Planning Meeting', 'Agree on the next portal upgrade tasks.', 'Conference Room A', '2026-08-03 11:00:00', '2026-08-03 12:00:00', 'scheduled', 1, 2),
  (2, 'Weekly Executive Review', 'Review schedules, tasks, and current project progress.', 'Online', '2026-08-05 15:00:00', '2026-08-05 15:45:00', 'scheduled', NULL, 2);

INSERT INTO meeting_participants (meeting_id, user_id, response_status) VALUES
  (1, 3, 'accepted'),
  (1, 4, 'accepted'),
  (1, 5, 'pending'),
  (2, 3, 'accepted'),
  (2, 4, 'pending'),
  (2, 5, 'accepted');

INSERT INTO leave_requests (user_id, leave_type, reason, start_date, end_date, status, reviewed_by, reviewed_at) VALUES
  (4, 'annual', 'Family travel.', '2026-08-10', '2026-08-12', 'approved', 1, '2026-07-28 10:00:00');

INSERT INTO personal_tasks (user_id, title, description, due_date, priority, status, completed_at) VALUES
  (3, 'Send client summary', 'Email the meeting summary to the client.', '2026-08-03 17:00:00', 'high', 'in_progress', NULL),
  (4, 'Update project timeline', 'Update the Client Portal Upgrade timeline.', '2026-08-04 16:00:00', 'medium', 'pending', NULL),
  (5, 'Review meeting agenda', 'Read the agenda before the executive review.', '2026-08-05 14:00:00', 'low', 'completed', '2026-08-01 11:00:00');

INSERT INTO notifications (user_id, title, message, notification_type, is_read) VALUES
  (3, 'Meeting scheduled', 'Portal Planning Meeting is scheduled for 3 August at 11:00 AM.', 'meeting', FALSE),
  (4, 'Leave approved', 'Your annual leave request for 10 to 12 August has been approved.', 'leave', TRUE),
  (5, 'Task completed', 'Your task Review meeting agenda was marked as completed.', 'task', TRUE);
