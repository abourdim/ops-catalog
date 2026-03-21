/**
 * Workshop DIY — Burner Chat v1.2
 * Ephemeral P2P — Encrypted chat that vanishes
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}else{o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}}

// ── Shared i18n keys (template) ──
const LANG_BASE = {
  en: {
    copied:'Copied!',
    demoNext:'Next',
    demoPause:'Pause',
    demoPlay:'Play',
    demoPrev:'Prev',
    learnAge:'Ages:',
    learnLevel:'Level:',
    learnTime:'Time:',
    logCleared:'Log cleared',
    sectionCode:'Device Code',
    sectionDemo:'Watch Demo',
    sectionLearn:'What You Shall Learn',
    splashHint:'tap to skip'
  },
  fr: {
    copied:'Copié !',
    demoNext:'Suiv',
    demoPause:'Pause',
    demoPlay:'Jouer',
    demoPrev:'Préc',
    learnAge:'Âge :',
    learnLevel:'Niveau :',
    learnTime:'Durée :',
    logCleared:'Journal effacé',
    sectionCode:'Code Appareil',
    sectionDemo:'Voir la Démo',
    sectionLearn:'Ce que tu vas apprendre',
    splashHint:'appuyer pour passer'
  },
  ar: {
    copied:'تم النسخ!',
    demoNext:'التالي',
    demoPause:'إيقاف',
    demoPlay:'تشغيل',
    demoPrev:'السابق',
    learnAge:'العمر:',
    learnLevel:'المستوى:',
    learnTime:'المدة:',
    logCleared:'تم مسح السجل',
    sectionCode:'كود الجهاز',
    sectionDemo:'شاهد العرض',
    sectionLearn:'ماذا ستتعلم',
    splashHint:'انقر للتخطي'
  }
};

const LANG={
  en:{
    ...LANG_BASE.en,title:'Burner Chat',subtitle:'💬 Encrypted chat that vanishes when you close the tab',disconnected:'Disconnected',connected:'Connected',mainSection:'Ephemeral P2P Chat',mainDesc:'Messages auto-destruct after the timer expires',sectionA:'How E2E Encryption Works',sectionB:'Ephemeral Messaging',sectionC:'Encryption Inspector',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Type a message and click Send.',howto_2:'Watch the encryption indicator.',howto_3:'Messages fade after the timer.',howto_4:'Inspect encryption in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'💬 Burner Chat ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',sendBtn:'Send',e2eLabel:'End-to-End Encrypted',timerLabel:'Self-destruct:',e2eText:'E2E encryption ensures only sender and recipient can read messages.',ephemeralText:'Ephemeral messages disappear after being read or after a timer.',inspectorText:'See the raw encrypted form of your messages.',inspectBtn:'Inspect Last Message',msgSent:'Message sent (encrypted)',msgReceived:'Reply received',msgBurned:'Message self-destructed',peerTyping:'Agent Shadow is typing...',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code',faq_q1:'What is Burner Chat?',faq_a1:'Burner Chat lets you messages auto-destruct after the timer expires. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set up the simulation parameters and choose your encryption method. Then you the data is processed through the chosen algorithm or technique.',faq_q3:'What do the controls do?',faq_a3:'Type a message and click Send. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real digital security principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Web Cipher Suite and Web Dark Profile. Each app in this category teaches a different aspect of digital security.',demo_s1:'Welcome to Burner Chat! Look at the main display — this is where the digital security simulation runs.',demo_s2:'Type a message and click Send. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How E2E Encryption Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Cryptography',learn1Desc:'How secret codes protect messages from spies',learn1Tag:'Cybersecurity',learn2Title:'Wireless Communication',learn2Desc:'How devices send invisible signals through the air',learn2Tag:'Wireless',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure',learn3Tag:'Security',learn4Title:'Math in Security',learn4Desc:'How numbers and algorithms make unbreakable codes',learn4Tag:'Math',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how digital security works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How E2E Encryption Works" and "Ephemeral Messaging" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Chat Ephemere',subtitle:'💬 Chat chiffre qui disparait quand vous fermez l\'onglet',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Chat P2P Ephemere',mainDesc:'Les messages s\'auto-detruisent apres le delai',sectionA:'Chiffrement E2E',sectionB:'Messagerie Ephemere',sectionC:'Inspecteur Chiffrement',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Tapez et envoyez.',howto_2:'Regardez l\'indicateur de chiffrement.',howto_3:'Les messages disparaissent.',howto_4:'Inspectez le chiffrement.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'💬 Chat Ephemere pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',sendBtn:'Envoyer',e2eLabel:'Chiffrement bout-en-bout',timerLabel:'Auto-destruction:',e2eText:'Le chiffrement E2E garantit que seuls l\'expediteur et le destinataire lisent les messages.',ephemeralText:'Les messages ephemeres disparaissent apres lecture ou delai.',inspectorText:'Voyez la forme chiffree brute.',inspectBtn:'Inspecter Dernier Message',msgSent:'Message envoye (chiffre)',msgReceived:'Reponse recue',msgBurned:'Message auto-detruit',peerTyping:'Agent Ombre tape...',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'C\'est comme un simulateur de gadget d\'espion ! 🕵️ Tu peux jouer avec du vrai chiffrement et des messages secrets.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages.',faq_q3:'Que dois-je essayer d\'abord ?',faq_a3:'Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐',faq_q5:'Je peux le casser ?',faq_a5:'Essaie la section Labo ! Vois si tu peux craquer le code. C\'est comme ça que pensent les vrais chercheurs ! 💪',faq_q6:'Quel matériel me faut-il ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d\'internet.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Exif Eraser and Web Cipher Suite ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cet outil d\'espion. D\'abord, regarde le panneau de contrôle. 🕵️',demo_s2:'Clique sur le bouton principal pour démarrer. Regarde la visualisation s\'animer ! ⚡',demo_s3:'Maintenant change un réglage — déplace un curseur ou choisis une option. Tu vois la différence ? 🔄',demo_s4:'Vérifie les résultats. Les chiffres et graphiques montrent ce qui s\'est passé. 📊',demo_s5:'Bravo ! 🎉 Essaie maintenant la section Labo pour des expériences pratiques !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Cryptographie',learn1Desc:'Comment les codes secrets protègent les messages',learn1Tag:'Cybersécurité',learn2Title:'Communication sans fil',learn2Desc:'Comment les appareils envoient des signaux invisibles',learn2Tag:'Sans fil',learn3Title:'OPSEC',learn3Desc:'Comment garder tes opérations secrètes et sécurisées',learn3Tag:'Sécurité',learn4Title:'Maths en sécurité',learn4Desc:'Comment les nombres créent des codes incassables',learn4Tag:'Maths',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{title:'الدردشة المؤقتة',subtitle:'💬 دردشة مشفرة تختفي عند اغلاق التبويب',disconnected:'غير متصل',connected:'متصل',mainSection:'دردشة P2P مؤقتة',mainDesc:'الرسائل تتدمر ذاتيا بعد انتهاء المؤقت',sectionA:'كيف يعمل تشفير E2E',sectionB:'الرسائل المؤقتة',sectionC:'فاحص التشفير',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اكتب رسالة وارسل.',howto_2:'شاهد مؤشر التشفير.',howto_3:'الرسائل تتلاشى.',howto_4:'افحص التشفير.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'💬 الدردشة المؤقتة جاهزة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',sendBtn:'ارسال',e2eLabel:'تشفير طرف لطرف',timerLabel:'تدمير ذاتي:',e2eText:'تشفير E2E يضمن ان المرسل والمستقبل فقط يقرآن الرسائل.',ephemeralText:'الرسائل المؤقتة تختفي بعد القراءة او المؤقت.',inspectorText:'شاهد الشكل المشفر الخام.',inspectBtn:'فحص اخر رسالة',msgSent:'تم ارسال الرسالة (مشفرة)',msgReceived:'تم استقبال الرد',msgBurned:'الرسالة تدمرت ذاتيا',peerTyping:'العميل الظل يكتب...',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'إنه مثل محاكي أدوات التجسس! 🕵️ يمكنك اللعب بتشفير حقيقي ورسائل سرية.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت.',faq_q8:'ماذا أجرب بعد ذلك؟',faq_a8:'جرب Web Exif Eraser and Web Cipher Suite! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف أداة التجسس هذه. أولاً، انظر إلى لوحة التحكم الرئيسية. 🕵️',demo_s2:'اضغط على الزر الرئيسي لبدء المحاكاة. شاهد التصور يتحرك! ⚡',demo_s3:'الآن جرب تغيير إعداد — حرك شريط تمرير أو اختر خياراً مختلفاً. هل ترى الفرق؟ 🔄',demo_s4:'تحقق من النتائج. الأرقام والرسوم البيانية تُظهر ما حدث. 📊',demo_s5:'أحسنت! 🎉 جرب الآن قسم المختبر للتجارب العملية!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'التشفير',learn1Desc:'كيف تحمي الشفرات السرية الرسائل',learn1Tag:'أمن سيبراني',learn2Title:'الاتصال اللاسلكي',learn2Desc:'كيف ترسل الأجهزة إشارات غير مرئية',learn2Tag:'لاسلكي',learn3Title:'أمن العمليات',learn3Desc:'كيف تحافظ على سرية عملياتك وأمانها',learn3Tag:'أمان',learn4Title:'الرياضيات في الأمن',learn4Desc:'كيف تصنع الأرقام والخوارزميات شفرات غير قابلة للكسر',learn4Tag:'رياضيات',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
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

/* ═══════ BURNER CHAT SIMULATION ═══════ */

const PEER_REPLIES = [
  'Roger that. Proceeding to rendezvous point.',
  'Copy. Intel received. Analyzing now.',
  'Understood. Maintain radio silence after this.',
  'Affirmative. Package is secure.',
  'Intel confirmed. Moving to phase 2.',
  'Be advised: area is hot. Proceed with caution.',
  'Acknowledged. ETA 15 minutes.',
  'Target acquired. Awaiting green light.',
  'Negative. Abort mission. Too many eyes.',
  'Wilco. Switching to backup frequency.',
  'All clear. Extraction point confirmed.',
  'Shadow reporting in. No hostile activity detected.',
];

let lastMsg = null;
let messageTimers = [];

function fakeEncryptMsg(text) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let enc = '';
  for (let i = 0; i < text.length; i++) {
    enc += chars[(text.charCodeAt(i) + i * 7 + 42) % chars.length];
  }
  return enc;
}

function addMessage(text, isMine, encrypted) {
  const s = LANG[currentLang];
  const container = $('chatMessages');
  if (!container) return;

  const timerVal = parseInt(($('timerSelect') || {}).value || '30');
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:${isMine ? 'flex-end' : 'flex-start'};`;

  const bubble = document.createElement('div');
  bubble.style.cssText = `max-width:75%;padding:.5rem .8rem;border-radius:12px;font-size:.85rem;position:relative;background:${isMine ? 'var(--accent)' : 'var(--glass-bg)'};color:${isMine ? '#000' : 'inherit'};border:1px solid ${isMine ? 'transparent' : 'var(--glass-border)'};transition:opacity 1s, transform 1s;`;
  bubble.textContent = text;

  const meta = document.createElement('div');
  meta.style.cssText = 'font-size:.65rem;opacity:.5;margin-top:.2rem;display:flex;align-items:center;gap:.3rem;';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  meta.innerHTML = `🔒 ${now}${timerVal > 0 ? ` · ⏱️ ${timerVal}s` : ''}`;

  wrapper.appendChild(bubble);
  wrapper.appendChild(meta);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;

  lastMsg = { text, encrypted: fakeEncryptMsg(text), isMine };

  // Self-destruct timer
  if (timerVal > 0) {
    const timerId = setTimeout(() => {
      bubble.style.opacity = '0';
      bubble.style.transform = 'scale(0.8)';
      meta.innerHTML = `🔥 ${s.msgBurned}`;
      meta.style.color = '#ff4444';
      setTimeout(() => { if (wrapper.parentElement) wrapper.remove(); }, 1000);
      log(`🔥 ${s.msgBurned}`, 'info');
    }, timerVal * 1000);
    messageTimers.push(timerId);

    // Countdown on meta
    let remaining = timerVal;
    const countdownId = setInterval(() => {
      remaining--;
      if (remaining <= 0) { clearInterval(countdownId); return; }
      if (meta.parentElement) meta.innerHTML = `🔒 ${now} · ⏱️ ${remaining}s`;
    }, 1000);
  }
}

async function sendChatMessage() {
  const s = LANG[currentLang];
  const input = $('chatInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  if (input) input.value = '';

  addMessage(text, true);
  log(`📤 ${s.msgSent}`, 'tx');
  playSound('click');

  // Simulate peer typing
  await sleep(800 + Math.random() * 1500);
  const container = $('chatMessages');
  if (container) {
    const typing = document.createElement('div');
    typing.style.cssText = 'font-size:.75rem;opacity:.5;padding:.3rem 0;';
    typing.textContent = s.peerTyping;
    typing.id = 'typingIndicator';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  await sleep(1000 + Math.random() * 2000);
  const typingEl = $('typingIndicator');
  if (typingEl) typingEl.remove();

  const reply = PEER_REPLIES[Math.floor(Math.random() * PEER_REPLIES.length)];
  addMessage(reply, false);
  log(`📥 ${s.msgReceived}`, 'rx');
  playSound('success');
}

function inspectLastMessage() {
  const results = $('inspectResults');
  if (!results) return;
  if (!lastMsg) { results.style.display = 'block'; results.textContent = 'No messages yet.'; return; }
  results.style.display = 'block';
  results.innerHTML = `<div style="margin-bottom:.5rem;"><strong>Original:</strong><br>${lastMsg.text}</div><div style="margin-bottom:.5rem;"><strong>Encrypted (simulated AES-256-GCM):</strong><br><span style="color:var(--accent);">${lastMsg.encrypted}</span></div><div><strong>Key Exchange:</strong> ECDH P-256<br><strong>Cipher:</strong> AES-256-GCM<br><strong>HMAC:</strong> SHA-256<br><strong>Forward Secrecy:</strong> Yes (ephemeral keys)</div>`;
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
  const chatSendBtn=$('chatSendBtn');if(chatSendBtn)chatSendBtn.onclick=sendChatMessage;
  const chatInput=$('chatInput');if(chatInput)chatInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendChatMessage();});
  const inspectBtn=$('inspectBtn');if(inspectBtn)inspectBtn.onclick=inspectLastMessage;
  setStatus(true);

  // Welcome message from peer
  setTimeout(() => { addMessage('Agent Shadow online. Secure channel established. You may proceed.', false); }, 1500);

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED CANVAS VISUALIZATION — Encryption Flow ═══════ */
(function(){
const particles=[];
const encNodes=[
  {x:80,y:100,label:'You',icon:'👤',color:'#33cc55'},
  {x:300,y:60,label:'E2E Layer',icon:'🔐',color:'#ffcc00'},
  {x:520,y:100,label:'Agent Shadow',icon:'🕵️',color:'#4488ff'},
];
const relayNodes=[
  {x:190,y:180,label:'Relay A',icon:'📡',color:'#ff6644'},
  {x:410,y:180,label:'Relay B',icon:'📡',color:'#cc44ff'},
];
let simCanvas,simCtx;

function createSimCanvas(){
  const cards=document.querySelectorAll('.card');
  const target=cards.length>0?cards[0]:document.body;
  const wrap=document.createElement('div');
  wrap.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  wrap.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Encryption Flow Visualization</div>';
  const c=document.createElement('canvas');
  c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;cursor:crosshair;background:#060d1a;';
  wrap.appendChild(c);target.appendChild(wrap);
  return c;
}

function spawnParticle(from,to,color){
  particles.push({x:from.x,y:from.y,tx:to.x,ty:to.y,t:0,color,speed:0.008+Math.random()*0.012,size:3+Math.random()*3,trail:[]});
}

function drawSim(){
  if(!simCtx)return;
  const w=simCanvas.width,h=simCanvas.height;
  simCtx.fillStyle='rgba(6,13,26,0.15)';simCtx.fillRect(0,0,w,h);
  simCtx.strokeStyle='#0a1a30';simCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=30){simCtx.beginPath();simCtx.moveTo(i,0);simCtx.lineTo(i,h);simCtx.stroke();}
  for(let i=0;i<h;i+=30){simCtx.beginPath();simCtx.moveTo(0,i);simCtx.lineTo(w,i);simCtx.stroke();}
  const allNodes=[...encNodes,...relayNodes];
  [[0,3],[3,1],[1,4],[4,2]].forEach(([a,b])=>{
    simCtx.beginPath();simCtx.moveTo(allNodes[a].x,allNodes[a].y);simCtx.lineTo(allNodes[b].x,allNodes[b].y);
    simCtx.strokeStyle='rgba(100,150,200,0.15)';simCtx.lineWidth=1.5;simCtx.stroke();
  });
  allNodes.forEach(n=>{
    simCtx.beginPath();simCtx.arc(n.x,n.y,20,0,Math.PI*2);
    simCtx.fillStyle=n.color+'22';simCtx.fill();
    simCtx.strokeStyle=n.color;simCtx.lineWidth=2;simCtx.stroke();
    simCtx.fillStyle='#fff';simCtx.font='14px serif';simCtx.textAlign='center';
    simCtx.fillText(n.icon,n.x,n.y+5);
    simCtx.fillStyle=n.color;simCtx.font='9px Orbitron,monospace';
    simCtx.fillText(n.label,n.x,n.y+34);
  });
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.t+=p.speed;
    p.x+=(p.tx-p.x)*p.speed*3;p.y+=(p.ty-p.y)*p.speed*3;
    p.trail.push({x:p.x,y:p.y});if(p.trail.length>12)p.trail.shift();
    p.trail.forEach((pt,idx)=>{
      simCtx.beginPath();simCtx.arc(pt.x,pt.y,p.size*(idx/p.trail.length),0,Math.PI*2);
      simCtx.fillStyle=p.color+(Math.floor(25+idx*15).toString(16).padStart(2,'0'));simCtx.fill();
    });
    simCtx.beginPath();simCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    simCtx.fillStyle=p.color;simCtx.fill();
    if(p.t>1||Math.abs(p.x-p.tx)<5&&Math.abs(p.y-p.ty)<5)particles.splice(i,1);
  }
  const pulse=Math.sin(Date.now()/400)*3;
  simCtx.beginPath();simCtx.arc(encNodes[1].x,encNodes[1].y,28+pulse,0,Math.PI*2);
  simCtx.strokeStyle='rgba(255,204,0,0.2)';simCtx.lineWidth=2;simCtx.stroke();
  simCtx.fillStyle='rgba(255,255,255,0.3)';simCtx.font='8px monospace';simCtx.textAlign='left';
  simCtx.fillText('Active packets: '+particles.length+' | E2E: AES-256-GCM | Forward Secrecy: ON',10,h-10);
  requestAnimationFrame(drawSim);
}

function initEnhancedSim(){
  simCanvas=createSimCanvas();if(!simCanvas)return;
  simCtx=simCanvas.getContext('2d');
  setInterval(()=>{
    if(Math.random()>0.4){
      const allN=[...encNodes,...relayNodes];const route=[0,3,1,4,2];
      const s=Math.floor(Math.random()*4);
      spawnParticle(allN[route[s]],allN[route[s+1]],['#33cc55','#ffcc00','#4488ff','#ff6644','#cc44ff'][Math.floor(Math.random()*5)]);
    }
  },600);
  simCanvas.addEventListener('click',()=>{
    const allN=[...encNodes,...relayNodes];const route=[0,3,1,4,2];
    for(let i=0;i<4;i++)setTimeout(()=>spawnParticle(allN[route[i]],allN[route[i+1]],'#33ff88'),i*150);
  });
  drawSim();
}
setTimeout(initEnhancedSim,1500);
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

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
