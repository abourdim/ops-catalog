/**
 * Workshop DIY — Satellite Injection Lab v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={en:{title:'Satellite Injection Lab',subtitle:'Satellite Injection Lab',disconnected:'Idle',connected:'Injecting',ready:'Satellite Injection Lab ready!',langChanged:'English',themeChanged:'Theme:',logCleared:'Log cleared',copied:'Copied!',copyFail:'Fail',working:'Working...'},fr:{title:'Labo Injection Satellite',subtitle:'Labo Injection Satellite',disconnected:'Inactif',connected:'Injection',ready:'Labo pret!',langChanged:'Francais',themeChanged:'Theme:',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',working:'En cours...'},ar:{title:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0642\u0646 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',subtitle:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0642\u0646 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062d\u0642\u0646',ready:'\u062c\u0627\u0647\u0632!',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0645\u0638\u0647\u0631:',logCleared:'\u062a\u0645',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...'}};

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

/* ═══════ SATELLITE SIM ═══════ */
let injecting=false,time=0,transponders=[];
function initTransponders(){transponders=[];for(let i=0;i<24;i++)transponders.push({id:'TP-'+(i+1),freq:10.7+i*0.05,bw:36,power:-80+Math.random()*20,injected:false,usage:Math.random()*100});}

function drawSatView(){
  const c=$('satCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Earth
  ctx.beginPath();ctx.arc(W/2,H+200,280,0,Math.PI*2);ctx.fillStyle='rgba(0,80,160,0.15)';ctx.fill();ctx.strokeStyle='rgba(0,150,255,0.2)';ctx.stroke();
  // Satellite
  const sx=W/2,sy=80;
  ctx.fillStyle='rgba(200,200,220,0.9)';ctx.fillRect(sx-15,sy-5,30,10);
  ctx.fillStyle='rgba(50,100,200,0.7)';ctx.fillRect(sx-40,sy-3,25,6);ctx.fillRect(sx+15,sy-3,25,6);
  ctx.beginPath();ctx.arc(sx,sy,4,0,Math.PI*2);ctx.fillStyle=injecting?'#ff4444':'#00cc88';ctx.fill();
  // Uplink beam from ground
  const gx=W/2-200,gy=H-40;
  ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(sx-30,sy+15);ctx.lineTo(sx+30,sy+15);ctx.closePath();
  ctx.fillStyle='rgba(0,200,255,0.05)';ctx.fill();ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1;ctx.stroke();
  // Injector beam
  if(injecting){
    const ix=W/2+200,iy=H-40;
    ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(sx-20,sy+15);ctx.lineTo(sx+20,sy+15);ctx.closePath();
    ctx.fillStyle='rgba(255,50,50,0.08)';ctx.fill();ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=2;ctx.stroke();
    // Pulse
    const pr=20+Math.sin(time*4)*8;
    ctx.beginPath();ctx.arc(sx,sy,pr,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.3)';ctx.stroke();
    ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('INJECTION',ix,iy-10);
  }
  // Downlink beams
  const tpIdx=parseInt($('transponder')?.value||8)-1;
  for(let i=0;i<3;i++){
    const dx=200+i*200,dy=H-30;
    ctx.beginPath();ctx.moveTo(sx,sy+8);ctx.lineTo(dx-20,dy);ctx.lineTo(dx+20,dy);ctx.closePath();
    const isInj=injecting&&i===1;
    ctx.fillStyle=isInj?'rgba(255,50,50,0.04)':'rgba(0,255,136,0.03)';ctx.fill();
    ctx.beginPath();ctx.arc(dx,dy,5,0,Math.PI*2);ctx.fillStyle=isInj?'#ff4444':'#00cc88';ctx.fill();
    ctx.fillStyle=isInj?'#ff6666':'#66ffaa';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(isInj?'HIJACKED':'RX-'+i,dx,dy+14);
  }
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SATELLITE LINK — '+($('satTarget')?.value||'GEO-SAT').toUpperCase(),8,16);
  if(injecting){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('TRANSPONDER INJECTION ACTIVE — TP-'+($('transponder')?.value||8),8,32);}
}

function drawSpecView(){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const tpIdx=parseInt($('transponder')?.value||8)-1;
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const tp=Math.floor(x/W*24);let y=H*0.7+Math.random()*3;
    if(transponders[tp])y=H*(1-transponders[tp].usage/200);
    if(injecting&&tp===tpIdx)y=H*0.1+Math.random()*H*0.15;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=injecting?'rgba(255,80,80,0.6)':'rgba(0,200,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
  // Transponder markers
  for(let i=0;i<24;i++){const x=i/24*W+W/48;ctx.fillStyle=(injecting&&i===tpIdx)?'rgba(255,50,50,0.5)':'rgba(0,200,255,0.2)';ctx.fillRect(x-1,H-8,2,8);}
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('TRANSPONDER SPECTRUM — 24 TP',5,14);
}

function animate(){time+=0.016;drawSatView();drawSpecView();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){const s=$('infoStats');if(!s)return;const eirp=$('eirp')?.value||50;const freq=$('uplinkFreq')?.value||14;const fsl=(20*Math.log10(35786)+20*Math.log10(freq*1e9)+20*Math.log10(4*Math.PI/3e8)).toFixed(1);s.innerHTML='<b>Uplink:</b> '+freq+' GHz<br><b>EIRP:</b> '+eirp+' dBW<br><b>FSL:</b> '+fsl+' dB<br><b>TP:</b> '+($('transponder')?.value||8)+'/24<br><b>Status:</b> '+(injecting?'<span style="color:#ff4444">INJECTING</span>':'<span style="color:#00cc88">STANDBY</span>');}

function updateLibrary(){const lib=$('libraryList');if(!lib)return;lib.innerHTML='';const tpIdx=parseInt($('transponder')?.value||8)-1;transponders.forEach((tp,i)=>{tp.injected=injecting&&i===tpIdx;const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;padding:2px 6px;border-radius:4px;font-size:.75rem;background:'+(tp.injected?'rgba(255,50,50,0.08)':'rgba(0,200,255,0.03)');r.innerHTML='<span style="color:'+(tp.injected?'#ff6666':'#66ccff')+'">'+tp.id+'</span><span>'+tp.freq.toFixed(2)+' GHz</span><span>'+tp.bw+' MHz BW</span><span style="color:'+(tp.injected?'#ff4444':'#00cc88')+'">'+(tp.injected?'INJECTED':'NORMAL')+'</span>';lib.appendChild(r);});}

function initControls(){
  $('uplinkFreq').oninput=()=>{$('uplinkLabel').textContent=$('uplinkFreq').value+' GHz';};
  $('eirp').oninput=()=>{$('eirpLabel').textContent=$('eirp').value+' dBW';};
  $('transponder').oninput=()=>{$('transpLabel').textContent='TP-'+$('transponder').value;};
  $('startBtn').onclick=()=>{injecting=!injecting;setStatus(injecting);$('startBtn').querySelector('span:last-child').textContent=injecting?'Stop Injection':'Inject Signal';log(injecting?'INJECTION ACTIVE on TP-'+$('transponder').value+' @ '+$('uplinkFreq').value+' GHz':'Injection stopped',injecting?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Scanning transponders...',1500);setTimeout(()=>{log('Scan: 24 transponders detected, '+(injecting?'1 compromised':'all clean'),'success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{injecting=false;setStatus(false);initTransponders();log('Reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Uplink Injection:</b> Overpower legitimate uplink with stronger signal.','<b>Transponder Hijacking:</b> Capture satellite transponder for unauthorized broadcast.','<b>Cross-pol Isolation:</b> Exploit polarization leakage for covert injection.','<b>Carrier-in-Carrier:</b> Hide injected signal within legitimate carrier.','<b>Orbital Slot Spoofing:</b> Mimic satellite from adjacent orbital position.','<b>TT&C Exploitation:</b> Target telemetry and command channels.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initTransponders();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();setInterval(updateLibrary,1000);});

/* ═══════ ENHANCED RF CANVAS — SATELLITE INJECTION ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _linkBudget=[];let _beamPattern=[];let _orbitalPath=[];
let _snrHistory=new Array(200).fill(10);

/* ── Link Budget Waterfall Chart ── */
function drawLinkBudget(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SATELLITE LINK BUDGET (dB)',5,12);
  const eirp=parseInt(_$('eirp')?.value||50);
  const freq=parseFloat(_$('uplinkFreq')?.value||14);
  const fsl=20*Math.log10(35786)+20*Math.log10(freq*1e9)+20*Math.log10(4*Math.PI/3e8);
  const items=[{name:'EIRP',val:eirp,color:'#66ff88'},{name:'Free Space Loss',val:-fsl/5,color:'#ff6666'},{name:'Atmospheric',val:-2.5,color:'#ff9966'},{name:'Rain Fade',val:-1.5,color:'#ffcc00'},{name:'Antenna Gain',val:35,color:'#66ccff'},{name:'Pointing Loss',val:-0.8,color:'#ff8888'},{name:'Margin',val:3,color:'#00cc88'}];
  let cumulative=0;const barW=Math.max(30,(W-40)/items.length-6);
  items.forEach((item,i)=>{
    const x=20+i*(barW+6);const prev=cumulative;cumulative+=item.val;
    const startY=H-20-(prev+100)/200*(H-35);
    const endY=H-20-(cumulative+100)/200*(H-35);
    ctx.fillStyle=item.color.replace(')',',0.4)').replace('#','rgba(');
    const topY=Math.min(startY,endY);const bh=Math.abs(endY-startY);
    ctx.fillStyle=item.val>0?'rgba(0,200,100,0.4)':'rgba(255,80,80,0.4)';
    ctx.fillRect(x,topY,barW,bh||2);
    ctx.strokeStyle=item.val>0?'rgba(0,200,100,0.7)':'rgba(255,80,80,0.7)';
    ctx.lineWidth=1;ctx.strokeRect(x,topY,barW,bh||2);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    ctx.save();ctx.translate(x+barW/2,H-5);ctx.rotate(-0.3);ctx.fillText(item.name,0,0);ctx.restore();
    ctx.fillText((item.val>0?'+':'')+item.val.toFixed(1),x+barW/2,topY-3);
  });
}

/* ── Orbital Track View ── */
function drawOrbitalTrack(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ORBITAL POSITION — GEO BELT',5,12);
  const cx=W/2,cy=H*0.65;const rx=W*0.4,ry=H*0.25;
  // Orbit ellipse
  ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
  ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1;ctx.stroke();
  // Earth
  ctx.beginPath();ctx.arc(cx,cy,15,0,Math.PI*2);
  ctx.fillStyle='rgba(0,100,200,0.4)';ctx.fill();
  ctx.strokeStyle='rgba(0,150,255,0.3)';ctx.stroke();
  // Target satellite
  const satAngle=_t*0.02;
  const sx=cx+Math.cos(satAngle)*rx,sy=cy+Math.sin(satAngle)*ry;
  ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);
  const isInj=typeof injecting!=='undefined'&&injecting;
  ctx.fillStyle=isInj?'rgba(255,50,50,0.9)':'rgba(0,255,136,0.8)';ctx.fill();
  ctx.fillStyle=isInj?'#ff6666':'#66ffaa';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText(_$('satTarget')?.value||'GEO-SAT',sx,sy-10);
  // Adjacent satellites
  for(let i=1;i<=3;i++){
    const a=satAngle+i*0.4;const ax=cx+Math.cos(a)*rx,ay=cy+Math.sin(a)*ry;
    ctx.beginPath();ctx.arc(ax,ay,3,0,Math.PI*2);ctx.fillStyle='rgba(100,100,100,0.5)';ctx.fill();
    const a2=satAngle-i*0.4;const bx=cx+Math.cos(a2)*rx,by=cy+Math.sin(a2)*ry;
    ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fillStyle='rgba(100,100,100,0.5)';ctx.fill();
  }
  // Injection beam
  if(isInj){
    const gx=cx+100,gy=H-15;
    ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(sx,sy);
    ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
    const pulse=8+Math.sin(_t*5)*4;
    ctx.beginPath();ctx.arc(sx,sy,pulse,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=1;ctx.stroke();
  }
  // Ground station
  ctx.beginPath();ctx.arc(cx-100,H-15,4,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.7)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.fillText('LEGIT GS',cx-100,H-3);
  if(isInj){ctx.beginPath();ctx.arc(cx+100,H-15,4,0,Math.PI*2);ctx.fillStyle='rgba(255,50,50,0.7)';ctx.fill();
    ctx.fillStyle='rgba(255,50,50,0.5)';ctx.fillText('ATTACKER',cx+100,H-3);}
}

/* ── SNR Monitor ── */
function drawSNRMonitor(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('TRANSPONDER SNR (dB)',5,12);
  const isInj=typeof injecting!=='undefined'&&injecting;
  const eirp=parseInt(_$('eirp')?.value||50);
  const newVal=isInj?5+eirp*0.3+Math.random()*8:12+Math.random()*3;
  _snrHistory.push(newVal);if(_snrHistory.length>200)_snrHistory.shift();
  ctx.beginPath();
  _snrHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/50)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isInj?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  // Threshold
  const thY=H-10-(8/50)*(H-25);
  ctx.beginPath();ctx.moveTo(0,thY);ctx.lineTo(W,thY);ctx.strokeStyle='rgba(255,200,0,0.4)';
  ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.4)';ctx.font='7px Orbitron,monospace';ctx.fillText('MIN LOCK',W-55,thY-3);
}

/* ── Beam Pattern Visualization ── */
function drawBeamPattern(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ANTENNA BEAM PATTERN',5,12);
  const cx=W/2,cy=H-10;const R=H-25;
  // Main lobe
  ctx.beginPath();
  for(let a=-Math.PI/2-0.8;a<=-Math.PI/2+0.8;a+=0.02){
    const diff=a+Math.PI/2;const gain=Math.exp(-diff*diff*8)*R;
    const x=cx+Math.cos(a)*gain;const y=cy+Math.sin(a)*gain;
    if(a===-Math.PI/2-0.8)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=2;ctx.stroke();
  // Side lobes
  for(let sl=-3;sl<=3;sl++){
    if(sl===0)continue;
    ctx.beginPath();
    const slCenter=-Math.PI/2+sl*0.5;
    for(let a=slCenter-0.15;a<=slCenter+0.15;a+=0.01){
      const diff=a-slCenter;const gain=Math.exp(-diff*diff*80)*R*0.15;
      const x=cx+Math.cos(a)*gain;const y=cy+Math.sin(a)*gain;
      if(a===slCenter-0.15)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(0,200,255,0.3)';ctx.lineWidth=1;ctx.stroke();
  }
  // Injector beam overlay
  if(typeof injecting!=='undefined'&&injecting){
    ctx.beginPath();
    for(let a=-Math.PI/2-0.6;a<=-Math.PI/2+0.6;a+=0.02){
      const diff=a+Math.PI/2-0.2;const gain=Math.exp(-diff*diff*10)*R*0.8;
      const x=cx+Math.cos(a)*gain;const y=cy+Math.sin(a)*gain;
      if(a===-Math.PI/2-0.6)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(255,50,50,0.6)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='rgba(255,50,50,0.5)';ctx.font='8px Orbitron,monospace';ctx.fillText('INJECTED BEAM',W-110,25);
  }
}

/* ── Transponder Loading Bar Chart ── */
function drawTPLoading(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('TRANSPONDER LOADING (%)',5,12);
  const isInj=typeof injecting!=='undefined'&&injecting;
  const tpIdx=parseInt(_$('transponder')?.value||8)-1;
  const barW=Math.max(6,(W-20)/24-2);
  for(let i=0;i<24;i++){
    const x=10+i*(barW+2);
    let load=(typeof transponders!=='undefined'&&transponders[i])?transponders[i].usage:50;
    if(isInj&&i===tpIdx)load=90+Math.random()*10;
    const bh=load/100*(H-30);
    const col=i===tpIdx&&isInj?'rgba(255,50,50,0.6)':load>80?'rgba(255,200,0,0.5)':'rgba(0,200,255,0.4)';
    ctx.fillStyle=col;ctx.fillRect(x,H-10-bh,barW,bh);
    if(i%4===0){ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('TP'+(i+1),x+barW/2,H-1);}
  }
}

function enhancedRender(){
  _t+=0.016;
  const satC=_$('satCanvas');
  if(satC){const ctx=satC.getContext('2d');drawOrbitalTrack(ctx,satC.width,satC.height);}
  const specC=_$('specCanvas');
  if(specC){const ctx=specC.getContext('2d');const W=specC.width,H=specC.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawSNRMonitor(ctx,W,H*0.5);ctx.save();ctx.translate(0,H*0.5);drawTPLoading(ctx,W,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
})();
