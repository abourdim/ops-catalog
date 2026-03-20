/**
 * imp-supply-chain-backdoor — Workshop DIY
 * Supply chain hardware backdoor / interdiction simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="30" width="70" height="45" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><line x1="15" y1="45" x2="85" y2="45" stroke="currentColor" stroke-width="1.5"/><circle cx="75" cy="38" r="3" fill="currentColor"/><rect x="30" y="50" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="55" y="50" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="43" cy="55" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="25" y="20" width="15" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="32" y1="30" x2="32" y2="45" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/><rect x="70" y="65" width="8" height="5" rx="1" fill="currentColor" opacity=".6"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false; const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08; const t = audioCtx.currentTime; if (type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)} else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)} else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)} }

const LANG = {
  en: { title:'imp-supply-chain-backdoor', subtitle:'📦 intercept · 🔬 implant · 🛡️ verify', disconnected:'Disconnected', connected:'Connected', mainSection:'Supply Chain Backdoor — Hardware Interdiction Sim', mainDesc:'Simulate supply chain interdiction attacks and learn hardware verification techniques', sectionA:'How It Works', sectionB:'Lab — Motherboard Inspector', sectionC:'Challenge', ready:'📦 Supply Chain Backdoor sim ready!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed', working:'Working…', langChanged:'🌐 English', themeChanged:'🎨 Theme →', splashHint:'tap to skip' ,faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.',step1Title:'Design Implant',step1Desc:'Choose the hardware components and design the covert device.',step2Title:'Build & Program',step2Desc:'Assemble the implant and flash it with the custom firmware.',step3Title:'Deploy',step3Desc:'Install the implant in the target environment undetected.',step4Title:'Monitor & Extract',step4Desc:'Receive data from the implant and extract captured intelligence.',sectionCode:'Device Code'},
  fr: { title:'imp-supply-chain-backdoor', subtitle:'📦 intercepter · 🔬 implanter · 🛡️ vérifier', disconnected:'Déconnecté', connected:'Connecté', ready:'📦 Simulation prête !', logCleared:'Journal effacé', copied:'Copié !', working:'En cours…', langChanged:'🌐 Français', themeChanged:'🎨 Thème →', splashHint:'appuyer pour passer' ,faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.',step1Title:'Concevoir l\'implant',step1Desc:'Choisis les composants et conçois le dispositif caché.',step2Title:'Construire et programmer',step2Desc:'Assemble l\'implant et charge le firmware personnalisé.',step3Title:'Déployer',step3Desc:'Installe l\'implant dans l\'environnement cible sans être détecté.',step4Title:'Surveiller et extraire',step4Desc:'Reçois les données de l\'implant et extrais le renseignement.',sectionCode:'Code Appareil'},
  ar: { title:'imp-supply-chain-backdoor', subtitle:'📦 اعتراض · 🔬 زرع · 🛡️ تحقق', disconnected:'غير متصل', connected:'متصل', ready:'📦 جاهز!', logCleared:'تم المسح', copied:'تم النسخ!', working:'جارٍ…', langChanged:'🌐 العربية', themeChanged:'🎨 →', splashHint:'انقر للتخطي' ,faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',step1Title:'تصميم الزرع',step1Desc:'اختر مكونات العتاد وصمم الجهاز السري.',step2Title:'بناء وبرمجة',step2Desc:'اجمع الزرع وحمّل البرنامج الثابت المخصص.',step3Title:'نشر',step3Desc:'ثبّت الزرع في البيئة المستهدفة دون اكتشاف.',step4Title:'مراقبة واستخراج',step4Desc:'استقبل البيانات من الزرع واستخرج الاستخبارات الملتقطة.',sectionCode:'كود الجهاز'}
};
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.title = `${s.title} — Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; try { localStorage.setItem('wdiy-theme', name); } catch {} log(`${LANG[currentLang].themeChanged} ${name}`, 'info'); }
let logContainer;
function log(msg, type='info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type==='success') playSound('success'); else if (type==='error') playSound('error'); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n')); log(LANG[currentLang].copied,'success'); } catch { log(LANG[currentLang].copyFail,'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'})); a.download=`log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); }
let toastTimer = null;
function showToast(msg, ms=0) { const el=$('toastIndicator'),t=$('toastMessage'); if(el&&t){t.textContent=msg;el.style.display='block'} if(toastTimer) clearTimeout(toastTimer); if(ms>0) toastTimer=setTimeout(hideToast,ms); }
function hideToast() { const el=$('toastIndicator'); if(el) el.style.display='none'; }
function setStatus(c) { const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang]; if(t) t.textContent=c?s.connected:s.disconnected; if(p) p.classList.toggle('connected',c); }
let splashTimer;
function dismissSplash() { const s=$('splash'); if(!s) return; s.classList.add('hidden'); if(splashTimer) clearTimeout(splashTimer); setTimeout(()=>s.remove(),600); }
function initSplash() { const s=$('splash'); if(!s) return; const sl=$('splashLogo'); if(sl) sl.innerHTML=LOGO_SVG; splashTimer=setTimeout(dismissSplash,2500); }
let activeLogFilter='all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();})}); }
function applyLogFilter() { if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none';}); }
function initHijriDate() { const el=$('hijriDate'); if(!el) return; try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{} }
function openPanel(pid,oid) { const s=$(pid),o=$(oid); if(s)s.classList.add('open'); if(o)o.classList.add('open'); }
function closePanel(pid,oid) { const s=$(pid),o=$(oid); if(s)s.classList.remove('open'); if(o)o.classList.remove('open'); }
function openHelp(){openPanel('helpPanel','helpOverlay')} function closeHelp(){closePanel('helpPanel','helpOverlay')}
function openSettings(){openPanel('settingsPanel','settingsOverlay')} function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}
let matrixRunning=false,matrixAnim=null;
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: SUPPLY CHAIN BACKDOOR SIM ═══════ */
let particles = [];
let implanted = false;
let xrayMode = false;

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500; canvas.height = 260;
  let time = 0;

  // Define motherboard components
  const components = [
    { x: 0.15, y: 0.3, w: 0.12, h: 0.15, label: 'CPU', color: '#4488ff' },
    { x: 0.35, y: 0.25, w: 0.08, h: 0.06, label: 'RAM1', color: '#33aa55' },
    { x: 0.35, y: 0.35, w: 0.08, h: 0.06, label: 'RAM2', color: '#33aa55' },
    { x: 0.55, y: 0.2, w: 0.1, h: 0.12, label: 'BMC', color: '#d4a03c' },
    { x: 0.55, y: 0.5, w: 0.12, h: 0.08, label: 'NIC', color: '#8844cc' },
    { x: 0.75, y: 0.3, w: 0.08, h: 0.25, label: 'PCIe', color: '#cc4444' },
    { x: 0.15, y: 0.6, w: 0.15, h: 0.08, label: 'SPI Flash', color: '#dd8833' },
    { x: 0.4, y: 0.65, w: 0.1, h: 0.06, label: 'UART', color: '#666' },
  ];

  // Implant location (near BMC)
  const implant = { x: 0.53, y: 0.18, r: 0.015 };

  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const attack = ($('attackSelect') || {}).value || 'chip-implant';
    time += 0.02;

    // PCB board
    const boardColor = xrayMode ? '#001a33' : '#0a2a0a';
    ctx.fillStyle = boardColor;
    ctx.fillRect(20, 15, canvas.width - 40, canvas.height - 50);
    ctx.strokeStyle = xrayMode ? '#0066cc' : '#1a4a1a';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 15, canvas.width - 40, canvas.height - 50);

    // PCB traces
    ctx.strokeStyle = xrayMode ? 'rgba(0,100,200,0.3)' : 'rgba(100,200,100,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(30, 25 + i * 18);
      ctx.lineTo(canvas.width - 30, 25 + i * 18);
      ctx.stroke();
    }

    // Components
    components.forEach(c => {
      const cx = 20 + c.x * (canvas.width - 40);
      const cy = 15 + c.y * (canvas.height - 50);
      const cw = c.w * (canvas.width - 40);
      const ch = c.h * (canvas.height - 50);

      if (xrayMode) {
        ctx.strokeStyle = c.color; ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, cy, cw, ch);
        ctx.fillStyle = c.color + '22';
        ctx.fillRect(cx, cy, cw, ch);
        // Internal structure lines
        ctx.strokeStyle = c.color + '44'; ctx.lineWidth = 0.5;
        for (let l = 0; l < 3; l++) {
          ctx.beginPath(); ctx.moveTo(cx + 2, cy + 2 + l * (ch / 3));
          ctx.lineTo(cx + cw - 2, cy + 2 + l * (ch / 3)); ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#111'; ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = c.color; ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, cy, cw, ch);
      }
      ctx.fillStyle = c.color; ctx.font = '7px Orbitron';
      ctx.fillText(c.label, cx + 2, cy + ch + 10);
    });

    // Implanted chip (visible in x-ray or when implanted)
    if (implanted) {
      const ix = 20 + implant.x * (canvas.width - 40);
      const iy = 15 + implant.y * (canvas.height - 50);
      const ir = implant.r * canvas.width;

      if (xrayMode) {
        // Clearly visible in X-ray
        ctx.fillStyle = '#ff3333';
        ctx.beginPath(); ctx.arc(ix, iy, ir + 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ix, iy, ir + 6, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ff3333'; ctx.font = '8px Orbitron';
        ctx.fillText('IMPLANT!', ix - 20, iy - ir - 8);
        // Trace from implant to BMC
        ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.moveTo(ix + ir, iy); ctx.lineTo(ix + 20, iy + 15); ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Barely visible on surface
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, Math.PI * 2); ctx.fill();
      }

      // Data exfiltration animation
      if (attack === 'chip-implant') {
        const pulseR = (time * 30) % 40;
        ctx.globalAlpha = 1 - pulseR / 40;
        ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ix, iy, ir + pulseR, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      if (p.life <= 0 || p.x > canvas.width) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color || '#33ff33'; ctx.fill(); ctx.globalAlpha = 1;
    }

    // Info bar
    const zoom = parseInt(($('zoomSlider') || {}).value || '50');
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(20, canvas.height - 22, (canvas.width - 40) * (zoom / 100), 8);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`ZOOM: ${zoom}% | MODE: ${xrayMode ? 'X-RAY' : 'VISUAL'} | ${implanted ? 'COMPROMISED' : 'CLEAN'}`, 25, canvas.height - 4);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnP(n, c, x, y) {
  const canvas = $('simCanvas'); if (!canvas) return;
  for (let i = 0; i < n; i++) particles.push({ x: (x||100)+Math.random()*30, y: (y||100)+Math.random()*30, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 0.5+Math.random()*0.5, color: c||'#33ff33', size: 1.5+Math.random()*2 });
}

function initSupplyChainSim() {
  const interceptBtn=$('interceptBtn'), analyzeBtn=$('analyzeBtn'), defendBtn=$('defendBtn');
  const zoomSlider=$('zoomSlider'), zoomValue=$('zoomValue');
  const outputDisplay=$('outputDisplay'), dataLog=$('dataLog');
  const implantDot=$('implantDot'), implantStatusText=$('implantStatusText');

  if (zoomSlider && zoomValue) zoomSlider.addEventListener('input', () => { zoomValue.textContent = zoomSlider.value + '%'; });

  if (interceptBtn) interceptBtn.addEventListener('click', () => {
    const attack = ($('attackSelect') || {}).value || 'chip-implant';
    implanted = true;
    if (implantDot) implantDot.classList.add('active');
    if (implantStatusText) implantStatusText.textContent = 'Status: COMPROMISED';
    setStatus(true);
    showToast('Intercepting shipment...', 2000);
    spawnP(25, '#ff3333');

    const steps = {
      'chip-implant': ['Intercepting server shipment...','Opening tamper-evident packaging...','Soldering micro-chip near BMC...','Connecting to SPI bus...','Restoring packaging seals...','Chip implant complete — BMC compromised'],
      'firmware-mod': ['Intercepting shipment at distribution...','Extracting SPI flash firmware...','Injecting persistent backdoor code...','Re-flashing modified firmware...','Verifying boot integrity bypass...','Firmware modification complete'],
      'component-swap': ['Identifying target components on BOM...','Sourcing counterfeit ICs from grey market...','Swapping genuine NIC with backdoored clone...','Matching component markings and dates...','Resealing packaging...','Component swap complete — NIC compromised']
    };
    let step = 0;
    const msgs = steps[attack] || steps['chip-implant'];
    const iv = setInterval(() => {
      if (step < msgs.length) {
        if (dataLog) dataLog.textContent = msgs.slice(0, step + 1).join('\n');
        log(`📦 ${msgs[step]}`, step === msgs.length - 1 ? 'error' : 'tx');
        spawnP(5, '#ff3333');
        step++;
      } else {
        clearInterval(iv);
        if (outputDisplay) outputDisplay.textContent = [`INTERDICTION REPORT`, `═══════════════`, `Attack: ${attack.toUpperCase()}`, `Target: ${($('targetInput') || {}).value || 'Server MB'}`, `Status: IMPLANT ACTIVE`, `Detection risk: LOW`, `Persistence: Hardware-level`, `Survives: OS reinstall, firmware update`].join('\n');
      }
    }, 600);
  });

  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    xrayMode = !xrayMode;
    analyzeBtn.textContent = xrayMode ? 'Visual Mode' : 'X-Ray Inspect';
    showToast(xrayMode ? 'X-Ray mode enabled' : 'Visual mode', 1500);
    log(xrayMode ? '🔬 X-Ray inspection mode activated' : '🔬 Switched to visual mode', 'info');
    spawnP(15, '#4488ff');
    if (xrayMode && implanted) {
      setTimeout(() => {
        if (outputDisplay) outputDisplay.textContent = [`⚠️ X-RAY ANOMALY DETECTED!`, `═══════════════`, `Location: Near BMC controller`, `Size: ~1mm x 1mm`, `Type: Unknown IC not on BOM`, `SPI bus connection: Detected`, ``, `RECOMMENDATION: Quarantine board`, `Compare against golden sample`].join('\n');
        log('🚨 X-Ray reveals anomalous component near BMC!', 'error');
      }, 1000);
    }
  });

  if (defendBtn) defendBtn.addEventListener('click', () => {
    showToast('Running integrity verification...', 2500);
    log('🛡️ Hardware integrity verification...', 'info');
    spawnP(20, '#33ff33');
    setTimeout(() => {
      const clean = !implanted;
      if (outputDisplay) outputDisplay.textContent = clean ? [
        '✅ INTEGRITY VERIFIED', '═══════════════',
        'Component count: Matches BOM',
        'Firmware hash: VALID (SHA-256)',
        'TPM attestation: PASSED',
        'X-Ray comparison: MATCH',
        'Packaging seals: INTACT',
        '', 'Board status: TRUSTED'
      ].join('\n') : [
        '⚠️ INTEGRITY CHECK FAILED', '═══════════════',
        'Component count: MISMATCH (+1)',
        'Firmware hash: ' + (($('attackSelect')||{}).value === 'firmware-mod' ? 'MISMATCH' : 'VALID'),
        'TPM attestation: ' + (($('attackSelect')||{}).value === 'chip-implant' ? 'SUSPECT' : 'PASSED'),
        'X-Ray comparison: ANOMALY DETECTED',
        'Packaging seals: RESEALED (UV mismatch)',
        '', 'Board status: COMPROMISED — QUARANTINE'
      ].join('\n');
      log(clean ? '✅ Hardware verified — clean' : '🚨 Integrity check FAILED — backdoor detected', clean ? 'success' : 'error');
      hideToast();
    }, 2000);
  });

  const xrayBtn = $('xrayBtn');
  if (xrayBtn) xrayBtn.addEventListener('click', () => {
    xrayMode = true;
    spawnP(30, '#0066cc');
    log('🔬 Deep X-Ray scan initiated...', 'info');
    showToast('X-Ray scanning...', 2500);
    let layer = 0;
    const layers = ['Surface layer scan...', 'Layer 2 copper traces...', 'Layer 3 ground plane...', 'Layer 4 signal routing...', 'BGA/component analysis...', 'Scan complete'];
    const iv = setInterval(() => {
      if (layer < layers.length) {
        if (dataLog) dataLog.textContent += '\n[X-RAY] ' + layers[layer];
        layer++;
      } else { clearInterval(iv); log('🔬 X-Ray scan complete', 'success'); }
    }, 500);
  });
}

function init() {
  initSplash(); const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);
  initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const snd=$('soundToggle');if(snd){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}snd.checked=soundEnabled;snd.addEventListener('change',()=>{soundEnabled=snd.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate(); initSimCanvas(); initSupplyChainSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();


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
