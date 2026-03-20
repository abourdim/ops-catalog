/**
 * Beacon Flood — AP Visualizer
 * AP list, channel chart, hidden networks
 * Workshop DIY — Template v1.2 + App Logic
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG={
en:{title:'Beacon Flood — AP Visualizer',subtitle:'Hundreds of fake APs flooding the airwaves',disconnected:'Disconnected',connected:'Flooding',mainSection:'Beacon Flood',mainDesc:'Fake APs spawning across all channels',sectionA:'Channel Distribution',sectionB:'Hidden Networks',sectionC:'How It Works',start:'Start',stop:'Stop',totalAPs:'Total APs',hiddenNets:'Hidden',beaconsPerSec:'Beacons/s',channels:'Channels',howItWorksText:'A beacon flood attack creates hundreds of fake access points by broadcasting forged beacon frames on multiple channels. This overwhelms WiFi scanners and confuses users trying to find legitimate networks. Some fake APs use hidden SSIDs. This simulation shows how quickly the airwaves can be polluted, making it nearly impossible to distinguish real APs from fake ones.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is a beacon flood?',faq_a1:'An attack that creates hundreds of fake APs by broadcasting forged beacon frames.',faq_q2:'Is this real?',faq_a2:'No, this is a simulation.',faq_q3:'What are hidden networks?',faq_a3:'APs that don\'t broadcast their SSID in beacon frames.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click Start to begin the beacon flood.',howto_2:'Watch fake APs appear rapidly.',howto_3:'Check Channel Distribution.',howto_4:'View Hidden Networks.',wiki_beacon_title:'Beacons',wiki_beacon:'Beacon frames announce AP presence every ~100ms.',wiki_flood_title:'Flood Attack',wiki_flood:'Creates hundreds of fake entries.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Beacon Flood ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Beacon flood started',simStopped:'Beacon flood stopped',newAP:'New fake AP',hiddenAP:'Hidden AP detected',step1Title:'Scan Airwaves',step1Desc:'WiFi adapter scans all channels to discover nearby access points and clients.',step2Title:'Identify Targets',step2Desc:'Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.',step3Title:'Analyze Traffic',step3Desc:'Captured frames are decoded to reveal communication patterns and vulnerabilities.',step4Title:'Detect Threats',step4Desc:'Security analysis identifies rogue APs, weak encryption, and suspicious activity.',sectionCode:'Device Code'},
fr:{title:'Beacon Flood — Visualiseur AP',subtitle:'Des centaines de faux AP inondent les ondes',disconnected:'Deconnecte',connected:'Inondation',mainSection:'Inondation de Balises',mainDesc:'Faux AP sur tous les canaux',sectionA:'Distribution des Canaux',sectionB:'Reseaux Caches',sectionC:'Comment ca marche',start:'Demarrer',stop:'Arreter',totalAPs:'Total AP',hiddenNets:'Caches',beaconsPerSec:'Balises/s',channels:'Canaux',howItWorksText:'Une attaque par inondation de balises cree des centaines de faux points d\'acces en diffusant des trames de balises forgees sur plusieurs canaux. Cela submerge les scanners WiFi.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce qu\'une inondation de balises?',faq_a1:'Une attaque creant des centaines de faux AP.',faq_q2:'Est-ce reel?',faq_a2:'Non, c\'est une simulation.',faq_q3:'Que sont les reseaux caches?',faq_a3:'Des AP qui ne diffusent pas leur SSID.',faq_q4:'Donnees privees?',faq_a4:'Oui. Tout est local.',howto_1:'Cliquez Demarrer.',howto_2:'Observez les faux AP.',howto_3:'Verifiez les canaux.',howto_4:'Voyez les reseaux caches.',wiki_beacon_title:'Balises',wiki_beacon:'Trames de balises diffusees toutes les ~100ms.',wiki_flood_title:'Attaque',wiki_flood:'Cree des centaines de faux AP.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Inondation demarree',simStopped:'Inondation arretee',newAP:'Nouveau faux AP',hiddenAP:'AP cache detecte',step1Title:'Scanner les ondes',step1Desc:'L\'adaptateur WiFi scanne tous les canaux pour découvrir les points d\'accès.',step2Title:'Identifier les cibles',step2Desc:'Les appareils détectés sont identifiés par MAC, SSID et puissance du signal.',step3Title:'Analyser le trafic',step3Desc:'Les trames capturées sont décodées pour révéler les schémas de communication.',step4Title:'Détecter les menaces',step4Desc:'L\'analyse de sécurité identifie les AP pirates et les faiblesses.',sectionCode:'Code Appareil'},
ar:{title:'فيضان الإشارات — عارض نقاط الوصول',subtitle:'مئات نقاط الوصول المزيفة تغمر الموجات',disconnected:'غير متصل',connected:'إغراق',mainSection:'فيضان الإشارات',mainDesc:'نقاط وصول مزيفة على جميع القنوات',sectionA:'توزيع القنوات',sectionB:'الشبكات المخفية',sectionC:'كيف يعمل',start:'بدء',stop:'إيقاف',totalAPs:'إجمالي AP',hiddenNets:'مخفية',beaconsPerSec:'إشارات/ث',channels:'قنوات',howItWorksText:'هجوم فيضان الإشارات ينشئ مئات نقاط الوصول المزيفة عبر بث إطارات إشارة مزورة على قنوات متعددة. هذا يغمر ماسحات WiFi ويربك المستخدمين.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو فيضان الإشارات؟',faq_a1:'هجوم ينشئ مئات نقاط الوصول المزيفة.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا، هذه محاكاة.',faq_q3:'ما هي الشبكات المخفية؟',faq_a3:'نقاط وصول لا تبث اسم SSID.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'انقر بدء.',howto_2:'شاهد نقاط الوصول المزيفة.',howto_3:'تحقق من توزيع القنوات.',howto_4:'شاهد الشبكات المخفية.',wiki_beacon_title:'الإشارات',wiki_beacon:'إطارات تبث كل ~100 مللي ثانية.',wiki_flood_title:'هجوم الفيضان',wiki_flood:'ينشئ مئات الإدخالات المزيفة.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'فيضان الإشارات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ فيضان الإشارات',simStopped:'توقف الفيضان',newAP:'نقطة وصول مزيفة جديدة',hiddenAP:'نقطة وصول مخفية',step1Title:'مسح الموجات',step1Desc:'يفحص محول WiFi جميع القنوات لاكتشاف نقاط الوصول القريبة.',step2Title:'تحديد الأهداف',step2Desc:'يتم تحديد الأجهزة المكتشفة بواسطة MAC و SSID وقوة الإشارة.',step3Title:'تحليل حركة البيانات',step3Desc:'يتم فك تشفير الإطارات الملتقطة لكشف أنماط الاتصال.',step4Title:'كشف التهديدات',step4Desc:'يحدد التحليل الأمني نقاط الوصول المزيفة ونقاط الضعف.',sectionCode:'كود الجهاز'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info')}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const lines=Array.from(logContainer.children).map(d=>d.textContent);const blob=new Blob([lines.join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`beacon-flood-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url)}

function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c)}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}

function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}
function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;handle.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;handle.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Beacon Flood ═══════ */
const FAKE_SSIDS=['Free_WiFi','xfinitywifi','ATT-WiFi','Starbucks','GoogleGuest','FBI_Van_12','DefinitelyNotAVirus','WiFi_Password_Is_1234','GetYourOwnWiFi','PrettyFly4AWifi','DropItLikeItsHotspot','TellMyWiFiLoveHer','ThePromisedLAN','RouterIHardlyKnowHer','BillWiTheScienceFi','WuTangLAN','NachoWiFi','SilenceOfTheLANs','LANDownUnder','99ProblemsButWiFiAint1','HackMeIfYouCan','NotTheNSA','YourMusicIsTooLoud','ShutYourDogUp','LoadingPleaseWait','ConnectingToDarkWeb','PasswordIsTaco','ICanSeeYou','FreeVirusHere','ComeToTheDarkSide'];
const ENCRYPTIONS=['WPA2','WPA3','WEP','Open','WPA2-Enterprise'];
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}

let simRunning=false,simInterval=null,aps=[],beaconCount=0,startTime=0;

function addFakeAP(){
  const hidden=Math.random()<0.15;
  const ap={
    ssid:hidden?'<hidden>':FAKE_SSIDS[Math.floor(Math.random()*FAKE_SSIDS.length)],
    mac:randMAC(),
    channel:Math.floor(Math.random()*13)+1,
    signal:-20-Math.floor(Math.random()*70),
    encryption:ENCRYPTIONS[Math.floor(Math.random()*ENCRYPTIONS.length)],
    hidden,
    beacons:1
  };
  aps.push(ap);
  beaconCount++;
  const s=LANG[currentLang];
  if(hidden)log(`${s.hiddenAP}: ${ap.mac} ch${ap.channel}`,'error');
  else log(`${s.newAP}: ${ap.ssid} (${ap.mac}) ch${ap.channel}`,'rx');
  return ap;
}

function updateUI(){
  const grid=$('apGrid');
  if(grid){
    grid.innerHTML='';
    aps.slice(-60).forEach(ap=>{
      const card=document.createElement('div');
      card.className='ap-card'+(ap.hidden?' hidden-net':'');
      card.innerHTML=`<div class="ap-ssid">${ap.hidden?'👻 &lt;hidden&gt;':ap.ssid}</div><div class="ap-mac">${ap.mac}</div><div class="ap-info"><span>Ch ${ap.channel}</span><span>${ap.signal} dBm</span><span>${ap.encryption}</span></div>`;
      grid.appendChild(card);
    });
  }
  // Stats
  $('totalAPs').textContent=aps.length;
  $('hiddenCount').textContent=aps.filter(a=>a.hidden).length;
  const elapsed=(Date.now()-startTime)/1000;
  $('beaconRate').textContent=elapsed>0?(beaconCount/elapsed).toFixed(0):'0';
  const usedChannels=new Set(aps.map(a=>a.channel));
  $('channelCount').textContent=usedChannels.size;

  // Channel chart
  const chart=$('channelChart');
  if(chart){
    const counts=Array(14).fill(0);
    aps.forEach(a=>{counts[a.channel]++});
    const max=Math.max(...counts,1);
    chart.innerHTML='';
    for(let ch=1;ch<=13;ch++){
      const bar=document.createElement('div');
      bar.className='channel-bar';
      bar.style.height=Math.max(2,counts[ch]/max*100)+'%';
      bar.innerHTML=`<span class="ch-count">${counts[ch]}</span><span class="ch-label">${ch}</span>`;
      chart.appendChild(bar);
    }
  }

  // Hidden list
  const hl=$('hiddenList');
  if(hl){
    const hiddenAPs=aps.filter(a=>a.hidden);
    if(hiddenAPs.length===0)hl.innerHTML='<em>No hidden networks detected yet.</em>';
    else hl.innerHTML=hiddenAPs.map(a=>`<div style="padding:4px 0;border-bottom:1px solid var(--border)">👻 <span style="font-family:monospace">${a.mac}</span> — Ch ${a.channel} — ${a.signal} dBm — ${a.encryption}</div>`).join('');
  }
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  aps=[];beaconCount=0;startTime=Date.now();
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(()=>{const burst=2+Math.floor(Math.random()*5);for(let i=0;i<burst;i++)addFakeAP();updateUI()},500);
}

function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');updateUI();
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  initLogResize();
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const savedLang=localStorage.getItem('wdiy-lang');const savedTheme=localStorage.getItem('wdiy-theme');if(savedTheme)setTheme(savedTheme);if(savedLang)setLanguage(savedLang)}catch{}
  initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — Beacon Flood Airwave Visualizer ═══════ */
(function beaconFloodCanvas(){
  const CVS_ID='beaconFloodVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');
    card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">📡</span> Airwave Visualizer</div>';
    const c=document.createElement('canvas');
    c.id=CVS_ID;c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);
    wrap.parentNode.insertBefore(card,wrap.nextSibling);
    return c;
  }
  const beacons=[];
  let _raf=null;
  function spawnBeacon(ch,hidden){
    const angle=Math.random()*Math.PI*2;
    beacons.push({x:0.5,y:0.5,vx:Math.cos(angle)*(.003+Math.random()*.004),vy:Math.sin(angle)*(.003+Math.random()*.004),r:0,maxR:.12+Math.random()*.08,life:1,ch:ch||Math.ceil(Math.random()*13),hidden:hidden||false,alpha:1});
    if(beacons.length>120)beacons.splice(0,30);
  }
  function draw(){
    const c=document.getElementById(CVS_ID);
    if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');
    const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.18)';ctx.fillRect(0,0,w,h);
    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
    for(let i=0;i<14;i++){const x=w*0.05+i*(w*0.9/13);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.15)';ctx.textAlign='center';
    for(let i=1;i<=13;i++){ctx.fillText('Ch'+i,w*0.05+(i-1)*(w*0.9/12),h-4);}
    // Central AP tower
    const cx=w/2,cy=h/2;
    ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='rgba(34,197,94,0.9)';ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);ctx.strokeStyle='rgba(34,197,94,0.3)';ctx.lineWidth=1;ctx.stroke();
    // Beacons
    beacons.forEach((b,i)=>{
      b.r+=0.002;b.life-=0.008;b.x+=b.vx;b.y+=b.vy;b.alpha=b.life;
      if(b.life<=0){beacons.splice(i,1);return;}
      const bx=b.x*w,by=b.y*h;
      const color=b.hidden?'rgba(168,85,247,':'rgba(34,197,94,';
      // Expanding ring
      ctx.beginPath();ctx.arc(bx,by,b.r*w,0,Math.PI*2);
      ctx.strokeStyle=color+(b.alpha*0.4).toFixed(2)+')';ctx.lineWidth=1.5;ctx.stroke();
      // Core dot
      ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);
      ctx.fillStyle=color+(b.alpha*0.8).toFixed(2)+')';ctx.fill();
      // Channel indicator line
      const chX=w*0.05+(b.ch-1)*(w*0.9/12);
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(chX,h-12);
      ctx.strokeStyle=color+(b.alpha*0.08).toFixed(2)+')';ctx.lineWidth=0.5;ctx.stroke();
    });
    // Spawn when sim is running
    if(typeof simRunning!=='undefined'&&simRunning){
      if(Math.random()<0.4)spawnBeacon(Math.ceil(Math.random()*13),Math.random()<0.15);
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){
    const c=ensureCanvas();if(!c)return setTimeout(boot,500);
    if(!_raf)draw();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();


// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});
