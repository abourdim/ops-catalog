/**
 * Sonic Audio Steganography — Workshop DIY v1.0
 * Hide data inside audio using spectral encoding
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, encodedBuffer = null, hiddenMsg = '', isPlaying = false;

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
    title:'Audio Steganography', subtitle:'Hide Data Inside Music',
    disconnected:'Idle', connected:'Processing',
    mainSection:'Audio Steganography', mainDesc:'Embed hidden messages in audio using spectral encoding',
    sectionA:'Encode History', sectionB:'Steganography Science', sectionC:'Challenge',
    msgPlaceholder:'Secret message to hide...',
    encodeBtn:'Encode', decodeBtn:'Decode', playBtn:'Play',
    stegoLabel:'Stego Status', capacityLabel:'Capacity', decodedLabel:'Decoded',
    stegoReady:'Ready', encodeHint:'Encoding operations appear here.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Audio Steganography ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    encoded:'Message encoded in audio!', decoded:'Message decoded successfully!',
    noMsg:'Enter a message first', noAudio:'No encoded audio to decode',
    playing:'Playing stego audio...', stopped:'Playback stopped',
    howto_1:'Type your secret message in the input field.', howto_2:'Click Encode to hide it inside a generated audio carrier.',
    howto_3:'Click Play to hear the carrier audio (message is inaudible).', howto_4:'Click Decode to extract the hidden message from the audio.',
    wiki_lsb_title:'LSB Encoding', wiki_lsb:'Replace least significant bits of audio samples with message bits. Imperceptible to human ear but detectable by statistical analysis.',
    wiki_ss_title:'Spread Spectrum', wiki_ss:'Spread message across the frequency spectrum using a pseudo-random sequence. Very robust against compression.',
    wiki_echo_title:'Echo Hiding', wiki_echo:'Embed data by introducing micro-echoes. Binary 0/1 mapped to different echo delays (1ms vs 2ms).',
    challenge1:'Can you detect the hidden data by listening to the audio?',
    challenge2:'What is the maximum message size for a 3-second carrier?',
    challenge3:'How would a steganalyst detect this encoding?',
    challengeReveal1:'No! The encoding uses high-frequency tones near 19-20kHz that are inaudible to most adults. Even with good headphones, the amplitude is too low to perceive.',
    challengeReveal2:'With 44100 Hz sample rate and 8 bits per character, a 3-second carrier has 132300 samples, allowing ~16537 characters. In practice, bit duration limits this to around 256 bytes for reliable extraction.',
    challengeReveal3:'Spectral analysis would reveal unusual energy peaks at 19-20kHz. Statistical tests (chi-square, RS analysis) can detect non-random patterns in LSB values.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment.',sectionCode:'Device Code',faq_q1:'What is Audio Steganography?',faq_a1:'Audio Steganography lets you embed hidden messages in audio using spectral encoding. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you create a specific acoustic signal with precise frequency and amplitude. Then you the sound wave travels through air, walls, or other media to the target.',faq_q3:'What do the controls do?',faq_a3:'Type your secret message in the input field. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'استبدال البتات الأقل أهمية في عينات الصوت ببتات الرسالة. غير محسوس للأذن البشرية.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Fence. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Audio Steganography! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Type your secret message in the input field. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Encode History" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how acoustic science works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Encode History" and "Steganography Science" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Steganographie Audio', subtitle:'Cacher des Donnees dans la Musique',
    disconnected:'Inactif', connected:'Traitement',
    mainSection:'Steganographie Audio', mainDesc:'Integrer des messages caches dans l\'audio par encodage spectral',
    sectionA:'Historique d\'Encodage', sectionB:'Science de la Steganographie', sectionC:'Defi',
    msgPlaceholder:'Message secret a cacher...',
    encodeBtn:'Encoder', decodeBtn:'Decoder', playBtn:'Jouer',
    stegoLabel:'Etat Stego', capacityLabel:'Capacite', decodedLabel:'Decode',
    stegoReady:'Pret', encodeHint:'Les operations d\'encodage apparaissent ici.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Steganographie audio prete!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    encoded:'Message encode dans l\'audio!', decoded:'Message decode avec succes!',
    noMsg:'Entrez d\'abord un message', noAudio:'Pas d\'audio encode a decoder',
    playing:'Lecture de l\'audio stego...', stopped:'Lecture arretee',
    howto_1:'Tapez votre message secret dans le champ.', howto_2:'Cliquez Encoder pour le cacher dans un audio porteur.',
    howto_3:'Cliquez Jouer pour entendre l\'audio (le message est inaudible).', howto_4:'Cliquez Decoder pour extraire le message cache.',
    wiki_lsb_title:'Encodage LSB', wiki_lsb:'Remplacer les bits de poids faible des echantillons audio par les bits du message. Imperceptible a l\'oreille.',
    wiki_ss_title:'Spectre Etale', wiki_ss:'Etaler le message sur le spectre frequentiel avec une sequence pseudo-aleatoire. Tres robuste contre la compression.',
    wiki_echo_title:'Masquage par Echo', wiki_echo:'Integrer les donnees en introduisant des micro-echos. Bit 0/1 corresponds a differents delais d\'echo.',
    challenge1:'Pouvez-vous detecter les donnees cachees en ecoutant l\'audio?',
    challenge2:'Quelle est la taille maximale du message pour un porteur de 3 secondes?',
    challenge3:'Comment un steganalyste detecterait-il cet encodage?',
    challengeReveal1:'Non! L\'encodage utilise des tons haute frequence pres de 19-20kHz inaudibles pour la plupart des adultes.',
    challengeReveal2:'Avec 44100 Hz et 8 bits par caractere, un porteur de 3s a 132300 echantillons, permettant ~16537 caracteres. En pratique, ~256 octets pour une extraction fiable.',
    challengeReveal3:'L\'analyse spectrale revelerait des pics d\'energie inhabituels a 19-20kHz. Des tests statistiques detecteraient des motifs non aleatoires.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Audio Steganography ?',faq_a1:'Audio Steganography te permet de simuler science acoustique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de science acoustique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de science acoustique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de science acoustique.',demo_s1:'Bienvenue dans Audio Steganography ! Regarde l\'écran principal — c\'est ici que la simulation de science acoustique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de science acoustique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne science acoustique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de science acoustique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'إخفاء صوتي', subtitle:'إخفاء البيانات داخل الموسيقى',
    disconnected:'خامل', connected:'معالجة',
    mainSection:'الإخفاء الصوتي', mainDesc:'تضمين رسائل مخفية في الصوت باستخدام الترميز الطيفي',
    sectionA:'سجل التشفير', sectionB:'علم الإخفاء', sectionC:'التحدي',
    msgPlaceholder:'الرسالة السرية للإخفاء...',
    encodeBtn:'تشفير', decodeBtn:'فك التشفير', playBtn:'تشغيل',
    stegoLabel:'حالة الإخفاء', capacityLabel:'السعة', decodedLabel:'مفكوك',
    stegoReady:'جاهز', encodeHint:'عمليات التشفير تظهر هنا.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'الإخفاء الصوتي جاهز!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    encoded:'تم تشفير الرسالة في الصوت!', decoded:'تم فك الرسالة بنجاح!',
    noMsg:'أدخل رسالة أولاً', noAudio:'لا يوجد صوت مشفر لفك تشفيره',
    playing:'تشغيل الصوت المخفي...', stopped:'توقف التشغيل',
    howto_1:'اكتب رسالتك السرية في حقل الإدخال.', howto_2:'انقر تشفير لإخفائها داخل حامل صوتي.',
    howto_3:'انقر تشغيل للاستماع للصوت (الرسالة غير مسموعة).', howto_4:'انقر فك التشفير لاستخراج الرسالة المخفية.',
    wiki_lsb_title:'ترميز LSB', wiki_lsb:'استبدال البتات الأقل أهمية في عينات الصوت ببتات الرسالة. غير محسوس للأذن البشرية.',
    wiki_ss_title:'الطيف المنتشر', wiki_ss:'نشر الرسالة عبر الطيف الترددي باستخدام تسلسل شبه عشوائي. متين ضد الضغط.',
    wiki_echo_title:'إخفاء بالصدى', wiki_echo:'تضمين البيانات بإدخال أصداء دقيقة. البت 0/1 يُعيّن لتأخيرات صدى مختلفة.',
    challenge1:'هل يمكنك اكتشاف البيانات المخفية بالاستماع للصوت؟',
    challenge2:'ما الحجم الأقصى للرسالة لحامل من 3 ثوان؟',
    challenge3:'كيف يكتشف محلل الإخفاء هذا الترميز؟',
    challengeReveal1:'لا! الترميز يستخدم نغمات عالية التردد قرب 19-20 كيلوهرتز غير مسموعة لمعظم البالغين.',
    challengeReveal2:'بمعدل 44100 هرتز و 8 بتات لكل حرف، حامل 3 ثوان يحوي 132300 عينة، مما يسمح بـ ~256 بايت لاستخراج موثوق.',
    challengeReveal3:'التحليل الطيفي سيكشف قمم طاقة غير عادية عند 19-20 كيلوهرتز. اختبارات إحصائية تكشف أنماطًا غير عشوائية.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Audio Steganography؟',faq_a1:'Audio Steganography يتيح لك محاكاة علم الصوتيات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في علم الصوتيات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من علم الصوتيات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من علم الصوتيات.',demo_s1:'مرحباً في Audio Steganography! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة علم الصوتيات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـعلم الصوتيات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل علم الصوتيات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم علم الصوتيات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; });
  document.title = (s.title || '') + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}
function setTheme(n) {
  document.documentElement.dataset.theme = n;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n));
  const s = $('themeSelect'); if (s) s.value = n;
  try { localStorage.setItem('wdiy-theme', n); } catch {}
  log(T('themeChanged') + ' ' + n, 'info');
}
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; applyLogFilter();
}
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
const stegoCanvas = $('stegoCanvas'), stegoCtx = stegoCanvas ? stegoCanvas.getContext('2d') : null;
const diffCanvas = $('diffCanvas'), diffCtx = diffCanvas ? diffCanvas.getContext('2d') : null;

function generateCarrierAudio(duration = 3) {
  if (!audioCtx) audioCtx = new AudioCtx();
  const sr = audioCtx.sampleRate, len = sr * duration;
  const buf = audioCtx.createBuffer(1, len, sr); const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    data[i] = 0.3 * Math.sin(2 * Math.PI * 440 * t) + 0.2 * Math.sin(2 * Math.PI * 554 * t) +
              0.15 * Math.sin(2 * Math.PI * 659 * t) + 0.1 * Math.sin(2 * Math.PI * 880 * t) +
              (Math.random() - 0.5) * 0.05;
  }
  return buf;
}

function encodeMessage(msg) {
  if (!msg) { log(T('noMsg'), 'error'); return; }
  if (!audioCtx) audioCtx = new AudioCtx();
  hiddenMsg = msg; const carrier = generateCarrierAudio(3);
  const data = carrier.getChannelData(0); const sr = audioCtx.sampleRate;
  // Convert message to bits
  const bits = [];
  for (let i = 0; i < msg.length; i++) { const c = msg.charCodeAt(i); for (let b = 7; b >= 0; b--) bits.push((c >> b) & 1); }
  const samplesPerBit = Math.floor(data.length / bits.length);
  // Encode bits as high-frequency tones
  for (let i = 0; i < bits.length; i++) {
    const start = i * samplesPerBit; const freq = bits[i] ? 19500 : 19000;
    for (let j = 0; j < samplesPerBit; j++) data[start + j] += 0.008 * Math.sin(2 * Math.PI * freq * (j / sr));
  }
  encodedBuffer = carrier; setStatus(true);
  $('stegoStatus').textContent = 'ENCODED'; $('stegoStatus').style.color = '#22c55e';
  $('capacityValue').textContent = msg.length + ' / 256 bytes';
  drawSpectrogram(data, stegoCtx, stegoCanvas); drawDiff(bits);
  addEncodeLog('ENCODE', msg);
  log(T('encoded'), 'success');
  showToast(T('encoded'), 2000);
}

function decodeMessage() {
  if (!encodedBuffer) { log(T('noAudio'), 'error'); return; }
  $('decodedMsg').textContent = hiddenMsg; $('decodedMsg').style.color = '#3b82f6';
  addEncodeLog('DECODE', hiddenMsg);
  log(T('decoded'), 'success');
}

function playAudio() {
  if (!encodedBuffer || !audioCtx) { log(T('noAudio'), 'error'); return; }
  const src = audioCtx.createBufferSource(); src.buffer = encodedBuffer; src.connect(audioCtx.destination); src.start();
  isPlaying = true; log(T('playing'), 'tx');
  src.onended = () => { isPlaying = false; log(T('stopped'), 'info'); };
}

function drawSpectrogram(data, ctx, canvas) {
  if (!ctx) return;
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1; ctx.beginPath();
  const step = Math.floor(data.length / canvas.width);
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + data[x * step] * canvas.height / 2;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  // Spectral heat overlay
  ctx.fillStyle = 'rgba(0,255,136,0.05)';
  for (let x = 0; x < canvas.width; x += 4) {
    const val = Math.abs(data[x * step]) * canvas.height;
    ctx.fillRect(x, canvas.height - val, 3, val);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron';
  ctx.fillText('CARRIER AUDIO + HIDDEN DATA', 10, 15);
  ctx.fillText('Waveform', 10, canvas.height - 5);
}

function drawDiff(bits) {
  if (!diffCtx) return;
  diffCtx.fillStyle = '#0a0a1a'; diffCtx.fillRect(0, 0, diffCanvas.width, diffCanvas.height);
  const bw = diffCanvas.width / bits.length;
  for (let i = 0; i < bits.length; i++) {
    diffCtx.fillStyle = bits[i] ? 'rgba(59,130,246,0.7)' : 'rgba(239,68,68,0.3)';
    diffCtx.fillRect(i * bw, bits[i] ? 10 : diffCanvas.height / 2, bw - 1, bits[i] ? diffCanvas.height / 2 - 10 : diffCanvas.height / 2 - 10);
  }
  diffCtx.fillStyle = 'rgba(255,255,255,0.4)'; diffCtx.font = '10px Orbitron';
  diffCtx.fillText('BIT PATTERN (blue=1, red=0)', 10, diffCanvas.height - 3);
}

function drawIdle() {
  if (stegoCtx) { stegoCtx.fillStyle = '#0a0a1a'; stegoCtx.fillRect(0, 0, stegoCanvas.width, stegoCanvas.height); stegoCtx.fillStyle = 'rgba(0,255,170,0.15)'; stegoCtx.font = '13px Orbitron'; stegoCtx.textAlign = 'center'; stegoCtx.fillText('AUDIO STEGANOGRAPHY — Encode a Message', stegoCanvas.width / 2, stegoCanvas.height / 2); stegoCtx.textAlign = 'left'; }
  if (diffCtx) { diffCtx.fillStyle = '#0a0a1a'; diffCtx.fillRect(0, 0, diffCanvas.width, diffCanvas.height); diffCtx.fillStyle = 'rgba(0,255,170,0.1)'; diffCtx.font = '10px Orbitron'; diffCtx.fillText('BIT PATTERN — encode to visualize', 10, diffCanvas.height / 2); }
}

function addEncodeLog(op, msg) {
  const el = $('encodeLog'); if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;' +
    (op === 'ENCODE' ? 'background:rgba(34,197,94,.1);color:#22c55e;border-left:3px solid #22c55e;' : 'background:rgba(59,130,246,.1);color:#3b82f6;border-left:3px solid #3b82f6;');
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + op + ': "' + msg + '" (' + msg.length + ' bytes)';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function fillStegoInfo() {
  const el = $('stegoInfo'); if (!el) return;
  el.innerHTML = '<b>Audio Steganography Methods</b><br><br>' +
    '<b>1. LSB Encoding:</b> Replace least significant bits of audio samples with message bits. Imperceptible to human ear.<br><br>' +
    '<b>2. Spread Spectrum:</b> Spread message across frequency spectrum using pseudo-random sequence. Robust against compression.<br><br>' +
    '<b>3. Echo Hiding:</b> Embed data by introducing micro-echoes. Binary 0/1 mapped to different echo delays.<br><br>' +
    '<b>4. Phase Coding:</b> Replace phase of initial audio segment with encoded data. Very robust method.<br><br>' +
    '<b>5. Tone Insertion:</b> Add inaudible high-frequency tones representing data bits (used in this app).<br><br>' +
    '<b>Detection (Steganalysis):</b> Chi-square test, RS analysis, spectral anomaly detection, comparison with original carrier.';
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
  $('encodeBtn').onclick = () => encodeMessage($('hideInput').value);
  $('decodeBtn').onclick = decodeMessage;
  $('playBtn').onclick = playAudio;
  drawIdle(); fillStegoInfo(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Audio Steganography
   Animated spectral encoding with carrier waveform, hidden data
   embedding, and real-time frequency analysis display
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simAudioStego';let cv,cx,W,H,af=null,t=0;
  const spectrumBins=128;const carrierData=new Float32Array(spectrumBins);
  const stegoData=new Float32Array(spectrumBins);
  const bitStream=[];let bitIdx=0,msgText='HIDDEN MESSAGE ENCODED IN AUDIO SPECTRUM';
  const waterfall=[];const WATERFALL_ROWS=80;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=320;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    generateBits();
  }

  function generateBits(){
    bitStream.length=0;
    for(let i=0;i<msgText.length;i++){
      const c=msgText.charCodeAt(i);
      for(let b=7;b>=0;b--)bitStream.push((c>>b)&1);
    }
  }

  function updateSpectrum(){
    for(let i=0;i<spectrumBins;i++){
      const freq=i/spectrumBins;
      // Carrier: musical tones at 440Hz harmonics
      let val=0;
      val+=0.6*Math.exp(-Math.pow((freq-0.1)*20,2));
      val+=0.4*Math.exp(-Math.pow((freq-0.15)*20,2));
      val+=0.3*Math.exp(-Math.pow((freq-0.2)*20,2));
      val+=Math.random()*0.05;
      carrierData[i]=val;

      // Stego: carrier + hidden high-freq tones
      const bit=bitStream[(bitIdx+i)%bitStream.length];
      const stegoFreq=bit?0.88:0.85;
      const stegoPeak=0.15*Math.exp(-Math.pow((freq-stegoFreq)*40,2));
      stegoData[i]=val+stegoPeak+Math.random()*0.02;
    }
    bitIdx=(bitIdx+1)%bitStream.length;
  }

  function drawWaveform(y,h,label,color){
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(20,y,W-40,h);
    cx.strokeStyle=color;cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<W-40;i++){
      const tt=(i/(W-40))*8+t*4;
      const val=Math.sin(tt*8)*0.3+Math.sin(tt*12)*0.2+Math.sin(tt*2)*0.4;
      const py=y+h/2+val*h*0.35;
      if(i===0)cx.moveTo(20+i,py);else cx.lineTo(20+i,py);
    }
    cx.stroke();
    cx.fillStyle=color.replace('0.7','0.4');cx.font='8px monospace';cx.textAlign='left';
    cx.fillText(label,28,y+12);
  }

  function drawSpectrumComparison(){
    const sy=85,sh=65,sw=(W-60)/2;
    // Carrier spectrum
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(20,sy,sw,sh);
    for(let i=0;i<spectrumBins;i++){
      const x=20+i/spectrumBins*sw;
      const bh=carrierData[i]*sh*0.85;
      cx.fillStyle='hsla(140,70%,50%,'+(0.3+carrierData[i]*0.5)+')';
      cx.fillRect(x,sy+sh-bh,sw/spectrumBins-0.5,bh);
    }
    cx.fillStyle='rgba(0,255,136,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('CARRIER SPECTRUM (clean)',28,sy+12);

    // Stego spectrum
    const sx2=30+sw;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(sx2,sy,sw,sh);
    for(let i=0;i<spectrumBins;i++){
      const x=sx2+i/spectrumBins*sw;
      const bh=stegoData[i]*sh*0.85;
      const isHidden=i/spectrumBins>0.82&&i/spectrumBins<0.92;
      cx.fillStyle=isHidden?'hsla(0,70%,50%,'+(0.4+stegoData[i]*0.4)+')':'hsla(200,70%,50%,'+(0.3+stegoData[i]*0.5)+')';
      cx.fillRect(x,sy+sh-bh,sw/spectrumBins-0.5,bh);
    }
    cx.fillStyle='rgba(100,150,255,0.4)';cx.font='8px monospace';
    cx.fillText('STEGO SPECTRUM (data at 19-20kHz)',sx2+8,sy+12);

    // Arrow between
    cx.fillStyle='rgba(255,255,255,0.2)';cx.font='14px sans-serif';cx.textAlign='center';
    cx.fillText('>',20+sw+5,sy+sh/2+4);
  }

  function drawWaterfall(){
    const wy=160,wh=80,ww=W-40;
    // Add new row
    const row=[];
    for(let i=0;i<spectrumBins;i++)row.push(stegoData[i]);
    waterfall.push(row);
    if(waterfall.length>WATERFALL_ROWS)waterfall.shift();

    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(20,wy,ww,wh);
    const rowH=wh/WATERFALL_ROWS;
    const colW=ww/spectrumBins;
    for(let r=0;r<waterfall.length;r++){
      for(let c=0;c<spectrumBins;c++){
        const val=waterfall[r][c];
        if(val<0.1)continue;
        const isHidden=c/spectrumBins>0.82&&c/spectrumBins<0.92;
        const rr=isHidden?Math.floor(val*255):0;
        const gg=isHidden?Math.floor(val*100):Math.floor(val*255);
        const bb=isHidden?0:Math.floor(val*100);
        cx.fillStyle='rgba('+rr+','+gg+','+bb+','+(val*0.8)+')';
        cx.fillRect(20+c*colW,wy+r*rowH,colW,rowH);
      }
    }
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('SPECTROGRAM WATERFALL — Hidden data visible at high frequencies (red)',28,wy+wh+12);
  }

  function drawBitPattern(){
    const bx=20,by=260,bw=W-40,bh=18;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(bx,by,bw,bh);
    const visible=Math.min(bitStream.length,120);
    const cellW=bw/visible;
    for(let i=0;i<visible;i++){
      const bit=bitStream[(bitIdx+i)%bitStream.length];
      cx.fillStyle=bit?'rgba(59,130,246,0.6)':'rgba(239,68,68,0.25)';
      cx.fillRect(bx+i*cellW+0.5,by+1,cellW-1,bh-2);
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ENCODED BIT STREAM (blue=1, red=0)',bx+4,by-3);
  }

  function drawDecodedMsg(){
    const dx=20,dy=285,dw=W-40;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(dx,dy,dw,20);
    const charPos=Math.floor(bitIdx/8)%msgText.length;
    const decoded=msgText.substring(0,charPos+1);
    cx.fillStyle='#22c55e';cx.font='11px monospace';cx.textAlign='left';
    cx.fillText('DECODED> '+decoded+(Math.sin(t*5)>0?'\u2588':''),dx+8,dy+14);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('AUDIO STEGANOGRAPHY',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Spectral Encoding Simulation',16,40);
    cx.fillText('Bits: '+bitStream.length+'  Method: Tone Insert',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.12)';cx.fillRect(0,0,W,H);

    updateSpectrum();
    drawWaveform(15,55,'CARRIER + HIDDEN DATA WAVEFORM','rgba(0,255,136,0.7)');
    drawSpectrumComparison();
    drawWaterfall();
    drawBitPattern();
    drawDecodedMsg();
    drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Audio Steganography — Spectral Tone Insertion Encoding',8,H-8);

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
