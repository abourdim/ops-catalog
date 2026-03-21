/**
 * Workshop DIY — Drone Hijacker Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Drone Hijacker Sim',subtitle:'Drone Hijacker Sim',disconnected:'Idle',connected:'Hijacking',mainSection:'Drone Hijacker Sim',mainDesc:'Simulate drone RF link hijacking',sectionA:'Detected Drones',sectionB:'Attack Vectors',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',working:'Working...',ready:'Drone Hijacker ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startHijack:'Hijack Link',analyze:'Scan Links',resetSim:'Reset'},
  fr:{title:'Sim Piratage Drone',subtitle:'Sim Piratage Drone',disconnected:'Inactif',connected:'Piratage',mainSection:'Sim Piratage Drone',mainDesc:'Simuler le piratage de lien RF drone',sectionA:'Drones Detectes',sectionB:'Vecteurs d\'Attaque',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',working:'En cours...',ready:'Pirate Drone pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startHijack:'Pirater Lien',analyze:'Scanner',resetSim:'Reinitialiser'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641 \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641 \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0627\u062e\u062a\u0637\u0627\u0641',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u062e\u062a\u0637\u0627\u0641 \u0631\u0648\u0627\u0628\u0637 RF',sectionA:'\u0637\u0627\u0626\u0631\u0627\u062a \u0645\u0643\u062a\u0634\u0641\u0629',sectionB:'\u0646\u0627\u0642\u0644\u0627\u062a \u0627\u0644\u0647\u062c\u0648\u0645',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startHijack:'\u0627\u062e\u062a\u0637\u0627\u0641',analyze:'\u0645\u0633\u062d',resetSim:'\u0625\u0639\u0627\u062f\u0629'}
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
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+n,'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=on?s.connected:s.disconnected;if(p)p.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initPanels(){const hB=$('helpBtn'),hC=$('helpCloseBtn'),hP=$('helpPanel'),hO=$('helpOverlay'),sB=$('settingsBtn'),sC=$('settingsCloseBtn'),sP=$('settingsPanel'),sO=$('settingsOverlay'),lB=$('logBtn'),lC=$('logCloseBtn'),lP=$('logPanel');if(hB)hB.onclick=()=>{hP.classList.toggle('open');hO.classList.toggle('active');};if(hC)hC.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};if(hO)hO.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};if(sB)sB.onclick=()=>{sP.classList.toggle('open');sO.classList.toggle('active');};if(sC)sC.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};if(sO)sO.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};if(lB)lB.onclick=()=>lP.classList.toggle('open');if(lC)lC.onclick=()=>lP.classList.remove('open');const ls=$('langSelect'),ts=$('themeSelect'),st=$('soundToggle');if(ls)ls.onchange=()=>setLanguage(ls.value);if(ts)ts.onchange=()=>setTheme(ts.value);if(st)st.onchange=()=>{soundEnabled=st.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const tg=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tg)tg.classList.add('active');});});}

/* ═══════ DRONE SIM ═══════ */
let hijacking=false,time=0,drones=[];
function initDrones(){drones=[];const names=['Phantom-4','Mavic-Pro','Inspire-2','Matrice-300','FPV-Racer','Skydio-X2','Autel-Evo','Parrot-Anafi'];for(let i=0;i<6;i++){drones.push({name:names[i%names.length]+'-'+Math.floor(Math.random()*99),x:100+Math.random()*580,y:50+Math.random()*200,alt:50+Math.random()*300,freq:900+Math.floor(Math.random()*5)*1000,rssi:-40-Math.random()*30,protocol:['mavlink','dsmx','wifi','lightbridge'][i%4],hijacked:false,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*1,phase:Math.random()*Math.PI*2});}}

function drawDroneView(){
  const c=$('droneCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Grid
  for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.05)';ctx.lineWidth=1;ctx.stroke();}
  for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Ground station
  ctx.beginPath();ctx.arc(W/2,H-30,8,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('GCS',W/2,H-12);
  // Attacker
  if(hijacking){ctx.beginPath();ctx.arc(W/2-150,H-30,8,0,Math.PI*2);ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fill();ctx.fillStyle='rgba(255,50,50,0.5)';ctx.fillText('ATTACKER',W/2-150,H-12);}
  // Drones
  drones.forEach((d,i)=>{
    d.x+=d.vx+Math.sin(time*2+d.phase)*0.5;d.y+=d.vy*0.3+Math.cos(time*1.5+d.phase)*0.3;
    if(d.x<30||d.x>W-30)d.vx*=-1;if(d.y<20||d.y>H-80)d.vy*=-1;
    d.x=Math.max(30,Math.min(W-30,d.x));d.y=Math.max(20,Math.min(H-80,d.y));
    const hj=hijacking&&i<3;d.hijacked=hj;
    // Link line to GCS
    ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(W/2,H-30);ctx.strokeStyle=hj?'rgba(255,50,50,0.15)':'rgba(0,200,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    // Hijack link line
    if(hj){ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(W/2-150,H-30);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
      // Pulse
      ctx.beginPath();ctx.arc(d.x,d.y,18+Math.sin(time*5+i)*6,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.3)';ctx.lineWidth=2;ctx.stroke();}
    // Drone marker
    ctx.save();ctx.translate(d.x,d.y);
    ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(8,4);ctx.lineTo(-8,4);ctx.closePath();
    ctx.fillStyle=hj?'rgba(255,80,80,0.9)':'rgba(0,220,160,0.8)';ctx.fill();ctx.restore();
    ctx.fillStyle=hj?'#ff6666':'#66ffaa';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(d.name,d.x,d.y-14);
    if(hj)ctx.fillText('HIJACKED',d.x,d.y+16);
  });
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('AIRSPACE MONITOR — DRONE TRACKING',8,16);
  if(hijacking){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('LINK HIJACK ACTIVE',8,32);}
}

function drawLinkView(){
  const c=$('linkCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const freq=parseInt($('linkFreq')?.value||2400);
  ctx.beginPath();
  for(let x=0;x<W;x++){const f=x/W*6000;let y=H*0.85;const diff=Math.abs(f-freq);if(diff<200)y=H*0.15+H*0.7*(diff/200);
    if(hijacking&&diff<300)y=Math.min(y,H*0.1+Math.random()*H*0.3);y+=Math.random()*2;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=hijacking?'rgba(255,80,80,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('LINK SPECTRUM — 0-6 GHz',5,14);
}

function animate(){time+=0.016;drawDroneView();drawLinkView();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){const s=$('infoStats');if(!s)return;const hc=drones.filter(d=>d.hijacked).length;s.innerHTML='<b>Drones:</b> '+drones.length+' detected<br><b>Hijacked:</b> <span style="color:'+(hc?'#ff4444':'#00cc88')+'">'+hc+'</span><br><b>Freq:</b> '+($('linkFreq')?.value||2400)+' MHz<br><b>Protocol:</b> '+($('protocol')?.value||'mavlink');}

function updateDroneList(){const lib=$('libraryList');if(!lib)return;lib.innerHTML='';drones.forEach(d=>{const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(d.hijacked?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');r.innerHTML='<span style="color:'+(d.hijacked?'#ff6666':'#66ffaa')+'">'+d.name+'</span><span>'+d.protocol+'</span><span>'+d.freq+' MHz</span><span>RSSI: '+d.rssi.toFixed(0)+'</span><span style="color:'+(d.hijacked?'#ff4444':'#00cc88')+'">'+(d.hijacked?'HIJACKED':'SECURE')+'</span>';lib.appendChild(r);});}

function initControls(){
  $('linkFreq').oninput=()=>{$('linkFreqLabel').textContent=$('linkFreq').value+' MHz';};
  $('injectPower').oninput=()=>{$('injectPowerLabel').textContent=$('injectPower').value+' dBm';};
  $('altitude').oninput=()=>{$('altLabel').textContent=$('altitude').value+' m';};
  $('startBtn').onclick=()=>{hijacking=!hijacking;setStatus(hijacking);$('startBtn').querySelector('span:last-child').textContent=hijacking?'Release Link':LANG[currentLang].startHijack;log(hijacking?'HIJACK ACTIVE — overriding command links on '+$('protocol').value:'Link hijack released',hijacking?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Scanning drone links...',1500);setTimeout(()=>{log('Scan complete: '+drones.length+' drone links detected','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{hijacking=false;setStatus(false);initDrones();log('Simulation reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Command Injection:</b> Override MAVLink/DSMX commands with stronger signal.','<b>GPS Spoofing:</b> Feed false GPS to redirect drone flight path.','<b>De-auth Attack:</b> Disconnect WiFi FPV drones from controller.','<b>Replay Attack:</b> Record and replay control packets.','<b>Protocol Exploit:</b> Leverage unencrypted telemetry channels.','<b>Signal Jamming:</b> Deny command link forcing fail-safe behavior.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initDrones();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();setInterval(updateDroneList,1000);});

/* ═══════ ENHANCED RF CANVAS — DRONE HIJACKER ═══════ */
(function(){
const _$=id=>document.getElementById(id);
let _t=0;
let _linkQuality=new Array(250).fill(100);
let _packetLoss=new Array(250).fill(0);
let _telemetryBuf=[];
const MAX_TEL=80;
let _signalConst=[];
for(let i=0;i<64;i++)_signalConst.push({i:Math.random()*2-1,q:Math.random()*2-1});
let _hopHistory=[];
let _droneTrails={};

/* ── Signal Constellation Diagram (IQ Plot) ── */
function drawConstellation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('IQ CONSTELLATION — COMMAND LINK',5,12);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R*0.6,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  _signalConst.forEach((pt,i)=>{
    let ni=pt.i+Math.random()*0.1-0.05;
    let nq=pt.q+Math.random()*0.1-0.05;
    if(isHijack){ni+=Math.random()*0.6-0.3;nq+=Math.random()*0.6-0.3;}
    const px=cx+ni*R*0.8,py=cy+nq*R*0.8;
    ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);
    ctx.fillStyle=isHijack?'rgba(255,80,80,'+(0.4+Math.random()*0.4)+')':'rgba(0,200,255,'+(0.5+Math.random()*0.3)+')';
    ctx.fill();
  });
  if(isHijack){ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='8px Orbitron,monospace';ctx.fillText('SIGNAL DEGRADED',W-110,H-5);}
}

/* ── Link Quality & Packet Loss Chart ── */
function drawLinkQuality(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('LINK QUALITY / PACKET LOSS',5,12);
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  const pwr=parseInt(_$('injectPower')?.value||20);
  let q=isHijack?Math.max(5,100-pwr*2+Math.random()*20):95+Math.random()*5;
  let pl=isHijack?Math.min(80,pwr*1.5+Math.random()*15):Math.random()*2;
  _linkQuality.push(q);if(_linkQuality.length>250)_linkQuality.shift();
  _packetLoss.push(pl);if(_packetLoss.length>250)_packetLoss.shift();
  // Quality
  ctx.beginPath();
  _linkQuality.forEach((v,i)=>{const x=(i/250)*W;const y=20+(100-v)/100*(H-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
  // Packet loss
  ctx.beginPath();
  _packetLoss.forEach((v,i)=>{const x=(i/250)*W;const y=20+(100-v)/100*(H-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,80,80,0.7)';ctx.lineWidth=1.5;ctx.stroke();
  // Labels
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.fillText('Quality: '+q.toFixed(0)+'%',W-120,H-15);
  ctx.fillStyle='rgba(255,80,80,0.5)';ctx.fillText('Loss: '+pl.toFixed(0)+'%',W-120,H-5);
}

/* ── Frequency Hopping Tracker ── */
function drawFreqHopping(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('FREQUENCY HOPPING PATTERN',5,12);
  if(_t%0.15<0.02){
    const freq=2400+Math.floor(Math.random()*80)*5;
    _hopHistory.push({t:_t,f:freq});
    if(_hopHistory.length>150)_hopHistory.shift();
  }
  _hopHistory.forEach((h,i)=>{
    const x=(i/150)*W;
    const y=25+((h.f-2400)/400)*(H-35);
    ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);
    const age=1-i/150;
    ctx.fillStyle='rgba(0,200,255,'+age*0.7+')';ctx.fill();
    if(i>0){ctx.beginPath();const prev=_hopHistory[i-1];
      ctx.moveTo(((i-1)/150)*W,25+((prev.f-2400)/400)*(H-35));ctx.lineTo(x,y);
      ctx.strokeStyle='rgba(0,200,255,'+age*0.2+')';ctx.lineWidth=0.5;ctx.stroke();}
  });
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
  for(let f=2400;f<=2480;f+=20){const y=25+((f-2400)/400)*(H-35);ctx.fillText(f+'',W-3,y+3);}
}

/* ── Drone Altitude Profile ── */
function drawAltProfile(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ALTITUDE PROFILE — TRACKED DRONES',5,12);
  if(typeof drones==='undefined')return;
  drones.forEach((d,i)=>{
    if(!_droneTrails[d.name])_droneTrails[d.name]=[];
    _droneTrails[d.name].push(d.alt+Math.sin(_t*2+i)*10);
    if(_droneTrails[d.name].length>200)_droneTrails[d.name].shift();
    const trail=_droneTrails[d.name];
    const colors=['rgba(0,200,255,','rgba(0,255,136,','rgba(255,200,0,','rgba(200,100,255,','rgba(255,100,100,','rgba(100,255,200,'];
    ctx.beginPath();
    trail.forEach((alt,j)=>{const x=(j/200)*W;const y=H-10-(alt/400)*(H-30);if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle=colors[i%colors.length]+'0.6)';ctx.lineWidth=1;ctx.stroke();
  });
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';
  for(let a=0;a<=400;a+=100){const y=H-10-(a/400)*(H-30);ctx.fillText(a+'m',3,y+3);}
}

/* ── MAVLink Protocol Packet View ── */
function drawProtocolView(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PROTOCOL PACKET ANALYSIS',5,12);
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  const proto=_$('protocol')?.value||'mavlink';
  const packetTypes=['HEARTBEAT','GPS_RAW','ATTITUDE','RC_CHANNELS','SYS_STATUS','COMMAND_LONG','MISSION_ITEM','PARAM_VALUE'];
  const rows=Math.min(packetTypes.length,Math.floor((H-25)/18));
  for(let i=0;i<rows;i++){
    const y=25+i*18;
    const rate=10+Math.random()*40;
    const barW=(rate/50)*(W-180);
    const injected=isHijack&&i<3;
    ctx.fillStyle=injected?'rgba(255,50,50,0.2)':'rgba(0,200,255,0.08)';ctx.fillRect(5,y-1,W-10,16);
    ctx.fillStyle=injected?'rgba(255,50,50,0.3)':'rgba(0,200,255,0.2)';ctx.fillRect(140,y+2,barW,10);
    ctx.fillStyle=injected?'#ff6666':'#66ccff';ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText(packetTypes[i],10,y+11);
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='right';
    ctx.fillText(rate.toFixed(0)+' pkt/s',W-10,y+11);
    if(injected){ctx.fillStyle='rgba(255,50,50,0.7)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';ctx.fillText('INJECTED',135,y+11);}
  }
}

/* ── RF Power Density Map ── */
function drawPowerDensity(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF POWER DENSITY MAP',5,12);
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  const step=12;
  for(let gx=0;gx<W;gx+=step){for(let gy=20;gy<H;gy+=step){
    let power=-70+Math.random()*5;
    const cx=W/2,cy=H-30;
    const dist=Math.sqrt((gx-cx)**2+(gy-cy)**2);
    power+=Math.max(0,30-dist*0.1);
    if(isHijack){const ax=W/2-150,ay=H-30;
      const aDist=Math.sqrt((gx-ax)**2+(gy-ay)**2);
      power+=Math.max(0,40-aDist*0.12);}
    const norm=Math.max(0,Math.min(1,(power+70)/50));
    const r=norm>0.6?255:norm*400;
    const g=norm>0.3&&norm<0.7?200:norm<0.3?norm*600:0;
    const b=norm<0.3?200-norm*600:0;
    ctx.fillStyle='rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+',0.35)';
    ctx.fillRect(gx,gy,step-1,step-1);
  }}
}

function enhancedRender(){
  _t+=0.016;
  const dc=_$('droneCanvas');
  if(dc){const ctx=dc.getContext('2d');const W=dc.width,H=dc.height;
    drawPowerDensity(ctx,W,H);}
  const lc=_$('linkCanvas');
  if(lc){const ctx=lc.getContext('2d');const W=lc.width,H=lc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawConstellation(ctx,W*0.4,H);
    ctx.save();ctx.translate(W*0.4,0);drawLinkQuality(ctx,W*0.6,H*0.5);
    ctx.restore();ctx.save();ctx.translate(W*0.4,H*0.5);drawFreqHopping(ctx,W*0.6,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
})();
