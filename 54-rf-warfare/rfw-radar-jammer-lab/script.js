/**
 * Workshop DIY — Radar Jammer Lab v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $=id=>document.getElementById(id);
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

const LANG={
  en:{title:'Radar Jammer Lab',subtitle:'Radar Jammer Lab',disconnected:'Idle',connected:'Jamming',mainSection:'Radar Jammer Lab',mainDesc:'Simulate radar jamming and ECM techniques',sectionA:'Jamming History',sectionB:'ECM Reference',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',working:'Working...',ready:'Radar Jammer Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startJam:'Start Jamming',analyze:'Analyze',resetSim:'Reset'},
  fr:{title:'Labo Brouilleur Radar',subtitle:'Labo Brouilleur Radar',disconnected:'Inactif',connected:'Brouillage',mainSection:'Labo Brouilleur Radar',mainDesc:'Simuler le brouillage radar et les techniques CME',sectionA:'Historique',sectionB:'Reference CME',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours...',ready:'Labo Brouilleur pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startJam:'Demarrer Brouillage',analyze:'Analyser',resetSim:'Reinitialiser'},
  ar:{title:'\u0645\u062e\u062a\u0628\u0631 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',subtitle:'\u0645\u062e\u062a\u0628\u0631 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0634\u0648\u064a\u0634',mainSection:'\u0645\u062e\u062a\u0628\u0631 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',sectionA:'\u0627\u0644\u0633\u062c\u0644',sectionB:'\u0645\u0631\u062c\u0639',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062e\u062a\u0628\u0631 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startJam:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0634\u0648\u064a\u0634',analyze:'\u062a\u062d\u0644\u064a\u0644',resetSim:'\u0625\u0639\u0627\u062f\u0629'}
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

let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=on?s.connected:s.disconnected;if(p)p.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function initPanels(){
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hP=$('helpPanel'),hO=$('helpOverlay');
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sP=$('settingsPanel'),sO=$('settingsOverlay');
  const lBtn=$('logBtn'),lC=$('logCloseBtn'),lP=$('logPanel');
  if(hBtn)hBtn.onclick=()=>{hP.classList.toggle('open');hO.classList.toggle('active');};
  if(hC)hC.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};
  if(hO)hO.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};
  if(sBtn)sBtn.onclick=()=>{sP.classList.toggle('open');sO.classList.toggle('active');};
  if(sC)sC.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};
  if(sO)sO.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};
  if(lBtn)lBtn.onclick=()=>lP.classList.toggle('open');
  if(lC)lC.onclick=()=>lP.classList.remove('open');
  const ls=$('langSelect'),ts=$('themeSelect'),st=$('soundToggle');
  if(ls)ls.onchange=()=>setLanguage(ls.value);
  if(ts)ts.onchange=()=>setTheme(ts.value);
  if(st)st.onchange=()=>{soundEnabled=st.checked;};
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;
  if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;
  if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');});});
}

/* ═══════ RADAR SIM ═══════ */
let jamming=false,time=0,sweepAngle=0,targets=[];
function initTargets(){targets=[];for(let i=0;i<8;i++)targets.push({r:0.2+Math.random()*0.7,a:Math.random()*Math.PI*2,rcs:5+Math.random()*20,speed:0.001+Math.random()*0.003});}

function drawRadar(){
  const c=$('radarCanvas');if(!c)return;
  const ctx=c.getContext('2d'),W=c.width,H=c.height,cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // PPI scope circles
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,70,0.12)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,70,0.08)';ctx.stroke();
  // Sweep beam
  sweepAngle+=0.03;
  const grad=ctx.createConicalGradient?null:null;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,sweepAngle-0.15,sweepAngle);ctx.closePath();
  ctx.fillStyle='rgba(0,255,70,0.15)';ctx.fill();
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.cos(sweepAngle)*R,cy+Math.sin(sweepAngle)*R);
  ctx.strokeStyle='rgba(0,255,70,0.6)';ctx.lineWidth=2;ctx.stroke();
  // Targets
  const jamPwr=parseInt($('jamPower')?.value||50)/100;
  targets.forEach(t=>{
    t.a+=t.speed;
    const tx=cx+Math.cos(t.a)*t.r*R,ty=cy+Math.sin(t.a)*t.r*R;
    const angleDiff=Math.abs(((sweepAngle-t.a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2));
    const fade=angleDiff<0.5?1-angleDiff/0.5:Math.max(0,1-angleDiff/3);
    if(jamming&&Math.random()<jamPwr*0.7){
      // Jammed—scatter blips
      const jx=tx+(Math.random()-0.5)*60*jamPwr,jy=ty+(Math.random()-0.5)*60*jamPwr;
      ctx.beginPath();ctx.arc(jx,jy,2,0,Math.PI*2);ctx.fillStyle='rgba(0,255,70,'+fade*0.3+')';ctx.fill();
    } else {
      ctx.beginPath();ctx.arc(tx,ty,3+t.rcs/10,0,Math.PI*2);ctx.fillStyle='rgba(0,255,70,'+fade*0.8+')';ctx.fill();
    }
  });
  // Noise jamming overlay
  if(jamming){
    const jType=$('jamType')?.value||'noise';
    if(jType==='noise'){
      for(let i=0;i<300*jamPwr;i++){
        const rx=Math.random()*W,ry=Math.random()*H;
        const dist=Math.sqrt((rx-cx)**2+(ry-cy)**2);
        if(dist<R){ctx.fillStyle='rgba(0,255,70,'+(Math.random()*0.15*jamPwr)+')';ctx.fillRect(rx,ry,2,2);}
      }
    } else if(jType==='spot'){
      const band=R*0.1;
      ctx.fillStyle='rgba(0,255,70,'+jamPwr*0.3+')';
      ctx.fillRect(cx-R,cy-band,R*2,band*2);
    } else if(jType==='sweep'){
      const sw=time*2%Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,sw-0.3,sw+0.3);ctx.closePath();
      ctx.fillStyle='rgba(255,100,0,'+jamPwr*0.3+')';ctx.fill();
    }
  }
  ctx.fillStyle='rgba(0,255,70,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PPI SCOPE — RANGE: '+($('radarRange')?.value||100)+' km',8,16);
  if(jamming){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('ECM ACTIVE — '+($('jamType')?.value||'noise').toUpperCase(),8,32);}
}

function drawSpectrum(){
  const c=$('spectrumCanvas');if(!c)return;
  const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const freq=parseFloat($('radarFreq')?.value||10);
  const jamPwr=parseInt($('jamPower')?.value||50);
  // Radar return signal
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const f=x/W*40;
    let y=H*0.8;
    const diff=Math.abs(f-freq);
    if(diff<1)y=H*0.2*(diff/1);
    if(jamming){y=Math.min(y,H*0.1+Math.random()*H*0.4*(jamPwr/100));}
    y+=Math.random()*3;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=jamming?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('SPECTRUM — 0-40 GHz',5,14);
}

function animate(){time+=0.016;drawRadar();drawSpectrum();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){
  const s=$('infoStats');if(!s)return;
  s.innerHTML='<b>Type:</b> '+($('jamType')?.value||'noise')+'<br><b>Power:</b> '+($('jamPower')?.value||50)+' dBm<br><b>Freq:</b> '+($('radarFreq')?.value||10)+' GHz<br><b>Status:</b> '+(jamming?'<span style="color:#ff4444">JAMMING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

function initControls(){
  $('jamPower').oninput=()=>{$('jamPowerLabel').textContent=$('jamPower').value+' dBm';};
  $('radarFreq').oninput=()=>{$('radarFreqLabel').textContent=$('radarFreq').value+' GHz';};
  $('radarRange').oninput=()=>{$('radarRangeLabel').textContent=$('radarRange').value+' km';};
  $('startBtn').onclick=()=>{jamming=!jamming;setStatus(jamming);$('startBtn').querySelector('span:last-child').textContent=jamming?'Stop Jamming':LANG[currentLang].startJam;log(jamming?'Jamming ACTIVE — '+$('jamType').value+' mode':'Jamming stopped',jamming?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Analyzing ECM effectiveness...',1500);setTimeout(()=>{const eff=jamming?(parseInt($('jamPower').value)*0.8+Math.random()*20).toFixed(1):0;log('ECM Analysis: '+eff+'% target suppression','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{jamming=false;setStatus(false);initTargets();log('Simulation reset','info');};
}

function initRefDB(){
  const db=$('refDatabase');if(!db)return;
  db.innerHTML=['<b>Noise Barrage:</b> Broadband noise across entire radar bandwidth.','<b>Spot Jamming:</b> Concentrated energy on specific radar frequency.','<b>Sweep Jamming:</b> Rapidly sweeping across frequency range.','<b>Deceptive ECM:</b> False targets via range-gate pull-off (RGPO).','<b>DRFM:</b> Digital RF Memory for coherent deception.','<b>Cross-eye:</b> Angular deception using phase-shifted signals.'].join('<br><br>');
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initTargets();initRefDB();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();
});

/* ═══════ ENHANCED RF CANVAS — RADAR JAMMER ═══════ */
(function(){
  const _$=id=>document.getElementById(id);
  let _t=0;
  const _particles=[];
  let _rcsHistory=new Array(200).fill(0);
  let _doppler=new Float32Array(256).fill(-80);
  let _wfBuf=[];
  const MAX_WF=100;
  let _falseTargets=[];
  for(let i=0;i<15;i++)_falseTargets.push({r:0.1+Math.random()*0.8,a:Math.random()*Math.PI*2,speed:0.01+Math.random()*0.02,size:2+Math.random()*4,blink:Math.random()*Math.PI*2});

  class JamParticle{constructor(x,y,a){this.x=x;this.y=y;this.vx=Math.cos(a)*3;this.vy=Math.sin(a)*3;this.life=1;this.decay=0.02+Math.random()*0.02;this.size=1+Math.random()*2;}
  update(){this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;return this.life>0;}
  draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,100,0,'+this.life*0.6+')';ctx.fill();}}

  /* ── A-Scope Display ── */
  function drawAScope(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('A-SCOPE — RANGE vs AMPLITUDE',5,12);
    const isJam=typeof jamming!=='undefined'&&jamming;
    const pwr=parseInt(_$('jamPower')?.value||50)/100;
    ctx.beginPath();
    for(let x=0;x<W;x++){
      const range=x/W;let amp=H*0.85+Math.random()*4;
      if(typeof targets!=='undefined')targets.forEach(t=>{const d=Math.abs(range-t.r);if(d<0.03){amp=H*0.2+d/0.03*H*0.5;if(isJam&&Math.random()<pwr*0.6)amp=H*0.3+Math.random()*H*0.4;}});
      if(isJam){amp-=Math.random()*H*0.15*pwr;}
      if(x===0)ctx.moveTo(x,amp);else ctx.lineTo(x,amp);
    }
    ctx.strokeStyle=isJam?'rgba(255,100,0,0.7)':'rgba(0,255,70,0.7)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,H*0.85);ctx.lineTo(W,H*0.85);ctx.strokeStyle='rgba(0,255,70,0.15)';ctx.lineWidth=1;ctx.stroke();
    for(let i=0;i<=5;i++){const x=i*W/5;ctx.fillStyle='rgba(0,255,136,0.25)';ctx.fillText((i*20)+'km',x+2,H-3);}
  }

  /* ── Doppler Processing Display ── */
  function drawDoppler(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('DOPPLER VELOCITY PROFILE',5,12);
    const isJam=typeof jamming!=='undefined'&&jamming;
    const pwr=parseInt(_$('jamPower')?.value||50)/100;
    for(let i=0;i<256;i++){
      const v=(i-128)/128*500;
      let level=-80+Math.random()*3;
      if(typeof targets!=='undefined')targets.forEach(t=>{const tV=t.speed*10000;if(Math.abs(v-tV)<30)level+=20;});
      if(isJam)level+=Math.random()*25*pwr;
      _doppler[i]=_doppler[i]*0.8+level*0.2;
    }
    ctx.beginPath();
    for(let i=0;i<256;i++){const x=(i/256)*W;const y=H-10-((_doppler[i]+85)/60)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.strokeStyle=isJam?'rgba(255,100,0,0.6)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.moveTo(W/2,15);ctx.lineTo(W/2,H-10);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('0 m/s',W/2,H-1);ctx.fillText('-500',5,H-1);ctx.fillText('+500',W-20,H-1);
  }

  /* ── False Target Generator (DRFM) ── */
  function drawDRFM(ctx,W,H,cx,cy,R){
    const isJam=typeof jamming!=='undefined'&&jamming;
    if(!isJam)return;
    const jType=_$('jamType')?.value||'noise';
    if(jType!=='noise'){
      _falseTargets.forEach((ft,i)=>{
        ft.a+=ft.speed;
        const fx=cx+Math.cos(ft.a)*ft.r*R;
        const fy=cy+Math.sin(ft.a)*ft.r*R;
        const fade=0.3+Math.sin(_t*3+ft.blink)*0.3;
        ctx.beginPath();ctx.arc(fx,fy,ft.size*(0.5+Math.sin(_t*5+i)*0.3),0,Math.PI*2);
        ctx.fillStyle='rgba(0,255,70,'+fade+')';ctx.fill();
      });
      ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='9px Orbitron,monospace';ctx.textAlign='right';
      ctx.fillText('DRFM FALSE TARGETS: '+_falseTargets.length,W-8,H-8);
    }
  }

  /* ── RCS Fluctuation Chart ── */
  function drawRCSChart(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('TARGET RCS FLUCTUATION (dBsm)',5,12);
    const isJam=typeof jamming!=='undefined'&&jamming;
    let rcs=5+Math.sin(_t*2)*3+Math.random()*2;
    if(isJam){rcs+=Math.random()*15-5;rcs*=(0.3+Math.random()*0.7);}
    _rcsHistory.push(rcs);if(_rcsHistory.length>200)_rcsHistory.shift();
    ctx.beginPath();
    _rcsHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-((v+5)/25)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
    if(isJam){ctx.fillStyle='rgba(255,100,0,0.3)';ctx.font='8px Orbitron,monospace';ctx.fillText('ECM DEGRADED',W-100,25);}
  }

  /* ── Radar Waterfall ── */
  function drawRadarWaterfall(ctx,W,H){
    const isJam=typeof jamming!=='undefined'&&jamming;
    const pwr=parseInt(_$('jamPower')?.value||50)/100;
    const row=new Uint8Array(W);
    for(let x=0;x<W;x++){
      let v=Math.random()*20;
      if(typeof targets!=='undefined')targets.forEach(t=>{const d=Math.abs(x/W-t.r);if(d<0.02)v+=60;});
      if(isJam)v+=Math.random()*80*pwr;
      row[x]=Math.min(255,v);
    }
    _wfBuf.unshift(row);if(_wfBuf.length>MAX_WF)_wfBuf.pop();
    const rh=H/MAX_WF;
    _wfBuf.forEach((r,ri)=>{for(let x=0;x<W;x+=2){const v=r[x];
      ctx.fillStyle='rgb('+(v>150?255:v*1.7)+','+(v>100?v:v*0.5)+','+(v<60?v*3:0)+')';
      ctx.fillRect(x,ri*rh,2,rh+1);}});
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('RANGE-TIME WATERFALL',5,H-5);
  }

  /* ── Burn-Through Range Calculator ── */
  function drawBurnThrough(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('BURN-THROUGH ANALYSIS',5,12);
    const pwr=parseInt(_$('jamPower')?.value||50);
    const freq=parseFloat(_$('radarFreq')?.value||10);
    const radarPwr=80;
    const burnRange=Math.sqrt(radarPwr/(pwr*0.1+0.01))*20;
    const maxRange=parseInt(_$('radarRange')?.value||100);
    // Range bar
    ctx.fillStyle='rgba(0,200,255,0.15)';ctx.fillRect(10,30,W-20,20);
    const burnX=Math.min(1,burnRange/maxRange)*(W-20);
    ctx.fillStyle='rgba(255,50,50,0.3)';ctx.fillRect(10,30,burnX,20);
    ctx.fillStyle='rgba(0,255,70,0.3)';ctx.fillRect(10+burnX,30,W-20-burnX,20);
    ctx.strokeStyle='rgba(255,200,0,0.8)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(10+burnX,25);ctx.lineTo(10+burnX,55);ctx.stroke();
    ctx.fillStyle='rgba(255,200,0,0.7)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('BURN-THROUGH: '+burnRange.toFixed(1)+' km',10+burnX,22);
    ctx.fillStyle='rgba(255,80,80,0.6)';ctx.textAlign='left';ctx.fillText('JAMMED ZONE',15,44);
    ctx.fillStyle='rgba(0,200,100,0.6)';ctx.textAlign='right';ctx.fillText('DETECTION ZONE',W-15,44);
    // J/S ratio indicator
    const jsRatio=pwr-radarPwr+20*Math.log10(50/(burnRange||1));
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('J/S Ratio: '+(jsRatio>0?'+':'')+jsRatio.toFixed(1)+' dB',10,70);
    ctx.fillText('Radar Power: '+radarPwr+' dBm | Jammer: '+pwr+' dBm',10,82);
    ctx.fillText('Frequency: '+freq+' GHz',10,94);
    // Effectiveness gauge
    const eff=Math.min(100,Math.max(0,pwr*1.2-20));
    const gaugeW=W-20;
    ctx.fillStyle='rgba(50,50,50,0.5)';ctx.fillRect(10,105,gaugeW,12);
    const gColor=eff>70?'rgba(0,200,100,0.7)':eff>40?'rgba(255,200,0,0.7)':'rgba(255,50,50,0.7)';
    ctx.fillStyle=gColor;ctx.fillRect(10,105,gaugeW*eff/100,12);
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('ECM EFFECTIVENESS: '+eff.toFixed(0)+'%',W/2,115);
  }

  function enhancedRender(){
    _t+=0.016;
    for(let i=_particles.length-1;i>=0;i--)if(!_particles[i].update())_particles.splice(i,1);
    const rc=_$('radarCanvas');
    if(rc){const ctx=rc.getContext('2d');const W=rc.width,H=rc.height;
      const cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
      drawDRFM(ctx,W,H,cx,cy,R);
      if(typeof jamming!=='undefined'&&jamming){
        for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;_particles.push(new JamParticle(cx,cy,a));}
        _particles.forEach(p=>p.draw(ctx));
      }
    }
    const sc=_$('spectrumCanvas');
    if(sc){const ctx=sc.getContext('2d');const W=sc.width,H=sc.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
      drawAScope(ctx,W,H*0.5);
      ctx.save();ctx.translate(0,H*0.5);drawDoppler(ctx,W,H*0.5);ctx.restore();
    }
    requestAnimationFrame(enhancedRender);
  }
  setTimeout(()=>{enhancedRender();},500);
})();
