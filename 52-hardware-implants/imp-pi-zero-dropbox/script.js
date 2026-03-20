/**
 * imp-pi-zero-dropbox — Workshop DIY
 * Raspberry Pi Zero network drop box simulation for pentest training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="30" width="60" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="25" y="35" width="15" height="10" rx="1" fill="currentColor" opacity=".3"/><circle cx="70" cy="38" r="3" fill="currentColor"/><line x1="50" y1="70" x2="50" y2="85" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="89" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="45" width="8" height="6" rx="1" fill="currentColor" opacity=".5"/><rect x="77" y="45" width="8" height="6" rx="1" fill="currentColor" opacity=".5"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

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

const LANG = {
  en: {
    title: 'imp-pi-zero-dropbox', subtitle: '📦 drop · 🔓 pivot · 🛡️ detect',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Pi Zero Drop Box — Network Implant Lab',
    mainDesc: 'Simulate Raspberry Pi Zero drop box deployment for network penetration testing',
    sectionA: 'How It Works', sectionB: 'Lab — Network Topology', sectionC: 'Challenge',
    deployBtn: 'Deploy Box', pivotBtn: 'Pivot Network', detectBtn: 'Detect Implant',
    howStep1: 'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',
    howStep2: 'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',
    howStep3: 'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',
    howStep4: 'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.',
    ready: '📦 Pi Zero Drop Box ready — select deployment mode!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    splashHint: 'tap to skip',
  ,faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.',step1Title:'Design Implant',step1Desc:'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',step2Title:'Build & Program',step2Desc:'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',step3Title:'Deploy',step3Desc:'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',step4Title:'Monitor & Extract',step4Desc:'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.'},
  fr: {
    title: 'imp-pi-zero-dropbox', subtitle: '📦 déployer · 🔓 pivoter · 🛡️ détecter',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Pi Zero Drop Box — Implant réseau',
    mainDesc: 'Simulez le déploiement d\'une drop box Pi Zero pour les tests de pénétration',
    sectionA: 'Comment ça marche', sectionB: 'Labo — Topologie réseau', sectionC: 'Défi',
    deployBtn: 'Déployer', pivotBtn: 'Pivoter', detectBtn: 'Détecter',
    ready: '📦 Drop Box prête !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    working: 'En cours…', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    splashHint: 'appuyer pour passer',
  ,faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.',step1Title:'Concevoir l\'implant',step1Desc:'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',step2Title:'Construire et programmer',step2Desc:'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',step3Title:'Déployer',step3Desc:'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',step4Title:'Surveiller et extraire',step4Desc:'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.'},
  ar: {
    title: 'imp-pi-zero-dropbox', subtitle: '📦 نشر · 🔓 محور · 🛡️ كشف',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'صندوق الإسقاط Pi Zero — مختبر زرعات الشبكة',
    mainDesc: 'محاكاة نشر صندوق إسقاط Pi Zero لاختبار اختراق الشبكات',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    deployBtn: 'نشر', pivotBtn: 'محور', detectBtn: 'كشف',
    ready: '📦 صندوق الإسقاط جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', working: 'جارٍ…',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    splashHint: 'انقر للتخطي',
  ,faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',step1Title:'تصميم الزرع',step1Desc:'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',step2Title:'بناء وبرمجة',step2Desc:'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',step3Title:'نشر',step3Desc:'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',step4Title:'مراقبة واستخراج',step4Desc:'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.'}
};
let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info');
}
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(`${LANG[currentLang].themeChanged} ${name}`, 'info');
}

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const blob = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); }

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); }
function closePanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (target) target.classList.add('active'); }); }); }
function revealChallenge(idx) { const el = $('answer' + idx); if (el) el.classList.toggle('visible'); playSound('click'); }

let matrixRunning = false, matrixAnim = null;
function toggleMatrix() { const canvas = $('matrixCanvas'); if (!canvas) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; } matrixRunning = true; canvas.classList.add('active'); const ctx = canvas.getContext('2d'); canvas.width = innerWidth; canvas.height = innerHeight; const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1); const chars = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذ01'; (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); })(); }

/* ═══════ APP-SPECIFIC: PI ZERO DROP BOX ═══════ */

let deployed = false;
let netParticles = [];
let discoveredHosts = [];
let waveTime = 0;

const networkNodes = [
  { id: 'gw', label: 'GATEWAY', x: 0.5, y: 0.1, color: '#4488ff' },
  { id: 'sw', label: 'SWITCH', x: 0.5, y: 0.35, color: '#888' },
  { id: 'srv1', label: 'SRV-01', x: 0.2, y: 0.6, color: '#33ff33' },
  { id: 'srv2', label: 'SRV-02', x: 0.5, y: 0.6, color: '#33ff33' },
  { id: 'ws1', label: 'WS-01', x: 0.8, y: 0.6, color: '#33ff33' },
  { id: 'pi', label: 'PI-ZERO', x: 0.8, y: 0.35, color: '#ff3333' },
];
const netLinks = [
  ['gw', 'sw'], ['sw', 'srv1'], ['sw', 'srv2'], ['sw', 'ws1'], ['sw', 'pi']
];

function getNode(id) { return networkNodes.find(n => n.id === id); }

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500; canvas.height = 260;

  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    waveTime += 0.02;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // Links
    netLinks.forEach(([a, b]) => {
      const na = getNode(a), nb = getNode(b);
      const ax = na.x * canvas.width, ay = na.y * canvas.height;
      const bx = nb.x * canvas.width, by = nb.y * canvas.height;
      ctx.strokeStyle = (a === 'pi' || b === 'pi') && deployed ? '#ff3333' : '#333';
      ctx.lineWidth = (a === 'pi' || b === 'pi') && deployed ? 2 : 1;
      ctx.setLineDash((a === 'pi' || b === 'pi') ? [4, 6] : []);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.setLineDash([]);
    });

    // Nodes
    networkNodes.forEach(node => {
      const nx = node.x * canvas.width, ny = node.y * canvas.height;
      const isPI = node.id === 'pi';

      // Node box
      ctx.fillStyle = isPI ? '#220000' : '#111';
      ctx.strokeStyle = isPI ? (deployed ? '#ff3333' : '#661111') : node.color;
      ctx.lineWidth = isPI && deployed ? 2 : 1.5;
      ctx.beginPath(); ctx.roundRect(nx - 28, ny - 14, 56, 28, 4); ctx.fill(); ctx.stroke();

      // Blink for pi when deployed
      if (isPI && deployed) {
        const blink = Math.sin(waveTime * 4) > 0;
        ctx.fillStyle = blink ? '#ff0000' : '#440000';
        ctx.beginPath(); ctx.arc(nx + 20, ny - 8, 3, 0, Math.PI * 2); ctx.fill();
      }

      // Label
      ctx.fillStyle = isPI ? '#ff3333' : node.color;
      ctx.font = '8px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + 4);
      ctx.textAlign = 'left';
    });

    // Reverse tunnel (phone-home line to top)
    if (deployed) {
      const piNode = getNode('pi');
      const px = piNode.x * canvas.width, py = piNode.y * canvas.height;
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(px, py - 14); ctx.lineTo(px + 30, 10); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff6600'; ctx.font = '7px Orbitron';
      ctx.fillText('C2 TUNNEL', px + 5, 18);

      // Scanning animation
      const scanRadius = ((waveTime * 30) % 80);
      ctx.strokeStyle = `rgba(255, 51, 51, ${0.3 - scanRadius / 300})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, scanRadius, 0, Math.PI * 2); ctx.stroke();
    }

    // Particles
    for (let i = netParticles.length - 1; i >= 0; i--) {
      const p = netParticles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.015;
      if (p.life <= 0) { netParticles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color || '#33ff33';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 2.5, 0, Math.PI * 2); ctx.fill();
      if (p.label) { ctx.font = '6px Orbitron'; ctx.fillText(p.label, p.x + 4, p.y - 2); }
      ctx.globalAlpha = 1;
    }

    // Status bar
    const mode = ($('deployModeSelect') || {}).value || 'ethernet';
    ctx.fillStyle = deployed ? 'rgba(255,51,51,0.15)' : 'rgba(51,255,51,0.1)';
    ctx.fillRect(50, canvas.height - 25, canvas.width - 100, 10);
    ctx.fillStyle = deployed ? '#ff3333' : '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`MODE: ${mode.toUpperCase()} | HOSTS: ${discoveredHosts.length}`, 50, canvas.height - 8);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnNetPackets(fromId, toId, count, color) {
  const canvas = $('simCanvas'); if (!canvas) return;
  const from = getNode(fromId), to = getNode(toId);
  if (!from || !to) return;
  const fx = from.x * canvas.width, fy = from.y * canvas.height;
  const tx = to.x * canvas.width, ty = to.y * canvas.height;
  const labels = ['SYN', 'ACK', 'SSH', 'ARP', 'DNS', 'TCP', 'SCAN'];
  for (let i = 0; i < count; i++) {
    const progress = Math.random();
    netParticles.push({
      x: fx + (tx - fx) * progress + (Math.random() - 0.5) * 10,
      y: fy + (ty - fy) * progress + (Math.random() - 0.5) * 10,
      vx: (tx - fx) / 80 + (Math.random() - 0.5) * 0.5,
      vy: (ty - fy) / 80 + (Math.random() - 0.5) * 0.5,
      life: 0.4 + Math.random() * 0.4,
      color: color || '#ff3333',
      size: 2 + Math.random() * 2,
      label: Math.random() > 0.6 ? labels[Math.floor(Math.random() * labels.length)] : null
    });
  }
}

function randomIP() { return `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254) + 1}`; }

function initDropBoxSim() {
  const deployBtn = $('deployBtn'), pivotBtn = $('pivotBtn'), detectBtn = $('detectBtn');
  const dataLog = $('dataLog'), outputDisplay = $('outputDisplay');
  const implantDot = $('implantDot'), implantStatusText = $('implantStatusText');

  let deployInterval = null;

  if (deployBtn) deployBtn.addEventListener('click', () => {
    deployed = !deployed;
    deployBtn.textContent = deployed ? 'Recall Box' : (LANG[currentLang].deployBtn || 'Deploy Box');
    if (implantDot) implantDot.classList.toggle('active', deployed);
    if (implantStatusText) implantStatusText.textContent = deployed ? 'Pi Zero: DEPLOYED' : 'Pi Zero: Offline';
    setStatus(deployed);

    if (deployed) {
      const mode = ($('deployModeSelect') || {}).value || 'ethernet';
      log(`📦 Pi Zero deployed via ${mode} — establishing C2 tunnel...`, 'success');
      showToast('Deploying drop box...', 2000);
      spawnNetPackets('pi', 'sw', 10, '#ff3333');

      setTimeout(() => {
        log('🔗 Reverse SSH tunnel established to C2 server', 'success');
        log(`📡 Obtained IP: ${randomIP()} via DHCP`, 'rx');
      }, 1500);

      deployInterval = setInterval(() => {
        if (!deployed) { clearInterval(deployInterval); return; }
        const ip = randomIP();
        discoveredHosts.push(ip);
        spawnNetPackets('pi', ['srv1', 'srv2', 'ws1'][Math.floor(Math.random() * 3)], 4, '#ff3333');
        if (dataLog) {
          dataLog.textContent = discoveredHosts.slice(-8).map((h, i) =>
            `[${new Date().toLocaleTimeString()}] Host ${i + 1}: ${h} — port scan in progress`
          ).join('\n');
        }
        log(`📡 Host discovered: ${ip}`, 'rx');
      }, 3000);
    } else {
      if (deployInterval) clearInterval(deployInterval);
      log('⬛ Pi Zero recalled — tunnel closed', 'info');
    }
  });

  if (pivotBtn) pivotBtn.addEventListener('click', () => {
    if (!deployed) { log('Deploy the drop box first', 'error'); return; }
    showToast('Pivoting through internal network...', 2500);
    log('🔓 Pivoting via Pi Zero to internal subnets...', 'info');
    spawnNetPackets('pi', 'srv1', 8, '#ff6600');
    spawnNetPackets('pi', 'srv2', 8, '#ff6600');
    spawnNetPackets('pi', 'ws1', 8, '#ff6600');

    setTimeout(() => {
      const results = [
        'PIVOT RESULTS',
        '══════════════════',
        `Hosts discovered: ${discoveredHosts.length}`,
        `Subnets reached: 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24`,
        `Open services found:`,
        `  10.0.0.1  — SSH (22), HTTP (80)`,
        `  10.0.1.15 — SMB (445), RDP (3389)`,
        `  10.0.2.30 — MySQL (3306), HTTP (8080)`,
        '',
        `Credentials captured: 3 NTLM hashes`,
        `Data exfiltrated: 12.4 MB`,
        `Tunnel latency: ${(20 + Math.random() * 80).toFixed(0)}ms`
      ].join('\n');
      if (outputDisplay) outputDisplay.textContent = results;
      log('🔓 Pivot complete — 3 subnets reached, services enumerated', 'success');
      hideToast();
    }, 2000);
  });

  if (detectBtn) detectBtn.addEventListener('click', () => {
    showToast('Running network anomaly detection...', 2500);
    log('🛡️ Scanning for unauthorized devices on network...', 'info');
    spawnNetPackets('gw', 'sw', 15, '#4488ff');

    setTimeout(() => {
      const found = deployed;
      const defenses = found ? [
        '⚠️ ROGUE DEVICE DETECTED',
        '══════════════════',
        'MAC: B8:27:EB:xx:xx:xx (Raspberry Pi)',
        'IP: 10.0.0.247 (DHCP assigned)',
        `Port: Switch port 24 (unauthorized)`,
        'Suspicious: Reverse SSH tunnel to external IP',
        'Traffic: ARP scanning detected',
        '',
        'RECOMMENDED ACTIONS:',
        '• Isolate switch port immediately',
        '• Enable 802.1X port authentication',
        '• Review physical access logs',
        '• Forensic image the device'
      ] : [
        '✅ NETWORK CLEAN',
        '══════════════════',
        'All devices authenticated via 802.1X',
        'No rogue MAC addresses detected',
        'No unauthorized tunnels found',
        'ARP table consistent',
        '',
        'DEFENSES ACTIVE:',
        '• 802.1X port auth enabled',
        '• DHCP snooping active',
        '• Dynamic ARP inspection ON',
        '• Port security: sticky MAC'
      ];
      if (outputDisplay) outputDisplay.textContent = defenses.join('\n');
      log(found ? '🚨 Rogue Raspberry Pi detected on port 24!' : '✅ Network clean — no rogue devices', found ? 'error' : 'success');
      hideToast();
    }, 2000);
  });

  const sweepBtn = $('sweepBtn');
  if (sweepBtn) sweepBtn.addEventListener('click', () => {
    spawnNetPackets('sw', 'srv1', 8, '#d4a03c');
    spawnNetPackets('sw', 'srv2', 8, '#d4a03c');
    spawnNetPackets('sw', 'ws1', 8, '#d4a03c');
    log('📡 Network topology scan initiated...', 'info');
    showToast('Mapping network topology...', 3000);
    let step = 0;
    const phases = ['ARP discovery', 'Port scanning (top 100)', 'Service enumeration', 'OS fingerprinting', 'Vulnerability scan'];
    const iv = setInterval(() => {
      if (step < phases.length) {
        if (dataLog) dataLog.textContent += `\n[SCAN] ${phases[step]}...`;
        step++;
      } else {
        clearInterval(iv);
        log('📡 Network scan complete', 'success');
      }
    }, 500);
  });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  $('clearLogBtn') && ($('clearLogBtn').onclick = clearLog); $('copyLogBtn') && ($('copyLogBtn').onclick = copyLog); $('exportLogBtn') && ($('exportLogBtn').onclick = exportLog);
  initLogFilters();
  $('helpBtn') && ($('helpBtn').onclick = openHelp); $('helpCloseBtn') && ($('helpCloseBtn').onclick = closeHelp); $('helpOverlay') && ($('helpOverlay').onclick = closeHelp); initHelpTabs();
  $('settingsBtn') && ($('settingsBtn').onclick = openSettings); $('settingsCloseBtn') && ($('settingsCloseBtn').onclick = closeSettings); $('settingsOverlay') && ($('settingsOverlay').onclick = closeSettings);
  $('logBtn') && ($('logBtn').onclick = toggleLog); $('logCloseBtn') && ($('logCloseBtn').onclick = closeLog);
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}
  initHijriDate(); initSimCanvas(); initDropBoxSim();
  log(LANG[currentLang].ready, 'success');
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
