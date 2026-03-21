/**
 * Workshop DIY — esp-signal-ghost v1.0
 * MAC Phantom — Rapid MAC Address Cycling
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

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
    title:'Signal Ghost',subtitle:'👻 spoof · 🔄 cycle · 🌊 flood',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Signal Ghost — MAC Phantom',mainDesc:'Rapidly switch MAC addresses to appear as hundreds of devices',
    sectionA:'How It Works',sectionB:'MAC Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    startBtn:'Start Ghosting',stopBtn:'Stop',turboBtn:'TURBO',resetBtn:'Reset',
    ghostDevices:'Ghost Devices',cyclesPerSec:'Cycles/sec',uniqueMACs:'Unique MACs',chaosLevel:'Network Chaos Level',
    labDesc:'Watch the detected devices list grow as ghost MACs flood the network.',
    howStep1:'ESP32 generates random MAC addresses at high speed.',
    howStep2:'Each MAC sends probe requests, making the network see a new device.',
    howStep3:'Network equipment fills its tables with ghost entries, causing confusion.',
    howStep4:'The chaos meter shows how much the network is disrupted.',
    challenge1:'Why does MAC spoofing confuse network equipment?',
    challenge2:'How can networks defend against MAC flooding?',
    challenge3:'What is the difference between MAC randomization and MAC flooding?',
    challengeReveal1:'Switches use CAM tables to forward packets. Flooding with fake MACs fills these tables, causing traffic to broadcast to all ports.',
    challengeReveal2:'Port security limits MACs per port. 802.1X authenticates devices. Dynamic ARP inspection validates ARP packets.',
    challengeReveal3:'MAC randomization (phones for privacy) changes your MAC periodically. MAC flooding deliberately generates thousands of fake MACs to attack infrastructure.',
    revealBtn:'Reveal Answer',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_mac_title:'🏷️ MAC Address',wiki_mac:'عنوان عتاد 48 بت يعرّف واجهة الشبكة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_cam_title:'📋 CAM Table',wiki_cam:'جدول السويتش يربط MACs بالمنافذ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_flood_title:'🌊 MAC Flooding',wiki_flood:'ملء جدول CAM يجبر البث للجميع. Modulation encodes information onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). FM is more resistant to noise than AM, which is why FM radio sounds clearer. Digital modulations like QAM combine amplitude and phase changes to pack more data per symbol.',
    wiki_defense_title:'🛡️ Port Security',wiki_defense:'يحد عدد MACs لكل منفذ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    working:'Working…',ghostStarted:'Ghosting started!',ghostStopped:'Ghosting stopped.',ghostReset:'Ghost reset.',turboOn:'TURBO MODE!',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'👻 Signal Ghost ready — start flooding the network!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',step1Title:'Scan',step1Desc:'ESP32 generates random MAC addresses at high speed.',step2Title:'Capture',step2Desc:'Each MAC sends probe requests, making the network see a new device.',step3Title:'Analyze',step3Desc:'Network equipment fills its tables with ghost entries, causing confusion.',step4Title:'Report',step4Desc:'The chaos meter shows how much the network is disrupted.',sectionCode:'Device Code',faq_q1:'What is Signal Ghost?',faq_a1:'Signal Ghost lets you rapidly switch mac addresses to appear as hundreds of devices. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you esp32 generates random mac addresses at high speed. Then you each mac sends probe requests, making the network see a new device.',faq_q3:'What do the controls do?',faq_a3:'Click Start Ghosting to begin cycling MAC addresses. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'عنوان عتاد 48 بت يعرّف واجهة الشبكة.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Arp Detective and Esp Captive Portal. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to Signal Ghost! Look at the main display — this is where the networking simulation runs.',demo_s2:'Click Start Ghosting to begin cycling MAC addresses. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Signal Ghost: Rapidly switch MAC addresses to appear as hundreds of devices. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "MAC Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Signal Ghost',subtitle:'👻 usurper · 🔄 cycler · 🌊 inonder',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Signal Ghost — Fantôme MAC',mainDesc:'Changez rapidement d\'adresse MAC pour apparaître comme des centaines d\'appareils',
    sectionA:'Comment ça marche',sectionB:'Labo MAC',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    startBtn:'Lancer le fantôme',stopBtn:'Arrêter',turboBtn:'TURBO',resetBtn:'Réinitialiser',
    ghostDevices:'Appareils fantômes',cyclesPerSec:'Cycles/sec',uniqueMACs:'MACs uniques',chaosLevel:'Niveau de chaos réseau',
    labDesc:'Regardez la liste d\'appareils grandir avec les MAC fantômes.',
    howStep1:'L\'ESP32 génère des adresses MAC aléatoires à grande vitesse.',
    howStep2:'Chaque MAC envoie des requêtes probe, le réseau voit un nouvel appareil.',
    howStep3:'L\'équipement réseau remplit ses tables avec des entrées fantômes.',
    howStep4:'Le compteur de chaos montre la perturbation du réseau.',
    challenge1:'Pourquoi l\'usurpation MAC confond l\'équipement ?',challenge2:'Comment se défendre contre l\'inondation MAC ?',challenge3:'Différence entre randomisation et inondation MAC ?',
    challengeReveal1:'Les switches utilisent des tables CAM. L\'inondation les remplit, forçant la diffusion.',
    challengeReveal2:'Sécurité des ports, 802.1X, inspection ARP dynamique.',
    challengeReveal3:'La randomisation (téléphones) change le MAC pour la vie privée. L\'inondation attaque l\'infrastructure.',
    revealBtn:'Révéler',
    howto_1:'Cliquez Lancer le fantôme.',howto_2:'Regardez le MAC changer rapidement.',howto_3:'Cliquez TURBO pour accélérer.',howto_4:'Surveillez le compteur de chaos.',
    wiki_mac_title:'🏷️ Adresse MAC',wiki_mac:'Adresse matérielle de 48 bits identifiant une interface réseau.',
    wiki_cam_title:'📋 Table CAM',wiki_cam:'Table du switch associant MACs aux ports.',
    wiki_flood_title:'🌊 Inondation MAC',wiki_flood:'Remplir la table CAM force la diffusion.',
    wiki_defense_title:'🛡️ Sécurité des ports',wiki_defense:'Limite les MACs par port.',
    working:'En cours…',ghostStarted:'Fantôme lancé !',ghostStopped:'Fantôme arrêté.',ghostReset:'Réinitialisé.',turboOn:'MODE TURBO !',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'👻 Signal Ghost prêt — inondez le réseau !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',step1Title:'Scanner',step1Desc:'L\'ESP32 génère des adresses MAC aléatoires à grande vitesse.',step2Title:'Capturer',step2Desc:'Chaque MAC envoie des requêtes probe, le réseau voit un nouvel appareil.',step3Title:'Analyser',step3Desc:'L\'équipement réseau remplit ses tables avec des entrées fantômes.',step4Title:'Rapporter',step4Desc:'Le compteur de chaos montre la perturbation du réseau.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Mesh Whisper and Esp Rogue Ap Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'Signal Ghost',subtitle:'👻 تزييف · 🔄 دوران · 🌊 إغراق',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'Signal Ghost — شبح MAC',mainDesc:'بدّل عناوين MAC بسرعة لتظهر كمئات الأجهزة',
    sectionA:'كيف يعمل',sectionB:'مختبر MAC',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    startBtn:'بدء الشبح',stopBtn:'إيقاف',turboBtn:'توربو',resetBtn:'إعادة تعيين',
    ghostDevices:'أجهزة شبحية',cyclesPerSec:'دورات/ثانية',uniqueMACs:'MACs فريدة',chaosLevel:'مستوى فوضى الشبكة',
    labDesc:'راقب قائمة الأجهزة تنمو مع إغراق عناوين MAC الشبحية.',
    howStep1:'ESP32 يولّد عناوين MAC عشوائية بسرعة عالية.',
    howStep2:'كل MAC يرسل طلبات probe، الشبكة ترى جهازاً جديداً.',
    howStep3:'معدات الشبكة تملأ جداولها بإدخالات شبحية.',
    howStep4:'عداد الفوضى يوضح مدى تعطل الشبكة.',
    challenge1:'لماذا تزييف MAC يربك معدات الشبكة؟',challenge2:'كيف تدافع الشبكات ضد إغراق MAC؟',challenge3:'ما الفرق بين عشوائية MAC وإغراق MAC؟',
    challengeReveal1:'السويتشات تستخدم جداول CAM. الإغراق يملؤها مما يجبر على البث للجميع.',
    challengeReveal2:'أمن المنافذ يحد MACs لكل منفذ. 802.1X يوثق الأجهزة.',
    challengeReveal3:'العشوائية (الهواتف) تغير MAC للخصوصية. الإغراق يهاجم البنية التحتية عمداً.',
    revealBtn:'اكشف الإجابة',
    howto_1:'انقر بدء الشبح لبدء تدوير العناوين.',howto_2:'راقب العرض يتغير بسرعة.',howto_3:'انقر توربو لزيادة السرعة.',howto_4:'راقب عداد الفوضى.',
    wiki_mac_title:'🏷️ عنوان MAC',wiki_mac:'عنوان عتاد 48 بت يعرّف واجهة الشبكة.',
    wiki_cam_title:'📋 جدول CAM',wiki_cam:'جدول السويتش يربط MACs بالمنافذ.',
    wiki_flood_title:'🌊 إغراق MAC',wiki_flood:'ملء جدول CAM يجبر البث للجميع.',
    wiki_defense_title:'🛡️ أمن المنافذ',wiki_defense:'يحد عدد MACs لكل منفذ.',
    working:'جارٍ…',ghostStarted:'بدأ الشبح!',ghostStopped:'توقف الشبح.',ghostReset:'تم إعادة التعيين.',turboOn:'وضع توربو!',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'👻 Signal Ghost جاهز — أغرق الشبكة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',step1Title:'مسح',step1Desc:'ESP32 يولّد عناوين MAC عشوائية بسرعة عالية.',step2Title:'التقاط',step2Desc:'كل MAC يرسل طلبات probe، الشبكة ترى جهازاً جديداً.',step3Title:'تحليل',step3Desc:'معدات الشبكة تملأ جداولها بإدخالات شبحية.',step4Title:'تقرير',step4Desc:'عداد الفوضى يوضح مدى تعطل الشبكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Mesh Whisper and Esp Rogue Ap Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1),chars='بسمالرحنيوكلت';function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#0f0';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoCC=0,logoCT=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoCC++;if(logoCT)clearTimeout(logoCT);if(logoCC>=3){logoCC=0;toggleMatrix();}else logoCT=setTimeout(()=>logoCC=0,500);});}
function initDebug(){if(!new URLSearchParams(location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}
const TM={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const ns=TM[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWO=false;function openSettings(){const l=$('logPanel');logWO=l&&l.classList.contains('open');if(logWO)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWO){openLog();logWO=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');});});}

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
   SIGNAL GHOST SIMULATION
   ═══════════════════════════════════════════════════════════════ */
function revealChallenge(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');playSound('click');}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':');}

let ghostRunning=false;
let ghostInterval=null;
let ghostMACs=new Set();
let totalCycles=0;
let cyclesThisSecond=0;
let lastSecond=Date.now();
let turboMode=false;

function getInterval(){return turboMode?30:200;}

function updateDisplay(mac){
  const disp=$('macDisplay');
  if(disp){disp.textContent=mac;disp.classList.toggle('cycling',ghostRunning);}
  if($('ghostCount'))$('ghostCount').textContent=ghostMACs.size;
  if($('uniqueMACs'))$('uniqueMACs').textContent=ghostMACs.size;

  const now=Date.now();
  if(now-lastSecond>=1000){
    if($('cycleRate'))$('cycleRate').textContent=cyclesThisSecond;
    cyclesThisSecond=0;lastSecond=now;
  }

  // Chaos meter: 0-100% based on ghost count (max at ~500)
  const chaos=Math.min(100,ghostMACs.size/5);
  const fill=$('chaosFill');
  if(fill)fill.style.width=chaos+'%';

  // Lab stats
  if($('arpEntries'))$('arpEntries').textContent=ghostMACs.size;
  const dhcpPct=Math.max(0,100-Math.floor(ghostMACs.size/2.5));
  if($('dhcpPool'))$('dhcpPool').textContent=dhcpPct+'%';
}

function addGhostEntry(mac){
  const flood=$('deviceFlood');if(!flood)return;
  const entry=document.createElement('div');
  entry.className='ghost-entry';
  const vendors=['Espressif','Intel','Broadcom','Qualcomm','Realtek','MediaTek','Unknown'];
  const vendor=vendors[Math.floor(Math.random()*vendors.length)];
  const rssi=-30-Math.floor(Math.random()*60);
  entry.textContent=`${mac}  ${vendor.padEnd(10)}  ${rssi} dBm  ${new Date().toLocaleTimeString()}`;
  flood.insertBefore(entry,flood.firstChild);
  // Keep list manageable
  while(flood.children.length>200)flood.removeChild(flood.lastChild);
}

function ghostCycle(){
  const mac=randMAC();
  ghostMACs.add(mac);
  totalCycles++;
  cyclesThisSecond++;
  updateDisplay(mac);
  addGhostEntry(mac);

  // Periodic log (every 50 ghosts)
  if(ghostMACs.size%50===0){
    log(`👻 ${ghostMACs.size} ghost devices active — network confusion growing!`,'tx');
  }
}

function startGhost(){
  if(ghostRunning)return;
  ghostRunning=true;
  const s=LANG[currentLang];
  setStatus(true);
  log(s.ghostStarted,'success');
  showToast(s.ghostStarted,1500);
  ghostInterval=setInterval(ghostCycle,getInterval());
}

function stopGhost(){
  if(!ghostRunning)return;
  ghostRunning=false;
  if(ghostInterval){clearInterval(ghostInterval);ghostInterval=null;}
  const disp=$('macDisplay');if(disp)disp.classList.remove('cycling');
  setStatus(false);
  log(LANG[currentLang].ghostStopped,'info');
}

function toggleTurbo(){
  turboMode=!turboMode;
  const s=LANG[currentLang];
  if(turboMode){
    log(`🚀 ${s.turboOn}`,'error');
    showToast(s.turboOn,1200);
  }
  if(ghostRunning){
    clearInterval(ghostInterval);
    ghostInterval=setInterval(ghostCycle,getInterval());
  }
}

function resetGhost(){
  stopGhost();
  ghostMACs.clear();
  totalCycles=0;cyclesThisSecond=0;turboMode=false;
  updateDisplay('00:00:00:00:00:00');
  const flood=$('deviceFlood');if(flood)flood.innerHTML='';
  const fill=$('chaosFill');if(fill)fill.style.width='0%';
  if($('arpEntries'))$('arpEntries').textContent='0';
  if($('dhcpPool'))$('dhcpPool').textContent='100%';
  if($('cycleRate'))$('cycleRate').textContent='0';
  log(LANG[currentLang].ghostReset,'info');
}

function initSignalGhost(){
  if($('startBtn'))$('startBtn').addEventListener('click',startGhost);
  if($('stopBtn'))$('stopBtn').addEventListener('click',stopGhost);
  if($('turboBtn'))$('turboBtn').addEventListener('click',toggleTurbo);
  if($('resetBtn'))$('resetBtn').addEventListener('click',resetGhost);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initSignalGhost);}else{setTimeout(initSignalGhost,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Signal Ghost: MAC phantom with rapid
   MAC cycling, ghost device flood, and network chaos meter
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0,ghostCnt=0;
  const ghosts=[],spectres=[];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#08060e;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }
  function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':').toUpperCase();}

  class Ghost{
    constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-0.5)*1.2;this.vy=(Math.random()-0.5)*1.2;
      this.mac=randMAC();this.alpha=0;this.fadeIn=true;this.life=120+Math.random()*200;this.age=0;
      this.size=10+Math.random()*10;this.hue=Math.random()*360;this.macTimer=0;}
    update(){
      this.age++;this.macTimer++;if(this.macTimer>30){this.mac=randMAC();this.macTimer=0;this.hue=Math.random()*360;}
      if(this.fadeIn){this.alpha=Math.min(1,this.alpha+0.03);if(this.alpha>=1)this.fadeIn=false;}
      if(this.age>this.life-40)this.alpha=Math.max(0,this.alpha-0.03);
      this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W)this.vx*=-1;if(this.y<0||this.y>H)this.vy*=-1;return this.age<this.life;
    }
    draw(){
      ctx.save();ctx.globalAlpha=this.alpha*0.7;ctx.shadowColor='hsl('+this.hue+',80%,60%)';ctx.shadowBlur=12;
      ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',70%,50%,0.15)';ctx.fill();
      ctx.strokeStyle='hsl('+this.hue+',80%,60%)';ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;
      ctx.font=(this.size*0.9)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F47B}',this.x,this.y);
      ctx.font='7px monospace';ctx.fillStyle='hsla('+this.hue+',80%,70%,'+this.alpha+')';ctx.fillText(this.mac,this.x,this.y+this.size+8);ctx.restore();
    }
  }

  class Spectre{
    constructor(x,y,h){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*2;this.vy=(Math.random()-0.5)*2;this.life=1;this.hue=h;this.size=2+Math.random()*3;}
    update(){this.x+=this.vx;this.y+=this.vy;this.life-=0.02;this.vx*=0.97;this.vy*=0.97;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',70%,60%,'+(this.life*0.4)+')';ctx.fill();}
  }

  function drawRouter(){
    const load=Math.min(1,ghosts.length/20),shake=load>0.5?(Math.random()-0.5)*load*4:0;
    const rx=W/2+shake,ry=H/2+shake;ctx.save();ctx.shadowColor=load>0.7?'#ff4444':'#00ccff';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(rx,ry,22,0,Math.PI*2);ctx.fillStyle='rgba('+(load>0.7?'255,60,60':'0,200,255')+',0.15)';ctx.fill();
    ctx.strokeStyle=load>0.7?'#ff4444':'#00ccff';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F500}',rx,ry);
    ctx.font='8px monospace';ctx.fillStyle=load>0.7?'#ff6666':'#00ccff';ctx.fillText('SWITCH',rx,ry+30);
    ctx.fillStyle='#222';ctx.fillRect(rx-30,ry+36,60,6);
    const g=ctx.createLinearGradient(rx-30,0,rx+30,0);g.addColorStop(0,'#00ccff');g.addColorStop(0.7,'#ffcc00');g.addColorStop(1,'#ff4444');
    ctx.fillStyle=g;ctx.fillRect(rx-30,ry+36,60*load,6);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('CAM: '+Math.floor(load*100)+'%',rx,ry+52);ctx.restore();
  }

  function drawProbes(){ghosts.forEach(g=>{if(Math.random()>0.3)return;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(W/2,H/2);ctx.strokeStyle='hsla('+g.hue+',60%,50%,0.06)';ctx.lineWidth=1;ctx.stroke();});}

  function drawHUD(){
    const cl=Math.min(100,Math.floor(ghosts.length/25*100));
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,70);ctx.strokeStyle=cl>70?'#f003':'#80f3';ctx.strokeRect(8,8,185,70);
    ctx.font='10px monospace';ctx.fillStyle='#c084fc';ctx.textAlign='left';ctx.fillText('SIGNAL GHOST',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Ghost Devices: '+ghosts.length,16,40);ctx.fillText('Total Spawned: '+ghostCnt,16,54);
    ctx.fillStyle=cl>70?'#ff4444':cl>40?'#ffd93d':'#6bcb77';ctx.fillText('Chaos Level: '+cl+'%',16,68);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,6,14,0.12)';ctx.fillRect(0,0,W,H);
    if(frameCount%8===0&&ghosts.length<30){ghosts.push(new Ghost());ghostCnt++;}
    drawProbes();drawRouter();
    for(let i=ghosts.length-1;i>=0;i--){if(!ghosts[i].update()){for(let s=0;s<6;s++)spectres.push(new Spectre(ghosts[i].x,ghosts[i].y,ghosts[i].hue));ghosts.splice(i,1);}
      else{ghosts[i].draw();if(Math.random()<0.05)spectres.push(new Spectre(ghosts[i].x,ghosts[i].y,ghosts[i].hue));}}
    for(let i=spectres.length-1;i>=0;i--){if(!spectres[i].update())spectres.splice(i,1);else spectres[i].draw();}
    drawHUD();animId=requestAnimationFrame(animate);
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
