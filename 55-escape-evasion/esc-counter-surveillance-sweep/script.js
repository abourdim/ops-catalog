/* Counter-Surveillance Sweep — Bug detection and sweep simulation — Workshop DIY v1.2 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={en:{title:'Counter-Surveillance Sweep',subtitle:'Bug detection and sweep simulation',disconnected:'Idle',connected:'Sweeping',ready:'Counter-Surveillance Sweep ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Simulation started',simStopped:'Simulation stopped',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Counter-Surveillance Sweep',subtitle:'Simulation',disconnected:'Inactif',connected:'Actif',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Demarree',simStopped:'Arretee',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'مجموعة إخفاء المعلومات',subtitle:'محاكاة',disconnected:'خامل',connected:'نشط',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأت',simStopped:'توقفت',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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

let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}const TM={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=TM[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(($('logContainer')||{children:[]}).children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}function exportLog(){const lc=$('logContainer');if(!lc)return;const b=new Blob([Array.from(lc.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`sweep-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||'Working...';el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}function closeAllPanels(){closeHelp();closeSettings();closeLog()}function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+(sx-e.clientX),window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}
/* ═══════ APP LOGIC — Counter-Surveillance Sweep ═══════ */
let simRunning=false,simInterval=null,opCount=0,s1=0,s2=0,s3=0,currentMethod='rf';function rI(a,b){return a+Math.floor(Math.random()*(b-a))}function rH(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}
const OPS=["RF signal found", "WiFi AP suspicious", "BLE beacon", "Sweep clear", "Anomaly found", "GSM: negative", "IR scan OK", "Ultrasonic", "TSCM complete", "Spectrum clean", "Junction alert", "Power measured"];
function genOp(){return{type:currentMethod.toUpperCase().slice(0,4),data:OPS[rI(0,OPS.length)]+` [${rI(10,9999)}]`,status:'OK'}}let canvas,ctx,particles=[];function initCanvas(){canvas=$('appCanvas');if(!canvas)return;ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;ctx.scale(2,2)}
function drawCanvas(){if(!ctx)return;const w=canvas.offsetWidth,h=canvas.offsetHeight;ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);const colors={rf:'#ef4444',wifi:'#3b82f6',bt:'#22c55e'};const col=colors[currentMethod]||'#3b82f6';particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.life-=0.012;if(p.life<=0){particles.splice(i,1);return}ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);ctx.fillStyle=col;ctx.globalAlpha=p.life*0.6;ctx.fill();ctx.globalAlpha=1;if(i>0&&i<particles.length){const prev=particles[i-1];ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle=col;ctx.globalAlpha=p.life*0.15;ctx.lineWidth=0.5;ctx.stroke();ctx.globalAlpha=1}});const pct=Math.min(opCount/80,1);ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(10,h-12,w-20,6);ctx.fillStyle=col+'80';ctx.fillRect(10,h-12,(w-20)*pct,6);ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.textAlign='center';ctx.fillText(s2+' operations completed',w/2,h-2)}
function addParticles(){const w=canvas?canvas.offsetWidth:300,h=canvas?canvas.offsetHeight:200;for(let i=0;i<3;i++)particles.push({x:Math.random()*w*0.3,y:h/2+rI(-20,20),vx:1+Math.random()*2,vy:(Math.random()-0.5)*0.8,r:2+Math.random()*4,life:1});if(particles.length>200)particles.splice(0,50)}
function updateUI(){$('stat1').textContent=s1;$('stat2').textContent=s2;$('stat3').textContent=Math.round(s3/8);$('stat4').textContent=Math.min(Math.round(opCount/80*100),100)+'%'}
function addOpToList(op){const list=$('opList');if(!list)return;const d=document.createElement('div');d.className='op-item';d.innerHTML=`<span class="op-type">${op.type}</span><span class="op-data">${op.data}</span><span class="op-status">${op.status}</span>`;list.insertBefore(d,list.firstChild);if(list.children.length>100)list.removeChild(list.lastChild)}
function simTick(){const op=genOp();opCount++;s1++;s2+=rI(8,64);s3+=rI(8,64);addOpToList(op);addParticles();updateUI();log(`${op.type}: ${op.data}`,'tx')}
function startSim(){if(simRunning)return;simRunning=true;setStatus(true);$('startBtn').disabled=true;$('stopBtn').disabled=false;opCount=0;s1=0;s2=0;s3=0;particles=[];initCanvas();log(LANG[currentLang].simStarted,'success');simInterval=setInterval(simTick,500);requestAnimationFrame(function loop(){if(!simRunning)return;drawCanvas();requestAnimationFrame(loop)})}
function stopSim(){simRunning=false;if(simInterval)clearInterval(simInterval);setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;log(LANG[currentLang].simStopped,'info')}
function init(){initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});$('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));$('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;document.querySelectorAll('.method-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');currentMethod=tab.dataset.method;playSound('click')})});log(LANG[currentLang].ready,'success')}document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
/* ═══════ RICH CANVAS — RF Spectrum Analyzer ═══════ */
(function(){const CVS_ID='richVisCanvas';function ensureCanvas(){if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);const wrap=document.querySelector('.card');if(!wrap)return null;const card=document.createElement('div');card.className='card';card.innerHTML='<div class="card-header"><div class="card-title"><span class="icon">📡️</span> RF Spectrum Analyzer</div></div>';const c=document.createElement('canvas');c.id=CVS_ID;c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c}let nodes=[],_raf=null,frame=0;function draw(){const c=document.getElementById(CVS_ID);if(!c){_raf=null;return}const x=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;x.scale(2,2);const w=W/2,h=H/2;x.fillStyle='rgba(10,10,26,0.1)';x.fillRect(0,0,w,h);frame++;const isR=typeof simRunning!=='undefined'&&simRunning;const colors={rf:'#ef4444',wifi:'#3b82f6',bt:'#22c55e'};const col=colors[typeof currentMethod!=='undefined'?currentMethod:'rf']||'#3b82f6';if(isR&&frame%5===0)nodes.push({x:Math.random()*w,y:Math.random()*h,r:2+Math.random()*4,alpha:1,pulse:0});nodes.forEach((n,i)=>{n.alpha-=0.004;n.pulse+=0.05;if(n.alpha<=0){nodes.splice(i,1);return}x.beginPath();x.arc(n.x,n.y,n.r+Math.sin(n.pulse)*2,0,Math.PI*2);x.fillStyle=col;x.globalAlpha=n.alpha*0.5;x.fill();x.globalAlpha=1});for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<60){x.beginPath();x.moveTo(nodes[i].x,nodes[i].y);x.lineTo(nodes[j].x,nodes[j].y);x.strokeStyle=col;x.globalAlpha=0.08*(1-dist/60);x.lineWidth=0.5;x.stroke();x.globalAlpha=1}}if(nodes.length>100)nodes.splice(0,30);x.font='8px monospace';x.fillStyle='rgba(255,255,255,0.25)';x.textAlign='center';x.fillText('RF Spectrum Analyzer',w/2,h-8);_raf=requestAnimationFrame(draw)}function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
