/**
 * Workshop DIY — Onion Simulator v1.2
 * Tor Visualization — Watch encrypted messages bounce through relay nodes
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}

const LANG={
  en:{title:'Onion Simulator',subtitle:'🧅 Watch encrypted messages bounce through relay nodes',disconnected:'Disconnected',connected:'Connected',mainSection:'Tor Network Visualization',mainDesc:'Send a message through the onion routing network',sectionA:'How Onion Routing Works',sectionB:'Encryption Layers',sectionC:'Circuit Builder',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Type a message in the input field.',howto_2:'Click Send to watch it route through nodes.',howto_3:'Watch encryption layers peel off at each hop.',howto_4:'Build custom circuits in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🧅 Onion Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',sendBtn:'Send through Tor',onionText:'Onion routing encrypts your message in multiple layers. Each relay peels off one layer.',encryptionText:'Layer 1 (Entry): Knows your IP. Layer 2 (Middle): Knows nothing. Layer 3 (Exit): Sees destination.',circuitText:'Build custom circuits by selecting relay nodes.',newCircuitBtn:'Build New Circuit',encrypting:'Encrypting message...',routing:'Routing through Tor...',delivered:'Message delivered!',layer:'Layer',peeled:'peeled off at',entryNode:'Entry Guard',middleNode:'Middle Relay',exitNode:'Exit Node',destination:'Destination',you:'You',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It\'s like a spy gadget simulator! 🕵️ You get to play with real encryption, secret messages, and covert communication — the same tech real spies use.',faq_q2:'How does it work?',faq_a2:'The simulation runs right in your browser. It shows you step by step how secret agents protect their messages using math and radio signals.',faq_q3:'What should I try first?',faq_a3:'Hit the main button and watch what happens! 🎯 Then try changing the settings to see how it affects the results.',faq_q4:'What\'s the real science?',faq_a4:'This uses real cryptography — the same math that protects your WhatsApp messages and bank passwords! 🔐',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See if you can crack the code or intercept the message. That\'s how real security researchers think! 💪',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'100% safe! 🛡️ Everything runs locally in your browser. No internet needed, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Web Exif Eraser and Web Password Cracker! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this spy tool. First, look at the main control panel above. 🕵️',demo_s2:'Click the primary button to start the simulation. Watch the visualization come alive! ⚡',demo_s3:'Now try changing a setting — slide a slider or pick a different option. See how it changes? 🔄',demo_s4:'Check the results below. The numbers and graphs show you what happened in real time. 📊',demo_s5:'Great job! 🎉 Now try the Lab section below for hands-on experiments. You\'re a real spy now!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Cryptography',learn1Desc:'How secret codes protect messages from spies',learn1Tag:'Cybersecurity',learn2Title:'Wireless Communication',learn2Desc:'How devices send invisible signals through the air',learn2Tag:'Wireless',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure',learn3Tag:'Security',learn4Title:'Math in Security',learn4Desc:'How numbers and algorithms make unbreakable codes',learn4Tag:'Math',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
  fr:{title:'Simulateur Oignon',subtitle:'🧅 Regardez les messages chiffres rebondir entre les relais',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Visualisation Reseau Tor',mainDesc:'Envoyez un message a travers le reseau oignon',sectionA:'Comment fonctionne le routage oignon',sectionB:'Couches de chiffrement',sectionC:'Constructeur de circuit',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Tapez un message.',howto_2:'Cliquez Envoyer.',howto_3:'Regardez les couches se detacher.',howto_4:'Construisez des circuits.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🧅 Simulateur Oignon pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',sendBtn:'Envoyer via Tor',onionText:'Le routage oignon chiffre votre message en couches multiples.',encryptionText:'Couche 1 (Entree): connait votre IP. Couche 2 (Milieu): ne sait rien. Couche 3 (Sortie): voit la destination.',circuitText:'Construisez des circuits personnalises.',newCircuitBtn:'Nouveau Circuit',encrypting:'Chiffrement...',routing:'Routage Tor...',delivered:'Message livre !',layer:'Couche',peeled:'retiree a',entryNode:'Garde d\'entree',middleNode:'Relai intermediaire',exitNode:'Noeud de sortie',destination:'Destination',you:'Vous',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'C\'est comme un simulateur de gadget d\'espion ! 🕵️ Tu peux jouer avec du vrai chiffrement et des messages secrets.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages.',faq_q3:'Que dois-je essayer d\'abord ?',faq_a3:'Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐',faq_q5:'Je peux le casser ?',faq_a5:'Essaie la section Labo ! Vois si tu peux craquer le code. C\'est comme ça que pensent les vrais chercheurs ! 💪',faq_q6:'Quel matériel me faut-il ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d\'internet.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Exif Eraser and Web Password Cracker ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cet outil d\'espion. D\'abord, regarde le panneau de contrôle. 🕵️',demo_s2:'Clique sur le bouton principal pour démarrer. Regarde la visualisation s\'animer ! ⚡',demo_s3:'Maintenant change un réglage — déplace un curseur ou choisis une option. Tu vois la différence ? 🔄',demo_s4:'Vérifie les résultats. Les chiffres et graphiques montrent ce qui s\'est passé. 📊',demo_s5:'Bravo ! 🎉 Essaie maintenant la section Labo pour des expériences pratiques !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Cryptographie',learn1Desc:'Comment les codes secrets protègent les messages',learn1Tag:'Cybersécurité',learn2Title:'Communication sans fil',learn2Desc:'Comment les appareils envoient des signaux invisibles',learn2Tag:'Sans fil',learn3Title:'OPSEC',learn3Desc:'Comment garder tes opérations secrètes et sécurisées',learn3Tag:'Sécurité',learn4Title:'Maths en sécurité',learn4Desc:'Comment les nombres créent des codes incassables',learn4Tag:'Maths',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{title:'محاكي البصل',subtitle:'🧅 شاهد الرسائل المشفرة تتنقل عبر عقد التتابع',disconnected:'غير متصل',connected:'متصل',mainSection:'تصور شبكة Tor',mainDesc:'ارسل رسالة عبر شبكة التوجيه البصلي',sectionA:'كيف يعمل التوجيه البصلي',sectionB:'طبقات التشفير',sectionC:'بناء الدائرة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اكتب رسالة.',howto_2:'انقر ارسال.',howto_3:'شاهد طبقات التشفير تتقشر.',howto_4:'ابن دوائر مخصصة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🧅 محاكي البصل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',sendBtn:'ارسال عبر Tor',onionText:'التوجيه البصلي يشفر رسالتك في طبقات متعددة.',encryptionText:'طبقة 1 (مدخل): تعرف IP. طبقة 2 (وسط): لا تعرف شيئا. طبقة 3 (مخرج): ترى الوجهة.',circuitText:'ابن دوائر مخصصة.',newCircuitBtn:'دائرة جديدة',encrypting:'جاري التشفير...',routing:'جاري التوجيه...',delivered:'تم تسليم الرسالة!',layer:'طبقة',peeled:'ازيلت عند',entryNode:'حارس المدخل',middleNode:'عقدة وسطى',exitNode:'عقدة الخروج',destination:'الوجهة',you:'انت',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'إنه مثل محاكي أدوات التجسس! 🕵️ يمكنك اللعب بتشفير حقيقي ورسائل سرية.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت.',faq_q8:'ماذا أجرب بعد ذلك؟',faq_a8:'جرب Web Exif Eraser and Web Password Cracker! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف أداة التجسس هذه. أولاً، انظر إلى لوحة التحكم الرئيسية. 🕵️',demo_s2:'اضغط على الزر الرئيسي لبدء المحاكاة. شاهد التصور يتحرك! ⚡',demo_s3:'الآن جرب تغيير إعداد — حرك شريط تمرير أو اختر خياراً مختلفاً. هل ترى الفرق؟ 🔄',demo_s4:'تحقق من النتائج. الأرقام والرسوم البيانية تُظهر ما حدث. 📊',demo_s5:'أحسنت! 🎉 جرب الآن قسم المختبر للتجارب العملية!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'التشفير',learn1Desc:'كيف تحمي الشفرات السرية الرسائل',learn1Tag:'أمن سيبراني',learn2Title:'الاتصال اللاسلكي',learn2Desc:'كيف ترسل الأجهزة إشارات غير مرئية',learn2Tag:'لاسلكي',learn3Title:'أمن العمليات',learn3Desc:'كيف تحافظ على سرية عملياتك وأمانها',learn3Tag:'أمان',learn4Title:'الرياضيات في الأمن',learn4Desc:'كيف تصنع الأرقام والخوارزميات شفرات غير قابلة للكسر',learn4Tag:'رياضيات',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const txt=$('statusText'),pill=$('statusPill'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ ONION SIMULATOR ═══════ */

const COUNTRIES = ['🇺🇸 USA','🇩🇪 Germany','🇳🇱 Netherlands','🇨🇭 Switzerland','🇸🇪 Sweden','🇫🇮 Finland','🇮🇸 Iceland','🇷🇴 Romania','🇫🇷 France','🇯🇵 Japan','🇸🇬 Singapore','🇧🇷 Brazil'];
const LAYER_COLORS = ['#ff4444','#ff8800','#ffcc00','#33cc55'];

let circuit = [];
let animating = false;

function pickRandom(arr, count) {
  const copy = [...arr]; const result = [];
  for (let i = 0; i < count && copy.length; i++) { const idx = Math.floor(Math.random() * copy.length); result.push(copy.splice(idx, 1)[0]); }
  return result;
}

function buildCircuit() {
  const nodes = pickRandom(COUNTRIES, 3);
  circuit = [
    { label: LANG[currentLang].you, country: '🏠', x: 0, y: 0.5, type: 'origin' },
    { label: LANG[currentLang].entryNode, country: nodes[0], x: 0.25, y: 0.3, type: 'entry' },
    { label: LANG[currentLang].middleNode, country: nodes[1], x: 0.5, y: 0.7, type: 'middle' },
    { label: LANG[currentLang].exitNode, country: nodes[2], x: 0.75, y: 0.3, type: 'exit' },
    { label: LANG[currentLang].destination, country: '🌐', x: 1, y: 0.5, type: 'dest' },
  ];
  return circuit;
}

function drawNetwork(canvas, ctx, highlight = -1, msgProgress = -1) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#060d1a'; ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = '#0a1a30'; ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
  for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

  const pad = 60;
  const nodes = circuit.map(n => ({ ...n, px: pad + n.x * (w - pad * 2), py: pad + n.y * (h - pad * 2) }));

  // Draw connections
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i], b = nodes[i + 1];
    ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py);
    ctx.strokeStyle = i < highlight ? '#33cc5566' : (i === highlight ? LAYER_COLORS[Math.min(i, 3)] + '88' : '#1a3355');
    ctx.lineWidth = i === highlight ? 3 : 1.5;
    ctx.setLineDash(i >= highlight && highlight >= 0 ? [6, 4] : []);
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Draw message packet
  if (msgProgress >= 0 && msgProgress < nodes.length - 1) {
    const a = nodes[msgProgress], b = nodes[msgProgress + 1];
    const t = 0.5;
    const mx = a.px + (b.px - a.px) * t, my = a.py + (b.py - a.py) * t;
    const layers = 3 - msgProgress;
    for (let l = layers; l >= 0; l--) {
      ctx.beginPath(); ctx.arc(mx, my, 12 + l * 6, 0, Math.PI * 2);
      ctx.fillStyle = LAYER_COLORS[l] + '44'; ctx.fill();
      ctx.strokeStyle = LAYER_COLORS[l]; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText('📨', mx, my + 4);
  }

  // Draw nodes
  nodes.forEach((n, i) => {
    const active = i <= highlight + 1;
    const radius = n.type === 'origin' || n.type === 'dest' ? 20 : 24;

    // Glow
    if (active) {
      ctx.beginPath(); ctx.arc(n.px, n.py, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = (n.type === 'entry' ? '#ff444422' : n.type === 'middle' ? '#ff880022' : n.type === 'exit' ? '#ffcc0022' : '#33cc5522');
      ctx.fill();
    }

    // Node circle
    ctx.beginPath(); ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
    ctx.fillStyle = active ? '#1a2a44' : '#0d1522';
    ctx.fill();
    ctx.strokeStyle = n.type === 'entry' ? '#ff4444' : n.type === 'middle' ? '#ff8800' : n.type === 'exit' ? '#ffcc00' : '#33cc55';
    ctx.lineWidth = active ? 3 : 1.5; ctx.stroke();

    // Icon
    ctx.fillStyle = '#fff'; ctx.font = '14px serif'; ctx.textAlign = 'center';
    const icon = n.type === 'origin' ? '👤' : n.type === 'dest' ? '🌐' : '🧅';
    ctx.fillText(icon, n.px, n.py + 5);

    // Label
    ctx.fillStyle = '#aabbcc'; ctx.font = '9px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText(n.label, n.px, n.py + radius + 14);
    ctx.fillStyle = '#667788'; ctx.font = '8px monospace';
    ctx.fillText(n.country, n.px, n.py + radius + 26);
  });

  ctx.textAlign = 'start';
}

function fakeEncrypt(msg, layers) {
  let result = msg;
  for (let i = 0; i < layers; i++) {
    result = btoa(unescape(encodeURIComponent(result))).slice(0, 40) + '...';
  }
  return result;
}

async function sendMessage() {
  if (animating) return;
  animating = true;
  const s = LANG[currentLang];
  const input = $('msgInput');
  const msg = input ? input.value.trim() : 'Hello';
  const canvas = $('torCanvas');
  const layerInfo = $('layerInfo');
  if (!canvas) { animating = false; return; }
  const ctx = canvas.getContext('2d');

  buildCircuit();
  showToast(s.encrypting);
  log(`🔐 ${s.encrypting}`, 'tx');
  setStatus(true);

  if (layerInfo) { layerInfo.style.display = 'block'; layerInfo.innerHTML = ''; }

  // Show encryption layers being added
  const encrypted = [];
  encrypted.push(msg);
  for (let i = 0; i < 3; i++) {
    encrypted.push(fakeEncrypt(encrypted[encrypted.length - 1], 1));
    await sleep(400);
    if (layerInfo) {
      const div = document.createElement('div');
      div.style.cssText = `padding:.3rem .5rem;margin:.2rem 0;border-radius:4px;border-left:3px solid ${LAYER_COLORS[2 - i]};font-size:.75rem;font-family:monospace;word-break:break-all;`;
      div.innerHTML = `<strong>${s.layer} ${i + 1}:</strong> ${encrypted[encrypted.length - 1]}`;
      layerInfo.appendChild(div);
    }
    log(`🔐 ${s.layer} ${i + 1} added`, 'info');
  }

  await sleep(300);
  showToast(s.routing);
  log(`🧅 ${s.routing}`, 'tx');

  // Animate through nodes
  for (let hop = 0; hop < 4; hop++) {
    drawNetwork(canvas, ctx, hop, hop);
    await sleep(600);
    drawNetwork(canvas, ctx, hop);
    if (hop < 3) {
      log(`📦 ${s.layer} ${3 - hop} ${s.peeled} ${circuit[hop + 1].label} (${circuit[hop + 1].country})`, 'rx');
    }
    await sleep(400);
  }

  // Final state
  drawNetwork(canvas, ctx, 4);

  // Show delivered message
  if (layerInfo) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:.5rem;margin-top:.5rem;border-radius:4px;background:#33cc5522;border:1px solid #33cc55;font-size:.8rem;text-align:center;';
    div.innerHTML = `✅ <strong>${s.delivered}</strong><br><span style="font-family:monospace;">${msg}</span>`;
    layerInfo.appendChild(div);
  }

  hideToast();
  log(`✅ ${s.delivered}`, 'success');
  animating = false;
}

function buildNewCircuit() {
  buildCircuit();
  const canvas = $('torCanvas');
  if (canvas) drawNetwork(canvas, canvas.getContext('2d'));
  const info = $('circuitInfo');
  if (info) {
    info.innerHTML = circuit.map((n, i) => `<span style="color:${['#33cc55','#ff4444','#ff8800','#ffcc00','#33cc55'][i]};">${n.country} ${n.label}</span>`).join(' → ');
  }
  log('🔄 New circuit built: ' + circuit.map(n => n.country).join(' → '), 'success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  buildCircuit();
  const canvas=$('torCanvas');if(canvas)drawNetwork(canvas,canvas.getContext('2d'));
  const sendBtn=$('sendBtn');if(sendBtn)sendBtn.onclick=sendMessage;
  const newCircuitBtn=$('newCircuitBtn');if(newCircuitBtn)newCircuitBtn.onclick=buildNewCircuit;

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Onion Layer Encryption Visualizer ═══════ */
(function(){
let lCanvas,lCtx;const layerParticles=[];
function createLC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Onion Layer Encryption Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=300;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawL(){
  if(!lCtx)return;const w=lCanvas.width,h=lCanvas.height,cx=w/2,cy=h/2;
  lCtx.fillStyle='rgba(6,13,26,0.1)';lCtx.fillRect(0,0,w,h);
  lCtx.strokeStyle='#0a1a30';lCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=25){lCtx.beginPath();lCtx.moveTo(i,0);lCtx.lineTo(i,h);lCtx.stroke();}
  for(let i=0;i<h;i+=25){lCtx.beginPath();lCtx.moveTo(0,i);lCtx.lineTo(w,i);lCtx.stroke();}
  const layers=[
    {r:110,color:'#ff4444',label:'Layer 3: Exit Encryption',speed:0.003},
    {r:80,color:'#ff8800',label:'Layer 2: Middle Encryption',speed:0.005},
    {r:50,color:'#ffcc00',label:'Layer 1: Entry Encryption',speed:0.008},
    {r:20,color:'#33cc55',label:'Plaintext Message',speed:0},
  ];
  const t=Date.now()/1000;
  layers.forEach((l,idx)=>{
    const segments=12+idx*4;
    for(let s=0;s<segments;s++){
      const a=(s/segments)*Math.PI*2+t*l.speed*(idx%2===0?1:-1);
      const a2=((s+0.8)/segments)*Math.PI*2+t*l.speed*(idx%2===0?1:-1);
      lCtx.beginPath();lCtx.arc(cx,cy,l.r,a,a2);
      lCtx.strokeStyle=l.color+(idx===3?'cc':'66');lCtx.lineWidth=idx===3?4:8-idx;lCtx.stroke();
    }
    const labelAngle=t*0.3+idx*1.2;
    const lx=cx+Math.cos(labelAngle)*(l.r+18);const ly=cy+Math.sin(labelAngle)*(l.r+18);
    lCtx.fillStyle=l.color;lCtx.font='8px Orbitron,monospace';lCtx.textAlign='center';
    lCtx.fillText(l.label,lx,ly);
    // Orbiting data bits
    for(let b=0;b<3;b++){
      const ba=t*(0.5+idx*0.2)+b*(Math.PI*2/3);
      const bx=cx+Math.cos(ba)*l.r,by=cy+Math.sin(ba)*l.r;
      lCtx.beginPath();lCtx.arc(bx,by,2+idx*0.5,0,Math.PI*2);
      lCtx.fillStyle=l.color;lCtx.fill();
    }
  });
  // Center icon
  lCtx.fillStyle='#fff';lCtx.font='16px serif';lCtx.textAlign='center';lCtx.fillText('📨',cx,cy+6);
  // Particles
  for(let i=layerParticles.length-1;i>=0;i--){
    const p=layerParticles[i];p.life-=0.01;p.r+=0.5;p.angle+=p.speed;
    if(p.life<=0){layerParticles.splice(i,1);continue;}
    const px=cx+Math.cos(p.angle)*p.r,py=cy+Math.sin(p.angle)*p.r;
    lCtx.globalAlpha=p.life;lCtx.beginPath();lCtx.arc(px,py,3,0,Math.PI*2);
    lCtx.fillStyle=p.color;lCtx.fill();lCtx.globalAlpha=1;
  }
  lCtx.fillStyle='rgba(255,255,255,0.3)';lCtx.font='8px monospace';lCtx.textAlign='left';
  lCtx.fillText('Layers: 3 | Cipher: AES-256 | Key Exchange: Curve25519',10,h-8);
  requestAnimationFrame(drawL);
}
function initLC(){lCanvas=createLC();if(!lCanvas)return;lCtx=lCanvas.getContext('2d');
  lCanvas.addEventListener('click',()=>{
    const colors=['#ff4444','#ff8800','#ffcc00','#33cc55'];
    for(let i=0;i<20;i++)layerParticles.push({r:20+Math.random()*30,angle:Math.random()*Math.PI*2,
      speed:(Math.random()-0.5)*0.05,life:1,color:colors[Math.floor(Math.random()*4)]});
  });drawL();}
setTimeout(initLC,1500);
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

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this spy tool. First, look at the main control panel above. 🕵️', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary button to start the simulation. Watch the visualization come alive! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now try changing a setting — slide a slider or pick a different option. See how it changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results below. The numbers and graphs show you what happened in real time. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Great job! 🎉 Now try the Lab section below for hands-on experiments. You\'re a real spy now!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}
