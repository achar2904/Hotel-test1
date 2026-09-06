-- =============================================================================
-- Hotel Case Reporting System — Production MySQL Schema
-- Hotel: The Regent Cha-am Beach Resort & VALA
-- Charset: utf8mb4 (Full Unicode & Thai language support)
-- Engine: InnoDB (Full ACID compliance & Foreign Key constraints)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `hotel_case_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `hotel_case_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Departments (แผนกภายในโรงแรม)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'รหัสแผนก เช่น IT, HK, ENG, FRONT, SECURITY',
  `name_th` VARCHAR(100) NOT NULL COMMENT 'ชื่อแผนกภาษาไทย',
  `name_en` VARCHAR(100) NOT NULL COMMENT 'ชื่อแผนกภาษาอังกฤษ',
  `color_hex` VARCHAR(10) DEFAULT '#4A5568' COMMENT 'สีประจำแผนกสำหรับ Badge',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_dept_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Users (ผู้ใช้งาน / พนักงาน)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE COMMENT 'ชื่อผู้ใช้งาน (อีเมลหรือรหัสพนักงาน)',
  `email` VARCHAR(120) NOT NULL UNIQUE COMMENT 'อีเมลประจำตัวพนักงาน',
  `password_hash` VARCHAR(255) NULL COMMENT 'รหัสผ่านแฮช (รองรับ Bcrypt/Argon2 หรือ NULL หากล็อกอิน Google)',
  `full_name` VARCHAR(100) NOT NULL COMMENT 'ชื่อ-นามสกุล',
  `nickname` VARCHAR(50) NULL COMMENT 'ชื่อเล่น',
  `department_id` INT UNSIGNED NULL COMMENT 'แผนกที่สังกัด',
  `role` ENUM('staff', 'dept_head', 'admin', 'owner') NOT NULL DEFAULT 'staff' COMMENT 'สิทธิ์ในระบบ',
  `phone` VARCHAR(30) NULL COMMENT 'เบอร์โทรศัพท์ติดต่อ',
  `line_user_id` VARCHAR(100) NULL COMMENT 'LINE User ID สำหรับแจ้งเตือนเคสด่วน',
  `avatar_url` VARCHAR(255) NULL COMMENT 'URL รูปโปรไฟล์',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = ใช้งานปกติ, 0 = ระงับการใช้งาน',
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Categories (หมวดหมู่ของปัญหาตามแผนก)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `department_id` INT UNSIGNED NOT NULL,
  `category_code` VARCHAR(60) NOT NULL UNIQUE COMMENT 'เช่น cat.IT.wifi, cat.ENG.ac',
  `name_th` VARCHAR(120) NOT NULL COMMENT 'ชื่อปัญหาภาษาไทย เช่น แอร์ไม่เย็น, เน็ตหลุด',
  `name_en` VARCHAR(120) NOT NULL COMMENT 'ชื่อปัญหาภาษาอังกฤษ',
  `default_sla_minutes` INT UNSIGNED NULL COMMENT 'SLA มาตรฐานของหมวดนี้ (นาที)',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cat_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  INDEX `idx_cat_dept` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Rooms (ผังห้องพักและสถานะความพร้อมขาย)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `room_no` VARCHAR(20) NOT NULL UNIQUE COMMENT 'หมายเลขห้อง เช่น 101, 301, 502',
  `building` VARCHAR(60) NOT NULL DEFAULT 'Regent Main Wing' COMMENT 'อาคาร / โซนห้องพัก',
  `floor` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'ชั้นที่',
  `room_type` VARCHAR(60) NOT NULL DEFAULT 'Deluxe Sea View' COMMENT 'ประเภทห้องพัก',
  `status` ENUM('AVAILABLE', 'CLOSED', 'CLEANING', 'OCCUPIED') NOT NULL DEFAULT 'AVAILABLE' COMMENT 'สถานะห้องพัก',
  `closed_reason` VARCHAR(255) NULL COMMENT 'สาเหตุที่ปิดห้องพัก เช่น แอร์รั่ว รออะไหล่',
  `current_open_cases` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'จำนวนเคสที่กำลังเปิดอยู่ของห้องนี้',
  `updated_by` INT UNSIGNED NULL COMMENT 'ผู้ปรับปรุงสถานะล่าสุด',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rooms_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_rooms_status` (`status`),
  INDEX `idx_rooms_building_floor` (`building`, `floor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Atomic Daily Case Counter (ตารางนับเลขเคสประจำวัน ป้องกันเลขชนกัน 100%)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `case_counters`;
CREATE TABLE `case_counters` (
  `date_key` CHAR(8) NOT NULL PRIMARY KEY COMMENT 'YYYYMMDD เช่น 20260906',
  `last_number` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ลำดับเคสล่าสุดของวันนั้น'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Cases (ตารางเคสหลัก)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `cases`;
CREATE TABLE `cases` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `case_uid` VARCHAR(36) NOT NULL UNIQUE COMMENT 'UUID v4 สำหรับเรียกผ่าน API/URL',
  `case_no` VARCHAR(30) NOT NULL UNIQUE COMMENT 'เลขเคสทางการ รูปแบบ CASE-YYYYMMDD-XXXX',
  `subject` VARCHAR(150) NOT NULL COMMENT 'หัวข้อสรุปปัญหา',
  `description` TEXT NOT NULL COMMENT 'รายละเอียดอาการ / สิ่งที่เจอ',
  `location_type` VARCHAR(60) NOT NULL DEFAULT 'Guest Room' COMMENT 'สถานที่เกิดเหตุ เช่น Guest Room, Lobby, Pool',
  `room_id` INT UNSIGNED NULL COMMENT 'FK ห้องพัก (ถ้ามี)',
  `room_no` VARCHAR(20) NULL COMMENT 'สำเนาเลขห้องเพื่อความเร็วในการค้นหา',
  `department_id` INT UNSIGNED NOT NULL COMMENT 'แผนกที่รับผิดชอบแก้ปัญหา',
  `category_id` INT UNSIGNED NULL COMMENT 'หมวดหมู่ปัญหา',
  `priority` ENUM('NORMAL', 'URGENT', 'EMERGENCY') NOT NULL DEFAULT 'NORMAL' COMMENT 'ระดับความเร่งด่วน',
  `status` ENUM('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'TRANSFERRED', 'RESOLVED', 'CLOSED', 'CANCELLED', 'REOPENED') NOT NULL DEFAULT 'NEW' COMMENT 'สถานะเคส',
  `reporter_id` INT UNSIGNED NOT NULL COMMENT 'ผู้แจ้งเคส',
  `reporter_name` VARCHAR(100) NOT NULL COMMENT 'สำเนาชื่อผู้แจ้ง',
  `assignee_id` INT UNSIGNED NULL COMMENT 'ช่าง / ผู้ได้รับมอบหมาย',
  `assignee_name` VARCHAR(100) NULL COMMENT 'สำเนาชื่อผู้รับมอบหมาย',
  
  -- ระบบบันทึกเวลา SLA
  `sla_minutes` INT UNSIGNED NOT NULL DEFAULT 60 COMMENT 'SLA ที่กำหนดให้เคสนี้ (นาที)',
  `due_at` DATETIME NOT NULL COMMENT 'วัน-เวลาที่ต้องเสร็จสิ้นตาม SLA',
  `acknowledged_at` DATETIME NULL COMMENT 'เวลากดรับเคส',
  `resolved_at` DATETIME NULL COMMENT 'เวลาที่แก้ปัญหาเสร็จ',
  `closed_at` DATETIME NULL COMMENT 'เวลาที่ปิดเคสสมบูรณ์',
  `escalated_at` DATETIME NULL COMMENT 'เวลาที่เคสถูกยกระดับ (Escalate)',
  `reminders_count` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'จำนวนครั้งที่ระบบแจ้งเตือนสะกิด',
  `last_reminder_at` DATETIME NULL COMMENT 'เวลาแจ้งเตือนครั้งล่าสุด',
  
  -- ผลกระทบต่อห้องพัก
  `affects_room_salability` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = เคสนี้ทำให้ปิดขายห้องอัตโนมัติ',
  
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Soft delete (1 = ลบ)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT `fk_cases_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cases_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_cases_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cases_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_cases_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  
  INDEX `idx_cases_status` (`status`),
  INDEX `idx_cases_priority` (`priority`),
  INDEX `idx_cases_dept` (`department_id`),
  INDEX `idx_cases_due_at` (`due_at`),
  INDEX `idx_cases_room_no` (`room_no`),
  INDEX `idx_cases_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Case Timeline / Comments (ประวัติการพูดคุยและ Timeline การกระทำ)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `case_timeline`;
CREATE TABLE `case_timeline` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `case_id` BIGINT UNSIGNED NOT NULL,
  `sender_id` INT UNSIGNED NULL COMMENT 'NULL หากเป็นระบบส่งอัตโนมัติ',
  `sender_name` VARCHAR(100) NOT NULL,
  `sender_dept` VARCHAR(50) NULL,
  `entry_type` ENUM('USER', 'SYSTEM') NOT NULL DEFAULT 'USER',
  `message` TEXT NOT NULL,
  `attachment_url` VARCHAR(500) NULL,
  `attachment_name` VARCHAR(255) NULL,
  `attachment_size` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_timeline_case` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_timeline_user` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_timeline_case_id` (`case_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Case Attachments (ไฟล์แนบและรูปถ่ายหน้างาน)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `case_attachments`;
CREATE TABLE `case_attachments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `case_id` BIGINT UNSIGNED NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL COMMENT 'Path ใน Server หรือ Object Storage URL',
  `file_type` VARCHAR(50) NOT NULL COMMENT 'image/jpeg, image/png ฯลฯ',
  `file_size_bytes` INT UNSIGNED NOT NULL,
  `uploaded_by_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_attachments_case` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attachments_user` FOREIGN KEY (`uploaded_by_id`) REFERENCES `users` (`id`),
  INDEX `idx_attachments_case` (`case_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Room Logs (ประวัติการเปิด-ปิดขายห้องพัก)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `room_logs`;
CREATE TABLE `room_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `room_id` INT UNSIGNED NOT NULL,
  `room_no` VARCHAR(20) NOT NULL,
  `case_id` BIGINT UNSIGNED NULL COMMENT 'เคสที่ส่งผลให้ปิด/เปิดห้อง (ถ้ามี)',
  `action` ENUM('CLOSE_ROOM', 'OPEN_ROOM') NOT NULL,
  `reason` VARCHAR(255) NULL,
  `actor_id` INT UNSIGNED NULL,
  `actor_name` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_room_logs_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_room_logs_case` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_room_logs_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_room_logs_room` (`room_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. Audit Logs (ประวัติความปลอดภัยและการกระทำสำคัญ)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `case_id` BIGINT UNSIGNED NULL,
  `event` VARCHAR(60) NOT NULL COMMENT 'เช่น CASE_CREATED, STATUS_CHANGED, ASSIGNED',
  `actor_id` INT UNSIGNED NULL,
  `actor_name` VARCHAR(100) NOT NULL,
  `meta_data` JSON NULL COMMENT 'ข้อมูลเปรียบเทียบ Before/After หรือรายละเอียดเสริม',
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_case` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_audit_event` (`event`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. System Configurations (การตั้งค่า SLA และนโยบายระบบ)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `system_configs`;
CREATE TABLE `system_configs` (
  `config_key` VARCHAR(60) NOT NULL PRIMARY KEY,
  `config_value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_by` INT UNSIGNED NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
