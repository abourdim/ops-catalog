/**
 * Quantum Tunneling Radio — Workshop DIY v1.0
 * Full canvas-based quantum tunneling simulation with wave packets,
 * potential barriers, transmission/reflection coefficients, probability density.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 70 Q30 70 40 50 Q50 30 50 50 Q50 70 60 50 Q70 30 90 70" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="d" values="M10 70 Q30 70 40 50 Q50 30 50 50 Q50 70 60 50 Q70 30 90 70;M10 50 Q30 50 40 30 Q50 10 50 50 Q50 90 60 70 Q70 50 90 50;M10 70 Q30 70 40 50 Q50 30 50 50 Q50 70 60 50 Q70 30 90 70" dur="2s" repeatCount="indefinite"/></path><rect x="42" y="25" width="16" height="50" fill="currentColor" opacity=".15" rx="2"/></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false; const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08; const t = audioCtx.currentTime; if (type === 'click') { o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); } else if (type === 'success') { o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); } else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); } }

const LANG = {
  en: {
    title: 'Quantum Tunneling Radio', subtitle: '🌀 RF through quantum barriers',
    disconnected: 'Offline', connected: 'Tunneling',
    mainSection: 'Quantum Tunneling Radio', mainDesc: 'Simulate RF wave tunneling through quantum potential barriers',
    sectionA: 'Tunneling Analysis', sectionB: 'Probability Density', sectionC: 'Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language', help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is quantum tunneling?', faq_a1: 'A quantum phenomenon where particles pass through energy barriers they classically couldn\'t overcome.',
    faq_q2: 'Can radio waves tunnel?', faq_a2: 'EM waves exhibit evanescent wave coupling through sub-wavelength barriers, analogous to quantum tunneling.',
    faq_q3: 'What affects tunneling probability?', faq_a3: 'Barrier width, height, and particle energy. Thinner barriers increase tunneling.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser. No data is sent anywhere.',
    howto_1: 'Select a barrier type.', howto_2: 'Adjust barrier height and wave energy.',
    howto_3: 'Click Start to see wave packets hitting the barrier.', howto_4: 'Watch transmitted and reflected components.',
    wiki_t1: '🌀 Quantum Tunneling', wiki_d1: 'The wave function penetrates classically forbidden regions.',
    wiki_t2: '📐 WKB Approximation', wiki_d2: 'T ~ exp(-2 integral sqrt(2m(V-E))/hbar dx).',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '🌀 Tunneling Radio ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    barrierType: 'Barrier Type', barrierHeight: 'Barrier Height (eV)', waveEnergy: 'Wave Energy (eV)',
    startSim: '▶ Start', stopSim: '⏹ Stop', resetSim: '↺ Reset',
    transmission: 'Transmission:', reflection: 'Reflection:', tunnelProb: 'Tunnel Probability:',
    decayLength: 'Decay Length:', phaseShift: 'Phase Shift:', dwellTime: 'Dwell Time:',
    theoryIntro: 'Quantum tunneling allows particles to pass through classically forbidden barriers:',
    theory1: 'Wave function decays exponentially inside the barrier',
    theory2: 'Transmission depends on barrier width and height vs energy',
    theory3: 'The Hartman effect: tunneling time can appear instantaneous',
    theory4: 'Resonant tunneling through double barriers creates peaks',
    theory5: 'No classical analog — purely quantum mechanical',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '🌀 Tunneling active', simStopped: '⏹ Stopped', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  fr: {
    title: 'Radio Tunnel Quantique', subtitle: '🌀 RF à travers les barrières quantiques',
    disconnected: 'Hors ligne', connected: 'Tunnel actif',
    mainSection: 'Radio Tunnel Quantique', mainDesc: 'Simuler le passage d\'ondes RF à travers des barrières de potentiel quantiques',
    sectionA: 'Analyse du Tunnel', sectionB: 'Densité de Probabilité', sectionC: 'Théorie',
    activityLog: '📜 Journal', eventsMsg: 'Événements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue', help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que l\'effet tunnel ?', faq_a1: 'Un phénomène quantique où les particules traversent des barrières d\'énergie.',
    faq_q2: 'Les ondes radio peuvent-elles tunneler ?', faq_a2: 'Les ondes EM présentent un couplage évanescent à travers les barrières.',
    faq_q3: 'Qu\'affecte la probabilité de tunnel ?', faq_a3: 'Largeur et hauteur de la barrière, et énergie de la particule.',
    faq_q4: 'Mes données sont-elles privées ?', faq_a4: 'Oui. Tout fonctionne localement dans ton navigateur.',
    howto_1: 'Choisissez un type de barrière.', howto_2: 'Ajustez la hauteur et l\'énergie.',
    howto_3: 'Cliquez Démarrer.', howto_4: 'Observez les composantes transmises et réfléchies.',
    wiki_t1: '🌀 Effet Tunnel Quantique', wiki_d1: 'La fonction d\'onde pénètre les régions classiquement interdites.',
    wiki_t2: '📐 Approximation WKB', wiki_d2: 'T ~ exp(-2 intégrale sqrt(2m(V-E))/hbar dx).',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '🌀 Radio tunnel prête !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    barrierType: 'Type de Barrière', barrierHeight: 'Hauteur (eV)', waveEnergy: 'Énergie (eV)',
    startSim: '▶ Démarrer', stopSim: '⏹ Arrêter', resetSim: '↺ Réinitialiser',
    transmission: 'Transmission :', reflection: 'Réflexion :', tunnelProb: 'Probabilité :',
    decayLength: 'Longueur de décroissance :', phaseShift: 'Déphasage :', dwellTime: 'Temps de séjour :',
    theoryIntro: 'L\'effet tunnel quantique permet aux particules de traverser des barrières :',
    theory1: 'La fonction d\'onde décroît exponentiellement dans la barrière',
    theory2: 'La transmission dépend de la largeur et la hauteur vs l\'énergie',
    theory3: 'Effet Hartman : le temps de tunnel peut sembler instantané',
    theory4: 'Le tunnel résonant crée des pics de transmission',
    theory5: 'Pas d\'analogue classique — purement mécanique quantique',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '🌀 Tunnel actif', simStopped: '⏹ Arrêté', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  ar: {
    title: 'راديو النفق الكمي', subtitle: '🌀 RF عبر الحواجز الكمية',
    disconnected: 'غير متصل', connected: 'نفق نشط',
    mainSection: 'راديو النفق الكمي', mainDesc: 'محاكاة نفق موجات RF عبر حواجز الجهد الكمية',
    sectionA: 'تحليل النفق', sectionB: 'كثافة الاحتمال', sectionC: 'النظرية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة', help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    faq_q1: 'ما هو النفق الكمي؟', faq_a1: 'ظاهرة كمية تمر فيها الجسيمات عبر حواجز طاقة لا يمكن تجاوزها كلاسيكياً.',
    faq_q2: 'هل يمكن لموجات الراديو أن تنفق؟', faq_a2: 'تظهر الموجات الكهرومغناطيسية اقتراناً تلاشوياً عبر الحواجز.',
    faq_q3: 'ما الذي يؤثر على احتمال النفق؟', faq_a3: 'عرض وارتفاع الحاجز وطاقة الجسيم.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محلياً في متصفحك.',
    howto_1: 'اختر نوع الحاجز.', howto_2: 'اضبط ارتفاع الحاجز وطاقة الموجة.',
    howto_3: 'اضغط ابدأ لرؤية حزم الموجات.', howto_4: 'شاهد المكونات المنقولة والمنعكسة.',
    wiki_t1: '🌀 النفق الكمي', wiki_d1: 'دالة الموجة تخترق المناطق المحظورة كلاسيكياً.',
    wiki_t2: '📐 تقريب WKB', wiki_d2: 'T ~ exp(-2 تكامل sqrt(2m(V-E))/hbar dx).',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '🌀 راديو النفق جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    barrierType: 'نوع الحاجز', barrierHeight: 'ارتفاع الحاجز (eV)', waveEnergy: 'طاقة الموجة (eV)',
    startSim: '▶ ابدأ', stopSim: '⏹ إيقاف', resetSim: '↺ إعادة',
    transmission: 'النقل:', reflection: 'الانعكاس:', tunnelProb: 'احتمال النفق:',
    decayLength: 'طول الاضمحلال:', phaseShift: 'إزاحة الطور:', dwellTime: 'وقت المكوث:',
    theoryIntro: 'النفق الكمي يسمح للجسيمات بالمرور عبر الحواجز المحظورة كلاسيكياً:',
    theory1: 'دالة الموجة تتلاشى أسياً داخل الحاجز',
    theory2: 'النقل يعتمد على عرض وارتفاع الحاجز مقابل الطاقة',
    theory3: 'تأثير هارتمان: وقت النفق يمكن أن يبدو فورياً',
    theory4: 'النفق الرنيني عبر حواجز مزدوجة يخلق قمم نقل',
    theory5: 'لا يوجد نظير كلاسيكي — ظاهرة ميكانيكية كمية بحتة',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '🌀 النفق نشط', simStopped: '⏹ توقف', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
  }
};

let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { try { await navigator.clipboard.writeText(Array.from(($('logContainer')||{children:[]}).children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const lc = $('logContainer'); if (!lc) return; const t = Array.from(lc.children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'tunneling-log.txt'; a.click(); URL.revokeObjectURL(u); }
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); })); }

/* ═══════════════════════════════════════════════════════
   QUANTUM TUNNELING — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════ */

let running = false, animFrame = null;
const wavePackets = [];
const tunnelParticles = [];

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* Barrier potential function */
function barrierPotential(x, type, w, barrierH) {
  const bStart = w * 0.4, bEnd = w * 0.6, bMid = w * 0.5;
  const bWidth = bEnd - bStart;
  switch (type) {
    case 'square': return (x >= bStart && x <= bEnd) ? barrierH : 0;
    case 'gaussian': { const sigma = bWidth * 0.3; return barrierH * Math.exp(-0.5 * ((x - bMid) / sigma) ** 2); }
    case 'double': {
      const w1s = w * 0.35, w1e = w * 0.42, w2s = w * 0.58, w2e = w * 0.65;
      if ((x >= w1s && x <= w1e) || (x >= w2s && x <= w2e)) return barrierH;
      return 0;
    }
    case 'step': return x >= bMid ? barrierH * 0.7 : 0;
    default: return 0;
  }
}

/* Draw the main tunneling simulation */
function drawTunneling(ctx, w, h, type, barrierH, energy, time) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const midY = h * 0.5;
  const vScale = h * 0.35;

  // Draw potential barrier
  ctx.beginPath();
  ctx.moveTo(0, midY);
  for (let x = 0; x < w; x += 2) {
    const v = barrierPotential(x, type, w, barrierH / 10);
    ctx.lineTo(x, midY - v * vScale / 5);
  }
  ctx.lineTo(w, midY); ctx.closePath();
  ctx.fillStyle = 'rgba(200, 50, 50, 0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 80, 80, 0.5)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 2) {
    const v = barrierPotential(x, type, w, barrierH / 10);
    if (x === 0) ctx.moveTo(x, midY - v * vScale / 5); else ctx.lineTo(x, midY - v * vScale / 5);
  }
  ctx.stroke();

  // Energy level line
  const eLevel = (energy / 10) * vScale / 5;
  ctx.strokeStyle = 'rgba(100, 255, 100, 0.3)'; ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(0, midY - eLevel); ctx.lineTo(w, midY - eLevel); ctx.stroke();
  ctx.setLineDash([]);

  // Incoming wave function (real + imaginary parts)
  const k = energy * 0.15;
  const amplitude = h * 0.15;
  const packetWidth = 80;
  const packetCenter = ((time * 60) % (w * 1.5)) - w * 0.3;

  // Real part (blue)
  ctx.strokeStyle = 'rgba(80, 150, 255, 0.8)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const env = Math.exp(-0.5 * ((x - packetCenter) / packetWidth) ** 2);
    const barrier = barrierPotential(x, type, w, barrierH / 10);
    const E = energy / 10;
    let amp;
    if (barrier > E && barrier > 0) {
      const kappa = Math.sqrt(Math.abs(barrier - E)) * 3;
      const distInBarrier = Math.max(0, x - w * 0.4);
      amp = env * Math.cos(k * x - time * 8) * Math.exp(-kappa * distInBarrier * 0.01) * 0.5;
    } else {
      amp = env * Math.cos(k * x - time * 8);
    }
    const y = midY - amp * amplitude;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Imaginary part (orange)
  ctx.strokeStyle = 'rgba(255, 180, 50, 0.5)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const env = Math.exp(-0.5 * ((x - packetCenter) / packetWidth) ** 2);
    const barrier = barrierPotential(x, type, w, barrierH / 10);
    const E = energy / 10;
    let amp;
    if (barrier > E && barrier > 0) {
      const kappa = Math.sqrt(Math.abs(barrier - E)) * 3;
      const distInBarrier = Math.max(0, x - w * 0.4);
      amp = env * Math.sin(k * x - time * 8) * Math.exp(-kappa * distInBarrier * 0.01) * 0.5;
    } else {
      amp = env * Math.sin(k * x - time * 8);
    }
    const y = midY - amp * amplitude;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Reflected wave (after packet passes barrier)
  if (packetCenter > w * 0.4) {
    const reflAmp = amplitude * (1 - energy / barrierH);
    ctx.strokeStyle = 'rgba(200, 100, 255, 0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    const reflCenter = w * 0.8 - packetCenter * 0.3;
    for (let x = 0; x < w * 0.4; x += 1) {
      const env = Math.exp(-0.5 * ((x - reflCenter) / (packetWidth * 0.7)) ** 2);
      const y = midY - env * Math.cos(-k * x - time * 6) * reflAmp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Tunneling particles
  if (Math.random() < 0.08 && energy > barrierH * 0.3) {
    tunnelParticles.push({ x: w * 0.4, y: midY + (Math.random() - 0.5) * 30, vx: 1 + Math.random() * 2, vy: (Math.random() - 0.5) * 0.5, life: 1, decay: 0.015 });
  }
  for (let i = tunnelParticles.length - 1; i >= 0; i--) {
    const p = tunnelParticles[i];
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100, 255, 200, ${p.life * 0.7})`; ctx.fill();
    if (p.life <= 0 || p.x > w) tunnelParticles.splice(i, 1);
  }
  while (tunnelParticles.length > 200) tunnelParticles.shift();

  // Labels
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('QUANTUM TUNNELING', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('E = ' + (energy / 10).toFixed(1) + ' eV  V₀ = ' + (barrierH / 10).toFixed(1) + ' eV', 10, 34);
  ctx.fillText('Barrier: ' + type.toUpperCase(), 10, 48);

  // Barrier label
  ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
  ctx.fillText('V₀', w * 0.48, midY - (barrierH / 10) * vScale / 5 - 10);
  ctx.fillStyle = 'rgba(100, 255, 100, 0.4)';
  ctx.fillText('E', 5, midY - eLevel - 5);
}

/* Probability density plot */
function drawProbability(ctx, w, h, type, barrierH, energy, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const midY = h * 0.6;
  const k = energy * 0.15;
  const packetCenter = ((time * 60) % (w * 1.5)) - w * 0.3;
  const packetWidth = 80;

  // Grid
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 10; i++) { const x = (i / 10) * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

  // Barrier region
  ctx.fillStyle = 'rgba(200, 50, 50, 0.1)';
  if (type === 'double') { ctx.fillRect(w * 0.35, 0, w * 0.07, h); ctx.fillRect(w * 0.58, 0, w * 0.07, h); }
  else if (type === 'step') { ctx.fillRect(w * 0.5, 0, w * 0.5, h); }
  else { ctx.fillRect(w * 0.4, 0, w * 0.2, h); }

  // |ψ|² probability density
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const env = Math.exp(-((x - packetCenter) / packetWidth) ** 2);
    const barrier = barrierPotential(x, type, w, barrierH / 10);
    const E = energy / 10;
    let prob;
    if (barrier > E && barrier > 0) {
      const kappa = Math.sqrt(Math.abs(barrier - E)) * 3;
      const dist = Math.max(0, x - w * 0.4);
      prob = env * Math.exp(-kappa * dist * 0.02) * 0.3;
    } else {
      prob = env;
    }
    const y = midY - prob * h * 0.5;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill under curve
  ctx.lineTo(w, midY); ctx.lineTo(0, midY); ctx.closePath();
  ctx.fillStyle = `rgba(212, 160, 60, 0.15)`;
  ctx.fill();

  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('|ψ(x)|² Probability Density', 8, 14);
}

/* Update metrics */
function updateMetrics(barrierH, energy, type) {
  const E = energy / 10, V0 = barrierH / 10;
  const ratio = E / V0;
  const T = ratio >= 1 ? 1 / (1 + V0 * V0 / (4 * E * (E - V0) + 0.01)) : Math.exp(-2 * Math.sqrt(2 * Math.abs(V0 - E)) * 2);
  const R = 1 - T;
  const kappa = Math.sqrt(2 * Math.abs(V0 - E) + 0.01);
  const decayLen = 1 / (kappa + 0.01);
  const phase = Math.atan2(kappa, Math.sqrt(2 * E + 0.01));
  const dwell = decayLen / (Math.sqrt(2 * E + 0.01) + 0.01);

  const tv = $('transVal'); if (tv) tv.textContent = (T * 100).toFixed(2) + '%';
  const rv = $('reflVal'); if (rv) rv.textContent = (R * 100).toFixed(2) + '%';
  const pv = $('probVal'); if (pv) pv.textContent = T.toExponential(3);
  const dv = $('decayVal'); if (dv) dv.textContent = decayLen.toFixed(3) + ' nm';
  const phv = $('phaseVal'); if (phv) phv.textContent = (phase * 180 / Math.PI).toFixed(1) + '°';
  const dwv = $('dwellVal'); if (dwv) dwv.textContent = (dwell * 1e15).toFixed(2) + ' fs';
}

let simCtx, simW, simH, anaCtx, anaW, anaH;
function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const type = $('barrierType') ? $('barrierType').value : 'square';
  const barrierH = $('heightSlider') ? +$('heightSlider').value : 50;
  const energy = $('energySlider') ? +$('energySlider').value : 30;

  if (simCtx) drawTunneling(simCtx, simW, simH, type, barrierH, energy, time);
  if (anaCtx) drawProbability(anaCtx, anaW, anaH, type, barrierH, energy, time);
  if (Math.floor(time * 5) % 5 === 0) updateMetrics(barrierH, energy, type);

  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
  log(LANG[currentLang].simStarted, 'success'); simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); tunnelParticles.length = 0;
  [$('simCanvas'), $('analysisCanvas')].forEach(c => { if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['transVal', 'reflVal', 'probVal', 'decayVal', 'phaseVal', 'dwellVal'].forEach(id => { const e = $(id); if (e) e.textContent = '--'; });
  log(LANG[currentLang].simReset, 'info');
}

function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog; $('exportLogBtn').onclick = exportLog;
  initLogFilters();
  $('helpBtn').onclick = openHelp; $('helpCloseBtn').onclick = closeHelp; $('helpOverlay').onclick = closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick = openSettings; $('settingsCloseBtn').onclick = closeSettings; $('settingsOverlay').onclick = closeSettings;
  $('logBtn').onclick = toggleLog; $('logCloseBtn').onclick = closeLog;
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  $('langSelect').onchange = function () { setLanguage(this.value); };
  $('themeSelect').onchange = function () { setTheme(this.value); };
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  initHijriDate();
  $('startBtn').onclick = startSim; $('stopBtn').onclick = stopSim; $('resetBtn').onclick = resetSim;
  $('heightSlider').oninput = function () { $('heightVal').textContent = (this.value / 10).toFixed(1) + ' eV'; };
  $('energySlider').oninput = function () { $('energyVal').textContent = (this.value / 10).toFixed(1) + ' eV'; };
  window.addEventListener('resize', () => { if (running) { const sc = $('simCanvas'), ac = $('analysisCanvas'); if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; } if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; } } });
  log(LANG[currentLang].ready, 'success');
}
document.addEventListener('DOMContentLoaded', init);
