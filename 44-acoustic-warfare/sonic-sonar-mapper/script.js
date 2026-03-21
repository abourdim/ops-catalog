/**
 * Sonic Sonar Mapper — Workshop DIY v1.0
 * Echolocation room mapping with PPI radar display
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray;
let animId = null, sweepAngle = 0, pingCount = 0, autoMode = false, points = [];

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
    title:'Sonar Mapper', subtitle:'Echolocation Room Mapping',
    disconnected:'Idle', connected:'Scanning',
    mainSection:'Sonar Mapper', mainDesc:'Map room geometry using sound echoes',
    sectionA:'Echo Log', sectionB:'Sonar Science', sectionC:'Challenge',
    pingBtn:'Send Ping', autoBtn:'Auto Scan', clearMapBtn:'Clear Map', freqLabel:'Freq:',
    echoLabel:'Echo Delay', distLabel:'Distance', mapLabel:'Map Stats',
    echoHint:'Echo measurements appear here.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Sonar Mapper ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    pingSent:'Ping sent', echoDetected:'Echo detected',
    autoStart:'Auto scan started', autoStop:'Auto scan stopped', mapCleared:'Map cleared',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Echo Log" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_echo_title:'Echolocation', wiki_echo:'Distance = (speed of sound x echo delay) / 2. Speed of sound: ~343 m/s at 20C. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_ppi_title:'PPI Display', wiki_ppi:'Plan Position Indicator shows targets as bright dots at their bearing and range from center.',
    wiki_freq_title:'Frequency Choice', wiki_freq:'Low (1-2kHz): better wall reflection, less directional. High (4-8kHz): more directional, better resolution.',
    challenge1:'Why does higher ping frequency give better spatial resolution?',
    challenge2:'Calculate the distance to a wall if the echo returns after 12ms.',
    challenge3:'Why do bats use ultrasound (20-200kHz) instead of audible sound?',
    challengeReveal1:'Higher frequencies have shorter wavelengths, allowing them to resolve smaller features. At 8kHz (~4.3cm wavelength) you detect smaller objects than at 1kHz (~34cm).',
    challengeReveal2:'Distance = (343 m/s x 0.012s) / 2 = 2.058 meters. Divide by 2 because sound travels to the wall and back.',
    challengeReveal3:'Ultrasound has very short wavelengths (1.7-17mm), allowing bats to detect tiny insects. It is also more directional, creating a focused beam.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment.',sectionCode:'Device Code',faq_q1:'What is Sonar Mapper?',faq_a1:'Sonar Mapper lets you map room geometry using sound echoes. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you create a specific acoustic signal with precise frequency and amplitude. Then you the sound wave travels through air, walls, or other media to the target.',faq_q3:'What do the controls do?',faq_a3:'Click Send Ping to emit a short audio chirp. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'المسافة = (سرعة الصوت × تأخير الصدى) / 2. سرعة الصوت: ~343 م/ث عند 20 درجة.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Fence. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Sonar Mapper! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Click Send Ping to emit a short audio chirp. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Echo Log" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how acoustic science works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Sonar Mapper: Map room geometry using sound echoes. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Generate Sound through Propagate to Detect & Capture and Analyze & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Echo Log" and "Sonar Science" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Cartographe Sonar', subtitle:'Cartographie par Echolocalisation',
    disconnected:'Inactif', connected:'Balayage',
    mainSection:'Cartographe Sonar', mainDesc:'Cartographier la geometrie de la piece par echos sonores',
    sectionA:'Journal d\'Echos', sectionB:'Science du Sonar', sectionC:'Defi',
    pingBtn:'Envoyer Ping', autoBtn:'Balayage Auto', clearMapBtn:'Effacer Carte', freqLabel:'Freq:',
    echoLabel:'Delai d\'Echo', distLabel:'Distance', mapLabel:'Stats Carte',
    echoHint:'Les mesures d\'echo apparaissent ici.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Cartographe Sonar pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    pingSent:'Ping envoye', echoDetected:'Echo detecte',
    autoStart:'Balayage auto demarre', autoStop:'Balayage auto arrete', mapCleared:'Carte effacee',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_echo_title:'Echolocalisation', wiki_echo:'Distance = (vitesse du son x delai d\'echo) / 2. Vitesse du son: ~343 m/s a 20C.',
    wiki_ppi_title:'Affichage PPI', wiki_ppi:'L\'Indicateur de Position en Plan montre les cibles comme des points lumineux.',
    wiki_freq_title:'Choix de Frequence', wiki_freq:'Basse (1-2kHz): meilleure reflexion. Haute (4-8kHz): plus directionnelle, meilleure resolution.',
    challenge1:'Pourquoi une frequence plus elevee donne-t-elle une meilleure resolution?',
    challenge2:'Calculez la distance si l\'echo revient apres 12ms.',
    challenge3:'Pourquoi les chauves-souris utilisent-elles les ultrasons?',
    challengeReveal1:'Les frequences elevees ont des longueurs d\'onde plus courtes, permettant de resoudre des details plus fins.',
    challengeReveal2:'Distance = (343 m/s x 0.012s) / 2 = 2.058 metres.',
    challengeReveal3:'Les ultrasons ont des longueurs d\'onde tres courtes (1.7-17mm), permettant de detecter de minuscules insectes.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Sonar Mapper ?',faq_a1:'Sonar Mapper te permet de simuler science acoustique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de science acoustique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de science acoustique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de science acoustique.',demo_s1:'Bienvenue dans Sonar Mapper ! Regarde l\'écran principal — c\'est ici que la simulation de science acoustique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de science acoustique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne science acoustique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de science acoustique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Sonar Mapper : Map room geometry using sound echoes. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'مسح السونار', subtitle:'رسم خرائط بالصدى',
    disconnected:'خامل', connected:'مسح',
    mainSection:'مسح السونار', mainDesc:'رسم خريطة الغرفة باستخدام أصداء الصوت',
    sectionA:'سجل الأصداء', sectionB:'علم السونار', sectionC:'التحدي',
    pingBtn:'إرسال نبضة', autoBtn:'مسح تلقائي', clearMapBtn:'مسح الخريطة', freqLabel:'التردد:',
    echoLabel:'تأخير الصدى', distLabel:'المسافة', mapLabel:'إحصائيات الخريطة',
    echoHint:'قياسات الصدى تظهر هنا.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'مسح السونار جاهز!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    pingSent:'تم إرسال النبضة', echoDetected:'تم اكتشاف الصدى',
    autoStart:'بدأ المسح التلقائي', autoStop:'توقف المسح التلقائي', mapCleared:'تم مسح الخريطة',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_echo_title:'الاستدلال بالصدى', wiki_echo:'المسافة = (سرعة الصوت × تأخير الصدى) / 2. سرعة الصوت: ~343 م/ث عند 20 درجة.',
    wiki_ppi_title:'عرض PPI', wiki_ppi:'مؤشر الموضع المستوي يظهر الأهداف كنقاط مضيئة عند اتجاهها ومداها من المركز.',
    wiki_freq_title:'اختيار التردد', wiki_freq:'منخفض (1-2 كيلوهرتز): انعكاس أفضل. مرتفع (4-8 كيلوهرتز): أكثر اتجاهية ودقة أعلى.',
    challenge1:'لماذا يعطي التردد الأعلى دقة مكانية أفضل؟',
    challenge2:'احسب المسافة إلى الجدار إذا عاد الصدى بعد 12 مللي ثانية.',
    challenge3:'لماذا تستخدم الخفافيش الموجات فوق الصوتية بدلاً من الصوت المسموع؟',
    challengeReveal1:'الترددات العالية لها أطوال موجية أقصر، مما يسمح بتمييز تفاصيل أصغر.',
    challengeReveal2:'المسافة = (343 م/ث × 0.012 ث) / 2 = 2.058 متر. نقسم على 2 لأن الصوت يذهب ويعود.',
    challengeReveal3:'الموجات فوق الصوتية لها أطوال موجية قصيرة جدًا (1.7-17 مم)، مما يسمح للخفافيش باكتشاف حشرات صغيرة.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Sonar Mapper؟',faq_a1:'Sonar Mapper يتيح لك محاكاة علم الصوتيات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في علم الصوتيات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من علم الصوتيات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من علم الصوتيات.',demo_s1:'مرحباً في Sonar Mapper! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة علم الصوتيات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـعلم الصوتيات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل علم الصوتيات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم علم الصوتيات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Sonar Mapper: Map room geometry using sound echoes. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = (s.title || 'Sonar') + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged || '', 'info'); }
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

/* ═══════ PPI SONAR CANVAS ═══════ */
const canvas = $('sonarCanvas'), ctx = canvas ? canvas.getContext('2d') : null;
const cx = canvas ? canvas.width / 2 : 0, cy = canvas ? canvas.height / 2 : 0, maxR = Math.min(cx, cy) - 20;

function drawSonar() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(10,10,26,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  // PPI range circles
  ctx.strokeStyle = 'rgba(0,255,170,0.15)'; ctx.lineWidth = 1;
  for (let r = 1; r <= 4; r++) { ctx.beginPath(); ctx.arc(cx, cy, maxR * r / 4, 0, Math.PI * 2); ctx.stroke(); }
  // Cross hairs
  ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
  // Sweep line with glow
  sweepAngle += 0.02; if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0, 'rgba(0,255,100,0.3)'); grad.addColorStop(1, 'rgba(0,255,100,0)');
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(sweepAngle);
  ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, maxR, -0.15, 0.15); ctx.fill();
  ctx.restore();
  // Sweep line
  ctx.strokeStyle = 'rgba(0,255,100,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR); ctx.stroke();
  // Echo points with fade
  const now = Date.now();
  points = points.filter(p => now - p.time < 5000);
  points.forEach(p => {
    const age = (now - p.time) / 5000; const alpha = 1 - age;
    ctx.fillStyle = `rgba(0,255,100,${alpha})`; ctx.beginPath();
    ctx.arc(cx + p.x, cy + p.y, 3 + alpha * 3, 0, Math.PI * 2); ctx.fill();
  });
  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - maxR - 5); ctx.fillText('S', cx, cy + maxR + 12);
  ctx.fillText('E', cx + maxR + 10, cy + 4); ctx.fillText('W', cx - maxR - 10, cy + 4);
  ctx.textAlign = 'left'; ctx.fillText('SONAR PPI', 10, 15);
  for (let r = 1; r <= 4; r++) ctx.fillText((r * 2.5).toFixed(1) + 'm', cx + maxR * r / 4 - 15, cy - 3);
  if (freqArray && analyser) analyser.getByteFrequencyData(freqArray);
  animId = requestAnimationFrame(drawSonar);
}

async function sendPing() {
  if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
  if (!analyser) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const src = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 4096;
      src.connect(analyser); freqArray = new Uint8Array(analyser.frequencyBinCount); dataArray = new Uint8Array(analyser.fftSize);
      setStatus(true); if (!animId) drawSonar();
    } catch (e) { log('Mic denied', 'error'); return; }
  }
  // Emit ping chirp
  const freq = parseInt($('pingFreqSelect').value);
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); osc.frequency.value = freq; osc.type = 'sine';
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  pingCount++;
  // Simulate echo detection
  const delay = 20 + Math.random() * 80;
  setTimeout(() => {
    const dist = delay * 0.343 / 2;
    const angle = sweepAngle + Math.random() * 0.5 - 0.25;
    const r = (dist / 10) * maxR;
    points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, time: Date.now(), dist });
    $('echoDelay').textContent = delay.toFixed(1) + ' ms';
    $('distValue').textContent = dist.toFixed(2) + ' m';
    addEchoLog(delay, dist);
  }, delay);
  log(T('pingSent'), 'tx');
  $('mapStats').innerHTML = 'Pings: ' + pingCount + '<br>Points: ' + points.length + '<br>Freq: ' + freq + ' Hz';
}

function addEchoLog(delay, dist) {
  const el = $('echoLog'); if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;';
  d.textContent = '[' + new Date().toLocaleTimeString() + '] Echo: ' + delay.toFixed(1) + 'ms = ' + dist.toFixed(2) + 'm';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function fillSonarInfo() {
  const el = $('sonarInfo'); if (!el) return;
  el.innerHTML = '<b>Acoustic Echolocation</b><br>Distance = (speed of sound x echo delay) / 2<br>Speed of sound: ~343 m/s at 20C<br><br>' +
    '<b>PPI Display:</b> Plan Position Indicator shows targets as dots at bearing and range from center. The rotating sweep line reveals new contacts.<br><br>' +
    '<b>Frequency choice:</b><br>- Low (1-2 kHz): Better wall reflection, less directional<br>- High (4-8 kHz): More directional, better resolution<br><br>' +
    '<b>Chirp vs Tone:</b> Real sonar uses chirp signals (frequency sweep) for better SNR via matched filtering. Our simplified version uses pure tone pings.<br><br>' +
    '<b>Applications:</b> Room mapping, obstacle detection, underwater sonar, bat navigation, autonomous vehicles, parking sensors.';
}

let autoInterval;
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
  $('pingBtn').onclick = sendPing;
  $('autoBtn').onclick = () => {
    if (autoMode) { clearInterval(autoInterval); autoMode = false; $('autoBtn').textContent = '\u{1F504} ' + T('autoBtn').replace(/.*\s/, ''); log(T('autoStop'), 'info'); }
    else { autoMode = true; autoInterval = setInterval(sendPing, 1500); $('autoBtn').textContent = '\u23F9 Stop'; log(T('autoStart'), 'success'); }
  };
  $('clearMapBtn').onclick = () => { points = []; pingCount = 0; log(T('mapCleared'), 'info'); };
  if (ctx) { ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height); drawSonar(); }
  fillSonarInfo(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Sonar Mapper
   Animated PPI radar display with echo points, room geometry
   reconstruction, and acoustic pulse propagation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simSonarMapper';let cv,cx,W,H,af=null,t=0;
  const echoPoints=[];const pulses=[];let sweep=0;
  const roomWalls=[];let simPings=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=320;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a14;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    generateRoom();
  }

  function generateRoom(){
    roomWalls.length=0;
    const cx2=W*0.3,cy2=H/2,r=120;
    // Irregular room polygon
    for(let a=0;a<Math.PI*2;a+=0.15){
      const dist=r*(0.6+0.4*Math.sin(a*3)*Math.cos(a*2)+0.2*Math.sin(a*5));
      roomWalls.push({x:cx2+Math.cos(a)*dist,y:cy2+Math.sin(a)*dist,angle:a,dist:dist});
    }
  }

  class SonarPulse{
    constructor(x,y){this.x=x;this.y=y;this.r=0;this.maxR=150;this.alpha=0.4;}
    update(){this.r+=2;this.alpha=0.4*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();cx.arc(this.x,this.y,this.r,0,Math.PI*2);
      cx.strokeStyle='rgba(0,255,100,'+this.alpha+')';cx.lineWidth=2;cx.stroke();
    }
  }

  function drawPPIDisplay(){
    const pcx=W*0.3,pcy=H/2,pr=130;
    // Range circles
    cx.strokeStyle='rgba(0,255,170,0.1)';cx.lineWidth=0.5;
    for(let r=1;r<=4;r++){cx.beginPath();cx.arc(pcx,pcy,pr*r/4,0,Math.PI*2);cx.stroke();}
    // Cross hairs
    cx.beginPath();cx.moveTo(pcx-pr,pcy);cx.lineTo(pcx+pr,pcy);
    cx.moveTo(pcx,pcy-pr);cx.lineTo(pcx,pcy+pr);cx.stroke();
    // Sweep line
    const grad=cx.createRadialGradient(pcx,pcy,0,pcx,pcy,pr);
    grad.addColorStop(0,'rgba(0,255,100,0.25)');grad.addColorStop(1,'rgba(0,255,100,0)');
    cx.save();cx.translate(pcx,pcy);cx.rotate(sweep);
    cx.fillStyle=grad;cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,pr,-0.12,0.12);cx.fill();
    cx.restore();
    // Sweep line
    cx.strokeStyle='rgba(0,255,100,0.7)';cx.lineWidth=1.5;
    cx.beginPath();cx.moveTo(pcx,pcy);
    cx.lineTo(pcx+Math.cos(sweep)*pr,pcy+Math.sin(sweep)*pr);cx.stroke();
    // Echo points
    const now=Date.now();
    for(let i=echoPoints.length-1;i>=0;i--){
      const p=echoPoints[i];
      const age=(now-p.time)/6000;
      if(age>1){echoPoints.splice(i,1);continue;}
      const alpha=1-age;
      cx.fillStyle='rgba(0,255,100,'+alpha+')';cx.beginPath();
      cx.arc(pcx+p.dx,pcy+p.dy,2+alpha*3,0,Math.PI*2);cx.fill();
    }
    // Cardinal labels
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='9px monospace';cx.textAlign='center';
    cx.fillText('N',pcx,pcy-pr-6);cx.fillText('S',pcx,pcy+pr+12);
    cx.fillText('E',pcx+pr+10,pcy+4);cx.fillText('W',pcx-pr-10,pcy+4);
    // Range labels
    for(let r=1;r<=4;r++)cx.fillText((r*2.5).toFixed(1)+'m',pcx+pr*r/4-10,pcy-4);
    // Center emitter
    cx.save();cx.shadowColor='#00ff88';cx.shadowBlur=6;
    cx.fillStyle='#00ff88';cx.beginPath();cx.arc(pcx,pcy,4,0,Math.PI*2);cx.fill();
    cx.restore();
  }

  function drawRoomReconstruction(){
    const rx=W*0.6+10,ry=20,rw=W*0.4-30,rh=H/2-30;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(rx,ry,rw,rh);
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ROOM RECONSTRUCTION',rx+8,ry+12);
    // Draw reconstructed walls from echo points
    if(echoPoints.length>2){
      const scaleX=rw/(300),scaleY=rh/(300);
      cx.strokeStyle='rgba(0,200,255,0.4)';cx.lineWidth=1.5;cx.beginPath();
      echoPoints.forEach((p,i)=>{
        const x=rx+rw/2+p.dx*scaleX;
        const y=ry+rh/2+p.dy*scaleY;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.closePath();cx.stroke();
      // Fill translucent
      cx.fillStyle='rgba(0,200,255,0.05)';cx.fill();
    }
  }

  function drawEchoTimeline(){
    const ex=W*0.6+10,ey=H/2,ew=W*0.4-30,eh=60;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(ex,ey,ew,eh);
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ECHO DELAY TIMELINE',ex+8,ey+10);
    // Show recent echo delays as bars
    const recent=echoPoints.slice(-20);
    const barW=ew/20;
    recent.forEach((p,i)=>{
      const delay=Math.sqrt(p.dx*p.dx+p.dy*p.dy)/2;
      const bh=delay/150*eh*0.7;
      cx.fillStyle='rgba(0,255,100,'+(0.3+bh/eh*0.5)+')';
      cx.fillRect(ex+i*barW+1,ey+eh-bh-5,barW-2,bh);
    });
  }

  function drawFreqResponse(){
    const fx=W*0.6+10,fy=H/2+70,fw=W*0.4-30,fh=50;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(fx,fy,fw,fh);
    cx.strokeStyle='rgba(0,200,255,0.5)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<fw;i++){
      const freq=i/fw*8;
      const resp=Math.exp(-freq*0.3)*(0.8+0.2*Math.sin(freq*4+t*2));
      const y=fy+fh-resp*fh*0.8;
      if(i===0)cx.moveTo(fx+i,y);else cx.lineTo(fx+i,y);
    }
    cx.stroke();
    cx.fillStyle='rgba(100,200,255,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ECHO FREQUENCY RESPONSE — 0 Hz         8 kHz',fx+8,fy+fh+10);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('SONAR PPI MAPPER',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Pings: '+simPings+'  Points: '+echoPoints.length,16,40);
    cx.fillText('Chirp: 4 kHz  Speed: 343 m/s',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    sweep+=0.02;if(sweep>Math.PI*2)sweep-=Math.PI*2;
    cx.fillStyle='rgba(6,10,20,0.08)';cx.fillRect(0,0,W,H);

    // Auto-ping and generate echoes
    if(Math.floor(t*60)%40===0){
      simPings++;
      pulses.push(new SonarPulse(W*0.3,H/2));
      // Generate echo from "room"
      const wall=roomWalls[Math.floor(Math.random()*roomWalls.length)];
      const angle=sweep+Math.random()*0.5-0.25;
      const dist=40+Math.random()*90;
      echoPoints.push({dx:Math.cos(angle)*dist,dy:Math.sin(angle)*dist,time:Date.now()});
    }

    drawPPIDisplay();

    for(let i=pulses.length-1;i>=0;i--){
      if(!pulses[i].update())pulses.splice(i,1);
      else pulses[i].draw();
    }

    drawRoomReconstruction();drawEchoTimeline();drawFreqResponse();drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Acoustic Echolocation — PPI Sonar Room Mapping',8,H-8);

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
