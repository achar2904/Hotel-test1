// =============================================================================
// MySQL Database Connection Pool Module
// Hotel Case Reporting System — The Regent Cha-am & VALA
// =============================================================================

require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_case_db',
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10) || 0,
  charset: 'utf8mb4',
  dateStrings: true,
};

let pool = null;
let isConnected = false;

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn('⚠️  Could not create MySQL pool:', err.message);
}

// ทดสอบการเชื่อมต่อฐานข้อมูล
async function testConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    isConnected = true;
    connection.release();
    console.log(`✅  Connected to MySQL successfully [${dbConfig.database}@${dbConfig.host}:${dbConfig.port}]`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️  MySQL connection standby: [${err.code || err.message}] — Server will continue in static/demo mode until DB is ready.`);
    return false;
  }
}

// ฟังก์ชันรันคำสั่ง SQL ทั่วไป
async function query(sql, params = []) {
  if (!pool) throw new Error('Database pool not initialized');
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

// ฟังก์ชันสร้างเลขเคสแบบ Atomic (รับประกันเลขเรียง ไม่ชน ไม่ข้าม 100%)
// ตัวอย่าง: CASE-20260906-0001
async function getNextCaseNumber() {
  if (!pool) throw new Error('Database not connected');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}${mm}${dd}`;

    // เพิ่มตัวนับประจำวันด้วย atomic increment
    await connection.execute(
      `INSERT INTO case_counters (date_key, last_number)
       VALUES (?, 1)
       ON DUPLICATE KEY UPDATE last_number = last_number + 1`,
      [dateKey]
    );

    const [rows] = await connection.execute(
      `SELECT last_number FROM case_counters WHERE date_key = ?`,
      [dateKey]
    );

    await connection.commit();

    const nextSeq = String(rows[0].last_number).padStart(4, '0');
    return `CASE-${dateKey}-${nextSeq}`;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  testConnection,
  getNextCaseNumber,
  isConnected: () => isConnected,
};
