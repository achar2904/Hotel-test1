-- =============================================================================
-- Hotel Case Reporting System — Initial Seed Data
-- Hotel: The Regent Cha-am Beach Resort & VALA
-- =============================================================================

USE `hotel_case_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Seed Departments
-- -----------------------------------------------------------------------------
INSERT INTO `departments` (`id`, `code`, `name_th`, `name_en`, `color_hex`) VALUES
(1, 'IT', 'เทคโนโลยีสารสนเทศ (IT)', 'Information Technology', '#2B6CB0'),
(2, 'HK', 'แผนกแม่บ้าน (Housekeeping)', 'Housekeeping', '#D95A1E'),
(3, 'ENG', 'แผนกช่างและวิศวกรรม (Engineering)', 'Engineering / Maintenance', '#C05621'),
(4, 'FRONT', 'แผนกต้อนรับส่วนหน้า (Front Office)', 'Front Office', '#276749'),
(5, 'SECURITY', 'แผนกรักษาความปลอดภัย (Security)', 'Security', '#4A5568')
ON DUPLICATE KEY UPDATE `name_th` = VALUES(`name_th`);

-- -----------------------------------------------------------------------------
-- 2. Seed Users
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `full_name`, `nickname`, `department_id`, `role`) VALUES
(1, 'staff_somchai', 'somchai.s@regent-chaam.com', 'สมชาย ช่างแอร์', 'ชาย', 3, 'staff'),
(2, 'staff_oat', 'oat.b@regent-chaam.com', 'โอ๊ต เบลบอย', 'โอ๊ต', 4, 'staff'),
(3, 'head_eng', 'head.eng@regent-chaam.com', 'มนัส สิทธิพงษ์ (หัวหน้าช่าง)', 'มนัส', 3, 'dept_head'),
(4, 'head_it', 'head.it@regent-chaam.com', 'พัชระ รุ่งโรจน์ (หัวหน้าไอที)', 'แอน', 1, 'dept_head'),
(5, 'admin_hotel', 'admin@regent-chaam.com', 'ผู้ดูแลระบบส่วนกลาง (Admin)', 'แอดมิน', 1, 'admin'),
(6, 'owner_regent', 'gm@regent-chaam.com', 'ผู้บริหารโรงแรม / General Manager', 'GM', 4, 'owner')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- -----------------------------------------------------------------------------
-- 3. Seed Categories
-- -----------------------------------------------------------------------------
INSERT INTO `categories` (`department_id`, `category_code`, `name_th`, `name_en`, `default_sla_minutes`) VALUES
-- IT
(1, 'cat.IT.wifi', 'สัญญาณ Wi-Fi ไม่เสถียร / ต่อไม่ได้', 'Wi-Fi Connection Issue', 30),
(1, 'cat.IT.network', 'อินเทอร์เน็ตหลุดทั้งห้อง / พอร์ต LAN', 'Network / LAN Issue', 20),
(1, 'cat.IT.tv', 'สมาร์ททีวี / กล่องรับสัญญาณทีวี', 'Smart TV / IPTV System', 45),
(1, 'cat.IT.keycard', 'ระบบประตูคีย์การ์ดไม่ตอบสนอง', 'Keycard Door Lock System', 15),
(1, 'cat.IT.printer', 'เครื่องพิมพ์ใบเสร็จ Front เสีย', 'Front Office Printer', 30),

-- Housekeeping
(2, 'cat.HK.clean', 'ขอทำความสะอาดห้องด่วน / มีคราบเปื้อน', 'Room Cleaning / Spill', 30),
(2, 'cat.HK.linen', 'ขอผ้าเช็ดตัว / เครื่องนอนเพิ่ม', 'Extra Linen / Towels', 20),
(2, 'cat.HK.amenities', 'ของใช้ในห้องน้ำหมด (สบู่/แชมพู)', 'Bathroom Amenities', 15),
(2, 'cat.HK.smell', 'ห้องมีกลิ่นอับ / กลิ่นบุหรี่', 'Room Odor Removal', 40),

-- Engineering
(3, 'cat.ENG.ac', 'แอร์ไม่เย็น / มีน้ำหยดจากเครื่องปรับอากาศ', 'Air Conditioner Not Cooling / Leaking', 30),
(3, 'cat.ENG.plumb', 'ท่อน้ำตัน / ชักโครกกดไม่ลง / น้ำรั่ว', 'Plumbing / Blocked Toilet / Water Leak', 20),
(3, 'cat.ENG.elec', 'ไฟดับ / ปลั๊กไฟใช้งานไม่ได้ / ไฟกระพริบ', 'Electrical Outage / Faulty Socket', 20),
(3, 'cat.ENG.door', 'ประตูปิดไม่สนิท / บานพับฝืด / กลอนชำรุด', 'Door Hinge / Latch Broken', 45),
(3, 'cat.ENG.safe', 'ตู้เซฟล็อกเปิดไม่ได้ (แขกลืมรหัส)', 'In-room Safe Lockout', 15),

-- Front Office
(4, 'cat.FRONT.checkin', 'คำร้องขอพิเศษตอนเช็คอิน (เตียงเสริม)', 'Special Check-in Request', 30),
(4, 'cat.FRONT.luggage', 'ช่วยยกกระเป๋าขึ้นห้องพัก', 'Baggage Assistance', 15),

-- Security
(5, 'cat.SECURITY.noise', 'มีเสียงรบกวนยามวิกาลจากห้องข้างเคียง', 'Noise Complaint', 15),
(5, 'cat.SECURITY.parking', 'รถจอดขวางทางเข้าออกโรงแรม', 'Parking Obstruction', 20)
ON DUPLICATE KEY UPDATE `name_th` = VALUES(`name_th`);

-- -----------------------------------------------------------------------------
-- 4. Seed Hotel Rooms (Regent Cha-am Main Wing 101 - 510)
-- -----------------------------------------------------------------------------
INSERT INTO `rooms` (`room_no`, `building`, `floor`, `room_type`, `status`, `closed_reason`) VALUES
('101', 'Regent Main Wing', 1, 'Superior Garden', 'AVAILABLE', NULL),
('102', 'Regent Main Wing', 1, 'Superior Garden', 'AVAILABLE', NULL),
('103', 'Regent Main Wing', 1, 'Superior Garden', 'AVAILABLE', NULL),
('104', 'Regent Main Wing', 1, 'Superior Garden', 'AVAILABLE', NULL),
('105', 'Regent Main Wing', 1, 'Superior Garden', 'AVAILABLE', NULL),
('201', 'Regent Main Wing', 2, 'Deluxe Sea View', 'AVAILABLE', NULL),
('202', 'Regent Main Wing', 2, 'Deluxe Sea View', 'AVAILABLE', NULL),
('203', 'Regent Main Wing', 2, 'Deluxe Sea View', 'AVAILABLE', NULL),
('204', 'Regent Main Wing', 2, 'Deluxe Sea View', 'AVAILABLE', NULL),
('205', 'Regent Main Wing', 2, 'Deluxe Sea View', 'AVAILABLE', NULL),
('301', 'Regent Main Wing', 3, 'Deluxe Sea View', 'AVAILABLE', NULL),
('302', 'Regent Main Wing', 3, 'Deluxe Sea View', 'AVAILABLE', NULL),
('303', 'Regent Main Wing', 3, 'Deluxe Sea View', 'AVAILABLE', NULL),
('304', 'Regent Main Wing', 3, 'Deluxe Sea View', 'AVAILABLE', NULL),
('305', 'Regent Main Wing', 3, 'Deluxe Sea View', 'AVAILABLE', NULL),
('401', 'Regent Main Wing', 4, 'Executive Suite', 'AVAILABLE', NULL),
('402', 'Regent Main Wing', 4, 'Executive Suite', 'AVAILABLE', NULL),
('403', 'Regent Main Wing', 4, 'Executive Suite', 'CLOSED', 'แอร์รั่ว รออะไหล่คอมเพรสเซอร์'),
('404', 'Regent Main Wing', 4, 'Executive Suite', 'AVAILABLE', NULL),
('405', 'Regent Main Wing', 4, 'Executive Suite', 'AVAILABLE', NULL),
('501', 'Regent Beachfront Wing', 5, 'Presidential Pool Villa', 'AVAILABLE', NULL),
('502', 'Regent Beachfront Wing', 5, 'Presidential Pool Villa', 'AVAILABLE', NULL),
('503', 'Regent Beachfront Wing', 5, 'Presidential Pool Villa', 'AVAILABLE', NULL)
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- -----------------------------------------------------------------------------
-- 5. Seed System Configurations
-- -----------------------------------------------------------------------------
INSERT INTO `system_configs` (`config_key`, `config_value`, `description`) VALUES
('SLA_EMERGENCY_MINUTES', '20', 'เวลา SLA มาตรฐานสำหรับเคสฉุกเฉิน (นาที)'),
('SLA_URGENT_MINUTES', '40', 'เวลา SLA มาตรฐานสำหรับเคสด่วน (นาที)'),
('SLA_NORMAL_MINUTES', '60', 'เวลา SLA มาตรฐานสำหรับเคสทั่วไป (นาที)'),
('MAX_REMINDER_COUNT', '3', 'จำนวนครั้งสูงสุดที่จะส่งการแจ้งเตือนสะกิดช่าง'),
('REMINDER_INTERVAL_MINUTES', '10', 'ระยะเวลาห่างระหว่างการสะกิดเตือนแต่ละครั้ง (นาที)'),
('AUTO_ROOM_CLOSE', '1', '1 = ปิดขายห้องอัตโนมัติเมื่อสร้างเคสที่มี AffectsRoomSalability=1'),
('DEFAULT_LANGUAGE', 'th', 'ภาษาเริ่มต้นของระบบ (th หรือ en)')
ON DUPLICATE KEY UPDATE `config_value` = VALUES(`config_value`);

-- -----------------------------------------------------------------------------
-- 6. Seed Sample Cases
-- -----------------------------------------------------------------------------
INSERT INTO `cases` (
  `id`, `case_uid`, `case_no`, `subject`, `description`, `location_type`,
  `room_id`, `room_no`, `department_id`, `priority`, `status`,
  `reporter_id`, `reporter_name`, `assignee_id`, `assignee_name`,
  `sla_minutes`, `due_at`, `affects_room_salability`, `created_at`
) VALUES
(
  1,
  '550e8400-e29b-41d4-a716-446655440001',
  'CASE-20260906-0001',
  'แอร์ไม่เย็น มีน้ำหยดลงบนพรมห้องพัก',
  'แขกห้อง 403 แจ้งว่าแอร์มีน้ำหยดลงบนพรมปลายเตียง และลมแอร์ไม่เย็น',
  'Guest Room',
  18, '403', 3, 'EMERGENCY', 'IN_PROGRESS',
  2, 'โอ๊ต เบลบอย', 1, 'สมชาย ช่างแอร์',
  20, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 1, NOW()
),
(
  2,
  '550e8400-e29b-41d4-a716-446655440002',
  'CASE-20260906-0002',
  'อินเทอร์เน็ต Wi-Fi หลุด แขกจะประชุมออนไลน์',
  'ห้อง 301 สัญญาณ Wi-Fi ไม่ขึ้น แขกต้องเริ่มประชุมผ่าน Zoom เวลา 15:00',
  'Guest Room',
  11, '301', 1, 'URGENT', 'ACKNOWLEDGED',
  2, 'โอ๊ต เบลบอย', 4, 'พัชระ รุ่งโรจน์ (หัวหน้าไอที)',
  40, DATE_ADD(NOW(), INTERVAL 35 MINUTE), 0, NOW()
)
ON DUPLICATE KEY UPDATE `subject` = VALUES(`subject`);

-- -----------------------------------------------------------------------------
-- 7. Seed Case Timeline
-- -----------------------------------------------------------------------------
INSERT INTO `case_timeline` (`case_id`, `sender_id`, `sender_name`, `sender_dept`, `entry_type`, `message`) VALUES
(1, 2, 'โอ๊ต เบลบอย', 'FRONT', 'USER', 'รับแจ้งจากแขกโดยตรง กำลังนำถังรองน้ำไปให้ก่อนช่างเข้าดูครับ'),
(1, 1, 'สมชาย ช่างแอร์', 'ENG', 'USER', 'กำลังขึ้นไปดูที่ชั้น 4 พร้อมอะไหล่ท่อน้ำทิ้งครับ'),
(2, 2, 'โอ๊ต เบลบอย', 'FRONT', 'USER', 'แจ้งแผนก IT แขกรีบประชุมมากครับ'),
(2, 4, 'พัชระ รุ่งโรจน์', 'IT', 'USER', 'ตรวจสอบในระบบ Access Point ให้แล้ว กำลัง Reboot AP ประจำชั้น 3 ครับ');

SET FOREIGN_KEY_CHECKS = 1;
