/**
 * Gravitational Wave Simulator — Workshop DIY v1.0
 * Spacetime distortion and LIGO detector simulation
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q30 20 50 50 Q70 80 90 50" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="d" values="M10 50 Q30 20 50 50 Q70 80 90 50;M10 50 Q30 80 50 50 Q70 20 90 50;M10 50 Q30 20 50 50 Q70 80 90 50" dur="1.5s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Gravitational Wave Sim',subtitle:'🌊 Gravitational Wave Sim — Spacetime ripples',disconnected:'Offline',connected:'Detecting',ready:'🌊 GW Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🌊 Detecting GW',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Sim Ondes Gravitationnelles',subtitle:'🌊 Sim OG — Ondulations de l\'espace-temps',disconnected:'Hors ligne',connected:'Détection',ready:'🌊 Simulateur OG prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🌊 Détection OG',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'محاكي الموجات الثقالية',subtitle:'🌊 محاكي الموجات الثقالية — تموجات الزمكان',disconnected:'غير متصل',connected:'يكشف',ready:'🌊 محاكي الموجات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🌊 كشف الموجات',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
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
