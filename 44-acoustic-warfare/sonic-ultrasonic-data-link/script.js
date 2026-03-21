/**
 * Sonic Ultrasonic Data Link — Workshop DIY v1.0
 * Transmit data via 20kHz+ ultrasound FSK modem
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas visualizations
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray, fftSize = 2048;
let isTransmitting = false, isListening = false, animId = null;

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
    title:'Ultrasonic Data Link', subtitle:'20kHz+ Acoustic Modem', disconnected:'Idle', connected:'Active',
    mainSection:'Ultrasonic Data Link', mainDesc:'Transmit text via 20kHz+ ultrasound carrier',
    sectionA:'Transmission Log', sectionB:'Protocol Reference', sectionC:'Challenge',
    transmit:'Transmit', receive:'Listen', carrier:'Carrier:', baudRate:'Baud:',
    txStatus:'TX Status', rxStatus:'RX Output', signalInfo:'Signal', txReady:'Ready',
    txPlaceholder:'Message to transmit...',
    activityLog:'Activity Log', eventsMsg:'Events & messages', clear:'Clear', copy:'Copy',
    theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Ultrasonic Data Link ready!',
    txLogHint:'TX/RX messages appear here.',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    txStart:'TX: Transmitting...', txDone:'TX: Complete',
    rxStart:'RX: Listening...', rxStop:'RX: Stopped', noMsg:'Enter a message first',
    howto_1:'Type your message in the input field.', howto_2:'Select carrier frequency and baud rate.',
    howto_3:'Click Transmit to send via ultrasound.', howto_4:'On another device, click Listen to decode.',
    wiki_fsk_title:'FSK Modulation', wiki_fsk:'Frequency-Shift Keying encodes binary data by shifting between two frequencies. Simple, robust, widely used.',
    wiki_ultra_title:'Ultrasonic Range', wiki_ultra:'18-22kHz range is above most adult hearing. Young people may hear up to 20kHz.',
    wiki_app_title:'Applications', wiki_app:'Cross-device pairing, air-gap data exfiltration, proximity verification, indoor positioning.',
    challenge1:'Why use frequencies above 18kHz for the data link?',
    challenge2:'Calculate the maximum throughput for 20 bps with 8 data bits per frame.',
    challenge3:'How could an adversary detect and block this data link?',
    challengeReveal1:'Frequencies above 18kHz are inaudible to most adults (presbycusis). This allows covert data transmission that doesn\'t disturb people.',
    challengeReveal2:'Each frame is 10 bits (1 start + 8 data + 1 stop). At 20 bps: 20/10 = 2 characters/second = 120 chars/minute.',
    challengeReveal3:'A spectrum analyzer would reveal FSK tones at 18-22kHz. Countermeasures: ultrasonic jammer, bandpass filter, or blocking speakers/mics above 17kHz.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment.',sectionCode:'Device Code',faq_q1:'What is Ultrasonic Data Link?',faq_a1:'Ultrasonic Data Link lets you transmit text via 20khz+ ultrasound carrier. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you create a specific acoustic signal with precise frequency and amplitude. Then you the sound wave travels through air, walls, or other media to the target.',faq_q3:'What do the controls do?',faq_a3:'Type your message in the input field. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'إزاحة التردد تُرمّز البيانات الثنائية بالتبديل بين ترددين.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Fence. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Ultrasonic Data Link! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Type your message in the input field. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Transmission Log" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how acoustic science works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Transmission Log" and "Protocol Reference" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Liaison Ultrasonique', subtitle:'Modem Acoustique 20kHz+', disconnected:'Inactif', connected:'Actif',
    mainSection:'Liaison Ultrasonique', mainDesc:'Transmettre du texte via porteuse ultrasonique',
    sectionA:'Journal de Transmission', sectionB:'Reference Protocole', sectionC:'Defi',
    transmit:'Transmettre', receive:'Ecouter', carrier:'Porteuse:', baudRate:'Debit:',
    txStatus:'Etat TX', rxStatus:'Sortie RX', signalInfo:'Signal', txReady:'Pret',
    txPlaceholder:'Message a transmettre...',
    activityLog:'Journal', eventsMsg:'Evenements et messages', clear:'Effacer', copy:'Copier',
    theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Liaison ultrasonique prete!',
    txLogHint:'Messages TX/RX ici.',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    txStart:'TX: Transmission...', txDone:'TX: Termine',
    rxStart:'RX: Ecoute...', rxStop:'RX: Arrete', noMsg:'Entrez un message',
    howto_1:'Tapez votre message.', howto_2:'Selectionnez la frequence porteuse et le debit.',
    howto_3:'Cliquez Transmettre pour envoyer par ultrasons.', howto_4:'Sur un autre appareil, cliquez Ecouter pour decoder.',
    wiki_fsk_title:'Modulation FSK', wiki_fsk:'Le decalage de frequence encode les donnees binaires en alternant entre deux frequences.',
    wiki_ultra_title:'Gamme Ultrasonique', wiki_ultra:'18-22kHz est au-dessus de l\'audition de la plupart des adultes.',
    wiki_app_title:'Applications', wiki_app:'Appairage inter-appareils, exfiltration de donnees, verification de proximite.',
    challenge1:'Pourquoi utiliser des frequences au-dessus de 18kHz?',
    challenge2:'Calculez le debit max pour 20 bps avec 8 bits de donnees par trame.',
    challenge3:'Comment un adversaire pourrait-il detecter et bloquer ce lien?',
    challengeReveal1:'Les frequences au-dessus de 18kHz sont inaudibles pour la plupart des adultes, permettant une transmission discrete.',
    challengeReveal2:'Chaque trame = 10 bits (1 start + 8 data + 1 stop). A 20 bps: 2 caracteres/seconde = 120 caracteres/minute.',
    challengeReveal3:'Un analyseur de spectre revelerait les tons FSK. Contre-mesures: brouilleur ultrasonique ou filtre passe-bande.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Ultrasonic Data Link ?',faq_a1:'Ultrasonic Data Link te permet de simuler science acoustique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de science acoustique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de science acoustique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de science acoustique.',demo_s1:'Bienvenue dans Ultrasonic Data Link ! Regarde l\'écran principal — c\'est ici que la simulation de science acoustique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de science acoustique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne science acoustique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de science acoustique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'رابط البيانات فوق الصوتي', subtitle:'مودم صوتي 20kHz+', disconnected:'خامل', connected:'نشط',
    mainSection:'رابط البيانات فوق الصوتي', mainDesc:'إرسال النصوص عبر حامل فوق صوتي',
    sectionA:'سجل الإرسال', sectionB:'مرجع البروتوكول', sectionC:'التحدي',
    transmit:'إرسال', receive:'استماع', carrier:'الحامل:', baudRate:'السرعة:',
    txStatus:'حالة الإرسال', rxStatus:'مخرج الاستقبال', signalInfo:'الإشارة', txReady:'جاهز',
    txPlaceholder:'الرسالة المراد إرسالها...',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل', clear:'مسح', copy:'نسخ',
    theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'رابط البيانات فوق الصوتي جاهز!',
    txLogHint:'رسائل الإرسال والاستقبال هنا.',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    txStart:'إرسال جاري...', txDone:'اكتمل الإرسال',
    rxStart:'استقبال جاري...', rxStop:'توقف الاستقبال', noMsg:'أدخل رسالة أولاً',
    howto_1:'اكتب رسالتك في حقل الإدخال.', howto_2:'اختر تردد الحامل وسرعة البود.',
    howto_3:'انقر إرسال للنقل عبر الموجات فوق الصوتية.', howto_4:'على جهاز آخر، انقر استماع للاستقبال.',
    wiki_fsk_title:'تعديل FSK', wiki_fsk:'إزاحة التردد تُرمّز البيانات الثنائية بالتبديل بين ترددين.',
    wiki_ultra_title:'النطاق فوق الصوتي', wiki_ultra:'18-22 كيلوهرتز فوق سمع معظم البالغين.',
    wiki_app_title:'التطبيقات', wiki_app:'إقران الأجهزة، تسريب بيانات عبر الفجوة الهوائية، التحقق من القرب.',
    challenge1:'لماذا نستخدم ترددات فوق 18 كيلوهرتز؟',
    challenge2:'احسب أقصى معدل نقل لـ 20 بت/ث مع 8 بتات بيانات لكل إطار.',
    challenge3:'كيف يمكن لخصم اكتشاف وحظر هذا الرابط؟',
    challengeReveal1:'الترددات فوق 18 كيلوهرتز غير مسموعة لمعظم البالغين، مما يسمح بنقل بيانات سري.',
    challengeReveal2:'كل إطار = 10 بتات. عند 20 بت/ث: حرفان في الثانية = 120 حرف/دقيقة.',
    challengeReveal3:'محلل الطيف سيكشف نغمات FSK. الإجراءات المضادة: مشوش فوق صوتي أو مرشح تمرير نطاقي.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Ultrasonic Data Link؟',faq_a1:'Ultrasonic Data Link يتيح لك محاكاة علم الصوتيات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في علم الصوتيات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من علم الصوتيات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من علم الصوتيات.',demo_s1:'مرحباً في Ultrasonic Data Link! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة علم الصوتيات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـعلم الصوتيات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل علم الصوتيات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم علم الصوتيات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
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
const specCanvas = $('spectrogramCanvas'), specCtx = specCanvas ? specCanvas.getContext('2d') : null;
const waveCanvas = $('waveformCanvas'), waveCtx = waveCanvas ? waveCanvas.getContext('2d') : null;

function drawSpectrogram() {
  if (!specCtx || !freqArray) return; analyser.getByteFrequencyData(freqArray);
  const img = specCtx.getImageData(1, 0, specCanvas.width - 1, specCanvas.height); specCtx.putImageData(img, 0, 0);
  const step = freqArray.length / specCanvas.height;
  for (let y = 0; y < specCanvas.height; y++) {
    const val = freqArray[Math.floor((specCanvas.height - y) * step)] || 0;
    const r = val > 200 ? 255 : val > 100 ? val : 0, g = val > 200 ? val - 100 : val > 100 ? 255 : val * 2, b = val > 100 ? 0 : val;
    specCtx.fillStyle = `rgb(${r},${g},${b})`; specCtx.fillRect(specCanvas.width - 1, y, 1, 1);
  }
}
function drawWaveform() {
  if (!waveCtx || !dataArray) return; analyser.getByteTimeDomainData(dataArray);
  waveCtx.fillStyle = 'rgba(10,10,26,0.3)'; waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);
  waveCtx.lineWidth = 2; waveCtx.strokeStyle = '#00ffaa'; waveCtx.beginPath();
  const sw = waveCanvas.width / dataArray.length; let x = 0;
  for (let i = 0; i < dataArray.length; i++) { const y = dataArray[i] / 128 * waveCanvas.height / 2; i === 0 ? waveCtx.moveTo(x, y) : waveCtx.lineTo(x, y); x += sw; }
  waveCtx.stroke();
}
function animate() { drawSpectrogram(); drawWaveform(); animId = requestAnimationFrame(animate); }
function drawIdle() {
  if (specCtx) { specCtx.fillStyle = '#0a0a1a'; specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height); specCtx.fillStyle = 'rgba(0,255,170,0.15)'; specCtx.font = '13px Orbitron'; specCtx.textAlign = 'center'; specCtx.fillText('SPECTROGRAM — Start Listening or Transmit', specCanvas.width / 2, specCanvas.height / 2); specCtx.textAlign = 'left'; }
  if (waveCtx) { waveCtx.fillStyle = '#0a0a1a'; waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height); waveCtx.strokeStyle = 'rgba(0,255,170,0.3)'; waveCtx.lineWidth = 1; waveCtx.beginPath(); waveCtx.moveTo(0, waveCanvas.height / 2); waveCtx.lineTo(waveCanvas.width, waveCanvas.height / 2); waveCtx.stroke(); }
}

/* ═══════ AUDIO ═══════ */
async function initAudio() { if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume(); }
async function startListening() {
  await initAudio();
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const src = audioCtx.createMediaStreamSource(micStream); analyser = audioCtx.createAnalyser(); analyser.fftSize = fftSize;
    src.connect(analyser); dataArray = new Uint8Array(analyser.fftSize); freqArray = new Uint8Array(analyser.frequencyBinCount);
    isListening = true; setStatus(true); animate(); log(T('rxStart'), 'rx'); $('rxBtn').innerHTML = 'Stop'; updateSignalInfo();
  } catch (e) { log('Mic denied: ' + e.message, 'error'); }
}
function stopListening() { isListening = false; setStatus(false); if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; } if (animId) { cancelAnimationFrame(animId); animId = null; } log(T('rxStop'), 'rx'); $('rxBtn').innerHTML = '\u{1F4E5} ' + T('receive'); drawIdle(); }
function updateSignalInfo() { const i = $('signalInfo'); if (!i) return; const c = $('carrierSelect').value, b = $('baudSelect').value; i.innerHTML = 'Carrier: ' + (c / 1000).toFixed(1) + ' kHz<br>Baud: ' + b + ' bps<br>Mode: FSK<br>Bits/char: 8'; }

async function transmitMessage(text) {
  if (!text) { log(T('noMsg'), 'error'); return; } await initAudio();
  if (!analyser) { analyser = audioCtx.createAnalyser(); analyser.fftSize = fftSize; dataArray = new Uint8Array(analyser.fftSize); freqArray = new Uint8Array(analyser.frequencyBinCount); animate(); }
  isTransmitting = true; setStatus(true);
  const carrier = parseInt($('carrierSelect').value), baud = parseInt($('baudSelect').value), bitDur = 1 / baud;
  const f0 = carrier - 200, f1 = carrier + 200;
  log(T('txStart'), 'tx'); addTxLog('TX', text);
  $('txStatusText').textContent = 'Transmitting...'; $('txStatusText').style.color = '#22c55e';
  // Encode as UART frames
  const bits = [];
  for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); bits.push(0); for (let b = 0; b < 8; b++) bits.push((c >> b) & 1); bits.push(1); }
  const dur = bits.length * bitDur;
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); if (analyser) gain.connect(analyser);
  gain.gain.value = 0.5; osc.type = 'sine';
  const now = audioCtx.currentTime;
  for (let i = 0; i < bits.length; i++) osc.frequency.setValueAtTime(bits[i] ? f1 : f0, now + i * bitDur);
  osc.start(now); osc.stop(now + dur);
  const st = Date.now(), iv = setInterval(() => {
    const p = Math.min(100, (Date.now() - st) / 1000 / dur * 100); $('txFill').style.width = p + '%';
    if (p >= 100) { clearInterval(iv); isTransmitting = false; $('txStatusText').textContent = 'Complete'; log(T('txDone'), 'success'); setTimeout(() => { $('txFill').style.width = '0%'; $('txStatusText').textContent = T('txReady'); $('txStatusText').style.color = ''; setStatus(isListening); }, 2000); }
  }, 50);
}

function addTxLog(dir, msg) {
  const el = $('txLog'); if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;' + (dir === 'TX' ? 'background:rgba(34,197,94,.1);color:#22c55e;border-left:3px solid #22c55e;' : 'background:rgba(59,130,246,.1);color:#3b82f6;border-left:3px solid #3b82f6;');
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + dir + ': ' + msg;
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function fillProtocol() {
  const el = $('protocolInfo'); if (!el) return;
  el.innerHTML = '<b>FSK Modulation Protocol</b><br>Carrier: 18-22 kHz (ultrasonic)<br>Binary 0 = carrier - 200 Hz<br>Binary 1 = carrier + 200 Hz<br><br>' +
    '<b>Frame Format (UART-like):</b><br>[START:0] [8 data bits LSB first] [STOP:1]<br>10 bits per character<br><br>' +
    '<b>Baud Rates:</b><br>- 10 bps = 1 char/sec (reliable)<br>- 20 bps = 2 chars/sec (default)<br>- 50 bps = 5 chars/sec (fast, error-prone)<br><br>' +
    '<b>Range:</b> 1-5 meters (speaker to mic)<br><br>' +
    '<b>Security Applications:</b> Covert data exfiltration across air gaps, cross-device authentication, proximity-based pairing, ultrasonic beacons for tracking.';
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
  $('txBtn').onclick = () => transmitMessage($('txInput').value);
  $('rxBtn').onclick = () => { isListening ? stopListening() : startListening(); };
  $('carrierSelect').onchange = updateSignalInfo; $('baudSelect').onchange = updateSignalInfo;
  drawIdle(); updateSignalInfo(); fillProtocol(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Ultrasonic Data Link
   Animated FSK modulation visualization with TX/RX nodes,
   frequency-shift waveform, and bit stream decoder
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simUltrasonicLink';let cv,cx,W,H,af=null,t=0;
  const packets=[];const bitStream=[];let txActive=false,rxActive=false,txTimer=0;
  const msgChars='HELLO WORLD COVERT DATA LINK TEST'.split('');
  let charIdx=0,bitIdx=0,currentBits=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=280;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function charToBits(ch){
    const code=ch.charCodeAt(0);
    const bits=[0]; // start bit
    for(let b=0;b<8;b++)bits.push((code>>b)&1);
    bits.push(1); // stop bit
    return bits;
  }

  class SoundWave{
    constructor(freq,x,y){this.x=x;this.y=y;this.freq=freq;this.r=0;this.maxR=80;this.alpha=0.4;}
    update(){this.r+=2;this.alpha=0.4*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();cx.arc(this.x,this.y,this.r,0,Math.PI*2);
      cx.strokeStyle=this.freq>0?'rgba(34,197,94,'+this.alpha+')':'rgba(59,130,246,'+this.alpha+')';
      cx.lineWidth=1.5;cx.stroke();
    }
  }

  function drawTXNode(){
    const nx=120,ny=H/2-30;
    const pulse=4+Math.sin(t*4)*2;
    cx.save();cx.shadowColor=txActive?'#22c55e':'#444';cx.shadowBlur=txActive?pulse:2;
    cx.beginPath();cx.rect(nx-30,ny-20,60,40);
    cx.fillStyle=txActive?'rgba(34,197,94,0.12)':'rgba(100,100,100,0.08)';cx.fill();
    cx.strokeStyle=txActive?'#22c55e':'#555';cx.lineWidth=2;cx.stroke();
    cx.shadowBlur=0;
    cx.font='12px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
    cx.fillText('\u{1F50A}',nx,ny);
    cx.font='8px monospace';cx.fillStyle=txActive?'#22c55e':'#555';
    cx.fillText('TX',nx,ny+28);
    cx.font='7px monospace';cx.fillStyle='#888';
    cx.fillText('Speaker',nx,ny+38);cx.restore();
  }

  function drawRXNode(){
    const nx=W-120,ny=H/2-30;
    const pulse=4+Math.sin(t*3)*2;
    cx.save();cx.shadowColor=rxActive?'#3b82f6':'#444';cx.shadowBlur=rxActive?pulse:2;
    cx.beginPath();cx.rect(nx-30,ny-20,60,40);
    cx.fillStyle=rxActive?'rgba(59,130,246,0.12)':'rgba(100,100,100,0.08)';cx.fill();
    cx.strokeStyle=rxActive?'#3b82f6':'#555';cx.lineWidth=2;cx.stroke();
    cx.shadowBlur=0;
    cx.font='12px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
    cx.fillText('\u{1F399}',nx,ny);
    cx.font='8px monospace';cx.fillStyle=rxActive?'#3b82f6':'#555';
    cx.fillText('RX',nx,ny+28);
    cx.font='7px monospace';cx.fillStyle='#888';
    cx.fillText('Microphone',nx,ny+38);cx.restore();
  }

  function drawFSKWaveform(){
    const wx=180,wy=10,ww=W-360,wh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(wx,wy,ww,wh);
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(wx,wy+wh/2);cx.lineTo(wx+ww,wy+wh/2);cx.stroke();

    if(bitStream.length>0){
      cx.strokeStyle='#22c55e';cx.lineWidth=1.5;cx.beginPath();
      const visibleBits=Math.min(bitStream.length,80);
      const start=Math.max(0,bitStream.length-visibleBits);
      for(let i=0;i<visibleBits;i++){
        const bit=bitStream[start+i];
        const bx=wx+i/visibleBits*ww;
        const freq=bit?0.4:0.15;
        for(let s=0;s<ww/visibleBits;s++){
          const sx=bx+s;
          const sy=wy+wh/2+Math.sin((sx+t*200)*freq)*wh*0.35;
          if(i===0&&s===0)cx.moveTo(sx,sy);else cx.lineTo(sx,sy);
        }
      }
      cx.stroke();
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('FSK Waveform — f0: 17.8 kHz  f1: 18.2 kHz',wx+4,wy+wh+10);
  }

  function drawBitDisplay(){
    const bx=180,by=H-70,bw=W-360,bh=20;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(bx,by,bw,bh);
    const visibleBits=Math.min(bitStream.length,64);
    const start=Math.max(0,bitStream.length-visibleBits);
    const cellW=bw/64;
    for(let i=0;i<visibleBits;i++){
      const bit=bitStream[start+i];
      cx.fillStyle=bit?'rgba(34,197,94,0.6)':'rgba(59,130,246,0.3)';
      cx.fillRect(bx+i*cellW+0.5,by+1,cellW-1,bh-2);
      if(cellW>6){
        cx.fillStyle='#fff';cx.font='7px monospace';cx.textAlign='center';
        cx.fillText(bit.toString(),bx+i*cellW+cellW/2,by+bh/2+2);
      }
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('Decoded Bits (UART: START + 8-DATA + STOP)',bx+4,by-4);
  }

  function drawDecodedText(){
    const dx=180,dy=H-38,dw=W-360;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(dx,dy,dw,22);
    const decoded=msgChars.slice(0,charIdx).join('');
    cx.fillStyle='#22c55e';cx.font='11px monospace';cx.textAlign='left';
    cx.fillText('> '+decoded+(Math.sin(t*5)>0?'\u2588':''),dx+8,dy+15);
  }

  function drawAirGap(){
    const ax=W/2,ay=H/2-30;
    cx.save();
    cx.setLineDash([4,6]);cx.strokeStyle='rgba(255,255,255,0.08)';cx.lineWidth=1;
    cx.beginPath();cx.moveTo(150,ay);cx.lineTo(W-150,ay);cx.stroke();
    cx.setLineDash([]);
    cx.fillStyle='rgba(255,255,255,0.08)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('AIR GAP',ax,ay-40);
    // Distance indicator
    cx.fillText('~1-5 meters',ax,ay+60);
    cx.restore();
  }

  function drawSignalStrength(){
    const sx=W-60,sy=20,sw=40,sh=100;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(sx,sy,sw,sh);
    const level=txActive?0.6+Math.sin(t*2)*0.2:0.1;
    const barH=sh*level;
    const grad=cx.createLinearGradient(0,sy+sh,0,sy);
    grad.addColorStop(0,'#22c55e');grad.addColorStop(0.6,'#f59e0b');grad.addColorStop(1,'#ef4444');
    cx.fillStyle=grad;cx.fillRect(sx+4,sy+sh-barH,sw-8,barH);
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('SNR',sx+sw/2,sy+sh+10);
    cx.fillText(Math.floor(level*30)+'dB',sx+sw/2,sy+sh+20);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,180,68);
    cx.strokeStyle='rgba(34,197,94,0.15)';cx.strokeRect(8,8,180,68);
    cx.font='10px monospace';cx.fillStyle='#22c55e';cx.textAlign='left';
    cx.fillText('\u{1F50A} ULTRASONIC DATA LINK',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Bits: '+bitStream.length+'  Chars: '+charIdx,16,40);
    cx.fillText('Carrier: 18 kHz  Baud: 20',16,54);
    cx.fillText('Mode: FSK  Encoding: UART',16,68);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.12)';cx.fillRect(0,0,W,H);

    // Simulate transmission
    txTimer+=0.016;
    if(txTimer>0.15){
      txTimer=0;txActive=true;rxActive=true;
      if(currentBits.length===0){
        if(charIdx<msgChars.length){
          currentBits=charToBits(msgChars[charIdx]);
          bitIdx=0;
        }else{charIdx=0;currentBits=charToBits(msgChars[0]);}
      }
      if(bitIdx<currentBits.length){
        bitStream.push(currentBits[bitIdx]);
        if(bitStream.length>200)bitStream.shift();
        // Spawn sound wave
        packets.push(new SoundWave(currentBits[bitIdx],120,H/2-30));
        bitIdx++;
      }else{
        charIdx++;currentBits=[];
      }
    }

    drawAirGap();drawTXNode();drawRXNode();

    // Sound waves
    for(let i=packets.length-1;i>=0;i--){
      if(!packets[i].update())packets.splice(i,1);
      else packets[i].draw();
    }

    drawFSKWaveform();drawBitDisplay();drawDecodedText();
    drawSignalStrength();drawHUD();

    cx.fillStyle='rgba(100,200,255,0.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Ultrasonic Covert Data Link — FSK over Air Gap',8,H-8);

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
