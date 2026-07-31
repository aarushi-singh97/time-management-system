-- Run once only when upgrading an existing database.
USE time_management_system;

ALTER TABLE personal_tasks
  ADD COLUMN start_time TIME NULL AFTER due_date,
  ADD COLUMN end_time TIME NULL AFTER start_time;
