/**
 * imp-screen-mirror-implant — Workshop DIY
 * Supply chain hardware backdoor simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="30" width="60" height="45" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><line x1="20" y1="45" x2="80" y2="45" stroke="currentColor" stroke-width="1.5"/><circle cx="70" cy="38" r="3" fill="currentColor"/><rect x="35" y="20" width="30" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 75 L50 90" stroke="currentColor" stroke-width="2"/></svg>';
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const now=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,now+0.08);o.start(now);o.stop(now+0.08)}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,now+0.3);o.start(now);o.stop(now+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,now+0.25);o.start(now);o.stop(now+0.25)}}
const LANG={en:{title:'imp-screen-mirror-implant',subtitle:'📦 intercept · modify · implant',disconnected:'Disconnected',connected:'Connected',ready:'📦 Supply Chain Backdoor sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 English',themeChanged:'🎨 Theme →',splashHint:'tap to skip'},fr:{title:'imp-screen-mirror-implant',subtitle:'📦 intercepter · modifier · implanter',disconnected:'Déconnecté',connected:'Connecté',ready:'📦 Simulation prête!',logCleared:'Journal effacé',copied:'Copié!',working:'En cours…',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer'},ar:{title:'imp-screen-mirror-implant',subtitle:'📦 اعتراض · تعديل · زرع',disconnected:'غير متصل',connected:'متصل',ready:'📦 جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 العربية',themeChanged:'🎨 →',splashHint:'انقر للتخطي'}};

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


let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}log(LANG[currentLang].themeChanged+' '+n,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click()}
let toastTimer=null;function showToast(m,ms){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter()})})}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}function closePanel(p,o){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open')}function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');playSound('click')}
let particles=[];function initSimCanvas(){const canvas=$('simCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;function draw(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';ctx.strokeStyle='rgba(255,255,255,0.05)';for(let x=0;x<canvas.width;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}for(let y=0;y<canvas.height;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(canvas.width/2-40,canvas.height/2-30,80,60);ctx.fillStyle=accent;ctx.font='11px Orbitron';ctx.textAlign='center';ctx.fillText(($('modeSelect')||{value:'MODE'}).value.toUpperCase(),canvas.width/2,canvas.height/2+5);ctx.textAlign='left';ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(30,canvas.height/2);ctx.lineTo(canvas.width/2-40,canvas.height/2);ctx.stroke();ctx.beginPath();ctx.moveTo(canvas.width/2+40,canvas.height/2);ctx.lineTo(canvas.width-30,canvas.height/2);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(30,canvas.height/2,8,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(canvas.width-30,canvas.height/2,8,0,Math.PI*2);ctx.stroke();for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=Math.sin(p.x/20)*0.5;p.life-=0.012;if(p.life<=0||p.x>canvas.width+10){particles.splice(i,1);continue}ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle=p.color||accent;ctx.fill();ctx.globalAlpha=1}const val=parseInt(($('paramSlider')||{}).value||'50');ctx.fillStyle='rgba(51,255,51,0.12)';ctx.fillRect(20,canvas.height-22,(canvas.width-40)*(val/100),10);ctx.fillStyle='#33ff33';ctx.font='9px Orbitron';ctx.fillText('INTENSITY: '+val+'%',20,canvas.height-6);requestAnimationFrame(draw)}draw()}
function spawnP(n,c){const cv=$('simCanvas');if(!cv)return;for(let i=0;i<n;i++)particles.push({x:30+Math.random()*40,y:cv.height/2-20+Math.random()*40,vx:1.5+Math.random()*3,life:0.5+Math.random()*0.5,color:c||null})}
let simActive=false;function initAppSim(){const startBtn=$('startBtn'),analyzeBtn=$('analyzeBtn'),defendBtn=$('defendBtn'),paramSlider=$('paramSlider'),paramValue=$('paramValue'),scanBtn=$('scanBtn'),out=$('outputDisplay'),dl=$('dataLog'),dot=$('implantDot'),txt=$('implantStatusText');if(paramSlider&&paramValue)paramSlider.addEventListener('input',()=>{paramValue.textContent=paramSlider.value+'%'});if(startBtn)startBtn.addEventListener('click',()=>{simActive=!simActive;startBtn.textContent=simActive?'Stop':'Start';if(dot)dot.classList.toggle('active',simActive);if(txt)txt.textContent=simActive?'System: ACTIVE':'System: Standby';setStatus(simActive);log(simActive?'📦 Simulation started':'📦 Stopped',simActive?'success':'info');showToast(simActive?'Starting...':'Stopped',1500);if(simActive){let ct=0;const iv=setInterval(()=>{if(!simActive){clearInterval(iv);return}ct++;spawnP(5,'#33ff33');if(dl)dl.textContent='['+new Date().toLocaleTimeString()+'] Cycle '+ct;log('📦 Cycle '+ct,'tx');if(ct>=10){clearInterval(iv);simActive=false;startBtn.textContent='Start';if(dot)dot.classList.remove('active');if(txt)txt.textContent='System: Complete';log('📦 Complete','success')}},800)}});if(analyzeBtn)analyzeBtn.addEventListener('click',()=>{showToast('Analyzing...',2000);log('🔬 Analyzing...','info');spawnP(15,'#4488ff');setTimeout(()=>{const d=Math.random()>0.4;if(out)out.textContent=d?'⚠️ ANOMALY DETECTED\nFirmware: Modified\nComponents: Extra IC found\nAction: Quarantine':'✅ CLEAN\nFirmware: Verified\nComponents: Match BOM';log(d?'🚨 Anomaly!':'✅ Clean',d?'error':'success');hideToast()},1800)});if(defendBtn)defendBtn.addEventListener('click',()=>{showToast('Countermeasures...',2000);log('🛡️ Activating...','info');spawnP(20,'#33ff33');setTimeout(()=>{if(out)out.textContent='🛡️ DEFENSES ACTIVE\nTPM: Verified\nFirmware: Hashed\nPackaging: Tamper-evident';log('🛡️ Active','success');hideToast()},1500)});if(scanBtn)scanBtn.addEventListener('click',()=>{spawnP(25);log('📡 Scanning...','info');showToast('Scanning...',2000);setTimeout(()=>{log('📡 Done','success')},2000)})}
function init(){initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;$('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);initLogFilters();$('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();$('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);$('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);const snd=$('soundToggle');if(snd){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}snd.checked=soundEnabled;snd.addEventListener('change',()=>{soundEnabled=snd.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}initHijriDate();initSimCanvas();initAppSim();log(LANG[currentLang].ready,'success')}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
