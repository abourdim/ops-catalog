/**
 * Deauth Detector — Wireless IDS
 * Alert dashboard, counter, timeline
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';

let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG={
en:{title:'Deauth Detector — Wireless IDS',subtitle:'Wireless intrusion detection system',disconnected:'Offline',connected:'Monitoring',mainSection:'Deauth Monitor',mainDesc:'Real-time deauthentication attack detection',sectionA:'Attack Timeline',sectionB:'Targeted Devices',sectionC:'How It Works',start:'Monitor',stop:'Stop',totalFrames:'Total Frames',deauthFrames:'Deauth Frames',disassocFrames:'Disassoc',attacksPerMin:'Attacks/min',targets:'Targets',colMAC:'Target MAC',colAttacker:'Attacker',colDeauths:'Deauths',colLast:'Last Seen',howItWorksText:'Deauthentication attacks exploit the unprotected nature of 802.11 management frames. An attacker sends forged deauth frames to disconnect clients from their AP, enabling man-in-the-middle attacks, evil twin setups, or denial of service. A wireless IDS monitors for abnormal deauth/disassociation frame rates and patterns to detect these attacks in real-time. Protected Management Frames (PMF/802.11w) can mitigate this but is not universally deployed.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is a deauth attack?',faq_a1:'Forged deauthentication frames that disconnect WiFi clients.',faq_q2:'Is this monitoring real WiFi?',faq_a2:'No, this is a simulation.',faq_q3:'How to prevent deauth attacks?',faq_a3:'Enable PMF (802.11w) on your AP and clients.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click Monitor to start the IDS simulation.',howto_2:'Watch for alert banners when attacks are detected.',howto_3:'Check the Attack Timeline for event history.',howto_4:'View Targeted Devices to see attacked clients.',wiki_deauth_title:'Deauth Frames',wiki_deauth:'Management frames that terminate a client association.',wiki_ids_title:'Wireless IDS',wiki_ids:'Monitors for anomalous patterns indicating attacks.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Deauth Detector ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'IDS monitoring started',simStopped:'IDS monitoring stopped',alertWarning:'WARNING: Elevated deauth frame rate detected!',alertCritical:'CRITICAL: Active deauthentication attack in progress!',normalTraffic:'Normal management frame'},
fr:{title:'Detecteur Deauth — IDS Sans Fil',subtitle:'Systeme de detection d\'intrusion sans fil',disconnected:'Hors ligne',connected:'Surveillance',mainSection:'Moniteur Deauth',mainDesc:'Detection d\'attaques de desauthentification en temps reel',sectionA:'Chronologie des Attaques',sectionB:'Appareils Cibles',sectionC:'Comment ca marche',start:'Surveiller',stop:'Arreter',totalFrames:'Trames Totales',deauthFrames:'Trames Deauth',disassocFrames:'Disassoc',attacksPerMin:'Attaques/min',targets:'Cibles',colMAC:'MAC Cible',colAttacker:'Attaquant',colDeauths:'Deauths',colLast:'Dernier',howItWorksText:'Les attaques de desauthentification exploitent les trames de gestion non protegees du 802.11. Un attaquant envoie des trames deauth forgees pour deconnecter les clients. Un IDS sans fil surveille les taux anormaux de trames deauth.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce qu\'une attaque deauth?',faq_a1:'Des trames forgees qui deconnectent les clients.',faq_q2:'Surveillance reelle?',faq_a2:'Non, c\'est une simulation.',faq_q3:'Comment se proteger?',faq_a3:'Activer PMF (802.11w).',faq_q4:'Donnees privees?',faq_a4:'Oui, tout est local.',howto_1:'Cliquez Surveiller.',howto_2:'Observez les alertes.',howto_3:'Consultez la chronologie.',howto_4:'Voyez les cibles.',wiki_deauth_title:'Trames Deauth',wiki_deauth:'Terminent l\'association d\'un client.',wiki_ids_title:'IDS Sans Fil',wiki_ids:'Surveille les anomalies.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Surveillance demarree',simStopped:'Surveillance arretee',alertWarning:'ATTENTION: Taux de deauth eleve!',alertCritical:'CRITIQUE: Attaque deauth en cours!',normalTraffic:'Trame de gestion normale'},
ar:{title:'كاشف إلغاء المصادقة — نظام كشف التسلل',subtitle:'نظام كشف التسلل اللاسلكي',disconnected:'غير متصل',connected:'مراقبة',mainSection:'مراقب إلغاء المصادقة',mainDesc:'كشف هجمات إلغاء المصادقة في الوقت الحقيقي',sectionA:'الجدول الزمني للهجمات',sectionB:'الأجهزة المستهدفة',sectionC:'كيف يعمل',start:'مراقبة',stop:'إيقاف',totalFrames:'إجمالي الإطارات',deauthFrames:'إطارات Deauth',disassocFrames:'Disassoc',attacksPerMin:'هجمات/دقيقة',targets:'أهداف',colMAC:'MAC الهدف',colAttacker:'المهاجم',colDeauths:'إلغاءات',colLast:'آخر ظهور',howItWorksText:'تستغل هجمات إلغاء المصادقة الطبيعة غير المحمية لإطارات إدارة 802.11. يرسل المهاجم إطارات مزورة لفصل العملاء. نظام كشف التسلل يراقب الأنماط غير الطبيعية.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو هجوم إلغاء المصادقة؟',faq_a1:'إطارات مزورة تفصل عملاء WiFi.',faq_q2:'هل هذه مراقبة حقيقية؟',faq_a2:'لا، هذه محاكاة.',faq_q3:'كيف تمنع الهجمات؟',faq_a3:'فعّل PMF (802.11w).',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'انقر مراقبة.',howto_2:'راقب تنبيهات الهجوم.',howto_3:'تحقق من الجدول الزمني.',howto_4:'شاهد الأجهزة المستهدفة.',wiki_deauth_title:'إطارات Deauth',wiki_deauth:'تنهي اتصال العميل.',wiki_ids_title:'نظام كشف التسلل',wiki_ids:'يراقب الأنماط الشاذة.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'كاشف Deauth جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأت المراقبة',simStopped:'توقفت المراقبة',alertWarning:'تحذير: معدل deauth مرتفع!',alertCritical:'حرج: هجوم deauth نشط!',normalTraffic:'إطار إدارة عادي'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const lines=Array.from(logContainer.children).map(d=>d.textContent);const blob=new Blob([lines.join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`deauth-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url)}

function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;handle.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;handle.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Deauth Detector ═══════ */
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
const ATTACKER_MACS=[randMAC(),randMAC(),randMAC()];
const TARGET_MACS=Array.from({length:8},()=>randMAC());
const FRAME_TYPES=['deauth','disassoc','normal','normal','normal'];

let simRunning=false,simInterval=null,totalFrames=0,deauthCount=0,disassocCount=0,startTime=0;
let targets=new Map();
let events=[];

function genFrame(){
  const type=FRAME_TYPES[Math.floor(Math.random()*FRAME_TYPES.length)];
  const isAttack=type==='deauth'||type==='disassoc';
  // Simulate bursts — higher probability during "attack"
  if(Math.random()<0.3&&deauthCount>5)return{type:'deauth',src:ATTACKER_MACS[0],dst:TARGET_MACS[Math.floor(Math.random()*TARGET_MACS.length)]};
  if(isAttack){
    return{type,src:ATTACKER_MACS[Math.floor(Math.random()*ATTACKER_MACS.length)],dst:TARGET_MACS[Math.floor(Math.random()*TARGET_MACS.length)]};
  }
  return{type:'normal',src:randMAC(),dst:'ff:ff:ff:ff:ff:ff'};
}

function processFrame(frame){
  totalFrames++;
  const time=new Date().toLocaleTimeString();
  if(frame.type==='deauth'){
    deauthCount++;
    if(!targets.has(frame.dst))targets.set(frame.dst,{attacker:frame.src,count:0,last:''});
    const t=targets.get(frame.dst);t.count++;t.last=time;t.attacker=frame.src;
    events.unshift({time,type:'deauth',src:frame.src,dst:frame.dst});
    log(`DEAUTH: ${frame.src} → ${frame.dst}`,'error');
  }else if(frame.type==='disassoc'){
    disassocCount++;
    events.unshift({time,type:'disassoc',src:frame.src,dst:frame.dst});
    log(`DISASSOC: ${frame.src} → ${frame.dst}`,'error');
  }else{
    if(events.length<200)events.unshift({time,type:'normal',src:frame.src,dst:frame.dst});
  }
  if(events.length>200)events.length=200;
}

function updateUI(){
  $('totalFrames').textContent=totalFrames;
  $('deauthCount').textContent=deauthCount;
  $('disassocCount').textContent=disassocCount;
  const elapsed=(Date.now()-startTime)/60000;
  $('attackRate').textContent=elapsed>0?((deauthCount+disassocCount)/elapsed).toFixed(1):'0';
  $('targetCount').textContent=targets.size;

  // Alert banner
  const banner=$('alertBanner'),alertText=$('alertText'),alertIcon=$('alertIcon');
  const rate=elapsed>0?(deauthCount+disassocCount)/elapsed:0;
  const s=LANG[currentLang];
  if(rate>30){banner.className='alert-banner critical';alertIcon.textContent='🚨';alertText.textContent=s.alertCritical}
  else if(rate>10){banner.className='alert-banner warning';alertIcon.textContent='⚠️';alertText.textContent=s.alertWarning}
  else{banner.className='alert-banner';banner.style.display='none'}

  // Timeline
  const tl=$('timelineList');
  if(tl){
    tl.innerHTML='';
    events.slice(0,50).forEach(e=>{
      const row=document.createElement('div');
      row.className='tl-entry'+(e.type!=='normal'?' attack':'');
      row.innerHTML=`<span class="tl-time">${e.time}</span><span class="tl-type ${e.type}">${e.type.toUpperCase()}</span><span>${e.src} → ${e.dst}</span>`;
      tl.appendChild(row);
    });
  }

  // Target table
  const tbody=$('targetBody');
  if(tbody){
    tbody.innerHTML='';
    targets.forEach((data,mac)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td style="font-family:monospace;font-size:.7rem">${mac}</td><td style="font-family:monospace;font-size:.7rem">${data.attacker}</td><td style="color:#ef4444;font-weight:700">${data.count}</td><td>${data.last}</td>`;
      tbody.appendChild(tr);
    });
  }
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  totalFrames=0;deauthCount=0;disassocCount=0;startTime=Date.now();
  targets.clear();events=[];
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(()=>{
    const burst=1+Math.floor(Math.random()*4);
    for(let i=0;i<burst;i++)processFrame(genFrame());
    updateUI();
  },400);
}

function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  const banner=$('alertBanner');if(banner)banner.className='alert-banner';
  log(LANG[currentLang].simStopped,'info');updateUI();
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
