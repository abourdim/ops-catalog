/**
 * Gravitational Wave Simulator — Workshop DIY v1.0
 * Spacetime distortion and LIGO detector simulation
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q30 20 50 50 Q70 80 90 50" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="d" values="M10 50 Q30 20 50 50 Q70 80 90 50;M10 50 Q30 80 50 50 Q70 20 90 50;M10 50 Q30 20 50 50 Q70 80 90 50" dur="1.5s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Gravitational Wave Sim',subtitle:'🌊 Gravitational Wave Sim — Spacetime ripples',disconnected:'Offline',connected:'Detecting',ready:'🌊 GW Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🌊 Detecting GW',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Sim Ondes Gravitationnelles',subtitle:'🌊 Sim OG — Ondulations de l\'espace-temps',disconnected:'Hors ligne',connected:'Détection',ready:'🌊 Simulateur OG prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🌊 Détection OG',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'محاكي الموجات الثقالية',subtitle:'🌊 محاكي الموجات الثقالية — تموجات الزمكان',disconnected:'غير متصل',connected:'يكشف',ready:'🌊 محاكي الموجات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🌊 كشف الموجات',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='gw-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.015;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const src=$('srcSelect').value,mass=+$('massSlider').value,dist=+$('distSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const cx=w*0.35,cy=h*0.45;
  // Spacetime grid distorted by GW
  const strain=mass/(dist+1)*0.001;const gwFreq=src==='binary'?50+time*20:src==='pulsar'?10:src==='supernova'?200*Math.exp(-time*0.5):100*Math.exp(-time*0.3);
  const chirpFreq=src==='binary'?Math.min(gwFreq,500):gwFreq;
  ctx.strokeStyle='rgba(100,200,255,0.08)';ctx.lineWidth=0.5;
  const gridSize=25;
  for(let gx=0;gx<w;gx+=gridSize){for(let gy=0;gy<h*0.7;gy+=gridSize){
    const dx=gx-cx,dy=gy-cy,r=Math.sqrt(dx*dx+dy*dy)+1;
    const distort=strain*50*Math.sin(r*0.03-time*chirpFreq*0.05)/Math.sqrt(r*0.1+1);
    const px=gx+distort*dx/r,py=gy+distort*dy/r;
    ctx.beginPath();ctx.arc(px,py,1,0,Math.PI*2);ctx.stroke();
  }}
  // Binary merger visualization
  if(src==='binary'){
    const sep=30-Math.min(time*2,25);const orbitSpeed=time*5/(sep*0.1+0.5);
    const x1=cx+Math.cos(orbitSpeed)*sep,y1=cy+Math.sin(orbitSpeed)*sep;
    const x2=cx-Math.cos(orbitSpeed)*sep,y2=cy-Math.sin(orbitSpeed)*sep;
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(x1,y1,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x2,y2,8,0,Math.PI*2);ctx.fill();
    // Spiral waves
    for(let a=0;a<Math.PI*6;a+=0.1){const r=a*15+time*100;const wx=cx+Math.cos(a+time*2)*r,wy=cy+Math.sin(a+time*2)*r;
      if(wx>0&&wx<w&&wy>0&&wy<h*0.7){ctx.fillStyle=`rgba(100,200,255,${0.05-a*0.005})`;ctx.fillRect(wx,wy,2,2);}}
  } else {
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(cx,cy,12+Math.sin(time*5)*3,0,Math.PI*2);ctx.fill();
    for(let ring=1;ring<8;ring++){ctx.strokeStyle=`rgba(100,200,255,${0.15-ring*0.015})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,ring*30+time*50%30,0,Math.PI*2);ctx.stroke();}
  }
  // LIGO strain plot (bottom)
  const plotY=h*0.72,plotH=h*0.25;
  ctx.strokeStyle='rgba(100,200,255,0.15)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,plotY+plotH/2);ctx.lineTo(w,plotY+plotH/2);ctx.stroke();
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=0;x<w;x+=2){
    let signal;const t2=(x/w)*10-time*5;
    if(src==='binary')signal=Math.sin(t2*chirpFreq*0.1)*Math.exp(Math.min(t2*0.3,2))*strain*plotH*80;
    else if(src==='ringdown')signal=Math.sin(t2*gwFreq*0.1)*Math.exp(-Math.abs(t2)*0.5)*strain*plotH*80;
    else signal=Math.sin(t2*gwFreq*0.1)*strain*plotH*80;
    signal+=(Math.random()-0.5)*2;// noise
    const y=plotY+plotH/2-signal;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='9px Orbitron';ctx.fillText('LIGO STRAIN',5,plotY+12);
  $('strainVal').textContent=(strain*1e-21).toExponential(2);$('gwFreqVal').textContent=chirpFreq.toFixed(0)+' Hz';
  $('chirpVal').textContent=(mass*0.87).toFixed(1)+' M☉';$('snrVal').textContent=(mass/Math.sqrt(dist)*10).toFixed(1);
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('GW DETECTOR — '+src.toUpperCase()+' h='+(strain*1e-21).toExponential(1),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();time=0;$('massSlider').value=30;$('massVal').textContent='30 M☉';$('distSlider').value=100;$('distVal').textContent='100 Mpc';$('srcSelect').value='binary';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('strainVal').textContent='--';$('gwFreqVal').textContent='-- Hz';$('chirpVal').textContent='-- M☉';$('snrVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('massSlider').oninput=function(){$('massVal').textContent=this.value+' M☉';};$('distSlider').oninput=function(){$('distVal').textContent=this.value+' Mpc';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Gravitational Wave Simulator
   Animated spacetime grid distortion with binary inspiral,
   LIGO interferometer arms, and strain waveform
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simGravWave';let cv,cx,W,H,af=null,t=0;
  let orbitPhase=0,orbitRadius=60,frequency=0.5,strain=0;
  const strainHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#030408;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawSpacetimeGrid(){
    const gcx=W*0.35,gcy=H/2-10,gs=160;
    cx.strokeStyle='rgba(100,200,255,0.08)';cx.lineWidth=0.5;
    const gridSize=20;
    for(let gx=-gs;gx<=gs;gx+=gridSize){
      cx.beginPath();
      for(let gy=-gs;gy<=gs;gy+=4){
        const dx=gx-0,dy=gy-0;
        const dist=Math.sqrt(dx*dx+dy*dy)+1;
        const distort=strain*500/(dist+10);
        const stretch=gx*(1+distort*Math.cos(orbitPhase*2));
        const squeeze=gy*(1-distort*Math.cos(orbitPhase*2));
        const px=gcx+stretch;const py=gcy+squeeze;
        if(gy===-gs)cx.moveTo(px,py);else cx.lineTo(px,py);
      }
      cx.stroke();
    }
    for(let gy=-gs;gy<=gs;gy+=gridSize){
      cx.beginPath();
      for(let gx=-gs;gx<=gs;gx+=4){
        const dx=gx-0,dy=gy-0;
        const dist=Math.sqrt(dx*dx+dy*dy)+1;
        const distort=strain*500/(dist+10);
        const stretch=gx*(1+distort*Math.cos(orbitPhase*2));
        const squeeze=gy*(1-distort*Math.cos(orbitPhase*2));
        const px=gcx+stretch;const py=gcy+squeeze;
        if(gx===-gs)cx.moveTo(px,py);else cx.lineTo(px,py);
      }
      cx.stroke();
    }
  }

  function drawBinarySystem(){
    const bcx=W*0.35,bcy=H/2-10;
    const x1=bcx+Math.cos(orbitPhase)*orbitRadius;
    const y1=bcy+Math.sin(orbitPhase)*orbitRadius*0.4;
    const x2=bcx+Math.cos(orbitPhase+Math.PI)*orbitRadius;
    const y2=bcy+Math.sin(orbitPhase+Math.PI)*orbitRadius*0.4;
    // Orbit trail
    cx.strokeStyle='rgba(255,200,100,0.1)';cx.lineWidth=1;
    cx.beginPath();cx.ellipse(bcx,bcy,orbitRadius,orbitRadius*0.4,0,0,Math.PI*2);cx.stroke();
    // Stars
    const sz=6+4*(60/Math.max(20,orbitRadius));
    cx.save();cx.shadowColor='#f59e0b';cx.shadowBlur=10;
    cx.fillStyle='#f59e0b';cx.beginPath();cx.arc(x1,y1,sz,0,Math.PI*2);cx.fill();
    cx.fillStyle='#ef4444';cx.beginPath();cx.arc(x2,y2,sz*0.8,0,Math.PI*2);cx.fill();
    cx.restore();
    // Gravitational wave ripples
    for(let w=0;w<4;w++){
      const r=(t*80+w*40)%200;
      cx.strokeStyle='rgba(100,200,255,'+(0.08*(1-r/200))+')';cx.lineWidth=1;
      cx.beginPath();cx.arc(bcx,bcy,r,0,Math.PI*2);cx.stroke();
    }
  }

  function drawLIGO(){
    const lx=W*0.75,ly=50,ls=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(lx-ls-10,ly-10,ls*2+20,ls*2+20);
    // Beam splitter
    cx.fillStyle='rgba(100,200,255,0.3)';
    cx.save();cx.translate(lx,ly+ls);cx.rotate(Math.PI/4);
    cx.fillRect(-5,-8,10,16);cx.restore();
    // Arms
    const armStretch=strain*2000;
    cx.strokeStyle='rgba(100,255,100,0.4)';cx.lineWidth=3;
    cx.beginPath();cx.moveTo(lx,ly+ls);cx.lineTo(lx,ly+ls-ls*(1+armStretch));cx.stroke();
    cx.strokeStyle='rgba(255,100,100,0.4)';cx.lineWidth=3;
    cx.beginPath();cx.moveTo(lx,ly+ls);cx.lineTo(lx+ls*(1-armStretch),ly+ls);cx.stroke();
    // Mirrors
    cx.fillStyle='rgba(200,200,220,0.5)';
    cx.fillRect(lx-4,ly-5,8,6);cx.fillRect(lx+ls-3,ly+ls-4,6,8);
    // Laser source
    cx.fillStyle='rgba(255,0,0,0.3)';cx.beginPath();cx.arc(lx-ls,ly+ls,5,0,Math.PI*2);cx.fill();
    // Detector
    cx.fillStyle='rgba(0,255,0,0.3)';cx.beginPath();cx.arc(lx,ly+ls+ls,5,0,Math.PI*2);cx.fill();
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('LIGO INTERFEROMETER',lx,ly-15);
    cx.fillText('Laser',lx-ls,ly+ls+15);cx.fillText('Detector',lx,ly+ls+ls+15);
  }

  function drawStrainWaveform(){
    const wx=20,wy=H-80,ww=W-40,wh=60;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(wx,wy,ww,wh);
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(wx,wy+wh/2);cx.lineTo(wx+ww,wy+wh/2);cx.stroke();
    if(strainHistory.length>1){
      cx.strokeStyle='rgba(100,200,255,0.6)';cx.lineWidth=1.5;cx.beginPath();
      const step=ww/Math.max(1,strainHistory.length-1);
      strainHistory.forEach((v,i)=>{
        const x=wx+i*step;const y=wy+wh/2-v*wh*200;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('STRAIN h(t) — Chirp Waveform',wx+8,wy-4);
    cx.fillText('h = '+strain.toExponential(2),wx+ww-100,wy-4);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#3b82f6';cx.textAlign='left';
    cx.fillText('GRAVITATIONAL WAVE SIM',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Binary Inspiral + LIGO',16,40);
    cx.fillText('Orbit R: '+orbitRadius.toFixed(0)+'  f: '+frequency.toFixed(2)+' Hz',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(3,4,8,0.12)';cx.fillRect(0,0,W,H);

    // Inspiral: orbit shrinks, frequency increases
    frequency=0.5+t*0.02;
    orbitRadius=Math.max(15,60-t*0.8);
    orbitPhase+=frequency*0.1;
    strain=0.001*Math.pow(60/Math.max(15,orbitRadius),2)*Math.sin(orbitPhase*2);
    strainHistory.push(strain);
    if(strainHistory.length>400)strainHistory.shift();
    // Reset inspiral
    if(orbitRadius<=15){t=0;orbitRadius=60;frequency=0.5;strainHistory.length=0;}

    drawSpacetimeGrid();drawBinarySystem();drawLIGO();
    drawStrainWaveform();drawHUD();

    cx.fillStyle='rgba(100,200,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Gravitational Waves — Binary Inspiral Spacetime Distortion',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
