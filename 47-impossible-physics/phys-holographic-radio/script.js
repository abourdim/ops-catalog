/**
 * Holographic Radio — Workshop DIY v1.0
 * Holographic principle applied to RF encoding on boundary surfaces
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"/><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"><animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={
  en:{title:'Holographic Radio',subtitle:'🌐 Holographic Radio — Boundary-encoded RF',disconnected:'Offline',connected:'Encoding',mainSection:'Holographic Radio',mainDesc:'Encode 3D RF information on 2D boundary surfaces',ready:'🌐 Holographic Radio ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🌐 Encoding active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Radio Holographique',subtitle:'🌐 Radio Holographique — RF encodé en frontière',disconnected:'Hors ligne',connected:'Encodage',mainSection:'Radio Holographique',mainDesc:'Encoder l\'information RF 3D sur des surfaces 2D',ready:'🌐 Radio Holographique prête!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'🌐 Encodage actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'الراديو الهولوغرافي',subtitle:'🌐 الراديو الهولوغرافي — RF مشفر على الحدود',disconnected:'غير متصل',connected:'تشفير',mainSection:'الراديو الهولوغرافي',mainDesc:'تشفير معلومات RF ثلاثية الأبعاد على أسطح حدودية ثنائية',ready:'🌐 الراديو الهولوغرافي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'🌐 التشفير نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};

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
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='holographic-log.txt';a.click();}
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

/* ═══════ HOLOGRAPHIC SIM ═══════ */
let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mode=$('modeSelect').value,res=+$('resSlider').value,dens=+$('densSlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,radius=130;

  if(mode==='boundary'||mode==='bulk'){
    // Boundary circle
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();
    // Boundary encoding cells
    for(let i=0;i<res;i++){
      const a=(i/res)*Math.PI*2+time*0.5;
      const bx=cx+Math.cos(a)*radius,by=cy+Math.sin(a)*radius;
      const val=Math.sin(a*3+time*2)*dens;
      ctx.fillStyle=`hsla(${200+val*60},70%,60%,${0.3+Math.abs(val)*0.5})`;
      ctx.beginPath();ctx.arc(bx,by,6,0,Math.PI*2);ctx.fill();
      // Radial connections to bulk
      if(mode==='bulk'){
        const depth=Math.abs(val)*radius*0.8;
        const ix=cx+Math.cos(a)*depth,iy=cy+Math.sin(a)*depth;
        ctx.strokeStyle=`rgba(100,200,255,${Math.abs(val)*0.2})`;ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ix,iy);ctx.stroke();
        ctx.fillStyle=`rgba(255,200,100,${Math.abs(val)*0.4})`;ctx.beginPath();ctx.arc(ix,iy,3,0,Math.PI*2);ctx.fill();
      }
    }
    // Interior reconstruction
    if(mode==='bulk'){
      for(let gx=-radius;gx<radius;gx+=15){for(let gy=-radius;gy<radius;gy+=15){
        if(gx*gx+gy*gy>radius*radius)continue;
        const val=Math.sin(gx*0.03+time)*Math.cos(gy*0.03+time*1.3)*dens;
        ctx.fillStyle=`rgba(100,150,255,${Math.abs(val)*0.15})`;ctx.fillRect(cx+gx-3,cy+gy-3,6,6);
      }}
    }
  } else if(mode==='entangle'){
    // Entanglement web
    const nodes=[];for(let i=0;i<res;i++){
      const a=(i/res)*Math.PI*2;nodes.push({x:cx+Math.cos(a)*radius,y:cy+Math.sin(a)*radius});
      nodes.push({x:cx+Math.cos(a+0.1)*radius*0.5,y:cy+Math.sin(a+0.1)*radius*0.5});
    }
    nodes.forEach((n,i)=>{
      for(let j=i+1;j<nodes.length;j++){
        const dist=Math.hypot(n.x-nodes[j].x,n.y-nodes[j].y);
        if(dist<150){
          const ent=Math.sin(time*2+i+j)*dens;
          ctx.strokeStyle=`rgba(150,100,255,${Math.abs(ent)*0.15})`;ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();
        }
      }
      ctx.fillStyle=accent;ctx.beginPath();ctx.arc(n.x,n.y,3,0,Math.PI*2);ctx.fill();
    });
  } else {
    // AdS/CFT - hyperbolic tiling
    for(let r=0;r<5;r++){
      const layerR=radius*(1-r*0.18);const nPts=res*(r+1)/2;
      ctx.strokeStyle=`rgba(100,200,255,${0.1+r*0.05})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.arc(cx,cy,layerR,0,Math.PI*2);ctx.stroke();
      for(let i=0;i<nPts;i++){
        const a=(i/nPts)*Math.PI*2+time*(r+1)*0.1;
        const px=cx+Math.cos(a)*layerR,py=cy+Math.sin(a)*layerR;
        const val=Math.sin(a*5+time*3)*dens;
        ctx.fillStyle=`hsla(${220+r*30},60%,${50+val*20}%,${0.3+Math.abs(val)*0.4})`;
        ctx.beginPath();ctx.arc(px,py,3-r*0.3,0,Math.PI*2);ctx.fill();
      }
    }
  }

  const bitsB=(res*8*dens).toFixed(0),bitsV=(res*res*dens).toFixed(0);
  $('entropyVal').textContent=bitsB+' bits';$('bulkVal').textContent=bitsV+' bits';
  $('bekVal').textContent=(bitsB/(4*Math.PI*0.01)).toExponential(1)+' bits/m²';
  $('fidelVal').textContent=(85+dens*15).toFixed(1)+'%';

  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('HOLOGRAPHIC RADIO — '+mode.toUpperCase(),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('resSlider').value=24;$('resVal').textContent='24';$('densSlider').value=50;$('densVal').textContent='50%';$('modeSelect').value='boundary';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('entropyVal').textContent='-- bits';$('bulkVal').textContent='-- bits';$('bekVal').textContent='-- bits/m²';$('fidelVal').textContent='--%';log(LANG[currentLang].simReset,'info');}
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
  $('resSlider').oninput=function(){$('resVal').textContent=this.value;};
  $('densSlider').oninput=function(){$('densVal').textContent=this.value+'%';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Holographic Radio
   Animated holographic boundary encoding with bulk-boundary
   correspondence, information projection, and RF field mapping
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simHolographicRadio';let cv,cx,W,H,af=null,t=0;
  const boundaryBits=[];const bulkParticles=[];const projectionRays=[];
  const MAX_PARTICLES=60;const BOUNDARY_SIZE=100;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    for(let i=0;i<BOUNDARY_SIZE;i++)boundaryBits.push(Math.random()>0.5?1:0);
  }

  function drawBoundarySphere(){
    const scx=W*0.3,scy=H/2,sr=110;
    // Outer boundary (2D surface encoding)
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.lineWidth=1;
    cx.beginPath();cx.arc(scx,scy,sr,0,Math.PI*2);cx.stroke();
    // Rotating boundary data
    const bits=BOUNDARY_SIZE;
    for(let i=0;i<bits;i++){
      const angle=i/bits*Math.PI*2+t*0.3;
      const x=scx+Math.cos(angle)*sr;
      const y=scy+Math.sin(angle)*sr;
      const bit=boundaryBits[i];
      cx.fillStyle=bit?'rgba(59,130,246,0.6)':'rgba(239,68,68,0.3)';
      cx.beginPath();cx.arc(x,y,2,0,Math.PI*2);cx.fill();
    }
    // Inner bulk (3D encoded info)
    cx.fillStyle='rgba(100,200,255,0.03)';
    cx.beginPath();cx.arc(scx,scy,sr,0,Math.PI*2);cx.fill();
    // Grid inside sphere
    cx.strokeStyle='rgba(100,200,255,0.04)';cx.lineWidth=0.5;
    for(let r=sr*0.25;r<sr;r+=sr*0.25){
      cx.beginPath();cx.arc(scx,scy,r,0,Math.PI*2);cx.stroke();
    }
    for(let a=0;a<Math.PI*2;a+=Math.PI/6){
      cx.beginPath();cx.moveTo(scx,scy);
      cx.lineTo(scx+Math.cos(a)*sr,scy+Math.sin(a)*sr);cx.stroke();
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('HOLOGRAPHIC BOUNDARY',scx,scy-sr-8);
    cx.fillText('Bulk Information',scx,scy+4);
  }

  function drawBulkParticles(){
    const scx=W*0.3,scy=H/2,sr=110;
    if(Math.random()<0.08&&bulkParticles.length<MAX_PARTICLES){
      const angle=Math.random()*Math.PI*2;
      const dist=Math.random()*sr*0.8;
      bulkParticles.push({x:scx+Math.cos(angle)*dist,y:scy+Math.sin(angle)*dist,
        vx:(Math.random()-.5)*0.5,vy:(Math.random()-.5)*0.5,
        life:80+Math.random()*120,age:0,hue:180+Math.random()*60});
    }
    for(let i=bulkParticles.length-1;i>=0;i--){
      const p=bulkParticles[i];
      p.age++;p.x+=p.vx;p.y+=p.vy;
      const dx=p.x-scx,dy=p.y-scy;
      if(Math.sqrt(dx*dx+dy*dy)>sr||p.age>p.life){bulkParticles.splice(i,1);continue;}
      const alpha=Math.sin(p.age/p.life*Math.PI)*0.6;
      cx.fillStyle='hsla('+p.hue+',60%,60%,'+alpha+')';
      cx.beginPath();cx.arc(p.x,p.y,1.5,0,Math.PI*2);cx.fill();
    }
  }

  function drawProjection(){
    const scx=W*0.3,scy=H/2,sr=110;
    const px=W*0.65,py=20,pw=W*0.32,ph=H-40;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(100,200,255,0.1)';cx.strokeRect(px,py,pw,ph);
    // Projection rays from boundary to screen
    for(let i=0;i<12;i++){
      const angle=i/12*Math.PI*2+t*0.2;
      const bx=scx+Math.cos(angle)*sr;
      const by=scy+Math.sin(angle)*sr;
      const tx=px+Math.random()*pw;
      const ty=py+Math.random()*ph;
      cx.strokeStyle='rgba(100,200,255,'+(0.03+Math.sin(t+i)*0.02)+')';
      cx.lineWidth=0.5;cx.beginPath();cx.moveTo(bx,by);cx.lineTo(tx,ty);cx.stroke();
    }
    // Projected RF pattern
    const cols=40,rows=30;
    const cellW=pw/cols,cellH=ph/rows;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const bitIdx=(r*cols+c+Math.floor(t*10))%BOUNDARY_SIZE;
        const val=boundaryBits[bitIdx];
        const interference=Math.sin(c*0.3+t*2)*Math.sin(r*0.3+t*1.5);
        const bright=val*0.4+interference*0.2+0.1;
        if(bright<0.1)continue;
        cx.fillStyle='hsla(200,70%,50%,'+(bright*0.5)+')';
        cx.fillRect(px+c*cellW,py+r*cellH,cellW-0.5,cellH-0.5);
      }
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('RF FIELD PROJECTION',px+pw/2,py-5);
  }

  function drawInfoMetrics(){
    const mx=20,my=H-70,mw=W*0.35,mh=55;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(mx,my,mw,mh);
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    const entropy=(3.2+Math.sin(t)*0.5).toFixed(2);
    const bits2=BOUNDARY_SIZE;
    const area=(4*Math.PI*110*110/4).toFixed(0);
    cx.fillText('Boundary Entropy: '+entropy+' bits/Planck area',mx+8,my+14);
    cx.fillText('Boundary Bits: '+bits2+'  Area: '+area+' px^2',mx+8,my+28);
    cx.fillText('Bulk Degrees of Freedom: '+bulkParticles.length,mx+8,my+42);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,220,54);
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.strokeRect(8,8,220,54);
    cx.font='10px monospace';cx.fillStyle='#3b82f6';cx.textAlign='left';
    cx.fillText('HOLOGRAPHIC RADIO',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Bulk-Boundary Correspondence',16,40);
    cx.fillText('AdS/CFT RF Encoding Simulation',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.1)';cx.fillRect(0,0,W,H);

    // Slowly mutate boundary
    if(Math.floor(t*60)%15===0){
      const idx=Math.floor(Math.random()*BOUNDARY_SIZE);
      boundaryBits[idx]=boundaryBits[idx]?0:1;
    }

    drawBoundarySphere();drawBulkParticles();drawProjection();
    drawInfoMetrics();drawHUD();

    cx.fillStyle='rgba(100,200,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Holographic Principle — Boundary Surface RF Encoding',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
