// Simple Node.js HTTP Server
// เซิร์ฟเวอร์ Local ที่เปิดให้เข้าถึงจากเครื่องอื่นในเครือข่าย

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'; // Listen on all network interfaces

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

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

  // ซิงค์บันทึกกลับไปยัง index.html เพื่อความเข้ากันได้
  try {
    fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
  } catch (e) {}

  return html;
}

const db = require('./db');

// ตรวจสอบสถานะการเชื่อมต่อ MySQL เมื่อเริ่มเซิร์ฟเวอร์
db.testConnection();

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // API สถานะฐานข้อมูล
  if (pathname === '/api/db-status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      connected: db.isConnected(),
      database: process.env.DB_NAME || 'hotel_case_db',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      engine: 'MySQL / MariaDB'
    }));
    return;
  }

  // ตรวจสอบ security: ห้ามไปที่ parent directories
  if (pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // ถ้าเป็น root หรือ index.html ให้ render จาก templates ทันที
  if (pathname === '/' || pathname === '/index.html') {
    const renderedHtml = renderTemplates();
    if (renderedHtml) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderedHtml);
      return;
    }
    pathname = '/index.html';
  }

  // สร้าง full file path
  const filePath = path.join(__dirname, pathname);

  // อ่านไฟล์
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Server Error');
      }
      return;
    }

    // กำหนด content type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // ส่ง response
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  const ipv4 = require('os').networkInterfaces();
  let localIp = '127.0.0.1';
  
  Object.keys(ipv4).forEach(iface => {
    ipv4[iface].forEach(addr => {
      if (addr.family === 'IPv4' && !addr.internal) {
        localIp = addr.address;
      }
    });
  });

  console.log('🚀 Hotel Case Reporting System');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Local:     http://localhost:${PORT}`);
  console.log(`🌐 Network:   http://${localIp}:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Press Ctrl+C to stop the server');
});
