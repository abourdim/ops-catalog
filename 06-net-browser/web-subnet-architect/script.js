/**
 * Subnet Architect — Network Designer
 * Workshop DIY — Net Browser Collection
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752z"/><path style="stroke:none;fill:currentColor" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195z"/><path style="stroke:none;fill:currentColor" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

const LANG={
en:{title:'Subnet Architect',subtitle:'🏗️ Drag-and-drop network design',disconnected:'Disconnected',connected:'Connected',mainSection:'Network Designer',mainDesc:'Place devices, connect them, simulate traffic',sectionA:'Subnetting Basics',sectionB:'IP Address Classes',sectionC:'Failure Simulation',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Subnet Architect?',faq_a1:'A visual network designer where you place devices and simulate traffic flow.',faq_q2:'Is this a real network?',faq_a2:'No, it is a simulation for learning.',faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click a device button then click on the canvas.',howto_2:'Click Connect, then click two devices.',howto_3:'Select a device and assign an IP.',howto_4:'Click Simulate to watch traffic flow.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual: EN, FR, AR.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🏗️ Subnet Architect ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',router:'Router',switch:'Switch',host:'Host',firewall:'Firewall',connectMode:'Connect',simulate:'Simulate',clearCanvas:'Clear',selectedDevice:'Selected:',assignIP:'Assign',failLink:'Fail Random Link',restore:'Restore All',subnetText:'Subnetting divides a network into smaller sub-networks. A /24 means 256 addresses.',ipClassText:'Class A: 10.0.0.0/8, Class B: 172.16.0.0/12, Class C: 192.168.0.0/16.',failText:'Test network resilience by simulating link failures.',devicePlaced:'Device placed',connectionMade:'Connection created',trafficSim:'Traffic simulation running',linkFailed:'Link failed!',allRestored:'All links restored',noDevices:'Place devices first!'},
fr:{title:'Subnet Architect',subtitle:'🏗️ Conception reseau glisser-deposer',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Concepteur Reseau',mainDesc:'Placez des appareils, connectez-les, simulez le trafic',sectionA:'Bases du sous-reseautage',sectionB:'Classes d\'adresses IP',sectionC:'Simulation de panne',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Subnet Architect ?',faq_a1:'Un concepteur reseau visuel.',faq_q2:'Est-ce un vrai reseau ?',faq_a2:'Non, c\'est une simulation.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvre Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui, tout est local.',howto_1:'Clique sur un appareil puis sur le canvas.',howto_2:'Clique Connecter puis deux appareils.',howto_3:'Selectionne et assigne une IP.',howto_4:'Clique Simuler pour le trafic.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🏗️ Subnet Architect pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'🔊 Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',router:'Routeur',switch:'Commutateur',host:'Hote',firewall:'Pare-feu',connectMode:'Connecter',simulate:'Simuler',clearCanvas:'Effacer',selectedDevice:'Selectionne:',assignIP:'Assigner',failLink:'Couper un lien',restore:'Restaurer',subnetText:'Le sous-reseautage divise un reseau en sous-reseaux plus petits.',ipClassText:'Classe A: 10.0.0.0/8, Classe B: 172.16.0.0/12, Classe C: 192.168.0.0/16.',failText:'Testez la resilience du reseau.',devicePlaced:'Appareil place',connectionMade:'Connexion creee',trafficSim:'Simulation de trafic',linkFailed:'Lien coupe !',allRestored:'Liens restaures',noDevices:'Placez des appareils d\'abord !'},
ar:{title:'مهندس الشبكات الفرعية',subtitle:'🏗️ تصميم شبكة بالسحب والإفلات',disconnected:'غير متصل',connected:'متصل',mainSection:'مصمم الشبكة',mainDesc:'ضع أجهزة، اربطها، حاكِ حركة المرور',sectionA:'أساسيات الشبكات الفرعية',sectionB:'فئات عناوين IP',sectionC:'محاكاة الأعطال',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو مهندس الشبكات؟',faq_a1:'مصمم شبكات بصري لوضع الأجهزة ومحاكاة التدفق.',faq_q2:'هل هذه شبكة حقيقية؟',faq_a2:'لا، هذه محاكاة تعليمية.',faq_q3:'كيف أغيّر اللغة؟',faq_a3:'افتح الإعدادات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم، كل شيء محلي.',howto_1:'انقر على جهاز ثم على اللوحة.',howto_2:'انقر اتصال ثم جهازين.',howto_3:'حدد جهازاً وعيّن IP.',howto_4:'انقر محاكاة لمشاهدة التدفق.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرّخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي أولاً.',working:'جارٍ…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'🏗️ مهندس الشبكات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',export:'تصدير',filterAll:'الكل',soundEffects:'🔊 أصوات',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',router:'موجه',switch:'مبدّل',host:'مضيف',firewall:'جدار ناري',connectMode:'اتصال',simulate:'محاكاة',clearCanvas:'مسح',selectedDevice:'المحدد:',assignIP:'تعيين',failLink:'قطع رابط عشوائي',restore:'استعادة الكل',subnetText:'الشبكات الفرعية تقسم الشبكة إلى أقسام أصغر.',ipClassText:'فئة A: 10.0.0.0/8، فئة B: 172.16.0.0/12، فئة C: 192.168.0.0/16.',failText:'اختبر مرونة الشبكة بمحاكاة أعطال الروابط.',devicePlaced:'تم وضع الجهاز',connectionMade:'تم إنشاء اتصال',trafficSim:'محاكاة حركة المرور',linkFailed:'رابط مقطوع!',allRestored:'تم استعادة الروابط',noDevices:'ضع أجهزة أولاً!'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({msg,type,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='subnet-log.txt';a.click();URL.revokeObjectURL(u);}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
const logHistory=[];
function pulseBismillah(t){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(t==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};
let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;bands.forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing on':'🫁 Breathing off','info');if(!breathingActive&&dhikrCount>0){log(`📿 Dhikr: ${dhikrCount}`,'success');dhikrCount=0;}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('🎤 Not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('🎤 Off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`🎤 ${t}`,'rx');}};recognition.onerror=e=>log(`🎤 ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('🎤 On','success');}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open');}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const t=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغ';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);})();}
function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';let cc=0,ct=null;l.addEventListener('click',()=>{cc++;if(ct)clearTimeout(ct);if(cc>=3){cc=0;toggleMatrix();}else ct=setTimeout(()=>cc=0,500);});}

/* ══════════════════════════════════════════════════════════════
   SUBNET ARCHITECT ENGINE
   ══════════════════════════════════════════════════════════════ */
const DEVICE_TYPES={router:{icon:'🔀',color:'#3b82f6',r:22},switch:{icon:'🔌',color:'#22c55e',r:20},host:{icon:'💻',color:'#f59e0b',r:18},firewall:{icon:'🛡️',color:'#ef4444',r:22}};
let devices=[],connections=[],selectedDevice=null,connectMode=false,connectFirst=null;
let placingType=null,simRunning=false,simAnim=null,trafficParticles=[];

function renderCanvas(){
  const canvas=$('netCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0a1628';ctx.fillRect(0,0,w,h);
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  // Connections
  connections.forEach(c=>{
    const d1=devices[c.from],d2=devices[c.to];if(!d1||!d2)return;
    ctx.strokeStyle=c.failed?'#ef4444':'rgba(255,255,255,0.3)';
    ctx.lineWidth=c.failed?1:2;
    if(c.failed){ctx.setLineDash([5,5]);}else{ctx.setLineDash([]);}
    ctx.beginPath();ctx.moveTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.stroke();
    ctx.setLineDash([]);
  });
  // Traffic particles
  trafficParticles.forEach(p=>{
    ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim()||'#0ea5e9';
    ctx.globalAlpha=0.8;ctx.fill();ctx.globalAlpha=1;
  });
  // Devices
  devices.forEach((d,i)=>{
    const dt=DEVICE_TYPES[d.type];
    // Glow if selected
    if(selectedDevice===i){
      ctx.beginPath();ctx.arc(d.x,d.y,dt.r+6,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fill();
      ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
      ctx.lineWidth=2;ctx.stroke();
    }
    // Body
    ctx.beginPath();ctx.arc(d.x,d.y,dt.r,0,Math.PI*2);
    ctx.fillStyle=dt.color+'33';ctx.fill();
    ctx.strokeStyle=dt.color;ctx.lineWidth=2;ctx.stroke();
    // Icon
    ctx.font='16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(dt.icon,d.x,d.y);
    // Label
    ctx.font='10px Tajawal,sans-serif';ctx.fillStyle='#fff';ctx.globalAlpha=0.7;
    ctx.fillText(d.ip||d.type,d.x,d.y+dt.r+12);ctx.globalAlpha=1;
  });
  // Connect mode indicator
  if(connectMode&&connectFirst!==null){
    const d=devices[connectFirst];
    ctx.beginPath();ctx.arc(d.x,d.y,DEVICE_TYPES[d.type].r+10,0,Math.PI*2);
    ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
  }
}

function getDeviceAt(x,y){
  for(let i=devices.length-1;i>=0;i--){
    const d=devices[i],dt=DEVICE_TYPES[d.type];
    const dx=d.x-x,dy=d.y-y;
    if(dx*dx+dy*dy<=dt.r*dt.r)return i;
  }
  return -1;
}

function canvasClick(e){
  const canvas=$('netCanvas');const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX,y=(e.clientY-rect.top)*scaleY;
  const s=LANG[currentLang];

  if(connectMode){
    const idx=getDeviceAt(x,y);
    if(idx===-1)return;
    if(connectFirst===null){connectFirst=idx;renderCanvas();return;}
    if(idx!==connectFirst){
      connections.push({from:connectFirst,to:idx,failed:false});
      log(`${s.connectionMade}: ${devices[connectFirst].type} ↔ ${devices[idx].type}`,'success');
    }
    connectFirst=null;connectMode=false;renderCanvas();return;
  }
  if(placingType){
    devices.push({type:placingType,x,y,ip:''});
    log(`${s.devicePlaced}: ${placingType} (${Math.round(x)},${Math.round(y)})`,'info');
    placingType=null;renderCanvas();return;
  }
  // Select device
  const idx=getDeviceAt(x,y);
  if(idx>=0){
    selectedDevice=idx;
    const d=devices[idx];
    $('ipPanel').style.display='flex';
    $('selectedLabel').textContent=`${DEVICE_TYPES[d.type].icon} ${d.type} #${idx}`;
    $('ipInput').value=d.ip||'';
  }else{
    selectedDevice=null;
    $('ipPanel').style.display='none';
  }
  renderCanvas();
}

let dragIdx=-1,dragOff={x:0,y:0};
function canvasMouseDown(e){
  const canvas=$('netCanvas');const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX,y=(e.clientY-rect.top)*scaleY;
  if(placingType||connectMode)return;
  const idx=getDeviceAt(x,y);
  if(idx>=0){dragIdx=idx;dragOff={x:devices[idx].x-x,y:devices[idx].y-y};}
}
function canvasMouseMove(e){
  if(dragIdx<0)return;
  const canvas=$('netCanvas');const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX,y=(e.clientY-rect.top)*scaleY;
  devices[dragIdx].x=x+dragOff.x;devices[dragIdx].y=y+dragOff.y;
  renderCanvas();
}
function canvasMouseUp(){dragIdx=-1;}

function assignIP(){
  if(selectedDevice===null)return;
  devices[selectedDevice].ip=$('ipInput').value.trim();
  log(`IP assigned: ${devices[selectedDevice].ip} → ${devices[selectedDevice].type} #${selectedDevice}`,'success');
  renderCanvas();
}

async function simulateTraffic(){
  if(simRunning||devices.length<2||connections.length===0){log(LANG[currentLang].noDevices,'error');return;}
  const s=LANG[currentLang];simRunning=true;setStatus(true);showToast(s.trafficSim);log(s.trafficSim,'tx');
  trafficParticles=[];
  for(let wave=0;wave<3;wave++){
    const activeConns=connections.filter(c=>!c.failed);
    if(activeConns.length===0)break;
    const c=activeConns[Math.floor(Math.random()*activeConns.length)];
    const d1=devices[c.from],d2=devices[c.to];
    for(let t=0;t<=30;t++){
      const prog=t/30;
      trafficParticles=[{x:d1.x+(d2.x-d1.x)*prog,y:d1.y+(d2.y-d1.y)*prog}];
      renderCanvas();await sleep(30);
    }
    trafficParticles=[];renderCanvas();
    log(`📦 ${d1.type}${d1.ip?' ('+d1.ip+')':''} → ${d2.type}${d2.ip?' ('+d2.ip+')':''}`,'rx');
    await sleep(200);
  }
  trafficParticles=[];simRunning=false;hideToast();log(s.trafficSim+' ✓','success');renderCanvas();
}

function failRandomLink(){
  const active=connections.filter(c=>!c.failed);
  if(active.length===0)return;
  const c=active[Math.floor(Math.random()*active.length)];
  c.failed=true;
  log(LANG[currentLang].linkFailed+` ${devices[c.from].type} ↔ ${devices[c.to].type}`,'error');
  renderCanvas();
}
function restoreAll(){connections.forEach(c=>c.failed=false);log(LANG[currentLang].allRestored,'success');renderCanvas();}
function clearCanvas(){devices=[];connections=[];selectedDevice=null;connectMode=false;connectFirst=null;trafficParticles=[];$('ipPanel').style.display='none';renderCanvas();log('Canvas cleared','info');}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  $('whisperBtn').onclick=toggleWhisper;
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};
  if(db)db.onclick=incrementDhikr;
  $('musicBtn').onclick=()=>log('🎵 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();initPixelPet();

  // App-specific
  const canvas=$('netCanvas');
  canvas.addEventListener('click',canvasClick);
  canvas.addEventListener('mousedown',canvasMouseDown);
  canvas.addEventListener('mousemove',canvasMouseMove);
  canvas.addEventListener('mouseup',canvasMouseUp);
  canvas.addEventListener('mouseleave',canvasMouseUp);
  $('addRouterBtn').onclick=()=>{placingType='router';connectMode=false;playSound('click');};
  $('addSwitchBtn').onclick=()=>{placingType='switch';connectMode=false;playSound('click');};
  $('addHostBtn').onclick=()=>{placingType='host';connectMode=false;playSound('click');};
  $('addFirewallBtn').onclick=()=>{placingType='firewall';connectMode=false;playSound('click');};
  $('connectBtn').onclick=()=>{connectMode=!connectMode;placingType=null;connectFirst=null;playSound('click');};
  $('simBtn').onclick=simulateTraffic;
  $('clearCanvasBtn').onclick=clearCanvas;
  $('assignIPBtn').onclick=assignIP;
  $('failLinkBtn').onclick=failRandomLink;
  $('restoreBtn').onclick=restoreAll;
  renderCanvas();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
