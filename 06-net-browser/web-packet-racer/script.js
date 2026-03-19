/**
 * Workshop DIY — Packet Racer v1.2
 * Network Racing — Be a packet navigating routers, firewalls, and congested links
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.42,152.87C187.48,152.74,187.66,152.63,187.82,152.63C188.09,152.63,190.48,151.54,191.62,150.9L194.17,149.21C197.43,146.97,199.24,146.24,202.59,145.78C203.8,145.62,204.63,145.62,205.93,145.78C212.62,146.63,217.42,150.72,219.33,157.2C219.72,158.55,219.77,162.69,219.41,163.88C218.19,167.86,216.58,170.3,213.79,172.41C209.46,175.7,203.83,176.56,198.81,174.72L187.29,168.46L187.31,160.79z"/><path style="stroke:none;fill:currentColor" d="M259.79,157.67L264.88,148.03H272.34L263.03,163.73V174.99H256.26V164.07L246.79,148.03H254.51z"/><path style="stroke:none;fill:currentColor" d="M240.37,152.74H236.5V170.28H240.37V174.99H225.85V170.28H229.72V152.74H225.85V148.03H240.37z"/><path style="stroke:none;fill:currentColor" d="M330.79,195.73H203.96V199.33H330.79zM330.79,203.35H161.69V206.96H330.79zM330.79,210.97H77.14V214.58H330.79z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Packet Racer',subtitle:'Be a packet navigating routers, firewalls, and congested links',disconnected:'Disconnected',connected:'Connected',mainSection:'Network Race',mainDesc:'Navigate through the network topology',sectionA:'Network Obstacles',sectionB:'Network Concepts',sectionC:'High Scores',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Packet Racer?',faq_a1:'A network racing game where you navigate as a packet.',faq_q2:'How do I play?',faq_a2:'Use arrow keys or buttons to move.',faq_q3:'How do I change the language?',faq_a3:'Open Settings.',faq_q4:'Is my data private?',faq_a4:'Yes. Local only.',howto_1:'Click Start Race.',howto_2:'Use arrow keys to navigate.',howto_3:'Avoid obstacles.',howto_4:'Reach the destination.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'Trilingual.',wiki_log_title:'Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'Privacy',wiki_privacy:'Local-first.',working:'Working...',ready:'Packet Racer ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'Language > English',themeChanged:'Theme >',startBtn:'Start Race',resetBtn:'Reset',score:'Score',health:'HP',timer:'Time',obstacleText:'Firewalls (red) block. Congestion (orange) slows. Packet loss (purple) damages. Routers (green) give bonus.',conceptText:'Packets travel through hops. Each adds latency. Firewalls filter. Congestion = bandwidth exceeded.',scoreText:'Your best race times and scores.',raceStarted:'Race started! Navigate to the destination!',hitFirewall:'Hit firewall! Blocked!',hitCongestion:'Congestion zone! Slowed down!',hitPacketLoss:'Packet loss! -20 HP!',hitRouter:'Router checkpoint! +50 points!',raceWon:'RACE WON! Destination reached!',raceLost:'GAME OVER! Health depleted!',pressStart:'Press Start Race to begin',},
  fr:{title:'Course de Paquets',subtitle:'Soyez un paquet naviguant parmi routeurs, pare-feu et liens',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Course Reseau',mainDesc:'Naviguer dans la topologie',sectionA:'Obstacles Reseau',sectionB:'Concepts Reseau',sectionC:'Meilleurs Scores',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Course de Paquets?',faq_a1:'Un jeu de course reseau ou vous etes un paquet.',faq_q2:'Comment jouer?',faq_a2:'Utilisez les fleches ou boutons.',faq_q3:'Changer la langue?',faq_a3:'Ouvrez Parametres.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Cliquez Demarrer.',howto_2:'Utilisez les fleches.',howto_3:'Evitez les obstacles.',howto_4:'Atteignez la destination.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',wiki_log_title:'Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local.',working:'En cours...',ready:'Course de Paquets prete!',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',soundEffects:'Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'passer',newVersion:'MAJ',langChanged:'Langue > Francais',themeChanged:'Theme >',startBtn:'Demarrer Course',resetBtn:'Reinitialiser',score:'Score',health:'PV',timer:'Temps',obstacleText:'Pare-feu (rouge) bloque. Congestion (orange) ralentit. Perte (violet) endommage. Routeurs (vert) bonus.',conceptText:'Les paquets traversent des sauts. Les pare-feu filtrent. La congestion = bande passante depassee.',scoreText:'Vos meilleurs temps et scores.',raceStarted:'Course lancee! Naviguez vers la destination!',hitFirewall:'Pare-feu! Bloque!',hitCongestion:'Zone de congestion! Ralenti!',hitPacketLoss:'Perte de paquet! -20 PV!',hitRouter:'Point de controle routeur! +50 points!',raceWon:'COURSE GAGNEE! Destination atteinte!',raceLost:'FIN! Sante epuisee!',pressStart:'Appuyez Demarrer',},
  ar:{title:'سباق الحزم',subtitle:'كن حزمة تتنقل بين الموجهات والجدران النارية',disconnected:'غير متصل',connected:'متصل',mainSection:'سباق الشبكة',mainDesc:'تنقل عبر طوبولوجيا الشبكة',sectionA:'عقبات الشبكة',sectionB:'مفاهيم الشبكة',sectionC:'افضل النتائج',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو سباق الحزم؟',faq_a1:'لعبة سباق شبكة حيث تتنقل كحزمة.',faq_q2:'كيف العب؟',faq_a2:'استخدم مفاتيح الاسهم او الازرار.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'انقر بدء السباق.',howto_2:'استخدم الاسهم للتنقل.',howto_3:'تجنب العقبات.',howto_4:'اصل الى الوجهة.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'الخصوصية',wiki_privacy:'محلي.',working:'جار...',ready:'سباق الحزم جاهز!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'صوت',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'تخطي',newVersion:'تحديث',langChanged:'اللغة > العربية',themeChanged:'المظهر >',startBtn:'بدء السباق',resetBtn:'اعادة ضبط',score:'النقاط',health:'الصحة',timer:'الوقت',obstacleText:'الجدران النارية (احمر) تحجب. الازدحام (برتقالي) يبطئ. فقدان الحزم (بنفسجي) يضر. الموجهات (اخضر) مكافأة.',conceptText:'تمر الحزم عبر قفزات. الجدران النارية تصفي. الازدحام = تجاوز عرض النطاق.',scoreText:'افضل اوقاتك ونتائجك.',raceStarted:'بدأ السباق! انتقل الى الوجهة!',hitFirewall:'جدار ناري! محجوب!',hitCongestion:'منطقة ازدحام! تباطؤ!',hitPacketLoss:'فقدان حزمة! -20 صحة!',hitRouter:'نقطة تفتيش موجه! +50 نقطة!',raceWon:'فزت بالسباق! تم الوصول!',raceLost:'انتهت اللعبة! نفدت الصحة!',pressStart:'اضغط بدء السباق',}
};
/* ═══════ TEMPLATE BOILERPLATE ═══════ */
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logWithHistory(msg,type);applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function pulseBismillah(type){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(type==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const logHistory=[];function logWithHistory(msg,type){logHistory.push({msg,type,ts:Date.now()});}function initTimeTravel(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='z'){const p=$('logPanel');if(!p||!p.classList.contains('open'))return;e.preventDefault();if(!logContainer)logContainer=$('logContainer');if(logContainer&&logContainer.lastChild){logContainer.removeChild(logContainer.lastChild);logHistory.pop();playSound('click');}}});}
let typewriterEnabled=true;async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function toggleWhisper(){}function toggleMusicMode(){}
function initGhostUsers(){}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>breathingActive?b.classList.add('breathing'):b.classList.remove('breathing'));if(!breathingActive)dhikrCount=0;}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;function initPixelPet(){const pet=document.createElement('div');pet.id='pixelPet';pet.className='pixel-pet pet-idle';pet.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;pet.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(pet,f.firstChild);}function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initLogoTracker(){const l=$('logoWrap');if(!l)return;document.addEventListener('mousemove',e=>{const r=l.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2);const dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);l.style.transform=`perspective(200px) rotateX(${dy*8}deg) rotateY(${-dx*8}deg)`;});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let dragging=false,startX,startW;h.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=p.offsetWidth;document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';document.body.style.userSelect='';});}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(rid);if(b)b.focus();}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const sb=$(id);if(!sb||!sb.classList.contains('open'))continue;const focusable=sb.querySelectorAll(FOCUSABLE);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#4fc3f7';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initKonami(){const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let idx=0;document.addEventListener('keydown',e=>{if(e.key===K[idx]){idx++;if(idx===K.length){idx=0;setTheme('retro');log('KONAMI!','success');}}else idx=0;});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}

/* ══════════════════════════════════════════════════════════════
   APP-SPECIFIC: PACKET RACER
   ══════════════════════════════════════════════════════════════ */
const CELL=35;const COLS=20;const ROWS=12;
let raceCanvas,raceCtx;
let player={x:0,y:5};let gameRunning=false;let score=0;let health=100;let raceTime=0;let raceInterval=null;
let grid=[];let highScores=[];
const TILE={EMPTY:0,FIREWALL:1,CONGESTION:2,PACKETLOSS:3,ROUTER:4,DEST:5,START:6};
const TILE_COLORS={[TILE.EMPTY]:'#0a0e18',[TILE.FIREWALL]:'#ef5350',[TILE.CONGESTION]:'#ff9800',[TILE.PACKETLOSS]:'#ab47bc',[TILE.ROUTER]:'#66bb6a',[TILE.DEST]:'#4fc3f7',[TILE.START]:'#66bb6a'};
const TILE_ICONS={[TILE.FIREWALL]:'\uD83D\uDD25',[TILE.CONGESTION]:'\uD83D\uDEA7',[TILE.PACKETLOSS]:'\uD83D\uDCA8',[TILE.ROUTER]:'\uD83D\uDD00',[TILE.DEST]:'\uD83C\uDFAF',[TILE.START]:'\uD83D\uDCE6'};

function generateGrid(){
  grid=[];
  for(let y=0;y<ROWS;y++){grid[y]=[];for(let x=0;x<COLS;x++)grid[y][x]=TILE.EMPTY;}
  grid[5][0]=TILE.START;grid[5][COLS-1]=TILE.DEST;
  // Routers (checkpoints)
  [[5,5],[3,10],[8,10],[5,15]].forEach(([ry,rx])=>{if(grid[ry])grid[ry][rx]=TILE.ROUTER;});
  // Firewalls
  for(let i=0;i<12;i++){const x=2+Math.floor(Math.random()*(COLS-4));const y=Math.floor(Math.random()*ROWS);if(grid[y][x]===TILE.EMPTY)grid[y][x]=TILE.FIREWALL;}
  // Congestion zones
  for(let i=0;i<8;i++){const x=2+Math.floor(Math.random()*(COLS-4));const y=Math.floor(Math.random()*ROWS);if(grid[y][x]===TILE.EMPTY)grid[y][x]=TILE.CONGESTION;}
  // Packet loss
  for(let i=0;i<6;i++){const x=2+Math.floor(Math.random()*(COLS-4));const y=Math.floor(Math.random()*ROWS);if(grid[y][x]===TILE.EMPTY)grid[y][x]=TILE.PACKETLOSS;}
}

function drawRace(){
  if(!raceCtx)return;const c=raceCanvas,ctx=raceCtx;
  ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#060a14';ctx.fillRect(0,0,c.width,c.height);
  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
  for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*CELL,0);ctx.lineTo(x*CELL,ROWS*CELL);ctx.stroke();}
  for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*CELL);ctx.lineTo(COLS*CELL,y*CELL);ctx.stroke();}
  // Tiles
  for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++){
    const tile=grid[y][x];if(tile===TILE.EMPTY)continue;
    const color=TILE_COLORS[tile];
    ctx.fillStyle=color+'20';ctx.fillRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);
    ctx.strokeStyle=color+'60';ctx.lineWidth=1;ctx.strokeRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);
    const icon=TILE_ICONS[tile];if(icon){ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(icon,x*CELL+CELL/2,y*CELL+CELL/2+5);}
  }}
  // Player
  if(gameRunning||score>0){
    const px=player.x*CELL+CELL/2;const py=player.y*CELL+CELL/2;
    ctx.beginPath();ctx.arc(px,py,CELL/2-4,0,Math.PI*2);ctx.fillStyle='#4fc3f740';ctx.fill();
    ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;ctx.stroke();
    ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('\uD83D\uDCE7',px,py+6);
    // Glow
    ctx.beginPath();ctx.arc(px,py,CELL/2+2,0,Math.PI*2);ctx.strokeStyle='#4fc3f730';ctx.lineWidth=3;ctx.stroke();
  }
  // Not started message
  if(!gameRunning&&score===0&&health===100){
    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#fff';ctx.font='bold 18px Orbitron,sans-serif';ctx.textAlign='center';
    ctx.fillText(LANG[currentLang].pressStart,c.width/2,c.height/2);
  }
}

function movePlayer(dx,dy){
  if(!gameRunning)return;
  const nx=player.x+dx;const ny=player.y+dy;
  if(nx<0||nx>=COLS||ny<0||ny>=ROWS)return;
  const tile=grid[ny][nx];const s=LANG[currentLang];
  if(tile===TILE.FIREWALL){log(s.hitFirewall,'error');playSound('error');return;}
  player.x=nx;player.y=ny;
  if(tile===TILE.CONGESTION){log(s.hitCongestion,'info');score=Math.max(0,score-10);}
  else if(tile===TILE.PACKETLOSS){health-=20;log(s.hitPacketLoss,'error');playSound('error');if(health<=0){endRace(false);return;}}
  else if(tile===TILE.ROUTER){score+=50;log(s.hitRouter,'success');playSound('success');grid[ny][nx]=TILE.EMPTY;}
  else if(tile===TILE.DEST){score+=100;endRace(true);return;}
  score+=5;updateHUD();drawRace();
}

function startRace(){
  if(gameRunning)return;
  const s=LANG[currentLang];
  generateGrid();player={x:0,y:5};score=0;health=100;raceTime=0;gameRunning=true;
  setStatus(true);updateHUD();drawRace();log(s.raceStarted,'success');
  raceInterval=setInterval(()=>{raceTime+=0.1;const tv=$('timerVal');if(tv)tv.textContent=raceTime.toFixed(1);},100);
  const canvas=$('raceCanvas');if(canvas)canvas.focus();
}

function endRace(won){
  gameRunning=false;if(raceInterval){clearInterval(raceInterval);raceInterval=null;}
  const s=LANG[currentLang];
  if(won){
    log(`${s.raceWon} Score: ${score}, Time: ${raceTime.toFixed(1)}s`,'success');
    highScores.push({score,time:raceTime.toFixed(1)});highScores.sort((a,b)=>b.score-a.score);
    highScores=highScores.slice(0,5);updateHighScores();
  }else{log(s.raceLost,'error');}
  updateHUD();drawRace();
}

function resetRace(){
  if(raceInterval){clearInterval(raceInterval);raceInterval=null;}
  gameRunning=false;generateGrid();player={x:0,y:5};score=0;health=100;raceTime=0;
  updateHUD();drawRace();
}

function updateHUD(){
  const sv=$('scoreVal'),hv=$('healthVal'),tv=$('timerVal');
  if(sv)sv.textContent=score;if(hv)hv.textContent=health;if(tv)tv.textContent=raceTime.toFixed(1);
  if(hv)hv.style.color=health>50?'#66bb6a':health>20?'#ff9800':'#ef5350';
}

function updateHighScores(){
  const el=$('highScores');if(!el)return;
  if(highScores.length===0){el.innerHTML='<em style="opacity:.5;">No scores yet</em>';return;}
  let html='';highScores.forEach((s,i)=>{
    html+=`<div style="display:flex;justify-content:space-between;padding:.3rem .5rem;margin-bottom:.2rem;background:rgba(255,255,255,0.03);border-radius:4px;font-size:.85rem;">
      <span>#${i+1}</span><strong>${s.score} pts</strong><span>${s.time}s</span>
    </div>`;
  });el.innerHTML=html;
}

function initPacketRacer(){
  raceCanvas=$('raceCanvas');if(raceCanvas){raceCtx=raceCanvas.getContext('2d');generateGrid();drawRace();}
  const sb=$('startRaceBtn');if(sb)sb.addEventListener('click',startRace);
  const rb=$('resetRaceBtn');if(rb)rb.addEventListener('click',resetRace);
  // Keyboard controls
  document.addEventListener('keydown',e=>{
    if(!gameRunning)return;
    switch(e.key){case'ArrowUp':movePlayer(0,-1);e.preventDefault();break;case'ArrowDown':movePlayer(0,1);e.preventDefault();break;case'ArrowLeft':movePlayer(-1,0);e.preventDefault();break;case'ArrowRight':movePlayer(1,0);e.preventDefault();break;}
  });
  // Button controls
  const ub=$('upBtn'),db=$('downBtn'),lb=$('leftBtn'),rrb=$('rightBtn');
  if(ub)ub.addEventListener('click',()=>movePlayer(0,-1));
  if(db)db.addEventListener('click',()=>movePlayer(0,1));
  if(lb)lb.addEventListener('click',()=>movePlayer(-1,0));
  if(rrb)rrb.addEventListener('click',()=>movePlayer(1,0));
  updateHighScores();
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();if(e.key==='Tab')trapFocus(e);});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  initKonami();initMatrixTrigger();initDebug();initTimeTravel();initHijriDate();initGhostUsers();initPixelPet();initLogoTracker();
  initPacketRacer();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
