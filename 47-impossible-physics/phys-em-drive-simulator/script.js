/**
 * EM Drive Simulator — Workshop DIY v1.0
 * Controversial electromagnetic propulsion drive
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 80 L30 20 L70 30 L70 70 Z" fill="none" stroke="currentColor" stroke-width="2" opacity=".6"><animate attributeName="opacity" values=".4;.8;.4" dur="1.5s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'EM Drive Simulator',subtitle:'🚀 EM Drive — Reactionless thrust?',disconnected:'Offline',connected:'Energized',ready:'🚀 EM Drive ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🚀 Cavity energized',simStopped:'⏹ De-energized',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Simulateur EM Drive',subtitle:'🚀 EM Drive — Poussée sans réaction?',disconnected:'Hors ligne',connected:'Énergisé',ready:'🚀 EM Drive prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🚀 Cavité énergisée',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'محاكي محرك EM',subtitle:'🚀 محرك EM — دفع بلا رد فعل؟',disconnected:'غير متصل',connected:'مُشَغَّل',ready:'🚀 محرك EM جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🚀 التجويف مشحون',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='emdrive-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const power=+$('powerSlider').value,Q=+$('qSlider').value,taper=+$('taperSlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  // Frustum cavity
  const cavX=w*0.3,cavY=h*0.15,cavH=h*0.7,smallEnd=50*taper,bigEnd=50+50*(1-taper);
  ctx.strokeStyle='rgba(180,180,200,0.6)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(cavX-smallEnd,cavY);ctx.lineTo(cavX-bigEnd,cavY+cavH);ctx.lineTo(cavX+bigEnd,cavY+cavH);ctx.lineTo(cavX+smallEnd,cavY);ctx.closePath();ctx.stroke();
  // Cavity glow
  const powerNorm=power/2000;
  const grad=ctx.createLinearGradient(cavX,cavY,cavX,cavY+cavH);
  grad.addColorStop(0,`rgba(255,100,50,${powerNorm*0.3})`);grad.addColorStop(1,`rgba(255,200,50,${powerNorm*0.5})`);
  ctx.fillStyle=grad;ctx.fill();
  // Standing wave modes inside cavity
  const modes=Math.floor(Q/10000)+2;
  for(let m=1;m<=modes;m++){
    ctx.strokeStyle=`rgba(255,${150+m*20},50,${0.1+powerNorm*0.2})`;ctx.lineWidth=1;ctx.beginPath();
    for(let y=cavY;y<cavY+cavH;y+=2){
      const frac=(y-cavY)/cavH;const halfW=smallEnd+(bigEnd-smallEnd)*frac;
      const amp=halfW*0.7*Math.sin(m*Math.PI*frac)*Math.sin(time*5*m)*powerNorm;
      ctx.lineTo(cavX+amp,y);
    }ctx.stroke();
  }
  // Microwave photons bouncing
  for(let i=0;i<20*powerNorm;i++){
    const py=cavY+Math.random()*cavH;const frac=(py-cavY)/cavH;const halfW=smallEnd+(bigEnd-smallEnd)*frac;
    const px=cavX+(Math.random()-.5)*halfW*1.5;
    ctx.fillStyle=`rgba(255,200,100,${0.3+Math.random()*0.3})`;ctx.beginPath();ctx.arc(px,py,1.5,0,Math.PI*2);ctx.fill();
  }
  // Thrust arrow (tiny, questionable)
  const thrustMag=power*Q*taper*1e-9;
  const arrowLen=Math.min(thrustMag*1e6,100);
  ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cavX,cavY-10);ctx.lineTo(cavX,cavY-10-arrowLen);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cavX-8,cavY-arrowLen);ctx.lineTo(cavX,cavY-10-arrowLen-10);ctx.lineTo(cavX+8,cavY-arrowLen);ctx.fill();
  ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('THRUST?',cavX+15,cavY-arrowLen/2);
  // Force measurement plot (right side)
  const plotX=w*0.6,plotY=h*0.1,plotW=w*0.35,plotH=h*0.8;
  ctx.strokeStyle='rgba(100,200,255,0.1)';ctx.strokeRect(plotX,plotY,plotW,plotH);
  ctx.strokeStyle='rgba(255,100,100,0.3)';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(plotX,plotY+plotH/2);ctx.lineTo(plotX+plotW,plotY+plotH/2);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,100,100,0.3)';ctx.font='8px Orbitron';ctx.fillText('ZERO LINE',plotX+5,plotY+plotH/2-5);
  // Noisy thrust signal
  ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.beginPath();
  for(let x=0;x<plotW;x+=2){
    const noise=(Math.random()-.5)*plotH*0.3;
    const signal=thrustMag*1e7*Math.sin(x*0.05+time*3)*10;
    const y=plotY+plotH/2-signal+noise;
    x===0?ctx.moveTo(plotX+x,y):ctx.lineTo(plotX+x,y);
  }ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='9px Orbitron';ctx.fillText('FORCE SENSOR OUTPUT',plotX+5,plotY+12);

  const thrustμN=thrustMag*1e6;
  $('thrustVal').textContent=thrustμN.toFixed(3)+' μN';$('tpVal').textContent=(thrustμN/(power/1000)).toFixed(4)+' mN/kW';
  $('cavEVal').textContent=(power*Q/1e6).toFixed(2)+' J';$('statusVal').textContent='⚠️ Within noise floor — Likely thermal artifact';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('EM DRIVE — P='+power+'W Q='+Q+' F='+thrustμN.toFixed(2)+'μN',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('powerSlider').value=700;$('powerVal').textContent='700 W';$('qSlider').value=50000;$('qVal').textContent='50000';$('taperSlider').value=60;$('taperVal').textContent='0.60';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('thrustVal').textContent='-- μN';$('tpVal').textContent='-- mN/kW';$('cavEVal').textContent='-- J';$('statusVal').textContent='⚠️ Unverified';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('powerSlider').oninput=function(){$('powerVal').textContent=this.value+' W';};$('qSlider').oninput=function(){$('qVal').textContent=this.value;};$('taperSlider').oninput=function(){$('taperVal').textContent=(this.value/100).toFixed(2);};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — EM Drive Simulator
   Animated frustum cavity with microwave resonance, radiation
   pressure asymmetry, and thrust measurement visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simEMDrive';let cv,cx,W,H,af=null,t=0;
  const microwaves=[];const MAX_WAVES=60;
  let power=700,qFactor=50000,taper=0.6,thrust=0;
  const thrustHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawFrustum(){
    const fcx=W*0.35,fcy=H/2;
    const bigR=100,smallR=bigR*taper,length=180;
    // Cavity outline
    cx.beginPath();
    cx.moveTo(fcx-length/2,fcy-bigR);
    cx.lineTo(fcx+length/2,fcy-smallR);
    cx.lineTo(fcx+length/2,fcy+smallR);
    cx.lineTo(fcx-length/2,fcy+bigR);
    cx.closePath();
    cx.fillStyle='rgba(100,80,50,0.08)';cx.fill();
    cx.strokeStyle='rgba(200,150,80,0.4)';cx.lineWidth=2;cx.stroke();
    // Endcaps
    cx.fillStyle='rgba(200,150,80,0.15)';
    cx.fillRect(fcx-length/2-3,fcy-bigR,6,bigR*2);
    cx.fillRect(fcx+length/2-3,fcy-smallR,6,smallR*2);
    // Internal resonance glow
    const pulse=0.1+Math.sin(t*8)*0.05;
    const grad=cx.createLinearGradient(fcx-length/2,0,fcx+length/2,0);
    grad.addColorStop(0,'rgba(255,150,0,'+pulse+')');
    grad.addColorStop(1,'rgba(255,50,0,'+(pulse*0.5)+')');
    cx.fillStyle=grad;
    cx.beginPath();
    cx.moveTo(fcx-length/2+5,fcy-bigR+5);
    cx.lineTo(fcx+length/2-5,fcy-smallR+5);
    cx.lineTo(fcx+length/2-5,fcy+smallR-5);
    cx.lineTo(fcx-length/2+5,fcy+bigR-5);
    cx.closePath();cx.fill();
    // Labels
    cx.fillStyle='rgba(200,150,80,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('BIG END',fcx-length/2,fcy+bigR+15);
    cx.fillText('SMALL END',fcx+length/2,fcy+smallR+15);
  }

  function drawMicrowaves(){
    const fcx=W*0.35,fcy=H/2,length=180;
    const bigR=100,smallR=bigR*taper;
    // Bounce microwaves inside cavity
    if(Math.random()<0.15&&microwaves.length<MAX_WAVES){
      const side=Math.random()>0.5;
      const yOff=(Math.random()-.5)*(side?bigR:smallR)*1.5;
      microwaves.push({x:side?fcx-length/2+10:fcx+length/2-10,y:fcy+yOff,
        vx:side?2:-2,vy:(Math.random()-.5)*1,
        age:0,life:50+Math.random()*40,hue:30+Math.random()*20});
    }
    for(let i=microwaves.length-1;i>=0;i--){
      const w=microwaves[i];
      w.age++;w.x+=w.vx;w.y+=w.vy;
      // Reflect off walls
      const progress=(w.x-(fcx-length/2))/length;
      const wallR=bigR-(bigR-smallR)*progress;
      if(Math.abs(w.y-fcy)>wallR){w.vy*=-1;w.y=fcy+(w.y>fcy?wallR:-wallR);}
      if(w.x<fcx-length/2+5){w.vx=Math.abs(w.vx);w.x=fcx-length/2+5;}
      if(w.x>fcx+length/2-5){w.vx=-Math.abs(w.vx);w.x=fcx+length/2-5;}
      if(w.age>w.life){microwaves.splice(i,1);continue;}
      const alpha=Math.sin(w.age/w.life*Math.PI)*0.5;
      cx.fillStyle='hsla('+w.hue+',80%,60%,'+alpha+')';
      cx.beginPath();cx.arc(w.x,w.y,2,0,Math.PI*2);cx.fill();
    }
  }

  function drawThrustArrow(){
    const fcx=W*0.35,fcy=H/2;
    const arrowLen=Math.min(60,thrust*5000);
    if(arrowLen>2){
      cx.strokeStyle='rgba(0,255,100,0.4)';cx.lineWidth=3;
      cx.beginPath();cx.moveTo(fcx+100,fcy);cx.lineTo(fcx+100+arrowLen,fcy);cx.stroke();
      cx.fillStyle='rgba(0,255,100,0.4)';
      cx.beginPath();cx.moveTo(fcx+100+arrowLen,fcy-5);
      cx.lineTo(fcx+105+arrowLen,fcy);cx.lineTo(fcx+100+arrowLen,fcy+5);cx.fill();
      cx.fillStyle='rgba(0,255,100,0.4)';cx.font='8px monospace';cx.textAlign='left';
      cx.fillText('THRUST?',fcx+100+arrowLen+8,fcy+4);
    }
  }

  function drawThrustGraph(){
    const gx=W*0.65,gy=20,gw=W*0.32,gh=100;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    thrustHistory.push(thrust);
    if(thrustHistory.length>200)thrustHistory.shift();
    if(thrustHistory.length>1){
      const maxT=Math.max(...thrustHistory,0.001);
      cx.strokeStyle='rgba(0,255,100,0.5)';cx.lineWidth=1.5;cx.beginPath();
      const step=gw/Math.max(1,thrustHistory.length-1);
      thrustHistory.forEach((v,i)=>{
        const x=gx+i*step;const y=gy+gh-v/maxT*gh*0.8;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(0,255,100,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('THRUST MEASUREMENT',gx+8,gy+12);
    cx.fillText((thrust*1e6).toFixed(2)+' uN',gx+8,gy+gh+10);
  }

  function drawParameters(){
    const px=W*0.65,py=140,pw=W*0.32,ph=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(200,150,80,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('EM DRIVE PARAMETERS',px+8,py+14);
    cx.fillStyle='#aaa';
    cx.fillText('Power: '+power+' W',px+8,py+30);
    cx.fillText('Q Factor: '+qFactor,px+8,py+44);
    cx.fillText('Taper Ratio: '+taper.toFixed(2),px+8,py+58);
    cx.fillText('Status: UNVERIFIED',px+8,py+72);
  }

  function drawCavityModes(){
    const mx=W*0.65,my=230,mw=W*0.32,mh=50;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(mx,my,mw,mh);
    // Resonance modes
    for(let n=1;n<=8;n++){
      const freq=n*2.45;
      const amp=1/(1+Math.pow((freq-7)/2,2));
      const bh=amp*mh*0.7;
      const hue=30+n*20;
      cx.fillStyle='hsla('+hue+',70%,50%,'+(0.3+amp*0.4)+')';
      cx.fillRect(mx+n*mw/9,my+mh-bh,mw/10-2,bh);
    }
    cx.fillStyle='rgba(200,150,80,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('CAVITY RESONANCE MODES',mx+8,my-4);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(200,150,80,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#f59e0b';cx.textAlign='left';
    cx.fillText('EM DRIVE SIMULATOR',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Microwave Cavity Thruster',16,40);
    cx.fillText('Controversial Propulsion',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,14,0.12)';cx.fillRect(0,0,W,H);

    // Vary parameters
    power=700+Math.sin(t*0.2)*100;
    thrust=power*1e-9*qFactor/50000*(1+Math.sin(t*3)*0.2)+(Math.random()-0.5)*1e-9;

    drawFrustum();drawMicrowaves();drawThrustArrow();
    drawThrustGraph();drawParameters();drawCavityModes();drawHUD();

    cx.fillStyle='rgba(200,150,80,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('EM Drive — Microwave Cavity Resonance Propulsion (Unverified)',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
