/**
 * Workshop DIY — Network Map v1.2
 * Spy Graph — Map peer connections as a spy network
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
    ...LANG_BASE.en,title:'Network Map',subtitle:'🗺️ Map peer connections as a spy network',disconnected:'Disconnected',connected:'Connected',mainSection:'Spy Network Graph',mainDesc:'Build and explore a force-directed network graph',sectionA:'Network Graph Theory',sectionB:'Encrypted Communication',sectionC:'Network Analysis',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Network Graph Theory" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_log_title:'📜 Activity Log',wiki_log:'سجل مؤرخ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'محلي اولا. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🗺️ Network Map ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',addAgent:'Add Agent',sendMsg:'Send Message',discover:'Discover Node',resetBtn:'Reset',graphHint:'Click canvas to select nodes. Drag to move.',graphTheory:'Network graphs model relationships. Nodes=agents, edges=connections.',encComm:'Messages are encrypted and routed through intermediary nodes.',analysisText:'Analyze centrality, clustering, and vulnerabilities.',analyzeNetBtn:'Analyze Network',agentAdded:'Agent added',msgSent:'Message routed',discovered:'Connection discovered',networkReset:'Network reset',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code',faq_q1:'What is Network Map?',faq_a1:'Network Map lets you build and explore a force-directed network graph. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real digital security behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real digital security principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Web Burner Chat and Web Cipher Suite. Each app in this category teaches a different aspect of digital security.',demo_s1:'Welcome to Network Map! Look at the main display — this is where the digital security simulation runs.',demo_s2:'Click Add Agent to create nodes. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Network Graph Theory" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Cryptography',learn1Desc:'How secret codes protect messages from spies. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cybersecurity',learn2Title:'Wireless Communication',learn2Desc:'How devices send invisible signals through the air. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Wireless',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Security',learn4Title:'Math in Security',learn4Desc:'How numbers and algorithms make unbreakable codes. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Math',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how digital security works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Network Map: Build and explore a force-directed network graph. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure through Process to Transmit and Verify.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Network Graph Theory" and "Encrypted Communication" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Carte Reseau',subtitle:'🗺️ Cartographier les connexions comme un reseau d\'espions',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Graphe Reseau Espion',mainDesc:'Construisez et explorez un graphe de reseau',sectionA:'Theorie des Graphes',sectionB:'Communication Chiffree',sectionC:'Analyse Reseau',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez Ajouter Agent.',howto_2:'Envoyez un message.',howto_3:'Decouvrez des connexions.',howto_4:'Analysez le reseau.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🗺️ Carte Reseau pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',addAgent:'Ajouter Agent',sendMsg:'Envoyer Message',discover:'Decouvrir Noeud',resetBtn:'Reset',graphHint:'Cliquez pour selectionner. Glissez pour deplacer.',graphTheory:'Les graphes modelisent les relations.',encComm:'Les messages sont chiffres et routes.',analysisText:'Analysez centralite et vulnerabilites.',analyzeNetBtn:'Analyser Reseau',agentAdded:'Agent ajoute',msgSent:'Message route',discovered:'Connexion decouverte',networkReset:'Reseau reinitialise',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'C\'est comme un simulateur de gadget d\'espion ! 🕵️ Tu peux jouer avec du vrai chiffrement et des messages secrets.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages.',faq_q3:'Que dois-je essayer d\'abord ?',faq_a3:'Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐',faq_q5:'Je peux le casser ?',faq_a5:'Essaie la section Labo ! Vois si tu peux craquer le code. C\'est comme ça que pensent les vrais chercheurs ! 💪',faq_q6:'Quel matériel me faut-il ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d\'internet.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Dark Profile and Web Metadata Detective ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cet outil d\'espion. D\'abord, regarde le panneau de contrôle. 🕵️',demo_s2:'Clique sur le bouton principal pour démarrer. Regarde la visualisation s\'animer ! ⚡',demo_s3:'Maintenant change un réglage — déplace un curseur ou choisis une option. Tu vois la différence ? 🔄',demo_s4:'Vérifie les résultats. Les chiffres et graphiques montrent ce qui s\'est passé. 📊',demo_s5:'Bravo ! 🎉 Essaie maintenant la section Labo pour des expériences pratiques !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Cryptographie',learn1Desc:'Comment les codes secrets protègent les messages',learn1Tag:'Cybersécurité',learn2Title:'Communication sans fil',learn2Desc:'Comment les appareils envoient des signaux invisibles',learn2Tag:'Sans fil',learn3Title:'OPSEC',learn3Desc:'Comment garder tes opérations secrètes et sécurisées',learn3Tag:'Sécurité',learn4Title:'Maths en sécurité',learn4Desc:'Comment les nombres créent des codes incassables',learn4Tag:'Maths',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{title:'خريطة الشبكة',subtitle:'🗺️ رسم خريطة اتصالات كشبكة تجسس',disconnected:'غير متصل',connected:'متصل',mainSection:'رسم بياني لشبكة التجسس',mainDesc:'ابن واستكشف رسما بيانيا للشبكة',sectionA:'نظرية الرسوم البيانية',sectionB:'الاتصال المشفر',sectionC:'تحليل الشبكة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'انقر اضافة عميل.',howto_2:'ارسل رسالة.',howto_3:'اكتشف اتصالات.',howto_4:'حلل الشبكة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🗺️ خريطة الشبكة جاهزة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',addAgent:'اضافة عميل',sendMsg:'ارسال رسالة',discover:'اكتشاف عقدة',resetBtn:'اعادة',graphHint:'انقر لتحديد. اسحب للتحريك.',graphTheory:'الرسوم البيانية تمثل العلاقات.',encComm:'الرسائل مشفرة ومسارها عبر عقد وسيطة.',analysisText:'حلل المركزية والتجمع والثغرات.',analyzeNetBtn:'تحليل الشبكة',agentAdded:'تمت اضافة عميل',msgSent:'تم توجيه الرسالة',discovered:'تم اكتشاف اتصال',networkReset:'تمت اعادة تعيين الشبكة',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'إنه مثل محاكي أدوات التجسس! 🕵️ يمكنك اللعب بتشفير حقيقي ورسائل سرية.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت.',faq_q8:'ماذا أجرب بعد ذلك؟',faq_a8:'جرب Web Dark Profile and Web Metadata Detective! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف أداة التجسس هذه. أولاً، انظر إلى لوحة التحكم الرئيسية. 🕵️',demo_s2:'اضغط على الزر الرئيسي لبدء المحاكاة. شاهد التصور يتحرك! ⚡',demo_s3:'الآن جرب تغيير إعداد — حرك شريط تمرير أو اختر خياراً مختلفاً. هل ترى الفرق؟ 🔄',demo_s4:'تحقق من النتائج. الأرقام والرسوم البيانية تُظهر ما حدث. 📊',demo_s5:'أحسنت! 🎉 جرب الآن قسم المختبر للتجارب العملية!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'التشفير',learn1Desc:'كيف تحمي الشفرات السرية الرسائل',learn1Tag:'أمن سيبراني',learn2Title:'الاتصال اللاسلكي',learn2Desc:'كيف ترسل الأجهزة إشارات غير مرئية',learn2Tag:'لاسلكي',learn3Title:'أمن العمليات',learn3Desc:'كيف تحافظ على سرية عملياتك وأمانها',learn3Tag:'أمان',learn4Title:'الرياضيات في الأمن',learn4Desc:'كيف تصنع الأرقام والخوارزميات شفرات غير قابلة للكسر',learn4Tag:'رياضيات',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
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

/* ═══════ NETWORK MAP — FORCE-DIRECTED GRAPH ═══════ */

const AGENT_NAMES=['Alpha','Bravo','Charlie','Delta','Echo','Foxtrot','Golf','Hotel','India','Juliet','Kilo','Lima','Mike','November','Oscar','Papa','Quebec','Romeo','Sierra','Tango'];
const NODE_COLORS=['#ff4444','#33cc55','#4488ff','#ffaa00','#cc44ff','#00cccc','#ff6699','#88ff44'];
let nodes=[],edges=[],animFrame=null,selectedNode=null,dragging=null,msgAnim=null;

function addAgent(){
  const s=LANG[currentLang];
  const idx=nodes.length;
  if(idx>=AGENT_NAMES.length)return;
  const canvas=$('graphCanvas');if(!canvas)return;
  const w=canvas.width,h=canvas.height;
  const node={
    id:idx,name:AGENT_NAMES[idx],
    x:100+Math.random()*(w-200),y:100+Math.random()*(h-200),
    vx:0,vy:0,
    color:NODE_COLORS[idx%NODE_COLORS.length],
    radius:16+Math.random()*8
  };
  nodes.push(node);
  // Add random edges to existing nodes
  if(nodes.length>1){
    const target=nodes[Math.floor(Math.random()*(nodes.length-1))];
    edges.push({from:node.id,to:target.id,strength:0.3+Math.random()*0.7});
  }
  if(nodes.length>2&&Math.random()>0.5){
    const target=nodes[Math.floor(Math.random()*(nodes.length-1))];
    if(target.id!==node.id&&!edges.find(e=>(e.from===node.id&&e.to===target.id)||(e.from===target.id&&e.to===node.id)))
      edges.push({from:node.id,to:target.id,strength:0.2+Math.random()*0.5});
  }
  log(`➕ ${s.agentAdded}: ${node.name}`,'success');setStatus(true);
}

function discoverNode(){
  const s=LANG[currentLang];
  if(nodes.length<2)return;
  // Add a random edge between existing nodes
  let a,b,tries=0;
  do{a=Math.floor(Math.random()*nodes.length);b=Math.floor(Math.random()*nodes.length);tries++;}
  while((a===b||edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a)))&&tries<50);
  if(a!==b&&!edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a))){
    edges.push({from:a,to:b,strength:0.3+Math.random()*0.7});
    log(`🔍 ${s.discovered}: ${nodes[a].name} ↔ ${nodes[b].name}`,'success');
  }
}

function sendNetMessage(){
  const s=LANG[currentLang];
  if(nodes.length<2||edges.length<1)return;
  const edge=edges[Math.floor(Math.random()*edges.length)];
  edge.msgT=0;edge.msgDir=Math.random()>0.5?1:-1;
  log(`📨 ${s.msgSent}: ${nodes[edge.from].name} → ${nodes[edge.to].name}`,'tx');
}

function resetNetwork(){
  nodes=[];edges=[];selectedNode=null;
  log(`🗑️ ${LANG[currentLang].networkReset}`,'info');
}

function analyzeNetwork(){
  const results=$('netAnalysis');if(!results)return;results.style.display='block';
  if(nodes.length===0){results.textContent='No nodes in network.';return;}
  // Degree centrality
  const degrees={};nodes.forEach(n=>degrees[n.id]=0);
  edges.forEach(e=>{degrees[e.from]++;degrees[e.to]++;});
  const maxDeg=Math.max(...Object.values(degrees),1);
  const central=nodes.reduce((a,b)=>degrees[a.id]>=degrees[b.id]?a:b);
  const density=nodes.length>1?(2*edges.length/(nodes.length*(nodes.length-1))):0;
  results.innerHTML=`<div style="font-size:.8rem;"><div style="margin-bottom:.5rem;"><strong>Nodes:</strong> ${nodes.length} | <strong>Edges:</strong> ${edges.length}</div><div style="margin-bottom:.5rem;"><strong>Density:</strong> ${(density*100).toFixed(1)}%</div><div style="margin-bottom:.5rem;"><strong>Most connected:</strong> <span style="color:${central.color};">${central.name}</span> (${degrees[central.id]} connections)</div><div style="margin-bottom:.5rem;"><strong>Centrality ranking:</strong></div>${nodes.map(n=>`<div style="display:flex;align-items:center;gap:.3rem;margin:.2rem 0;"><span style="color:${n.color};font-weight:700;">${n.name}</span><div style="flex:1;height:6px;border-radius:3px;background:#1a1a2e;"><div style="height:100%;width:${degrees[n.id]/maxDeg*100}%;background:${n.color};border-radius:3px;"></div></div><span style="font-size:.7rem;">${degrees[n.id]}</span></div>`).join('')}</div>`;
  log('📊 Network analysis complete','success');
}

/* Force-directed layout */
function simulate(){
  const canvas=$('graphCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;

  // Physics
  const repulsion=5000,spring=0.005,damping=0.85,restLen=120;
  // Repulsion between all nodes
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      let dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y;
      let dist=Math.sqrt(dx*dx+dy*dy)||1;
      let f=repulsion/(dist*dist);
      let fx=dx/dist*f,fy=dy/dist*f;
      nodes[i].vx-=fx;nodes[i].vy-=fy;
      nodes[j].vx+=fx;nodes[j].vy+=fy;
    }
  }
  // Spring forces along edges
  edges.forEach(e=>{
    const a=nodes[e.from],b=nodes[e.to];if(!a||!b)return;
    let dx=b.x-a.x,dy=b.y-a.y;
    let dist=Math.sqrt(dx*dx+dy*dy)||1;
    let f=(dist-restLen)*spring*e.strength;
    let fx=dx/dist*f,fy=dy/dist*f;
    a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy;
  });
  // Center gravity
  nodes.forEach(n=>{
    n.vx+=(w/2-n.x)*0.0005;n.vy+=(h/2-n.y)*0.0005;
    n.vx*=damping;n.vy*=damping;
    if(n!==dragging){n.x+=n.vx;n.y+=n.vy;}
    n.x=Math.max(n.radius,Math.min(w-n.radius,n.x));
    n.y=Math.max(n.radius,Math.min(h-n.radius,n.y));
  });

  // Draw
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#060d1a';ctx.fillRect(0,0,w,h);
  // Grid
  ctx.strokeStyle='#0a1a30';ctx.lineWidth=0.5;
  for(let i=0;i<w;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=40){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}

  // Edges
  edges.forEach(e=>{
    const a=nodes[e.from],b=nodes[e.to];if(!a||!b)return;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=`rgba(100,150,200,${0.2+e.strength*0.5})`;
    ctx.lineWidth=1+e.strength*3;ctx.stroke();
    // Message animation
    if(e.msgT!=null&&e.msgT<1){
      e.msgT+=0.02;
      const t=e.msgDir>0?e.msgT:1-e.msgT;
      const mx=a.x+(b.x-a.x)*t,my=a.y+(b.y-a.y)*t;
      ctx.beginPath();ctx.arc(mx,my,6,0,Math.PI*2);
      ctx.fillStyle='#ffcc00';ctx.fill();
      ctx.fillStyle='#000';ctx.font='8px serif';ctx.textAlign='center';ctx.fillText('📨',mx,my+3);
      if(e.msgT>=1)delete e.msgT;
    }
  });

  // Nodes
  nodes.forEach(n=>{
    // Glow
    ctx.beginPath();ctx.arc(n.x,n.y,n.radius+6,0,Math.PI*2);
    ctx.fillStyle=n.color+'22';ctx.fill();
    // Circle
    ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);
    ctx.fillStyle=n===selectedNode?n.color+'88':'#0d1522';ctx.fill();
    ctx.strokeStyle=n.color;ctx.lineWidth=n===selectedNode?3:2;ctx.stroke();
    // Label
    ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.textAlign='center';
    ctx.fillText(n.name,n.x,n.y+3);
    ctx.fillStyle=n.color;ctx.font='7px monospace';
    ctx.fillText(`Agent-${String(n.id).padStart(2,'0')}`,n.x,n.y+n.radius+12);
  });
  ctx.textAlign='start';

  animFrame=requestAnimationFrame(simulate);
}

function initCanvasInteraction(){
  const canvas=$('graphCanvas');if(!canvas)return;
  canvas.addEventListener('mousedown',e=>{
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    for(const n of nodes){
      const dx=n.x-mx,dy=n.y-my;
      if(Math.sqrt(dx*dx+dy*dy)<n.radius+5){dragging=n;selectedNode=n;canvas.style.cursor='grabbing';return;}
    }
    selectedNode=null;
  });
  canvas.addEventListener('mousemove',e=>{
    if(!dragging)return;
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    dragging.x=(e.clientX-rect.left)*sx;dragging.y=(e.clientY-rect.top)*sy;
    dragging.vx=0;dragging.vy=0;
  });
  canvas.addEventListener('mouseup',()=>{dragging=null;canvas.style.cursor='grab';});
  canvas.addEventListener('mouseleave',()=>{dragging=null;canvas.style.cursor='grab';});
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
  $('addAgentBtn')&&($('addAgentBtn').onclick=addAgent);
  $('sendMsgBtn')&&($('sendMsgBtn').onclick=sendNetMessage);
  $('discoverBtn')&&($('discoverBtn').onclick=discoverNode);
  $('resetBtn')&&($('resetBtn').onclick=resetNetwork);
  $('analyzeNetBtn')&&($('analyzeNetBtn').onclick=analyzeNetwork);
  initCanvasInteraction();

  // Seed initial agents
  for(let i=0;i<4;i++)addAgent();
  simulate();
  setStatus(true);

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Network Traffic Heatmap & Bandwidth Monitor ═══════ */
(function(){
let hCanvas,hCtx;const heatPts=[];const tHistory=[];
function createH(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Network Traffic Heatmap</div>';
  const c=document.createElement('canvas');c.width=650;c.height=220;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function genData(){
  if(tHistory.length>120)tHistory.shift();
  tHistory.push({tx:Math.random()*80+20,rx:Math.random()*60+10});
  if(nodes.length>0){const n=nodes[Math.floor(Math.random()*nodes.length)];
    const sx=hCanvas.width/($('graphCanvas')?.width||650),sy=hCanvas.height/($('graphCanvas')?.height||400);
    heatPts.push({x:n.x*sx,y:n.y*sy,intensity:0.3+Math.random()*0.7,life:1,color:n.color});}
}
function drawH(){
  if(!hCtx)return;const w=hCanvas.width,h=hCanvas.height;
  hCtx.fillStyle='rgba(6,13,26,0.08)';hCtx.fillRect(0,0,w,h);
  hCtx.strokeStyle='rgba(100,150,200,0.04)';hCtx.lineWidth=0.5;
  for(let x=0;x<w;x+=20){hCtx.beginPath();hCtx.moveTo(x,0);hCtx.lineTo(x,h);hCtx.stroke();}
  for(let y=0;y<h;y+=20){hCtx.beginPath();hCtx.moveTo(0,y);hCtx.lineTo(w,y);hCtx.stroke();}
  for(let i=heatPts.length-1;i>=0;i--){const p=heatPts[i];p.life-=0.008;
    if(p.life<=0){heatPts.splice(i,1);continue;}
    const r=30+p.intensity*40;const gr=hCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*p.life);
    gr.addColorStop(0,(p.color||'#ff4444')+'44');gr.addColorStop(1,'transparent');
    hCtx.fillStyle=gr;hCtx.fillRect(p.x-r,p.y-r,r*2,r*2);
  }
  const gH=60,gY=h-gH-5;
  hCtx.strokeStyle='rgba(255,255,255,0.05)';hCtx.lineWidth=1;
  hCtx.beginPath();hCtx.moveTo(0,gY);hCtx.lineTo(w,gY);hCtx.stroke();
  if(tHistory.length>1){
    hCtx.beginPath();tHistory.forEach((d,i)=>{const x=w-((tHistory.length-i)*5),y=gY+gH-(d.tx/100*gH);i===0?hCtx.moveTo(x,y):hCtx.lineTo(x,y);});
    hCtx.strokeStyle='#33cc5588';hCtx.lineWidth=1.5;hCtx.stroke();
    hCtx.beginPath();tHistory.forEach((d,i)=>{const x=w-((tHistory.length-i)*5),y=gY+gH-(d.rx/100*gH);i===0?hCtx.moveTo(x,y):hCtx.lineTo(x,y);});
    hCtx.strokeStyle='#4488ff88';hCtx.lineWidth=1.5;hCtx.stroke();
  }
  hCtx.fillStyle='rgba(255,255,255,0.4)';hCtx.font='8px monospace';hCtx.textAlign='left';
  hCtx.fillText('Nodes: '+nodes.length+' | Edges: '+edges.length+' | Heat: '+heatPts.length,8,12);
  const last=tHistory.length>0?tHistory[tHistory.length-1]:null;
  if(last){hCtx.fillStyle='#33cc55';hCtx.fillText('TX: '+last.tx.toFixed(0)+' Mbps',8,gY-4);
    hCtx.fillStyle='#4488ff';hCtx.fillText('RX: '+last.rx.toFixed(0)+' Mbps',120,gY-4);}
  requestAnimationFrame(drawH);
}
function initH(){hCanvas=createH();if(!hCanvas)return;hCtx=hCanvas.getContext('2d');
  setInterval(genData,500);
  hCanvas.addEventListener('click',e=>{const rect=hCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(hCanvas.width/rect.width),my=(e.clientY-rect.top)*(hCanvas.height/rect.height);
    for(let i=0;i<6;i++)heatPts.push({x:mx+(Math.random()-0.5)*30,y:my+(Math.random()-0.5)*30,intensity:0.5+Math.random()*0.5,life:1,color:NODE_COLORS[Math.floor(Math.random()*NODE_COLORS.length)]});
  });drawH();}
setTimeout(initH,2000);
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
