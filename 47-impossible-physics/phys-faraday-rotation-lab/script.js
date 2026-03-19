/**
 * Faraday Rotation Lab — Workshop DIY v1.0
 * Polarization rotation through magnetized plasma
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><animateTransform attributeName="transform" type="rotate" values="0 50 50;180 50 50;360 50 50" dur="3s" repeatCount="indefinite"/></ellipse></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Faraday Rotation Lab',subtitle:'🧲 Faraday Rotation Lab — Polarization in B-fields',disconnected:'Offline',connected:'Rotating',ready:'🧲 Faraday Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🧲 Rotation active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Labo Rotation Faraday',subtitle:'🧲 Rotation Faraday — Polarisation en champ B',disconnected:'Hors ligne',connected:'Rotation',ready:'🧲 Labo Faraday prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🧲 Rotation active',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'مختبر دوران فاراداي',subtitle:'🧲 مختبر دوران فاراداي — الاستقطاب في المجالات المغناطيسية',disconnected:'غير متصل',connected:'يدور',ready:'🧲 مختبر فاراداي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🧲 الدوران نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
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
