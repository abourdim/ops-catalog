/**
 * Traffic Camouflage — Network Disguise
 * Disguise network traffic as legitimate protocols
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={
en:{title:'Traffic Camouflage',subtitle:'Network traffic disguise simulation',disconnected:'Idle',connected:'Camouflaging',mainSection:'Traffic Camouflage Engine',mainDesc:'Disguise traffic as legitimate protocols',start:'Start',stop:'Stop',sectionA:'Traffic Operations',sectionC:'How It Works',howItWorksText:'Traffic camouflage makes sensitive traffic look like normal browsing. HTTP mimicry wraps data in legitimate requests. TLS wrapping encrypts within standard sessions. DNS morphing embeds data in DNS patterns. Educational simulation only.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Camouflage ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Camouflage started',simStopped:'Camouflage stopped'},
fr:{title:'Camouflage Reseau',subtitle:'Simulation de deguisement de trafic',disconnected:'Inactif',connected:'Camouflage',mainSection:'Moteur de Camouflage',mainDesc:'Deguiser le trafic en protocoles legitimes',start:'Demarrer',stop:'Arreter',sectionA:'Operations',sectionC:'Comment ca marche',howItWorksText:'Le camouflage reseau deguise le trafic sensible en navigation normale.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Camouflage demarre',simStopped:'Arrete'},
ar:{title:'تمويه حركة الشبكة',subtitle:'محاكاة تنكر حركة المرور',disconnected:'خامل',connected:'تمويه',mainSection:'محرك التمويه',mainDesc:'إخفاء حركة المرور كبروتوكولات شرعية',start:'بدء',stop:'إيقاف',sectionA:'عمليات المرور',sectionC:'كيف يعمل',howItWorksText:'تمويه حركة المرور يجعل البيانات الحساسة تبدو كتصفح عادي.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ التمويه',simStopped:'توقف'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(($('logContainer')||{children:[]}).children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){const lc=$('logContainer');if(!lc)return;const b=new Blob([Array.from(lc.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`camo-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=sx-e.clientX;document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}

/* ═══════ APP LOGIC — Traffic Camouflage ═══════ */
let simRunning=false,simInterval=null,pktCount=0,protocols=0,bandwidth=0,currentMethod='http';
const URLS=['https://www.google.com/search?q=weather','https://cdn.jsdelivr.net/npm/jquery','https://api.github.com/users','https://fonts.googleapis.com/css','https://update.microsoft.com/check'];
let canvas,ctx,particles=[];
function randHex(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}

function genOp(){
  const url=URLS[Math.floor(Math.random()*URLS.length)];const sz=64+Math.floor(Math.random()*400);
  if(currentMethod==='http')return{type:'HTTP',data:`GET ${url} [payload:${randHex(8)}]`,status:`${sz}B`};
  else if(currentMethod==='tls')return{type:'TLS',data:`ClientHello → ${url.split('/')[2]} [wrapped:${randHex(12)}]`,status:`${sz}B`};
  else return{type:'DNS',data:`${randHex(16)}.${url.split('/')[2]} TXT`,status:`${sz}B`};
}

function initCanvas(){canvas=$('appCanvas');if(!canvas)return;ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;ctx.scale(2,2)}

function drawCanvas(){
  if(!ctx)return;const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
  const colors={http:'#22c55e',tls:'#3b82f6',dns:'#a855f7'};const col=colors[currentMethod]||'#22c55e';
  // Packet flow visualization
  particles.forEach((p,i)=>{
    p.x+=p.vx;p.life-=0.01;
    if(p.life<=0||p.x>w+20){particles.splice(i,1);return}
    // Draw as protocol packet shape
    ctx.fillStyle=col;ctx.globalAlpha=p.life*0.6;
    ctx.fillRect(p.x-p.sz,p.y-p.sz/3,p.sz*2,p.sz*0.66);
    ctx.font='5px monospace';ctx.fillStyle='#fff';ctx.globalAlpha=p.life*0.8;ctx.textAlign='center';
    ctx.fillText(p.label,p.x,p.y+2);ctx.globalAlpha=1;
  });
  // Camouflage layer overlay
  const t=(Date.now()%4000)/4000;
  ctx.strokeStyle=col+'40';ctx.lineWidth=1;ctx.setLineDash([4,4]);
  ctx.beginPath();ctx.moveTo(0,h/2+Math.sin(t*Math.PI*2)*30);
  for(let x=0;x<w;x+=10)ctx.lineTo(x,h/2+Math.sin((t+x/w)*Math.PI*2)*30);
  ctx.stroke();ctx.setLineDash([]);
  // Stats bar
  ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.textAlign='center';
  ctx.fillText(`${pktCount} packets camouflaged | ${(bandwidth/1024).toFixed(1)}KB transferred`,w/2,h-6);
}

function addParticles(){
  const w=canvas?canvas.offsetWidth:300,h=canvas?canvas.offsetHeight:200;
  const labels={http:'HTTP',tls:'TLS',dns:'DNS'};
  particles.push({x:-10,y:20+Math.random()*(h-40),vx:1.5+Math.random()*2,sz:6+Math.random()*4,life:1,label:labels[currentMethod]||'PKT'});
  if(particles.length>150)particles.splice(0,30);
}

function updateUI(){
  $('stat1').textContent=pktCount;$('stat2').textContent=currentMethod.toUpperCase();
  $('stat3').textContent=bandwidth>1024?(bandwidth/1024).toFixed(1)+'K':bandwidth;
  $('stat4').textContent=Math.min(Math.round(pktCount/80*100),100)+'%';
}

function addOpToList(op){
  const list=$('opList');if(!list)return;const d=document.createElement('div');d.className='op-item';
  d.innerHTML=`<span class="op-type">${op.type}</span><span class="op-data">${op.data}</span><span class="op-status">${op.status}</span>`;
  list.insertBefore(d,list.firstChild);if(list.children.length>100)list.removeChild(list.lastChild);
}

function simTick(){const op=genOp();pktCount++;bandwidth+=parseInt(op.status);addOpToList(op);addParticles();updateUI();log(`${op.type}: ${op.data}`,'tx')}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);$('startBtn').disabled=true;$('stopBtn').disabled=false;
  pktCount=0;bandwidth=0;particles=[];initCanvas();log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(simTick,500);
  requestAnimationFrame(function loop(){if(!simRunning)return;drawCanvas();requestAnimationFrame(loop)});
}
function stopSim(){simRunning=false;if(simInterval)clearInterval(simInterval);setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;log(LANG[currentLang].simStopped,'info')}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  document.querySelectorAll('.method-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');currentMethod=tab.dataset.method;playSound('click')})});
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS — Protocol Morphing Visualization ═══════ */
(function camoVis(){
  const CVS_ID='camoRichVis';
  function ensureCanvas(){if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);const wrap=document.querySelector('.card');if(!wrap)return null;const card=document.createElement('div');card.className='card';card.innerHTML='<div class="card-header"><div class="card-title"><span class="icon">🔀</span> Protocol Morphing View</div></div>';const c=document.createElement('canvas');c.id=CVS_ID;c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c}
  let _raf=null,frame=0,morphPkts=[];
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return}
    const ctx2=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;ctx2.scale(2,2);const w=W/2,h=H/2;
    ctx2.fillStyle='rgba(10,10,26,0.1)';ctx2.fillRect(0,0,w,h);frame++;
    const isRunning=typeof simRunning!=='undefined'&&simRunning;
    const colors={http:'#22c55e',tls:'#3b82f6',dns:'#a855f7'};
    const col=colors[typeof currentMethod!=='undefined'?currentMethod:'http']||'#22c55e';
    // Morphing packets: red transforms to green
    if(isRunning&&frame%6===0){morphPkts.push({x:20,y:h/2+Math.random()*60-30,phase:0})}
    morphPkts.forEach((p,i)=>{
      p.phase+=0.02;p.x+=2;
      if(p.x>w+20){morphPkts.splice(i,1);return}
      const morphT=Math.min(p.phase,1);
      const r=Math.round(239*(1-morphT)+34*morphT);
      const g2=Math.round(68*(1-morphT)+197*morphT);
      const b2=Math.round(68*(1-morphT)+94*morphT);
      ctx2.fillStyle=`rgb(${r},${g2},${b2})`;ctx2.globalAlpha=0.7;
      ctx2.beginPath();ctx2.arc(p.x,p.y,4,0,Math.PI*2);ctx2.fill();
      if(morphT<0.5){ctx2.font='6px monospace';ctx2.fillText('RAW',p.x,p.y-7)}
      else{ctx2.font='6px monospace';ctx2.fillText(currentMethod.toUpperCase(),p.x,p.y-7)}
      ctx2.globalAlpha=1;
    });
    if(morphPkts.length>100)morphPkts.splice(0,30);
    // Morph zone indicator
    ctx2.fillStyle=col+'15';ctx2.fillRect(w*0.3,10,w*0.4,h-20);
    ctx2.font='9px monospace';ctx2.fillStyle=col+'60';ctx2.textAlign='center';
    ctx2.fillText('CAMOUFLAGE ZONE',w/2,20);
    ctx2.font='7px monospace';ctx2.fillStyle='rgba(255,255,255,0.25)';
    ctx2.fillText('suspicious → legitimate',w/2,h-8);
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
