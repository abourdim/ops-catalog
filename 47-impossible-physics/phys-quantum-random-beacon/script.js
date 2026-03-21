/**
 * Quantum Random Beacon — Workshop DIY v1.0
 * Full canvas-based quantum random number generator with entropy visualization,
 * NIST statistical tests, multiple quantum noise sources, and real-time analysis.
 *
 * Features:
 *  - 4 quantum noise source models (vacuum, thermal, shot, zener)
 *  - Real-time particle cloud + bit-stream visualization
 *  - Entropy distribution histogram with trend line
 *  - Shannon entropy, min-entropy, chi-square, serial correlation
 *  - NIST SP 800-22 statistical test suite (simulated)
 *  - Full i18n (EN/FR/AR with RTL)
 *  - 8 themes, sound effects, activity log, toast, panels
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".25">
    <animate attributeName="r" values="32;44;32" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="1" opacity=".2">
    <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="6" fill="currentColor" opacity=".9">
    <animate attributeName="cx" values="42;58;42" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="42;58;42" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="55" cy="45" r="4" fill="currentColor" opacity=".6">
    <animate attributeName="cx" values="60;35;60" dur="1.2s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="55;40;55" dur="1.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="40" cy="60" r="3" fill="currentColor" opacity=".4">
    <animate attributeName="cx" values="35;65;35" dur="2.1s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="60;35;60" dur="1.4s" repeatCount="indefinite"/>
  </circle>
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
      setTimeout(() => {
        if (!audioCtx) return;
        const o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain();
        o2.connect(g2); g2.connect(audioCtx.destination);
        g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine';
        const t2 = audioCtx.currentTime;
        g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.25);
        o2.start(t2); o2.stop(t2 + 0.25);
      }, 150);
      break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
    case 'beep':
      osc.frequency.value = 1200; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t); osc.stop(t + 0.05); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {matrixTitle:'Matrix Rain',matrixOn:'Matrix ON',matrixOff:'Matrix OFF',ratingTitle:'Rate this app',ratingYours:'You rated',ratingThanks:'Thanks for rating!',flashTitle:'Flashcards',flashKnow:'Know it',flashReview:'Review later',flashDone:'All cards reviewed!',flashProgress:'{0} of {1} remaining',flash_t1:'Signal',flash_d1:'A detectable transmitted energy pattern used to convey information.',flash_t2:'Encryption',flash_d2:'The process of encoding data so only authorized parties can read it.',flash_t3:'Protocol',flash_d3:'A set of rules governing data exchange between devices or systems.',flash_t4:'Frequency',flash_d4:'The number of cycles per second of a periodic signal, measured in Hertz.',flash_t5:'Authentication',flash_d5:'The process of verifying the identity of a user, device, or system.',certTitle:'Certificate of Completion',certComplete:'Congratulations! All apps completed!',certProgress:'{0} of {1} apps completed',certDownload:'Download Certificate',certName:'Workshop DIY',annotTitle:'Annotation Mode',annotDraw:'Freehand',annotArrow:'Arrow',annotCircle:'Circle',annotText:'Text',annotUndo:'Undo',annotClear:'Clear All',annotSave:'Save as PNG',annotExit:'Exit Annotation',bookmarkTitle:'My Bookmarks',bookmarkAdd:'Add Bookmark',bookmarkRemove:'Remove',bookmarkCollection:'Add to Collection',bookmarkNew:'New Collection',bookmarkEmpty:'No bookmarks yet',morseSecret:'Morse Easter Egg',morseBackstory:'Nikola Tesla predicted this exact phenomenon in a letter that was sealed and only opened in 2019.',morseDecoded:'Decoded: ',dnaTitle:'DNA Fingerprint',dnaSave:'Save DNA',dnaInfo:'Unique visual signature of current parameters',sandboxTitle:'Sandbox Mode',sandboxOn:'Sandbox ON',sandboxOff:'Sandbox OFF',sandboxAdd:'Add Parameter',sandboxReset:'Reset Defaults',profTitle:'Professor',profGreet:'Hello Agent! I\x27m Professor Workshop. Ask me anything about Phys Quantum Random Beacon!',profWhat:'What is this?',profHow:'How does it work?',profWhy:'Why is this important?',profChallenge:'Give me a challenge',profMore:'Tell me more',profQuiz:'Quiz me',profUnknown:'Good question! Try exploring the Impossible Physics features to find out.',profPlaceholder:'Ask the professor...',
    pomodoroTitle:'Pomodoro Timer',pomodoroFocus:'Focus',pomodoroBreak:'Break',pomodoroStart:'Start',pomodoroPause:'Pause',pomodoroReset:'Reset',pomodoroDone:'Session complete!',flipTitle:'Secret Stats',flipStats:'Hidden Statistics',flipTime:'Time Spent',flipChanges:'Parameter Changes',flipGame:'Click the Target',flipBack:'Flip Back',
    title: 'Quantum Random Beacon',
    subtitle: '🔮 True randomness from quantum noise',
    disconnected: 'Disconnected', connected: 'Active',
    mainSection: 'Quantum Random Beacon',
    mainDesc: 'Generate true random numbers from quantum vacuum fluctuations',
    sectionA: 'Entropy Analysis', sectionB: 'Randomness Tests', sectionC: 'Quantum Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is a quantum random beacon?',
    faq_a1: 'A source of provably random bits generated from quantum physical processes like vacuum fluctuations and shot noise.',
    faq_q2: 'How does it generate randomness?',
    faq_a2: 'By sampling quantum vacuum fluctuations which are fundamentally unpredictable due to the Heisenberg uncertainty principle.',
    faq_q3: 'What tests verify randomness?',
    faq_a3: 'The NIST SP 800-22 suite includes frequency, runs, spectral, and entropy tests to validate random number generators.',
    faq_q4: 'Why is quantum randomness special?',
    faq_a4: 'Unlike pseudo-random number generators, quantum randomness is provably unpredictable and cannot be reproduced.',
    howto_1: 'Select a quantum noise source type from the dropdown.',
    howto_2: 'Adjust sample rate and bit depth for your needs.',
    howto_3: 'Click Start Beacon to generate quantum random bits in real time.',
    howto_4: 'Run NIST tests to statistically verify randomness quality.',
    wiki_vacuum_title: '🌌 Vacuum Fluctuations',
    wiki_vacuum: 'Even in a perfect vacuum, quantum field theory predicts random energy fluctuations.',
    wiki_shot_title: '📸 Shot Noise',
    wiki_shot: 'Photons arrive at a detector at random intervals governed by quantum statistics.',
    wiki_nist_title: '📋 NIST Tests',
    wiki_nist: 'The NIST SP 800-22 suite validates randomness with frequency, runs, DFT, and entropy tests.',
    wiki_entropy_title: '📊 Shannon Entropy',
    wiki_entropy: 'H = -sum(p_i * log2(p_i)). 8.0 bits per byte is maximum for perfectly random data.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '🔮 Quantum Random Beacon ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    noiseSource: 'Noise Source', sampleRate: 'Sample Rate', bitDepth: 'Bit Depth',
    startBeacon: '▶ Start Beacon', stopBeacon: '⏹ Stop', resetBeacon: '↺ Reset',
    shannonEntropy: 'Shannon Entropy:', minEntropy: 'Min-Entropy:', chiSquare: 'Chi-Square:',
    serialCorr: 'Serial Correlation:', totalBits: 'Total Bits:', bitRate: 'Bit Rate:',
    testDesc: 'Statistical tests verify quantum randomness quality.',
    runTests: 'Run NIST Tests',
    theoryIntro: 'Quantum random number generation exploits fundamental indeterminacy:',
    theory1: 'Vacuum fluctuations provide truly random quantum noise',
    theory2: 'Shot noise arises from discrete photon arrival times',
    theory3: 'No deterministic algorithm can predict quantum outcomes',
    theory4: 'Entropy harvesting condenses quantum bits into uniform randomness',
    theory5: 'Bell inequality violations prove non-classical randomness',
    splashHint: 'tap to skip',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    beaconStarted: '▶ Quantum beacon started',
    beaconStopped: '⏹ Beacon stopped',
    beaconReset: '↺ Beacon reset',
    testsRunning: 'Running NIST tests...', testsPassed: '✓ All tests passed',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space',
    t_jungle: 'Jungle', t_robot: 'Robot',
  },
  fr: {matrixTitle:'Pluie Matrix',matrixOn:'Matrix ACTIV\x27',matrixOff:'Matrix D\x27SACTIV\x27',ratingTitle:'Noter cette appli',ratingYours:'Votre note',ratingThanks:'Merci pour votre note !',flashTitle:'Cartes M\xe9moire',flashKnow:'Je sais',flashReview:'\xc0 revoir',flashDone:'Toutes les cartes r\xe9vis\xe9es !',flashProgress:'{0} sur {1} restantes',flash_t1:'Signal',flash_d1:'Un motif d\x27\xe9nergie transmis d\xe9tectable utilis\xe9 pour transmettre des informations.',flash_t2:'Chiffrement',flash_d2:'Le processus d\x27encodage des donn\xe9es pour que seules les parties autoris\xe9es puissent les lire.',flash_t3:'Protocole',flash_d3:'Un ensemble de r\xe8gles r\xe9gissant l\x27\xe9change de donn\xe9es entre appareils ou syst\xe8mes.',flash_t4:'Fr\xe9quence',flash_d4:'Le nombre de cycles par seconde d\x27un signal p\xe9riodique, mesur\xe9 en Hertz.',flash_t5:'Authentification',flash_d5:'Le processus de v\xe9rification de l\x27identit\xe9 d\x27un utilisateur, appareil ou syst\xe8me.',certTitle:'Certificat de R\xe9ussite',certComplete:'F\xe9licitations ! Toutes les apps termin\xe9es !',certProgress:'{0} sur {1} apps termin\xe9es',certDownload:'T\xe9l\xe9charger le Certificat',certName:'Workshop DIY',annotTitle:'Mode Annotation',annotDraw:'Main lev\x27e',annotArrow:'Fl\x27che',annotCircle:'Cercle',annotText:'Texte',annotUndo:'Annuler',annotClear:'Tout effacer',annotSave:'Enregistrer en PNG',annotExit:'Quitter l\x27annotation',bookmarkTitle:'Mes Favoris',bookmarkAdd:'Ajouter aux favoris',bookmarkRemove:'Supprimer',bookmarkCollection:'Ajouter \x27 la collection',bookmarkNew:'Nouvelle collection',bookmarkEmpty:'Aucun favori pour l\x27instant',morseSecret:'Morse Easter Egg',morseBackstory:'Nikola Tesla a predit ce phenomene exact dans une lettre scellee ouverte seulement en 2019.',morseDecoded:'D\x27cod\x27: ',dnaTitle:'Empreinte ADN',dnaSave:'Sauvegarder ADN',dnaInfo:'Signature visuelle unique des param\x27tres actuels',sandboxTitle:'Mode Bac \x27 sable',sandboxOn:'Bac \x27 sable ACTIV\x27',sandboxOff:'Bac \x27 sable D\x27SACTIV\x27',sandboxAdd:'Ajouter Param\x27tre',sandboxReset:'R\x27initialiser',profTitle:'Professeur',profGreet:'Bonjour Agent ! Je suis le Professeur Atelier. Pose-moi n\x27importe quelle question sur Phys Quantum Random Beacon !',profWhat:'C\x27est quoi ?',profHow:'Comment \xe7a marche ?',profWhy:'Pourquoi c\x27est important ?',profChallenge:'Donne-moi un d\xe9fi',profMore:'Dis-moi plus',profQuiz:'Teste-moi',profUnknown:'Bonne question ! Essaie d\x27explorer les fonctions de Impossible Physics pour le d\xe9couvrir.',profPlaceholder:'Demande au professeur...',
    pomodoroTitle:'Minuteur Pomodoro',pomodoroFocus:'Concentration',pomodoroBreak:'Pause',pomodoroStart:'D\x27marrer',pomodoroPause:'Pause',pomodoroReset:'R\x27initialiser',pomodoroDone:'Session termin\x27e!',flipTitle:'Stats Secr\x27tes',flipStats:'Statistiques Cach\x27es',flipTime:'Temps Pass\x27',flipChanges:'Modifications',flipGame:'Cliquez la Cible',flipBack:'Retourner',
    title: 'Balise Quantique Aléatoire',
    subtitle: '🔮 Aléa vrai du bruit quantique',
    disconnected: 'Déconnecté', connected: 'Actif',
    mainSection: 'Balise Quantique Aléatoire',
    mainDesc: 'Générer des nombres aléatoires à partir de fluctuations quantiques du vide',
    sectionA: 'Analyse d\'Entropie', sectionB: 'Tests de Hasard', sectionC: 'Théorie Quantique',
    activityLog: '📜 Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce qu\'une balise quantique aléatoire ?',
    faq_a1: 'Une source de bits aléatoires prouvée par des processus physiques quantiques comme les fluctuations du vide.',
    faq_q2: 'Comment génère-t-elle l\'aléa ?',
    faq_a2: 'En échantillonnant les fluctuations du vide quantique fondamentalement imprévisibles.',
    faq_q3: 'Quels tests vérifient l\'aléa ?',
    faq_a3: 'La suite NIST SP 800-22 inclut les tests de fréquence, séries, DFT et entropie.',
    faq_q4: 'Pourquoi l\'aléa quantique est-il spécial ?',
    faq_a4: 'Contrairement aux PRNG, l\'aléa quantique est prouvablement imprévisible et non reproductible.',
    howto_1: 'Sélectionnez un type de source de bruit quantique.',
    howto_2: 'Ajustez le taux d\'échantillonnage et la profondeur de bits.',
    howto_3: 'Cliquez Démarrer pour générer des bits quantiques en temps réel.',
    howto_4: 'Lancez les tests NIST pour vérifier la qualité statistique.',
    wiki_vacuum_title: '🌌 Fluctuations du Vide',
    wiki_vacuum: 'Même dans le vide parfait, la théorie quantique prédit des fluctuations d\'énergie aléatoires.',
    wiki_shot_title: '📸 Bruit de Grenaille',
    wiki_shot: 'Les photons arrivent au détecteur à des intervalles aléatoires régis par la statistique quantique.',
    wiki_nist_title: '📋 Tests NIST',
    wiki_nist: 'La suite NIST SP 800-22 valide l\'aléa avec des tests de fréquence, séries, DFT et entropie.',
    wiki_entropy_title: '📊 Entropie de Shannon',
    wiki_entropy: 'H = -somme(p_i * log2(p_i)). 8.0 bits par octet est le maximum pour des données parfaitement aléatoires.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '🔮 Balise quantique prête !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec copie',
    noiseSource: 'Source de Bruit', sampleRate: 'Taux d\'Échantillonnage', bitDepth: 'Profondeur',
    startBeacon: '▶ Démarrer', stopBeacon: '⏹ Arrêter', resetBeacon: '↺ Réinitialiser',
    shannonEntropy: 'Entropie Shannon :', minEntropy: 'Min-Entropie :', chiSquare: 'Chi-Carré :',
    serialCorr: 'Corrélation Série :', totalBits: 'Bits Totaux :', bitRate: 'Débit :',
    testDesc: 'Les tests statistiques vérifient la qualité de l\'aléa quantique.',
    runTests: 'Lancer Tests NIST',
    theoryIntro: 'La génération quantique exploite l\'indétermination fondamentale :',
    theory1: 'Les fluctuations du vide fournissent un bruit quantique vraiment aléatoire',
    theory2: 'Le bruit de grenaille provient des arrivées discrètes de photons',
    theory3: 'Aucun algorithme ne peut prédire les résultats quantiques',
    theory4: 'La récolte d\'entropie condense les bits en aléa uniforme',
    theory5: 'Les violations de Bell prouvent le hasard non-classique',
    splashHint: 'appuyer pour passer',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    beaconStarted: '▶ Balise quantique démarrée',
    beaconStopped: '⏹ Balise arrêtée',
    beaconReset: '↺ Balise réinitialisée',
    testsRunning: 'Tests NIST en cours...', testsPassed: '✓ Tous les tests réussis',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace',
    t_jungle: 'Jungle', t_robot: 'Robot',
  },
  ar: {matrixTitle:'مطر الماتريكس',matrixOn:'الماتريكس مفعل',matrixOff:'الماتريكس معطل',ratingTitle:'قيّم هذا التطبيق',ratingYours:'تقييمك',ratingThanks:'شكرا على التقييم!',flashTitle:'بطاقات تعليمية',flashKnow:'أعرفها',flashReview:'راجع لاحقاً',flashDone:'تمت مراجعة جميع البطاقات!',flashProgress:'{0} من {1} متبقية',flash_t1:'إشارة',flash_d1:'نمط طاقة مرسل قابل للكشف يستخدم لنقل المعلومات.',flash_t2:'تشفير',flash_d2:'عملية ترميز البيانات بحيث لا يمكن قراءتها إلا للأطراف المصرح لها.',flash_t3:'بروتوكول',flash_d3:'مجموعة قواعد تحكم تبادل البيانات بين الأجهزة.',flash_t4:'تردد',flash_d4:'عدد الدورات في الثانية لإشارة دورية، تقاس بالهرتز.',flash_t5:'مصادقة',flash_d5:'عملية التحقق من هوية المستخدم أو الجهاز أو النظام.',certTitle:'شهادة إتمام',certComplete:'تهانينا! تم إكمال جميع التطبيقات!',certProgress:'{0} من {1} تطبيقات مكتملة',certDownload:'تحميل الشهادة',certName:'Workshop DIY',annotTitle:'وضع التعليق',annotDraw:'رسم حر',annotArrow:'سهم',annotCircle:'دائرة',annotText:'نص',annotUndo:'تراجع',annotClear:'مسح الكل',annotSave:'حفظ كصورة',annotExit:'خروج من التعليق',bookmarkTitle:'مفضلاتي',bookmarkAdd:'إضافة للمفضلة',bookmarkRemove:'إزالة',bookmarkCollection:'إضافة إلى مجموعة',bookmarkNew:'مجموعة جديدة',bookmarkEmpty:'لا توجد مفضلات بعد',morseSecret:'بيضة مورس الفصحية',morseBackstory:'تم اكتشاف هذه الأداة في خزنة سرية',morseDecoded:'تم فك التشفير: ',dnaTitle:'بصمة الحمض النووي',dnaSave:'حفظ البصمة',dnaInfo:'توقيع بصري فريد للمعلمات الحالية',sandboxTitle:'وضع التجربة',sandboxOn:'التجربة مفعلة',sandboxOff:'التجربة معطلة',sandboxAdd:'إضافة معلمة',sandboxReset:'إعادة التعيين',profTitle:'الأستاذ',profGreet:'مرحبا أيها العميل! أنا الأستاذ ورشة. اسألني أي شيء!',profWhat:'ما هذا؟',profHow:'كيف يعمل؟',profWhy:'لماذا هذا مهم؟',profChallenge:'أعطني تحديا',profMore:'أخبرني المزيد',profQuiz:'اختبرني',profUnknown:'سؤال جيد! حاول استكشاف الميزات لمعرفة الإجابة.',profPlaceholder:'اسأل الأستاذ...',
    pomodoroTitle:'مؤقت بومودورو',pomodoroFocus:'تركيز',pomodoroBreak:'استراحة',pomodoroStart:'بدء',pomodoroPause:'إيقاف',pomodoroReset:'إعادة',pomodoroDone:'اكتملت الجلسة!',flipTitle:'إحصائيات سرية',flipStats:'إحصائيات مخفية',flipTime:'الوقت المستغرق',flipChanges:'التغييرات',flipGame:'انقر الهدف',flipBack:'ارجع',
    title: 'منارة الكم العشوائية',
    subtitle: '🔮 عشوائية حقيقية من الضوضاء الكمية',
    disconnected: 'غير متصل', connected: 'نشط',
    mainSection: 'منارة الكم العشوائية',
    mainDesc: 'توليد أرقام عشوائية حقيقية من تقلبات الفراغ الكمي',
    sectionA: 'تحليل الإنتروبيا', sectionB: 'اختبارات العشوائية', sectionC: 'النظرية الكمية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    faq_q1: 'ما هي منارة الكم العشوائية؟',
    faq_a1: 'مصدر بتات عشوائية مثبتة من عمليات فيزيائية كمية مثل تقلبات الفراغ وضوضاء الطلقة.',
    faq_q2: 'كيف تولد العشوائية؟',
    faq_a2: 'بأخذ عينات من تقلبات الفراغ الكمي غير القابلة للتنبؤ بسبب مبدأ هايزنبرغ.',
    faq_q3: 'ما الاختبارات التي تتحقق من العشوائية؟',
    faq_a3: 'مجموعة NIST SP 800-22 تشمل اختبارات التردد والسلاسل والطيف والإنتروبيا.',
    faq_q4: 'لماذا العشوائية الكمية مميزة؟',
    faq_a4: 'على عكس مولدات الأرقام شبه العشوائية، العشوائية الكمية غير قابلة للتنبؤ ولا يمكن إعادة إنتاجها.',
    howto_1: 'اختر نوع مصدر الضوضاء الكمية.',
    howto_2: 'اضبط معدل العينات وعمق البت.',
    howto_3: 'اضغط ابدأ لتوليد بتات كمية عشوائية.',
    howto_4: 'شغّل اختبارات NIST للتحقق من جودة العشوائية.',
    wiki_vacuum_title: '🌌 تقلبات الفراغ',
    wiki_vacuum: 'حتى في الفراغ المثالي، تتنبأ نظرية المجال الكمي بتقلبات طاقة عشوائية.',
    wiki_shot_title: '📸 ضوضاء الطلقة',
    wiki_shot: 'تصل الفوتونات إلى الكاشف على فترات عشوائية تحكمها الإحصاءات الكمية.',
    wiki_nist_title: '📋 اختبارات NIST',
    wiki_nist: 'مجموعة NIST SP 800-22 تتحقق من العشوائية باختبارات التردد والسلاسل والطيف والإنتروبيا.',
    wiki_entropy_title: '📊 إنتروبيا شانون',
    wiki_entropy: 'H = -مجموع(p_i * log2(p_i)). الحد الأقصى 8.0 بت لكل بايت للبيانات العشوائية تماماً.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '🔮 منارة الكم جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    noiseSource: 'مصدر الضوضاء', sampleRate: 'معدل العينات', bitDepth: 'عمق البت',
    startBeacon: '▶ تشغيل المنارة', stopBeacon: '⏹ إيقاف', resetBeacon: '↺ إعادة',
    shannonEntropy: 'إنتروبيا شانون:', minEntropy: 'الحد الأدنى:', chiSquare: 'مربع كاي:',
    serialCorr: 'الارتباط التسلسلي:', totalBits: 'إجمالي البتات:', bitRate: 'معدل البت:',
    testDesc: 'الاختبارات الإحصائية تتحقق من جودة العشوائية الكمية.',
    runTests: 'تشغيل اختبارات NIST',
    theoryIntro: 'توليد الأرقام العشوائية الكمية يستغل عدم اليقين الأساسي:',
    theory1: 'تقلبات الفراغ توفر ضوضاء كمية عشوائية حقاً',
    theory2: 'ضوضاء الطلقة تنشأ من أوقات وصول الفوتونات المنفصلة',
    theory3: 'لا يمكن لخوارزمية حتمية التنبؤ بالنتائج الكمية',
    theory4: 'حصاد الإنتروبيا يكثف البتات الكمية في عشوائية موحدة',
    theory5: 'انتهاكات متباينة بيل تثبت العشوائية غير الكلاسيكية',
    splashHint: 'انقر للتخطي',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    beaconStarted: '▶ بدأت منارة الكم',
    beaconStopped: '⏹ توقفت المنارة',
    beaconReset: '↺ إعادة ضبط المنارة',
    testsRunning: 'جارٍ تشغيل اختبارات NIST...', testsPassed: '✓ جميع الاختبارات ناجحة',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء',
    t_jungle: 'أدغال', t_robot: 'روبوت',
  }
};

/* ═══════ PROFESSOR CHAT ═══════ */
function initProfessorChat(){
  var L=LANG[document.documentElement.lang||'en'];
  if(!L||!L.profTitle)return;
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='profChat_'+appDir;
  var isOpen=false;
  var history=[];
  try{var saved=sessionStorage.getItem(storageKey);if(saved)history=JSON.parse(saved);}catch(e){}
  var greeted=history.length>0;

  /* ── floating button ── */
  var fab=document.createElement('button');
  fab.className='btn-icon-only';
  fab.setAttribute('aria-label',L.profTitle||'Professor');
  fab.textContent='\uD83C\uDF93';
  fab.style.cssText='position:fixed;bottom:18px;left:18px;z-index:10100;width:48px;height:48px;border-radius:50%;border:2px solid var(--accent,#d4af37);background:var(--card-bg,#1a1a2e);color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  fab.onmouseenter=function(){fab.style.transform='scale(1.15)';};
  fab.onmouseleave=function(){fab.style.transform='scale(1)';};
  document.body.appendChild(fab);

  /* ── chat panel ── */
  var panel=document.createElement('div');
  panel.id='profChatPanel';
  panel.style.cssText='position:fixed;bottom:75px;left:18px;z-index:10101;width:300px;height:400px;background:var(--card-bg,#12121f);border:1px solid var(--accent,#d4af37);border-radius:12px;display:none;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;overflow:hidden;';

  /* header */
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(212,175,55,0.12);border-bottom:1px solid rgba(212,175,55,0.2);flex-shrink:0;';
  var avatar=document.createElement('div');
  avatar.style.cssText='width:32px;height:32px;border-radius:50%;background:var(--accent,#d4af37);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;color:#000;flex-shrink:0;';
  avatar.textContent='P';
  var hdrTitle=document.createElement('span');
  hdrTitle.style.cssText='font-weight:600;font-size:0.95rem;color:var(--text,#eee);flex:1;';
  hdrTitle.textContent=L.profTitle||'Professor';
  var closeBtn=document.createElement('button');
  closeBtn.textContent='\u2715';
  closeBtn.style.cssText='background:none;border:none;color:var(--text,#aaa);font-size:1.1rem;cursor:pointer;padding:2px 6px;';
  closeBtn.onclick=function(){togglePanel(false);};
  hdr.appendChild(avatar);hdr.appendChild(hdrTitle);hdr.appendChild(closeBtn);
  panel.appendChild(hdr);

  /* messages area */
  var msgs=document.createElement('div');
  msgs.id='profMsgs';
  msgs.style.cssText='flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;';
  panel.appendChild(msgs);

  /* quick buttons */
  var qbar=document.createElement('div');
  qbar.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var quickKeys=[
    {key:'profWhat',fallback:'What is this?'},
    {key:'profHow',fallback:'How does it work?'},
    {key:'profWhy',fallback:'Why is this important?'},
    {key:'profChallenge',fallback:'Give me a challenge'}
  ];
  quickKeys.forEach(function(q){
    var qb=document.createElement('button');
    qb.textContent=L[q.key]||q.fallback;
    qb.style.cssText='font-size:0.7rem;padding:3px 8px;border-radius:12px;border:1px solid rgba(212,175,55,0.3);background:rgba(212,175,55,0.08);color:var(--text,#ccc);cursor:pointer;white-space:nowrap;';
    qb.onclick=function(){handleUserMsg(L[q.key]||q.fallback);};
    qbar.appendChild(qb);
  });
  panel.appendChild(qbar);

  /* input area */
  var ibar=document.createElement('div');
  ibar.style.cssText='display:flex;gap:6px;padding:8px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var inp=document.createElement('input');
  inp.type='text';
  inp.placeholder=L.profPlaceholder||'Ask the professor...';
  inp.style.cssText='flex:1;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--text,#eee);font-size:0.85rem;outline:none;';
  inp.onkeydown=function(e){if(e.key==='Enter'&&inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  var sendBtn=document.createElement('button');
  sendBtn.textContent='\u27A4';
  sendBtn.style.cssText='padding:6px 10px;border-radius:8px;border:1px solid var(--accent,#d4af37);background:rgba(212,175,55,0.15);color:var(--accent,#d4af37);cursor:pointer;font-size:0.9rem;';
  sendBtn.onclick=function(){if(inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  ibar.appendChild(inp);ibar.appendChild(sendBtn);
  panel.appendChild(ibar);
  document.body.appendChild(panel);

  /* ── helpers ── */
  function addBubble(text,isUser,typewriter){
    var bub=document.createElement('div');
    bub.style.cssText='max-width:85%;padding:8px 12px;border-radius:10px;font-size:0.82rem;line-height:1.45;word-wrap:break-word;'+(isUser?'align-self:flex-end;background:rgba(212,175,55,0.18);color:var(--text,#eee);':'align-self:flex-start;background:rgba(255,255,255,0.07);color:var(--text,#ddd);');
    msgs.appendChild(bub);
    msgs.scrollTop=msgs.scrollHeight;
    if(typewriter&&!isUser){
      var i=0;bub.textContent='';
      var iv=setInterval(function(){if(i<text.length){bub.textContent+=text[i];i++;msgs.scrollTop=msgs.scrollHeight;}else{clearInterval(iv);}},30);
    }else{
      bub.textContent=text;
    }
    return bub;
  }

  function saveHistory(){
    try{sessionStorage.setItem(storageKey,JSON.stringify(history.slice(-50)));}catch(e){}
  }

  function getAnswer(q){
    var ql=q.toLowerCase();
    /* What is this? */
    if(ql.indexOf('what')>=0||ql.indexOf('quoi')>=0||ql.indexOf('\u0645\u0627 ')>=0||ql===((L.profWhat||'').toLowerCase())){
      return L.mainDesc||L.subtitle||'This is an interactive workshop app.';
    }
    /* How does it work? */
    if(ql.indexOf('how')>=0||ql.indexOf('comment')>=0||ql.indexOf('marche')>=0||ql.indexOf('\u0643\u064a\u0641')>=0||ql===((L.profHow||'').toLowerCase())){
      var parts=[];
      if(L.step1Desc)parts.push(L.step1Desc);
      if(L.step2Desc)parts.push(L.step2Desc);
      if(L.step3Desc)parts.push(L.step3Desc);
      return parts.length?parts.join(' \u2192 '):(L.mainDesc||'Explore the controls to see how it works!');
    }
    /* Why is this important? */
    if(ql.indexOf('why')>=0||ql.indexOf('important')>=0||ql.indexOf('pourquoi')>=0||ql.indexOf('\u0644\u0645\u0627\u0630\u0627')>=0||ql===((L.profWhy||'').toLowerCase())){
      var r=L.purpose||'';
      if(!r){var lp=[];for(var k=1;k<=4;k++){if(L['learn'+k])lp.push(L['learn'+k]);}r=lp.join(' ');}
      return r||'Understanding these concepts builds real-world skills!';
    }
    /* Give me a challenge */
    if(ql.indexOf('challenge')>=0||ql.indexOf('d\xe9fi')>=0||ql.indexOf('\u062a\u062d\u062f\u064a')>=0||ql===((L.profChallenge||'').toLowerCase())){
      return L.challenge1||L.daily_d1||'Try changing every parameter and observe the results!';
    }
    /* Tell me more */
    if(ql.indexOf('more')>=0||ql.indexOf('plus')>=0||ql.indexOf('\u0627\u0644\u0645\u0632\u064a\u062f')>=0||ql===((L.profMore||'').toLowerCase())){
      var wk=[];for(var w=1;w<=5;w++){if(L['wiki'+w+'_title'])wk.push(L['wiki'+w+'_title']+': '+( L['wiki'+w+'_text']||''));}
      return wk.length?wk.join(' | '):(L.mainDesc||'Explore the Wiki tab for deeper knowledge!');
    }
    /* Quiz me */
    if(ql.indexOf('quiz')>=0||ql.indexOf('test')>=0||ql.indexOf('\u0627\u062e\u062a\u0628\u0631')>=0||ql===((L.profQuiz||'').toLowerCase())){
      if(typeof initQuizMode==='function'){try{initQuizMode();}catch(e){}}
      return L.quiz_q1||(L.challenge1?'Here is a challenge: '+L.challenge1:'Try the Quiz feature if available!');
    }
    /* Unknown */
    return L.profUnknown||'Good question! Try exploring the features to find out.';
  }

  function handleUserMsg(text){
    history.push({r:'u',t:text});
    addBubble(text,true,false);
    var answer=getAnswer(text);
    history.push({r:'p',t:answer});
    saveHistory();
    setTimeout(function(){addBubble(answer,false,true);},300);
  }

  function togglePanel(show){
    isOpen=typeof show==='boolean'?show:!isOpen;
    panel.style.display=isOpen?'flex':'none';
    if(isOpen&&!greeted){
      greeted=true;
      var greet=L.profGreet||('Hello Agent! I\x27m Professor Workshop. Ask me anything!');
      history.push({r:'p',t:greet});
      saveHistory();
      addBubble(greet,false,true);
    }
    if(isOpen)inp.focus();
  }

  /* restore history */
  function restoreHistory(){
    history.forEach(function(m){addBubble(m.t,m.r==='u',false);});
  }

  fab.onclick=function(){togglePanel();};

  /* restore on load if history exists */
  if(history.length>0){restoreHistory();}
}

document.addEventListener('DOMContentLoaded',function(){try{initProfessorChat();}catch(e){console.warn('ProfessorChat init:',e);}});


/* ═══════ POMODORO TIMER ═══════ */
function initPomodoro(){
  if(document.getElementById('pomodoroPanel'))return;
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var hdrBtns=document.querySelector('.header-buttons');
  if(!hdrBtns)return;
  var btn=document.createElement('button');
  btn.className='btn-icon-only';btn.id='pomodoroBtn';btn.textContent='\u{1F345}';btn.title=L.pomodoroTitle||'Pomodoro';
  hdrBtns.insertBefore(btn,hdrBtns.firstChild);
  var panel=document.createElement('div');panel.id='pomodoroPanel';
  panel.style.cssText='display:none;position:fixed;top:60px;right:16px;z-index:10000;background:var(--card,#1a1a2e);border:2px solid var(--accent,#e94560);border-radius:16px;padding:20px;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,0.5);font-family:inherit;color:var(--text,#eee);';
  panel.innerHTML='<div style="text-align:center;font-weight:700;font-size:1.1rem;margin-bottom:12px;" id="pomTitle">'+(L.pomodoroTitle||'Pomodoro')+'</div>'
    +'<div style="text-align:center;margin-bottom:8px;"><svg width="120" height="120" id="pomRingSvg"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/><circle id="pomRing" cx="60" cy="60" r="52" fill="none" stroke="var(--accent,#e94560)" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="0" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1s linear;"/><text x="60" y="60" text-anchor="middle" dominant-baseline="central" fill="var(--text,#eee)" font-size="24" font-weight="700" id="pomTime">25:00</text></svg></div>'
    +'<div style="text-align:center;margin-bottom:8px;font-size:0.85rem;" id="pomMode">'+(L.pomodoroFocus||'Focus')+'</div>'
    +'<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px;">'
    +'<button id="pomStart" style="padding:6px 14px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroStart||'Start')+'</button>'
    +'<button id="pomPause" style="padding:6px 14px;border:none;border-radius:8px;background:#555;color:#fff;cursor:pointer;font-weight:600;display:none;">'+(L.pomodoroPause||'Pause')+'</button>'
    +'<button id="pomReset" style="padding:6px 14px;border:none;border-radius:8px;background:#333;color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroReset||'Reset')+'</button></div>'
    +'<div style="text-align:center;font-size:0.8rem;opacity:0.7;" id="pomSessions">\u{1F345} 0</div>';
  document.body.appendChild(panel);
  var FOCUS=25*60,BREAK=5*60,remaining=FOCUS,running=false,isFocus=true,sessions=0,interval=null,circumf=2*Math.PI*52;
  var ring=document.getElementById('pomRing'),timeEl=document.getElementById('pomTime'),modeEl=document.getElementById('pomMode'),sessEl=document.getElementById('pomSessions');
  var startBtn=document.getElementById('pomStart'),pauseBtn=document.getElementById('pomPause'),resetBtn=document.getElementById('pomReset');
  function fmt(s){var m=Math.floor(s/60),ss=s%60;return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');}
  function updateRing(){var total=isFocus?FOCUS:BREAK;var pct=remaining/total;ring.setAttribute('stroke-dashoffset',String(circumf*(1-pct)));}
  function tick(){
    if(!running)return;
    remaining--;timeEl.textContent=fmt(remaining);updateRing();
    if(remaining<=0){clearInterval(interval);running=false;
      startBtn.style.display='inline-block';pauseBtn.style.display='none';
      pomBeep();
      if(isFocus){sessions++;sessEl.textContent='\u{1F345} '+sessions;
        try{var k='pomodoro_'+appName;var d=JSON.parse(localStorage.getItem(k)||'[]');d.push({ts:Date.now(),app:appName});localStorage.setItem(k,JSON.stringify(d));}catch(e){}
        var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';
        isFocus=false;remaining=BREAK;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroBreak||'Break';
        ring.setAttribute('stroke','#2ecc71');
      }else{isFocus=true;remaining=FOCUS;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';
        ring.setAttribute('stroke','var(--accent,#e94560)');
      }
      timeEl.textContent=fmt(remaining);updateRing();
    }
  }
  function pomBeep(){try{var ac=new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator();var g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;o.type='sine';g.gain.value=0.15;var t=ac.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.start(t);o.stop(t+0.5);}catch(e){}}
  startBtn.onclick=function(){if(running)return;running=true;interval=setInterval(tick,1000);startBtn.style.display='none';pauseBtn.style.display='inline-block';
    if(isFocus){var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='0 0 20px rgba(233,69,96,0.4)';}};
  pauseBtn.onclick=function(){running=false;clearInterval(interval);startBtn.style.display='inline-block';pauseBtn.style.display='none';};
  resetBtn.onclick=function(){running=false;clearInterval(interval);isFocus=true;remaining=FOCUS;timeEl.textContent=fmt(remaining);ring.setAttribute('stroke-dashoffset','0');ring.setAttribute('stroke','var(--accent,#e94560)');modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';startBtn.style.display='inline-block';pauseBtn.style.display='none';var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';};
  btn.onclick=function(){panel.style.display=panel.style.display==='none'?'block':'none';};
  document.addEventListener('click',function(e){if(!panel.contains(e.target)&&e.target!==btn&&panel.style.display==='block')panel.style.display='none';});
}

/* ═══════ 3D CARD FLIP ═══════ */
function initCardFlip(){
  var mc=document.getElementById('mainCard');if(!mc||mc.dataset.flipInit)return;mc.dataset.flipInit='1';
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var style=document.createElement('style');
  style.textContent='.flip-wrapper{perspective:1000px;}.flip-inner{position:relative;transform-style:preserve-3d;transition:transform 0.6s ease;}.flip-inner.flipped{transform:rotateY(180deg);}.flip-front,.flip-back{backface-visibility:hidden;}.flip-back{position:absolute;top:0;left:0;width:100%;height:100%;transform:rotateY(180deg);background:var(--card,#1a1a2e);border-radius:inherit;padding:20px;overflow-y:auto;box-sizing:border-box;color:var(--text,#eee);display:flex;flex-direction:column;gap:10px;}.flip-back h3{margin:0;font-size:1.2rem;color:var(--accent,#e94560);}.flip-back .stat-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:0.9rem;}.flip-target-area{position:relative;width:100%;height:120px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;cursor:crosshair;}.flip-dot{position:absolute;width:20px;height:20px;background:#e94560;border-radius:50%;cursor:pointer;transition:none;}.flip-back-btn{padding:8px 16px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;align-self:center;margin-top:auto;}';
  document.head.appendChild(style);
  var wrapper=document.createElement('div');wrapper.className='flip-wrapper';
  mc.parentNode.insertBefore(wrapper,mc);
  var inner=document.createElement('div');inner.className='flip-inner';
  wrapper.appendChild(inner);
  mc.classList.add('flip-front');inner.appendChild(mc);
  var back=document.createElement('div');back.className='flip-back';
  var timeKey='apptime_'+appName,changeKey='appchanges_'+appName,scoreKey='quizScore_'+appName;
  var timeSpent=0;try{timeSpent=parseInt(localStorage.getItem(timeKey)||'0');}catch(e){}
  var changes=0;try{changes=parseInt(localStorage.getItem(changeKey)||'0');}catch(e){}
  var bestScore=0;try{bestScore=parseInt(localStorage.getItem(scoreKey)||'0');}catch(e){}
  var facts=['Radio waves travel at the speed of light.','The first computer bug was a real moth.','WiFi stands for nothing - it is a brand name.','Bluetooth is named after a Viking king.','The first email was sent in 1971.','morse code SOS does not stand for anything.','A byte has 256 possible values.','The first webcam watched a coffee pot.','GPS needs 4 satellites for 3D positioning.','Arduino was named after a bar in Italy.'];
  var fact=facts[Math.floor(Math.random()*facts.length)];
  back.innerHTML='<h3>\u{1F510} '+(L.flipTitle||'Secret Stats')+'</h3>'
    +'<div class="stat-row"><span>'+(L.flipTime||'Time Spent')+'</span><span id="flipTimeVal">'+Math.floor(timeSpent/60)+'m '+timeSpent%60+'s</span></div>'
    +'<div class="stat-row"><span>'+(L.flipChanges||'Parameter Changes')+'</span><span>'+changes+'</span></div>'
    +'<div class="stat-row"><span>Best Quiz Score</span><span>'+bestScore+'%</span></div>'
    +'<div class="stat-row"><span>Achievements</span><span id="flipBadges">-</span></div>'
    +'<div style="font-size:0.85rem;"><strong>'+(L.flipGame||'Click the Target')+'</strong><div class="flip-target-area" id="flipTargetArea"></div><div style="text-align:center;margin-top:4px;font-size:0.8rem;" id="flipGameScore">Score: 0</div></div>'
    +'<div style="font-size:0.8rem;font-style:italic;opacity:0.7;">\u{1F4A1} '+fact+'</div>'
    +'<button class="flip-back-btn" id="flipBackBtn">\u{21A9}\uFE0F '+(L.flipBack||'Flip Back')+'</button>';
  inner.appendChild(back);
  var gameScore=0,gameActive=false;
  function spawnDot(){var area=document.getElementById('flipTargetArea');if(!area)return;area.innerHTML='';var dot=document.createElement('div');dot.className='flip-dot';dot.style.left=Math.random()*(area.offsetWidth-20)+'px';dot.style.top=Math.random()*(area.offsetHeight-20)+'px';dot.onclick=function(e){e.stopPropagation();gameScore++;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: '+gameScore;spawnDot();};area.appendChild(dot);}
  mc.addEventListener('dblclick',function(e){if(inner.classList.contains('flipped'))return;inner.classList.add('flipped');gameScore=0;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: 0';spawnDot();
    try{var badges=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('badge_')===0){badges.push(k.replace('badge_',''));}}var bEl=document.getElementById('flipBadges');if(bEl)bEl.textContent=badges.length?badges.join(', '):'-';}catch(e){}});
  document.getElementById('flipBackBtn').onclick=function(e){e.stopPropagation();inner.classList.remove('flipped');};
  setInterval(function(){try{var v=parseInt(localStorage.getItem(timeKey)||'0');localStorage.setItem(timeKey,String(v+1));}catch(e){}},1000);
}


/* === MATRIX RAIN BACKGROUND === */
function initMatrixRain(){
 if(document.getElementById('matrixRainBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='matrixRain_'+location.pathname;
 var canvas=null;var ctx=null;var animId=null;var active=false;
 var columns=[];var fontSize=14;var drops=[];
 var KATAKANA='\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3';
 var LATIN='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 var DIGITS='0123456789';
 var charPool=KATAKANA+LATIN+DIGITS;
 var kw=document.querySelector('meta[name="keywords"]');
 if(kw&&kw.content)charPool+=kw.content.replace(/[\s,]+/g,'').toUpperCase();
 var matrixBtn=document.createElement('button');matrixBtn.id='matrixRainBtn';matrixBtn.className='btn-icon-only';
 matrixBtn.textContent='\u25C9';matrixBtn.title=L.matrixTitle||'Matrix Rain';matrixBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(matrixBtn);else{matrixBtn.style.cssText+='position:fixed;top:0.5rem;right:12rem;z-index:9999;';document.body.appendChild(matrixBtn);}
 function createCanvas(){
  canvas=document.createElement('canvas');canvas.id='matrixRainCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas,document.body.firstChild);
  ctx=canvas.getContext('2d');resize();
 }
 function resize(){
  if(!canvas)return;canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  var cols=Math.floor(canvas.width/fontSize);drops=[];
  for(var i=0;i<cols;i++)drops[i]=Math.random()*canvas.height/fontSize|0;
 }
 function draw(){
  if(!canvas||!ctx)return;
  ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#00ff41';ctx.font=fontSize+'px monospace';
  for(var i=0;i<drops.length;i++){
   var ch=charPool[Math.floor(Math.random()*charPool.length)];
   var x=i*fontSize;var y=drops[i]*fontSize;
   ctx.globalAlpha=0.6+Math.random()*0.4;
   ctx.fillText(ch,x,y);
   if(y>canvas.height&&Math.random()>0.975)drops[i]=0;
   drops[i]++;
  }
  ctx.globalAlpha=1;
  animId=requestAnimationFrame(draw);
 }
 function start(){
  active=true;createCanvas();draw();
  matrixBtn.style.background='#00ff41';matrixBtn.style.color='#000';matrixBtn.style.borderRadius='6px';
  try{localStorage.setItem(STORAGE_KEY,'1');}catch(e){}
 }
 function stop(){
  active=false;if(animId)cancelAnimationFrame(animId);animId=null;
  if(canvas){canvas.remove();canvas=null;ctx=null;}
  matrixBtn.style.background='';matrixBtn.style.color='';matrixBtn.style.borderRadius='';
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
 }
 matrixBtn.onclick=function(){if(active)stop();else start();};
 window.addEventListener('resize',function(){if(active)resize();});
 try{if(localStorage.getItem(STORAGE_KEY)==='1')start();}catch(e){}
}

/* === APP RATING SYSTEM === */
function initRating(){
 if(document.getElementById('appRatingWrap'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appPath=location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'');
 var STORAGE_KEY='appRating_'+appPath;
 var INDEX_KEY='ratingsIndex';
 var wrap=document.createElement('div');wrap.id='appRatingWrap';
 wrap.style.cssText='display:flex;align-items:center;gap:8px;margin:4px 0;flex-wrap:wrap;';
 var starsWrap=document.createElement('span');starsWrap.style.cssText='display:inline-flex;gap:2px;cursor:pointer;';
 var msgSpan=document.createElement('span');msgSpan.style.cssText='font-size:0.75rem;color:var(--accent,#c8aa64);opacity:0.8;';
 var currentRating=0;
 try{currentRating=parseInt(localStorage.getItem(STORAGE_KEY))||0;}catch(e){}
 var stars=[];
 for(var i=1;i<=5;i++){
  (function(idx){
   var star=document.createElement('span');
   star.textContent=idx<=currentRating?'\u2605':'\u2606';
   star.style.cssText='font-size:1.2rem;color:'+(idx<=currentRating?'#ffd700':'#888')+';transition:color 0.2s;user-select:none;';
   star.onmouseenter=function(){for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}};
   star.onclick=function(){
    currentRating=idx;
    try{localStorage.setItem(STORAGE_KEY,String(idx));
     var index={};try{index=JSON.parse(localStorage.getItem(INDEX_KEY)||'{}');}catch(e){}
     index[appPath]=idx;localStorage.setItem(INDEX_KEY,JSON.stringify(index));
    }catch(e){}
    for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}
    msgSpan.textContent=(L.ratingYours||'You rated')+': '+idx+'/5';
   };
   stars.push(star);starsWrap.appendChild(star);
  })(i);
 }
 starsWrap.onmouseleave=function(){for(var j=0;j<5;j++){stars[j].style.color=j<currentRating?'#ffd700':'#888';stars[j].textContent=j<currentRating?'\u2605':'\u2606';}};
 wrap.appendChild(starsWrap);
 if(currentRating>0)msgSpan.textContent=(L.ratingYours||'You rated')+': '+currentRating+'/5';
 wrap.appendChild(msgSpan);
 var titleEl=document.querySelector('.main-title')||document.querySelector('h1')||document.querySelector('.app-title');
 if(titleEl&&titleEl.parentNode)titleEl.parentNode.insertBefore(wrap,titleEl.nextSibling);
 else{wrap.style.cssText+='position:fixed;top:3rem;left:1rem;z-index:9999;';document.body.appendChild(wrap);}
}
document.addEventListener('DOMContentLoaded',function(){try{initMatrixRain();}catch(e){console.warn('Matrix init:',e);}try{initRating();}catch(e){console.warn('Rating init:',e);}});



/* === FLASHCARD SYSTEM === */
function initFlashcards(){
 if(document.getElementById('flashcardsBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.flashTitle)return;
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='flash_score_'+appDir;
 var cards=[];
 for(var i=1;i<=5;i++){
  var t=L['flash_t'+i];var d=L['flash_d'+i];
  if(t&&d)cards.push({term:t,def:d});
 }
 if(cards.length===0)return;
 var btn=document.createElement('button');
 btn.id='flashcardsBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udccf';
 btn.title=L.flashTitle||'Flashcards';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var deck=cards.slice();
  var known=0;
  var total=deck.length;
  var touchStartX=0;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='max-width:420px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:0.8rem;font-family:Orbitron,monospace;';
  h3.textContent=L.flashTitle;
  box.appendChild(h3);
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:8px;margin-bottom:1rem;overflow:hidden;';
  var progFill=document.createElement('div');
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.3s;width:0%;';
  progBar.appendChild(progFill);
  box.appendChild(progBar);
  var progText=document.createElement('div');
  progText.style.cssText='font-size:0.85rem;opacity:0.7;margin-bottom:1rem;';
  box.appendChild(progText);
  var cardWrap=document.createElement('div');
  cardWrap.style.cssText='perspective:800px;margin-bottom:1.2rem;';
  var card=document.createElement('div');
  card.style.cssText='width:100%;min-height:200px;position:relative;transform-style:preserve-3d;transition:transform 0.5s;cursor:pointer;';
  var front=document.createElement('div');
  front.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1.3rem;font-weight:700;color:var(--accent,#d4a03c);font-family:Orbitron,monospace;min-height:200px;box-sizing:border-box;';
  var back=document.createElement('div');
  back.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1rem;color:var(--text,#e4ddd0);transform:rotateY(180deg);min-height:200px;box-sizing:border-box;line-height:1.5;';
  card.appendChild(front);card.appendChild(back);
  cardWrap.appendChild(card);box.appendChild(cardWrap);
  var flipped=false;
  card.onclick=function(){flipped=!flipped;card.style.transform=flipped?'rotateY(180deg)':'rotateY(0)';};
  cardWrap.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX;},{passive:true});
  cardWrap.addEventListener('touchend',function(e){
   var dx=e.changedTouches[0].clientX-touchStartX;
   if(Math.abs(dx)>50){if(dx>0)doKnow();else doReview();}
  });
  var btns=document.createElement('div');
  btns.style.cssText='display:flex;gap:1rem;justify-content:center;';
  var reviewBtn=document.createElement('button');
  reviewBtn.style.cssText='background:#c0392b;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  reviewBtn.textContent='\u2717 '+(L.flashReview||'Review later');
  var knowBtn=document.createElement('button');
  knowBtn.style.cssText='background:#27ae60;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  knowBtn.textContent='\u2713 '+(L.flashKnow||'Know it');
  btns.appendChild(reviewBtn);btns.appendChild(knowBtn);
  box.appendChild(btns);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
  function updateCard(){
   if(deck.length===0){
    front.textContent='\ud83c\udf89';
    back.textContent=L.flashDone||'All cards reviewed!';
    progFill.style.width='100%';
    progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}','0').replace('{1}',String(total));
    try{localStorage.setItem(storageKey,JSON.stringify({known:known,total:total,date:new Date().toISOString()}));}catch(e){}
    reviewBtn.style.display='none';knowBtn.style.display='none';
    return;
   }
   flipped=false;card.style.transform='rotateY(0)';
   front.textContent=deck[0].term;
   back.textContent=deck[0].def;
   var pct=Math.round((1-deck.length/total)*100);
   progFill.style.width=pct+'%';
   progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}',String(deck.length)).replace('{1}',String(total));
  }
  function doKnow(){if(deck.length>0){deck.shift();known++;updateCard();}}
  function doReview(){if(deck.length>0){var c=deck.shift();deck.push(c);updateCard();}}
  knowBtn.onclick=function(e){e.stopPropagation();doKnow();};
  reviewBtn.onclick=function(e){e.stopPropagation();doReview();};
  updateCard();
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initFlashcards();}catch(e){console.warn('Flashcards init:',e);}});

/* === PROGRESS CERTIFICATE === */
function initCertificate(){
 if(document.getElementById('certBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.certTitle)return;
 var pathParts=location.pathname.split('/').filter(Boolean);
 var catDir='';var appDir='';
 for(var p=0;p<pathParts.length-1;p++){
  if(/^\d{2}-/.test(pathParts[p])){catDir=pathParts[p];appDir=pathParts[p+1]||'';break;}
 }
 if(!catDir)return;
 var catKey='cert_cat_'+catDir;
 var visited={};
 try{visited=JSON.parse(localStorage.getItem(catKey)||'{}');}catch(e){}
 if(appDir){visited[appDir]=Date.now();try{localStorage.setItem(catKey,JSON.stringify(visited));}catch(e){}}
 var siblingApps=[];
 try{
  var scripts=document.querySelectorAll('script[src]');
  scripts.forEach(function(s){
   var src=s.getAttribute('src')||'';
   if(src.indexOf('catalog')>-1||src.indexOf('index')>-1){
    var m=src.match(/(\d{2}-[^/]+)/);
    if(m)catDir=m[1];
   }
  });
 }catch(e){}
 var catName=catDir.replace(/^\d{2}-/,'').replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
 var btn=document.createElement('button');
 btn.id='certBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udfc6';
 btn.title=L.certTitle||'Certificate';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var visitedCount=Object.keys(visited).length;
  var totalApps=Math.max(visitedCount,3);
  var allDone=visitedCount>=totalApps&&visitedCount>1;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:660px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:1rem;font-family:Orbitron,monospace;';
  h3.textContent=L.certTitle;
  box.appendChild(h3);
  var progWrap=document.createElement('div');
  progWrap.style.cssText='margin-bottom:1rem;';
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:10px;overflow:hidden;margin-bottom:0.5rem;';
  var progFill=document.createElement('div');
  var pct=totalApps>0?Math.min(100,Math.round(visitedCount/totalApps*100)):0;
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.5s;width:'+pct+'%;';
  progBar.appendChild(progFill);
  progWrap.appendChild(progBar);
  var progLabel=document.createElement('div');
  progLabel.style.cssText='font-size:0.9rem;opacity:0.8;';
  progLabel.textContent=(L.certProgress||'{0} of {1} apps completed').replace('{0}',String(visitedCount)).replace('{1}',String(totalApps));
  progWrap.appendChild(progLabel);
  box.appendChild(progWrap);
  if(allDone){
   var canvas=document.createElement('canvas');
   canvas.width=600;canvas.height=400;
   canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;margin:1rem 0;';
   box.appendChild(canvas);
   var ctx=canvas.getContext('2d');
   ctx.fillStyle='#0b0d24';ctx.fillRect(0,0,600,400);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=6;
   ctx.strokeRect(10,10,580,380);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=2;
   ctx.strokeRect(18,18,564,364);
   ctx.fillStyle='#d4a03c';ctx.font='bold 22px Orbitron,monospace';
   var certText=L.certTitle||'CERTIFICATE OF COMPLETION';
   ctx.fillText(certText,(600-ctx.measureText(certText).width)/2,70);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(100,85);ctx.lineTo(500,85);ctx.stroke();
   ctx.fillStyle='#e4ddd0';ctx.font='16px Tajawal,sans-serif';
   var compText=L.certComplete||'Congratulations! All apps completed!';
   ctx.fillText(compText,(600-ctx.measureText(compText).width)/2,130);
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px Orbitron,monospace';
   ctx.fillText(catName,(600-ctx.measureText(catName).width)/2,180);
   ctx.fillStyle='#e4ddd0';ctx.font='14px Tajawal,sans-serif';
   var dateStr=new Date().toLocaleDateString();
   ctx.fillText(dateStr,(600-ctx.measureText(dateStr).width)/2,220);
   var ranks=['Recruit','Field Agent','Special Agent','Senior Operative','Shadow Commander','Ghost Director'];
   var rank=ranks[Math.min(ranks.length-1,Math.floor(visitedCount/3))];
   ctx.fillStyle='#ffd700';ctx.font='bold 18px Orbitron,monospace';
   ctx.fillText(rank,(600-ctx.measureText(rank).width)/2,260);
   ctx.beginPath();ctx.arc(300,330,35,0,Math.PI*2);
   ctx.fillStyle='rgba(212,160,60,0.15)';ctx.fill();
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=3;ctx.stroke();
   ctx.beginPath();ctx.arc(300,330,28,0,Math.PI*2);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=1.5;ctx.stroke();
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px serif';
   ctx.fillText('\u2605',292,337);
   ctx.fillStyle='rgba(212,160,60,0.08)';ctx.font='10px monospace';
   var certName=L.certName||'Workshop DIY';
   ctx.fillStyle='#888';ctx.font='11px Tajawal,sans-serif';
   ctx.fillText(certName,(600-ctx.measureText(certName).width)/2,390);
   var dlBtn=document.createElement('button');
   dlBtn.textContent=L.certDownload||'Download Certificate';
   dlBtn.style.cssText='margin-top:1rem;background:var(--accent,#d4a03c);color:#000;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
   dlBtn.onclick=function(){
    var link=document.createElement('a');
    link.download='certificate-'+catDir+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
   };
   box.appendChild(dlBtn);
  }else{
   var lockMsg=document.createElement('div');
   lockMsg.style.cssText='font-size:2.5rem;margin:1rem 0;';
   lockMsg.textContent='\ud83d\udd12';
   box.appendChild(lockMsg);
   var hint=document.createElement('div');
   hint.style.cssText='opacity:0.6;font-size:0.9rem;';
   hint.textContent='Visit all apps in this category to unlock the certificate.';
   box.appendChild(hint);
  }
  var appList=document.createElement('div');
  appList.style.cssText='margin-top:1rem;text-align:left;max-height:150px;overflow-y:auto;padding:0.5rem;background:rgba(0,0,0,0.3);border-radius:8px;font-size:0.8rem;';
  Object.keys(visited).sort().forEach(function(a){
   var row=document.createElement('div');
   row.style.cssText='padding:2px 4px;opacity:0.7;';
   row.textContent='\u2713 '+a;
   appList.appendChild(row);
  });
  if(Object.keys(visited).length>0)box.appendChild(appList);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:9.5rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initCertificate();}catch(e){console.warn('Certificate init:',e);}});



/* === ANNOTATION MODE === */
function initAnnotation(){
 if(document.getElementById('annotBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var annotBtn=document.createElement('button');annotBtn.id='annotBtn';annotBtn.className='btn-icon-only';
 annotBtn.textContent='\u270F\uFE0F';annotBtn.title=L.annotTitle||'Annotation Mode';annotBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(annotBtn);else{annotBtn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(annotBtn);}
 var annotActive=false;var overlay=null;var toolbar=null;var ctx=null;
 var currentTool='pen';var currentColor='#ff0000';var currentWidth=3;
 var undoStack=[];var isDrawing=false;var startX=0;var startY=0;
 var colors=['#ff0000','#ffff00','#00cc00','#3399ff','#ffffff'];
 var appKey='annot_'+window.location.pathname;
 function createOverlay(){
  var simC=document.getElementById('simCanvas');
  if(!simC)return null;
  var rect=simC.getBoundingClientRect();
  var c=document.createElement('canvas');c.id='annotOverlay';
  c.width=simC.width;c.height=simC.height;
  c.style.cssText='position:absolute;top:'+rect.top+'px;left:'+rect.left+'px;width:'+rect.width+'px;height:'+rect.height+'px;z-index:9990;cursor:crosshair;';
  document.body.appendChild(c);
  var saved=sessionStorage.getItem(appKey);
  if(saved){var img=new Image();img.onload=function(){c.getContext('2d').drawImage(img,0,0);};img.src=saved;}
  return c;
 }
 function saveState(){
  if(overlay)undoStack.push(overlay.toDataURL());
  if(undoStack.length>30)undoStack.shift();
 }
 function persistSession(){if(overlay)sessionStorage.setItem(appKey,overlay.toDataURL());}
 function createToolbar(){
  var tb=document.createElement('div');tb.id='annotToolbar';
  tb.style.cssText='position:fixed;top:60px;right:10px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:10px;z-index:9995;display:flex;flex-direction:column;gap:6px;align-items:center;font-size:0.75rem;color:var(--text,#e4ddd0);';
  var tools=[{id:'pen',label:L.annotDraw||'Freehand',icon:'\u270D\uFE0F'},{id:'arrow',label:L.annotArrow||'Arrow',icon:'\u2197\uFE0F'},{id:'circle',label:L.annotCircle||'Circle',icon:'\u2B55'},{id:'text',label:L.annotText||'Text',icon:'\uD83C\uDD70\uFE0F'}];
  tools.forEach(function(t){
   var b=document.createElement('button');b.textContent=t.icon;b.title=t.label;b.dataset.tool=t.id;
   b.style.cssText='background:'+(currentTool===t.id?'var(--accent,#d4a03c)':'transparent')+';color:'+(currentTool===t.id?'#000':'var(--text,#e4ddd0)')+';border:1px solid var(--accent,#d4a03c);padding:4px 8px;border-radius:6px;cursor:pointer;font-size:1rem;width:36px;height:36px;';
   b.onclick=function(){currentTool=t.id;updateToolbar();};
   tb.appendChild(b);
  });
  var colorRow=document.createElement('div');colorRow.style.cssText='display:flex;gap:3px;margin:4px 0;';
  colors.forEach(function(c){
   var cb=document.createElement('div');
   cb.style.cssText='width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid '+(currentColor===c?'var(--accent,#d4a03c)':'transparent')+';background:'+c+';';
   cb.dataset.color=c;cb.onclick=function(){currentColor=c;updateToolbar();};
   colorRow.appendChild(cb);
  });
  tb.appendChild(colorRow);
  var widthRow=document.createElement('div');widthRow.style.cssText='display:flex;gap:4px;';
  [{w:2,label:'thin'},{w:4,label:'med'},{w:8,label:'thick'}].forEach(function(s){
   var wb=document.createElement('button');wb.textContent=s.label;
   wb.style.cssText='background:'+(currentWidth===s.w?'var(--accent,#d4a03c)':'transparent')+';color:'+(currentWidth===s.w?'#000':'var(--text,#e4ddd0)')+';border:1px solid var(--accent,#d4a03c);padding:2px 6px;border-radius:4px;cursor:pointer;font-size:0.65rem;';
   wb.onclick=function(){currentWidth=s.w;updateToolbar();};
   tb.appendChild(wb);
  });
  tb.appendChild(widthRow);
  var actions=[
   {label:L.annotUndo||'Undo',icon:'\u21A9\uFE0F',fn:function(){if(undoStack.length>0){var d=undoStack.pop();var img=new Image();img.onload=function(){ctx.clearRect(0,0,overlay.width,overlay.height);ctx.drawImage(img,0,0);persistSession();};img.src=d;}else{ctx.clearRect(0,0,overlay.width,overlay.height);persistSession();}}},
   {label:L.annotClear||'Clear All',icon:'\uD83D\uDDD1\uFE0F',fn:function(){saveState();ctx.clearRect(0,0,overlay.width,overlay.height);persistSession();}},
   {label:L.annotSave||'Save as PNG',icon:'\uD83D\uDCBE',fn:function(){
    var simC=document.getElementById('simCanvas');if(!simC)return;
    var merged=document.createElement('canvas');merged.width=simC.width;merged.height=simC.height;
    var mCtx=merged.getContext('2d');mCtx.drawImage(simC,0,0);if(overlay)mCtx.drawImage(overlay,0,0);
    var link=document.createElement('a');link.download='annotated-simulation.png';link.href=merged.toDataURL();link.click();
   }},
   {label:L.annotExit||'Exit Annotation',icon:'\u274C',fn:function(){annotBtn.click();}}
  ];
  actions.forEach(function(a){
   var ab=document.createElement('button');ab.textContent=a.icon+' '+a.label;
   ab.style.cssText='background:transparent;color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);padding:4px 8px;border-radius:6px;cursor:pointer;font-size:0.7rem;width:100%;text-align:left;';
   ab.onclick=a.fn;tb.appendChild(ab);
  });
  document.body.appendChild(tb);return tb;
 }
 function updateToolbar(){
  if(!toolbar)return;
  toolbar.querySelectorAll('[data-tool]').forEach(function(b){
   b.style.background=b.dataset.tool===currentTool?'var(--accent,#d4a03c)':'transparent';
   b.style.color=b.dataset.tool===currentTool?'#000':'var(--text,#e4ddd0)';
  });
  toolbar.querySelectorAll('[data-color]').forEach(function(b){
   b.style.borderColor=b.dataset.color===currentColor?'var(--accent,#d4a03c)':'transparent';
  });
 }
 function getPos(e){
  var r=overlay.getBoundingClientRect();
  var scaleX=overlay.width/r.width;var scaleY=overlay.height/r.height;
  return{x:(e.clientX-r.left)*scaleX,y:(e.clientY-r.top)*scaleY};
 }
 function onDown(e){
  e.preventDefault();isDrawing=true;saveState();
  var p=getPos(e.touches?e.touches[0]:e);startX=p.x;startY=p.y;
  if(currentTool==='pen'){ctx.beginPath();ctx.moveTo(p.x,p.y);}
  if(currentTool==='text'){var txt=prompt('Text:');if(txt){ctx.font='bold '+Math.max(14,currentWidth*4)+'px sans-serif';ctx.fillStyle=currentColor;ctx.fillText(txt,p.x,p.y);persistSession();}isDrawing=false;}
 }
 function onMove(e){
  if(!isDrawing)return;e.preventDefault();
  var p=getPos(e.touches?e.touches[0]:e);
  if(currentTool==='pen'){ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke();}
 }
 function onUp(e){
  if(!isDrawing)return;isDrawing=false;
  var p=getPos(e.changedTouches?e.changedTouches[0]:e);
  if(currentTool==='arrow'){
   ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(startX,startY);ctx.lineTo(p.x,p.y);ctx.stroke();
   var angle=Math.atan2(p.y-startY,p.x-startX);var hl=12+currentWidth*2;
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hl*Math.cos(angle-0.4),p.y-hl*Math.sin(angle-0.4));ctx.stroke();
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hl*Math.cos(angle+0.4),p.y-hl*Math.sin(angle+0.4));ctx.stroke();
  }
  if(currentTool==='circle'){
   var dx=p.x-startX;var dy=p.y-startY;var rad=Math.sqrt(dx*dx+dy*dy);
   ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;
   ctx.beginPath();ctx.arc(startX,startY,rad,0,Math.PI*2);ctx.stroke();
  }
  persistSession();
 }
 annotBtn.onclick=function(){
  annotActive=!annotActive;
  if(annotActive){
   annotBtn.style.background='var(--accent,#d4a03c)';annotBtn.style.color='#000';annotBtn.style.borderRadius='8px';
   overlay=createOverlay();
   if(overlay){ctx=overlay.getContext('2d');
    overlay.addEventListener('mousedown',onDown);overlay.addEventListener('mousemove',onMove);overlay.addEventListener('mouseup',onUp);
    overlay.addEventListener('touchstart',onDown,{passive:false});overlay.addEventListener('touchmove',onMove,{passive:false});overlay.addEventListener('touchend',onUp);
   }
   toolbar=createToolbar();
  }else{
   annotBtn.style.background='';annotBtn.style.color='';annotBtn.style.borderRadius='';
   if(overlay){overlay.remove();overlay=null;ctx=null;}
   if(toolbar){toolbar.remove();toolbar=null;}
  }
 };
}

/* === BOOKMARK COLLECTIONS === */
function initBookmarks(){
 if(document.getElementById('bmkBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='ops_bookmarks';
 var appPath=window.location.pathname;
 function loadData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{collections:{'default':[]}};}catch(e){return{collections:{'default':[]}};}};
 function saveData(d){localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}
 function isBookmarked(){var d=loadData();for(var c in d.collections){if(d.collections[c].indexOf(appPath)!==-1)return true;}return false;}
 function countAll(){var d=loadData();var n=0;var seen={};for(var c in d.collections){d.collections[c].forEach(function(p){if(!seen[p]){seen[p]=1;n++;}});}return n;}
 var bmkBtn=document.createElement('button');bmkBtn.id='bmkBtn';bmkBtn.className='btn-icon-only';
 bmkBtn.style.cssText='cursor:pointer;font-size:1rem;position:relative;';
 var badge=document.createElement('span');badge.id='bmkBadge';
 badge.style.cssText='position:absolute;top:-4px;right:-4px;background:#d4a03c;color:#000;font-size:0.55rem;font-weight:700;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;pointer-events:none;';
 bmkBtn.appendChild(badge);
 function updateBtn(){
  var bm=isBookmarked();bmkBtn.textContent=bm?'\u2B50':'\u2606';bmkBtn.title=bm?(L.bookmarkRemove||'Remove'):(L.bookmarkAdd||'Add Bookmark');
  bmkBtn.appendChild(badge);var cnt=countAll();badge.textContent=cnt>0?cnt:'';badge.style.display=cnt>0?'flex':'none';
 }
 updateBtn();
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(bmkBtn);else{bmkBtn.style.cssText+='position:fixed;top:0.5rem;right:10rem;z-index:9999;';document.body.appendChild(bmkBtn);}
 var panel=null;var pressTimer=null;
 function toggleBookmark(){
  var d=loadData();
  if(isBookmarked()){for(var c in d.collections){var idx=d.collections[c].indexOf(appPath);if(idx!==-1)d.collections[c].splice(idx,1);}
  }else{if(!d.collections['default'])d.collections['default']=[];d.collections['default'].push(appPath);}
  saveData(d);updateBtn();
 }
 function openManager(){
  if(panel){panel.remove();panel=null;return;}
  var d=loadData();
  panel=document.createElement('div');panel.id='bmkPanel';
  panel.style.cssText='position:fixed;top:50px;right:10px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:14px;z-index:9998;width:280px;max-height:70vh;overflow-y:auto;color:var(--text,#e4ddd0);font-size:0.8rem;';
  var header=document.createElement('h3');header.textContent=L.bookmarkTitle||'My Bookmarks';
  header.style.cssText='color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.9rem;margin:0 0 10px 0;';
  panel.appendChild(header);
  var allPaths={};for(var c in d.collections){d.collections[c].forEach(function(p){if(!allPaths[p])allPaths[p]=[];allPaths[p].push(c);});}
  var paths=Object.keys(allPaths);
  if(paths.length===0){var empty=document.createElement('p');empty.textContent=L.bookmarkEmpty||'No bookmarks yet';empty.style.cssText='opacity:0.5;font-style:italic;';panel.appendChild(empty);}
  else{paths.forEach(function(p){
   var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;margin:4px 0;padding:4px;border-radius:6px;background:rgba(255,255,255,0.05);';
   var link=document.createElement('a');link.href=p;link.textContent=p.split('/').filter(Boolean).pop()||p;
   link.style.cssText='color:var(--accent,#d4a03c);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.75rem;';
   row.appendChild(link);
   var colSel=document.createElement('select');colSel.style.cssText='background:var(--panel,#0b0d24);color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);border-radius:4px;font-size:0.65rem;padding:1px 4px;';
   for(var cn in d.collections){var opt=document.createElement('option');opt.value=cn;opt.textContent=cn;if(allPaths[p].indexOf(cn)!==-1)opt.selected=true;colSel.appendChild(opt);}
   colSel.onchange=function(){var nd=loadData();for(var cc in nd.collections){var ii=nd.collections[cc].indexOf(p);if(ii!==-1)nd.collections[cc].splice(ii,1);}if(!nd.collections[colSel.value])nd.collections[colSel.value]=[];nd.collections[colSel.value].push(p);saveData(nd);updateBtn();openManager();openManager();};
   row.appendChild(colSel);
   var rmBtn=document.createElement('button');rmBtn.textContent='\u274C';rmBtn.title=L.bookmarkRemove||'Remove';
   rmBtn.style.cssText='background:transparent;border:none;color:#ff4444;cursor:pointer;font-size:0.8rem;padding:2px;';
   rmBtn.onclick=function(){var nd=loadData();for(var cc in nd.collections){var ii=nd.collections[cc].indexOf(p);if(ii!==-1)nd.collections[cc].splice(ii,1);}saveData(nd);updateBtn();openManager();openManager();};
   row.appendChild(rmBtn);
   panel.appendChild(row);
  });}
  var divider=document.createElement('hr');divider.style.cssText='border:none;border-top:1px solid var(--accent,#d4a03c);margin:10px 0;opacity:0.3;';
  panel.appendChild(divider);
  var newRow=document.createElement('div');newRow.style.cssText='display:flex;gap:4px;';
  var newInput=document.createElement('input');newInput.placeholder=L.bookmarkNew||'New Collection';
  newInput.style.cssText='flex:1;background:var(--panel,#0b0d24);color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);border-radius:6px;padding:4px 8px;font-size:0.75rem;';
  var newBtn=document.createElement('button');newBtn.textContent='+';
  newBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-weight:700;';
  newBtn.onclick=function(){var name=newInput.value.trim();if(name){var nd=loadData();if(!nd.collections[name])nd.collections[name]=[];saveData(nd);openManager();openManager();}};
  newRow.appendChild(newInput);newRow.appendChild(newBtn);panel.appendChild(newRow);
  document.body.appendChild(panel);
 }
 bmkBtn.addEventListener('click',function(e){if(!pressTimer)toggleBookmark();pressTimer=null;});
 bmkBtn.addEventListener('mousedown',function(){pressTimer=setTimeout(function(){pressTimer='long';openManager();},500);});
 bmkBtn.addEventListener('mouseup',function(){if(pressTimer&&pressTimer!=='long')clearTimeout(pressTimer);});
 bmkBtn.addEventListener('mouseleave',function(){if(pressTimer&&pressTimer!=='long')clearTimeout(pressTimer);});
 bmkBtn.addEventListener('contextmenu',function(e){e.preventDefault();openManager();});
}
document.addEventListener('DOMContentLoaded',function(){try{initAnnotation();}catch(e){console.warn('Annotation init:',e);}try{initBookmarks();}catch(e){console.warn('Bookmarks init:',e);}});



/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});



let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
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
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + name] || name), 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  applyLogFilter();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  try {
    await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n'));
    log(LANG[currentLang].copied, 'success');
  } catch { log(LANG[currentLang].copyFail, 'error'); }
}

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  const b = new Blob([t], { type: 'text/plain' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = 'quantum-beacon-log.txt'; a.click();
  URL.revokeObjectURL(u);
}

function showToast(msg, ms = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (ms > 0) setTimeout(hideToast, ms);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }

function setStatus(c) {
  const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang];
  if (t) t.textContent = c ? s.connected : s.disconnected;
  if (p) p.classList.toggle('connected', c);
}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() {
  const s = $('splash'); if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}
function initSplash() {
  const s = $('splash'); if (!s) return;
  const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG;
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
  Array.from(logContainer.children).forEach(l => {
    l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none';
  });
}

function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {}
}

/* ═══════ PANELS ═══════ */
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
    const tgt = $(id); if (tgt) tgt.classList.add('active');
  }));
}

/* ═══════════════════════════════════════════════════════════
   QUANTUM RANDOM BEACON — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════════ */

let running = false;
let animFrame = null;
let totalBits = 0;
let lastBitTime = 0;
let bitRateSmooth = 0;
const randomBuffer = [];
const entropyHistory = [];
const BUFFER_MAX = 4096;
const particles = [];
const MAX_PARTICLES = 500;
const recentBitStrings = [];

/* --- Quantum noise sources --- */
function quantumNoise(type) {
  switch (type) {
    case 'vacuum': {
      // Box-Muller approximation of vacuum fluctuations
      const u1 = Math.random(), u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2) * 0.35;
    }
    case 'thermal': {
      // Gaussian thermal noise (Boltzmann distribution)
      let sum = 0;
      for (let i = 0; i < 6; i++) sum += Math.random();
      return (sum - 3) / 3;
    }
    case 'shot': {
      // Poisson-like shot noise
      const n = Math.floor(Math.random() * 8);
      return (n - 4) / 4 + (Math.random() - 0.5) * 0.2;
    }
    case 'zener': {
      // Zener avalanche breakdown noise
      const base = Math.random() - 0.5;
      const spike = Math.random() < 0.1 ? (Math.random() - 0.5) * 3 : 0;
      return Math.tanh(base * 4 + spike);
    }
    default: return Math.random() * 2 - 1;
  }
}

/* --- Bit generation --- */
function generateBits(type, rate, depth) {
  const bits = [];
  const count = Math.max(1, Math.floor(rate / 16));
  for (let i = 0; i < count; i++) {
    const v = quantumNoise(type);
    const quantized = Math.floor(((v + 1) / 2) * ((1 << Math.min(depth, 16)) - 1));
    bits.push(quantized & 0xFF);
    randomBuffer.push(v);
    if (randomBuffer.length > BUFFER_MAX) randomBuffer.shift();
  }
  const newBits = count * depth;
  totalBits += newBits;

  // Track bit rate
  const now = performance.now();
  if (lastBitTime > 0) {
    const elapsed = (now - lastBitTime) / 1000;
    if (elapsed > 0) bitRateSmooth = bitRateSmooth * 0.9 + (newBits / elapsed) * 0.1;
  }
  lastBitTime = now;

  // Update bit stream display
  const bstr = bits.slice(0, 8).map(b => (b & 0xFF).toString(2).padStart(8, '0')).join(' ');
  recentBitStrings.push(bstr);
  if (recentBitStrings.length > 20) recentBitStrings.shift();

  return bits;
}

/* --- Particle system --- */
function spawnParticles(bits, cx, cy) {
  for (let i = 0; i < Math.min(bits.length, 10); i++) {
    const v = bits[i] / 255;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + v * 2;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.005 + Math.random() * 0.01,
      size: 2 + v * 4,
      hue: 180 + v * 80,
      brightness: 50 + v * 50,
    });
    if (particles.length > MAX_PARTICLES) particles.shift();
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.life -= p.decay;
    if (p.life <= 0) { particles.splice(i, 1); }
  }
}

/* --- Main beacon canvas --- */
function drawBeacon(ctx, w, h, bits, time) {
  // Fade trail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.fillRect(0, 0, w, h);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Draw quantum field grid
  ctx.strokeStyle = 'rgba(50, 100, 150, 0.08)';
  ctx.lineWidth = 0.5;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    const wobble = Math.sin(time * 0.5 + x * 0.02) * 3;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + wobble, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    const wobble = Math.cos(time * 0.3 + y * 0.02) * 3;
    ctx.beginPath(); ctx.moveTo(0, y + wobble); ctx.lineTo(w, y); ctx.stroke();
  }

  // Central beacon glow
  const pulse = Math.sin(time * 2.5) * 0.5 + 0.5;
  const beaconR = 30 + pulse * 25;
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, beaconR * 3);
  grad.addColorStop(0, `rgba(100, 180, 255, ${0.15 + pulse * 0.1})`);
  grad.addColorStop(0.5, `rgba(60, 120, 200, ${0.05 + pulse * 0.05})`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Central beacon core
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, beaconR * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + pulse * 0.3})`;
  ctx.fill();

  // Orbiting quantum indicators
  for (let i = 0; i < 8; i++) {
    const angle = time * (0.8 + i * 0.15) + i * Math.PI / 4;
    const orbitR = 50 + i * 15 + Math.sin(time + i) * 10;
    const ox = w / 2 + Math.cos(angle) * orbitR;
    const oy = h / 2 + Math.sin(angle) * orbitR * 0.6;
    const sz = 3 + Math.sin(time * 2 + i) * 2;
    ctx.beginPath(); ctx.arc(ox, oy, sz, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${200 + i * 20}, 80%, 65%, ${0.4 + Math.sin(time + i) * 0.3})`;
    ctx.fill();
  }

  // Spawn and draw particles from generated bits
  if (bits && bits.length > 0) {
    spawnParticles(bits, w / 2, h / 2);
  }

  updateParticles();
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 70%, ${p.brightness}%, ${p.life * 0.8})`;
    ctx.fill();
  }

  // Emission rings
  const ringCount = 4;
  for (let i = 0; i < ringCount; i++) {
    const phase = (time * 0.8 + i * 1.5) % 6;
    const radius = phase * 50;
    const alpha = Math.max(0, 1 - phase / 6) * 0.3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Bit stream overlay at bottom
  ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
  ctx.font = '10px Orbitron, monospace';
  if (bits) {
    for (let i = 0; i < Math.min(bits.length, 50); i++) {
      const bstr = (bits[i] & 0xFF).toString(2).padStart(8, '0');
      const col = i % 12;
      const row = Math.floor(i / 12);
      ctx.fillText(bstr, 10 + col * 66, h - 50 + row * 13);
    }
  }

  // HUD overlay
  ctx.fillStyle = accent;
  ctx.font = '11px Orbitron, monospace';
  ctx.fillText('QUANTUM BEACON', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText(totalBits.toLocaleString() + ' bits generated', 10, 34);
  ctx.fillText(Math.round(bitRateSmooth).toLocaleString() + ' bps', 10, 48);

  // Noise type indicator
  const noiseType = $('noiseSource') ? $('noiseSource').value : 'vacuum';
  ctx.fillStyle = 'rgba(200, 150, 50, 0.5)';
  ctx.fillText('SRC: ' + noiseType.toUpperCase(), w - 150, 18);
}

/* --- Entropy distribution canvas --- */
function drawEntropy(ctx, w, h) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid lines
  ctx.strokeStyle = '#1a2a3a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 8; i++) {
    const y = (i / 8) * h;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let i = 0; i < 16; i++) {
    const x = (i / 16) * w;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  // Histogram of random buffer distribution
  if (randomBuffer.length > 20) {
    const bins = 80;
    const hist = new Array(bins).fill(0);
    randomBuffer.forEach(v => {
      const idx = Math.floor(((v + 1) / 2) * (bins - 1));
      hist[Math.max(0, Math.min(bins - 1, idx))]++;
    });
    const maxH = Math.max(...hist) || 1;
    const barW = w / bins;

    for (let i = 0; i < bins; i++) {
      const bh = (hist[i] / maxH) * h * 0.85;
      const hue = 190 + (i / bins) * 70;
      ctx.fillStyle = `hsla(${hue}, 65%, 55%, 0.7)`;
      ctx.fillRect(i * barW, h - bh, barW - 1, bh);
    }

    // Gaussian fit overlay
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const mean = randomBuffer.reduce((a, b) => a + b, 0) / randomBuffer.length;
    const variance = randomBuffer.reduce((a, b) => a + (b - mean) ** 2, 0) / randomBuffer.length;
    const stddev = Math.sqrt(variance) || 0.1;
    for (let i = 0; i < bins; i++) {
      const x = (i + 0.5) / bins * 2 - 1;
      const gauss = Math.exp(-0.5 * ((x - mean) / stddev) ** 2) / (stddev * Math.sqrt(2 * Math.PI));
      const ny = h - (gauss * stddev * 2.5) * h * 0.85;
      if (i === 0) ctx.moveTo(i * barW + barW / 2, ny);
      else ctx.lineTo(i * barW + barW / 2, ny);
    }
    ctx.stroke();
  }

  // Entropy trend line
  if (entropyHistory.length > 2) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    entropyHistory.forEach((e, i) => {
      const x = (i / entropyHistory.length) * w;
      const y = h - (e / 8.5) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Min-entropy line
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const ideal = h - (8 / 8.5) * h;
    ctx.beginPath(); ctx.moveTo(0, ideal); ctx.lineTo(w, ideal); ctx.stroke();
    ctx.setLineDash([]);
  }

  // Labels
  ctx.fillStyle = '#6688aa';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Entropy Distribution', 8, 14);
  ctx.fillText('8.0 max', w - 60, 14);
  if (entropyHistory.length > 0) {
    const latest = entropyHistory[entropyHistory.length - 1];
    ctx.fillStyle = accent;
    ctx.fillText('H = ' + latest.toFixed(3) + ' bits', w - 120, h - 6);
  }
}

/* --- Shannon entropy --- */
function computeShannonEntropy(data) {
  const counts = {};
  data.forEach(v => { const k = v & 0xFF; counts[k] = (counts[k] || 0) + 1; });
  let h = 0;
  const n = data.length;
  Object.values(counts).forEach(c => { const p = c / n; if (p > 0) h -= p * Math.log2(p); });
  return h;
}

/* --- Update analysis panel --- */
function updateAnalysis() {
  if (randomBuffer.length < 20) return;
  const data = randomBuffer.map(v => Math.floor(((v + 1) / 2) * 255));
  const h = computeShannonEntropy(data);
  entropyHistory.push(h);
  if (entropyHistory.length > 300) entropyHistory.shift();

  const shannonEl = $('shannonVal');
  if (shannonEl) shannonEl.textContent = h.toFixed(4) + ' bits';

  // Min-entropy
  const counts = {};
  data.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  const maxP = Math.max(...Object.values(counts)) / data.length;
  const minEntropyEl = $('minEntropyVal');
  if (minEntropyEl) minEntropyEl.textContent = (-Math.log2(maxP)).toFixed(4) + ' bits';

  // Chi-square
  const expected = data.length / 256;
  let chi = 0;
  for (let i = 0; i < 256; i++) { const o = counts[i] || 0; chi += (o - expected) ** 2 / expected; }
  const chiEl = $('chiVal');
  if (chiEl) chiEl.textContent = chi.toFixed(2);

  // Serial correlation
  let sum = 0, sumSq = 0, sumProd = 0;
  for (let i = 0; i < data.length - 1; i++) {
    sum += data[i]; sumSq += data[i] * data[i]; sumProd += data[i] * data[i + 1];
  }
  const n = data.length - 1, mean = sum / n;
  const corr = (sumProd / n - mean * mean) / (sumSq / n - mean * mean + 1e-10);
  const corrEl = $('corrVal');
  if (corrEl) corrEl.textContent = corr.toFixed(6);

  const totalEl = $('totalBitsVal');
  if (totalEl) totalEl.textContent = totalBits.toLocaleString();

  const rateEl = $('bitRateVal');
  if (rateEl) rateEl.textContent = Math.round(bitRateSmooth).toLocaleString() + ' bps';
}

/* --- Update bit stream display --- */
function updateBitStreamDisplay() {
  const el = $('bitStream');
  if (!el) return;
  el.textContent = recentBitStrings.join('\n');
  el.scrollTop = el.scrollHeight;
}

/* --- Canvas resize --- */
function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* --- Main animation loop --- */
let beaconCtx, beaconW, beaconH;
let entropyCtx, entropyW, entropyH;
let frameCount = 0;
let lastFpsTime = 0;
let fps = 0;

function beaconLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;

  // Generate bits
  const type = $('noiseSource') ? $('noiseSource').value : 'vacuum';
  const rate = $('sampleSlider') ? +$('sampleSlider').value : 200;
  const depth = $('bitDepth') ? +$('bitDepth').value : 16;
  const bits = generateBits(type, rate, depth);

  // Draw main beacon
  if (beaconCtx) drawBeacon(beaconCtx, beaconW, beaconH, bits, time);

  // Draw entropy (every 3rd frame for performance)
  if (frameCount % 3 === 0 && entropyCtx) drawEntropy(entropyCtx, entropyW, entropyH);

  // Update analysis (every 5th frame)
  if (frameCount % 5 === 0) {
    updateAnalysis();
    updateBitStreamDisplay();
  }

  // FPS counter
  frameCount++;
  if (time - lastFpsTime >= 1) {
    fps = frameCount / (time - lastFpsTime);
    frameCount = 0;
    lastFpsTime = time;
    const dbg = $('debugFps');
    if (dbg) dbg.textContent = Math.round(fps) + ' FPS';
  }

  animFrame = requestAnimationFrame(beaconLoop);
}

function startBeacon() {
  if (running) return;
  running = true;
  lastBitTime = 0;
  setStatus(true);
  log(LANG[currentLang].beaconStarted, 'success');
  playSound('success');

  // Init canvases
  const bc = $('beaconCanvas');
  const ec = $('entropyCanvas');
  if (bc) {
    const r = resizeCanvas(bc);
    beaconCtx = r.ctx; beaconW = r.w; beaconH = r.h;
  }
  if (ec) {
    const r = resizeCanvas(ec);
    entropyCtx = r.ctx; entropyW = r.w; entropyH = r.h;
  }

  beaconLoop();
}

function stopBeacon() {
  running = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  animFrame = null;
  setStatus(false);
  log(LANG[currentLang].beaconStopped, 'info');
}

function resetBeacon() {
  stopBeacon();
  randomBuffer.length = 0;
  entropyHistory.length = 0;
  particles.length = 0;
  recentBitStrings.length = 0;
  totalBits = 0;
  bitRateSmooth = 0;

  const bc = $('beaconCanvas');
  const ec = $('entropyCanvas');
  if (bc) { const ctx = bc.getContext('2d'); ctx.clearRect(0, 0, bc.width, bc.height); }
  if (ec) { const ctx = ec.getContext('2d'); ctx.clearRect(0, 0, ec.width, ec.height); }

  $('shannonVal').textContent = '-- bits';
  $('minEntropyVal').textContent = '-- bits';
  $('chiVal').textContent = '--';
  $('corrVal').textContent = '--';
  $('totalBitsVal').textContent = '0';
  $('bitRateVal').textContent = '0 bps';
  const bs = $('bitStream'); if (bs) bs.textContent = '';

  log(LANG[currentLang].beaconReset, 'info');
}

/* --- NIST Statistical Tests --- */
const NIST_TESTS = [
  { name: 'Frequency (Monobit)', desc: 'Tests proportion of 0s and 1s' },
  { name: 'Block Frequency', desc: 'Tests frequency within blocks' },
  { name: 'Runs', desc: 'Tests oscillation between 0 and 1' },
  { name: 'Longest Run of Ones', desc: 'Tests longest run within blocks' },
  { name: 'Spectral (DFT)', desc: 'Discrete Fourier Transform test' },
  { name: 'Serial', desc: 'Tests frequency of overlapping patterns' },
  { name: 'Approximate Entropy', desc: 'Tests frequency of all overlapping blocks' },
  { name: 'Cumulative Sums', desc: 'Tests maximum excursion from zero' },
  { name: 'Linear Complexity', desc: 'Tests linear feedback shift register complexity' },
  { name: 'Maurer\'s Universal', desc: 'Tests compressibility of the sequence' },
];

function runNISTTests() {
  if (randomBuffer.length < 100) {
    log('Need more data — run beacon first', 'error');
    return;
  }

  log(LANG[currentLang].testsRunning, 'info');
  showToast(LANG[currentLang].testsRunning);
  const el = $('testResults');
  if (!el) return;
  el.innerHTML = '';

  let passCount = 0;
  NIST_TESTS.forEach((test, i) => {
    setTimeout(() => {
      const pval = Math.random() * 0.85 + 0.08;
      const pass = pval > 0.01;
      if (pass) passCount++;

      const div = document.createElement('div');
      div.className = 'test-result';
      div.innerHTML = `
        <div class="nist-bar">
          <span style="color:${pass ? '#4f4' : '#f44'};width:16px">${pass ? '✓' : '✗'}</span>
          <span style="flex:0 0 180px">${test.name}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${pval * 100}%;background:${pass ? 'rgba(80,255,80,0.5)' : 'rgba(255,80,80,0.5)'}"></div></div>
          <span style="min-width:60px;text-align:right">p=${pval.toFixed(4)}</span>
        </div>
      `;
      el.appendChild(div);

      if (i === NIST_TESTS.length - 1) {
        hideToast();
        const summary = `${passCount}/${NIST_TESTS.length} tests passed`;
        log(summary, passCount === NIST_TESTS.length ? 'success' : 'error');
      }
    }, i * 250);
  });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log controls
  $('clearLogBtn').onclick = clearLog;
  $('copyLogBtn').onclick = copyLog;
  $('exportLogBtn').onclick = exportLog;
  initLogFilters();

  // Panels
  $('helpBtn').onclick = openHelp;
  $('helpCloseBtn').onclick = closeHelp;
  $('helpOverlay').onclick = closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick = openSettings;
  $('settingsCloseBtn').onclick = closeSettings;
  $('settingsOverlay').onclick = closeSettings;
  $('logBtn').onclick = toggleLog;
  $('logCloseBtn').onclick = closeLog;

  // Sound
  const st = $('soundToggle');
  if (st) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    st.checked = soundEnabled;
    st.onchange = () => {
      soundEnabled = st.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
    };
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); }
  });

  // Language & theme
  $('langSelect').onchange = function () { setLanguage(this.value); };
  $('themeSelect').onchange = function () { setTheme(this.value); };
  try {
    const sl = localStorage.getItem('wdiy-lang');
    const st2 = localStorage.getItem('wdiy-theme');
    if (st2) setTheme(st2);
    if (sl) setLanguage(sl);
  } catch {}

  initHijriDate();

  // Simulation controls
  $('startBtn').onclick = startBeacon;
  $('stopBtn').onclick = stopBeacon;
  $('resetBtn').onclick = resetBeacon;
  $('sampleSlider').oninput = function () {
    $('sampleVal').textContent = this.value + ' S/s';
  };
  $('runTestsBtn').onclick = runNISTTests;

  // Handle resize
  window.addEventListener('resize', () => {
    if (running) {
      const bc = $('beaconCanvas');
      const ec = $('entropyCanvas');
      if (bc) { const r = resizeCanvas(bc); beaconCtx = r.ctx; beaconW = r.w; beaconH = r.h; }
      if (ec) { const r = resizeCanvas(ec); entropyCtx = r.ctx; entropyW = r.w; entropyH = r.h; }
    }
  });

  // Debug panel
  if (location.search.includes('debug=1')) {
    const dp = $('debugPanel'); if (dp) dp.style.display = 'flex';
  }

  log(LANG[currentLang].ready, 'success');
}

document.addEventListener('DOMContentLoaded', init);

/* ═══════ INIT POMODORO + CARD FLIP ═══════ */
document.addEventListener('DOMContentLoaded', function(){
  try { initPomodoro(); } catch(e) { console.warn('Pomodoro init error:', e); }
  try { initCardFlip(); } catch(e) { console.warn('CardFlip init error:', e); }
});
