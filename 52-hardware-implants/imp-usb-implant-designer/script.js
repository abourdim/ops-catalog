/**
 * imp-usb-implant-designer — Workshop DIY
 * USB implant payload designer simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="15" width="40" height="70" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><rect x="38" y="25" width="24" height="12" rx="2" fill="currentColor" opacity=".3"/><line x1="42" y1="50" x2="42" y2="65" stroke="currentColor" stroke-width="2"/><line x1="50" y1="50" x2="50" y2="65" stroke="currentColor" stroke-width="2"/><line x1="58" y1="50" x2="58" y2="65" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="78" r="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08; const t = audioCtx.currentTime; if (type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)} else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)} else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)} }
const LANG = {
  en: { title:'imp-usb-implant-designer', subtitle:'🔌 design · 💉 inject · 🛡️ defend', disconnected:'Disconnected', connected:'Connected', mainSection:'USB Implant Designer — Payload Sim', mainDesc:'Design USB implant payloads and test detection methods', sectionA:'How It Works', sectionB:'Lab — USB Bus Analyzer', sectionC:'Challenge', ready:'🔌 USB Implant Designer ready — select implant type!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed', working:'Working…', langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →', splashHint:'tap to skip' },
  fr: { title:'imp-usb-implant-designer', subtitle:'🔌 concevoir · 💉 injecter · 🛡️ défendre', disconnected:'Déconnecté', connected:'Connecté', mainSection:'Concepteur d\'implant USB', ready:'🔌 Concepteur USB prêt !', logCleared:'Journal effacé', copied:'Copié !', working:'En cours…', langChanged:'🌐 Langue → Français', themeChanged:'🎨 Thème →', splashHint:'appuyer pour passer' },
  ar: { title:'imp-usb-implant-designer', subtitle:'🔌 تصميم · 💉 حقن · 🛡️ دفاع', disconnected:'غير متصل', connected:'متصل', mainSection:'مصمم زرعات USB', ready:'🔌 مصمم زرعات USB جاهز!', logCleared:'تم مسح السجل', copied:'تم النسخ!', working:'جارٍ…', langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←', splashHint:'انقر للتخطي' }
};
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if(!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k=el.dataset.i18n; if(s[k]!=null) el.textContent=s[k]; }); document.title=`${s.title} — Workshop DIY`; document.documentElement.dir=lang==='ar'?'rtl':'ltr'; document.documentElement.lang=lang; const sel=$('langSelect'); if(sel) sel.value=lang; try{localStorage.setItem('wdiy-lang',lang)}catch{} log(s.langChanged,'info'); }
function setTheme(name) { document.documentElement.dataset.theme=name; document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name)); const sel=$('themeSelect'); if(sel) sel.value=name; try{localStorage.setItem('wdiy-theme',name)}catch{} log(`${LANG[currentLang].themeChanged} ${name}`,'info'); }
let logContainer;
function log(msg, type='info') { if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; const d=document.createElement('div'); d.className=`log-line ${type}`; d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop=logContainer.scrollHeight; if(type==='success') playSound('success'); else if(type==='error') playSound('error'); }
function clearLog() { if(!logContainer) logContainer=$('logContainer'); if(logContainer) logContainer.innerHTML=''; log(LANG[currentLang].logCleared); }
async function copyLog() { if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n')); log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')} }
function exportLog() { if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'})); a.download=`log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); }
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter()})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')} function closeHelp(){closePanel('helpPanel','helpOverlay')}
function openSettings(){openPanel('settingsPanel','settingsOverlay')} function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}

/* ═══════ USB IMPLANT SIM ═══════ */
let usbParticles = [];
function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d'); canvas.width = canvas.offsetWidth || 500; canvas.height = 260;
  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    // USB bus lanes
    ctx.strokeStyle = '#1a2a1a'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(30, 50 + i*50); ctx.lineTo(canvas.width-30, 50+i*50); ctx.stroke(); }
    // Labels
    ctx.fillStyle = accent; ctx.font = '10px Orbitron';
    ctx.fillText('VCC', 5, 54); ctx.fillText('D-', 5, 104); ctx.fillText('D+', 5, 154); ctx.fillText('GND', 5, 204);
    // Host
    ctx.strokeStyle = accent; ctx.strokeRect(canvas.width-80, 60, 60, 120);
    ctx.fillText('HOST', canvas.width-70, 130);
    // Implant
    const type = ($('implantTypeSelect')||{}).value||'rubber-ducky';
    ctx.fillStyle = '#220000'; ctx.fillRect(40, 80, 70, 80);
    ctx.strokeStyle = '#ff3333'; ctx.strokeRect(40, 80, 70, 80);
    ctx.fillStyle = '#ff3333'; ctx.font = '9px Orbitron';
    ctx.fillText(type.toUpperCase().slice(0,10), 44, 125);
    // Particles
    for (let i = usbParticles.length-1; i >= 0; i--) {
      const p = usbParticles[i]; p.x += p.vx; p.life -= 0.012;
      if (p.life <= 0 || p.x > canvas.width) { usbParticles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fillStyle = p.color || '#33ff33'; ctx.fill(); ctx.globalAlpha = 1;
    }
    // Speed bar
    const speed = parseInt(($('speedSlider')||{}).value||'60');
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(30, canvas.height-20, (canvas.width-60)*(speed/100), 8);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron'; ctx.fillText(`SPEED: ${speed} cps`, 30, canvas.height-5);
    requestAnimationFrame(draw);
  }
  draw();
}
function spawnUSBPackets(n, color) { for(let i=0;i<n;i++) usbParticles.push({x:110+Math.random()*20, y:90+Math.random()*60, vx:2+Math.random()*3, life:0.5+Math.random()*0.5, color:color||null}); }

function initUSBSim() {
  const compileBtn=$('compileBtn'), injectBtn=$('injectBtn'), defendBtn=$('defendBtn');
  const speedSlider=$('speedSlider'), speedValue=$('speedValue');
  const outputDisplay=$('outputDisplay'), dataLog=$('dataLog');
  if(speedSlider&&speedValue) speedSlider.addEventListener('input',()=>{speedValue.textContent=speedSlider.value+' cps'});

  if(compileBtn) compileBtn.addEventListener('click', ()=>{
    const payload=($('payloadInput')||{}).value||'';
    if(!payload){log('Enter a payload first','error');return}
    showToast('Compiling payload...',1500);
    log(`🔧 Compiling: ${payload}`,'info');
    setTimeout(()=>{
      const hex=Array.from(payload).map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join(' ');
      if(outputDisplay) outputDisplay.textContent=`COMPILED HEX:\n${hex}\nSize: ${payload.length} bytes\nType: ${($('implantTypeSelect')||{}).value}`;
      log('✅ Payload compiled','success');
    },1200);
  });

  if(injectBtn) injectBtn.addEventListener('click', ()=>{
    const dot=$('implantDot'), txt=$('implantStatusText');
    if(dot) dot.classList.add('active'); if(txt) txt.textContent='USB: INJECTING...';
    setStatus(true); showToast('Injecting payload...',2500);
    log('💉 Injection started on USB bus','tx');
    spawnUSBPackets(25,'#ff3333');
    let progress=0;
    const iv=setInterval(()=>{
      progress+=10; spawnUSBPackets(5,'#ff3333');
      if(dataLog) dataLog.textContent=`Injection progress: ${progress}%\nPackets sent: ${progress*3}\nBus state: ACTIVE`;
      if(progress>=100){clearInterval(iv);log('💉 Injection complete','success');if(dot)dot.classList.remove('active');if(txt)txt.textContent='USB: Idle'}
    },400);
  });

  if(defendBtn) defendBtn.addEventListener('click', ()=>{
    showToast('Analyzing USB bus...',2000); log('🛡️ Running USB defense scan...','info');
    spawnUSBPackets(15,'#3333ff');
    setTimeout(()=>{
      const threats=Math.floor(Math.random()*3);
      if(outputDisplay) outputDisplay.textContent=threats>0?`⚠️ ${threats} SUSPICIOUS DEVICE(S)\nVID/PID: Non-standard\nHID: Unexpected keyboard detected\nAction: BLOCK & ALERT`:'✅ USB BUS CLEAN\nAll devices verified\nNo anomalies detected';
      log(threats>0?`🚨 ${threats} threat(s) found!`:'✅ Bus clean','threats>0?\'error\':\'success\'');
      hideToast();
    },2000);
  });

  const scanBtn=$('scanUsbBtn');
  if(scanBtn) scanBtn.addEventListener('click',()=>{spawnUSBPackets(20);log('📡 USB bus scan initiated','info');showToast('Scanning...',2000)});
}

function init() {
  initSplash(); const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog); $('copyLogBtn')&&($('copyLogBtn').onclick=copyLog); $('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);
  initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp); $('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp); $('helpOverlay')&&($('helpOverlay').onclick=closeHelp); initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings); $('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings); $('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog); $('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const soundTgl=$('soundToggle'); if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const langSel=$('langSelect'); if(langSel) langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel) themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate(); initSimCanvas(); initUSBSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
