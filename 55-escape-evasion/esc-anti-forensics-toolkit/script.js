/**
 * Anti-Forensics Toolkit — Evidence Elimination
 * Secure wipe, log sanitization, timestamp manipulation simulation
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}

const LANG={
en:{title:'Anti-Forensics Toolkit',subtitle:'Evidence elimination simulation',disconnected:'Idle',connected:'Wiping',mainSection:'Anti-Forensics Engine',mainDesc:'Secure wipe, log sanitization & timestamp obfuscation',sectionA:'Wipe Operations',sectionC:'How It Works',start:'Start',stop:'Stop',filesWiped:'Files Wiped',logsCleared:'Logs Cleared',timestamps:'Timestamps',coverage:'Coverage',howItWorksText:'Anti-forensics involves techniques to prevent forensic analysis. Secure wiping overwrites data with random patterns. Log sanitization removes traces from system logs. Timestamp manipulation alters file metadata. Educational simulation only.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is anti-forensics?',faq_a1:'Techniques to prevent evidence recovery.',faq_q2:'Is this real?',faq_a2:'No, simulation only.',faq_q3:'What is secure wiping?',faq_a3:'Overwriting data multiple times.',faq_q4:'Is my data safe?',faq_a4:'Yes. Everything runs locally.',howto_1:'Select a method.',howto_2:'Click Start.',howto_3:'Watch the visualization.',howto_4:'Monitor the log.',wiki_wipe_title:'Secure Wipe',wiki_wipe:'Overwrites with random data.',wiki_log_title:'Log Sanitization',wiki_log:'Removes traces from logs.',wiki_privacy_title:'Privacy',wiki_privacy:'All local.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Anti-Forensics ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Wipe started',simStopped:'Wipe stopped',opDone:'Operation complete'},
fr:{title:'Anti-Forensique',subtitle:'Simulation d\'elimination de preuves',disconnected:'Inactif',connected:'Effacement',mainSection:'Moteur Anti-Forensique',mainDesc:'Effacement securise et sanitisation',sectionA:'Operations',sectionC:'Comment ca marche',start:'Demarrer',stop:'Arreter',filesWiped:'Fichiers',logsCleared:'Journaux',timestamps:'Horodatages',coverage:'Couverture',howItWorksText:'L\'anti-forensique empeche l\'analyse judiciaire. L\'effacement securise ecrase les donnees.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que l\'anti-forensique?',faq_a1:'Empecher la recuperation de preuves.',faq_q2:'Est-ce reel?',faq_a2:'Non, simulation.',faq_q3:'Effacement securise?',faq_a3:'Ecrasement multiple des donnees.',faq_q4:'Donnees privees?',faq_a4:'Oui, tout est local.',howto_1:'Choisir une methode.',howto_2:'Cliquer Demarrer.',howto_3:'Observer la visualisation.',howto_4:'Surveiller le journal.',wiki_wipe_title:'Effacement',wiki_wipe:'Ecrase avec des donnees aleatoires.',wiki_log_title:'Sanitisation',wiki_log:'Supprime les traces.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Effacement demarre',simStopped:'Effacement arrete',opDone:'Operation terminee'},
ar:{title:'مجموعة مكافحة الطب الشرعي',subtitle:'محاكاة إزالة الأدلة',disconnected:'خامل',connected:'مسح',mainSection:'محرك مكافحة الطب الشرعي',mainDesc:'مسح آمن وتنظيف السجلات',sectionA:'عمليات المسح',sectionC:'كيف يعمل',start:'بدء',stop:'إيقاف',filesWiped:'ملفات ممسوحة',logsCleared:'سجلات',timestamps:'طوابع زمنية',coverage:'تغطية',howItWorksText:'مكافحة الطب الشرعي تمنع التحليل الجنائي. المسح الآمن يكتب فوق البيانات بأنماط عشوائية.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو مكافحة الطب الشرعي؟',faq_a1:'تقنيات لمنع استعادة الأدلة.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا، محاكاة فقط.',faq_q3:'ما هو المسح الآمن؟',faq_a3:'الكتابة فوق البيانات عدة مرات.',faq_q4:'هل بياناتي آمنة؟',faq_a4:'نعم، كل شيء محلي.',howto_1:'اختر طريقة.',howto_2:'انقر بدء.',howto_3:'شاهد التصور.',howto_4:'راقب السجل.',wiki_wipe_title:'المسح الآمن',wiki_wipe:'يكتب فوق بيانات عشوائية.',wiki_log_title:'تنظيف السجلات',wiki_log:'يزيل الآثار.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل شيء محلي.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ المسح',simStopped:'توقف المسح',opDone:'اكتملت العملية'}
};

let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`forensics-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
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
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Anti-Forensics ═══════ */
let simRunning=false,simInterval=null,filesWiped=0,logsCleared=0,timestampsAlt=0,startTime=0,currentMethod='wipe';
const FILE_PATHS=['/var/log/auth.log','/var/log/syslog','/tmp/.cache_sess','/home/user/.bash_history','~/.ssh/known_hosts','/var/log/kern.log','/tmp/debug_trace.dat','/var/run/secrets.pid'];
let canvas,ctx,particles=[];

function randHex(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}

function genOp(){
  const path=FILE_PATHS[Math.floor(Math.random()*FILE_PATHS.length)];
  if(currentMethod==='wipe'){
    const passes=Math.floor(Math.random()*7)+1;
    return {type:'WIPE',data:`${path} [${passes}-pass overwrite]`,status:'SHREDDED'};
  }else if(currentMethod==='logs'){
    return {type:'LOG',data:`${path} → entries purged: ${Math.floor(Math.random()*200)}`,status:'CLEANED'};
  }else{
    const fakeDate=new Date(Date.now()-Math.random()*86400000*365).toISOString().slice(0,19);
    return {type:'TIME',data:`${path} → mtime set to ${fakeDate}`,status:'ALTERED'};
  }
}

function initCanvas(){
  canvas=$('forensicCanvas');if(!canvas)return;
  ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;
  ctx.scale(2,2);
}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
  const colors={wipe:'#ef4444',logs:'#f59e0b',timestamp:'#8b5cf6'};
  const col=colors[currentMethod]||'#ef4444';
  // Draw shredding blocks
  particles.forEach((p,i)=>{
    p.y+=p.vy;p.x+=p.vx;p.life-=0.015;
    if(p.life<=0){particles.splice(i,1);return;}
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
    ctx.fillStyle=col;ctx.globalAlpha=p.life*0.7;
    ctx.fillRect(-p.sz/2,-p.sz/2,p.sz,p.sz);
    ctx.restore();ctx.globalAlpha=1;
  });
  // Progress bar
  const total=filesWiped+logsCleared+timestampsAlt;
  const pct=Math.min(total/100,1);
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(10,h-14,w-20,6);
  ctx.fillStyle=col+'90';ctx.fillRect(10,h-14,(w-20)*pct,6);
  ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='center';
  ctx.fillText(Math.round(pct*100)+'% coverage',w/2,h-3);
}

function addParticles(){
  const w=canvas?canvas.offsetWidth:300,h=canvas?canvas.offsetHeight:200;
  for(let i=0;i<5;i++){
    particles.push({x:w/2+Math.random()*80-40,y:h/3,vx:(Math.random()-0.5)*3,vy:1+Math.random()*2,sz:3+Math.random()*6,rot:Math.random()*Math.PI*2,life:1});
  }
  if(particles.length>300)particles.splice(0,80);
}

function updateUI(){
  $('filesWiped').textContent=filesWiped;
  $('logsCleared').textContent=logsCleared;
  $('timestampsAlt').textContent=timestampsAlt;
  const total=filesWiped+logsCleared+timestampsAlt;
  $('coverageLevel').textContent=Math.min(Math.round(total/100*100),100)+'%';
}

function addOpToList(op){
  const list=$('wipeList');if(!list)return;
  const d=document.createElement('div');d.className='wipe-item';
  d.innerHTML=`<span class="w-type">${op.type}</span><span class="w-data">${op.data}</span><span class="w-status">${op.status}</span>`;
  list.insertBefore(d,list.firstChild);
  if(list.children.length>100)list.removeChild(list.lastChild);
}

function simTick(){
  const op=genOp();
  if(currentMethod==='wipe')filesWiped++;
  else if(currentMethod==='logs')logsCleared++;
  else timestampsAlt++;
  addOpToList(op);addParticles();updateUI();
  log(`${op.type}: ${op.status} — ${op.data}`,'tx');
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  filesWiped=0;logsCleared=0;timestampsAlt=0;startTime=Date.now();particles=[];
  initCanvas();log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(simTick,500);
  requestAnimationFrame(function loop(){if(!simRunning)return;drawCanvas();requestAnimationFrame(loop)});
}

function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  document.querySelectorAll('.method-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');currentMethod=tab.dataset.method;playSound('click');
    });
  });
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS — Shredder Visualization ═══════ */
(function shredderVis(){
  const CVS_ID='shredderMatrixVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.card')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='card';
    card.innerHTML='<div class="card-header"><div class="card-title"><span class="icon">🔥</span> Data Shredder Matrix</div></div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  let blocks=[],_raf=null,frame=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx2=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx2.scale(2,2);const w=W/2,h=H/2;
    ctx2.fillStyle='rgba(10,10,26,0.1)';ctx2.fillRect(0,0,w,h);
    frame++;
    const isRunning=typeof simRunning!=='undefined'&&simRunning;
    const colors={wipe:'#ef4444',logs:'#f59e0b',timestamp:'#8b5cf6'};
    const col=colors[typeof currentMethod!=='undefined'?currentMethod:'wipe']||'#ef4444';
    // Falling data blocks
    if(isRunning&&frame%3===0){
      blocks.push({x:Math.random()*w,y:-10,sz:4+Math.random()*8,vy:1+Math.random()*3,rot:0,vr:(Math.random()-0.5)*0.1,alpha:1});
    }
    blocks.forEach((b,i)=>{
      b.y+=b.vy;b.rot+=b.vr;
      if(b.y>h*0.7){b.alpha-=0.05;b.sz*=0.95;}
      if(b.alpha<=0||b.y>h+20){blocks.splice(i,1);return;}
      ctx2.save();ctx2.translate(b.x,b.y);ctx2.rotate(b.rot);
      ctx2.fillStyle=col;ctx2.globalAlpha=b.alpha*0.6;
      ctx2.fillRect(-b.sz/2,-b.sz/2,b.sz,b.sz);
      ctx2.restore();ctx2.globalAlpha=1;
    });
    if(blocks.length>400)blocks.splice(0,100);
    // Shredder blades
    const bladeY=h*0.7;
    ctx2.fillStyle=col+'30';ctx2.fillRect(0,bladeY-2,w,4);
    for(let x=0;x<w;x+=12){
      ctx2.fillStyle=col;ctx2.globalAlpha=0.4;
      ctx2.fillRect(x,bladeY-4,2,8);
    }
    ctx2.globalAlpha=1;
    // Stats
    ctx2.font='8px monospace';ctx2.fillStyle='rgba(255,255,255,0.3)';ctx2.textAlign='center';
    const wiped=typeof filesWiped!=='undefined'?filesWiped:0;
    ctx2.fillText(`${wiped} items destroyed`,w/2,h-8);
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
