/**
 * imp-evil-maid-toolkit — Workshop DIY
 * Evil maid attack simulation — physical access exploit & disk encryption defense training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="20" width="50" height="35" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><rect x="35" y="55" width="30" height="5" rx="1" fill="currentColor" opacity=".4"/><rect x="30" y="60" width="40" height="2" fill="currentColor" opacity=".3"/><circle cx="50" cy="37" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 37 L50 42" stroke="currentColor" stroke-width="2"/><rect x="15" y="70" width="20" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="20" y1="75" x2="30" y2="75" stroke="currentColor" stroke-width="1.5"/><path d="M35 77 L55 77" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
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
    title: 'imp-evil-maid-toolkit', subtitle: '🔓 access · 💾 extract · 🛡️ harden',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Evil Maid Toolkit — Physical Access Attack Sim',
    mainDesc: 'Simulate evil maid attacks on unattended laptops and learn disk encryption defenses',
    sectionA: 'How It Works', sectionB: 'Lab — Attack Visualizer', sectionC: 'Challenge',
    attackBtn: 'Launch Attack', analyzeBtn: 'Forensic Scan', defendBtn: 'Harden System',
    ready: '🔓 Evil Maid Toolkit ready — select attack type!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    splashHint: 'tap to skip',
  },
  fr: {
    title: 'imp-evil-maid-toolkit', subtitle: '🔓 accéder · 💾 extraire · 🛡️ durcir',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Evil Maid — Simulation d\'attaque physique',
    ready: '🔓 Evil Maid Toolkit prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', working: 'En cours…',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →', splashHint: 'appuyer pour passer',
  },
  ar: {
    title: 'imp-evil-maid-toolkit', subtitle: '🔓 وصول · 💾 استخراج · 🛡️ تقوية',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'أدوات هجوم الخادمة الشريرة',
    ready: '🔓 جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', working: 'جارٍ…',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←', splashHint: 'انقر للتخطي',
  }
};

/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});


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
  try { localStorage.setItem('wdiy-theme', name); } catch {} log(`${LANG[currentLang].themeChanged} ${name}`, 'info');
}

let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success'); else if (type === 'error') playSound('error');
}
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

/* ═══════ APP-SPECIFIC: EVIL MAID ATTACK SIM ═══════ */

let particles = [];
let attackActive = false;
let bootChain = [];

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500; canvas.height = 260;
  let time = 0;

  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const attack = ($('attackSelect') || {}).value || 'bootloader';
    time += 0.02;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // Laptop body
    const lx = canvas.width / 2, ly = 80;
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    // Screen
    ctx.strokeRect(lx - 60, ly - 40, 120, 75);
    ctx.fillStyle = '#0a1a2a'; ctx.fillRect(lx - 58, ly - 38, 116, 71);
    // Base
    ctx.beginPath(); ctx.moveTo(lx - 70, ly + 37); ctx.lineTo(lx - 60, ly + 35);
    ctx.lineTo(lx + 60, ly + 35); ctx.lineTo(lx + 70, ly + 37);
    ctx.lineTo(lx + 75, ly + 50); ctx.lineTo(lx - 75, ly + 50); ctx.closePath();
    ctx.strokeStyle = accent; ctx.stroke();

    // Boot chain visualization inside screen
    if (attack === 'bootloader') {
      const stages = ['UEFI', 'GRUB', 'initrd', 'LUKS', 'kernel'];
      const colors = attackActive ?
        ['#ff3333', '#ff3333', '#33ff33', '#33ff33', '#33ff33'] :
        ['#33ff33', '#33ff33', '#33ff33', '#33ff33', '#33ff33'];
      for (let i = 0; i < stages.length; i++) {
        const sx = lx - 50 + i * 25, sy = ly - 20;
        ctx.fillStyle = colors[i]; ctx.font = '7px Orbitron';
        ctx.fillText(stages[i], sx - 8, sy);
        ctx.fillRect(sx - 2, sy + 3, 18, 8);
        if (i < stages.length - 1) {
          ctx.strokeStyle = colors[i + 1]; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(sx + 16, sy + 7); ctx.lineTo(sx + 23, sy + 7); ctx.stroke();
        }
      }
      if (attackActive) {
        ctx.fillStyle = '#ff3333'; ctx.font = '10px Orbitron';
        ctx.fillText('BOOTLOADER TAMPERED', lx - 55, ly + 20);
      }
    } else if (attack === 'dma') {
      // Thunderbolt port
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 2;
      ctx.strokeRect(lx + 80, ly + 10, 30, 20);
      ctx.fillStyle = '#ff6600'; ctx.font = '6px Orbitron';
      ctx.fillText('TB3', lx + 84, ly + 24);
      // DMA arrow
      if (attackActive) {
        ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(lx + 110, ly + 20); ctx.lineTo(lx + 140, ly + 20); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff3333'; ctx.font = '8px Orbitron';
        ctx.fillText('DMA', lx + 115, ly + 14);
        // Attacker device
        ctx.strokeStyle = '#ff3333'; ctx.strokeRect(lx + 140, ly + 5, 40, 30);
        ctx.fillStyle = '#ff3333'; ctx.font = '7px Orbitron';
        ctx.fillText('ATTACK', lx + 142, ly + 24);
      }
      // RAM visualization inside screen
      ctx.fillStyle = '#33ff33'; ctx.font = '7px Orbitron';
      for (let r = 0; r < 3; r++) {
        const addr = (0xFFFF0000 + r * 0x1000).toString(16).toUpperCase();
        ctx.fillText(`0x${addr}`, lx - 50, ly - 20 + r * 14);
        ctx.fillStyle = attackActive ? '#ff3333' : '#33ff33';
        ctx.fillRect(lx - 5, ly - 28 + r * 14, 50, 8);
        ctx.fillStyle = '#33ff33';
      }
    } else { // coldboot
      // RAM chips
      for (let r = 0; r < 4; r++) {
        const ry = ly - 25 + r * 16;
        ctx.strokeStyle = attackActive ? (r < 2 ? '#4488ff' : '#ff3333') : '#33ff33';
        ctx.strokeRect(lx - 45, ry, 90, 12);
        // Memory cells decaying
        const cellCount = attackActive ? Math.max(2, 10 - r * 3) : 10;
        for (let c = 0; c < cellCount; c++) {
          ctx.fillStyle = ctx.strokeStyle;
          ctx.globalAlpha = attackActive ? (0.3 + Math.random() * 0.7) : 1;
          ctx.fillRect(lx - 42 + c * 9, ry + 2, 7, 8);
        }
        ctx.globalAlpha = 1;
      }
      if (attackActive) {
        ctx.fillStyle = '#4488ff'; ctx.font = '8px Orbitron';
        ctx.fillText('FREEZING RAM...', lx - 35, ly + 45);
        // Ice crystals
        ctx.strokeStyle = '#88ccff'; ctx.lineWidth = 1;
        for (let c = 0; c < 5; c++) {
          const cx2 = lx - 40 + Math.sin(time + c) * 60;
          const cy2 = ly - 30 + Math.cos(time * 0.7 + c) * 40;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const ang = a * Math.PI / 3;
            ctx.moveTo(cx2, cy2); ctx.lineTo(cx2 + Math.cos(ang) * 5, cy2 + Math.sin(ang) * 5);
          }
          ctx.stroke();
        }
      }
    }

    // USB boot device (for bootloader attack)
    if (attack === 'bootloader') {
      ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1.5;
      ctx.strokeRect(20, ly + 20, 35, 20);
      ctx.fillStyle = '#ff3333'; ctx.font = '7px Orbitron';
      ctx.fillText('USB', 26, ly + 34);
      if (attackActive) {
        ctx.setLineDash([3, 4]); ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(55, ly + 30); ctx.lineTo(lx - 75, ly + 45); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      if (p.life <= 0 || p.x > canvas.width + 10) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color || '#33ff33'; ctx.fill(); ctx.globalAlpha = 1;
    }

    // Speed bar
    const speed = parseInt(($('speedSlider') || {}).value || '50');
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(30, canvas.height - 22, (canvas.width - 60) * (speed / 100), 10);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`SPEED: ${speed}% | ${attack.toUpperCase()}`, 30, canvas.height - 6);

    simAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function spawnParticles(count, color, fromX, fromY) {
  const canvas = $('simCanvas'); if (!canvas) return;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: (fromX || 60) + Math.random() * 20, y: (fromY || canvas.height / 2) - 15 + Math.random() * 30,
      vx: 1 + Math.random() * 3, vy: (Math.random() - 0.5) * 2,
      life: 0.5 + Math.random() * 0.5, color: color || '#ff3333', size: 2 + Math.random() * 2
    });
  }
}

function initEvilMaidSim() {
  const attackBtn = $('attackBtn'), analyzeBtn = $('analyzeBtn'), defendBtn = $('defendBtn');
  const speedSlider = $('speedSlider'), speedValue = $('speedValue');
  const outputDisplay = $('outputDisplay'), dataLog = $('dataLog');
  const implantDot = $('implantDot'), implantStatusText = $('implantStatusText');

  if (speedSlider && speedValue) speedSlider.addEventListener('input', () => { speedValue.textContent = speedSlider.value + '%'; });

  if (attackBtn) attackBtn.addEventListener('click', () => {
    const attack = ($('attackSelect') || {}).value || 'bootloader';
    attackActive = true;
    if (implantDot) implantDot.classList.add('active');
    if (implantStatusText) implantStatusText.textContent = 'Attack: IN PROGRESS';
    setStatus(true);
    log(`🔓 Evil maid attack started: ${attack}`, 'tx');
    showToast('Attack in progress...', 2500);
    spawnParticles(20, '#ff3333');

    const steps = {
      bootloader: [
        'Booting from USB device...',
        'Mounting EFI system partition...',
        'Backing up original GRUB binary...',
        'Injecting keylogger into GRUB...',
        'Patching initrd to exfiltrate LUKS key...',
        'Restoring boot flags...',
        'Attack complete — next boot will capture passphrase'
      ],
      dma: [
        'Connecting Thunderbolt attack device...',
        'PCIe enumeration bypass active...',
        'Scanning physical memory (DMA)...',
        'Found encryption keys at 0xFFFF2000...',
        'Dumping LUKS master key from RAM...',
        'Key extracted: AES-256-XTS',
        'Attack complete — disk can be decrypted offline'
      ],
      coldboot: [
        'Powering down target...',
        'Applying compressed air to RAM modules...',
        'RAM temperature: -40C — retention extended...',
        'Transferring RAM to forensic reader...',
        'Scanning for key material in memory dump...',
        'AES key schedule pattern found at offset 0x3A000...',
        'Attack complete — encryption key recovered from RAM'
      ]
    };

    let step = 0;
    const iv = setInterval(() => {
      const msgs = steps[attack] || steps.bootloader;
      if (step < msgs.length) {
        if (dataLog) dataLog.textContent = msgs.slice(0, step + 1).join('\n');
        log(`🔓 ${msgs[step]}`, step === msgs.length - 1 ? 'success' : 'tx');
        spawnParticles(5, '#ff3333');
        step++;
      } else {
        clearInterval(iv);
        attackActive = false;
        if (implantDot) implantDot.classList.remove('active');
        if (implantStatusText) implantStatusText.textContent = 'Attack: Complete';
        if (outputDisplay) outputDisplay.textContent = `EVIL MAID ATTACK REPORT\n══════════════════\nType: ${attack.toUpperCase()}\nStatus: SUCCESS\nTarget: ${($('targetInput') || {}).value || '/dev/sda1'}\nEvidence left: MINIMAL\nTime required: ~3 minutes\nRisk: ${attack === 'dma' ? 'CRITICAL' : 'HIGH'}`;
        hideToast();
      }
    }, 600);
  });

  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    showToast('Running forensic analysis...', 2500);
    log('🔬 Forensic scan of boot chain...', 'info');
    spawnParticles(15, '#4488ff');
    setTimeout(() => {
      const tampered = Math.random() > 0.35;
      const report = tampered ? [
        '⚠️ FORENSIC SCAN RESULTS',
        '══════════════════',
        'Boot integrity: COMPROMISED',
        'GRUB binary: MODIFIED (hash mismatch)',
        'EFI partition: Modified 2 min ago',
        'initrd: Contains unknown module',
        'TPM PCR[4]: VALUE CHANGED',
        'Recommendation: REINSTALL FROM TRUSTED MEDIA'
      ] : [
        '✅ FORENSIC SCAN RESULTS',
        '══════════════════',
        'Boot integrity: VERIFIED',
        'GRUB binary: Hash matches known-good',
        'EFI partition: Unmodified',
        'initrd: Clean',
        'TPM PCR[4]: Expected value',
        'Status: SYSTEM CLEAN'
      ];
      if (outputDisplay) outputDisplay.textContent = report.join('\n');
      log(tampered ? '🚨 Boot chain compromised!' : '✅ Boot chain verified', tampered ? 'error' : 'success');
      hideToast();
    }, 2000);
  });

  if (defendBtn) defendBtn.addEventListener('click', () => {
    showToast('Hardening system...', 2000);
    log('🛡️ Applying evil maid defenses...', 'info');
    spawnParticles(20, '#33ff33');
    setTimeout(() => {
      if (outputDisplay) outputDisplay.textContent = [
        '🛡️ SYSTEM HARDENED',
        '══════════════════',
        'Secure Boot: ENABLED',
        'TPM 2.0: ACTIVE (PCR sealed)',
        'BIOS Password: SET',
        'USB Boot: DISABLED',
        'Thunderbolt: Security Level 3',
        'IOMMU/VT-d: ENABLED',
        'Tamper seals: Applied to chassis',
        'Full-disk encryption: LUKS2 + TPM',
        '',
        'Evil maid resistance: MAXIMUM'
      ].join('\n');
      log('🛡️ System hardened against physical access attacks', 'success');
      attackActive = false;
      if (implantDot) implantDot.classList.remove('active');
      if (implantStatusText) implantStatusText.textContent = 'System: HARDENED';
      hideToast();
    }, 1800);
  });

  const bootScanBtn = $('bootScanBtn');
  if (bootScanBtn) bootScanBtn.addEventListener('click', () => {
    spawnParticles(25, '#d4a03c');
    log('📡 Scanning boot chain integrity...', 'info');
    showToast('Scanning...', 2500);
    let step = 0;
    const stages = ['Checking UEFI firmware...', 'Verifying GRUB hash...', 'Checking initrd...', 'Validating kernel signature...', 'Scan complete'];
    const iv = setInterval(() => {
      if (step < stages.length) {
        if (dataLog) dataLog.textContent += '\n' + stages[step];
        step++;
      } else { clearInterval(iv); log('📡 Boot chain scan complete', 'success'); }
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
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}
  initHijriDate(); initSimCanvas(); initEvilMaidSim();
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
