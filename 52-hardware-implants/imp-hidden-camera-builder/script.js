/**
 * imp-hidden-camera-builder — Workshop DIY
 * Covert camera module builder simulation for detection training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="25" width="60" height="50" rx="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><circle cx="50" cy="50" r="4" fill="currentColor"/><circle cx="68" cy="32" r="3" fill="currentColor" opacity=".6"/><path d="M35 25 L35 18 L65 18 L65 25" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;

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
    title: 'imp-hidden-camera-builder', subtitle: '📷 design · 🔍 conceal · 🛡️ detect',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Hidden Camera Builder — Covert Surveillance Lab',
    mainDesc: 'Design hidden camera modules and learn RF/IR detection techniques',
    sectionA: 'How It Works', sectionB: 'Lab — Camera Signal Visualizer', sectionC: 'Challenge',
    buildBtn: 'Build Module', detectBtn: 'Detect Cameras', jamBtn: 'RF Jam',
    howStep1: 'Covert cameras use miniature CMOS sensors (as small as 1mm pinhole) hidden inside everyday objects.',
    howStep2: 'Wireless models transmit on 2.4GHz WiFi or analog 1.2GHz/5.8GHz bands, detectable by RF sweeps.',
    howStep3: 'IR night-vision LEDs are invisible to the naked eye but visible through phone cameras (purple glow).',
    howStep4: 'Detection combines RF spectrum analysis, lens reflection (laser bounce), and non-linear junction detection.',
    ready: '📷 Hidden Camera Builder ready — select camera type!',
    building: 'Building camera module...', moduleReady: 'Module assembled!',
    detecting: 'Scanning for hidden cameras...', noSignal: 'No cameras detected',
    cameraFound: 'Camera signal detected!', jamming: 'RF jamming active',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    splashHint: 'tap to skip',step1Title:'Design Implant',step1Desc:'Covert cameras use miniature CMOS sensors (as small as 1mm pinhole) hidden inside everyday objects.',step2Title:'Build & Program',step2Desc:'Wireless models transmit on 2.4GHz WiFi or analog 1.2GHz/5.8GHz bands, detectable by RF sweeps.',step3Title:'Deploy',step3Desc:'IR night-vision LEDs are invisible to the naked eye but visible through phone cameras (purple glow).',step4Title:'Monitor & Extract',step4Desc:'Detection combines RF spectrum analysis, lens reflection (laser bounce), and non-linear junction detection.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates hardware implants! 🔬 You get to experiment with covert hardware devices in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real covert hardware devices so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real physical security and implant design! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Imp Supply Chain Backdoor and Imp Magnetic Stripe Cloner! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title: 'imp-hidden-camera-builder', subtitle: '📷 concevoir · 🔍 dissimuler · 🛡️ détecter',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Constructeur de caméra cachée',
    mainDesc: 'Concevez des modules de caméra cachée et apprenez les techniques de détection',
    sectionA: 'Comment ça marche', sectionB: 'Labo — Visualiseur de signal', sectionC: 'Défi',
    buildBtn: 'Construire', detectBtn: 'Détecter', jamBtn: 'Brouiller',
    ready: '📷 Constructeur de caméra prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    working: 'En cours…', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    splashHint: 'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'Covert cameras use miniature CMOS sensors (as small as 1mm pinhole) hidden inside everyday objects.',step2Title:'Construire et programmer',step2Desc:'Wireless models transmit on 2.4GHz WiFi or analog 1.2GHz/5.8GHz bands, detectable by RF sweeps.',step3Title:'Déployer',step3Desc:'IR night-vision LEDs are invisible to the naked eye but visible through phone cameras (purple glow).',step4Title:'Surveiller et extraire',step4Desc:'Detection combines RF spectrum analysis, lens reflection (laser bounce), and non-linear junction detection.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule hardware implants ! 🔬 Tu peux expérimenter avec covert hardware devices en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais covert hardware devices.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai physical security and implant design ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Imp Supply Chain Backdoor and Imp Magnetic Stripe Cloner ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title: 'imp-hidden-camera-builder', subtitle: '📷 تصميم · 🔍 إخفاء · 🛡️ كشف',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'مُنشئ الكاميرا المخفية — مختبر المراقبة السرية',
    mainDesc: 'تصميم وحدات كاميرا مخفية وتعلم تقنيات الكشف',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    buildBtn: 'بناء', detectBtn: 'كشف', jamBtn: 'تشويش',
    ready: '📷 مُنشئ الكاميرا المخفية جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', working: 'جارٍ…',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    splashHint: 'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'Covert cameras use miniature CMOS sensors (as small as 1mm pinhole) hidden inside everyday objects.',step2Title:'بناء وبرمجة',step2Desc:'Wireless models transmit on 2.4GHz WiFi or analog 1.2GHz/5.8GHz bands, detectable by RF sweeps.',step3Title:'نشر',step3Desc:'IR night-vision LEDs are invisible to the naked eye but visible through phone cameras (purple glow).',step4Title:'مراقبة واستخراج',step4Desc:'Detection combines RF spectrum analysis, lens reflection (laser bounce), and non-linear junction detection.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي hardware implants! 🔬 يمكنك التجربة مع covert hardware devices في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج covert hardware devices حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا physical security and implant design حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Imp Supply Chain Backdoor and Imp Magnetic Stripe Cloner! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
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
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`; a.click();
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
  (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri';
    for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; }
    matrixAnim = requestAnimationFrame(draw); })();
}

/* ═══════ APP-SPECIFIC: HIDDEN CAMERA BUILDER ═══════ */

let camActive = false;
let camParticles = [];
let irLeds = [];
let detectedCameras = [];
let waveTime = 0;

// Generate random camera specs
function randomCameraSpec() {
  const sensors = ['OV2640 2MP', 'OV5647 5MP', 'IMX219 8MP', 'OV7670 VGA', 'IMX477 12MP'];
  const housings = ['Smoke Detector', 'USB Charger', 'Wall Clock', 'Picture Frame', 'Screw Head', 'Power Strip', 'Pen Clip'];
  const freqs = ['2.4 GHz WiFi', '1.2 GHz Analog', '5.8 GHz Analog', '900 MHz', 'Wired (no RF)'];
  return {
    sensor: sensors[Math.floor(Math.random() * sensors.length)],
    housing: housings[Math.floor(Math.random() * housings.length)],
    freq: freqs[Math.floor(Math.random() * freqs.length)],
    resolution: ['640x480', '1280x720', '1920x1080', '2592x1944'][Math.floor(Math.random() * 4)],
    fov: (60 + Math.floor(Math.random() * 100)) + '°',
    irLeds: Math.floor(Math.random() * 8),
    power: (0.5 + Math.random() * 4).toFixed(1) + 'W',
    timestamp: new Date().toLocaleTimeString()
  };
}

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500;
  canvas.height = 260;

  // Populate IR LEDs
  for (let i = 0; i < 6; i++) {
    irLeds.push({ x: 80 + Math.random() * (canvas.width - 160), y: 40 + Math.random() * 180, active: false, pulse: Math.random() * Math.PI * 2 });
  }

  function drawCamera() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const type = ($('cameraTypeSelect') || {}).value || 'pinhole';
    waveTime += 0.02;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // Camera module (left side)
    const camX = 90, camY = canvas.height / 2;
    ctx.save();
    ctx.translate(camX, camY);

    // Camera body
    ctx.fillStyle = '#111'; ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-35, -25, 70, 50, 6); ctx.fill(); ctx.stroke();

    // Lens rings
    ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
    for (let r = 18; r >= 4; r -= 7) {
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = '#1a1a3e'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();

    // Pinhole effect
    if (type === 'pinhole') {
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // Recording LED
    if (camActive) {
      ctx.fillStyle = Math.sin(waveTime * 4) > 0 ? '#ff0000' : '#440000';
      ctx.beginPath(); ctx.arc(25, -18, 3, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = accent; ctx.font = '8px Orbitron';
    ctx.fillText('CAM', -10, 38);
    ctx.restore();

    // IR LEDs (scattered across canvas when active)
    if (camActive || type === 'infrared') {
      irLeds.forEach(led => {
        led.pulse += 0.05;
        const brightness = 0.3 + Math.sin(led.pulse) * 0.3;
        // IR glow (purple-ish, like through phone camera)
        ctx.globalAlpha = brightness;
        ctx.fillStyle = '#9933ff';
        ctx.beginPath(); ctx.arc(led.x, led.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cc66ff';
        ctx.beginPath(); ctx.arc(led.x, led.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // WiFi signal waves (right side for wireless transmission)
    if (camActive) {
      const txX = canvas.width - 80, txY = canvas.height / 2;
      ctx.strokeStyle = accent; ctx.lineWidth = 1;
      ctx.strokeRect(txX - 15, txY - 20, 30, 40);
      ctx.fillStyle = accent; ctx.font = '7px Orbitron';
      ctx.fillText('TX', txX - 6, txY + 4);

      // Animated signal arcs
      for (let w = 0; w < 3; w++) {
        const phase = (waveTime * 3 + w * 1.2) % 4;
        const radius = phase / 4 * 40;
        const alpha = 1 - phase / 4;
        ctx.strokeStyle = `rgba(51, 255, 51, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(txX + 15, txY, 10 + radius, -0.8, 0.8); ctx.stroke();
      }

      // Data flow from camera to transmitter
      ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 1; ctx.setLineDash([4, 8]);
      ctx.beginPath(); ctx.moveTo(camX + 35, camY); ctx.lineTo(txX - 15, txY); ctx.stroke();
      ctx.setLineDash([]);

      // Frequency label
      const freq = ($('cameraTypeSelect') || {}).value === 'analog' ? '1.2 GHz' : '2.4 GHz';
      ctx.fillStyle = '#33ff33'; ctx.font = '10px Orbitron';
      ctx.fillText(freq + ' STREAM', canvas.width / 2 - 45, 20);
    }

    // Concealment housing (bottom)
    const housingTypes = { pinhole: 'SMOKE DET.', board: 'USB CHARGER', infrared: 'WALL CLOCK', analog: 'PICTURE FRAME' };
    ctx.fillStyle = '#1a1a1a'; ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(camX - 50, camY + 40, 100, 30, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.font = '8px Orbitron';
    ctx.fillText('HOUSING: ' + (housingTypes[type] || 'CUSTOM'), camX - 42, camY + 58);

    // Particles
    for (let i = camParticles.length - 1; i >= 0; i--) {
      const p = camParticles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.015;
      if (p.life <= 0 || p.x > canvas.width || p.x < 0) { camParticles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color || '#33ff33';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2); ctx.fill();
      if (p.label) { ctx.font = '6px Orbitron'; ctx.fillText(p.label, p.x + 4, p.y - 2); }
      ctx.globalAlpha = 1;
    }

    // Sensor info bar
    const fov = parseInt(($('fovSlider') || {}).value || '90');
    const barW = (canvas.width - 100) * (fov / 180);
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(50, canvas.height - 25, barW, 10);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`FOV: ${fov}° | ${type.toUpperCase()}`, 50, canvas.height - 8);

    // Detection count
    ctx.fillStyle = accent; ctx.textAlign = 'right';
    ctx.fillText(`Detected: ${detectedCameras.length}`, canvas.width - 20, canvas.height - 8);
    ctx.textAlign = 'left';

    requestAnimationFrame(drawCamera);
  }
  drawCamera();
}

function spawnCamParticles(count, fromCam, color) {
  const canvas = $('simCanvas'); if (!canvas) return;
  const camX = 90, txX = canvas.width - 80, cy = canvas.height / 2;
  for (let i = 0; i < count; i++) {
    const startX = fromCam ? camX + 35 : txX;
    const dir = fromCam ? 1 : -1;
    const labels = ['H264', 'FPS', 'PIX', 'MJPG', 'SIG', 'KEY', 'NAL'];
    camParticles.push({
      x: startX + Math.random() * 10,
      y: cy - 20 + Math.random() * 40,
      vx: dir * (1.5 + Math.random() * 3),
      vy: (Math.random() - 0.5) * 1.5,
      life: 0.6 + Math.random() * 0.4,
      color: color || '#33ff33',
      size: 2 + Math.random() * 2,
      label: Math.random() > 0.6 ? labels[Math.floor(Math.random() * labels.length)] : null
    });
  }
}

function initCameraSim() {
  const buildBtn = $('buildBtn');
  const detectBtn = $('detectBtn');
  const jamBtn = $('jamBtn');
  const fovSlider = $('fovSlider');
  const fovValue = $('fovValue');
  const dataLog = $('dataLog');
  const outputDisplay = $('outputDisplay');
  const implantDot = $('implantDot');
  const implantStatusText = $('implantStatusText');

  if (fovSlider && fovValue) {
    fovSlider.addEventListener('input', () => { fovValue.textContent = fovSlider.value + '°'; });
  }

  // Build Module toggle
  let buildInterval = null;
  if (buildBtn) buildBtn.addEventListener('click', () => {
    camActive = !camActive;
    buildBtn.textContent = camActive ? 'Stop Stream' : (LANG[currentLang].buildBtn || 'Build Module');
    if (implantDot) implantDot.classList.toggle('active', camActive);
    if (implantStatusText) implantStatusText.textContent = camActive ? 'Camera: STREAMING' : 'Camera: Offline';
    setStatus(camActive);

    if (camActive) {
      log('📷 Camera module built — streaming started', 'success');
      showToast(LANG[currentLang].building, 1500);
      let frameCount = 0;
      buildInterval = setInterval(() => {
        if (!camActive) { clearInterval(buildInterval); return; }
        frameCount++;
        spawnCamParticles(6, true, '#33ff33');
        const spec = randomCameraSpec();
        if (dataLog) {
          dataLog.textContent = [
            `[${spec.timestamp}] Frame ${frameCount}`,
            `Sensor: ${spec.sensor}`,
            `Resolution: ${spec.resolution}`,
            `FoV: ${spec.fov}`,
            `Bitrate: ${(500 + Math.random() * 3000).toFixed(0)} kbps`,
            `IR LEDs: ${spec.irLeds} active`
          ].join('\n');
        }
        log(`📷 Frame ${frameCount} — ${spec.resolution} @ ${(15 + Math.random() * 15).toFixed(0)}fps`, 'tx');
      }, 2000);
    } else {
      if (buildInterval) clearInterval(buildInterval);
      log('⬛ Camera stream stopped', 'info');
    }
  });

  // Detect hidden cameras
  if (detectBtn) detectBtn.addEventListener('click', () => {
    showToast(LANG[currentLang].detecting, 2500);
    log('🔍 Initiating camera detection sweep...', 'info');
    spawnCamParticles(15, false, '#4488ff');

    let step = 0;
    const methods = ['RF Spectrum Scan (1-6 GHz)', 'IR Reflection Check', 'Lens Glint Detection', 'Non-Linear Junction Scan', 'WiFi Probe Analysis'];
    const sweepIv = setInterval(() => {
      if (step < methods.length) {
        log(`🔍 ${methods[step]}...`, 'info');
        spawnCamParticles(5, false, '#4488ff');
        step++;
      } else {
        clearInterval(sweepIv);
        const found = Math.random() > 0.3;
        if (found) {
          const cam = randomCameraSpec();
          detectedCameras.push(cam);
          const result = [
            '⚠️ CAMERA DETECTED',
            '══════════════════',
            `Type: Pinhole CMOS`,
            `Sensor: ${cam.sensor}`,
            `Signal: ${cam.freq}`,
            `Concealed in: ${cam.housing}`,
            `IR LEDs: ${cam.irLeds}`,
            `Power draw: ${cam.power}`,
            '',
            'THREAT LEVEL: HIGH',
            'Recommendation: Physical inspection required'
          ].join('\n');
          if (outputDisplay) outputDisplay.textContent = result;
          log(`🚨 Camera found — ${cam.sensor} in ${cam.housing}`, 'error');
        } else {
          if (outputDisplay) outputDisplay.textContent = '✅ NO CAMERAS FOUND\n══════════════════\nRF: Clean (1-6 GHz)\nIR: No reflections\nLens: No glint detected\nWiFi: No rogue streams\n\nArea appears secure.';
          log('✅ Detection sweep clean — no cameras found', 'success');
        }
        hideToast();
      }
    }, 600);
  });

  // RF Jam
  if (jamBtn) jamBtn.addEventListener('click', () => {
    showToast('Activating RF jammer...', 2000);
    log('📡 RF jammer engaged — disrupting camera signals...', 'info');
    spawnCamParticles(25, false, '#ff3333');
    setTimeout(() => {
      const defenses = [
        '🛡️ RF JAMMER ACTIVE',
        '══════════════════',
        'Jamming: 2.4 GHz band',
        'Jamming: 5.8 GHz band',
        'Jamming: 1.2 GHz analog',
        'Power: 500mW broadband',
        '',
        'Countermeasures:',
        '• Broadband noise injection',
        '• WiFi deauth flooding',
        '• Analog signal disruption',
        '• IR flood (camera blinding)'
      ].join('\n');
      if (outputDisplay) outputDisplay.textContent = defenses;
      log('🛡️ RF jammer active — all wireless cameras disrupted', 'success');
      if (camActive) {
        camActive = false;
        if (buildBtn) buildBtn.textContent = LANG[currentLang].buildBtn || 'Build Module';
        if (implantDot) implantDot.classList.remove('active');
        if (implantStatusText) implantStatusText.textContent = 'Camera: JAMMED';
        setStatus(false);
      }
      hideToast();
    }, 1800);
  });

  // Sweep button in lab
  const sweepBtn = $('sweepBtn');
  if (sweepBtn) sweepBtn.addEventListener('click', () => {
    spawnCamParticles(30, false, '#d4a03c');
    log('📡 Full spectrum sweep — scanning 900MHz to 6GHz...', 'info');
    showToast('Spectrum sweep in progress...', 3000);
    let step = 0;
    const bands = ['900 MHz', '1.2 GHz (Analog)', '2.4 GHz (WiFi)', '5.0 GHz (WiFi)', '5.8 GHz (Analog)'];
    const sweepIv = setInterval(() => {
      if (step < bands.length) {
        if (dataLog) dataLog.textContent += `\n[SWEEP] Scanning ${bands[step]}...`;
        spawnCamParticles(5, false, '#d4a03c');
        step++;
      } else {
        clearInterval(sweepIv);
        if (dataLog) dataLog.textContent += '\n[SWEEP] Complete — 2.4 GHz anomaly detected';
        log('📡 Spectrum sweep complete', 'success');
      }
    }, 500);
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
  initCameraSim();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}
