/**
 * Workshop DIY — Bio Body Antenna v1.0
 * Human body as 1.8 MHz antenna — impedance measurement
 * Self-contained: i18n · framework · simulation
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;

const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND EFFECTS ═══════ */

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

const LANG = {
  en: {matrixTitle:'Matrix Rain',matrixOn:'Matrix ON',matrixOff:'Matrix OFF',ratingTitle:'Rate this app',ratingYours:'You rated',ratingThanks:'Thanks for rating!',flashTitle:'Flashcards',flashKnow:'Know it',flashReview:'Review later',flashDone:'All cards reviewed!',flashProgress:'{0} of {1} remaining',flash_t1:'Signal',flash_d1:'A detectable transmitted energy pattern used to convey information.',flash_t2:'Encryption',flash_d2:'The process of encoding data so only authorized parties can read it.',flash_t3:'Protocol',flash_d3:'A set of rules governing data exchange between devices or systems.',flash_t4:'Frequency',flash_d4:'The number of cycles per second of a periodic signal, measured in Hertz.',flash_t5:'Authentication',flash_d5:'The process of verifying the identity of a user, device, or system.',certTitle:'Certificate of Completion',certComplete:'Congratulations! All apps completed!',certProgress:'{0} of {1} apps completed',certDownload:'Download Certificate',certName:'Workshop DIY',annotTitle:'Annotation Mode',annotDraw:'Freehand',annotArrow:'Arrow',annotCircle:'Circle',annotText:'Text',annotUndo:'Undo',annotClear:'Clear All',annotSave:'Save as PNG',annotExit:'Exit Annotation',bookmarkTitle:'My Bookmarks',bookmarkAdd:'Add Bookmark',bookmarkRemove:'Remove',bookmarkCollection:'Add to Collection',bookmarkNew:'New Collection',bookmarkEmpty:'No bookmarks yet',morseSecret:'Morse Easter Egg',morseBackstory:'A bioacoustics researcher in the Amazon discovered that certain tree frogs emit RF signatures. This tool was built to decode those bio-radio signals for covert jungle communication.',morseDecoded:'Decoded: ',dnaTitle:'DNA Fingerprint',dnaSave:'Save DNA',dnaInfo:'Unique visual signature of current parameters',sandboxTitle:'Sandbox Mode',sandboxOn:'Sandbox ON',sandboxOff:'Sandbox OFF',sandboxAdd:'Add Parameter',sandboxReset:'Reset Defaults',profTitle:'Professor',profGreet:'Hello Agent! I\x27m Professor Workshop. Ask me anything about Bio Body Antenna!',profWhat:'What is this?',profHow:'How does it work?',profWhy:'Why is this important?',profChallenge:'Give me a challenge',profMore:'Tell me more',profQuiz:'Quiz me',profUnknown:'Good question! Try exploring the Bio Radio features to find out.',profPlaceholder:'Ask the professor...',
    pomodoroTitle:'Pomodoro Timer',pomodoroFocus:'Focus',pomodoroBreak:'Break',pomodoroStart:'Start',pomodoroPause:'Pause',pomodoroReset:'Reset',pomodoroDone:'Session complete!',flipTitle:'Secret Stats',flipStats:'Hidden Statistics',flipTime:'Time Spent',flipChanges:'Parameter Changes',flipGame:'Click the Target',flipBack:'Flip Back',
    title: 'Bio Body Antenna',
    subtitle: 'Your body is a 1.8 MHz antenna',
    disconnected: 'Disconnected',
    connected: 'Connected',
    mainSection: 'Body Antenna — Impedance Measurement',
    mainDesc: 'Human body as 1.8 MHz receiving antenna with impedance analysis',
    sectionA: 'A — How It Works',
    sectionB: 'B — Live Spectrum',
    sectionC: 'C — Challenges',
    startScan: 'Start Scan',
    stopScan: 'Stop',
    touchBody: 'Touch Body',
    groundBtn: 'Ground',
    sweepBtn: 'Freq Sweep',
    statSWR: 'SWR',
    statGain: 'dBi',
    statZ: '\u2126 impedance',
    step1Title: 'Body as Antenna',
    step1Desc: 'The human body acts as a ~1.7m antenna, resonant near 1.8 MHz. micro:bit ADC measures the RF signal picked up.',
    step2Title: 'Impedance Probe',
    step2Desc: 'A simple bridge circuit measures body impedance — the complex resistance to RF signals at different frequencies.',
    step3Title: 'SWR Calculation',
    step3Desc: 'Standing Wave Ratio shows how well the body antenna is matched. SWR = 1.0 is perfect, higher means mismatch.',
    step4Title: 'Signal Detection',
    step4Desc: 'Touch detection changes the antenna pattern. Grounding improves reception. Nearby AM stations become audible!',
    ch1Title: 'Find the Resonance',
    ch1Desc: 'Use frequency sweep to find the exact frequency where your body has lowest SWR. Every person is different!',
    ch2Title: 'Ground Effect',
    ch2Desc: 'Touch a grounded metal surface while scanning. What happens to the impedance reading?',
    ch3Title: 'AM Radio Pickup',
    ch3Desc: 'Sweep 500 kHz to 1700 kHz. Can you detect any AM radio stations using your body as antenna?',
    faq_q1: 'Can my body really be an antenna?',
    faq_a1: 'Yes! Any conductive object can receive RF. The human body, being ~1.7m tall and conductive, resonates near 1.8 MHz as a quarter-wave antenna.',
    faq_q2: 'What is impedance?',
    faq_a2: 'Impedance (Z) is the total opposition to current flow in an AC circuit. It has real (resistance) and imaginary (reactance) parts: Z = R + jX.',
    faq_q3: 'Is this safe?',
    faq_a3: 'Absolutely. We are only measuring signals already passing through your body. No energy is transmitted into you.',
    faq_q4: 'What is SWR?',
    faq_a4: 'Standing Wave Ratio measures antenna matching quality. SWR=1.0 is perfect match, SWR>3.0 means significant mismatch and power loss.',
    howto_1: 'Click Start Scan to begin impedance measurement.',
    howto_2: 'Click Touch Body to simulate skin contact with the probe.',
    howto_3: 'Click Freq Sweep to scan across 0.5-5 MHz range.',
    howto_4: 'Click Ground to simulate connecting your body to earth ground.',
    wiki_ant_title: '\ud83d\udce1 Body Antenna Theory',
    wiki_ant: 'A 1.7m human body resonates at ~1.8 MHz (quarter-wave). Grounding one end creates a monopole antenna with ~36 ohm impedance at resonance.',
    wiki_imp_title: '\u26a1 Impedance',
    wiki_imp: 'Z = R + jX. Real part R is resistance, imaginary part jX is reactance. Measured in ohms. SWR indicates matching quality.',
    wiki_swr_title: '\ud83d\udcca Standing Wave Ratio',
    wiki_swr: 'SWR = (1+|Gamma|)/(1-|Gamma|) where Gamma is the reflection coefficient. Lower SWR means better antenna matching and more efficient signal reception.',
    activityLog: 'Activity Log',
    eventsMsg: 'Events & messages',
    clear: 'Clear',
    copy: 'Copy',
    export: 'Export',
    filterAll: 'All',
    settings: '\u2699\ufe0f Settings',
    language: 'Language',
    theme: 'Theme',
    help: '\u2753 Help',
    faq: 'FAQ',
    howto: 'How-To',
    wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects',
    whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide',
    dhikrTap: 'Tap',
    musicMode: 'Music reactive',
    splashHint: 'tap to skip',
    working: 'Working\u2026',
    chatPlaceholder: 'Talk to the robot...',
    newVersion: 'UPDATE',
    t_mosque: 'Mosque',
    t_zellige: 'Zellige',
    t_andalus: 'Andalus',
    t_riad: 'Riad',
    t_medina: 'Medina',
    t_space: 'Space',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\ud83d\udce1 Bio Body Antenna ready — touch to scan!',
    logCleared: 'Log cleared',
    copied: 'Copied!',
    copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English',
    themeChanged: '\ud83c\udfa8 Theme \u2192',
    scanning: 'Scanning impedance...',
    touched: 'Body contact detected!',
    grounded: 'Grounded \u2014 impedance dropped!',
    sweepDone: 'Frequency sweep complete',
    resonanceFound: 'Resonance found at',
  },
  fr: {matrixTitle:'Pluie Matrix',matrixOn:'Matrix ACTIV\x27',matrixOff:'Matrix D\x27SACTIV\x27',ratingTitle:'Noter cette appli',ratingYours:'Votre note',ratingThanks:'Merci pour votre note !',flashTitle:'Cartes M\xe9moire',flashKnow:'Je sais',flashReview:'\xc0 revoir',flashDone:'Toutes les cartes r\xe9vis\xe9es !',flashProgress:'{0} sur {1} restantes',flash_t1:'Signal',flash_d1:'Un motif d\x27\xe9nergie transmis d\xe9tectable utilis\xe9 pour transmettre des informations.',flash_t2:'Chiffrement',flash_d2:'Le processus d\x27encodage des donn\xe9es pour que seules les parties autoris\xe9es puissent les lire.',flash_t3:'Protocole',flash_d3:'Un ensemble de r\xe8gles r\xe9gissant l\x27\xe9change de donn\xe9es entre appareils ou syst\xe8mes.',flash_t4:'Fr\xe9quence',flash_d4:'Le nombre de cycles par seconde d\x27un signal p\xe9riodique, mesur\xe9 en Hertz.',flash_t5:'Authentification',flash_d5:'Le processus de v\xe9rification de l\x27identit\xe9 d\x27un utilisateur, appareil ou syst\xe8me.',certTitle:'Certificat de R\xe9ussite',certComplete:'F\xe9licitations ! Toutes les apps termin\xe9es !',certProgress:'{0} sur {1} apps termin\xe9es',certDownload:'T\xe9l\xe9charger le Certificat',certName:'Workshop DIY',annotTitle:'Mode Annotation',annotDraw:'Main lev\x27e',annotArrow:'Fl\x27che',annotCircle:'Cercle',annotText:'Texte',annotUndo:'Annuler',annotClear:'Tout effacer',annotSave:'Enregistrer en PNG',annotExit:'Quitter l\x27annotation',bookmarkTitle:'Mes Favoris',bookmarkAdd:'Ajouter aux favoris',bookmarkRemove:'Supprimer',bookmarkCollection:'Ajouter \x27 la collection',bookmarkNew:'Nouvelle collection',bookmarkEmpty:'Aucun favori pour l\x27instant',morseSecret:'Morse Easter Egg',morseBackstory:'Un chercheur en bioacoustique en Amazonie a decouvert que certaines grenouilles arboricoles emettent des signatures RF. Cet outil a ete cree pour decoder ces signaux bio-radio.',morseDecoded:'D\x27cod\x27: ',dnaTitle:'Empreinte ADN',dnaSave:'Sauvegarder ADN',dnaInfo:'Signature visuelle unique des param\x27tres actuels',sandboxTitle:'Mode Bac \x27 sable',sandboxOn:'Bac \x27 sable ACTIV\x27',sandboxOff:'Bac \x27 sable D\x27SACTIV\x27',sandboxAdd:'Ajouter Param\x27tre',sandboxReset:'R\x27initialiser',profTitle:'Professeur',profGreet:'Bonjour Agent ! Je suis le Professeur Atelier. Pose-moi n\x27importe quelle question sur Bio Body Antenna !',profWhat:'C\x27est quoi ?',profHow:'Comment \xe7a marche ?',profWhy:'Pourquoi c\x27est important ?',profChallenge:'Donne-moi un d\xe9fi',profMore:'Dis-moi plus',profQuiz:'Teste-moi',profUnknown:'Bonne question ! Essaie d\x27explorer les fonctions de Bio Radio pour le d\xe9couvrir.',profPlaceholder:'Demande au professeur...',
    pomodoroTitle:'Minuteur Pomodoro',pomodoroFocus:'Concentration',pomodoroBreak:'Pause',pomodoroStart:'D\x27marrer',pomodoroPause:'Pause',pomodoroReset:'R\x27initialiser',pomodoroDone:'Session termin\x27e!',flipTitle:'Stats Secr\x27tes',flipStats:'Statistiques Cach\x27es',flipTime:'Temps Pass\x27',flipChanges:'Modifications',flipGame:'Cliquez la Cible',flipBack:'Retourner',
    title: 'Bio Antenne Corporelle',
    subtitle: 'Votre corps est une antenne 1.8 MHz',
    disconnected: 'D\u00e9connect\u00e9',
    connected: 'Connect\u00e9',
    mainSection: 'Antenne Corporelle \u2014 Mesure d\'imp\u00e9dance',
    mainDesc: 'Corps humain comme antenne 1.8 MHz avec analyse d\'imp\u00e9dance',
    sectionA: 'A \u2014 Comment \u00e7a marche',
    sectionB: 'B \u2014 Spectre en direct',
    sectionC: 'C \u2014 D\u00e9fis',
    startScan: 'D\u00e9marrer Scan',
    stopScan: 'Arr\u00eat',
    touchBody: 'Toucher Corps',
    groundBtn: 'Masse',
    sweepBtn: 'Balayage Fr\u00e9q',
    statSWR: 'TOS',
    statGain: 'dBi',
    statZ: '\u2126 imp\u00e9dance',
    step1Title: 'Corps Antenne',
    step1Desc: 'Le corps humain (~1.7m) agit comme une antenne, r\u00e9sonnant pr\u00e8s de 1.8 MHz. L\'ADC du micro:bit mesure le signal RF.',
    step2Title: 'Sonde Imp\u00e9dance',
    step2Desc: 'Un circuit pont mesure l\'imp\u00e9dance corporelle \u2014 la r\u00e9sistance complexe aux signaux RF.',
    step3Title: 'Calcul TOS',
    step3Desc: 'Le TOS montre la qualit\u00e9 d\'adaptation. TOS = 1.0 est parfait.',
    step4Title: 'D\u00e9tection Signal',
    step4Desc: 'Le toucher modifie le diagramme. La mise \u00e0 la masse am\u00e9liore la r\u00e9ception.',
    ch1Title: 'Trouver la R\u00e9sonance',
    ch1Desc: 'Balayez les fr\u00e9quences pour trouver votre r\u00e9sonance corporelle.',
    ch2Title: 'Effet de Masse',
    ch2Desc: 'Touchez un m\u00e9tal reli\u00e9 \u00e0 la terre pendant le scan.',
    ch3Title: 'R\u00e9ception AM',
    ch3Desc: 'Balayez 500 kHz \u00e0 1700 kHz. D\u00e9tectez des stations AM!',
    faq_q1: 'Mon corps peut-il \u00eatre une antenne?',
    faq_a1: 'Oui! Le corps humain (~1.7m) r\u00e9sonne pr\u00e8s de 1.8 MHz en tant qu\'antenne quart d\'onde.',
    faq_q2: 'Qu\'est-ce que l\'imp\u00e9dance?',
    faq_a2: 'Z = R + jX est l\'opposition totale au courant AC. Partie r\u00e9elle R = r\u00e9sistance, partie imaginaire jX = r\u00e9actance.',
    faq_q3: 'Est-ce s\u00fbr?',
    faq_a3: 'Oui, nous mesurons uniquement les signaux ambiants passant d\u00e9j\u00e0 par votre corps.',
    faq_q4: 'Qu\'est-ce que le TOS?',
    faq_a4: 'Le Taux d\'Ondes Stationnaires mesure l\'adaptation. TOS=1.0 est parfait, TOS>3.0 signifie un d\u00e9s\u00e9quilibre important.',
    howto_1: 'Cliquez D\u00e9marrer Scan pour commencer.',
    howto_2: 'Cliquez Toucher Corps pour simuler le contact.',
    howto_3: 'Cliquez Balayage Fr\u00e9q pour scanner 0.5-5 MHz.',
    howto_4: 'Cliquez Masse pour simuler la mise \u00e0 la terre.',
    wiki_ant_title: '\ud83d\udce1 Th\u00e9orie Antenne',
    wiki_ant: 'Un corps de 1.7m r\u00e9sonne \u00e0 ~1.8 MHz (quart d\'onde). La mise \u00e0 la terre cr\u00e9e un monop\u00f4le de ~36 ohms.',
    wiki_imp_title: '\u26a1 Imp\u00e9dance',
    wiki_imp: 'Z = R + jX en ohms. Le TOS indique la qualit\u00e9 d\'adaptation.',
    wiki_swr_title: '\ud83d\udcca Taux d\'Ondes Stationnaires',
    wiki_swr: 'TOS = (1+|Gamma|)/(1-|Gamma|). Plus le TOS est bas, meilleure est l\'adaptation de l\'antenne.',
    activityLog: 'Journal',
    eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer',
    copy: 'Copier',
    export: 'Exporter',
    filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres',
    language: 'Langue',
    theme: 'Th\u00e8me',
    help: '\u2753 Aide',
    faq: 'FAQ',
    howto: 'Guide',
    wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores',
    whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire',
    dhikrTap: 'Tap',
    musicMode: 'R\u00e9actif musique',
    splashHint: 'appuyer pour passer',
    working: 'En cours\u2026',
    chatPlaceholder: 'Parle au robot...',
    newVersion: 'MAJ',
    t_mosque: 'Mosqu\u00e9e',
    t_zellige: 'Zellige',
    t_andalus: 'Andalous',
    t_riad: 'Riad',
    t_medina: 'M\u00e9dina',
    t_space: 'Espace',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\ud83d\udce1 Antenne corporelle pr\u00eate \u2014 touchez pour scanner!',
    logCleared: 'Journal effac\u00e9',
    copied: 'Copi\u00e9!',
    copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais',
    themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    scanning: 'Scan imp\u00e9dance...',
    touched: 'Contact corporel d\u00e9tect\u00e9!',
    grounded: 'Mass\u00e9 \u2014 imp\u00e9dance r\u00e9duite!',
    sweepDone: 'Balayage termin\u00e9',
    resonanceFound: 'R\u00e9sonance trouv\u00e9e \u00e0',
  },
  ar: {matrixTitle:'مطر الماتريكس',matrixOn:'الماتريكس مفعل',matrixOff:'الماتريكس معطل',ratingTitle:'قيّم هذا التطبيق',ratingYours:'تقييمك',ratingThanks:'شكرا على التقييم!',flashTitle:'بطاقات تعليمية',flashKnow:'أعرفها',flashReview:'راجع لاحقاً',flashDone:'تمت مراجعة جميع البطاقات!',flashProgress:'{0} من {1} متبقية',flash_t1:'إشارة',flash_d1:'نمط طاقة مرسل قابل للكشف يستخدم لنقل المعلومات.',flash_t2:'تشفير',flash_d2:'عملية ترميز البيانات بحيث لا يمكن قراءتها إلا للأطراف المصرح لها.',flash_t3:'بروتوكول',flash_d3:'مجموعة قواعد تحكم تبادل البيانات بين الأجهزة.',flash_t4:'تردد',flash_d4:'عدد الدورات في الثانية لإشارة دورية، تقاس بالهرتز.',flash_t5:'مصادقة',flash_d5:'عملية التحقق من هوية المستخدم أو الجهاز أو النظام.',certTitle:'شهادة إتمام',certComplete:'تهانينا! تم إكمال جميع التطبيقات!',certProgress:'{0} من {1} تطبيقات مكتملة',certDownload:'تحميل الشهادة',certName:'Workshop DIY',annotTitle:'وضع التعليق',annotDraw:'رسم حر',annotArrow:'سهم',annotCircle:'دائرة',annotText:'نص',annotUndo:'تراجع',annotClear:'مسح الكل',annotSave:'حفظ كصورة',annotExit:'خروج من التعليق',bookmarkTitle:'مفضلاتي',bookmarkAdd:'إضافة للمفضلة',bookmarkRemove:'إزالة',bookmarkCollection:'إضافة إلى مجموعة',bookmarkNew:'مجموعة جديدة',bookmarkEmpty:'لا توجد مفضلات بعد',morseSecret:'بيضة مورس الفصحية',morseBackstory:'تم اكتشاف هذه الأداة في خزنة سرية',morseDecoded:'تم فك التشفير: ',dnaTitle:'بصمة الحمض النووي',dnaSave:'حفظ البصمة',dnaInfo:'توقيع بصري فريد للمعلمات الحالية',sandboxTitle:'وضع التجربة',sandboxOn:'التجربة مفعلة',sandboxOff:'التجربة معطلة',sandboxAdd:'إضافة معلمة',sandboxReset:'إعادة التعيين',profTitle:'الأستاذ',profGreet:'مرحبا أيها العميل! أنا الأستاذ ورشة. اسألني أي شيء!',profWhat:'ما هذا؟',profHow:'كيف يعمل؟',profWhy:'لماذا هذا مهم؟',profChallenge:'أعطني تحديا',profMore:'أخبرني المزيد',profQuiz:'اختبرني',profUnknown:'سؤال جيد! حاول استكشاف الميزات لمعرفة الإجابة.',profPlaceholder:'اسأل الأستاذ...',
    pomodoroTitle:'مؤقت بومودورو',pomodoroFocus:'تركيز',pomodoroBreak:'استراحة',pomodoroStart:'بدء',pomodoroPause:'إيقاف',pomodoroReset:'إعادة',pomodoroDone:'اكتملت الجلسة!',flipTitle:'إحصائيات سرية',flipStats:'إحصائيات مخفية',flipTime:'الوقت المستغرق',flipChanges:'التغييرات',flipGame:'انقر الهدف',flipBack:'ارجع',
    title: '\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645',
    subtitle: '\u062c\u0633\u0645\u0643 \u0647\u0648\u0627\u0626\u064a 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',
    connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u2014 \u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    mainDesc: '\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a \u0643\u0647\u0648\u0627\u0626\u064a \u0627\u0633\u062a\u0642\u0628\u0627\u0644 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 \u0645\u0639 \u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',
    sectionB: '\u0628 \u2014 \u0627\u0644\u0637\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631',
    sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startScan: '\u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d',
    stopScan: '\u0625\u064a\u0642\u0627\u0641',
    touchBody: '\u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645',
    groundBtn: '\u062a\u0623\u0631\u064a\u0636',
    sweepBtn: '\u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    statSWR: 'TOS',
    statGain: 'dBi',
    statZ: '\u2126 \u0645\u0639\u0627\u0648\u0642\u0629',
    step1Title: '\u0627\u0644\u062c\u0633\u0645 \u0643\u0647\u0648\u0627\u0626\u064a',
    step1Desc: '\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a (~1.7\u0645) \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632. ADC \u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0642\u064a\u0633 \u0627\u0644\u0625\u0634\u0627\u0631\u0629.',
    step2Title: '\u0645\u0633\u0628\u0627\u0631 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    step2Desc: '\u062f\u0627\u0626\u0631\u0629 \u062c\u0633\u0631 \u0628\u0633\u064a\u0637\u0629 \u062a\u0642\u064a\u0633 \u0645\u0639\u0627\u0648\u0642\u0629 \u0627\u0644\u062c\u0633\u0645.',
    step3Title: '\u062d\u0633\u0627\u0628 TOS',
    step3Desc: 'TOS \u064a\u0648\u0636\u062d \u062c\u0648\u062f\u0629 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. TOS=1.0 \u0645\u062b\u0627\u0644\u064a.',
    step4Title: '\u0643\u0634\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0629',
    step4Desc: '\u0627\u0644\u0644\u0645\u0633 \u064a\u063a\u064a\u0631 \u0646\u0645\u0637 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u062d\u0633\u0646 \u0627\u0644\u0627\u0633\u062a\u0642\u0628\u0627\u0644.',
    ch1Title: '\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0631\u0646\u064a\u0646',
    ch1Desc: '\u0627\u0633\u062a\u062e\u062f\u0645 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f \u0644\u0625\u064a\u062c\u0627\u062f \u062a\u0631\u062f\u062f \u0631\u0646\u064a\u0646 \u062c\u0633\u0645\u0643.',
    ch2Title: '\u062a\u0623\u062b\u064a\u0631 \u0627\u0644\u062a\u0623\u0631\u064a\u0636',
    ch2Desc: '\u0627\u0644\u0645\u0633 \u0645\u0639\u062f\u0646\u064b\u0627 \u0645\u0624\u0631\u0636\u064b\u0627 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0645\u0633\u062d.',
    ch3Title: '\u0627\u0644\u062a\u0642\u0627\u0637 AM',
    ch3Desc: '\u0627\u0645\u0633\u062d 500 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632 \u0625\u0644\u0649 1700 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632.',
    faq_q1: '\u0647\u0644 \u064a\u0645\u0643\u0646 \u0644\u062c\u0633\u0645\u064a \u0623\u0646 \u064a\u0643\u0648\u0646 \u0647\u0648\u0627\u0626\u064a\u061f',
    faq_a1: '\u0646\u0639\u0645! \u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a (~1.7\u0645) \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 \u0643\u0647\u0648\u0627\u0626\u064a \u0631\u0628\u0639 \u0645\u0648\u062c\u0629.',
    faq_q2: '\u0645\u0627 \u0647\u064a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629\u061f',
    faq_a2: 'Z = R + jX \u0647\u064a \u0627\u0644\u0645\u0642\u0627\u0648\u0645\u0629 \u0627\u0644\u0643\u0644\u064a\u0629 \u0644\u0644\u062a\u064a\u0627\u0631 \u0627\u0644\u0645\u062a\u0631\u062f\u062f.',
    faq_q3: '\u0647\u0644 \u0647\u0630\u0627 \u0622\u0645\u0646\u061f',
    faq_a3: '\u0646\u0639\u0645\u060c \u0646\u0642\u064a\u0633 \u0641\u0642\u0637 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u062d\u064a\u0637\u0629 \u0627\u0644\u062a\u064a \u062a\u0645\u0631 \u0639\u0628\u0631 \u062c\u0633\u0645\u0643.',
    faq_q4: '\u0645\u0627 \u0647\u0648 TOS\u061f',
    faq_a4: 'TOS \u064a\u0642\u064a\u0633 \u062c\u0648\u062f\u0629 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. TOS=1.0 \u0645\u062b\u0627\u0644\u064a.',
    howto_1: '\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d \u0644\u0628\u062f\u0621 \u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629.',
    howto_2: '\u0627\u0646\u0642\u0631 \u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645 \u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0644\u0627\u0645\u0633.',
    howto_3: '\u0627\u0646\u0642\u0631 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f \u0644\u0644\u0645\u0633\u062d 0.5-5 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632.',
    howto_4: '\u0627\u0646\u0642\u0631 \u062a\u0623\u0631\u064a\u0636 \u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0648\u0635\u064a\u0644 \u0628\u0627\u0644\u0623\u0631\u0636.',
    wiki_ant_title: '\ud83d\udce1 \u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0647\u0648\u0627\u0626\u064a',
    wiki_ant: '\u062c\u0633\u0645 1.7\u0645 \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f ~1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 (\u0631\u0628\u0639 \u0645\u0648\u062c\u0629). \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u0646\u0634\u0626 \u0647\u0648\u0627\u0626\u064a \u0623\u062d\u0627\u062f\u064a \u0627\u0644\u0642\u0637\u0628 ~36 \u0623\u0648\u0645.',
    wiki_imp_title: '\u26a1 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    wiki_imp: 'Z = R + jX \u0628\u0627\u0644\u0623\u0648\u0645. TOS \u064a\u0634\u064a\u0631 \u0625\u0644\u0649 \u062c\u0648\u062f\u0629 \u0627\u0644\u062a\u0637\u0627\u0628\u0642.',
    wiki_swr_title: '\ud83d\udcca \u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u0648\u062c\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629',
    wiki_swr: 'TOS = (1+|\u0393|)/(1-|\u0393|). \u0643\u0644\u0645\u0627 \u0627\u0646\u062e\u0641\u0636 TOS \u0643\u0627\u0646 \u0627\u0644\u062a\u0637\u0627\u0628\u0642 \u0623\u0641\u0636\u0644.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',
    eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear: '\u0645\u0633\u062d',
    copy: '\u0646\u0633\u062e',
    export: '\u062a\u0635\u062f\u064a\u0631',
    filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',
    language: '\u0627\u0644\u0644\u063a\u0629',
    theme: '\u0627\u0644\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',
    faq: '\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629',
    howto: '\u062f\u0644\u064a\u0644',
    wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',
    whisperMode: '\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633',
    breathingGuide: '\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',
    dhikrTap: '\u0627\u0636\u063a\u0637',
    musicMode: '\u062a\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064a\u0642\u064a',
    splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',
    working: '\u062c\u0627\u0631\u064d\u2026',
    chatPlaceholder: '\u062a\u062d\u062f\u062b \u0645\u0639 \u0627\u0644\u0631\u0648\u0628\u0648\u062a...',
    newVersion: '\u062a\u062d\u062f\u064a\u062b',
    t_mosque: '\u0645\u0633\u062c\u062f',
    t_zellige: '\u0632\u0644\u064a\u062c',
    t_andalus: '\u0623\u0646\u062f\u0644\u0633',
    t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629',
    t_space: '\u0641\u0636\u0627\u0621',
    t_jungle: '\u0623\u062f\u063a\u0627\u0644',
    t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83d\udce1 \u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u062c\u0627\u0647\u0632 \u2014 \u0627\u0644\u0645\u0633 \u0644\u0644\u0645\u0633\u062d!',
    logCleared: '\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644',
    copied: '\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',
    copyFail: '\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062e',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    scanning: '\u0645\u0633\u062d \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629...',
    touched: '\u062a\u0645 \u0643\u0634\u0641 \u062a\u0644\u0627\u0645\u0633 \u0627\u0644\u062c\u0633\u0645!',
    grounded: '\u0645\u0624\u0631\u0636 \u2014 \u0627\u0646\u062e\u0641\u0636\u062a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629!',
    sweepDone: '\u0627\u0643\u062a\u0645\u0644 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    resonanceFound: '\u062a\u0645 \u0625\u064a\u062c\u0627\u062f \u0627\u0644\u0631\u0646\u064a\u0646 \u0639\u0646\u062f',
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



/* ═══════ LANGUAGE ═══════ */

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
  document.title = `${s.title} — Workshop DIY`;
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
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;
const logHistory = [];
let typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;

  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }

  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); }
  logHistory.push({ msg, type, ts: Date.now() });
  applyLogFilter();
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

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
  playSound('success');
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  const filters = document.querySelectorAll('.log-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
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

/* ═══════ TOAST ═══════ */

let toastTimer = null;

function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) {
    t.textContent = msg || LANG[currentLang].working;
    el.style.display = 'block';
  }
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

/* ═══════ SLEEP ═══════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════ TYPEWRITER ═══════ */

async function typewriterAppend(element, text) {
  element.classList.add('typing');
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
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

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
  } catch { return ''; }
}

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  const h = calcHijriDate();
  if (h) el.textContent = h;
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
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; activateRetroTheme(); }
    } else { konamiIdx = 0; }
  });
}

function activateRetroTheme() {
  setTheme('retro');
  log('\ud83d\udd79\ufe0f KONAMI CODE ACTIVATED \u2014 RETRO MODE!', 'success');
  playSound('success');
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
  return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' ');
}

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, ''));
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(100);
    } else if (ch === '-') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(300);
    } else if (ch === '/') { await sleep(400); continue; }
    else if (ch === ' ') { await sleep(200); continue; }
    dot.style.background = orig; dot.style.boxShadow = '';
    await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => {
    if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
  });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630\u0623\u0624\u0626\u0625\u0621\u0629\u0649\u0622\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false;
    cancelAnimationFrame(matrixAnim);
    canvas.classList.remove('active');
    log('\ud83d\udd34 Matrix rain off', 'info');
    return;
  }
  matrixRunning = true;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);

  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
  log('\ud83d\udfe2 Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); }
    else { logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }
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
  log('\ud83d\udc1b Debug mode active', 'info');
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
      generateBugReport();
    }
  });
}

function generateBugReport() {
  if (!logContainer) logContainer = $('logContainer');
  const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
  const report = {
    app: document.title, version: APP_VERSION,
    timestamp: new Date().toISOString(), userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`, viewport: `${innerWidth}x${innerHeight}`,
    theme: document.documentElement.dataset.theme, lang: currentLang,
    log: lines.slice(-50)
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `bug-report-${Date.now()}.json`; a.click();
  URL.revokeObjectURL(url);
  log('\ud83d\udcf1 Bug report exported (shake)', 'success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) {
        logContainer.removeChild(logContainer.lastChild);
        logHistory.pop();
        playSound('click');
      }
    }
  });
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523],
  'zellige': [440, 523, 659],
  'andalus': [294, 370, 440],
  'space': [523, 659, 784],
  'jungle': [262, 330, 392],
  'robot': [440, 554, 659],
  'riad': [349, 440, 523],
  'medina': [294, 349, 440],
  'retro': [523, 262, 523],
};

function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;
  if (breathingActive) {
    bands.forEach(b => b.classList.add('breathing'));
    log('\ud83e\udec1 Breathing guide on \u2014 inhale... exhale...', 'info');
  } else {
    bands.forEach(b => b.classList.remove('breathing'));
    if (dhikrCount > 0) log(`\ud83d\udcff Dhikr count: ${dhikrCount}`, 'success');
    dhikrCount = 0;
    log('\ud83e\udec1 Breathing guide off', 'info');
  }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    log('\ud83c\udfa4 Speech not supported', 'error');
    return;
  }
  if (whisperActive) {
    if (recognition) recognition.stop();
    whisperActive = false;
    log('\ud83c\udfa4 Whisper mode off', 'info');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const text = e.results[i][0].transcript.trim();
        if (text) log(`\ud83c\udfa4 ${text}`, 'rx');
      }
    }
  };
  recognition.onerror = e => log(`\ud83c\udfa4 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start();
  whisperActive = true;
  log('\ud83c\udfa4 Whisper mode on \u2014 speak!', 'success');
}

/* ═══════ GHOST USERS ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.className = 'ghost-canvas';
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;

  window.addEventListener('resize', () => {
    ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;
  });

  document.addEventListener('mousemove', e => {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify({ id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now() }));
    } catch {}
  });

  const ghosts = {};
  window.addEventListener('storage', e => {
    if (e.key !== GHOST_KEY || !e.newValue) return;
    try {
      const d = JSON.parse(e.newValue);
      if (d.id === myGhostId) return;
      ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
    } catch {}
  });

  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      const age = (now - g.ts) / 3000;
      ghostCtx.globalAlpha = 0.3 * (1 - age);
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
      ghostCtx.fillStyle = accent; ghostCtx.fill();
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ghostCtx.fillStyle = '#fff'; ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ NIGHT MODE ═══════ */

function initNightMode() {
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;
  if (isNight) {
    try {
      const manual = localStorage.getItem('wdiy-theme');
      if (!manual) { setTheme('mosque-gold'); log('\ud83c\udf19 Night mode', 'info'); }
    } catch {}
  }
}

/* ═══════ LOGO TRACKER ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2);
    const dy = (e.clientY - cy) / (innerHeight / 2);
    const tiltX = dy * 8, tiltY = -dx * 8;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
    const shift = dist * 4;
    logo.style.transform = `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dx * shift}px) translateY(${dy * shift}px)`;
  });
  document.addEventListener('mouseleave', () => {
    logo.style.transition = 'transform .5s ease-out';
    logo.style.transform = '';
    setTimeout(() => { logo.style.transition = ''; }, 500);
  });
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('\ud83c\udfb5 Music mode off', 'info');
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser();
    musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser);
    musicActive = true;
    log('\ud83c\udfb5 Music mode on!', 'success');
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      bands.forEach((b, i) => {
        const v = i === 0 ? bass : treble;
        b.style.height = (2 + v * 10) + 'px';
        b.style.opacity = 0.4 + v * 0.6;
      });
      cards.forEach(c => { c.style.transform = `scale(${1 + bass * 0.015})`; c.style.transition = 'transform 0.05s'; });
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => log('\ud83c\udfb5 Microphone access denied', 'error'));
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle');
  const panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';

  handle.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startW = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('active');
    document.body.style.cursor = ''; document.body.style.userSelect = '';
    try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {}
  });

  handle.addEventListener('touchstart', e => {
    dragging = true; startX = e.touches[0].clientX; startW = panel.offsetWidth;
    handle.classList.add('active'); e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('active');
    try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {}
  });

  try {
    const saved = localStorage.getItem('wdiy-log-width');
    if (saved) document.documentElement.style.setProperty('--log-width', saved);
  } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('open');
  if (sb) { const first = sb.querySelector(FOCUSABLE); if (first) first.focus(); }
}

function closePanel(panelId, overlayId, returnFocusId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  const btn = $(returnFocusId);
  if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }

let logWasOpen = false;

function openSettings() {
  const logEl = $('logPanel');
  logWasOpen = logEl && logEl.classList.contains('open');
  if (logWasOpen) closeLog();
  openPanel('settingsPanel', 'settingsOverlay');
}

function closeSettings() {
  closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
  if (logWasOpen) { openLog(); logWasOpen = false; }
}

function openLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.add('open');
  document.body.classList.add('log-open');
}

function closeLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.remove('open');
  document.body.classList.remove('log-open');
  const btn = $('logBtn');
  if (btn) btn.focus();
}

function toggleLog() {
  const sb = $('logPanel');
  if (sb && sb.classList.contains('open')) closeLog();
  else openLog();
}

function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab');
  const contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const target = $(targetId);
      if (target) target.classList.add('active');
    });
  });
}

function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id);
    if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
}

/* ═══════ AI CHAT ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
  const s = LANG[currentLang];
  chatHistory.push({ role: 'user', content: userMsg });
  log(`\ud83d\udcac You: ${userMsg}`, 'tx');
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 150,
        system: `You are the Workshop-DIY robot assistant in a kids educational app about body antennas and RF. Keep responses SHORT (1-2 sentences). Language: ${currentLang}. Be encouraging. Add relevant emojis.`,
        messages: chatHistory.slice(-10)
      })
    });
    const data = await resp.json();
    const reply = data.content?.[0]?.text || '\ud83e\udd16 ...';
    chatHistory.push({ role: 'assistant', content: reply });
    log(`\ud83e\udd16 ${reply}`, 'rx');
    playSound('success');
  } catch { log('\ud83e\udd16 Brain offline', 'error'); }
}

function initAIChat() {
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  const chatRow = document.createElement('div');
  chatRow.className = 'chat-input-row';
  chatRow.innerHTML = `<input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." data-i18n-placeholder="chatPlaceholder" /><button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">\ud83e\udd16</span></button>`;
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  const input = $('chatInput'), sendBtn = $('chatSendBtn');
  const send = () => { const msg = input.value.trim(); if (!msg) return; input.value = ''; aiRespond(msg); };
  if (sendBtn) sendBtn.onclick = send;
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;
  if (exb) exb.onclick = exportLog;
  initLogFilters();

  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp;
  if (hClose) hClose.onclick = closeHelp;
  if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings;
  if (sClose) sClose.onclick = closeSettings;
  if (sOv) sOv.onclick = closeSettings;

  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog;
  if (lClose) lClose.onclick = closeLog;
  initLogResize();

  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => {
      soundEnabled = soundTgl.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
      if (soundEnabled) playSound('click');
    });
  }

  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  const breathBtn = $('breathingBtn');
  const dhikrDisp = $('dhikrDisplay');
  const dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => {
    toggleBreathing();
    if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
  };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

  const musicBtn = $('musicBtn');
  if (musicBtn) musicBtn.onclick = toggleMusicMode;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllPanels();
    if (e.key === 'Tab') trapFocus(e);
  });

  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  checkVersion();
  onAppMessage(msg => log(`\ud83d\udce8 ${msg.from}: ${msg.type}`, 'rx'));

  initKonami();
  initMorseLog();
  initMatrixTrigger();
  initDebug();
  initShakeReport();
  initTimeTravel();
  initHijriDate();
  initGhostUsers();
  initNightMode();
  initLogoTracker();
  initAIChat();

  log(LANG[currentLang].ready, 'success');

  // Init app-specific simulation
  setTimeout(initAntennaApp, 50);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BIO BODY ANTENNA SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let antennaAnim = null;
let isScanning = false;
let isTouching = false;
let isGrounded = false;
let currentFreq = 1.8;
let bodyZ = { r: 150, x: 45 };
let swr = 2.1;
let gain = -12;
let sweepData = [];
let sweepActive = false;

function initAntennaApp() {
  const canvas = $('antennaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width;
  const H = canvas.height;
  let t = 0;
  let wavePhase = 0;
  let bodyGlow = 0;

  // Human body outline points (stick figure)
  const bodyPts = [
    { x: 0.50, y: 0.08 }, { x: 0.50, y: 0.22 }, { x: 0.38, y: 0.18 },
    { x: 0.50, y: 0.22 }, { x: 0.62, y: 0.18 }, { x: 0.50, y: 0.22 },
    { x: 0.50, y: 0.48 }, { x: 0.42, y: 0.70 }, { x: 0.38, y: 0.92 },
    { x: 0.42, y: 0.70 }, { x: 0.50, y: 0.48 }, { x: 0.58, y: 0.70 },
    { x: 0.62, y: 0.92 }
  ];

  function drawBody(ctx, glow) {
    ctx.save();
    const color = glow > 0 ? '51,255,51' : '212,160,60';
    ctx.strokeStyle = `rgba(${color},${0.6 + glow * 0.4})`;
    ctx.lineWidth = 3 + glow * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = glow > 0 ? '#33ff33' : '#d4a03c';
    ctx.shadowBlur = glow * 20;
    ctx.beginPath();
    bodyPts.forEach((p, i) => {
      const px = p.x * W * 0.3 + W * 0.35;
      const py = p.y * H;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    // Head circle
    ctx.beginPath();
    ctx.arc(0.5 * W * 0.3 + W * 0.35, 0.05 * H, H * 0.04, 0, Math.PI * 2);
    ctx.stroke();
    // Ground line
    if (isGrounded) {
      ctx.strokeStyle = 'rgba(255,204,0,0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      const gx = 0.5 * W * 0.3 + W * 0.35;
      ctx.beginPath();
      ctx.moveTo(gx, 0.92 * H);
      ctx.lineTo(gx, H);
      ctx.stroke();
      ctx.setLineDash([]);
      // Ground symbol
      for (let gi = 0; gi < 3; gi++) {
        const gw = 20 - gi * 6;
        ctx.beginPath();
        ctx.moveTo(gx - gw, H - 2 - gi * 5);
        ctx.lineTo(gx + gw, H - 2 - gi * 5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawWaves(ctx, phase, strength) {
    const cx = 0.5 * W * 0.3 + W * 0.35;
    for (let ring = 0; ring < 8; ring++) {
      const r = 40 + ring * 30 + phase * 10;
      const alpha = Math.max(0, (1 - ring / 8) * strength * 0.5);
      ctx.beginPath();
      ctx.arc(cx, H * 0.45, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(51,255,51,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawSpectrum(ctx) {
    const sx = W * 0.68;
    const sy = 30;
    const sw = W * 0.28;
    const sh = H - 60;

    // Box
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(sx, sy, sw, sh);

    // Grid
    for (let i = 0; i < 5; i++) {
      const gy = sy + sh * i / 4;
      ctx.beginPath();
      ctx.moveTo(sx, gy);
      ctx.lineTo(sx + sw, gy);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Orbitron,monospace';
    ctx.fillText('0.5MHz', sx, sy + sh + 12);
    ctx.fillText('5MHz', sx + sw - 30, sy + sh + 12);
    ctx.fillText('|Z|', sx - 20, sy + 10);

    // Sweep data
    if (sweepData.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#33ff33';
      ctx.lineWidth = 2;
      sweepData.forEach((d, i) => {
        const px = sx + i / sweepData.length * sw;
        const py = sy + sh - d.z / 600 * sh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // SWR overlay
      ctx.beginPath();
      ctx.strokeStyle = '#ff6633';
      ctx.lineWidth = 1;
      sweepData.forEach((d, i) => {
        const px = sx + i / sweepData.length * sw;
        const py = sy + sh - Math.min(d.swr / 10, 1) * sh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Current freq marker
    const fx = sx + ((currentFreq - 0.5) / 4.5) * sw;
    ctx.beginPath();
    ctx.moveTo(fx, sy);
    ctx.lineTo(fx, sy + sh);
    ctx.strokeStyle = 'rgba(255,204,0,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 11px Orbitron';
    ctx.fillText(`${currentFreq.toFixed(3)}`, fx - 20, sy - 5);
  }

  function drawImpedance(ctx) {
    const ix = W * 0.02;
    const iy = H * 0.75;
    const iw = W * 0.55;
    const ih = H * 0.2;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(ix, iy, iw, ih);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(ix, iy, iw, ih);

    ctx.fillStyle = '#d4a03c';
    ctx.font = 'bold 13px Orbitron';
    ctx.fillText(`Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`, ix + 10, iy + 20);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Orbitron';
    ctx.fillText(`SWR: ${swr.toFixed(2)}  Gain: ${gain.toFixed(1)} dBi`, ix + 10, iy + 40);
    ctx.fillText(`Freq: ${currentFreq.toFixed(3)} MHz`, ix + 10, iy + 58);

    // Touch / Ground indicators
    if (isTouching) {
      ctx.fillStyle = '#33ff33';
      ctx.fillText('\u270b TOUCH', ix + iw - 80, iy + 20);
    }
    if (isGrounded) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillText('\u26a1 GND', ix + iw - 80, iy + 40);
    }
  }

  function drawSmithChart(ctx) {
    const scx = W * 0.12;
    const scy = H * 0.35;
    const scr = H * 0.15;

    // Outer circle
    ctx.beginPath();
    ctx.arc(scx, scy, scr, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner circles
    for (let r = 0.25; r < 1; r += 0.25) {
      ctx.beginPath();
      ctx.arc(scx + scr * (1 - r), scy, scr * r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.stroke();
    }

    // Impedance point
    const normR = bodyZ.r / 50;
    const normX = bodyZ.x / 50;
    const gamma_r = (normR * normR + normX * normX - 1) / ((normR + 1) * (normR + 1) + normX * normX);
    const gamma_i = (2 * normX) / ((normR + 1) * (normR + 1) + normX * normX);
    const px = scx + gamma_r * scr;
    const py = scy - gamma_i * scr;

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = isScanning ? '#33ff33' : '#d4a03c';
    ctx.shadowColor = isScanning ? '#33ff33' : '#d4a03c';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('Smith', scx - 14, scy + scr + 12);
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;
    wavePhase = (wavePhase + 0.03) % 1;

    if (isScanning) bodyGlow = Math.min(1, bodyGlow + 0.02);
    else bodyGlow = Math.max(0, bodyGlow - 0.01);

    drawWaves(ctx, wavePhase, isScanning ? 0.8 : 0.1);
    drawBody(ctx, bodyGlow);
    drawSmithChart(ctx);
    drawSpectrum(ctx);
    drawImpedance(ctx);

    // Noise floor particles
    if (isScanning) {
      for (let i = 0; i < 20; i++) {
        const nx = Math.random() * W;
        const ny = Math.random() * H;
        ctx.fillStyle = `rgba(51,255,51,${Math.random() * 0.1})`;
        ctx.fillRect(nx, ny, 2, 2);
      }
    }

    // Ambient RF waves from left
    if (isScanning) {
      for (let w = 0; w < 5; w++) {
        const wx = (t * 60 + w * 80) % (W * 0.6);
        const wy = H * 0.3 + Math.sin(wx * 0.02 + w) * 40;
        ctx.beginPath();
        ctx.moveTo(wx, wy - 10);
        ctx.lineTo(wx + 20, wy);
        ctx.lineTo(wx, wy + 10);
        ctx.strokeStyle = `rgba(100,200,255,${0.15 - w * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    antennaAnim = requestAnimationFrame(frame);
  }
  frame();

  // Wire up controls
  const startBtn = $('startBtn');
  const touchBtn = $('touchBtn');
  const groundBtnEl = $('groundBtn');
  const sweepBtnEl = $('sweepBtn');

  if (startBtn) startBtn.onclick = () => {
    isScanning = !isScanning;
    setStatus(isScanning);
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = isScanning ? (LANG[currentLang].stopScan || 'Stop') : LANG[currentLang].startScan;
    log(isScanning ? LANG[currentLang].scanning : 'Scan stopped', 'info');
    if (isScanning) updateImpedance();
  };

  if (touchBtn) touchBtn.onclick = () => {
    isTouching = !isTouching;
    touchBtn.classList.toggle('active', isTouching);
    log(LANG[currentLang].touched, 'success');
    updateImpedance();
  };

  if (groundBtnEl) groundBtnEl.onclick = () => {
    isGrounded = !isGrounded;
    groundBtnEl.classList.toggle('active', isGrounded);
    log(LANG[currentLang].grounded, 'success');
    updateImpedance();
  };

  if (sweepBtnEl) sweepBtnEl.onclick = startSweep;
}

function updateImpedance() {
  const f = currentFreq;
  const resonantF = 1.8 + (isTouching ? -0.15 : 0.05) + (isGrounded ? -0.3 : 0);
  const delta = Math.abs(f - resonantF);

  bodyZ.r = 36 + delta * 80 + (isTouching ? -10 : 20) + (isGrounded ? -15 : 0) + Math.random() * 5;
  bodyZ.x = (f - resonantF) * 120 + Math.random() * 10;

  const zMag = Math.sqrt(bodyZ.r * bodyZ.r + bodyZ.x * bodyZ.x);
  swr = Math.max(1, (zMag > 50 ? zMag / 50 : 50 / zMag));
  gain = -15 + 10 / swr + (isGrounded ? 3 : 0);

  // Update UI elements
  const fill = $('impedanceFill');
  const label = $('impedanceLabel');
  if (fill) fill.style.width = Math.min(100, zMag / 5) + '%';
  if (label) label.textContent = `Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`;

  const sf = $('statFreq');
  const ss = $('statSWR');
  const sg = $('statGain');
  const sz = $('statZ');
  const fd = $('freqDisplay');

  if (sf) sf.textContent = currentFreq.toFixed(3);
  if (ss) ss.textContent = swr.toFixed(1);
  if (sg) sg.textContent = gain.toFixed(1);
  if (sz) sz.textContent = Math.round(zMag);
  if (fd) fd.textContent = `${currentFreq.toFixed(3)} MHz`;
}

async function startSweep() {
  if (sweepActive) return;
  sweepActive = true;
  sweepData = [];
  const s = LANG[currentLang];

  log('Starting frequency sweep 0.5-5.0 MHz...', 'info');
  showToast(s.scanning, 3000);

  let bestSWR = 999;
  let bestFreq = 1.8;

  for (let f = 0.5; f <= 5.0; f += 0.05) {
    currentFreq = f;
    updateImpedance();

    const zMag = Math.sqrt(bodyZ.r * bodyZ.r + bodyZ.x * bodyZ.x);
    sweepData.push({ f, z: zMag, swr });

    if (swr < bestSWR) { bestSWR = swr; bestFreq = f; }
    await sleep(30);
  }

  currentFreq = bestFreq;
  updateImpedance();

  log(`${s.sweepDone}! ${s.resonanceFound} ${bestFreq.toFixed(3)} MHz (SWR ${bestSWR.toFixed(2)})`, 'success');
  hideToast();
  sweepActive = false;
}

/* ═══════ INIT POMODORO + CARD FLIP ═══════ */
document.addEventListener('DOMContentLoaded', function(){
  try { initPomodoro(); } catch(e) { console.warn('Pomodoro init error:', e); }
  try { initCardFlip(); } catch(e) { console.warn('CardFlip init error:', e); }
});
