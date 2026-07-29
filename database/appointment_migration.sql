-- Run this once only when upgrading an existing Phase 2 database.
-- New databases created with schema.sql already include these columns.

USE time_management_system;

ALTER TABLE appointments
  ADD COLUMN status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled' AFTER appointment_type,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
