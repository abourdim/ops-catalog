/**
 * Plasma Antenna Simulator — Workshop DIY v1.0
 * Ionized gas column antenna with radiation pattern visualization
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" stroke-width="3" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="1s" repeatCount="indefinite"/></line><circle cx="50" cy="30" r="5" fill="currentColor" opacity=".6"><animate attributeName="r" values="3;8;3" dur="1.5s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;o.frequency.value=t==='success'?523:t==='error'?200:800;g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
const LANG={
  en:{title:'Plasma Antenna',subtitle:'⚡ Plasma Antenna — Ionized gas RF elements',disconnected:'Offline',connected:'Ignited',mainSection:'Plasma Antenna',mainDesc:'Simulate reconfigurable plasma antenna with ionized gas columns',sectionA:'Antenna Metrics',sectionC:'Theory',activityLog:'Activity Log',clear:'Clear',copy:'Copy',export:'Export',settings:'⚙️ Settings',language:'Language',theme:'Theme',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'⚡ Plasma Antenna ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',plasmaMode:'Plasma Mode',ionLevel:'Ionization Level',rfFreq:'RF Frequency (MHz)',startSim:'▶ Ignite',stopSim:'⏹ Quench',resetSim:'↺ Reset',gain:'Gain:',vswr:'VSWR:',plasmaDensity:'Plasma Density:',beamwidth:'Beamwidth:',theoryIntro:'Plasma antennas use ionized gas instead of metal for RF radiation.',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'⚡ Plasma ignited',simStopped:'⏹ Quenched',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Antenne Plasma',subtitle:'⚡ Antenne Plasma — Éléments RF à gaz ionisé',disconnected:'Hors ligne',connected:'Allumée',mainSection:'Antenne Plasma',mainDesc:'Simuler une antenne plasma reconfigurable à colonnes de gaz ionisé',sectionA:'Métriques',sectionC:'Théorie',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours…',filterAll:'Tout',soundEffects:'Sons',ready:'⚡ Antenne Plasma prête!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',plasmaMode:'Mode Plasma',ionLevel:'Niveau d\'Ionisation',rfFreq:'Fréquence RF (MHz)',startSim:'▶ Allumer',stopSim:'⏹ Éteindre',resetSim:'↺ Réinit.',gain:'Gain:',vswr:'ROS:',plasmaDensity:'Densité Plasma:',beamwidth:'Ouverture:',theoryIntro:'Les antennes plasma utilisent du gaz ionisé au lieu du métal.',splashHint:'appuyer pour passer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'⚡ Plasma allumé',simStopped:'⏹ Éteint',simReset:'↺ Réinitialisé',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'هوائي البلازما',subtitle:'⚡ هوائي البلازما — عناصر RF من الغاز المؤين',disconnected:'غير متصل',connected:'مشتعل',mainSection:'هوائي البلازما',mainDesc:'محاكاة هوائي بلازما قابل لإعادة التشكيل بأعمدة غاز مؤين',sectionA:'مقاييس الهوائي',sectionC:'النظرية',activityLog:'سجل النشاط',clear:'مسح',copy:'نسخ',export:'تصدير',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيفية',wiki:'ويكي',working:'جارٍ…',filterAll:'الكل',soundEffects:'أصوات',ready:'⚡ هوائي البلازما جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',plasmaMode:'وضع البلازما',ionLevel:'مستوى التأين',rfFreq:'تردد RF (ميجاهرتز)',startSim:'▶ إشعال',stopSim:'⏹ إطفاء',resetSim:'↺ إعادة',gain:'الكسب:',vswr:'VSWR:',plasmaDensity:'كثافة البلازما:',beamwidth:'عرض الحزمة:',theoryIntro:'هوائيات البلازما تستخدم الغاز المؤين بدلاً من المعدن.',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'⚡ اشتعل البلازما',simStopped:'⏹ انطفأ',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download='plasma-antenna-log.txt';a.click();}
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

/* ═══════ PLASMA ANTENNA SIMULATION ═══════ */
let running=false,animFrame=null,time=0;
const particles=[];
function initParticles(){particles.length=0;for(let i=0;i<200;i++)particles.push({x:Math.random()*800,y:Math.random()*350,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:Math.random()});}
initParticles();

function drawSim(){
  if(!running)return;time+=0.03;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mode=$('modeSelect').value,ion=+$('ionSlider').value/100,rf=+$('rfSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(0,0,w,h);

  // Plasma tube(s)
  const tubes=mode==='array'?[w*.25,w*.4,w*.55,w*.75]:mode==='helix'?[w*.5]:[w*.5];
  tubes.forEach(tx=>{
    const tubeH=h*0.7,tubeW=mode==='helix'?30:16,ty=h*0.15;
    // Tube glass
    ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.lineWidth=2;
    if(mode==='helix'){
      ctx.beginPath();for(let y=ty;y<ty+tubeH;y+=2){const twist=Math.sin(y*0.05+time*2)*tubeW/2;ctx.lineTo(tx+twist,y);}ctx.stroke();
      ctx.beginPath();for(let y=ty;y<ty+tubeH;y+=2){const twist=Math.sin(y*0.05+time*2+Math.PI)*tubeW/2;ctx.lineTo(tx+twist,y);}ctx.stroke();
    } else {
      ctx.strokeRect(tx-tubeW/2,ty,tubeW,tubeH);
    }
    // Plasma glow
    const grad=ctx.createLinearGradient(tx,ty,tx,ty+tubeH);
    grad.addColorStop(0,`rgba(100,150,255,${ion*0.6})`);
    grad.addColorStop(0.5,`rgba(180,100,255,${ion*0.8})`);
    grad.addColorStop(1,`rgba(100,150,255,${ion*0.6})`);
    ctx.fillStyle=grad;
    if(mode==='helix'){ctx.fillRect(tx-tubeW/2,ty,tubeW,tubeH);}
    else{ctx.fillRect(tx-tubeW/2+2,ty+2,tubeW-4,tubeH-4);}
    // Ionization sparks
    for(let i=0;i<5*ion;i++){
      const sy=ty+Math.random()*tubeH,sx=tx+(Math.random()-.5)*tubeW*0.6;
      ctx.fillStyle=`rgba(200,220,255,${0.5+Math.random()*0.5})`;
      ctx.fillRect(sx,sy,2,2);
    }
  });

  // Radiation pattern (polar)
  const rpX=w*0.85,rpY=h*0.5,rpR=60;
  ctx.strokeStyle='rgba(100,200,255,0.1)';ctx.lineWidth=0.5;
  for(let r=20;r<=rpR;r+=20){ctx.beginPath();ctx.arc(rpX,rpY,r,0,Math.PI*2);ctx.stroke();}
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let a=0;a<Math.PI*2;a+=0.02){
    let gain;
    if(mode==='dipole')gain=Math.abs(Math.sin(a))*rpR;
    else if(mode==='monopole')gain=(a<Math.PI?Math.abs(Math.sin(a)):0)*rpR;
    else if(mode==='array')gain=Math.pow(Math.abs(Math.cos(3*a)),2)*rpR;
    else gain=Math.pow(Math.abs(Math.cos(a)),1.5)*rpR;
    const px=rpX+Math.cos(a)*gain*ion,py=rpY+Math.sin(a)*gain*ion;
    a===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.stroke();
  ctx.fillStyle=accent;ctx.globalAlpha=0.1;ctx.fill();ctx.globalAlpha=1;

  // Particles (ionized gas)
  particles.forEach(p=>{
    p.x+=p.vx*ion;p.y+=p.vy*ion;p.life-=0.005;
    if(p.life<0||p.x<0||p.x>w||p.y<0||p.y>h){p.x=tubes[0]+(Math.random()-.5)*40;p.y=h*0.15+Math.random()*h*0.7;p.vx=(Math.random()-.5)*3;p.vy=(Math.random()-.5)*3;p.life=1;}
    const alpha=p.life*ion;ctx.fillStyle=`rgba(150,180,255,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();
  });

  // Metrics
  const g=(2.15+ion*4*(mode==='array'?3:mode==='helix'?2:1)).toFixed(1);
  $('gainVal').textContent=g+' dBi';$('vswrVal').textContent=(1+Math.random()*.5*(1-ion)).toFixed(2)+':1';
  $('densityVal').textContent=(ion*1e18).toExponential(1)+' /m³';$('beamVal').textContent=(360/(mode==='array'?12:mode==='helix'?6:4)/(ion+.1)).toFixed(0)+'°';

  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('PLASMA ANTENNA — '+mode.toUpperCase()+' @ '+rf+' MHz',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('ionSlider').value=70;$('ionVal').textContent='70%';$('rfSlider').value=900;$('rfVal').textContent='900 MHz';$('modeSelect').value='dipole';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('gainVal').textContent='-- dBi';$('vswrVal').textContent='--';$('densityVal').textContent='-- /m³';$('beamVal').textContent='-- °';log(LANG[currentLang].simReset,'info');}
function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}};}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  $('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('ionSlider').oninput=function(){$('ionVal').textContent=this.value+'%';};$('rfSlider').oninput=function(){$('rfVal').textContent=this.value+' MHz';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
