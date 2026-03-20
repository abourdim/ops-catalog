/**
 * Workshop DIY — esp-network-cartographer v1.0
 * Multi-Protocol Radio Landscape Mapper
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

const LANG={
  en:{
    title:'esp-network-cartographer',subtitle:'🗺️ scan · 📡 map · 🌐 discover',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Network Cartographer — Radio Landscape',mainDesc:'Scan WiFi, BLE, ESP-NOW and build a live map',
    sectionA:'How It Works',sectionB:'Signal Analysis',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    scanBtn:'Start Scan',stopBtn:'Stop',clearMapBtn:'Clear Map',totalLabel:'Total',
    avgRSSILabel:'Avg RSSI',strongestLabel:'Strongest',
    labDesc:'Watch how RSSI values affect position and size on the map.',
    howStep1:'ESP32 scans WiFi, BLE, and ESP-NOW protocols simultaneously.',
    howStep2:'Each device is plotted based on RSSI (signal strength = distance).',
    howStep3:'Different protocols shown as different colored circles.',
    howStep4:'The device list shows details: name, MAC, RSSI, protocol.',
    challenge1:'Why do BLE devices appear and disappear frequently?',
    challenge2:'How does RSSI relate to distance?',
    challenge3:'What is ESP-NOW and how is it different from WiFi?',
    challengeReveal1:'BLE devices use advertising intervals and sleep between ads to save battery.',
    challengeReveal2:'RSSI decreases with distance: -30dBm very close, -70dBm medium, -90dBm far. Walls cause additional loss.',
    challengeReveal3:'ESP-NOW is connectionless, sends packets directly between ESP32s without a router. Max 250 bytes, lower latency.',
    revealBtn:'Reveal Answer',
    faq_q1:'What protocols does it scan?',faq_a1:'WiFi (802.11), BLE, and ESP-NOW — all in 2.4GHz.',
    faq_q2:'What does the map show?',faq_a2:'Each circle is a device. Size reflects signal strength. Color indicates protocol.',
    faq_q3:'Is this scanning real devices?',faq_a3:'No. Simulation with fake devices.',
    faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
    howto_1:'Click Start Scan to begin.',howto_2:'Watch devices appear on the map.',
    howto_3:'Check device list for details.',howto_4:'Click Stop to freeze or Clear to reset.',
    wiki_wifi_title:'📶 WiFi',wiki_wifi:'Wireless LAN, beacons, 30-100m range.',
    wiki_ble_title:'📱 BLE',wiki_ble:'Short-range IoT protocol, advertising-based, 10-50m.',
    wiki_espnow_title:'📡 ESP-NOW',wiki_espnow:'Connectionless ESP32 protocol, no router, 250B max.',
    wiki_rssi_title:'📊 RSSI',wiki_rssi:'-30=excellent, -50=good, -70=fair, -90=weak.',
    working:'Working…',scanning:'Scanning radio landscape...',scanStarted:'Scan started!',scanStopped:'Scan stopped.',mapCleared:'Map cleared.',
    devFound:'device discovered',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'🗺️ Network Cartographer ready — start scanning!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
  ,step1Title:'Scan',step1Desc:'ESP32 scans WiFi, BLE, and ESP-NOW protocols simultaneously.',step2Title:'Capture',step2Desc:'Each device is plotted based on RSSI (signal strength = distance).',step3Title:'Analyze',step3Desc:'Different protocols shown as different colored circles.',step4Title:'Report',step4Desc:'The device list shows details: name, MAC, RSSI, protocol.'},
  fr:{
    title:'esp-network-cartographer',subtitle:'🗺️ scanner · 📡 cartographier · 🌐 découvrir',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Cartographe Réseau — Paysage Radio',mainDesc:'Scannez WiFi, BLE, ESP-NOW et construisez une carte',
    sectionA:'Comment ça marche',sectionB:'Analyse Signal',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    scanBtn:'Lancer le scan',stopBtn:'Arrêter',clearMapBtn:'Effacer carte',totalLabel:'Total',
    avgRSSILabel:'RSSI Moy',strongestLabel:'Plus fort',labDesc:'Observez comment le RSSI affecte la carte.',
    howStep1:'L\'ESP32 scanne WiFi, BLE et ESP-NOW simultanément.',howStep2:'Chaque appareil est placé selon son RSSI.',
    howStep3:'Les protocoles ont des couleurs différentes.',howStep4:'La liste montre nom, MAC, RSSI, protocole.',
    challenge1:'Pourquoi les appareils BLE apparaissent et disparaissent ?',challenge2:'Quel lien entre RSSI et distance ?',challenge3:'Qu\'est-ce que ESP-NOW ?',
    challengeReveal1:'BLE utilise des intervalles de publicité et dort entre les annonces.',
    challengeReveal2:'RSSI diminue avec la distance. Les murs causent des pertes supplémentaires.',
    challengeReveal3:'ESP-NOW est sans connexion, envoie directement entre ESP32 sans routeur.',
    revealBtn:'Révéler',
    faq_q1:'Quels protocoles ?',faq_a1:'WiFi, BLE et ESP-NOW en 2.4GHz.',faq_q2:'Que montre la carte ?',faq_a2:'Cercles = appareils. Taille = signal. Couleur = protocole.',faq_q3:'Scan réel ?',faq_a3:'Non, simulation.',faq_q4:'Données privées ?',faq_a4:'Oui, tout est local.',
    howto_1:'Cliquez Lancer le scan.',howto_2:'Regardez les appareils apparaître.',howto_3:'Consultez la liste.',howto_4:'Arrêtez ou effacez.',
    wiki_wifi_title:'📶 WiFi',wiki_wifi:'LAN sans fil, 30-100m.',wiki_ble_title:'📱 BLE',wiki_ble:'IoT courte portée, 10-50m.',wiki_espnow_title:'📡 ESP-NOW',wiki_espnow:'Protocole ESP32, sans routeur.',wiki_rssi_title:'📊 RSSI',wiki_rssi:'-30=excellent, -70=moyen, -90=faible.',
    working:'En cours…',scanning:'Scan du paysage radio...',scanStarted:'Scan lancé !',scanStopped:'Scan arrêté.',mapCleared:'Carte effacée.',devFound:'appareil découvert',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'🗺️ Cartographe prêt — lancez le scan !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
  ,step1Title:'Scanner',step1Desc:'L\'ESP32 scanne WiFi, BLE et ESP-NOW simultanément.',step2Title:'Capturer',step2Desc:'Chaque appareil est placé selon son RSSI.',step3Title:'Analyser',step3Desc:'Les protocoles ont des couleurs différentes.',step4Title:'Rapporter',step4Desc:'La liste montre nom, MAC, RSSI, protocole.'},
  ar:{
    title:'esp-network-cartographer',subtitle:'🗺️ مسح · 📡 خريطة · 🌐 اكتشاف',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'رسام خرائط الشبكة — المشهد الراديوي',mainDesc:'امسح WiFi وBLE وESP-NOW وابنِ خريطة حية',
    sectionA:'كيف يعمل',sectionB:'تحليل الإشارة',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    scanBtn:'بدء المسح',stopBtn:'إيقاف',clearMapBtn:'مسح الخريطة',totalLabel:'المجموع',
    avgRSSILabel:'متوسط RSSI',strongestLabel:'الأقوى',labDesc:'راقب كيف يؤثر RSSI على الخريطة.',
    howStep1:'ESP32 يمسح WiFi وBLE وESP-NOW في آن واحد.',howStep2:'كل جهاز يُوضع حسب RSSI.',
    howStep3:'البروتوكولات المختلفة بألوان مختلفة.',howStep4:'قائمة الأجهزة تعرض التفاصيل.',
    challenge1:'لماذا تظهر أجهزة BLE وتختفي؟',challenge2:'ما علاقة RSSI بالمسافة؟',challenge3:'ما هو ESP-NOW؟',
    challengeReveal1:'BLE تستخدم فترات إعلان وتنام بينها لتوفير البطارية.',
    challengeReveal2:'RSSI ينخفض مع المسافة. الجدران تسبب خسائر إضافية.',
    challengeReveal3:'ESP-NOW بدون اتصال، يرسل مباشرة بين ESP32 بدون راوتر.',
    revealBtn:'اكشف الإجابة',
    faq_q1:'ما البروتوكولات الممسوحة؟',faq_a1:'WiFi وBLE وESP-NOW في 2.4GHz.',faq_q2:'ماذا تُظهر الخريطة؟',faq_a2:'دوائر = أجهزة. الحجم = قوة الإشارة.',faq_q3:'مسح حقيقي؟',faq_a3:'لا، محاكاة.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم، كل شيء محلي.',
    howto_1:'انقر بدء المسح.',howto_2:'راقب ظهور الأجهزة.',howto_3:'راجع القائمة.',howto_4:'أوقف أو امسح.',
    wiki_wifi_title:'📶 WiFi',wiki_wifi:'شبكة لاسلكية، 30-100 متر.',wiki_ble_title:'📱 BLE',wiki_ble:'بروتوكول IoT قصير المدى.',wiki_espnow_title:'📡 ESP-NOW',wiki_espnow:'بروتوكول ESP32 بدون راوتر.',wiki_rssi_title:'📊 RSSI',wiki_rssi:'-30=ممتاز، -70=متوسط، -90=ضعيف.',
    working:'جارٍ…',scanning:'مسح المشهد الراديوي...',scanStarted:'بدأ المسح!',scanStopped:'توقف المسح.',mapCleared:'تم مسح الخريطة.',devFound:'جهاز مكتشف',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'🗺️ رسام خرائط الشبكة جاهز — ابدأ المسح!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
  ,step1Title:'مسح',step1Desc:'ESP32 يمسح WiFi وBLE وESP-NOW في آن واحد.',step2Title:'التقاط',step2Desc:'كل جهاز يُوضع حسب RSSI.',step3Title:'تحليل',step3Desc:'البروتوكولات المختلفة بألوان مختلفة.',step4Title:'تقرير',step4Desc:'قائمة الأجهزة تعرض التفاصيل.'}
};

/* ═══════ FRAMEWORK (compact) ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلت';function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#0f0';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoCC=0,logoCT=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoCC++;if(logoCT)clearTimeout(logoCT);if(logoCC>=3){logoCC=0;toggleMatrix();}else logoCT=setTimeout(()=>logoCC=0,500);});}
function initDebug(){if(!new URLSearchParams(location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}
const TM={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const ns=TM[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWO=false;function openSettings(){const l=$('logPanel');logWO=l&&l.classList.contains('open');if(logWO)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWO){openLog();logWO=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');});});}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  if($('whisperBtn'))$('whisperBtn').onclick=()=>log('🎤 Whisper toggled','info');
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};if(db)db.onclick=incrementDhikr;
  if($('musicBtn'))$('musicBtn').onclick=()=>log('🎵 Music toggled','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  onAppMessage(msg=>log(`📨 ${msg.from}: ${msg.type}`,'rx'));
  initKonami();initMatrixTrigger();initDebug();initHijriDate();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   NETWORK CARTOGRAPHER SIMULATION
   ═══════════════════════════════════════════════════════════════ */
function revealChallenge(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');playSound('click');}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':');}

const PROTO_COLORS={WiFi:'#3498db',BLE:'#2ecc71','ESP-NOW':'#f39c12'};
const WIFI_NAMES=['HomeNet','CoffeeWiFi','Office-5G','IoT-Gateway','Guest-AP','Printer-WiFi','SmartTV','Doorbell-AP'];
const BLE_NAMES=['FitBand-42','AirPods-Pro','Mi-Band','Tile-Tracker','SmartLock','Beacon-01','Heart-Monitor','ESP32-BLE'];
const ESPNOW_NAMES=['Sensor-Node-A','Relay-Hub','Weather-Station','Door-Sensor','Light-Ctrl','Motor-ESP','Cam-ESP','Alarm-Node'];

let devices=[];
let scanRunning=false;
let scanInterval=null;
let mapAnimId=null;

function genDevice(){
  const types=['WiFi','BLE','ESP-NOW'];
  const type=types[Math.floor(Math.random()*types.length)];
  const names=type==='WiFi'?WIFI_NAMES:type==='BLE'?BLE_NAMES:ESPNOW_NAMES;
  const rssi=-30-Math.floor(Math.random()*60);
  return{
    type,name:names[Math.floor(Math.random()*names.length)]+'-'+Math.floor(Math.random()*100),
    mac:randMAC(),rssi,
    // Map position based on RSSI: stronger=closer to center
    x:0,y:0,targetX:0,targetY:0,
    radius:Math.max(4,((rssi+100)/70)*15),
    color:PROTO_COLORS[type],
    age:0,alpha:1
  };
}

function placeDevice(dev,canvas){
  const cx=canvas.width/2,cy=canvas.height/2;
  const dist=((Math.abs(dev.rssi)-20)/80)*Math.min(cx,cy)*0.85;
  const angle=Math.random()*Math.PI*2;
  dev.targetX=cx+Math.cos(angle)*dist;
  dev.targetY=cy+Math.sin(angle)*dist;
  dev.x=dev.targetX;dev.y=dev.targetY;
}

function drawMap(){
  const canvas=$('mapCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth||500;
  const W=canvas.width,H=canvas.height,cx=W/2,cy=H/2;
  ctx.clearRect(0,0,W,H);

  // Range rings
  ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
  for(let r=1;r<=3;r++){ctx.beginPath();ctx.arc(cx,cy,r*(Math.min(cx,cy)/3.5),0,Math.PI*2);ctx.stroke();}
  // Center cross
  ctx.strokeStyle='rgba(255,255,255,0.08)';
  ctx.beginPath();ctx.moveTo(cx-10,cy);ctx.lineTo(cx+10,cy);ctx.moveTo(cx,cy-10);ctx.lineTo(cx,cy+10);ctx.stroke();
  // Label
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('ESP32',cx,cy+20);

  // Draw devices
  for(const dev of devices){
    dev.x+=(dev.targetX-dev.x)*0.05;
    dev.y+=(dev.targetY-dev.y)*0.05;
    // Pulse animation
    const pulse=1+Math.sin(Date.now()/500+dev.x)*0.1;
    ctx.globalAlpha=dev.alpha;
    // Glow
    ctx.beginPath();ctx.arc(dev.x,dev.y,dev.radius*2*pulse,0,Math.PI*2);
    ctx.fillStyle=dev.color.replace(')',',0.1)').replace('rgb','rgba');ctx.fill();
    // Main circle
    ctx.beginPath();ctx.arc(dev.x,dev.y,dev.radius*pulse,0,Math.PI*2);
    ctx.fillStyle=dev.color;ctx.fill();
    // Label
    ctx.fillStyle='#fff';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(dev.name.slice(0,10),dev.x,dev.y+dev.radius+10);
  }
  ctx.globalAlpha=1;
  mapAnimId=requestAnimationFrame(drawMap);
}

function updateDeviceList(){
  const list=$('deviceList');if(!list)return;
  list.innerHTML='';
  const sorted=[...devices].sort((a,b)=>b.rssi-a.rssi);
  for(const d of sorted.slice(0,20)){
    const div=document.createElement('div');div.className='device-item';
    const tag=d.type==='WiFi'?'wifi-tag':d.type==='BLE'?'ble-tag':'espnow-tag';
    div.innerHTML=`<div><strong>${d.name}</strong><br><span style="font-size:.6rem;color:var(--text-muted)">${d.mac}</span></div><div style="text-align:right"><span class="dev-type ${tag}">${d.type}</span><br><span style="font-size:.65rem">${d.rssi} dBm</span></div>`;
    list.appendChild(div);
  }
}

function updateStats(){
  const wc=devices.filter(d=>d.type==='WiFi').length;
  const bc=devices.filter(d=>d.type==='BLE').length;
  const ec=devices.filter(d=>d.type==='ESP-NOW').length;
  if($('wifiCount'))$('wifiCount').textContent=wc;
  if($('bleCount'))$('bleCount').textContent=bc;
  if($('espnowCount'))$('espnowCount').textContent=ec;
  if($('totalDevices'))$('totalDevices').textContent=devices.length;
  if(devices.length>0){
    const avg=devices.reduce((s,d)=>s+d.rssi,0)/devices.length;
    if($('avgRSSI'))$('avgRSSI').textContent=avg.toFixed(0)+' dBm';
    const strongest=devices.reduce((a,b)=>a.rssi>b.rssi?a:b);
    if($('strongestDev'))$('strongestDev').textContent=strongest.name.slice(0,12);
  }
}

function startScan(){
  if(scanRunning)return;
  scanRunning=true;
  const s=LANG[currentLang];
  setStatus(true);log(s.scanStarted,'success');
  const canvas=$('mapCanvas');

  scanInterval=setInterval(()=>{
    if(devices.length<30&&Math.random()>0.3){
      const dev=genDevice();
      if(canvas)placeDevice(dev,canvas);
      devices.push(dev);
      log(`📡 ${dev.type}: ${dev.name} (${dev.rssi} dBm) — ${s.devFound}`,'rx');
    }
    // BLE devices flicker
    devices.forEach(d=>{if(d.type==='BLE'&&Math.random()>0.9)d.alpha=d.alpha>0.5?0.2:1;});
    updateDeviceList();updateStats();
  },800+Math.random()*600);

  drawMap();
}

function stopScan(){
  if(!scanRunning)return;
  scanRunning=false;
  if(scanInterval){clearInterval(scanInterval);scanInterval=null;}
  if(mapAnimId){cancelAnimationFrame(mapAnimId);mapAnimId=null;}
  setStatus(false);log(LANG[currentLang].scanStopped,'info');
}

function clearMap(){
  devices=[];
  const canvas=$('mapCanvas');if(canvas){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);}
  updateDeviceList();updateStats();
  if($('avgRSSI'))$('avgRSSI').textContent='—';
  if($('strongestDev'))$('strongestDev').textContent='—';
  log(LANG[currentLang].mapCleared,'info');
}

function initCartographer(){
  if($('scanBtn'))$('scanBtn').addEventListener('click',startScan);
  if($('stopBtn'))$('stopBtn').addEventListener('click',stopScan);
  if($('clearBtn'))$('clearBtn').addEventListener('click',clearMap);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initCartographer);}else{setTimeout(initCartographer,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Network Cartographer: Multi-protocol
   radio landscape mapper with live RSSI-based positioning
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const devs=[],scanRings=[];
  const PROTOS=[{name:'WiFi',color:'#4d96ff',icon:'\u{1F4E1}'},{name:'BLE',color:'#ff78ae',icon:'\u{1F499}'},{name:'ESP-NOW',color:'#ffd93d',icon:'\u26A1'},{name:'Zigbee',color:'#6bcb77',icon:'\u{1F517}'}];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#080818;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  function drawGrid(){
    ctx.strokeStyle='rgba(100,100,255,0.06)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  const scanner={x:0,y:0,angle:0};
  function drawScanner(){
    scanner.x=W/2;scanner.y=H/2;scanner.angle+=0.02;
    ctx.save();ctx.translate(scanner.x,scanner.y);ctx.rotate(scanner.angle);
    const g=ctx.createLinearGradient(0,0,160,0);g.addColorStop(0,'rgba(0,200,255,0.3)');g.addColorStop(1,'rgba(0,200,255,0)');
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,160,-0.15,0.15);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.restore();
    ctx.beginPath();ctx.arc(scanner.x,scanner.y,12,0,Math.PI*2);ctx.fillStyle='#0cf';ctx.fill();
    ctx.beginPath();ctx.arc(scanner.x,scanner.y,18,0,Math.PI*2);ctx.strokeStyle='rgba(0,204,255,0.4)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText('SCANNER',scanner.x,scanner.y+28);
  }

  function drawRangeRings(){
    [60,110,160].forEach((r,i)=>{ctx.beginPath();ctx.arc(W/2,H/2,r,0,Math.PI*2);ctx.strokeStyle='rgba(0,204,255,'+(0.1-i*0.02)+')';ctx.lineWidth=1;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);});
  }

  class Device{
    constructor(){
      const p=PROTOS[Math.floor(Math.random()*PROTOS.length)];this.protocol=p;
      this.rssi=-30-Math.random()*60;const dist=Math.abs(this.rssi)*1.8,a=Math.random()*Math.PI*2;
      this.tx=W/2+Math.cos(a)*dist;this.ty=H/2+Math.sin(a)*dist;this.x=W/2;this.y=H/2;
      this.size=Math.max(4,14+this.rssi*0.1);
      this.mac=Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':').toUpperCase();
      this.alive=300+Math.random()*500;this.age=0;this.blinkPhase=Math.random()*Math.PI*2;
    }
    update(){this.x+=(this.tx-this.x)*0.04;this.y+=(this.ty-this.y)*0.04;this.age++;this.blinkPhase+=0.05;return this.age<this.alive;}
    draw(){
      const b=0.6+Math.sin(this.blinkPhase)*0.3;ctx.save();ctx.globalAlpha=b*Math.min(1,(this.alive-this.age)/60);
      ctx.shadowColor=this.protocol.color;ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=this.protocol.color+'44';ctx.fill();
      ctx.strokeStyle=this.protocol.color;ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;
      ctx.font=(this.size*0.9)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.protocol.icon,this.x,this.y);
      ctx.font='7px monospace';ctx.fillStyle=this.protocol.color;ctx.fillText(this.mac.slice(0,8),this.x,this.y-this.size-4);
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText(Math.round(this.rssi)+' dBm',this.x,this.y+this.size+8);ctx.restore();
    }
  }

  class ScanRing{
    constructor(){this.r=10;this.maxR=180;this.alpha=0.5;}
    update(){this.r+=1.2;this.alpha=0.5*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(W/2,H/2,this.r,0,Math.PI*2);ctx.strokeStyle='rgba(0,204,255,'+this.alpha+')';ctx.lineWidth=2;ctx.stroke();}
  }

  function drawLinks(){
    for(let i=0;i<devs.length;i++)for(let j=i+1;j<devs.length;j++){
      if(devs[i].protocol.name!==devs[j].protocol.name)continue;
      const dx=devs[i].x-devs[j].x,dy=devs[i].y-devs[j].y;
      if(Math.sqrt(dx*dx+dy*dy)<80){ctx.beginPath();ctx.moveTo(devs[i].x,devs[i].y);ctx.lineTo(devs[j].x,devs[j].y);ctx.strokeStyle=devs[i].protocol.color+'22';ctx.lineWidth=1;ctx.stroke();}
    }
  }

  function drawHUD(){
    const counts={};PROTOS.forEach(p=>counts[p.name]=0);devs.forEach(d=>counts[d.protocol.name]++);
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,200,80);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,200,80);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='left';ctx.fillText('NETWORK CARTOGRAPHER',16,24);
    ctx.fillStyle='#aaa';ctx.fillText('Total Devices: '+devs.length,16,40);let yy=52;
    PROTOS.forEach(p=>{ctx.fillStyle=p.color;ctx.fillText(p.icon+' '+p.name+': '+counts[p.name],16,yy);yy+=12;});ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,24,0.18)';ctx.fillRect(0,0,W,H);
    drawGrid();drawRangeRings();
    if(frameCount%90===0)scanRings.push(new ScanRing());
    for(let i=scanRings.length-1;i>=0;i--){if(!scanRings[i].update())scanRings.splice(i,1);else scanRings[i].draw();}
    drawScanner();drawLinks();
    for(let i=devs.length-1;i>=0;i--){if(!devs[i].update())devs.splice(i,1);else devs[i].draw();}
    if(frameCount%30===0&&devs.length<20)devs.push(new Device());
    drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,200);
})();
