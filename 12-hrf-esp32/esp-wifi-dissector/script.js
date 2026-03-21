/**
 * WiFi Dissector — Workshop DIY v1.2
 * 802.11 frame decode with color-coded fields
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}}

/* ═══════ i18n ═══════ */
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

const LANG = {
  en: {
    ...LANG_BASE.en,
    title:'🔬 WiFi Dissector', subtitle:'802.11 Frame Decode',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'802.11 Frame Hex Viewer', mainDesc:'Color-coded 802.11 field decoder',
    sectionA:'Layer-by-Layer Decode', sectionB:'Capture Statistics', sectionC:'802.11 Frame Theory',
    frameType:'Frame type:', generate:'Generate Frame', capture:'Auto Capture',
    theory1:'Every WiFi frame starts with a 2-byte Frame Control field encoding type (management/control/data) and flags (ToDS, FromDS, retry, etc.).',
    theory2:'Up to 4 MAC addresses can appear: receiver, transmitter, BSSID, and source. Which are present depends on ToDS/FromDS bits.',
    theory3:'Management frames (beacons, probes, auth) carry information elements (IEs) with tagged parameters like SSID, supported rates, and channel.',
    theory4:'The 4-byte FCS (CRC-32) at the end protects frame integrity. Frames failing FCS check are silently discarded by hardware.',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    settings:'Settings', language:'Language', theme:'Theme', soundEffects:'Sound effects',
    activityLog:'Activity Log',
    howto_1:'Select frame type from dropdown.', howto_2:'Click Generate to create a frame.',
    howto_3:'Hover bytes for field details.', howto_4:'Check Layer Decode section.',
    splashHint:'tap to skip', ready:'🔬 WiFi Dissector ready!',
    langChanged:'Language → English', themeChanged:'Theme →',
    logCleared:'Log cleared', copied:'Copied!',
    frameGenerated:'Frame generated', captureStarted:'Auto capture started', captureStopped:'Auto capture stopped',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What is 🔬 WiFi Dissector?',faq_a1:'🔬 WiFi Dissector lets you color-coded 802.11 field decoder. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the frequency band, modulation type, and signal parameters. Then you scan the radio spectrum to detect and capture signals of interest.',faq_q3:'What do the controls do?',faq_a3:'Select frame type from dropdown. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Ble Xray and Esp Collision Visualizer. Each app in this category teaches a different aspect of RF engineering.',demo_s1:'Welcome to 🔬 WiFi Dissector! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Select frame type from dropdown. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Layer-by-Layer Decode" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how RF engineering works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Layer-by-Layer Decode" and "Capture Statistics" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'🔬 Dissecteur WiFi', subtitle:'Decodage trame 802.11',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Visualiseur Hex 802.11', mainDesc:'Decodeur de champs 802.11 colore',
    sectionA:'Decodage couche par couche', sectionB:'Statistiques de capture', sectionC:'Theorie trame 802.11',
    frameType:'Type de trame:', generate:'Generer trame', capture:'Capture auto',
    theory1:'Chaque trame WiFi commence par un champ Frame Control de 2 octets encodant le type et les drapeaux.',
    theory2:'Jusqu\'a 4 adresses MAC peuvent apparaitre selon les bits ToDS/FromDS.',
    theory3:'Les trames de gestion transportent des elements d\'information (IE) avec des parametres comme SSID et canal.',
    theory4:'Le FCS 4 octets (CRC-32) protege l\'integrite. Les trames echouant sont rejetees.',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    settings:'Parametres', language:'Langue', theme:'Theme', soundEffects:'Effets sonores',
    activityLog:'Journal',
    howto_1:'Selectionnez le type de trame.', howto_2:'Cliquez Generer.',
    howto_3:'Survolez les octets.', howto_4:'Voir le decodage par couches.',
    splashHint:'appuyer pour passer', ready:'🔬 Dissecteur WiFi pret!',
    langChanged:'Langue → Francais', themeChanged:'Theme →',
    logCleared:'Journal efface', copied:'Copie!',
    frameGenerated:'Trame generee', captureStarted:'Capture auto demarree', captureStopped:'Capture auto arretee',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 🔬 WiFi Dissector ?',faq_a1:'🔬 WiFi Dissector te permet de simuler ingénierie RF. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF.',demo_s1:'Bienvenue dans 🔬 WiFi Dissector ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne ingénierie RF en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'🔬 محلل WiFi', subtitle:'فك تشفير إطار 802.11',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'عارض Hex لإطار 802.11', mainDesc:'محلل حقول 802.11 ملون',
    sectionA:'فك التشفير طبقة بطبقة', sectionB:'إحصائيات الالتقاط', sectionC:'نظرية إطار 802.11',
    frameType:'نوع الإطار:', generate:'إنشاء إطار', capture:'التقاط تلقائي',
    theory1:'يبدأ كل إطار WiFi بحقل Frame Control بحجم 2 بايت يشفر النوع والأعلام.',
    theory2:'يمكن أن تظهر حتى 4 عناوين MAC حسب بتات ToDS/FromDS.',
    theory3:'إطارات الإدارة تحمل عناصر معلومات مع معلمات مثل SSID والقناة.',
    theory4:'يحمي FCS بحجم 4 بايت (CRC-32) سلامة الإطار.',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    settings:'الإعدادات', language:'اللغة', theme:'المظهر', soundEffects:'مؤثرات صوتية',
    activityLog:'سجل النشاط',
    howto_1:'اختر نوع الإطار.', howto_2:'اضغط إنشاء.',
    howto_3:'مرر فوق البايتات.', howto_4:'راجع قسم فك التشفير.',
    splashHint:'انقر للتخطي', ready:'🔬 محلل WiFi جاهز!',
    langChanged:'اللغة ← العربية', themeChanged:'المظهر ←',
    logCleared:'تم مسح السجل', copied:'تم النسخ!',
    frameGenerated:'تم إنشاء الإطار', captureStarted:'بدأ الالتقاط التلقائي', captureStopped:'توقف الالتقاط التلقائي',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ما هو 🔬 WiFi Dissector؟',faq_a1:'🔬 WiFi Dissector يتيح لك محاكاة هندسة الترددات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات.',demo_s1:'مرحباً في 🔬 WiFi Dissector! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل هندسة الترددات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

/* ═══════ SPLASH ═══════ */
function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);

/* ═══════ CORE ═══════ */
function setLanguage(lang){
  currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});
  localStorage.setItem('dissector-lang',lang);log(LANG[lang]?.langChanged||'Language changed','info');
}
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('dissector-theme',name);
}
function log(msg,type='info'){
  const c=$('logContainer');if(!c)return;const line=document.createElement('div');
  line.className='log-line log-'+type;const ts=new Date().toLocaleTimeString();
  line.innerHTML=`<span class="log-ts">${ts}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line);c.scrollTop=c.scrollHeight;
}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(hideToast,ms)}
function hideToast(){const t=$('toastIndicator');if(t)t.classList.remove('show')}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}

/* ═══════ PANELS ═══════ */
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ 802.11 FRAME SIMULATION ═══════ */
function randByte(){return Math.floor(Math.random()*256)}
function hex(b){return b.toString(16).padStart(2,'0').toUpperCase()}
function randMAC(){return Array.from({length:6},()=>hex(randByte())).join(':')}

const FRAME_DEFS = {
  beacon: {fc:[0x80,0x00],type:'Management',subtype:'Beacon',hasAddr3:true,hasSeq:true,bodyLen:32},
  probe:  {fc:[0x40,0x00],type:'Management',subtype:'Probe Request',hasAddr3:true,hasSeq:true,bodyLen:16},
  data:   {fc:[0x08,0x01],type:'Data',subtype:'Data',hasAddr3:true,hasSeq:true,bodyLen:48},
  ack:    {fc:[0xD4,0x00],type:'Control',subtype:'ACK',hasAddr3:false,hasSeq:false,bodyLen:0},
  rts:    {fc:[0xB4,0x00],type:'Control',subtype:'RTS',hasAddr3:false,hasSeq:false,bodyLen:0},
  auth:   {fc:[0xB0,0x00],type:'Management',subtype:'Authentication',hasAddr3:true,hasSeq:true,bodyLen:6},
};

let currentFrame = null;
let captureStats = {beacon:0,probe:0,data:0,ack:0,rts:0,auth:0};
let captureInterval = null;

function generateFrame(type){
  const def = FRAME_DEFS[type];
  const frame = {type, def, bytes:[], fields:[]};
  let offset = 0;

  // Frame Control (2 bytes)
  frame.bytes.push(def.fc[0], def.fc[1]);
  frame.fields.push({name:'Frame Control',cls:'f-fc',start:offset,len:2,
    detail:`Type: ${def.type}, Subtype: ${def.subtype}, FC: 0x${hex(def.fc[0])}${hex(def.fc[1])}`});
  offset+=2;

  // Duration (2 bytes)
  const dur = randByte() & 0x7F;
  frame.bytes.push(dur, 0x00);
  frame.fields.push({name:'Duration/ID',cls:'f-dur',start:offset,len:2,detail:`Duration: ${dur} microseconds`});
  offset+=2;

  // Address 1 - Receiver (6 bytes)
  const addr1 = Array.from({length:6},()=>randByte());
  frame.bytes.push(...addr1);
  frame.fields.push({name:'Address 1 (RA)',cls:'f-addr1',start:offset,len:6,detail:`Receiver: ${addr1.map(hex).join(':')}`});
  offset+=6;

  if(type !== 'ack'){
    // Address 2 - Transmitter (6 bytes)
    const addr2 = Array.from({length:6},()=>randByte());
    frame.bytes.push(...addr2);
    frame.fields.push({name:'Address 2 (TA)',cls:'f-addr2',start:offset,len:6,detail:`Transmitter: ${addr2.map(hex).join(':')}`});
    offset+=6;
  }

  if(def.hasAddr3){
    // Address 3 - BSSID (6 bytes)
    const addr3 = Array.from({length:6},()=>randByte());
    frame.bytes.push(...addr3);
    frame.fields.push({name:'Address 3 (BSSID)',cls:'f-addr3',start:offset,len:6,detail:`BSSID: ${addr3.map(hex).join(':')}`});
    offset+=6;
  }

  if(def.hasSeq){
    // Sequence Control (2 bytes)
    const seq = Math.floor(Math.random()*4096);
    const frag = 0;
    frame.bytes.push((seq<<4|frag)&0xFF, (seq>>4)&0xFF);
    frame.fields.push({name:'Sequence Control',cls:'f-seq',start:offset,len:2,detail:`Seq#: ${seq}, Frag#: ${frag}`});
    offset+=2;
  }

  if(def.bodyLen > 0){
    const body = Array.from({length:def.bodyLen},()=>randByte());
    frame.bytes.push(...body);
    frame.fields.push({name:'Frame Body',cls:'f-body',start:offset,len:def.bodyLen,detail:`Payload: ${def.bodyLen} bytes`});
    offset+=def.bodyLen;
  }

  // FCS (4 bytes) - simulated CRC
  const fcs = Array.from({length:4},()=>randByte());
  frame.bytes.push(...fcs);
  frame.fields.push({name:'FCS (CRC-32)',cls:'f-fcs',start:offset,len:4,detail:`FCS: 0x${fcs.map(hex).join('')}`});

  currentFrame = frame;
  captureStats[type]++;
  renderHex();
  renderDecode();
  drawStats();
  log(`${LANG[currentLang]?.frameGenerated||'Frame generated'}: ${def.subtype} (${frame.bytes.length} bytes)`, 'success');
  playSound('click');
}

function renderHex(){
  const el = $('hexDisplay');
  if(!el || !currentFrame) return;
  let html = '';
  const fieldMap = [];
  currentFrame.fields.forEach(f=>{
    for(let i=f.start;i<f.start+f.len;i++) fieldMap[i] = f;
  });
  currentFrame.bytes.forEach((b,i)=>{
    const f = fieldMap[i];
    const cls = f ? f.cls : '';
    const title = f ? `${f.name}: ${f.detail}` : '';
    html += `<span class="hex-byte ${cls}" title="${title}">${hex(b)}</span>`;
    if((i+1)%16===0) html += '<br>';
  });
  el.innerHTML = html;
}

function renderDecode(){
  const el = $('decodePanel');
  if(!el || !currentFrame) return;
  let html = `<div class="decode-row"><div class="decode-label">Frame Type</div><div>${currentFrame.def.type} / ${currentFrame.def.subtype}</div></div>`;
  html += `<div class="decode-row"><div class="decode-label">Total Length</div><div>${currentFrame.bytes.length} bytes</div></div>`;
  currentFrame.fields.forEach(f=>{
    const bytes = currentFrame.bytes.slice(f.start, f.start+f.len).map(hex).join(' ');
    html += `<div class="decode-row"><div class="decode-label">${f.name}</div><div>${f.detail}<br><span style="opacity:.5;font-size:.85em">[${bytes}]</span></div></div>`;
  });
  // Decode Frame Control bits
  const fc0 = currentFrame.bytes[0], fc1 = currentFrame.bytes[1];
  const protVer = fc0 & 0x03;
  const ftype = (fc0 >> 2) & 0x03;
  const fsub = (fc0 >> 4) & 0x0F;
  const toDS = fc1 & 0x01;
  const fromDS = (fc1 >> 1) & 0x01;
  const retry = (fc1 >> 3) & 0x01;
  html += `<div class="decode-row" style="margin-top:8px;border-top:2px solid var(--accent)"><div class="decode-label">FC Bits Detail</div><div>Protocol: ${protVer}, Type: ${ftype}, Subtype: ${fsub}, ToDS: ${toDS}, FromDS: ${fromDS}, Retry: ${retry}</div></div>`;
  el.innerHTML = html;
}

function drawStats(){
  const canvas = $('statsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,W,H);
  const types = Object.keys(captureStats);
  const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#6a0572'];
  const max = Math.max(1, ...Object.values(captureStats));
  const bw = W / types.length - 20;
  types.forEach((t,i)=>{
    const x = i * (bw+20) + 20;
    const h = (captureStats[t]/max) * (H-50);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, H-30-h, bw, h);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.font = '11px Orbitron,monospace';
    ctx.fillText(t, x, H-14);
    ctx.fillText(captureStats[t]+'', x+bw/2-5, H-34-h);
  });
  const info = $('statsInfo');
  if(info){
    const total = Object.values(captureStats).reduce((a,b)=>a+b,0);
    info.textContent = `Total frames: ${total}`;
  }
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang = localStorage.getItem('dissector-lang')||'en';
  const savedTheme = localStorage.getItem('dissector-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',()=>openPanel('helpPanel','helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('helpOverlay')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('settingsBtn')?.addEventListener('click',()=>openPanel('settingsPanel','settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('logBtn')?.addEventListener('click',()=>$('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click',()=>$('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked});
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log(LANG[currentLang]?.logCleared||'Cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast(LANG[currentLang]?.copied||'Copied',1500))});

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const map={faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'};
      $(map[tab.dataset.tab])?.classList.add('active');
    });
  });

  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'});
    });
  });

  // Frame generation
  $('generateBtn')?.addEventListener('click',()=>{
    const type = $('frameTypeSelect')?.value || 'beacon';
    generateFrame(type);
  });

  // Auto capture
  $('captureBtn')?.addEventListener('click',()=>{
    if(captureInterval){
      clearInterval(captureInterval);captureInterval=null;
      setStatus(false);
      $('captureBtn').textContent = LANG[currentLang]?.capture || 'Auto Capture';
      log(LANG[currentLang]?.captureStopped||'Auto capture stopped','info');
    } else {
      captureInterval = setInterval(()=>{
        const types = Object.keys(FRAME_DEFS);
        const weights = [30,15,40,10,3,2]; // beacon heavy, data heavy
        const total = weights.reduce((a,b)=>a+b,0);
        let r = Math.random()*total, idx=0;
        for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0){idx=i;break}}
        generateFrame(types[idx]);
      },1200);
      setStatus(true);
      $('captureBtn').textContent = 'Stop';
      log(LANG[currentLang]?.captureStarted||'Auto capture started','success');
    }
  });

  // Initial frame
  generateFrame('beacon');
  setStatus(false);
  log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — WiFi Dissector: 802.11 frame visualization
   with color-coded fields, hex bytes, and frame flow animation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simDissectorCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const wifiFrames=[],hexDrops=[];let captureCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const FRAME_TYPES=[
    {name:'Beacon',color:'#4d96ff',fields:['FC','Dur','BSSID','SA','DA','Seq','SSID','Rates','CH','FCS']},
    {name:'Probe Req',color:'#ffd93d',fields:['FC','Dur','DA','SA','BSSID','Seq','SSID','FCS']},
    {name:'Data',color:'#6bcb77',fields:['FC','Dur','Addr1','Addr2','Addr3','Seq','Payload','FCS']},
    {name:'ACK',color:'#ff78ae',fields:['FC','Dur','RA','FCS']},
    {name:'Auth',color:'#e879f9',fields:['FC','Dur','DA','SA','BSSID','Seq','AuthAlg','Status','FCS']},
    {name:'RTS',color:'#ff6b6b',fields:['FC','Dur','RA','TA','FCS']}
  ];

  class WiFiFrame{
    constructor(){
      this.type=FRAME_TYPES[Math.floor(Math.random()*FRAME_TYPES.length)];
      this.x=-50;this.y=30+Math.random()*(H-100);this.vx=1+Math.random()*1.5;
      this.alive=true;this.fieldWidth=Math.max(16,Math.floor((W-100)/this.type.fields.length));
      this.hex=Array.from({length:this.type.fields.length*2},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0'));
    }
    update(){this.x+=this.vx;if(this.x>W+100)this.alive=false;return this.alive;}
    draw(){
      const fh=20,totalW=this.type.fields.length*this.fieldWidth;
      // Frame background
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(this.x,this.y,totalW,fh+14);
      // Type label
      ctx.font='bold 8px monospace';ctx.fillStyle=this.type.color;ctx.textAlign='left';ctx.fillText(this.type.name,this.x,this.y-4);
      // Fields
      this.type.fields.forEach((f,i)=>{
        const fx=this.x+i*this.fieldWidth;
        ctx.fillStyle=this.type.color+'33';ctx.fillRect(fx,this.y,this.fieldWidth-2,fh);
        ctx.strokeStyle=this.type.color+'66';ctx.lineWidth=1;ctx.strokeRect(fx,this.y,this.fieldWidth-2,fh);
        ctx.font='7px monospace';ctx.fillStyle=this.type.color;ctx.textAlign='center';ctx.fillText(f,fx+this.fieldWidth/2-1,this.y+8);
        // Hex bytes below
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='6px monospace';
        const hexStr=this.hex[i*2]||'00';ctx.fillText(hexStr,fx+this.fieldWidth/2-1,this.y+fh+8);
      });
    }
  }

  /* Hex rain background */
  class HexDrop{
    constructor(){this.x=Math.random()*W;this.y=-10;this.speed=0.5+Math.random()*1;this.char=Math.floor(Math.random()*256).toString(16).padStart(2,'0');}
    update(){this.y+=this.speed;if(this.y>H){this.y=-10;this.x=Math.random()*W;this.char=Math.floor(Math.random()*256).toString(16).padStart(2,'0');}return true;}
    draw(){ctx.font='8px monospace';ctx.fillStyle='rgba(100,150,255,0.06)';ctx.textAlign='center';ctx.fillText(this.char,this.x,this.y);}
  }

  /* Frame type histogram */
  function drawHistogram(){
    const counts={};FRAME_TYPES.forEach(t=>counts[t.name]=0);wifiFrames.forEach(f=>counts[f.type.name]++);
    const bw=Math.min(50,(W-40)/FRAME_TYPES.length-6),sx=(W-FRAME_TYPES.length*(bw+6))/2;
    const by=H-8;
    FRAME_TYPES.forEach((t,i)=>{
      const bx=sx+i*(bw+6),bh=Math.min(30,counts[t.name]*4);
      ctx.fillStyle=t.color+'44';ctx.fillRect(bx,by-bh,bw,bh);ctx.strokeStyle=t.color;ctx.lineWidth=1;ctx.strokeRect(bx,by-bh,bw,bh);
      ctx.font='6px monospace';ctx.fillStyle=t.color;ctx.textAlign='center';ctx.fillText(t.name.slice(0,6),bx+bw/2,by+6);
    });
  }

  /* Protocol control field decoder */
  function drawFCDecoder(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(W-140,8,132,44);ctx.strokeStyle='#fff2';ctx.strokeRect(W-140,8,132,44);
    ctx.font='8px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='left';ctx.fillText('Frame Control Bits',W-134,20);
    const bits=['ToDS','FromDS','Retry','PwrMgt','More','WEP','Order','Prot'];
    bits.forEach((b,i)=>{const on=Math.random()>0.5;ctx.fillStyle=on?'#6bcb77':'#444';ctx.fillText((on?'1':'0')+' '+b,W-134+(i%4)*33,32+(Math.floor(i/4)*12));});
    ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,56);ctx.strokeStyle='#4d96ff33';ctx.strokeRect(8,8,185,56);
    ctx.font='10px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='left';ctx.fillText('\u{1F52C} WIFI DISSECTOR',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Frames: '+captureCount+'  Active: '+wifiFrames.length,16,40);
    ctx.fillText('Types: '+FRAME_TYPES.length,16,54);ctx.restore();
  }

  function init(){
    ensureCanvas();
    for(let i=0;i<60;i++)hexDrops.push(new HexDrop());
    animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,16,0.14)';ctx.fillRect(0,0,W,H);
    hexDrops.forEach(d=>{d.update();d.draw();});
    if(frameCount%30===0){wifiFrames.push(new WiFiFrame());captureCount++;}
    for(let i=wifiFrames.length-1;i>=0;i--){if(!wifiFrames[i].update())wifiFrames.splice(i,1);else wifiFrames[i].draw();}
    drawHistogram();if(frameCount%60<30)drawFCDecoder();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
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
