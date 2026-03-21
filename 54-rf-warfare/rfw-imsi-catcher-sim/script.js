/**
 * Workshop DIY — IMSI Catcher Sim v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'IMSI Catcher Sim',subtitle:'IMSI Catcher Sim',disconnected:'Idle',connected:'Deployed',mainSection:'IMSI Catcher Sim',mainDesc:'Simulate fake base station interception',sectionA:'Captured Devices',sectionB:'IMSI Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',working:'Working...',ready:'IMSI Catcher ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:'},
  fr:{title:'Sim Capteur IMSI',subtitle:'Sim Capteur IMSI',disconnected:'Inactif',connected:'Deploye',mainSection:'Sim Capteur IMSI',mainDesc:'Simuler interception par fausse station',sectionA:'Appareils Captures',sectionB:'Techniques IMSI',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',working:'En cours...',ready:'Capteur IMSI pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Sons',splashHint:'appuyer',langChanged:'Francais',themeChanged:'Theme:'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a IMSI',subtitle:'\u0645\u062d\u0627\u0643\u064a IMSI',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0645\u0646\u0634\u0648\u0631',mainSection:'\u0645\u062d\u0627\u0643\u064a IMSI',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',sectionA:'\u0623\u062c\u0647\u0632\u0629 \u0645\u0644\u062a\u0642\u0637\u0629',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0635\u0648\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:'}
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

/* ═══════ IMSI SIM ═══════ */
let deployed=false,time=0,devices=[];
function genIMSI(){return '60302'+Array.from({length:10},()=>Math.floor(Math.random()*10)).join('');}
function genIMEI(){return Array.from({length:15},()=>Math.floor(Math.random()*10)).join('');}
function initDevices(){devices=[];for(let i=0;i<12;i++){devices.push({imsi:genIMSI(),imei:genIMEI(),rssi:-50-Math.random()*40,dist:50+Math.random()*500,connected:false,x:Math.random()*700+40,y:Math.random()*250+40,vx:(Math.random()-0.5)*1.5,vy:(Math.random()-0.5)*1,type:['Phone','Tablet','IoT','Phone','Phone','Phone'][i%6]});}}

function drawCellView(){
  const c=$('cellCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2;
  // Cell tower
  ctx.beginPath();ctx.moveTo(cx-4,cy+20);ctx.lineTo(cx+4,cy+20);ctx.lineTo(cx+2,cy-15);ctx.lineTo(cx-2,cy-15);ctx.closePath();
  ctx.fillStyle=deployed?'rgba(255,80,80,0.8)':'rgba(0,200,255,0.6)';ctx.fill();
  // Antenna
  ctx.beginPath();ctx.arc(cx,cy-20,6,0,Math.PI*2);ctx.fillStyle=deployed?'rgba(255,80,80,0.9)':'rgba(0,200,255,0.7)';ctx.fill();
  // Coverage rings
  const pwr=parseInt($('txPower')?.value||20);
  const maxR=pwr*6;
  for(let i=1;i<=3;i++){
    ctx.beginPath();ctx.arc(cx,cy,maxR*i/3,0,Math.PI*2);
    ctx.strokeStyle=deployed?'rgba(255,80,80,'+(0.3-i*0.08)+')':'rgba(0,200,255,'+(0.15-i*0.04)+')';
    ctx.lineWidth=1;ctx.stroke();
  }
  if(deployed){
    ctx.beginPath();ctx.arc(cx,cy,maxR*(0.8+Math.sin(time*3)*0.1),0,Math.PI*2);
    ctx.strokeStyle='rgba(255,80,80,0.15)';ctx.lineWidth=2;ctx.stroke();
  }
  // Devices
  devices.forEach((d,i)=>{
    d.x+=d.vx*0.3;d.y+=d.vy*0.2;
    if(d.x<20||d.x>W-20)d.vx*=-1;if(d.y<20||d.y>H-20)d.vy*=-1;
    const dist=Math.sqrt((d.x-cx)**2+(d.y-cy)**2);
    d.connected=deployed&&dist<maxR;
    ctx.beginPath();ctx.arc(d.x,d.y,4,0,Math.PI*2);
    ctx.fillStyle=d.connected?'rgba(255,100,100,0.8)':'rgba(100,200,255,0.5)';ctx.fill();
    if(d.connected){
      ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(cx,cy);ctx.strokeStyle='rgba(255,80,80,0.15)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(d.x,d.y,8+Math.sin(time*4+i)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,80,80,0.3)';ctx.stroke();
    }
    ctx.fillStyle=d.connected?'#ff8888':'#88bbff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(d.type,d.x,d.y-8);
  });
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CELL COVERAGE MAP — FAKE BTS',8,16);
  if(deployed){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('BTS DEPLOYED — CAPTURING',8,32);}
}

function drawSpecView(){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const bands={gsm900:900,gsm1800:1800,lte700:700,lte2100:2100};
  const freq=bands[$('band')?.value||'gsm900']||900;
  ctx.beginPath();
  for(let x=0;x<W;x++){const f=x/W*3000;let y=H*0.85;const diff=Math.abs(f-freq);
    if(diff<50)y=deployed?H*0.1:H*0.3;else if(diff<100)y=H*0.5;
    y+=Math.random()*3;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=deployed?'rgba(255,80,80,0.7)':'rgba(0,200,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('CELLULAR SPECTRUM — 0-3 GHz | '+$('band')?.value,5,14);
}

function animate(){time+=0.016;drawCellView();drawSpecView();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){const s=$('infoStats');if(!s)return;const caught=devices.filter(d=>d.connected).length;s.innerHTML='<b>Band:</b> '+($('band')?.value||'gsm900')+'<br><b>Power:</b> '+($('txPower')?.value||20)+' dBm<br><b>Devices:</b> '+devices.length+' in range<br><b>Captured:</b> <span style="color:'+(caught?'#ff4444':'#00cc88')+'">'+caught+'</span><br><b>MCC/MNC:</b> '+($('mcc')?.value||603)+'/'+($('mnc')?.value||'02');}

function updateDevList(){const lib=$('libraryList');if(!lib)return;lib.innerHTML='';devices.filter(d=>d.connected).forEach(d=>{const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.75rem;background:rgba(255,50,50,0.08)';r.innerHTML='<span style="color:#ff8888">'+d.imsi.slice(0,8)+'...</span><span>'+d.type+'</span><span>RSSI: '+d.rssi.toFixed(0)+'</span><span style="color:#ff4444">CAUGHT</span>';lib.appendChild(r);});}

function initControls(){
  $('txPower').oninput=()=>{$('txPowerLabel').textContent=$('txPower').value+' dBm';};
  $('startBtn').onclick=()=>{deployed=!deployed;setStatus(deployed);$('startBtn').querySelector('span:last-child').textContent=deployed?'Shutdown BTS':'Deploy BTS';log(deployed?'FAKE BTS DEPLOYED on '+$('band').value+' — MCC:'+$('mcc').value+' MNC:'+$('mnc').value:'BTS shutdown',deployed?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Scanning cellular devices...',1500);setTimeout(()=>{log('Scan: '+devices.length+' devices, '+devices.filter(d=>d.connected).length+' captured','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{deployed=false;setStatus(false);initDevices();log('Simulation reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Stingray/IMSI Catcher:</b> Fake base station forcing phones to connect.','<b>Downgrade Attack:</b> Force 4G/5G devices to fall back to 2G (no encryption).','<b>Identity Capture:</b> Collect IMSI, IMEI, and TMSI identifiers.','<b>Man-in-the-Middle:</b> Intercept calls and SMS in real-time.','<b>Location Tracking:</b> Triangulate device positions via signal strength.','<b>Silent SMS:</b> Send invisible pings to confirm device presence.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initDevices();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();setInterval(updateDevList,1000);});

/* ═══════ ENHANCED RF CANVAS — IMSI CATCHER ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _rssiHistory=new Array(200).fill(-90);
let _connTimeline=[];let _authFlows=[];
let _cellBarData=new Array(30).fill(0);

/* ── RSSI Heatmap Overlay ── */
function drawRSSIHeatmap(ctx,W,H){
  const isDep=typeof deployed!=='undefined'&&deployed;
  if(!isDep)return;
  const cx=W/2,cy=H/2;const pwr=parseInt(_$('txPower')?.value||20);
  const step=14;
  ctx.save();ctx.globalAlpha=0.12;
  for(let gx=0;gx<W;gx+=step){for(let gy=0;gy<H;gy+=step){
    const dist=Math.sqrt((gx-cx)**2+(gy-cy)**2);
    const rssi=pwr*6-dist*0.8+Math.random()*5;
    const norm=Math.max(0,Math.min(1,rssi/(pwr*6)));
    const r=norm>0.5?255:norm*500;const g=norm<0.5?200:200*(1-norm);
    ctx.fillStyle='rgb('+Math.floor(r)+','+Math.floor(g)+',50)';
    ctx.fillRect(gx,gy,step-1,step-1);
  }}
  ctx.restore();
}

/* ── Authentication Protocol Flow ── */
function drawAuthFlow(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('AUTHENTICATION PROTOCOL FLOW',5,12);
  const isDep=typeof deployed!=='undefined'&&deployed;
  const steps=['IMSI Request','Auth Challenge','Auth Response','Cipher Mode','Connection','Data Intercept'];
  const activeStep=isDep?Math.floor((_t*2)%steps.length):0;
  steps.forEach((s,i)=>{
    const y=25+i*22;const isActive=isDep&&i<=activeStep;
    ctx.fillStyle=isActive?'rgba(255,50,50,0.15)':'rgba(50,50,50,0.2)';
    ctx.fillRect(10,y,W-20,18);
    ctx.fillStyle=isActive?(i===activeStep?'rgba(255,200,0,0.8)':'rgba(255,80,80,0.7)'):'rgba(100,100,100,0.4)';
    ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText((i+1)+'. '+s,15,y+13);
    if(isActive&&i===activeStep){
      ctx.fillStyle='rgba(255,200,0,0.5)';ctx.fillRect(W-60,y+3,40,12);
      ctx.fillStyle='#000';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('ACTIVE',W-40,y+12);
    }
    if(isActive&&i<activeStep){ctx.fillStyle='rgba(0,200,100,0.6)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';ctx.fillText('DONE',W-15,y+13);}
  });
}

/* ── RSSI Time Series ── */
function drawRSSITimeSeries(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RSSI TIMELINE (dBm)',5,12);
  const isDep=typeof deployed!=='undefined'&&deployed;
  const newVal=isDep?-40+Math.random()*15-parseInt(_$('txPower')?.value||20)*0.3:-90+Math.random()*5;
  _rssiHistory.push(newVal);if(_rssiHistory.length>200)_rssiHistory.shift();
  ctx.beginPath();
  _rssiHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-((v+100)/70)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isDep?'rgba(255,80,80,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  const threshY=H-10-((-50+100)/70)*(H-25);
  ctx.beginPath();ctx.moveTo(0,threshY);ctx.lineTo(W,threshY);
  ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.4)';ctx.font='7px Orbitron,monospace';ctx.fillText('CONNECT THRESHOLD',5,threshY-3);
}

/* ── Cell ID Timing Advance Plot ── */
function drawTimingAdvance(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('TIMING ADVANCE — DISTANCE ESTIMATION',5,12);
  if(typeof devices==='undefined')return;
  const cx=W/2,cy=H/2+10;
  devices.forEach((d,i)=>{
    if(!d.connected)return;
    const angle=(i/devices.length)*Math.PI*2;
    const dist=d.dist/600;
    const px=cx+Math.cos(angle)*dist*(W/2-30);
    const py=cy+Math.sin(angle)*dist*(H/2-25);
    ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);
    ctx.fillStyle='rgba(255,100,100,0.7)';ctx.fill();
    ctx.fillStyle='#ff8888';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(d.dist.toFixed(0)+'m',px,py-8);
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);
    ctx.strokeStyle='rgba(255,80,80,0.2)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
  });
  [100,300,500].forEach(r=>{const pr=r/600*(Math.min(W,H)/2-25);
    ctx.beginPath();ctx.arc(cx,cy,pr,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='rgba(0,255,136,0.2)';ctx.font='7px Orbitron,monospace';ctx.fillText(r+'m',cx+pr+3,cy);});
  ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);
  ctx.fillStyle='rgba(255,80,80,0.9)';ctx.fill();
}

/* ── Channel Utilization Bars ── */
function drawChannelUtil(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CHANNEL UTILIZATION',5,12);
  const isDep=typeof deployed!=='undefined'&&deployed;
  for(let i=0;i<30;i++){
    _cellBarData[i]=isDep?Math.min(100,_cellBarData[i]+Math.random()*8-2):Math.max(0,_cellBarData[i]-1);
    _cellBarData[i]=Math.max(0,_cellBarData[i]);
    const x=10+i*(W-20)/30;const bh=_cellBarData[i]/100*(H-30);
    const col=_cellBarData[i]>70?'rgba(255,50,50,0.6)':_cellBarData[i]>40?'rgba(255,200,0,0.5)':'rgba(0,200,255,0.4)';
    ctx.fillStyle=col;ctx.fillRect(x,H-10-bh,(W-20)/30-2,bh);
  }
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('ARFCN',W/2,H-1);
}

/* ── Downgrade Attack Visualization ── */
function drawDowngradeAttack(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PROTOCOL DOWNGRADE ATTACK',5,12);
  const isDep=typeof deployed!=='undefined'&&deployed;
  const protocols=[{name:'5G NR',enc:'256-bit',safe:true},{name:'4G LTE',enc:'128-bit',safe:true},{name:'3G UMTS',enc:'128-bit',safe:true},{name:'2G GSM',enc:'A5/1 (weak)',safe:false},{name:'2G GSM',enc:'A5/0 (none)',safe:false}];
  const activeLevel=isDep?Math.min(4,Math.floor(_t*0.5)%5):0;
  protocols.forEach((p,i)=>{
    const y=28+i*28;const w=W-20;
    const isActive=isDep&&i===activeLevel;
    const isForced=isDep&&i>=activeLevel;
    ctx.fillStyle=isActive?'rgba(255,50,50,0.25)':isForced?'rgba(255,100,50,0.1)':'rgba(0,200,255,0.05)';
    ctx.fillRect(10,y,w,24);
    if(isActive){ctx.strokeStyle='rgba(255,50,50,0.6)';ctx.lineWidth=2;ctx.strokeRect(10,y,w,24);}
    ctx.fillStyle=isActive?'#ff6666':isForced?'#ff9966':p.safe?'#66ccff':'#ffcc00';
    ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText(p.name+' — '+p.enc,15,y+16);
    if(isActive){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.textAlign='right';ctx.fillText('FORCED',W-15,y+16);}
  });
  if(isDep){
    ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    const arrow='▼';for(let i=0;i<activeLevel;i++){ctx.fillText(arrow,W/2,30+i*28+24);}
  }
}

function enhancedRender(){
  _t+=0.016;
  const cc=_$('cellCanvas');
  if(cc){const ctx=cc.getContext('2d');drawRSSIHeatmap(ctx,cc.width,cc.height);}
  const sc=_$('specCanvas');
  if(sc){const ctx=sc.getContext('2d');const W=sc.width,H=sc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawRSSITimeSeries(ctx,W,H*0.5);
    ctx.save();ctx.translate(0,H*0.5);drawChannelUtil(ctx,W,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
})();
