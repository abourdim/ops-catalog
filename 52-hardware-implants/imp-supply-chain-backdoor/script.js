/**
 * imp-supply-chain-backdoor — Workshop DIY
 * Supply chain hardware backdoor / interdiction simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="30" width="70" height="45" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><line x1="15" y1="45" x2="85" y2="45" stroke="currentColor" stroke-width="1.5"/><circle cx="75" cy="38" r="3" fill="currentColor"/><rect x="30" y="50" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="55" y="50" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="43" cy="55" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="25" y="20" width="15" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="32" y1="30" x2="32" y2="45" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/><rect x="70" y="65" width="8" height="5" rx="1" fill="currentColor" opacity=".6"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false; const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08; const t = audioCtx.currentTime; if (type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)} else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)} else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)} }

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
    ...LANG_BASE.en, title:'Supply Chain Backdoor', subtitle:'📦 intercept · 🔬 implant · 🛡️ verify', disconnected:'Disconnected', connected:'Connected', mainSection:'Supply Chain Backdoor — Hardware Interdiction Sim', mainDesc:'Simulate supply chain interdiction attacks and learn hardware verification techniques', sectionA:'How It Works', sectionB:'Lab — Motherboard Inspector', sectionC:'Challenge', ready:'📦 Supply Chain Backdoor sim ready!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed', working:'Working…', langChanged:'🌐 English', themeChanged:'🎨 Theme →', splashHint:'tap to skip' ,step1Title:'Design Implant',step1Desc:'Choose the hardware components and design the covert device.',step2Title:'Build & Program',step2Desc:'Assemble the implant and flash it with the custom firmware.',step3Title:'Deploy',step3Desc:'Install the implant in the target environment undetected.',step4Title:'Monitor & Extract',step4Desc:'Receive data from the implant and extract captured intelligence.',sectionCode:'Device Code',faq_q1:'What is Supply Chain Backdoor?',faq_a1:'Supply Chain Backdoor lets you simulate supply chain interdiction attacks and learn hardware verification techniques. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you choose the hardware components and design the covert device. Then you assemble the implant and flash it with the custom firmware.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real hardware security principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Imp Covert Audio Implant and Imp Evil Maid Toolkit. Each app in this category teaches a different aspect of hardware security.',demo_s1:'Welcome to Supply Chain Backdoor! Look at the main display — this is where the hardware security simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of hardware security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how hardware security works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches hardware security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Supply Chain Backdoor: Simulate supply chain interdiction attacks and learn hardware verification techniques. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Design Implant through Build & Program to Deploy and Monitor & Extract.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab — Motherboard Inspector" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr, title:'Supply Chain Backdoor', subtitle:'📦 intercepter · 🔬 implanter · 🛡️ vérifier', disconnected:'Déconnecté', connected:'Connecté', ready:'📦 Simulation prête !', logCleared:'Journal effacé', copied:'Copié !', working:'En cours…', langChanged:'🌐 Français', themeChanged:'🎨 Thème →', splashHint:'appuyer pour passer' ,step1Title:'Concevoir l\'implant',step1Desc:'Choisis les composants et conçois le dispositif caché.',step2Title:'Construire et programmer',step2Desc:'Assemble l\'implant et charge le firmware personnalisé.',step3Title:'Déployer',step3Desc:'Installe l\'implant dans l\'environnement cible sans être détecté.',step4Title:'Surveiller et extraire',step4Desc:'Reçois les données de l\'implant et extrais le renseignement.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Supply Chain Backdoor ?',faq_a1:'Supply Chain Backdoor te permet de simuler sécurité matérielle. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de sécurité matérielle. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de sécurité matérielle. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de sécurité matérielle.',demo_s1:'Bienvenue dans Supply Chain Backdoor ! Regarde l\'écran principal — c\'est ici que la simulation de sécurité matérielle fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de sécurité matérielle.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne sécurité matérielle en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de sécurité matérielle par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chiffrer et Décoder',ch1Desc:'Chiffre un message puis essaie de le décoder manuellement sans regarder la clé. Quels motifs repères-tu dans le texte chiffré ?',ch2Title:'Test de Furtivité',ch2Desc:'Essaie de compléter la mission avec l\'empreinte signal la plus faible possible. Peux-tu descendre sous le seuil de détection ?',ch3Title:'Course à l\'Interception',ch3Desc:'Lance une transmission et mesure le temps de détection. Qu\'est-ce qui affecte ce délai ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Supply Chain Backdoor : Simulate supply chain interdiction attacks and learn hardware verification techniques. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar, title:'Supply Chain Backdoor', subtitle:'📦 اعتراض · 🔬 زرع · 🛡️ تحقق', disconnected:'غير متصل', connected:'متصل', ready:'📦 جاهز!', logCleared:'تم المسح', copied:'تم النسخ!', working:'جارٍ…', langChanged:'🌐 العربية', themeChanged:'🎨 →', splashHint:'انقر للتخطي' ,step1Title:'تصميم الزرع',step1Desc:'اختر مكونات العتاد وصمم الجهاز السري.',step2Title:'بناء وبرمجة',step2Desc:'اجمع الزرع وحمّل البرنامج الثابت المخصص.',step3Title:'نشر',step3Desc:'ثبّت الزرع في البيئة المستهدفة دون اكتشاف.',step4Title:'مراقبة واستخراج',step4Desc:'استقبل البيانات من الزرع واستخرج الاستخبارات الملتقطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Supply Chain Backdoor؟',faq_a1:'Supply Chain Backdoor يتيح لك محاكاة أمن الأجهزة. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في أمن الأجهزة. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من أمن الأجهزة. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من أمن الأجهزة.',demo_s1:'مرحباً في Supply Chain Backdoor! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة أمن الأجهزة.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـأمن الأجهزة.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل أمن الأجهزة من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم أمن الأجهزة من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تشفير وفك تشفير',ch1Desc:'شفّر رسالة ثم حاول فك تشفيرها يدوياً بدون النظر للمفتاح. ما الأنماط التي تلاحظها؟',ch2Title:'اختبار التخفي',ch2Desc:'حاول إكمال المهمة بأقل بصمة إشارة ممكنة. هل يمكنك النزول تحت عتبة الكشف؟',ch3Title:'سباق الاعتراض',ch3Desc:'ابدأ بثاً وقِس سرعة اعتراضه. ما الذي يؤثر على وقت الكشف؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Supply Chain Backdoor: Simulate supply chain interdiction attacks and learn hardware verification techniques. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.title = `${s.title} — Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; try { localStorage.setItem('wdiy-theme', name); } catch {} log(`${LANG[currentLang].themeChanged} ${name}`, 'info'); }
let logContainer;
function log(msg, type='info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type==='success') playSound('success'); else if (type==='error') playSound('error'); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n')); log(LANG[currentLang].copied,'success'); } catch { log(LANG[currentLang].copyFail,'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'})); a.download=`log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); }
let toastTimer = null;
function showToast(msg, ms=0) { const el=$('toastIndicator'),t=$('toastMessage'); if(el&&t){t.textContent=msg;el.style.display='block'} if(toastTimer) clearTimeout(toastTimer); if(ms>0) toastTimer=setTimeout(hideToast,ms); }
function hideToast() { const el=$('toastIndicator'); if(el) el.style.display='none'; }
function setStatus(c) { const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang]; if(t) t.textContent=c?s.connected:s.disconnected; if(p) p.classList.toggle('connected',c); }
let splashTimer;
function dismissSplash() { const s=$('splash'); if(!s) return; s.classList.add('hidden'); if(splashTimer) clearTimeout(splashTimer); setTimeout(()=>s.remove(),600); }
function initSplash() { const s=$('splash'); if(!s) return; const sl=$('splashLogo'); if(sl) sl.innerHTML=LOGO_SVG; splashTimer=setTimeout(dismissSplash,2500); }
let activeLogFilter='all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();})}); }
function applyLogFilter() { if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none';}); }
function initHijriDate() { const el=$('hijriDate'); if(!el) return; try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{} }
function openPanel(pid,oid) { const s=$(pid),o=$(oid); if(s)s.classList.add('open'); if(o)o.classList.add('open'); }
function closePanel(pid,oid) { const s=$(pid),o=$(oid); if(s)s.classList.remove('open'); if(o)o.classList.remove('open'); }
function openHelp(){openPanel('helpPanel','helpOverlay')} function closeHelp(){closePanel('helpPanel','helpOverlay')}
function openSettings(){openPanel('settingsPanel','settingsOverlay')} function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}
let matrixRunning=false,matrixAnim=null;
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: SUPPLY CHAIN BACKDOOR SIM ═══════ */
let particles = [];
let implanted = false;
let xrayMode = false;

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500; canvas.height = 260;
  let time = 0;

  // Define motherboard components
  const components = [
    { x: 0.15, y: 0.3, w: 0.12, h: 0.15, label: 'CPU', color: '#4488ff' },
    { x: 0.35, y: 0.25, w: 0.08, h: 0.06, label: 'RAM1', color: '#33aa55' },
    { x: 0.35, y: 0.35, w: 0.08, h: 0.06, label: 'RAM2', color: '#33aa55' },
    { x: 0.55, y: 0.2, w: 0.1, h: 0.12, label: 'BMC', color: '#d4a03c' },
    { x: 0.55, y: 0.5, w: 0.12, h: 0.08, label: 'NIC', color: '#8844cc' },
    { x: 0.75, y: 0.3, w: 0.08, h: 0.25, label: 'PCIe', color: '#cc4444' },
    { x: 0.15, y: 0.6, w: 0.15, h: 0.08, label: 'SPI Flash', color: '#dd8833' },
    { x: 0.4, y: 0.65, w: 0.1, h: 0.06, label: 'UART', color: '#666' },
  ];

  // Implant location (near BMC)
  const implant = { x: 0.53, y: 0.18, r: 0.015 };

  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const attack = ($('attackSelect') || {}).value || 'chip-implant';
    time += 0.02;

    // PCB board
    const boardColor = xrayMode ? '#001a33' : '#0a2a0a';
    ctx.fillStyle = boardColor;
    ctx.fillRect(20, 15, canvas.width - 40, canvas.height - 50);
    ctx.strokeStyle = xrayMode ? '#0066cc' : '#1a4a1a';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 15, canvas.width - 40, canvas.height - 50);

    // PCB traces
    ctx.strokeStyle = xrayMode ? 'rgba(0,100,200,0.3)' : 'rgba(100,200,100,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(30, 25 + i * 18);
      ctx.lineTo(canvas.width - 30, 25 + i * 18);
      ctx.stroke();
    }

    // Components
    components.forEach(c => {
      const cx = 20 + c.x * (canvas.width - 40);
      const cy = 15 + c.y * (canvas.height - 50);
      const cw = c.w * (canvas.width - 40);
      const ch = c.h * (canvas.height - 50);

      if (xrayMode) {
        ctx.strokeStyle = c.color; ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, cy, cw, ch);
        ctx.fillStyle = c.color + '22';
        ctx.fillRect(cx, cy, cw, ch);
        // Internal structure lines
        ctx.strokeStyle = c.color + '44'; ctx.lineWidth = 0.5;
        for (let l = 0; l < 3; l++) {
          ctx.beginPath(); ctx.moveTo(cx + 2, cy + 2 + l * (ch / 3));
          ctx.lineTo(cx + cw - 2, cy + 2 + l * (ch / 3)); ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#111'; ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = c.color; ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, cy, cw, ch);
      }
      ctx.fillStyle = c.color; ctx.font = '7px Orbitron';
      ctx.fillText(c.label, cx + 2, cy + ch + 10);
    });

    // Implanted chip (visible in x-ray or when implanted)
    if (implanted) {
      const ix = 20 + implant.x * (canvas.width - 40);
      const iy = 15 + implant.y * (canvas.height - 50);
      const ir = implant.r * canvas.width;

      if (xrayMode) {
        // Clearly visible in X-ray
        ctx.fillStyle = '#ff3333';
        ctx.beginPath(); ctx.arc(ix, iy, ir + 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ix, iy, ir + 6, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ff3333'; ctx.font = '8px Orbitron';
        ctx.fillText('IMPLANT!', ix - 20, iy - ir - 8);
        // Trace from implant to BMC
        ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.moveTo(ix + ir, iy); ctx.lineTo(ix + 20, iy + 15); ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Barely visible on surface
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, Math.PI * 2); ctx.fill();
      }

      // Data exfiltration animation
      if (attack === 'chip-implant') {
        const pulseR = (time * 30) % 40;
        ctx.globalAlpha = 1 - pulseR / 40;
        ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ix, iy, ir + pulseR, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      if (p.life <= 0 || p.x > canvas.width) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color || '#33ff33'; ctx.fill(); ctx.globalAlpha = 1;
    }

    // Info bar
    const zoom = parseInt(($('zoomSlider') || {}).value || '50');
    ctx.fillStyle = 'rgba(51,255,51,0.15)'; ctx.fillRect(20, canvas.height - 22, (canvas.width - 40) * (zoom / 100), 8);
    ctx.fillStyle = '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`ZOOM: ${zoom}% | MODE: ${xrayMode ? 'X-RAY' : 'VISUAL'} | ${implanted ? 'COMPROMISED' : 'CLEAN'}`, 25, canvas.height - 4);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnP(n, c, x, y) {
  const canvas = $('simCanvas'); if (!canvas) return;
  for (let i = 0; i < n; i++) particles.push({ x: (x||100)+Math.random()*30, y: (y||100)+Math.random()*30, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 0.5+Math.random()*0.5, color: c||'#33ff33', size: 1.5+Math.random()*2 });
}

function initSupplyChainSim() {
  const interceptBtn=$('interceptBtn'), analyzeBtn=$('analyzeBtn'), defendBtn=$('defendBtn');
  const zoomSlider=$('zoomSlider'), zoomValue=$('zoomValue');
  const outputDisplay=$('outputDisplay'), dataLog=$('dataLog');
  const implantDot=$('implantDot'), implantStatusText=$('implantStatusText');

  if (zoomSlider && zoomValue) zoomSlider.addEventListener('input', () => { zoomValue.textContent = zoomSlider.value + '%'; });

  if (interceptBtn) interceptBtn.addEventListener('click', () => {
    const attack = ($('attackSelect') || {}).value || 'chip-implant';
    implanted = true;
    if (implantDot) implantDot.classList.add('active');
    if (implantStatusText) implantStatusText.textContent = 'Status: COMPROMISED';
    setStatus(true);
    showToast('Intercepting shipment...', 2000);
    spawnP(25, '#ff3333');

    const steps = {
      'chip-implant': ['Intercepting server shipment...','Opening tamper-evident packaging...','Soldering micro-chip near BMC...','Connecting to SPI bus...','Restoring packaging seals...','Chip implant complete — BMC compromised'],
      'firmware-mod': ['Intercepting shipment at distribution...','Extracting SPI flash firmware...','Injecting persistent backdoor code...','Re-flashing modified firmware...','Verifying boot integrity bypass...','Firmware modification complete'],
      'component-swap': ['Identifying target components on BOM...','Sourcing counterfeit ICs from grey market...','Swapping genuine NIC with backdoored clone...','Matching component markings and dates...','Resealing packaging...','Component swap complete — NIC compromised']
    };
    let step = 0;
    const msgs = steps[attack] || steps['chip-implant'];
    const iv = setInterval(() => {
      if (step < msgs.length) {
        if (dataLog) dataLog.textContent = msgs.slice(0, step + 1).join('\n');
        log(`📦 ${msgs[step]}`, step === msgs.length - 1 ? 'error' : 'tx');
        spawnP(5, '#ff3333');
        step++;
      } else {
        clearInterval(iv);
        if (outputDisplay) outputDisplay.textContent = [`INTERDICTION REPORT`, `═══════════════`, `Attack: ${attack.toUpperCase()}`, `Target: ${($('targetInput') || {}).value || 'Server MB'}`, `Status: IMPLANT ACTIVE`, `Detection risk: LOW`, `Persistence: Hardware-level`, `Survives: OS reinstall, firmware update`].join('\n');
      }
    }, 600);
  });

  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    xrayMode = !xrayMode;
    analyzeBtn.textContent = xrayMode ? 'Visual Mode' : 'X-Ray Inspect';
    showToast(xrayMode ? 'X-Ray mode enabled' : 'Visual mode', 1500);
    log(xrayMode ? '🔬 X-Ray inspection mode activated' : '🔬 Switched to visual mode', 'info');
    spawnP(15, '#4488ff');
    if (xrayMode && implanted) {
      setTimeout(() => {
        if (outputDisplay) outputDisplay.textContent = [`⚠️ X-RAY ANOMALY DETECTED!`, `═══════════════`, `Location: Near BMC controller`, `Size: ~1mm x 1mm`, `Type: Unknown IC not on BOM`, `SPI bus connection: Detected`, ``, `RECOMMENDATION: Quarantine board`, `Compare against golden sample`].join('\n');
        log('🚨 X-Ray reveals anomalous component near BMC!', 'error');
      }, 1000);
    }
  });

  if (defendBtn) defendBtn.addEventListener('click', () => {
    showToast('Running integrity verification...', 2500);
    log('🛡️ Hardware integrity verification...', 'info');
    spawnP(20, '#33ff33');
    setTimeout(() => {
      const clean = !implanted;
      if (outputDisplay) outputDisplay.textContent = clean ? [
        '✅ INTEGRITY VERIFIED', '═══════════════',
        'Component count: Matches BOM',
        'Firmware hash: VALID (SHA-256)',
        'TPM attestation: PASSED',
        'X-Ray comparison: MATCH',
        'Packaging seals: INTACT',
        '', 'Board status: TRUSTED'
      ].join('\n') : [
        '⚠️ INTEGRITY CHECK FAILED', '═══════════════',
        'Component count: MISMATCH (+1)',
        'Firmware hash: ' + (($('attackSelect')||{}).value === 'firmware-mod' ? 'MISMATCH' : 'VALID'),
        'TPM attestation: ' + (($('attackSelect')||{}).value === 'chip-implant' ? 'SUSPECT' : 'PASSED'),
        'X-Ray comparison: ANOMALY DETECTED',
        'Packaging seals: RESEALED (UV mismatch)',
        '', 'Board status: COMPROMISED — QUARANTINE'
      ].join('\n');
      log(clean ? '✅ Hardware verified — clean' : '🚨 Integrity check FAILED — backdoor detected', clean ? 'success' : 'error');
      hideToast();
    }, 2000);
  });

  const xrayBtn = $('xrayBtn');
  if (xrayBtn) xrayBtn.addEventListener('click', () => {
    xrayMode = true;
    spawnP(30, '#0066cc');
    log('🔬 Deep X-Ray scan initiated...', 'info');
    showToast('X-Ray scanning...', 2500);
    let layer = 0;
    const layers = ['Surface layer scan...', 'Layer 2 copper traces...', 'Layer 3 ground plane...', 'Layer 4 signal routing...', 'BGA/component analysis...', 'Scan complete'];
    const iv = setInterval(() => {
      if (layer < layers.length) {
        if (dataLog) dataLog.textContent += '\n[X-RAY] ' + layers[layer];
        layer++;
      } else { clearInterval(iv); log('🔬 X-Ray scan complete', 'success'); }
    }, 500);
  });
}

function init() {
  initSplash(); const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);
  initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const snd=$('soundToggle');if(snd){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}snd.checked=soundEnabled;snd.addEventListener('change',()=>{soundEnabled=snd.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate(); initSimCanvas(); initSupplyChainSim();
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
