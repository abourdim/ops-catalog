/**
 * Doppler Cooling Simulator — Workshop DIY v1.0
 * Laser Doppler cooling of atoms visualization
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="5" fill="currentColor"><animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite"/></circle><line x1="10" y1="50" x2="40" y2="50" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="60" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="50" y1="60" x2="50" y2="90" stroke="currentColor" stroke-width="2" opacity=".4"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Doppler Cooling Sim',subtitle:'❄️ Doppler Cooling — Laser cooling to micro-Kelvin',disconnected:'Offline',connected:'Cooling',ready:'❄️ Doppler Cooling ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'❄️ Cooling active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Sim Refroidissement Doppler',subtitle:'❄️ Refroidissement Doppler — Micro-Kelvin par laser',disconnected:'Hors ligne',connected:'Refroidit',ready:'❄️ Refroidissement prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'❄️ Refroidissement actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'محاكي تبريد دوبلر',subtitle:'❄️ تبريد دوبلر — تبريد بالليزر إلى ميكرو كلفن',disconnected:'غير متصل',connected:'يبرّد',ready:'❄️ تبريد دوبلر جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'❄️ التبريد نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
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
