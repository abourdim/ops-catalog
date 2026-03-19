/**
 * Ghost Detector — Hidden WiFi Devices
 * Radar-based ghost device detection simulation
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={
en:{title:'Ghost Detector — Hidden WiFi Devices',subtitle:'Find hidden WiFi devices',disconnected:'Disconnected',connected:'Scanning',mainSection:'Ghost Detector',mainDesc:'Radar scan for hidden devices',sectionA:'Device List',sectionC:'How It Works',start:'Scan',stop:'Stop',totalDevices:'Devices',ghosts:'Ghosts',visible:'Visible',progress:'Progress',howItWorksText:'Ghost detection identifies WiFi devices hiding their presence. Devices that don\'t broadcast SSIDs can still be found through probe requests, data frame analysis, and RF fingerprinting.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is a ghost device?',faq_a1:'A WiFi device not broadcasting its SSID.',faq_q2:'Is this real?',faq_a2:'No, simulation only.',faq_q3:'How are ghosts detected?',faq_a3:'Through probe requests and RF analysis.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click Scan to start radar.',howto_2:'Watch for purple ghost blips.',howto_3:'Check Device List for details.',howto_4:'Monitor the activity log.',wiki_t1:'Ghost Devices',wiki_d1:'Hidden devices detectable via probes.',wiki_t2:'Privacy',wiki_d2:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Ghost Detector ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Radar scan started',simStopped:'Scan stopped',ghostFound:'Ghost device detected!',deviceFound:'Device found'},
fr:{title:'Detecteur de Fantomes — WiFi Cache',subtitle:'Trouver les appareils WiFi caches',disconnected:'Deconnecte',connected:'Balayage',mainSection:'Detecteur de Fantomes',mainDesc:'Scan radar des appareils caches',sectionA:'Liste des Appareils',sectionC:'Comment ca marche',start:'Scanner',stop:'Arreter',totalDevices:'Appareils',ghosts:'Fantomes',visible:'Visibles',progress:'Progres',howItWorksText:'La detection de fantomes identifie les appareils WiFi cachant leur presence via les requetes de sondage et l\'analyse RF.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce qu\'un fantome?',faq_a1:'Appareil WiFi ne diffusant pas son SSID.',faq_q2:'Est-ce reel?',faq_a2:'Non, simulation.',faq_q3:'Comment detecter?',faq_a3:'Par requetes de sondage et analyse RF.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Cliquez Scanner.',howto_2:'Cherchez les points violets.',howto_3:'Consultez la liste.',howto_4:'Surveillez le journal.',wiki_t1:'Fantomes',wiki_d1:'Appareils caches detectables.',wiki_t2:'Confidentialite',wiki_d2:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Scan demarre',simStopped:'Scan arrete',ghostFound:'Fantome detecte!',deviceFound:'Appareil trouve'},
ar:{title:'كاشف الأشباح — أجهزة WiFi المخفية',subtitle:'البحث عن أجهزة WiFi المخفية',disconnected:'غير متصل',connected:'مسح',mainSection:'كاشف الأشباح',mainDesc:'مسح رادار للأجهزة المخفية',sectionA:'قائمة الأجهزة',sectionC:'كيف يعمل',start:'مسح',stop:'إيقاف',totalDevices:'أجهزة',ghosts:'أشباح',visible:'مرئية',progress:'تقدم',howItWorksText:'كشف الأشباح يحدد أجهزة WiFi التي تخفي وجودها من خلال طلبات الاستقصاء وتحليل الترددات.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو جهاز الشبح؟',faq_a1:'جهاز WiFi لا يبث SSID.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا، محاكاة.',faq_q3:'كيف يتم الكشف؟',faq_a3:'عبر طلبات الاستقصاء.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'انقر مسح.',howto_2:'ابحث عن النقاط البنفسجية.',howto_3:'تحقق من القائمة.',howto_4:'راقب السجل.',wiki_t1:'الأشباح',wiki_d1:'أجهزة مخفية قابلة للكشف.',wiki_t2:'الخصوصية',wiki_d2:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ المسح',simStopped:'توقف المسح',ghostFound:'تم كشف شبح!',deviceFound:'تم العثور على جهاز'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`ghost-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
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

/* ═══════ APP LOGIC — Ghost Detector ═══════ */
const DEVICE_NAMES=['iPhone-12','Galaxy-S21','Laptop-Dell','MacBook-Pro','iPad-Air','Printer-HP','SmartTV-LG','Echo-Dot','Nest-Cam','Ring-Door','PS5','Xbox','Roku','ChromeCast','Sonos-One'];
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
let simRunning=false,simInterval=null,devices=[],scanAngle=0,canvas,ctx;

function initCanvas(){
  canvas=$('radarCanvas');if(!canvas)return;
  ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;
  ctx.scale(2,2);
}

function drawRadar(){
  if(!ctx)return;
  const w=canvas.offsetWidth,h=canvas.offsetHeight;
  const cx=w/2,cy=h/2,r=Math.min(cx,cy)-20;
  ctx.fillStyle='rgba(5,5,16,0.12)';ctx.fillRect(0,0,w,h);
  // rings
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(34,197,94,0.15)';ctx.lineWidth=1;ctx.stroke();}
  // cross
  ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.lineTo(cx+r,cy);ctx.moveTo(cx,cy-r);ctx.lineTo(cx,cy+r);ctx.strokeStyle='rgba(34,197,94,0.1)';ctx.stroke();
  // sweep
  const a=scanAngle*Math.PI/180;
  const grad=ctx.createConicalGradient?null:null;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,a-0.5,a,false);ctx.closePath();
  ctx.fillStyle='rgba(34,197,94,0.25)';ctx.fill();
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.stroke();
  // blips
  devices.forEach(d=>{
    const bx=cx+Math.cos(d.angle)*d.dist*r;
    const by=cy+Math.sin(d.angle)*d.dist*r;
    const color=d.ghost?'#a855f7':'#22c55e';
    const alpha=Math.max(0.2,1-((scanAngle-d.foundAngle+360)%360)/180);
    ctx.beginPath();ctx.arc(bx,by,d.ghost?5:4,0,Math.PI*2);ctx.fillStyle=color;ctx.globalAlpha=alpha;ctx.fill();
    if(d.ghost){ctx.beginPath();ctx.arc(bx,by,8,0,Math.PI*2);ctx.strokeStyle='#a855f7';ctx.lineWidth=1;ctx.globalAlpha=alpha*0.5;ctx.stroke();}
    ctx.globalAlpha=1;
  });
  scanAngle=(scanAngle+2)%360;
  $('scanProgress').textContent=Math.round(scanAngle/3.6)+'%';
}

function addDevice(){
  const ghost=Math.random()<0.3;
  const dev={name:ghost?'<hidden>':DEVICE_NAMES[Math.floor(Math.random()*DEVICE_NAMES.length)],mac:randMAC(),signal:-20-Math.floor(Math.random()*60),ghost,angle:Math.random()*Math.PI*2,dist:0.15+Math.random()*0.8,foundAngle:scanAngle,channel:Math.floor(Math.random()*13)+1};
  devices.push(dev);
  const s=LANG[currentLang];
  if(ghost)log(`${s.ghostFound} ${dev.mac}`,'error');
  else log(`${s.deviceFound}: ${dev.name} (${dev.mac})`,'rx');
  updateDeviceGrid();updateStats();
}

function updateStats(){
  $('totalDevices').textContent=devices.length;
  $('ghostCount').textContent=devices.filter(d=>d.ghost).length;
  $('visibleCount').textContent=devices.filter(d=>!d.ghost).length;
}

function updateDeviceGrid(){
  const grid=$('deviceGrid');if(!grid)return;grid.innerHTML='';
  devices.slice(-30).reverse().forEach(d=>{
    const c=document.createElement('div');c.className='device-card'+(d.ghost?' ghost':'');
    c.innerHTML=`<div class="dev-name">${d.ghost?'&#128123; &lt;hidden&gt;':d.name}</div><div class="dev-mac">${d.mac}</div><div class="dev-info">Ch ${d.channel} | ${d.signal} dBm</div>`;
    grid.appendChild(c);
  });
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  devices=[];scanAngle=0;initCanvas();
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(()=>{if(Math.random()<0.4)addDevice();},800);
  requestAnimationFrame(function loop(){if(!simRunning)return;drawRadar();requestAnimationFrame(loop)});
}
function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}
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
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
