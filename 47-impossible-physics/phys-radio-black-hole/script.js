/**
 * Radio Black Hole — Workshop DIY v1.0
 * EM wave absorption and Hawking radiation near black hole analogs
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="15" fill="currentColor"/><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".3" stroke-dasharray="3,3"><animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Radio Black Hole',subtitle:'🕳️ Radio Black Hole — EM event horizon',disconnected:'Offline',connected:'Active',ready:'🕳️ Radio Black Hole ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🕳️ Black hole active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Trou Noir Radio',subtitle:'🕳️ Trou Noir Radio — Horizon des événements EM',disconnected:'Hors ligne',connected:'Actif',ready:'🕳️ Trou Noir prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🕳️ Trou noir actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'الثقب الأسود الراديوي',subtitle:'🕳️ الثقب الأسود — أفق الحدث الكهرومغناطيسي',disconnected:'غير متصل',connected:'نشط',ready:'🕳️ الثقب الأسود جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🕳️ الثقب الأسود نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};

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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='blackhole-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ BLACK HOLE SIM ═══════ */
let running=false,animFrame=null,time=0;
const particles=[];for(let i=0;i<400;i++)particles.push({a:Math.random()*Math.PI*2,r:50+Math.random()*300,v:0.5+Math.random()*2,size:Math.random()*2+0.5,hue:Math.random()*60+180});

function drawSim(){
  if(!running)return;time+=0.015;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mass=+$('massSlider').value,freq=+$('freqSlider').value,mode=$('modeSelect').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,rs=mass*0.5+5;

  // Event horizon
  const grad=ctx.createRadialGradient(cx,cy,rs*0.5,cx,cy,rs*3);
  grad.addColorStop(0,'rgba(0,0,0,1)');grad.addColorStop(0.3,'rgba(0,0,0,0.8)');grad.addColorStop(1,'transparent');
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,rs*3,0,Math.PI*2);ctx.fill();
  // Black hole core
  ctx.fillStyle='#000';ctx.beginPath();ctx.arc(cx,cy,rs,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,rs,0,Math.PI*2);ctx.stroke();

  if(mode==='accretion'||mode==='spaghetti'){
    // Accretion disk particles spiraling in
    particles.forEach(p=>{
      p.a+=p.v/(p.r+10)*0.3;p.r-=0.1*(mass/50)/(p.r/(rs*3)+0.1);
      if(p.r<rs){p.r=50+Math.random()*300;p.a=Math.random()*Math.PI*2;p.v=0.5+Math.random()*2;}
      const px=cx+Math.cos(p.a)*p.r,py=cy+Math.sin(p.a)*p.r*0.35;
      const temp=Math.max(0,1-p.r/(rs*6));
      if(mode==='spaghetti'&&p.r<rs*2){
        const stretch=1+(rs*2-p.r)/(rs)*3;
        ctx.fillStyle=`hsla(${p.hue-temp*100},80%,${50+temp*40}%,${0.3+temp*0.5})`;
        ctx.fillRect(px-1,py-stretch*2,2,stretch*4);
      } else {
        ctx.fillStyle=`hsla(${p.hue-temp*100},80%,${50+temp*40}%,${0.3+temp*0.5})`;
        ctx.beginPath();ctx.arc(px,py,p.size+temp*2,0,Math.PI*2);ctx.fill();
      }
    });
  }
  if(mode==='hawking'){
    // Hawking radiation - particles escaping
    for(let i=0;i<8;i++){
      const a=time*2+i*Math.PI/4;const r=rs+5+Math.abs(Math.sin(time*3+i))*80;
      const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;
      ctx.fillStyle=`rgba(255,220,100,${0.3+0.3*Math.sin(time*5+i)})`;
      ctx.beginPath();ctx.arc(px,py,2+Math.sin(time*4+i),0,Math.PI*2);ctx.fill();
      // Trail
      for(let j=0;j<5;j++){const tr=r-j*8;if(tr>rs){
        ctx.fillStyle=`rgba(255,220,100,${0.1-j*0.02})`;ctx.beginPath();ctx.arc(cx+Math.cos(a)*tr,cy+Math.sin(a)*tr,1,0,Math.PI*2);ctx.fill();
      }}
    }
    ctx.fillStyle='rgba(255,220,100,0.4)';ctx.font='10px Orbitron';ctx.fillText('HAWKING RADIATION',cx+rs+20,cy-20);
  }
  if(mode==='lensing'){
    // Einstein ring / gravitational lensing
    for(let i=0;i<30;i++){
      const srcAngle=(i/30)*Math.PI*2;const srcDist=200;
      const srcX=cx+Math.cos(srcAngle)*srcDist,srcY=cy+Math.sin(srcAngle)*srcDist;
      const dx=srcX-cx,dy=srcY-cy,dist=Math.sqrt(dx*dx+dy*dy);
      const deflection=rs*4/(dist+1);
      const lensX=srcX+dx/dist*deflection*10,lensY=srcY+dy/dist*deflection*10;
      ctx.fillStyle=`rgba(100,200,255,${0.2+0.1*Math.sin(time+i)})`;
      ctx.beginPath();ctx.arc(lensX,lensY,2,0,Math.PI*2);ctx.fill();
    }
    // Einstein ring
    ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,rs*2.5+Math.sin(time)*5,0,Math.PI*2);ctx.stroke();
  }

  const rsKm=(mass*2.95).toFixed(1);const hawkT=(6.17e-8/mass*50).toExponential(2);
  const redshift=(1/Math.sqrt(1-rs/(rs*2+10))).toFixed(4);
  $('rsVal').textContent=rsKm+' km';$('hawkTVal').textContent=hawkT+' K';
  $('redshiftVal').textContent='z = '+redshift;$('tidalVal').textContent=(mass*1e10/Math.pow(rs,3)).toExponential(1)+' N/m';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('RADIO BLACK HOLE — '+mode.toUpperCase()+' M='+mass+' M☉',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('massSlider').value=50;$('massVal').textContent='50 M☉';$('freqSlider').value=500;$('freqVal').textContent='500 MHz';$('modeSelect').value='accretion';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('rsVal').textContent='-- km';$('hawkTVal').textContent='-- K';$('redshiftVal').textContent='--';$('tidalVal').textContent='-- N/m';log(LANG[currentLang].simReset,'info');}
function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  $('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('massSlider').oninput=function(){$('massVal').textContent=this.value+' M☉';};$('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' MHz';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Radio Black Hole
   Animated gravitational lensing of EM waves, Hawking radiation,
   accretion disk, and photon sphere visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simRadioBlackHole';let cv,cx,W,H,af=null,t=0;
  const photons=[];const hawkingParticles=[];const accretionRings=[];
  const MAX_PHOTONS=120;let bhMass=10;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#020206;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  class Photon{
    constructor(){
      this.x=Math.random()*W*0.3;this.y=Math.random()*H;
      this.vx=1.5+Math.random();this.vy=(Math.random()-.5)*0.5;
      this.trail=[];this.absorbed=false;this.age=0;
      this.freq=Math.random();this.hue=30+this.freq*30;
    }
    update(){
      this.age++;
      const bhx=W*0.5,bhy=H/2;
      const dx=bhx-this.x,dy=bhy-this.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const rs=20*bhMass/10;
      if(dist<rs){this.absorbed=true;return false;}
      const force=500/(dist*dist+100);
      this.vx+=dx/dist*force;this.vy+=dy/dist*force;
      const speed=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
      if(speed>4){this.vx*=4/speed;this.vy*=4/speed;}
      this.x+=this.vx;this.y+=this.vy;
      this.trail.push({x:this.x,y:this.y});
      if(this.trail.length>30)this.trail.shift();
      return this.x>0&&this.x<W&&this.y>0&&this.y<H&&this.age<400;
    }
    draw(){
      if(this.trail.length>1){
        cx.strokeStyle='hsla('+this.hue+',80%,60%,0.3)';cx.lineWidth=1;cx.beginPath();
        this.trail.forEach((p,i)=>{if(i===0)cx.moveTo(p.x,p.y);else cx.lineTo(p.x,p.y);});
        cx.stroke();
      }
      cx.fillStyle='hsla('+this.hue+',80%,70%,0.8)';
      cx.beginPath();cx.arc(this.x,this.y,1.5,0,Math.PI*2);cx.fill();
    }
  }

  class HawkingParticle{
    constructor(){
      const bhx=W*0.5,bhy=H/2,rs=20*bhMass/10;
      const angle=Math.random()*Math.PI*2;
      this.x=bhx+Math.cos(angle)*(rs+2);
      this.y=bhy+Math.sin(angle)*(rs+2);
      this.vx=Math.cos(angle)*(0.5+Math.random()*1);
      this.vy=Math.sin(angle)*(0.5+Math.random()*1);
      this.life=60+Math.random()*80;this.age=0;
    }
    update(){this.age++;this.x+=this.vx;this.y+=this.vy;return this.age<this.life;}
    draw(){
      const alpha=1-this.age/this.life;
      cx.fillStyle='rgba(255,200,100,'+alpha*0.6+')';
      cx.beginPath();cx.arc(this.x,this.y,1,0,Math.PI*2);cx.fill();
    }
  }

  function drawBlackHole(){
    const bhx=W*0.5,bhy=H/2,rs=20*bhMass/10;
    // Event horizon
    cx.save();
    const grad=cx.createRadialGradient(bhx,bhy,rs*0.5,bhx,bhy,rs*3);
    grad.addColorStop(0,'rgba(0,0,0,1)');grad.addColorStop(0.3,'rgba(0,0,0,0.8)');
    grad.addColorStop(0.6,'rgba(20,0,40,0.3)');grad.addColorStop(1,'rgba(0,0,0,0)');
    cx.fillStyle=grad;cx.beginPath();cx.arc(bhx,bhy,rs*3,0,Math.PI*2);cx.fill();
    // Hard event horizon
    cx.fillStyle='#000';cx.beginPath();cx.arc(bhx,bhy,rs,0,Math.PI*2);cx.fill();
    // Photon sphere
    cx.strokeStyle='rgba(255,200,100,0.15)';cx.lineWidth=1;cx.setLineDash([3,5]);
    cx.beginPath();cx.arc(bhx,bhy,rs*1.5,0,Math.PI*2);cx.stroke();cx.setLineDash([]);
    cx.restore();
    // Accretion disk
    cx.save();cx.translate(bhx,bhy);cx.scale(1,0.3);
    for(let r=rs*1.8;r<rs*4;r+=3){
      const bright=0.15*(1-r/(rs*4));
      const hue=30+r;
      cx.strokeStyle='hsla('+hue+',80%,50%,'+bright+')';cx.lineWidth=2;
      cx.beginPath();cx.arc(0,0,r,0,Math.PI*2);cx.stroke();
    }
    cx.restore();
  }

  function drawGravitationalLensing(){
    const bhx=W*0.5,bhy=H/2;
    // Background stars being lensed
    for(let i=0;i<20;i++){
      const sx=W*0.7+Math.sin(i*1.7)*W*0.25;
      const sy=H*0.1+Math.sin(i*2.3)*H*0.8;
      const dx=bhx-sx,dy=bhy-sy;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const deflection=200/(dist+50);
      const lx=sx+dx/dist*deflection*5;
      const ly=sy+dy/dist*deflection*5;
      cx.fillStyle='rgba(255,255,200,'+(0.1+0.1*Math.sin(t+i))+')';
      cx.beginPath();cx.arc(lx,ly,1+deflection*0.5,0,Math.PI*2);cx.fill();
    }
  }

  function drawInfoPanel(){
    const px=20,py=H-80,pw=200,ph=65;
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(255,200,100,0.5)';cx.font='8px monospace';cx.textAlign='left';
    const rs=(20*bhMass/10).toFixed(0);
    cx.fillText('Mass: '+bhMass+' M_sun',px+8,py+14);
    cx.fillText('Schwarzschild R: '+rs+' px',px+8,py+28);
    cx.fillText('Hawking Temp: '+(0.1/bhMass).toFixed(3)+' K',px+8,py+42);
    cx.fillText('Absorbed: '+(photons.filter(p=>p.absorbed).length||0),px+8,py+56);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,210,54);
    cx.strokeStyle='rgba(255,200,100,0.15)';cx.strokeRect(8,8,210,54);
    cx.font='10px monospace';cx.fillStyle='#f59e0b';cx.textAlign='left';
    cx.fillText('RADIO BLACK HOLE',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('EM Wave Absorption & Lensing',16,40);
    cx.fillText('Photons: '+photons.length+'  Hawking: '+hawkingParticles.length,16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(2,2,6,0.12)';cx.fillRect(0,0,W,H);

    if(Math.random()<0.1&&photons.length<MAX_PHOTONS)photons.push(new Photon());
    if(Math.random()<0.03)hawkingParticles.push(new HawkingParticle());

    drawGravitationalLensing();drawBlackHole();

    for(let i=photons.length-1;i>=0;i--){
      if(!photons[i].update())photons.splice(i,1);
      else photons[i].draw();
    }
    for(let i=hawkingParticles.length-1;i>=0;i--){
      if(!hawkingParticles[i].update())hawkingParticles.splice(i,1);
      else hawkingParticles[i].draw();
    }

    drawInfoPanel();drawHUD();

    cx.fillStyle='rgba(255,200,100,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Radio Black Hole — Gravitational Lensing & Hawking Radiation',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
