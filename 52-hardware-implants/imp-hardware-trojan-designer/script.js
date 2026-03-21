/**
 * imp-hardware-trojan-designer — Workshop DIY
 * IC-level hardware trojan design and detection simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="50" height="50" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="32" y="32" width="36" height="36" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="50" cy="50" r="8" fill="currentColor" opacity=".3"/><line x1="25" y1="35" x2="15" y2="35" stroke="currentColor" stroke-width="2"/><line x1="25" y1="50" x2="15" y2="50" stroke="currentColor" stroke-width="2"/><line x1="25" y1="65" x2="15" y2="65" stroke="currentColor" stroke-width="2"/><line x1="75" y1="35" x2="85" y2="35" stroke="currentColor" stroke-width="2"/><line x1="75" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="2"/><line x1="75" y1="65" x2="85" y2="65" stroke="currentColor" stroke-width="2"/><line x1="35" y1="25" x2="35" y2="15" stroke="currentColor" stroke-width="2"/><line x1="50" y1="25" x2="50" y2="15" stroke="currentColor" stroke-width="2"/><line x1="65" y1="25" x2="65" y2="15" stroke="currentColor" stroke-width="2"/><line x1="35" y1="75" x2="35" y2="85" stroke="currentColor" stroke-width="2"/><line x1="50" y1="75" x2="50" y2="85" stroke="currentColor" stroke-width="2"/><line x1="65" y1="75" x2="65" y2="85" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];const APP_VERSION = '1.0';
let soundEnabled = false;const AudioCtx = window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG = {
  en: {
    title:'imp-hardware-trojan-designer', subtitle:'🔬 design · 🧬 implant · 🛡️ detect',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Hardware Trojan Designer — IC Backdoor Lab',
    mainDesc:'Design and detect hardware trojans at the integrated circuit level',
    sectionA:'How It Works', sectionB:'Lab — IC Gate Visualizer', sectionC:'Challenge',
    insertBtn:'Insert Trojan', analyzeBtn:'Analyze IC', detectBtn:'Run Detection',
    howStep1:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',
    howStep2:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',
    howStep3:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',
    howStep4:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',
    ready:'🔬 Hardware Trojan Designer ready — select trojan type!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',
    langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',
  },
  fr: {
    title:'imp-hardware-trojan-designer', subtitle:'🔬 concevoir · 🧬 implanter · 🛡️ détecter',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Concepteur de trojan matériel',mainDesc:'Concevoir et détecter les trojans matériels au niveau IC',
    sectionA:'Comment ça marche',sectionB:'Labo — Portes logiques',sectionC:'Défi',
    insertBtn:'Insérer',analyzeBtn:'Analyser',detectBtn:'Détecter',
    ready:'🔬 Concepteur de trojan prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',
  },
  ar: {
    title:'imp-hardware-trojan-designer', subtitle:'🔬 تصميم · 🧬 زرع · 🛡️ كشف',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'مصمم أحصنة طروادة — مختبر الدوائر المتكاملة',
    mainDesc:'تصميم وكشف أحصنة طروادة على مستوى الدوائر المتكاملة',
    sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
    insertBtn:'إدراج',analyzeBtn:'تحليل',detectBtn:'كشف',
    ready:'🔬 مصمم أحصنة طروادة جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',
    langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',
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


let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click()}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter()})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}

function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open')}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}

let matrixRunning=false,matrixAnim=null;
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: HARDWARE TROJAN DESIGNER ═══════ */
let trojanInserted = false;
let gateParticles = [];
let waveTime = 0;
let trojanGates = [];

// IC gate definitions
const gates = [
  {id:'and1',type:'AND',x:0.25,y:0.25,inputs:2,trojan:false},
  {id:'or1',type:'OR',x:0.25,y:0.55,inputs:2,trojan:false},
  {id:'nand1',type:'NAND',x:0.5,y:0.2,inputs:2,trojan:false},
  {id:'xor1',type:'XOR',x:0.5,y:0.5,inputs:2,trojan:false},
  {id:'nor1',type:'NOR',x:0.5,y:0.8,inputs:2,trojan:false},
  {id:'buf1',type:'BUF',x:0.75,y:0.35,inputs:1,trojan:false},
  {id:'inv1',type:'INV',x:0.75,y:0.65,inputs:1,trojan:false},
];
const wires = [['and1','nand1'],['or1','xor1'],['nand1','buf1'],['xor1','inv1'],['nor1','inv1']];

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=15){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=15){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // IC Package outline
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.setLineDash([]);
    ctx.strokeRect(40,20,canvas.width-80,canvas.height-40);
    ctx.fillStyle=accent;ctx.font='7px Orbitron';ctx.fillText('IC DIE',canvas.width/2-12,35);

    // Pins
    for(let i=0;i<6;i++){
      ctx.fillStyle='#555';ctx.fillRect(10,35+i*35,30,8); // left pins
      ctx.fillRect(canvas.width-40,35+i*35,30,8); // right pins
    }
    for(let i=0;i<4;i++){
      ctx.fillRect(80+i*80,canvas.height-18,8,18); // bottom pins
      ctx.fillRect(80+i*80,0,8,18); // top pins
    }

    // Wires between gates
    wires.forEach(([a,b])=>{
      const ga=gates.find(g=>g.id===a),gb=gates.find(g=>g.id===b);
      if(!ga||!gb)return;
      const ax=ga.x*canvas.width,ay=ga.y*(canvas.height-60)+30;
      const bx=gb.x*canvas.width,by=gb.y*(canvas.height-60)+30;
      ctx.strokeStyle=(ga.trojan||gb.trojan)?'#ff3333':'#335533';
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ax+15,ay);ctx.lineTo(bx-15,by);ctx.stroke();
    });

    // Gates
    gates.forEach(g=>{
      const gx=g.x*canvas.width,gy=g.y*(canvas.height-60)+30;
      ctx.fillStyle=g.trojan?'#330000':'#112211';
      ctx.strokeStyle=g.trojan?'#ff3333':accent;
      ctx.lineWidth=g.trojan?2:1.5;
      ctx.beginPath();ctx.roundRect(gx-18,gy-12,36,24,3);ctx.fill();ctx.stroke();

      // Gate label
      ctx.fillStyle=g.trojan?'#ff3333':accent;ctx.font='8px Orbitron';ctx.textAlign='center';
      ctx.fillText(g.type,gx,gy+3);ctx.textAlign='left';

      // Trojan blink
      if(g.trojan){
        const b=Math.sin(waveTime*5+g.x*10)>0;
        ctx.fillStyle=b?'#ff0000':'#440000';
        ctx.beginPath();ctx.arc(gx+14,gy-8,2.5,0,Math.PI*2);ctx.fill();
      }
    });

    // Trojan trigger line (if inserted)
    if(trojanInserted){
      const tg=gates.filter(g=>g.trojan);
      if(tg.length>=2){
        ctx.strokeStyle='#ff3333';ctx.lineWidth=1;ctx.setLineDash([3,4]);
        const a=tg[0],b=tg[tg.length-1];
        ctx.beginPath();ctx.moveTo(a.x*canvas.width,a.y*(canvas.height-60)+30);
        ctx.lineTo(b.x*canvas.width,b.y*(canvas.height-60)+30);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle='#ff3333';ctx.font='7px Orbitron';
        ctx.fillText('TROJAN PATH',(a.x+b.x)/2*canvas.width-25,(a.y+b.y)/2*(canvas.height-60)+20);
      }
    }

    // Particles
    for(let i=gateParticles.length-1;i>=0;i--){
      const p=gateParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){gateParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color||'#33ff33';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();
      if(p.label){ctx.font='6px Orbitron';ctx.fillText(p.label,p.x+4,p.y-2)}
      ctx.globalAlpha=1;
    }

    // Status bar
    const tCount=gates.filter(g=>g.trojan).length;
    ctx.fillStyle=trojanInserted?'rgba(255,51,51,0.15)':'rgba(51,255,51,0.1)';
    ctx.fillRect(50,canvas.height-25,canvas.width-100,10);
    ctx.fillStyle=trojanInserted?'#ff3333':'#33ff33';ctx.font='9px Orbitron';
    ctx.fillText(`GATES: ${gates.length} | TROJANS: ${tCount} | ${($('trojanTypeSelect')||{}).value||'combinational'}`,50,canvas.height-8);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnGateParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;
  for(let i=0;i<count;i++){
    const g=gates[Math.floor(Math.random()*gates.length)];
    gateParticles.push({x:g.x*canvas.width,y:g.y*(canvas.height-60)+30,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:0.4+Math.random()*0.4,color:color||'#33ff33',size:2+Math.random()*2,label:Math.random()>0.7?['SIG','CLK','RST','VDD','GND'][Math.floor(Math.random()*5)]:null});
  }
}

function initTrojanSim(){
  const insertBtn=$('insertBtn'),analyzeBtn=$('analyzeBtn'),detectBtn=$('detectBtn');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(insertBtn)insertBtn.addEventListener('click',()=>{
    trojanInserted=!trojanInserted;
    insertBtn.textContent=trojanInserted?'Remove Trojan':(LANG[currentLang].insertBtn||'Insert Trojan');
    if(implantDot)implantDot.classList.toggle('active',trojanInserted);
    if(implantStatusText)implantStatusText.textContent=trojanInserted?'Trojan: INSERTED':'Trojan: Clean';
    setStatus(trojanInserted);

    if(trojanInserted){
      const type=($('trojanTypeSelect')||{}).value||'combinational';
      // Mark 2-3 random gates as trojaned
      trojanGates=[];
      const indices=[...Array(gates.length).keys()].sort(()=>Math.random()-0.5).slice(0,2+Math.floor(Math.random()*2));
      gates.forEach((g,i)=>g.trojan=indices.includes(i));
      trojanGates=gates.filter(g=>g.trojan);
      log(`🧬 Hardware trojan inserted — ${trojanGates.length} gates modified (${type})`,'success');
      showToast('Inserting trojan into IC...',1500);
      spawnGateParticles(20,'#ff3333');
      if(dataLog)dataLog.textContent=`Trojan type: ${type}\nAffected gates: ${trojanGates.map(g=>g.id).join(', ')}\nTrigger: ${type==='sequential'?'Counter-based (2^32 cycles)':'Rare input combination'}`;
    }else{
      gates.forEach(g=>g.trojan=false);trojanGates=[];
      log('🧹 Trojan removed — IC restored to clean state','info');
      spawnGateParticles(15,'#33ff33');
    }
  });

  if(analyzeBtn)analyzeBtn.addEventListener('click',()=>{
    showToast('Analyzing IC layout...',2500);log('🔬 Running IC analysis...','info');
    spawnGateParticles(20,'#4488ff');
    setTimeout(()=>{
      const analysis=['IC ANALYSIS REPORT','══════════════════',`Total gates: ${gates.length}`,`Gate types: AND, OR, NAND, XOR, NOR, BUF, INV`,`Die area: ${(2.1+Math.random()*1.5).toFixed(1)}mm²`,`Process: 28nm CMOS`,`Power: ${(0.8+Math.random()*2).toFixed(1)}mW`,`Clock: ${(100+Math.floor(Math.random()*900))}MHz`,'',trojanInserted?`⚠️ ANOMALY: ${trojanGates.length} gates show unusual connectivity`:'✅ No structural anomalies detected',trojanInserted?`Suspicious area: ${(0.01+Math.random()*0.05).toFixed(3)}mm² (${(0.5+Math.random()*2).toFixed(1)}% of die)`:'All gates match reference netlist'].join('\n');
      if(outputDisplay)outputDisplay.textContent=analysis;
      log(trojanInserted?'⚠️ IC analysis found anomalies':'✅ IC analysis clean',trojanInserted?'error':'success');
      hideToast();
    },2000);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Running trojan detection suite...',3000);log('🛡️ Multi-method trojan detection...','info');
    spawnGateParticles(25,'#d4a03c');
    let step=0;
    const methods=['Side-channel power analysis','EM emanation scan','Path delay fingerprinting','Logic testing (ATPG)','Golden chip comparison'];
    const iv=setInterval(()=>{
      if(step<methods.length){log(`🔍 ${methods[step]}...`,'info');spawnGateParticles(5,'#d4a03c');step++}
      else{
        clearInterval(iv);
        const detected=trojanInserted&&Math.random()>0.2;
        const result=detected?['⚠️ TROJAN DETECTED','══════════════════','Method: Side-channel power analysis','Confidence: '+(85+Math.floor(Math.random()*15))+'%','Location: Gates '+trojanGates.map(g=>g.id).join(', '),'Type: '+(($('trojanTypeSelect')||{}).value||'combinational'),'','Power anomaly: +'+((Math.random()*0.5)+0.1).toFixed(2)+'mW','Path delay delta: +'+((Math.random()*50)+10).toFixed(0)+'ps','Recommendation: QUARANTINE IC'].join('\n'):['✅ NO TROJAN DETECTED','══════════════════','Power profile: Normal','EM signature: Clean','Path delays: Within tolerance','Logic test coverage: 98.7%','','IC appears genuine.'].join('\n');
        if(outputDisplay)outputDisplay.textContent=result;
        log(detected?'🚨 Hardware trojan detected!':'✅ Detection suite clean',detected?'error':'success');
        hideToast();
      }
    },500);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{
    spawnGateParticles(30,'#d4a03c');log('📡 Full IC characterization sweep...','info');
    showToast('Characterizing IC...',3000);
    let step=0;const phases=['Power profiling','Timing analysis','Leakage measurement','Thermal imaging','X-ray inspection'];
    const iv=setInterval(()=>{if(step<phases.length){if(dataLog)dataLog.textContent+=`\n[SWEEP] ${phases[step]}...`;step++}else{clearInterval(iv);log('📡 IC characterization complete','success')}},500);
  });
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate();initSimCanvas();initTrojanSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
