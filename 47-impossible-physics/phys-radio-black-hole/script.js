/**
 * Radio Black Hole — Workshop DIY v1.0
 * EM wave absorption and Hawking radiation near black hole analogs
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="15" fill="currentColor"/><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".3" stroke-dasharray="3,3"><animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Radio Black Hole',subtitle:'🕳️ Radio Black Hole — EM event horizon',disconnected:'Offline',connected:'Active',ready:'🕳️ Radio Black Hole ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🕳️ Black hole active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Trou Noir Radio',subtitle:'🕳️ Trou Noir Radio — Horizon des événements EM',disconnected:'Hors ligne',connected:'Actif',ready:'🕳️ Trou Noir prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🕳️ Trou noir actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'الثقب الأسود الراديوي',subtitle:'🕳️ الثقب الأسود — أفق الحدث الكهرومغناطيسي',disconnected:'غير متصل',connected:'نشط',ready:'🕳️ الثقب الأسود جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🕳️ الثقب الأسود نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
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
