-- =============================================================================
-- Hotel Case Reporting System — Clean Production Reset
-- Removes ALL demo/mock data, resets counters, and initializes clean admin
-- =============================================================================

USE `hotel_case_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Wipe all transactional demo data
TRUNCATE TABLE `case_timeline`;
TRUNCATE TABLE `case_attachments`;
TRUNCATE TABLE `cases`;
TRUNCATE TABLE `case_counters`;
TRUNCATE TABLE `room_logs`;
TRUNCATE TABLE `audit_logs`;

-- 2. Reset rooms to clean available state
UPDATE `rooms`
SET `status` = 'AVAILABLE',
    `closed_reason` = NULL,
    `current_open_cases` = 0;

-- 3. Reset users to clean initial accounts
TRUNCATE TABLE `users`;

INSERT INTO `users` (
  `id`, `username`, `email`, `password_hash`, `full_name`, `nickname`,
  `department_id`, `role`, `phone`, `is_active`
) VALUES
(
  1, 'admin', 'admin@regent-chaam.com', 'admin123',
  'System Administrator', 'Admin', 1, 'admin', '032-508-188', 1
),
(
  2, 'gm', 'gm@regent-chaam.com', 'gm123',
  'General Manager (ผู้บริหาร)', 'GM', 4, 'owner', '032-508-100', 1
),
(
  3, 'head_it', 'it.head@regent-chaam.com', 'it123',
  'หัวหน้าแผนกไอที', 'ไอที', 1, 'dept_head', '032-508-111', 1
),
(
  4, 'staff_eng', 'eng.staff@regent-chaam.com', 'eng123',
  'ช่างเทคนิคประจำกะ', 'ช่าง', 3, 'staff', '032-508-222', 1
),
(
  5, 'staff_hk', 'hk.staff@regent-chaam.com', 'hk123',
  'เจ้าหน้าที่แม่บ้าน', 'แม่บ้าน', 2, 'staff', '032-508-333', 1
);

SET FOREIGN_KEY_CHECKS = 1;
