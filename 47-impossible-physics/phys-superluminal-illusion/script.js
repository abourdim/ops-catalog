/**
 * Superluminal Illusion Lab — Workshop DIY v1.0
 * Canvas-based simulation of apparent FTL phenomena:
 * anomalous dispersion, light scissors, superluminal shadows, phase velocity.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="50" r="6" fill="currentColor" opacity=".7"><animate attributeName="cx" values="15;85;15" dur="0.6s" repeatCount="indefinite"/></circle><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="1" stroke-dasharray="4,4" opacity=".3"/><text x="50" y="30" text-anchor="middle" fill="currentColor" font-size="12" opacity=".5">c</text><line x1="50" y1="33" x2="50" y2="67" stroke="currentColor" stroke-width=".5" stroke-dasharray="2,2" opacity=".2"/></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false; const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08; const t = audioCtx.currentTime; if (type === 'click') { o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); } else if (type === 'success') { o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); } else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); } }

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
    title: 'Superluminal Illusion Lab', subtitle: '💫 Apparent FTL effects',
    disconnected: 'Offline', connected: 'Active',
    mainSection: 'Superluminal Illusion Lab', mainDesc: 'Demonstrate apparent faster-than-light group velocity illusions',
    sectionA: 'Velocity Analysis', sectionB: 'Dispersion Diagram', sectionC: 'Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events', clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language', help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki' + 's not a physical object.',
    howto_1:'The main display shows the Superluminal Illusion simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the physical constants and initial conditions for ', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Velocity Analysis" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_t1:'💫 Superluminal Illusions. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.', wiki_d1:'Apparent FTL effects that don\. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_t2:'📐 Dispersion Relations. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.', wiki_d2:'omega(k) determines phase and group velocities. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '💫 Superluminal Lab ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Failed',
    illusionType: 'Illusion Type', speedFactor: 'Speed Factor (xc)', mediumDensity: 'Medium Density',
    startSim: '▶ Start', stopSim: '⏹ Stop', resetSim: '↺ Reset',
    groupVel: 'Group Velocity:', phaseVel: 'Phase Velocity:', signalVel: 'Signal Velocity:',
    infoVel: 'Info Velocity:', dispersion: 'Dispersion:', refIndex: 'Refractive Index:',
    theoryIntro: 'Superluminal illusions arise without violating relativity:',
    theory1: 'Group velocity can exceed c in anomalous dispersion', theory2: 'No information travels faster than light',
    theory3: 'Phase velocity exceeds c in many materials', theory4: 'Light scissors: intersection moves faster than c',
    theory5: 'Shadows can sweep surfaces faster than c',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '💫 Illusion active', simStopped: '⏹ Stopped', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Superluminal Illusion Lab?',faq_a1:'Superluminal Illusion is an interactive simulation that demonstrates impossible physics concepts. Demonstrate apparent faster-than-light group velocity illusions. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real physics experiments behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real physics experiments principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:' + ',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Superluminal Illusion Lab! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Select an illusion type. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Velocity Analysis" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Superluminal Illusion! This is like a science experiment on your computer. You get to control a real impossible physics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the physical constants and initial condi Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Superluminal Illusion Lab?',wiki_concept:'Superluminal Illusion Lab is a technique used in physics experiments. Demonstrate apparent faster-than-light group velocity illusions. In professional settings, this technology requires HackRF / RPi and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the physical constants and initial conditions for the experiment. Second: Start the simulation and observe the physics phenomenon in action. The simulation runs these stages in real time, showing you intermediate results at each step. In real physics experiments, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Superluminal Illusion Lab has practical applications in physics experiments. Professionals use similar techniques with HackRF / RPi in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Superluminal Illusion Lab: Demonstrate apparent faster-than-light group velocity illusions. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Set Parameters through Run Experiment to Measure Results and Compare Theory.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Velocity Analysis" and "Dispersion Diagram" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Impossible Physics',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Superluminal Illusion builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Superluminal Illusion',
    wiki_math: 'The mathematics behind Superluminal Illusion: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced impossible physics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to impossible physics. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with impossible physics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in impossible physics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Impossible Physics carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Superluminal Illusion demonstrates key principles from impossible physics. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world impossible physics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional impossible physics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Labo Illusion Superluminique', subtitle: '💫 Effets FTL apparents',
    disconnected: 'Hors ligne', connected: 'Actif',
    mainSection: 'Labo Illusion Superluminique', mainDesc: 'Démontrer les illusions de vitesse de groupe superluminique',
    sectionA: 'Analyse de Vitesse', sectionB: 'Diagramme de Dispersion', sectionC: 'Théorie',
    activityLog: '📜 Journal', eventsMsg: 'Événements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue', help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki' + 'intersection de deux faisceaux peut se déplacer plus vite que c.',
    howto_1:'L écran principal affiche la simulation Superluminal Illusion. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the physical constants and initial conditions for ', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_t1: '💫 Illusions Superluminiques', wiki_d1: 'Effets FTL apparents sans violer la relativité.',
    wiki_t2: '📐 Relations de Dispersion', wiki_d2: 'omega(k) détermine les vitesses de phase et de groupe.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '💫 Labo superluminique prêt !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    illusionType: 'Type d\'Illusion', speedFactor: 'Facteur de Vitesse (xc)', mediumDensity: 'Densité du Milieu',
    startSim: '▶ Démarrer', stopSim: '⏹ Arrêter', resetSim: '↺ Réinitialiser',
    groupVel: 'Vitesse de Groupe :', phaseVel: 'Vitesse de Phase :', signalVel: 'Vitesse du Signal :',
    infoVel: 'Vitesse Info :', dispersion: 'Dispersion :', refIndex: 'Indice de Réfraction :',
    theoryIntro: 'Les illusions superluminiques ne violent pas la relativité :',
    theory1: 'La vitesse de groupe peut dépasser c en dispersion anormale', theory2: 'Aucune information ne voyage plus vite que la lumière',
    theory3: 'La vitesse de phase dépasse c dans beaucoup de matériaux', theory4: 'Ciseaux de lumière : l\'intersection se déplace plus vite que c',
    theory5: 'Les ombres peuvent balayer les surfaces plus vite que c',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '💫 Illusion active', simStopped: '⏹ Arrêté', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Superluminal Illusion Lab ?',faq_a1:'Superluminal Illusion est une simulation interactive qui démontre les concepts de physique impossible. Demonstrate apparent faster-than-light group velocity illusions. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de expériences de physique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de expériences de physique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF / RPi. Voir la section Code Appareil.',faq_q7:' + ',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de expériences de physique.',demo_s1:'Bienvenue dans Superluminal Illusion Lab ! Regarde l\'écran principal — c\'est ici que la simulation de expériences de physique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir. Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de expériences de physique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Superluminal Illusion ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de physique impossible — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the physical constants and initial condi Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de expériences de physique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Superluminal Illusion Lab ?',wiki_concept:'Superluminal Illusion Lab est une technique utilisée en physics experiments. Dans un contexte professionnel, cette technologie nécessite HackRF / RPi et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de physics experiments. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Superluminal Illusion Lab a des applications pratiques en physics experiments. Les professionnels utilisent des techniques similaires avec HackRF / RPi. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Superluminal Illusion Lab : Demonstrate apparent faster-than-light group velocity illusions. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de physique impossible',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Superluminal Illusion s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Superluminal Illusion',
    wiki_math: 'Les mathématiques derrière Superluminal Illusion : With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de physique impossible utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour physique impossible. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en physique impossible : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Physique impossible implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Superluminal Illusion démontre les principes clés de physique impossible. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec impossible physics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'مختبر الوهم فوق الضوئي', subtitle: '💫 تأثيرات أسرع من الضوء الظاهرة',
    disconnected: 'غير متصل', connected: 'نشط',
    mainSection: 'مختبر الوهم فوق الضوئي', mainDesc: 'عرض أوهام سرعة المجموعة فوق الضوئية الظاهرة',
    sectionA: 'تحليل السرعة', sectionB: 'مخطط التشتت', sectionC: 'النظرية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث', clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة', help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Superluminal Illusion. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the physical constants and initial conditions for ', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_t1: '💫 الأوهام فوق الضوئية', wiki_d1: 'تأثيرات FTL ظاهرة لا تنتهك النسبية الخاصة.',
    wiki_t2: '📐 علاقات التشتت', wiki_d2: 'omega(k) تحدد سرعات الطور والمجموعة.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '💫 مختبر الوهم جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    illusionType: 'نوع الوهم', speedFactor: 'عامل السرعة (xc)', mediumDensity: 'كثافة الوسط',
    startSim: '▶ ابدأ', stopSim: '⏹ إيقاف', resetSim: '↺ إعادة',
    groupVel: 'سرعة المجموعة:', phaseVel: 'سرعة الطور:', signalVel: 'سرعة الإشارة:',
    infoVel: 'سرعة المعلومات:', dispersion: 'التشتت:', refIndex: 'معامل الانكسار:',
    theoryIntro: 'الأوهام فوق الضوئية تنشأ دون انتهاك النسبية:',
    theory1: 'سرعة المجموعة يمكن أن تتجاوز c في التشتت الشاذ', theory2: 'لا معلومات تسافر أسرع من الضوء',
    theory3: 'سرعة الطور تتجاوز c في كثير من المواد', theory4: 'مقصات الضوء: التقاطع يتحرك أسرع من c',
    theory5: 'الظلال يمكن أن تمسح الأسطح أسرع من c',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '💫 الوهم نشط', simStopped: '⏹ توقف', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Superluminal Illusion Lab؟',faq_a1:'Superluminal Illusion هي محاكاة تفاعلية توضح مفاهيم الفيزياء المستحيلة. Demonstrate apparent faster-than-light group velocity illusions. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في تجارب الفيزياء. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من تجارب الفيزياء. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF / RPi. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من تجارب الفيزياء.',demo_s1:'مرحباً في Superluminal Illusion Lab! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة تجارب الفيزياء.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـتجارب الفيزياء.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Superluminal Illusion! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالفيزياء المستحيلة — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the physical constants and initial condi لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم تجارب الفيزياء من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Superluminal Illusion Lab؟',wiki_concept:'Superluminal Illusion Lab هي تقنية تُستخدم في physics experiments. في البيئات المهنية، تتطلب هذه التقنية HackRF / RPi وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من physics experiments. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Superluminal Illusion Lab له تطبيقات عملية في physics experiments. يستخدم المحترفون تقنيات مماثلة مع HackRF / RPi. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Superluminal Illusion Lab: Demonstrate apparent faster-than-light group velocity illusions. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الفيزياء المستحيلة',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. يبني Superluminal Illusion على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Superluminal Illusion',
    wiki_math: 'الرياضيات وراء Superluminal Illusion: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفيزياء المستحيلة المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفيزياء المستحيلة. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفيزياء المستحيلة: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفيزياء المستحيلة يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Superluminal Illusion يوضح المبادئ الأساسية في الفيزياء المستحيلة. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
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
async function copyLog() { try { await navigator.clipboard.writeText(Array.from(($('logContainer')||{children:[]}).children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const lc = $('logContainer'); if (!lc) return; const t = Array.from(lc.children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'superluminal-log.txt'; a.click(); URL.revokeObjectURL(u); }
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
   SUPERLUMINAL ILLUSION — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════ */
let running = false, animFrame = null;
const trails = [];

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

function drawSuperluminal(ctx, w, h, type, speedFactor, density, time) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const sf = speedFactor / 10;

  // Speed of light reference line
  const cLine = w * 0.3;
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.2)'; ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(cLine, 0); ctx.lineTo(cLine, h); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255, 255, 100, 0.3)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('c', cLine + 5, 15);

  switch (type) {
    case 'anomalous': {
      // Anomalous dispersion: wave packet group velocity > c
      const midY = h / 2;
      // Medium region
      ctx.fillStyle = `rgba(80, 40, 120, ${density / 300})`; ctx.fillRect(w * 0.3, 0, w * 0.4, h);
      ctx.strokeStyle = 'rgba(150, 100, 200, 0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.3, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.7, 0); ctx.lineTo(w * 0.7, h); ctx.stroke();

      // Wave packet envelope (group velocity)
      const groupPos = ((time * sf * 30) % (w * 1.3)) - w * 0.15;
      const packetWidth = 60;
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const env = Math.exp(-0.5 * ((x - groupPos) / packetWidth) ** 2);
        const carrier = Math.sin(x * 0.2 - time * 15);
        const inMedium = x > w * 0.3 && x < w * 0.7;
        const phaseDir = inMedium ? sf * 0.5 : 1;
        const y = midY - env * carrier * 60 * (inMedium ? 0.6 : 1);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Group velocity marker
      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
      ctx.beginPath(); ctx.arc(groupPos, midY - 80, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 100, 100, 0.6)'; ctx.font = '9px Orbitron, monospace';
      ctx.fillText('v_g = ' + sf.toFixed(1) + 'c', groupPos - 25, midY - 92);

      // Phase velocity reference
      const phasePos = ((time * 30) % (w * 1.3)) - w * 0.15;
      ctx.fillStyle = 'rgba(100, 255, 100, 0.5)';
      ctx.beginPath(); ctx.arc(phasePos, midY + 80, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText('v_p = c', phasePos - 15, midY + 95);
      break;
    }
    case 'scissors': {
      // Light scissors: intersection point moves faster than c
      const angle1 = 0.15;
      const angle2 = time * 0.3;
      const beam1Y = h * 0.3, beam2Y = h * 0.7;

      // Draw two converging beams
      for (let i = 0; i < 2; i++) {
        const startY = i === 0 ? beam1Y : beam2Y;
        const slope = i === 0 ? Math.tan(angle1) : -Math.tan(angle1);
        ctx.strokeStyle = `rgba(${i === 0 ? '100, 200, 255' : '255, 150, 100'}, 0.6)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = startY + slope * (x - w * 0.1);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Intersection point
      const intersectX = w * 0.1 + ((time * sf * 50) % w);
      const intersectY = (beam1Y + beam2Y) / 2;
      ctx.fillStyle = 'rgba(255, 255, 100, 0.9)';
      ctx.beginPath(); ctx.arc(intersectX, intersectY, 8, 0, Math.PI * 2); ctx.fill();

      // Trail
      trails.push({ x: intersectX, y: intersectY, life: 1 });
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].life -= 0.02;
        if (trails[i].life <= 0) { trails.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(255, 255, 100, ${trails[i].life * 0.3})`;
        ctx.beginPath(); ctx.arc(trails[i].x, trails[i].y, 4 * trails[i].life, 0, Math.PI * 2); ctx.fill();
      }
      while (trails.length > 200) trails.shift();

      ctx.fillStyle = 'rgba(255, 255, 100, 0.7)'; ctx.font = '10px Orbitron, monospace';
      ctx.fillText('INTERSECTION: ' + sf.toFixed(1) + 'c', intersectX + 15, intersectY - 15);
      break;
    }
    case 'shadow': {
      // Superluminal shadow on distant surface
      const lampX = w * 0.1, lampY = h * 0.5;
      const wallX = w * 0.85;

      // Light source
      ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
      ctx.beginPath(); ctx.arc(lampX, lampY, 10, 0, Math.PI * 2); ctx.fill();

      // Light rays
      const shadowAngle = Math.sin(time * sf * 0.5) * 0.4;
      for (let i = -5; i <= 5; i++) {
        const angle = i * 0.08 + shadowAngle;
        ctx.strokeStyle = `rgba(255, 220, 100, ${0.1 - Math.abs(i) * 0.015})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lampX, lampY);
        ctx.lineTo(wallX, lampY + Math.tan(angle) * (wallX - lampX));
        ctx.stroke();
      }

      // Shadow on wall
      const shadowY = lampY + Math.tan(shadowAngle) * (wallX - lampX);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(wallX, shadowY - 30, 20, 60);

      // Wall
      ctx.fillStyle = 'rgba(100, 100, 120, 0.3)';
      ctx.fillRect(wallX, 0, w - wallX, h);

      // Shadow speed indicator
      const shadowSpeed = Math.abs(Math.cos(time * sf * 0.5)) * sf * 2;
      ctx.fillStyle = 'rgba(255, 100, 100, 0.6)'; ctx.font = '10px Orbitron, monospace';
      ctx.fillText('Shadow: ' + shadowSpeed.toFixed(1) + 'c', wallX + 5, shadowY - 40);
      break;
    }
    case 'phase': {
      // Phase velocity exceeding c
      const midY = h / 2;
      // Draw waveguide walls
      ctx.fillStyle = 'rgba(60, 60, 80, 0.3)';
      ctx.fillRect(0, h * 0.25, w, 5); ctx.fillRect(0, h * 0.7, w, 5);

      // Phase fronts moving fast
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)'; ctx.lineWidth = 2;
      const phaseSpeed = sf * 1.5;
      for (let i = 0; i < 15; i++) {
        const x = ((time * phaseSpeed * 40 + i * 50) % w);
        ctx.beginPath(); ctx.moveTo(x, h * 0.25); ctx.lineTo(x, h * 0.7); ctx.stroke();
      }

      // Group/energy moving at c
      const groupX = ((time * 30) % (w * 1.3)) - w * 0.15;
      const groupWidth = 80;
      ctx.fillStyle = 'rgba(255, 200, 50, 0.15)';
      ctx.fillRect(groupX - groupWidth, h * 0.25, groupWidth * 2, h * 0.45);

      // Carrier wave
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const env = Math.exp(-0.5 * ((x - groupX) / groupWidth) ** 2);
        const y = midY + Math.sin(x * 0.15 - time * phaseSpeed * 3) * 40 * env;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = 'rgba(100, 200, 255, 0.5)'; ctx.font = '10px Orbitron, monospace';
      ctx.fillText('v_phase = ' + phaseSpeed.toFixed(1) + 'c', 10, h * 0.22);
      ctx.fillStyle = 'rgba(255, 200, 50, 0.5)';
      ctx.fillText('v_group ≤ c', groupX - 30, h * 0.77);
      break;
    }
  }

  // HUD
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('SUPERLUMINAL ILLUSION', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Mode: ' + type.toUpperCase() + '  Factor: ' + sf.toFixed(1) + 'c', 10, 34);
}

function drawDispersion(ctx, w, h, speedFactor, density, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const sf = speedFactor / 10;

  // Grid
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 10; i++) { const x = (i / 10) * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let i = 0; i <= 5; i++) { const y = (i / 5) * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // Light line (omega = ck)
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.3)'; ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();
  ctx.setLineDash([]);

  // Dispersion curve (anomalous region)
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const k = x / w * 10;
    const omega0 = 5;
    const gamma = density / 200;
    // Lorentzian dispersion
    const omega = Math.sqrt(k * k + omega0 * omega0 / (1 + gamma * k * k));
    const y = h - (omega / 12) * h;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Operating point
  const opK = sf * 0.5;
  const opX = (opK / 10) * w;
  const opY = h * 0.4;
  ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
  ctx.beginPath(); ctx.arc(opX, opY, 5, 0, Math.PI * 2); ctx.fill();

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('omega(k) Dispersion Relation', 8, 14);
  ctx.fillText('k →', w - 30, h - 5);
  ctx.fillText('omega ↑', 5, 25);
  ctx.fillStyle = 'rgba(255, 255, 100, 0.4)';
  ctx.fillText('light line', w - 80, 25);
}

function updateMetrics(speedFactor, density) {
  const sf = speedFactor / 10;
  const n = density / 100 * 0.8 + 0.2;
  const vg = $('vgVal'); if (vg) vg.textContent = sf.toFixed(2) + 'c';
  const vp = $('vpVal'); if (vp) vp.textContent = (sf * 1.2).toFixed(2) + 'c';
  const vs = $('vsVal'); if (vs) vs.textContent = '≤ 1.00c';
  const vi = $('viVal'); if (vi) vi.textContent = '≤ 1.00c';
  const disp = $('dispVal'); if (disp) disp.textContent = sf > 1 ? 'Anomalous' : 'Normal';
  const nv = $('nVal'); if (nv) nv.textContent = (1 / sf).toFixed(4);
}

let simCtx, simW, simH, anaCtx, anaW, anaH;
function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const type = $('illusionType') ? $('illusionType').value : 'anomalous';
  const speedFactor = $('speedSlider') ? +$('speedSlider').value : 30;
  const density = $('densitySlider') ? +$('densitySlider').value : 50;

  if (simCtx) drawSuperluminal(simCtx, simW, simH, type, speedFactor, density, time);
  if (anaCtx) drawDispersion(anaCtx, anaW, anaH, speedFactor, density, time);
  if (Math.floor(time * 3) % 3 === 0) updateMetrics(speedFactor, density);
  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
  log(LANG[currentLang].simStarted, 'success'); simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); trails.length = 0;
  [$('simCanvas'), $('analysisCanvas')].forEach(c => { if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['vgVal', 'vpVal', 'vsVal', 'viVal', 'dispVal', 'nVal'].forEach(id => { const e = $(id); if (e) e.textContent = '--'; });
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
  $('speedSlider').oninput = function () { $('speedVal').textContent = (this.value / 10).toFixed(1) + 'c'; };
  $('densitySlider').oninput = function () { $('densityVal').textContent = this.value + '%'; };
  window.addEventListener('resize', () => { if (running) { const sc = $('simCanvas'), ac = $('analysisCanvas'); if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; } if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; } } });
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
