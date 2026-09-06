# 🗄️ Hotel Case Reporting System — MySQL Database Architecture

ฐานข้อมูลสำหรับระบบแจ้งและบริหารจัดการเคสภายในโรงแรม **The Regent Cha-am Beach Resort & VALA**

---

## 📂 สารบัญไฟล์ในโฟลเดอร์นี้

- [`schema.sql`](file:///D:/Ann/database/schema.sql) : DDL สร้างตารางทั้งหมด พร้อม Foreign Keys, Indexes, Constraints และ Charset `utf8mb4_unicode_ci`
- [`seed.sql`](file:///D:/Ann/database/seed.sql) : ข้อมูลเริ่มต้น (แผนก, บัญชีพนักงาน, ผังห้องพัก 101-503, หมวดหมู่ปัญหา, SLA Configurations)
- [`README.md`](file:///D:/Ann/database/README.md) : เอกสารอธิบายโครงสร้างและความสัมพันธ์

---

## 🏗️ โครงสร้างตารางหลัก (Tables Overview)

| ลำดับ | ชื่อตาราง | คำอธิบาย | ข้อมูลสำคัญ / Key Fields |
| :--- | :--- | :--- | :--- |
| 1 | `departments` | แผนกภายในโรงแรม | `code` (IT, HK, ENG, FRONT, SECURITY), `name_th`, `name_en` |
| 2 | `users` | บัญชีพนักงานและผู้บริหาร | `username`, `email`, `role` (staff, dept_head, admin, owner), `line_user_id` |
| 3 | `categories` | หมวดหมู่ปัญหาตามแผนก | `category_code`, `name_th`, `default_sla_minutes` |
| 4 | `rooms` | ผังห้องพักและสถานะพร้อมขาย | `room_no`, `building`, `floor`, `status` (AVAILABLE, CLOSED) |
| 5 | `case_counters` | ตารางนับเลขเคส Atomic Concurrency | `date_key` (YYYYMMDD), `last_number` ป้องกันเลขชนกัน 100% |
| 6 | `cases` | ข้อมูลเคสหลัก | `case_no`, `priority`, `status`, `sla_minutes`, `due_at`, `affects_room_salability` |
| 7 | `case_timeline` | ประวัติการแชทและการกระทำ | `case_id`, `sender_name`, `message`, `entry_type` (USER, SYSTEM) |
| 8 | `case_attachments` | ไฟล์แนบและรูปถ่ายชำรุด | `file_path`, `file_name`, `file_size_bytes` |
| 9 | `room_logs` | ประวัติการเปิด/ปิดขายห้องพัก | `room_no`, `action` (CLOSE_ROOM, OPEN_ROOM), `reason`, `actor_name` |
| 10 | `audit_logs` | Audit Trail ความปลอดภัย | `event`, `actor_name`, `meta_data` (JSON), `ip_address` |
| 11 | `system_configs` | การตั้งค่า SLA กลางของโรงแรม | `SLA_EMERGENCY_MINUTES`, `AUTO_ROOM_CLOSE` ฯลฯ |

---

## 🚀 วิธีการติดตั้งและ Import เข้า MySQL

### วิธีที่ 1: ผ่าน MySQL Command Line (CLI)

```bash
# 1. ล็อกอินเข้า MySQL
mysql -u root -p

# 2. นำเข้า Schema และ Seed Data
mysql -u root -p < "D:\Ann\database\schema.sql"
mysql -u root -p < "D:\Ann\database\seed.sql"
```

### วิธีที่ 2: ผ่าน phpMyAdmin / MySQL Workbench
1. เปิด **phpMyAdmin** หรือ **MySQL Workbench**
2. ไปที่แท็บ **Import** (หรือเปิดไฟล์ SQL)
3. เลือกไฟล์ `D:\Ann\database\schema.sql` แล้วกด **Go / Execute**
4. เลือกไฟล์ `D:\Ann\database\seed.sql` แล้วกด **Go / Execute**

---

## 🔒 ฟีเจอร์เด่นระดับ Production ใน Schema นี้

1. **Charset รองรับภาษาไทยสมบูรณ์แบบ (`utf8mb4_unicode_ci`):**  
   รองรับตัวอักษรไทย สระลอย วรรณยุกต์ และ Emoji ได้อย่างถูกต้อง
2. **Atomic Daily Case Numbering (`case_counters`):**  
   ใช้คำสั่ง `INSERT ... ON DUPLICATE KEY UPDATE` ในการขอเลขเคสใหม่ ทำให้มั่นใจได้ว่าแม้พนักงานหลายสิบคนจะกดส่งเคสพร้อมกันในเสี้ยววินาที เลขเคสจะเรียงต่อกันอย่างถูกต้องและไม่มีวันซ้ำ
3. **Room Salability Protection:**  
   เชื่อมโยงสถานะห้องพักกับการแจ้งเคส หากเคสระบุว่า `affects_room_salability = 1` ระบบจะบันทึก Log ลง `room_logs` และอัปเดตห้องเป็น `CLOSED` ทันที
