/**
 * Protocol Decoder — Packet Autopsy
 * Workshop DIY — Net Browser Collection
 * Paste hex and watch layer-by-layer decoding
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/></svg>`;
const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xgAADEhJREFUeNrtmXtsVNedx7/n3Nfce2eu5+kZezx+MOMZO2PjOOAHBNdAbAR2Uchjo6br7YISqFiiRFrSKIrUAGLdpJtEVTdSkaJVUsRuVEVyE2GSUqALbDYP0WR5WCU2sbFj3MTYBgebuWPPzL1n/wCzxPEjJgmj1c5HOn/NOb97vt9zH7/fb4AMGTJkyJAhQ4YMGf4/Qr6LICdOnIAoimRychIAWE1NTbp1ff+89dZbsNlsiEaj2W63+6eapu212Wyvulyuza';
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08; const t = audioCtx.currentTime; switch(type) { case 'click': osc.frequency.value=800; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break; case 'success': osc.frequency.value=523; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break; case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break; } }

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Protocol Decoder', subtitle:'📋 Layer-by-layer packet decoding',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Packet Autopsy', mainDesc:'Paste hex and watch layer-by-layer decoding',
    sectionA:'OSI Model Layers', sectionB:'Hex Encoding Guide', sectionC:'Protocol Reference',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'⚙️ Settings', language:'Language',
    help:'❓ Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    faq_q1:'What is Protocol Decoder?', faq_a1:'A packet autopsy tool that decodes hex data into protocol layers with animated visualization.',
    faq_q2:'Is this real packet analysis?', faq_a2:'No, this is a simulation for educational purposes.',
    faq_q3:'How do I change the language?', faq_a3:'Open Settings and pick your language. Arabic enables RTL automatically.',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser.',
    howto_1:'Paste hex bytes or click a sample button.', howto_2:'Click Decode to start layer-by-layer parsing.',
    howto_3:'Watch each protocol layer appear with color-coded fields.', howto_4:'Open Section C for protocol field reference.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 built-in themes.', wiki_i18n_title:'🌐 Languages', wiki_i18n:'Trilingual: EN, FR, AR with RTL.',
    wiki_log_title:'📜 Activity Log', wiki_log:'Timestamped, color-coded log.', wiki_privacy_title:'🔒 Privacy', wiki_privacy:'Local-first. All data stays in your browser.',
    working:'Working…', t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina', t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'📋 Protocol Decoder ready!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    export:'Export', filterAll:'All', soundEffects:'🔊 Sound effects', whisperMode:'Whisper mode', breathingGuide:'Breathing guide', dhikrTap:'Tap', musicMode:'Music reactive',
    splashHint:'tap to skip', newVersion:'UPDATE', langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →',
    hexPlaceholder:'Paste hex bytes here...', decodeBtn:'Decode',
    sampleHTTP:'HTTP GET', sampleDNS:'DNS Query', sampleTCP:'TCP SYN',
    osiText:'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Network packets are encapsulated layer by layer.',
    hexText:'Hexadecimal (base-16) represents binary data using digits 0-9 and letters A-F. Each hex pair represents one byte.',
    protoRefText:'Quick reference for common protocol fields and their byte positions in a packet.',
    showRefBtn:'Show Reference Table',
    layerEthernet:'Ethernet Layer (L2)', layerIP:'IP Layer (L3)', layerTCP:'TCP Layer (L4)', layerHTTP:'HTTP Layer (L7)',
    layerUDP:'UDP Layer (L4)', layerDNS:'DNS Layer (L7)',
    decoding:'Decoding packet...', decoded:'Packet decoded!', invalidHex:'Invalid hex input',
    srcMAC:'Src MAC', dstMAC:'Dst MAC', etherType:'EtherType',
    srcIP:'Src IP', dstIP:'Dst IP', ttl:'TTL', protocol:'Protocol', version:'Version', headerLen:'Header Length',
    srcPort:'Src Port', dstPort:'Dst Port', seqNum:'Seq Number', flags:'Flags', windowSize:'Window Size',
    method:'Method', host:'Host', path:'Path', httpVer:'HTTP Version',
  ,step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code'},
  fr: {
    title:'Protocol Decoder', subtitle:'📋 Decodage couche par couche',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Autopsie de paquet', mainDesc:'Collez du hex et regardez le decodage couche par couche',
    sectionA:'Couches du modele OSI', sectionB:'Guide encodage hex', sectionC:'Reference protocoles',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'⚙️ Parametres', language:'Langue',
    help:'❓ Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    faq_q1:'Qu\'est-ce que Protocol Decoder ?', faq_a1:'Un outil d\'autopsie de paquets qui decode les donnees hex en couches protocolaires.',
    faq_q2:'Est-ce une vraie analyse ?', faq_a2:'Non, c\'est une simulation educative.',
    faq_q3:'Comment changer la langue ?', faq_a3:'Ouvre Parametres et choisis ta langue.',
    faq_q4:'Mes donnees sont privees ?', faq_a4:'Oui. Tout fonctionne localement.',
    howto_1:'Colle des octets hex ou clique sur un exemple.', howto_2:'Clique Decoder pour le parsing anime.',
    howto_3:'Regarde chaque couche apparaitre.', howto_4:'Ouvre Section C pour la reference.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 themes integres.', wiki_i18n_title:'🌐 Langues', wiki_i18n:'Trilingue : EN, FR, AR.',
    wiki_log_title:'📜 Journal', wiki_log:'Journal horodate.', wiki_privacy_title:'🔒 Confidentialite', wiki_privacy:'Local-first.',
    working:'En cours…', t_mosque:'Mosquee', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'Medina', t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'📋 Protocol Decoder pret !', logCleared:'Journal efface', copied:'Copie !', copyFail:'Echec',
    export:'Exporter', filterAll:'Tout', soundEffects:'🔊 Effets sonores', whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire', dhikrTap:'Tap', musicMode:'Reactif musique',
    splashHint:'appuyer pour passer', newVersion:'MAJ', langChanged:'🌐 Langue → Francais', themeChanged:'🎨 Theme →',
    hexPlaceholder:'Collez des octets hex ici...', decodeBtn:'Decoder',
    sampleHTTP:'HTTP GET', sampleDNS:'Requete DNS', sampleTCP:'TCP SYN',
    osiText:'Le modele OSI a 7 couches. Les paquets sont encapsules couche par couche.',
    hexText:'L\'hexadecimal (base-16) represente les donnees binaires avec 0-9 et A-F.',
    protoRefText:'Reference rapide des champs protocolaires.', showRefBtn:'Afficher la reference',
    layerEthernet:'Couche Ethernet (L2)', layerIP:'Couche IP (L3)', layerTCP:'Couche TCP (L4)', layerHTTP:'Couche HTTP (L7)',
    layerUDP:'Couche UDP (L4)', layerDNS:'Couche DNS (L7)',
    decoding:'Decodage du paquet...', decoded:'Paquet decode !', invalidHex:'Hex invalide',
    srcMAC:'MAC Src', dstMAC:'MAC Dst', etherType:'EtherType',
    srcIP:'IP Src', dstIP:'IP Dst', ttl:'TTL', protocol:'Protocole', version:'Version', headerLen:'Longueur entete',
    srcPort:'Port Src', dstPort:'Port Dst', seqNum:'Num Sequence', flags:'Drapeaux', windowSize:'Taille fenetre',
    method:'Methode', host:'Hote', path:'Chemin', httpVer:'Version HTTP',
  ,step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil'},
  ar: {
    title:'محلل البروتوكول', subtitle:'📋 فك تشفير الحزم طبقة بطبقة',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'تشريح الحزمة', mainDesc:'الصق hex وشاهد الفك طبقة بطبقة',
    sectionA:'طبقات نموذج OSI', sectionB:'دليل ترميز Hex', sectionC:'مرجع البروتوكولات',
    activityLog:'سجل النشاط', eventsMsg:'الأحداث والرسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'⚙️ الإعدادات', language:'اللغة',
    help:'❓ مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    faq_q1:'ما هو محلل البروتوكول؟', faq_a1:'أداة تشريح حزم تفك بيانات hex إلى طبقات بروتوكولية بتصور متحرك.',
    faq_q2:'هل هذا تحليل حقيقي؟', faq_a2:'لا، هذه محاكاة تعليمية.',
    faq_q3:'كيف أغيّر اللغة؟', faq_a3:'افتح الإعدادات واختر لغتك.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محلياً.',
    howto_1:'الصق hex أو انقر على مثال.', howto_2:'انقر فك التشفير للتحليل المتحرك.',
    howto_3:'شاهد كل طبقة تظهر بألوان مميزة.', howto_4:'افتح القسم C للمرجع.',
    wiki_themes_title:'🎨 المظاهر', wiki_themes:'8 مظاهر مدمجة.', wiki_i18n_title:'🌐 اللغات', wiki_i18n:'ثلاثي اللغات.',
    wiki_log_title:'📜 سجل النشاط', wiki_log:'سجل مؤرّخ.', wiki_privacy_title:'🔒 الخصوصية', wiki_privacy:'محلي أولاً.',
    working:'جارٍ…', t_mosque:'مسجد', t_zellige:'زليج', t_andalus:'أندلس', t_riad:'رياض', t_medina:'مدينة', t_space:'فضاء', t_jungle:'أدغال', t_robot:'روبوت',
    ready:'📋 محلل البروتوكول جاهز!', logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    export:'تصدير', filterAll:'الكل', soundEffects:'🔊 مؤثرات صوتية', whisperMode:'وضع الهمس', breathingGuide:'دليل التنفس', dhikrTap:'اضغط', musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي', newVersion:'تحديث', langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←',
    hexPlaceholder:'الصق بايتات hex هنا...', decodeBtn:'فك التشفير',
    sampleHTTP:'HTTP GET', sampleDNS:'استعلام DNS', sampleTCP:'TCP SYN',
    osiText:'نموذج OSI يحتوي 7 طبقات. الحزم مغلفة طبقة بطبقة.',
    hexText:'النظام الست عشري يمثل البيانات الثنائية باستخدام 0-9 و A-F.',
    protoRefText:'مرجع سريع لحقول البروتوكولات.', showRefBtn:'عرض جدول المرجع',
    layerEthernet:'طبقة Ethernet (L2)', layerIP:'طبقة IP (L3)', layerTCP:'طبقة TCP (L4)', layerHTTP:'طبقة HTTP (L7)',
    layerUDP:'طبقة UDP (L4)', layerDNS:'طبقة DNS (L7)',
    decoding:'جاري فك تشفير الحزمة...', decoded:'تم فك تشفير الحزمة!', invalidHex:'إدخال hex غير صالح',
    srcMAC:'MAC المصدر', dstMAC:'MAC الوجهة', etherType:'نوع Ether',
    srcIP:'IP المصدر', dstIP:'IP الوجهة', ttl:'TTL', protocol:'بروتوكول', version:'إصدار', headerLen:'طول الرأس',
    srcPort:'منفذ المصدر', dstPort:'منفذ الوجهة', seqNum:'رقم التسلسل', flags:'أعلام', windowSize:'حجم النافذة',
    method:'الطريقة', host:'المضيف', path:'المسار', httpVer:'إصدار HTTP',
  ,step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز'}
};

let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; }); document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; }); document.title = `${s.title} — Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; const s = LANG[currentLang]; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${s.themeChanged} ${s['t_'+name]||name}`, 'info'); }

let logContainer, typewriterEnabled = true;
function log(msg, type='info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; const ft = `[${new Date().toLocaleTimeString()}] ${msg}`; if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, ft); } else { d.textContent = ft; logContainer.appendChild(d); } logContainer.scrollTop = logContainer.scrollHeight; if (type==='success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); } else if (type==='error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); } logHistory.push({msg,type,ts:Date.now()}); applyLogFilter(); resetPetSleep(); }
function clearLog() { if (!logContainer) logContainer=$('logContainer'); if (logContainer) logContainer.innerHTML=''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer=$('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d=>d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied,'success'); } catch { log(LANG[currentLang].copyFail,'error'); } }
function exportLog() { if (!logContainer) logContainer=$('logContainer'); if (!logContainer) return; const blob = new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}); const u=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=u; a.download=`protocol-decoder-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(u); }

let toastTimer = null;
function showToast(msg, ms=0) { const el=$('toastIndicator'),t=$('toastMessage'); if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';} if(toastTimer)clearTimeout(toastTimer); if(ms>0)toastTimer=setTimeout(hideToast,ms); }
function hideToast() { const el=$('toastIndicator'); if(el)el.style.display='none'; if(toastTimer){clearTimeout(toastTimer);toastTimer=null;} }
function setStatus(c) { const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang]; if(t)t.textContent=c?s.connected:s.disconnected; if(p)p.classList.toggle('connected',c); }
let splashTimer;
function dismissSplash() { const s=$('splash'); if(!s)return; s.classList.add('hidden'); if(splashTimer)clearTimeout(splashTimer); setTimeout(()=>s.remove(),600); playSound('click'); }
function initSplash() { const s=$('splash'); if(!s)return; const sl=$('splashLogo'); if(sl)sl.innerHTML=LOGO_SVG; splashTimer=setTimeout(dismissSplash,2500); }

function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }
async function typewriterAppend(el, text) { el.classList.add('typing'); el.textContent=''; for(let i=0;i<text.length;i++){el.textContent+=text[i]; if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight; await sleep(12+Math.random()*18);} el.classList.remove('typing'); }
const logHistory = [];
function pulseBismillah(type) { const b=document.querySelector('.bismillah'); if(!b)return; b.classList.remove('pulse-success','pulse-error'); void b.offsetWidth; b.classList.add(type==='error'?'pulse-error':'pulse-success'); setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700); }

const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name) { if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx(); const notes=THEME_MELODIES[name]; if(!notes)return; const t=audioCtx.currentTime; notes.forEach((f,i)=>{const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);}); }

let activeLogFilter='all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});}); }
function applyLogFilter() { if(!logContainer)logContainer=$('logContainer'); if(!logContainer)return; Array.from(logContainer.children).forEach(l=>{if(activeLogFilter==='all'){l.style.display='';return;} l.style.display=l.classList.contains(activeLogFilter)?'':'none';}); }

const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};
let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);const d=PET_STATES[s].duration;if(d>0)petIdleTimer=setTimeout(()=>setPetState('idle'),d);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive){bands.forEach(b=>b.classList.add('breathing'));log('🫁 Breathing guide on','info');}else{bands.forEach(b=>b.classList.remove('breathing'));if(dhikrCount>0)log(`📿 Dhikr: ${dhikrCount}`,'success');dhikrCount=0;log('🫁 Breathing guide off','info');}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}

let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('🎤 Speech not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('🎤 Whisper off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`🎤 ${t}`,'rx');}}};recognition.onerror=e=>log(`🎤 Error: ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('🎤 Whisper on','success');}

const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');if(sb){const f=sb.querySelector(FOCUSABLE);if(f)f.focus();}}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const t=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';});}

const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

let matrixRunning=false,matrixAnim=null;
const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16);const drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';let cc=0,ct=null;l.addEventListener('click',()=>{cc++;if(ct)clearTimeout(ct);if(cc>=3){cc=0;toggleMatrix();}else ct=setTimeout(()=>cc=0,500);});}

/* ══════════════════════════════════════════════════════════════
   PROTOCOL DECODER ENGINE
   ══════════════════════════════════════════════════════════════ */

const LAYER_COLORS = {
  ethernet: '#3b82f6',
  ip: '#22c55e',
  tcp: '#f59e0b',
  udp: '#a855f7',
  http: '#ef4444',
  dns: '#ec4899',
};

const SAMPLE_PACKETS = {
  http: 'AA BB CC DD EE FF 11 22 33 44 55 66 08 00 45 00 00 3C 1C 46 40 00 40 06 B1 E6 AC 10 0A 63 D8 3A D0 8E C0 A8 00 50 00 00 00 01 00 00 00 00 50 02 20 00 91 7C 00 00 47 45 54 20 2F 69 6E 64 65 78 2E 68 74 6D 6C 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 65 78 61 6D 70 6C 65 2E 63 6F 6D',
  dns: 'AA BB CC DD EE FF 11 22 33 44 55 66 08 00 45 00 00 3C 1C 46 40 00 40 11 B1 E6 AC 10 0A 63 08 08 08 08 C3 50 00 35 00 28 00 00 AB CD 01 00 00 01 00 00 00 00 00 00 07 65 78 61 6D 70 6C 65 03 63 6F 6D 00 00 01 00 01',
  tcp: 'AA BB CC DD EE FF 11 22 33 44 55 66 08 00 45 00 00 28 1C 46 40 00 40 06 B1 E6 C0 A8 01 64 D8 3A D0 8E C0 01 01 BB 00 00 00 00 00 00 00 00 50 02 72 10 00 00 00 00',
};

function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.substr(i, 2), 16));
  }
  return bytes;
}

function bytesToMAC(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
}

function bytesToIP(bytes) {
  return bytes.join('.');
}

function bytesToHex(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

function bytesToASCII(bytes) {
  return bytes.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
}

function createLayerCard(title, color, fields, byteRange) {
  const div = document.createElement('div');
  div.style.cssText = `border-left:4px solid ${color};border-radius:8px;padding:.7rem;margin-bottom:.5rem;background:rgba(0,0,0,.2);border:1px solid var(--border);border-left:4px solid ${color};opacity:0;transform:translateY(10px);transition:opacity .4s,transform .4s;`;
  let html = `<div style="font-weight:700;font-size:.85rem;color:${color};margin-bottom:.3rem;">${title}</div>`;
  html += `<div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.3rem;">Bytes ${byteRange}</div>`;
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.3rem;">';
  fields.forEach(([label, value]) => {
    html += `<div style="font-size:.78rem;"><span style="color:var(--text-muted);">${label}:</span> <span style="color:var(--text);font-family:monospace;">${value}</span></div>`;
  });
  html += '</div>';
  div.innerHTML = html;
  return div;
}

function decodeEthernet(bytes, s) {
  const dstMAC = bytesToMAC(bytes.slice(0, 6));
  const srcMAC = bytesToMAC(bytes.slice(6, 12));
  const etherType = '0x' + bytes[12].toString(16).padStart(2, '0') + bytes[13].toString(16).padStart(2, '0');
  const etherLabel = etherType === '0x0800' ? 'IPv4' : etherType === '0x86dd' ? 'IPv6' : etherType === '0x0806' ? 'ARP' : etherType;
  return createLayerCard(s.layerEthernet, LAYER_COLORS.ethernet, [
    [s.dstMAC, dstMAC], [s.srcMAC, srcMAC], [s.etherType, `${etherType} (${etherLabel})`]
  ], '0-13');
}

function decodeIP(bytes, offset, s) {
  const ver = (bytes[offset] >> 4);
  const ihl = (bytes[offset] & 0x0F) * 4;
  const ttl = bytes[offset + 8];
  const proto = bytes[offset + 9];
  const protoName = proto === 6 ? 'TCP' : proto === 17 ? 'UDP' : proto === 1 ? 'ICMP' : proto.toString();
  const srcIP = bytesToIP(bytes.slice(offset + 12, offset + 16));
  const dstIP = bytesToIP(bytes.slice(offset + 16, offset + 20));
  return { card: createLayerCard(s.layerIP, LAYER_COLORS.ip, [
    [s.version, 'IPv' + ver], [s.headerLen, ihl + ' bytes'], [s.ttl, ttl.toString()],
    [s.protocol, `${proto} (${protoName})`], [s.srcIP, srcIP], [s.dstIP, dstIP]
  ], `14-${13 + ihl}`), proto, ihl };
}

function decodeTCP(bytes, offset, s) {
  const srcPort = (bytes[offset] << 8) | bytes[offset + 1];
  const dstPort = (bytes[offset + 2] << 8) | bytes[offset + 3];
  const seqNum = ((bytes[offset+4]<<24)|(bytes[offset+5]<<16)|(bytes[offset+6]<<8)|bytes[offset+7])>>>0;
  const dataOff = (bytes[offset + 12] >> 4) * 4;
  const flagsByte = bytes[offset + 13];
  const flagNames = [];
  if (flagsByte & 0x02) flagNames.push('SYN');
  if (flagsByte & 0x10) flagNames.push('ACK');
  if (flagsByte & 0x01) flagNames.push('FIN');
  if (flagsByte & 0x04) flagNames.push('RST');
  if (flagsByte & 0x08) flagNames.push('PSH');
  const win = (bytes[offset + 14] << 8) | bytes[offset + 15];
  return { card: createLayerCard(s.layerTCP, LAYER_COLORS.tcp, [
    [s.srcPort, srcPort.toString()], [s.dstPort, dstPort.toString()],
    [s.seqNum, seqNum.toString()], [s.flags, flagNames.join(', ') || 'none'],
    [s.windowSize, win.toString()]
  ], `${offset}-${offset + dataOff - 1}`), dataOff };
}

function decodeUDP(bytes, offset, s) {
  const srcPort = (bytes[offset] << 8) | bytes[offset + 1];
  const dstPort = (bytes[offset + 2] << 8) | bytes[offset + 3];
  const length = (bytes[offset + 4] << 8) | bytes[offset + 5];
  return { card: createLayerCard(s.layerUDP, LAYER_COLORS.udp, [
    [s.srcPort, srcPort.toString()], [s.dstPort, dstPort.toString()],
    ['Length', length + ' bytes']
  ], `${offset}-${offset + 7}`) };
}

function decodeHTTP(bytes, offset, s) {
  const ascii = bytesToASCII(bytes.slice(offset));
  const lines = ascii.split('\r\n').filter(l => l.length > 0);
  const fields = [];
  if (lines[0]) {
    const parts = lines[0].split(' ');
    fields.push([s.method, parts[0] || '?']);
    fields.push([s.path, parts[1] || '?']);
    fields.push([s.httpVer, parts[2] || '?']);
  }
  for (let i = 1; i < Math.min(lines.length, 4); i++) {
    const [k, ...v] = lines[i].split(':');
    if (k && v.length) fields.push([k.trim(), v.join(':').trim()]);
  }
  return createLayerCard(s.layerHTTP, LAYER_COLORS.http, fields, `${offset}-${bytes.length - 1}`);
}

function decodeDNS(bytes, offset, s) {
  const id = '0x' + ((bytes[offset] << 8) | bytes[offset + 1]).toString(16).padStart(4, '0');
  const flags = '0x' + ((bytes[offset + 2] << 8) | bytes[offset + 3]).toString(16).padStart(4, '0');
  const qdCount = (bytes[offset + 4] << 8) | bytes[offset + 5];
  // Parse domain name
  let domain = '', i = offset + 12;
  while (i < bytes.length && bytes[i] !== 0) {
    const len = bytes[i]; i++;
    for (let j = 0; j < len && i < bytes.length; j++, i++) domain += String.fromCharCode(bytes[i]);
    if (bytes[i] !== 0) domain += '.';
  }
  return createLayerCard(s.layerDNS, LAYER_COLORS.dns, [
    ['Transaction ID', id], ['Flags', flags],
    ['Questions', qdCount.toString()], ['Query', domain || 'N/A']
  ], `${offset}-${bytes.length - 1}`);
}

let decoding = false;

async function runDecode() {
  if (decoding) return;
  const s = LANG[currentLang];
  const hexInput = $('hexInput').value.trim();
  if (!hexInput) { log(s.invalidHex, 'error'); return; }

  const bytes = hexToBytes(hexInput);
  if (bytes.length < 14) { log(s.invalidHex, 'error'); return; }

  decoding = true;
  setStatus(true);
  showToast(s.decoding);
  log(s.decoding, 'tx');

  const output = $('layerOutput');
  output.innerHTML = '';

  // Hex dump display
  const hexDump = document.createElement('div');
  hexDump.style.cssText = 'font-family:monospace;font-size:.72rem;line-height:1.6;padding:.5rem;border-radius:8px;background:rgba(0,0,0,.3);border:1px solid var(--border);margin-bottom:.5rem;word-break:break-all;';
  hexDump.id = 'hexDump';
  hexDump.textContent = bytesToHex(bytes);
  output.appendChild(hexDump);

  await sleep(400);

  // Layer 2: Ethernet
  const ethCard = decodeEthernet(bytes, s);
  output.appendChild(ethCard);
  requestAnimationFrame(() => { ethCard.style.opacity = '1'; ethCard.style.transform = 'translateY(0)'; });
  log(`${s.layerEthernet}: ${bytesToMAC(bytes.slice(6,12))} → ${bytesToMAC(bytes.slice(0,6))}`, 'info');
  playSound('click');
  await sleep(600);

  // Layer 3: IP
  if (bytes.length >= 34) {
    const { card: ipCard, proto, ihl } = decodeIP(bytes, 14, s);
    output.appendChild(ipCard);
    requestAnimationFrame(() => { ipCard.style.opacity = '1'; ipCard.style.transform = 'translateY(0)'; });
    log(`${s.layerIP}: ${bytesToIP(bytes.slice(26,30))} → ${bytesToIP(bytes.slice(30,34))}`, 'info');
    playSound('click');
    await sleep(600);

    const l4Offset = 14 + ihl;

    // Layer 4: TCP or UDP
    if (proto === 6 && bytes.length >= l4Offset + 20) {
      const { card: tcpCard, dataOff } = decodeTCP(bytes, l4Offset, s);
      output.appendChild(tcpCard);
      requestAnimationFrame(() => { tcpCard.style.opacity = '1'; tcpCard.style.transform = 'translateY(0)'; });
      const sp = (bytes[l4Offset]<<8)|bytes[l4Offset+1], dp = (bytes[l4Offset+2]<<8)|bytes[l4Offset+3];
      log(`${s.layerTCP}: :${sp} → :${dp}`, 'info');
      playSound('click');
      await sleep(600);

      // Layer 7: HTTP
      const appOffset = l4Offset + dataOff;
      if (appOffset < bytes.length) {
        const httpCard = decodeHTTP(bytes, appOffset, s);
        output.appendChild(httpCard);
        requestAnimationFrame(() => { httpCard.style.opacity = '1'; httpCard.style.transform = 'translateY(0)'; });
        log(`${s.layerHTTP}: ${bytesToASCII(bytes.slice(appOffset, appOffset + 20))}...`, 'info');
        playSound('click');
      }
    } else if (proto === 17 && bytes.length >= l4Offset + 8) {
      const { card: udpCard } = decodeUDP(bytes, l4Offset, s);
      output.appendChild(udpCard);
      requestAnimationFrame(() => { udpCard.style.opacity = '1'; udpCard.style.transform = 'translateY(0)'; });
      const dp = (bytes[l4Offset+2]<<8)|bytes[l4Offset+3];
      log(`${s.layerUDP}: port ${dp}`, 'info');
      playSound('click');
      await sleep(600);

      // Layer 7: DNS
      if (dp === 53 && bytes.length > l4Offset + 8) {
        const dnsCard = decodeDNS(bytes, l4Offset + 8, s);
        output.appendChild(dnsCard);
        requestAnimationFrame(() => { dnsCard.style.opacity = '1'; dnsCard.style.transform = 'translateY(0)'; });
        log(`${s.layerDNS}: query decoded`, 'info');
        playSound('click');
      }
    }
  }

  hideToast();
  decoding = false;
  log(s.decoded, 'success');
}

function showProtoRef() {
  const s = LANG[currentLang];
  const r = $('refResults');
  if (!r) return;
  r.style.display = 'block';
  r.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:.78rem;">
      <thead><tr style="border-bottom:2px solid var(--accent);"><th style="text-align:left;padding:.3rem;">Layer</th><th style="text-align:left;padding:.3rem;">Field</th><th style="text-align:left;padding:.3rem;">Bytes</th><th style="text-align:left;padding:.3rem;">Size</th></tr></thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ethernet};">Ethernet</td><td>Dst MAC</td><td>0-5</td><td>6B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ethernet};">Ethernet</td><td>Src MAC</td><td>6-11</td><td>6B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ethernet};">Ethernet</td><td>EtherType</td><td>12-13</td><td>2B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ip};">IP</td><td>Src IP</td><td>26-29</td><td>4B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ip};">IP</td><td>Dst IP</td><td>30-33</td><td>4B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ip};">IP</td><td>TTL</td><td>22</td><td>1B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.tcp};">TCP</td><td>Src Port</td><td>34-35</td><td>2B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.tcp};">TCP</td><td>Dst Port</td><td>36-37</td><td>2B</td></tr>
        <tr><td style="padding:.3rem;color:${LAYER_COLORS.tcp};">TCP</td><td>Flags</td><td>47</td><td>1B</td></tr>
      </tbody>
    </table>`;
  log('📖 Protocol reference shown', 'success');
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw)lw.innerHTML=LOGO_SVG;
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
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtnEl=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtnEl)dhikrBtnEl.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=()=>log('🎵 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();initPixelPet();

  // App-specific
  $('decodeBtn').onclick = runDecode;
  $('sample1Btn').onclick = () => { $('hexInput').value = SAMPLE_PACKETS.http; playSound('click'); };
  $('sample2Btn').onclick = () => { $('hexInput').value = SAMPLE_PACKETS.dns; playSound('click'); };
  $('sample3Btn').onclick = () => { $('hexInput').value = SAMPLE_PACKETS.tcp; playSound('click'); };
  const showRefBtnEl = $('showRefBtn');
  if (showRefBtnEl) showRefBtnEl.onclick = showProtoRef;

  log(LANG[currentLang].ready, 'success');
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Protocol Stack Visualizer Canvas ═══════ */
(function(){
let psCanvas,psCtx;const stackLayers=[];const dataFlow=[];
function createPS(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">OSI Protocol Stack Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=280;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
const OSI_LAYERS=[
  {name:'Application',proto:'HTTP/DNS/FTP',color:'#ef4444',y:0},
  {name:'Transport',proto:'TCP/UDP',color:'#f59e0b',y:0},
  {name:'Network',proto:'IP/ICMP',color:'#22c55e',y:0},
  {name:'Data Link',proto:'Ethernet/WiFi',color:'#3b82f6',y:0},
  {name:'Physical',proto:'Bits/Signals',color:'#8b5cf6',y:0},
];
function drawPS(){
  if(!psCtx)return;const w=psCanvas.width,h=psCanvas.height;
  psCtx.fillStyle='rgba(6,13,26,0.08)';psCtx.fillRect(0,0,w,h);
  // Draw OSI stack (left side)
  const stackX=20,stackW=180,layerH=42,stackY=20;
  OSI_LAYERS.forEach((l,i)=>{
    l.y=stackY+i*layerH;
    const pulse=Math.sin(Date.now()/500+i*0.5)*0.03;
    psCtx.fillStyle=l.color+(Math.floor(20+pulse*200).toString(16).padStart(2,'0'));
    psCtx.fillRect(stackX,l.y,stackW,layerH-3);
    psCtx.strokeStyle=l.color+'44';psCtx.lineWidth=1;psCtx.strokeRect(stackX,l.y,stackW,layerH-3);
    psCtx.fillStyle=l.color;psCtx.font='10px Orbitron,sans-serif';psCtx.textAlign='left';
    psCtx.fillText('L'+(5-i)+': '+l.name,stackX+6,l.y+16);
    psCtx.fillStyle='rgba(255,255,255,0.4)';psCtx.font='8px monospace';
    psCtx.fillText(l.proto,stackX+6,l.y+30);
  });
  // Encapsulation visualization (right side)
  const encX=230,encW=w-encX-20,encY=30;
  psCtx.fillStyle='rgba(255,255,255,0.3)';psCtx.font='9px Orbitron';psCtx.textAlign='left';
  psCtx.fillText('Packet Encapsulation',encX,encY-8);
  // Draw nested packet
  const t=Date.now()/1000;
  OSI_LAYERS.forEach((l,i)=>{
    const pad=i*25;const bx=encX+pad,by=encY+10+i*5;
    const bw=encW-pad*2,bh=180-i*20;
    if(bw>0&&bh>0){
      const glow=Math.sin(t+i)*0.05+0.05;
      psCtx.fillStyle=l.color+Math.floor(glow*255).toString(16).padStart(2,'0');
      psCtx.fillRect(bx,by,bw,bh);
      psCtx.strokeStyle=l.color+'66';psCtx.lineWidth=1;psCtx.strokeRect(bx,by,bw,bh);
      // Header label
      psCtx.fillStyle=l.color;psCtx.font='7px monospace';psCtx.textAlign='left';
      psCtx.fillText('HDR-L'+(5-i),bx+3,by+10);
    }
  });
  // Data bits flowing down stack
  if(Math.random()>0.85){dataFlow.push({x:stackX+stackW/2+(Math.random()-0.5)*60,y:stackY,speed:1+Math.random()*2,life:1,color:OSI_LAYERS[Math.floor(Math.random()*5)].color});}
  for(let i=dataFlow.length-1;i>=0;i--){
    const d=dataFlow[i];d.y+=d.speed;d.life-=0.008;
    if(d.life<=0||d.y>h){dataFlow.splice(i,1);continue;}
    psCtx.globalAlpha=d.life*0.6;psCtx.beginPath();psCtx.arc(d.x,d.y,2,0,Math.PI*2);
    psCtx.fillStyle=d.color;psCtx.fill();psCtx.globalAlpha=1;
  }
  // Stats
  psCtx.fillStyle='rgba(255,255,255,0.3)';psCtx.font='8px monospace';psCtx.textAlign='left';
  psCtx.fillText('OSI Model: 5 layers | Data units flowing: '+dataFlow.length,10,h-8);
  requestAnimationFrame(drawPS);
}
function initPS(){psCanvas=createPS();if(!psCanvas)return;psCtx=psCanvas.getContext('2d');
  psCanvas.addEventListener('click',()=>{for(let i=0;i<10;i++)dataFlow.push({x:110+(Math.random()-0.5)*100,y:20,speed:1.5+Math.random()*2,life:1,color:OSI_LAYERS[Math.floor(Math.random()*5)].color});});
  drawPS();}
setTimeout(initPS,2000);
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
