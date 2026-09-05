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

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // ตรวจสอบ security: ห้ามไปที่ parent directories
  if (pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // ถ้าเป็น root ให้ redirect ไป index.html
  if (pathname === '/') {
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
