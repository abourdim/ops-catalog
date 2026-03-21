/**
 * Workshop DIY — esp-rogue-ap-detector v1.0
 * Evil Twin WiFi AP Detector — Fingerprint & Compare
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

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
    ...LANG_BASE.en,
    title:'Rogue Ap Detector',subtitle:'🔍 scan · 🔬 fingerprint · 🚨 detect',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Rogue AP Detector — Evil Twin Finder',mainDesc:'Fingerprint WiFi APs and detect evil twins',
    sectionA:'How It Works',sectionB:'Comparison Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    scanBtn:'Scan APs',injectBtn:'Inject Evil Twin',compareBtn:'Compare',statusCol:'Status',
    alertMsg:'ROGUE AP DETECTED! Evil twin found — do NOT connect!',
    compareDesc:'Click Compare after scanning to see side-by-side fingerprint analysis.',
    howStep1:'ESP32 scans all WiFi channels and records AP fingerprints (BSSID, SSID, channel, encryption).',
    howStep2:'Fingerprints are stored in a known-good database for comparison.',
    howStep3:'On each scan, new APs are compared against the database for mismatches.',
    howStep4:'If an AP shares the SSID but has a different BSSID or channel, it is flagged as a rogue.',
    challenge1:'How does an evil twin attack work?',challenge2:'Why can\'t you rely on SSID alone?',challenge3:'What additional checks could detect a rogue AP?',
    challengeReveal1:'An attacker creates an AP with the same SSID as a legitimate one. Victims connect to the fake AP, allowing the attacker to intercept all traffic.',
    challengeReveal2:'SSIDs are just names — anyone can create an AP with any name. The BSSID (MAC) is harder to spoof but still possible.',
    challengeReveal3:'Check beacon interval timing, probe response patterns, supported rates, vendor OUI, certificate validation, and physical signal direction.',
    revealBtn:'Reveal Answer',
    howto_1:'Click Scan APs to discover nearby access points.',
    howto_2:'Click Inject Evil Twin to simulate a rogue AP attack.',
    howto_3:'Click Compare to see fingerprint differences side by side.',
    howto_4:'Watch for the red alert when a mismatch is detected.',
    wiki_evil_title:'👿 Evil Twin Attack',wiki_evil:'Attacker creates fake AP with same SSID. Victims connect and all traffic is intercepted.',
    wiki_fp_title:'🔬 AP Fingerprinting',wiki_fp:'Collecting BSSID, SSID, channel, encryption to uniquely identify an AP.',
    wiki_detect_title:'🚨 Detection Methods',wiki_detect:'Compare fingerprints against known-good database. Flag BSSID or channel mismatches.',
    wiki_protect_title:'🛡️ Protection',wiki_protect:'Use WPA-Enterprise with certificates, verify fingerprints, use VPN.',
    working:'Working…',scanning:'Scanning WiFi channels...',
    apFound:'APs found',rogueFound:'ROGUE AP detected!',noRogue:'All APs verified — no rogues.',injected:'Evil twin injected!',
    safe:'SAFE',rogue:'ROGUE',known:'Known',unknown:'New',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'🔍 Rogue AP Detector ready — scan to fingerprint networks!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',step1Title:'Scan',step1Desc:'ESP32 scans all WiFi channels and records AP fingerprints (BSSID, SSID, channel, encryption).',step2Title:'Capture',step2Desc:'Fingerprints are stored in a known-good database for comparison.',step3Title:'Analyze',step3Desc:'On each scan, new APs are compared against the database for mismatches.',step4Title:'Report',step4Desc:'If an AP shares the SSID but has a different BSSID or channel, it is flagged as a rogue.',sectionCode:'Device Code',faq_q1:'What is Rogue Ap Detector?',faq_a1:'Rogue Ap Detector lets you fingerprint wifi aps and detect evil twins. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you esp32 scans all wifi channels and records ap fingerprints (bssid, ssid, channel, encryption). Then you fingerprints are stored in a known-good database for comparison.',faq_q3:'What do the controls do?',faq_a3:'Click Scan APs to discover nearby access points. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'المهاجم ينشئ AP مزيف بنفس SSID.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Arp Detective and Esp Captive Portal. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to Rogue Ap Detector! Look at the main display — this is where the networking simulation runs.',demo_s2:'Click Scan APs to discover nearby access points. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Comparison Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Rogue Ap Detector',subtitle:'🔍 scanner · 🔬 empreinte · 🚨 détecter',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Détecteur AP Rogue — Chasseur de Jumeaux',mainDesc:'Empreinte des AP WiFi et détection de jumeaux maléfiques',
    sectionA:'Comment ça marche',sectionB:'Labo Comparaison',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements et messages',
    clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    scanBtn:'Scanner les AP',injectBtn:'Injecter Jumeau',compareBtn:'Comparer',statusCol:'Statut',
    alertMsg:'AP ROGUE DÉTECTÉ ! Jumeau maléfique trouvé — NE PAS se connecter !',
    compareDesc:'Cliquez Comparer après le scan pour l\'analyse côte à côte.',
    howStep1:'L\'ESP32 scanne tous les canaux WiFi et enregistre les empreintes.',
    howStep2:'Les empreintes sont stockées dans une base de référence.',
    howStep3:'À chaque scan, les AP sont comparés à la base pour détecter les différences.',
    howStep4:'Si un AP partage le SSID mais a un BSSID ou canal différent, il est marqué rogue.',
    challenge1:'Comment fonctionne une attaque jumeau maléfique ?',challenge2:'Pourquoi ne pas se fier au SSID seul ?',challenge3:'Quelles vérifications supplémentaires ?',
    challengeReveal1:'L\'attaquant crée un AP avec le même SSID. Les victimes se connectent au faux AP.',
    challengeReveal2:'Les SSID sont des noms — n\'importe qui peut en créer. Le BSSID est plus dur à usurper.',
    challengeReveal3:'Vérifier l\'intervalle beacon, les réponses probe, les taux supportés, l\'OUI du vendeur.',
    revealBtn:'Révéler',
    howto_1:'Cliquez Scanner les AP.',howto_2:'Cliquez Injecter Jumeau pour simuler.',howto_3:'Cliquez Comparer pour l\'analyse.',howto_4:'Surveillez l\'alerte rouge.',
    wiki_evil_title:'👿 Attaque Jumeau',wiki_evil:'L\'attaquant crée un faux AP avec le même SSID.',
    wiki_fp_title:'🔬 Empreinte AP',wiki_fp:'Collecte BSSID, SSID, canal, chiffrement.',
    wiki_detect_title:'🚨 Détection',wiki_detect:'Comparer les empreintes à la base.',
    wiki_protect_title:'🛡️ Protection',wiki_protect:'WPA-Enterprise, certificats, VPN.',
    working:'En cours…',scanning:'Scan des canaux WiFi...',
    apFound:'AP trouvés',rogueFound:'AP ROGUE détecté !',noRogue:'Tous les AP vérifiés.',injected:'Jumeau injecté !',
    safe:'SÛR',rogue:'ROGUE',known:'Connu',unknown:'Nouveau',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'🔍 Détecteur prêt — scannez les réseaux !',
    logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',step1Title:'Scanner',step1Desc:'L\'ESP32 scanne tous les canaux WiFi et enregistre les empreintes.',step2Title:'Capturer',step2Desc:'Les empreintes sont stockées dans une base de référence.',step3Title:'Analyser',step3Desc:'À chaque scan, les AP sont comparés à la base pour détecter les différences.',step4Title:'Rapporter',step4Desc:'Si un AP partage le SSID mais a un BSSID ou canal différent, il est marqué rogue.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Mesh Whisper and Esp Packet Storm ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'Rogue Ap Detector',subtitle:'🔍 مسح · 🔬 بصمة · 🚨 كشف',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'كاشف AP المزيف — مكتشف التوأم الشرير',mainDesc:'بصمة نقاط وصول WiFi وكشف التوائم الشريرة',
    sectionA:'كيف يعمل',sectionB:'مختبر المقارنة',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
    clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    scanBtn:'مسح نقاط الوصول',injectBtn:'حقن توأم شرير',compareBtn:'مقارنة',statusCol:'الحالة',
    alertMsg:'تم كشف AP مزيف! توأم شرير — لا تتصل!',
    compareDesc:'انقر مقارنة بعد المسح لتحليل البصمات جنباً إلى جنب.',
    howStep1:'ESP32 يمسح كل قنوات WiFi ويسجل بصمات AP.',
    howStep2:'البصمات تُخزن في قاعدة بيانات مرجعية.',
    howStep3:'في كل مسح، تُقارن البصمات الجديدة بالقاعدة.',
    howStep4:'إذا شارك AP نفس SSID لكن بـ BSSID أو قناة مختلفة، يُعلّم كمزيف.',
    challenge1:'كيف يعمل هجوم التوأم الشرير؟',challenge2:'لماذا لا يمكن الاعتماد على SSID وحده؟',challenge3:'ما الفحوصات الإضافية لكشف AP مزيف؟',
    challengeReveal1:'المهاجم ينشئ AP بنفس SSID. الضحايا يتصلون بالـ AP المزيف.',
    challengeReveal2:'SSID مجرد أسماء — أي شخص يمكنه إنشاء AP بأي اسم.',
    challengeReveal3:'فحص توقيت beacon، أنماط الاستجابة، المعدلات المدعومة، OUI الشركة المصنعة.',
    revealBtn:'اكشف الإجابة',
    howto_1:'انقر مسح نقاط الوصول.',howto_2:'انقر حقن توأم شرير للمحاكاة.',howto_3:'انقر مقارنة للتحليل.',howto_4:'راقب التنبيه الأحمر.',
    wiki_evil_title:'👿 هجوم التوأم الشرير',wiki_evil:'المهاجم ينشئ AP مزيف بنفس SSID.',
    wiki_fp_title:'🔬 بصمة AP',wiki_fp:'جمع BSSID, SSID, القناة, التشفير لتعريف AP.',
    wiki_detect_title:'🚨 طرق الكشف',wiki_detect:'مقارنة البصمات بقاعدة مرجعية.',
    wiki_protect_title:'🛡️ الحماية',wiki_protect:'استخدم WPA-Enterprise بشهادات وVPN.',
    working:'جارٍ…',scanning:'مسح قنوات WiFi...',
    apFound:'AP وجدت',rogueFound:'تم كشف AP مزيف!',noRogue:'كل الـ AP تم التحقق منها.',injected:'تم حقن التوأم الشرير!',
    safe:'آمن',rogue:'مزيف',known:'معروف',unknown:'جديد',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'🔍 كاشف AP المزيف جاهز — امسح لبصمة الشبكات!',
    logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',step1Title:'مسح',step1Desc:'ESP32 يمسح كل قنوات WiFi ويسجل بصمات AP.',step2Title:'التقاط',step2Desc:'البصمات تُخزن في قاعدة بيانات مرجعية.',step3Title:'تحليل',step3Desc:'في كل مسح، تُقارن البصمات الجديدة بالقاعدة.',step4Title:'تقرير',step4Desc:'إذا شارك AP نفس SSID لكن بـ BSSID أو قناة مختلفة، يُعلّم كمزيف.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Mesh Whisper and Esp Packet Storm! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءة';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoCC=0,logoCT=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoCC++;if(logoCT)clearTimeout(logoCT);if(logoCC>=3){logoCC=0;toggleMatrix();}else logoCT=setTimeout(()=>logoCC=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');});});}

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
   ROGUE AP DETECTOR SIMULATION
   ═══════════════════════════════════════════════════════════════ */

function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click');}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':');}

// Known-good AP database
const KNOWN_APS=[
  {ssid:'CampusWiFi',bssid:'AA:BB:CC:11:22:33',channel:1,encryption:'WPA2',signal:-42,vendor:'Cisco'},
  {ssid:'LibraryNet',bssid:'DD:EE:FF:44:55:66',channel:6,encryption:'WPA2',signal:-55,vendor:'Aruba'},
  {ssid:'CafeFree',bssid:'11:22:33:AA:BB:CC',channel:11,encryption:'Open',signal:-60,vendor:'TP-Link'},
  {ssid:'AdminSecure',bssid:'99:88:77:66:55:44',channel:3,encryption:'WPA3',signal:-38,vendor:'Ubiquiti'},
  {ssid:'IoT-Sensors',bssid:'FE:DC:BA:98:76:54',channel:9,encryption:'WPA2',signal:-65,vendor:'Espressif'},
];

let scannedAPs=[];
let evilTwinInjected=false;

function scanAPs(){
  const s=LANG[currentLang];
  showToast(s.scanning,2000);
  log(s.scanning,'info');
  setStatus(true);

  setTimeout(()=>{
    // Copy known APs with slight signal variation
    scannedAPs=KNOWN_APS.map(ap=>({
      ...ap,
      signal:ap.signal+Math.floor(Math.random()*10-5),
      isRogue:false
    }));

    // If evil twin was injected, add it
    if(evilTwinInjected){
      scannedAPs.push({
        ssid:'CampusWiFi', // same SSID as legit
        bssid:randMAC(),
        channel:6, // different channel
        encryption:'WPA2',
        signal:-35, // stronger signal to lure victims
        vendor:'Unknown',
        isRogue:true
      });
    }

    // Maybe add a random unknown AP
    if(Math.random()>0.5){
      scannedAPs.push({
        ssid:'Guest-'+Math.floor(Math.random()*100),
        bssid:randMAC(),channel:Math.floor(Math.random()*11)+1,
        encryption:['WPA2','Open','WPA3'][Math.floor(Math.random()*3)],
        signal:-50-Math.floor(Math.random()*30),vendor:'Unknown',isRogue:false
      });
    }

    renderAPTable();
    checkForRogues();
    log(`📡 ${scannedAPs.length} ${s.apFound}`,'success');
    hideToast();
  },1500+Math.random()*800);
}

function renderAPTable(){
  const tbody=$('apTableBody');if(!tbody)return;
  const s=LANG[currentLang];
  tbody.innerHTML='';
  for(const ap of scannedAPs){
    const known=KNOWN_APS.find(k=>k.bssid===ap.bssid);
    const tr=document.createElement('tr');
    if(ap.isRogue)tr.className='rogue';
    tr.innerHTML=`
      <td>${ap.ssid}</td>
      <td style="font-family:Orbitron,monospace;font-size:.65rem">${ap.bssid}</td>
      <td>${ap.channel}</td>
      <td>${ap.encryption}</td>
      <td>${ap.signal} dBm</td>
      <td class="${ap.isRogue?'danger':'safe'}">${ap.isRogue?'🚨 '+s.rogue:known?'✅ '+s.safe:'❓ '+s.unknown}</td>
    `;
    tbody.appendChild(tr);
  }
}

function checkForRogues(){
  const s=LANG[currentLang];
  const alert=$('alertBox');
  const rogues=scannedAPs.filter(a=>a.isRogue);
  if(rogues.length>0){
    if(alert){alert.classList.add('visible');}
    log(`🚨 ${s.rogueFound} SSID="${rogues[0].ssid}" BSSID=${rogues[0].bssid}`,'error');
  }else{
    if(alert)alert.classList.remove('visible');
    log(`✅ ${s.noRogue}`,'success');
  }
}

function injectEvilTwin(){
  const s=LANG[currentLang];
  evilTwinInjected=true;
  log(`👿 ${s.injected} SSID="CampusWiFi"`,'error');
  showToast(s.injected,1500);
  // Auto-rescan
  setTimeout(scanAPs,500);
}

function compareFingerprints(){
  const area=$('compareArea');if(!area)return;
  area.innerHTML='';

  const rogueAP=scannedAPs.find(a=>a.isRogue);
  const legitAP=KNOWN_APS.find(k=>k.ssid==='CampusWiFi');

  if(!rogueAP||!legitAP){
    area.innerHTML='<p style="font-size:.85rem;color:var(--text-muted)">Inject an evil twin first, then compare.</p>';
    return;
  }

  const fields=['ssid','bssid','channel','encryption','signal','vendor'];
  const labels={ssid:'SSID',bssid:'BSSID',channel:'Channel',encryption:'Encryption',signal:'Signal',vendor:'Vendor'};

  // Legit card
  const lc=document.createElement('div');lc.className='compare-card';
  lc.innerHTML=`<h4>✅ Legitimate AP</h4>${fields.map(f=>`<div>${labels[f]}: <strong>${legitAP[f]}</strong></div>`).join('')}`;
  area.appendChild(lc);

  // Rogue card
  const rc=document.createElement('div');rc.className='compare-card';
  rc.innerHTML=`<h4>🚨 Rogue AP</h4>${fields.map(f=>{
    const match=String(rogueAP[f])===String(legitAP[f]);
    return `<div class="${match?'match':'mismatch'}">${labels[f]}: <strong>${rogueAP[f]}</strong> ${match?'✓':'✗ MISMATCH'}</div>`;
  }).join('')}`;
  area.appendChild(rc);

  log('🔬 Fingerprint comparison displayed','info');
}

function initRogueDetector(){
  if($('scanBtn'))$('scanBtn').addEventListener('click',scanAPs);
  if($('injectBtn'))$('injectBtn').addEventListener('click',injectEvilTwin);
  if($('compareBtn'))$('compareBtn').addEventListener('click',compareFingerprints);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initRogueDetector);}else{setTimeout(initRogueDetector,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Rogue AP Detector: Evil twin detection
   with AP radar, fingerprint comparison, and alert system
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const aps=[],scanWaves=[];
  const SSIDS=['CoffeeShop_WiFi','Airport_Free','Hotel_Guest','Corp_Net','Library_Public'];
  let radarAngle=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0a14;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class AP{
    constructor(rogue){
      this.ssid=SSIDS[Math.floor(Math.random()*SSIDS.length)];this.isRogue=rogue;
      this.bssid=Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':');
      this.channel=Math.floor(Math.random()*13)+1;this.rssi=-30-Math.random()*50;
      const a=Math.random()*Math.PI*2,d=60+Math.random()*100;
      this.x=W/2+Math.cos(a)*d;this.y=H/2+Math.sin(a)*d;
      this.pulsePhase=Math.random()*Math.PI*2;this.beaconTimer=0;this.beacons=[];
      this.detected=false;this.detectTimer=0;
    }
    update(){
      this.pulsePhase+=0.04;this.beaconTimer++;
      if(this.beaconTimer%40===0)this.beacons.push({x:this.x,y:this.y,r:0,maxR:50,alpha:0.5});
      for(let i=this.beacons.length-1;i>=0;i--){this.beacons[i].r+=0.8;this.beacons[i].alpha=0.5*(1-this.beacons[i].r/this.beacons[i].maxR);if(this.beacons[i].r>this.beacons[i].maxR)this.beacons.splice(i,1);}
      if(this.isRogue&&!this.detected&&frameCount>120){this.detectTimer++;if(this.detectTimer>60)this.detected=true;}
    }
    draw(){
      this.beacons.forEach(b=>{ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.strokeStyle=this.isRogue?'rgba(255,60,60,'+b.alpha+')':'rgba(60,200,60,'+b.alpha+')';ctx.lineWidth=1;ctx.stroke();});
      const glow=6+Math.sin(this.pulsePhase)*3;ctx.save();ctx.shadowColor=this.isRogue?'#ff3333':'#33ff33';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,16,0,Math.PI*2);ctx.fillStyle=this.isRogue?'rgba(255,50,50,0.2)':'rgba(50,255,50,0.15)';ctx.fill();
      ctx.strokeStyle=this.isRogue?'#ff4444':'#44ff44';ctx.lineWidth=2;ctx.stroke();
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.isRogue?'\u{1F6A8}':'\u{1F4E1}',this.x,this.y);ctx.restore();
      ctx.font='8px monospace';ctx.fillStyle=this.isRogue?'#ff6666':'#66ff66';ctx.textAlign='center';ctx.fillText(this.ssid,this.x,this.y-22);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillText('CH:'+this.channel+' '+Math.round(this.rssi)+'dBm',this.x,this.y+24);
      if(this.isRogue&&this.detected){const flash=Math.sin(frameCount*0.15)>0;if(flash){ctx.strokeStyle='#ff0000';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(this.x,this.y,26,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
        ctx.font='bold 9px monospace';ctx.fillStyle='#ff4444';ctx.fillText('EVIL TWIN',this.x,this.y+36);}
    }
  }

  function drawRadar(){
    radarAngle+=0.015;ctx.save();ctx.translate(W/2,H/2);ctx.rotate(radarAngle);
    const g=ctx.createLinearGradient(0,0,140,0);g.addColorStop(0,'rgba(0,255,100,0.25)');g.addColorStop(1,'rgba(0,255,100,0)');
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,140,-0.1,0.1);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.restore();
    ctx.beginPath();ctx.arc(W/2,H/2,10,0,Math.PI*2);ctx.fillStyle='#00ff66';ctx.fill();
    ctx.font='7px monospace';ctx.fillStyle='#00ff66';ctx.textAlign='center';ctx.fillText('DETECTOR',W/2,H/2+20);
    [50,100,140].forEach(r=>{ctx.beginPath();ctx.arc(W/2,H/2,r,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,100,0.08)';ctx.lineWidth=1;ctx.stroke();});
  }

  function drawGrid(){ctx.strokeStyle='rgba(0,255,100,0.04)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();}

  function drawAlertBanner(){
    const rogues=aps.filter(a=>a.isRogue&&a.detected);if(rogues.length===0)return;
    const flash=Math.sin(frameCount*0.1)>0;ctx.save();ctx.fillStyle=flash?'rgba(255,0,0,0.15)':'rgba(255,0,0,0.08)';ctx.fillRect(0,H-32,W,32);
    ctx.font='bold 11px monospace';ctx.fillStyle='#ff4444';ctx.textAlign='center';
    ctx.fillText('\u26A0 '+rogues.length+' ROGUE AP'+(rogues.length>1?'S':'')+' DETECTED \u26A0',W/2,H-14);ctx.restore();
  }

  function drawConnections(){
    aps.forEach(ap=>{ctx.beginPath();ctx.moveTo(ap.x,ap.y);ctx.lineTo(W/2,H/2);ctx.strokeStyle=ap.isRogue?'rgba(255,60,60,0.08)':'rgba(60,255,60,0.06)';ctx.lineWidth=1;ctx.setLineDash([2,6]);ctx.stroke();ctx.setLineDash([]);});
  }

  function drawHUD(){
    const total=aps.length,rogue=aps.filter(a=>a.isRogue).length,detected=aps.filter(a=>a.isRogue&&a.detected).length;
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(8,8,170,68);ctx.strokeStyle='#0f03';ctx.strokeRect(8,8,170,68);
    ctx.font='10px monospace';ctx.fillStyle='#00ff66';ctx.textAlign='left';ctx.fillText('ROGUE AP DETECTOR',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('APs Found: '+total,16,40);ctx.fillText('Legit: '+(total-rogue)+'  Rogue: '+rogue,16,54);
    ctx.fillStyle=detected>0?'#ff4444':'#666';ctx.fillText('Alerts: '+detected,16,68);ctx.restore();
  }

  function init(){
    ensureCanvas();for(let i=0;i<5;i++)aps.push(new AP(false));for(let i=0;i<2;i++)aps.push(new AP(true));
    if(aps.length>5)aps[5].ssid=aps[0].ssid;if(aps.length>6)aps[6].ssid=aps[1].ssid;animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,10,20,0.16)';ctx.fillRect(0,0,W,H);
    drawGrid();drawRadar();drawConnections();aps.forEach(ap=>{ap.update();ap.draw();});
    if(frameCount%300===0&&aps.length<12){const rogue=Math.random()<0.3;const n=new AP(rogue);if(rogue&&aps.length>0)n.ssid=aps[Math.floor(Math.random()*aps.length)].ssid;aps.push(n);}
    drawAlertBanner();drawHUD();animId=requestAnimationFrame(animate);
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

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
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
