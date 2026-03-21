/**
 * imp-hardware-trojan-designer — Workshop DIY
 * IC-level hardware trojan design and detection simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="50" height="50" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="32" y="32" width="36" height="36" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="50" cy="50" r="8" fill="currentColor" opacity=".3"/><line x1="25" y1="35" x2="15" y2="35" stroke="currentColor" stroke-width="2"/><line x1="25" y1="50" x2="15" y2="50" stroke="currentColor" stroke-width="2"/><line x1="25" y1="65" x2="15" y2="65" stroke="currentColor" stroke-width="2"/><line x1="75" y1="35" x2="85" y2="35" stroke="currentColor" stroke-width="2"/><line x1="75" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="2"/><line x1="75" y1="65" x2="85" y2="65" stroke="currentColor" stroke-width="2"/><line x1="35" y1="25" x2="35" y2="15" stroke="currentColor" stroke-width="2"/><line x1="50" y1="25" x2="50" y2="15" stroke="currentColor" stroke-width="2"/><line x1="65" y1="25" x2="65" y2="15" stroke="currentColor" stroke-width="2"/><line x1="35" y1="75" x2="35" y2="85" stroke="currentColor" stroke-width="2"/><line x1="50" y1="75" x2="50" y2="85" stroke="currentColor" stroke-width="2"/><line x1="65" y1="75" x2="65" y2="85" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];const APP_VERSION = '1.0';
let soundEnabled = false;const AudioCtx = window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

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
    title:'Hardware Trojan Designer', subtitle:'🔬 design · 🧬 implant · 🛡️ detect',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Hardware Trojan Designer — IC Backdoor Lab',
    mainDesc:'Design and detect hardware trojans at the integrated circuit level',
    sectionA:'How It Works', sectionB:'Lab — IC Gate Visualizer', sectionC:'Challenge',
    insertBtn:'Insert Trojan', analyzeBtn:'Analyze IC', detectBtn:'Run Detection',
    howStep1:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',
    howStep2:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',
    howStep3:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',
    howStep4:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',
    ready:'🔬 Hardware Trojan Designer ready — select trojan type!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',
    langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',step1Title:'Design Implant',step1Desc:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',step2Title:'Build & Program',step2Desc:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',step3Title:'Deploy',step3Desc:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',step4Title:'Monitor & Extract',step4Desc:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',sectionCode:'Device Code',faq_q1:'What is Hardware Trojan Designer?',faq_a1:'Hardware Trojan Designer lets you design and detect hardware trojans at the integrated circuit level. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you hardware trojans are malicious modifications to integrated circuits during design or fabrication. Then you they can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real hardware security principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Imp Covert Audio Implant and Imp Evil Maid Toolkit. Each app in this category teaches a different aspect of hardware security.',demo_s1:'Welcome to Hardware Trojan Designer! Look at the main display — this is where the hardware security simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of hardware security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how hardware security works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches hardware security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab — IC Gate Visualizer" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Hardware Trojan Designer', subtitle:'🔬 concevoir · 🧬 implanter · 🛡️ détecter',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Concepteur de trojan matériel',mainDesc:'Concevoir et détecter les trojans matériels au niveau IC',
    sectionA:'Comment ça marche',sectionB:'Labo — Portes logiques',sectionC:'Défi',
    insertBtn:'Insérer',analyzeBtn:'Analyser',detectBtn:'Détecter',
    ready:'🔬 Concepteur de trojan prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',step2Title:'Construire et programmer',step2Desc:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',step3Title:'Déployer',step3Desc:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',step4Title:'Surveiller et extraire',step4Desc:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Hardware Trojan Designer ?',faq_a1:'Hardware Trojan Designer te permet de simuler sécurité matérielle. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de sécurité matérielle. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de sécurité matérielle. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de sécurité matérielle.',demo_s1:'Bienvenue dans Hardware Trojan Designer ! Regarde l\'écran principal — c\'est ici que la simulation de sécurité matérielle fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de sécurité matérielle.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne sécurité matérielle en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de sécurité matérielle par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chiffrer et Décoder',ch1Desc:'Chiffre un message puis essaie de le décoder manuellement sans regarder la clé. Quels motifs repères-tu dans le texte chiffré ?',ch2Title:'Test de Furtivité',ch2Desc:'Essaie de compléter la mission avec l\'empreinte signal la plus faible possible. Peux-tu descendre sous le seuil de détection ?',ch3Title:'Course à l\'Interception',ch3Desc:'Lance une transmission et mesure le temps de détection. Qu\'est-ce qui affecte ce délai ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'Hardware Trojan Designer', subtitle:'🔬 تصميم · 🧬 زرع · 🛡️ كشف',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'مصمم أحصنة طروادة — مختبر الدوائر المتكاملة',
    mainDesc:'تصميم وكشف أحصنة طروادة على مستوى الدوائر المتكاملة',
    sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
    insertBtn:'إدراج',analyzeBtn:'تحليل',detectBtn:'كشف',
    ready:'🔬 مصمم أحصنة طروادة جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',
    langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',step2Title:'بناء وبرمجة',step2Desc:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',step3Title:'نشر',step3Desc:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',step4Title:'مراقبة واستخراج',step4Desc:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',sectionCode:'كود الجهاز',faq_q1:'ما هو Hardware Trojan Designer؟',faq_a1:'Hardware Trojan Designer يتيح لك محاكاة أمن الأجهزة. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في أمن الأجهزة. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من أمن الأجهزة. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من أمن الأجهزة.',demo_s1:'مرحباً في Hardware Trojan Designer! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة أمن الأجهزة.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـأمن الأجهزة.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل أمن الأجهزة من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم أمن الأجهزة من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تشفير وفك تشفير',ch1Desc:'شفّر رسالة ثم حاول فك تشفيرها يدوياً بدون النظر للمفتاح. ما الأنماط التي تلاحظها؟',ch2Title:'اختبار التخفي',ch2Desc:'حاول إكمال المهمة بأقل بصمة إشارة ممكنة. هل يمكنك النزول تحت عتبة الكشف؟',ch3Title:'سباق الاعتراض',ch3Desc:'ابدأ بثاً وقِس سرعة اعتراضه. ما الذي يؤثر على وقت الكشف؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click()}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter()})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}

function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open')}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}

let matrixRunning=false,matrixAnim=null;
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: HARDWARE TROJAN DESIGNER ═══════ */
let trojanInserted = false;
let gateParticles = [];
let waveTime = 0;
let trojanGates = [];

// IC gate definitions
const gates = [
  {id:'and1',type:'AND',x:0.25,y:0.25,inputs:2,trojan:false},
  {id:'or1',type:'OR',x:0.25,y:0.55,inputs:2,trojan:false},
  {id:'nand1',type:'NAND',x:0.5,y:0.2,inputs:2,trojan:false},
  {id:'xor1',type:'XOR',x:0.5,y:0.5,inputs:2,trojan:false},
  {id:'nor1',type:'NOR',x:0.5,y:0.8,inputs:2,trojan:false},
  {id:'buf1',type:'BUF',x:0.75,y:0.35,inputs:1,trojan:false},
  {id:'inv1',type:'INV',x:0.75,y:0.65,inputs:1,trojan:false},
];
const wires = [['and1','nand1'],['or1','xor1'],['nand1','buf1'],['xor1','inv1'],['nor1','inv1']];

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=15){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=15){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // IC Package outline
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.setLineDash([]);
    ctx.strokeRect(40,20,canvas.width-80,canvas.height-40);
    ctx.fillStyle=accent;ctx.font='7px Orbitron';ctx.fillText('IC DIE',canvas.width/2-12,35);

    // Pins
    for(let i=0;i<6;i++){
      ctx.fillStyle='#555';ctx.fillRect(10,35+i*35,30,8); // left pins
      ctx.fillRect(canvas.width-40,35+i*35,30,8); // right pins
    }
    for(let i=0;i<4;i++){
      ctx.fillRect(80+i*80,canvas.height-18,8,18); // bottom pins
      ctx.fillRect(80+i*80,0,8,18); // top pins
    }

    // Wires between gates
    wires.forEach(([a,b])=>{
      const ga=gates.find(g=>g.id===a),gb=gates.find(g=>g.id===b);
      if(!ga||!gb)return;
      const ax=ga.x*canvas.width,ay=ga.y*(canvas.height-60)+30;
      const bx=gb.x*canvas.width,by=gb.y*(canvas.height-60)+30;
      ctx.strokeStyle=(ga.trojan||gb.trojan)?'#ff3333':'#335533';
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ax+15,ay);ctx.lineTo(bx-15,by);ctx.stroke();
    });

    // Gates
    gates.forEach(g=>{
      const gx=g.x*canvas.width,gy=g.y*(canvas.height-60)+30;
      ctx.fillStyle=g.trojan?'#330000':'#112211';
      ctx.strokeStyle=g.trojan?'#ff3333':accent;
      ctx.lineWidth=g.trojan?2:1.5;
      ctx.beginPath();ctx.roundRect(gx-18,gy-12,36,24,3);ctx.fill();ctx.stroke();

      // Gate label
      ctx.fillStyle=g.trojan?'#ff3333':accent;ctx.font='8px Orbitron';ctx.textAlign='center';
      ctx.fillText(g.type,gx,gy+3);ctx.textAlign='left';

      // Trojan blink
      if(g.trojan){
        const b=Math.sin(waveTime*5+g.x*10)>0;
        ctx.fillStyle=b?'#ff0000':'#440000';
        ctx.beginPath();ctx.arc(gx+14,gy-8,2.5,0,Math.PI*2);ctx.fill();
      }
    });

    // Trojan trigger line (if inserted)
    if(trojanInserted){
      const tg=gates.filter(g=>g.trojan);
      if(tg.length>=2){
        ctx.strokeStyle='#ff3333';ctx.lineWidth=1;ctx.setLineDash([3,4]);
        const a=tg[0],b=tg[tg.length-1];
        ctx.beginPath();ctx.moveTo(a.x*canvas.width,a.y*(canvas.height-60)+30);
        ctx.lineTo(b.x*canvas.width,b.y*(canvas.height-60)+30);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle='#ff3333';ctx.font='7px Orbitron';
        ctx.fillText('TROJAN PATH',(a.x+b.x)/2*canvas.width-25,(a.y+b.y)/2*(canvas.height-60)+20);
      }
    }

    // Particles
    for(let i=gateParticles.length-1;i>=0;i--){
      const p=gateParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){gateParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color||'#33ff33';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();
      if(p.label){ctx.font='6px Orbitron';ctx.fillText(p.label,p.x+4,p.y-2)}
      ctx.globalAlpha=1;
    }

    // Status bar
    const tCount=gates.filter(g=>g.trojan).length;
    ctx.fillStyle=trojanInserted?'rgba(255,51,51,0.15)':'rgba(51,255,51,0.1)';
    ctx.fillRect(50,canvas.height-25,canvas.width-100,10);
    ctx.fillStyle=trojanInserted?'#ff3333':'#33ff33';ctx.font='9px Orbitron';
    ctx.fillText(`GATES: ${gates.length} | TROJANS: ${tCount} | ${($('trojanTypeSelect')||{}).value||'combinational'}`,50,canvas.height-8);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnGateParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;
  for(let i=0;i<count;i++){
    const g=gates[Math.floor(Math.random()*gates.length)];
    gateParticles.push({x:g.x*canvas.width,y:g.y*(canvas.height-60)+30,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:0.4+Math.random()*0.4,color:color||'#33ff33',size:2+Math.random()*2,label:Math.random()>0.7?['SIG','CLK','RST','VDD','GND'][Math.floor(Math.random()*5)]:null});
  }
}

function initTrojanSim(){
  const insertBtn=$('insertBtn'),analyzeBtn=$('analyzeBtn'),detectBtn=$('detectBtn');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(insertBtn)insertBtn.addEventListener('click',()=>{
    trojanInserted=!trojanInserted;
    insertBtn.textContent=trojanInserted?'Remove Trojan':(LANG[currentLang].insertBtn||'Insert Trojan');
    if(implantDot)implantDot.classList.toggle('active',trojanInserted);
    if(implantStatusText)implantStatusText.textContent=trojanInserted?'Trojan: INSERTED':'Trojan: Clean';
    setStatus(trojanInserted);

    if(trojanInserted){
      const type=($('trojanTypeSelect')||{}).value||'combinational';
      // Mark 2-3 random gates as trojaned
      trojanGates=[];
      const indices=[...Array(gates.length).keys()].sort(()=>Math.random()-0.5).slice(0,2+Math.floor(Math.random()*2));
      gates.forEach((g,i)=>g.trojan=indices.includes(i));
      trojanGates=gates.filter(g=>g.trojan);
      log(`🧬 Hardware trojan inserted — ${trojanGates.length} gates modified (${type})`,'success');
      showToast('Inserting trojan into IC...',1500);
      spawnGateParticles(20,'#ff3333');
      if(dataLog)dataLog.textContent=`Trojan type: ${type}\nAffected gates: ${trojanGates.map(g=>g.id).join(', ')}\nTrigger: ${type==='sequential'?'Counter-based (2^32 cycles)':'Rare input combination'}`;
    }else{
      gates.forEach(g=>g.trojan=false);trojanGates=[];
      log('🧹 Trojan removed — IC restored to clean state','info');
      spawnGateParticles(15,'#33ff33');
    }
  });

  if(analyzeBtn)analyzeBtn.addEventListener('click',()=>{
    showToast('Analyzing IC layout...',2500);log('🔬 Running IC analysis...','info');
    spawnGateParticles(20,'#4488ff');
    setTimeout(()=>{
      const analysis=['IC ANALYSIS REPORT','══════════════════',`Total gates: ${gates.length}`,`Gate types: AND, OR, NAND, XOR, NOR, BUF, INV`,`Die area: ${(2.1+Math.random()*1.5).toFixed(1)}mm²`,`Process: 28nm CMOS`,`Power: ${(0.8+Math.random()*2).toFixed(1)}mW`,`Clock: ${(100+Math.floor(Math.random()*900))}MHz`,'',trojanInserted?`⚠️ ANOMALY: ${trojanGates.length} gates show unusual connectivity`:'✅ No structural anomalies detected',trojanInserted?`Suspicious area: ${(0.01+Math.random()*0.05).toFixed(3)}mm² (${(0.5+Math.random()*2).toFixed(1)}% of die)`:'All gates match reference netlist'].join('\n');
      if(outputDisplay)outputDisplay.textContent=analysis;
      log(trojanInserted?'⚠️ IC analysis found anomalies':'✅ IC analysis clean',trojanInserted?'error':'success');
      hideToast();
    },2000);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Running trojan detection suite...',3000);log('🛡️ Multi-method trojan detection...','info');
    spawnGateParticles(25,'#d4a03c');
    let step=0;
    const methods=['Side-channel power analysis','EM emanation scan','Path delay fingerprinting','Logic testing (ATPG)','Golden chip comparison'];
    const iv=setInterval(()=>{
      if(step<methods.length){log(`🔍 ${methods[step]}...`,'info');spawnGateParticles(5,'#d4a03c');step++}
      else{
        clearInterval(iv);
        const detected=trojanInserted&&Math.random()>0.2;
        const result=detected?['⚠️ TROJAN DETECTED','══════════════════','Method: Side-channel power analysis','Confidence: '+(85+Math.floor(Math.random()*15))+'%','Location: Gates '+trojanGates.map(g=>g.id).join(', '),'Type: '+(($('trojanTypeSelect')||{}).value||'combinational'),'','Power anomaly: +'+((Math.random()*0.5)+0.1).toFixed(2)+'mW','Path delay delta: +'+((Math.random()*50)+10).toFixed(0)+'ps','Recommendation: QUARANTINE IC'].join('\n'):['✅ NO TROJAN DETECTED','══════════════════','Power profile: Normal','EM signature: Clean','Path delays: Within tolerance','Logic test coverage: 98.7%','','IC appears genuine.'].join('\n');
        if(outputDisplay)outputDisplay.textContent=result;
        log(detected?'🚨 Hardware trojan detected!':'✅ Detection suite clean',detected?'error':'success');
        hideToast();
      }
    },500);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{
    spawnGateParticles(30,'#d4a03c');log('📡 Full IC characterization sweep...','info');
    showToast('Characterizing IC...',3000);
    let step=0;const phases=['Power profiling','Timing analysis','Leakage measurement','Thermal imaging','X-ray inspection'];
    const iv=setInterval(()=>{if(step<phases.length){if(dataLog)dataLog.textContent+=`\n[SWEEP] ${phases[step]}...`;step++}else{clearInterval(iv);log('📡 IC characterization complete','success')}},500);
  });
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate();initSimCanvas();initTrojanSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();


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
