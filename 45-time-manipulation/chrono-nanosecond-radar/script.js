/**
 * Workshop DIY — Chrono Nanosecond Radar v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 * Easter eggs: Konami, Morse, Matrix rain, Debug, Shake report, Time-travel, Typewriter
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"/>
  <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="1" opacity=".2"/>
  <path d="M50 15 L50 50 L75 50" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite"/>
  </path>
  <circle cx="50" cy="50" r="4" fill="currentColor"/>
</svg>`;

const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click':
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08); break;
    case 'success':
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
  }
}

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
    title: 'Chrono Nanosecond Radar',
    subtitle: 'Nanosecond-precision timing radar',
    disconnected: 'Disconnected', connected: 'Scanning',
    mainSection: 'Nanosecond Radar',
    mainDesc: 'Visualize ultra-precise timing pulses and measure nanosecond intervals',
    sectionA: 'Radar Display', sectionB: 'Theory & Notes', sectionC: 'Detected Targets',
    pulseLabel: 'Pulse Timing', histLabel: 'Round-Trip Histogram',
    pulseRateLabel: 'Pulse Rate (MHz)', precisionLabel: 'Precision (ns)',
    noiseLabel: 'Noise Floor',
    startBtn: 'Start Scan', stopBtn: 'Stop', resetBtn: 'Reset',
    theoryText: 'Nanosecond radar uses ultra-short pulses to measure distances with sub-millimeter precision.',
    theory1: 'Round-trip time = 2d/c where d is distance, c is speed of light',
    theory2: '1 nanosecond corresponds to ~30 cm distance resolution',
    theory3: 'Used in ground-penetrating radar and precision ranging',
    theory4: 'Pulse compression techniques enhance range resolution',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: 'Settings', language: 'Language',
    help: 'Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Adjust pulse rate and precision sliders.',
    howto_2: 'Click Start Scan to begin radar simulation.',
    howto_3: 'Watch targets appear on the radar sweep.',
    howto_4: 'Use Settings to customize theme and language.',
    wiki_themes_title: 'Themes', wiki_themes: '8 built-in themes available.',
    wiki_i18n_title: 'Languages', wiki_i18n: 'Trilingual: English, Francais, Arabic.',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Nanosecond Radar ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    filterAll: 'All', working: 'Working...',
    soundEffects: 'Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', chatPlaceholder: 'Talk to the robot...',
    splashHint: 'tap to skip', newVersion: 'UPDATE',
    langChanged: 'Language: English', themeChanged: 'Theme:',
    scanStarted: 'Radar scan started', scanStopped: 'Radar scan stopped',
    scanReset: 'Radar reset', targetDetected: 'Target detected!',
    targetLost: 'Target lost', sweepComplete: 'Sweep complete',step1Title:'Set Time Reference',step1Desc:'Establish a precise time base using atomic clocks or network synchronization.',step2Title:'Measure Interval',step2Desc:'Capture timing data with nanosecond precision across the system.',step3Title:'Detect Anomalies',step3Desc:'Compare timestamps to find drift, jitter, or deliberate manipulation.',step4Title:'Exploit or Defend',step4Desc:'Use timing information to attack vulnerable systems or strengthen defenses.',sectionCode:'Device Code',faq_q1:'What is Chrono Nanosecond Radar?',faq_a1:'Chrono Nanosecond Radar lets you visualize ultra-precise timing pulses and measure nanosecond intervals. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you establish a precise time base using atomic clocks or network synchronization. Then you capture timing data with nanosecond precision across the system.',faq_q3:'What do the controls do?',faq_a3:'Adjust pulse rate and precision sliders. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real time and frequency principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Chrono Chronos Beacon and Chrono Drift Detective. Each app in this category teaches a different aspect of time and frequency.',demo_s1:'Welcome to Chrono Nanosecond Radar! Look at the main display — this is where the time and frequency simulation runs.',demo_s2:'Adjust pulse rate and precision sliders. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Radar Display" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of time and frequency.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Precision Timing',learn1Desc:'How atomic clocks measure time to nanoseconds',learn1Tag:'Physics',learn2Title:'Synchronization',learn2Desc:'How devices agree on the exact same time',learn2Tag:'Protocols',learn3Title:'Timing Attacks',learn3Desc:'How tiny time differences reveal secrets',learn3Tag:'Security',learn4Title:'Time Signals',learn4Desc:'How time is broadcast via radio to the world',learn4Tag:'Communication',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how time and frequency works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches time and frequency concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Radar Display" and "Theory & Notes" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title: 'Radar Nanoseconde Chrono',
    subtitle: 'Radar temporel precision nanoseconde',
    disconnected: 'Deconnecte', connected: 'En balayage',
    mainSection: 'Radar Nanoseconde',
    mainDesc: 'Visualiser des impulsions temporelles ultra-precises',
    sectionA: 'Affichage Radar', sectionB: 'Theorie & Notes', sectionC: 'Cibles Detectees',
    pulseLabel: 'Temporisation', histLabel: 'Histogramme Aller-Retour',
    pulseRateLabel: 'Frequence (MHz)', precisionLabel: 'Precision (ns)',
    noiseLabel: 'Plancher de bruit',
    startBtn: 'Demarrer', stopBtn: 'Stop', resetBtn: 'Reinit.',
    theoryText: 'Le radar nanoseconde utilise des impulsions ultra-courtes pour mesurer des distances.',
    theory1: 'Temps aller-retour = 2d/c',
    theory2: '1 ns correspond a environ 30 cm de resolution',
    theory3: 'Utilise en radar penetrant et mesure de precision',
    theory4: 'La compression d\'impulsion ameliore la resolution',
    activityLog: 'Journal', eventsMsg: 'Evenements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Theme',
    settings: 'Parametres', language: 'Langue',
    help: 'Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Reglez la frequence et la precision.',
    howto_2: 'Cliquez Demarrer pour le balayage.',
    howto_3: 'Observez les cibles sur le radar.',
    howto_4: 'Utilisez Parametres pour personnaliser.',
    wiki_themes_title: 'Themes', wiki_themes: '8 themes integres.',
    wiki_i18n_title: 'Langues', wiki_i18n: 'Trilingue.',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Radar Nanoseconde pret!',
    logCleared: 'Journal efface', copied: 'Copie!', copyFail: 'Echec',
    filterAll: 'Tout', working: 'En cours...',
    soundEffects: 'Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Reactif musique', chatPlaceholder: 'Parle au robot...',
    splashHint: 'appuyer pour passer', newVersion: 'MAJ',
    langChanged: 'Langue: Francais', themeChanged: 'Theme:',
    scanStarted: 'Balayage demarre', scanStopped: 'Balayage arrete',
    scanReset: 'Radar reinitialise', targetDetected: 'Cible detectee!',
    targetLost: 'Cible perdue', sweepComplete: 'Balayage termine',step1Title:'Définir la référence',step1Desc:'Établis une base de temps précise via horloge atomique ou synchronisation.',step2Title:'Mesurer l\'intervalle',step2Desc:'Capture les données temporelles avec une précision nanoseconde.',step3Title:'Détecter les anomalies',step3Desc:'Compare les horodatages pour trouver la dérive ou la manipulation.',step4Title:'Exploiter ou défendre',step4Desc:'Utilise les informations temporelles pour attaquer ou renforcer les défenses.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Chrono Nanosecond Radar ?',faq_a1:'Chrono Nanosecond Radar te permet de simuler temps et fréquence. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de temps et fréquence. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de temps et fréquence. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de temps et fréquence.',demo_s1:'Bienvenue dans Chrono Nanosecond Radar ! Regarde l\'écran principal — c\'est ici que la simulation de temps et fréquence fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de temps et fréquence.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Precision Timing',learn1Desc:'How atomic clocks measure time to nanoseconds',learn1Tag:'Physics',learn2Title:'Synchronization',learn2Desc:'How devices agree on the exact same time',learn2Tag:'Protocols',learn3Title:'Timing Attacks',learn3Desc:'How tiny time differences reveal secrets',learn3Tag:'Security',learn4Title:'Time Signals',learn4Desc:'How time is broadcast via radio to the world',learn4Tag:'Communication',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne temps et fréquence en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de temps et fréquence par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title: 'رادار النانوثانية كرونو',
    subtitle: 'رادار توقيت بدقة النانوثانية',
    disconnected: 'غير متصل', connected: 'يمسح',
    mainSection: 'رادار النانوثانية',
    mainDesc: 'تصور نبضات التوقيت فائقة الدقة وقياس فترات النانوثانية',
    sectionA: 'عرض الرادار', sectionB: 'النظرية', sectionC: 'الأهداف المكتشفة',
    pulseLabel: 'توقيت النبضة', histLabel: 'مخطط الذهاب والإياب',
    pulseRateLabel: 'معدل النبض (MHz)', precisionLabel: 'الدقة (ns)',
    noiseLabel: 'مستوى الضوضاء',
    startBtn: 'بدء المسح', stopBtn: 'إيقاف', resetBtn: 'إعادة',
    theoryText: 'يستخدم رادار النانوثانية نبضات قصيرة جدا لقياس المسافات بدقة أقل من المليمتر.',
    theory1: 'زمن الذهاب والإياب = 2d/c',
    theory2: '1 نانوثانية تقابل حوالي 30 سم',
    theory3: 'يستخدم في الرادار المخترق للأرض',
    theory4: 'ضغط النبضات يحسن الدقة',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: 'الإعدادات', language: 'اللغة',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف', wiki: 'ويكي',
    howto_1: 'اضبط معدل النبض والدقة.',
    howto_2: 'انقر بدء المسح.',
    howto_3: 'راقب الأهداف على الرادار.',
    howto_4: 'استخدم الإعدادات للتخصيص.',
    wiki_themes_title: 'المظاهر', wiki_themes: '8 مظاهر مدمجة.',
    wiki_i18n_title: 'اللغات', wiki_i18n: 'ثلاثي اللغات.',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة',
    t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: 'رادار النانوثانية جاهز!',
    logCleared: 'تم المسح', copied: 'تم النسخ!', copyFail: 'فشل',
    filterAll: 'الكل', working: 'جارٍ...',
    soundEffects: 'مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', chatPlaceholder: 'تحدث مع الروبوت...',
    splashHint: 'انقر للتخطي', newVersion: 'تحديث',
    langChanged: 'اللغة: العربية', themeChanged: 'المظهر:',
    scanStarted: 'بدأ المسح', scanStopped: 'توقف المسح',
    scanReset: 'إعادة تعيين الرادار', targetDetected: 'تم اكتشاف هدف!',
    targetLost: 'فقد الهدف', sweepComplete: 'اكتمل المسح',step1Title:'تعيين المرجع الزمني',step1Desc:'أنشئ قاعدة زمنية دقيقة باستخدام الساعات الذرية أو المزامنة.',step2Title:'قياس الفاصل',step2Desc:'التقط بيانات التوقيت بدقة نانوثانية عبر النظام.',step3Title:'كشف الشذوذ',step3Desc:'قارن الطوابع الزمنية للعثور على الانحراف أو التلاعب.',step4Title:'استغلال أو دفاع',step4Desc:'استخدم معلومات التوقيت لمهاجمة الأنظمة أو تعزيز الدفاعات.',sectionCode:'كود الجهاز',faq_q1:'ما هو Chrono Nanosecond Radar؟',faq_a1:'Chrono Nanosecond Radar يتيح لك محاكاة الوقت والتردد. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الوقت والتردد. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الوقت والتردد. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الوقت والتردد.',demo_s1:'مرحباً في Chrono Nanosecond Radar! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الوقت والتردد.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالوقت والتردد.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Precision Timing',learn1Desc:'How atomic clocks measure time to nanoseconds',learn1Tag:'Physics',learn2Title:'Synchronization',learn2Desc:'How devices agree on the exact same time',learn2Tag:'Protocols',learn3Title:'Timing Attacks',learn3Desc:'How tiny time differences reveal secrets',learn3Tag:'Security',learn4Title:'Time Signals',learn4Desc:'How time is broadcast via radio to the world',learn4Tag:'Communication',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل الوقت والتردد من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الوقت والتردد من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = s.title + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(s.themeChanged + ' ' + label, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = 'log-line ' + type;
  const fullText = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); }
  logWithHistory(msg, type);
  applyLogFilter();
  resetPetSleep();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;
function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}
function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;
function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}
function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLogFilter = btn.dataset.filter;
      applyLogFilter();
      playSound('click');
    });
  });
}
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'radar-log-' + new Date().toISOString().slice(0, 10) + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
  try {
    const stored = localStorage.getItem('wdiy-latest-version');
    if (stored && stored !== APP_VERSION) {
      const btn = $('settingsBtn');
      if (btn && !btn.querySelector('.version-update')) {
        const badge = document.createElement('span');
        badge.className = 'version-update';
        badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
        btn.style.position = 'relative';
        badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
        btn.appendChild(badge);
      }
    }
  } catch {}
}

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';
function sendAppMessage(type, data) {
  try {
    const msg = { type, data, from: document.title, ts: Date.now() };
    localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
    localStorage.removeItem(APP_MSG_KEY);
  } catch {}
}
function onAppMessage(callback) {
  window.addEventListener('storage', e => {
    if (e.key !== APP_MSG_KEY || !e.newValue) return;
    try { callback(JSON.parse(e.newValue)); } catch {}
  });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('KONAMI CODE ACTIVATED!', 'success'); playSound('success'); }
    } else { konamiIdx = 0; }
  });
}

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};
let morseTimeout = null, morseActive = false;
function textToMorse(text) { return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' '); }

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, ''));
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(100); }
    else if (ch === '-') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(300); }
    else if (ch === '/') { await sleep(400); continue; }
    else if (ch === ' ') { await sleep(200); continue; }
    dot.style.background = orig; dot.style.boxShadow = ''; await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => { if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; } });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active');
    log('Matrix rain off', 'info'); return;
  }
  matrixRunning = true; canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);
  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw(); log('Matrix rain on!', 'success');
}

let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); }
    else logoClickTimer = setTimeout(() => logoClickCount = 0, 500);
  });
}

/* ═══════ DEBUG PANEL ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel');
  if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, lastTime = performance.now();
  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      frames = 0; lastTime = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  log('Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
  if (!window.DeviceMotionEvent) return;
  let lastShake = 0;
  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > 25 && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      const report = { app: document.title, version: APP_VERSION, timestamp: new Date().toISOString(), userAgent: navigator.userAgent, theme: document.documentElement.dataset.theme, lang: currentLang };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'bug-report-' + Date.now() + '.json'; a.click();
      log('Bug report exported', 'success');
    }
  });
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

const logHistory = [];
function logWithHistory(msg, type) { logHistory.push({ msg, type, ts: Date.now() }); }
function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) { logContainer.removeChild(logContainer.lastChild); logHistory.pop(); playSound('click'); }
    }
  });
}

/* ═══════ TYPEWRITER LOG MODE ═══════ */

let typewriterEnabled = true;
async function typewriterAppend(element, text) {
  element.classList.add('typing'); element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}

/* ═══════ HIJRI DATE ═══════ */

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {}
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null, whisperActive = false;
function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('Speech not supported', 'error'); return; }
  if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('Whisper mode off', 'info'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR(); recognition.continuous = true; recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) { const text = e.results[i][0].transcript.trim(); if (text) log('Voice: ' + text, 'rx'); } } };
  recognition.onerror = e => log('Voice error: ' + e.error, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start(); whisperActive = true; log('Whisper mode on', 'success');
}

/* ═══════ GHOST USERS ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx, myGhostId = Math.random().toString(36).slice(2, 8);
function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;
  window.addEventListener('resize', () => { ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight; });
  document.addEventListener('mousemove', e => { try { localStorage.setItem(GHOST_KEY, JSON.stringify({ id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now() })); } catch {} });
  const ghosts = {};
  window.addEventListener('storage', e => { if (e.key !== GHOST_KEY || !e.newValue) return; try { const d = JSON.parse(e.newValue); if (d.id !== myGhostId) ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts }; } catch {} });
  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      ghostCtx.globalAlpha = 0.3 * (1 - (now - g.ts) / 3000);
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2); ghostCtx.fillStyle = accent; ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523], 'zellige': [440, 523, 659], 'andalus': [294, 370, 440],
  'space': [523, 659, 784], 'jungle': [262, 330, 392], 'robot': [440, 554, 659],
  'riad': [349, 440, 523], 'medina': [294, 349, 440], 'retro': [523, 262, 523],
};
function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq; gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;
  if (breathingActive) { bands.forEach(b => b.classList.add('breathing')); log('Breathing guide on', 'info'); }
  else { bands.forEach(b => b.classList.remove('breathing')); if (dhikrCount > 0) log('Dhikr count: ' + dhikrCount, 'success'); dhikrCount = 0; log('Breathing guide off', 'info'); }
}
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

/* ═══════ PIXEL PET ═══════ */

const PET_STATES = { idle: { class: 'pet-idle', duration: 0 }, happy: { class: 'pet-happy', duration: 3000 }, sad: { class: 'pet-sad', duration: 3000 }, sleep: { class: 'pet-sleep', duration: 0 } };
let petState = 'idle', petIdleTimer = null;
function initPixelPet() {
  const pet = document.createElement('div'); pet.id = 'pixelPet'; pet.className = 'pixel-pet pet-idle'; pet.title = 'Click me!';
  pet.innerHTML = '<span style="font-size:20px">🤖</span>';
  pet.addEventListener('click', () => { setPetState('happy'); playSound('success'); });
  const footer = document.querySelector('.app-footer');
  if (footer) footer.insertBefore(pet, footer.firstChild);
}
function setPetState(state) {
  petState = state; const pet = $('pixelPet'); if (!pet) return;
  pet.classList.remove('pet-idle', 'pet-happy', 'pet-sad', 'pet-sleep');
  pet.classList.add(PET_STATES[state].class);
  if (petIdleTimer) clearTimeout(petIdleTimer);
  if (PET_STATES[state].duration > 0) petIdleTimer = setTimeout(() => setPetState('idle'), PET_STATES[state].duration);
}
let petSleepTimer = null;
function resetPetSleep() {
  if (petSleepTimer) clearTimeout(petSleepTimer);
  if (petState === 'sleep') setPetState('idle');
  petSleepTimer = setTimeout(() => setPetState('sleep'), 60000);
}

/* ═══════ NIGHT MODE ═══════ */

function initNightMode() {
  const hour = new Date().getHours();
  if (hour >= 21 || hour < 6) {
    try { if (!localStorage.getItem('wdiy-theme')) { setTheme('mosque-gold'); log('Night mode', 'info'); } } catch {}
  }
}

/* ═══════ LOGO FOLLOWS CURSOR ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (innerWidth / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (innerHeight / 2);
    logo.style.transform = 'perspective(200px) rotateX(' + (dy * 8) + 'deg) rotateY(' + (-dx * 8) + 'deg)';
  });
  document.addEventListener('mouseleave', () => { logo.style.transition = 'transform .5s'; logo.style.transform = ''; setTimeout(() => logo.style.transition = '', 500); });
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null, musicActive = false, musicAnim = null;
function toggleMusicMode() {
  if (musicActive) {
    musicActive = false; if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('Music mode off', 'info'); return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser(); musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser); musicActive = true;
    log('Music mode on!', 'success');
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      bands.forEach((b, i) => { b.style.height = (2 + (i === 0 ? bass : bass * 0.5) * 10) + 'px'; });
      cards.forEach(c => { c.style.transform = 'scale(' + (1 + bass * 0.015) + ')'; });
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => log('Microphone denied', 'error'));
}

/* ═══════ AR MODE ═══════ */

function initAR() {
  if (!navigator.xr) return;
  navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    if (!supported) return;
    const btns = document.querySelector('.header-buttons');
    if (!btns) return;
    const arBtn = document.createElement('button'); arBtn.className = 'btn-icon-only'; arBtn.textContent = 'AR';
    arBtn.onclick = async () => {
      try { const s = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] }); log('AR started!', 'success'); s.addEventListener('end', () => log('AR ended', 'info')); } catch (e) { log('AR failed: ' + e.message, 'error'); }
    };
    btns.appendChild(arBtn);
  }).catch(() => {});
}

/* ═══════ AI CHAT ═══════ */

let chatHistory = [];
function initAIChat() {
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  const chatRow = document.createElement('div'); chatRow.className = 'chat-input-row';
  chatRow.innerHTML = '<input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." /><button id="chatSendBtn" class="btn-sm primary">🤖</button>';
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  const send = () => {
    const input = $('chatInput'); const msg = input.value.trim(); if (!msg) return; input.value = '';
    chatHistory.push({ role: 'user', content: msg }); log('You: ' + msg, 'tx');
    fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 150, system: 'Workshop-DIY robot. Be geeky, short.', messages: chatHistory.slice(-10) })
    }).then(r => r.json()).then(data => { const reply = data.content?.[0]?.text || '...'; chatHistory.push({ role: 'assistant', content: reply }); log('Bot: ' + reply, 'rx'); setPetState('happy'); }).catch(() => { log('Bot offline', 'error'); setPetState('sad'); });
  };
  $('chatSendBtn').onclick = send;
  $('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {} });
  handle.addEventListener('touchstart', e => { dragging = true; startX = e.touches[0].clientX; startW = panel.offsetWidth; e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', e => { if (!dragging) return; const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); }, { passive: true });
  document.addEventListener('touchend', () => { if (!dragging) return; dragging = false; });
  try { const saved = localStorage.getItem('wdiy-log-width'); if (saved) document.documentElement.style.setProperty('--log-width', saved); } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); if (sb) { const f = sb.querySelector(FOCUSABLE); if (f) f.focus(); } }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab'), contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tid = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const target = $(tid); if (target) target.classList.add('active'); }); });
}
function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id); if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE); if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
}

/* ═══════ RADAR SIMULATION ═══════ */

let radarRunning = false, radarAnimId = null, radarTime = 0;
const histData = new Array(60).fill(0);
const targets = [];
for (let i = 0; i < 7; i++) {
  targets.push({
    angle: Math.random() * Math.PI * 2,
    dist: 0.2 + Math.random() * 0.7,
    speed: (Math.random() - 0.5) * 0.002,
    rcs: 0.5 + Math.random() * 0.5,
    id: 'T' + (i + 1),
    detected: false
  });
}

/* ═══════ CANVAS: Main Radar ═══════ */

function drawRadar() {
  const c = $('radarCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 20;

  // Grid circles
  ctx.strokeStyle = 'rgba(0,255,120,.12)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * i / 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cross lines
  ctx.strokeStyle = 'rgba(0,255,120,.08)';
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();

  // Range labels
  ctx.fillStyle = 'rgba(0,255,120,.3)';
  ctx.font = '9px Orbitron';
  const precision = parseFloat($('precisionSlider').value);
  for (let i = 1; i <= 5; i++) {
    const range = (i * precision * 0.3).toFixed(1);
    ctx.fillText(range + 'm', cx + r * i / 5 - 20, cy - 4);
  }

  // Sweep line
  const sweepAngle = (radarTime * 0.03) % (Math.PI * 2);
  const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
  grad.addColorStop(0, 'rgba(0,255,120,.9)');
  grad.addColorStop(1, 'rgba(0,255,120,0)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
  ctx.stroke();

  // Afterglow
  for (let i = 0; i < 25; i++) {
    const a = sweepAngle - i * 0.012;
    const alpha = 0.25 * (1 - i / 25);
    ctx.strokeStyle = 'rgba(0,255,120,' + alpha + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }

  // Noise
  const noise = parseFloat($('noiseSlider').value) / 100;
  for (let i = 0; i < 20; i++) {
    const na = Math.random() * Math.PI * 2;
    const nd = Math.random() * r;
    ctx.fillStyle = 'rgba(0,255,120,' + (Math.random() * noise * 0.3) + ')';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(na) * nd, cy + Math.sin(na) * nd, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Targets
  const pulseRate = parseFloat($('pulseRateSlider').value);
  for (const tgt of targets) {
    tgt.angle += tgt.speed;
    const angleDiff = Math.abs(((sweepAngle - tgt.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));

    if (angleDiff < 0.15) {
      const tx = cx + Math.cos(tgt.angle) * tgt.dist * r + (Math.random() - 0.5) * noise * 8;
      const ty = cy + Math.sin(tgt.angle) * tgt.dist * r + (Math.random() - 0.5) * noise * 8;
      const brightness = (1 - angleDiff / 0.15) * tgt.rcs;

      // Target blip
      ctx.fillStyle = 'rgba(0,255,120,' + brightness + ')';
      ctx.beginPath();
      ctx.arc(tx, ty, 3 + brightness * 5, 0, Math.PI * 2);
      ctx.fill();

      // Target glow
      ctx.fillStyle = 'rgba(0,255,120,' + (brightness * 0.3) + ')';
      ctx.beginPath();
      ctx.arc(tx, ty, 8 + brightness * 8, 0, Math.PI * 2);
      ctx.fill();

      // Target label
      ctx.fillStyle = 'rgba(0,255,120,' + brightness + ')';
      ctx.font = '8px Orbitron';
      ctx.fillText(tgt.id, tx + 10, ty - 5);

      // Detection log
      if (!tgt.detected && brightness > 0.5) {
        tgt.detected = true;
        const dist = (tgt.dist * precision * 1.5).toFixed(2);
        log(LANG[currentLang].targetDetected + ' ' + tgt.id + ' at ' + dist + 'm', 'tx');
        addTargetLog(tgt.id, dist, tgt.rcs);
      }
    } else {
      if (tgt.detected && angleDiff > Math.PI) tgt.detected = false;
    }
  }

  // Center dot
  ctx.fillStyle = 'rgba(0,255,120,.8)';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  // Info labels
  ctx.fillStyle = 'rgba(0,255,120,.5)';
  ctx.font = '10px Orbitron';
  ctx.fillText('PRF: ' + pulseRate + ' MHz', 10, 15);
  ctx.fillText('Precision: ' + precision + ' ns', 10, 28);
  ctx.fillText('t = ' + (radarTime * 0.016).toFixed(2) + 's', w - 100, 15);
  ctx.fillText('Sweep: ' + (sweepAngle * 180 / Math.PI).toFixed(0) + ' deg', w - 140, 28);
}

/* ═══════ CANVAS: Pulse Timing ═══════ */

function drawPulse() {
  const c = $('pulseCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(0,180,255,.15)';
  ctx.lineWidth = 1;
  for (let y = 0; y < h; y += 25) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  const rate = parseFloat($('pulseRateSlider').value);
  const noise = parseFloat($('noiseSlider').value) / 100;

  // Transmit pulse
  ctx.strokeStyle = '#00ff78';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const phase = (x / w * rate * 2 + radarTime * 0.05) % 1;
    const pulse = phase < 0.08 ? Math.sin(phase / 0.08 * Math.PI) : 0;
    const n = (Math.random() - 0.5) * noise * 0.4;
    const y = h / 4 - (pulse + n) * (h / 4 - 10);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Return echo
  ctx.strokeStyle = '#ff6633';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const delay = 0.15; // simulated round-trip delay
    const phase = ((x / w * rate * 2 + radarTime * 0.05) - delay + 10) % 1;
    const pulse = phase < 0.06 ? Math.sin(phase / 0.06 * Math.PI) * 0.4 : 0;
    const n = (Math.random() - 0.5) * noise * 0.6;
    const y = h * 3 / 4 - (pulse + n) * (h / 4 - 10);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = 'rgba(0,255,120,.5)';
  ctx.font = '9px Orbitron';
  ctx.fillText('TX PULSE', 5, 12);
  ctx.fillStyle = 'rgba(255,100,50,.5)';
  ctx.fillText('RX ECHO', 5, h / 2 + 12);
}

/* ═══════ CANVAS: Histogram ═══════ */

function drawHist() {
  const c = $('histCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  if (radarRunning) {
    histData.shift();
    histData.push(Math.random() * 0.6 + 0.2 + Math.sin(radarTime * 0.03) * 0.15);
  }

  const bw = w / histData.length;
  for (let i = 0; i < histData.length; i++) {
    const bh = histData[i] * (h - 25);
    const hue = 120 + histData[i] * 120;
    ctx.fillStyle = 'hsla(' + hue + ',80%,50%,.7)';
    ctx.fillRect(i * bw + 1, h - bh - 5, bw - 2, bh);
  }

  // Axis labels
  ctx.fillStyle = 'rgba(255,200,0,.5)';
  ctx.font = '9px Orbitron';
  ctx.fillText('ROUND-TRIP HISTOGRAM (ns)', 5, 12);

  // Average line
  const avg = histData.reduce((a, b) => a + b, 0) / histData.length;
  const avgY = h - avg * (h - 25) - 5;
  ctx.strokeStyle = 'rgba(255,255,0,.4)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, avgY); ctx.lineTo(w, avgY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,0,.5)';
  ctx.fillText('AVG: ' + (avg * 100).toFixed(1) + ' ns', w - 100, avgY - 4);
}

/* ═══════ INFO GRID ═══════ */

function updateInfo() {
  const g = $('infoGrid');
  if (!g) return;
  const precision = $('precisionSlider').value;
  const rate = $('pulseRateSlider').value;
  const detectedCount = targets.filter(t => t.detected).length;

  g.innerHTML = '<div class="info-card"><div class="big">' + rate + ' MHz</div><div class="sub">Pulse Rate</div></div>' +
    '<div class="info-card"><div class="big">' + precision + ' ns</div><div class="sub">Precision</div></div>' +
    '<div class="info-card"><div class="big">' + (precision * 0.3).toFixed(1) + ' cm</div><div class="sub">Resolution</div></div>' +
    '<div class="info-card"><div class="big">' + detectedCount + '/' + targets.length + '</div><div class="sub">Targets</div></div>' +
    '<div class="info-card"><div class="big">' + (radarRunning ? 'ACTIVE' : 'IDLE') + '</div><div class="sub">Status</div></div>' +
    '<div class="info-card"><div class="big">' + (radarTime * 0.016).toFixed(1) + 's</div><div class="sub">Elapsed</div></div>';
}

/* ═══════ TARGET LOG ═══════ */

function addTargetLog(id, dist, rcs) {
  const el = $('targetLog');
  if (!el) return;
  const line = document.createElement('div');
  line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + id + ' | Distance: ' + dist + 'm | RCS: ' + rcs.toFixed(2);
  el.appendChild(line);
  if (el.children.length > 30) el.removeChild(el.firstChild);
  el.scrollTop = el.scrollHeight;
}

/* ═══════ ANIMATION LOOP ═══════ */

function radarFrame() {
  if (!radarRunning) return;
  radarTime++;
  drawRadar();
  drawPulse();
  drawHist();
  updateInfo();
  radarAnimId = requestAnimationFrame(radarFrame);
}

/* ═══════ CONTROLS ═══════ */

function startRadar() {
  if (radarRunning) return;
  radarRunning = true;
  setStatus(true);
  log(LANG[currentLang].scanStarted, 'success');
  showToast(LANG[currentLang].scanStarted, 2000);
  radarFrame();
}

function stopRadar() {
  radarRunning = false;
  if (radarAnimId) cancelAnimationFrame(radarAnimId);
  setStatus(false);
  log(LANG[currentLang].scanStopped, 'info');
  hideToast();
}

function resetRadar() {
  stopRadar();
  radarTime = 0;
  histData.fill(0);
  targets.forEach(t => { t.detected = false; t.angle = Math.random() * Math.PI * 2; });

  // Clear canvases
  ['radarCanvas', 'pulseCanvas', 'histCanvas'].forEach(id => {
    const c = $(id); if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  });

  // Reset target log
  const tl = $('targetLog');
  if (tl) tl.innerHTML = 'Waiting for radar scan...';

  updateInfo();
  log(LANG[currentLang].scanReset, 'info');
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help
  $('helpBtn').onclick = openHelp; $('helpCloseBtn').onclick = closeHelp; $('helpOverlay').onclick = closeHelp;
  initHelpTabs();

  // Settings
  $('settingsBtn').onclick = openSettings; $('settingsCloseBtn').onclick = closeSettings; $('settingsOverlay').onclick = closeSettings;

  // Log panel
  $('logBtn').onclick = toggleLog; $('logCloseBtn').onclick = closeLog;
  initLogResize();

  // Sound
  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); });
  }

  // Whisper, Breathing, Music
  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = toggleWhisper;
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = toggleMusicMode;

  // Keys
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); if (e.key === 'Tab') trapFocus(e); });

  // Language & Theme
  $('langSelect').addEventListener('change', function() { setLanguage(this.value); });
  $('themeSelect').addEventListener('change', function() { setTheme(this.value); });

  // Restore preferences
  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}

  checkVersion();
  onAppMessage(msg => log('MSG: ' + msg.from + ': ' + msg.type, 'rx'));

  // Geeky features
  initKonami(); initMorseLog(); initMatrixTrigger(); initDebug(); initShakeReport(); initTimeTravel(); initHijriDate();

  // Magic features
  initGhostUsers(); initPixelPet(); initNightMode(); initLogoTracker(); initAR(); initAIChat();

  // Radar controls
  $('startBtn').onclick = startRadar;
  $('stopBtn').onclick = stopRadar;
  $('resetBtn').onclick = resetRadar;

  // Slider updates
  $('pulseRateSlider').oninput = e => $('pulseRateVal').textContent = e.target.value;
  $('precisionSlider').oninput = e => $('precisionVal').textContent = e.target.value;
  $('noiseSlider').oninput = e => $('noiseVal').textContent = e.target.value;

  // Initial draws
  drawRadar(); drawPulse(); drawHist(); updateInfo();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

/* ═══════ ADVANCED RADAR FEATURES ═══════ */

/* --- Doppler Shift Calculator --- */

const SPEED_OF_LIGHT = 299792458; // m/s

function calcDopplerShift(velocity, frequency) {
  // fd = 2 * v * f / c
  const fd = (2 * velocity * frequency * 1e6) / SPEED_OF_LIGHT;
  return fd;
}

function calcRangeFromTime(nanoseconds) {
  // distance = c * t / 2
  const meters = (SPEED_OF_LIGHT * nanoseconds * 1e-9) / 2;
  return meters;
}

function calcTimeFromRange(meters) {
  // t = 2 * d / c
  const ns = (2 * meters / SPEED_OF_LIGHT) * 1e9;
  return ns;
}

/* --- Signal-to-Noise Ratio --- */

function calcSNR(signalPower, noisePower) {
  if (noisePower <= 0) return Infinity;
  return 10 * Math.log10(signalPower / noisePower);
}

function calcDetectionProbability(snr, threshold) {
  // Simplified detection probability model
  if (snr <= 0) return 0;
  const pd = 1 - Math.exp(-snr / (2 * threshold));
  return Math.max(0, Math.min(1, pd));
}

/* --- Radar Cross Section Estimation --- */

function estimateRCS(targetType) {
  const rcsTable = {
    'aircraft': 5.0,
    'vehicle': 10.0,
    'person': 1.0,
    'bird': 0.01,
    'drone': 0.1,
    'ship': 100.0,
    'building': 1000.0,
    'rain': 0.001,
  };
  return rcsTable[targetType] || 1.0;
}

/* --- Pulse Repetition Interval --- */

function calcPRI(prf) {
  // PRI = 1 / PRF
  return 1 / (prf * 1e6); // in seconds
}

function calcMaxUnambiguousRange(prf) {
  // Rmax = c / (2 * PRF)
  return SPEED_OF_LIGHT / (2 * prf * 1e6);
}

function calcMaxUnambiguousVelocity(prf, wavelength) {
  // Vmax = lambda * PRF / 4
  return wavelength * prf * 1e6 / 4;
}

/* --- Clutter Map --- */

const clutterMap = new Array(360).fill(0);

function updateClutterMap() {
  for (let i = 0; i < 360; i++) {
    // Slowly decay existing clutter
    clutterMap[i] *= 0.995;
    // Add random clutter
    if (Math.random() < 0.01) {
      clutterMap[i] += Math.random() * 0.3;
    }
    clutterMap[i] = Math.min(1, clutterMap[i]);
  }
}

/* --- Track Manager --- */

const trackList = [];
let nextTrackId = 100;

function createTrack(target) {
  const track = {
    id: nextTrackId++,
    targetId: target.id,
    firstSeen: Date.now(),
    lastSeen: Date.now(),
    positions: [{ angle: target.angle, dist: target.dist, ts: Date.now() }],
    velocity: 0,
    heading: 0,
    quality: 1.0,
    state: 'tentative'
  };
  trackList.push(track);
  return track;
}

function updateTrack(track, target) {
  track.lastSeen = Date.now();
  track.positions.push({ angle: target.angle, dist: target.dist, ts: Date.now() });
  if (track.positions.length > 50) track.positions.shift();

  // Calculate velocity from position history
  if (track.positions.length >= 2) {
    const p1 = track.positions[track.positions.length - 2];
    const p2 = track.positions[track.positions.length - 1];
    const dt = (p2.ts - p1.ts) / 1000;
    if (dt > 0) {
      const dx = Math.cos(p2.angle) * p2.dist - Math.cos(p1.angle) * p1.dist;
      const dy = Math.sin(p2.angle) * p2.dist - Math.sin(p1.angle) * p1.dist;
      track.velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      track.heading = Math.atan2(dy, dx) * 180 / Math.PI;
    }
  }

  // Update track quality
  const age = (Date.now() - track.firstSeen) / 1000;
  const updates = track.positions.length;
  track.quality = Math.min(1, updates / 10) * Math.min(1, 5 / Math.max(1, age / updates));

  // State transitions
  if (track.state === 'tentative' && updates >= 3) {
    track.state = 'confirmed';
  }
  if (track.state === 'confirmed' && (Date.now() - track.lastSeen) > 5000) {
    track.state = 'lost';
  }
}

function pruneTrackList() {
  for (let i = trackList.length - 1; i >= 0; i--) {
    if (trackList[i].state === 'lost' && (Date.now() - trackList[i].lastSeen) > 15000) {
      trackList.splice(i, 1);
    }
  }
}

/* --- Waveform Generator --- */

function generateChirpWaveform(bandwidth, pulseWidth, numSamples) {
  const samples = new Float32Array(numSamples);
  const k = bandwidth / pulseWidth; // chirp rate
  for (let i = 0; i < numSamples; i++) {
    const t = (i / numSamples) * pulseWidth;
    const phase = 2 * Math.PI * (0.5 * k * t * t);
    samples[i] = Math.cos(phase);
  }
  return samples;
}

function generateBarkerCode(length) {
  const codes = {
    2: [1, -1],
    3: [1, 1, -1],
    5: [1, 1, 1, -1, 1],
    7: [1, 1, 1, -1, -1, 1, -1],
    11: [1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1],
    13: [1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1],
  };
  return codes[length] || codes[13];
}

/* --- Atmospheric Attenuation --- */

function calcAtmosphericLoss(frequencyGHz, rangeKm, humidity) {
  // Simplified ITU-R P.676 model
  const oxygenAbs = 0.001 * frequencyGHz * frequencyGHz;
  const waterAbs = 0.0001 * humidity * frequencyGHz;
  const totalAbs = (oxygenAbs + waterAbs) * rangeKm * 2; // round trip
  return totalAbs; // dB
}

/* --- Antenna Pattern --- */

function calcAntennaGain(theta, beamwidth) {
  // Simplified sinc-squared pattern
  const u = Math.sin(theta) / Math.sin(beamwidth / 2);
  if (Math.abs(u) < 0.001) return 1;
  const sinc = Math.sin(Math.PI * u) / (Math.PI * u);
  return sinc * sinc;
}

/* --- CFAR Detector --- */

function cfarDetect(data, guardCells, refCells, threshold) {
  const detections = [];
  const n = data.length;

  for (let i = guardCells + refCells; i < n - guardCells - refCells; i++) {
    let sum = 0;
    let count = 0;

    // Leading reference cells
    for (let j = i - guardCells - refCells; j < i - guardCells; j++) {
      sum += data[j];
      count++;
    }

    // Trailing reference cells
    for (let j = i + guardCells + 1; j <= i + guardCells + refCells; j++) {
      sum += data[j];
      count++;
    }

    const noiseEstimate = sum / count;
    if (data[i] > noiseEstimate * threshold) {
      detections.push({ index: i, value: data[i], noise: noiseEstimate });
    }
  }

  return detections;
}

/* --- Range-Doppler Map --- */

function generateRangeDopplerMap(rows, cols) {
  const map = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const noise = Math.random() * 0.1;
      let signal = 0;

      // Add some simulated targets
      for (const tgt of targets) {
        const rangeIdx = Math.floor(tgt.dist * rows);
        const dopplerIdx = Math.floor((tgt.speed * 1000 + 1) * cols / 2);
        const dr = Math.abs(r - rangeIdx);
        const dc = Math.abs(c - dopplerIdx);
        if (dr < 3 && dc < 3) {
          signal += tgt.rcs * Math.exp(-(dr * dr + dc * dc) / 4);
        }
      }

      row.push(noise + signal);
    }
    map.push(row);
  }
  return map;
}

/* --- Radar Equation --- */

function radarEquation(pt, gt, gr, lambda, sigma, range) {
  // Pr = (Pt * Gt * Gr * lambda^2 * sigma) / ((4*pi)^3 * R^4)
  if (range <= 0) return Infinity;
  const fourPiCubed = Math.pow(4 * Math.PI, 3);
  const pr = (pt * gt * gr * lambda * lambda * sigma) / (fourPiCubed * Math.pow(range, 4));
  return pr;
}

function radarEquationDB(ptDB, gtDB, grDB, lambdaM, sigmaDB, rangeM) {
  // In dB: Pr = Pt + Gt + Gr + 20*log10(lambda) + sigma - 30*log10(4*pi) - 40*log10(R)
  const pr = ptDB + gtDB + grDB + 20 * Math.log10(lambdaM) + sigmaDB
    - 30 * Math.log10(4 * Math.PI) - 40 * Math.log10(rangeM);
  return pr;
}

/* --- Coordinate Transforms --- */

function polarToCartesian(angle, distance) {
  return {
    x: distance * Math.cos(angle),
    y: distance * Math.sin(angle)
  };
}

function cartesianToPolar(x, y) {
  return {
    angle: Math.atan2(y, x),
    distance: Math.sqrt(x * x + y * y)
  };
}

function azElToXYZ(azimuth, elevation, range) {
  const cosEl = Math.cos(elevation);
  return {
    x: range * cosEl * Math.sin(azimuth),
    y: range * cosEl * Math.cos(azimuth),
    z: range * Math.sin(elevation)
  };
}

/* --- Noise Generation --- */

function gaussianRandom() {
  // Box-Muller transform
  let u1 = Math.random();
  let u2 = Math.random();
  while (u1 === 0) u1 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

function generateWhiteNoise(length, amplitude) {
  const noise = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    noise[i] = gaussianRandom() * amplitude;
  }
  return noise;
}

function generateColoredNoise(length, amplitude, alpha) {
  // Simple 1/f^alpha noise generation
  const white = generateWhiteNoise(length, 1);
  const colored = new Float32Array(length);
  colored[0] = white[0] * amplitude;
  for (let i = 1; i < length; i++) {
    colored[i] = alpha * colored[i - 1] + (1 - alpha) * white[i] * amplitude;
  }
  return colored;
}


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
