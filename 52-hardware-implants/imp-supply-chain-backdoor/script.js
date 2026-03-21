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
  en: { title:'imp-supply-chain-backdoor', subtitle:'📦 intercept · 🔬 implant · 🛡️ verify', disconnected:'Disconnected', connected:'Connected', mainSection:'Supply Chain Backdoor — Hardware Interdiction Sim', mainDesc:'Simulate supply chain interdiction attacks and learn hardware verification techniques', sectionA:'How It Works', sectionB:'Lab — Motherboard Inspector', sectionC:'Challenge', ready:'📦 Supply Chain Backdoor sim ready!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed', working:'Working…', langChanged:'🌐 English', themeChanged:'🎨 Theme →', splashHint:'tap to skip' },
  fr: { title:'imp-supply-chain-backdoor', subtitle:'📦 intercepter · 🔬 implanter · 🛡️ vérifier', disconnected:'Déconnecté', connected:'Connecté', ready:'📦 Simulation prête !', logCleared:'Journal effacé', copied:'Copié !', working:'En cours…', langChanged:'🌐 Français', themeChanged:'🎨 Thème →', splashHint:'appuyer pour passer' },
  ar: { title:'imp-supply-chain-backdoor', subtitle:'📦 اعتراض · 🔬 زرع · 🛡️ تحقق', disconnected:'غير متصل', connected:'متصل', ready:'📦 جاهز!', logCleared:'تم المسح', copied:'تم النسخ!', working:'جارٍ…', langChanged:'🌐 العربية', themeChanged:'🎨 →', splashHint:'انقر للتخطي' }
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
