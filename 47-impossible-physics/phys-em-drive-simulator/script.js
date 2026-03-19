/**
 * EM Drive Simulator — Workshop DIY v1.0
 * Controversial electromagnetic propulsion drive
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 80 L30 20 L70 30 L70 70 Z" fill="none" stroke="currentColor" stroke-width="2" opacity=".6"><animate attributeName="opacity" values=".4;.8;.4" dur="1.5s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'EM Drive Simulator',subtitle:'🚀 EM Drive — Reactionless thrust?',disconnected:'Offline',connected:'Energized',ready:'🚀 EM Drive ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🚀 Cavity energized',simStopped:'⏹ De-energized',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Simulateur EM Drive',subtitle:'🚀 EM Drive — Poussée sans réaction?',disconnected:'Hors ligne',connected:'Énergisé',ready:'🚀 EM Drive prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🚀 Cavité énergisée',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'محاكي محرك EM',subtitle:'🚀 محرك EM — دفع بلا رد فعل؟',disconnected:'غير متصل',connected:'مُشَغَّل',ready:'🚀 محرك EM جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🚀 التجويف مشحون',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
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
