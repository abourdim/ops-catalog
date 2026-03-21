/**
 * Workshop DIY — Bio Heartbeat Mesh v1.0
 * Heartbeat-synchronized mesh network
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08; const t = audioCtx.currentTime; if (type === 'click') { o.frequency.value = 800; o.type = 'sine'; g.gain.exponentialRampToValueAtTime(0.001, t + 0.08); o.start(t); o.stop(t + 0.08); } else if (type === 'success') { o.frequency.value = 523; o.type = 'sine'; g.gain.exponentialRampToValueAtTime(0.001, t + 0.3); o.start(t); o.stop(t + 0.3); } else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o.start(t); o.stop(t + 0.25); } }

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
    title: 'Bio Heartbeat Mesh', subtitle: 'Heartbeat-synchronized mesh network',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Heartbeat Mesh \u2014 Synchronized Network',
    mainDesc: 'Heartbeat-synchronized mesh network with auto-discovery and BPM sync',
    sectionA: 'A \u2014 How It Works', sectionC: 'C \u2014 Challenges',
    btn1: 'Start Mesh', btn1Stop: 'Stop', btn2: 'Add Node', btn3: 'Force Sync', btn4: 'Reset',
    stat1: 'nodes', stat2: 'links', stat3: '% sync', stat4: 'avg BPM',
    step1Title: 'Heart Sensor', step1Desc: 'Pulse sensor detects heartbeat via PPG on the fingertip. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',
    step2Title: 'Mesh Discovery', step2Desc: 'Each node broadcasts BPM. Nearby nodes auto-connect. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',
    step3Title: 'BPM Sync', step3Desc: 'Nodes gradually adjust BPM toward neighbors. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',
    step4Title: 'Network Health', step4Desc: 'Sync percentage shows harmony level. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',
    ch1Title: 'Heart Harmony', ch1Desc: 'Get 5 nodes to 95% sync. Think about why this happens — the answer reveals a fundamental principle of how the system works. Try to explain it before revealing the answer.',
    ch2Title: 'Maximum Mesh', ch2Desc: 'Add as many nodes as possible. This challenge tests whether you understand the underlying mechanism, not just the surface behavior. Experiment with different approaches before checking the solution.',
    ch3Title: 'Heart Orchestra', ch3Desc: 'Create sequential beating patterns. Real engineers face this exact problem. Your approach to solving it mirrors professional troubleshooting methodology.',
    howto_1:'The main display shows the Heartbeat Mesh simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Pulse sensor detects heartbeat via PPG on the fingertip.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "A \u2014 How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    wiki1_title: '\u2764 Heartbeat Sensing', wiki1_text: 'PPG sensors measure light absorption changes as blood flows.',
    wiki2_title: '\ud83c\udf10 Mesh Networks', wiki2_text: 'Decentralized networks with self-healing topology.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '\u2699\ufe0f Settings', language: 'Language', theme: 'Theme',
    help: '\u2753 Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', working: 'Working\u2026',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\u2764 Bio Heartbeat Mesh ready \u2014 connect to sync!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English', themeChanged: '\ud83c\udfa8 Theme \u2192',sectionCode:'Device Code',faq_q1:'What is Bio Heartbeat Mesh?',faq_a1:'Heartbeat Mesh is an interactive simulation that demonstrates bioelectronics concepts. Heartbeat-synchronized mesh network with auto-discovery and BPM sync. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start Mesh to initialize with 3 nodes. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real biomedical signals principles. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',faq_q5:'What should I experiment with?',faq_a5:'Get 5 nodes to 95% sync. The simulation models real-world behavior using validated mathematical equations. Every parameter you adjust corresponds to a real engineering variable. The visualization makes invisible processes visible, helping you develop intuition that transfers to real equipment.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Heartbeat Mesh! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start Mesh to initialize with 3 nodes. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Heartbeat Mesh! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Pulse sensor detects heartbeat via PPG on the fing Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Heartbeat Mesh?',wiki_concept:'Bio Heartbeat Mesh is a technique used in biomedical signals. Heartbeat-synchronized mesh network with auto-discovery and BPM sync. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Pulse sensor detects heartbeat via PPG on the fingertip. Second: Each node broadcasts BPM. Nearby nodes auto-connect. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Heartbeat Mesh has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Heartbeat Mesh: Heartbeat-synchronized mesh network with auto-discovery and BPM sync. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Heart Sensor through Mesh Discovery to BPM Sync and Network Health.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Quantum Tunneling Radio',related1_desc:'Simulate RF wave tunneling through quantum potential barriers',related1_path:'../../47-impossible-physics/phys-tunneling-radio/index.html',related2_name:'Dead Drop — BLE Message Transfer',related2_desc:'Encrypt and exchange secret messages via BLE simulation',related2_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',related3_name:'Dead Drop — BLE Message Transfer',related3_desc:'Encrypt and exchange secret messages via BLE simulation',related3_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Heartbeat Cipher \\u2014 OTP Encryption',pathPrev_path:'../../43-bio-radio/bio-heartbeat-cipher/index.html',pathNext_name:'Muscle Telegraph \\u2014 EMG to Morse',pathNext_path:'../../43-bio-radio/bio-muscle-telegraph/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'Which unit measures radio frequency?',quiz_q1a:'Watts',quiz_q1b:'Hertz',quiz_q1c:'Decibels',quiz_q1d:'Ohms',quiz_q1_answer:'1',quiz_q2:'What does AI stand for?',quiz_q2a:'Automated Input',quiz_q2b:'Artificial Intelligence',quiz_q2c:'Analog Interface',quiz_q2d:'Active Integration',quiz_q2_answer:'1',quiz_q3:'What is machine learning?',quiz_q3a:'Programming robots',quiz_q3b:'Systems that learn from data',quiz_q3c:'Manual computation',quiz_q3d:'Hardware design',quiz_q3_answer:'1',quiz_q4:'What does AM stand for in radio?',quiz_q4a:'Audio Modulation',quiz_q4b:'Amplitude Modulation',quiz_q4c:'Analog Modulation',quiz_q4d:'Active Modulation',quiz_q4_answer:'1',quiz_q5:'Which frequency range is UHF?',quiz_q5a:'3-30 MHz',quiz_q5b:'30-300 MHz',quiz_q5c:'300 MHz-3 GHz',quiz_q5d:'3-30 GHz',quiz_q5_answer:'2'},
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Heartbeat Mesh builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Heartbeat Mesh',
    wiki_math: 'The mathematics behind Heartbeat Mesh: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Heart rate variability (HRV) is analyzed using R-R intervals. Frequency-domain analysis reveals sympathetic (0.04-0.15 Hz) and parasympathetic (0.15-0.4 Hz) activity. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'QRS Complex',
    gloss2_def: 'The ECG waveform representing ventricular depolarization — the electrical trigger for heart muscle contraction. Duration is normally 80-120 ms.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Self-Healing',
    gloss4_def: 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Heartbeat Mesh demonstrates key principles from bioelectronics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The heart generates electrical signals detectable as ECG waveforms. The SA node fires at 60-100 bpm, producing the P-QRS-T complex visible on an electrocardiogram. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Bio R\u00e9seau Cardiaque', subtitle: 'R\u00e9seau maill\u00e9 synchronis\u00e9 au c\u0153ur',
    disconnected: 'D\u00e9connect\u00e9', connected: 'Connect\u00e9',
    mainSection: 'R\u00e9seau Cardiaque \u2014 Synchronisation',
    mainDesc: 'R\u00e9seau maill\u00e9 synchronis\u00e9 avec d\u00e9couverte automatique et sync BPM',
    sectionA: 'A \u2014 Comment \u00e7a marche', sectionC: 'C \u2014 D\u00e9fis',
    btn1: 'D\u00e9marrer', btn1Stop: 'Arr\u00eat', btn2: 'Ajouter N\u0153ud', btn3: 'Forcer Sync', btn4: 'R\u00e9initialiser',
    stat1: 'n\u0153uds', stat2: 'liens', stat3: '% sync', stat4: 'BPM moy',
    step1Title: 'Capteur Cardiaque', step1Desc: 'Capteur de pouls par PPG sur le doigt. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',
    step2Title: 'D\u00e9couverte Maill\u00e9e', step2Desc: 'Chaque nu0153ud diffuse son BPM. Connexion auto. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',
    step3Title: 'Sync BPM', step3Desc: 'Ajustement graduel vers les voisins. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',
    step4Title: 'Sant\u00e9 R\u00e9seau', step4Desc: 'Pourcentage de synchronisation. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',
    ch1Title: 'Harmonie Cardiaque', ch1Desc: '5 nu0153uds u00e0 95% de sync. Réfléchissez à pourquoi cela se produit — la réponse révèle un principe fondamental. Essayez d expliquer avant de révéler la réponse.',
    ch2Title: 'Maille Maximum', ch2Desc: 'Ajoutez le plus de nu0153uds possible. Ce défi teste votre compréhension du mécanisme sous-jacent. Expérimentez différentes approches avant de vérifier la solution.',
    ch3Title: 'Orchestre Cardiaque', ch3Desc: 'Cru00e9ez des battements su00e9quentiels. Les vrais ingénieurs font face à ce problème exact. Votre approche reflète la méthodologie professionnelle de dépannage.',
    howto_1:'L écran principal affiche la simulation Heartbeat Mesh. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Pulse sensor detects heartbeat via PPG on the fingertip.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    wiki1_title: '\u2764 Capteur PPG', wiki1_text: 'Mesure les variations d\'absorption lumineuse du sang.',
    wiki2_title: '\ud83c\udf10 R\u00e9seaux Maill\u00e9s', wiki2_text: 'R\u00e9seaux d\u00e9centralis\u00e9s auto-r\u00e9parateurs.',
    activityLog: 'Journal', eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me',
    help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sons', breathingGuide: 'Respiration', dhikrTap: 'Tap', musicMode: 'Musique',
    splashHint: 'appuyer', working: 'En cours\u2026',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\u2764 R\u00e9seau cardiaque pr\u00eat!',
    logCleared: 'Effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais', themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Heartbeat Mesh ?',faq_a1:'Heartbeat Mesh est une simulation interactive qui démontre les concepts de bioélectronique. Heartbeat-synchronized mesh network with auto-discovery and BPM sync. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système. La simulation modélise le comportement réel à l aide d équations mathématiques validées. Chaque paramètre correspond à une variable d ingénierie réelle. La visualisation rend visibles les processus invisibles.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Heartbeat Mesh ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Heartbeat Mesh ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de bioélectronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Pulse sensor detects heartbeat via PPG on the fing Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Bio Heartbeat Mesh ?',wiki_concept:'Bio Heartbeat Mesh est une technique utilisée en biomedical signals. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de biomedical signals. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Bio Heartbeat Mesh a des applications pratiques en biomedical signals. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Bio Heartbeat Mesh : Heartbeat-synchronized mesh network with auto-discovery and BPM sync. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Radio Tunnel Quantique',related1_desc:'Simuler le passage d\\',related1_path:'../../47-impossible-physics/phys-tunneling-radio/index.html',related2_name:'Dead Drop — Transfert BLE',related2_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related2_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',related3_name:'Dead Drop — Transfert BLE',related3_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related3_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Chiffre Cardiaque \\u2014 Chiffrement OTP',pathPrev_path:'../../43-bio-radio/bio-heartbeat-cipher/index.html',pathNext_name:'T\\u00e9l\\u00e9graphe Musculaire \\u2014 EMG en Morse',pathNext_path:'../../43-bio-radio/bio-muscle-telegraph/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quelle unité mesure la fréquence radio ?',quiz_q1a:'Watts',quiz_q1b:'Hertz',quiz_q1c:'Décibels',quiz_q1d:'Ohms',quiz_q1_answer:'1',quiz_q2:'Que signifie IA ?',quiz_q2a:'Entrée automatisée',quiz_q2b:'Intelligence Artificielle',quiz_q2c:'Interface analogique',quiz_q2d:'Intégration active',quiz_q2_answer:'1',quiz_q3:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q3a:'Programmer des robots',quiz_q3b:'Systèmes apprenant des données',quiz_q3c:'Calcul manuel',quiz_q3d:'Conception matérielle',quiz_q3_answer:'1',quiz_q4:'Que signifie AM en radio ?',quiz_q4a:'Modulation Audio',quiz_q4b:'Modulation d\'Amplitude',quiz_q4c:'Modulation Analogique',quiz_q4d:'Modulation Active',quiz_q4_answer:'1',quiz_q5:'Quelle plage de fréquences est UHF ?',quiz_q5a:'3-30 MHz',quiz_q5b:'30-300 MHz',quiz_q5c:'300 MHz-3 GHz',quiz_q5d:'3-30 GHz',quiz_q5_answer:'2'},
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Heartbeat Mesh s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Heartbeat Mesh',
    wiki_math: 'Les mathématiques derrière Heartbeat Mesh : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Heart rate variability (HRV) is analyzed using R-R intervals. Frequency-domain analysis reveals sympathetic (0.04-0.15 Hz) and parasympathetic (0.15-0.4 Hz) activity. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'QRS Complex',
    gloss2_def: 'The ECG waveform representing ventricular depolarization — the electrical trigger for heart muscle contraction. Duration is normally 80-120 ms.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Self-Healing',
    gloss4_def: 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Heartbeat Mesh démontre les principes clés de bioélectronique. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The heart generates electrical signals detectable as ECG waveforms. The SA node fires at 60-100 bpm, producing the P-QRS-T complex visible on an electrocardiogram. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '\u0634\u0628\u0643\u0629 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628', subtitle: '\u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0634\u0628\u0643\u0629 \u0627\u0644\u0646\u0628\u0636 \u2014 \u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629',
    mainDesc: '\u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0627\u0643\u062a\u0634\u0627\u0641 \u062a\u0644\u0642\u0627\u0626\u064a',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    btn1: '\u0628\u062f\u0621', btn1Stop: '\u0625\u064a\u0642\u0627\u0641', btn2: '\u0625\u0636\u0627\u0641\u0629 \u0639\u0642\u062f\u0629', btn3: '\u0645\u0632\u0627\u0645\u0646\u0629', btn4: '\u0625\u0639\u0627\u062f\u0629',
    stat1: '\u0639\u0642\u062f', stat2: '\u0631\u0648\u0627\u0628\u0637', stat3: '% \u062a\u0632\u0627\u0645\u0646', stat4: 'BPM',
    step1Title: '\u0645\u0633\u062a\u0634\u0639\u0631 \u0627\u0644\u0642\u0644\u0628', step1Desc: 'u0645u0633u062au0634u0639u0631 u0627u0644u0646u0628u0636 u0639u0628u0631 PPG. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',
    step2Title: '\u0627\u0643\u062a\u0634\u0627\u0641 \u0627\u0644\u0634\u0628\u0643\u0629', step2Desc: '\u0643\u0644 \u0639\u0642\u062f\u0629 \u062a\u0628\u062b BPM. \u0627\u062a\u0635\u0627\u0644 \u062a\u0644\u0642\u0627\u0626\u064a.',
    step3Title: '\u0645\u0632\u0627\u0645\u0646\u0629 BPM', step3Desc: '\u0627\u0644\u0639\u0642\u062f \u062a\u0636\u0628\u0637 \u0645\u0639\u062f\u0644\u0647\u0627 \u0646\u062d\u0648 \u0627\u0644\u062c\u064a\u0631\u0627\u0646.',
    step4Title: '\u0635\u062d\u0629 \u0627\u0644\u0634\u0628\u0643\u0629', step4Desc: 'u0646u0633u0628u0629 u0627u0644u062au0632u0627u0645u0646. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',
    ch1Title: '\u062a\u0646\u0627\u063a\u0645 \u0627\u0644\u0642\u0644\u0648\u0628', ch1Desc: '5 u0639u0642u062f u0628u062au0632u0627u0645u0646 95%. فكر لماذا يحدث هذا — الإجابة تكشف مبدأ أساسياً لكيفية عمل النظام. حاول الشرح قبل كشف الإجابة.',
    ch2Title: '\u0623\u0642\u0635\u0649 \u0634\u0628\u0643\u0629', ch2Desc: 'u0623u0636u0641 u0623u0643u062bu0631 u0639u062fu062f u0645u0645u0643u0646. يختبر هذا التحدي فهمك للآلية الكامنة وليس السلوك السطحي فقط. جرب أساليب مختلفة قبل التحقق من الحل.',
    ch3Title: '\u0623\u0648\u0631\u0643\u0633\u062a\u0631\u0627 \u0627\u0644\u0642\u0644\u0628', ch3Desc: '\u0623\u0646\u0634\u0626 \u0623\u0646\u0645\u0627\u0637 \u062a\u062a\u0627\u0628\u0639\u064a\u0629.',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Heartbeat Mesh. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Pulse sensor detects heartbeat via PPG on the fingertip.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    wiki1_title: '\u2764 PPG', wiki1_text: '\u0642\u064a\u0627\u0633 \u0627\u0645\u062a\u0635\u0627\u0635 \u0627\u0644\u0636\u0648\u0621 \u0623\u062b\u0646\u0627\u0621 \u062a\u062f\u0641\u0642 \u0627\u0644\u062f\u0645.',
    wiki2_title: '\ud83c\udf10 \u0634\u0628\u0643\u0627\u062a', wiki2_text: '\u0634\u0628\u0643\u0627\u062a \u0644\u0627\u0645\u0631\u0643\u0632\u064a\u0629 \u0630\u0627\u062a\u064a\u0629 \u0627\u0644\u0625\u0635\u0644\u0627\u062d.',
    activityLog: '\u0633\u062c\u0644', eventsMsg: '\u0623\u062d\u062f\u0627\u062b',
    clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0644\u063a\u0629', theme: '\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0635\u0648\u062a', breathingGuide: '\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637', musicMode: '\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint: '\u0627\u0646\u0642\u0631', working: '\u062c\u0627\u0631\u064d\u2026',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\u2764 \u0634\u0628\u0643\u0629 \u0627\u0644\u0646\u0628\u0636 \u062c\u0627\u0647\u0632\u0629!',
    logCleared: '\u062a\u0645 \u0627\u0644\u0645\u0633\u062d', copied: '\u062a\u0645!', copyFail: '\u0641\u0634\u0644',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',sectionCode:'كود الجهاز',faq_q1:'ما هو Bio Heartbeat Mesh؟',faq_a1:'Heartbeat Mesh هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. Heartbeat-synchronized mesh network with auto-discovery and BPM sync. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الإشارات الطبية الحيوية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الإشارات الطبية الحيوية. نفس المفاهيم يستخدمها المحترفون. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام. تحاكي المحاكاة السلوك الحقيقي باستخدام معادلات رياضية تم التحقق منها. كل معامل تضبطه يتوافق مع متغير هندسي حقيقي. التصور يجعل العمليات غير المرئية مرئية.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الإشارات الطبية الحيوية.',demo_s1:'مرحباً في Bio Heartbeat Mesh! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الإشارات الطبية الحيوية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالإشارات الطبية الحيوية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Heartbeat Mesh! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالإلكترونيات الحيوية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Pulse sensor detects heartbeat via PPG on the fing لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الإشارات الطبية الحيوية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Bio Heartbeat Mesh؟',wiki_concept:'Bio Heartbeat Mesh هي تقنية تُستخدم في biomedical signals. في البيئات المهنية، تتطلب هذه التقنية Mixed وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من biomedical signals. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Bio Heartbeat Mesh له تطبيقات عملية في biomedical signals. يستخدم المحترفون تقنيات مماثلة مع Mixed. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Bio Heartbeat Mesh: Heartbeat-synchronized mesh network with auto-discovery and BPM sync. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Heartbeat Mesh على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Heartbeat Mesh',
    wiki_math: 'الرياضيات وراء Heartbeat Mesh: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Heart rate variability (HRV) is analyzed using R-R intervals. Frequency-domain analysis reveals sympathetic (0.04-0.15 Hz) and parasympathetic (0.15-0.4 Hz) activity. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'QRS Complex',
    gloss2_def: 'The ECG waveform representing ventricular depolarization — the electrical trigger for heart muscle contraction. Duration is normally 80-120 ms.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Self-Healing',
    gloss4_def: 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Heartbeat Mesh يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The heart generates electrical signals detectable as ECG waveforms. The SA node fires at 60-100 bpm, producing the P-QRS-T complex visible on an electrocardiogram. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'راديو النفق الكمي',related1_desc:'محاكاة نفق موجات RF عبر حواجز الجهد الكمية',related1_path:'../../47-impossible-physics/phys-tunneling-radio/index.html',related2_name:'Dead Drop — نقل رسائل BLE',related2_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related2_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',related3_name:'Dead Drop — نقل رسائل BLE',related3_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related3_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'\\u0634\\u0641\\u0631\\u0629 \\u0627\\u0644\\u0642\\u0644\\u0628 \\u2014 \\u062a\\u0634\\u0641\\u064a\\u0631 OTP',pathPrev_path:'../../43-bio-radio/bio-heartbeat-cipher/index.html',pathNext_name:'\\u062a\\u0644\\u063a\\u0631\\u0627\\u0641 \\u0627\\u0644\\u0639\\u0636\\u0644\\u0627\\u062a \\u2014 EMG \\u0625\\u0644\\u0649 \\u0645\\u0648\\u0631\\u0633',pathNext_path:'../../43-bio-radio/bio-muscle-telegraph/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما وحدة قياس التردد الراديوي؟',quiz_q1a:'واط',quiz_q1b:'هرتز',quiz_q1c:'ديسيبل',quiz_q1d:'أوم',quiz_q1_answer:'1',quiz_q2:'ماذا تعني AI؟',quiz_q2a:'إدخال آلي',quiz_q2b:'الذكاء الاصطناعي',quiz_q2c:'واجهة تناظرية',quiz_q2d:'تكامل نشط',quiz_q2_answer:'1',quiz_q3:'ما هو التعلم الآلي؟',quiz_q3a:'برمجة الروبوتات',quiz_q3b:'أنظمة تتعلم من البيانات',quiz_q3c:'حساب يدوي',quiz_q3d:'تصميم العتاد',quiz_q3_answer:'1',quiz_q4:'ماذا تعني AM في الراديو؟',quiz_q4a:'تعديل صوتي',quiz_q4b:'تعديل السعة',quiz_q4c:'تعديل تناظري',quiz_q4d:'تعديل نشط',quiz_q4_answer:'1',quiz_q5:'ما نطاق التردد UHF؟',quiz_q5a:'3-30 ميغاهرتز',quiz_q5b:'30-300 ميغاهرتز',quiz_q5c:'300 ميغاهرتز-3 غيغاهرتز',quiz_q5d:'3-30 غيغاهرتز',quiz_q5_answer:'2'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


/* ═══════ FRAMEWORK ═══════ */
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';
function setLanguage(l) { currentLang = l; const s = LANG[l]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(e => { const k = e.dataset.i18n; if (s[k] != null) e.textContent = s[k]; }); document.title = `${s.title} \u2014 Workshop DIY`; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = l; const sel = $('langSelect'); if (sel) sel.value = l; try { localStorage.setItem('wdiy-lang', l); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const sel = $('themeSelect'); if (sel) sel.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} const s = LANG[currentLang]; log(`${s.themeChanged} ${s['t_' + n] || n}`, 'info'); }
let logContainer; const logHistory = [];
function log(m, t = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${t}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${m}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (t === 'success') playSound('success'); else if (t === 'error') playSound('error'); logHistory.push({ m, t, ts: Date.now() }); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const b = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'heartbeat-mesh-log.txt'; a.click(); }
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(b => { b.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(x => x.classList.remove('active')); b.classList.add('active'); activeLogFilter = b.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = activeLogFilter === 'all' || l.classList.contains(activeLogFilter) ? '' : 'none'; }); }
let toastTimer = null;
function showToast(m, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = m; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
function calcHijriDate() { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch { return ''; } }
function openPanel(p, o) { const s = $(p), v = $(o); if (s) s.classList.add('open'); if (v) v.classList.add('open'); }
function closePanel(p, o, r) { const s = $(p), v = $(o); if (s) s.classList.remove('open'); if (v) v.classList.remove('open'); const b = $(r); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(t => { t.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(x => x.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); t.classList.add('active'); const id = 'help' + t.dataset.tab.charAt(0).toUpperCase() + t.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); }); }); }
function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h || !p) return; let d = false, sx, sw; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = document.documentElement.dir === 'rtl' ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { d = false; }); }
let breathingActive = false;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); }
function incrementDhikr() { const c = $('dhikrCounter'); if (c) c.textContent = parseInt(c.textContent || '0') + 1; }
let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ HEARTBEAT MESH SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let running = false, nodes = [], links = [];
const NODE_COLORS = ['#ff3366', '#ff6633', '#33ff33', '#6699ff', '#ffcc00', '#ff33cc', '#33ffcc', '#9966ff', '#ff9933', '#66ff33'];

function addNode() {
  const canvas = $('meshCanvas');
  const W = canvas ? canvas.width : 760, H = canvas ? canvas.height : 340;
  const n = { x: 60 + Math.random() * (W - 120), y: 60 + Math.random() * (H - 120), bpm: 55 + Math.random() * 40, phase: Math.random() * Math.PI * 2, r: 16, name: `Node${nodes.length + 1}`, color: NODE_COLORS[nodes.length % NODE_COLORS.length], history: [] };
  nodes.push(n);
  // Auto-link nearby nodes
  nodes.forEach((o, i) => {
    if (o === n) return;
    const d = Math.hypot(o.x - n.x, o.y - n.y);
    if (d < 220) links.push({ a: nodes.length - 1, b: i, strength: 1 - d / 220 });
  });
  log(`${n.name} joined mesh (${Math.round(n.bpm)} BPM)`, 'success');
}

function initMeshApp() {
  const canvas = $('meshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;

  // ECG-like heartbeat trace
  function ecgWave(phase) {
    const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const n = p / (Math.PI * 2);
    if (n < 0.05) return Math.sin(n / 0.05 * Math.PI) * 0.3;
    if (n < 0.1) return 0;
    if (n < 0.15) return -Math.sin((n - 0.1) / 0.05 * Math.PI) * 0.15;
    if (n < 0.2) return Math.sin((n - 0.15) / 0.05 * Math.PI) * 1.0; // R peak
    if (n < 0.25) return -Math.sin((n - 0.2) / 0.05 * Math.PI) * 0.25;
    if (n < 0.4) return Math.sin((n - 0.25) / 0.15 * Math.PI) * 0.15;
    return 0;
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;

    // Draw links with heartbeat pulse
    links.forEach(l => {
      const a = nodes[l.a], b = nodes[l.b];
      if (!a || !b) return;
      const beatA = ecgWave(a.phase);
      const pulse = Math.max(0, beatA);

      // Link line
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(255,51,102,${0.1 + pulse * 0.4})`;
      ctx.lineWidth = 1 + pulse * 3;
      ctx.stroke();

      // Sync packet traveling along link
      if (beatA > 0.8) {
        const progress = (t * 2) % 1;
        const mx = a.x + (b.x - a.x) * progress;
        const my = a.y + (b.y - a.y) * progress;
        ctx.beginPath();
        ctx.arc(mx, my, 3 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3366';
        ctx.fill();
      }
    });

    // Draw and update nodes
    nodes.forEach((n, ni) => {
      n.phase += 0.016 * n.bpm / 60 * Math.PI * 2;
      const beat = ecgWave(n.phase);
      const glow = Math.max(0, beat);

      // Store history for mini ECG
      n.history.push(beat);
      if (n.history.length > 60) n.history.shift();

      // Glow ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,51,102,${0.05 + glow * 0.25})`;
      ctx.fill();

      // Node body
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color + 'cc');
      grad.addColorStop(1, n.color + '44');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mini ECG trace inside node
      ctx.save();
      ctx.beginPath();
      ctx.rect(n.x - n.r + 2, n.y - 6, (n.r - 2) * 2, 12);
      ctx.clip();
      ctx.beginPath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      n.history.forEach((v, i) => {
        const hx = n.x - n.r + 2 + (i / 60) * (n.r * 2 - 4);
        const hy = n.y - v * 5;
        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      });
      ctx.stroke();
      ctx.restore();

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '8px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(n.name, n.x, n.y - n.r - 8);
      ctx.fillStyle = n.color;
      ctx.fillText(`${Math.round(n.bpm)} BPM`, n.x, n.y - n.r - 0);
      ctx.textAlign = 'left';

      // Gradually sync BPM to neighbors
      if (running) {
        links.forEach(l => {
          let other = null;
          if (nodes[l.a] === n) other = nodes[l.b];
          if (nodes[l.b] === n) other = nodes[l.a];
          if (other) n.bpm += (other.bpm - n.bpm) * 0.0008 * l.strength;
        });
      }
    });

    // Network info overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(W - 170, 8, 162, 55);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Orbitron';
    ctx.fillText(`Nodes: ${nodes.length}  Links: ${links.length}`, W - 162, 22);
    if (nodes.length > 1) {
      const bpms = nodes.map(n => n.bpm);
      const avg = bpms.reduce((a, b) => a + b) / bpms.length;
      const sync = Math.max(0, 100 - bpms.reduce((a, b) => a + Math.abs(b - avg), 0) / nodes.length * 2);
      ctx.fillText(`Avg BPM: ${Math.round(avg)}`, W - 162, 38);
      ctx.fillStyle = sync > 80 ? '#33ff33' : sync > 50 ? '#ffcc00' : '#ff3366';
      ctx.fillText(`Sync: ${Math.round(sync)}%`, W - 162, 54);
    }

    // Update stats
    const sn = $('statNodes'), sl = $('statLinks'), ss = $('statSync'), sa = $('statAvgBPM');
    if (sn) sn.textContent = nodes.length;
    if (sl) sl.textContent = links.length;
    if (nodes.length > 1) {
      const bpms = nodes.map(n => n.bpm);
      const avg = bpms.reduce((a, b) => a + b) / bpms.length;
      const sync = Math.max(0, 100 - bpms.reduce((a, b) => a + Math.abs(b - avg), 0) / nodes.length * 2);
      if (ss) ss.textContent = Math.round(sync);
      if (sa) sa.textContent = Math.round(avg);
      const sf = $('syncFill'), slbl = $('syncLabel');
      if (sf) sf.style.width = sync + '%';
      if (slbl) slbl.textContent = `${Math.round(sync)}% sync \u2014 ${Math.round(avg)} BPM avg`;
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Drag nodes
  let dragNode = null;
  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    dragNode = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 5);
  });
  canvas.addEventListener('mousemove', e => {
    if (!dragNode) return;
    const rect = canvas.getBoundingClientRect();
    dragNode.x = Math.max(20, Math.min(W - 20, (e.clientX - rect.left) * (W / rect.width)));
    dragNode.y = Math.max(20, Math.min(H - 20, (e.clientY - rect.top) * (H / rect.height)));
  });
  canvas.addEventListener('mouseup', () => { dragNode = null; });

  // Controls
  const startBtn = $('startBtn'), addBtnEl = $('addBtn'), syncBtnEl = $('syncBtn'), resetBtnEl = $('resetBtn');

  if (startBtn) startBtn.onclick = () => {
    running = !running;
    setStatus(running);
    if (running && nodes.length === 0) { for (let i = 0; i < 3; i++) addNode(); }
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = running ? LANG[currentLang].btn1Stop : LANG[currentLang].btn1;
    log(running ? '\u2764 Mesh network started' : 'Mesh stopped', 'info');
  };

  if (addBtnEl) addBtnEl.onclick = () => {
    addNode();
    playSound('click');
  };

  if (syncBtnEl) syncBtnEl.onclick = () => {
    if (nodes.length === 0) { log('No nodes to sync', 'error'); return; }
    const target = nodes[0].bpm;
    nodes.forEach(n => n.bpm = target + (Math.random() - 0.5) * 2);
    log(`\u2764 Force sync to ${Math.round(target)} BPM`, 'success');
    showToast('Synchronized!', 1200);
  };

  if (resetBtnEl) resetBtnEl.onclick = () => {
    nodes = []; links = [];
    running = false;
    setStatus(false);
    const span = startBtn?.querySelector('[data-i18n]');
    if (span) span.textContent = LANG[currentLang].btn1;
    log('Mesh reset', 'info');
  };
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lBtn = $('logBtn'), lC = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lC) lC.onclick = closeLog;
  initLogResize();
  const st = $('soundToggle');
  if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  const bb = $('breathingBtn'), dd = $('dhikrDisplay'), db = $('dhikrBtn');
  if (bb) bb.onclick = () => { toggleBreathing(); if (dd) dd.style.display = breathingActive ? 'flex' : 'none'; };
  if (db) db.onclick = incrementDhikr;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  const ls = $('langSelect'); if (ls) ls.onchange = () => setLanguage(ls.value);
  const ts = $('themeSelect'); if (ts) ts.onchange = () => setTheme(ts.value);
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  const hd = $('hijriDate'); if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }
  let lc = 0, lt = null; const logo = $('logoWrap');
  if (logo) { logo.style.cursor = 'pointer'; logo.onclick = () => { lc++; if (lt) clearTimeout(lt); if (lc >= 3) { lc = 0; toggleMatrix(); } else lt = setTimeout(() => lc = 0, 500); }; }
  log(LANG[currentLang].ready, 'success');
  setTimeout(initMeshApp, 50);
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ HEARTBEAT MESH ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootMeshViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,51,102,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- mesh node definitions --- */
    var COLORS=['#ff3366','#ff6633','#33ff33','#6699ff','#ffcc00','#ff33cc','#33ffcc','#9966ff','#ff9933','#66ff33'];
    var vizNodes=[],vizLinks=[];

    function addVizNode(){
      var n={
        x:80+Math.random()*(W*0.55-160),
        y:80+Math.random()*(H*0.55-100),
        bpm:55+Math.random()*40,
        phase:Math.random()*Math.PI*2,
        color:COLORS[vizNodes.length%COLORS.length],
        name:'N'+(vizNodes.length+1),
        history:[],
        pulseAlpha:0
      };
      vizNodes.push(n);
      /* auto-link */
      vizNodes.forEach(function(o,i){
        if(o===n)return;
        var d=Math.hypot(o.x-n.x,o.y-n.y);
        if(d<200)vizLinks.push({a:vizNodes.length-1,b:i,strength:1-d/200});
      });
    }
    /* initialize with 5 nodes */
    for(var ni=0;ni<5;ni++)addVizNode();

    /* ECG-like waveform */
    function ecg(phase){
      var p=((phase%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      var n2=p/(Math.PI*2);
      if(n2<0.05)return Math.sin(n2/0.05*Math.PI)*0.3;
      if(n2<0.1)return 0;
      if(n2<0.15)return -Math.sin((n2-0.1)/0.05*Math.PI)*0.15;
      if(n2<0.2)return Math.sin((n2-0.15)/0.05*Math.PI)*1.0;
      if(n2<0.25)return -Math.sin((n2-0.2)/0.05*Math.PI)*0.25;
      if(n2<0.4)return Math.sin((n2-0.25)/0.15*Math.PI)*0.15;
      return 0;
    }

    /* --- sync metrics --- */
    var syncHistory=[];var MAX_SYNC=200;
    var hrHistory=[];var MAX_HR=200;
    var networkEntropy=0;

    /* --- draw ECG strip for a node --- */
    function drawECGStrip(ox,oy,w,h,node,idx){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.strokeStyle=node.color+'44';ctx.strokeRect(ox,oy,w,h);

      if(node.history.length>1){
        ctx.beginPath();ctx.strokeStyle=node.color;ctx.lineWidth=1.5;
        node.history.forEach(function(v,i){
          var x=ox+(i/60)*w;
          var y=oy+h/2-v*h*0.35;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
      }
      ctx.fillStyle=node.color;ctx.font='7px Orbitron,monospace';
      ctx.fillText(node.name+' '+Math.round(node.bpm)+'BPM',ox+3,oy+10);
    }

    /* --- draw network topology graph --- */
    function drawTopology(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);

      /* links */
      vizLinks.forEach(function(l){
        var a=vizNodes[l.a],b2=vizNodes[l.b];
        if(!a||!b2)return;
        var beatA=ecg(a.phase);
        var pulse=Math.max(0,beatA);
        /* scale positions to viewport */
        var ax=ox+a.x/(W*0.55)*w,ay=oy+a.y/(H*0.55)*h;
        var bx=ox+b2.x/(W*0.55)*w,by=oy+b2.y/(H*0.55)*h;

        ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);
        ctx.strokeStyle='rgba(255,51,102,'+(0.08+pulse*0.3)+')';
        ctx.lineWidth=1+pulse*2;ctx.stroke();

        /* traveling packet */
        if(beatA>0.8){
          var prog=(t*2)%1;
          var mx=ax+(bx-ax)*prog,my=ay+(by-ay)*prog;
          ctx.beginPath();ctx.arc(mx,my,2+pulse*2,0,Math.PI*2);
          ctx.fillStyle='#ff3366';ctx.fill();
        }
      });

      /* nodes */
      vizNodes.forEach(function(n2){
        var beat=ecg(n2.phase);
        var glow=Math.max(0,beat);
        var nx=ox+n2.x/(W*0.55)*w,ny=oy+n2.y/(H*0.55)*h;

        /* glow */
        ctx.beginPath();ctx.arc(nx,ny,8+glow*8,0,Math.PI*2);
        ctx.fillStyle='rgba(255,51,102,'+(0.03+glow*0.15)+')';ctx.fill();

        /* body */
        var g=ctx.createRadialGradient(nx,ny,0,nx,ny,8);
        g.addColorStop(0,n2.color+'cc');g.addColorStop(1,n2.color+'44');
        ctx.beginPath();ctx.arc(nx,ny,8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();

        ctx.fillStyle='#fff';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(n2.name,nx,ny-12);
        ctx.fillStyle=n2.color;ctx.fillText(Math.round(n2.bpm),nx,ny+18);
        ctx.textAlign='left';
      });

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MESH TOPOLOGY',ox+5,oy+12);
    }

    /* --- draw sync timeline --- */
    function drawSyncTimeline(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('SYNCHRONIZATION TIMELINE',ox+5,oy+12);

      if(syncHistory.length>1){
        ctx.beginPath();ctx.strokeStyle='#33ff33';ctx.lineWidth=1.5;
        syncHistory.forEach(function(v,i){
          var x=ox+(i/MAX_SYNC)*w;
          var y=oy+h-v/100*(h-20)-5;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
        /* fill */
        ctx.beginPath();ctx.moveTo(ox,oy+h);
        syncHistory.forEach(function(v,i){ctx.lineTo(ox+(i/MAX_SYNC)*w,oy+h-v/100*(h-20)-5);});
        ctx.lineTo(ox+(syncHistory.length/MAX_SYNC)*w,oy+h);ctx.closePath();
        ctx.fillStyle='rgba(51,255,51,0.06)';ctx.fill();
      }

      /* threshold line */
      var thY=oy+h-95/100*(h-20)-5;
      ctx.strokeStyle='rgba(255,204,0,0.3)';ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(ox,thY);ctx.lineTo(ox+w,thY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(255,204,0,0.4)';ctx.fillText('95%',ox+w-25,thY-3);
    }

    /* --- draw heart rate distribution --- */
    function drawHRDistribution(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BPM DISTRIBUTION',ox+5,oy+12);

      /* histogram bins 40-120 BPM */
      var bins=new Array(20).fill(0);
      vizNodes.forEach(function(n2){
        var bin=Math.floor((n2.bpm-40)/4);
        if(bin>=0&&bin<20)bins[bin]++;
      });
      var maxBin=Math.max.apply(null,bins)||1;
      var binW=(w-20)/20;
      bins.forEach(function(v,i){
        var bh2=(v/maxBin)*(h-30);
        var hue=i/20*120;
        ctx.fillStyle='hsla('+hue+',70%,50%,0.6)';
        ctx.fillRect(ox+10+i*binW,oy+h-5-bh2,binW-1,bh2);
      });
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='6px Orbitron,monospace';
      ctx.fillText('40',ox+10,oy+h+6);ctx.fillText('120',ox+w-20,oy+h+6);
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* update all nodes */
      vizNodes.forEach(function(n2,ni2){
        n2.phase+=0.016*n2.bpm/60*Math.PI*2;
        var beat=ecg(n2.phase);
        n2.history.push(beat);if(n2.history.length>60)n2.history.shift();

        /* sync toward neighbors */
        vizLinks.forEach(function(l){
          var other=null;
          if(vizNodes[l.a]===n2)other=vizNodes[l.b];
          if(vizNodes[l.b]===n2)other=vizNodes[l.a];
          if(other)n2.bpm+=(other.bpm-n2.bpm)*0.0012*l.strength;
        });
      });

      /* compute sync */
      var sync2=0;
      if(vizNodes.length>1){
        var bpms2=vizNodes.map(function(n2){return n2.bpm;});
        var avg2=bpms2.reduce(function(a,b2){return a+b2;})/bpms2.length;
        sync2=Math.max(0,100-bpms2.reduce(function(a,b2){return a+Math.abs(b2-avg2);},0)/vizNodes.length*2);
      }
      syncHistory.push(sync2);if(syncHistory.length>MAX_SYNC)syncHistory.shift();

      /* ---- LAYOUT ---- */

      /* Top-left: Mesh topology */
      drawTopology(0,0,W*0.55,H*0.55);

      /* Top-right: ECG strips for each node */
      var ecgX=W*0.56,ecgW=W*0.44-5;
      var stripH=Math.min(50,(H*0.55)/Math.max(vizNodes.length,1)-2);
      vizNodes.forEach(function(n2,ni2){
        if(ni2*stripH>H*0.55-10)return;
        drawECGStrip(ecgX,ni2*(stripH+2),ecgW,stripH,n2,ni2);
      });

      /* Bottom-left: Sync timeline */
      drawSyncTimeline(0,H*0.56+5,W*0.55,H*0.20);

      /* Bottom-right: HR distribution */
      drawHRDistribution(W*0.56,H*0.56+5,W*0.44-5,H*0.20);

      /* Very bottom: Stats bar */
      var stY=H*0.78;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(0,stY,W,H-stY);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('MESH NETWORK STATISTICS',10,stY+14);

      var avg3=0;
      if(vizNodes.length>0){
        avg3=vizNodes.reduce(function(a,n2){return a+n2.bpm;},0)/vizNodes.length;
      }
      var stats3=[
        ['Nodes',vizNodes.length.toString()],
        ['Links',vizLinks.length.toString()],
        ['Sync',sync2.toFixed(0)+'%'],
        ['Avg BPM',avg3.toFixed(0)],
        ['Min BPM',vizNodes.length>0?Math.min.apply(null,vizNodes.map(function(n2){return n2.bpm;})).toFixed(0):'--'],
        ['Max BPM',vizNodes.length>0?Math.max.apply(null,vizNodes.map(function(n2){return n2.bpm;})).toFixed(0):'--'],
        ['Density',vizNodes.length>1?(2*vizLinks.length/(vizNodes.length*(vizNodes.length-1))*100).toFixed(0)+'%':'--'],
        ['Network',sync2>90?'HARMONY':sync2>60?'SYNCING':'DIVERGENT']
      ];
      stats3.forEach(function(s,si){
        var sx=10+(si%4)*W*0.24;
        var sy=stY+30+Math.floor(si/4)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(s[0]+':',sx,sy);
        ctx.fillStyle=sync2>80?'#33ff33':sync2>50?'#ffcc00':'#ff3366';
        ctx.fillText(s[1],sx+70,sy);
      });

      /* pulse indicator at each node on beat */
      vizNodes.forEach(function(n2){
        var beat=ecg(n2.phase);
        if(beat>0.9){
          n2.pulseAlpha=1;
        }
        if(n2.pulseAlpha>0){
          n2.pulseAlpha-=0.02;
          var nx=n2.x/(W*0.55)*(W*0.55),ny=n2.y/(H*0.55)*(H*0.55);
          ctx.beginPath();ctx.arc(nx,ny,20+((1-n2.pulseAlpha)*25),0,Math.PI*2);
          ctx.strokeStyle='rgba(255,51,102,'+Math.max(0,n2.pulseAlpha*0.4).toFixed(2)+')';
          ctx.lineWidth=2;ctx.stroke();
        }
      });

      /* HUD corners */
      ctx.strokeStyle='rgba(255,51,102,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl3=18;ctx.strokeStyle='rgba(255,51,102,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl3);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl3,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(255,51,102,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('MESH',W-60,17);

      requestAnimationFrame(frame);
    }

    /* click to add node */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      if(mx<W*0.55&&my<H*0.55&&vizNodes.length<12){
        var n3={
          x:mx/(W*0.55)*(W*0.55),y:my/(H*0.55)*(H*0.55),
          bpm:55+Math.random()*40,phase:Math.random()*Math.PI*2,
          color:COLORS[vizNodes.length%COLORS.length],name:'N'+(vizNodes.length+1),
          history:[],pulseAlpha:0
        };
        vizNodes.push(n3);
        vizNodes.forEach(function(o,i){
          if(o===n3)return;
          var d=Math.hypot(o.x-n3.x,o.y-n3.y);
          if(d<200)vizLinks.push({a:vizNodes.length-1,b:i,strength:1-d/200});
        });
      }
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootMeshViz);
  else setTimeout(bootMeshViz,200);
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
