/**
 * Sagnac Interferometer — Workshop DIY v1.0
 * Rotation sensing with counter-propagating beams
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"/><circle cx="50" cy="15" r="4" fill="currentColor"><animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="3s" repeatCount="indefinite"/></circle><circle cx="50" cy="15" r="4" fill="currentColor" opacity=".5"><animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="3s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Sagnac Interferometer',subtitle:'🔄 Sagnac Interferometer — Rotation detection',disconnected:'Offline',connected:'Sensing',ready:'🔄 Sagnac Interferometer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🔄 Sensing rotation',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Interféromètre Sagnac',subtitle:'🔄 Interféromètre Sagnac — Détection de rotation',disconnected:'Hors ligne',connected:'Détecte',ready:'🔄 Interféromètre prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🔄 Détection de rotation',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'مقياس تداخل ساناك',subtitle:'🔄 مقياس تداخل ساناك — كشف الدوران',disconnected:'غير متصل',connected:'يستشعر',ready:'🔄 مقياس ساناك جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🔄 استشعار الدوران',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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


let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='sagnac-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const rot=+$('rotSlider').value,area=+$('areaSlider').value,wl=+$('wlSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const cx=w*0.35,cy=h/2,loopR=100;
  // Fiber loop (rotating)
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot*Math.PI/180*time*0.1);
  ctx.strokeStyle='rgba(100,200,255,0.3)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,loopR,0,Math.PI*2);ctx.stroke();
  // CW beam (clockwise)
  const cwAngle=time*5;ctx.fillStyle='rgba(255,100,100,0.8)';
  for(let i=0;i<8;i++){const a=cwAngle+i*Math.PI/4;const bx=Math.cos(a)*loopR,by=Math.sin(a)*loopR;ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill();}
  // CCW beam (counter-clockwise)
  const ccwAngle=-time*5+rot*Math.PI/180*0.001;ctx.fillStyle='rgba(100,100,255,0.8)';
  for(let i=0;i<8;i++){const a=ccwAngle-i*Math.PI/4;const bx=Math.cos(a)*loopR,by=Math.sin(a)*loopR;ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill();}
  // Beam splitter
  ctx.fillStyle=accent;ctx.fillRect(loopR-5,-3,10,6);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron';ctx.fillText('BS',loopR-6,-8);
  // Mirrors
  [Math.PI/2,Math.PI,Math.PI*1.5].forEach(a=>{const mx=Math.cos(a)*loopR,my=Math.sin(a)*loopR;ctx.fillStyle='rgba(200,200,200,0.5)';ctx.save();ctx.translate(mx,my);ctx.rotate(a);ctx.fillRect(-5,-3,10,6);ctx.restore();});
  ctx.restore();
  // Rotation arrow
  if(rot>0){ctx.strokeStyle='rgba(255,200,100,0.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,loopR+20,0,Math.PI*1.5);ctx.stroke();ctx.fillStyle='rgba(255,200,100,0.4)';ctx.font='10px Orbitron';ctx.fillText('Ω = '+rot+' °/s',cx+loopR+25,cy-10);}
  // Interference pattern (right side)
  const Omega=rot*Math.PI/180;const lambda=wl*1e-9;const c_light=3e8;
  const phaseShift=8*Math.PI*area*Omega/(lambda*c_light);
  const fringeShift=phaseShift/(2*Math.PI);
  const patX=w*0.6,patY=h*0.1,patW=w*0.35,patH=h*0.35;
  ctx.strokeStyle='rgba(100,200,255,0.15)';ctx.strokeRect(patX,patY,patW,patH);
  // Fringe pattern
  for(let x=0;x<patW;x++){
    const intensity=0.5+0.5*Math.cos(x*0.15+phaseShift*50+time*rot*0.01);
    const hue=wl<500?240:wl<600?120:wl<700?60:0;
    ctx.fillStyle=`hsla(${hue},80%,${intensity*60}%,${0.5+intensity*0.5})`;
    ctx.fillRect(patX+x,patY,1,patH);
  }
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='9px Orbitron';ctx.fillText('INTERFERENCE PATTERN',patX+5,patY-5);
  // Phase plot
  const plotY=h*0.55,plotH=h*0.35;
  ctx.strokeStyle='rgba(100,200,255,0.1)';ctx.strokeRect(patX,plotY,patW,plotH);
  ctx.strokeStyle='rgba(100,200,255,0.1)';ctx.beginPath();ctx.moveTo(patX,plotY+plotH/2);ctx.lineTo(patX+patW,plotY+plotH/2);ctx.stroke();
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=0;x<patW;x++){
    const t2=(x/patW)*20;
    const y=plotY+plotH/2-Math.sin(t2+phaseShift*10)*plotH*0.3;
    x===0?ctx.moveTo(patX+x,y):ctx.lineTo(patX+x,y);
  }ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='9px Orbitron';ctx.fillText('BEAT SIGNAL',patX+5,plotY-5);

  const beatFreq=(4*area*Omega/(lambda*2*Math.PI*(loopR*2*Math.PI)/(c_light))).toFixed(2);
  $('phaseVal').textContent=phaseShift.toExponential(3)+' rad';$('fringeVal').textContent=fringeShift.toExponential(3);
  $('beatVal').textContent=beatFreq+' Hz';$('sensVal').textContent=(phaseShift/(rot+0.001)).toExponential(3)+' rad/(°/s)';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('SAGNAC — Ω='+rot+'°/s Δφ='+phaseShift.toExponential(2)+' rad',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('rotSlider').value=15;$('rotVal').textContent='15 °/s';$('areaSlider').value=10;$('areaVal').textContent='10 m²';$('wlSlider').value=633;$('wlVal').textContent='633 nm';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('phaseVal').textContent='-- rad';$('fringeVal').textContent='-- fringes';$('beatVal').textContent='-- Hz';$('sensVal').textContent='-- rad/(°/s)';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('rotSlider').oninput=function(){$('rotVal').textContent=this.value+' °/s';};$('areaSlider').oninput=function(){$('areaVal').textContent=this.value+' m²';};$('wlSlider').oninput=function(){$('wlVal').textContent=this.value+' nm';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Sagnac Interferometer
   Animated counter-propagating beams in rotating loop with
   fringe pattern, phase shift, and rotation sensing
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simSagnac';let cv,cx,W,H,af=null,t=0;
  let rotRate=15,loopArea=10,wavelength=633,phaseShift=0;
  const cwPhotons=[];const ccwPhotons=[];const fringeHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawInterferometerLoop(){
    const lcx=W*0.35,lcy=H/2,lr=100;
    // Rotating ring
    cx.save();cx.translate(lcx,lcy);cx.rotate(t*rotRate*Math.PI/180*0.01);
    cx.strokeStyle='rgba(100,200,255,0.2)';cx.lineWidth=2;
    cx.beginPath();cx.arc(0,0,lr,0,Math.PI*2);cx.stroke();
    // Mirrors at cardinal points
    const mirrors=[0,Math.PI/2,Math.PI,Math.PI*3/2];
    mirrors.forEach(a=>{
      const mx=Math.cos(a)*lr,my=Math.sin(a)*lr;
      cx.save();cx.translate(mx,my);cx.rotate(a+Math.PI/4);
      cx.fillStyle='rgba(200,200,220,0.5)';cx.fillRect(-5,-8,10,3);
      cx.restore();
    });
    cx.restore();
    // Beam splitter
    cx.save();cx.translate(lcx+lr,lcy);cx.rotate(Math.PI/4);
    cx.fillStyle='rgba(100,200,255,0.3)';cx.fillRect(-4,-8,8,16);
    cx.restore();
    // CW beam (clockwise)
    cx.strokeStyle='rgba(255,100,100,0.4)';cx.lineWidth=1.5;
    const cwPhase=t*3;
    cx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.05){
      const r=lr+Math.sin(a*20+cwPhase)*3;
      const x=lcx+Math.cos(a)*r;const y=lcy+Math.sin(a)*r;
      if(a===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.stroke();
    // CCW beam (counter-clockwise)
    cx.strokeStyle='rgba(100,255,100,0.4)';cx.lineWidth=1.5;
    const ccwPhase=-t*3+phaseShift;
    cx.beginPath();
    for(let a=Math.PI*2;a>0;a-=0.05){
      const r=lr-3+Math.sin(a*20+ccwPhase)*3;
      const x=lcx+Math.cos(a)*r;const y=lcy+Math.sin(a)*r;
      if(a===Math.PI*2)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.stroke();
    // Rotation indicator
    cx.strokeStyle='rgba(255,200,0,0.3)';cx.lineWidth=1;
    const arrowA=t*0.5;
    cx.beginPath();cx.arc(lcx,lcy,lr+20,arrowA,arrowA+0.3);cx.stroke();
    cx.fillStyle='rgba(255,200,0,0.3)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('Rotation: '+rotRate+' deg/s',lcx,lcy-lr-12);
    cx.fillText('CW',lcx+lr+15,lcy-lr/2);cx.fillText('CCW',lcx-lr-15,lcy+lr/2);
  }

  function drawFringePattern(){
    const fx=W*0.65,fy=20,fw=W*0.32,fh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(fx,fy,fw,fh);
    // Interference fringes
    for(let x=0;x<fw;x++){
      const phase=x/fw*Math.PI*10+phaseShift*5;
      const intensity=(Math.cos(phase)+1)/2;
      const r=Math.floor(intensity*200);
      const g=Math.floor(intensity*255);
      const b=Math.floor(intensity*100);
      cx.fillStyle='rgb('+r+','+g+','+b+')';
      cx.fillRect(fx+x,fy+20,1,fh-30);
    }
    cx.fillStyle='rgba(100,255,100,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('INTERFERENCE FRINGES',fx+8,fy+12);
    cx.fillText('Phase shift: '+phaseShift.toFixed(4)+' rad',fx+8,fy+fh+10);
  }

  function drawPhaseGraph(){
    const gx=W*0.65,gy=150,gw=W*0.32,gh=70;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(gx,gy,gw,gh);
    fringeHistory.push(phaseShift);
    if(fringeHistory.length>150)fringeHistory.shift();
    if(fringeHistory.length>1){
      cx.strokeStyle='rgba(100,255,100,0.5)';cx.lineWidth=1.5;cx.beginPath();
      const maxP=Math.max(...fringeHistory.map(Math.abs),0.01);
      const step=gw/Math.max(1,fringeHistory.length-1);
      fringeHistory.forEach((v,i)=>{
        const x=gx+i*step;const y=gy+gh/2-v/maxP*gh*0.4;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    cx.fillStyle='rgba(100,255,100,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('SAGNAC PHASE vs TIME',gx+8,gy-4);
  }

  function drawMetrics(){
    const mx=W*0.65,my=230,mw=W*0.32,mh=55;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(mx,my,mw,mh);
    const beatFreq=(4*loopArea*rotRate*Math.PI/180)/(wavelength*1e-9*2*Math.PI*Math.sqrt(loopArea));
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('SAGNAC METRICS',mx+8,my+14);
    cx.fillStyle='#aaa';
    cx.fillText('lambda = '+wavelength+' nm  A = '+loopArea+' m^2',mx+8,my+28);
    cx.fillText('Beat freq: '+beatFreq.toFixed(2)+' Hz',mx+8,my+42);
    cx.fillText('Fringes: '+(phaseShift/(2*Math.PI)).toFixed(3),mx+8,my+54);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,210,42);
    cx.strokeStyle='rgba(100,255,100,0.15)';cx.strokeRect(8,8,210,42);
    cx.font='10px monospace';cx.fillStyle='#22c55e';cx.textAlign='left';
    cx.fillText('SAGNAC INTERFEROMETER',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Counter-Propagating Beam Rotation Sensor',16,40);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.12)';cx.fillRect(0,0,W,H);

    // Vary rotation
    rotRate=15+Math.sin(t*0.3)*10;
    phaseShift=8*Math.PI*loopArea*rotRate*Math.PI/180/(wavelength*1e-9*3e8);

    drawInterferometerLoop();drawFringePattern();
    drawPhaseGraph();drawMetrics();drawHUD();

    cx.fillStyle='rgba(100,255,100,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Sagnac Interferometer — Rotation Sensing with Counter-Propagating Beams',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
