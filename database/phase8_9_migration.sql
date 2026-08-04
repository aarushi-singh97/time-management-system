-- Run this once when upgrading an existing Time Management System database.
USE time_management_system;

CREATE TABLE IF NOT EXISTS notification_settings (
  user_id INT PRIMARY KEY,
  appointment_emails BOOLEAN NOT NULL DEFAULT TRUE,
  meeting_emails BOOLEAN NOT NULL DEFAULT TRUE,
  leave_emails BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_emails BOOLEAN NOT NULL DEFAULT TRUE,
  summary_emails BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type VARCHAR(30) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  delivery_status ENUM('sent', 'failed', 'skipped') NOT NULL,
  error_message VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_notification_logs_user_type ON notification_logs(user_id, notification_type, created_at);
