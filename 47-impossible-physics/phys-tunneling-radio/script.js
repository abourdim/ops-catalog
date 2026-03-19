/**
 * Quantum Tunneling Radio — Workshop DIY v1.0
 * RF wave tunneling through quantum potential barriers
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 70 Q30 70 40 50 Q50 30 50 50 Q50 70 60 50 Q70 30 90 70" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="d" values="M10 70 Q30 70 40 50 Q50 30 50 50 Q50 70 60 50 Q70 30 90 70;M10 50 Q30 50 40 30 Q50 10 50 50 Q50 90 60 70 Q70 50 90 50;M10 70 Q30 70 40 50 Q50 30 50 50 Q50 70 60 50 Q70 30 90 70" dur="2s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
const LANG={
  en:{title:'Quantum Tunneling Radio',subtitle:'🌀 Quantum Tunneling Radio — RF through barriers',disconnected:'Offline',connected:'Tunneling',mainSection:'Quantum Tunneling Radio',mainDesc:'Simulate RF wave tunneling through quantum potential barriers',sectionA:'Tunneling Analysis',sectionC:'Theory',activityLog:'Activity Log',clear:'Clear',copy:'Copy',export:'Export',settings:'⚙️ Settings',language:'Language',theme:'Theme',help:'❓ Help',ready:'🌀 Tunneling Radio ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',barrierType:'Barrier Type',barrierHeight:'Barrier Height (eV)',waveEnergy:'Wave Energy (eV)',theoryIntro:'Quantum tunneling allows particles to pass through classically forbidden barriers.',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🌀 Tunneling active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Radio Tunnel Quantique',subtitle:'🌀 Radio Tunnel Quantique — RF à travers les barrières',disconnected:'Hors ligne',connected:'Tunnel actif',mainSection:'Radio Tunnel Quantique',mainDesc:'Simuler le tunnel quantique des ondes RF',sectionA:'Analyse du Tunnel',sectionC:'Théorie',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',help:'❓ Aide',ready:'🌀 Radio tunnel prête!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',barrierType:'Type de Barrière',barrierHeight:'Hauteur (eV)',waveEnergy:'Énergie (eV)',theoryIntro:'L\'effet tunnel permet aux particules de traverser des barrières classiquement impossibles.',splashHint:'appuyer pour passer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'🌀 Tunnel actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinitialisé',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'راديو النفق الكمي',subtitle:'🌀 راديو النفق الكمي — RF عبر الحواجز',disconnected:'غير متصل',connected:'نفق نشط',mainSection:'راديو النفق الكمي',mainDesc:'محاكاة نفق الموجات الراديوية عبر حواجز الجهد الكمي',sectionA:'تحليل النفق',sectionC:'النظرية',activityLog:'سجل النشاط',clear:'مسح',copy:'نسخ',export:'تصدير',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',help:'❓ مساعدة',ready:'🌀 راديو النفق جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',barrierType:'نوع الحاجز',barrierHeight:'ارتفاع الحاجز',waveEnergy:'طاقة الموجة',theoryIntro:'النفق الكمي يسمح للجسيمات بالمرور عبر حواجز محظورة كلاسيكياً.',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'🌀 النفق نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='tunneling-log.txt';a.click();}
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

/* ═══════ TUNNELING SIMULATION ═══════ */
let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.03;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const bType=$('barrierSelect').value,bH=+$('heightSlider').value/10,energy=+$('energySlider').value/10;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(0,0,w,h);
  const mid=h*0.6,bStart=w*0.4,bEnd=w*0.6,bWidth=bEnd-bStart;
  // Barrier
  ctx.fillStyle='rgba(255,50,50,0.15)';
  if(bType==='single'){ctx.fillRect(bStart,mid-bH*20,bWidth,bH*20);}
  else if(bType==='double'){ctx.fillRect(bStart,mid-bH*20,bWidth*.35,bH*20);ctx.fillRect(bStart+bWidth*.65,mid-bH*20,bWidth*.35,bH*20);}
  else if(bType==='step'){ctx.fillRect(bStart,mid-bH*20,w-bStart,bH*20);}
  else{ctx.fillRect(bStart,mid-bH*10,bWidth,bH*10);ctx.fillStyle='rgba(50,50,255,0.1)';ctx.fillRect(bStart,mid,bWidth,bH*10);}
  // Potential line
  ctx.strokeStyle='rgba(255,100,100,0.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,mid);
  if(bType==='single'){ctx.lineTo(bStart,mid);ctx.lineTo(bStart,mid-bH*20);ctx.lineTo(bEnd,mid-bH*20);ctx.lineTo(bEnd,mid);ctx.lineTo(w,mid);}
  else if(bType==='double'){ctx.lineTo(bStart,mid);ctx.lineTo(bStart,mid-bH*20);ctx.lineTo(bStart+bWidth*.35,mid-bH*20);ctx.lineTo(bStart+bWidth*.35,mid);ctx.lineTo(bStart+bWidth*.65,mid);ctx.lineTo(bStart+bWidth*.65,mid-bH*20);ctx.lineTo(bEnd,mid-bH*20);ctx.lineTo(bEnd,mid);ctx.lineTo(w,mid);}
  else if(bType==='step'){ctx.lineTo(bStart,mid);ctx.lineTo(bStart,mid-bH*20);ctx.lineTo(w,mid-bH*20);}
  else{ctx.lineTo(bStart,mid);ctx.lineTo(bStart,mid-bH*10);ctx.lineTo(bStart,mid+bH*10);ctx.lineTo(bEnd,mid+bH*10);ctx.lineTo(bEnd,mid-bH*10);ctx.lineTo(bEnd,mid);ctx.lineTo(w,mid);}
  ctx.stroke();
  // Energy line
  const eLine=mid-energy*20;
  ctx.strokeStyle='rgba(100,200,100,0.4)';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,eLine);ctx.lineTo(w,eLine);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(100,200,100,0.6)';ctx.font='10px Orbitron';ctx.fillText('E = '+energy.toFixed(1)+' eV',5,eLine-5);
  // Wave function
  const T=energy<bH?Math.exp(-2*(bH-energy)*bWidth*0.01):0.95;
  const R=1-T;
  // Incoming + reflected wave (left of barrier)
  ctx.strokeStyle='rgba(100,200,255,0.8)';ctx.lineWidth=2;ctx.beginPath();
  for(let x=0;x<bStart;x+=2){
    const k=energy*2;const incoming=Math.sin(k*x*0.02-time*5)*15;
    const reflected=R*Math.sin(k*x*0.02+time*5)*15;
    const y=eLine+incoming+reflected;
    x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }ctx.stroke();
  // Evanescent/tunneled wave (inside barrier)
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let x=bStart;x<bEnd;x+=2){
    const frac=(x-bStart)/bWidth;
    const decay=energy<bH?Math.exp(-(bH-energy)*frac*3):1;
    const y=eLine+Math.sin(energy*2*x*0.02-time*5)*15*decay*T;
    x===bStart?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }ctx.stroke();
  // Transmitted wave (right of barrier)
  ctx.strokeStyle='rgba(100,255,100,0.7)';ctx.lineWidth=2;ctx.beginPath();
  for(let x=bEnd;x<w;x+=2){
    const y=eLine+Math.sin(energy*2*x*0.02-time*5)*15*T;
    x===bEnd?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }ctx.stroke();
  // Probability cloud
  for(let i=0;i<30;i++){
    const px=Math.random()*w,py=eLine+(Math.random()-.5)*40;
    let prob;
    if(px<bStart)prob=0.8;else if(px<bEnd)prob=T*Math.exp(-(bH-energy)*((px-bStart)/bWidth)*2);else prob=T;
    if(Math.random()<prob*0.3){ctx.fillStyle=`rgba(100,200,255,${prob*0.3})`;ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fill();}
  }
  // Update metrics
  $('transVal').textContent=T.toFixed(4);$('reflVal').textContent=R.toFixed(4);
  $('tunnelVal').textContent=(T*100).toFixed(2)+'%';
  $('decayVal').textContent=(1/(Math.abs(bH-energy)+0.01)*0.1).toFixed(3)+' nm';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';
  ctx.fillText('QUANTUM TUNNEL — T='+T.toFixed(3)+' R='+R.toFixed(3),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('heightSlider').value=50;$('heightVal').textContent='5.0 eV';$('energySlider').value=30;$('energyVal').textContent='3.0 eV';$('barrierSelect').value='single';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('transVal').textContent='--';$('reflVal').textContent='--';$('tunnelVal').textContent='--%';$('decayVal').textContent='-- nm';log(LANG[currentLang].simReset,'info');}
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
  $('heightSlider').oninput=function(){$('heightVal').textContent=(this.value/10).toFixed(1)+' eV';};
  $('energySlider').oninput=function(){$('energyVal').textContent=(this.value/10).toFixed(1)+' eV';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
