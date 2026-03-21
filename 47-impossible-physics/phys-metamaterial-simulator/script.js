/**
 * Metamaterial Simulator — Workshop DIY v1.0
 * Full canvas-based negative-index metamaterial, EM cloaking,
 * split-ring resonator, and photonic crystal visualization.
 *
 * Features:
 *  - 4 material types: negative index, cloak, SRR, photonic crystal
 *  - Real-time wave propagation with negative refraction
 *  - EM cloaking field visualization
 *  - Material property calculations (ε, μ, Z, velocity)
 *  - Wave analysis canvas with field plots
 *  - Full i18n (EN/FR/AR with RTL), 8 themes, sound, log, panels
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3" rx="4">
    <animate attributeName="rx" values="0;15;0" dur="3s" repeatCount="indefinite"/>
  </rect>
  <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="1.5" opacity=".5">
    <animate attributeName="y1" values="50;35;50" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="y2" values="50;65;50" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="35" cy="35" r="4" fill="currentColor" opacity=".5"/>
  <circle cx="65" cy="35" r="4" fill="currentColor" opacity=".5"/>
  <circle cx="35" cy="65" r="4" fill="currentColor" opacity=".5"/>
  <circle cx="65" cy="65" r="4" fill="currentColor" opacity=".5"/>
</svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); break;
    case 'success': o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); break;
    case 'error': o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); break;
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
    title: 'Metamaterial Simulator', subtitle: '🔬 Negative refraction & cloaking',
    disconnected: 'Offline', connected: 'Simulating',
    mainSection: 'Metamaterial Simulator', mainDesc: 'Simulate negative-index metamaterials and EM cloaking',
    sectionA: 'Material Properties', sectionB: 'Wave Analysis', sectionC: 'Metamaterial Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Choose a metamaterial type from the dropdown.',
    howto_2: 'Adjust frequency and refractive index sliders.',
    howto_3: 'Press Start to see wave propagation through the material.',
    howto_4: 'Open Wave Analysis to see refraction angles and fields.',
    wiki_neg_title: '🔄 Negative Refraction', wiki_neg: 'When both ε and μ are negative, Snell\'s law reverses.',
    wiki_cloak_title: '👻 EM Cloaking', wiki_cloak: 'Transformation optics guides waves around hidden regions.',
    wiki_srr_title: '💍 Split-Ring Resonators', wiki_srr: 'Concentric metallic rings with gaps that resonate magnetically.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '🔬 Metamaterial Simulator ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    matType: 'Material Type', freqLabel: 'Frequency (GHz)', indexLabel: 'Refractive Index',
    startSim: '▶ Start', stopSim: '⏹ Stop', resetSim: '↺ Reset',
    permittivity: 'Permittivity (ε):', permeability: 'Permeability (μ):', impedance: 'Impedance (Z):',
    groupVel: 'Group Velocity:', phaseVel: 'Phase Velocity:', wavelength: 'Wavelength:',
    theoryIntro: 'Metamaterials are engineered structures with unusual EM properties:',
    theory1: 'Negative refractive index bends light the wrong way',
    theory2: 'Split-ring resonators create artificial magnetic response',
    theory3: 'Transformation optics enables electromagnetic cloaking',
    theory4: 'Perfect lensing can beat the diffraction limit',
    theory5: 'Left-handed materials reverse the Poynting vector',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '▶ Simulation started', simStopped: '⏹ Stopped', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Metamaterial Simulator?',faq_a1:'Metamaterial Simulator lets you simulate negative-index metamaterials and em cloaking. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you configure the physical constants and initial conditions for the experiment. Then you start the simulation and observe the physics phenomenon in action.',faq_q3:'What do the controls do?',faq_a3:'Choose a metamaterial type from the dropdown. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'عندما تكون ε و μ سالبتين ينعكس قانون سنل.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Metamaterial Simulator! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Choose a metamaterial type from the dropdown. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Material Properties" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how physics experiments works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Material Properties" and "Wave Analysis" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title: 'Simulateur de Métamatériaux', subtitle: '🔬 Réfraction négative & camouflage',
    disconnected: 'Hors ligne', connected: 'Simulation',
    mainSection: 'Simulateur de Métamatériaux', mainDesc: 'Simuler les métamatériaux à indice négatif et le camouflage EM',
    sectionA: 'Propriétés du Matériau', sectionB: 'Analyse des Ondes', sectionC: 'Théorie des Métamatériaux',
    activityLog: '📜 Journal', eventsMsg: 'Événements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Choisissez un type de métamatériau.', howto_2: 'Ajustez la fréquence et l\'indice.',
    howto_3: 'Appuyez Démarrer pour voir la propagation.', howto_4: 'Ouvrez Analyse des Ondes.',
    wiki_neg_title: '🔄 Réfraction Négative', wiki_neg: 'Quand ε et μ sont négatifs, la loi de Snell s\'inverse.',
    wiki_cloak_title: '👻 Camouflage EM', wiki_cloak: 'L\'optique de transformation guide les ondes autour de régions cachées.',
    wiki_srr_title: '💍 Résonateurs Annulaires', wiki_srr: 'Anneaux métalliques concentriques qui résonnent magnétiquement.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '🔬 Simulateur prêt !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    matType: 'Type de Matériau', freqLabel: 'Fréquence (GHz)', indexLabel: 'Indice de Réfraction',
    startSim: '▶ Démarrer', stopSim: '⏹ Arrêter', resetSim: '↺ Réinitialiser',
    permittivity: 'Permittivité (ε) :', permeability: 'Perméabilité (μ) :', impedance: 'Impédance (Z) :',
    groupVel: 'Vitesse de Groupe :', phaseVel: 'Vitesse de Phase :', wavelength: 'Longueur d\'Onde :',
    theoryIntro: 'Les métamatériaux sont des structures aux propriétés EM inhabituelles :',
    theory1: 'L\'indice négatif courbe la lumière à l\'envers',
    theory2: 'Les résonateurs annulaires créent une réponse magnétique artificielle',
    theory3: 'L\'optique de transformation permet le camouflage EM',
    theory4: 'La lentille parfaite peut battre la limite de diffraction',
    theory5: 'Les matériaux gauchers inversent le vecteur de Poynting',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '▶ Simulation démarrée', simStopped: '⏹ Arrêté', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Metamaterial Simulator ?',faq_a1:'Metamaterial Simulator te permet de simuler expériences de physique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de expériences de physique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de expériences de physique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF / RPi. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de expériences de physique.',demo_s1:'Bienvenue dans Metamaterial Simulator ! Regarde l\'écran principal — c\'est ici que la simulation de expériences de physique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de expériences de physique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne expériences de physique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de expériences de physique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title: 'محاكي الميتاماتيريال', subtitle: '🔬 الانكسار السلبي والتخفي',
    disconnected: 'غير متصل', connected: 'يحاكي',
    mainSection: 'محاكي الميتاماتيريال', mainDesc: 'محاكاة المواد ذات المعامل السلبي والتخفي الكهرومغناطيسي',
    sectionA: 'خصائص المادة', sectionB: 'تحليل الأمواج', sectionC: 'نظرية الميتاماتيريال',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    howto_1: 'اختر نوع الميتاماتيريال.', howto_2: 'اضبط التردد ومعامل الانكسار.',
    howto_3: 'اضغط ابدأ لرؤية انتشار الموجة.', howto_4: 'افتح تحليل الأمواج لرؤية الحقول.',
    wiki_neg_title: '🔄 الانكسار السلبي', wiki_neg: 'عندما تكون ε و μ سالبتين ينعكس قانون سنل.',
    wiki_cloak_title: '👻 التخفي الكهرومغناطيسي', wiki_cloak: 'بصريات التحويل توجه الموجات حول المناطق المخفية.',
    wiki_srr_title: '💍 المرنانات الحلقية', wiki_srr: 'حلقات معدنية متحدة المركز ترنّ مغناطيسياً.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '🔬 المحاكي جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    matType: 'نوع المادة', freqLabel: 'التردد (GHz)', indexLabel: 'معامل الانكسار',
    startSim: '▶ ابدأ', stopSim: '⏹ إيقاف', resetSim: '↺ إعادة',
    permittivity: 'السماحية (ε):', permeability: 'النفاذية (μ):', impedance: 'المعاوقة (Z):',
    groupVel: 'سرعة المجموعة:', phaseVel: 'سرعة الطور:', wavelength: 'الطول الموجي:',
    theoryIntro: 'الميتاماتيريال هياكل مهندسة بخصائص كهرومغناطيسية غير عادية:',
    theory1: 'المعامل السلبي يكسر الضوء بالاتجاه الخاطئ',
    theory2: 'المرنانات الحلقية تخلق استجابة مغناطيسية اصطناعية',
    theory3: 'بصريات التحويل تمكّن التخفي الكهرومغناطيسي',
    theory4: 'العدسة المثالية يمكن أن تتغلب على حد الحيود',
    theory5: 'المواد اليسارية تعكس متجه بوينتنغ',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '▶ بدأت المحاكاة', simStopped: '⏹ توقف', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ما هو Metamaterial Simulator؟',faq_a1:'Metamaterial Simulator يتيح لك محاكاة تجارب الفيزياء. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في تجارب الفيزياء. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من تجارب الفيزياء. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF / RPi. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من تجارب الفيزياء.',demo_s1:'مرحباً في Metamaterial Simulator! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة تجارب الفيزياء.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـتجارب الفيزياء.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل تجارب الفيزياء من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم تجارب الفيزياء من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.title = s.title + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info');
}
function setTheme(n) {
  document.documentElement.dataset.theme = n;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n));
  const s = $('themeSelect'); if (s) s.value = n;
  try { localStorage.setItem('wdiy-theme', n); } catch {}
  log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success'); else if (type === 'error') playSound('error');
  applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'metamaterial-log.txt'; a.click(); URL.revokeObjectURL(u); }
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

/* ═══════ PANELS ═══════ */
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); })); }

/* ═══════════════════════════════════════════════════════
   METAMATERIAL SIMULATION — FULL CANVAS ENGINE
   ═══════════════════════════════════════════════════════ */

let running = false, animFrame = null;
const waves = [];
const particles = [];
const C = 3e8; // speed of light

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* Wave sources */
function emitWave(x, y, angle) {
  waves.push({ x, y, angle, speed: 2, life: 1, age: 0, refracted: false, phase: Math.random() * Math.PI * 2 });
}

/* Draw the metamaterial slab/region */
function drawMetamaterial(ctx, w, h, type, time) {
  const slabX = w * 0.35, slabW = w * 0.3;

  switch (type) {
    case 'negative': {
      // Draw negative-index slab
      ctx.fillStyle = 'rgba(0, 40, 120, 0.3)';
      ctx.fillRect(slabX, 0, slabW, h);
      // SRR pattern inside slab
      const cellSize = 25;
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let y = cellSize / 2; y < h; y += cellSize) {
        for (let x = slabX + cellSize / 2; x < slabX + slabW; x += cellSize) {
          const pulse = Math.sin(time * 3 + x * 0.05 + y * 0.05) * 0.3 + 0.7;
          ctx.globalAlpha = pulse * 0.4;
          ctx.beginPath(); ctx.arc(x, y, 6, 0.3, Math.PI * 2 - 0.3); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2 - 0.5); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      // Interface lines
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(slabX, 0); ctx.lineTo(slabX, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(slabX + slabW, 0); ctx.lineTo(slabX + slabW, h); ctx.stroke();
      break;
    }
    case 'cloak': {
      // Draw cloaking shell
      const cx = w / 2, cy = h / 2, outerR = 80, innerR = 35;
      const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      grad.addColorStop(0.3, 'rgba(0, 40, 100, 0.4)');
      grad.addColorStop(1, 'rgba(0, 80, 200, 0.1)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2); ctx.fill();
      // Cloaked object
      ctx.fillStyle = 'rgba(200, 50, 50, 0.6)';
      ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.fill();
      // Coordinate grid lines curving around cloak
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.15)'; ctx.lineWidth = 0.5;
      for (let i = 0; i < 20; i++) {
        const baseY = (i / 20) * h;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const dx = x - cx, dy = baseY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let yOff = baseY;
          if (dist < outerR * 1.5 && dist > innerR * 0.5) {
            const factor = Math.max(0, 1 - innerR / dist) * (outerR / dist);
            yOff = cy + dy * (1 + (1 - factor) * 0.3);
          }
          if (x === 0) ctx.moveTo(x, yOff); else ctx.lineTo(x, yOff);
        }
        ctx.stroke();
      }
      break;
    }
    case 'srr': {
      // Array of split-ring resonators
      const cellSize = 35;
      for (let y = cellSize; y < h - cellSize; y += cellSize) {
        for (let x = w * 0.2; x < w * 0.8; x += cellSize) {
          const phase = Math.sin(time * 4 + x * 0.1 + y * 0.1);
          const glow = Math.abs(phase);
          ctx.strokeStyle = `rgba(${100 + glow * 155}, ${150 + glow * 50}, 255, ${0.3 + glow * 0.5})`;
          ctx.lineWidth = 1.5;
          // Outer ring
          ctx.beginPath(); ctx.arc(x, y, 10, 0.4, Math.PI * 2 - 0.4); ctx.stroke();
          // Inner ring (opposite gap)
          ctx.beginPath(); ctx.arc(x, y, 6, Math.PI + 0.4, Math.PI * 3 - 0.4); ctx.stroke();
          // Resonance glow
          if (glow > 0.7) {
            ctx.fillStyle = `rgba(100, 200, 255, ${(glow - 0.7) * 0.5})`;
            ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      break;
    }
    case 'photonic': {
      // Photonic crystal lattice
      const a = 20; // lattice constant
      const startX = w * 0.25, endX = w * 0.75;
      for (let row = 0; row < h / (a * 0.866); row++) {
        for (let col = 0; col < (endX - startX) / a; col++) {
          const x = startX + col * a + (row % 2) * a / 2;
          const y = row * a * 0.866;
          if (x < startX || x > endX) continue;
          const bandgap = Math.sin(time * 2 + col * 0.3) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(60, ${100 + bandgap * 100}, ${200 + bandgap * 55}, ${0.3 + bandgap * 0.3})`;
          ctx.beginPath(); ctx.arc(x, y, 5 + bandgap * 2, 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    }
  }
}

/* Propagate and draw waves */
function drawWaves(ctx, w, h, type, nIndex, time) {
  const slabX = w * 0.35, slabW = w * 0.3;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Emit new waves from left
  if (Math.random() < 0.15) {
    emitWave(0, h * 0.3 + Math.random() * h * 0.4, 0);
  }

  for (let i = waves.length - 1; i >= 0; i--) {
    const wave = waves[i];
    wave.age += 0.016;
    wave.life -= 0.003;

    // Propagation
    const speed = wave.refracted ? Math.abs(nIndex) * 1.5 : 2;
    wave.x += Math.cos(wave.angle) * speed;
    wave.y += Math.sin(wave.angle) * speed;

    // Negative refraction at slab boundary
    if (type === 'negative' && !wave.refracted && wave.x >= slabX) {
      wave.refracted = true;
      wave.angle = -wave.angle * (nIndex < 0 ? -1 : 1) * 0.5; // negative refraction
    }

    // Cloaking deflection
    if (type === 'cloak') {
      const dx = wave.x - w / 2, dy = wave.y - h / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90 && dist > 30) {
        const deflect = (90 - dist) / 90 * 0.05;
        wave.angle += dy > 0 ? -deflect : deflect;
      }
    }

    // Draw wave with phase oscillation
    const osc = Math.sin(wave.age * 20 + wave.phase) * 3;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y + osc, 3 * wave.life, 0, Math.PI * 2);
    const hue = wave.refracted ? 0 : 200;
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${wave.life * 0.8})`;
    ctx.fill();

    // Wave trail
    ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${wave.life * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(wave.x - Math.cos(wave.angle) * 15, wave.y - Math.sin(wave.angle) * 15 + osc);
    ctx.lineTo(wave.x, wave.y + osc);
    ctx.stroke();

    if (wave.life <= 0 || wave.x > w + 10 || wave.x < -10 || wave.y < -10 || wave.y > h + 10) {
      waves.splice(i, 1);
    }
  }

  // Plane wave fronts incoming from left
  ctx.strokeStyle = `rgba(100, 200, 255, 0.1)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const xPos = ((time * 60 + i * 40) % (slabX + 40)) - 20;
    if (xPos > 0 && xPos < slabX) {
      ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, h); ctx.stroke();
    }
  }
}

/* HUD overlay */
function drawHUD(ctx, w, h, nIndex, freq) {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('METAMATERIAL SIMULATOR', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('n = ' + nIndex.toFixed(1) + '  f = ' + freq + ' GHz', 10, 34);
  ctx.fillText('Waves: ' + waves.length, 10, 48);
  const matType = $('matType') ? $('matType').value : 'negative';
  ctx.fillStyle = 'rgba(200, 150, 50, 0.5)';
  ctx.fillText('MODE: ' + matType.toUpperCase(), w - 180, 18);
}

/* Update material properties display */
function updateProperties(nIndex, freq) {
  const eps = nIndex < 0 ? -Math.abs(nIndex) * 1.2 : Math.abs(nIndex) * 1.2;
  const mu = nIndex < 0 ? -Math.abs(nIndex) * 0.8 : Math.abs(nIndex) * 0.8;
  const z = Math.sqrt(Math.abs(mu / eps)) * 377;
  const vp = C / Math.abs(nIndex || 1);
  const vg = vp * (1 - 0.1 * Math.abs(nIndex));
  const wl = C / (freq * 1e9) * 1000;

  const e = $('epsVal'); if (e) e.textContent = eps.toFixed(3);
  const m = $('muVal'); if (m) m.textContent = mu.toFixed(3);
  const zv = $('zVal'); if (zv) zv.textContent = z.toFixed(1) + ' Ω';
  const vgv = $('vgVal'); if (vgv) vgv.textContent = (vg / C).toFixed(3) + 'c';
  const vpv = $('vpVal'); if (vpv) vpv.textContent = (vp / C).toFixed(3) + 'c';
  const wlv = $('wlVal'); if (wlv) wlv.textContent = wl.toFixed(2) + ' mm';
}

/* Wave analysis canvas */
function drawAnalysis(ctx, w, h, nIndex, freq, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 10; i++) { const x = (i / 10) * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let i = 0; i <= 5; i++) { const y = (i / 5) * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // E-field wave
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const norm = x / w;
    const inSlab = norm > 0.35 && norm < 0.65;
    const k = inSlab ? Math.abs(nIndex) * 4 : 2;
    const direction = inSlab && nIndex < 0 ? -1 : 1;
    const amp = h * 0.35;
    const y = h / 2 + Math.sin(x * 0.05 * k * direction - time * 5) * amp * (inSlab ? 0.7 : 1);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // H-field wave
  ctx.strokeStyle = 'rgba(255, 150, 50, 0.6)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const norm = x / w;
    const inSlab = norm > 0.35 && norm < 0.65;
    const k = inSlab ? Math.abs(nIndex) * 4 : 2;
    const direction = inSlab && nIndex < 0 ? -1 : 1;
    const amp = h * 0.25;
    const y = h / 2 + Math.cos(x * 0.05 * k * direction - time * 5) * amp * (inSlab ? 0.7 : 1);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Slab region indicator
  ctx.fillStyle = 'rgba(0, 40, 120, 0.15)';
  ctx.fillRect(w * 0.35, 0, w * 0.3, h);

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('E-field (blue)  H-field (orange)', 8, 14);
  ctx.fillText('n=' + nIndex.toFixed(1), w * 0.47, 14);
}

/* Main loop */
let simCtx, simW, simH, anaCtx, anaW, anaH;

function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const matType = $('matType') ? $('matType').value : 'negative';
  const nIndex = ($('indexSlider') ? +$('indexSlider').value : -10) / 10;
  const freq = $('freqSlider') ? +$('freqSlider').value : 30;

  if (simCtx) {
    simCtx.fillStyle = 'rgba(0, 0, 0, 0.08)'; simCtx.fillRect(0, 0, simW, simH);
    drawMetamaterial(simCtx, simW, simH, matType, time);
    drawWaves(simCtx, simW, simH, matType, nIndex, time);
    drawHUD(simCtx, simW, simH, nIndex, freq);
  }

  if (anaCtx) drawAnalysis(anaCtx, anaW, anaH, nIndex, freq, time);
  updateProperties(nIndex, freq);

  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
  log(LANG[currentLang].simStarted, 'success');
  simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); waves.length = 0;
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) sc.getContext('2d').clearRect(0, 0, sc.width, sc.height);
  if (ac) ac.getContext('2d').clearRect(0, 0, ac.width, ac.height);
  [$('epsVal'), $('muVal'), $('zVal'), $('vgVal'), $('vpVal'), $('wlVal')].forEach(e => { if (e) e.textContent = '--'; });
  log(LANG[currentLang].simReset, 'info');
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog; $('exportLogBtn').onclick = exportLog;
  initLogFilters();
  $('helpBtn').onclick = openHelp; $('helpCloseBtn').onclick = closeHelp; $('helpOverlay').onclick = closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick = openSettings; $('settingsCloseBtn').onclick = closeSettings; $('settingsOverlay').onclick = closeSettings;
  $('logBtn').onclick = toggleLog; $('logCloseBtn').onclick = closeLog;
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  $('langSelect').onchange = function () { setLanguage(this.value); };
  $('themeSelect').onchange = function () { setTheme(this.value); };
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  initHijriDate();
  $('startBtn').onclick = startSim; $('stopBtn').onclick = stopSim; $('resetBtn').onclick = resetSim;
  $('freqSlider').oninput = function () { $('freqVal').textContent = this.value + ' GHz'; };
  $('indexSlider').oninput = function () { $('indexVal').textContent = (this.value / 10).toFixed(1); };
  window.addEventListener('resize', () => {
    if (running) {
      const sc = $('simCanvas'), ac = $('analysisCanvas');
      if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
      if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
    }
  });
  log(LANG[currentLang].ready, 'success');
}
document.addEventListener('DOMContentLoaded', init);


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
