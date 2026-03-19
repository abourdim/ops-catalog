/**
 * Workshop DIY — Tor in a Box v1.0
 * Physical Onion Routing — 3-layer XOR encryption simulation
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];
const APP_VERSION='1.0';
let soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;}}

const LANG={
en:{
title:'Tor in a Box',subtitle:'🧅 onion · 🔐 layers · 🛡️ privacy',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Tor in a Box — Physical Onion Routing',mainDesc:'3 ESP32s as relay nodes, real multi-layer encryption',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',
help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is onion routing?',faq_a1:'Onion routing encrypts data in multiple layers. Each relay peels one layer, so no single relay knows both sender and receiver.',
faq_q2:'What is XOR encryption?',faq_a2:'XOR is a simple bitwise operation. Applying the same key twice returns the original data.',
faq_q3:'Why 3 relays?',faq_a3:'3 relays ensure anonymity: guard knows sender, exit knows destination, middle knows neither.',
faq_q4:'Is this real Tor?',faq_a4:'This simulates the concept with XOR. Real Tor uses AES encryption and thousands of relays worldwide.',
howto_1:'Type a secret message in the input field.',howto_2:'Click Encrypt & Send to wrap the message in 3 encryption layers.',
howto_3:'Watch the animated packet travel through Guard, Middle, and Exit relays.',howto_4:'Observe the layer display showing encryption being peeled at each hop.',
wiki_tor_title:'🧅 Tor Network',wiki_tor:'Tor is a free overlay network for anonymous communication. Traffic is routed through 3+ relays.',
wiki_xor_title:'🔐 XOR Cipher',wiki_xor:'XOR encryption applies a key bitwise. A XOR K = encrypted, encrypted XOR K = A.',
wiki_relay_title:'📡 Relay Types',wiki_relay:'Guard relay: first hop. Middle relay: intermediate. Exit relay: last hop to destination.',
wiki_anon_title:'🛡️ Anonymity',wiki_anon:'No single relay knows both origin and destination. This separation provides anonymity.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'🧅 Tor in a Box ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
sendBtn:'Encrypt & Send',msgPlaceholder:'Type a secret message...',
step1:'The sender wraps the message in 3 encryption layers (like an onion), one key per relay node.',
step2:'Relay 1 (Guard) peels the first layer using its key, revealing the next relay address.',
step3:'Relay 2 (Middle) peels the second layer, revealing the exit relay address.',
step4:'Relay 3 (Exit) peels the final layer, revealing the original plaintext message.',
labTip1:'Type a message and click Encrypt & Send to see triple-layer encryption in action.',
labTip2:'Watch each relay node peel one encryption layer as the message travels through.',
labTip3:'The keys shown are random XOR keys generated for each message.',
labTip4:'Notice how each relay only knows the previous and next hop, never the full path.',
challenge1:'Send a message and verify that each relay only decrypts one layer.',
challenge2:'Compare the encrypted data at each hop. Can any single relay read the plaintext?',
challenge3:'Explain why onion routing needs at least 3 relays for anonymity.',
layerWrapped:'Layer {n} wrapped (Key {n})',layerPeeled:'Relay {n} peeled layer (Key {n})',
plainRevealed:'Exit relay revealed plaintext!',encrypting:'Encrypting 3 layers...',
noMsg:'Please type a message',guardRelay:'Guard Relay',middleRelay:'Middle Relay',exitRelay:'Exit Relay',
sender:'Sender',receiver:'Receiver',
layerLabel:'Layer {n}',plainLabel:'Plaintext',fullEncLabel:'Fully Encrypted',
},
fr:{
title:'Tor in a Box',subtitle:'🧅 oignon · 🔐 couches · 🛡️ confidentialité',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Tor in a Box — Routage en Oignon Physique',mainDesc:'3 ESP32 comme relais, chiffrement multi-couches réel',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements et messages',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',
help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que le routage en oignon ?',faq_a1:'Le routage en oignon chiffre les données en couches multiples. Chaque relais pèle une couche.',
faq_q2:'Qu\'est-ce que le chiffrement XOR ?',faq_a2:'XOR est une opération bit à bit simple. Appliquer la même clé deux fois redonne les données originales.',
faq_q3:'Pourquoi 3 relais ?',faq_a3:'3 relais assurent l\'anonymat : le garde connaît l\'expéditeur, la sortie connaît la destination, le milieu ne connaît ni l\'un ni l\'autre.',
faq_q4:'Est-ce le vrai Tor ?',faq_a4:'Ceci simule le concept avec XOR. Le vrai Tor utilise AES et des milliers de relais.',
howto_1:'Tapez un message secret dans le champ.',howto_2:'Cliquez Chiffrer & Envoyer pour emballer le message en 3 couches.',
howto_3:'Regardez le paquet traverser les relais Garde, Milieu et Sortie.',howto_4:'Observez l\'affichage des couches pelées à chaque saut.',
wiki_tor_title:'🧅 Réseau Tor',wiki_tor:'Tor est un réseau libre pour la communication anonyme via 3+ relais.',
wiki_xor_title:'🔐 Chiffrement XOR',wiki_xor:'Le XOR applique une clé bit à bit. A XOR K = chiffré, chiffré XOR K = A.',
wiki_relay_title:'📡 Types de Relais',wiki_relay:'Relais garde : premier saut. Relais milieu : intermédiaire. Relais sortie : dernier saut.',
wiki_anon_title:'🛡️ Anonymat',wiki_anon:'Aucun relais ne connaît à la fois l\'origine et la destination.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'🧅 Tor in a Box prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
sendBtn:'Chiffrer & Envoyer',msgPlaceholder:'Tapez un message secret...',
step1:'L\'expéditeur emballe le message en 3 couches de chiffrement, une clé par relais.',
step2:'Le Relais 1 (Garde) pèle la première couche avec sa clé.',
step3:'Le Relais 2 (Milieu) pèle la deuxième couche.',
step4:'Le Relais 3 (Sortie) pèle la couche finale, révélant le message original.',
labTip1:'Tapez un message et cliquez Chiffrer & Envoyer pour voir le triple chiffrement.',
labTip2:'Regardez chaque relais peler une couche de chiffrement.',
labTip3:'Les clés sont des clés XOR aléatoires générées pour chaque message.',
labTip4:'Chaque relais ne connaît que le saut précédent et suivant.',
challenge1:'Envoyez un message et vérifiez que chaque relais ne déchiffre qu\'une couche.',
challenge2:'Comparez les données chiffrées à chaque saut. Un seul relais peut-il lire le texte ?',
challenge3:'Expliquez pourquoi le routage en oignon nécessite au moins 3 relais.',
layerWrapped:'Couche {n} emballée (Clé {n})',layerPeeled:'Relais {n} a pelé la couche (Clé {n})',
plainRevealed:'Le relais de sortie a révélé le texte clair !',encrypting:'Chiffrement de 3 couches...',
noMsg:'Veuillez taper un message',guardRelay:'Relais Garde',middleRelay:'Relais Milieu',exitRelay:'Relais Sortie',
sender:'Expéditeur',receiver:'Destinataire',
layerLabel:'Couche {n}',plainLabel:'Texte clair',fullEncLabel:'Entièrement chiffré',
},
ar:{
title:'Tor in a Box',subtitle:'🧅 بصلة · 🔐 طبقات · 🛡️ خصوصية',
disconnected:'غير متصل',connected:'متصل',
mainSection:'Tor in a Box — توجيه بصلي فيزيائي',mainDesc:'3 ESP32 كعقد ترحيل، تشفير متعدد الطبقات حقيقي',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',
help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
faq_q1:'ما هو التوجيه البصلي؟',faq_a1:'التوجيه البصلي يشفر البيانات في طبقات متعددة. كل عقدة ترحيل تقشر طبقة واحدة.',
faq_q2:'ما هو تشفير XOR؟',faq_a2:'XOR هو عملية بت بسيطة. تطبيق نفس المفتاح مرتين يعيد البيانات الأصلية.',
faq_q3:'لماذا 3 عقد ترحيل؟',faq_a3:'3 عقد تضمن المجهولية: الحارس يعرف المرسل، المخرج يعرف الوجهة، الوسط لا يعرف أيًا منهما.',
faq_q4:'هل هذا Tor حقيقي؟',faq_a4:'هذا يحاكي المفهوم باستخدام XOR. Tor الحقيقي يستخدم تشفير AES وآلاف العقد.',
howto_1:'اكتب رسالة سرية في الحقل.',howto_2:'انقر تشفير وإرسال لتغليف الرسالة بـ3 طبقات.',
howto_3:'شاهد الحزمة تعبر عقد الحارس والوسط والمخرج.',howto_4:'لاحظ عرض الطبقات وهي تُقشر في كل قفزة.',
wiki_tor_title:'🧅 شبكة Tor',wiki_tor:'Tor هي شبكة حرة للاتصال المجهول عبر 3+ عقد ترحيل.',
wiki_xor_title:'🔐 تشفير XOR',wiki_xor:'تشفير XOR يطبق مفتاحًا على مستوى البت.',
wiki_relay_title:'📡 أنواع العقد',wiki_relay:'عقدة الحارس: القفزة الأولى. عقدة الوسط: وسيطة. عقدة المخرج: القفزة الأخيرة.',
wiki_anon_title:'🛡️ المجهولية',wiki_anon:'لا تعرف أي عقدة ترحيل كلاً من المصدر والوجهة.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'🧅 Tor in a Box جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
sendBtn:'تشفير وإرسال',msgPlaceholder:'اكتب رسالة سرية...',
step1:'يغلف المرسل الرسالة بـ3 طبقات تشفير، مفتاح واحد لكل عقدة.',
step2:'العقدة 1 (الحارس) تقشر الطبقة الأولى بمفتاحها.',
step3:'العقدة 2 (الوسط) تقشر الطبقة الثانية.',
step4:'العقدة 3 (المخرج) تقشر الطبقة الأخيرة وتكشف الرسالة الأصلية.',
labTip1:'اكتب رسالة وانقر تشفير وإرسال لمشاهدة التشفير الثلاثي.',
labTip2:'شاهد كل عقدة تقشر طبقة تشفير واحدة.',
labTip3:'المفاتيح المعروضة هي مفاتيح XOR عشوائية لكل رسالة.',
labTip4:'لاحظ أن كل عقدة تعرف فقط القفزة السابقة والتالية.',
challenge1:'أرسل رسالة وتحقق أن كل عقدة تفك طبقة واحدة فقط.',
challenge2:'قارن البيانات المشفرة في كل قفزة. هل يمكن لعقدة واحدة قراءة النص؟',
challenge3:'اشرح لماذا يحتاج التوجيه البصلي إلى 3 عقد على الأقل.',
layerWrapped:'تم تغليف الطبقة {n} (المفتاح {n})',layerPeeled:'العقدة {n} قشرت الطبقة (المفتاح {n})',
plainRevealed:'عقدة المخرج كشفت النص الأصلي!',encrypting:'تشفير 3 طبقات...',
noMsg:'الرجاء كتابة رسالة',guardRelay:'عقدة الحارس',middleRelay:'عقدة الوسط',exitRelay:'عقدة المخرج',
sender:'المرسل',receiver:'المستقبل',
layerLabel:'الطبقة {n}',plainLabel:'نص عادي',fullEncLabel:'مشفر بالكامل',
}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const txt=`[${new Date().toLocaleTimeString()}] ${msg}`;d.textContent=txt;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tgt=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}

let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ═══════ TOR / ONION ROUTING SIMULATION ═══════ */

const TOR_NODES = [
  { id:'sender', label:'Sender',    icon:'📤', color:'#3b82f6', x:0.06, y:0.5 },
  { id:'guard',  label:'Guard',     icon:'🛡️', color:'#f97316', x:0.28, y:0.5 },
  { id:'middle', label:'Middle',    icon:'🔀', color:'#a3e635', x:0.50, y:0.5 },
  { id:'exit',   label:'Exit',      icon:'🚪', color:'#c084fc', x:0.72, y:0.5 },
  { id:'receiver',label:'Receiver', icon:'📥', color:'#22d3ee', x:0.94, y:0.5 },
];

const TOR_LINKS = [['sender','guard'],['guard','middle'],['middle','exit'],['exit','receiver']];

let torCanvas, torCtx, torPacket = null;
let keys = [0, 0, 0];

function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ ((key >> (i % 4) * 8) & 0xFF));
  }
  return result;
}

function toHex(str) {
  return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function genKey() { return Math.floor(Math.random() * 0xFFFFFFFF); }

function torInit() {
  torCanvas = $('torCanvas'); if (!torCanvas) return;
  torCtx = torCanvas.getContext('2d');
  torResize(); window.addEventListener('resize', torResize);

  const btn = $('torSendBtn'), input = $('torMsgInput');
  if (btn) btn.addEventListener('click', torSend);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') torSend(); });

  torRender();
}

function torResize() {
  if (!torCanvas) return;
  const r = torCanvas.parentElement.getBoundingClientRect();
  torCanvas.width = r.width - 2;
  torCanvas.height = 220;
}

function torSend() {
  if (torPacket) return;
  const input = $('torMsgInput');
  const msg = input ? input.value.trim() : '';
  const s = LANG[currentLang];
  if (!msg) { log(`❌ ${s.noMsg}`, 'error'); return; }

  // Generate 3 random keys
  keys = [genKey(), genKey(), genKey()];
  $('key1').textContent = `Key 1: 0x${keys[0].toString(16).toUpperCase()}`;
  $('key2').textContent = `Key 2: 0x${keys[1].toString(16).toUpperCase()}`;
  $('key3').textContent = `Key 3: 0x${keys[2].toString(16).toUpperCase()}`;

  // Encrypt in 3 layers: layer3(layer2(layer1(plaintext)))
  const layer1 = xorEncrypt(msg, keys[2]);       // exit key
  const layer2 = xorEncrypt(layer1, keys[1]);     // middle key
  const layer3 = xorEncrypt(layer2, keys[0]);     // guard key

  const layerDisp = $('layerDisplay');
  if (layerDisp) layerDisp.innerHTML = '';

  log(`📤 TX: "${msg}" → ${s.encrypting}`, 'tx');
  log(`🔐 ${s.layerWrapped.replace('{n}','3')} → ${toHex(layer1).slice(0,30)}...`, 'info');
  log(`🔐 ${s.layerWrapped.replace('{n}','2')} → ${toHex(layer2).slice(0,30)}...`, 'info');
  log(`🔐 ${s.layerWrapped.replace('{n}','1')} → ${toHex(layer3).slice(0,30)}...`, 'info');

  addLayerBox(s.fullEncLabel, toHex(layer3), 'encrypted');

  // Animate through relays
  const path = ['sender','guard','middle','exit','receiver'];
  const layers = [layer3, layer2, layer1, msg];
  torPacket = { path, hopIdx: 0, progress: 0, layers, msg, currentLayer: 0 };

  function animate() {
    if (!torPacket) return;
    torPacket.progress += 0.02;
    if (torPacket.progress >= 1) {
      torPacket.progress = 0;
      const arrived = torPacket.path[torPacket.hopIdx + 1];

      if (arrived === 'guard') {
        const decrypted = xorEncrypt(layers[0], keys[0]);
        addLayerBox(`${s.guardRelay} — ${s.layerPeeled.replace(/\{n\}/g,'1')}`, toHex(decrypted), 'encrypted');
        log(`🛡️ ${s.layerPeeled.replace(/\{n\}/g,'1')}`, 'rx');
      } else if (arrived === 'middle') {
        const decrypted = xorEncrypt(layers[1], keys[1]);
        addLayerBox(`${s.middleRelay} — ${s.layerPeeled.replace(/\{n\}/g,'2')}`, toHex(decrypted), 'encrypted');
        log(`🔀 ${s.layerPeeled.replace(/\{n\}/g,'2')}`, 'rx');
      } else if (arrived === 'exit') {
        addLayerBox(`${s.exitRelay} — ${s.plainRevealed}`, `"${msg}"`, 'decrypted');
        log(`🚪 ${s.plainRevealed}: "${msg}"`, 'success');
      } else if (arrived === 'receiver') {
        addLayerBox(s.plainLabel, `"${msg}"`, 'plain');
        log(`📥 RX: "${msg}"`, 'success');
        showToast(s.plainRevealed, 2500);
        torPacket = null; return;
      }

      torPacket.hopIdx++;
      if (torPacket.hopIdx >= torPacket.path.length - 1) { torPacket = null; return; }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function addLayerBox(title, content, cls) {
  const disp = $('layerDisplay'); if (!disp) return;
  const box = document.createElement('div');
  box.className = `layer-box ${cls}`;
  box.innerHTML = `<div class="layer-title">${title}</div>${content}`;
  disp.appendChild(box);
}

function torRender() {
  function frame() { torDraw(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function torDraw() {
  const ctx = torCtx; if (!ctx || !torCanvas) return;
  const w = torCanvas.width, h = torCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';

  // Links
  TOR_LINKS.forEach(([aId, bId]) => {
    const a = TOR_NODES.find(n => n.id === aId), b = TOR_NODES.find(n => n.id === bId);
    if (!a || !b) return;
    const pa = { x: a.x * w, y: a.y * h }, pb = { x: b.x * w, y: b.y * h };
    ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
    ctx.strokeStyle = mutedCol + '40'; ctx.lineWidth = 3; ctx.stroke();
    // Onion layer indicators
    ctx.setLineDash([6, 4]); ctx.strokeStyle = mutedCol + '20'; ctx.stroke(); ctx.setLineDash([]);
  });

  // Nodes
  TOR_NODES.forEach((node, idx) => {
    const px = node.x * w, py = node.y * h;
    // Concentric circles for onion layers (relay nodes only)
    if (idx >= 1 && idx <= 3) {
      for (let r = 3; r >= 1; r--) {
        ctx.beginPath(); ctx.arc(px, py, 16 + r * 8, 0, Math.PI * 2);
        ctx.fillStyle = node.color + (r === 3 ? '08' : r === 2 ? '10' : '18'); ctx.fill();
        ctx.strokeStyle = node.color + '30'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '30'; ctx.fill();
    ctx.strokeStyle = node.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(node.icon, px, py);
    ctx.font = 'bold 9px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.fillText(node.label, px, py + 34);
  });

  // Packet animation
  if (torPacket && torPacket.hopIdx < torPacket.path.length - 1) {
    const from = TOR_NODES.find(n => n.id === torPacket.path[torPacket.hopIdx]);
    const to = TOR_NODES.find(n => n.id === torPacket.path[torPacket.hopIdx + 1]);
    if (from && to) {
      const fx = from.x * w, fy = from.y * h, tx = to.x * w, ty = to.y * h;
      const px = fx + (tx - fx) * torPacket.progress;
      const py = fy + (ty - fy) * torPacket.progress;
      // Draw onion layers around packet based on remaining layers
      const remainingLayers = 3 - torPacket.hopIdx;
      for (let r = remainingLayers; r >= 1; r--) {
        ctx.beginPath(); ctx.arc(px, py, 6 + r * 5, 0, Math.PI * 2);
        const colors = ['#ef4444', '#f97316', '#facc15'];
        ctx.fillStyle = colors[r - 1] + '40'; ctx.fill();
        ctx.strokeStyle = colors[r - 1]; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e'; ctx.fill();
    }
  }
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const sndT=$('soundToggle');
  if(sndT){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}sndT.checked=soundEnabled;sndT.addEventListener('change',()=>{soundEnabled=sndT.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  const brBtn=$('breathingBtn'),dkD=$('dhikrDisplay'),dkB=$('dhikrBtn');
  if(brBtn)brBtn.onclick=()=>{toggleBreathing();if(dkD)dkD.style.display=breathingActive?'flex':'none';};
  if(dkB)dkB.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();
  torInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
