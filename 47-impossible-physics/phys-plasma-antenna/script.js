/**
 * Plasma Antenna — Workshop DIY v1.0
 * Full canvas-based plasma antenna simulation with radiation patterns,
 * ionized gas visualization, and antenna metrics.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" stroke-width="3" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="1s" repeatCount="indefinite"/></line><circle cx="50" cy="30" r="5" fill="currentColor" opacity=".6"><animate attributeName="r" values="3;8;3" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="3" fill="currentColor" opacity=".4"><animate attributeName="r" values="2;6;2" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="50" cy="70" r="4" fill="currentColor" opacity=".5"><animate attributeName="r" values="3;7;3" dur="1.3s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); }
  else if (type === 'success') { o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); }
  else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); }
}

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
    title: 'Plasma Antenna', subtitle: '⚡ Ionized gas RF elements',
    disconnected: 'Offline', connected: 'Ignited',
    mainSection: 'Plasma Antenna', mainDesc: 'Simulate reconfigurable plasma antenna with ionized gas columns',
    sectionA: 'Antenna Metrics', sectionB: 'Radiation Pattern', sectionC: 'Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Antenna Metrics" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_plasma_title: '⚡ Plasma Physics', wiki_plasma: 'Plasma is the fourth state of matter with free electrons that conducts electricity.',
    wiki_rad_title: '📡 Radiation Patterns', wiki_rad:'The 3D distribution of radiated power from an antenna. Antennas convert between electrical signals in wires and electromagnetic waves in free space. Their physical size is related to the wavelength they receive best — a quarter-wave monopole for 100 MHz is about 75 cm long.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '⚡ Plasma Antenna ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    plasmaMode: 'Plasma Mode', ionLevel: 'Ionization Level', rfFreq: 'RF Frequency (MHz)',
    startSim: '▶ Ignite', stopSim: '⏹ Quench', resetSim: '↺ Reset',
    gain: 'Gain:', vswr: 'VSWR:', plasmaDensity: 'Plasma Density:', beamwidth: 'Beamwidth:',
    efficiency: 'Efficiency:', bandwidth: 'Bandwidth:',
    theoryIntro: 'Plasma antennas use ionized gas instead of metal for RF radiation:',
    theory1: 'Ionized gas columns act as conductive antenna elements',
    theory2: 'Plasma density controls the antenna operating frequency',
    theory3: 'When de-ionized, the antenna becomes invisible to radar',
    theory4: 'Reconfigurable patterns by controlling ionization profiles',
    theory5: 'Near-zero thermal noise when plasma is quenched',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '⚡ Plasma ignited', simStopped: '⏹ Quenched', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Plasma Antenna?',faq_a1:'Plasma Antenna lets you simulate reconfigurable plasma antenna with ionized gas columns. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real physics experiments behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real physics experiments principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Plasma Antenna! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Select a plasma antenna configuration. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Antenna Metrics" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how physics experiments works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Plasma Antenna?',wiki_concept:'Plasma Antenna is a technique used in physics experiments. Simulate reconfigurable plasma antenna with ionized gas columns. In professional settings, this technology requires HackRF / RPi and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the physical constants and initial conditions for the experiment. Second: Start the simulation and observe the physics phenomenon in action. The simulation runs these stages in real time, showing you intermediate results at each step. In real physics experiments, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Plasma Antenna has practical applications in physics experiments. Professionals use similar techniques with HackRF / RPi in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Plasma Antenna: Simulate reconfigurable plasma antenna with ionized gas columns. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Set Parameters through Run Experiment to Measure Results and Compare Theory.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Antenna Metrics" and "Radiation Pattern" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Impossible Physics',
    wiki_history: 'The field of impossible physics has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed impossible physics by enabling software-defined approaches. Modern practitioners use tools like browser to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Plasma Antenna',
    wiki_math: 'The mathematics underpinning plasma antenna involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced impossible physics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to impossible physics. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with impossible physics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in impossible physics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Impossible Physics carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Signal',
    gloss1_def: 'A varying quantity (voltage, electromagnetic wave, or data stream) that carries information. In this simulation, signals are represented visually so you can see how they change over time and respond to your controls.',
    gloss2_term: 'Parameter',
    gloss2_def: 'A configurable value that changes system behavior. Each slider and input in this app controls a specific parameter. Changing parameters lets you explore cause-and-effect relationships in the simulation.',
    gloss3_term: 'Simulation',
    gloss3_def: 'A software model that mimics real-world behavior. This app simulates real equipment and processes so you can learn safely without hardware. The physics and mathematics are real — only the signals are virtual.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules that defines how data is formatted, transmitted, and received. Protocols ensure that different devices can communicate. Examples include WiFi (802.11), Bluetooth, HTTP, and TCP/IP.',
    gloss5_term: 'Frequency',
    gloss5_def: 'The number of cycles a signal completes per second, measured in Hertz (Hz). Higher frequencies carry more data but travel shorter distances. Radio frequencies range from 3 kHz to 300 GHz.',
    gloss6_term: 'Encryption',
    gloss6_def: 'The process of converting readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and a key. Only someone with the correct key can decrypt and read the original data.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Understanding the theory behind plasma antenna requires grasping several interconnected concepts from impossible physics. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world impossible physics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional impossible physics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Antenne Plasma', subtitle: '⚡ Éléments RF à gaz ionisé',
    disconnected: 'Hors ligne', connected: 'Allumé',
    mainSection: 'Antenne Plasma', mainDesc: 'Simuler une antenne plasma reconfigurable à colonnes de gaz ionisé',
    sectionA: 'Métriques d\'Antenne', sectionB: 'Diagramme de Rayonnement', sectionC: 'Théorie',
    activityLog: '📜 Journal', eventsMsg: 'Événements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_plasma_title: '⚡ Physique du Plasma', wiki_plasma: 'Le plasma est le quatrième état de la matière.',
    wiki_rad_title: '📡 Diagrammes de Rayonnement', wiki_rad: 'Distribution 3D de puissance rayonnée.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '⚡ Antenne Plasma prête !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    plasmaMode: 'Mode Plasma', ionLevel: 'Niveau d\'Ionisation', rfFreq: 'Fréquence RF (MHz)',
    startSim: '▶ Allumer', stopSim: '⏹ Éteindre', resetSim: '↺ Réinitialiser',
    gain: 'Gain :', vswr: 'VSWR :', plasmaDensity: 'Densité Plasma :', beamwidth: 'Ouverture :',
    efficiency: 'Efficacité :', bandwidth: 'Bande passante :',
    theoryIntro: 'Les antennes plasma utilisent du gaz ionisé pour le rayonnement RF :',
    theory1: 'Les colonnes de gaz ionisé agissent comme éléments d\'antenne conducteurs',
    theory2: 'La densité du plasma contrôle la fréquence de fonctionnement',
    theory3: 'Une fois désionisée, l\'antenne devient invisible au radar',
    theory4: 'Diagrammes reconfigurables par contrôle du profil d\'ionisation',
    theory5: 'Bruit thermique quasi nul quand le plasma est éteint',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '⚡ Plasma allumé', simStopped: '⏹ Éteint', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Plasma Antenna ?',faq_a1:'Plasma Antenna te permet de simuler expériences de physique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de expériences de physique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de expériences de physique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF / RPi. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de expériences de physique.',demo_s1:'Bienvenue dans Plasma Antenna ! Regarde l\'écran principal — c\'est ici que la simulation de expériences de physique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de expériences de physique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne expériences de physique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de expériences de physique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Plasma Antenna ?',wiki_concept:'Plasma Antenna est une technique utilisée en physics experiments. Dans un contexte professionnel, cette technologie nécessite HackRF / RPi et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de physics experiments. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Plasma Antenna a des applications pratiques en physics experiments. Les professionnels utilisent des techniques similaires avec HackRF / RPi. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Plasma Antenna : Simulate reconfigurable plasma antenna with ionized gas columns. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de physique impossible',
    wiki_history: 'Le domaine de physique impossible a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme browser pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Plasma Antenna',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de physique impossible utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour physique impossible. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en physique impossible : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Physique impossible implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Signal',
    gloss1_def: 'Une grandeur variable (tension, onde électromagnétique ou flux de données) qui transporte des informations. Dans cette simulation, les signaux sont représentés visuellement pour observer leurs changements.',
    gloss2_term: 'Paramètre',
    gloss2_def: 'Une valeur configurable qui modifie le comportement du système. Chaque curseur de cette app contrôle un paramètre spécifique. Modifier les paramètres permet d explorer les relations cause-effet.',
    gloss3_term: 'Simulation',
    gloss3_def: 'Un modèle logiciel qui imite le comportement réel. Cette app simule de vrais équipements pour apprendre en toute sécurité sans matériel. La physique et les mathématiques sont réelles — seuls les signaux sont virtuels.',
    gloss4_term: 'Protocole',
    gloss4_def: 'Un ensemble de règles définissant le format, la transmission et la réception des données. Les protocoles permettent la communication entre appareils différents. Exemples : WiFi, Bluetooth, HTTP, TCP/IP.',
    gloss5_term: 'Fréquence',
    gloss5_def: 'Le nombre de cycles qu un signal complète par seconde, mesuré en Hertz (Hz). Les fréquences plus élevées transportent plus de données mais parcourent de plus courtes distances.',
    gloss6_term: 'Chiffrement',
    gloss6_def: 'Le processus de conversion de données lisibles (texte clair) en format illisible (texte chiffré) à l aide d un algorithme mathématique et d une clé. Seule la bonne clé permet de déchiffrer.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de impossible physics. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec impossible physics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'هوائي البلازما', subtitle: '⚡ عناصر RF الغاز المتأين',
    disconnected: 'غير متصل', connected: 'مشتعل',
    mainSection: 'هوائي البلازما', mainDesc: 'محاكاة هوائي بلازما قابل لإعادة التشكيل بأعمدة غاز متأين',
    sectionA: 'مقاييس الهوائي', sectionB: 'نمط الإشعاع', sectionC: 'النظرية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_plasma_title: '⚡ فيزياء البلازما', wiki_plasma: 'البلازما هي الحالة الرابعة للمادة.',
    wiki_rad_title: '📡 أنماط الإشعاع', wiki_rad: 'التوزيع ثلاثي الأبعاد للطاقة المشعة.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '⚡ هوائي البلازما جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    plasmaMode: 'وضع البلازما', ionLevel: 'مستوى التأين', rfFreq: 'تردد RF (MHz)',
    startSim: '▶ إشعال', stopSim: '⏹ إطفاء', resetSim: '↺ إعادة',
    gain: 'الكسب:', vswr: 'VSWR:', plasmaDensity: 'كثافة البلازما:', beamwidth: 'عرض الشعاع:',
    efficiency: 'الكفاءة:', bandwidth: 'عرض النطاق:',
    theoryIntro: 'هوائيات البلازما تستخدم الغاز المتأين للإشعاع الراديوي:',
    theory1: 'أعمدة الغاز المتأين تعمل كعناصر هوائي موصلة',
    theory2: 'كثافة البلازما تتحكم في تردد التشغيل',
    theory3: 'عند إزالة التأين يصبح الهوائي غير مرئي للرادار',
    theory4: 'أنماط قابلة لإعادة التشكيل بالتحكم في ملف التأين',
    theory5: 'ضوضاء حرارية شبه معدومة عند إطفاء البلازما',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '⚡ اشتعل البلازما', simStopped: '⏹ انطفأ', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ما هو Plasma Antenna؟',faq_a1:'Plasma Antenna يتيح لك محاكاة تجارب الفيزياء. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في تجارب الفيزياء. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من تجارب الفيزياء. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF / RPi. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من تجارب الفيزياء.',demo_s1:'مرحباً في Plasma Antenna! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة تجارب الفيزياء.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـتجارب الفيزياء.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل تجارب الفيزياء من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم تجارب الفيزياء من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Plasma Antenna؟',wiki_concept:'Plasma Antenna هي تقنية تُستخدم في physics experiments. في البيئات المهنية، تتطلب هذه التقنية HackRF / RPi وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من physics experiments. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Plasma Antenna له تطبيقات عملية في physics experiments. يستخدم المحترفون تقنيات مماثلة مع HackRF / RPi. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Plasma Antenna: Simulate reconfigurable plasma antenna with ionized gas columns. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الفيزياء المستحيلة',
    wiki_history: 'تطور مجال الفيزياء المستحيلة بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل browser لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Plasma Antenna',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفيزياء المستحيلة المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفيزياء المستحيلة. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفيزياء المستحيلة: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفيزياء المستحيلة يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'إشارة',
    gloss1_def: 'كمية متغيرة (جهد كهربائي أو موجة كهرومغناطيسية أو تدفق بيانات) تحمل معلومات. في هذه المحاكاة، تُمثل الإشارات بصرياً لمراقبة تغيراتها مع الوقت.',
    gloss2_term: 'معامل',
    gloss2_def: 'قيمة قابلة للتكوين تغير سلوك النظام. كل شريط تمرير في هذا التطبيق يتحكم في معامل محدد. تغيير المعاملات يتيح لك استكشاف علاقات السبب والنتيجة.',
    gloss3_term: 'محاكاة',
    gloss3_def: 'نموذج برمجي يحاكي السلوك الحقيقي. يحاكي هذا التطبيق معدات وعمليات حقيقية للتعلم بأمان بدون أجهزة. الفيزياء والرياضيات حقيقية — الإشارات فقط افتراضية.',
    gloss4_term: 'بروتوكول',
    gloss4_def: 'مجموعة قواعد تحدد كيفية تنسيق البيانات وإرسالها واستقبالها. تضمن البروتوكولات تواصل الأجهزة المختلفة. أمثلة: واي فاي وبلوتوث و HTTP و TCP/IP.',
    gloss5_term: 'تردد',
    gloss5_def: 'عدد الدورات التي تكملها إشارة في الثانية، يُقاس بالهرتز. الترددات الأعلى تحمل بيانات أكثر لكنها تنتقل لمسافات أقصر. تتراوح ترددات الراديو من 3 كيلوهرتز إلى 300 غيغاهرتز.',
    gloss6_term: 'تشفير',
    gloss6_def: 'عملية تحويل البيانات المقروءة (نص عادي) إلى صيغة غير مقروءة (نص مشفر) باستخدام خوارزمية رياضية ومفتاح. فقط من يملك المفتاح الصحيح يمكنه فك التشفير.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من impossible physics. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـimpossible physics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const t = Array.from(($('logContainer')||{children:[]}).children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'plasma-antenna-log.txt'; a.click(); URL.revokeObjectURL(u); }
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); })); }

/* ═══════════════════════════════════════════════════════
   PLASMA ANTENNA — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════ */

let running = false, animFrame = null;
const plasmaParticles = [];
const rfWaves = [];
const MAX_PARTICLES = 600;

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* Plasma tube visualization */
function drawPlasma(ctx, w, h, mode, ionLevel, time) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const ion = ionLevel / 100;

  // Ground plane
  ctx.fillStyle = 'rgba(80, 80, 80, 0.3)';
  ctx.fillRect(0, h * 0.85, w, h * 0.15);
  ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, h * 0.85); ctx.lineTo(w, h * 0.85); ctx.stroke();

  // Plasma tubes based on mode
  const tubes = [];
  switch (mode) {
    case 'monopole': tubes.push({ x: w / 2, yTop: h * 0.15, yBot: h * 0.85 }); break;
    case 'dipole': tubes.push({ x: w / 2, yTop: h * 0.1, yBot: h * 0.45 }); tubes.push({ x: w / 2, yTop: h * 0.55, yBot: h * 0.9 }); break;
    case 'array': for (let i = 0; i < 5; i++) tubes.push({ x: w * 0.2 + i * w * 0.15, yTop: h * 0.2, yBot: h * 0.85 }); break;
    case 'helix': tubes.push({ x: w / 2, yTop: h * 0.1, yBot: h * 0.85, helix: true }); break;
  }

  // Draw each tube
  for (const tube of tubes) {
    const tubeW = 12;
    // Glass tube
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.2)'; ctx.lineWidth = tubeW + 4;
    ctx.beginPath(); ctx.moveTo(tube.x, tube.yTop); ctx.lineTo(tube.x, tube.yBot); ctx.stroke();

    if (tube.helix) {
      // Helical winding
      ctx.strokeStyle = `rgba(100, ${150 + ion * 105}, 255, ${0.3 + ion * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = tube.yTop; y < tube.yBot; y += 2) {
        const phase = y * 0.15 + time * 3;
        const x = tube.x + Math.cos(phase) * 20;
        if (y === tube.yTop) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Plasma glow inside tube
    const grad = ctx.createLinearGradient(tube.x - tubeW / 2, 0, tube.x + tubeW / 2, 0);
    const intensity = ion * (0.7 + Math.sin(time * 8) * 0.3);
    grad.addColorStop(0, `rgba(100, 50, 200, 0)`);
    grad.addColorStop(0.3, `rgba(100, 100, 255, ${intensity * 0.5})`);
    grad.addColorStop(0.5, `rgba(150, 100, 255, ${intensity * 0.8})`);
    grad.addColorStop(0.7, `rgba(100, 100, 255, ${intensity * 0.5})`);
    grad.addColorStop(1, `rgba(100, 50, 200, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(tube.x - tubeW, tube.yTop, tubeW * 2, tube.yBot - tube.yTop);

    // Plasma particles inside tube
    if (Math.random() < ion * 0.4) {
      const py = tube.yTop + Math.random() * (tube.yBot - tube.yTop);
      plasmaParticles.push({
        x: tube.x + (Math.random() - 0.5) * tubeW,
        y: py, vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 3,
        life: 1, decay: 0.02 + Math.random() * 0.03,
        hue: 220 + Math.random() * 60, size: 1 + Math.random() * 3
      });
    }
  }

  // Update and draw particles
  for (let i = plasmaParticles.length - 1; i >= 0; i--) {
    const p = plasmaParticles[i];
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life * 0.8})`;
    ctx.fill();
    if (p.life <= 0) plasmaParticles.splice(i, 1);
  }
  while (plasmaParticles.length > MAX_PARTICLES) plasmaParticles.shift();

  // RF radiation waves
  if (ion > 0.2) {
    for (const tube of tubes) {
      if (Math.random() < 0.05 * ion) {
        const angle = Math.random() * Math.PI * 2;
        rfWaves.push({ x: tube.x, y: (tube.yTop + tube.yBot) / 2, radius: 5, maxRadius: 150 + Math.random() * 100, speed: 1 + Math.random(), alpha: 0.5 });
      }
    }
  }

  for (let i = rfWaves.length - 1; i >= 0; i--) {
    const wave = rfWaves[i];
    wave.radius += wave.speed;
    wave.alpha = 0.5 * (1 - wave.radius / wave.maxRadius);
    if (wave.alpha > 0) {
      ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, ${wave.alpha})`; ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    if (wave.radius >= wave.maxRadius) rfWaves.splice(i, 1);
  }

  // HUD
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('PLASMA ANTENNA', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('ION: ' + ionLevel + '%  MODE: ' + mode.toUpperCase(), 10, 34);
  ctx.fillText('Particles: ' + plasmaParticles.length, 10, 48);
}

/* Radiation pattern (polar plot) */
function drawPattern(ctx, w, h, mode, ionLevel, freq, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.4;
  const ion = ionLevel / 100;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid circles
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let r = 1; r <= 4; r++) {
    ctx.beginPath(); ctx.arc(cx, cy, maxR * r / 4, 0, Math.PI * 2); ctx.stroke();
  }
  // Grid lines
  for (let a = 0; a < 12; a++) {
    const ang = a * Math.PI / 6;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR); ctx.stroke();
  }

  // Radiation pattern
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let a = 0; a <= 360; a++) {
    const ang = a * Math.PI / 180;
    let gain;
    switch (mode) {
      case 'monopole': gain = Math.abs(Math.cos(ang)) * ion; break;
      case 'dipole': gain = Math.pow(Math.sin(ang), 2) * ion; break;
      case 'array': gain = Math.pow(Math.cos(ang * 2.5), 2) * ion * (0.8 + Math.sin(time) * 0.2); break;
      case 'helix': gain = (0.5 + 0.5 * Math.cos(ang)) * ion; break;
      default: gain = 0.5 * ion;
    }
    const r = gain * maxR;
    const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
    if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.stroke();

  // Fill pattern area
  ctx.fillStyle = `rgba(100, 200, 255, 0.1)`;
  ctx.fill();

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Radiation Pattern (' + mode + ')', 8, 14);
  ctx.fillText('0°', cx + maxR + 5, cy + 4);
  ctx.fillText('90°', cx - 8, cy - maxR - 5);
  ctx.fillText('180°', cx - maxR - 30, cy + 4);
}

/* Update metrics */
function updateMetrics(ionLevel, freq, mode) {
  const ion = ionLevel / 100;
  const baseGain = mode === 'array' ? 12 : mode === 'helix' ? 8 : mode === 'dipole' ? 5 : 3;
  const gain = (baseGain * ion + (Math.random() - 0.5) * 0.2).toFixed(1);
  const vswr = (1 + (1 - ion) * 2 + Math.random() * 0.1).toFixed(2);
  const density = (ion * 1e18).toExponential(2);
  const beamwidth = (360 / (mode === 'array' ? 5 : mode === 'helix' ? 3 : 2) * (1 - ion * 0.3)).toFixed(1);
  const eff = (ion * 85 + Math.random() * 5).toFixed(1);
  const bw = (freq * 0.1 * ion).toFixed(0);
  const g = $('gainVal'); if (g) g.textContent = gain + ' dBi';
  const v = $('vswrVal'); if (v) v.textContent = vswr + ':1';
  const d = $('densityVal'); if (d) d.textContent = density + ' /m³';
  const b = $('beamVal'); if (b) b.textContent = beamwidth + '°';
  const e = $('effVal'); if (e) e.textContent = eff + '%';
  const bwE = $('bwVal'); if (bwE) bwE.textContent = bw + ' MHz';
}

let simCtx, simW, simH, patCtx, patW, patH;
function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const mode = $('plasmaMode') ? $('plasmaMode').value : 'monopole';
  const ionLevel = $('ionSlider') ? +$('ionSlider').value : 50;
  const freq = $('rfSlider') ? +$('rfSlider').value : 900;

  if (simCtx) drawPlasma(simCtx, simW, simH, mode, ionLevel, time);
  if (patCtx) drawPattern(patCtx, patW, patH, mode, ionLevel, freq, time);
  if (Math.floor(time * 3) % 3 === 0) updateMetrics(ionLevel, freq, mode);

  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), pc = $('patternCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (pc) { const r = resizeCanvas(pc); patCtx = r.ctx; patW = r.w; patH = r.h; }
  log(LANG[currentLang].simStarted, 'success'); simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); plasmaParticles.length = 0; rfWaves.length = 0;
  [$('simCanvas'), $('patternCanvas')].forEach(c => { if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['gainVal', 'vswrVal', 'densityVal', 'beamVal', 'effVal', 'bwVal'].forEach(id => { const e = $(id); if (e) e.textContent = '--'; });
  log(LANG[currentLang].simReset, 'info');
}

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
  $('ionSlider').oninput = function () { $('ionVal').textContent = this.value + '%'; };
  $('rfSlider').oninput = function () { $('rfVal').textContent = this.value + ' MHz'; };
  window.addEventListener('resize', () => { if (running) { const sc = $('simCanvas'), pc = $('patternCanvas'); if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; } if (pc) { const r = resizeCanvas(pc); patCtx = r.ctx; patW = r.w; patH = r.h; } } });
  log(LANG[currentLang].ready, 'success');
}
document.addEventListener('DOMContentLoaded', init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Plasma Antenna
   Animated ionized gas column with radiation pattern,
   plasma density visualization, and RF coupling
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simPlasmaAntenna';let cv,cx,W,H,af=null,t=0;
  const plasmaParticles=[];const rfWaves=[];const MAX_PARTICLES=200;
  let ionLevel=70,rfFreq=150,antennaGain=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawAntennaColumn(){
    const ax=W*0.25,ay=40,aw=30,ah=H-80;
    // Glass tube
    cx.strokeStyle='rgba(150,200,255,0.2)';cx.lineWidth=2;
    cx.beginPath();
    cx.roundRect(ax-aw/2,ay,aw,ah,8);cx.stroke();
    // Plasma glow
    const glowAlpha=ionLevel/100*0.3;
    const grad=cx.createLinearGradient(ax-aw/2,ay,ax+aw/2,ay);
    grad.addColorStop(0,'rgba(100,50,255,0)');
    grad.addColorStop(0.5,'rgba(150,100,255,'+glowAlpha+')');
    grad.addColorStop(1,'rgba(100,50,255,0)');
    cx.fillStyle=grad;
    cx.beginPath();cx.roundRect(ax-aw/2+2,ay+2,aw-4,ah-4,6);cx.fill();
    // Ionization level bar
    const barH=ah*(ionLevel/100);
    cx.fillStyle='rgba(150,100,255,'+(0.1+ionLevel/200)+')';
    cx.fillRect(ax-aw/2+4,ay+ah-barH-2,aw-8,barH);
    // Plasma particles inside tube
    for(let i=0;i<ionLevel/5;i++){
      const px2=ax+(Math.random()-.5)*(aw-10);
      const py=ay+5+Math.random()*(ah-10);
      cx.fillStyle='rgba(200,150,255,'+(0.2+Math.random()*0.3)+')';
      cx.beginPath();cx.arc(px2,py,1+Math.random(),0,Math.PI*2);cx.fill();
    }
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('PLASMA TUBE',ax,ay-8);
    cx.fillText(ionLevel+'% ionized',ax,ay+ah+12);
  }

  function drawRadiationPattern(){
    const pcx=W*0.55,pcy=H/2,pr=110;
    // Polar grid
    cx.strokeStyle='rgba(100,200,255,0.06)';cx.lineWidth=0.5;
    for(let r=pr*0.25;r<=pr;r+=pr*0.25){
      cx.beginPath();cx.arc(pcx,pcy,r,0,Math.PI*2);cx.stroke();
    }
    for(let a=0;a<Math.PI*2;a+=Math.PI/6){
      cx.beginPath();cx.moveTo(pcx,pcy);
      cx.lineTo(pcx+Math.cos(a)*pr,pcy+Math.sin(a)*pr);cx.stroke();
    }
    // Radiation pattern (dipole-like with gain)
    cx.fillStyle='rgba(150,100,255,0.15)';cx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.02){
      const gain2=Math.pow(Math.abs(Math.cos(a)),1.5)*(0.5+ionLevel/200);
      const r2=pr*gain2;
      const x=pcx+Math.cos(a)*r2;const y=pcy+Math.sin(a)*r2;
      if(a===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.closePath();cx.fill();
    cx.strokeStyle='rgba(150,100,255,0.5)';cx.lineWidth=1.5;cx.stroke();
    // Animated RF emission
    for(let w=0;w<3;w++){
      const r2=(t*60+w*40)%pr;
      const alpha=0.1*(1-r2/pr);
      cx.strokeStyle='rgba(200,150,255,'+alpha+')';cx.lineWidth=1;
      cx.beginPath();cx.arc(pcx,pcy,r2,0,Math.PI*2);cx.stroke();
    }
    cx.fillStyle='rgba(150,100,255,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('RADIATION PATTERN',pcx,pcy-pr-8);
  }

  function drawFrequencyResponse(){
    const fx=W*0.78,fy=20,fw=W*0.2,fh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(fx,fy,fw,fh);
    const bins=40;const binW=fw/bins;
    for(let i=0;i<bins;i++){
      const freq=i/bins;
      const plasmaFreq=ionLevel/100;
      const response=freq>plasmaFreq?1/(1+Math.pow((freq-0.6)*5,2)):0.05;
      const bh=response*fh*0.7+Math.random()*2;
      const hue=260+freq*40;
      cx.fillStyle='hsla('+hue+',60%,50%,'+(0.3+response*0.4)+')';
      cx.fillRect(fx+i*binW,fy+fh-bh,binW-0.5,bh);
    }
    // Plasma frequency cutoff line
    const cutoff=fx+ionLevel/100*fw;
    cx.strokeStyle='rgba(255,100,100,0.3)';cx.lineWidth=1;cx.setLineDash([3,3]);
    cx.beginPath();cx.moveTo(cutoff,fy);cx.lineTo(cutoff,fy+fh);cx.stroke();cx.setLineDash([]);
    cx.fillStyle='rgba(255,100,100,0.3)';cx.font='6px monospace';cx.fillText('f_p',cutoff+3,fy+10);
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('FREQUENCY RESPONSE',fx+8,fy+10);
  }

  function drawMetrics(){
    const mx=W*0.78,my=150,mw=W*0.2,mh=70;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(mx,my,mw,mh);
    antennaGain=2+ionLevel/20;
    cx.fillStyle='rgba(150,100,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ANTENNA METRICS',mx+8,my+14);
    cx.fillStyle='#aaa';
    cx.fillText('Gain: '+antennaGain.toFixed(1)+' dBi',mx+8,my+30);
    cx.fillText('RF: '+rfFreq+' MHz',mx+8,my+44);
    cx.fillText('Ion: '+ionLevel+'%',mx+8,my+58);
  }

  function drawPlasmaPhysics(){
    const px=20,py=H-60,pw=W*0.45,ph=45;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('Plasma Freq: f_p = 9*sqrt(n_e) Hz',px+8,py+14);
    cx.fillText('Above f_p: transparent | Below f_p: reflects',px+8,py+28);
    cx.fillText('Advantage: Reconfigurable, stealth when OFF',px+8,py+42);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,180,42);
    cx.strokeStyle='rgba(150,100,255,0.15)';cx.strokeRect(8,8,180,42);
    cx.font='10px monospace';cx.fillStyle='#8b5cf6';cx.textAlign='left';
    cx.fillText('PLASMA ANTENNA',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Ionized Gas RF Radiator',16,40);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.12)';cx.fillRect(0,0,W,H);

    ionLevel=70+Math.sin(t*0.3)*20;
    rfFreq=150+Math.sin(t*0.2)*50;

    drawAntennaColumn();drawRadiationPattern();
    drawFrequencyResponse();drawMetrics();drawPlasmaPhysics();drawHUD();

    cx.fillStyle='rgba(150,100,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Plasma Antenna — Ionized Gas Column RF Radiation',8,H-8);

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
