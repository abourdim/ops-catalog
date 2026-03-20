/**
 * VPN Tunnel — Encryption Visual
 * Workshop DIY — Net Browser Collection
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M259.8,157.7L264.9,148H272.3L263,163.7V175H256.3V164.1L246.8,148H254.5z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7H236.5V170.3H240.4V175H225.8V170.3H229.7V152.7H225.8V148H240.4z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
en:{title:'VPN Tunnel',subtitle:'🔒 Watch data get encrypted and tunneled',disconnected:'Disconnected',connected:'Connected',mainSection:'Encryption Visual',mainDesc:'See data encrypted, tunneled, and decrypted',sectionA:'How VPNs Work',sectionB:'VPN Protocols',sectionC:'Encryption Algorithms',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is VPN Tunnel?',faq_a1:'A visual simulator showing how VPN encryption protects data.',faq_q2:'Is this real encryption?',faq_a2:'No, it is a visual simulation for learning.',faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Type a message.',howto_2:'Toggle encryption on or off.',howto_3:'Click Send to watch the tunnel.',howto_4:'Compare encrypted vs unencrypted.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'VPN log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🔒 VPN Tunnel ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',encryption:'🔐 Encryption',sendBtn:'Send',vpnText:'A VPN creates an encrypted tunnel between your device and a VPN server.',protoText:'Common VPN protocols: OpenVPN, WireGuard, IPSec/IKEv2, L2TP.',algoText:'VPNs use AES-256 symmetric encryption for data and RSA/ECDH for key exchange.',demoAlgo:'Demo AES Encryption',sending:'Sending through tunnel...',sent:'Message delivered!',plain:'Plaintext',encrypted:'Encrypted',noVPN:'⚠️ No VPN — data visible!',withVPN:'🔒 VPN — data encrypted!',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code'},
fr:{title:'VPN Tunnel',subtitle:'🔒 Regardez les donnees etre chiffrees',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Visualisation du chiffrement',mainDesc:'Voyez les donnees chiffrees et tunnelisees',sectionA:'Comment fonctionnent les VPN',sectionB:'Protocoles VPN',sectionC:'Algorithmes de chiffrement',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que VPN Tunnel ?',faq_a1:'Un simulateur visuel du chiffrement VPN.',faq_q2:'Est-ce du vrai chiffrement ?',faq_a2:'Non, c\'est une simulation visuelle.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvre Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui, local.',howto_1:'Tape un message.',howto_2:'Active ou desactive le chiffrement.',howto_3:'Clique Envoyer.',howto_4:'Compare chiffre vs non-chiffre.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal VPN.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🔒 VPN Tunnel pret !',logCleared:'Efface',copied:'Copie !',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'🔊 Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',encryption:'🔐 Chiffrement',sendBtn:'Envoyer',vpnText:'Un VPN cree un tunnel chiffre entre votre appareil et le serveur VPN.',protoText:'Protocoles VPN courants: OpenVPN, WireGuard, IPSec/IKEv2.',algoText:'Les VPN utilisent AES-256 pour les donnees et RSA/ECDH pour l\'echange de cles.',demoAlgo:'Demo chiffrement AES',sending:'Envoi dans le tunnel...',sent:'Message delivre !',plain:'Texte clair',encrypted:'Chiffre',noVPN:'⚠️ Pas de VPN — donnees visibles !',withVPN:'🔒 VPN — donnees chiffrees !',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil'},
ar:{title:'نفق VPN',subtitle:'🔒 شاهد البيانات تُشفّر وتُنقل بأمان',disconnected:'غير متصل',connected:'متصل',mainSection:'تصور التشفير',mainDesc:'شاهد البيانات تُشفّر وتُفك',sectionA:'كيف يعمل VPN',sectionB:'بروتوكولات VPN',sectionC:'خوارزميات التشفير',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو نفق VPN؟',faq_a1:'محاكي بصري يوضح كيف يحمي تشفير VPN البيانات.',faq_q2:'هل هذا تشفير حقيقي؟',faq_a2:'لا، محاكاة بصرية للتعلم.',faq_q3:'كيف أغيّر اللغة؟',faq_a3:'افتح الإعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم، محلي.',howto_1:'اكتب رسالة.',howto_2:'فعّل أو عطّل التشفير.',howto_3:'انقر إرسال.',howto_4:'قارن المشفر مع غير المشفر.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل',wiki_log:'سجل VPN.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي أولاً.',working:'جارٍ…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'🔒 نفق VPN جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',export:'تصدير',filterAll:'الكل',soundEffects:'🔊 أصوات',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',encryption:'🔐 التشفير',sendBtn:'إرسال',vpnText:'VPN ينشئ نفقاً مشفراً بين جهازك وخادم VPN.',protoText:'بروتوكولات VPN الشائعة: OpenVPN، WireGuard، IPSec.',algoText:'تستخدم VPN تشفير AES-256 للبيانات و RSA/ECDH لتبادل المفاتيح.',demoAlgo:'عرض تشفير AES',sending:'إرسال عبر النفق...',sent:'تم تسليم الرسالة!',plain:'نص عادي',encrypted:'مشفّر',noVPN:'⚠️ بدون VPN — البيانات مكشوفة!',withVPN:'🔒 VPN — البيانات مشفرة!',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer,typewriterEnabled=true;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(t==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(t==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({m,t,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='vpn-log.txt';a.click();URL.revokeObjectURL(u);}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
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
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 On':'🫁 Off','info');if(!breathingActive&&dhikrCount>0){log(`📿 ${dhikrCount}`,'success');dhikrCount=0;}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
let recognition=null,whisperActive=false;function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('🎤 Not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('🎤 Off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`🎤 ${t}`,'rx');}};recognition.onerror=e=>log(`🎤 ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('🎤 On','success');}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open');}function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const t=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ══════════════════════════════════════════════════════════════
   VPN TUNNEL ENGINE
   ══════════════════════════════════════════════════════════════ */
function fakeEncrypt(text){const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';let r='';for(let i=0;i<text.length*2;i++)r+=chars[Math.floor(Math.random()*chars.length)];return r;}
const NODES=[{x:80,y:150,label:'👩 Alice',color:'#22c55e'},{x:280,y:150,label:'🔒 VPN',color:'#3b82f6'},{x:480,y:150,label:'🌐 Internet',color:'#f59e0b'},{x:650,y:150,label:'🖥️ Server',color:'#a855f7'}];
let sending=false;

function drawTunnel(ctx,w,h,packetX,encrypted,packetData){
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0a1628';ctx.fillRect(0,0,w,h);
  // Tunnel tube (between VPN nodes)
  if(encrypted){
    ctx.fillStyle='rgba(59,130,246,0.08)';ctx.beginPath();
    ctx.moveTo(NODES[0].x,NODES[0].y-40);ctx.lineTo(NODES[3].x,NODES[3].y-40);
    ctx.lineTo(NODES[3].x,NODES[3].y+40);ctx.lineTo(NODES[0].x,NODES[0].y+40);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(59,130,246,0.2)';ctx.lineWidth=1;ctx.setLineDash([5,5]);
    ctx.strokeRect(NODES[1].x-20,NODES[1].y-35,NODES[2].x-NODES[1].x+40,70);ctx.setLineDash([]);
    ctx.fillStyle='rgba(59,130,246,0.4)';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('AES-256 ENCRYPTED TUNNEL',380,NODES[1].y-42);
  }
  // Connection lines
  for(let i=0;i<NODES.length-1;i++){
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(NODES[i].x,NODES[i].y);ctx.lineTo(NODES[i+1].x,NODES[i+1].y);ctx.stroke();
  }
  // Nodes
  NODES.forEach(n=>{
    ctx.beginPath();ctx.arc(n.x,n.y,25,0,Math.PI*2);ctx.fillStyle=n.color+'22';ctx.fill();
    ctx.strokeStyle=n.color;ctx.lineWidth=2;ctx.stroke();
    ctx.font='18px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(n.label.split(' ')[0],n.x,n.y);
    ctx.font='11px Tajawal,sans-serif';ctx.fillStyle=n.color;ctx.fillText(n.label.split(' ')[1]||'',n.x,n.y+35);
  });
  // Packet
  if(packetX>=0){
    ctx.beginPath();ctx.arc(packetX,150,10,0,Math.PI*2);
    ctx.fillStyle=encrypted?'#3b82f6':'#ef4444';ctx.globalAlpha=0.8;ctx.fill();ctx.globalAlpha=1;
    ctx.beginPath();ctx.arc(packetX,150,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
    // Data label
    if(packetData){
      ctx.font='9px monospace';ctx.fillStyle='rgba(255,255,255,0.7)';ctx.textAlign='center';
      const display=packetData.length>16?packetData.substring(0,16)+'...':packetData;
      ctx.fillText(display,packetX,130);
    }
  }
  ctx.textAlign='start';
}

async function sendMessage(){
  if(sending)return;const s=LANG[currentLang];
  const msg=$('msgInput').value.trim();if(!msg)return;
  const encrypted=$('encryptToggle').checked;
  sending=true;setStatus(true);showToast(s.sending);
  log(`📤 ${s.sending} "${msg}" ${encrypted?s.withVPN:s.noVPN}`,'tx');
  const encMsg=fakeEncrypt(msg);
  const canvas=$('tunnelCanvas');const ctx=canvas.getContext('2d');const w=canvas.width;
  // Stage displays
  $('stageAlice').textContent=msg;$('stageAlice').style.color='var(--text)';
  $('stageVPN').textContent='—';$('stageNet').textContent='—';$('stageServer').textContent='—';
  // Animate Alice → VPN
  for(let t=0;t<=30;t++){
    const x=NODES[0].x+(NODES[1].x-NODES[0].x)*(t/30);
    drawTunnel(ctx,w,300,x,encrypted,msg);await sleep(25);
  }
  playSound('click');
  // At VPN: encrypt
  if(encrypted){$('stageVPN').textContent=encMsg.substring(0,20)+'...';$('stageVPN').style.color='#3b82f6';log('🔒 Data encrypted at VPN server','info');}
  else{$('stageVPN').textContent=msg;$('stageVPN').style.color='#ef4444';log('⚠️ Data NOT encrypted — plaintext!','error');}
  await sleep(300);
  // VPN → Internet
  const transitData=encrypted?encMsg:msg;
  for(let t=0;t<=30;t++){
    const x=NODES[1].x+(NODES[2].x-NODES[1].x)*(t/30);
    drawTunnel(ctx,w,300,x,encrypted,transitData.substring(0,20));await sleep(25);
  }
  playSound('click');
  $('stageNet').textContent=encrypted?encMsg.substring(0,20)+'...':msg;
  $('stageNet').style.color=encrypted?'#3b82f6':'#ef4444';
  if(!encrypted)log('👁️ Eavesdropper can read: "'+msg+'"','error');
  else log('👁️ Eavesdropper sees only ciphertext','success');
  await sleep(300);
  // Internet → Server
  for(let t=0;t<=30;t++){
    const x=NODES[2].x+(NODES[3].x-NODES[2].x)*(t/30);
    drawTunnel(ctx,w,300,x,encrypted,encrypted?transitData.substring(0,20):msg);await sleep(25);
  }
  playSound('success');
  $('stageServer').textContent=msg;$('stageServer').style.color='#22c55e';
  drawTunnel(ctx,w,300,-1,encrypted,null);
  log(`${s.sent} Server received: "${msg}"`,'success');
  hideToast();sending=false;
}

function demoAlgo(){
  const r=$('algoResults');if(!r)return;
  const msg=$('msgInput').value.trim()||'Hello';
  const enc=fakeEncrypt(msg);
  r.style.display='block';
  r.innerHTML=`<div style="display:grid;gap:.3rem;"><div style="padding:.4rem;border-radius:6px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);font-family:monospace;font-size:.78rem;"><strong>Plaintext:</strong> ${msg}</div><div style="padding:.4rem;border-radius:6px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.3);font-family:monospace;font-size:.78rem;word-break:break-all;"><strong>AES-256-CBC:</strong> ${enc}</div><div style="padding:.4rem;border-radius:6px;background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.3);font-family:monospace;font-size:.78rem;"><strong>Key:</strong> ••••••••••••••••••••••••••••••••</div></div>`;
  log('🔐 AES-256 demo: plaintext → ciphertext','success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  $('whisperBtn').onclick=toggleWhisper;
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};if(db)db.onclick=incrementDhikr;
  $('musicBtn').onclick=()=>log('🎵 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();initPixelPet();
  // App specific
  $('sendBtn').onclick=sendMessage;
  $('demoAlgoBtn').onclick=demoAlgo;
  // Initial render
  const c=$('tunnelCanvas');if(c){const ctx=c.getContext('2d');drawTunnel(ctx,c.width,300,-1,true,null);}
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: VPN Tunnel Encryption Pipe Visualizer ═══════ */
(function(){
let vCanvas,vCtx;const tunnelParticles=[];let tunnelActive=false;
function createVC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">VPN Encryption Tunnel Flow</div>';
  const c=document.createElement('canvas');c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
const TUNNEL_NODES=[
  {x:60,y:130,label:'Client',icon:'💻',color:'#22c55e'},
  {x:200,y:130,label:'VPN Client',icon:'🔐',color:'#3b82f6'},
  {x:420,y:130,label:'VPN Server',icon:'🔐',color:'#8b5cf6'},
  {x:560,y:130,label:'Internet',icon:'🌐',color:'#f59e0b'},
];
function drawVC(){
  if(!vCtx)return;const w=vCanvas.width,h=vCanvas.height;
  vCtx.fillStyle='rgba(6,13,26,0.1)';vCtx.fillRect(0,0,w,h);
  // Grid
  vCtx.strokeStyle='rgba(255,255,255,0.02)';vCtx.lineWidth=0.5;
  for(let x=0;x<w;x+=20){vCtx.beginPath();vCtx.moveTo(x,0);vCtx.lineTo(x,h);vCtx.stroke();}
  // Tunnel pipe (between VPN client and server)
  const tStart=TUNNEL_NODES[1].x+20,tEnd=TUNNEL_NODES[2].x-20;
  const tY=130,tH=50;
  // Outer pipe
  vCtx.fillStyle='rgba(59,130,246,0.05)';
  vCtx.beginPath();vCtx.moveTo(tStart,tY-tH/2);
  vCtx.lineTo(tEnd,tY-tH/2);vCtx.lineTo(tEnd,tY+tH/2);vCtx.lineTo(tStart,tY+tH/2);vCtx.closePath();vCtx.fill();
  // Pipe border
  vCtx.strokeStyle='rgba(59,130,246,0.2)';vCtx.lineWidth=2;
  vCtx.beginPath();vCtx.moveTo(tStart,tY-tH/2);vCtx.lineTo(tEnd,tY-tH/2);vCtx.stroke();
  vCtx.beginPath();vCtx.moveTo(tStart,tY+tH/2);vCtx.lineTo(tEnd,tY+tH/2);vCtx.stroke();
  // Encryption text inside pipe
  const encT=Date.now()/100;
  for(let x=tStart;x<tEnd;x+=30){
    const char='0123456789abcdef'[Math.floor(Math.random()*16)];
    vCtx.fillStyle='rgba(59,130,246,0.15)';vCtx.font='10px monospace';vCtx.textAlign='center';
    vCtx.fillText(char,x+(encT%30),tY+Math.sin(x*0.05+encT/50)*15);
  }
  vCtx.fillStyle='rgba(59,130,246,0.3)';vCtx.font='10px Orbitron,sans-serif';vCtx.textAlign='center';
  vCtx.fillText('ENCRYPTED TUNNEL',tStart+(tEnd-tStart)/2,tY-tH/2-8);
  // Connections outside tunnel
  [[0,1],[2,3]].forEach(([a,b])=>{
    vCtx.beginPath();vCtx.moveTo(TUNNEL_NODES[a].x,TUNNEL_NODES[a].y);
    vCtx.lineTo(TUNNEL_NODES[b].x,TUNNEL_NODES[b].y);
    vCtx.strokeStyle='rgba(255,255,255,0.1)';vCtx.lineWidth=1;vCtx.setLineDash([4,4]);vCtx.stroke();vCtx.setLineDash([]);
  });
  // Nodes
  TUNNEL_NODES.forEach(n=>{
    vCtx.beginPath();vCtx.arc(n.x,n.y,18,0,Math.PI*2);
    vCtx.fillStyle=n.color+'25';vCtx.fill();vCtx.strokeStyle=n.color;vCtx.lineWidth=2;vCtx.stroke();
    vCtx.fillStyle='#fff';vCtx.font='14px serif';vCtx.textAlign='center';vCtx.fillText(n.icon,n.x,n.y+5);
    vCtx.fillStyle=n.color;vCtx.font='8px Orbitron,monospace';vCtx.fillText(n.label,n.x,n.y+32);
  });
  // Data particles through tunnel
  if(Math.random()>0.7||tunnelActive){
    const isEncrypted=Math.random()>0.3;
    const startNode=Math.random()>0.5?0:3;
    const path=startNode===0?[0,1,2,3]:[3,2,1,0];
    tunnelParticles.push({pathIdx:0,path,t:0,speed:0.01+Math.random()*0.015,
      color:isEncrypted?'#3b82f6':'#ef4444',encrypted:isEncrypted,size:3+Math.random()*2});
  }
  for(let i=tunnelParticles.length-1;i>=0;i--){
    const p=tunnelParticles[i];p.t+=p.speed;
    const totalSegs=p.path.length-1;const seg=Math.min(Math.floor(p.t*totalSegs),totalSegs-1);
    const segT=(p.t*totalSegs)-seg;
    if(seg>=totalSegs){tunnelParticles.splice(i,1);continue;}
    const a=TUNNEL_NODES[p.path[seg]],b=TUNNEL_NODES[p.path[seg+1]];
    const px=a.x+(b.x-a.x)*segT;
    const py=a.y+(b.y-a.y)*segT+(p.encrypted?Math.sin(px*0.05)*15:0);
    vCtx.beginPath();vCtx.arc(px,py,p.size,0,Math.PI*2);
    vCtx.fillStyle=p.color;vCtx.fill();
    vCtx.beginPath();vCtx.arc(px,py,p.size+3,0,Math.PI*2);
    vCtx.strokeStyle=p.color+'44';vCtx.lineWidth=1;vCtx.stroke();
  }
  // Stats
  vCtx.fillStyle='rgba(255,255,255,0.3)';vCtx.font='8px monospace';vCtx.textAlign='left';
  const enc=tunnelParticles.filter(p=>p.encrypted).length;const plain=tunnelParticles.length-enc;
  vCtx.fillText('Encrypted: '+enc+' | Plaintext: '+plain+' | Cipher: AES-256-CBC | Protocol: WireGuard',10,h-8);
  // Warning for plaintext
  if(plain>0){vCtx.fillStyle='rgba(239,68,68,0.5)';vCtx.fillText('WARNING: Unencrypted traffic detected outside tunnel!',10,h-20);}
  requestAnimationFrame(drawVC);
}
function initVC(){vCanvas=createVC();if(!vCanvas)return;vCtx=vCanvas.getContext('2d');
  vCanvas.addEventListener('click',()=>{tunnelActive=!tunnelActive;});
  drawVC();}
setTimeout(initVC,2000);
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
