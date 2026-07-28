-- Time Management System database schema
-- Run this file first, then run sample_data.sql if you want demonstration records.

CREATE DATABASE IF NOT EXISTS time_management_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE time_management_system;

-- Drop child tables first so this script can be run again during development.
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS personal_tasks;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS meeting_participants;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'secretary', 'executive') NOT NULL DEFAULT 'executive',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(150) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status ENUM('planned', 'active', 'completed', 'on_hold') NOT NULL DEFAULT 'planned',
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
) ENGINE=InnoDB;

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  venue VARCHAR(150),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  appointment_type ENUM('appointment', 'important_job', 'personal') NOT NULL DEFAULT 'appointment',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_appointment_times CHECK (end_time > start_time)
) ENGINE=InnoDB;

CREATE TABLE meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  agenda TEXT,
  venue VARCHAR(150),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  project_id INT NULL,
  scheduled_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_meetings_project
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  CONSTRAINT fk_meetings_scheduled_by
    FOREIGN KEY (scheduled_by) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_meeting_times CHECK (end_time > start_time)
) ENGINE=InnoDB;

CREATE TABLE meeting_participants (
  meeting_id INT NOT NULL,
  user_id INT NOT NULL,
  response_status ENUM('pending', 'accepted', 'declined') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (meeting_id, user_id),
  CONSTRAINT fk_participants_meeting
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  CONSTRAINT fk_participants_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type ENUM('annual', 'sick', 'personal', 'other') NOT NULL,
  reason VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_leave_requests_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_leave_requests_reviewer
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB;

CREATE TABLE personal_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  due_date DATETIME NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  CONSTRAINT fk_personal_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('meeting', 'leave', 'task', 'general') NOT NULL DEFAULT 'general',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- These indexes support common calendar, report, and notification queries.
CREATE INDEX idx_appointments_user_time ON appointments(user_id, start_time);
CREATE INDEX idx_meetings_time ON meetings(start_time);
CREATE INDEX idx_meetings_project ON meetings(project_id);
CREATE INDEX idx_leave_requests_user_dates ON leave_requests(user_id, start_date, end_date);
CREATE INDEX idx_personal_tasks_user_status ON personal_tasks(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
