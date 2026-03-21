/**
 * Doppler Cooling Simulator — Workshop DIY v1.0
 * Laser Doppler cooling of atoms visualization
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="5" fill="currentColor"><animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite"/></circle><line x1="10" y1="50" x2="40" y2="50" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="60" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="50" y1="60" x2="50" y2="90" stroke="currentColor" stroke-width="2" opacity=".4"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Doppler Cooling Sim',subtitle:'❄️ Doppler Cooling — Laser cooling to micro-Kelvin',disconnected:'Offline',connected:'Cooling',ready:'❄️ Doppler Cooling ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'❄️ Cooling active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Sim Refroidissement Doppler',subtitle:'❄️ Refroidissement Doppler — Micro-Kelvin par laser',disconnected:'Hors ligne',connected:'Refroidit',ready:'❄️ Refroidissement prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'❄️ Refroidissement actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'محاكي تبريد دوبلر',subtitle:'❄️ تبريد دوبلر — تبريد بالليزر إلى ميكرو كلفن',disconnected:'غير متصل',connected:'يبرّد',ready:'❄️ تبريد دوبلر جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'❄️ التبريد نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='doppler-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0,temperature=300000;// start at 300mK in μK
const atoms=[];for(let i=0;i<200;i++)atoms.push({x:400+((Math.random()-.5)*300),y:175+((Math.random()-.5)*200),vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6});

function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const detune=+$('detuneSlider').value,power=+$('powerSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2;
  // Cooling rate
  const coolingRate=Math.abs(detune)*power*0.0001;temperature=Math.max(1,temperature*(1-coolingRate*0.01));
  const speedFactor=Math.sqrt(temperature/300000);
  // Laser beams (6 orthogonal)
  const beamAlpha=0.1+power*0.002;
  ctx.strokeStyle=`rgba(255,50,50,${beamAlpha})`;ctx.lineWidth=8;
  [[0,cy,w,cy],[cx,0,cx,h]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  ctx.strokeStyle=`rgba(255,50,50,${beamAlpha*0.5})`;ctx.lineWidth=4;
  [[0,cy-50,w,cy+50],[0,cy+50,w,cy-50]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  // Atoms
  atoms.forEach(a=>{
    a.vx*=(1-coolingRate*0.005);a.vy*=(1-coolingRate*0.005);
    a.vx+=(Math.random()-.5)*speedFactor*0.5;a.vy+=(Math.random()-.5)*speedFactor*0.5;
    // Trap restoring force
    a.vx-=(a.x-cx)*0.0005;a.vy-=(a.y-cy)*0.0005;
    a.x+=a.vx*speedFactor;a.y+=a.vy*speedFactor;
    if(a.x<10||a.x>w-10)a.vx*=-0.9;if(a.y<10||a.y>h-10)a.vy*=-0.9;
    const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
    const hue=240-speed*30;// blue=cold, red=hot
    ctx.fillStyle=`hsla(${Math.max(0,Math.min(240,hue))},80%,60%,0.7)`;
    ctx.beginPath();ctx.arc(a.x,a.y,3+speed*0.3,0,Math.PI*2);ctx.fill();
    // Photon absorption/emission flashes
    if(Math.random()<coolingRate*0.1&&speed>0.5){
      ctx.fillStyle='rgba(255,255,200,0.4)';ctx.beginPath();ctx.arc(a.x,a.y,8,0,Math.PI*2);ctx.fill();
    }
  });
  // MOT trap visualization
  ctx.strokeStyle=`rgba(100,200,255,${0.1+0.05*Math.sin(time*3)})`;ctx.lineWidth=1;ctx.setLineDash([4,4]);
  ctx.beginPath();ctx.arc(cx,cy,80*speedFactor+20,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  // Temperature display
  const tempStr=temperature>1000?(temperature/1000).toFixed(1)+' mK':temperature.toFixed(1)+' μK';
  ctx.fillStyle=accent;ctx.font='14px Orbitron';ctx.textAlign='center';ctx.fillText('T = '+tempStr,cx,30);
  ctx.textAlign='left';
  const dopLim={rb:146,cs:125,na:240,sr:770}[$('atomSelect').value]||146;
  $('tempVal').textContent=tempStr;$('dopLimVal').textContent=dopLim+' μK';
  $('atomCntVal').textContent=atoms.length;$('psdVal').textContent=(1/(temperature+1)*1e3).toExponential(2);
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('DOPPLER COOLING — T='+tempStr+' Δ='+detune+' MHz',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();temperature=300000;atoms.forEach(a=>{a.x=400+(Math.random()-.5)*300;a.y=175+(Math.random()-.5)*200;a.vx=(Math.random()-.5)*6;a.vy=(Math.random()-.5)*6;});$('detuneSlider').value=-15;$('detuneVal').textContent='-15 MHz';$('powerSlider').value=30;$('powerVal').textContent='30 mW';$('atomSelect').value='rb';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('tempVal').textContent='-- μK';$('dopLimVal').textContent='-- μK';$('atomCntVal').textContent='--';$('psdVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('detuneSlider').oninput=function(){$('detuneVal').textContent=this.value+' MHz';};$('powerSlider').oninput=function(){$('powerVal').textContent=this.value+' mW';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Doppler Cooling Simulator
   Animated laser cooling of atoms with counter-propagating beams,
   atom velocity distribution, and temperature evolution
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simDopplerCooling';let cv,cx,W,H,af=null,t=0;
  const atoms=[];const MAX_ATOMS=150;const laserPhotons=[];
  let temperature=300000,dopplerLimit=146;const tempHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040608;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    for(let i=0;i<MAX_ATOMS;i++){
      atoms.push({x:W*0.35+(Math.random()-.5)*200,y:H/2+(Math.random()-.5)*150,
        vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,
        lastAbsorb:0,excited:false});
    }
  }

  function drawTrapRegion(){
    const tcx=W*0.35,tcy=H/2;
    cx.strokeStyle='rgba(255,50,50,0.1)';cx.lineWidth=1;cx.setLineDash([4,4]);
    cx.strokeRect(tcx-150,tcy-120,300,240);cx.setLineDash([]);
  }

  function drawLaserBeams(){
    const tcx=W*0.35,tcy=H/2;
    // Horizontal beams
    const beamAlpha=0.15+Math.sin(t*5)*0.05;
    cx.fillStyle='rgba(255,0,0,'+beamAlpha+')';
    cx.fillRect(0,tcy-2,tcx+150,4);
    cx.fillRect(tcx-150,tcy-2,W*0.35+150,4);
    // Vertical beams
    cx.fillStyle='rgba(255,0,0,'+beamAlpha+')';
    cx.fillRect(tcx-2,0,4,H);
    // Arrows showing beam direction
    cx.fillStyle='rgba(255,100,100,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('>>> LASER',80,tcy-8);
    cx.fillText('LASER <<<',tcx+220,tcy-8);
    // Photon packets along beams
    for(let i=0;i<6;i++){
      const px=(t*200+i*100)%(tcx+150);
      cx.fillStyle='rgba(255,100,100,0.4)';
      cx.beginPath();cx.arc(px,tcy,2,0,Math.PI*2);cx.fill();
      const px2=tcx+150-(t*200+i*100)%(tcx+150);
      cx.beginPath();cx.arc(px2,tcy,2,0,Math.PI*2);cx.fill();
    }
  }

  function updateAtoms(){
    const coolingRate=0.998;
    atoms.forEach(a=>{
      // Apply Doppler cooling effect
      if(Math.random()<0.05){
        const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
        if(speed>0.3){
          a.vx*=coolingRate;a.vy*=coolingRate;
          a.excited=true;a.lastAbsorb=t;
        }
      }
      if(t-a.lastAbsorb>0.1)a.excited=false;
      a.x+=a.vx;a.y+=a.vy;
      // Soft boundary
      const tcx=W*0.35,tcy=H/2;
      if(a.x<tcx-145){a.x=tcx-145;a.vx*=-0.8;}
      if(a.x>tcx+145){a.x=tcx+145;a.vx*=-0.8;}
      if(a.y<tcy-115){a.y=tcy-115;a.vy*=-0.8;}
      if(a.y>tcy+115){a.y=tcy+115;a.vy*=-0.8;}
    });
    // Calculate temperature from kinetic energy
    let ke=0;atoms.forEach(a=>{ke+=a.vx*a.vx+a.vy*a.vy;});
    temperature=Math.max(dopplerLimit,ke/atoms.length*50000);
  }

  function drawAtoms(){
    atoms.forEach(a=>{
      const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
      const hue=240-speed*40;
      if(a.excited){
        cx.save();cx.shadowColor='#ff6600';cx.shadowBlur=8;
        cx.fillStyle='rgba(255,150,0,0.7)';cx.beginPath();cx.arc(a.x,a.y,4,0,Math.PI*2);cx.fill();
        cx.restore();
      }else{
        cx.fillStyle='hsla('+hue+',60%,50%,0.6)';
        cx.beginPath();cx.arc(a.x,a.y,2+speed*0.5,0,Math.PI*2);cx.fill();
      }
    });
  }

  function drawVelocityDistribution(){
    const vx=W*0.72,vy=20,vw=W*0.26,vh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(vx,vy,vw,vh);
    // Histogram of speeds
    const bins=30;const hist=new Array(bins).fill(0);
    atoms.forEach(a=>{
      const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
      const bin=Math.min(bins-1,Math.floor(speed/6*bins));
      hist[bin]++;
    });
    const maxH=Math.max(...hist,1);
    const barW=vw/bins;
    for(let i=0;i<bins;i++){
      const h2=hist[i]/maxH*vh*0.7;
      const hue=240-i/bins*200;
      cx.fillStyle='hsla('+hue+',60%,50%,0.5)';
      cx.fillRect(vx+i*barW,vy+vh-h2,barW-1,h2);
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('VELOCITY DISTRIBUTION',vx+8,vy+10);
    cx.fillText('0               v_max',vx+8,vy+vh+10);
  }

  function drawTemperatureGraph(){
    const gx=W*0.72,gy=H-110,gw=W*0.26,gh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    tempHistory.push(temperature);
    if(tempHistory.length>200)tempHistory.shift();
    if(tempHistory.length>1){
      const maxT=Math.max(...tempHistory);
      cx.strokeStyle='rgba(255,100,50,0.6)';cx.lineWidth=1.5;cx.beginPath();
      const step=gw/Math.max(1,tempHistory.length-1);
      tempHistory.forEach((v,i)=>{
        const x=gx+i*step;const y=gy+gh-(v/maxT)*gh*0.85;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    // Doppler limit line
    const maxT=Math.max(...tempHistory,1);
    const limY=gy+gh-(dopplerLimit/maxT)*gh*0.85;
    cx.strokeStyle='rgba(0,255,100,0.3)';cx.lineWidth=1;cx.setLineDash([3,3]);
    cx.beginPath();cx.moveTo(gx,limY);cx.lineTo(gx+gw,limY);cx.stroke();
    cx.setLineDash([]);
    cx.fillStyle='rgba(0,255,100,0.3)';cx.font='6px monospace';cx.fillText('Doppler limit',gx+gw-60,limY-4);
    cx.fillStyle='rgba(255,100,50,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('TEMPERATURE vs TIME',gx+8,gy-4);
    cx.fillText('T = '+(temperature>1000?(temperature/1000).toFixed(0)+' mK':temperature.toFixed(0)+' uK'),gx+8,gy+gh+10);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,220,54);
    cx.strokeStyle='rgba(255,100,50,0.15)';cx.strokeRect(8,8,220,54);
    cx.font='10px monospace';cx.fillStyle='#ef4444';cx.textAlign='left';
    cx.fillText('DOPPLER COOLING SIMULATOR',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Atoms: '+atoms.length+'  T: '+(temperature>1e3?(temperature/1e3).toFixed(0)+'mK':temperature.toFixed(0)+'uK'),16,40);
    cx.fillText('Doppler Limit: '+dopplerLimit+' uK',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,8,0.12)';cx.fillRect(0,0,W,H);

    drawTrapRegion();drawLaserBeams();updateAtoms();drawAtoms();
    drawVelocityDistribution();drawTemperatureGraph();drawHUD();

    cx.fillStyle='rgba(255,100,50,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Doppler Cooling — Laser Atom Trapping & Velocity Reduction',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
