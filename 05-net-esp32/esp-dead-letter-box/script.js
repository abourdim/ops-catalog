/**
 * Workshop DIY — esp-dead-letter-box v1.0
 * WiFi Dead Drop — Hidden AP with Encrypted File Vault
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;}}

const LANG={
  en:{
    title:'esp-dead-letter-box',subtitle:'📦 scan · 🔐 decrypt · 📂 extract',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Dead Letter Box — WiFi Dead Drops',mainDesc:'ESP32 hidden WiFi AP where agents find encrypted files',
    sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',
    help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    scanBtn:'Scan Networks',probeBtn:'Active Probe',decryptBtn:'Decrypt Selected',downloadBtn:'Download',
    keyPlaceholder:'Decryption key...',fileVault:'File Vault',
    howStep1:'An ESP32 creates a hidden WiFi access point — invisible to normal scans.',
    howStep2:'Agents who know the SSID connect and access the encrypted file vault.',
    howStep3:'Files are XOR-encrypted. Only agents with the key can decrypt them.',
    howStep4:'The dead drop is ephemeral — the ESP32 can be powered off and moved.',
    challenge1:'Why are hidden SSIDs not truly hidden?',
    challenge2:'What makes XOR encryption weak?',
    challenge3:'How could you make a dead drop more secure?',
    challengeReveal1:'Hidden SSIDs are omitted from beacon frames, but are still visible in probe responses, association requests, and data frames.',
    challengeReveal2:'XOR with a short key repeats, making it vulnerable to frequency analysis. If the plaintext is known, the key is trivially recovered.',
    challengeReveal3:'Use AES encryption, MAC address filtering, time-limited AP activation, and one-time download tokens.',
    revealBtn:'Reveal Answer',labDesc:'Try scanning with different signal strengths. Hidden APs require active probing.',
    faq_q1:'What is a dead letter box?',faq_a1:'A dead letter box (dead drop) is a secret location where agents exchange encrypted information without meeting.',
    faq_q2:'What is a hidden SSID?',faq_a2:'A hidden SSID means the AP does not broadcast its name in beacon frames. You must know the exact name to connect.',
    faq_q3:'How does XOR decryption work?',faq_a3:'Each byte of the file is XORed with the corresponding key byte. Apply the same key again to get the original file back.',
    faq_q4:'Is this a real WiFi scanner?',faq_a4:'No. This is a simulation. Real WiFi scanning requires native OS APIs.',
    howto_1:'Click Scan Networks to discover nearby access points.',
    howto_2:'Look for hidden APs marked in red — these are the dead drops.',
    howto_3:'Click a hidden AP to connect and reveal its file vault.',
    howto_4:'Enter the decryption key and click Decrypt to access the files.',
    wiki_ap_title:'📡 Hidden Access Points',wiki_ap:'Hidden APs don\'t broadcast their SSID in beacons but respond to directed probe requests.',
    wiki_xor_title:'🔑 XOR Encryption',wiki_xor:'A symmetric cipher where plaintext XOR key = ciphertext. Simple but educational.',
    wiki_drop_title:'📦 Dead Drop Protocol',wiki_drop:'Agent hides an ESP32 running a hidden AP. Another agent scans, connects, downloads, and decrypts.',
    wiki_esp_title:'📡 ESP32 SoftAP',wiki_esp:'ESP32 can run as a WiFi access point (SoftAP) with configurable SSID visibility.',
    working:'Working…',scanning:'Scanning networks...',probing:'Active probing...',
    noKey:'Enter a decryption key first',noFile:'Select a file first',decrypted:'File decrypted!',
    apFound:'networks found',hiddenFound:'hidden AP detected!',connected:'Connected',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'📦 Dead Letter Box ready — scan for hidden networks!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
  ,step1Title:'Scan',step1Desc:'An ESP32 creates a hidden WiFi access point — invisible to normal scans.',step2Title:'Capture',step2Desc:'Agents who know the SSID connect and access the encrypted file vault.',step3Title:'Analyze',step3Desc:'Files are XOR-encrypted. Only agents with the key can decrypt them.',step4Title:'Report',step4Desc:'The dead drop is ephemeral — the ESP32 can be powered off and moved.'},
  fr:{
    title:'esp-dead-letter-box',subtitle:'📦 scanner · 🔐 déchiffrer · 📂 extraire',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Dead Letter Box — Boîtes aux lettres mortes WiFi',mainDesc:'Point d\'accès WiFi caché ESP32 avec coffre-fort de fichiers chiffrés',
    sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements et messages',
    clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',
    help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    scanBtn:'Scanner les réseaux',probeBtn:'Sonde active',decryptBtn:'Déchiffrer',downloadBtn:'Télécharger',
    keyPlaceholder:'Clé de déchiffrement...',fileVault:'Coffre-fort de fichiers',
    howStep1:'Un ESP32 crée un point d\'accès WiFi caché — invisible aux scans normaux.',
    howStep2:'Les agents qui connaissent le SSID se connectent et accèdent au coffre-fort.',
    howStep3:'Les fichiers sont chiffrés en XOR. Seuls les agents avec la clé peuvent déchiffrer.',
    howStep4:'Le drop est éphémère — l\'ESP32 peut être éteint et déplacé.',
    challenge1:'Pourquoi les SSID cachés ne sont-ils pas vraiment cachés ?',
    challenge2:'Qu\'est-ce qui rend le chiffrement XOR faible ?',
    challenge3:'Comment rendre un dead drop plus sûr ?',
    challengeReveal1:'Les SSID cachés sont absents des trames beacon mais visibles dans les réponses aux sondes.',
    challengeReveal2:'XOR avec une clé courte se répète, vulnérable à l\'analyse fréquentielle.',
    challengeReveal3:'Utiliser AES, filtrage MAC, activation temporelle et jetons de téléchargement unique.',
    revealBtn:'Révéler',labDesc:'Essayez de scanner avec différentes puissances de signal.',
    faq_q1:'Qu\'est-ce qu\'une boîte aux lettres morte ?',faq_a1:'Un endroit secret où les agents échangent des informations chiffrées sans se rencontrer.',
    faq_q2:'Qu\'est-ce qu\'un SSID caché ?',faq_a2:'Le point d\'accès ne diffuse pas son nom dans les trames beacon.',
    faq_q3:'Comment fonctionne le déchiffrement XOR ?',faq_a3:'Chaque octet est XORé avec l\'octet correspondant de la clé.',
    faq_q4:'Est-ce un vrai scanner WiFi ?',faq_a4:'Non. C\'est une simulation.',
    howto_1:'Cliquez Scanner pour découvrir les points d\'accès.',
    howto_2:'Cherchez les AP cachés marqués en rouge.',
    howto_3:'Cliquez un AP caché pour vous connecter au coffre-fort.',
    howto_4:'Entrez la clé et cliquez Déchiffrer.',
    wiki_ap_title:'📡 Points d\'accès cachés',wiki_ap:'Les AP cachés ne diffusent pas leur SSID mais répondent aux sondes directes.',
    wiki_xor_title:'🔑 Chiffrement XOR',wiki_xor:'Chiffrement symétrique : texte XOR clé = chiffré.',
    wiki_drop_title:'📦 Protocole Dead Drop',wiki_drop:'L\'agent cache un ESP32 avec AP caché. Un autre scanne, se connecte et télécharge.',
    wiki_esp_title:'📡 ESP32 SoftAP',wiki_esp:'L\'ESP32 peut fonctionner comme point d\'accès WiFi avec visibilité configurable.',
    working:'En cours…',scanning:'Scan des réseaux...',probing:'Sonde active...',
    noKey:'Entrez d\'abord une clé',noFile:'Sélectionnez un fichier',decrypted:'Fichier déchiffré !',
    apFound:'réseaux trouvés',hiddenFound:'AP caché détecté !',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'📦 Dead Letter Box prêt — scannez les réseaux cachés !',
    logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',newVersion:'MAJ',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
  ,step1Title:'Scanner',step1Desc:'Un ESP32 crée un point d\'accès WiFi caché — invisible aux scans normaux.',step2Title:'Capturer',step2Desc:'Les agents qui connaissent le SSID se connectent et accèdent au coffre-fort.',step3Title:'Analyser',step3Desc:'Les fichiers sont chiffrés en XOR. Seuls les agents avec la clé peuvent déchiffrer.',step4Title:'Rapporter',step4Desc:'Le drop est éphémère — l\'ESP32 peut être éteint et déplacé.'},
  ar:{
    title:'esp-dead-letter-box',subtitle:'📦 مسح · 🔐 فك تشفير · 📂 استخراج',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'Dead Letter Box — صناديق بريد WiFi الميتة',mainDesc:'نقطة وصول WiFi مخفية ESP32 حيث يجد العملاء ملفات مشفرة',
    sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
    clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',
    help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    scanBtn:'مسح الشبكات',probeBtn:'تحقيق نشط',decryptBtn:'فك التشفير',downloadBtn:'تنزيل',
    keyPlaceholder:'مفتاح فك التشفير...',fileVault:'خزنة الملفات',
    howStep1:'ESP32 ينشئ نقطة وصول WiFi مخفية — غير مرئية للمسح العادي.',
    howStep2:'العملاء الذين يعرفون SSID يتصلون ويصلون لخزنة الملفات المشفرة.',
    howStep3:'الملفات مشفرة بـ XOR. فقط العملاء مع المفتاح يمكنهم فك التشفير.',
    howStep4:'نقطة الإيداع مؤقتة — يمكن إيقاف ESP32 ونقله.',
    challenge1:'لماذا SSIDs المخفية ليست مخفية فعلاً؟',
    challenge2:'ما الذي يجعل تشفير XOR ضعيفاً؟',
    challenge3:'كيف يمكنك جعل dead drop أكثر أماناً؟',
    challengeReveal1:'SSIDs المخفية غائبة عن إطارات البث لكنها مرئية في استجابات الاستقصاء.',
    challengeReveal2:'XOR بمفتاح قصير يتكرر، مما يجعله عرضة لتحليل التردد.',
    challengeReveal3:'استخدم تشفير AES وتصفية MAC وتفعيل محدود بالوقت ورموز تنزيل لمرة واحدة.',
    revealBtn:'اكشف الإجابة',labDesc:'جرب المسح بقوى إشارة مختلفة.',
    faq_q1:'ما هو صندوق البريد الميت؟',faq_a1:'مكان سري يتبادل فيه العملاء معلومات مشفرة بدون لقاء.',
    faq_q2:'ما هو SSID المخفي؟',faq_a2:'نقطة الوصول لا تبث اسمها في إطارات البث.',
    faq_q3:'كيف يعمل فك تشفير XOR؟',faq_a3:'كل بايت يُطبق عليه XOR مع البايت المقابل من المفتاح.',
    faq_q4:'هل هذا ماسح WiFi حقيقي؟',faq_a4:'لا. هذه محاكاة.',
    howto_1:'انقر مسح الشبكات لاكتشاف نقاط الوصول.',
    howto_2:'ابحث عن APs المخفية المحددة باللون الأحمر.',
    howto_3:'انقر AP مخفي للاتصال وكشف خزنة الملفات.',
    howto_4:'أدخل مفتاح فك التشفير وانقر فك التشفير.',
    wiki_ap_title:'📡 نقاط وصول مخفية',wiki_ap:'APs المخفية لا تبث SSID لكنها تستجيب لطلبات الاستقصاء.',
    wiki_xor_title:'🔑 تشفير XOR',wiki_xor:'شيفرة متماثلة: نص XOR مفتاح = مشفّر.',
    wiki_drop_title:'📦 بروتوكول Dead Drop',wiki_drop:'العميل يخفي ESP32 بـ AP مخفي. عميل آخر يمسح ويتصل ويحمّل.',
    wiki_esp_title:'📡 ESP32 SoftAP',wiki_esp:'ESP32 يمكنه العمل كنقطة وصول WiFi مع رؤية SSID قابلة للتكوين.',
    working:'جارٍ…',scanning:'مسح الشبكات...',probing:'تحقيق نشط...',
    noKey:'أدخل مفتاحاً أولاً',noFile:'اختر ملفاً أولاً',decrypted:'تم فك تشفير الملف!',
    apFound:'شبكات وجدت',hiddenFound:'AP مخفي مكتشف!',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'📦 Dead Letter Box جاهز — امسح الشبكات المخفية!',
    logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',newVersion:'تحديث',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
  ,step1Title:'مسح',step1Desc:'ESP32 ينشئ نقطة وصول WiFi مخفية — غير مرئية للمسح العادي.',step2Title:'التقاط',step2Desc:'العملاء الذين يعرفون SSID يتصلون ويصلون لخزنة الملفات المشفرة.',step3Title:'تحليل',step3Desc:'الملفات مشفرة بـ XOR. فقط العملاء مع المفتاح يمكنهم فك التشفير.',step4Title:'تقرير',step4Desc:'نقطة الإيداع مؤقتة — يمكن إيقاف ESP32 ونقله.'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function checkVersion(){try{const stored=localStorage.getItem('wdiy-latest-version');if(stored&&stored!==APP_VERSION){const btn=$('settingsBtn');if(btn&&!btn.querySelector('.version-update')){const badge=document.createElement('span');badge.className='version-update';badge.textContent='UPDATE';btn.style.position='relative';badge.style.cssText='position:absolute;top:-6px;inset-inline-end:-6px;';btn.appendChild(badge);}}}catch{}}
function sendAppMessage(type,data){try{localStorage.setItem('wdiy-app-msg',JSON.stringify({type,data,from:document.title,ts:Date.now()}));localStorage.removeItem('wdiy-app-msg');}catch{}}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return;}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;
function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const panel=$('debugPanel');if(!panel)return;panel.classList.add('active');let frames=0,last=performance.now();function tick(){frames++;const now=performance.now();if(now-last>=1000){$('debugFps').textContent=frames+' FPS';frames=0;last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{dragging=false;});try{const saved=localStorage.getItem('wdiy-log-width');if(saved)document.documentElement.style.setProperty('--log-width',saved);}catch{}}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const logEl=$('logPanel');logWasOpen=logEl&&logEl.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');});});}

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
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=()=>log('🎤 Whisper toggled','info');
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtnEl=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtnEl)dhikrBtnEl.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=()=>log('🎵 Music toggled','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  checkVersion();onAppMessage(msg=>log(`📨 ${msg.from}: ${msg.type}`,'rx'));
  initKonami();initMatrixTrigger();initDebug();initHijriDate();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   DEAD LETTER BOX SIMULATION
   ═══════════════════════════════════════════════════════════════ */

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function revealChallenge(idx){const el=$('answer'+idx);if(!el)return;el.classList.toggle('visible');playSound('click');}

// Fake AP database
const FAKE_APS=[
  {ssid:'Home-WiFi-5G',bssid:'AA:BB:CC:11:22:33',channel:6,signal:-45,hidden:false,encryption:'WPA2'},
  {ssid:'CoffeeShop_Free',bssid:'DD:EE:FF:44:55:66',channel:1,signal:-62,hidden:false,encryption:'Open'},
  {ssid:'DIRECT-ESP32',bssid:'11:22:33:AA:BB:CC',channel:11,signal:-38,hidden:false,encryption:'WPA2'},
  {ssid:'[HIDDEN]',bssid:'DE:AD:BE:EF:00:01',channel:3,signal:-55,hidden:true,encryption:'WPA2',realSsid:'DEAD-DROP-7'},
  {ssid:'Neighbor_Net',bssid:'99:88:77:66:55:44',channel:6,signal:-72,hidden:false,encryption:'WPA2'},
  {ssid:'[HIDDEN]',bssid:'CA:FE:BA:BE:00:02',channel:9,signal:-48,hidden:true,encryption:'WPA2',realSsid:'GHOST-VAULT'},
  {ssid:'IoT-Gateway',bssid:'FE:DC:BA:98:76:54',channel:1,signal:-58,hidden:false,encryption:'WPA3'},
];

// Fake files in the vault
const VAULT_FILES=[
  {name:'mission-brief.txt',size:'2.4 KB',content:'Operation Nightfall: Rendezvous at coordinates 36.7N 3.0E at 0200 hours. Use callsign FALCON.',encrypted:true},
  {name:'agent-list.dat',size:'1.1 KB',content:'ALPHA:field BRAVO:handler CHARLIE:tech DELTA:extraction ECHO:comms',encrypted:true},
  {name:'cipher-key.bin',size:'512 B',content:'KEY=WORKSHOP-DIY-2026 ROTATE=7 SALT=ESP32MESH',encrypted:true},
  {name:'coordinates.gpx',size:'3.7 KB',content:'<waypoint lat="36.752887" lon="3.042048" name="SAFE-HOUSE-A"/><waypoint lat="36.737232" lon="3.086472" name="EXFIL-POINT"/>',encrypted:true},
];

let selectedAP=null;
let selectedFile=null;

function xorCipher(text,key){
  if(!key)return text;
  let result='';
  for(let i=0;i<text.length;i++){
    result+=String.fromCharCode(text.charCodeAt(i)^key.charCodeAt(i%key.length));
  }
  return result;
}

function toHex(str){
  return Array.from(str).map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join(' ');
}

// Encrypt all vault files on load
function encryptVault(){
  const key='ESPION';
  for(const f of VAULT_FILES){
    f.cipher=xorCipher(f.content,key);
    f.hexCipher=toHex(f.cipher);
  }
}

function renderAPList(aps){
  const list=$('apList');if(!list)return;
  list.innerHTML='';
  for(const ap of aps){
    const div=document.createElement('div');
    div.className='ap-item';
    if(ap===selectedAP)div.classList.add('selected');
    div.innerHTML=`
      <span class="ap-name">${ap.hidden?'<span class="ap-hidden">[HIDDEN]</span>':ap.ssid}</span>
      <span class="ap-signal">${ap.bssid} CH:${ap.channel} ${ap.signal}dBm ${ap.encryption}</span>
    `;
    div.addEventListener('click',()=>{
      if(ap.hidden){
        selectedAP=ap;
        log(`📡 Connecting to hidden AP: ${ap.realSsid} (${ap.bssid})`,'tx');
        showToast('Connecting...',1500);
        setTimeout(()=>{
          setStatus(true);
          log(`✅ Connected to ${ap.realSsid}`,'success');
          showVault();
        },1200);
      }else{
        log(`📡 ${ap.ssid} — not a dead drop`,'info');
      }
      renderAPList(aps);
    });
    list.appendChild(div);
  }
}

function showVault(){
  const area=$('vaultArea');if(area)area.style.display='block';
  renderFileList();
}

function renderFileList(){
  const list=$('fileList');if(!list)return;
  list.innerHTML='';
  for(let i=0;i<VAULT_FILES.length;i++){
    const f=VAULT_FILES[i];
    const div=document.createElement('div');
    div.className='vault-item';
    if(f===selectedFile)div.style.borderColor='var(--accent)';
    div.innerHTML=`
      <div>
        <div class="file-name">${f.name}</div>
        <div class="file-size">${f.size}</div>
      </div>
      <span class="file-status ${f.encrypted?'encrypted':'decrypted'}">${f.encrypted?'ENCRYPTED':'DECRYPTED'}</span>
    `;
    div.addEventListener('click',()=>{
      selectedFile=f;
      const output=$('decryptOutput');
      if(output)output.textContent=f.encrypted?f.hexCipher:f.content;
      log(`📄 Selected: ${f.name}`,'info');
      renderFileList();
    });
    list.appendChild(div);
  }
}

function initDeadLetterBox(){
  encryptVault();

  const scanBtn=$('scanBtn');
  if(scanBtn)scanBtn.addEventListener('click',async()=>{
    const s=LANG[currentLang];
    log(s.scanning,'info');
    showToast(s.scanning,2000);
    setStatus(false);
    await sleep(1500+Math.random()*1000);
    const signalStr=parseInt(($('signalSlider')||{}).value||70);
    const visible=FAKE_APS.filter(ap=>!ap.hidden||signalStr>50);
    renderAPList(visible);
    const hiddenCount=visible.filter(a=>a.hidden).length;
    log(`📡 ${visible.length} ${s.apFound}${hiddenCount>0?' — '+hiddenCount+' '+s.hiddenFound:''}`,'success');
    hideToast();
  });

  const probeBtn=$('probeBtn');
  if(probeBtn)probeBtn.addEventListener('click',async()=>{
    const s=LANG[currentLang];
    log(s.probing,'info');
    showToast(s.probing,2500);
    await sleep(2000);
    renderAPList(FAKE_APS);
    const hiddenCount=FAKE_APS.filter(a=>a.hidden).length;
    log(`📡 Active probe: ${FAKE_APS.length} ${s.apFound} — ${hiddenCount} ${s.hiddenFound}`,'success');
    hideToast();
  });

  const decryptBtn=$('decryptBtn');
  if(decryptBtn)decryptBtn.addEventListener('click',()=>{
    const s=LANG[currentLang];
    const key=($('keyInput')||{}).value||'';
    if(!key){log(s.noKey,'error');showToast(s.noKey,1500);return;}
    if(!selectedFile){log(s.noFile,'error');showToast(s.noFile,1500);return;}
    const decrypted=xorCipher(selectedFile.cipher,key);
    const output=$('decryptOutput');
    if(output)output.textContent=decrypted;
    if(key==='ESPION'){
      selectedFile.encrypted=false;
      selectedFile.content=decrypted;
      log(`🔓 ${selectedFile.name} ${s.decrypted}`,'success');
      showToast(s.decrypted,1500);
    }else{
      log(`🔐 ${selectedFile.name} — wrong key, garbled output`,'error');
    }
    renderFileList();
  });

  const downloadBtn=$('downloadBtn');
  if(downloadBtn)downloadBtn.addEventListener('click',()=>{
    if(!selectedFile)return;
    const content=selectedFile.encrypted?selectedFile.hexCipher:selectedFile.content;
    const blob=new Blob([content],{type:'text/plain'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=selectedFile.name;
    a.click();
    log(`💾 Downloaded: ${selectedFile.name}`,'success');
  });

  const signalSlider=$('signalSlider'),signalValue=$('signalValue');
  if(signalSlider&&signalValue){
    signalSlider.addEventListener('input',()=>{signalValue.textContent=signalSlider.value+'%';});
  }
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initDeadLetterBox);}else{setTimeout(initDeadLetterBox,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Dead Letter Box: Encrypted file vault
   with WiFi dead-drop network visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';
  let canvas,ctx,animId,W,H,frameCount=0;
  const nodes=[],fileDrops=[],signals=[],hexCols=[];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){
      canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0a1a;';
      const t=document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body;
      t.appendChild(canvas);
    }
    const r=canvas.getBoundingClientRect();
    canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);
    W=r.width;H=r.height;
  }

  class APNode{
    constructor(x,y,label){this.x=x;this.y=y;this.label=label;this.radius=28;this.pulse=0;}
    draw(){
      this.pulse+=0.03;const glow=6+Math.sin(this.pulse)*3;
      ctx.save();ctx.shadowColor='#00ffcc';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      ctx.fillStyle='rgba(0,255,204,0.12)';ctx.fill();
      ctx.strokeStyle='#00ffcc';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#00ffcc';ctx.font='bold 16px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('\u{1F510}',this.x,this.y);
      ctx.font='9px monospace';ctx.fillStyle='rgba(0,255,204,0.7)';
      ctx.fillText(this.label,this.x,this.y+this.radius+12);ctx.restore();
    }
  }

  class AgentDevice{
    constructor(){
      const a=Math.random()*Math.PI*2,d=100+Math.random()*80;
      this.cx=W/2;this.cy=H/2;this.angle=a;this.dist=d;
      this.x=this.cx+Math.cos(a)*d;this.y=this.cy+Math.sin(a)*d;
      this.speed=0.003+Math.random()*0.004;
      this.color=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff78ae'][Math.floor(Math.random()*5)];
      this.id='AG-'+Math.random().toString(36).slice(2,5).toUpperCase();
      this.transferProgress=0;this.transferring=Math.random()>0.5;
    }
    update(){
      this.angle+=this.speed;
      this.x=this.cx+Math.cos(this.angle)*this.dist;
      this.y=this.cy+Math.sin(this.angle)*this.dist;
      if(this.transferring){this.transferProgress+=0.008;if(this.transferProgress>1){this.transferProgress=0;this.transferring=Math.random()>0.3;}}
      else if(Math.random()<0.003){this.transferring=true;this.transferProgress=0;}
    }
    draw(){
      if(this.transferring){
        const g=ctx.createLinearGradient(this.x,this.y,this.cx,this.cy);
        g.addColorStop(0,this.color);g.addColorStop(1,'rgba(0,255,204,0.4)');
        ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.cx,this.cy);
        ctx.strokeStyle=g;ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
        const px=this.x+(this.cx-this.x)*this.transferProgress;
        const py=this.y+(this.cy-this.y)*this.transferProgress;
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      }
      ctx.beginPath();ctx.arc(this.x,this.y,8,0,Math.PI*2);ctx.fillStyle=this.color;ctx.fill();
      ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.6)';ctx.textAlign='center';
      ctx.fillText(this.id,this.x,this.y-12);
    }
  }

  class FileDrop{
    constructor(){
      this.x=W/2+(Math.random()-0.5)*50;this.y=H/2+(Math.random()-0.5)*50;
      this.vx=(Math.random()-0.5)*0.3;this.vy=(Math.random()-0.5)*0.3;
      this.size=10+Math.random()*8;this.encrypted=Math.random()>0.3;this.alpha=0.6+Math.random()*0.4;
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;
      const dx=this.x-W/2,dy=this.y-H/2,d=Math.sqrt(dx*dx+dy*dy);
      if(d>60){this.vx-=dx*0.001;this.vy-=dy*0.001;}
    }
    draw(){
      ctx.save();ctx.globalAlpha=this.alpha;
      ctx.fillStyle=this.encrypted?'#ff4444':'#00ff88';
      ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size*1.2);
      ctx.strokeStyle=this.encrypted?'#ff8888':'#88ffbb';ctx.lineWidth=1;
      ctx.strokeRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size*1.2);
      ctx.fillStyle='#fff';ctx.font=(this.size*0.6)+'px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(this.encrypted?'\u{1F512}':'\u{1F4C4}',this.x,this.y);ctx.restore();
    }
  }

  class SignalRing{
    constructor(){this.x=W/2;this.y=H/2;this.radius=30;this.maxRadius=180;this.alpha=0.5;}
    update(){this.radius+=0.8;this.alpha=0.5*(1-this.radius/this.maxRadius);return this.radius<this.maxRadius;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,204,'+this.alpha+')';ctx.lineWidth=1.5;ctx.stroke();}
  }

  function initHexRain(){
    const cols=Math.floor(W/18);
    for(let i=0;i<cols;i++){
      hexCols.push({x:i*18,y:Math.random()*H,speed:0.5+Math.random()*1.5,chars:[]});
      for(let j=0;j<8;j++) hexCols[i].chars.push(Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase());
    }
  }
  function drawHexRain(){
    ctx.font='10px monospace';ctx.textAlign='left';
    hexCols.forEach(col=>{
      col.y+=col.speed;if(col.y>H+100)col.y=-100;
      col.chars.forEach((ch,i)=>{ctx.fillStyle='rgba(0,255,120,'+(0.04+i/col.chars.length*0.06)+')';ctx.fillText(ch,col.x,col.y+i*12);});
      if(Math.random()<0.02){const idx=Math.floor(Math.random()*col.chars.length);col.chars[idx]=Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase();}
    });
  }

  function drawHUD(){
    const agents=nodes.length,active=nodes.filter(n=>n.transferring).length;
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(8,8,180,68);
    ctx.strokeStyle='#00ffcc33';ctx.strokeRect(8,8,180,68);
    ctx.font='10px monospace';ctx.fillStyle='#00ffcc';ctx.textAlign='left';
    ctx.fillText('DEAD DROP STATUS',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Agents: '+agents+'  Active: '+active,16,40);
    ctx.fillText('Files: '+fileDrops.length+'  Encrypted: '+fileDrops.filter(f=>f.encrypted).length,16,54);
    ctx.fillText('Signals: '+signals.length+'  Frame: '+frameCount,16,68);ctx.restore();
  }

  let apNode;
  function init(){
    ensureCanvas();initHexRain();
    apNode=new APNode(W/2,H/2,'HIDDEN-AP');
    for(let i=0;i<8;i++) nodes.push(new AgentDevice());
    for(let i=0;i<5;i++) fileDrops.push(new FileDrop());
    animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,W,H);
    drawHexRain();
    if(frameCount%60===0)signals.push(new SignalRing());
    for(let i=signals.length-1;i>=0;i--){if(!signals[i].update())signals.splice(i,1);else signals[i].draw();}
    fileDrops.forEach(f=>{f.update();f.draw();});
    apNode.draw();nodes.forEach(n=>{n.update();n.draw();});
    if(Math.random()<0.005&&nodes.length<14)nodes.push(new AgentDevice());
    if(Math.random()<0.003&&nodes.length>4)nodes.splice(Math.floor(Math.random()*nodes.length),1);
    if(Math.random()<0.004&&fileDrops.length<10)fileDrops.push(new FileDrop());
    drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,200);
})();
