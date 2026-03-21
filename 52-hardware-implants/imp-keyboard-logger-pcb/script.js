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
  },
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
  },
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
