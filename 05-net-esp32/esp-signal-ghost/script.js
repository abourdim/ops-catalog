/**
 * Workshop DIY — esp-signal-ghost v1.0
 * MAC Phantom — Rapid MAC Address Cycling
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

const LANG={
  en:{
    title:'esp-signal-ghost',subtitle:'👻 spoof · 🔄 cycle · 🌊 flood',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Signal Ghost — MAC Phantom',mainDesc:'Rapidly switch MAC addresses to appear as hundreds of devices',
    sectionA:'How It Works',sectionB:'MAC Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    startBtn:'Start Ghosting',stopBtn:'Stop',turboBtn:'TURBO',resetBtn:'Reset',
    ghostDevices:'Ghost Devices',cyclesPerSec:'Cycles/sec',uniqueMACs:'Unique MACs',chaosLevel:'Network Chaos Level',
    labDesc:'Watch the detected devices list grow as ghost MACs flood the network.',
    howStep1:'ESP32 generates random MAC addresses at high speed.',
    howStep2:'Each MAC sends probe requests, making the network see a new device.',
    howStep3:'Network equipment fills its tables with ghost entries, causing confusion.',
    howStep4:'The chaos meter shows how much the network is disrupted.',
    challenge1:'Why does MAC spoofing confuse network equipment?',
    challenge2:'How can networks defend against MAC flooding?',
    challenge3:'What is the difference between MAC randomization and MAC flooding?',
    challengeReveal1:'Switches use CAM tables to forward packets. Flooding with fake MACs fills these tables, causing traffic to broadcast to all ports.',
    challengeReveal2:'Port security limits MACs per port. 802.1X authenticates devices. Dynamic ARP inspection validates ARP packets.',
    challengeReveal3:'MAC randomization (phones for privacy) changes your MAC periodically. MAC flooding deliberately generates thousands of fake MACs to attack infrastructure.',
    revealBtn:'Reveal Answer',
    faq_q1:'What is MAC spoofing?',faq_a1:'Changing a device\'s MAC address to impersonate another or appear as new on the network.',
    faq_q2:'What is a MAC flood attack?',faq_a2:'Sending thousands of frames with different source MACs to overflow the switch\'s CAM table.',
    faq_q3:'Is this attacking a real network?',faq_a3:'No! This is a simulation. No real packets are sent.',
    faq_q4:'Why do phones randomize MACs?',faq_a4:'For privacy. Random MACs prevent tracking across WiFi networks.',
    howto_1:'Click Start Ghosting to begin cycling MAC addresses.',
    howto_2:'Watch the MAC display cycle rapidly and ghost devices accumulate.',
    howto_3:'Click TURBO to increase the cycle rate dramatically.',
    howto_4:'Watch the chaos meter fill as the network gets confused.',
    wiki_mac_title:'🏷️ MAC Address',wiki_mac:'48-bit hardware address (6 bytes) uniquely identifying a network interface.',
    wiki_cam_title:'📋 CAM Table',wiki_cam:'Switch table mapping MACs to ports. Limited capacity (8K-128K entries).',
    wiki_flood_title:'🌊 MAC Flooding',wiki_flood:'Overflowing CAM table forces switch to broadcast all traffic.',
    wiki_defense_title:'🛡️ Port Security',wiki_defense:'Switch feature limiting MACs per port. Violations shut down port.',
    working:'Working…',ghostStarted:'Ghosting started!',ghostStopped:'Ghosting stopped.',ghostReset:'Ghost reset.',turboOn:'TURBO MODE!',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'👻 Signal Ghost ready — start flooding the network!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
  ,step1Title:'Scan',step1Desc:'ESP32 generates random MAC addresses at high speed.',step2Title:'Capture',step2Desc:'Each MAC sends probe requests, making the network see a new device.',step3Title:'Analyze',step3Desc:'Network equipment fills its tables with ghost entries, causing confusion.',step4Title:'Report',step4Desc:'The chaos meter shows how much the network is disrupted.',sectionCode:'Device Code'},
  fr:{
    title:'esp-signal-ghost',subtitle:'👻 usurper · 🔄 cycler · 🌊 inonder',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Signal Ghost — Fantôme MAC',mainDesc:'Changez rapidement d\'adresse MAC pour apparaître comme des centaines d\'appareils',
    sectionA:'Comment ça marche',sectionB:'Labo MAC',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    startBtn:'Lancer le fantôme',stopBtn:'Arrêter',turboBtn:'TURBO',resetBtn:'Réinitialiser',
    ghostDevices:'Appareils fantômes',cyclesPerSec:'Cycles/sec',uniqueMACs:'MACs uniques',chaosLevel:'Niveau de chaos réseau',
    labDesc:'Regardez la liste d\'appareils grandir avec les MAC fantômes.',
    howStep1:'L\'ESP32 génère des adresses MAC aléatoires à grande vitesse.',
    howStep2:'Chaque MAC envoie des requêtes probe, le réseau voit un nouvel appareil.',
    howStep3:'L\'équipement réseau remplit ses tables avec des entrées fantômes.',
    howStep4:'Le compteur de chaos montre la perturbation du réseau.',
    challenge1:'Pourquoi l\'usurpation MAC confond l\'équipement ?',challenge2:'Comment se défendre contre l\'inondation MAC ?',challenge3:'Différence entre randomisation et inondation MAC ?',
    challengeReveal1:'Les switches utilisent des tables CAM. L\'inondation les remplit, forçant la diffusion.',
    challengeReveal2:'Sécurité des ports, 802.1X, inspection ARP dynamique.',
    challengeReveal3:'La randomisation (téléphones) change le MAC pour la vie privée. L\'inondation attaque l\'infrastructure.',
    revealBtn:'Révéler',
    faq_q1:'Qu\'est-ce que l\'usurpation MAC ?',faq_a1:'Changer l\'adresse MAC pour se faire passer pour un autre appareil.',
    faq_q2:'Qu\'est-ce qu\'une inondation MAC ?',faq_a2:'Envoyer des milliers de trames avec des MACs différents.',
    faq_q3:'Attaque réelle ?',faq_a3:'Non ! C\'est une simulation.',
    faq_q4:'Pourquoi les téléphones randomisent les MAC ?',faq_a4:'Pour la vie privée.',
    howto_1:'Cliquez Lancer le fantôme.',howto_2:'Regardez le MAC changer rapidement.',howto_3:'Cliquez TURBO pour accélérer.',howto_4:'Surveillez le compteur de chaos.',
    wiki_mac_title:'🏷️ Adresse MAC',wiki_mac:'Adresse matérielle de 48 bits identifiant une interface réseau.',
    wiki_cam_title:'📋 Table CAM',wiki_cam:'Table du switch associant MACs aux ports.',
    wiki_flood_title:'🌊 Inondation MAC',wiki_flood:'Remplir la table CAM force la diffusion.',
    wiki_defense_title:'🛡️ Sécurité des ports',wiki_defense:'Limite les MACs par port.',
    working:'En cours…',ghostStarted:'Fantôme lancé !',ghostStopped:'Fantôme arrêté.',ghostReset:'Réinitialisé.',turboOn:'MODE TURBO !',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'👻 Signal Ghost prêt — inondez le réseau !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
  ,step1Title:'Scanner',step1Desc:'L\'ESP32 génère des adresses MAC aléatoires à grande vitesse.',step2Title:'Capturer',step2Desc:'Chaque MAC envoie des requêtes probe, le réseau voit un nouvel appareil.',step3Title:'Analyser',step3Desc:'L\'équipement réseau remplit ses tables avec des entrées fantômes.',step4Title:'Rapporter',step4Desc:'Le compteur de chaos montre la perturbation du réseau.',sectionCode:'Code Appareil'},
  ar:{
    title:'esp-signal-ghost',subtitle:'👻 تزييف · 🔄 دوران · 🌊 إغراق',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'Signal Ghost — شبح MAC',mainDesc:'بدّل عناوين MAC بسرعة لتظهر كمئات الأجهزة',
    sectionA:'كيف يعمل',sectionB:'مختبر MAC',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    startBtn:'بدء الشبح',stopBtn:'إيقاف',turboBtn:'توربو',resetBtn:'إعادة تعيين',
    ghostDevices:'أجهزة شبحية',cyclesPerSec:'دورات/ثانية',uniqueMACs:'MACs فريدة',chaosLevel:'مستوى فوضى الشبكة',
    labDesc:'راقب قائمة الأجهزة تنمو مع إغراق عناوين MAC الشبحية.',
    howStep1:'ESP32 يولّد عناوين MAC عشوائية بسرعة عالية.',
    howStep2:'كل MAC يرسل طلبات probe، الشبكة ترى جهازاً جديداً.',
    howStep3:'معدات الشبكة تملأ جداولها بإدخالات شبحية.',
    howStep4:'عداد الفوضى يوضح مدى تعطل الشبكة.',
    challenge1:'لماذا تزييف MAC يربك معدات الشبكة؟',challenge2:'كيف تدافع الشبكات ضد إغراق MAC؟',challenge3:'ما الفرق بين عشوائية MAC وإغراق MAC؟',
    challengeReveal1:'السويتشات تستخدم جداول CAM. الإغراق يملؤها مما يجبر على البث للجميع.',
    challengeReveal2:'أمن المنافذ يحد MACs لكل منفذ. 802.1X يوثق الأجهزة.',
    challengeReveal3:'العشوائية (الهواتف) تغير MAC للخصوصية. الإغراق يهاجم البنية التحتية عمداً.',
    revealBtn:'اكشف الإجابة',
    faq_q1:'ما هو تزييف MAC؟',faq_a1:'تغيير عنوان MAC للتنكر كجهاز آخر.',
    faq_q2:'ما هو إغراق MAC؟',faq_a2:'إرسال آلاف الإطارات بعناوين MAC مختلفة.',
    faq_q3:'هل هذا هجوم حقيقي؟',faq_a3:'لا! هذه محاكاة.',
    faq_q4:'لماذا الهواتف تعشّو MAC؟',faq_a4:'للخصوصية. منع التتبع عبر شبكات WiFi.',
    howto_1:'انقر بدء الشبح لبدء تدوير العناوين.',howto_2:'راقب العرض يتغير بسرعة.',howto_3:'انقر توربو لزيادة السرعة.',howto_4:'راقب عداد الفوضى.',
    wiki_mac_title:'🏷️ عنوان MAC',wiki_mac:'عنوان عتاد 48 بت يعرّف واجهة الشبكة.',
    wiki_cam_title:'📋 جدول CAM',wiki_cam:'جدول السويتش يربط MACs بالمنافذ.',
    wiki_flood_title:'🌊 إغراق MAC',wiki_flood:'ملء جدول CAM يجبر البث للجميع.',
    wiki_defense_title:'🛡️ أمن المنافذ',wiki_defense:'يحد عدد MACs لكل منفذ.',
    working:'جارٍ…',ghostStarted:'بدأ الشبح!',ghostStopped:'توقف الشبح.',ghostReset:'تم إعادة التعيين.',turboOn:'وضع توربو!',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'👻 Signal Ghost جاهز — أغرق الشبكة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
  ,step1Title:'مسح',step1Desc:'ESP32 يولّد عناوين MAC عشوائية بسرعة عالية.',step2Title:'التقاط',step2Desc:'كل MAC يرسل طلبات probe، الشبكة ترى جهازاً جديداً.',step3Title:'تحليل',step3Desc:'معدات الشبكة تملأ جداولها بإدخالات شبحية.',step4Title:'تقرير',step4Desc:'عداد الفوضى يوضح مدى تعطل الشبكة.',sectionCode:'كود الجهاز'}
};

/* ═══════ FRAMEWORK ═══════ */
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
let matrixRunning=false,matrixAnim=null;function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1),chars='بسمالرحنيوكلت';function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#0f0';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
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
   SIGNAL GHOST SIMULATION
   ═══════════════════════════════════════════════════════════════ */
function revealChallenge(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');playSound('click');}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':');}

let ghostRunning=false;
let ghostInterval=null;
let ghostMACs=new Set();
let totalCycles=0;
let cyclesThisSecond=0;
let lastSecond=Date.now();
let turboMode=false;

function getInterval(){return turboMode?30:200;}

function updateDisplay(mac){
  const disp=$('macDisplay');
  if(disp){disp.textContent=mac;disp.classList.toggle('cycling',ghostRunning);}
  if($('ghostCount'))$('ghostCount').textContent=ghostMACs.size;
  if($('uniqueMACs'))$('uniqueMACs').textContent=ghostMACs.size;

  const now=Date.now();
  if(now-lastSecond>=1000){
    if($('cycleRate'))$('cycleRate').textContent=cyclesThisSecond;
    cyclesThisSecond=0;lastSecond=now;
  }

  // Chaos meter: 0-100% based on ghost count (max at ~500)
  const chaos=Math.min(100,ghostMACs.size/5);
  const fill=$('chaosFill');
  if(fill)fill.style.width=chaos+'%';

  // Lab stats
  if($('arpEntries'))$('arpEntries').textContent=ghostMACs.size;
  const dhcpPct=Math.max(0,100-Math.floor(ghostMACs.size/2.5));
  if($('dhcpPool'))$('dhcpPool').textContent=dhcpPct+'%';
}

function addGhostEntry(mac){
  const flood=$('deviceFlood');if(!flood)return;
  const entry=document.createElement('div');
  entry.className='ghost-entry';
  const vendors=['Espressif','Intel','Broadcom','Qualcomm','Realtek','MediaTek','Unknown'];
  const vendor=vendors[Math.floor(Math.random()*vendors.length)];
  const rssi=-30-Math.floor(Math.random()*60);
  entry.textContent=`${mac}  ${vendor.padEnd(10)}  ${rssi} dBm  ${new Date().toLocaleTimeString()}`;
  flood.insertBefore(entry,flood.firstChild);
  // Keep list manageable
  while(flood.children.length>200)flood.removeChild(flood.lastChild);
}

function ghostCycle(){
  const mac=randMAC();
  ghostMACs.add(mac);
  totalCycles++;
  cyclesThisSecond++;
  updateDisplay(mac);
  addGhostEntry(mac);

  // Periodic log (every 50 ghosts)
  if(ghostMACs.size%50===0){
    log(`👻 ${ghostMACs.size} ghost devices active — network confusion growing!`,'tx');
  }
}

function startGhost(){
  if(ghostRunning)return;
  ghostRunning=true;
  const s=LANG[currentLang];
  setStatus(true);
  log(s.ghostStarted,'success');
  showToast(s.ghostStarted,1500);
  ghostInterval=setInterval(ghostCycle,getInterval());
}

function stopGhost(){
  if(!ghostRunning)return;
  ghostRunning=false;
  if(ghostInterval){clearInterval(ghostInterval);ghostInterval=null;}
  const disp=$('macDisplay');if(disp)disp.classList.remove('cycling');
  setStatus(false);
  log(LANG[currentLang].ghostStopped,'info');
}

function toggleTurbo(){
  turboMode=!turboMode;
  const s=LANG[currentLang];
  if(turboMode){
    log(`🚀 ${s.turboOn}`,'error');
    showToast(s.turboOn,1200);
  }
  if(ghostRunning){
    clearInterval(ghostInterval);
    ghostInterval=setInterval(ghostCycle,getInterval());
  }
}

function resetGhost(){
  stopGhost();
  ghostMACs.clear();
  totalCycles=0;cyclesThisSecond=0;turboMode=false;
  updateDisplay('00:00:00:00:00:00');
  const flood=$('deviceFlood');if(flood)flood.innerHTML='';
  const fill=$('chaosFill');if(fill)fill.style.width='0%';
  if($('arpEntries'))$('arpEntries').textContent='0';
  if($('dhcpPool'))$('dhcpPool').textContent='100%';
  if($('cycleRate'))$('cycleRate').textContent='0';
  log(LANG[currentLang].ghostReset,'info');
}

function initSignalGhost(){
  if($('startBtn'))$('startBtn').addEventListener('click',startGhost);
  if($('stopBtn'))$('stopBtn').addEventListener('click',stopGhost);
  if($('turboBtn'))$('turboBtn').addEventListener('click',toggleTurbo);
  if($('resetBtn'))$('resetBtn').addEventListener('click',resetGhost);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initSignalGhost);}else{setTimeout(initSignalGhost,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Signal Ghost: MAC phantom with rapid
   MAC cycling, ghost device flood, and network chaos meter
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0,ghostCnt=0;
  const ghosts=[],spectres=[];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#08060e;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }
  function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':').toUpperCase();}

  class Ghost{
    constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-0.5)*1.2;this.vy=(Math.random()-0.5)*1.2;
      this.mac=randMAC();this.alpha=0;this.fadeIn=true;this.life=120+Math.random()*200;this.age=0;
      this.size=10+Math.random()*10;this.hue=Math.random()*360;this.macTimer=0;}
    update(){
      this.age++;this.macTimer++;if(this.macTimer>30){this.mac=randMAC();this.macTimer=0;this.hue=Math.random()*360;}
      if(this.fadeIn){this.alpha=Math.min(1,this.alpha+0.03);if(this.alpha>=1)this.fadeIn=false;}
      if(this.age>this.life-40)this.alpha=Math.max(0,this.alpha-0.03);
      this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W)this.vx*=-1;if(this.y<0||this.y>H)this.vy*=-1;return this.age<this.life;
    }
    draw(){
      ctx.save();ctx.globalAlpha=this.alpha*0.7;ctx.shadowColor='hsl('+this.hue+',80%,60%)';ctx.shadowBlur=12;
      ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',70%,50%,0.15)';ctx.fill();
      ctx.strokeStyle='hsl('+this.hue+',80%,60%)';ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;
      ctx.font=(this.size*0.9)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F47B}',this.x,this.y);
      ctx.font='7px monospace';ctx.fillStyle='hsla('+this.hue+',80%,70%,'+this.alpha+')';ctx.fillText(this.mac,this.x,this.y+this.size+8);ctx.restore();
    }
  }

  class Spectre{
    constructor(x,y,h){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*2;this.vy=(Math.random()-0.5)*2;this.life=1;this.hue=h;this.size=2+Math.random()*3;}
    update(){this.x+=this.vx;this.y+=this.vy;this.life-=0.02;this.vx*=0.97;this.vy*=0.97;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',70%,60%,'+(this.life*0.4)+')';ctx.fill();}
  }

  function drawRouter(){
    const load=Math.min(1,ghosts.length/20),shake=load>0.5?(Math.random()-0.5)*load*4:0;
    const rx=W/2+shake,ry=H/2+shake;ctx.save();ctx.shadowColor=load>0.7?'#ff4444':'#00ccff';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(rx,ry,22,0,Math.PI*2);ctx.fillStyle='rgba('+(load>0.7?'255,60,60':'0,200,255')+',0.15)';ctx.fill();
    ctx.strokeStyle=load>0.7?'#ff4444':'#00ccff';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F500}',rx,ry);
    ctx.font='8px monospace';ctx.fillStyle=load>0.7?'#ff6666':'#00ccff';ctx.fillText('SWITCH',rx,ry+30);
    ctx.fillStyle='#222';ctx.fillRect(rx-30,ry+36,60,6);
    const g=ctx.createLinearGradient(rx-30,0,rx+30,0);g.addColorStop(0,'#00ccff');g.addColorStop(0.7,'#ffcc00');g.addColorStop(1,'#ff4444');
    ctx.fillStyle=g;ctx.fillRect(rx-30,ry+36,60*load,6);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('CAM: '+Math.floor(load*100)+'%',rx,ry+52);ctx.restore();
  }

  function drawProbes(){ghosts.forEach(g=>{if(Math.random()>0.3)return;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(W/2,H/2);ctx.strokeStyle='hsla('+g.hue+',60%,50%,0.06)';ctx.lineWidth=1;ctx.stroke();});}

  function drawHUD(){
    const cl=Math.min(100,Math.floor(ghosts.length/25*100));
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,70);ctx.strokeStyle=cl>70?'#f003':'#80f3';ctx.strokeRect(8,8,185,70);
    ctx.font='10px monospace';ctx.fillStyle='#c084fc';ctx.textAlign='left';ctx.fillText('SIGNAL GHOST',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Ghost Devices: '+ghosts.length,16,40);ctx.fillText('Total Spawned: '+ghostCnt,16,54);
    ctx.fillStyle=cl>70?'#ff4444':cl>40?'#ffd93d':'#6bcb77';ctx.fillText('Chaos Level: '+cl+'%',16,68);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,6,14,0.12)';ctx.fillRect(0,0,W,H);
    if(frameCount%8===0&&ghosts.length<30){ghosts.push(new Ghost());ghostCnt++;}
    drawProbes();drawRouter();
    for(let i=ghosts.length-1;i>=0;i--){if(!ghosts[i].update()){for(let s=0;s<6;s++)spectres.push(new Spectre(ghosts[i].x,ghosts[i].y,ghosts[i].hue));ghosts.splice(i,1);}
      else{ghosts[i].draw();if(Math.random()<0.05)spectres.push(new Spectre(ghosts[i].x,ghosts[i].y,ghosts[i].hue));}}
    for(let i=spectres.length-1;i>=0;i--){if(!spectres[i].update())spectres.splice(i,1);else spectres[i].draw();}
    drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,200);
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
