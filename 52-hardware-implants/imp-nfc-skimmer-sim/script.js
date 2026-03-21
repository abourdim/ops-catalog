/**
 * imp-nfc-skimmer-sim — Workshop DIY
 * NFC/RFID skimmer simulation for contactless card attack detection training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3"/><circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="5" fill="currentColor"/><path d="M30 30 L20 20 M70 30 L80 20 M30 70 L20 80 M70 70 L80 80" stroke="currentColor" stroke-width="2"/></svg>`;

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
    title: 'imp-nfc-skimmer-sim', subtitle: '📡 skim · 🔍 analyze · 🛡️ defend',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'NFC Skimmer Sim — Contactless Card Attack Lab',
    mainDesc: 'Simulate NFC/RFID skimming attacks and learn detection techniques',
    sectionA: 'How It Works', sectionB: 'Lab — NFC Field Visualizer', sectionC: 'Challenge',
    scanBtn: 'Scan Field', analyzeBtn: 'Analyze Data', defendBtn: 'Shield Card',
    howStep1: 'NFC skimmers exploit the 13.56 MHz contactless protocol used by payment cards and access badges.',
    howStep2: 'A hidden reader antenna captures card UIDs and transaction data when cards come within range.',
    howStep3: 'Relay attacks extend read range by proxying the NFC signal over a network to a remote emulator.',
    howStep4: 'Detection uses RF field analysis, RFID-blocking wallets, and anomaly monitoring on card transactions.',
    ready: '📡 NFC Skimmer Sim ready — select attack type!',
    scanning: 'Scanning NFC field...', cardFound: 'Card detected!',
    analyzing: 'Analyzing captured data...', noData: 'No cards captured yet',
    shielded: 'Card shielded', sweepDone: 'RF sweep complete',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    splashHint: 'tap to skip',
  },
  fr: {
    title: 'imp-nfc-skimmer-sim', subtitle: '📡 capturer · 🔍 analyser · 🛡️ défendre',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Simulateur de skimmer NFC',
    mainDesc: 'Simulez les attaques de skimming NFC/RFID et apprenez les techniques de détection',
    sectionA: 'Comment ça marche', sectionB: 'Labo — Visualiseur NFC', sectionC: 'Défi',
    scanBtn: 'Scanner', analyzeBtn: 'Analyser', defendBtn: 'Protéger',
    ready: '📡 Simulateur NFC prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    working: 'En cours…', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    splashHint: 'appuyer pour passer',
  },
  ar: {
    title: 'imp-nfc-skimmer-sim', subtitle: '📡 التقاط · 🔍 تحليل · 🛡️ دفاع',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'محاكي سارق NFC — مختبر البطاقات اللاتلامسية',
    mainDesc: 'محاكاة هجمات NFC/RFID وتعلم تقنيات الكشف',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    scanBtn: 'مسح الحقل', analyzeBtn: 'تحليل', defendBtn: 'حماية البطاقة',
    ready: '📡 محاكي NFC جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', working: 'جارٍ…',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    splashHint: 'انقر للتخطي',
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

/* ═══════ APP-SPECIFIC: NFC SKIMMER SIM ═══════ */

let scanning = false;
let capturedCards = [];
let nfcParticles = [];
let simAnimId = null;
let rfPulseRadius = 0;
let rfPulseActive = false;

// Generate random card UID
function randomUID() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':');
}

// Generate random card data
function randomCardData() {
  const types = ['MIFARE Classic 1K', 'MIFARE DESFire EV1', 'NTAG 215', 'ISO 14443-A', 'FeliCa'];
  const type = types[Math.floor(Math.random() * types.length)];
  const uid = randomUID();
  const atqa = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
  const sak = Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  return { type, uid, atqa, sak, timestamp: new Date().toLocaleTimeString() };
}

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500;
  canvas.height = 260;

  let waveTime = 0;

  function drawNFC() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const type = ($('skimmerTypeSelect') || {}).value || 'passive';
    waveTime += 0.02;

    // Grid background
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // NFC reader device (left side)
    const readerX = 80, readerY = canvas.height / 2;
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.strokeRect(readerX - 30, readerY - 35, 60, 70);
    ctx.fillStyle = '#111'; ctx.fillRect(readerX - 28, readerY - 33, 56, 66);

    // Reader antenna coil
    ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
    for (let r = 8; r <= 20; r += 6) {
      ctx.beginPath(); ctx.arc(readerX, readerY, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = accent; ctx.font = '9px Orbitron';
    ctx.fillText('READER', readerX - 18, readerY + 45);
    ctx.fillText('13.56MHz', readerX - 22, readerY + 55);

    // RF field waves (animated)
    if (scanning || rfPulseActive) {
      const fieldStrength = parseInt(($('fieldSlider') || {}).value || '50');
      const maxRadius = 60 + fieldStrength * 1.2;
      for (let w = 0; w < 4; w++) {
        const phase = (waveTime * 2 + w * 1.5) % 6;
        const radius = phase / 6 * maxRadius;
        const alpha = 1 - phase / 6;
        ctx.strokeStyle = `rgba(51, 255, 51, ${alpha * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(readerX, readerY, 25 + radius, -0.6, 0.6); ctx.stroke();
      }
    }

    // Target card (right side)
    const cardX = canvas.width - 120, cardY = canvas.height / 2;
    ctx.save();
    ctx.translate(cardX, cardY);
    ctx.rotate(Math.sin(waveTime * 0.5) * 0.03);

    // Card body
    ctx.fillStyle = '#1a1a2e'; ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-45, -30, 90, 60, 6);
    ctx.fill(); ctx.stroke();

    // Card chip
    ctx.fillStyle = '#d4a03c'; ctx.fillRect(-15, -10, 20, 15);
    ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 0.5;
    ctx.strokeRect(-15, -10, 20, 15);
    ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(-5, 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-15, -2); ctx.lineTo(5, -2); ctx.stroke();

    // Card contactless symbol
    ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5;
    for (let r = 5; r <= 15; r += 5) {
      ctx.beginPath(); ctx.arc(20, -5, r, -0.8, 0.8); ctx.stroke();
    }

    ctx.fillStyle = '#4488ff'; ctx.font = '7px Orbitron';
    ctx.fillText('CARD', -12, 24);
    ctx.restore();

    // Data flow line between reader and card
    if (scanning) {
      ctx.strokeStyle = type === 'relay' ? '#ff6600' : '#33ff33';
      ctx.lineWidth = 1; ctx.setLineDash([4, 8]);
      ctx.beginPath(); ctx.moveTo(readerX + 30, readerY); ctx.lineTo(cardX - 45, cardY); ctx.stroke();
      ctx.setLineDash([]);

      // Show attack type label
      ctx.fillStyle = type === 'relay' ? '#ff6600' : '#33ff33';
      ctx.font = '10px Orbitron';
      const typeLabels = { passive: 'PASSIVE SKIM', relay: 'RELAY ATTACK', emulator: 'REPLAY MODE' };
      ctx.fillText(typeLabels[type] || 'ACTIVE', canvas.width / 2 - 40, 25);
    }

    // Relay attack visualization
    if (type === 'relay' && scanning) {
      const relayX = canvas.width / 2, relayY = canvas.height / 2 + 50;
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(readerX + 30, readerY + 20); ctx.lineTo(relayX, relayY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(relayX, relayY); ctx.lineTo(cardX - 45, cardY + 20); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff6600'; ctx.font = '8px Orbitron';
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1;
      ctx.strokeRect(relayX - 20, relayY - 10, 40, 20);
      ctx.fillText('PROXY', relayX - 15, relayY + 4);
    }

    // Draw captured data particles
    for (let i = nfcParticles.length - 1; i >= 0; i--) {
      const p = nfcParticles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.015;
      if (p.life <= 0 || p.x > canvas.width || p.x < 0) { nfcParticles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color || '#33ff33';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2); ctx.fill();
      // Tiny data labels on some particles
      if (p.label) {
        ctx.font = '6px Orbitron'; ctx.fillText(p.label, p.x + 4, p.y - 2);
      }
      ctx.globalAlpha = 1;
    }

    // Signal strength bar
    const field = parseInt(($('fieldSlider') || {}).value || '50');
    const barW = (canvas.width - 100) * (field / 100);
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(50, canvas.height - 25, barW, 10);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`FIELD: ${field}% | 13.56 MHz`, 50, canvas.height - 8);

    // Captured count
    ctx.fillStyle = accent; ctx.textAlign = 'right';
    ctx.fillText(`Cards: ${capturedCards.length}`, canvas.width - 20, canvas.height - 8);
    ctx.textAlign = 'left';

    simAnimId = requestAnimationFrame(drawNFC);
  }
  drawNFC();
}

function spawnNFCParticles(count, fromReader, color) {
  const canvas = $('simCanvas'); if (!canvas) return;
  const readerX = 80, cardX = canvas.width - 120, cy = canvas.height / 2;
  for (let i = 0; i < count; i++) {
    const startX = fromReader ? readerX + 30 : cardX - 45;
    const dir = fromReader ? 1 : -1;
    const labels = ['UID', 'ATQ', 'SAK', 'DAT', 'CRC', 'ACK', 'NAK'];
    nfcParticles.push({
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

function initNFCSim() {
  const scanBtnEl = $('scanBtn');
  const analyzeBtn = $('analyzeBtn');
  const defendBtn = $('defendBtn');
  const fieldSlider = $('fieldSlider');
  const fieldValue = $('fieldValue');
  const dataLog = $('dataLog');
  const outputDisplay = $('outputDisplay');
  const implantDot = $('implantDot');
  const implantStatusText = $('implantStatusText');
  const cardInput = $('cardInput');

  if (fieldSlider && fieldValue) {
    fieldSlider.addEventListener('input', () => { fieldValue.textContent = fieldSlider.value + '%'; });
  }

  // Scan Field toggle
  let scanInterval = null;
  if (scanBtnEl) scanBtnEl.addEventListener('click', () => {
    scanning = !scanning;
    scanBtnEl.textContent = scanning ? 'Stop Scan' : 'Scan Field';
    if (implantDot) implantDot.classList.toggle('active', scanning);
    if (implantStatusText) implantStatusText.textContent = scanning ? 'Skimmer: SCANNING' : 'Skimmer: Inactive';
    setStatus(scanning);

    if (scanning) {
      log('📡 NFC field scan started — reader active', 'success');
      showToast(LANG[currentLang].scanning, 1500);
      // Periodically capture cards
      scanInterval = setInterval(() => {
        if (!scanning) { clearInterval(scanInterval); return; }
        const card = randomCardData();
        capturedCards.push(card);
        spawnNFCParticles(8, false, '#33ff33');
        spawnNFCParticles(4, true, '#4488ff');
        if (dataLog) {
          dataLog.textContent = capturedCards.slice(-10).map(c =>
            `[${c.timestamp}] ${c.type} UID:${c.uid} ATQA:${c.atqa}`
          ).join('\n');
        }
        if (cardInput) cardInput.value = card.uid;
        log(`📡 Card captured: ${card.type} UID=${card.uid}`, 'rx');
      }, 2500);
    } else {
      if (scanInterval) clearInterval(scanInterval);
      log('⬛ NFC scan stopped', 'info');
    }
  });

  // Analyze captured data
  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    if (capturedCards.length === 0) { log(LANG[currentLang].noData || 'No data', 'error'); return; }
    showToast(LANG[currentLang].analyzing, 2000);
    log('🔬 Analyzing captured NFC data...', 'info');
    spawnNFCParticles(15, true, '#4488ff');
    setTimeout(() => {
      const type = ($('skimmerTypeSelect') || {}).value || 'passive';
      const unique = [...new Set(capturedCards.map(c => c.uid))];
      const analysis = [
        `CAPTURE ANALYSIS`,
        `══════════════════`,
        `Cards captured: ${capturedCards.length}`,
        `Unique UIDs: ${unique.length}`,
        `Attack type: ${type.toUpperCase()}`,
        `Protocol: ISO 14443-A`,
        `Frequency: 13.56 MHz`,
        ``,
        `Card types found:`,
        ...([...new Set(capturedCards.map(c => c.type))].map(t => `  - ${t}`)),
        ``,
        `Last UID: ${capturedCards[capturedCards.length - 1].uid}`,
        `Risk Level: ${type === 'relay' ? 'CRITICAL' : 'HIGH'}`
      ].join('\n');
      if (outputDisplay) outputDisplay.textContent = analysis;
      log('📊 NFC analysis complete — ' + unique.length + ' unique cards', 'success');
      hideToast();
    }, 1500);
  });

  // Shield / Defend
  if (defendBtn) defendBtn.addEventListener('click', () => {
    showToast('Activating RFID shield...', 2000);
    log('🛡️ Deploying NFC countermeasures...', 'info');
    spawnNFCParticles(20, true, '#ff3333');
    setTimeout(() => {
      const defenses = [
        '🛡️ NFC SHIELD ACTIVE',
        '══════════════════',
        'RFID Blocking: ENABLED',
        'Faraday cage: Active',
        'Distance bounding: ON',
        'Transaction alerts: ON',
        '',
        'Countermeasures:',
        '• Blocking 13.56 MHz field',
        '• Randomizing card responses',
        '• Monitoring for rogue readers',
        '• PIN required for all NFC payments'
      ].join('\n');
      if (outputDisplay) outputDisplay.textContent = defenses;
      log('🛡️ NFC shield active — all contactless blocked', 'success');
      if (scanning) {
        scanning = false;
        if (scanBtnEl) scanBtnEl.textContent = 'Scan Field';
        if (implantDot) implantDot.classList.remove('active');
        if (implantStatusText) implantStatusText.textContent = 'Skimmer: BLOCKED';
        setStatus(false);
      }
      hideToast();
    }, 1800);
  });

  // RF Sweep button in lab
  const sweepBtn = $('sweepBtn');
  if (sweepBtn) sweepBtn.addEventListener('click', () => {
    rfPulseActive = true;
    spawnNFCParticles(30, true, '#d4a03c');
    log('📡 RF sweep initiated — scanning 125kHz to 13.56MHz...', 'info');
    showToast('RF Sweep in progress...', 3000);
    let step = 0;
    const steps = ['125 kHz (LF)', '134 kHz (LF)', '13.56 MHz (HF)', '868 MHz (UHF)', '915 MHz (UHF)'];
    const sweepIv = setInterval(() => {
      if (step < steps.length) {
        if (dataLog) dataLog.textContent += `\n[SWEEP] Scanning ${steps[step]}...`;
        spawnNFCParticles(5, true, '#d4a03c');
        step++;
      } else {
        clearInterval(sweepIv);
        rfPulseActive = false;
        if (dataLog) dataLog.textContent += '\n[SWEEP] Complete — 13.56 MHz NFC field detected';
        log(LANG[currentLang].sweepDone || 'RF sweep complete', 'success');
      }
    }, 500);
  });

  // Card input simulation
  if (cardInput) cardInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && cardInput.value.trim()) {
      const card = { type: 'Manual Entry', uid: cardInput.value.trim().toUpperCase(), atqa: '0004', sak: '08', timestamp: new Date().toLocaleTimeString() };
      capturedCards.push(card);
      spawnNFCParticles(10, false, '#33ff33');
      if (dataLog) dataLog.textContent = capturedCards.slice(-10).map(c => `[${c.timestamp}] ${c.type} UID:${c.uid}`).join('\n');
      log(`📡 Manual card entry: ${card.uid}`, 'rx');
      cardInput.value = '';
    }
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
  initNFCSim();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
