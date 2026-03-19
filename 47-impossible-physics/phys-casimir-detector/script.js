/**
 * Casimir Effect Detector — Workshop DIY v1.0
 * Vacuum force measurement between conducting plates
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="10" width="4" height="80" fill="currentColor" opacity=".6"/><rect x="66" y="10" width="4" height="80" fill="currentColor" opacity=".6"><animate attributeName="x" values="66;50;66" dur="3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Casimir Effect Detector',subtitle:'⚡ Casimir Detector — Vacuum force measurement',disconnected:'Offline',connected:'Measuring',ready:'⚡ Casimir Detector ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'⚡ Measuring Casimir force',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Détecteur Effet Casimir',subtitle:'⚡ Détecteur Casimir — Mesure de force du vide',disconnected:'Hors ligne',connected:'Mesure',ready:'⚡ Détecteur Casimir prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'⚡ Mesure en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'كاشف تأثير كازيمير',subtitle:'⚡ كاشف كازيمير — قياس قوة الفراغ',disconnected:'غير متصل',connected:'يقيس',ready:'⚡ كاشف كازيمير جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'⚡ قياس قوة كازيمير',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='casimir-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const sep=+$('sepSlider').value,area=+$('areaSlider').value,temp=+$('tempSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const plateGap=sep/1000*w*0.3+30;const plateL=w*0.35,plateR=plateL+plateGap;
  // Plates
  ctx.fillStyle='rgba(180,180,200,0.8)';ctx.fillRect(plateL-4,h*0.1,8,h*0.8);ctx.fillRect(plateR-4,h*0.1,8,h*0.8);
  ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('d = '+sep+' nm',plateL,h*0.05);
  // Vacuum modes INSIDE (restricted)
  const maxModes=Math.floor(sep/50)+1;
  for(let m=1;m<=Math.min(maxModes,8);m++){
    const waveLen=plateGap/m;ctx.strokeStyle=`hsla(${200+m*20},70%,60%,${0.15+0.05*Math.sin(time*m)})`;ctx.lineWidth=1;ctx.beginPath();
    for(let y=h*0.1;y<h*0.9;y+=2){const x=plateL+plateGap/2+Math.sin(y/waveLen*Math.PI*2+time*m)*plateGap*0.3/m;ctx.lineTo(x,y);}ctx.stroke();
  }
  // Vacuum modes OUTSIDE (unrestricted - more dense)
  for(let m=1;m<=15;m++){
    const waveLen=20+m*5;
    // Left side
    ctx.strokeStyle=`rgba(100,200,255,${0.05+0.02*Math.sin(time*m)})`;ctx.lineWidth=0.5;ctx.beginPath();
    for(let y=h*0.1;y<h*0.9;y+=3){const x=plateL*0.5+Math.sin(y/waveLen*Math.PI*2+time*m*0.5)*30;ctx.lineTo(x,y);}ctx.stroke();
    // Right side
    ctx.beginPath();for(let y=h*0.1;y<h*0.9;y+=3){const x=plateR+(w-plateR)*0.5+Math.sin(y/waveLen*Math.PI*2+time*m*0.5)*30;ctx.lineTo(x,y);}ctx.stroke();
  }
  // Force arrows (attractive)
  const forceScale=1/(sep*sep)*5000;
  for(let y=h*0.2;y<h*0.8;y+=40){
    ctx.fillStyle=`rgba(255,100,100,${0.3+0.1*Math.sin(time*3+y*0.05)})`;ctx.font='14px sans-serif';
    ctx.fillText('→',plateL+10,y);ctx.fillText('←',plateR-20,y);
  }
  // Force gauge (bottom)
  const gaugeW=w*0.6,gaugeX=w*0.2,gaugeY=h*0.92;
  ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gaugeX,gaugeY);ctx.lineTo(gaugeX+gaugeW,gaugeY);ctx.stroke();
  const needleX=gaugeX+Math.min(forceScale/10,1)*gaugeW+Math.random()*2;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(needleX,gaugeY-8);ctx.lineTo(needleX,gaugeY+8);ctx.stroke();
  // Virtual particle pairs popping in/out
  for(let i=0;i<5;i++){
    const px=plateL+Math.random()*plateGap,py=h*0.1+Math.random()*h*0.8;
    const flash=Math.random();
    if(flash>0.7){ctx.fillStyle=`rgba(255,200,100,${flash*0.3})`;ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+5,py,2,0,Math.PI*2);ctx.fill();}
  }
  // Casimir force: F = -π²ℏc / (240 d⁴) * A
  const hbar=1.055e-34,cLight=3e8;
  const d_m=sep*1e-9,A_m=area*1e-12;
  const F=Math.PI*Math.PI*hbar*cLight/(240*Math.pow(d_m,4))*A_m;
  const P=F/A_m;const E=Math.PI*Math.PI*hbar*cLight/(720*Math.pow(d_m,3));
  $('forceVal').textContent=F.toExponential(2)+' N';$('pressVal').textContent=P.toExponential(2)+' Pa';
  $('edensVal').textContent=E.toExponential(2)+' J/m³';$('deflVal').textContent=(F*1e15).toFixed(2)+' pm';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('CASIMIR DETECTOR — d='+sep+'nm F='+F.toExponential(1)+' N',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('sepSlider').value=200;$('sepVal').textContent='200 nm';$('areaSlider').value=50;$('areaVal').textContent='50 μm²';$('tempSlider').value=300;$('tempVal').textContent='300 K';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('forceVal').textContent='-- N';$('pressVal').textContent='-- Pa';$('edensVal').textContent='-- J/m³';$('deflVal').textContent='-- pm';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('sepSlider').oninput=function(){$('sepVal').textContent=this.value+' nm';};$('areaSlider').oninput=function(){$('areaVal').textContent=this.value+' μm²';};$('tempSlider').oninput=function(){$('tempVal').textContent=this.value+' K';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);
