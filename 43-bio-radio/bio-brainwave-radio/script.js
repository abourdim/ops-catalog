/**
 * Workshop DIY — Bio Brainwave Radio v1.0
 * EEG brainwaves to radio transmission
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); const o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain(); o2.connect(g2); g2.connect(audioCtx.destination); g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine'; g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o2.start(t + 0.15); o2.stop(t + 0.4); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
    case 'tx': osc.frequency.value = 1200; osc.type = 'sawtooth'; gain.gain.value = 0.04; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); osc.start(t); osc.stop(t + 0.15); break;
    case 'brain': osc.frequency.value = 300; osc.type = 'sine'; gain.gain.value = 0.05; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); osc.start(t); osc.stop(t + 0.4); break;
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
    title: 'Bio Brainwave Radio', subtitle: 'EEG brainwaves to radio transmission',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Brainwave Radio \u2014 EEG to RF', mainDesc: 'Transmit brain states via modulated radio',
    sectionA: 'A \u2014 How It Works', sectionC: 'C \u2014 Challenges',
    startEEG: 'Start EEG', stopEEG: 'Stop', relaxMode: 'Relax', focusMode: 'Focus', transmit: 'Transmit',
    statAlpha: 'Alpha', statTheta: 'Theta', statBeta: 'Beta', statFocus: 'Focus',
    step1Title: 'EEG Pickup', step1Desc: 'Electrodes detect tiny brain electrical signals (10-100 microvolts). Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',
    step2Title: 'FFT Analysis', step2Desc: 'Fast Fourier Transform decomposes signals into Delta, Theta, Alpha, Beta bands. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',
    step3Title: 'RF Modulation', step3Desc: 'Brain state data modulates a radio carrier. Focus level controls modulation. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',
    step4Title: 'Transmission', step4Desc: 'micro:bit transmits the signal. Another micro:bit receives and decodes brain state.',
    ch1Title: 'Alpha Boost', ch1Desc: 'Close your eyes and relax. Can you boost alpha above 15 Hz?. Think about why this happens — the answer reveals a fundamental principle of how the system works. Try to explain it before revealing the answer.',
    ch2Title: 'Focus Challenge', ch2Desc: 'Reach 80% focus by increasing beta wave activity. This challenge tests whether you understand the underlying mechanism, not just the surface behavior. Experiment with different approaches before checking the solution.',
    ch3Title: 'Brain-to-Brain', ch3Desc: 'Transmit your brain state to a partner. Can they guess your state?. Real engineers face this exact problem. Your approach to solving it mirrors professional troubleshooting methodology.',
    howto_1:'The main display shows the Brainwave Radio simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Electrodes detect tiny brain electrical signals (10-100 micr', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.', howto_3:'Scroll down to the expandable sections. "A \u2014 How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    wiki_eeg_title: '\ud83e\udde0 EEG Bands', wiki_eeg: 'Delta (0.5-4Hz), Theta (4-8Hz), Alpha (8-13Hz), Beta (13-30Hz), Gamma (30-100Hz).',
    wiki_bci_title: '\ud83d\udce1 Brain-Computer Interface', wiki_bci: 'BCI reads brain signals to control devices. EEG is the most common non-invasive method.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages', clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '\u2699\ufe0f Settings', language: 'Language', theme: 'Theme', help: '\u2753 Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', working: 'Working\u2026',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83e\udde0 Brainwave Radio ready \u2014 connect your mind!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English', themeChanged: '\ud83c\udfa8 Theme \u2192',
    eegStarted: 'EEG acquisition started', eegStopped: 'EEG stopped', modeRelax: 'Mode: Relaxation \u2014 boosting alpha', modeFocus: 'Mode: Focus \u2014 boosting beta', needEEG: 'Start EEG first',sectionCode:'Device Code',faq_q1:'What is Bio Brainwave Radio?',faq_a1:'Brainwave Radio is an interactive simulation that demonstrates bioelectronics concepts. Transmit brain states via modulated radio. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start EEG to begin brainwave simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u062f\u0644\u062a\u0627 (0.5-4Hz)\u060c \u062b\u064a\u062a\u0627 (4-8Hz)\u060c \u0623\u0644\u0641\u0627 (8-13Hz)\u060c \u0628\u064a\u062a\u0627 (13-30Hz)\u060c \u063a\u0627\u0645\u0627 (30-100Hz).',faq_q5:'What should I experiment with?',faq_a5:'Close your eyes and relax. Can you boost alpha above 15 Hz?. The simulation models real-world behavior using validated mathematical equations. Every parameter you adjust corresponds to a real engineering variable. The visualization makes invisible processes visible, helping you develop intuition that transfers to real equipment.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Breath Modulator. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Brainwave Radio! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start EEG to begin brainwave simulation. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Brainwave Radio! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Electrodes detect tiny brain electrical signals (1 Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Brainwave Radio?',wiki_concept:'Bio Brainwave Radio is a technique used in biomedical signals. Transmit brain states via modulated radio. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Electrodes detect tiny brain electrical signals (10-100 microvolts). Second: Fast Fourier Transform decomposes signals into Delta, Theta, Alpha, Beta bands. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Brainwave Radio has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Brainwave Radio: Transmit brain states via modulated radio. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from EEG Pickup through FFT Analysis to RF Modulation and Transmission.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios. Brainwave Radio builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Brainwave Radio',
    wiki_math: 'The mathematics behind Brainwave Radio: The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Bandwidth',
    gloss1_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Brainwave Radio demonstrates key principles from bioelectronics. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Bio Radio C\u00e9r\u00e9brale', subtitle: 'EEG vers transmission radio',
    disconnected: 'D\u00e9connect\u00e9', connected: 'Connect\u00e9',
    mainSection: 'Radio C\u00e9r\u00e9brale \u2014 EEG vers RF', mainDesc: 'Transmettre les \u00e9tats c\u00e9r\u00e9braux par radio',
    sectionA: 'A \u2014 Comment \u00e7a marche', sectionC: 'C \u2014 D\u00e9fis',
    startEEG: 'D\u00e9marrer EEG', stopEEG: 'Arr\u00eat', relaxMode: 'Relaxation', focusMode: 'Concentration', transmit: 'Transmettre',
    statAlpha: 'Alpha', statTheta: 'Th\u00eata', statBeta: 'B\u00eata', statFocus: 'Focus',
    step1Title: 'Capteur EEG', step1Desc: 'Les \u00e9lectrodes d\u00e9tectent les signaux \u00e9lectriques du cerveau (10-100 \u00b5V).',
    step2Title: 'Analyse FFT', step2Desc: 'La FFT du00e9compose les signaux en bandes: Delta, Thu00eata, Alpha, Bu00eata. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',
    step3Title: 'Modulation RF', step3Desc: 'Les donnu00e9es cu00e9ru00e9brales modulent une porteuse radio. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',
    step4Title: 'Transmission', step4Desc: 'Le micro:bit transmet le signal modul\u00e9. Un autre re\u00e7oit et d\u00e9code.',
    ch1Title: 'Boost Alpha', ch1Desc: 'Fermez les yeux. Boostez alpha au-dessus de 15 Hz. Réfléchissez à pourquoi cela se produit — la réponse révèle un principe fondamental. Essayez d expliquer avant de révéler la réponse.',
    ch2Title: 'D\u00e9fi Focus', ch2Desc: 'Atteignez 80% de concentration. Ce défi teste votre compréhension du mécanisme sous-jacent. Expérimentez différentes approches avant de vérifier la solution.',
    ch3Title: 'Cerveau-\u00e0-Cerveau', ch3Desc: 'Transmettez votre u00e9tat u00e0 un partenaire. Les vrais ingénieurs font face à ce problème exact. Votre approche reflète la méthodologie professionnelle de dépannage.',
    howto_1:'L écran principal affiche la simulation Brainwave Radio. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Electrodes detect tiny brain electrical signals (10-100 micr', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.', howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    wiki_eeg_title: '\ud83e\udde0 Bandes EEG', wiki_eeg: 'Delta (0.5-4Hz), Th\u00eata (4-8Hz), Alpha (8-13Hz), B\u00eata (13-30Hz), Gamma (30-100Hz).',
    wiki_bci_title: '\ud83d\udce1 Interface Cerveau-Machine', wiki_bci: 'Les syst\u00e8mes ICM lisent les signaux c\u00e9r\u00e9braux. L\'EEG est la m\u00e9thode non-invasive la plus courante.',
    activityLog: 'Journal', eventsMsg: '\u00c9v\u00e9nements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me', help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores', whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'R\u00e9actif musique',
    splashHint: 'appuyer pour passer', working: 'En cours\u2026',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83e\udde0 Radio c\u00e9r\u00e9brale pr\u00eate \u2014 connectez votre esprit!',
    logCleared: 'Journal effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais', themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    eegStarted: 'Acquisition EEG d\u00e9marr\u00e9e', eegStopped: 'EEG arr\u00eat\u00e9', modeRelax: 'Mode: Relaxation \u2014 boost alpha', modeFocus: 'Mode: Concentration \u2014 boost b\u00eata', needEEG: 'D\u00e9marrez l\'EEG d\'abord',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Brainwave Radio ?',faq_a1:'Brainwave Radio est une simulation interactive qui démontre les concepts de bioélectronique. Transmit brain states via modulated radio. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système. La simulation modélise le comportement réel à l aide d équations mathématiques validées. Chaque paramètre correspond à une variable d ingénierie réelle. La visualisation rend visibles les processus invisibles.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Brainwave Radio ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Brainwave Radio ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de bioélectronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Electrodes detect tiny brain electrical signals (1 Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Bio Brainwave Radio ?',wiki_concept:'Bio Brainwave Radio est une technique utilisée en biomedical signals. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de biomedical signals. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Bio Brainwave Radio a des applications pratiques en biomedical signals. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Bio Brainwave Radio : Transmit brain states via modulated radio. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios. Brainwave Radio s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Brainwave Radio',
    wiki_math: 'Les mathématiques derrière Brainwave Radio : The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Bandwidth',
    gloss1_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Brainwave Radio démontre les principes clés de bioélectronique. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0645\u0648\u062c\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a\u064a\u0629', subtitle: 'EEG \u0625\u0644\u0649 \u0625\u0631\u0633\u0627\u0644 \u0631\u0627\u062f\u064a\u0648\u064a',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u062f\u0645\u0627\u063a \u2014 EEG \u0625\u0644\u0649 RF', mainDesc: '\u0628\u062b \u062d\u0627\u0644\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u0639\u0628\u0631 \u0631\u0627\u062f\u064a\u0648',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startEEG: '\u0628\u062f\u0621 EEG', stopEEG: '\u0625\u064a\u0642\u0627\u0641', relaxMode: '\u0627\u0633\u062a\u0631\u062e\u0627\u0621', focusMode: '\u062a\u0631\u0643\u064a\u0632', transmit: '\u0625\u0631\u0633\u0627\u0644',
    statAlpha: '\u0623\u0644\u0641\u0627', statTheta: '\u062b\u064a\u062a\u0627', statBeta: '\u0628\u064a\u062a\u0627', statFocus: '\u062a\u0631\u0643\u064a\u0632',
    step1Title: '\u0627\u0644\u062a\u0642\u0627\u0637 EEG', step1Desc: '\u0627\u0644\u0623\u0642\u0637\u0627\u0628 \u062a\u0643\u0634\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a\u0629 \u0627\u0644\u062f\u0645\u0627\u063a\u064a\u0629 (10-100 \u0645\u064a\u0643\u0631\u0648\u0641\u0648\u0644\u062a).',
    step2Title: '\u062a\u062d\u0644\u064a\u0644 FFT', step2Desc: 'FFT \u064a\u062d\u0644\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0625\u0644\u0649 \u0646\u0637\u0627\u0642\u0627\u062a: \u062f\u0644\u062a\u0627\u060c \u062b\u064a\u062a\u0627\u060c \u0623\u0644\u0641\u0627\u060c \u0628\u064a\u062a\u0627.',
    step3Title: '\u062a\u0639\u062f\u064a\u0644 RF', step3Desc: '\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u062a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 \u0631\u0627\u062f\u064a\u0648.',
    step4Title: '\u0627\u0644\u0625\u0631\u0633\u0627\u0644', step4Desc: '\u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0631\u0633\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0629. \u0622\u062e\u0631 \u064a\u0633\u062a\u0642\u0628\u0644 \u0648\u064a\u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631.',
    ch1Title: '\u0628\u0648\u0633\u062a \u0623\u0644\u0641\u0627', ch1Desc: '\u0623\u063a\u0644\u0642 \u0639\u064a\u0646\u064a\u0643 \u0648\u0627\u0633\u062a\u0631\u062e. \u0647\u0644 \u062a\u0631\u0641\u0639 \u0623\u0644\u0641\u0627 \u0641\u0648\u0642 15\u061f',
    ch2Title: '\u062a\u062d\u062f\u064a \u0627\u0644\u062a\u0631\u0643\u064a\u0632', ch2Desc: '\u0627\u0628\u0644\u063a 80% \u062a\u0631\u0643\u064a\u0632 \u0628\u0631\u0641\u0639 \u0628\u064a\u062a\u0627.',
    ch3Title: '\u062f\u0645\u0627\u063a-\u0625\u0644\u0649-\u062f\u0645\u0627\u063a', ch3Desc: '\u0623\u0631\u0633\u0644 \u062d\u0627\u0644\u062a\u0643 \u0644\u0634\u0631\u064a\u0643. \u0647\u0644 \u064a\u062e\u0645\u0646\u061f',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Brainwave Radio. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Electrodes detect tiny brain electrical signals (10-100 micr', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.', howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    wiki_eeg_title: '\ud83e\udde0 \u0646\u0637\u0627\u0642\u0627\u062a EEG', wiki_eeg: '\u062f\u0644\u062a\u0627 (0.5-4Hz)\u060c \u062b\u064a\u062a\u0627 (4-8Hz)\u060c \u0623\u0644\u0641\u0627 (8-13Hz)\u060c \u0628\u064a\u062a\u0627 (13-30Hz)\u060c \u063a\u0627\u0645\u0627 (30-100Hz).',
    wiki_bci_title: '\ud83d\udce1 \u0648\u0627\u062c\u0647\u0629 \u062f\u0645\u0627\u063a-\u062d\u0627\u0633\u0648\u0628', wiki_bci: '\u062a\u0642\u0631\u0623 \u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u0644\u0644\u062a\u062d\u0643\u0645 \u0628\u0627\u0644\u0623\u062c\u0647\u0632\u0629.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b', clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0627\u0644\u0644\u063a\u0629', theme: '\u0627\u0644\u0645\u0638\u0647\u0631', help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0635\u0648\u062a', whisperMode: '\u0647\u0645\u0633', breathingGuide: '\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637', musicMode: '\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a', working: '\u062c\u0627\u0631\u064d\u2026',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636', t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83e\udde0 \u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u062f\u0645\u0627\u063a \u062c\u0627\u0647\u0632!',
    logCleared: '\u062a\u0645 \u0627\u0644\u0645\u0633\u062d', copied: '\u062a\u0645!', copyFail: '\u0641\u0634\u0644',
    langChanged: '\ud83c\udf10 \u0639\u0631\u0628\u064a\u0629', themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    eegStarted: '\u0628\u062f\u0623 \u0627\u0644\u062a\u0642\u0627\u0637 EEG', eegStopped: '\u062a\u0648\u0642\u0641 EEG', modeRelax: '\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u2014 \u0628\u0648\u0633\u062a \u0623\u0644\u0641\u0627', modeFocus: '\u062a\u0631\u0643\u064a\u0632 \u2014 \u0628\u0648\u0633\u062a \u0628\u064a\u062a\u0627', needEEG: '\u0627\u0628\u062f\u0623 EEG \u0623\u0648\u0644\u0627\u064b',sectionCode:'كود الجهاز',faq_q1:'ما هو Bio Brainwave Radio؟',faq_a1:'Brainwave Radio هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. Transmit brain states via modulated radio. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الإشارات الطبية الحيوية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الإشارات الطبية الحيوية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام. تحاكي المحاكاة السلوك الحقيقي باستخدام معادلات رياضية تم التحقق منها. كل معامل تضبطه يتوافق مع متغير هندسي حقيقي. التصور يجعل العمليات غير المرئية مرئية.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الإشارات الطبية الحيوية.',demo_s1:'مرحباً في Bio Brainwave Radio! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الإشارات الطبية الحيوية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالإشارات الطبية الحيوية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Brainwave Radio! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالإلكترونيات الحيوية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Electrodes detect tiny brain electrical signals (1 لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الإشارات الطبية الحيوية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Bio Brainwave Radio؟',wiki_concept:'Bio Brainwave Radio هي تقنية تُستخدم في biomedical signals. في البيئات المهنية، تتطلب هذه التقنية Mixed وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من biomedical signals. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Bio Brainwave Radio له تطبيقات عملية في biomedical signals. يستخدم المحترفون تقنيات مماثلة مع Mixed. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Bio Brainwave Radio: Transmit brain states via modulated radio. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios. يبني Brainwave Radio على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Brainwave Radio',
    wiki_math: 'الرياضيات وراء Brainwave Radio: The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Bandwidth',
    gloss1_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Brainwave Radio يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK (same pattern as bio-body-antenna) ═══════ */
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.title = `${s.title} \u2014 Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }

const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const notes = THEME_MELODIES[n]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((f, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; const s = LANG[currentLang]; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${s.themeChanged} ${s['t_' + name] || name}`, 'info'); }

let logContainer; const logHistory = []; let typewriterEnabled = true;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`; if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, fullText); } else { d.textContent = fullText; logContainer.appendChild(d); } logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') { playSound('success'); pulseBismillah('success'); } else if (type === 'error') { playSound('error'); pulseBismillah('error'); } logHistory.push({ msg, type, ts: Date.now() }); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const text = Array.from(logContainer.children).map(d => d.textContent).join('\n'); const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `brainwave-radio-log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); URL.revokeObjectURL(url); log(LANG[currentLang].copied, 'success'); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { if (activeLogFilter === 'all') { line.style.display = ''; return; } line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none'; }); }

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function typewriterAppend(el, text) { el.classList.add('typing'); el.textContent = ''; for (let i = 0; i < text.length; i++) { el.textContent += text[i]; if (el.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight; await sleep(12 + Math.random() * 18); } el.classList.remove('typing'); }
function pulseBismillah(type) { const b = document.querySelector('.bismillah'); if (!b) return; b.classList.remove('pulse-success', 'pulse-error'); void b.offsetWidth; b.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success'); setTimeout(() => b.classList.remove('pulse-success', 'pulse-error'), 700); }
function calcHijriDate() { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch { return ''; } }

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri,serif'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }

const MORSE_MAP = {'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', ' ':'/'};
let morseTimeout = null, morseActive2 = false;
async function blinkMorse(text) { if (morseActive2) return; morseActive2 = true; const dot = document.querySelector('.status-dot'); if (!dot) { morseActive2 = false; return; } const orig = dot.style.background; const morse = text.toLowerCase().split('').map(c => MORSE_MAP[c] || '').join(' '); for (const ch of morse) { if (!morseActive2) break; if (ch === '.') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(100); } else if (ch === '-') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(300); } else if (ch === '/' || ch === ' ') { await sleep(200); continue; } dot.style.background = orig; dot.style.boxShadow = ''; await sleep(100); } dot.style.background = ''; dot.style.boxShadow = ''; morseActive2 = false; }
function initMorseLog() { document.addEventListener('mousedown', e => { const line = e.target.closest('.log-line'); if (!line) return; morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600); }); document.addEventListener('mouseup', () => { if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; } }); }

let musicAnalyser = null, musicActive = false, musicAnim2 = null;
function toggleMusicMode() { if (musicActive) { musicActive = false; if (musicAnim2) cancelAnimationFrame(musicAnim2); document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; }); log('\ud83c\udfb5 Music off', 'info'); return; } navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { if (!audioCtx) audioCtx = new AudioCtx(); const src = audioCtx.createMediaStreamSource(stream); musicAnalyser = audioCtx.createAnalyser(); musicAnalyser.fftSize = 256; src.connect(musicAnalyser); musicActive = true; log('\ud83c\udfb5 Music on!', 'success'); const data = new Uint8Array(musicAnalyser.frequencyBinCount); const bands = document.querySelectorAll('.deco-band'); function vis() { if (!musicActive) return; musicAnalyser.getByteFrequencyData(data); const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255; bands.forEach(b => { b.style.height = (2 + bass * 10) + 'px'; b.style.opacity = 0.4 + bass * 0.6; }); musicAnim2 = requestAnimationFrame(vis); } vis(); }).catch(() => log('\ud83c\udfb5 Mic denied', 'error')); }

let recognition = null, whisperActive = false;
function toggleWhisper() { if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('\ud83c\udfa4 Not supported', 'error'); return; } if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('\ud83c\udfa4 Whisper off', 'info'); return; } const SR = window.SpeechRecognition || window.webkitSpeechRecognition; recognition = new SR(); recognition.continuous = true; recognition.interimResults = false; recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US'; recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) { const t = e.results[i][0].transcript.trim(); if (t) log(`\ud83c\udfa4 ${t}`, 'rx'); } } }; recognition.onerror = e => log(`\ud83c\udfa4 ${e.error}`, 'error'); recognition.onend = () => { if (whisperActive) recognition.start(); }; recognition.start(); whisperActive = true; log('\ud83c\udfa4 Whisper on!', 'success'); }

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); if (breathingActive) log('\ud83e\udec1 Breathing on', 'info'); else { if (dhikrCount > 0) log(`\ud83d\udcff Dhikr: ${dhikrCount}`, 'success'); dhikrCount = 0; log('\ud83e\udec1 Breathing off', 'info'); } }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h || !p) return; let d = false, sx, sw; const rtl = () => document.documentElement.dir === 'rtl'; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; h.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = rtl() ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, window.innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { if (!d) return; d = false; h.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }); h.addEventListener('touchstart', e => { d = true; sx = e.touches[0].clientX; sw = p.offsetWidth; h.classList.add('active'); e.preventDefault(); }, { passive: false }); document.addEventListener('touchmove', e => { if (!d) return; const dx = rtl() ? (e.touches[0].clientX - sx) : (sx - e.touches[0].clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, window.innerWidth * 0.6)) + 'px'); }, { passive: true }); document.addEventListener('touchend', () => { if (!d) return; d = false; h.classList.remove('active'); }); try { const s = localStorage.getItem('wdiy-log-width'); if (s) document.documentElement.style.setProperty('--log-width', s); } catch {} }

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); if (s) { const f = s.querySelector(FOCUSABLE); if (f) f.focus(); } }
function closePanel(pid, oid, rid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); const b = $(rid); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); const b = $('logBtn'); if (b) b.focus(); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const n = tab.dataset.tab; const tgt = $('help' + n.charAt(0).toUpperCase() + n.slice(1)); if (tgt) tgt.classList.add('active'); }); }); }
function trapFocus(e) { for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) { const s = $(id); if (!s || !s.classList.contains('open')) continue; const f = s.querySelectorAll(FOCUSABLE); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } return; } }

const APP_MSG_KEY = 'wdiy-app-msg';
function sendAppMessage(type, data) { try { localStorage.setItem(APP_MSG_KEY, JSON.stringify({ type, data, from: document.title, ts: Date.now() })); localStorage.removeItem(APP_MSG_KEY); } catch {} }
function onAppMessage(cb) { window.addEventListener('storage', e => { if (e.key !== APP_MSG_KEY || !e.newValue) return; try { cb(JSON.parse(e.newValue)); } catch {} }); }

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; toggleMatrix(); log('\ud83d\udd79\ufe0f KONAMI!', 'success'); } } else konamiIdx = 0; }); }
function initLogoTracker() { const l = $('logoWrap'); if (!l) return; document.addEventListener('mousemove', e => { const r = l.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const dx = (e.clientX - cx) / (innerWidth / 2), dy = (e.clientY - cy) / (innerHeight / 2); l.style.transform = `perspective(200px) rotateX(${dy * 8}deg) rotateY(${-dx * 8}deg)`; }); }
function initDebug() { if (!new URLSearchParams(window.location.search).has('debug')) return; const p = $('debugPanel'); if (!p) return; p.classList.add('active'); const fe = $('debugFps'), me = $('debugMem'); let frames = 0, lt = performance.now(); function tick() { frames++; const n = performance.now(); if (n - lt >= 1000) { if (fe) fe.textContent = frames + ' FPS'; if (me && performance.memory) me.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB'; frames = 0; lt = n; } requestAnimationFrame(tick); } requestAnimationFrame(tick); }

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn'); if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog; initLogFilters();
  const hB = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay'); if (hB) hB.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp; initHelpTabs();
  const sB = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay'); if (sB) sB.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lB = $('logBtn'), lC = $('logCloseBtn'); if (lB) lB.onclick = toggleLog; if (lC) lC.onclick = closeLog; initLogResize();
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.addEventListener('change', () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  const wB = $('whisperBtn'); if (wB) wB.onclick = toggleWhisper;
  const bB = $('breathingBtn'), dD = $('dhikrDisplay'), dB = $('dhikrBtn'); if (bB) bB.onclick = () => { toggleBreathing(); if (dD) dD.style.display = breathingActive ? 'flex' : 'none'; }; if (dB) dB.onclick = incrementDhikr;
  const mB = $('musicBtn'); if (mB) mB.onclick = toggleMusicMode;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); if (e.key === 'Tab') trapFocus(e); });
  const ls = $('langSelect'); if (ls) ls.addEventListener('change', () => setLanguage(ls.value));
  const ts = $('themeSelect'); if (ts) ts.addEventListener('change', () => setTheme(ts.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  onAppMessage(msg => log(`\ud83d\udce8 ${msg.from}: ${msg.type}`, 'rx'));
  initKonami(); initMorseLog(); initDebug(); initLogoTracker();
  const hd = $('hijriDate'); if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }
  let lClicks = 0, lTimer = null; const le = $('logoWrap'); if (le) { le.style.cursor = 'pointer'; le.addEventListener('click', () => { lClicks++; if (lTimer) clearTimeout(lTimer); if (lClicks >= 3) { lClicks = 0; toggleMatrix(); } else lTimer = setTimeout(() => lClicks = 0, 500); }); }
  log(LANG[currentLang].ready, 'success');
  setTimeout(initBrainwaveApp, 50);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BRAINWAVE RADIO SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let eegRunning = false, brainMode = 'normal';
let alpha = 10, theta = 6, beta = 22, delta = 3, focusLevel = 50;
let eegData = { alpha: [], theta: [], beta: [], delta: [] };
let txCount = 0;

function initBrainwaveApp() {
  const canvas = $('brainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;
  const colors = { alpha: '#33ff33', theta: '#6699ff', beta: '#ff3366', delta: '#ffcc00' };
  const bandNames = ['delta', 'theta', 'alpha', 'beta'];
  const bandH = H / 4 - 12;

  function genWave(freq, amp, noise) {
    return Math.sin(t * freq * 0.1) * amp + Math.sin(t * freq * 0.23) * (amp * 0.3) + Math.sin(t * freq * 0.07) * (amp * 0.15) + (Math.random() - 0.5) * noise;
  }

  function drawBrainIcon(cx, cy, glow) {
    ctx.save();
    ctx.beginPath();
    // Simplified brain shape
    ctx.moveTo(cx - 15, cy);
    ctx.bezierCurveTo(cx - 15, cy - 20, cx - 5, cy - 25, cx, cy - 20);
    ctx.bezierCurveTo(cx + 5, cy - 25, cx + 15, cy - 20, cx + 15, cy);
    ctx.bezierCurveTo(cx + 15, cy + 10, cx + 5, cy + 15, cx, cy + 12);
    ctx.bezierCurveTo(cx - 5, cy + 15, cx - 15, cy + 10, cx - 15, cy);
    ctx.fillStyle = `rgba(150,100,255,${0.2 + glow * 0.5})`;
    ctx.shadowColor = '#9966ff';
    ctx.shadowBlur = glow * 20;
    ctx.fill();
    // Center line
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 12);
    ctx.strokeStyle = `rgba(255,255,255,${0.2 + glow * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawSpectralBars() {
    const bx = W - 140, by = 15, bw = 125, bh = 80;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 9px Orbitron';
    ctx.fillText('SPECTRAL POWER', bx + 5, by + 12);

    const vals = [delta, theta, alpha, beta];
    const maxVal = 40;
    const barW = 22;
    vals.forEach((v, i) => {
      const h = Math.min(bh - 25, (v / maxVal) * (bh - 25));
      ctx.fillStyle = colors[bandNames[i]];
      ctx.fillRect(bx + 8 + i * (barW + 5), by + bh - h - 5, barW, h);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '7px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(bandNames[i][0].toUpperCase(), bx + 8 + i * (barW + 5) + barW / 2, by + bh - 1);
      ctx.textAlign = 'left';
    });
  }

  function drawTransmissionRings() {
    if (!eegRunning) return;
    const cx = W * 0.12, cy = H * 0.5;
    for (let ring = 0; ring < 5; ring++) {
      const r = 15 + ring * 12 + (t * 30) % 80;
      const a = Math.max(0, (1 - ring / 5) * 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI * 0.3, Math.PI * 0.3);
      ctx.strokeStyle = `rgba(150,100,255,${a})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    drawBrainIcon(cx, cy, eegRunning ? Math.abs(Math.sin(t * 2)) : 0);
  }

  function drawFocusMeter() {
    const mx = W - 140, my = H - 50, mw = 125, mh = 35;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(mx, my, mw, mh);

    const gradient = ctx.createLinearGradient(mx, 0, mx + mw, 0);
    gradient.addColorStop(0, '#6699ff');
    gradient.addColorStop(0.5, '#33ff33');
    gradient.addColorStop(1, '#ff3366');
    ctx.fillStyle = gradient;
    ctx.fillRect(mx + 2, my + 2, (mw - 4) * focusLevel / 100, mh - 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(mx, my, mw, mh);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`Focus: ${focusLevel}%`, mx + mw / 2, my + 22);
    ctx.textAlign = 'left';
  }

  function drawModeIndicator() {
    const label = brainMode === 'relax' ? 'RELAX' : brainMode === 'focus' ? 'FOCUS' : 'NORMAL';
    const color = brainMode === 'relax' ? '#33ff33' : brainMode === 'focus' ? '#ff3366' : '#ffcc00';
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Orbitron';
    ctx.fillText(label, W * 0.4, 28);
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, W, H);
    t += 1;

    if (eegRunning) {
      const targetA = brainMode === 'relax' ? 16 : brainMode === 'focus' ? 6 : 10;
      const targetB = brainMode === 'focus' ? 36 : brainMode === 'relax' ? 14 : 22;
      const targetT = brainMode === 'relax' ? 9 : brainMode === 'focus' ? 4 : 6;
      alpha += (targetA - alpha) * 0.015 + (Math.random() - 0.5) * 0.4;
      beta += (targetB - beta) * 0.015 + (Math.random() - 0.5) * 0.4;
      theta += (targetT - theta) * 0.015 + (Math.random() - 0.5) * 0.3;
      delta = 2.5 + Math.sin(t * 0.01) * 1 + Math.random() * 0.5;
      focusLevel = Math.round(Math.min(100, Math.max(0, beta / (alpha + 0.1) * 28)));

      const vals = { alpha: genWave(alpha, 30, 5), theta: genWave(theta, 25, 4), beta: genWave(beta, 22, 8), delta: genWave(delta, 35, 3) };
      Object.keys(vals).forEach(k => { eegData[k].push(vals[k]); if (eegData[k].length > W) eegData[k].shift(); });

      // Update HTML stats
      const sa = $('statAlpha'), st2 = $('statTheta'), sb = $('statBeta'), sf = $('statFocus'), bd = $('bandDisplay');
      if (sa) sa.textContent = alpha.toFixed(1);
      if (st2) st2.textContent = theta.toFixed(1);
      if (sb) sb.textContent = beta.toFixed(1);
      if (sf) sf.textContent = focusLevel;
      if (bd) bd.textContent = `Alpha: ${alpha.toFixed(1)} Hz | Theta: ${theta.toFixed(1)} Hz | Beta: ${beta.toFixed(1)} Hz | Delta: ${delta.toFixed(1)} Hz`;

      const ff = $('focusFill'), fl = $('focusLabel');
      if (ff) ff.style.width = focusLevel + '%';
      if (fl) fl.textContent = `Focus: ${focusLevel}%`;
    }

    // Draw 4 EEG channels
    bandNames.forEach((band, i) => {
      const y0 = i * (bandH + 8) + 35;

      // Channel background
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, y0, W * 0.75, bandH);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeRect(0, y0, W * 0.75, bandH);

      // Band label
      ctx.fillStyle = colors[band];
      ctx.font = 'bold 10px Orbitron';
      ctx.fillText(band.toUpperCase(), 5, y0 + 14);

      // Frequency label
      const freqRanges = { delta: '0.5-4 Hz', theta: '4-8 Hz', alpha: '8-13 Hz', beta: '13-30 Hz' };
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '8px Orbitron';
      ctx.fillText(freqRanges[band], 5, y0 + bandH - 4);

      // Waveform
      const data = eegData[band];
      if (data.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = colors[band];
      ctx.lineWidth = 1.5;
      ctx.shadowColor = colors[band];
      ctx.shadowBlur = 4;
      data.forEach((v, j) => {
        const x = j * (W * 0.75 / data.length);
        const y = y0 + bandH / 2 - v;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    drawTransmissionRings();
    drawSpectralBars();
    drawFocusMeter();
    drawModeIndicator();

    // Ambient brain particles
    if (eegRunning) {
      for (let i = 0; i < 3; i++) {
        const px = Math.random() * W * 0.75;
        const py = Math.random() * H;
        ctx.fillStyle = `rgba(150,100,255,${Math.random() * 0.15})`;
        ctx.fillRect(px, py, 2, 2);
      }
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Wire up controls
  const startBtn = $('startBtn'), relaxBtn = $('relaxBtn'), focusBtn = $('focusBtn'), txBtn = $('txBtn');
  const s = LANG[currentLang];

  if (startBtn) startBtn.onclick = () => {
    eegRunning = !eegRunning;
    setStatus(eegRunning);
    const span = startBtn.querySelector('[data-i18n]');
    const s2 = LANG[currentLang];
    if (span) span.textContent = eegRunning ? (s2.stopEEG || 'Stop') : s2.startEEG;
    log(eegRunning ? s2.eegStarted : s2.eegStopped, 'info');
    if (eegRunning) playSound('brain');
  };

  if (relaxBtn) relaxBtn.onclick = () => {
    brainMode = 'relax';
    relaxBtn.classList.add('active');
    if (focusBtn) focusBtn.classList.remove('active');
    log(LANG[currentLang].modeRelax, 'info');
    playSound('click');
  };

  if (focusBtn) focusBtn.onclick = () => {
    brainMode = 'focus';
    focusBtn.classList.add('active');
    if (relaxBtn) relaxBtn.classList.remove('active');
    log(LANG[currentLang].modeFocus, 'info');
    playSound('click');
  };

  if (txBtn) txBtn.onclick = () => {
    if (!eegRunning) { log(LANG[currentLang].needEEG, 'error'); return; }
    txCount++;
    const state = focusLevel > 60 ? 'FOCUS' : focusLevel > 40 ? 'NORMAL' : 'RELAX';
    log(`TX #${txCount}: Brain state [${state}] A:${alpha.toFixed(1)} B:${beta.toFixed(1)} T:${theta.toFixed(1)} Focus:${focusLevel}%`, 'tx');
    showToast(`Transmitted: ${state} (${focusLevel}%)`, 1500);
    playSound('tx');
    sendAppMessage('brain-state', { state, focus: focusLevel, alpha: alpha.toFixed(1), beta: beta.toFixed(1) });
  };
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BRAINWAVE RADIO ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootBrainViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(150,100,255,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- EEG band definitions --- */
    var bands=[
      {name:'Delta',freq:2,min:0.5,max:4,color:'#ffcc00',amp:35},
      {name:'Theta',freq:6,min:4,max:8,color:'#6699ff',amp:25},
      {name:'Alpha',freq:10,min:8,max:13,color:'#33ff33',amp:30},
      {name:'Beta',freq:22,min:13,max:30,color:'#ff3366',amp:22},
      {name:'Gamma',freq:45,min:30,max:100,color:'#cc66ff',amp:12}
    ];
    var bandBuffers={};
    bands.forEach(function(b){bandBuffers[b.name]=new Float32Array(W);});

    /* --- brain topographic map electrodes (10-20 system) --- */
    var electrodes=[
      {name:'Fp1',x:0.38,y:0.18},{name:'Fp2',x:0.62,y:0.18},
      {name:'F3',x:0.30,y:0.32},{name:'F4',x:0.70,y:0.32},{name:'Fz',x:0.50,y:0.28},
      {name:'C3',x:0.25,y:0.48},{name:'C4',x:0.75,y:0.48},{name:'Cz',x:0.50,y:0.45},
      {name:'P3',x:0.30,y:0.62},{name:'P4',x:0.70,y:0.62},{name:'Pz',x:0.50,y:0.60},
      {name:'O1',x:0.38,y:0.76},{name:'O2',x:0.62,y:0.76},
      {name:'T3',x:0.15,y:0.48},{name:'T4',x:0.85,y:0.48}
    ];

    /* --- state --- */
    var brainState='normal';var stateTimer=0;
    var coherenceVal=0.45;
    var topoData=[];
    for(var ei=0;ei<electrodes.length;ei++)topoData.push(0);
    var spectrogramData=[];var MAX_SPEC=80;
    var focusHistory=[];var MAX_FOCUS=200;
    var asymmetry=0;

    /* auto-cycle brain states */
    function autoState(){
      stateTimer+=0.016;
      if(stateTimer>6){
        stateTimer=0;
        var states=['normal','relax','focus','meditate'];
        brainState=states[Math.floor(Math.random()*states.length)];
      }
    }

    /* generate EEG signal for a band */
    function genEEG(freq,amp,noise){
      return Math.sin(t*freq*0.1)*amp
        +Math.sin(t*freq*0.23)*(amp*0.3)
        +Math.sin(t*freq*0.07)*(amp*0.15)
        +(Math.random()-0.5)*noise;
    }

    /* --- draw brain topographic map --- */
    function drawTopoMap(ox,oy,size){
      /* head outline */
      ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(ox+size/2,oy+size/2,size/2-5,0,Math.PI*2);ctx.stroke();
      /* nose */
      ctx.beginPath();ctx.moveTo(ox+size/2-8,oy+4);ctx.lineTo(ox+size/2,oy-4);ctx.lineTo(ox+size/2+8,oy+4);ctx.stroke();
      /* ears */
      ctx.beginPath();ctx.ellipse(ox-2,oy+size/2,5,12,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(ox+size+2,oy+size/2,5,12,0,0,Math.PI*2);ctx.stroke();

      /* heatmap interpolation */
      var imgW=80,imgH=80;
      for(var py=0;py<imgH;py++){
        for(var px=0;px<imgW;px++){
          var nx=px/imgW,ny=py/imgH;
          var dx=nx-0.5,dy=ny-0.5;
          if(dx*dx+dy*dy>0.23)continue;
          var val=0,wt=0;
          for(var ei2=0;ei2<electrodes.length;ei2++){
            var ex=electrodes[ei2].x,ey=electrodes[ei2].y;
            var d=Math.sqrt((nx-ex)*(nx-ex)+(ny-ey)*(ny-ey));
            var w=1/(d*d+0.01);
            val+=topoData[ei2]*w;wt+=w;
          }
          val=val/wt;
          var norm=Math.max(0,Math.min(1,(val+1)/2));
          var r=Math.min(255,norm*510)|0;
          var g=Math.min(255,Math.max(0,(norm-0.3)*400))|0;
          var b2=Math.max(0,(1-norm*2)*200)|0;
          ctx.fillStyle='rgba('+r+','+g+','+b2+',0.7)';
          ctx.fillRect(ox+px*(size/imgW),oy+py*(size/imgH),size/imgW+0.5,size/imgH+0.5);
        }
      }

      /* electrode dots */
      electrodes.forEach(function(e,i){
        var ex2=ox+e.x*size,ey2=oy+e.y*size;
        ctx.beginPath();ctx.arc(ex2,ey2,3,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='6px Orbitron,monospace';
        ctx.fillText(e.name,ex2+5,ey2-2);
      });

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('EEG TOPOGRAPHIC MAP',ox+5,oy-8);
    }

    /* --- draw power spectrum bars --- */
    function drawPowerSpectrum(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(ox,oy,w,h);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BAND POWER SPECTRUM',ox+5,oy+12);

      var barW=(w-20)/bands.length-4;
      bands.forEach(function(b,i){
        var bx=ox+12+i*(barW+4);
        var last=bandBuffers[b.name][W-1];
        var norm=Math.abs(last)/b.amp;
        var barH=Math.min(h-30,norm*(h-30));

        var grad=ctx.createLinearGradient(bx,oy+h-5,bx,oy+h-5-barH);
        grad.addColorStop(0,b.color);grad.addColorStop(1,b.color+'33');
        ctx.fillStyle=grad;ctx.fillRect(bx,oy+h-5-barH,barW,barH);

        ctx.fillStyle=b.color;ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(b.name[0]+b.name[1],bx+barW/2,oy+h-8-barH);
        ctx.fillStyle='rgba(255,255,255,0.3)';
        ctx.fillText(b.min+'-'+b.max,bx+barW/2,oy+h+8);
        ctx.textAlign='left';
      });
    }

    /* --- draw coherence & asymmetry panel --- */
    function drawCoherencePanel(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('HEMISPHERIC ANALYSIS',ox+5,oy+14);

      /* coherence bar */
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(ox+10,oy+24,w-20,14);
      ctx.fillStyle=coherenceVal>0.7?'#33ff33':coherenceVal>0.4?'#ffcc00':'#ff3366';
      ctx.fillRect(ox+10,oy+24,(w-20)*coherenceVal,14);
      ctx.fillStyle='#fff';ctx.font='8px Orbitron,monospace';
      ctx.fillText('Coherence: '+(coherenceVal*100).toFixed(0)+'%',ox+10,oy+52);

      /* asymmetry indicator */
      var acx=ox+w/2,acy=oy+72;
      ctx.beginPath();ctx.moveTo(ox+10,acy);ctx.lineTo(ox+w-10,acy);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(acx+asymmetry*((w-20)/2),acy,5,0,Math.PI*2);
      ctx.fillStyle=asymmetry>0?'#ff3366':'#6699ff';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('L',ox+12,acy+4);ctx.fillText('R',ox+w-18,acy+4);
      ctx.textAlign='center';ctx.fillText('ASYMMETRY',acx,acy+16);ctx.textAlign='left';

      /* brain state */
      var stateColors={normal:'#ffcc00',relax:'#33ff33',focus:'#ff3366',meditate:'#cc66ff'};
      ctx.fillStyle=stateColors[brainState]||'#fff';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('STATE: '+brainState.toUpperCase(),ox+10,oy+h-10);
    }

    /* --- draw focus/attention timeline --- */
    function drawFocusTimeline(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('FOCUS / ATTENTION TIMELINE',ox+5,oy+12);

      if(focusHistory.length>1){
        ctx.beginPath();ctx.strokeStyle='#ff3366';ctx.lineWidth=1.5;
        focusHistory.forEach(function(v,i){
          var fx=ox+(i/MAX_FOCUS)*w;
          var fy=oy+h-v/100*(h-20)-5;
          if(i===0)ctx.moveTo(fx,fy);else ctx.lineTo(fx,fy);
        });
        ctx.stroke();

        /* fill */
        ctx.beginPath();ctx.moveTo(ox,oy+h);
        focusHistory.forEach(function(v,i){
          ctx.lineTo(ox+(i/MAX_FOCUS)*w,oy+h-v/100*(h-20)-5);
        });
        ctx.lineTo(ox+(focusHistory.length/MAX_FOCUS)*w,oy+h);ctx.closePath();
        ctx.fillStyle='rgba(255,51,102,0.08)';ctx.fill();
      }
    }

    /* --- draw EEG spectrogram --- */
    function drawSpectrogram(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('EEG SPECTROGRAM (0-50Hz)',ox+5,oy+12);

      var cellW=w/64,cellH=h/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col=0;col<64;col++){
          var v=spectrogramData[row][col];
          var r2=Math.min(255,v*600)|0;
          var g2=Math.min(255,Math.max(0,(v-0.15)*500))|0;
          var b3=Math.max(0,(0.5-v)*200)|0;
          ctx.fillStyle='rgb('+r2+','+g2+','+b3+')';
          ctx.fillRect(ox+col*cellW,oy+16+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
    }

    /* --- main render loop --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      autoState();

      /* generate EEG data per band */
      var targetAlpha=brainState==='relax'?1.3:brainState==='meditate'?1.5:brainState==='focus'?0.5:1.0;
      var targetBeta=brainState==='focus'?1.5:brainState==='relax'?0.6:1.0;
      var targetTheta=brainState==='meditate'?1.4:brainState==='relax'?1.2:0.8;

      bands.forEach(function(b){
        var buf=bandBuffers[b.name];
        var scale=b.name==='Alpha'?targetAlpha:b.name==='Beta'?targetBeta:b.name==='Theta'?targetTheta:1.0;
        for(var i=0;i<W-1;i++)buf[i]=buf[i+1];
        buf[W-1]=genEEG(b.freq,b.amp*scale,b.amp*0.15);
      });

      /* update topographic data */
      electrodes.forEach(function(e,i){
        var alphaVal=bandBuffers['Alpha'][W-1]/bands[2].amp;
        var betaVal=bandBuffers['Beta'][W-1]/bands[3].amp;
        var zone=e.y<0.35?'frontal':e.y<0.55?'central':'posterior';
        var val=0;
        if(zone==='frontal')val=betaVal*0.6+alphaVal*0.3;
        else if(zone==='central')val=alphaVal*0.5+betaVal*0.3;
        else val=alphaVal*0.7+betaVal*0.2;
        val+=(Math.random()-0.5)*0.2;
        topoData[i]+=(val-topoData[i])*0.1;
      });

      /* coherence and asymmetry */
      var leftPow=0,rightPow=0,lc2=0,rc2=0;
      electrodes.forEach(function(e,i){
        if(e.x<0.5){leftPow+=Math.abs(topoData[i]);lc2++;}
        else{rightPow+=Math.abs(topoData[i]);rc2++;}
      });
      leftPow/=lc2;rightPow/=rc2;
      coherenceVal+=(1-Math.abs(leftPow-rightPow)*2-coherenceVal)*0.05;
      coherenceVal=Math.max(0,Math.min(1,coherenceVal));
      asymmetry+=(((rightPow-leftPow)/(rightPow+leftPow+0.01))-asymmetry)*0.05;

      /* focus level */
      var betaNow=Math.abs(bandBuffers['Beta'][W-1]);
      var alphaNow=Math.abs(bandBuffers['Alpha'][W-1]);
      var focus2=Math.min(100,Math.max(0,betaNow/(alphaNow+0.1)*28));
      focusHistory.push(focus2);if(focusHistory.length>MAX_FOCUS)focusHistory.shift();

      /* build spectrogram row */
      var specRow=[];
      for(var sb=0;sb<64;sb++){
        var freq2=sb*50/64;var amp2=0.02;
        bands.forEach(function(b){
          amp2+=Math.exp(-(freq2-b.freq)*(freq2-b.freq)/(b.freq*2))*Math.abs(bandBuffers[b.name][W-1])/b.amp*0.4;
        });
        amp2+=Math.random()*0.02;
        specRow.push(Math.min(1,amp2));
      }
      spectrogramData.push(specRow);if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      /* ---- LAYOUT ---- */

      /* Section 1: Top — 5 EEG waveforms stacked */
      var waveH=H*0.30;var bandH2=waveH/bands.length;
      bands.forEach(function(b,bi){
        var y0=bi*bandH2;
        ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,y0,W*0.55,bandH2-1);
        /* waveform */
        var buf2=bandBuffers[b.name];
        ctx.beginPath();ctx.strokeStyle=b.color;ctx.lineWidth=1.2;
        ctx.shadowColor=b.color;ctx.shadowBlur=3;
        for(var i2=0;i2<W*0.55;i2++){
          var idx=Math.floor(i2/(W*0.55)*W);
          var y=y0+bandH2/2-buf2[idx]/b.amp*(bandH2*0.4);
          if(i2===0)ctx.moveTo(i2,y);else ctx.lineTo(i2,y);
        }
        ctx.stroke();ctx.shadowBlur=0;
        ctx.fillStyle=b.color;ctx.font='7px Orbitron,monospace';
        ctx.fillText(b.name+' ('+b.min+'-'+b.max+'Hz)',3,y0+10);
      });

      /* Section 2: Top-right — Topographic map */
      drawTopoMap(W*0.56,0,W*0.22);

      /* Section 3: Power spectrum */
      drawPowerSpectrum(W*0.56,W*0.22+10,W*0.44-10,(H*0.30)-W*0.22-10);

      /* Section 4: Middle — Spectrogram */
      drawSpectrogram(0,waveH+5,W*0.55,H*0.22);

      /* Section 5: Middle-right — Coherence panel */
      drawCoherencePanel(W*0.56,waveH+5,W*0.44-10,H*0.22);

      /* Section 6: Bottom — Focus timeline */
      drawFocusTimeline(0,waveH+H*0.22+15,W-10,H*0.18);

      /* Section 7: Bottom stats */
      var stY=waveH+H*0.22+H*0.18+25;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(0,stY,W,H-stY);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('NEURAL METRICS',10,stY+14);
      var metrics=[
        ['Alpha Power',(Math.abs(bandBuffers['Alpha'][W-1])).toFixed(1)+' \u00b5V'],
        ['Beta Power',(Math.abs(bandBuffers['Beta'][W-1])).toFixed(1)+' \u00b5V'],
        ['Focus',focus2.toFixed(0)+'%'],
        ['Coherence',(coherenceVal*100).toFixed(0)+'%'],
        ['Asymmetry',(asymmetry>0?'R':'L')+' '+(Math.abs(asymmetry)*100).toFixed(0)+'%'],
        ['State',brainState.toUpperCase()],
        ['Theta/Beta',((Math.abs(bandBuffers['Theta'][W-1]))/(Math.abs(bandBuffers['Beta'][W-1])+0.1)).toFixed(2)]
      ];
      metrics.forEach(function(m,mi){
        var mx2=10+(mi%4)*W*0.24;
        var my2=stY+28+Math.floor(mi/4)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(m[0]+':',mx2,my2);
        ctx.fillStyle='#cc66ff';ctx.fillText(m[1],mx2+90,my2);
      });

      /* HUD corners */
      ctx.strokeStyle='rgba(150,100,255,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(150,100,255,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(150,100,255,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('EEG',W-55,17);

      requestAnimationFrame(frame);
    }

    /* click to cycle brain state */
    cvs.addEventListener('click',function(){
      var states=['normal','relax','focus','meditate'];
      var idx=states.indexOf(brainState);
      brainState=states[(idx+1)%states.length];
      stateTimer=0;
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootBrainViz);
  else setTimeout(bootBrainViz,200);
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
