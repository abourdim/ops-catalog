/**
 * Bell Inequality RF — Workshop DIY v1.0
 * Bell inequality test with entangled RF photon pairs
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="50" r="10" fill="currentColor" opacity=".5"><animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="70" cy="50" r="10" fill="currentColor" opacity=".5"><animate attributeName="r" values="12;8;12" dur="1.5s" repeatCount="indefinite"/></circle><line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="1" stroke-dasharray="3,3" opacity=".4"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Bell Inequality RF',subtitle:'🔔 Bell Inequality RF — Entangled photon test',disconnected:'Offline',connected:'Testing',ready:'🔔 Bell Test ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🔔 Bell test running',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Inégalité de Bell RF',subtitle:'🔔 Inégalité de Bell — Test photons intriqués',disconnected:'Hors ligne',connected:'Test',ready:'🔔 Test Bell prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🔔 Test en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'متباينة بيل RF',subtitle:'🔔 متباينة بيل RF — اختبار فوتونات متشابكة',disconnected:'غير متصل',connected:'يختبر',ready:'🔔 اختبار بيل جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🔔 اختبار بيل يعمل',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='bell-test-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0,coincidences=0;
const pairs=[];
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const aA=+$('angleASlider').value*Math.PI/180,aB=+$('angleBSlider').value*Math.PI/180,rate=+$('rateSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const srcX=w/2,srcY=h/2,detAX=80,detBX=w-80,detY=h/2;
  // Source
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(srcX,srcY,12+Math.sin(time*5)*3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='9px Orbitron';ctx.textAlign='center';ctx.fillText('SOURCE',srcX,srcY+25);
  // Detectors
  [{x:detAX,y:detY,a:aA,label:'A'},{x:detBX,y:detY,a:aB,label:'B'}].forEach(det=>{
    ctx.save();ctx.translate(det.x,det.y);ctx.rotate(det.a);
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(-20,-25,40,50);
    ctx.fillStyle='rgba(100,200,255,0.1)';ctx.fillRect(-20,-25,40,50);
    ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.moveTo(0,-25);ctx.lineTo(0,25);ctx.stroke();
    ctx.restore();
    ctx.fillStyle='rgba(100,200,255,0.6)';ctx.font='12px Orbitron';ctx.textAlign='center';
    ctx.fillText(det.label,det.x,det.y-35);ctx.fillText((det.a*180/Math.PI).toFixed(0)+'°',det.x,det.y+45);
  });
  ctx.textAlign='left';
  // Generate entangled pairs
  if(Math.random()<rate*0.01){
    const polAngle=Math.random()*Math.PI;
    pairs.push({x:srcX,y:srcY,dir:-1,pol:polAngle,age:0});
    pairs.push({x:srcX,y:srcY,dir:1,pol:polAngle+Math.PI/2,age:0});
  }
  // Animate pairs
  for(let i=pairs.length-1;i>=0;i--){
    const p=pairs[i];p.x+=p.dir*4;p.age++;
    if(p.x<detAX+20&&p.dir<0){
      const detect=Math.cos(p.pol-aA)**2>Math.random();
      if(detect)coincidences++;
      pairs.splice(i,1);continue;
    }
    if(p.x>detBX-20&&p.dir>0){
      const detect=Math.cos(p.pol-aB)**2>Math.random();
      if(detect)coincidences++;
      pairs.splice(i,1);continue;
    }
    if(p.age>300){pairs.splice(i,1);continue;}
    const alpha=Math.max(0,1-p.age/300);
    ctx.fillStyle=p.dir<0?`rgba(255,100,100,${alpha})`:`rgba(100,100,255,${alpha})`;
    ctx.beginPath();ctx.arc(p.x,p.y+(Math.sin(p.age*0.2)*5),3,0,Math.PI*2);ctx.fill();
    // Entanglement line
    if(p.dir<0&&i+1<pairs.length&&pairs[i+1]?.dir>0){
      ctx.strokeStyle=`rgba(200,100,255,${alpha*0.15})`;ctx.lineWidth=0.5;ctx.setLineDash([2,4]);
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pairs[i+1].x,pairs[i+1].y);ctx.stroke();ctx.setLineDash([]);
    }
  }
  // CHSH calculation (quantum prediction: 2√2 ≈ 2.828)
  const diff=aA-aB;
  const E_ab=-Math.cos(2*diff);const E_ab2=-Math.cos(2*(diff+Math.PI/4));
  const E_a2b=-Math.cos(2*(diff-Math.PI/4));const E_a2b2=-Math.cos(2*diff);
  const S=Math.abs(E_ab-E_ab2+E_a2b+E_a2b2);
  const violation=S>2;
  // Correlation plot
  const plotX=w*0.15,plotY=h*0.05,plotW=w*0.2,plotH=h*0.3;
  ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.strokeRect(plotX,plotY,plotW,plotH);
  ctx.strokeStyle='rgba(255,100,100,0.3)';ctx.beginPath();ctx.moveTo(plotX,plotY+plotH/2-2/3*plotH/2);ctx.lineTo(plotX+plotW,plotY+plotH/2-2/3*plotH/2);ctx.stroke();
  ctx.fillStyle='rgba(255,100,100,0.3)';ctx.font='8px Orbitron';ctx.fillText('S=2 (classical limit)',plotX+2,plotY+plotH/2-2/3*plotH/2-3);
  // S value bar
  const barH=(S/4)*plotH;
  ctx.fillStyle=violation?'rgba(255,50,50,0.6)':'rgba(100,255,100,0.6)';
  ctx.fillRect(plotX+plotW*0.3,plotY+plotH-barH,plotW*0.4,barH);
  ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.fillText('S='+S.toFixed(3),plotX+plotW*0.2,plotY+plotH+15);

  $('chshVal').textContent='S = '+S.toFixed(4);
  $('coincVal').textContent=coincidences.toLocaleString();
  $('violVal').textContent=violation?'YES — Quantum! (S > 2)':'No — Classical (S ≤ 2)';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('BELL TEST — S='+S.toFixed(3)+(violation?' VIOLATION!':''),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();coincidences=0;pairs.length=0;$('angleASlider').value=0;$('angleAVal').textContent='0°';$('angleBSlider').value=45;$('angleBVal').textContent='45°';$('rateSlider').value=50;$('rateVal').textContent='50/s';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('chshVal').textContent='--';$('coincVal').textContent='0';$('violVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('angleASlider').oninput=function(){$('angleAVal').textContent=this.value+'°';};$('angleBSlider').oninput=function(){$('angleBVal').textContent=this.value+'°';};$('rateSlider').oninput=function(){$('rateVal').textContent=this.value+'/s';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Bell Inequality RF
   Animated entangled photon pairs with detector angles,
   correlation curves, and CHSH inequality visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simBellInequality';let cv,cx,W,H,af=null,t=0;
  const photonPairs=[];const correlationData=[];
  let totalPairs=0,coincidences=0,angleA=0,angleB=45,chshValue=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  class PhotonPair{
    constructor(){
      this.x=W/2;this.y=H/2-20;
      this.angle=Math.random()*Math.PI;
      this.leftX=this.x;this.rightX=this.x;
      this.speed=3+Math.random()*2;
      this.age=0;this.maxAge=80;
      this.leftResult=null;this.rightResult=null;
      this.measured=false;
    }
    update(){
      this.age++;
      this.leftX-=this.speed;this.rightX+=this.speed;
      if(!this.measured&&this.leftX<120){
        const probA=Math.cos((this.angle-angleA*Math.PI/180))**2;
        this.leftResult=Math.random()<probA?1:-1;
        const probB=Math.cos((this.angle-angleB*Math.PI/180))**2;
        this.rightResult=Math.random()<probB?1:-1;
        this.measured=true;
        if(this.leftResult===this.rightResult)coincidences++;
        totalPairs++;
      }
      return this.age<this.maxAge;
    }
    draw(){
      const alpha=1-this.age/this.maxAge;
      // Left photon
      cx.fillStyle='rgba(59,130,246,'+(alpha*0.7)+')';
      cx.beginPath();cx.arc(this.leftX,this.y,3,0,Math.PI*2);cx.fill();
      // Right photon
      cx.fillStyle='rgba(239,68,68,'+(alpha*0.7)+')';
      cx.beginPath();cx.arc(this.rightX,this.y,3,0,Math.PI*2);cx.fill();
      // Entanglement line
      if(this.leftX>120&&this.rightX<W-120){
        cx.strokeStyle='rgba(200,100,255,'+(alpha*0.1)+')';cx.lineWidth=0.5;cx.setLineDash([2,4]);
        cx.beginPath();cx.moveTo(this.leftX,this.y);cx.lineTo(this.rightX,this.y);cx.stroke();
        cx.setLineDash([]);
      }
      // Measurement results
      if(this.measured){
        cx.fillStyle=this.leftResult>0?'rgba(0,255,0,'+alpha*0.5+')':'rgba(255,0,0,'+alpha*0.5+')';
        cx.font='10px monospace';cx.textAlign='center';
        cx.fillText(this.leftResult>0?'+':'-',this.leftX,this.y-10);
        cx.fillStyle=this.rightResult>0?'rgba(0,255,0,'+alpha*0.5+')':'rgba(255,0,0,'+alpha*0.5+')';
        cx.fillText(this.rightResult>0?'+':'-',this.rightX,this.y-10);
      }
    }
  }

  function drawSource(){
    const sx=W/2,sy=H/2-20;
    cx.save();cx.shadowColor='#8b5cf6';cx.shadowBlur=8+Math.sin(t*3)*4;
    cx.fillStyle='rgba(139,92,246,0.3)';cx.beginPath();cx.arc(sx,sy,12,0,Math.PI*2);cx.fill();
    cx.strokeStyle='#8b5cf6';cx.lineWidth=2;cx.beginPath();cx.arc(sx,sy,12,0,Math.PI*2);cx.stroke();
    cx.restore();
    cx.fillStyle='rgba(200,150,255,0.5)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('ENTANGLED SOURCE',sx,sy+22);
  }

  function drawDetector(x,y,angle,label,color){
    cx.save();cx.translate(x,y);
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(-25,-30,50,60);
    cx.strokeStyle=color;cx.lineWidth=1.5;cx.strokeRect(-25,-30,50,60);
    // Polarizer angle
    cx.rotate(angle*Math.PI/180);
    cx.strokeStyle=color;cx.lineWidth=2;
    cx.beginPath();cx.moveTo(-15,0);cx.lineTo(15,0);cx.stroke();
    cx.restore();
    cx.fillStyle=color;cx.font='8px monospace';cx.textAlign='center';
    cx.fillText(label,x,y+42);
    cx.fillText(angle+'deg',x,y+52);
  }

  function drawCorrelationCurve(){
    const gx=20,gy=H-110,gw=300,gh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    // QM prediction: -cos(a-b)
    cx.strokeStyle='rgba(139,92,246,0.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<gw;i++){
      const theta=i/gw*360;
      const corr=-Math.cos(theta*Math.PI/180);
      const y=gy+gh/2-corr*gh*0.4;
      if(i===0)cx.moveTo(gx+i,y);else cx.lineTo(gx+i,y);
    }
    cx.stroke();
    // Classical bound
    cx.strokeStyle='rgba(255,200,0,0.3)';cx.lineWidth=1;cx.setLineDash([4,4]);
    cx.beginPath();cx.moveTo(gx,gy+gh/2-gh*0.28);cx.lineTo(gx+gw,gy+gh/2-gh*0.28);cx.stroke();
    cx.beginPath();cx.moveTo(gx,gy+gh/2+gh*0.28);cx.lineTo(gx+gw,gy+gh/2+gh*0.28);cx.stroke();
    cx.setLineDash([]);
    // Current angle marker
    const diff=Math.abs(angleA-angleB);
    const markerX=gx+(diff/360)*gw;
    cx.strokeStyle='rgba(255,255,255,0.5)';cx.lineWidth=1;
    cx.beginPath();cx.moveTo(markerX,gy);cx.lineTo(markerX,gy+gh);cx.stroke();
    cx.fillStyle='rgba(139,92,246,0.5)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('CORRELATION E(a,b) vs angle diff',gx+8,gy-4);
    cx.fillText('Purple: QM  Yellow: Classical bound',gx+8,gy+gh+10);
  }

  function drawCHSHPanel(){
    const px=340,py=H-110,pw=200,ph=80;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(px,py,pw,ph);
    // Calculate CHSH
    const diff=(angleA-angleB)*Math.PI/180;
    chshValue=2*Math.sqrt(2)*Math.abs(Math.cos(diff));
    const violated=chshValue>2;
    cx.fillStyle=violated?'rgba(239,68,68,0.5)':'rgba(34,197,94,0.5)';
    cx.font='9px monospace';cx.textAlign='left';
    cx.fillText('CHSH INEQUALITY TEST',px+8,py+14);
    cx.fillStyle='#aaa';cx.font='8px monospace';
    cx.fillText('S = '+chshValue.toFixed(3),px+8,py+30);
    cx.fillText('Classical bound: S <= 2',px+8,py+44);
    cx.fillText('QM max: S = 2*sqrt(2) = 2.828',px+8,py+58);
    cx.fillStyle=violated?'#ef4444':'#22c55e';
    cx.fillText(violated?'BELL VIOLATION!':'Within classical bound',px+8,py+72);
    // Bar
    const barW=pw-16;const barX=px+8;const barY=py+ph-12;
    cx.fillStyle='rgba(255,255,255,0.1)';cx.fillRect(barX,barY,barW,8);
    const sNorm=Math.min(1,chshValue/3);
    cx.fillStyle=violated?'#ef4444':'#22c55e';
    cx.fillRect(barX,barY,barW*sNorm,8);
    // Classical limit line
    cx.strokeStyle='#f59e0b';cx.lineWidth=2;
    cx.beginPath();cx.moveTo(barX+barW*(2/3),barY);cx.lineTo(barX+barW*(2/3),barY+8);cx.stroke();
  }

  function drawStats(){
    const sx=560,sy=H-110,sw=200,sh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(sx,sy,sw,sh);
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('STATISTICS',sx+8,sy+14);
    cx.fillStyle='#aaa';
    const corrRate=totalPairs>0?(coincidences/totalPairs*100).toFixed(1):'--';
    cx.fillText('Total Pairs: '+totalPairs,sx+8,sy+30);
    cx.fillText('Coincidences: '+coincidences,sx+8,sy+44);
    cx.fillText('Correlation: '+corrRate+'%',sx+8,sy+58);
    cx.fillText('Angle A-B: '+(angleA-angleB)+'deg',sx+8,sy+72);
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.1)';cx.fillRect(0,0,W,H);

    // Slowly sweep angles
    angleA=Math.floor(Math.sin(t*0.15)*45+45);
    angleB=Math.floor(Math.cos(t*0.1)*45+45);

    if(Math.random()<0.12)photonPairs.push(new PhotonPair());
    for(let i=photonPairs.length-1;i>=0;i--){
      if(!photonPairs[i].update())photonPairs.splice(i,1);
      else photonPairs[i].draw();
    }

    drawSource();
    drawDetector(100,H/2-20,angleA,'DETECTOR A','rgba(59,130,246,0.7)');
    drawDetector(W-100,H/2-20,angleB,'DETECTOR B','rgba(239,68,68,0.7)');
    drawCorrelationCurve();drawCHSHPanel();drawStats();

    cx.fillStyle='rgba(139,92,246,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Bell Inequality RF — Entangled Photon Pair Correlation Test',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
