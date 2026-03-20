/**
 * imp-keyboard-logger-pcb — Workshop DIY
 * Hardware keylogger PCB design simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="30" width="80" height="40" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><line x1="25" y1="42" x2="35" y2="42" stroke="currentColor" stroke-width="2"/><line x1="40" y1="42" x2="50" y2="42" stroke="currentColor" stroke-width="2"/><line x1="55" y1="42" x2="65" y2="42" stroke="currentColor" stroke-width="2"/><line x1="25" y1="52" x2="75" y2="52" stroke="currentColor" stroke-width="2"/><circle cx="80" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="80" y1="16" x2="80" y2="24" stroke="currentColor" stroke-width="2"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { osc.frequency.value = 800; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); }
  else if (type === 'success') { osc.frequency.value = 523; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); }
  else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'imp-keyboard-logger-pcb', subtitle: '⌨️ design · 🔍 detect · 🛡️ defend',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Keyboard Logger PCB — Implant Design Sim',
    mainDesc: 'Design and analyze hardware keylogger PCB layouts for detection training',
    sectionA: 'How It Works', sectionB: 'Lab — PCB Visualizer', sectionC: 'Challenge',
    captureBtn: 'Start Capture', analyzeBtn: 'Analyze PCB', detectBtn: 'Detect Implant',
    howStep1: 'A hardware keylogger is a small PCB placed between a keyboard and computer.',
    howStep2: 'It intercepts USB data lines and stores keystrokes in onboard flash memory.',
    howStep3: 'Some variants transmit captured data wirelessly via RF or WiFi modules.',
    howStep4: 'Detection involves visual inspection, USB traffic analysis, and firmware verification.',
    challenge1: 'How can you detect an inline USB keylogger without opening the case?',
    challengeReveal1: 'Monitor USB descriptor changes — a keylogger adds an extra USB device in the chain.',
    ready: '⌨️ Keyboard Logger PCB sim ready — select implant type!',
    capturing: 'Capturing keystrokes...', captured: 'Keystroke captured',
    analyzing: 'Analyzing PCB layout...', detected: 'Implant detected!',
    noData: 'No data to analyze', scanComplete: 'PCB scan complete',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    settings: '⚙️ Settings', language: 'Language', theme: 'Theme',
    splashHint: 'tap to skip',
  ,faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.',step1Title:'Design Implant',step1Desc:'A hardware keylogger is a small PCB placed between a keyboard and computer.',step2Title:'Build & Program',step2Desc:'It intercepts USB data lines and stores keystrokes in onboard flash memory.',step3Title:'Deploy',step3Desc:'Some variants transmit captured data wirelessly via RF or WiFi modules.',step4Title:'Monitor & Extract',step4Desc:'Detection involves visual inspection, USB traffic analysis, and firmware verification.'},
  fr: {
    title: 'imp-keyboard-logger-pcb', subtitle: '⌨️ concevoir · 🔍 détecter · 🛡️ défendre',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'PCB Keylogger — Simulation de conception',
    mainDesc: 'Concevez et analysez des PCB de keylogger matériel pour la formation à la détection',
    sectionA: 'Comment ça marche', sectionB: 'Labo — Visualiseur PCB', sectionC: 'Défi',
    captureBtn: 'Démarrer Capture', analyzeBtn: 'Analyser PCB', detectBtn: 'Détecter Implant',
    ready: '⌨️ Simulation PCB Keylogger prête !',
    capturing: 'Capture des frappes...', captured: 'Frappe capturée',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    working: 'En cours…', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    settings: '⚙️ Paramètres', language: 'Langue', theme: 'Thème', splashHint: 'appuyer pour passer',
  ,faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.',step1Title:'Concevoir l\'implant',step1Desc:'A hardware keylogger is a small PCB placed between a keyboard and computer.',step2Title:'Construire et programmer',step2Desc:'It intercepts USB data lines and stores keystrokes in onboard flash memory.',step3Title:'Déployer',step3Desc:'Some variants transmit captured data wirelessly via RF or WiFi modules.',step4Title:'Surveiller et extraire',step4Desc:'Detection involves visual inspection, USB traffic analysis, and firmware verification.'},
  ar: {
    title: 'imp-keyboard-logger-pcb', subtitle: '⌨️ تصميم · 🔍 كشف · 🛡️ دفاع',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'لوحة دوائر راصد المفاتيح — محاكاة التصميم',
    mainDesc: 'صمم وحلل تخطيطات لوحات راصد المفاتيح للتدريب على الكشف',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    captureBtn: 'بدء الالتقاط', analyzeBtn: 'تحليل اللوحة', detectBtn: 'كشف الزرعة',
    ready: '⌨️ محاكاة لوحة راصد المفاتيح جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', working: 'جارٍ…',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    settings: '⚙️ الإعدادات', language: 'اللغة', theme: 'المظهر', splashHint: 'انقر للتخطي',
  ,faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',step1Title:'تصميم الزرع',step1Desc:'A hardware keylogger is a small PCB placed between a keyboard and computer.',step2Title:'بناء وبرمجة',step2Desc:'It intercepts USB data lines and stores keystrokes in onboard flash memory.',step3Title:'نشر',step3Desc:'Some variants transmit captured data wirelessly via RF or WiFi modules.',step4Title:'مراقبة واستخراج',step4Desc:'Detection involves visual inspection, USB traffic analysis, and firmware verification.'}
};
let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(`${LANG[currentLang].themeChanged} ${name}`, 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); }
}
function exportLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const blob = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `log-${new Date().toISOString().slice(0,10)}.txt`; a.click();
}

/* ═══════ TOAST ═══════ */
let toastTimer = null;
function showToast(msg, ms = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (ms > 0) toastTimer = setTimeout(hideToast, ms);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }

/* ═══════ STATUS ═══════ */
function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter();
    });
  });
}
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none';
  });
}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {}
}

/* ═══════ PANELS ═══════ */
function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); }
function closePanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
      if (target) target.classList.add('active');
    });
  });
}

/* ═══════ CHALLENGE ═══════ */
function revealChallenge(idx) { const el = $('answer' + idx); if (el) el.classList.toggle('visible'); playSound('click'); }

/* ═══════ MATRIX RAIN ═══════ */
let matrixRunning = false, matrixAnim = null;
function toggleMatrix() {
  const canvas = $('matrixCanvas'); if (!canvas) return;
  if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; }
  matrixRunning = true; canvas.classList.add('active');
  const ctx = canvas.getContext('2d'); canvas.width = innerWidth; canvas.height = innerHeight;
  const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1);
  const chars = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';
  (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri';
    for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, drops[i]*16);
      if (drops[i]*16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; }
    matrixAnim = requestAnimationFrame(draw); })();
}

/* ═══════ APP-SPECIFIC: KEYBOARD LOGGER PCB SIM ═══════ */

let capturing = false;
let capturedKeys = [];
let pcbParticles = [];
let simAnimId = null;

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500;
  canvas.height = 260;

  function drawPCB() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const type = ($('pcbTypeSelect') || {}).value || 'inline';

    // Draw PCB board outline
    ctx.strokeStyle = '#1a3a1a'; ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Draw traces
    ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(60, 60 + i * 35); ctx.lineTo(canvas.width - 60, 60 + i * 35); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw components based on type
    if (type === 'inline') {
      // USB connector left
      ctx.fillStyle = '#444'; ctx.fillRect(20, 100, 30, 60);
      ctx.fillStyle = accent; ctx.font = '10px Orbitron'; ctx.fillText('USB-A', 22, 95);
      // USB connector right
      ctx.fillStyle = '#444'; ctx.fillRect(canvas.width - 50, 100, 30, 60);
      ctx.fillText('USB-B', canvas.width - 48, 95);
      // MCU chip
      ctx.fillStyle = '#222'; ctx.strokeStyle = accent; ctx.strokeRect(canvas.width/2 - 25, 90, 50, 50);
      ctx.fillStyle = accent; ctx.fillText('MCU', canvas.width/2 - 12, 120);
      // Flash memory
      ctx.strokeRect(canvas.width/2 - 20, 160, 40, 25);
      ctx.fillText('FLASH', canvas.width/2 - 18, 178);
    } else if (type === 'internal') {
      // Ribbon cable tap
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = i % 2 === 0 ? accent : '#666';
        ctx.beginPath(); ctx.moveTo(60, 50 + i * 20); ctx.lineTo(canvas.width - 60, 50 + i * 20); ctx.stroke();
      }
      ctx.fillStyle = accent; ctx.font = '10px Orbitron';
      ctx.fillText('RIBBON TAP', canvas.width/2 - 30, 230);
    } else {
      // Wireless module
      ctx.fillStyle = '#222'; ctx.strokeStyle = accent;
      ctx.strokeRect(canvas.width/2 - 30, 80, 60, 40);
      ctx.fillStyle = accent; ctx.font = '10px Orbitron'; ctx.fillText('RF TX', canvas.width/2 - 15, 105);
      // Antenna
      ctx.beginPath(); ctx.moveTo(canvas.width/2, 80); ctx.lineTo(canvas.width/2, 40);
      ctx.lineTo(canvas.width/2 - 15, 50); ctx.moveTo(canvas.width/2, 40);
      ctx.lineTo(canvas.width/2 + 15, 50); ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 2; ctx.stroke();
    }

    // Draw captured data packets
    for (let i = pcbParticles.length - 1; i >= 0; i--) {
      const p = pcbParticles[i];
      p.x += p.vx; p.life -= 0.01;
      if (p.life <= 0 || p.x > canvas.width) { pcbParticles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#33ff33'; ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Signal indicator
    const gain = parseInt(($('gainSlider') || {}).value || '50');
    const barW = (canvas.width - 100) * (gain / 100);
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(50, canvas.height - 25, barW, 10);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`GAIN: ${gain}%`, 50, canvas.height - 8);

    simAnimId = requestAnimationFrame(drawPCB);
  }
  drawPCB();
}

function spawnDataPackets(count) {
  const canvas = $('simCanvas'); if (!canvas) return;
  for (let i = 0; i < count; i++) {
    pcbParticles.push({ x: 60 + Math.random() * 30, y: 80 + Math.random() * 100, vx: 1 + Math.random() * 3, life: 0.6 + Math.random() * 0.4 });
  }
}

function initKeyloggerSim() {
  const captureBtn = $('captureBtn');
  const analyzeBtn = $('analyzeBtn');
  const detectBtn = $('detectBtn');
  const keystrokeInput = $('keystrokeInput');
  const gainSlider = $('gainSlider');
  const gainValue = $('gainValue');
  const dataLog = $('dataLog');
  const outputDisplay = $('outputDisplay');
  const implantDot = $('implantDot');
  const implantStatusText = $('implantStatusText');

  if (gainSlider && gainValue) {
    gainSlider.addEventListener('input', () => { gainValue.textContent = gainSlider.value + '%'; });
  }

  // Capture toggle
  if (captureBtn) captureBtn.addEventListener('click', () => {
    capturing = !capturing;
    captureBtn.textContent = capturing ? 'Stop Capture' : 'Start Capture';
    if (implantDot) implantDot.classList.toggle('active', capturing);
    if (implantStatusText) implantStatusText.textContent = capturing ? 'Implant: ACTIVE' : 'Implant: Inactive';
    log(capturing ? '🔴 Capture started' : '⬛ Capture stopped', capturing ? 'success' : 'info');
    setStatus(capturing);
    showToast(capturing ? LANG[currentLang].capturing : 'Capture stopped', 1500);
  });

  // Keystroke capture
  if (keystrokeInput) keystrokeInput.addEventListener('keydown', (e) => {
    if (!capturing) return;
    const ts = new Date().toLocaleTimeString();
    const entry = `[${ts}] KEY: ${e.key} (code: ${e.keyCode})`;
    capturedKeys.push(entry);
    if (dataLog) { dataLog.textContent = capturedKeys.slice(-20).join('\n'); }
    if (outputDisplay) { outputDisplay.textContent = capturedKeys.map(k => k.split('KEY: ')[1]?.split(' ')[0] || '').join(''); }
    spawnDataPackets(3);
    log(`⌨️ ${entry}`, 'tx');
  });

  // Analyze PCB
  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    if (capturedKeys.length === 0) { log(LANG[currentLang].noData || 'No data', 'error'); return; }
    showToast(LANG[currentLang].analyzing, 2000);
    log('🔬 Analyzing PCB layout...', 'info');
    spawnDataPackets(20);
    setTimeout(() => {
      const type = ($('pcbTypeSelect') || {}).value || 'inline';
      const analysis = `PCB Type: ${type.toUpperCase()}\nKeys logged: ${capturedKeys.length}\nMemory used: ${(capturedKeys.length * 12)} bytes\nFlash capacity: 4096 bytes`;
      if (outputDisplay) outputDisplay.textContent = analysis;
      log('📊 PCB analysis complete', 'success');
    }, 1500);
  });

  // Detect implant
  if (detectBtn) detectBtn.addEventListener('click', () => {
    showToast('Scanning for implants...', 2500);
    log('🔍 Running implant detection scan...', 'info');
    spawnDataPackets(15);
    setTimeout(() => {
      const detected = Math.random() > 0.3;
      if (detected) {
        const type = ($('pcbTypeSelect') || {}).value || 'inline';
        if (outputDisplay) outputDisplay.textContent = `⚠️ IMPLANT DETECTED!\nType: ${type}\nRisk: HIGH\nUSB Descriptors: ANOMALOUS\nRecommendation: Remove and audit`;
        log('🚨 Implant detected on USB bus!', 'error');
      } else {
        if (outputDisplay) outputDisplay.textContent = '✅ No implant detected\nUSB Descriptors: NORMAL\nFirmware: VERIFIED';
        log('✅ No implant found — system clean', 'success');
      }
      hideToast();
    }, 2000);
  });

  // Scan PCB button in lab
  const scanBtn = $('scanPcbBtn');
  if (scanBtn) scanBtn.addEventListener('click', () => {
    spawnDataPackets(30);
    log('📡 PCB scan initiated — analyzing traces...', 'info');
    showToast('Scanning...', 2000);
    setTimeout(() => { log(LANG[currentLang].scanComplete || 'Scan complete', 'success'); }, 2000);
  });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  $('helpBtn') && ($('helpBtn').onclick = openHelp);
  $('helpCloseBtn') && ($('helpCloseBtn').onclick = closeHelp);
  $('helpOverlay') && ($('helpOverlay').onclick = closeHelp);
  initHelpTabs();

  $('settingsBtn') && ($('settingsBtn').onclick = openSettings);
  $('settingsCloseBtn') && ($('settingsCloseBtn').onclick = closeSettings);
  $('settingsOverlay') && ($('settingsOverlay').onclick = closeSettings);

  $('logBtn') && ($('logBtn').onclick = toggleLog);
  $('logCloseBtn') && ($('logCloseBtn').onclick = closeLog);

  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });

  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme');
    if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}

  initHijriDate();
  initSimCanvas();
  initKeyloggerSim();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
