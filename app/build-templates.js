const fs = require('fs');
const path = require('path');

const APP_DIR = __dirname;
const TEMPLATES_DIR = path.join(APP_DIR, 'templates');
const COMPONENTS_DIR = path.join(TEMPLATES_DIR, 'components');
const VIEWS_DIR = path.join(TEMPLATES_DIR, 'views');

// ตรวจสอบโฟลเดอร์
[TEMPLATES_DIR, COMPONENTS_DIR, VIEWS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ฟังก์ชันแยก index.html ออกเป็น templates ย่อย
function splitIndexHtml() {
  const indexPath = path.join(APP_DIR, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');

  // แยกส่วนต่างๆ ด้วย Regex หรือ string markers
  const loginMatch = content.match(/<!-- ================= LOGIN ================= -->([\s\S]*?)(?=<!-- ================= APP SHELL ================= -->)/);
  if (loginMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'login.html'), loginMatch[1].trim(), 'utf8');
  }

  const topbarMatch = content.match(/(<header class="topbar">[\s\S]*?<\/aside>)/);
  if (topbarMatch) {
    fs.writeFileSync(path.join(COMPONENTS_DIR, 'topbar.html'), topbarMatch[1].trim(), 'utf8');
  }

  const sidebarMatch = content.match(/(<nav id="sidebar"[\s\S]*?<\/nav>)/);
  if (sidebarMatch) {
    fs.writeFileSync(path.join(COMPONENTS_DIR, 'sidebar.html'), sidebarMatch[1].trim(), 'utf8');
  }

  const listMatch = content.match(/<!-- ================= CASE LIST ================= -->([\s\S]*?)(?=<!-- ================= CASE DETAIL ================= -->)/);
  if (listMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'case-list.html'), listMatch[1].trim(), 'utf8');
  }

  const detailMatch = content.match(/<!-- ================= CASE DETAIL ================= -->([\s\S]*?)(?=<!-- ================= CREATE CASE ================= -->)/);
  if (detailMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'case-detail.html'), detailMatch[1].trim(), 'utf8');
  }

  const createMatch = content.match(/<!-- ================= CREATE CASE ================= -->([\s\S]*?)(?=<!-- ================= CASE DASHBOARD ================= -->)/);
  if (createMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'case-create.html'), createMatch[1].trim(), 'utf8');
  }

  const dashMatch = content.match(/<!-- ================= CASE DASHBOARD ================= -->([\s\S]*?)(?=<!-- ================= ROOM DASHBOARD ================= -->)/);
  if (dashMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'dashboard-case.html'), dashMatch[1].trim(), 'utf8');
  }

  const roomsMatch = content.match(/<!-- ================= ROOM DASHBOARD ================= -->([\s\S]*?)(?=<!-- ================= AUDIT LOG ================= -->)/);
  if (roomsMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'dashboard-rooms.html'), roomsMatch[1].trim(), 'utf8');
  }

  const auditMatch = content.match(/<!-- ================= AUDIT LOG ================= -->([\s\S]*?)(?=<!-- ================= CONFIG ================= -->)/);
  if (auditMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'audit.html'), auditMatch[1].trim(), 'utf8');
  }

  const configMatch = content.match(/<!-- ================= CONFIG ================= -->([\s\S]*?)(?=<\/main>)/);
  if (configMatch) {
    fs.writeFileSync(path.join(VIEWS_DIR, 'config.html'), configMatch[1].trim(), 'utf8');
  }

  const tabbarMatch = content.match(/(<!-- Bottom tab bar \(mobile\) -->[\s\S]*?<\/nav>)/);
  if (tabbarMatch) {
    fs.writeFileSync(path.join(COMPONENTS_DIR, 'mobile-tabbar.html'), tabbarMatch[1].trim(), 'utf8');
  }

  const modalMatch = content.match(/(<!-- ================= MODAL BACKDROP ================= -->[\s\S]*?)(?=<!-- ================= TOAST STACK ================= -->)/);
  if (modalMatch) {
    fs.writeFileSync(path.join(COMPONENTS_DIR, 'modals.html'), modalMatch[1].trim(), 'utf8');
  }

  const toastMatch = content.match(/(<!-- ================= TOAST STACK ================= -->[\s\S]*?)(?=<script)/);
  if (toastMatch) {
    fs.writeFileSync(path.join(COMPONENTS_DIR, 'toasts.html'), toastMatch[1].trim(), 'utf8');
  }

  // สร้าง layout template หลัก
  const layout = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Hotel Case Reporting System — Regent Cha-am</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<!-- {{views/login.html}} -->

<div id="screen-app" class="app hidden">
  <!-- {{components/topbar.html}} -->

  <div class="layout">
    <!-- {{components/sidebar.html}} -->

    <main class="main" id="main-content">
      <!-- {{views/case-list.html}} -->
      <!-- {{views/case-detail.html}} -->
      <!-- {{views/case-create.html}} -->
      <!-- {{views/dashboard-case.html}} -->
      <!-- {{views/dashboard-rooms.html}} -->
      <!-- {{views/audit.html}} -->
      <!-- {{views/config.html}} -->
    </main>
  </div>

  <!-- {{components/mobile-tabbar.html}} -->
</div>

<!-- {{components/modals.html}} -->
<!-- {{components/toasts.html}} -->

<script src="app.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(TEMPLATES_DIR, 'layout.html'), layout, 'utf8');
  console.log('✅ แยกชิ้นส่วน templates เรียบร้อยแล้ว!');
}

// ฟังก์ชันประกอบ templates รวมกลับเป็น index.html
function assembleIndexHtml() {
  const layoutPath = path.join(TEMPLATES_DIR, 'layout.html');
  if (!fs.existsSync(layoutPath)) {
    console.error('❌ ไม่พบ templates/layout.html');
    return;
  }

  let html = fs.readFileSync(layoutPath, 'utf8');
  const placeholderRegex = /<!--\s*\{\{([\w\-\.\/]+)\}\}\s*-->/g;

  html = html.replace(placeholderRegex, (match, filePath) => {
    const fullPath = path.join(TEMPLATES_DIR, filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    } else {
      console.warn(`⚠️ Warning: Template not found: ${filePath}`);
      return `<!-- Missing: ${filePath} -->`;
    }
  });

  fs.writeFileSync(path.join(APP_DIR, 'index.html'), html, 'utf8');
  console.log('✨ รวมไฟล์ templates -> index.html เรียบร้อยแล้ว!');
}

// สั่งทำงาน
const action = process.argv[2];
if (action === 'assemble') {
  assembleIndexHtml();
} else {
  splitIndexHtml();
  assembleIndexHtml();
}
