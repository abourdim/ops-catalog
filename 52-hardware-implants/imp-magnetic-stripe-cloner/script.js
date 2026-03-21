/**
 * imp-magnetic-stripe-cloner — Workshop DIY
 * Magnetic stripe card cloning simulation for fraud detection training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="25" width="70" height="50" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><rect x="15" y="38" width="70" height="12" fill="currentColor" opacity=".3"/><line x1="20" y1="60" x2="55" y2="60" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="65" x2="45" y2="65" stroke="currentColor" stroke-width="1"/><circle cx="72" cy="35" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG={
  en:{title:'imp-magnetic-stripe-cloner',subtitle:'💳 swipe · 📋 clone · 🛡️ detect',disconnected:'Disconnected',connected:'Connected',mainSection:'Magnetic Stripe Cloner — Card Skimming Lab',mainDesc:'Simulate magnetic stripe reading, cloning, and skimmer detection',sectionA:'How It Works',sectionB:'Lab — Magnetic Stripe Visualizer',sectionC:'Challenge',swipeBtn:'Swipe Card',cloneBtn:'Clone Data',detectBtn:'Detect Skimmer',howStep1:'Magnetic stripe cards store data on 3 tracks using magnetic flux patterns encoded at 75/210 BPI.',howStep2:'A skimmer reads the magnetic data when a card is swiped — capturing track 1 (name) and track 2 (number, expiry).',howStep3:'Cloners write captured data onto blank cards using an MSR device, creating a functional duplicate.',howStep4:'Detection uses visual inspection for overlay skimmers, RF scanning for wireless exfiltration, and jitter analysis.',ready:'💳 Magnetic Stripe Cloner ready — select operation!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip'},
  fr:{title:'imp-magnetic-stripe-cloner',subtitle:'💳 glisser · 📋 cloner · 🛡️ détecter',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Cloneur de piste magnétique',mainDesc:'Simulez la lecture et le clonage de piste magnétique',sectionA:'Comment ça marche',sectionB:'Labo — Visualiseur magnétique',sectionC:'Défi',swipeBtn:'Glisser',cloneBtn:'Cloner',detectBtn:'Détecter',ready:'💳 Cloneur prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer'},
  ar:{title:'imp-magnetic-stripe-cloner',subtitle:'💳 تمرير · 📋 استنساخ · 🛡️ كشف',disconnected:'غير متصل',connected:'متصل',mainSection:'مستنسخ الشريط المغناطيسي — مختبر النسخ',mainDesc:'محاكاة قراءة واستنساخ الشريط المغناطيسي وكشف أجهزة النسخ',sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',swipeBtn:'تمرير',cloneBtn:'استنساخ',detectBtn:'كشف',ready:'💳 مستنسخ الشريط المغناطيسي جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي'}
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

/* ═══════ APP-SPECIFIC: MAGNETIC STRIPE CLONER ═══════ */
let swiping=false;
let magParticles=[];
let capturedCards=[];
let waveTime=0;
let swipeProgress=0;

function randomCardNumber(){return Array.from({length:4},()=>Math.floor(Math.random()*9000+1000)).join(' ')}
function randomTrackData(){
  const num=randomCardNumber().replace(/ /g,'');
  const exp=`${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}/${String(Math.floor(Math.random()*6)+25)}`;
  const name=['SMITH/JOHN','DOE/JANE','AHMED/ALI','MARTIN/CLAIRE','TANAKA/YUKI'][Math.floor(Math.random()*5)];
  return{track1:`%B${num}^${name}^${exp.replace('/','0')}1${Math.floor(Math.random()*9000+1000)}?`,track2:`;${num}=${exp.replace('/','0')}1${Math.floor(Math.random()*90000+10000)}?`,name,number:num.replace(/(.{4})/g,'$1 ').trim(),expiry:exp,timestamp:new Date().toLocaleTimeString()};
}

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // Card reader slot (left)
    const readerX=70,readerY=canvas.height/2;
    ctx.fillStyle='#111';ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.fillRect(readerX-35,readerY-50,70,100);ctx.strokeRect(readerX-35,readerY-50,70,100);
    // Slot opening
    ctx.fillStyle='#000';ctx.fillRect(readerX-20,readerY-3,40,6);
    ctx.fillStyle=accent;ctx.font='8px Orbitron';ctx.fillText('MSR',readerX-10,readerY-35);
    ctx.fillText('READER',readerX-16,readerY+45);

    // Card (moving during swipe)
    const cardBaseX=canvas.width-130;
    const cardX=swiping?cardBaseX-swipeProgress*(cardBaseX-readerX-20):cardBaseX;
    const cardY=readerY;
    ctx.save();ctx.translate(cardX,cardY);
    // Card body
    ctx.fillStyle='#1a1a3e';ctx.strokeStyle='#4488ff';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(-50,-32,100,64,6);ctx.fill();ctx.stroke();
    // Magnetic stripe
    ctx.fillStyle='#222';ctx.fillRect(-45,-10,90,12);
    // Magnetic data visualization on stripe
    for(let i=0;i<30;i++){
      const x=-42+i*3;const h=Math.sin(waveTime*3+i*0.5)*4;
      ctx.fillStyle=swiping?`rgba(255,51,51,${0.5+Math.sin(waveTime*5+i)*0.3})`:'#444';
      ctx.fillRect(x,-4+h,2,Math.abs(h)+2);
    }
    // Card chip
    ctx.fillStyle='#d4a03c';ctx.fillRect(-35,-28,16,12);ctx.strokeStyle='#b8860b';ctx.lineWidth=0.5;ctx.strokeRect(-35,-28,16,12);
    // Card number hint
    ctx.fillStyle='#667';ctx.font='7px Orbitron';ctx.fillText('XXXX XXXX',-20,20);
    ctx.restore();

    // Read head animation
    if(swiping){
      const readX=readerX;
      ctx.strokeStyle='#ff3333';ctx.lineWidth=1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(cardX+50,cardY);ctx.lineTo(readX-20,readerY);ctx.stroke();
      ctx.setLineDash([]);
      // Magnetic flux lines
      for(let i=0;i<5;i++){
        const phase=(waveTime*4+i*1.5)%5;const r=phase/5*30;const alpha=1-phase/5;
        ctx.strokeStyle=`rgba(255,51,51,${alpha*0.4})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(readerX,readerY,10+r,-1,1);ctx.stroke();
      }
      ctx.fillStyle='#ff3333';ctx.font='10px Orbitron';
      ctx.fillText('READING STRIPE',canvas.width/2-50,20);
    }

    // Track data display
    if(capturedCards.length>0){
      const last=capturedCards[capturedCards.length-1];
      ctx.fillStyle='rgba(51,255,51,0.8)';ctx.font='7px Orbitron';
      ctx.fillText('T1: '+last.track1.slice(0,35)+'...',20,canvas.height-40);
      ctx.fillText('T2: '+last.track2.slice(0,35)+'...',20,canvas.height-28);
    }

    // Particles
    for(let i=magParticles.length-1;i>=0;i--){
      const p=magParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){magParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color||'#ff3333';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();
      if(p.label){ctx.font='6px Orbitron';ctx.fillText(p.label,p.x+4,p.y-2)}
      ctx.globalAlpha=1;
    }

    // Status bar
    ctx.fillStyle='rgba(51,255,51,0.1)';ctx.fillRect(50,canvas.height-18,canvas.width-100,8);
    ctx.fillStyle='#33ff33';ctx.font='8px Orbitron';
    ctx.fillText(`CARDS: ${capturedCards.length} | BPI: 210 | TRACKS: 1,2,3`,50,canvas.height-6);

    requestAnimationFrame(draw);
  }draw();
}

function spawnMagParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;
  const labels=['BIT','FLUX','T1','T2','CRC','LRC','STX'];
  for(let i=0;i<count;i++){
    magParticles.push({x:70+Math.random()*20,y:canvas.height/2-15+Math.random()*30,vx:2+Math.random()*3,vy:(Math.random()-0.5)*2,life:0.4+Math.random()*0.4,color:color||'#ff3333',size:2+Math.random()*2,label:Math.random()>0.6?labels[Math.floor(Math.random()*labels.length)]:null});
  }
}

function initMagSim(){
  const swipeBtn=$('swipeBtn'),cloneBtn=$('cloneBtn'),detectBtn=$('detectBtn');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(swipeBtn)swipeBtn.addEventListener('click',()=>{
    if(swiping)return;
    swiping=true;swipeProgress=0;
    if(implantDot)implantDot.classList.add('active');
    if(implantStatusText)implantStatusText.textContent='Reader: SWIPING...';
    setStatus(true);showToast('Swiping card...',2000);
    log('💳 Card swipe initiated — reading magnetic stripe...','info');

    const swipeIv=setInterval(()=>{
      swipeProgress+=0.02;
      spawnMagParticles(3,'#ff3333');
      if(swipeProgress>=1){
        clearInterval(swipeIv);swiping=false;swipeProgress=0;
        const card=randomTrackData();capturedCards.push(card);
        if(dataLog)dataLog.textContent=capturedCards.slice(-5).map(c=>`[${c.timestamp}] ${c.name} ${c.number}`).join('\n');
        if(outputDisplay)outputDisplay.textContent=[`CARD DATA CAPTURED`,`══════════════════`,`Name: ${card.name}`,`Number: ${card.number}`,`Expiry: ${card.expiry}`,``,`Track 1: ${card.track1}`,`Track 2: ${card.track2}`,``,`Encoding: ISO 7811`,`BPI: 210 (Track 2)`].join('\n');
        log(`💳 Card captured: ${card.name} — ${card.number}`,'rx');
        if(implantDot)implantDot.classList.remove('active');
        if(implantStatusText)implantStatusText.textContent='Reader: Card captured';
        hideToast();
      }
    },40);
  });

  if(cloneBtn)cloneBtn.addEventListener('click',()=>{
    if(capturedCards.length===0){log('No cards captured yet','error');return}
    showToast('Cloning card to blank...',2500);log('📋 Writing magnetic data to blank card...','info');
    spawnMagParticles(20,'#ff6600');
    setTimeout(()=>{
      const card=capturedCards[capturedCards.length-1];
      if(outputDisplay)outputDisplay.textContent=[`CLONE COMPLETE`,`══════════════════`,`Source: ${card.name}`,`Written tracks: 1, 2`,`Encoding: F2F (Aiken Biphase)`,`Coercivity: Hi-Co 4000 Oe`,`Verification: PASS`,``,`⚠️ Clone is functional replica`,`Detection: Jitter analysis, CVV mismatch`].join('\n');
      log('📋 Card cloned successfully — written to blank','success');hideToast();
    },2000);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Scanning for skimmer devices...',2500);log('🛡️ Skimmer detection scan...','info');
    spawnMagParticles(25,'#4488ff');
    let step=0;
    const checks=['Visual overlay inspection','Bluetooth scan (HC-05/06)','Card slot wiggle test','Pinhole camera check','RF emission sweep'];
    const iv=setInterval(()=>{
      if(step<checks.length){log(`🔍 ${checks[step]}...`,'info');step++}
      else{
        clearInterval(iv);const found=Math.random()>0.5;
        if(outputDisplay)outputDisplay.textContent=found?['⚠️ SKIMMER DETECTED','══════════════════','Type: Overlay skimmer','Bluetooth: HC-06 (active)','Signal: -45 dBm','Camera: Pinhole found near PIN pad','','RECOMMENDED:','• Do not use this ATM','• Report to bank','• Cover PIN entry always'].join('\n'):['✅ NO SKIMMER DETECTED','══════════════════','Overlay: None found','Bluetooth: No rogue devices','Card slot: Firmly attached','PIN pad: No cameras detected','','ATM appears safe to use.'].join('\n');
        log(found?'🚨 Skimmer detected on card reader!':'✅ No skimmer found — reader appears clean',found?'error':'success');hideToast();
      }
    },500);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{spawnMagParticles(30,'#d4a03c');log('📡 Magnetic stripe analysis sweep...','info');showToast('Analyzing magnetic patterns...',3000);let step=0;const phases=['Track 1 (IATA)','Track 2 (ABA)','Track 3 (THRIFT)','Coercivity measurement','Jitter analysis'];const iv=setInterval(()=>{if(step<phases.length){if(dataLog)dataLog.textContent+=`\n[SWEEP] ${phases[step]}...`;step++}else{clearInterval(iv);log('📡 Magnetic analysis complete','success')}},500)});
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
  initHijriDate();initSimCanvas();initMagSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
