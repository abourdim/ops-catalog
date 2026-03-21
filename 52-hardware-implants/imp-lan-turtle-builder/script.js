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
  en: { title:'imp-lan-turtle-builder', subtitle:'🐢 implant · 🌐 intercept · 🛡️ detect', disconnected:'Disconnected', connected:'Connected', mainSection:'LAN Turtle Builder — Covert Network Implant Sim', mainDesc:'Build and deploy simulated LAN Turtle implants for network interception training', sectionA:'How It Works', sectionB:'Lab — Network Topology', sectionC:'Challenge', ready:'🐢 LAN Turtle Builder ready — select module!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed', working:'Working…', langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →', splashHint:'tap to skip' },
  fr: { title:'imp-lan-turtle-builder', subtitle:'🐢 implanter · 🌐 intercepter · 🛡️ détecter', disconnected:'Déconnecté', connected:'Connecté', ready:'🐢 LAN Turtle prêt !', logCleared:'Journal effacé', copied:'Copié !', working:'En cours…', langChanged:'🌐 Langue → Français', themeChanged:'🎨 Thème →', splashHint:'appuyer pour passer' },
  ar: { title:'imp-lan-turtle-builder', subtitle:'🐢 زرع · 🌐 اعتراض · 🛡️ كشف', disconnected:'غير متصل', connected:'متصل', ready:'🐢 جاهز!', logCleared:'تم المسح', copied:'تم النسخ!', working:'جارٍ…', langChanged:'🌐 العربية', themeChanged:'🎨 →', splashHint:'انقر للتخطي' }
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
