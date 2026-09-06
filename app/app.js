/* =========================================================================
   Hotel Case Reporting System — Prototype v2
   Client-side app: real state persisted to localStorage, live SLA ticker,
   modals, toasts, audit log, config, export, i18n.
   ========================================================================= */
(function(){
'use strict';

// ============================================================
// I18N dictionary
// ============================================================
const DICT = {
  th: {
    'app.brand':'Hotel Case','app.roleLabel':'สลับสิทธิ์','app.resetDemo':'รีเซ็ตข้อมูล Demo',
    'role.admin':'ผู้ดูแลระบบ (Admin)','role.owner':'ผู้บริหาร (GM/Owner)','role.dept_head':'หัวหน้าแผนก','role.staff':'พนักงานทั่วไป',
    'login.title':'ระบบแจ้งเคสภายในโรงแรม','login.subtitle':'เข้าสู่ระบบด้วยบัญชี Google ขององค์กร',
    'login.google':'ลงชื่อเข้าใช้ด้วย Google','login.footer':'ต้องมีบัญชีในโดเมนของโรงแรมเท่านั้น','login.demoAs':'Demo — เข้าใช้เป็น',
    'nav.cases':'รายการเคส','nav.create':'แจ้งเคสใหม่','nav.dashboard':'Dashboard เคส','nav.rooms':'Dashboard ห้อง','nav.audit':'Audit log','nav.config':'ตั้งค่า','nav.users':'จัดการผู้ใช้งาน','users.title':'จัดการผู้ใช้งานและกำหนดสิทธิ์',
    'tab.list':'เคส','tab.new':'แจ้ง','tab.dash':'Dash','tab.rooms':'ห้อง',
    'list.title':'รายการเคส','list.newCase':'แจ้งเคสใหม่','list.searchPlaceholder':'ค้นหาเคส หมายเลข หัวข้อ ห้อง...',
    'filter.allStatus':'สถานะทั้งหมด','filter.allPriority':'ความสำคัญทั้งหมด','filter.allDept':'ทุกแผนก','filter.allCategory':'ทุกหมวดหมู่','filter.allAssignee':'ผู้รับผิดชอบทุกคน','filter.unassigned':'ยังไม่มีผู้รับผิดชอบ',
    'filter.allSla':'SLA ทั้งหมด','filter.sla.over':'เกิน SLA','filter.sla.warn':'ใกล้ครบ SLA','filter.sla.ok':'อยู่ในกำหนด','filter.sla.done':'ปิด/แก้แล้ว',
    'table.caseNo':'เลขเคส','table.subject':'หัวข้อ','table.dept':'แผนก','table.priority':'ระดับ','table.status':'สถานะ','table.sla':'SLA',
    'detail.back':'กลับรายการเคส','detail.conversation':'บทสนทนา','detail.info':'รายละเอียด','detail.sla':'SLA','detail.replyPlaceholder':'พิมพ์ข้อความ...',
    'detail.assignee':'ผู้รับผิดชอบ','detail.reporter':'ผู้แจ้ง','detail.location':'สถานที่','detail.room':'ห้อง','detail.category':'หมวดหมู่',
    'detail.priority':'ระดับ','detail.status':'สถานะ','detail.dept':'แผนก','detail.created':'สร้างเมื่อ','detail.due':'กำหนดเสร็จ','detail.unassigned':'—',
    'action.acknowledge':'รับเรื่อง','action.assign':'มอบหมาย','action.transfer':'ส่งต่อ','action.resolve':'ปิดเคส (แก้แล้ว)','action.close':'ยืนยันปิด','action.reopen':'เปิดเคสใหม่','action.cancel':'ยกเลิกเคส',
    'create.title':'แจ้งเคสใหม่','create.location':'สถานที่','create.room':'เลขห้อง (ถ้ามี)','create.dept':'แผนก','create.category':'หมวดหมู่',
    'create.selectDeptFirst':'เลือกแผนกก่อน','create.subject':'หัวข้อ','create.desc':'รายละเอียด','create.priority':'ระดับความเร่งด่วน',
    'create.affects':'เคสนี้ทำให้ห้องขายไม่ได้','create.affectsHint':'ระบบจะปิดขายห้องอัตโนมัติจนกว่าจะปิดเคส',
    'create.attachment':'ไฟล์แนบ (ภาพ ≤ 1 MB)','create.submit':'ส่งเคส',
    'btn.cancel':'ยกเลิก','btn.confirm':'ยืนยัน','btn.exportCsv':'CSV','btn.print':'พิมพ์',
    'dashboard.title':'Dashboard เคส','dashboard.byDept':'เคสตามแผนก','dashboard.byStatus':'สัดส่วนสถานะ',
    'dashboard.trend':'แนวโน้ม 7 วัน (เคสใหม่ vs ปิด)','dashboard.topCategory':'Top category',
    'kpi.total':'เคสทั้งหมด','kpi.new':'ใหม่','kpi.progress':'กำลังทำ','kpi.overdue':'เกิน SLA','kpi.resolved':'แก้แล้ว','kpi.closed':'ปิด',
    'rooms.title':'Dashboard ห้องพัก','rooms.total':'ทั้งหมด','rooms.available':'พร้อมขาย','rooms.closed':'ปิด','rooms.pct':'% พร้อมขาย',
    'rooms.grid':'ผังห้อง (คลิกเพื่อดูรายละเอียด)','rooms.history':'ประวัติห้อง','rooms.selectRoom':'เลือกห้องเพื่อดูประวัติ','rooms.changeStatus':'เปลี่ยนสถานะ',
    'rooms.openReasonAsk':'ยืนยันเปิดห้อง — กรุณาระบุเหตุผล','rooms.closeReasonAsk':'ยืนยันปิดห้อง — กรุณาระบุเหตุผล',
    'rooms.reopenPrompt':'ห้อง {no} ทุกเคสปิดแล้ว ต้องการเปิดห้องหรือไม่?',
    'sla.overdue':'เกินกำหนด','sla.dueSoon':'ใกล้ครบ','sla.ontrack':'อยู่ในกำหนด','sla.reminded':'เตือน {n}×',
    'notif.title':'การแจ้งเตือน','notif.empty':'ไม่มีการแจ้งเตือน','notif.markRead':'อ่านทั้งหมด',
    'toast.caseCreated':'สร้างเคส {no} เรียบร้อย','toast.actionDone':'{action} เรียบร้อย','toast.reminder':'Reminder #{n} — เคส {no}','toast.escalated':'Escalated เคส {no} → {to}',
    'toast.roomClosed':'ปิดห้อง {no} — {reason}','toast.roomOpened':'เปิดห้อง {no}','toast.reopenReminder':'ห้อง {no} ทุกเคสปิดแล้ว — กดเปิดห้อง',
    'toast.demoReset':'รีเซ็ตข้อมูล demo แล้ว','toast.configSaved':'บันทึกค่าแล้ว','toast.exportDone':'ดาวน์โหลด CSV แล้ว',
    'transfer.title':'ส่งต่อเคส','transfer.dept':'แผนกใหม่','transfer.reason':'เหตุผล','transfer.reasonPh':'อธิบายสั้นๆ',
    'assign.title':'มอบหมายผู้รับผิดชอบ','assign.who':'ผู้รับผิดชอบ',
    'cancel.title':'ยกเลิกเคส','cancel.reason':'เหตุผล (เช่น แจ้งซ้ำ / แจ้งผิด)',
    'resolve.title':'ปิดเคส (แก้ไขเสร็จ)','resolve.note':'สรุปการแก้ไข',
    'close.title':'ยืนยันปิดเคส','close.note':'บันทึกเพิ่มเติม (ถ้ามี)',
    'reopen.title':'เปิดเคสใหม่','reopen.reason':'เหตุผลที่เปิดใหม่',
    'audit.title':'Audit log','audit.when':'เวลา','audit.event':'เหตุการณ์','audit.case':'เคส','audit.actor':'ผู้กระทำ','audit.detail':'รายละเอียด',
    'audit.searchPlaceholder':'ค้นหาเคส เหตุการณ์ ผู้กระทำ...','audit.allEvents':'ทุกเหตุการณ์',
    'config.title':'ตั้งค่าระบบ','config.saved':'บันทึกอัตโนมัติเมื่อแก้',
    'config.sla':'SLA & Reminders','config.slaEmerg':'SLA_EMERGENCY (นาที)','config.slaUrgent':'SLA_URGENT (นาที)','config.slaNormal':'SLA_NORMAL (นาที)',
    'config.maxReminder':'MAX_REMINDER','config.remInterval':'REMINDER_INTERVAL (นาที)',
    'config.snapshotNote':'ทำไมต้อง snapshot:','config.snapshotExplain':'เคสที่มีอยู่จะยังใช้ค่า SLA เดิม (SLA_Minutes) — เปลี่ยนที่นี่มีผลเฉพาะเคสใหม่',
    'config.rooms':'Room & Notification','config.autoClose':'AUTO_ROOM_CLOSE','config.autoCloseHint':'เมื่อเคส AffectsRoomSalability = TRUE จะปิดห้องอัตโนมัติ',
    'config.defaultLang':'ภาษาเริ่มต้น','config.openOnlyManual':'เปิดห้องคืนต้องคนกดเสมอ ระบบไม่เปิดอัตโนมัติ',
    'config.categories':'Categories ต่อแผนก','config.categoriesHint':'เพิ่ม/ลบหมวดหมู่ต่อแผนก · TH+EN key',
    'config.addCat':'เพิ่มหมวดหมู่',
    'sys.transferred':'ส่งต่อเคสจาก {from} ไป {to} — เหตุผล: {reason}',
    'sys.acknowledged':'รับเรื่องโดย {who}','sys.assigned':'มอบหมายให้ {who}',
    'sys.resolved':'ปิดเคส (RESOLVED) — {note}','sys.closed':'ปิดเคสสมบูรณ์ — {note}','sys.reopened':'เปิดเคสใหม่ — {reason}','sys.cancelled':'ยกเลิกเคส — {reason}',
    'sys.reminder':'Reminder #{n} ส่งถึง {who}','sys.escalated':'Escalated ถึง {who} (Admin แผนก {dept})',
    'sys.roomClosed':'ห้อง {no} ถูกปิดขายอัตโนมัติ','sys.roomOpened':'ห้อง {no} เปิดขายแล้ว',
    'prio.normalLong':'NORMAL (60 นาที)','prio.urgentLong':'URGENT (40 นาที)','prio.emergencyLong':'EMERGENCY (20 นาที)',
    // Categories (spec keys)
    'cat.IT.network':'อินเทอร์เน็ต / เครือข่าย','cat.IT.tv':'ทีวี / กล่องรับสัญญาณ','cat.IT.pos':'ระบบ POS / PMS',
    'cat.HK.linen':'ผ้าปู / ผ้าเช็ดตัว','cat.HK.amenity':'ของใช้ในห้อง','cat.HK.cleaning':'ทำความสะอาดพิเศษ',
    'cat.ENG.ac':'แอร์','cat.ENG.plumbing':'ประปา / น้ำรั่ว','cat.ENG.electric':'ไฟฟ้า','cat.ENG.lock':'ประตู / กุญแจ',
    'cat.FRONT.checkin':'เช็คอิน / เช็คเอาต์','cat.FRONT.complaint':'ข้อร้องเรียนแขก',
    'cat.SECURITY.cctv':'CCTV','cat.SECURITY.incident':'เหตุการณ์',
    'err.required':'จำเป็นต้องกรอก','err.tooShort':'สั้นเกินไป',
  },
  en: {
    'app.brand':'Hotel Case','app.roleLabel':'Switch role','app.resetDemo':'Reset demo data',
    'role.admin':'Administrator','role.owner':'Owner / GM','role.dept_head':'Department Head','role.staff':'Staff',
    'login.title':'Hotel Case Reporting System','login.subtitle':'Sign in with your organization Google account',
    'login.google':'Sign in with Google','login.footer':'Only accounts in the hotel domain can sign in','login.demoAs':'Demo — sign in as',
    'nav.cases':'Cases','nav.create':'New case','nav.dashboard':'Case dashboard','nav.rooms':'Room dashboard','nav.audit':'Audit log','nav.config':'Settings','nav.users':'Users','users.title':'User Management & Permissions',
    'tab.list':'Cases','tab.new':'New','tab.dash':'Dash','tab.rooms':'Rooms',
    'list.title':'Cases','list.newCase':'New case','list.searchPlaceholder':'Search case #, subject, room...',
    'filter.allStatus':'All statuses','filter.allPriority':'All priorities','filter.allDept':'All departments','filter.allCategory':'All categories','filter.allAssignee':'All assignees','filter.unassigned':'Unassigned',
    'filter.allSla':'Any SLA state','filter.sla.over':'Past SLA','filter.sla.warn':'Due soon','filter.sla.ok':'On track','filter.sla.done':'Resolved/closed',
    'table.caseNo':'Case #','table.subject':'Subject','table.dept':'Dept','table.priority':'Priority','table.status':'Status','table.sla':'SLA',
    'detail.back':'Back to cases','detail.conversation':'Conversation','detail.info':'Details','detail.sla':'SLA','detail.replyPlaceholder':'Type a message...',
    'detail.assignee':'Assignee','detail.reporter':'Reporter','detail.location':'Location','detail.room':'Room','detail.category':'Category',
    'detail.priority':'Priority','detail.status':'Status','detail.dept':'Dept','detail.created':'Created','detail.due':'Due','detail.unassigned':'—',
    'action.acknowledge':'Acknowledge','action.assign':'Assign','action.transfer':'Transfer','action.resolve':'Mark resolved','action.close':'Confirm close','action.reopen':'Reopen','action.cancel':'Cancel case',
    'create.title':'New case','create.location':'Location','create.room':'Room no (optional)','create.dept':'Department','create.category':'Category',
    'create.selectDeptFirst':'Pick a department first','create.subject':'Subject','create.desc':'Description','create.priority':'Priority',
    'create.affects':'This case makes the room non-sellable','create.affectsHint':'Room will be auto-closed until this case is resolved',
    'create.attachment':'Attachment (image ≤ 1 MB)','create.submit':'Submit case',
    'btn.cancel':'Cancel','btn.confirm':'Confirm','btn.exportCsv':'CSV','btn.print':'Print',
    'dashboard.title':'Case dashboard','dashboard.byDept':'Cases by department','dashboard.byStatus':'Status breakdown',
    'dashboard.trend':'7-day trend (new vs closed)','dashboard.topCategory':'Top category',
    'kpi.total':'Total','kpi.new':'New','kpi.progress':'In progress','kpi.overdue':'Past SLA','kpi.resolved':'Resolved','kpi.closed':'Closed',
    'rooms.title':'Room dashboard','rooms.total':'Total','rooms.available':'Available','rooms.closed':'Closed','rooms.pct':'% Available',
    'rooms.grid':'Room grid (click for detail)','rooms.history':'Room history','rooms.selectRoom':'Select a room to see history','rooms.changeStatus':'Change status',
    'rooms.openReasonAsk':'Confirm opening — reason','rooms.closeReasonAsk':'Confirm closing — reason',
    'rooms.reopenPrompt':'All cases for room {no} are closed. Open the room now?',
    'sla.overdue':'Overdue','sla.dueSoon':'Due soon','sla.ontrack':'On track','sla.reminded':'Reminded {n}×',
    'notif.title':'Notifications','notif.empty':'No notifications','notif.markRead':'Mark all read',
    'toast.caseCreated':'Case {no} created','toast.actionDone':'{action} done','toast.reminder':'Reminder #{n} — case {no}','toast.escalated':'Escalated {no} → {to}',
    'toast.roomClosed':'Room {no} closed — {reason}','toast.roomOpened':'Room {no} opened','toast.reopenReminder':'Room {no} all cases closed — open the room',
    'toast.demoReset':'Demo data reset','toast.configSaved':'Config saved','toast.exportDone':'CSV downloaded',
    'transfer.title':'Transfer case','transfer.dept':'Target department','transfer.reason':'Reason','transfer.reasonPh':'Short explanation',
    'assign.title':'Assign case','assign.who':'Assignee',
    'cancel.title':'Cancel case','cancel.reason':'Reason (e.g. duplicate / misfiled)',
    'resolve.title':'Mark resolved','resolve.note':'Resolution note',
    'close.title':'Confirm close','close.note':'Note (optional)',
    'reopen.title':'Reopen case','reopen.reason':'Reason for reopening',
    'audit.title':'Audit log','audit.when':'When','audit.event':'Event','audit.case':'Case','audit.actor':'Actor','audit.detail':'Detail',
    'audit.searchPlaceholder':'Search case, event, actor...','audit.allEvents':'All events',
    'config.title':'Settings','config.saved':'Auto-saved on change',
    'config.sla':'SLA & reminders','config.slaEmerg':'SLA_EMERGENCY (min)','config.slaUrgent':'SLA_URGENT (min)','config.slaNormal':'SLA_NORMAL (min)',
    'config.maxReminder':'MAX_REMINDER','config.remInterval':'REMINDER_INTERVAL (min)',
    'config.snapshotNote':'Why snapshot:','config.snapshotExplain':'Existing cases keep their original SLA_Minutes — changes here only affect new cases',
    'config.rooms':'Room & notification','config.autoClose':'AUTO_ROOM_CLOSE','config.autoCloseHint':'When a case has AffectsRoomSalability=TRUE, close the room automatically',
    'config.defaultLang':'Default language','config.openOnlyManual':'Room re-open always requires a human — never automatic',
    'config.categories':'Categories per department','config.categoriesHint':'Add/remove categories per dept · TH+EN key',
    'config.addCat':'Add category',
    'sys.transferred':'Case transferred from {from} to {to} — reason: {reason}',
    'sys.acknowledged':'Acknowledged by {who}','sys.assigned':'Assigned to {who}',
    'sys.resolved':'Marked RESOLVED — {note}','sys.closed':'Case CLOSED — {note}','sys.reopened':'Case REOPENED — {reason}','sys.cancelled':'Case CANCELLED — {reason}',
    'sys.reminder':'Reminder #{n} sent to {who}','sys.escalated':'Escalated to {who} (Admin of {dept})',
    'sys.roomClosed':'Room {no} auto-closed','sys.roomOpened':'Room {no} opened for sale',
    'prio.normalLong':'NORMAL (60 min)','prio.urgentLong':'URGENT (40 min)','prio.emergencyLong':'EMERGENCY (20 min)',
    'cat.IT.network':'Internet / network','cat.IT.tv':'TV / set-top box','cat.IT.pos':'POS / PMS system',
    'cat.HK.linen':'Linen / towels','cat.HK.amenity':'Room amenities','cat.HK.cleaning':'Special cleaning',
    'cat.ENG.ac':'Air conditioning','cat.ENG.plumbing':'Plumbing / leak','cat.ENG.electric':'Electrical','cat.ENG.lock':'Door / lock',
    'cat.FRONT.checkin':'Check-in / check-out','cat.FRONT.complaint':'Guest complaint',
    'cat.SECURITY.cctv':'CCTV','cat.SECURITY.incident':'Incident',
    'err.required':'Required','err.tooShort':'Too short',
  }
};

// ============================================================
// State layer (persisted)
// ============================================================
const LS_KEY = 'hotelCasePrototype.v2';
const STATE = {
  cases: [], comments: {}, logs: [], notifications: [],
  rooms: [], roomLogs: {},
  counters: {}, // by yyyymmdd → next running number
  config: { SLA_EMERGENCY:20, SLA_URGENT:40, SLA_NORMAL:60, MAX_REMINDER:2, REMINDER_INTERVAL:10,
            AUTO_ROOM_CLOSE:true, DEFAULT_LANGUAGE:'th',
            CATEGORIES: {
              IT:['cat.IT.network','cat.IT.tv','cat.IT.pos'],
              HK:['cat.HK.linen','cat.HK.amenity','cat.HK.cleaning'],
              ENG:['cat.ENG.ac','cat.ENG.plumbing','cat.ENG.electric','cat.ENG.lock'],
              FRONT:['cat.FRONT.checkin','cat.FRONT.complaint'],
              SECURITY:['cat.SECURITY.cctv','cat.SECURITY.incident']
            }
          },
  users: [
    {name:'สมชาย ใจดี', role:'staff', dept:'FRONT', email:'somchai@hotel'},
    {name:'HK พี่แนน', role:'staff', dept:'HK'},
    {name:'HK พี่ตุ๊ก', role:'staff', dept:'HK'},
    {name:'ช่างประยุทธ์', role:'staff', dept:'ENG'},
    {name:'ช่างสมพงษ์', role:'dept_head', dept:'ENG'},
    {name:'IT วีระ', role:'staff', dept:'IT'},
    {name:'IT พี่โจ', role:'dept_head', dept:'IT'},
    {name:'FRONT พี่นก', role:'dept_head', dept:'FRONT'},
    {name:'HK หัวหน้าจู', role:'dept_head', dept:'HK'},
    {name:'รปภ. สมเกียรติ', role:'staff', dept:'SECURITY'},
    {name:'ผจก. อรทัย', role:'admin', dept:'ADMIN'},
    {name:'เจ้าของ นพ.', role:'owner', dept:'OWNER'},
  ],
  ui: { role:'staff', currentUser:'สมชาย ใจดี', lang:'th', view:'list', selectedCase:null, selectedRoom:null,
        page:1, perPage:8, sort:{key:'due', dir:'asc'}, speed:1,
        clockBaseReal:Date.now(), clockBaseVirtual:0, lastSyncReal:Date.now(),
        pendingAttach:null, notifPanelOpen:false }
};

// Load or seed
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      Object.assign(STATE, s);
      STATE.ui.clockBaseReal = Date.now(); // restart clock base on load
      return;
    }
  } catch(e) { console.warn('load failed', e); }
  seedDemo();
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)); } catch(e) {}
}
function resetAll() {
  localStorage.removeItem(LS_KEY);
  // Reset object in place
  STATE.cases = []; STATE.comments = {}; STATE.logs = []; STATE.notifications = [];
  STATE.rooms = []; STATE.roomLogs = {}; STATE.counters = {};
  STATE.ui.selectedCase = null; STATE.ui.selectedRoom = null; STATE.ui.page = 1;
  STATE.ui.clockBaseReal = Date.now(); STATE.ui.clockBaseVirtual = 0;
  seedDemo();
  saveState();
}

// ============================================================
// Real Production Time & Database Synchronization
// ============================================================
function now() {
  return Date.now();
}

function seedDemo() {
  STATE.cases = [];
  STATE.comments = {};
  STATE.logs = [];
  STATE.rooms = [];
  STATE.roomLogs = {};
}

async function syncFromDatabase() {
  try {
    const [cRes, rRes, uRes] = await Promise.all([
      fetch('/api/cases').then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/rooms').then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/users').then(r => r.json()).catch(() => ({ success: false }))
    ]);
    if (cRes.success) {
      STATE.cases = (cRes.cases || []).map(c => ({
        ...c,
        createdAt: typeof c.createdAt === 'string' ? new Date(c.createdAt).getTime() : (c.createdAt || now()),
        due: typeof c.due === 'string' ? new Date(c.due).getTime() : (c.due || now()),
        affects: !!c.affects,
        reminders: c.reminders || 0
      }));
    }
    if (rRes.success) STATE.rooms = rRes.rooms || [];
    if (uRes.success) {
      STATE.users = uRes.users || [];
      const countEl = document.getElementById('nav-count-users');
      if (countEl) countEl.textContent = STATE.users.length;
    }
    if (STATE.ui.view === 'list') renderList();
    if (STATE.ui.view === 'rooms') renderRooms();
    if (STATE.ui.view === 'users') renderUsers();
  } catch(e) {
    console.warn('Sync from DB failed:', e);
  }
}

// ============================================================
// Helpers
// ============================================================
function t(key, vars) {
  let s = (DICT[STATE.ui.lang] && DICT[STATE.ui.lang][key]) || (DICT.th[key] || key);
  if (vars) Object.keys(vars).forEach(k => { s = s.replace(new RegExp('\\{'+k+'\\}','g'), vars[k]); });
  return s;
}
function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function initials(name){ return (name||'?').trim().split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase(); }
function dateKey(ts){ const d=new Date(ts); return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'); }
function fmtDateISO(ts){ const d=new Date(ts); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function fmtTime(ts) {
  if (!ts) return '—';
  const dt = new Date(ts); const cur = now();
  const diffMin = (cur - dt) / 60000;
  if (Math.abs(diffMin) < 60) {
    const n = Math.round(diffMin);
    if (n === 0) return STATE.ui.lang==='th'?'เมื่อกี้':'just now';
    return STATE.ui.lang==='th'
      ? (n>0 ? `${n} นาทีที่แล้ว` : `อีก ${-n} นาที`)
      : (n>0 ? `${n}m ago` : `in ${-n}m`);
  }
  const hh=String(dt.getHours()).padStart(2,'0'), mm=String(dt.getMinutes()).padStart(2,'0');
  const dd=String(dt.getDate()).padStart(2,'0'), mo=String(dt.getMonth()+1).padStart(2,'0');
  return `${dd}/${mo} ${hh}:${mm}`;
}

// ============================================================
// Permission
// ============================================================
function canSeeRooms(){ return STATE.ui.role==='owner' || STATE.ui.role==='admin'; }
function canSeeDashboard(){ return STATE.ui.role !== 'staff'; }
function canSeeConfig(){ return STATE.ui.role==='admin' || STATE.ui.role==='owner'; }
function canSeeAudit(){ return STATE.ui.role==='admin' || STATE.ui.role==='owner'; }
function canSeeUsers(){ return STATE.ui.role==='admin'; }
function isDeptOrAbove(){ return STATE.ui.role==='dept_head' || STATE.ui.role==='admin' || STATE.ui.role==='owner'; }
function canCreate(){ return true; }
function canAct(c) {
  if (STATE.ui.role==='admin' || STATE.ui.role==='owner') return true;
  if (STATE.ui.role==='dept_head' && c.dept) return true;
  if (STATE.ui.role==='staff') return c.assignee === STATE.ui.currentUser || c.reporter === STATE.ui.currentUser;
  return false;
}

// ============================================================
// Log + notification helpers
// ============================================================
function log(caseUid, event, actor, meta) {
  STATE.logs.push({ id:'l'+Math.random().toString(36).slice(2,9), caseUid, event, actor, at: now(), meta: meta||{} });
}
function notify(kind, title, msg, caseUid) {
  const n = { id: 'n'+Math.random().toString(36).slice(2,9), kind, title, msg, at: now(), read:false, caseUid };
  STATE.notifications.unshift(n);
  if (STATE.notifications.length > 100) STATE.notifications.length = 100;
  Toast.push(kind, title, msg);
  renderNotifCount();
}

// ============================================================
// Toast
// ============================================================
const Toast = {
  push(kind, title, msg) {
    const el = document.createElement('div');
    el.className = 'toast ' + ({info:'',ok:'ok',warn:'warn',err:'err'}[kind]||'');
    const icon = { info:'ℹ️', ok:'✓', warn:'⚠', err:'✕' }[kind] || 'ℹ️';
    el.innerHTML = `<span class="toast-icon">${icon}</span>
      <div class="toast-body"><div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(msg||'')}</div></div>
      <button class="toast-close" aria-label="Close">×</button>`;
    el.querySelector('.toast-close').onclick = () => el.remove();
    document.getElementById('toast-stack').appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(8px)'; setTimeout(()=>el.remove(), 200); }, 4200);
  }
};

// ============================================================
// Modal system with focus trap
// ============================================================
let ModalCtx = { onSubmit:null, prevFocus:null };
function openModal({title, body, submitLabel, onSubmit, danger}) {
  ModalCtx.prevFocus = document.activeElement;
  ModalCtx.onSubmit = onSubmit;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  const foot = document.getElementById('modal-foot');
  foot.innerHTML = `<button type="button" class="btn btn-outlined btn-sm" onclick="App.closeModal()">${escapeHtml(t('btn.cancel'))}</button>
    <button type="button" class="btn ${danger?'btn-danger':'btn-primary'} btn-sm" id="modal-submit">${escapeHtml(submitLabel||t('btn.confirm'))}</button>`;
  document.getElementById('modal-backdrop').classList.add('is-open');
  document.getElementById('modal-submit').onclick = () => {
    if (typeof ModalCtx.onSubmit === 'function') ModalCtx.onSubmit();
  };
  // Focus first input
  setTimeout(() => {
    const first = document.querySelector('#modal-body input, #modal-body select, #modal-body textarea');
    if (first) first.focus();
    else document.getElementById('modal-submit').focus();
  }, 20);
}
function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('is-open');
  if (ModalCtx.prevFocus && ModalCtx.prevFocus.focus) ModalCtx.prevFocus.focus();
  ModalCtx = { onSubmit:null, prevFocus:null };
}
// Focus trap on modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('modal-backdrop').classList.contains('is-open')) { e.preventDefault(); closeModal(); }
    else if (document.getElementById('notif-panel').classList.contains('is-open')) { document.getElementById('notif-panel').classList.remove('is-open'); STATE.ui.notifPanelOpen=false; }
    else if (document.getElementById('sidebar').classList.contains('is-open')) { document.getElementById('sidebar').classList.remove('is-open'); }
    return;
  }
  if (e.key === 'Tab' && document.getElementById('modal-backdrop').classList.contains('is-open')) {
    const focusables = document.querySelectorAll('#modal input, #modal select, #modal textarea, #modal button');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length-1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }
  // "/" focuses search
  if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
    const s = document.getElementById('search-input');
    if (s && !document.getElementById('view-list').classList.contains('hidden')) { e.preventDefault(); s.focus(); }
  }
});

// ============================================================
// Case number generator (LockService-emulated, single-threaded here)
// ============================================================
function nextCaseNo(atTs) {
  const dk = dateKey(atTs || now());
  STATE.counters[dk] = (STATE.counters[dk] || 0) + 1;
  const seq = String(STATE.counters[dk]).padStart(4, '0');
  return `CASE-${dk}-${seq}`;
}

// ============================================================
// State transitions
// ============================================================
const VALID_TRANSITIONS = {
  'NEW':          ['ACKNOWLEDGED','TRANSFERRED','CANCELLED'],
  'ACKNOWLEDGED': ['IN_PROGRESS','TRANSFERRED','RESOLVED','CANCELLED'],
  'IN_PROGRESS':  ['TRANSFERRED','RESOLVED'],
  'TRANSFERRED':  ['NEW','ACKNOWLEDGED'],
  'RESOLVED':     ['CLOSED','REOPENED'],
  'CLOSED':       ['REOPENED'],
  'REOPENED':     ['ACKNOWLEDGED','IN_PROGRESS'],
  'CANCELLED':    [],
};
function canTransition(c, to) { return (VALID_TRANSITIONS[c.status]||[]).includes(to); }

// ============================================================
// SLA / reminders / escalation ticker
// ============================================================
function tickSLA() {
  const cur = now();
  const admins = STATE.users.filter(u=>u.role==='admin');
  let dirty = false;
  for (const c of STATE.cases) {
    if (['RESOLVED','CLOSED','CANCELLED'].includes(c.status)) continue;
    if (cur <= c.due) continue;
    // Past due
    if (c.reminders === 0) {
      const to = pickRecipient(c);
      c.reminders = 1; c.lastReminderAt = cur; dirty = true;
      pushSystemMsg(c, t('sys.reminder', {n:1, who: to}), cur);
      log(c.caseUid,'REMINDER_SENT','System',{n:1, recipient:to});
      notify('warn', t('toast.reminder',{n:1, no:c.caseNo}), t('sys.reminder',{n:1, who:to}), c.caseUid);
    } else if (c.reminders < STATE.config.MAX_REMINDER
               && cur >= c.lastReminderAt + STATE.config.REMINDER_INTERVAL*60000) {
      const to = pickRecipient(c);
      c.reminders += 1; c.lastReminderAt = cur; dirty = true;
      pushSystemMsg(c, t('sys.reminder', {n:c.reminders, who: to}), cur);
      log(c.caseUid,'REMINDER_SENT','System',{n:c.reminders, recipient:to});
      notify('warn', t('toast.reminder',{n:c.reminders, no:c.caseNo}), t('sys.reminder',{n:c.reminders, who:to}), c.caseUid);
    } else if (c.reminders >= STATE.config.MAX_REMINDER && !c.escalatedAt) {
      const admin = admins[0] ? admins[0].name : 'Admin';
      c.escalatedAt = cur; dirty = true;
      pushSystemMsg(c, t('sys.escalated',{who:admin, dept:c.dept}), cur);
      log(c.caseUid,'ESCALATED','System',{to:admin, dept:c.dept});
      notify('err', t('toast.escalated',{no:c.caseNo, to:admin}), t('sys.escalated',{who:admin, dept:c.dept}), c.caseUid);
    }
  }
  if (dirty) { saveState(); }
}
function pickRecipient(c) {
  if (c.assignee) return c.assignee;
  const head = STATE.users.find(u => u.role==='dept_head' && u.dept === c.dept);
  if (head) return head.name;
  const admin = STATE.users.find(u => u.role==='admin');
  return admin ? admin.name : 'Admin';
}
function pushSystemMsg(c, text, ts) {
  const id = 'c'+c.caseUid+'_'+Math.random().toString(36).slice(2,7);
  const list = STATE.comments[c.caseUid] || (STATE.comments[c.caseUid]=[]);
  list.push({ id, caseUid:c.caseUid, sender:'System', dept:'', text, type:'SYSTEM', createdAt: ts || now(), attachment:null });
  c.lastCommentAt = ts || now(); c.hasUnread = true; c.updatedAt = now();
}

// Live tick for UI (SLA cells refresh)
function uiTick() {
  // Update SLA cells in the case list without re-rendering everything
  if (STATE.ui.view === 'list') refreshSLACells();
  if (STATE.ui.view === 'detail' && STATE.ui.selectedCase) refreshDetailSLA();
  // Sync indicator (simulated 30s polling)
  const cur = now();
  const secSinceSync = Math.floor((cur - STATE.ui.lastSyncReal)/1000);
  if (secSinceSync >= 30) STATE.ui.lastSyncReal = cur;
  const syncText = document.getElementById('sync-text');
  if (syncText) syncText.textContent = STATE.ui.lang==='th'
    ? `sync ล่าสุด ${Math.max(0,secSinceSync)}s`
    : `synced ${Math.max(0,secSinceSync)}s ago`;
}

// ============================================================
// Actions
// ============================================================
function createCase(data) {
  const cur = now();
  const caseNo = nextCaseNo(cur);
  const sla = data.priority==='EMERGENCY' ? STATE.config.SLA_EMERGENCY
            : data.priority==='URGENT'    ? STATE.config.SLA_URGENT
            : STATE.config.SLA_NORMAL;
  const c = {
    caseUid: 'u'+Math.random().toString(36).slice(2,9), caseNo, subject:data.subject,
    dept: data.dept, deptFrom: data.dept, location: data.location, room: data.room||'',
    category: data.category, priority: data.priority, status: 'NEW',
    assignee: null, reporter: STATE.ui.currentUser, createdAt: cur, createdBy: STATE.ui.currentUser,
    sla, due: cur + sla*60000, ackAt:null, resolvedAt:null, closedAt:null,
    reminders:0, lastReminderAt:null, escalatedAt:null,
    lastCommentAt: cur, hasUnread:false, affects: !!data.affects, updatedAt: cur, updatedBy: STATE.ui.currentUser, deleted:false,
  };
  STATE.cases.push(c);
  STATE.comments[c.caseUid] = [{ id:'c'+c.caseUid+'_'+Math.random().toString(36).slice(2,7),
    caseUid:c.caseUid, sender: STATE.ui.currentUser, dept:'', text: data.description, type:'USER', createdAt: cur,
    attachment: data.attachment||null }];
  log(c.caseUid, 'CASE_CREATED', STATE.ui.currentUser, { priority: c.priority, dept: c.dept });

  // Auto-link room
  if (c.affects && c.room && STATE.config.AUTO_ROOM_CLOSE) {
    const r = STATE.rooms.find(x=>x.roomNo===c.room);
    if (r) {
      if (r.status !== 'CLOSED') {
        r.status = 'CLOSED'; r.reason = c.subject;
        const list = STATE.roomLogs[c.room] || (STATE.roomLogs[c.room]=[]);
        list.unshift({ when: cur, action:'CLOSE_ROOM', reason: c.subject, actor:'System (auto-link)', caseUid: c.caseUid });
        log(c.caseUid, 'ROOM_LINKED', 'System', { room: c.room });
        pushSystemMsg(c, t('sys.roomClosed',{no:c.room}), cur);
        notify('info', t('toast.roomClosed',{no:c.room, reason:c.subject}), '', c.caseUid);
      }
      if (!r.openCases.includes(c.caseUid)) r.openCases.push(c.caseUid);
    }
  }

  notify('ok', t('toast.caseCreated',{no:c.caseNo}), c.subject, c.caseUid);
  saveState();
  return c;
}

function transitionCase(c, next, actor, extra) {
  const prev = c.status;
  c.status = next; c.updatedAt = now(); c.updatedBy = actor;
  log(c.caseUid, 'STATUS_CHANGED', actor, { from: prev, to: next, ...extra });
  if (next==='ACKNOWLEDGED') { c.ackAt = c.ackAt || now(); pushSystemMsg(c, t('sys.acknowledged',{who:actor}), now()); log(c.caseUid,'ACKNOWLEDGED',actor,{}); }
  if (next==='IN_PROGRESS') { /* no extra timestamp */ }
  if (next==='RESOLVED')    { c.resolvedAt = now(); pushSystemMsg(c, t('sys.resolved',{note: (extra&&extra.note)||''}), now()); log(c.caseUid,'RESOLVED',actor,{note:extra&&extra.note}); }
  if (next==='CLOSED')      { c.closedAt = now(); pushSystemMsg(c, t('sys.closed',{note: (extra&&extra.note)||''}), now()); log(c.caseUid,'CLOSED',actor,{note:extra&&extra.note});
                              popRoomLink(c); }
  if (next==='REOPENED')    { c.reminders = 0; c.escalatedAt = null; c.lastReminderAt = null; c.due = now() + c.sla*60000; pushSystemMsg(c, t('sys.reopened',{reason:(extra&&extra.reason)||''}), now()); log(c.caseUid,'REOPENED',actor,{reason:extra&&extra.reason}); }
  if (next==='CANCELLED')   { pushSystemMsg(c, t('sys.cancelled',{reason:(extra&&extra.reason)||''}), now()); log(c.caseUid,'CANCELLED',actor,{reason:extra&&extra.reason}); popRoomLink(c); }
  saveState();
}
function popRoomLink(c) {
  if (!c.affects || !c.room) return;
  const r = STATE.rooms.find(x=>x.roomNo===c.room); if (!r) return;
  r.openCases = r.openCases.filter(x => x !== c.caseUid);
  if (r.openCases.length === 0) {
    // Prompt user to reopen (spec: never auto-open)
    notify('warn', t('toast.reopenReminder',{no:r.roomNo}), t('rooms.reopenPrompt',{no:r.roomNo}), null);
  }
}

// ============================================================
// Rendering
// ============================================================
// Rebuild a <select>'s options without losing what the user had selected.
// applyI18n runs on every language toggle, so a naive innerHTML rewrite silently
// cleared every active filter.
function fillSelect(id, optionsHtml) {
  const el = document.getElementById(id);
  if (!el) return;
  const prev = el.value;
  el.innerHTML = optionsHtml;
  if (prev && Array.from(el.options).some(o => o.value === prev)) el.value = prev;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.documentElement.lang = STATE.ui.lang;
  // Populate filter dropdowns (selection-preserving)
  fillSelect('filter-status', `<option value="">${t('filter.allStatus')}</option>`
    + ['NEW','ACKNOWLEDGED','IN_PROGRESS','TRANSFERRED','RESOLVED','CLOSED','CANCELLED','REOPENED'].map(s=>`<option value="${s}">${s}</option>`).join(''));
  fillSelect('filter-priority', `<option value="">${t('filter.allPriority')}</option>`
    + ['EMERGENCY','URGENT','NORMAL'].map(s=>`<option value="${s}">${s}</option>`).join(''));
  fillSelect('filter-dept', `<option value="">${t('filter.allDept')}</option>`
    + ['IT','HK','ENG','FRONT','SECURITY'].map(s=>`<option value="${s}">${s}</option>`).join(''));
  fillSelect('filter-category', `<option value="">${t('filter.allCategory')}</option>`
    + Object.values(STATE.config.CATEGORIES).flat().map(k=>`<option value="${k}">${t(k)}</option>`).join(''));
  const assignees = Array.from(new Set(STATE.cases.map(c=>c.assignee).filter(Boolean)));
  fillSelect('filter-assignee', `<option value="">${t('filter.allAssignee')}</option>`
    + `<option value="__none__">${t('filter.unassigned')}</option>`
    + assignees.map(a=>`<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join(''));
  fillSelect('filter-sla', `<option value="">${t('filter.allSla')}</option>`
    + ['over','warn','ok','done'].map(s=>`<option value="${s}">${t('filter.sla.'+s)}</option>`).join(''));
  fillSelect('audit-event', `<option value="">${t('audit.allEvents')}</option>`
    + ['CASE_CREATED','ACKNOWLEDGED','ASSIGNED','STATUS_CHANGED','TRANSFERRED','COMMENT_ADDED','ATTACHMENT_ADDED','RESOLVED','CLOSED','REOPENED','CANCELLED','REMINDER_SENT','ESCALATED','ROOM_LINKED']
      .map(e=>`<option value="${e}">${e}</option>`).join(''));
}

function applyRole() {
  const u = STATE.ui.currentUser || 'Administrator';
  const elUser = document.getElementById('current-user');
  if (elUser) elUser.textContent = u;
  const elRole = document.getElementById('current-role');
  if (elRole) elRole.textContent = STATE.ui.role ? (DICT[STATE.ui.lang]?.['role.'+STATE.ui.role] || STATE.ui.role) : '';
  const elAvatar = document.getElementById('user-avatar');
  if (elAvatar) elAvatar.textContent = initials(u);
  const elRoleSel = document.getElementById('role-select');
  if (elRoleSel) elRoleSel.value = STATE.ui.role;
  const elTopbarBadge = document.getElementById('topbar-role-badge');
  if (elTopbarBadge) {
    elTopbarBadge.textContent = (STATE.ui.role || 'STAFF').toUpperCase();
    elTopbarBadge.className = 'badge badge-role ' + (STATE.ui.role === 'admin' ? 'badge-priority-emergency' : (STATE.ui.role === 'owner' ? 'badge-priority-urgent' : ''));
  }
  document.querySelectorAll('[data-perm="rooms"]').forEach(el => el.classList.toggle('hidden', !canSeeRooms()));
  document.querySelectorAll('[data-perm="dashboard"]').forEach(el => el.classList.toggle('hidden', !canSeeDashboard()));
  document.querySelectorAll('[data-perm="config"]').forEach(el => el.classList.toggle('hidden', !canSeeConfig()));
  document.querySelectorAll('[data-perm="audit"]').forEach(el => el.classList.toggle('hidden', !canSeeAudit()));
  document.querySelectorAll('[data-perm="users"]').forEach(el => el.classList.toggle('hidden', !canSeeUsers()));
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.dataset.nav === 'config') n.classList.toggle('hidden', !canSeeConfig());
    if (n.dataset.nav === 'audit') n.classList.toggle('hidden', !canSeeAudit());
    if (n.dataset.nav === 'users') n.classList.toggle('hidden', !canSeeUsers());
  });
}

function go(view) {
  if (view === 'rooms' && !canSeeRooms()) view = 'list';
  if (view === 'dashboard' && !canSeeDashboard()) view = 'list';
  if (view === 'config' && !canSeeConfig()) view = 'list';
  if (view === 'audit' && !canSeeAudit()) view = 'list';
  if (view === 'users' && !canSeeUsers()) view = 'list';
  STATE.ui.view = view;
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const targetView = document.getElementById('view-'+view);
  if (targetView) targetView.classList.remove('hidden');
  document.querySelectorAll('.nav-item, .tabbar button').forEach(n => n.classList.toggle('is-active', n.dataset.nav===view));
  document.getElementById('sidebar')?.classList.remove('is-open');
  document.getElementById('sidebar-backdrop')?.classList.remove('is-open');
  if (view==='list') renderList();
  if (view==='detail') renderDetail();
  if (view==='dashboard') renderDashboard();
  if (view==='rooms') renderRooms();
  if (view==='audit') renderAudit();
  if (view==='config') renderConfig();
  if (view==='users') renderUsers();
  window.scrollTo(0,0);
  saveState();
}

// -------- List --------
function slaBadge(c) {
  if (['CLOSED','CANCELLED'].includes(c.status)) return `<span class="sla sla-none">—</span>`;
  const diffMin = Math.round((c.due - now()) / 60000);
  if (diffMin < 0) {
    const remind = c.reminders>0 ? ` <span class="t-small text-muted">(${t('sla.reminded',{n:c.reminders})})</span>` : '';
    const escl = c.escalatedAt ? ' 🚨' : '';
    return `<span class="sla sla-over">-${Math.abs(diffMin)}m${escl}</span>${remind}`;
  }
  if (diffMin <= 10) return `<span class="sla sla-warn">${diffMin}m</span>`;
  return `<span class="sla sla-ok">${diffMin}m</span>`;
}
function statusBadge(status) {
  const cls = { NEW:'badge-status-new', ACKNOWLEDGED:'badge-status-ack', IN_PROGRESS:'badge-status-progress',
    TRANSFERRED:'badge-status-transferred', RESOLVED:'badge-status-resolved', CLOSED:'badge-status-closed',
    CANCELLED:'badge-status-cancelled', REOPENED:'badge-status-reopened' }[status];
  return `<span class="badge ${cls}">${status}</span>`;
}
function priorityBadge(p) {
  const cls = { EMERGENCY:'badge-priority-emergency', URGENT:'badge-priority-urgent', NORMAL:'badge-priority-normal' }[p];
  return `<span class="badge ${cls}">${p}</span>`;
}
// Minutes before DueAt at which a case flips from "ok" to "warn".
// Single source of truth — the list filter, the row cells and the detail ring all read it.
const SLA_WARN_MIN = 10;

// 'done' | 'over' | 'warn' | 'ok'
// Cases that are already RESOLVED/CLOSED/CANCELLED are 'done' — their clock stopped,
// so they must never appear under the overdue filter. Pass ignoreStatus for the detail
// ring, which still draws a ring for a finished case.
function slaStateOf(c, ignoreStatus) {
  if (!ignoreStatus && ['RESOLVED','CLOSED','CANCELLED'].includes(c.status)) return 'done';
  const remainingMin = Math.round((c.due - now())/60000);
  return remainingMin < 0 ? 'over' : (remainingMin <= SLA_WARN_MIN ? 'warn' : 'ok');
}

function activeFilters() {
  return {
    q: (document.getElementById('search-input')?.value||'').trim().toLowerCase(),
    status: document.getElementById('filter-status')?.value||'',
    priority: document.getElementById('filter-priority')?.value||'',
    dept: document.getElementById('filter-dept')?.value||'',
    category: document.getElementById('filter-category')?.value||'',
    assignee: document.getElementById('filter-assignee')?.value||'',
    sla: document.getElementById('filter-sla')?.value||'',
    dateFrom: document.getElementById('filter-date-from')?.value||'',
    dateTo: document.getElementById('filter-date-to')?.value||'',
  };
}
function filteredCases() {
  const f = activeFilters();
  let arr = STATE.cases.filter(c => !c.deleted);
  if (STATE.ui.role === 'staff') arr = arr.filter(c => c.reporter === STATE.ui.currentUser || c.assignee === STATE.ui.currentUser);
  if (STATE.ui.role === 'dept_head') {
    const u = STATE.users.find(x=>x.name===STATE.ui.currentUser);
    if (u) arr = arr.filter(c => c.dept === u.dept);
  }
  if (f.status) arr = arr.filter(c => c.status===f.status);
  if (f.priority) arr = arr.filter(c => c.priority===f.priority);
  if (f.dept) arr = arr.filter(c => c.dept===f.dept);
  if (f.category) arr = arr.filter(c => c.category===f.category);
  if (f.assignee) arr = arr.filter(c => f.assignee==='__none__' ? !c.assignee : c.assignee===f.assignee);
  if (f.sla) arr = arr.filter(c => slaStateOf(c) === f.sla);
  if (f.dateFrom) { const from = new Date(f.dateFrom).getTime(); arr = arr.filter(c => c.createdAt >= from); }
  if (f.dateTo) { const to = new Date(f.dateTo).getTime() + 86400000; arr = arr.filter(c => c.createdAt < to); }
  if (f.q) arr = arr.filter(c => (c.caseNo+' '+c.subject+' '+(c.room||'')+' '+(c.assignee||'')+' '+c.reporter).toLowerCase().includes(f.q));
  // Sort
  const s = STATE.ui.sort;
  arr.sort((a,b) => {
    const va = a[s.key], vb = b[s.key];
    if (va == null && vb == null) return 0;
    if (va == null) return 1; if (vb == null) return -1;
    if (va < vb) return s.dir==='asc' ? -1 : 1;
    if (va > vb) return s.dir==='asc' ? 1 : -1;
    return 0;
  });
  return arr;
}
function renderList() {
  if (STATE.ui.view!=='list') return;
  const arr = filteredCases();
  document.getElementById('list-count').textContent = arr.length;
  document.getElementById('nav-count-list').textContent = STATE.cases.filter(c => !c.deleted && !['CLOSED','CANCELLED'].includes(c.status)).length;
  // Chip row (active filters)
  const f = activeFilters();
  const chips = [];
  for (const [k,v] of Object.entries(f)) {
    if (!v) continue;
    const shown = k==='category' ? t(v) : (k==='sla' ? t('filter.sla.'+v) : v);
    chips.push(`<span class="chip" onclick="App.clearFilter('${k}')">${escapeHtml(k)}: ${escapeHtml(shown)} <span class="chip-x">×</span></span>`);
  }
  document.getElementById('chip-row').innerHTML = chips.join('');

  // Pagination
  const total = arr.length;
  const pp = STATE.ui.perPage;
  const totalPages = Math.max(1, Math.ceil(total / pp));
  if (STATE.ui.page > totalPages) STATE.ui.page = totalPages;
  const start = (STATE.ui.page-1) * pp;
  const pageArr = arr.slice(start, start+pp);
  document.getElementById('pagination-info').textContent = STATE.ui.lang==='th'
    ? `แสดง ${total?start+1:0}–${Math.min(start+pp,total)} จาก ${total}`
    : `Showing ${total?start+1:0}–${Math.min(start+pp,total)} of ${total}`;
  const pages = [];
  pages.push(`<button ${STATE.ui.page===1?'disabled':''} onclick="App.gotoPage(${STATE.ui.page-1})" aria-label="Previous">‹</button>`);
  for (let i=1; i<=totalPages; i++) {
    if (totalPages>7 && i!==1 && i!==totalPages && Math.abs(i-STATE.ui.page)>1) { if (i===2 || i===totalPages-1) pages.push('<button disabled>…</button>'); continue; }
    pages.push(`<button class="${i===STATE.ui.page?'is-active':''}" onclick="App.gotoPage(${i})">${i}</button>`);
  }
  pages.push(`<button ${STATE.ui.page===totalPages?'disabled':''} onclick="App.gotoPage(${STATE.ui.page+1})" aria-label="Next">›</button>`);
  document.getElementById('pages').innerHTML = pages.join('');

  // Sort indicators
  document.querySelectorAll('.sort-ind').forEach(el => el.textContent = '');
  const ind = document.querySelector(`.sort-ind[data-sort="${STATE.ui.sort.key}"]`);
  if (ind) ind.textContent = STATE.ui.sort.dir==='asc' ? '▴' : '▾';

  // Rows
  if (!pageArr.length) {
    document.getElementById('case-tbody').innerHTML = `<tr><td colspan="6"><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg><div>ไม่พบเคส</div></div></td></tr>`;
    return;
  }
  document.getElementById('case-tbody').innerHTML = pageArr.map(c => `
    <tr onclick="App.openCase('${c.caseUid}')" tabindex="0" onkeydown="if(event.key==='Enter')App.openCase('${c.caseUid}')" data-uid="${c.caseUid}">
      <td>
        <div class="case-no">${c.caseNo}</div>
        <div class="case-meta">${fmtTime(c.createdAt)}</div>
      </td>
      <td>
        <div class="case-subject">${escapeHtml(c.subject)}</div>
        <div class="case-meta">${c.room?('ห้อง '+c.room+' · '):''}${escapeHtml(t(c.category))}${c.assignee?' · '+escapeHtml(c.assignee):''}</div>
      </td>
      <td><span class="badge badge-dept">${c.dept}</span></td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${statusBadge(c.status)}</td>
      <td class="sla-cell" data-uid="${c.caseUid}">${slaBadge(c)}</td>
    </tr>`).join('');
}
function refreshSLACells() {
  document.querySelectorAll('.sla-cell').forEach(td => {
    const c = STATE.cases.find(x => x.caseUid === td.dataset.uid);
    if (c) td.innerHTML = slaBadge(c);
  });
}

// -------- Detail --------
function renderDetail() {
  const c = STATE.ui.selectedCase && STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase);
  if (!c) { go('list'); return; }
  document.getElementById('detail-no').textContent = c.caseNo;
  document.getElementById('detail-subject').textContent = c.subject;
  // quickmeta row
  document.getElementById('detail-quickmeta').innerHTML =
    `${statusBadge(c.status)} ${priorityBadge(c.priority)} <span class="badge badge-dept">${c.dept}</span>` +
    (c.room ? `<span class="badge badge-dept">Room ${c.room}</span>` : '') +
    (c.affects ? `<span class="badge badge-status-reopened">Affects room sale</span>` : '');

  // Info
  document.getElementById('detail-info').innerHTML = `
    <div class="info-row"><span class="info-label">${t('detail.reporter')}</span><span class="info-value">${escapeHtml(c.reporter)}</span></div>
    <div class="info-row"><span class="info-label">${t('detail.assignee')}</span><span class="info-value">${c.assignee?escapeHtml(c.assignee):'<span class="text-muted">'+t('detail.unassigned')+'</span>'}</span></div>
    <div class="info-row"><span class="info-label">${t('detail.category')}</span><span class="info-value">${t(c.category)}</span></div>
    <div class="info-row"><span class="info-label">${t('detail.location')}</span><span class="info-value">${escapeHtml(c.location)}${c.room?' · '+c.room:''}</span></div>
    <div class="info-row"><span class="info-label">${t('detail.created')}</span><span class="info-value">${fmtTime(c.createdAt)}</span></div>
  `;
  refreshDetailSLA();
  // Timeline
  const list = STATE.comments[c.caseUid] || [];
  document.getElementById('detail-timeline').innerHTML = list.map(m => renderMessage(m, c)).join('');
  const tl = document.getElementById('detail-timeline');
  tl.scrollTop = tl.scrollHeight;
  // Actions
  renderDetailActions(c);
}
function renderMessage(m, c) {
  if (m.type==='SYSTEM') {
    return `<div class="msg system"><div class="msg-body"><span class="t-small-bold">System:</span> ${escapeHtml(m.text)} · <span class="msg-time">${fmtTime(m.createdAt)}</span></div></div>`;
  }
  const mine = m.sender === STATE.ui.currentUser;
  const att = m.attachment ? `<div class="attachment-thumb">
      ${m.attachment.dataUrl?`<img src="${m.attachment.dataUrl}" alt="attachment">`:''}
      <div class="att-meta">
        <div class="att-name">${escapeHtml(m.attachment.name||'file')}</div>
        <div class="att-sub">${(m.attachment.size/1024).toFixed(0)} KB · ${escapeHtml(m.sender)}</div>
      </div>
    </div>` : '';
  return `<div class="msg ${mine?'mine':''}">
    <div class="msg-avatar" aria-hidden="true">${initials(m.sender)}</div>
    <div class="msg-body">
      <div class="msg-head">
        <span class="msg-sender">${escapeHtml(m.sender)}</span>
        ${m.dept?`<span class="badge badge-dept">${escapeHtml(m.dept)}</span>`:''}
        <span class="msg-time">${fmtTime(m.createdAt)}</span>
      </div>
      <div class="msg-text">${escapeHtml(m.text)}</div>
      ${att}
    </div>
  </div>`;
}
function refreshDetailSLA() {
  const c = STATE.ui.selectedCase && STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase);
  if (!c) return;
  const cur = now();
  const remainingMin = Math.round((c.due - cur)/60000);
  const totalMin = c.sla;
  const pct = Math.max(0, Math.min(1, (c.due - cur) / (totalMin*60000)));
  const state = slaStateOf(c, true);
  const bigLabel = remainingMin < 0 ? `-${Math.abs(remainingMin)}m` : `${remainingMin}m`;
  const circ = 2 * Math.PI * 26; // r=26
  const off = circ * (1 - pct);
  document.getElementById('detail-sla').innerHTML = `
    <div class="info-row"><span class="info-label">${t('detail.priority')}</span><span class="info-value">${priorityBadge(c.priority)}</span></div>
    <div class="info-row"><span class="info-label">SLA</span><span class="info-value">${c.sla} นาที</span></div>
    <div class="info-row"><span class="info-label">${t('detail.due')}</span><span class="info-value">${fmtTime(c.due)}</span></div>
    <div class="info-row"><span class="info-label">Reminders</span><span class="info-value">${c.reminders} / ${STATE.config.MAX_REMINDER}</span></div>
    <div class="sla-ring ${state}">
      <svg viewBox="0 0 60 60"><circle class="track" cx="30" cy="30" r="26"/><circle class="fill" cx="30" cy="30" r="26" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/></svg>
      <div class="label"><span class="big">${bigLabel}</span><span class="sub">${state==='over'?t('sla.overdue'):state==='warn'?t('sla.dueSoon'):t('sla.ontrack')}</span></div>
    </div>
    ${c.escalatedAt ? `<div class="mt-2 badge badge-status-reopened">ESCALATED · ${fmtTime(c.escalatedAt)}</div>` : ''}`;
}
function renderDetailActions(c) {
  if (!canAct(c)) { document.getElementById('detail-actions').innerHTML = ''; return; }
  const buttons = [];
  const push = (label, kind, handler) => buttons.push(`<button class="btn ${kind} btn-sm" onclick="${handler}">${escapeHtml(label)}</button>`);
  if (canTransition(c,'ACKNOWLEDGED') && isDeptOrAbove()) push(t('action.acknowledge'),'btn-primary','App.actAcknowledge()');
  if (['NEW','ACKNOWLEDGED','IN_PROGRESS'].includes(c.status) && isDeptOrAbove()) push(t('action.assign'),'btn-secondary','App.actAssign()');
  if (['NEW','ACKNOWLEDGED','IN_PROGRESS'].includes(c.status) && isDeptOrAbove()) push(t('action.transfer'),'btn-outlined','App.actTransfer()');
  if (['ACKNOWLEDGED','IN_PROGRESS'].includes(c.status) && isDeptOrAbove()) push(t('action.resolve'),'btn-primary','App.actResolve()');
  if (c.status==='RESOLVED') push(t('action.close'),'btn-primary','App.actClose()');
  if (c.status==='CLOSED') push(t('action.reopen'),'btn-outlined','App.actReopen()');
  if (['NEW','ACKNOWLEDGED'].includes(c.status)) push(t('action.cancel'),'btn-outlined','App.actCancel()');
  document.getElementById('detail-actions').innerHTML = buttons.join('');
}

// -------- Dashboard --------
function renderDashboard() {
  const cases = STATE.cases.filter(c => !c.deleted);
  const byStatus = k => cases.filter(c => c.status===k).length;
  const overdue = cases.filter(c => !['CLOSED','CANCELLED','RESOLVED'].includes(c.status) && c.due < now()).length;
  const kpis = [
    {label:t('kpi.total'), value:cases.length, cls:'', filter:{}},
    {label:t('kpi.new'), value:byStatus('NEW'), cls:'accent', filter:{status:'NEW'}},
    {label:t('kpi.progress'), value:byStatus('IN_PROGRESS')+byStatus('ACKNOWLEDGED'), cls:'', filter:{status:'IN_PROGRESS'}},
    {label:t('kpi.overdue'), value:overdue, cls:'danger', filter:{sla:'over'}},
    {label:t('kpi.resolved'), value:byStatus('RESOLVED'), cls:'ok', filter:{status:'RESOLVED'}},
    {label:t('kpi.closed'), value:byStatus('CLOSED'), cls:'', filter:{status:'CLOSED'}},
  ];
  document.getElementById('kpi-grid').innerHTML = kpis.map((k,i) => `
    <div class="kpi ${k.cls}" onclick='App.drillFrom(${JSON.stringify(k.filter)})' role="button" tabindex="0" onkeydown="if(event.key==='Enter')App.drillFrom(${JSON.stringify(k.filter).replace(/'/g,"&apos;")})">
      <span class="kpi-label">${k.label}</span>
      <span class="kpi-value" data-count="${k.value}">${k.value}</span>
    </div>`).join('');

  // Dept bars
  const depts = ['IT','HK','ENG','FRONT','SECURITY'];
  const counts = depts.map(d => ({d, n: cases.filter(c=>c.dept===d).length}));
  const max = Math.max(1, ...counts.map(x=>x.n));
  document.getElementById('chart-dept').innerHTML = counts.map(x => `
    <div class="bar-row" onclick='App.drillFrom({"dept":"${x.d}"})' role="button" tabindex="0">
      <span class="bar-label">${x.d}</span>
      <div class="bar-track"><div class="bar-fill" style="width:0"></div></div>
      <span class="bar-count">${x.n}</span>
    </div>`).join('');
  // Animate bars
  requestAnimationFrame(() => {
    document.querySelectorAll('#chart-dept .bar-fill').forEach((el,i) => { el.style.width = (counts[i].n/max*100)+'%'; });
  });

  // Donut chart — status
  const statusList = ['NEW','ACKNOWLEDGED','IN_PROGRESS','RESOLVED','CLOSED','CANCELLED'];
  const palette = ['#1E6091','#5064BA','#8A4A00','#046A38','#8A8A8A','#B3251F'];
  const slices = statusList.map((s,i)=>({label:s, value:byStatus(s), color:palette[i]}));
  document.getElementById('chart-status').innerHTML = renderDonut(slices);

  // Trend line
  const buckets = trendBuckets(cases, 7);
  document.getElementById('chart-trend').innerHTML = renderTrend(buckets.labels, buckets.newSeries, buckets.closedSeries);

  // Top category
  const catCount = {};
  cases.forEach(c => { catCount[c.category] = (catCount[c.category]||0)+1; });
  const topCats = Object.entries(catCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topMax = Math.max(1, ...topCats.map(([,v])=>v));
  document.getElementById('chart-topcat').innerHTML = topCats.map(([k,v]) => `
    <div class="bar-row" onclick='App.drillFrom({"category":"${k}"})' role="button" tabindex="0">
      <span class="bar-label" style="flex:0 0 160px;">${escapeHtml(t(k))}</span>
      <div class="bar-track"><div class="bar-fill" style="width:0"></div></div>
      <span class="bar-count">${v}</span>
    </div>`).join('');
  requestAnimationFrame(() => {
    document.querySelectorAll('#chart-topcat .bar-fill').forEach((el,i) => { el.style.width = (topCats[i][1]/topMax*100)+'%'; });
  });
}
function trendBuckets(cases, days) {
  const labels = [], newSeries = [], closedSeries = [];
  const daySize = 86400000;
  const today0 = new Date(now()); today0.setHours(0,0,0,0);
  const th = ['อา','จ','อ','พ','พฤ','ศ','ส'];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date(today0.getTime() - i*daySize);
    labels.push(STATE.ui.lang==='th' ? th[d.getDay()]+' '+d.getDate() : (d.getMonth()+1)+'/'+d.getDate());
    const from = d.getTime(); const to = from + daySize;
    newSeries.push(cases.filter(c => c.createdAt >= from && c.createdAt < to).length);
    closedSeries.push(cases.filter(c => c.closedAt && c.closedAt >= from && c.closedAt < to).length);
  }
  return { labels, newSeries, closedSeries };
}
function renderTrend(labels, s1, s2) {
  const W=520, H=200, P=28;
  const max = Math.max(1, ...s1, ...s2);
  const step = (W - P*2) / Math.max(1, labels.length-1);
  const y = v => H - P - (v/max) * (H - P*2);
  const path = arr => arr.map((v,i) => `${i===0?'M':'L'} ${P + i*step} ${y(v)}`).join(' ');
  const dots = (arr, color) => arr.map((v,i) => `<circle cx="${P+i*step}" cy="${y(v)}" r="4" fill="${color}"/>`).join('');
  const ticks = labels.map((lb,i) => `<text x="${P+i*step}" y="${H-6}" text-anchor="middle" font-size="10" fill="#595959">${lb}</text>`).join('');
  const grid = [0, .25, .5, .75, 1].map(f => `<line x1="${P}" x2="${W-P}" y1="${P + f*(H-P*2)}" y2="${P + f*(H-P*2)}" stroke="#DDE1F4" stroke-dasharray="2 3"/>`).join('');
  return `<div class="chart-legend"><span><span class="dot" style="background:#162D9E"></span>New</span><span><span class="dot" style="background:#046A38"></span>Closed</span></div>
  <svg class="trend" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-width:${W}px;overflow:visible;" role="img" aria-label="7-day trend">
    ${grid}
    <path d="${path(s1)}" stroke="#162D9E" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${path(s2)}" stroke="#046A38" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    ${dots(s1, '#162D9E')} ${dots(s2, '#046A38')} ${ticks}
  </svg>`;
}
function renderDonut(slices) {
  const total = slices.reduce((a,b)=>a+b.value, 0) || 1;
  const R = 60, C = 2 * Math.PI * R;
  let acc = 0;
  const segs = slices.map(s => {
    const frac = s.value/total;
    const len = C * frac;
    const dash = `${len} ${C-len}`;
    const rot = (acc/total)*360;
    acc += s.value;
    return `<circle cx="80" cy="80" r="${R}" fill="none" stroke="${s.color}" stroke-width="18" stroke-dasharray="${dash}" transform="rotate(${rot-90} 80 80)" style="transition: stroke-dasharray var(--dur-slow) var(--ease-out)"><title>${s.label}: ${s.value}</title></circle>`;
  }).join('');
  const legend = slices.map(s => `<div class="li" onclick='App.drillFrom({"status":"${s.label}"})' tabindex="0"><span class="donut-dot" style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${s.color};margin-right:6px;"></span>${s.label} <span class="text-muted">${s.value}</span></div>`).join('');
  return `<div style="position:relative; width:160px; margin: 8px auto;">
    <svg viewBox="0 0 160 160" width="160" height="160">
      <circle cx="80" cy="80" r="${R}" fill="none" stroke="#EEF0FA" stroke-width="18"/>
      ${segs}
    </svg>
    <div class="donut-center"><div class="donut-total">${total}</div><div class="donut-label">cases</div></div>
    </div><div class="donut-legend">${legend}</div>`;
}
function drillFrom(filter) {
  go('list');
  ['filter-status','filter-priority','filter-dept','filter-category','filter-assignee','filter-sla','filter-date-from','filter-date-to'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('search-input').value = '';
  if (filter.status && document.getElementById('filter-status')) document.getElementById('filter-status').value = filter.status;
  if (filter.dept && document.getElementById('filter-dept')) document.getElementById('filter-dept').value = filter.dept;
  if (filter.category && document.getElementById('filter-category')) document.getElementById('filter-category').value = filter.category;
  if (filter.priority && document.getElementById('filter-priority')) document.getElementById('filter-priority').value = filter.priority;
  if (filter.sla && document.getElementById('filter-sla')) document.getElementById('filter-sla').value = filter.sla;
  STATE.ui.page = 1;
  renderList();
}

// -------- Rooms --------
function renderRooms() {
  const total = STATE.rooms.length;
  const closed = STATE.rooms.filter(r => r.status==='CLOSED').length;
  const avail = total - closed;
  document.getElementById('room-total').textContent = total;
  document.getElementById('room-avail').textContent = avail;
  document.getElementById('room-closed').textContent = closed;
  document.getElementById('room-pct').textContent = Math.round((avail/total)*100)+'%';
  document.getElementById('room-grid').innerHTML = STATE.rooms.map(r => `
    <button class="room ${r.status.toLowerCase()} ${STATE.ui.selectedRoom===r.roomNo?'is-selected':''}"
            onclick="App.selectRoom('${r.roomNo}')"
            aria-label="Room ${r.roomNo} ${r.status}">
      <span class="room-no">${r.roomNo}</span>
      <span class="room-tag">${r.status==='AVAILABLE'?'OK':'CLOSED'}</span>
    </button>`).join('');
  renderRoomHistory();
}
function renderRoomHistory() {
  const el = document.getElementById('room-history');
  document.getElementById('room-history-no').textContent = STATE.ui.selectedRoom ? '#'+STATE.ui.selectedRoom : '—';
  const btn = document.getElementById('room-change-btn');
  if (btn) btn.classList.toggle('hidden', !STATE.ui.selectedRoom);
  if (!STATE.ui.selectedRoom) {
    el.innerHTML = `<div class="text-muted t-caption">${t('rooms.selectRoom')}</div>`;
    document.getElementById('room-status-info').innerHTML = '';
    return;
  }
  const r = STATE.rooms.find(x=>x.roomNo===STATE.ui.selectedRoom);
  document.getElementById('room-status-info').innerHTML = r.status==='CLOSED'
    ? `<span class="badge badge-status-cancelled">CLOSED</span> <span class="t-caption">${escapeHtml(r.reason||'-')}</span>` +
      (r.openCases.length ? `<div class="text-muted t-small mt-2">Open cases: ${r.openCases.length}</div>` : '')
    : `<span class="badge badge-status-resolved">AVAILABLE</span>`;
  const log = STATE.roomLogs[STATE.ui.selectedRoom] || [];
  el.innerHTML = log.length ? log.map(l => `
    <div class="history-item ${l.action==='CLOSE_ROOM'?'close-room':'open-room'}">
      <div class="icon">${l.action==='CLOSE_ROOM'?'🔒':'🔓'}</div>
      <div style="flex:1;">
        <div class="t-caption-bold">${l.action} — ${escapeHtml(l.reason||'-')}</div>
        <div class="text-muted t-small">${escapeHtml(l.actor)}${l.caseUid?' · ':''}${l.caseUid ? (STATE.cases.find(x=>x.caseUid===l.caseUid)?.caseNo || '') : ''}</div>
        <div class="history-when">${fmtTime(l.when)}</div>
      </div>
    </div>`).join('') : `<div class="text-muted t-caption">ยังไม่มีประวัติ</div>`;
}
function selectRoom(no) { STATE.ui.selectedRoom = no; renderRooms(); saveState(); }

// -------- Audit --------
function renderAudit() {
  const q = (document.getElementById('audit-search')?.value||'').toLowerCase();
  const ev = document.getElementById('audit-event')?.value||'';
  const dateF = document.getElementById('audit-date')?.value||'';
  let arr = STATE.logs.slice().sort((a,b) => b.at - a.at);
  if (ev) arr = arr.filter(x => x.event === ev);
  if (dateF) { const from = new Date(dateF).getTime(); const to = from + 86400000; arr = arr.filter(x => x.at >= from && x.at < to); }
  if (q) arr = arr.filter(x => {
    const c = STATE.cases.find(cc=>cc.caseUid===x.caseUid);
    return ((c?.caseNo||'')+' '+x.event+' '+(x.actor||'')+' '+JSON.stringify(x.meta||{})).toLowerCase().includes(q);
  });
  document.getElementById('audit-count').textContent = arr.length;
  document.getElementById('audit-tbody').innerHTML = arr.slice(0, 200).map(x => {
    const c = STATE.cases.find(cc=>cc.caseUid===x.caseUid);
    return `<tr>
      <td class="t-mono t-small">${fmtTime(x.at)}</td>
      <td><span class="badge badge-dept">${x.event}</span></td>
      <td>${c?`<a href="#" onclick="App.openCase('${c.caseUid}');return false;">${c.caseNo}</a>`:'—'}</td>
      <td>${escapeHtml(x.actor)}</td>
      <td class="t-small text-muted">${escapeHtml(JSON.stringify(x.meta||{}))}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="5"><div class="empty-state">No entries</div></td></tr>`;
}

// -------- Config --------
function renderConfig() {
  document.getElementById('c-sla-emerg').value = STATE.config.SLA_EMERGENCY;
  document.getElementById('c-sla-urgent').value = STATE.config.SLA_URGENT;
  document.getElementById('c-sla-normal').value = STATE.config.SLA_NORMAL;
  document.getElementById('c-maxrem').value = STATE.config.MAX_REMINDER;
  document.getElementById('c-reminterval').value = STATE.config.REMINDER_INTERVAL;
  document.getElementById('c-autoclose').checked = !!STATE.config.AUTO_ROOM_CLOSE;
  document.getElementById('c-lang').value = STATE.config.DEFAULT_LANGUAGE;
  const container = document.getElementById('config-categories');
  container.innerHTML = Object.entries(STATE.config.CATEGORIES).map(([dept, keys]) => `
    <div class="mb-4">
      <div class="t-caption-bold mb-2">${dept}</div>
      <div class="chip-row" id="cats-${dept}">${keys.map(k=>`<span class="chip">${escapeHtml(t(k))} <span class="chip-x" onclick="App.removeCategory('${dept}','${k}')">×</span></span>`).join('')}</div>
      <div class="row gap-2">
        <input class="form-input" id="new-cat-${dept}" placeholder="cat.${dept}.new-slug" style="flex:1;">
        <button class="btn btn-secondary btn-sm" onclick="App.addCategory('${dept}')">${t('config.addCat')}</button>
      </div>
    </div>`).join('');
}
function saveConfig() {
  STATE.config.SLA_EMERGENCY = parseInt(document.getElementById('c-sla-emerg').value,10) || 20;
  STATE.config.SLA_URGENT = parseInt(document.getElementById('c-sla-urgent').value,10) || 40;
  STATE.config.SLA_NORMAL = parseInt(document.getElementById('c-sla-normal').value,10) || 60;
  STATE.config.MAX_REMINDER = parseInt(document.getElementById('c-maxrem').value,10) || 2;
  STATE.config.REMINDER_INTERVAL = parseInt(document.getElementById('c-reminterval').value,10) || 10;
  STATE.config.AUTO_ROOM_CLOSE = document.getElementById('c-autoclose').checked;
  STATE.config.DEFAULT_LANGUAGE = document.getElementById('c-lang').value;
  saveState();
  Toast.push('ok', t('toast.configSaved'), '');
}

// -------- Notifications --------
function renderNotifCount() {
  const unread = STATE.notifications.filter(n=>!n.read).length;
  const el = document.getElementById('notif-count');
  if (unread > 0) { el.textContent = unread > 99 ? '99+' : String(unread); el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}
function renderNotifPanel() {
  const list = document.getElementById('notif-list');
  if (!STATE.notifications.length) { list.innerHTML = `<div class="empty-state">${t('notif.empty')}</div>`; return; }
  list.innerHTML = STATE.notifications.slice(0,30).map(n => `
    <div class="notif-item ${n.read?'':'unread'}" onclick="App.openNotif('${n.id}')">
      <div class="t-caption-bold">${escapeHtml(n.title)}</div>
      <div class="text-secondary t-small">${escapeHtml(n.msg||'')}</div>
      <div class="notif-time">${fmtTime(n.at)}</div>
    </div>`).join('');
}

// -------- Users Management --------
async function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  try {
    const res = await fetch('/api/users').then(r => r.json());
    if (res.success && Array.isArray(res.users)) {
      STATE.users = res.users;
    }
  } catch (e) {
    console.warn('Failed to fetch users from server', e);
  }

  const countEl = document.getElementById('users-count');
  if (countEl) countEl.textContent = STATE.users.length;
  const navCountEl = document.getElementById('nav-count-users');
  if (navCountEl) navCountEl.textContent = STATE.users.length;

  if (STATE.users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">ไม่พบรายชื่อผู้ใช้งาน</div></td></tr>`;
    return;
  }

  tbody.innerHTML = STATE.users.map(u => {
    const roleBadge = {
      admin: '<span class="badge badge-priority-emergency">ADMIN</span>',
      owner: '<span class="badge" style="background:#EBF8FF; color:#2B6CB0;">OWNER</span>',
      dept_head: '<span class="badge" style="background:#FEF3C7; color:#B45309;">DEPT HEAD</span>',
      staff: '<span class="badge" style="background:#F1F5F9; color:#475569;">STAFF</span>'
    }[u.role] || `<span class="badge">${escapeHtml(u.role)}</span>`;

    const statusBadge = u.is_active
      ? '<span class="badge badge-status-resolved">ใช้งานปกติ</span>'
      : '<span class="badge badge-status-cancelled">ระงับการใช้งาน</span>';

    const deptName = u.department_name || u.department_code || (u.dept || '—');
    const uId = u.id;

    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-base);">${escapeHtml(u.full_name || u.name)}</div>
          ${u.nickname ? `<div class="t-small text-muted">(${escapeHtml(u.nickname)})</div>` : ''}
        </td>
        <td>
          <div>${escapeHtml(u.username || '—')}</div>
          <div class="t-small text-muted">${escapeHtml(u.email || '—')}</div>
        </td>
        <td><span class="badge badge-dept">${escapeHtml(deptName)}</span></td>
        <td>${roleBadge}</td>
        <td><span class="t-small">${escapeHtml(u.phone || '—')}</span></td>
        <td>${statusBadge}</td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="btn btn-sm btn-ghost" onclick="App.openEditUserModal(${uId})" title="แก้ไข">
            ✏️ แก้ไข
          </button>
          ${uId !== 1 ? `
            <button class="btn btn-sm btn-ghost" style="color:var(--status-emergency);" onclick="App.deleteUser(${uId}, '${escapeHtml(u.full_name || u.name)}')" title="ระงับ">
              🚫 ระงับ
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================
// Public API (App.*)
// ============================================================
const App = {
  // Auth
  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const oldText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>กำลังเข้าสู่ระบบ...</span>';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).then(r => r.json());

      if (res.success && res.user) {
        const u = res.user;
        STATE.ui.currentUser = u.full_name || u.username;
        STATE.ui.role = u.role;
        STATE.ui.dept = u.department_code;
        localStorage.setItem('hotel_user', JSON.stringify(u));

        document.getElementById('screen-login').classList.add('hidden');
        document.getElementById('screen-app').classList.remove('hidden');

        applyI18n();
        applyRole();
        await syncFromDatabase();
        go('list');
        renderNotifCount();
        renderNotifPanel();
        saveState();

        Toast.push('ok', 'เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${u.full_name} (${u.role.toUpperCase()})`);
      } else {
        Toast.push('err', 'เข้าสู่ระบบไม่สำเร็จ', res.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      console.error('Login error:', err);
      Toast.push('err', 'เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = oldText;
      }
    }
  },

  logout() {
    localStorage.removeItem('hotel_user');
    STATE.ui.currentUser = '';
    STATE.ui.role = 'staff';
    document.getElementById('screen-app').classList.add('hidden');
    document.getElementById('screen-login').classList.remove('hidden');
    const unameInput = document.getElementById('login-username');
    if (unameInput) unameInput.value = '';
    const pwdInput = document.getElementById('login-password');
    if (pwdInput) pwdInput.value = '';
    Toast.push('info', 'ออกจากระบบ', 'ออกจากระบบเรียบร้อยแล้ว');
  },

  // Users Management
  renderUsers,
  openCreateUserModal() {
    const modal = document.getElementById('modal-user');
    const form = document.getElementById('form-user');
    if (!modal || !form) return;
    form.reset();
    document.getElementById('user-form-id').value = '';
    document.getElementById('modal-user-title').textContent = 'เพิ่มผู้ใช้งานใหม่';
    const pwdInput = document.getElementById('u-password');
    pwdInput.required = true;
    document.getElementById('u-password-hint').classList.add('hidden');
    document.getElementById('u-username').readOnly = false;
    modal.classList.add('is-open');
  },
  openEditUserModal(id) {
    const u = STATE.users.find(x => x.id === id);
    if (!u) return;
    const modal = document.getElementById('modal-user');
    if (!modal) return;
    document.getElementById('user-form-id').value = u.id;
    document.getElementById('modal-user-title').textContent = `แก้ไขข้อมูล: ${u.full_name || u.name}`;
    document.getElementById('u-fullname').value = u.full_name || u.name || '';
    document.getElementById('u-nickname').value = u.nickname || '';
    const uname = document.getElementById('u-username');
    uname.value = u.username || '';
    uname.readOnly = true;
    document.getElementById('u-email').value = u.email || '';
    document.getElementById('u-dept').value = u.department_id || (u.dept === 'IT'?1: u.dept==='HK'?2: u.dept==='ENG'?3: u.dept==='FRONT'?4: 5);
    document.getElementById('u-role').value = u.role || 'staff';
    document.getElementById('u-phone').value = u.phone || '';
    document.getElementById('u-active').value = u.is_active !== undefined ? String(u.is_active) : '1';
    const pwd = document.getElementById('u-password');
    pwd.value = '';
    pwd.required = false;
    document.getElementById('u-password-hint').classList.remove('hidden');
    modal.classList.add('is-open');
  },
  closeUserModal() {
    const modal = document.getElementById('modal-user');
    if (modal) modal.classList.remove('is-open');
  },
  async saveUser(e) {
    e.preventDefault();
    const id = document.getElementById('user-form-id').value;
    const payload = {
      full_name: document.getElementById('u-fullname').value.trim(),
      nickname: document.getElementById('u-nickname').value.trim(),
      username: document.getElementById('u-username').value.trim(),
      email: document.getElementById('u-email').value.trim(),
      department_id: parseInt(document.getElementById('u-dept').value, 10),
      role: document.getElementById('u-role').value,
      phone: document.getElementById('u-phone').value.trim(),
      is_active: parseInt(document.getElementById('u-active').value, 10),
    };
    const pwd = document.getElementById('u-password').value;
    if (pwd) payload.password = pwd;

    try {
      let res;
      if (id) {
        res = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());
      } else {
        payload.password = pwd;
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());
      }

      if (res.success) {
        Toast.push('ok', 'สำเร็จ', res.message || 'บันทึกข้อมูลเรียบร้อยแล้ว');
        App.closeUserModal();
        await renderUsers();
        await syncFromDatabase();
      } else {
        Toast.push('err', 'เกิดข้อผิดพลาด', res.message || 'ไม่สามารถบันทึกได้');
      }
    } catch (err) {
      Toast.push('err', 'การเชื่อมต่อผิดพลาด', err.message);
    }
  },
  async deleteUser(id, name) {
    if (!confirm(`คุณต้องการระงับการใช้งานบัญชี "${name}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' }).then(r => r.json());
      if (res.success) {
        Toast.push('ok', 'ระงับบัญชีเรียบร้อย', res.message || name);
        await renderUsers();
        await syncFromDatabase();
      } else {
        Toast.push('err', 'ไม่สามารถทำรายการได้', res.message);
      }
    } catch(err) {
      Toast.push('err', 'เกิดข้อผิดพลาด', err.message);
    }
  },
  toggleLang() { STATE.ui.lang = STATE.ui.lang==='th'?'en':'th'; applyI18n(); go(STATE.ui.view); renderNotifPanel(); saveState(); },
  toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sidebar-backdrop');
    const isOpen = sb.classList.toggle('is-open');
    if (bd) bd.classList.toggle('is-open', isOpen);
  },
  toggleNotifs() {
    const p = document.getElementById('notif-panel');
    p.classList.toggle('is-open');
    STATE.ui.notifPanelOpen = p.classList.contains('is-open');
    if (STATE.ui.notifPanelOpen) renderNotifPanel();
  },
  markAllRead() { STATE.notifications.forEach(n=>n.read=true); renderNotifCount(); renderNotifPanel(); saveState(); },
  openNotif(id) { const n = STATE.notifications.find(x=>x.id===id); if (!n) return; n.read = true; if (n.caseUid) { STATE.ui.selectedCase = n.caseUid; document.getElementById('notif-panel').classList.remove('is-open'); go('detail'); } renderNotifCount(); renderNotifPanel(); saveState(); },
  go, openCase(uid){ STATE.ui.selectedCase = uid; const c = STATE.cases.find(x=>x.caseUid===uid); if(c) c.hasUnread=false; go('detail'); },
  sortBy(k) {
    if (STATE.ui.sort.key === k) STATE.ui.sort.dir = STATE.ui.sort.dir==='asc'?'desc':'asc';
    else STATE.ui.sort = { key:k, dir:'asc' };
    renderList(); saveState();
  },
  gotoPage(p) { STATE.ui.page = p; renderList(); saveState(); window.scrollTo(0,0); },
  renderList, renderAudit,
  clearFilter(k) {
    const map = {status:'filter-status',priority:'filter-priority',dept:'filter-dept',category:'filter-category',assignee:'filter-assignee',sla:'filter-sla',dateFrom:'filter-date-from',dateTo:'filter-date-to',q:'search-input'};
    const el = document.getElementById(map[k]); if (el) el.value = '';
    renderList();
  },

  refreshCategories() {
    const dept = document.getElementById('f-dept').value;
    const sel = document.getElementById('f-cat');
    const cats = STATE.config.CATEGORIES[dept] || [];
    sel.innerHTML = cats.length ? cats.map(k => `<option value="${k}">${escapeHtml(t(k))}</option>`).join('') : `<option value="">${t('create.selectDeptFirst')}</option>`;
    sel.disabled = cats.length===0;
  },

  submitCase(e) {
    e.preventDefault();
    const form = e.target;
    const fields = ['f-loc','f-dept','f-cat','f-subj','f-desc'];
    let ok = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      const err = document.querySelector(`[data-error-for="${id}"]`);
      if (!el.value.trim()) { el.classList.add('is-error'); if (err){err.textContent=t('err.required');err.classList.remove('hidden');} ok = false; }
      else { el.classList.remove('is-error'); if (err) err.classList.add('hidden'); }
    });
    if (!ok) return;
    const fileEl = document.getElementById('f-file');
    const submit = async (attachment) => {
      const data = {
        location: document.getElementById('f-loc').value,
        room: document.getElementById('f-room').value.trim(),
        dept: document.getElementById('f-dept').value,
        category: document.getElementById('f-cat').value,
        subject: document.getElementById('f-subj').value.trim(),
        description: document.getElementById('f-desc').value.trim(),
        priority: document.getElementById('f-pri').value,
        affects: document.getElementById('f-affects').checked,
        attachment,
        reporter_name: STATE.ui.currentUser,
      };
      try {
        const res = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(r => r.json());
        if (res.success) {
          await syncFromDatabase();
          form.reset();
          document.getElementById('f-cat').disabled = true;
          STATE.ui.selectedCase = res.caseUid;
          go('detail');
          Toast.push('ok', t('toast.caseCreated', {no: res.caseNo}), data.subject);
          return;
        }
      } catch (err) {
        console.warn('API submit failed, fallback to client state', err);
      }
      const c = createCase(data);
      form.reset(); document.getElementById('f-cat').disabled = true;
      STATE.ui.selectedCase = c.caseUid; go('detail');
    };
    if (fileEl.files[0]) {
      const f = fileEl.files[0];
      const reader = new FileReader();
      reader.onload = () => submit({ name:f.name, size:f.size, type:f.type, dataUrl: reader.result });
      reader.readAsDataURL(f);
    } else submit(null);
  },

  sendReply() {
    const input = document.getElementById('reply-input');
    const text = input.value.trim();
    if (!text && !STATE.ui.pendingAttach) return;
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    const cur = now();
    const list = STATE.comments[c.caseUid] || (STATE.comments[c.caseUid]=[]);
    const msg = { id:'c'+c.caseUid+'_'+Math.random().toString(36).slice(2,7),
      caseUid:c.caseUid, sender:STATE.ui.currentUser, dept:'', text: text||'(ไฟล์แนบ)', type:'USER', createdAt:cur,
      attachment: STATE.ui.pendingAttach };
    list.push(msg);
    c.lastCommentAt = cur; c.hasUnread = true; c.updatedAt = cur;
    log(c.caseUid, 'COMMENT_ADDED', STATE.ui.currentUser, { textLen: text.length, hasAttach: !!STATE.ui.pendingAttach });
    if (STATE.ui.pendingAttach) log(c.caseUid,'ATTACHMENT_ADDED',STATE.ui.currentUser,{name:STATE.ui.pendingAttach.name});
    STATE.ui.pendingAttach = null;
    document.getElementById('pending-attach').textContent = '';
    input.value = '';
    saveState();
    renderDetail();
  },
  attachToReply(f) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      STATE.ui.pendingAttach = { name:f.name, size:f.size, type:f.type, dataUrl:reader.result };
      document.getElementById('pending-attach').textContent = `📎 ${f.name} (${(f.size/1024).toFixed(0)} KB) — will send with next message`;
    };
    reader.readAsDataURL(f);
  },

  // Case actions
  actAcknowledge() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    if (!canAct(c) || !canTransition(c,'ACKNOWLEDGED')) return;
    transitionCase(c, 'ACKNOWLEDGED', STATE.ui.currentUser);
    if (!c.assignee) c.assignee = STATE.ui.currentUser;
    Toast.push('ok', t('toast.actionDone',{action:t('action.acknowledge')}), c.caseNo);
    renderDetail(); renderList();
  },
  actAssign() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    const staffs = STATE.users.filter(u => u.dept === c.dept);
    openModal({
      title: t('assign.title'),
      body: `<div class="form-field"><label class="form-label">${t('assign.who')}</label>
        <select class="form-select" id="m-assign">${staffs.map(s=>`<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} — ${s.role}</option>`).join('')}</select></div>`,
      onSubmit: () => {
        const who = document.getElementById('m-assign').value;
        c.assignee = who;
        if (c.status==='NEW') transitionCase(c,'ACKNOWLEDGED', STATE.ui.currentUser);
        else transitionCase(c, 'IN_PROGRESS', STATE.ui.currentUser);
        pushSystemMsg(c, t('sys.assigned',{who}));
        log(c.caseUid,'ASSIGNED', STATE.ui.currentUser, {to:who});
        Toast.push('ok', t('toast.actionDone',{action:t('action.assign')}), who);
        closeModal(); renderDetail(); renderList();
      }
    });
  },
  actTransfer() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    const depts = ['IT','HK','ENG','FRONT','SECURITY'].filter(d => d !== c.dept);
    openModal({
      title: t('transfer.title'),
      body: `<div class="form-field"><label class="form-label">${t('transfer.dept')}</label>
        <select class="form-select" id="m-dept">${depts.map(d=>`<option>${d}</option>`).join('')}</select></div>
      <div class="form-field"><label class="form-label">${t('transfer.reason')}</label>
        <textarea class="form-textarea" id="m-reason" placeholder="${t('transfer.reasonPh')}" required></textarea></div>`,
      onSubmit: () => {
        const to = document.getElementById('m-dept').value;
        const reason = document.getElementById('m-reason').value.trim() || '-';
        const from = c.dept;
        c.deptFrom = from; c.dept = to; c.assignee = null;
        pushSystemMsg(c, t('sys.transferred',{from, to, reason}));
        log(c.caseUid,'TRANSFERRED', STATE.ui.currentUser, {from, to, reason});
        transitionCase(c, 'NEW', STATE.ui.currentUser, {reason});
        Toast.push('info', t('toast.actionDone',{action:t('action.transfer')}), `${from} → ${to}`);
        closeModal(); renderDetail(); renderList();
      }
    });
  },
  actResolve() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    openModal({
      title: t('resolve.title'),
      body: `<div class="form-field"><label class="form-label">${t('resolve.note')}</label>
        <textarea class="form-textarea" id="m-note" required></textarea></div>`,
      onSubmit: () => {
        const note = document.getElementById('m-note').value.trim() || '-';
        transitionCase(c, 'RESOLVED', STATE.ui.currentUser, {note});
        Toast.push('ok', t('toast.actionDone',{action:t('action.resolve')}), c.caseNo);
        closeModal(); renderDetail(); renderList();
      }
    });
  },
  actClose() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    openModal({
      title: t('close.title'),
      body: `<div class="form-field"><label class="form-label">${t('close.note')}</label>
        <textarea class="form-textarea" id="m-note"></textarea></div>`,
      onSubmit: () => {
        const note = document.getElementById('m-note').value.trim() || '-';
        transitionCase(c, 'CLOSED', STATE.ui.currentUser, {note});
        Toast.push('ok', t('toast.actionDone',{action:t('action.close')}), c.caseNo);
        closeModal(); renderDetail(); renderList();
      }
    });
  },
  actReopen() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    openModal({
      title: t('reopen.title'),
      body: `<div class="form-field"><label class="form-label">${t('reopen.reason')}</label>
        <textarea class="form-textarea" id="m-reason" required></textarea></div>`,
      onSubmit: () => {
        const reason = document.getElementById('m-reason').value.trim() || '-';
        transitionCase(c, 'REOPENED', STATE.ui.currentUser, {reason});
        Toast.push('warn', t('toast.actionDone',{action:t('action.reopen')}), c.caseNo);
        closeModal(); renderDetail(); renderList();
      }
    });
  },
  actCancel() {
    const c = STATE.cases.find(x=>x.caseUid===STATE.ui.selectedCase); if (!c) return;
    openModal({
      title: t('cancel.title'), danger:true,
      body: `<div class="form-field"><label class="form-label">${t('cancel.reason')}</label>
        <textarea class="form-textarea" id="m-reason" required></textarea></div>`,
      onSubmit: () => {
        const reason = document.getElementById('m-reason').value.trim() || '-';
        transitionCase(c, 'CANCELLED', STATE.ui.currentUser, {reason});
        Toast.push('warn', t('toast.actionDone',{action:t('action.cancel')}), c.caseNo);
        closeModal(); renderDetail(); renderList();
      }
    });
  },

  drillFrom,

  // Rooms
  selectRoom,
  openRoomModal() {
    const r = STATE.rooms.find(x=>x.roomNo===STATE.ui.selectedRoom); if (!r) return;
    const isClosed = r.status==='CLOSED';
    openModal({
      title: isClosed ? t('rooms.openReasonAsk') : t('rooms.closeReasonAsk'),
      body: `<div class="form-field"><label class="form-label">${t('transfer.reason')}</label>
        <textarea class="form-textarea" id="m-rreason" required></textarea></div>`,
      onSubmit: () => {
        const reason = document.getElementById('m-rreason').value.trim() || '-';
        const cur = now();
        if (isClosed) {
          if (r.openCases.length > 0) {
            Toast.push('warn','ยังมีเคสค้าง','ปิดเคสให้ครบก่อนเปิดห้อง');
            closeModal(); return;
          }
          r.status = 'AVAILABLE'; r.reason = '';
          (STATE.roomLogs[r.roomNo] = STATE.roomLogs[r.roomNo] || []).unshift({when:cur, action:'OPEN_ROOM', reason, actor: STATE.ui.currentUser, caseUid:null });
          notify('ok', t('toast.roomOpened',{no:r.roomNo}), reason, null);
        } else {
          r.status = 'CLOSED'; r.reason = reason;
          (STATE.roomLogs[r.roomNo] = STATE.roomLogs[r.roomNo] || []).unshift({when:cur, action:'CLOSE_ROOM', reason, actor: STATE.ui.currentUser, caseUid:null });
          notify('info', t('toast.roomClosed',{no:r.roomNo, reason}), '', null);
        }
        saveState(); closeModal(); renderRooms();
      }
    });
  },

  // Config
  saveConfig,
  addCategory(dept) {
    const inp = document.getElementById('new-cat-'+dept);
    const key = inp.value.trim();
    if (!key) return;
    STATE.config.CATEGORIES[dept] = STATE.config.CATEGORIES[dept] || [];
    if (!STATE.config.CATEGORIES[dept].includes(key)) STATE.config.CATEGORIES[dept].push(key);
    // Add to both dicts as fallback label = key
    DICT.th[key] = DICT.th[key] || key.split('.').pop();
    DICT.en[key] = DICT.en[key] || key.split('.').pop();
    inp.value = '';
    saveState(); renderConfig(); applyI18n();
  },
  removeCategory(dept, key) {
    STATE.config.CATEGORIES[dept] = (STATE.config.CATEGORIES[dept] || []).filter(k => k !== key);
    saveState(); renderConfig(); applyI18n();
  },

  // Modal
  closeModal,

  // Export
  exportCSV() {
    const arr = filteredCases();
    const cols = ['caseNo','createdAt','dept','category','subject','room','priority','status','assignee','reporter','due'];
    const rows = [cols.join(',')].concat(arr.map(c => cols.map(k => {
      let v = c[k];
      if (k==='category') v = t(v);
      if (k==='createdAt' || k==='due') v = new Date(v).toISOString();
      return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';
    }).join(',')));
    const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cases-${fmtDateISO(now())}.csv`;
    document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 100);
    Toast.push('ok', t('toast.exportDone'), a.download);
  },

};

// ============================================================
// Init
// ============================================================
loadState();
STATE.ui.lang = STATE.config.DEFAULT_LANGUAGE || STATE.ui.lang || 'th';

// Check saved user session
const savedUser = localStorage.getItem('hotel_user');
if (savedUser) {
  try {
    const u = JSON.parse(savedUser);
    STATE.ui.currentUser = u.full_name || u.username;
    STATE.ui.role = u.role;
    STATE.ui.dept = u.department_code;
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('screen-app').classList.remove('hidden');
  } catch (e) {
    document.getElementById('screen-app').classList.add('hidden');
    document.getElementById('screen-login').classList.remove('hidden');
  }
} else {
  document.getElementById('screen-app').classList.add('hidden');
  document.getElementById('screen-login').classList.remove('hidden');
}

applyI18n();
applyRole();
renderNotifCount();
syncFromDatabase();

// Ticker
setInterval(() => { tickSLA(); uiTick(); }, 500);

// Expose
window.App = App;

})();
