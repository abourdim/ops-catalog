/**
 * imp-lan-turtle-builder — Workshop DIY
 * LAN Turtle covert network implant simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="30" ry="20" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="50" cy="55" rx="20" ry="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="50" cy="52" r="5" fill="currentColor" opacity=".5"/><circle cx="42" cy="48" r="2" fill="currentColor"/><circle cx="58" cy="48" r="2" fill="currentColor"/><line x1="25" y1="45" x2="15" y2="35" stroke="currentColor" stroke-width="2"/><line x1="75" y1="45" x2="85" y2="35" stroke="currentColor" stroke-width="2"/><line x1="30" y1="65" x2="20" y2="75" stroke="currentColor" stroke-width="2"/><line x1="70" y1="65" x2="80" y2="75" stroke="currentColor" stroke-width="2"/><rect x="42" y="20" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="50" y1="30" x2="50" y2="43" stroke="currentColor" stroke-width="1.5"/></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08; const t = audioCtx.currentTime; if (type === 'click') { osc.frequency.value = 800; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); } else if (type === 'success') { osc.frequency.value = 523; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); } else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); } }

const LANG = {
  en: { title:'imp-lan-turtle-builder', subtitle:'🐢 implant · 🌐 intercept · 🛡️ detect', disconnected:'Disconnected', connected:'Connected', mainSection:'LAN Turtle Builder — Covert Network Implant Sim', mainDesc:'Build and deploy simulated LAN Turtle implants for network interception training', sectionA:'How It Works', sectionB:'Lab — Network Topology', sectionC:'Challenge', ready:'🐢 LAN Turtle Builder ready — select module!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed', working:'Working…', langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →', splashHint:'tap to skip' ,faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.',step1Title:'Design Implant',step1Desc:'Choose the hardware components and design the covert device.',step2Title:'Build & Program',step2Desc:'Assemble the implant and flash it with the custom firmware.',step3Title:'Deploy',step3Desc:'Install the implant in the target environment undetected.',step4Title:'Monitor & Extract',step4Desc:'Receive data from the implant and extract captured intelligence.'},
  fr: { title:'imp-lan-turtle-builder', subtitle:'🐢 implanter · 🌐 intercepter · 🛡️ détecter', disconnected:'Déconnecté', connected:'Connecté', ready:'🐢 LAN Turtle prêt !', logCleared:'Journal effacé', copied:'Copié !', working:'En cours…', langChanged:'🌐 Langue → Français', themeChanged:'🎨 Thème →', splashHint:'appuyer pour passer' ,faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.',step1Title:'Concevoir l\'implant',step1Desc:'Choisis les composants et conçois le dispositif caché.',step2Title:'Construire et programmer',step2Desc:'Assemble l\'implant et charge le firmware personnalisé.',step3Title:'Déployer',step3Desc:'Installe l\'implant dans l\'environnement cible sans être détecté.',step4Title:'Surveiller et extraire',step4Desc:'Reçois les données de l\'implant et extrais le renseignement.'},
  ar: { title:'imp-lan-turtle-builder', subtitle:'🐢 زرع · 🌐 اعتراض · 🛡️ كشف', disconnected:'غير متصل', connected:'متصل', ready:'🐢 جاهز!', logCleared:'تم المسح', copied:'تم النسخ!', working:'جارٍ…', langChanged:'🌐 العربية', themeChanged:'🎨 →', splashHint:'انقر للتخطي' ,faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',step1Title:'تصميم الزرع',step1Desc:'اختر مكونات العتاد وصمم الجهاز السري.',step2Title:'بناء وبرمجة',step2Desc:'اجمع الزرع وحمّل البرنامج الثابت المخصص.',step3Title:'نشر',step3Desc:'ثبّت الزرع في البيئة المستهدفة دون اكتشاف.',step4Title:'مراقبة واستخراج',step4Desc:'استقبل البيانات من الزرع واستخرج الاستخبارات الملتقطة.'}
};
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.title = `${s.title} — Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; try { localStorage.setItem('wdiy-theme', name); } catch {} log(`${LANG[currentLang].themeChanged} ${name}`, 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' })); a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); }

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }

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

/* ═══════ MATRIX RAIN ═══════ */
let matrixRunning = false, matrixAnim = null;
function toggleMatrix() { const canvas = $('matrixCanvas'); if (!canvas) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; } matrixRunning = true; canvas.classList.add('active'); const ctx = canvas.getContext('2d'); canvas.width = innerWidth; canvas.height = innerHeight; const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1); const chars = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذ01'; (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); })(); }

/* ═══════ APP-SPECIFIC: LAN TURTLE SIM ═══════ */
let particles = [];
let deployed = false;
let capturedPackets = [];

function randomIP() { return `192.168.1.${Math.floor(Math.random() * 254) + 1}`; }
function randomMAC() { return Array.from({length:6}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':'); }

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500; canvas.height = 260;
  let time = 0;

  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    time += 0.02;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    const cx = canvas.width / 2, cy = canvas.height / 2;

    // Network switch (center top)
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.strokeRect(cx - 40, 20, 80, 30);
    ctx.fillStyle = accent; ctx.font = '9px Orbitron';
    ctx.fillText('SWITCH', cx - 20, 40);
    // Switch LEDs
    for (let p = 0; p < 6; p++) {
      ctx.fillStyle = (deployed && p === 2) ? '#ff3333' : (Math.random() > 0.3 ? '#33ff33' : '#333');
      ctx.fillRect(cx - 30 + p * 12, 25, 6, 4);
    }

    // Target PC (left)
    ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5;
    ctx.strokeRect(30, cy - 20, 50, 35);
    ctx.fillStyle = '#4488ff'; ctx.font = '8px Orbitron';
    ctx.fillText('TARGET', 35, cy + 28);
    ctx.fillText('PC', 48, cy - 5);

    // Router/Internet (right)
    ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 1.5;
    ctx.strokeRect(canvas.width - 80, cy - 20, 50, 35);
    ctx.fillStyle = '#33ff33'; ctx.font = '8px Orbitron';
    ctx.fillText('ROUTER', canvas.width - 78, cy + 28);
    ctx.fillText('GW', canvas.width - 64, cy - 5);

    // LAN Turtle (inline between PC and switch)
    if (deployed) {
      const tx = 120, ty = cy;
      ctx.fillStyle = '#220000'; ctx.fillRect(tx - 18, ty - 12, 36, 24);
      ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 2; ctx.strokeRect(tx - 18, ty - 12, 36, 24);
      ctx.fillStyle = '#ff3333'; ctx.font = '7px Orbitron';
      ctx.fillText('TURTLE', tx - 16, ty + 4);

      // Connection lines through turtle
      ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(80, cy); ctx.lineTo(tx - 18, ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx + 18, ty); ctx.lineTo(cx - 40, 50); ctx.stroke();
      ctx.setLineDash([]);

      // Reverse tunnel to C2
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(tx, ty + 12); ctx.lineTo(tx, canvas.height - 30);
      ctx.lineTo(canvas.width - 40, canvas.height - 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff6600'; ctx.font = '7px Orbitron';
      ctx.fillText('C2 TUNNEL', canvas.width - 90, canvas.height - 20);
      ctx.strokeRect(canvas.width - 50, canvas.height - 45, 35, 20);
      ctx.fillText('C2', canvas.width - 42, canvas.height - 32);

      // Module label
      const mod = ($('moduleSelect') || {}).value || 'autossh';
      ctx.fillStyle = '#ff3333'; ctx.font = '8px Orbitron';
      ctx.fillText(`[${mod.toUpperCase()}]`, tx - 25, ty - 18);
    } else {
      // Direct connection (no turtle)
      ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(80, cy); ctx.lineTo(cx - 40, 50); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Switch to router connection
    ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(cx + 40, 35); ctx.lineTo(canvas.width - 80, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      if (p.life <= 0 || p.x > canvas.width + 10 || p.x < -10) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color || '#33ff33'; ctx.fill(); ctx.globalAlpha = 1;
    }

    // Bandwidth bar
    const bw = parseInt(($('bwSlider') || {}).value || '50');
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(30, canvas.height - 18, (canvas.width - 60) * (bw / 100), 8);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`BW: ${bw} Mbps | Packets: ${capturedPackets.length}`, 30, canvas.height - 4);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnPackets(count, color, fromX, fromY) {
  const canvas = $('simCanvas'); if (!canvas) return;
  for (let i = 0; i < count; i++) {
    particles.push({ x: (fromX || 100) + Math.random() * 15, y: (fromY || canvas.height / 2) - 10 + Math.random() * 20, vx: (Math.random() - 0.3) * 4, vy: (Math.random() - 0.5) * 2, life: 0.5 + Math.random() * 0.5, color: color || '#33ff33', size: 2 + Math.random() * 2 });
  }
}

function initLanTurtleSim() {
  const deployBtn = $('deployBtn'), analyzeBtn = $('analyzeBtn'), defendBtn = $('defendBtn');
  const bwSlider = $('bwSlider'), bwValue = $('bwValue');
  const outputDisplay = $('outputDisplay'), dataLog = $('dataLog');
  const implantDot = $('implantDot'), implantStatusText = $('implantStatusText');

  if (bwSlider && bwValue) bwSlider.addEventListener('input', () => { bwValue.textContent = bwSlider.value + ' Mbps'; });

  // Deploy
  if (deployBtn) deployBtn.addEventListener('click', () => {
    deployed = !deployed;
    deployBtn.textContent = deployed ? 'Remove Turtle' : 'Deploy Turtle';
    if (implantDot) implantDot.classList.toggle('active', deployed);
    if (implantStatusText) implantStatusText.textContent = deployed ? 'Turtle: DEPLOYED' : 'Turtle: Offline';
    setStatus(deployed);
    const mod = ($('moduleSelect') || {}).value || 'autossh';

    if (deployed) {
      log(`🐢 LAN Turtle deployed with ${mod} module`, 'success');
      showToast('Deploying turtle...', 1500);
      spawnPackets(20, '#ff3333', 120, 130);

      // Start capturing packets
      const captureIv = setInterval(() => {
        if (!deployed) { clearInterval(captureIv); return; }
        const pkt = { src: randomIP(), dst: randomIP(), proto: ['TCP', 'UDP', 'HTTP', 'DNS', 'ARP'][Math.floor(Math.random() * 5)], size: Math.floor(Math.random() * 1400) + 64, time: new Date().toLocaleTimeString() };
        capturedPackets.push(pkt);
        spawnPackets(2, pkt.proto === 'DNS' ? '#ff6600' : '#33ff33', 120, 130);
        if (dataLog) dataLog.textContent = capturedPackets.slice(-12).map(p => `[${p.time}] ${p.proto} ${p.src} → ${p.dst} (${p.size}B)`).join('\n');
        log(`🐢 Captured: ${pkt.proto} ${pkt.src} → ${pkt.dst}`, 'rx');
      }, 2000);
    } else {
      log('🐢 LAN Turtle removed from network', 'info');
      capturedPackets = [];
    }
  });

  // Network scan
  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    showToast('Scanning network...', 2500);
    log('🌐 Network scan initiated...', 'info');
    spawnPackets(20, '#4488ff');
    let step = 0;
    const hosts = [];
    const scanIv = setInterval(() => {
      if (step < 8) {
        const ip = randomIP();
        const mac = randomMAC();
        hosts.push({ ip, mac, vendor: ['Dell', 'Intel', 'Realtek', 'Cisco', 'TP-Link', 'UNKNOWN'][Math.floor(Math.random() * 6)] });
        if (dataLog) dataLog.textContent = hosts.map(h => `${h.ip} ${h.mac} [${h.vendor}]`).join('\n');
        log(`🌐 Host found: ${ip} (${mac})`, 'rx');
        step++;
      } else {
        clearInterval(scanIv);
        const suspicious = hosts.filter(h => h.vendor === 'UNKNOWN');
        if (outputDisplay) outputDisplay.textContent = [`NETWORK SCAN RESULTS`, `═══════════════`, `Hosts found: ${hosts.length}`, `Suspicious: ${suspicious.length}`, '', ...hosts.map(h => `${h.ip.padEnd(16)} ${h.mac} [${h.vendor}]`), '', suspicious.length > 0 ? `⚠️ UNKNOWN vendor detected — possible implant` : '✅ All devices verified'].join('\n');
        log(`🌐 Scan complete — ${hosts.length} hosts, ${suspicious.length} suspicious`, suspicious.length > 0 ? 'error' : 'success');
        hideToast();
      }
    }, 400);
  });

  // Detect implant
  if (defendBtn) defendBtn.addEventListener('click', () => {
    showToast('Running implant detection...', 2500);
    log('🛡️ Implant detection scan...', 'info');
    spawnPackets(15, '#33ff33');
    setTimeout(() => {
      const detected = deployed || Math.random() > 0.5;
      if (outputDisplay) outputDisplay.textContent = detected ? [
        '⚠️ IMPLANT DETECTED!', '═══════════════',
        'Type: Inline Ethernet Implant',
        'MAC: ' + randomMAC() + ' (UNKNOWN)',
        'Extra DHCP lease detected',
        'Unusual ARP responses from port 3',
        'SSH traffic on non-standard port',
        '', 'Action: Isolate port, investigate device'
      ].join('\n') : [
        '✅ NO IMPLANTS DETECTED', '═══════════════',
        'All switch ports verified',
        'MAC table consistent',
        'No unusual ARP/DHCP activity',
        '802.1X authentication: Active',
        '', 'Network status: CLEAN'
      ].join('\n');
      log(detected ? '🚨 Inline implant detected on switch port 3!' : '✅ Network clean', detected ? 'error' : 'success');
      hideToast();
    }, 2000);
  });

  // Packet capture button
  const packetScanBtn = $('packetScanBtn');
  if (packetScanBtn) packetScanBtn.addEventListener('click', () => {
    spawnPackets(30, '#d4a03c');
    log('📡 Packet capture started...', 'info');
    showToast('Capturing...', 2000);
    let count = 0;
    const iv = setInterval(() => {
      if (count < 10) {
        const pkt = { src: randomIP(), dst: randomIP(), proto: ['TCP', 'UDP', 'DNS', 'HTTP'][Math.floor(Math.random() * 4)], size: Math.floor(Math.random() * 1400) + 64, time: new Date().toLocaleTimeString() };
        capturedPackets.push(pkt);
        if (dataLog) dataLog.textContent = capturedPackets.slice(-12).map(p => `[${p.time}] ${p.proto} ${p.src} → ${p.dst} (${p.size}B)`).join('\n');
        count++;
      } else { clearInterval(iv); log('📡 Capture complete — ' + capturedPackets.length + ' packets', 'success'); }
    }, 300);
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
  initHijriDate(); initSimCanvas(); initLanTurtleSim();
  log(LANG[currentLang].ready, 'success');
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
