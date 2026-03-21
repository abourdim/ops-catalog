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
  ,
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
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
    howto_1:'The main display shows the Plasma Antenna simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the physical constants and initial conditions for ', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
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
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Plasma Antenna?',faq_a1:'Plasma Antenna is an interactive simulation that demonstrates impossible physics concepts. Simulate reconfigurable plasma antenna with ionized gas columns. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real physics experiments behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real physics experiments principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Plasma Antenna! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Select a plasma antenna configuration. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Antenna Metrics" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Plasma Antenna! This is like a science experiment on your computer. You get to control a real impossible physics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the physical constants and initial condi Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Plasma Antenna?',wiki_concept:'Plasma Antenna is a technique used in physics experiments. Simulate reconfigurable plasma antenna with ionized gas columns. In professional settings, this technology requires HackRF / RPi and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the physical constants and initial conditions for the experiment. Second: Start the simulation and observe the physics phenomenon in action. The simulation runs these stages in real time, showing you intermediate results at each step. In real physics experiments, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Plasma Antenna has practical applications in physics experiments. Professionals use similar techniques with HackRF / RPi in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Plasma Antenna: Simulate reconfigurable plasma antenna with ionized gas columns. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Set Parameters through Run Experiment to Measure Results and Compare Theory.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Antenna Metrics" and "Radiation Pattern" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Brainwave Radio \\u2014 EEG to RF',related1_desc:'Transmit brain states via modulated radio',related1_path:'../../43-bio-radio/bio-brainwave-radio/index.html',related2_name:'Dead Drop — BLE Message Transfer',related2_desc:'Encrypt and exchange secret messages via BLE simulation',related2_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',related3_name:'Nanosecond Radar',related3_desc:'Visualize ultra-precise timing pulses and measure nanosecond intervals',related3_path:'../../45-time-manipulation/chrono-nanosecond-radar/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Metamaterial Simulator',pathPrev_path:'../../47-impossible-physics/phys-metamaterial-simulator/index.html',pathNext_name:'Quantum Random Beacon',pathNext_path:'../../47-impossible-physics/phys-quantum-random-beacon/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'A half-wave dipole antenna length is based on?',quiz_q1a:'Current',quiz_q1b:'Voltage',quiz_q1c:'Wavelength',quiz_q1d:'Power',quiz_q1_answer:'2',quiz_q2:'What does antenna gain measure?',quiz_q2a:'Size',quiz_q2b:'Directional efficiency',quiz_q2c:'Color',quiz_q2d:'Weight',quiz_q2_answer:'1',quiz_q3:'What is impedance measured in?',quiz_q3a:'Farads',quiz_q3b:'Henrys',quiz_q3c:'Ohms',quiz_q3d:'Watts',quiz_q3_answer:'2',quiz_q4:'What is a neural network?',quiz_q4a:'Physical wires',quiz_q4b:'Computing system inspired by biological neurons',quiz_q4c:'Social network',quiz_q4d:'Radio network',quiz_q4_answer:'1',quiz_q5:'What does AI stand for?',quiz_q5a:'Automated Input',quiz_q5b:'Artificial Intelligence',quiz_q5c:'Analog Interface',quiz_q5d:'Active Integration',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'CERN\'s LHC generates 1 petabyte/second during collisions. The Worldwide LHC Computing Grid spans 170 centers in 42 countries. In 2012, it confirmed the Higgs boson, completing the Standard Model of physics.',realworld2:'LIGO detected gravitational waves in 2015, confirming Einstein\'s 100-year-old prediction. The sensors measured spacetime distortions of 10⁻²¹ meters — one ten-thousandth the width of a proton.',realworld3:'Voyager 1, launched in 1977, communicates from 24 billion km away using a 23-watt transmitter — the power of a fridge light bulb. Signals take 22+ hours each way. The Deep Space Network uses 70m dishes to receive them.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In impossible physics, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in impossible physics and reveal the hidden complexity beneath simple-looking systems.',proTipTitle:'💡 Pro Tips',proTip1:'Export simulation data using the Copy button, paste into a spreadsheet, and create your own charts. Comparing multiple runs in a chart reveals patterns invisible on screen.',proTip2:'Open your browser\\x27s Developer Console (F12) to see the raw data behind the visualization. The simulation logs every calculation — this is how you verify the math.',funFactTitle:'🎯 Did You Know?',funFact:'Lightning bolts reach temperatures of 30,000°C — five times hotter than the surface of the Sun. Each bolt carries enough energy to toast 100,000 slices of bread.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
    wiki_history_title: '📜 History of Impossible Physics',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Plasma Antenna builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Plasma Antenna',
    wiki_math: 'The mathematics behind Plasma Antenna: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced impossible physics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to impossible physics. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with impossible physics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in impossible physics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Impossible Physics carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Gain (dBi)',
    gloss2_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Plasma Antenna demonstrates key principles from impossible physics. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
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
    howto_1:'L écran principal affiche la simulation Plasma Antenna. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the physical constants and initial conditions for ', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
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
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Plasma Antenna ?',faq_a1:'Plasma Antenna est une simulation interactive qui démontre les concepts de physique impossible. Simulate reconfigurable plasma antenna with ionized gas columns. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de expériences de physique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de expériences de physique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF / RPi. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de expériences de physique.',demo_s1:'Bienvenue dans Plasma Antenna ! Regarde l\'écran principal — c\'est ici que la simulation de expériences de physique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir. Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de expériences de physique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Plasma Antenna ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de physique impossible — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the physical constants and initial condi Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de expériences de physique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Plasma Antenna ?',wiki_concept:'Plasma Antenna est une technique utilisée en physics experiments. Dans un contexte professionnel, cette technologie nécessite HackRF / RPi et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de physics experiments. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Plasma Antenna a des applications pratiques en physics experiments. Les professionnels utilisent des techniques similaires avec HackRF / RPi. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Plasma Antenna : Simulate reconfigurable plasma antenna with ionized gas columns. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Radio C\\u00e9r\\u00e9brale \\u2014 EEG vers RF',related1_desc:'Transmettre les \\u00e9tats c\\u00e9r\\u00e9braux par radio',related1_path:'../../43-bio-radio/bio-brainwave-radio/index.html',related2_name:'Dead Drop — Transfert BLE',related2_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related2_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',related3_name:'Radar Nanoseconde',related3_desc:'Visualiser des impulsions temporelles ultra-precises',related3_path:'../../45-time-manipulation/chrono-nanosecond-radar/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Simulateur de Métamatériaux',pathPrev_path:'../../47-impossible-physics/phys-metamaterial-simulator/index.html',pathNext_name:'Balise Quantique Aléatoire',pathNext_path:'../../47-impossible-physics/phys-quantum-random-beacon/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'La longueur d\'un dipôle demi-onde est basée sur ?',quiz_q1a:'Le courant',quiz_q1b:'La tension',quiz_q1c:'La longueur d\'onde',quiz_q1d:'La puissance',quiz_q1_answer:'2',quiz_q2:'Que mesure le gain d\'antenne ?',quiz_q2a:'Taille',quiz_q2b:'Efficacité directionnelle',quiz_q2c:'Couleur',quiz_q2d:'Poids',quiz_q2_answer:'1',quiz_q3:'En quoi se mesure l\'impédance ?',quiz_q3a:'Farads',quiz_q3b:'Henrys',quiz_q3c:'Ohms',quiz_q3d:'Watts',quiz_q3_answer:'2',quiz_q4:'Qu\'est-ce qu\'un réseau de neurones ?',quiz_q4a:'Fils physiques',quiz_q4b:'Système informatique inspiré des neurones',quiz_q4c:'Réseau social',quiz_q4d:'Réseau radio',quiz_q4_answer:'1',quiz_q5:'Que signifie IA ?',quiz_q5a:'Entrée automatisée',quiz_q5b:'Intelligence Artificielle',quiz_q5c:'Interface analogique',quiz_q5d:'Intégration active',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'Le LHC du CERN génère 1 pétaoctet par seconde lors des collisions. En 2012, il a confirmé le boson de Higgs, complétant le Modèle standard de la physique.',realworld2:'LIGO a détecté des ondes gravitationnelles en 2015, confirmant la prédiction centenaire d\'Einstein. Les capteurs ont mesuré des distorsions de l\'espace-temps de 10⁻²¹ mètres.',realworld3:'Voyager 1, lancé en 1977, communique depuis 24 milliards de km avec un émetteur de 23 watts. Les signaux prennent plus de 22 heures dans chaque sens.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En physique impossible, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en physique impossible et révèlent la complexité cachée sous des systèmes simples en apparence.',proTipTitle:'💡 Conseils de pro',proTip1:'Exportez les données avec le bouton Copier, collez dans un tableur et créez vos propres graphiques.',proTip2:'Ouvrez la console développeur (F12) pour voir les données brutes derrière la visualisation. La simulation enregistre chaque calcul.',funFactTitle:'🎯 Le saviez-vous ?',funFact:'La foudre atteint 30 000°C — cinq fois plus chaud que la surface du Soleil. Chaque éclair transporte assez d\x27énergie pour griller 100 000 tranches de pain.',mistakeTitle:'⚠️ Erreurs courantes',mistake1:'Changer plusieurs paramètres à la fois rend impossible l\x27isolation de la cause et de l\x27effet. Changez toujours UNE seule variable à la fois.',mistake2:'Sauter la mesure de référence. Sans connaître le comportement par défaut, vous ne pouvez pas mesurer l\x27impact de vos changements.',mistake3:'Ignorer le journal d\x27activité. Il enregistre chaque événement avec des horodatages — essentiel pour comprendre les séquences.'},
    wiki_history_title: '📜 Histoire de physique impossible',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Plasma Antenna s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Plasma Antenna',
    wiki_math: 'Les mathématiques derrière Plasma Antenna : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de physique impossible utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour physique impossible. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en physique impossible : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Physique impossible implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Gain (dBi)',
    gloss2_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Plasma Antenna démontre les principes clés de physique impossible. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
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
    howto_1:'تعرض الشاشة الرئيسية محاكاة Plasma Antenna. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the physical constants and initial conditions for ', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
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
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Plasma Antenna؟',faq_a1:'Plasma Antenna هي محاكاة تفاعلية توضح مفاهيم الفيزياء المستحيلة. Simulate reconfigurable plasma antenna with ionized gas columns. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في تجارب الفيزياء. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من تجارب الفيزياء. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF / RPi. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من تجارب الفيزياء.',demo_s1:'مرحباً في Plasma Antenna! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة تجارب الفيزياء.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـتجارب الفيزياء.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Plasma Antenna! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالفيزياء المستحيلة — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the physical constants and initial condi لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم تجارب الفيزياء من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Plasma Antenna؟',wiki_concept:'Plasma Antenna هي تقنية تُستخدم في physics experiments. في البيئات المهنية، تتطلب هذه التقنية HackRF / RPi وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من physics experiments. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Plasma Antenna له تطبيقات عملية في physics experiments. يستخدم المحترفون تقنيات مماثلة مع HackRF / RPi. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Plasma Antenna: Simulate reconfigurable plasma antenna with ionized gas columns. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الفيزياء المستحيلة',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Plasma Antenna على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Plasma Antenna',
    wiki_math: 'الرياضيات وراء Plasma Antenna: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفيزياء المستحيلة المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفيزياء المستحيلة. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفيزياء المستحيلة: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفيزياء المستحيلة يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Gain (dBi)',
    gloss2_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Plasma Antenna يوضح المبادئ الأساسية في الفيزياء المستحيلة. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـimpossible physics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0631\\u0627\\u062f\\u064a\\u0648 \\u0627\\u0644\\u062f\\u0645\\u0627\\u063a \\u2014 EEG \\u0625\\u0644\\u0649 RF',related1_desc:'\\u0628\\u062b \\u062d\\u0627\\u0644\\u0627\\u062a \\u0627\\u0644\\u062f\\u0645\\u0627\\u063a \\u0639\\u0628\\u0631 \\u0631\\u0627\\u062f\\u064a\\u0648',related1_path:'../../43-bio-radio/bio-brainwave-radio/index.html',related2_name:'Dead Drop — نقل رسائل BLE',related2_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related2_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',related3_name:'رادار النانوثانية',related3_desc:'تصور نبضات التوقيت فائقة الدقة وقياس فترات النانوثانية',related3_path:'../../45-time-manipulation/chrono-nanosecond-radar/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'محاكي الميتاماتيريال',pathPrev_path:'../../47-impossible-physics/phys-metamaterial-simulator/index.html',pathNext_name:'منارة الكم العشوائية',pathNext_path:'../../47-impossible-physics/phys-quantum-random-beacon/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'طول هوائي ثنائي القطب نصف الموجة يعتمد على؟',quiz_q1a:'التيار',quiz_q1b:'الجهد',quiz_q1c:'طول الموجة',quiz_q1d:'القدرة',quiz_q1_answer:'2',quiz_q2:'ماذا يقيس كسب الهوائي؟',quiz_q2a:'الحجم',quiz_q2b:'الكفاءة الاتجاهية',quiz_q2c:'اللون',quiz_q2d:'الوزن',quiz_q2_answer:'1',quiz_q3:'بماذا تُقاس المعاوقة؟',quiz_q3a:'فاراد',quiz_q3b:'هنري',quiz_q3c:'أوم',quiz_q3d:'واط',quiz_q3_answer:'2',quiz_q4:'ما هي الشبكة العصبية؟',quiz_q4a:'أسلاك مادية',quiz_q4b:'نظام حوسبة مستوحى من الخلايا العصبية',quiz_q4c:'شبكة اجتماعية',quiz_q4d:'شبكة راديو',quiz_q4_answer:'1',quiz_q5:'ماذا تعني AI؟',quiz_q5a:'إدخال آلي',quiz_q5b:'الذكاء الاصطناعي',quiz_q5c:'واجهة تناظرية',quiz_q5d:'تكامل نشط',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'يولد مصادم الهادرونات الكبير في سيرن 1 بيتابايت في الثانية أثناء التصادمات. في عام 2012 أكد بوزون هيغز مكملاً النموذج القياسي للفيزياء.',realworld2:'رصد مرصد ليغو موجات الجاذبية عام 2015 مؤكدًا تنبؤ أينشتاين قبل 100 عام. قاست المستشعرات تشوهات في الزمكان بمقدار 10⁻²¹ متر.',realworld3:'يتواصل المسبار فويجر 1 الذي أُطلق عام 1977 من مسافة 24 مليار كم باستخدام مرسل بقدرة 23 واط. تستغرق الإشارات أكثر من 22 ساعة في كل اتجاه.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الفيزياء المستحيلة معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الفيزياء المستحيلة وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',proTipTitle:'💡 نصائح احترافية',proTip1:'صدّر بيانات المحاكاة باستخدام زر النسخ والصقها في جدول بيانات وأنشئ مخططاتك الخاصة.',proTip2:'افتح وحدة تحكم المطور في المتصفح (F12) لرؤية البيانات الخام وراء العرض المرئي. تسجل المحاكاة كل عملية حسابية.',funFactTitle:'🎯 هل تعلم؟',funFact:'يصل البرق إلى درجة حرارة 30,000 درجة مئوية — خمس مرات أسخن من سطح الشمس.',mistakeTitle:'⚠️ أخطاء شائعة',mistake1:'تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.',mistake2:'تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.',mistake3:'تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
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
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);
