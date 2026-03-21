/**
 * Faraday Rotation Lab — Workshop DIY v1.0
 * Polarization rotation through magnetized plasma
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><animateTransform attributeName="transform" type="rotate" values="0 50 50;180 50 50;360 50 50" dur="3s" repeatCount="indefinite"/></ellipse></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Faraday Rotation Lab',subtitle:'🧲 Faraday Rotation Lab — Polarization in B-fields',disconnected:'Offline',connected:'Rotating',ready:'🧲 Faraday Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🧲 Rotation active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Labo Rotation Faraday',subtitle:'🧲 Rotation Faraday — Polarisation en champ B',disconnected:'Hors ligne',connected:'Rotation',ready:'🧲 Labo Faraday prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🧲 Rotation active',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'مختبر دوران فاراداي',subtitle:'🧲 مختبر دوران فاراداي — الاستقطاب في المجالات المغناطيسية',disconnected:'غير متصل',connected:'يدور',ready:'🧲 مختبر فاراداي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🧲 الدوران نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='faraday-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const B=+$('bSlider').value/100,wl=+$('wlSlider').value,path=+$('pathSlider').value/10;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const rotation=B*path*2.63e4/(wl*wl)*0.01;// simplified Faraday rotation
  // Magnetized plasma region
  ctx.fillStyle='rgba(50,50,150,0.05)';ctx.fillRect(w*0.2,0,w*0.6,h);
  ctx.strokeStyle='rgba(100,150,255,0.2)';ctx.setLineDash([3,6]);ctx.strokeRect(w*0.2,0,w*0.6,h);ctx.setLineDash([]);
  // B-field arrows
  for(let y=30;y<h;y+=50){ctx.fillStyle=`rgba(100,200,255,${0.15+0.05*Math.sin(time+y*0.05)})`;ctx.font='16px serif';ctx.fillText('→',w*0.45,y);ctx.fillText('→',w*0.55,y);}
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='11px Orbitron';ctx.fillText('B = '+B.toFixed(2)+' T',w*0.45,20);
  // Input polarization (vertical)
  const polY=h/2;
  ctx.strokeStyle='rgba(100,200,255,0.6)';ctx.lineWidth=2;
  for(let x=0;x<w*0.2;x+=3){
    const amp=20*Math.sin(x*0.1-time*5);
    ctx.beginPath();ctx.moveTo(x,polY);ctx.lineTo(x,polY+amp*Math.cos(0));ctx.stroke();
  }
  // Rotating polarization through plasma
  ctx.strokeStyle=accent;ctx.lineWidth=2;
  for(let x=w*0.2;x<w*0.8;x+=3){
    const frac=(x-w*0.2)/(w*0.6);const angle=rotation*frac+time*0.5;
    const amp=20*Math.sin(x*0.1-time*5);
    ctx.beginPath();ctx.moveTo(x,polY);ctx.lineTo(x+amp*Math.sin(angle)*0.3,polY+amp*Math.cos(angle));ctx.stroke();
  }
  // Output polarization (rotated)
  ctx.strokeStyle='rgba(100,255,100,0.6)';ctx.lineWidth=2;
  for(let x=w*0.8;x<w;x+=3){
    const amp=20*Math.sin(x*0.1-time*5);
    ctx.beginPath();ctx.moveTo(x,polY);ctx.lineTo(x+amp*Math.sin(rotation)*0.3,polY+amp*Math.cos(rotation));ctx.stroke();
  }
  // Polarization ellipses
  const eR=40;
  [w*0.1,w*0.5,w*0.9].forEach((ex,i)=>{
    const angle=i===0?0:i===1?rotation*0.5:rotation;
    ctx.strokeStyle=i===2?'rgba(100,255,100,0.4)':i===1?accent+'80':'rgba(100,200,255,0.4)';
    ctx.lineWidth=1.5;ctx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.1){
      const px=ex+Math.cos(a)*eR*0.1*Math.cos(angle)-Math.sin(a)*eR*Math.sin(angle);
      const py=h*0.15+Math.cos(a)*eR*0.1*Math.sin(angle)+Math.sin(a)*eR*Math.cos(angle);
      a===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }ctx.closePath();ctx.stroke();
  });
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='9px Orbitron';ctx.fillText('INPUT',w*0.07,h*0.08);ctx.fillText('ROTATING',w*0.47,h*0.08);
  ctx.fillStyle='rgba(100,255,100,0.4)';ctx.fillText('OUTPUT',w*0.87,h*0.08);
  const rotDeg=(rotation*180/Math.PI);
  $('rotVal').textContent=rotDeg.toFixed(2)+'°';$('rmVal').textContent=(rotation/(path+0.01)).toFixed(2)+' rad/m²';
  $('neVal').textContent=(B*1e18).toExponential(1)+' /m³';$('verdetVal').textContent=(rotation/(B*path+0.001)).toFixed(4)+' rad/(T·m)';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('FARADAY ROTATION — Δθ='+rotDeg.toFixed(1)+'° B='+B.toFixed(2)+'T',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('bSlider').value=50;$('bVal').textContent='0.50 T';$('wlSlider').value=30;$('wlVal').textContent='30 cm';$('pathSlider').value=50;$('pathVal').textContent='5.0 m';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('rotVal').textContent='-- °';$('rmVal').textContent='-- rad/m²';$('neVal').textContent='-- /m³';$('verdetVal').textContent='-- rad/(T·m)';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('bSlider').oninput=function(){$('bVal').textContent=(this.value/100).toFixed(2)+' T';};$('wlSlider').oninput=function(){$('wlVal').textContent=this.value+' cm';};$('pathSlider').oninput=function(){$('pathVal').textContent=(this.value/10).toFixed(1)+' m';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Faraday Rotation Lab
   Animated polarization rotation through magnetized plasma with
   rotating E-field vector, magnetic field lines, and rotation angle
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simFaradayRotation';let cv,cx,W,H,af=null,t=0;
  let bField=0.5,wavelength=30,pathLength=5,rotAngle=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawMagneticField(){
    cx.strokeStyle='rgba(100,150,255,0.08)';cx.lineWidth=1;
    for(let y=-20;y<H+20;y+=30){
      cx.beginPath();
      for(let x=0;x<W;x+=5){
        const yy=y+Math.sin(x*0.02+t)*8;
        if(x===0)cx.moveTo(x,yy);else cx.lineTo(x,yy);
      }
      cx.stroke();
    }
    // B-field arrows
    for(let x=100;x<W-100;x+=120){
      cx.fillStyle='rgba(100,150,255,0.2)';cx.font='10px sans-serif';cx.textAlign='center';
      cx.fillText('B-->',x,25);
    }
  }

  function drawPlasmaRegion(){
    const px=200,py=40,pw=380,ph=H-80;
    cx.fillStyle='rgba(100,50,200,0.06)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(100,50,200,0.15)';cx.lineWidth=1;cx.setLineDash([4,4]);
    cx.strokeRect(px,py,pw,ph);cx.setLineDash([]);
    // Plasma particles
    for(let i=0;i<40;i++){
      const x=px+Math.random()*pw;
      const y=py+Math.random()*ph;
      cx.fillStyle='rgba(150,100,255,'+(0.1+Math.random()*0.1)+')';
      cx.beginPath();cx.arc(x,y,1+Math.random(),0,Math.PI*2);cx.fill();
    }
    cx.fillStyle='rgba(150,100,255,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('MAGNETIZED PLASMA',px+pw/2,py-5);
  }

  function drawLightBeam(){
    const startX=30,endX=W-30,y=H/2;
    // Incoming polarized beam
    cx.strokeStyle='rgba(255,200,0,0.4)';cx.lineWidth=2;cx.beginPath();
    for(let x=startX;x<200;x+=3){
      const amp=15*Math.sin((x-startX)*0.1+t*5);
      cx.lineTo(x,y+amp);
    }
    cx.stroke();
    // Through plasma (rotating polarization)
    cx.strokeStyle='rgba(255,100,100,0.4)';cx.lineWidth=2;cx.beginPath();
    for(let x=200;x<580;x+=3){
      const progress=(x-200)/380;
      const currentRot=rotAngle*progress;
      const amp=15*Math.sin((x-200)*0.1+t*5)*Math.cos(currentRot);
      if(x===200)cx.moveTo(x,y+amp);else cx.lineTo(x,y+amp);
    }
    cx.stroke();
    // Outgoing rotated beam
    cx.strokeStyle='rgba(100,255,100,0.4)';cx.lineWidth=2;cx.beginPath();
    for(let x=580;x<endX;x+=3){
      const amp=15*Math.sin((x-580)*0.1+t*5)*Math.cos(rotAngle);
      if(x===580)cx.moveTo(x,y+amp);else cx.lineTo(x,y+amp);
    }
    cx.stroke();
  }

  function drawPolarizationVectors(){
    // Input polarization
    const inX=80,inY=H-60;
    cx.save();cx.translate(inX,inY);
    cx.strokeStyle='rgba(255,200,0,0.6)';cx.lineWidth=2;
    cx.beginPath();cx.moveTo(0,-20);cx.lineTo(0,20);cx.stroke();
    cx.beginPath();cx.moveTo(-2,-20);cx.lineTo(0,-25);cx.lineTo(2,-20);cx.fill();
    cx.fillStyle='rgba(255,200,0,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('INPUT',0,32);cx.restore();

    // Output polarization (rotated)
    const outX=W-80,outY=H-60;
    cx.save();cx.translate(outX,outY);cx.rotate(rotAngle);
    cx.strokeStyle='rgba(100,255,100,0.6)';cx.lineWidth=2;
    cx.beginPath();cx.moveTo(0,-20);cx.lineTo(0,20);cx.stroke();
    cx.beginPath();cx.moveTo(-2,-20);cx.lineTo(0,-25);cx.lineTo(2,-20);cx.fill();
    cx.restore();
    cx.fillStyle='rgba(100,255,100,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('OUTPUT',outX,outY+32);
    cx.fillText((rotAngle*180/Math.PI).toFixed(1)+'deg',outX,outY+42);
  }

  function drawRotationAngleGauge(){
    const gx=W-160,gy=30,gr=50;
    cx.strokeStyle='rgba(255,255,255,0.1)';cx.lineWidth=1;
    cx.beginPath();cx.arc(gx,gy+gr,gr,0,Math.PI*2);cx.stroke();
    // Angle arc
    cx.strokeStyle='rgba(100,255,100,0.5)';cx.lineWidth=3;
    cx.beginPath();cx.arc(gx,gy+gr,gr,-Math.PI/2,-Math.PI/2+rotAngle);cx.stroke();
    // Needle
    cx.strokeStyle='rgba(255,255,255,0.6)';cx.lineWidth=1.5;
    cx.beginPath();cx.moveTo(gx,gy+gr);
    cx.lineTo(gx+Math.cos(-Math.PI/2+rotAngle)*gr*0.9,gy+gr+Math.sin(-Math.PI/2+rotAngle)*gr*0.9);
    cx.stroke();
    cx.fillStyle='rgba(100,255,100,0.5)';cx.font='9px monospace';cx.textAlign='center';
    cx.fillText('ROTATION',(gx),gy+gr+gr+14);
    cx.fillText((rotAngle*180/Math.PI).toFixed(1)+' deg',gx,gy+gr);
  }

  function drawInfoPanel(){
    const px=20,py=20,pw=150,ph=70;
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('FARADAY ROTATION',px+8,py+14);
    cx.fillStyle='#aaa';
    cx.fillText('B = '+bField.toFixed(2)+' T',px+8,py+28);
    cx.fillText('lambda = '+wavelength+' cm',px+8,py+42);
    cx.fillText('Path = '+pathLength.toFixed(1)+' m',px+8,py+56);
    cx.fillText('theta = '+rotAngle.toFixed(3)+' rad',px+8,py+68);
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.12)';cx.fillRect(0,0,W,H);

    // Slowly vary parameters
    bField=0.5+Math.sin(t*0.2)*0.3;
    rotAngle=2.6*bField*pathLength*(wavelength/100)*(wavelength/100);

    drawMagneticField();drawPlasmaRegion();drawLightBeam();
    drawPolarizationVectors();drawRotationAngleGauge();drawInfoPanel();

    cx.fillStyle='rgba(150,100,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Faraday Rotation — Polarization Through Magnetized Plasma',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
