/**
 * Sonic Infrasound Detector — Workshop DIY v1.0
 * Monitor sub-20Hz infrasonic waves from seismic/volcanic/nuclear events
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray;
let isMonitoring = false, animId = null, eventCount = 0, maxAmp = 0, history = [];

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
    title:'Infrasound Detector', subtitle:'Detect Earthquakes / Nukes / Volcanoes',
    disconnected:'Idle', connected:'Monitoring',
    mainSection:'Infrasound Detector', mainDesc:'Monitor sub-20Hz infrasonic waves',
    sectionA:'Detection Events', sectionB:'Infrasound Science', sectionC:'Challenge',
    startMon:'Start Monitor', stop:'Stop', filterLabel:'Filter:',
    eventType:'Event Type', amplitude:'Amplitude', stats:'Stats',
    detectionHint:'Detected infrasonic events appear here.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Infrasound Detector ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    started:'Monitoring started — listening for infrasound', stopped:'Monitoring stopped',
    quiet:'QUIET', seismic:'SEISMIC', volcanic:'VOLCANIC', nuclear:'NUCLEAR SIGNATURE',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Detection Events" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_infra_title:'Infrasound Sources', wiki_infra:'Earthquakes (0.01-1 Hz), volcanoes (0.5-5 Hz), nuclear tests (0.1-10 Hz), severe weather (1-10 Hz), ocean microbaroms (0.05-0.5 Hz).',
    wiki_detect_title:'Detection Methods', wiki_detect:'Microbarometers (pressure sensors), infrasound arrays, accelerometers. Arrays use beamforming to determine arrival direction.',
    wiki_ctbto_title:'CTBTO Network', wiki_ctbto:'60+ stations in the International Monitoring System detect nuclear tests. Each station uses multiple sensors separated by 1-3km for triangulation.',
    challenge1:'Why can infrasound travel thousands of kilometers while audible sound fades quickly?',
    challenge2:'How does the CTBTO distinguish nuclear tests from earthquakes?',
    challenge3:'What natural phenomenon creates the most powerful infrasound on Earth?',
    challengeReveal1:'Low-frequency waves have very long wavelengths (17m-3400m) which diffract around obstacles and suffer less atmospheric absorption. They can propagate through thermospheric and stratospheric waveguides.',
    challengeReveal2:'Nuclear explosions produce a characteristic frequency pattern (5-20Hz), sharp onset, and specific waveform shape. Triangulation from multiple stations pinpoints the source.',
    challengeReveal3:'Large volcanic eruptions like Krakatoa (1883) and Hunga Tonga (2022) generated infrasound that circled the globe multiple times, detectable by barometers worldwide.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment.',sectionCode:'Device Code',faq_q1:'What is Infrasound Detector?',faq_a1:'Infrasound Detector lets you monitor sub-20hz infrasonic waves. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you create a specific acoustic signal with precise frequency and amplitude. Then you the sound wave travels through air, walls, or other media to the target.',faq_q3:'What do the controls do?',faq_a3:'Click Start Monitor to begin capturing audio. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'زلازل (0.01-1 هرتز)، براكين (0.5-5 هرتز)، تفجيرات نووية (0.1-10 هرتز)، طقس قاسٍ (1-10 هرتز).',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Fence. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Infrasound Detector! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Click Start Monitor to begin capturing audio. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Detection Events" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how acoustic science works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Infrasound Detector: Monitor sub-20Hz infrasonic waves. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Generate Sound through Propagate to Detect & Capture and Analyze & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Detection Events" and "Infrasound Science" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Detecteur Infrason', subtitle:'Detecter Seismes / Nucleaire / Volcans',
    disconnected:'Inactif', connected:'Surveillance',
    mainSection:'Detecteur Infrason', mainDesc:'Surveiller les ondes infrasoniques sub-20Hz',
    sectionA:'Evenements Detectes', sectionB:'Science Infrasonique', sectionC:'Defi',
    startMon:'Demarrer', stop:'Arreter', filterLabel:'Filtre:',
    eventType:'Type d\'Evenement', amplitude:'Amplitude', stats:'Stats',
    detectionHint:'Les evenements infrasoniques detectes apparaissent ici.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Detecteur infrason pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    started:'Surveillance demarree — ecoute des infrasound', stopped:'Surveillance arretee',
    quiet:'CALME', seismic:'SISMIQUE', volcanic:'VOLCANIQUE', nuclear:'SIGNATURE NUCLEAIRE',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_infra_title:'Sources d\'Infrason', wiki_infra:'Seismes (0.01-1 Hz), volcans (0.5-5 Hz), tests nucleaires (0.1-10 Hz), meteo severe (1-10 Hz).',
    wiki_detect_title:'Methodes de Detection', wiki_detect:'Microbarometres, reseaux infrasoniques, accelerometres. Formation de faisceaux pour determiner la direction.',
    wiki_ctbto_title:'Reseau OTICE', wiki_ctbto:'60+ stations dans le Systeme de Surveillance International. Chaque station utilise plusieurs capteurs espaces de 1-3km.',
    challenge1:'Pourquoi l\'infrason peut-il voyager des milliers de km alors que le son audible s\'attenue vite?',
    challenge2:'Comment l\'OTICE distingue-t-elle les tests nucleaires des seismes?',
    challenge3:'Quel phenomene naturel cree l\'infrason le plus puissant sur Terre?',
    challengeReveal1:'Les ondes basse frequence ont de tres longues longueurs d\'onde qui diffractent autour des obstacles et subissent moins d\'absorption atmospherique.',
    challengeReveal2:'Les explosions nucleaires produisent un patron frequentiel caracteristique (5-20Hz), un debut brusque et une forme d\'onde specifique.',
    challengeReveal3:'Les grandes eruptions volcaniques comme Krakatoa (1883) et Hunga Tonga (2022) ont genere des infrason detectables dans le monde entier.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Infrasound Detector ?',faq_a1:'Infrasound Detector te permet de simuler science acoustique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de science acoustique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de science acoustique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de science acoustique.',demo_s1:'Bienvenue dans Infrasound Detector ! Regarde l\'écran principal — c\'est ici que la simulation de science acoustique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de science acoustique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne science acoustique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de science acoustique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Infrasound Detector : Monitor sub-20Hz infrasonic waves. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'كاشف الموجات دون الصوتية', subtitle:'كشف الزلازل / النووي / البراكين',
    disconnected:'خامل', connected:'مراقبة',
    mainSection:'كاشف الموجات دون الصوتية', mainDesc:'مراقبة الموجات تحت 20 هرتز',
    sectionA:'أحداث مكتشفة', sectionB:'علم الموجات دون الصوتية', sectionC:'التحدي',
    startMon:'بدء المراقبة', stop:'إيقاف', filterLabel:'الفلتر:',
    eventType:'نوع الحدث', amplitude:'السعة', stats:'إحصائيات',
    detectionHint:'الأحداث دون الصوتية المكتشفة تظهر هنا.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'كاشف الموجات دون الصوتية جاهز!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    started:'بدأت المراقبة — الاستماع للموجات دون الصوتية', stopped:'توقفت المراقبة',
    quiet:'هادئ', seismic:'زلزالي', volcanic:'بركاني', nuclear:'توقيع نووي',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_infra_title:'مصادر الموجات دون الصوتية', wiki_infra:'زلازل (0.01-1 هرتز)، براكين (0.5-5 هرتز)، تفجيرات نووية (0.1-10 هرتز)، طقس قاسٍ (1-10 هرتز).',
    wiki_detect_title:'طرق الكشف', wiki_detect:'ميكروبارومترات (حساسات ضغط)، مصفوفات دون صوتية، مقاييس تسارع. تشكيل الحزم لتحديد اتجاه الوصول.',
    wiki_ctbto_title:'شبكة CTBTO', wiki_ctbto:'أكثر من 60 محطة في نظام الرصد الدولي. كل محطة تستخدم عدة حساسات متباعدة 1-3 كم للتثليث.',
    challenge1:'لماذا يمكن للموجات دون الصوتية أن تسافر آلاف الكيلومترات؟',
    challenge2:'كيف تميز CTBTO التفجيرات النووية عن الزلازل؟',
    challenge3:'ما الظاهرة الطبيعية التي تنتج أقوى موجات دون صوتية على الأرض؟',
    challengeReveal1:'الموجات منخفضة التردد لها أطوال موجية طويلة جدًا تنعرج حول العوائق وتعاني امتصاصًا أقل في الغلاف الجوي.',
    challengeReveal2:'التفجيرات النووية تنتج نمطًا ترددياً مميزًا (5-20 هرتز) وبداية حادة وشكل موجي محدد. التثليث من محطات متعددة يحدد المصدر.',
    challengeReveal3:'الانفجارات البركانية الكبيرة مثل كراكاتوا (1883) وهونغا تونغا (2022) أنتجت موجات دون صوتية طافت الكرة الأرضية عدة مرات.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Infrasound Detector؟',faq_a1:'Infrasound Detector يتيح لك محاكاة علم الصوتيات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في علم الصوتيات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من علم الصوتيات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من علم الصوتيات.',demo_s1:'مرحباً في Infrasound Detector! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة علم الصوتيات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـعلم الصوتيات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل علم الصوتيات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم علم الصوتيات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Infrasound Detector: Monitor sub-20Hz infrasonic waves. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(T('themeChanged') + ' ' + n, 'info'); }
let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); } catch { log('Copy failed', 'error'); } }
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ CANVAS ═══════ */
const canvas = $('infraCanvas'), ctx = canvas ? canvas.getContext('2d') : null;

function drawInfrasound() {
  if (!ctx || !freqArray) return;
  analyser.getByteFrequencyData(freqArray); analyser.getByteTimeDomainData(dataArray);
  const binHz = audioCtx.sampleRate / analyser.fftSize;
  const lowBins = Math.min(100, Math.floor(20 / binHz));
  let amp = 0; for (let i = 0; i < lowBins; i++) amp += freqArray[i]; amp /= lowBins;
  history.push(amp); if (history.length > canvas.width) history.shift();
  if (amp > maxAmp) maxAmp = amp;

  // Classify event
  let evtType = T('quiet'), color = '#22c55e';
  if (amp > 150) { evtType = T('nuclear'); color = '#ef4444'; if (eventCount === 0 || history.length % 60 === 0) { addDetection('NUCLEAR', amp); eventCount++; } }
  else if (amp > 100) { evtType = T('volcanic'); color = '#f59e0b'; if (eventCount === 0 || history.length % 90 === 0) { addDetection('VOLCANIC', amp); eventCount++; } }
  else if (amp > 60) { evtType = T('seismic'); color = '#3b82f6'; if (eventCount === 0 || history.length % 120 === 0) { addDetection('SEISMIC', amp); eventCount++; } }
  $('eventType').textContent = evtType; $('eventType').style.color = color;
  $('ampValue').textContent = amp.toFixed(1) + ' dB';
  $('statsInfo').innerHTML = 'Events: ' + eventCount + '<br>Max: ' + maxAmp.toFixed(1) + ' dB<br>Filter: ' + $('filterSelect').value + '<br>Bins: ' + lowBins;

  // Draw seismograph
  ctx.fillStyle = 'rgba(10,10,26,0.06)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(0,255,170,0.1)'; ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
  ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.beginPath();
  for (let i = 0; i < history.length; i++) { const y = canvas.height - history[i] / 255 * canvas.height; i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y); }
  ctx.stroke();
  // Waveform overlay
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath();
  const sw = canvas.width / dataArray.length; let x = 0;
  for (let i = 0; i < dataArray.length; i++) { const y = dataArray[i] / 128 * canvas.height / 2; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); x += sw; }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron'; ctx.textAlign = 'left';
  ctx.fillText('INFRASOUND SEISMOGRAPH', 10, 15); ctx.fillText('0-20 Hz', 10, canvas.height - 5);
}

function drawIdle() { if (!ctx) return; ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'rgba(0,255,170,0.15)'; ctx.font = '13px Orbitron'; ctx.textAlign = 'center'; ctx.fillText('INFRASOUND MONITOR — Click Start', canvas.width / 2, canvas.height / 2); ctx.textAlign = 'left'; }
function animate() { drawInfrasound(); animId = requestAnimationFrame(animate); }

function addDetection(type, amp) {
  const el = $('detectionLog'); if (!el) return;
  const d = document.createElement('div');
  const colors = { SEISMIC: '#3b82f6', VOLCANIC: '#f59e0b', NUCLEAR: '#ef4444' };
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,0,0,.2);color:' + colors[type] + ';border-left:3px solid ' + colors[type] + ';';
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + type + ' event: ' + amp.toFixed(1) + ' dB';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
  log(type + ' event detected at ' + amp.toFixed(1) + ' dB', 'rx');
}

async function startMonitor() {
  if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const src = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser(); analyser.fftSize = 8192; analyser.smoothingTimeConstant = 0.9;
    src.connect(analyser);
    dataArray = new Uint8Array(analyser.fftSize); freqArray = new Uint8Array(analyser.frequencyBinCount);
    isMonitoring = true; setStatus(true); history = []; eventCount = 0; maxAmp = 0;
    animate(); log(T('started'), 'success'); showToast(T('started'), 2000);
  } catch (e) { log('Mic denied: ' + e.message, 'error'); }
}
function stopMonitor() {
  isMonitoring = false; setStatus(false);
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  log(T('stopped'), 'info'); drawIdle();
}

function fillScience() {
  const el = $('scienceInfo'); if (!el) return;
  el.innerHTML = '<b>Infrasound (&lt; 20 Hz)</b><br>Sound below human hearing threshold. Sources:<br>' +
    '- Earthquakes: 0.01-1 Hz<br>- Volcanic eruptions: 0.5-5 Hz<br>- Nuclear explosions: 0.1-10 Hz<br>' +
    '- Severe weather: 1-10 Hz<br>- Ocean waves (microbaroms): 0.05-0.5 Hz<br>- Meteors: 0.5-5 Hz<br><br>' +
    '<b>Detection Methods:</b><br>- Microbarometers (pressure sensors)<br>- Infrasound arrays (CTBTO network)<br>' +
    '- Accelerometers<br>- Wind noise reduction: pipe arrays, spatial filtering<br><br>' +
    '<b>CTBTO IMS:</b> 60+ infrasound stations worldwide monitor for nuclear tests under the Comprehensive Nuclear-Test-Ban Treaty. Each station uses 4-8 sensors in a 1-3km array for beamforming.<br><br>' +
    '<b>Propagation:</b> Infrasound propagates through atmospheric waveguides (tropospheric, stratospheric, thermospheric) allowing detection at thousands of kilometers.';
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}
  $('helpBtn').onclick = () => { $('helpPanel').classList.toggle('open'); $('helpOverlay').classList.toggle('active'); };
  $('helpCloseBtn').onclick = $('helpOverlay').onclick = () => { $('helpPanel').classList.remove('open'); $('helpOverlay').classList.remove('active'); };
  $('settingsBtn').onclick = () => { $('settingsPanel').classList.toggle('open'); $('settingsOverlay').classList.toggle('active'); };
  $('settingsCloseBtn').onclick = $('settingsOverlay').onclick = () => { $('settingsPanel').classList.remove('open'); $('settingsOverlay').classList.remove('active'); };
  $('logBtn').onclick = () => $('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick = () => $('logPanel').classList.remove('open');
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog;
  $('langSelect').onchange = e => setLanguage(e.target.value);
  $('themeSelect').onchange = e => setTheme(e.target.value);
  $('soundToggle').onchange = e => { soundEnabled = e.target.checked; };
  document.querySelectorAll('.help-tab').forEach(tab => { tab.onclick = () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (tgt) tgt.classList.add('active'); }; });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.onclick = () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }; });
  $('startBtn').onclick = startMonitor; $('stopBtn').onclick = stopMonitor;
  drawIdle(); fillScience(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Infrasound Detector
   Animated seismograph trace, frequency spectrum, CTBTO station
   network map, and event classification display
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simInfrasound';let cv,cx,W,H,af=null,t=0;
  const traceHistory=[];const freqBins=128;const spectrum=new Float32Array(freqBins);
  const events=[];let eventCount=0;
  const stations=[{x:0.2,y:0.3,name:'IMS-01'},{x:0.5,y:0.2,name:'IMS-02'},{x:0.8,y:0.4,name:'IMS-03'},
    {x:0.3,y:0.7,name:'IMS-04'},{x:0.6,y:0.6,name:'IMS-05'},{x:0.85,y:0.75,name:'IMS-06'}];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=320;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a14;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function generateSignal(){
    const base=Math.sin(t*0.3)*15+Math.sin(t*0.7)*8+Math.sin(t*1.2)*5;
    // Occasional seismic events
    let event=0;
    if(Math.sin(t*0.05)>0.95)event=60*Math.exp(-Math.pow(t%20-10,2)/8);
    if(Math.sin(t*0.02+1)>0.97)event+=40*Math.exp(-Math.pow(t%30-15,2)/5);
    const noise=(Math.random()-.5)*8;
    return base+event+noise;
  }

  function classifyAmplitude(amp){
    const a=Math.abs(amp);
    if(a>80)return{type:'NUCLEAR',color:'#ef4444',level:3};
    if(a>50)return{type:'VOLCANIC',color:'#f59e0b',level:2};
    if(a>30)return{type:'SEISMIC',color:'#3b82f6',level:1};
    return{type:'QUIET',color:'#22c55e',level:0};
  }

  function drawSeismograph(){
    const sy=10,sh=110,sw=W-220;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(10,sy,sw,sh);
    // Grid
    cx.strokeStyle='rgba(0,255,170,0.06)';cx.lineWidth=0.5;
    for(let i=0;i<=10;i++){const x=10+i/10*sw;cx.beginPath();cx.moveTo(x,sy);cx.lineTo(x,sy+sh);cx.stroke();}
    for(let i=0;i<=4;i++){const y=sy+i/4*sh;cx.beginPath();cx.moveTo(10,y);cx.lineTo(10+sw,y);cx.stroke();}
    // Center line
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.setLineDash([4,4]);
    cx.beginPath();cx.moveTo(10,sy+sh/2);cx.lineTo(10+sw,sy+sh/2);cx.stroke();
    cx.setLineDash([]);

    if(traceHistory.length>1){
      const cls=classifyAmplitude(traceHistory[traceHistory.length-1]);
      cx.strokeStyle=cls.color;cx.lineWidth=1.5;cx.beginPath();
      const step=sw/Math.max(1,traceHistory.length-1);
      traceHistory.forEach((v,i)=>{
        const x=10+i*step;
        const y=sy+sh/2-v/120*sh*0.4;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(0,255,170,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('INFRASOUND SEISMOGRAPH — 0-20 Hz',18,sy+12);
  }

  function drawSpectrum(){
    const sx=W-200,sy=10,sw=190,sh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(sx,sy,sw,sh);
    for(let i=0;i<freqBins;i++){
      const freq=i/freqBins*20;
      let val=0;
      val+=0.5*Math.exp(-Math.pow((freq-2)*2,2))*Math.abs(Math.sin(t*0.5));
      val+=0.3*Math.exp(-Math.pow((freq-5)*1.5,2))*Math.abs(Math.sin(t*0.3));
      val+=0.2*Math.exp(-Math.pow((freq-12)*1,2))*Math.abs(Math.sin(t*0.7));
      val+=Math.random()*0.05;
      spectrum[i]=val;
      const bh=val*sh*0.8;
      const hue=120-val*120;
      cx.fillStyle='hsla('+hue+',70%,50%,'+(0.3+val*0.5)+')';
      cx.fillRect(sx+i/freqBins*sw,sy+sh-bh,sw/freqBins-0.5,bh);
    }
    cx.fillStyle='rgba(0,255,170,0.4)';cx.font='7px monospace';
    cx.fillText('FREQUENCY — 0 Hz         20 Hz',sx+4,sy+sh+10);
    cx.fillText('LOW-FREQ SPECTRUM',sx+4,sy+10);
  }

  function drawStationMap(){
    const mx=10,my=130,mw=W/2-20,mh=130;
    cx.fillStyle='rgba(0,0,20,0.4)';cx.fillRect(mx,my,mw,mh);
    cx.strokeStyle='rgba(0,100,200,0.15)';cx.lineWidth=0.5;
    // Simple world outline (abstracted)
    cx.beginPath();
    cx.moveTo(mx+mw*0.1,my+mh*0.3);cx.quadraticCurveTo(mx+mw*0.3,my+mh*0.15,mx+mw*0.5,my+mh*0.25);
    cx.quadraticCurveTo(mx+mw*0.7,my+mh*0.2,mx+mw*0.9,my+mh*0.35);
    cx.strokeStyle='rgba(0,100,200,0.2)';cx.stroke();
    cx.beginPath();
    cx.moveTo(mx+mw*0.1,my+mh*0.5);cx.quadraticCurveTo(mx+mw*0.25,my+mh*0.8,mx+mw*0.4,my+mh*0.7);
    cx.stroke();

    // Stations
    stations.forEach((s,i)=>{
      const sx2=mx+s.x*mw,sy2=my+s.y*mh;
      const pulse=3+Math.sin(t*2+i)*2;
      cx.save();cx.shadowColor='#00ff88';cx.shadowBlur=pulse;
      cx.fillStyle='rgba(0,255,136,0.7)';cx.beginPath();cx.arc(sx2,sy2,3,0,Math.PI*2);cx.fill();
      cx.shadowBlur=0;
      cx.font='6px monospace';cx.fillStyle='rgba(0,255,170,0.5)';cx.textAlign='center';
      cx.fillText(s.name,sx2,sy2-7);
      cx.restore();
      // Detection rings on events
      const cls=classifyAmplitude(traceHistory.length?traceHistory[traceHistory.length-1]:0);
      if(cls.level>0){
        const r=(t*20+i*15)%40;
        cx.strokeStyle='rgba(239,68,68,'+(0.15*(1-r/40))+')';cx.lineWidth=1;
        cx.beginPath();cx.arc(sx2,sy2,r,0,Math.PI*2);cx.stroke();
      }
    });
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('CTBTO IMS NETWORK',mx+8,my+12);
  }

  function drawEventLog(){
    const ex=W/2,ey=130,ew=W/2-10,eh=130;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(ex,ey,ew,eh);
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('DETECTION LOG',ex+8,ey+12);

    const recentEvents=events.slice(-6);
    recentEvents.forEach((e,i)=>{
      cx.fillStyle=e.color;cx.font='7px monospace';
      cx.fillText('['+e.time+'] '+e.type+' — '+e.amp.toFixed(1)+' dB',ex+8,ey+26+i*14);
    });

    // Alert level bar
    const cls=classifyAmplitude(traceHistory.length?traceHistory[traceHistory.length-1]:0);
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(ex+8,ey+eh-20,ew-16,12);
    const alertW=(ew-16)*Math.min(1,Math.abs(traceHistory.length?traceHistory[traceHistory.length-1]:0)/100);
    cx.fillStyle=cls.color;cx.fillRect(ex+8,ey+eh-20,alertW,12);
    cx.fillStyle='rgba(255,255,255,0.5)';cx.font='7px monospace';
    cx.fillText('ALERT: '+cls.type,ex+12,ey+eh-11);
  }

  function drawPressureGraph(){
    const px=10,py=270,pw=W-20,ph=35;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(px,py,pw,ph);
    // Pressure bars (microbarom simulation)
    const bins=96;const binW=pw/bins;
    for(let i=0;i<bins;i++){
      const val=Math.abs(Math.sin(t*0.5+i*0.3)*0.5+Math.sin(t*0.8+i*0.1)*0.3)+Math.random()*0.1;
      const bh=val*ph*0.7;
      cx.fillStyle='hsla('+(180+val*60)+',60%,50%,'+(0.3+val*0.4)+')';
      cx.fillRect(px+i*binW,py+ph-bh,binW-0.5,bh);
    }
    cx.fillStyle='rgba(100,200,255,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('MICROBAROM PRESSURE — Atmospheric Waveguide Detection',px+8,py-3);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(W-200,270,190,35);
    cx.strokeStyle='rgba(0,255,170,0.12)';cx.strokeRect(W-200,270,190,35);
    cx.font='8px monospace';cx.fillStyle='#aaa';cx.textAlign='left';
    cx.fillText('Events: '+eventCount+'  Stations: '+stations.length,W-192,284);
    cx.fillText('Sensitivity: HIGH  Filter: 0-20Hz',W-192,296);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,10,20,0.12)';cx.fillRect(0,0,W,H);

    const signal=generateSignal();
    traceHistory.push(signal);
    if(traceHistory.length>400)traceHistory.shift();

    // Log events
    const cls=classifyAmplitude(signal);
    if(cls.level>=2&&(events.length===0||t-events[events.length-1].t>2)){
      events.push({type:cls.type,color:cls.color,amp:Math.abs(signal),
        time:new Date().toLocaleTimeString(),t:t});
      eventCount++;
      if(events.length>20)events.shift();
    }

    drawSeismograph();drawSpectrum();drawStationMap();
    drawEventLog();drawPressureGraph();drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Infrasound Detection Network — Sub-20Hz Monitoring',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
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
