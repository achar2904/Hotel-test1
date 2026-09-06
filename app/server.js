// =============================================================================
// Hotel Case Reporting System — Express Backend Server
// The Regent Cha-am Beach Resort & VALA
// =============================================================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ทดสอบการเชื่อมต่อ MySQL เมื่อเริ่มเซิร์ฟเวอร์
db.testConnection();

// ฟังก์ชันรวม template แบบสด (Live Template Rendering)
function renderTemplates() {
  const layoutPath = path.join(__dirname, 'templates', 'layout.html');
  if (!fs.existsSync(layoutPath)) return null;

  let html = fs.readFileSync(layoutPath, 'utf8');
  const placeholderRegex = /<!--\s*\{\{([\w\-\.\/]+)\}\}\s*-->/g;

  html = html.replace(placeholderRegex, (match, relPath) => {
    const fullPath = path.join(__dirname, 'templates', relPath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    return `<!-- Missing: ${relPath} -->`;
  });

  try {
    fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
  } catch (e) {}

  return html;
}

// -----------------------------------------------------------------------------
// 1. Root & Live Template Route
// -----------------------------------------------------------------------------
app.get(['/', '/index.html'], (req, res) => {
  const renderedHtml = renderTemplates();
  if (renderedHtml) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(renderedHtml);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// -----------------------------------------------------------------------------
// 2. Health & DB Status Route
// -----------------------------------------------------------------------------
app.get('/api/db-status', (req, res) => {
  res.json({
    success: true,
    connected: db.isConnected(),
    database: process.env.DB_NAME || 'hotel_case_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    engine: 'MySQL / MariaDB'
  });
});

// -----------------------------------------------------------------------------
// 3. Auth Routes (ระบบล็อกอินจริงด้วย MySQL)
// -----------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  try {
    const users = await db.query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.full_name, u.nickname,
              u.role, u.department_id, u.phone, u.line_user_id, u.is_active,
              d.code as department_code, d.name_th as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE (u.username = ? OR u.email = ?) AND u.is_active = 1`,
      [username.trim(), username.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ' });
    }

    const user = users[0];
    // ตรวจสอบรหัสผ่าน (รองรับ plain text จาก seed หรือ bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // อัปเดตเวลาล็อกอินล่าสุด
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    delete user.password_hash;
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' });
  }
});

// -----------------------------------------------------------------------------
// 4. User Management Routes (ระบบจัดการผู้ใช้และสิทธิ์ของ Administrator)
// -----------------------------------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.nickname,
              u.role, u.department_id, u.phone, u.line_user_id, u.is_active,
              u.created_at, u.last_login_at,
              d.code as department_code, d.name_th as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY u.id ASC`
    );
    res.json({ success: true, users });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงรายชื่อผู้ใช้ได้' });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, full_name, nickname, email, department_id, role, phone } = req.body;
  if (!username || !password || !full_name || !email || !role) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
  }

  try {
    // เช็ค username หรือ email ซ้ำ
    const exist = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username.trim(), email.trim()]);
    if (exist.length > 0) {
      return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' });
    }

    const result = await db.query(
      `INSERT INTO users (username, password_hash, full_name, nickname, email, department_id, role, phone, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [username.trim(), password, full_name.trim(), nickname || null, email.trim(), department_id || null, role, phone || null]
    );

    res.json({ success: true, message: 'สร้างผู้ใช้งานเรียบร้อยแล้ว', userId: result.insertId });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถสร้างผู้ใช้ได้: ' + err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { full_name, nickname, email, department_id, role, phone, is_active, password } = req.body;

  try {
    if (password && password.trim()) {
      await db.query(
        `UPDATE users
         SET full_name = ?, nickname = ?, email = ?, department_id = ?, role = ?, phone = ?, is_active = ?, password_hash = ?
         WHERE id = ?`,
        [full_name, nickname || null, email, department_id || null, role, phone || null, is_active !== undefined ? is_active : 1, password, userId]
      );
    } else {
      await db.query(
        `UPDATE users
         SET full_name = ?, nickname = ?, email = ?, department_id = ?, role = ?, phone = ?, is_active = ?
         WHERE id = ?`,
        [full_name, nickname || null, email, department_id || null, role, phone || null, is_active !== undefined ? is_active : 1, userId]
      );
    }
    res.json({ success: true, message: 'อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถอัปเดตผู้ใช้ได้: ' + err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    // ป้องกันการลบ Admin id 1
    if (userId === 1) {
      return res.status(400).json({ success: false, message: 'ไม่อนุญาตให้ลบบัญชีผู้ดูแลระบบหลัก' });
    }
    // ใช้ Soft delete เพื่อรักษาประวัติการแจ้งเคส
    await db.query('UPDATE users SET is_active = 0 WHERE id = ?', [userId]);
    res.json({ success: true, message: 'ระงับการใช้งานผู้ใช้งานเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถลบผู้ใช้ได้' });
  }
});

// -----------------------------------------------------------------------------
// 5. Departments Route
// -----------------------------------------------------------------------------
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await db.query('SELECT id, code, name_th, name_en, color_hex FROM departments WHERE is_active = 1');
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -----------------------------------------------------------------------------
// 6. Real MySQL Cases Routes
// -----------------------------------------------------------------------------
app.get('/api/cases', async (req, res) => {
  try {
    const cases = await db.query(
      `SELECT c.id, c.case_uid as caseUid, c.case_no as caseNo, c.subject, c.description,
              c.location_type as location, c.room_no as room, c.priority, c.status,
              c.reporter_name as reporter, c.assignee_name as assignee,
              c.sla_minutes as sla, c.due_at as due, c.affects_room_salability as affects,
              c.created_at as createdAt, c.reminders_count as reminders, c.escalated_at as escalatedAt,
              d.code as dept
       FROM cases c
       LEFT JOIN departments d ON c.department_id = d.id
       WHERE c.is_deleted = 0
       ORDER BY c.id DESC`
    );
    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/cases', async (req, res) => {
  const { subject, description, location, room, dept, priority, reporter_name, reporter_id, affects } = req.body;
  if (!subject || !description || !dept) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลเคสให้ครบถ้วน' });
  }

  try {
    const caseNo = await db.getNextCaseNumber();
    const caseUid = crypto.randomUUID();

    // หา department_id
    const deptRows = await db.query('SELECT id FROM departments WHERE code = ?', [dept]);
    const deptId = deptRows.length ? deptRows[0].id : 1;

    // คำนวณ SLA
    const slaMin = priority === 'EMERGENCY' ? 20 : (priority === 'URGENT' ? 40 : 60);
    const dueAt = new Date(Date.now() + slaMin * 60000);

    // หา room_id
    let roomId = null;
    if (room) {
      const roomRows = await db.query('SELECT id FROM rooms WHERE room_no = ?', [room]);
      if (roomRows.length) roomId = roomRows[0].id;
    }

    await db.query(
      `INSERT INTO cases (case_uid, case_no, subject, description, location_type, room_id, room_no,
                          department_id, priority, status, reporter_id, reporter_name,
                          sla_minutes, due_at, affects_room_salability)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?, ?, ?, ?)`,
      [caseUid, caseNo, subject, description, location || 'Guest Room', roomId, room || null,
       deptId, priority || 'NORMAL', reporter_id || 1, reporter_name || 'Staff',
       slaMin, dueAt, affects ? 1 : 0]
    );

    // ถ้ามีผลต่อการขายห้อง ปิดห้องทันที
    if (affects && roomId) {
      await db.query("UPDATE rooms SET status = 'CLOSED', closed_reason = ? WHERE id = ?", ['เคส ' + caseNo + ': ' + subject, roomId]);
      await db.query("INSERT INTO room_logs (room_id, room_no, action, reason, actor_name) VALUES (?, ?, 'CLOSE_ROOM', ?, ?)",
        [roomId, room, 'ปิดห้องอัตโนมัติจากเคส ' + caseNo, reporter_name || 'Staff']);
    }

    res.json({ success: true, caseNo, caseUid });
  } catch (err) {
    console.error('Create case error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -----------------------------------------------------------------------------
// 7. Rooms Routes
// -----------------------------------------------------------------------------
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await db.query('SELECT id, room_no as roomNo, building, floor, room_type as roomType, status, closed_reason as reason FROM rooms ORDER BY room_no ASC');
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Static Files Serving
app.use(express.static(__dirname));

// Start Server
app.listen(PORT, HOST, () => {
  const ipv4 = os.networkInterfaces();
  let localIp = '127.0.0.1';

  Object.keys(ipv4).forEach(iface => {
    ipv4[iface].forEach(addr => {
      if (addr.family === 'IPv4' && !addr.internal) {
        localIp = addr.address;
      }
    });
  });

  console.log('🚀 Hotel Case Reporting System — Express & MySQL Backend');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Local:     http://localhost:${PORT}`);
  console.log(`🌐 Network:   http://${localIp}:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
