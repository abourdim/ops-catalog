/**
 * Workshop DIY — Bio Body Antenna v1.0
 * Human body as 1.8 MHz antenna — impedance measurement
 * Self-contained: i18n · framework · simulation
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;

const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND EFFECTS ═══════ */

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
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
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
    title: 'Bio Body Antenna',
    subtitle: 'Your body is a 1.8 MHz antenna',
    disconnected: 'Disconnected',
    connected: 'Connected',
    mainSection: 'Body Antenna — Impedance Measurement',
    mainDesc: 'Human body as 1.8 MHz receiving antenna with impedance analysis',
    sectionA: 'A — How It Works',
    sectionB: 'B — Live Spectrum',
    sectionC: 'C — Challenges',
    startScan: 'Start Scan',
    stopScan: 'Stop',
    touchBody: 'Touch Body',
    groundBtn: 'Ground',
    sweepBtn: 'Freq Sweep',
    statSWR: 'SWR',
    statGain: 'dBi',
    statZ: '\u2126 impedance',
    step1Title: 'Body as Antenna',
    step1Desc: 'The human body acts as a ~1.7m antenna, resonant near 1.8 MHz. micro:bit ADC measures the RF signal picked up.',
    step2Title: 'Impedance Probe',
    step2Desc: 'A simple bridge circuit measures body impedance — the complex resistance to RF signals at different frequencies.',
    step3Title: 'SWR Calculation',
    step3Desc: 'Standing Wave Ratio shows how well the body antenna is matched. SWR = 1.0 is perfect, higher means mismatch.',
    step4Title: 'Signal Detection',
    step4Desc: 'Touch detection changes the antenna pattern. Grounding improves reception. Nearby AM stations become audible!',
    ch1Title: 'Find the Resonance',
    ch1Desc: 'Use frequency sweep to find the exact frequency where your body has lowest SWR. Every person is different!',
    ch2Title: 'Ground Effect',
    ch2Desc: 'Touch a grounded metal surface while scanning. What happens to the impedance reading?',
    ch3Title: 'AM Radio Pickup',
    ch3Desc: 'Sweep 500 kHz to 1700 kHz. Can you detect any AM radio stations using your body as antenna?',
    howto_1:'The main display shows the Body Antenna simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The human body acts as a ~1.7m antenna, resonant near 1.8 MH',
    howto_2:'Press the "Start Scan" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "A — How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_ant_title: '\ud83d\udce1 Body Antenna Theory',
    wiki_ant: 'A 1.7m human body resonates at ~1.8 MHz (quarter-wave). Grounding one end creates a monopole antenna with ~36 ohm impedance at resonance.',
    wiki_imp_title: '\u26a1 Impedance',
    wiki_imp: 'Z = R + jX. Real part R is resistance, imaginary part jX is reactance. Measured in ohms. SWR indicates matching quality.',
    wiki_swr_title: '\ud83d\udcca Standing Wave Ratio',
    wiki_swr: 'SWR = (1+|Gamma|)/(1-|Gamma|) where Gamma is the reflection coefficient. Lower SWR means better antenna matching and more efficient signal reception.',
    activityLog: 'Activity Log',
    eventsMsg: 'Events & messages',
    clear: 'Clear',
    copy: 'Copy',
    export: 'Export',
    filterAll: 'All',
    settings: '\u2699\ufe0f Settings',
    language: 'Language',
    theme: 'Theme',
    help: '\u2753 Help',
    faq: 'FAQ',
    howto: 'How-To',
    wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects',
    whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide',
    dhikrTap: 'Tap',
    musicMode: 'Music reactive',
    splashHint: 'tap to skip',
    working: 'Working\u2026',
    chatPlaceholder: 'Talk to the robot...',
    newVersion: 'UPDATE',
    t_mosque: 'Mosque',
    t_zellige: 'Zellige',
    t_andalus: 'Andalus',
    t_riad: 'Riad',
    t_medina: 'Medina',
    t_space: 'Space',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\ud83d\udce1 Bio Body Antenna ready — touch to scan!',
    logCleared: 'Log cleared',
    copied: 'Copied!',
    copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English',
    themeChanged: '\ud83c\udfa8 Theme \u2192',
    scanning: 'Scanning impedance...',
    touched: 'Body contact detected!',
    grounded: 'Grounded \u2014 impedance dropped!',
    sweepDone: 'Frequency sweep complete',
    resonanceFound: 'Resonance found at',sectionCode:'Device Code',faq_q1:'What is Bio Body Antenna?',faq_a1:'Body Antenna is an interactive simulation that demonstrates bioelectronics concepts. Human body as 1.8 MHz receiving antenna with impedance analysis. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start Scan to begin impedance measurement. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u062c\u0633\u0645 1.7\u0645 \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f ~1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 (\u0631\u0628\u0639 \u0645\u0648\u062c\u0629). \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u0646\u0634\u0626 \u0647\u0648\u0627\u0626\u064a \u0623\u062d\u0627\u062f\u064a \u0627\u0644\u0642\u0637\u0628 ~36 \u0623\u0648\u0645.',faq_q5:'What should I experiment with?',faq_a5:'Use frequency sweep to find the exact frequency where your body has lowest SWR. Every person is different!. The simulation models real-world behavior using validated mathematical equations. Every parameter you adjust corresponds to a real engineering variable. The visualization makes invisible processes visible, helping you develop intuition that transfers to real equipment.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Brainwave Radio and Bio Breath Modulator. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Body Antenna! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start Scan to begin impedance measurement. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A — How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Body Antenna! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The human body acts as a ~1.7m antenna, resonant n Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Bio Body Antenna: Human body as 1.8 MHz receiving antenna with impedance analysis. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Body as Antenna through Impedance Probe to SWR Calculation and Signal Detection.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A — How It Works" and "B — Live Spectrum" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Quantum Tunneling Radio',related1_desc:'Simulate RF wave tunneling through quantum potential barriers',related1_path:'../../47-impossible-physics/phys-tunneling-radio/index.html',related2_name:'Dead Drop — BLE Message Transfer',related2_desc:'Encrypt and exchange secret messages via BLE simulation',related2_path:'../../46-swarm-intelligence/swarm-flock-formation/index.html',related3_name:'Dead Drop — BLE Message Transfer',related3_desc:'Encrypt and exchange secret messages via BLE simulation',related3_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'',pathPrev_path:'',pathNext_name:'Brainwave Radio \\u2014 EEG to RF',pathNext_path:'../../43-bio-radio/bio-brainwave-radio/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is the purpose of an antenna?',quiz_q1a:'Store energy',quiz_q1b:'Convert signals between electrical and electromagnetic',quiz_q1c:'Amplify power',quiz_q1d:'Filter noise',quiz_q1_answer:'1',quiz_q2:'If frequency doubles, what happens to wavelength?',quiz_q2a:'Doubles',quiz_q2b:'Halves',quiz_q2c:'Stays same',quiz_q2d:'Triples',quiz_q2_answer:'1',quiz_q3:'What does AM stand for in radio?',quiz_q3a:'Audio Modulation',quiz_q3b:'Amplitude Modulation',quiz_q3c:'Analog Modulation',quiz_q3d:'Active Modulation',quiz_q3_answer:'1',quiz_q4:'What does antenna gain measure?',quiz_q4a:'Size',quiz_q4b:'Directional efficiency',quiz_q4c:'Color',quiz_q4d:'Weight',quiz_q4_answer:'1',quiz_q5:'What is machine learning?',quiz_q5a:'Programming robots',quiz_q5b:'Systems that learn from data',quiz_q5c:'Manual computation',quiz_q5d:'Hardware design',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'CERN\'s LHC generates 1 petabyte/second during collisions. The Worldwide LHC Computing Grid spans 170 centers in 42 countries. In 2012, it confirmed the Higgs boson, completing the Standard Model of physics.',realworld2:'LIGO detected gravitational waves in 2015, confirming Einstein\'s 100-year-old prediction. The sensors measured spacetime distortions of 10⁻²¹ meters — one ten-thousandth the width of a proton.',realworld3:'Voyager 1, launched in 1977, communicates from 24 billion km away using a 23-watt transmitter — the power of a fridge light bulb. Signals take 22+ hours each way. The Deep Space Network uses 70m dishes to receive them.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In bio-radio, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in bio-radio and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Bio Body Antenna demonstrates a fundamental concept in bio-radio. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Bio Body Antenna have direct real-world applications. Professionals in bio-radio use these same concepts daily. In industry, micro:bit and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with bio-radio carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.'},
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Body Antenna builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Body Antenna',
    wiki_math: 'The mathematics behind Body Antenna: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Gain (dBi)',
    gloss2_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Body Antenna demonstrates key principles from bioelectronics. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Bio Antenne Corporelle',
    subtitle: 'Votre corps est une antenne 1.8 MHz',
    disconnected: 'D\u00e9connect\u00e9',
    connected: 'Connect\u00e9',
    mainSection: 'Antenne Corporelle \u2014 Mesure d\'imp\u00e9dance',
    mainDesc: 'Corps humain comme antenne 1.8 MHz avec analyse d\'imp\u00e9dance',
    sectionA: 'A \u2014 Comment \u00e7a marche',
    sectionB: 'B \u2014 Spectre en direct',
    sectionC: 'C \u2014 D\u00e9fis',
    startScan: 'D\u00e9marrer Scan',
    stopScan: 'Arr\u00eat',
    touchBody: 'Toucher Corps',
    groundBtn: 'Masse',
    sweepBtn: 'Balayage Fr\u00e9q',
    statSWR: 'TOS',
    statGain: 'dBi',
    statZ: '\u2126 imp\u00e9dance',
    step1Title: 'Corps Antenne',
    step1Desc: 'Le corps humain (~1.7m) agit comme une antenne, r\u00e9sonnant pr\u00e8s de 1.8 MHz. L\'ADC du micro:bit mesure le signal RF.',
    step2Title: 'Sonde Imp\u00e9dance',
    step2Desc: 'Un circuit pont mesure l\'imp\u00e9dance corporelle \u2014 la r\u00e9sistance complexe aux signaux RF.',
    step3Title: 'Calcul TOS',
    step3Desc: 'Le TOS montre la qualit\u00e9 d\'adaptation. TOS = 1.0 est parfait.',
    step4Title: 'D\u00e9tection Signal',
    step4Desc: 'Le toucher modifie le diagramme. La mise \u00e0 la masse am\u00e9liore la r\u00e9ception.',
    ch1Title: 'Trouver la R\u00e9sonance',
    ch1Desc: 'Balayez les fr\u00e9quences pour trouver votre r\u00e9sonance corporelle.',
    ch2Title: 'Effet de Masse',
    ch2Desc: 'Touchez un m\u00e9tal reli\u00e9 \u00e0 la terre pendant le scan.',
    ch3Title: 'R\u00e9ception AM',
    ch3Desc: 'Balayez 500 kHz \u00e0 1700 kHz. D\u00e9tectez des stations AM!',
    howto_1:'L écran principal affiche la simulation Body Antenna. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The human body acts as a ~1.7m antenna, resonant near 1.8 MH',
    howto_2:'Appuie sur "Start Scan". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_ant_title: '\ud83d\udce1 Th\u00e9orie Antenne',
    wiki_ant: 'Un corps de 1.7m r\u00e9sonne \u00e0 ~1.8 MHz (quart d\'onde). La mise \u00e0 la terre cr\u00e9e un monop\u00f4le de ~36 ohms.',
    wiki_imp_title: '\u26a1 Imp\u00e9dance',
    wiki_imp: 'Z = R + jX en ohms. Le TOS indique la qualit\u00e9 d\'adaptation.',
    wiki_swr_title: '\ud83d\udcca Taux d\'Ondes Stationnaires',
    wiki_swr: 'TOS = (1+|Gamma|)/(1-|Gamma|). Plus le TOS est bas, meilleure est l\'adaptation de l\'antenne.',
    activityLog: 'Journal',
    eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer',
    copy: 'Copier',
    export: 'Exporter',
    filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres',
    language: 'Langue',
    theme: 'Th\u00e8me',
    help: '\u2753 Aide',
    faq: 'FAQ',
    howto: 'Guide',
    wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores',
    whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire',
    dhikrTap: 'Tap',
    musicMode: 'R\u00e9actif musique',
    splashHint: 'appuyer pour passer',
    working: 'En cours\u2026',
    chatPlaceholder: 'Parle au robot...',
    newVersion: 'MAJ',
    t_mosque: 'Mosqu\u00e9e',
    t_zellige: 'Zellige',
    t_andalus: 'Andalous',
    t_riad: 'Riad',
    t_medina: 'M\u00e9dina',
    t_space: 'Espace',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\ud83d\udce1 Antenne corporelle pr\u00eate \u2014 touchez pour scanner!',
    logCleared: 'Journal effac\u00e9',
    copied: 'Copi\u00e9!',
    copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais',
    themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    scanning: 'Scan imp\u00e9dance...',
    touched: 'Contact corporel d\u00e9tect\u00e9!',
    grounded: 'Mass\u00e9 \u2014 imp\u00e9dance r\u00e9duite!',
    sweepDone: 'Balayage termin\u00e9',
    resonanceFound: 'R\u00e9sonance trouv\u00e9e \u00e0',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Body Antenna ?',faq_a1:'Body Antenna est une simulation interactive qui démontre les concepts de bioélectronique. Human body as 1.8 MHz receiving antenna with impedance analysis. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système. La simulation modélise le comportement réel à l aide d équations mathématiques validées. Chaque paramètre correspond à une variable d ingénierie réelle. La visualisation rend visibles les processus invisibles.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Body Antenna ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Body Antenna ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de bioélectronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how The human body acts as a ~1.7m antenna, resonant n Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Bio Body Antenna : Human body as 1.8 MHz receiving antenna with impedance analysis. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Radio Tunnel Quantique',related1_desc:'Simuler le passage d\\',related1_path:'../../47-impossible-physics/phys-tunneling-radio/index.html',related2_name:'Dead Drop — Transfert BLE',related2_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related2_path:'../../46-swarm-intelligence/swarm-flock-formation/index.html',related3_name:'Dead Drop — Transfert BLE',related3_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related3_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'',pathPrev_path:'',pathNext_name:'Radio C\\u00e9r\\u00e9brale \\u2014 EEG vers RF',pathNext_path:'../../43-bio-radio/bio-brainwave-radio/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quel est le rôle d\'une antenne ?',quiz_q1a:'Stocker l\'énergie',quiz_q1b:'Convertir les signaux',quiz_q1c:'Amplifier la puissance',quiz_q1d:'Filtrer le bruit',quiz_q1_answer:'1',quiz_q2:'Si la fréquence double, que devient la longueur d\'onde ?',quiz_q2a:'Double',quiz_q2b:'Divisée par 2',quiz_q2c:'Inchangée',quiz_q2d:'Triplée',quiz_q2_answer:'1',quiz_q3:'Que signifie AM en radio ?',quiz_q3a:'Modulation Audio',quiz_q3b:'Modulation d\'Amplitude',quiz_q3c:'Modulation Analogique',quiz_q3d:'Modulation Active',quiz_q3_answer:'1',quiz_q4:'Que mesure le gain d\'antenne ?',quiz_q4a:'Taille',quiz_q4b:'Efficacité directionnelle',quiz_q4c:'Couleur',quiz_q4d:'Poids',quiz_q4_answer:'1',quiz_q5:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q5a:'Programmer des robots',quiz_q5b:'Systèmes apprenant des données',quiz_q5c:'Calcul manuel',quiz_q5d:'Conception matérielle',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'Le LHC du CERN génère 1 pétaoctet par seconde lors des collisions. En 2012, il a confirmé le boson de Higgs, complétant le Modèle standard de la physique.',realworld2:'LIGO a détecté des ondes gravitationnelles en 2015, confirmant la prédiction centenaire d\'Einstein. Les capteurs ont mesuré des distorsions de l\'espace-temps de 10⁻²¹ mètres.',realworld3:'Voyager 1, lancé en 1977, communique depuis 24 milliards de km avec un émetteur de 23 watts. Les signaux prennent plus de 22 heures dans chaque sens.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En bio-radio, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en bio-radio et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Bio Body Antenna illustre un concept fondamental en bio-radio. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Bio Body Antenna ont des applications directes dans le monde réel. Les professionnels de bio-radio utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, micro:bit et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en bio-radio implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Body Antenna s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Body Antenna',
    wiki_math: 'Les mathématiques derrière Body Antenna : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Gain (dBi)',
    gloss2_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Body Antenna démontre les principes clés de bioélectronique. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645',
    subtitle: '\u062c\u0633\u0645\u0643 \u0647\u0648\u0627\u0626\u064a 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',
    connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u2014 \u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    mainDesc: '\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a \u0643\u0647\u0648\u0627\u0626\u064a \u0627\u0633\u062a\u0642\u0628\u0627\u0644 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 \u0645\u0639 \u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',
    sectionB: '\u0628 \u2014 \u0627\u0644\u0637\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631',
    sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startScan: '\u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d',
    stopScan: '\u0625\u064a\u0642\u0627\u0641',
    touchBody: '\u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645',
    groundBtn: '\u062a\u0623\u0631\u064a\u0636',
    sweepBtn: '\u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    statSWR: 'TOS',
    statGain: 'dBi',
    statZ: '\u2126 \u0645\u0639\u0627\u0648\u0642\u0629',
    step1Title: '\u0627\u0644\u062c\u0633\u0645 \u0643\u0647\u0648\u0627\u0626\u064a',
    step1Desc: '\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a (~1.7\u0645) \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632. ADC \u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0642\u064a\u0633 \u0627\u0644\u0625\u0634\u0627\u0631\u0629.',
    step2Title: '\u0645\u0633\u0628\u0627\u0631 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    step2Desc: '\u062f\u0627\u0626\u0631\u0629 \u062c\u0633\u0631 \u0628\u0633\u064a\u0637\u0629 \u062a\u0642\u064a\u0633 \u0645\u0639\u0627\u0648\u0642\u0629 \u0627\u0644\u062c\u0633\u0645.',
    step3Title: '\u062d\u0633\u0627\u0628 TOS',
    step3Desc: 'TOS \u064a\u0648\u0636\u062d \u062c\u0648\u062f\u0629 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. TOS=1.0 \u0645\u062b\u0627\u0644\u064a.',
    step4Title: '\u0643\u0634\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0629',
    step4Desc: '\u0627\u0644\u0644\u0645\u0633 \u064a\u063a\u064a\u0631 \u0646\u0645\u0637 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u062d\u0633\u0646 \u0627\u0644\u0627\u0633\u062a\u0642\u0628\u0627\u0644.',
    ch1Title: '\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0631\u0646\u064a\u0646',
    ch1Desc: '\u0627\u0633\u062a\u062e\u062f\u0645 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f \u0644\u0625\u064a\u062c\u0627\u062f \u062a\u0631\u062f\u062f \u0631\u0646\u064a\u0646 \u062c\u0633\u0645\u0643.',
    ch2Title: '\u062a\u0623\u062b\u064a\u0631 \u0627\u0644\u062a\u0623\u0631\u064a\u0636',
    ch2Desc: '\u0627\u0644\u0645\u0633 \u0645\u0639\u062f\u0646\u064b\u0627 \u0645\u0624\u0631\u0636\u064b\u0627 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0645\u0633\u062d.',
    ch3Title: '\u0627\u0644\u062a\u0642\u0627\u0637 AM',
    ch3Desc: '\u0627\u0645\u0633\u062d 500 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632 \u0625\u0644\u0649 1700 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632.',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Body Antenna. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The human body acts as a ~1.7m antenna, resonant near 1.8 MH',
    howto_2:'اضغط على "Start Scan". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_ant_title: '\ud83d\udce1 \u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0647\u0648\u0627\u0626\u064a',
    wiki_ant: '\u062c\u0633\u0645 1.7\u0645 \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f ~1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 (\u0631\u0628\u0639 \u0645\u0648\u062c\u0629). \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u0646\u0634\u0626 \u0647\u0648\u0627\u0626\u064a \u0623\u062d\u0627\u062f\u064a \u0627\u0644\u0642\u0637\u0628 ~36 \u0623\u0648\u0645.',
    wiki_imp_title: '\u26a1 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    wiki_imp: 'Z = R + jX \u0628\u0627\u0644\u0623\u0648\u0645. TOS \u064a\u0634\u064a\u0631 \u0625\u0644\u0649 \u062c\u0648\u062f\u0629 \u0627\u0644\u062a\u0637\u0627\u0628\u0642.',
    wiki_swr_title: '\ud83d\udcca \u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u0648\u062c\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629',
    wiki_swr: 'TOS = (1+|\u0393|)/(1-|\u0393|). \u0643\u0644\u0645\u0627 \u0627\u0646\u062e\u0641\u0636 TOS \u0643\u0627\u0646 \u0627\u0644\u062a\u0637\u0627\u0628\u0642 \u0623\u0641\u0636\u0644.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',
    eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear: '\u0645\u0633\u062d',
    copy: '\u0646\u0633\u062e',
    export: '\u062a\u0635\u062f\u064a\u0631',
    filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',
    language: '\u0627\u0644\u0644\u063a\u0629',
    theme: '\u0627\u0644\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',
    faq: '\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629',
    howto: '\u062f\u0644\u064a\u0644',
    wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',
    whisperMode: '\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633',
    breathingGuide: '\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',
    dhikrTap: '\u0627\u0636\u063a\u0637',
    musicMode: '\u062a\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064a\u0642\u064a',
    splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',
    working: '\u062c\u0627\u0631\u064d\u2026',
    chatPlaceholder: '\u062a\u062d\u062f\u062b \u0645\u0639 \u0627\u0644\u0631\u0648\u0628\u0648\u062a...',
    newVersion: '\u062a\u062d\u062f\u064a\u062b',
    t_mosque: '\u0645\u0633\u062c\u062f',
    t_zellige: '\u0632\u0644\u064a\u062c',
    t_andalus: '\u0623\u0646\u062f\u0644\u0633',
    t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629',
    t_space: '\u0641\u0636\u0627\u0621',
    t_jungle: '\u0623\u062f\u063a\u0627\u0644',
    t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83d\udce1 \u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u062c\u0627\u0647\u0632 \u2014 \u0627\u0644\u0645\u0633 \u0644\u0644\u0645\u0633\u062d!',
    logCleared: '\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644',
    copied: '\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',
    copyFail: '\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062e',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    scanning: '\u0645\u0633\u062d \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629...',
    touched: '\u062a\u0645 \u0643\u0634\u0641 \u062a\u0644\u0627\u0645\u0633 \u0627\u0644\u062c\u0633\u0645!',
    grounded: '\u0645\u0624\u0631\u0636 \u2014 \u0627\u0646\u062e\u0641\u0636\u062a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629!',
    sweepDone: '\u0627\u0643\u062a\u0645\u0644 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    resonanceFound: '\u062a\u0645 \u0625\u064a\u062c\u0627\u062f \u0627\u0644\u0631\u0646\u064a\u0646 \u0639\u0646\u062f',sectionCode:'كود الجهاز',faq_q1:'ما هو Bio Body Antenna؟',faq_a1:'Body Antenna هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. Human body as 1.8 MHz receiving antenna with impedance analysis. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الإشارات الطبية الحيوية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الإشارات الطبية الحيوية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام. تحاكي المحاكاة السلوك الحقيقي باستخدام معادلات رياضية تم التحقق منها. كل معامل تضبطه يتوافق مع متغير هندسي حقيقي. التصور يجعل العمليات غير المرئية مرئية.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الإشارات الطبية الحيوية.',demo_s1:'مرحباً في Bio Body Antenna! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الإشارات الطبية الحيوية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالإشارات الطبية الحيوية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Body Antenna! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالإلكترونيات الحيوية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how The human body acts as a ~1.7m antenna, resonant n لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الإشارات الطبية الحيوية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Bio Body Antenna: Human body as 1.8 MHz receiving antenna with impedance analysis. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Body Antenna على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Body Antenna',
    wiki_math: 'الرياضيات وراء Body Antenna: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Gain (dBi)',
    gloss2_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Body Antenna يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'راديو النفق الكمي',related1_desc:'محاكاة نفق موجات RF عبر حواجز الجهد الكمية',related1_path:'../../47-impossible-physics/phys-tunneling-radio/index.html',related2_name:'Dead Drop — نقل رسائل BLE',related2_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related2_path:'../../46-swarm-intelligence/swarm-flock-formation/index.html',related3_name:'Dead Drop — نقل رسائل BLE',related3_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related3_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'',pathPrev_path:'',pathNext_name:'\\u0631\\u0627\\u062f\\u064a\\u0648 \\u0627\\u0644\\u062f\\u0645\\u0627\\u063a \\u2014 EEG \\u0625\\u0644\\u0649 RF',pathNext_path:'../../43-bio-radio/bio-brainwave-radio/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما الغرض من الهوائي؟',quiz_q1a:'تخزين الطاقة',quiz_q1b:'تحويل الإشارات',quiz_q1c:'تضخيم الطاقة',quiz_q1d:'تصفية الضوضاء',quiz_q1_answer:'1',quiz_q2:'إذا تضاعف التردد، ماذا يحدث لطول الموجة؟',quiz_q2a:'يتضاعف',quiz_q2b:'ينقسم للنصف',quiz_q2c:'يبقى كما هو',quiz_q2d:'يتضاعف ثلاثاً',quiz_q2_answer:'1',quiz_q3:'ماذا تعني AM في الراديو؟',quiz_q3a:'تعديل صوتي',quiz_q3b:'تعديل السعة',quiz_q3c:'تعديل تناظري',quiz_q3d:'تعديل نشط',quiz_q3_answer:'1',quiz_q4:'ماذا يقيس كسب الهوائي؟',quiz_q4a:'الحجم',quiz_q4b:'الكفاءة الاتجاهية',quiz_q4c:'اللون',quiz_q4d:'الوزن',quiz_q4_answer:'1',quiz_q5:'ما هو التعلم الآلي؟',quiz_q5a:'برمجة الروبوتات',quiz_q5b:'أنظمة تتعلم من البيانات',quiz_q5c:'حساب يدوي',quiz_q5d:'تصميم العتاد',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'يولد مصادم الهادرونات الكبير في سيرن 1 بيتابايت في الثانية أثناء التصادمات. في عام 2012 أكد بوزون هيغز مكملاً النموذج القياسي للفيزياء.',realworld2:'رصد مرصد ليغو موجات الجاذبية عام 2015 مؤكدًا تنبؤ أينشتاين قبل 100 عام. قاست المستشعرات تشوهات في الزمكان بمقدار 10⁻²¹ متر.',realworld3:'يتواصل المسبار فويجر 1 الذي أُطلق عام 1977 من مسافة 24 مليار كم باستخدام مرسل بقدرة 23 واط. تستغرق الإشارات أكثر من 22 ساعة في كل اتجاه.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الراديو الحيوي معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الراديو الحيوي وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Bio Body Antenna يوضح مفهومًا أساسيًا في الراديو الحيوي. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Bio Body Antenna لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في الراديو الحيوي هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ micro:bit وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال الراديو الحيوي يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


/* ═══════ LANGUAGE ═══════ */

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;
const logHistory = [];
let typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;

  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }

  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); }
  logHistory.push({ msg, type, ts: Date.now() });
  applyLogFilter();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
  playSound('success');
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  const filters = document.querySelectorAll('.log-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
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
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;

function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) {
    t.textContent = msg || LANG[currentLang].working;
    el.style.display = 'block';
  }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}

function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;

function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}

function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ SLEEP ═══════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════ TYPEWRITER ═══════ */

async function typewriterAppend(element, text) {
  element.classList.add('typing');
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
  } catch { return ''; }
}

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  const h = calcHijriDate();
  if (h) el.textContent = h;
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
  try {
    const stored = localStorage.getItem('wdiy-latest-version');
    if (stored && stored !== APP_VERSION) {
      const btn = $('settingsBtn');
      if (btn && !btn.querySelector('.version-update')) {
        const badge = document.createElement('span');
        badge.className = 'version-update';
        badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
        btn.style.position = 'relative';
        badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
        btn.appendChild(badge);
      }
    }
  } catch {}
}

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
  try {
    const msg = { type, data, from: document.title, ts: Date.now() };
    localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
    localStorage.removeItem(APP_MSG_KEY);
  } catch {}
}

function onAppMessage(callback) {
  window.addEventListener('storage', e => {
    if (e.key !== APP_MSG_KEY || !e.newValue) return;
    try { callback(JSON.parse(e.newValue)); } catch {}
  });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; activateRetroTheme(); }
    } else { konamiIdx = 0; }
  });
}

function activateRetroTheme() {
  setTheme('retro');
  log('\ud83d\udd79\ufe0f KONAMI CODE ACTIVATED \u2014 RETRO MODE!', 'success');
  playSound('success');
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
  return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' ');
}

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, ''));
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(100);
    } else if (ch === '-') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(300);
    } else if (ch === '/') { await sleep(400); continue; }
    else if (ch === ' ') { await sleep(200); continue; }
    dot.style.background = orig; dot.style.boxShadow = '';
    await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => {
    if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
  });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630\u0623\u0624\u0626\u0625\u0621\u0629\u0649\u0622\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false;
    cancelAnimationFrame(matrixAnim);
    canvas.classList.remove('active');
    log('\ud83d\udd34 Matrix rain off', 'info');
    return;
  }
  matrixRunning = true;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);

  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
  log('\ud83d\udfe2 Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); }
    else { logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }
  });
}

/* ═══════ DEBUG PANEL ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel');
  if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, lastTime = performance.now();

  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      frames = 0; lastTime = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  log('\ud83d\udc1b Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
  if (!window.DeviceMotionEvent) return;
  let lastShake = 0;
  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > 25 && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      generateBugReport();
    }
  });
}

function generateBugReport() {
  if (!logContainer) logContainer = $('logContainer');
  const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
  const report = {
    app: document.title, version: APP_VERSION,
    timestamp: new Date().toISOString(), userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`, viewport: `${innerWidth}x${innerHeight}`,
    theme: document.documentElement.dataset.theme, lang: currentLang,
    log: lines.slice(-50)
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `bug-report-${Date.now()}.json`; a.click();
  URL.revokeObjectURL(url);
  log('\ud83d\udcf1 Bug report exported (shake)', 'success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) {
        logContainer.removeChild(logContainer.lastChild);
        logHistory.pop();
        playSound('click');
      }
    }
  });
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523],
  'zellige': [440, 523, 659],
  'andalus': [294, 370, 440],
  'space': [523, 659, 784],
  'jungle': [262, 330, 392],
  'robot': [440, 554, 659],
  'riad': [349, 440, 523],
  'medina': [294, 349, 440],
  'retro': [523, 262, 523],
};

function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;
  if (breathingActive) {
    bands.forEach(b => b.classList.add('breathing'));
    log('\ud83e\udec1 Breathing guide on \u2014 inhale... exhale...', 'info');
  } else {
    bands.forEach(b => b.classList.remove('breathing'));
    if (dhikrCount > 0) log(`\ud83d\udcff Dhikr count: ${dhikrCount}`, 'success');
    dhikrCount = 0;
    log('\ud83e\udec1 Breathing guide off', 'info');
  }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    log('\ud83c\udfa4 Speech not supported', 'error');
    return;
  }
  if (whisperActive) {
    if (recognition) recognition.stop();
    whisperActive = false;
    log('\ud83c\udfa4 Whisper mode off', 'info');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const text = e.results[i][0].transcript.trim();
        if (text) log(`\ud83c\udfa4 ${text}`, 'rx');
      }
    }
  };
  recognition.onerror = e => log(`\ud83c\udfa4 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start();
  whisperActive = true;
  log('\ud83c\udfa4 Whisper mode on \u2014 speak!', 'success');
}

/* ═══════ GHOST USERS ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.className = 'ghost-canvas';
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;

  window.addEventListener('resize', () => {
    ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;
  });

  document.addEventListener('mousemove', e => {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify({ id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now() }));
    } catch {}
  });

  const ghosts = {};
  window.addEventListener('storage', e => {
    if (e.key !== GHOST_KEY || !e.newValue) return;
    try {
      const d = JSON.parse(e.newValue);
      if (d.id === myGhostId) return;
      ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
    } catch {}
  });

  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      const age = (now - g.ts) / 3000;
      ghostCtx.globalAlpha = 0.3 * (1 - age);
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
      ghostCtx.fillStyle = accent; ghostCtx.fill();
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ghostCtx.fillStyle = '#fff'; ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ NIGHT MODE ═══════ */

function initNightMode() {
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;
  if (isNight) {
    try {
      const manual = localStorage.getItem('wdiy-theme');
      if (!manual) { setTheme('mosque-gold'); log('\ud83c\udf19 Night mode', 'info'); }
    } catch {}
  }
}

/* ═══════ LOGO TRACKER ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2);
    const dy = (e.clientY - cy) / (innerHeight / 2);
    const tiltX = dy * 8, tiltY = -dx * 8;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
    const shift = dist * 4;
    logo.style.transform = `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dx * shift}px) translateY(${dy * shift}px)`;
  });
  document.addEventListener('mouseleave', () => {
    logo.style.transition = 'transform .5s ease-out';
    logo.style.transform = '';
    setTimeout(() => { logo.style.transition = ''; }, 500);
  });
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('\ud83c\udfb5 Music mode off', 'info');
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser();
    musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser);
    musicActive = true;
    log('\ud83c\udfb5 Music mode on!', 'success');
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      bands.forEach((b, i) => {
        const v = i === 0 ? bass : treble;
        b.style.height = (2 + v * 10) + 'px';
        b.style.opacity = 0.4 + v * 0.6;
      });
      cards.forEach(c => { c.style.transform = `scale(${1 + bass * 0.015})`; c.style.transition = 'transform 0.05s'; });
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => log('\ud83c\udfb5 Microphone access denied', 'error'));
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle');
  const panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';

  handle.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startW = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('active');
    document.body.style.cursor = ''; document.body.style.userSelect = '';
    try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {}
  });

  handle.addEventListener('touchstart', e => {
    dragging = true; startX = e.touches[0].clientX; startW = panel.offsetWidth;
    handle.classList.add('active'); e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('active');
    try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {}
  });

  try {
    const saved = localStorage.getItem('wdiy-log-width');
    if (saved) document.documentElement.style.setProperty('--log-width', saved);
  } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('open');
  if (sb) { const first = sb.querySelector(FOCUSABLE); if (first) first.focus(); }
}

function closePanel(panelId, overlayId, returnFocusId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  const btn = $(returnFocusId);
  if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }

let logWasOpen = false;

function openSettings() {
  const logEl = $('logPanel');
  logWasOpen = logEl && logEl.classList.contains('open');
  if (logWasOpen) closeLog();
  openPanel('settingsPanel', 'settingsOverlay');
}

function closeSettings() {
  closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
  if (logWasOpen) { openLog(); logWasOpen = false; }
}

function openLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.add('open');
  document.body.classList.add('log-open');
}

function closeLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.remove('open');
  document.body.classList.remove('log-open');
  const btn = $('logBtn');
  if (btn) btn.focus();
}

function toggleLog() {
  const sb = $('logPanel');
  if (sb && sb.classList.contains('open')) closeLog();
  else openLog();
}

function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab');
  const contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const target = $(targetId);
      if (target) target.classList.add('active');
    });
  });
}

function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id);
    if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
}

/* ═══════ AI CHAT ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
  const s = LANG[currentLang];
  chatHistory.push({ role: 'user', content: userMsg });
  log(`\ud83d\udcac You: ${userMsg}`, 'tx');
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 150,
        system: `You are the Workshop-DIY robot assistant in a kids educational app about body antennas and RF. Keep responses SHORT (1-2 sentences). Language: ${currentLang}. Be encouraging. Add relevant emojis.`,
        messages: chatHistory.slice(-10)
      })
    });
    const data = await resp.json();
    const reply = data.content?.[0]?.text || '\ud83e\udd16 ...';
    chatHistory.push({ role: 'assistant', content: reply });
    log(`\ud83e\udd16 ${reply}`, 'rx');
    playSound('success');
  } catch { log('\ud83e\udd16 Brain offline', 'error'); }
}

function initAIChat() {
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  const chatRow = document.createElement('div');
  chatRow.className = 'chat-input-row';
  chatRow.innerHTML = `<input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." data-i18n-placeholder="chatPlaceholder" /><button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">\ud83e\udd16</span></button>`;
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  const input = $('chatInput'), sendBtn = $('chatSendBtn');
  const send = () => { const msg = input.value.trim(); if (!msg) return; input.value = ''; aiRespond(msg); };
  if (sendBtn) sendBtn.onclick = send;
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;
  if (exb) exb.onclick = exportLog;
  initLogFilters();

  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp;
  if (hClose) hClose.onclick = closeHelp;
  if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings;
  if (sClose) sClose.onclick = closeSettings;
  if (sOv) sOv.onclick = closeSettings;

  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog;
  if (lClose) lClose.onclick = closeLog;
  initLogResize();

  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => {
      soundEnabled = soundTgl.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
      if (soundEnabled) playSound('click');
    });
  }

  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  const breathBtn = $('breathingBtn');
  const dhikrDisp = $('dhikrDisplay');
  const dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => {
    toggleBreathing();
    if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
  };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

  const musicBtn = $('musicBtn');
  if (musicBtn) musicBtn.onclick = toggleMusicMode;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllPanels();
    if (e.key === 'Tab') trapFocus(e);
  });

  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  checkVersion();
  onAppMessage(msg => log(`\ud83d\udce8 ${msg.from}: ${msg.type}`, 'rx'));

  initKonami();
  initMorseLog();
  initMatrixTrigger();
  initDebug();
  initShakeReport();
  initTimeTravel();
  initHijriDate();
  initGhostUsers();
  initNightMode();
  initLogoTracker();
  initAIChat();

  log(LANG[currentLang].ready, 'success');

  // Init app-specific simulation
  setTimeout(initAntennaApp, 50);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BIO BODY ANTENNA SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let antennaAnim = null;
let isScanning = false;
let isTouching = false;
let isGrounded = false;
let currentFreq = 1.8;
let bodyZ = { r: 150, x: 45 };
let swr = 2.1;
let gain = -12;
let sweepData = [];
let sweepActive = false;

function initAntennaApp() {
  const canvas = $('antennaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width;
  const H = canvas.height;
  let t = 0;
  let wavePhase = 0;
  let bodyGlow = 0;

  // Human body outline points (stick figure)
  const bodyPts = [
    { x: 0.50, y: 0.08 }, { x: 0.50, y: 0.22 }, { x: 0.38, y: 0.18 },
    { x: 0.50, y: 0.22 }, { x: 0.62, y: 0.18 }, { x: 0.50, y: 0.22 },
    { x: 0.50, y: 0.48 }, { x: 0.42, y: 0.70 }, { x: 0.38, y: 0.92 },
    { x: 0.42, y: 0.70 }, { x: 0.50, y: 0.48 }, { x: 0.58, y: 0.70 },
    { x: 0.62, y: 0.92 }
  ];

  function drawBody(ctx, glow) {
    ctx.save();
    const color = glow > 0 ? '51,255,51' : '212,160,60';
    ctx.strokeStyle = `rgba(${color},${0.6 + glow * 0.4})`;
    ctx.lineWidth = 3 + glow * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = glow > 0 ? '#33ff33' : '#d4a03c';
    ctx.shadowBlur = glow * 20;
    ctx.beginPath();
    bodyPts.forEach((p, i) => {
      const px = p.x * W * 0.3 + W * 0.35;
      const py = p.y * H;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    // Head circle
    ctx.beginPath();
    ctx.arc(0.5 * W * 0.3 + W * 0.35, 0.05 * H, H * 0.04, 0, Math.PI * 2);
    ctx.stroke();
    // Ground line
    if (isGrounded) {
      ctx.strokeStyle = 'rgba(255,204,0,0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      const gx = 0.5 * W * 0.3 + W * 0.35;
      ctx.beginPath();
      ctx.moveTo(gx, 0.92 * H);
      ctx.lineTo(gx, H);
      ctx.stroke();
      ctx.setLineDash([]);
      // Ground symbol
      for (let gi = 0; gi < 3; gi++) {
        const gw = 20 - gi * 6;
        ctx.beginPath();
        ctx.moveTo(gx - gw, H - 2 - gi * 5);
        ctx.lineTo(gx + gw, H - 2 - gi * 5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawWaves(ctx, phase, strength) {
    const cx = 0.5 * W * 0.3 + W * 0.35;
    for (let ring = 0; ring < 8; ring++) {
      const r = 40 + ring * 30 + phase * 10;
      const alpha = Math.max(0, (1 - ring / 8) * strength * 0.5);
      ctx.beginPath();
      ctx.arc(cx, H * 0.45, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(51,255,51,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawSpectrum(ctx) {
    const sx = W * 0.68;
    const sy = 30;
    const sw = W * 0.28;
    const sh = H - 60;

    // Box
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(sx, sy, sw, sh);

    // Grid
    for (let i = 0; i < 5; i++) {
      const gy = sy + sh * i / 4;
      ctx.beginPath();
      ctx.moveTo(sx, gy);
      ctx.lineTo(sx + sw, gy);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Orbitron,monospace';
    ctx.fillText('0.5MHz', sx, sy + sh + 12);
    ctx.fillText('5MHz', sx + sw - 30, sy + sh + 12);
    ctx.fillText('|Z|', sx - 20, sy + 10);

    // Sweep data
    if (sweepData.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#33ff33';
      ctx.lineWidth = 2;
      sweepData.forEach((d, i) => {
        const px = sx + i / sweepData.length * sw;
        const py = sy + sh - d.z / 600 * sh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // SWR overlay
      ctx.beginPath();
      ctx.strokeStyle = '#ff6633';
      ctx.lineWidth = 1;
      sweepData.forEach((d, i) => {
        const px = sx + i / sweepData.length * sw;
        const py = sy + sh - Math.min(d.swr / 10, 1) * sh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Current freq marker
    const fx = sx + ((currentFreq - 0.5) / 4.5) * sw;
    ctx.beginPath();
    ctx.moveTo(fx, sy);
    ctx.lineTo(fx, sy + sh);
    ctx.strokeStyle = 'rgba(255,204,0,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 11px Orbitron';
    ctx.fillText(`${currentFreq.toFixed(3)}`, fx - 20, sy - 5);
  }

  function drawImpedance(ctx) {
    const ix = W * 0.02;
    const iy = H * 0.75;
    const iw = W * 0.55;
    const ih = H * 0.2;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(ix, iy, iw, ih);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(ix, iy, iw, ih);

    ctx.fillStyle = '#d4a03c';
    ctx.font = 'bold 13px Orbitron';
    ctx.fillText(`Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`, ix + 10, iy + 20);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Orbitron';
    ctx.fillText(`SWR: ${swr.toFixed(2)}  Gain: ${gain.toFixed(1)} dBi`, ix + 10, iy + 40);
    ctx.fillText(`Freq: ${currentFreq.toFixed(3)} MHz`, ix + 10, iy + 58);

    // Touch / Ground indicators
    if (isTouching) {
      ctx.fillStyle = '#33ff33';
      ctx.fillText('\u270b TOUCH', ix + iw - 80, iy + 20);
    }
    if (isGrounded) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillText('\u26a1 GND', ix + iw - 80, iy + 40);
    }
  }

  function drawSmithChart(ctx) {
    const scx = W * 0.12;
    const scy = H * 0.35;
    const scr = H * 0.15;

    // Outer circle
    ctx.beginPath();
    ctx.arc(scx, scy, scr, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner circles
    for (let r = 0.25; r < 1; r += 0.25) {
      ctx.beginPath();
      ctx.arc(scx + scr * (1 - r), scy, scr * r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.stroke();
    }

    // Impedance point
    const normR = bodyZ.r / 50;
    const normX = bodyZ.x / 50;
    const gamma_r = (normR * normR + normX * normX - 1) / ((normR + 1) * (normR + 1) + normX * normX);
    const gamma_i = (2 * normX) / ((normR + 1) * (normR + 1) + normX * normX);
    const px = scx + gamma_r * scr;
    const py = scy - gamma_i * scr;

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = isScanning ? '#33ff33' : '#d4a03c';
    ctx.shadowColor = isScanning ? '#33ff33' : '#d4a03c';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('Smith', scx - 14, scy + scr + 12);
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;
    wavePhase = (wavePhase + 0.03) % 1;

    if (isScanning) bodyGlow = Math.min(1, bodyGlow + 0.02);
    else bodyGlow = Math.max(0, bodyGlow - 0.01);

    drawWaves(ctx, wavePhase, isScanning ? 0.8 : 0.1);
    drawBody(ctx, bodyGlow);
    drawSmithChart(ctx);
    drawSpectrum(ctx);
    drawImpedance(ctx);

    // Noise floor particles
    if (isScanning) {
      for (let i = 0; i < 20; i++) {
        const nx = Math.random() * W;
        const ny = Math.random() * H;
        ctx.fillStyle = `rgba(51,255,51,${Math.random() * 0.1})`;
        ctx.fillRect(nx, ny, 2, 2);
      }
    }

    // Ambient RF waves from left
    if (isScanning) {
      for (let w = 0; w < 5; w++) {
        const wx = (t * 60 + w * 80) % (W * 0.6);
        const wy = H * 0.3 + Math.sin(wx * 0.02 + w) * 40;
        ctx.beginPath();
        ctx.moveTo(wx, wy - 10);
        ctx.lineTo(wx + 20, wy);
        ctx.lineTo(wx, wy + 10);
        ctx.strokeStyle = `rgba(100,200,255,${0.15 - w * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    antennaAnim = requestAnimationFrame(frame);
  }
  frame();

  // Wire up controls
  const startBtn = $('startBtn');
  const touchBtn = $('touchBtn');
  const groundBtnEl = $('groundBtn');
  const sweepBtnEl = $('sweepBtn');

  if (startBtn) startBtn.onclick = () => {
    isScanning = !isScanning;
    setStatus(isScanning);
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = isScanning ? (LANG[currentLang].stopScan || 'Stop') : LANG[currentLang].startScan;
    log(isScanning ? LANG[currentLang].scanning : 'Scan stopped', 'info');
    if (isScanning) updateImpedance();
  };

  if (touchBtn) touchBtn.onclick = () => {
    isTouching = !isTouching;
    touchBtn.classList.toggle('active', isTouching);
    log(LANG[currentLang].touched, 'success');
    updateImpedance();
  };

  if (groundBtnEl) groundBtnEl.onclick = () => {
    isGrounded = !isGrounded;
    groundBtnEl.classList.toggle('active', isGrounded);
    log(LANG[currentLang].grounded, 'success');
    updateImpedance();
  };

  if (sweepBtnEl) sweepBtnEl.onclick = startSweep;
}

function updateImpedance() {
  const f = currentFreq;
  const resonantF = 1.8 + (isTouching ? -0.15 : 0.05) + (isGrounded ? -0.3 : 0);
  const delta = Math.abs(f - resonantF);

  bodyZ.r = 36 + delta * 80 + (isTouching ? -10 : 20) + (isGrounded ? -15 : 0) + Math.random() * 5;
  bodyZ.x = (f - resonantF) * 120 + Math.random() * 10;

  const zMag = Math.sqrt(bodyZ.r * bodyZ.r + bodyZ.x * bodyZ.x);
  swr = Math.max(1, (zMag > 50 ? zMag / 50 : 50 / zMag));
  gain = -15 + 10 / swr + (isGrounded ? 3 : 0);

  // Update UI elements
  const fill = $('impedanceFill');
  const label = $('impedanceLabel');
  if (fill) fill.style.width = Math.min(100, zMag / 5) + '%';
  if (label) label.textContent = `Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`;

  const sf = $('statFreq');
  const ss = $('statSWR');
  const sg = $('statGain');
  const sz = $('statZ');
  const fd = $('freqDisplay');

  if (sf) sf.textContent = currentFreq.toFixed(3);
  if (ss) ss.textContent = swr.toFixed(1);
  if (sg) sg.textContent = gain.toFixed(1);
  if (sz) sz.textContent = Math.round(zMag);
  if (fd) fd.textContent = `${currentFreq.toFixed(3)} MHz`;
}

async function startSweep() {
  if (sweepActive) return;
  sweepActive = true;
  sweepData = [];
  const s = LANG[currentLang];

  log('Starting frequency sweep 0.5-5.0 MHz...', 'info');
  showToast(s.scanning, 3000);

  let bestSWR = 999;
  let bestFreq = 1.8;

  for (let f = 0.5; f <= 5.0; f += 0.05) {
    currentFreq = f;
    updateImpedance();

    const zMag = Math.sqrt(bodyZ.r * bodyZ.r + bodyZ.x * bodyZ.x);
    sweepData.push({ f, z: zMag, swr });

    if (swr < bestSWR) { bestSWR = swr; bestFreq = f; }
    await sleep(30);
  }

  currentFreq = bestFreq;
  updateImpedance();

  log(`${s.sweepDone}! ${s.resonanceFound} ${bestFreq.toFixed(3)} MHz (SWR ${bestSWR.toFixed(2)})`, 'success');
  hideToast();
  sweepActive = false;
}


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
