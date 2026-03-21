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
    howto_1:'The main display shows the Quantum Random Beacon simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the physical constants and initial conditions for ',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Entropy Analysis" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
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
    t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Quantum Random Beacon?',faq_a1:'Quantum Random Beacon is an interactive simulation that demonstrates impossible physics concepts. Generate true random numbers from quantum vacuum fluctuations. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real physics experiments behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real physics experiments principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Quantum Random Beacon! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Select a quantum noise source type from the dropdown. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Entropy Analysis" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Quantum Random Beacon! This is like a science experiment on your computer. You get to control a real impossible physics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the physical constants and initial condi Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Quantum Random Beacon: Generate true random numbers from quantum vacuum fluctuations. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Set Parameters through Run Experiment to Measure Results and Compare Theory.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Entropy Analysis" and "Randomness Tests" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Impossible Physics',
    wiki_history: 'Beacons have been part of WiFi since the original 802.11 standard (1997). Beacon stuffing and hidden SSIDs are common security considerations. Quantum Random Beacon builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Quantum Random Beacon',
    wiki_math: 'The mathematics behind Quantum Random Beacon: Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity. A qubit state |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. N qubits represent 2^N states simultaneously. Measurement collapses to one state with probability |α|².',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced impossible physics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to impossible physics. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with impossible physics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in impossible physics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Impossible Physics carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Beacon Interval',
    gloss1_def: 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
    gloss2_term: 'Superposition',
    gloss2_def: 'A quantum state where a qubit exists as both 0 and 1 simultaneously. Only upon measurement does it collapse to a definite value. This parallelism powers quantum algorithms.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Quantum Random Beacon demonstrates key principles from impossible physics. Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel. Quantum computing uses qubits that can be in superposition (0 and 1 simultaneously). Entanglement and interference enable algorithms impossible for classical computers. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world impossible physics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional impossible physics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
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
    howto_1:'L écran principal affiche la simulation Quantum Random Beacon. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the physical constants and initial conditions for ',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
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
    t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Quantum Random Beacon ?',faq_a1:'Quantum Random Beacon est une simulation interactive qui démontre les concepts de physique impossible. Generate true random numbers from quantum vacuum fluctuations. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de expériences de physique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de expériences de physique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF / RPi. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de expériences de physique.',demo_s1:'Bienvenue dans Quantum Random Beacon ! Regarde l\'écran principal — c\'est ici que la simulation de expériences de physique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de expériences de physique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Quantum Random Beacon ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de physique impossible — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the physical constants and initial condi Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de expériences de physique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Quantum Random Beacon : Generate true random numbers from quantum vacuum fluctuations. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de physique impossible',
    wiki_history: 'Beacons have been part of WiFi since the original 802.11 standard (1997). Beacon stuffing and hidden SSIDs are common security considerations. Quantum Random Beacon s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Quantum Random Beacon',
    wiki_math: 'Les mathématiques derrière Quantum Random Beacon : Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity. A qubit state |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. N qubits represent 2^N states simultaneously. Measurement collapses to one state with probability |α|².',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de physique impossible utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour physique impossible. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en physique impossible : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Physique impossible implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Beacon Interval',
    gloss1_def: 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
    gloss2_term: 'Superposition',
    gloss2_def: 'A quantum state where a qubit exists as both 0 and 1 simultaneously. Only upon measurement does it collapse to a definite value. This parallelism powers quantum algorithms.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Quantum Random Beacon démontre les principes clés de physique impossible. Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel. Quantum computing uses qubits that can be in superposition (0 and 1 simultaneously). Entanglement and interference enable algorithms impossible for classical computers. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec impossible physics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
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
    howto_1:'تعرض الشاشة الرئيسية محاكاة Quantum Random Beacon. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the physical constants and initial conditions for ',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
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
    t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ما هو Quantum Random Beacon؟',faq_a1:'Quantum Random Beacon هي محاكاة تفاعلية توضح مفاهيم الفيزياء المستحيلة. Generate true random numbers from quantum vacuum fluctuations. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في تجارب الفيزياء. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من تجارب الفيزياء. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF / RPi. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من تجارب الفيزياء.',demo_s1:'مرحباً في Quantum Random Beacon! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة تجارب الفيزياء.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـتجارب الفيزياء.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Quantum Random Beacon! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالفيزياء المستحيلة — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the physical constants and initial condi لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم تجارب الفيزياء من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Quantum Random Beacon: Generate true random numbers from quantum vacuum fluctuations. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الفيزياء المستحيلة',
    wiki_history: 'Beacons have been part of WiFi since the original 802.11 standard (1997). Beacon stuffing and hidden SSIDs are common security considerations. يبني Quantum Random Beacon على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Quantum Random Beacon',
    wiki_math: 'الرياضيات وراء Quantum Random Beacon: Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity. A qubit state |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. N qubits represent 2^N states simultaneously. Measurement collapses to one state with probability |α|².',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفيزياء المستحيلة المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفيزياء المستحيلة. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفيزياء المستحيلة: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفيزياء المستحيلة يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Beacon Interval',
    gloss1_def: 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
    gloss2_term: 'Superposition',
    gloss2_def: 'A quantum state where a qubit exists as both 0 and 1 simultaneously. Only upon measurement does it collapse to a definite value. This parallelism powers quantum algorithms.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Quantum Random Beacon يوضح المبادئ الأساسية في الفيزياء المستحيلة. Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel. Quantum computing uses qubits that can be in superposition (0 and 1 simultaneously). Entanglement and interference enable algorithms impossible for classical computers. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـimpossible physics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

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
