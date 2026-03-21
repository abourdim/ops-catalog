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
    diffTitle:'Difficulty',diffBeginner:'🟢 Beginner',diffIntermediate:'🟡 Intermediate',diffExpert:'🔴 Expert',diffInfo:'Choose your complexity level',spacedTitle:'📅 Spaced Review',spacedReview:'Review',spacedNext:'Next review',spacedMastered:'Mastered',spacedNew:'New — not yet studied',spacedDue:'Due for review!',spacedInfo:'Smart review reminders based on the forgetting curve',
    
    missionTitle:'MISSION BRIEFING',missionClassified:'CLASSIFIED',missionObjective:'Your mission objective:',missionAgent:'AGENT-30A6DD',missionSkip:'Skip',missionGo:'ACCEPT MISSION',mission_obj:'Explore and master Bio Brainwave Radio \u2014 analyze, experiment, and complete all challenges.',nightVisionTitle:'Night Vision Mode',nightVisionOn:'NV ON',nightVisionOff:'NV OFF',nightVisionAuto:'Auto NV',
    termTitle:'>_ Terminal',termPlaceholder:'Type a command...',termHelp:'Commands: help, start, stop, reset, theme [name], lang [en|fr|ar], set [param] [value], get [param], list, export, clear, status, about, cipher',termUnknown:'Unknown command. Type help for available commands.',termWelcome:'Terminal ready. Type help to get started.',cipherTitle:'🔐 Cipher Toolkit',cipherInput:'Input text',cipherOutput:'Output',cipherEncode:'Encode',cipherDecode:'Decode',cipherMethod:'Method',cipherKey:'Key',cipherCopy:'Copy',
    
    particleTitle:'🎆 Particles',particleToggle:'Toggle Particles',compareTitle:'📊 Compare',compareSave:'Save',compareLoad:'Load',compareDiff:'Difference',compareClear:'Clear',compareSlotA:'Experiment A',compareSlotB:'Experiment B',compareResult:'Comparison Result',
    
    
    labTitle:'📓 Lab Notebook',labGenerate:'📓 Lab Report',labExport:'Export Report',labHypothesis:'HYPOTHESIS',labMethod:'METHOD',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:'âº Data Recorder',recorderStart:'âº Record',recorderStop:'â¹ Stop',recorderClear:'Clear',recorderExport:'Export CSV',recorderPoints:'pts',recorderGraph:'Graph',
    voiceTitle:'🎤 Voice',voiceOn:'Voice ON',voiceOff:'Voice OFF',voiceListening:'Listening...',voiceCmd:'Command recognised',voiceHelp:'Say: start, stop, reset, help, theme, next, previous',voice_cmds:'start / stop / reset / help / theme / next / previous',shareTitle:'📤 Share',shareBtn:'📤 Share',shareCopied:'Copied to clipboard!',shareGenerate:'Generate Summary',shareExport:'Export JSON',
    
    
    dailyTitle:'📅 Daily Challenge',dailyChallenge:'Today\x27s Challenge',dailyHint:'Show Hint',dailyStreak:'Streak',dailyComplete:'Mark Complete',daily_d1:'Explain how Bio Brainwave Radio works to a friend in under 60 seconds.',daily_d2:'Find 3 real-world applications of Bio Radio concepts shown here.',daily_d3:'Change one parameter to its extreme value and document what happens.',daily_d4:'Draw a diagram showing the data flow in this Bio Radio simulation.',daily_d5:'Write pseudocode for the main algorithm used in this app.',daily_d6:'Compare results at default vs modified settings and note 3 differences.',daily_d7:'Create a hypothesis about what happens if you double the main parameter, then test it.',mentorTitle:'🎓 Guided Tutorial',mentorStart:'Start Tutorial',mentorNext:'Next',mentorPrev:'Previous',mentorDone:'Finish',mentorStep:'Step',mentor_s1:'Look at the main visualization area — this is where the simulation runs in real time.',mentor_s2:'Press Start to begin the simulation. Watch how the display reacts to your input.',mentor_s3:'Try adjusting one slider — watch how it affects the output immediately.',mentor_s4:'Open the Help panel and explore the Wiki tab for deeper knowledge.',mentor_s5:'Complete one challenge to test your understanding of the concepts.',
    sonifyTitle:'🔊 Data Sonification',sonifyOn:'Sonification ON',sonifyOff:'Sonification OFF',sonifyFreq:'Frequency',sonifyVol:'Volume',sonifyWave:'Waveform',sonifyInfo:'Turn data into sound',
    tooltipTitle:'Smart Tooltips',tooltipToggle:'Toggle Tooltips',tip_start:'Start the simulation and watch the visualization come alive',tip_stop:'Pause the simulation while preserving current state',tip_reset:'Clear all data and return to initial conditions',tip_slider:'Drag to adjust this parameter — the visualization updates in real time',tip_theme:'Switch between 8 visual themes including 2 light Islamic designs',tip_help:'Open the help panel with FAQ, guides, wiki, and challenges',explorerTitle:'Parameter Space Explorer',explorerStart:'Auto-Explore',explorerStop:'Stop Exploration',explorerProgress:'Exploring combinations...',explorerResult:'Exploration Complete',explorerInfo:'Systematically tests min/mid/max for each slider and records results',
    
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
    eegStarted: 'EEG acquisition started', eegStopped: 'EEG stopped', modeRelax: 'Mode: Relaxation \u2014 boosting alpha', modeFocus: 'Mode: Focus \u2014 boosting beta', needEEG: 'Start EEG first',sectionCode:'Device Code',faq_q1:'What is Bio Brainwave Radio?',faq_a1:'Brainwave Radio is an interactive simulation that demonstrates bioelectronics concepts. Transmit brain states via modulated radio. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start EEG to begin brainwave simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u062f\u0644\u062a\u0627 (0.5-4Hz)\u060c \u062b\u064a\u062a\u0627 (4-8Hz)\u060c \u0623\u0644\u0641\u0627 (8-13Hz)\u060c \u0628\u064a\u062a\u0627 (13-30Hz)\u060c \u063a\u0627\u0645\u0627 (30-100Hz).',faq_q5:'What should I experiment with?',faq_a5:'Close your eyes and relax. Can you boost alpha above 15 Hz?. The simulation models real-world behavior using validated mathematical equations. Every parameter you adjust corresponds to a real engineering variable. The visualization makes invisible processes visible, helping you develop intuition that transfers to real equipment.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Breath Modulator. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Brainwave Radio! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start EEG to begin brainwave simulation. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Brainwave Radio! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Electrodes detect tiny brain electrical signals (1 Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Brainwave Radio?',wiki_concept:'Bio Brainwave Radio is a technique used in biomedical signals. Transmit brain states via modulated radio. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Electrodes detect tiny brain electrical signals (10-100 microvolts). Second: Fast Fourier Transform decomposes signals into Delta, Theta, Alpha, Beta bands. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Brainwave Radio has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Brainwave Radio: Transmit brain states via modulated radio. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from EEG Pickup through FFT Analysis to RF Modulation and Transmission.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Dead Drop — BLE Message Transfer',related1_desc:'Encrypt and exchange secret messages via BLE simulation',related1_path:'../../45-time-manipulation/chrono-timing-attack-lab/index.html',related2_name:'Zero-Point Energy Meter',related2_desc:'Measure simulated quantum vacuum zero-point energy fluctuations',related2_path:'../../47-impossible-physics/phys-zero-point-meter/index.html',related3_name:'phys-gravitational-wave-sim',related3_desc:'',related3_path:'../../47-impossible-physics/phys-gravitational-wave-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Body Antenna — Impedance Measurement',pathPrev_path:'../../43-bio-radio/bio-body-antenna/index.html',pathNext_name:'Breath Modulator \\u2014 RF Carrier Control',pathNext_path:'../../43-bio-radio/bio-breath-modulator/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'Which unit measures radio frequency?',quiz_q1a:'Watts',quiz_q1b:'Hertz',quiz_q1c:'Decibels',quiz_q1d:'Ohms',quiz_q1_answer:'1',quiz_q2:'What is a neural network?',quiz_q2a:'Physical wires',quiz_q2b:'Computing system inspired by biological neurons',quiz_q2c:'Social network',quiz_q2d:'Radio network',quiz_q2_answer:'1',quiz_q3:'What is frequency measured in?',quiz_q3a:'Meters',quiz_q3b:'Hertz',quiz_q3c:'Watts',quiz_q3d:'Volts',quiz_q3_answer:'1',quiz_q4:'If frequency doubles, what happens to wavelength?',quiz_q4a:'Doubles',quiz_q4b:'Halves',quiz_q4c:'Stays same',quiz_q4d:'Triples',quiz_q4_answer:'1',quiz_q5:'What is machine learning?',quiz_q5a:'Programming robots',quiz_q5b:'Systems that learn from data',quiz_q5c:'Manual computation',quiz_q5d:'Hardware design',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'LIGO detected gravitational waves in 2015, confirming Einstein\'s 100-year-old prediction. The sensors measured spacetime distortions of 10⁻²¹ meters — one ten-thousandth the width of a proton.',realworld2:'Voyager 1, launched in 1977, communicates from 24 billion km away using a 23-watt transmitter — the power of a fridge light bulb. Signals take 22+ hours each way. The Deep Space Network uses 70m dishes to receive them.',realworld3:'CERN\'s LHC generates 1 petabyte/second during collisions. The Worldwide LHC Computing Grid spans 170 centers in 42 countries. In 2012, it confirmed the Higgs boson, completing the Standard Model of physics.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In bio-radio, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in bio-radio and reveal the hidden complexity beneath simple-looking systems.',proTipTitle:'💡 Pro Tips',proTip1:'Always check your battery level before field operations. A dying micro:bit produces unreliable sensor readings that can corrupt your entire dataset.',proTip2:'Use radio group numbers above 100 to avoid interference from other micro:bit users in the area. Default groups 0-10 are crowded.',funFactTitle:'🎯 Did You Know?',funFact:'Lightning bolts reach temperatures of 30,000°C — five times hotter than the surface of the Sun. Each bolt carries enough energy to toast 100,000 slices of bread.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
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
    diffTitle:'Difficulté',diffBeginner:'🟢 Débutant',diffIntermediate:'🟡 Intermédiaire',diffExpert:'🔴 Expert',diffInfo:'Choisissez votre niveau de complexité',spacedTitle:'📅 Révision espacée',spacedReview:'Réviser',spacedNext:'Prochaine révision',spacedMastered:'Maîtrisé',spacedNew:'Nouveau — pas encore étudié',spacedDue:'Révision nécessaire !',spacedInfo:'Rappels intelligents basés sur la courbe de l\x27oubli',
    
    missionTitle:'BRIEFING DE MISSION',missionClassified:'CLASSIFI\xc9',missionObjective:'Objectif de mission :',missionAgent:'AGENT-30A6DD',missionSkip:'Passer',missionGo:'ACCEPTER LA MISSION',mission_obj:'Explorer et ma\xeetrisez Bio Brainwave Radio \u2014 analysez, exp\xe9rimentez et compl\xe9tez tous les d\xe9fis.',nightVisionTitle:'Mode Vision Nocturne',nightVisionOn:'VN ON',nightVisionOff:'VN OFF',nightVisionAuto:'VN Auto',
    termTitle:'>_ Terminal',termPlaceholder:'Tapez une commande...',termHelp:'Commandes : help, start, stop, reset, theme [nom], lang [en|fr|ar], set [param] [valeur], get [param], list, export, clear, status, about, cipher',termUnknown:'Commande inconnue. Tapez help pour la liste.',termWelcome:'Terminal pr\x27et. Tapez help pour commencer.',cipherTitle:'🔐 Chiffrement',cipherInput:'Texte source',cipherOutput:'R\xe9sultat',cipherEncode:'Encoder',cipherDecode:'D\xe9coder',cipherMethod:'M\xe9thode',cipherKey:'Cl\xe9',cipherCopy:'Copier',
    
    particleTitle:'🎆 Particules',particleToggle:'Basculer Particules',compareTitle:'📊 Comparer',compareSave:'Sauvegarder',compareLoad:'Charger',compareDiff:'Différence',compareClear:'Effacer',compareSlotA:'Expérience A',compareSlotB:'Expérience B',compareResult:'Résultat de comparaison',
    
    peerTitle:'👥 Peer Mode',peerConnect:'Connect',peerDisconnect:'Disconnect',peerStatus:'Peer Status',peerSend:'Sent',peerReceive:'Received',peerInfo:'Open this app in two tabs to sync parameters via BroadcastChannel',heatmapTitle:'📅 Activity Heatmap',heatmapToday:'Today',heatmapStreak:'Streak',heatmapTotal:'Total',heatmapLegend:'Less \u2192 More',
    
    labTitle:'📓 Cahier de labo',labGenerate:'📓 Rapport de labo',labExport:'Exporter le rapport',labHypothesis:'HYPOTH\xc8SE',labMethod:'M\xc9THODE',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:'âº Enregistreur',recorderStart:'âº Enregistrer',recorderStop:'â¹ Arr\xeater',recorderClear:'Effacer',recorderExport:'Exporter CSV',recorderPoints:'pts',recorderGraph:'Graphique',
    voiceTitle:'🎤 Voix',voiceOn:'Voix ON',voiceOff:'Voix OFF',voiceListening:'Écoute...',voiceCmd:'Commande reconnue',voiceHelp:'Dites : démarrer, arrêter, aide, thème, suivant, précédent',voice_cmds:'démarrer / arrêter / aide / thème / suivant / précédent',shareTitle:'📤 Partager',shareBtn:'📤 Partager',shareCopied:'Copié dans le presse-papiers !',shareGenerate:'Générer le résumé',shareExport:'Exporter JSON',
    
    
    dailyTitle:'📅 D\xe9fi du jour',dailyChallenge:'D\xe9fi d\x27aujourd\x27hui',dailyHint:'Voir l\x27indice',dailyStreak:'S\xe9rie',dailyComplete:'Marquer termin\xe9',daily_d1:'Explique comment Bio Brainwave Radio fonctionne \xe0 un ami en moins de 60 secondes.',daily_d2:'Trouve 3 applications r\xe9elles des concepts de Bio Radio montr\xe9s ici.',daily_d3:'Change un param\xe8tre \xe0 sa valeur extr\xeame et documente ce qui se passe.',daily_d4:'Dessine un diagramme montrant le flux de donn\xe9es dans cette simulation de Bio Radio.',daily_d5:'\xc9cris le pseudocode de l\x27algorithme principal utilis\xe9 dans cette app.',daily_d6:'Compare les r\xe9sultats avec les param\xe8tres par d\xe9faut et modifi\xe9s et note 3 diff\xe9rences.',daily_d7:'Formule une hypoth\xe8se sur ce qui se passe si tu doubles le param\xe8tre principal, puis teste-la.',mentorTitle:'🎓 Tutoriel guid\xe9',mentorStart:'D\xe9marrer le tutoriel',mentorNext:'Suivant',mentorPrev:'Pr\xe9c\xe9dent',mentorDone:'Terminer',mentorStep:'\xc9tape',mentor_s1:'Regarde la zone de visualisation principale — c\x27est l\xe0 que la simulation tourne en temps r\xe9el.',mentor_s2:'Appuie sur D\xe9marrer pour lancer la simulation. Observe comment l\x27affichage r\xe9agit.',mentor_s3:'Essaie de modifier un curseur — observe comment cela affecte le r\xe9sultat imm\xe9diatement.',mentor_s4:'Ouvre le panneau Aide et explore l\x27onglet Wiki pour approfondir tes connaissances.',mentor_s5:'Compl\xe8te un d\xe9fi pour tester ta compr\xe9hension des concepts.',
    sonifyTitle:'🔊 Sonification des données',sonifyOn:'Sonification activée',sonifyOff:'Sonification désactivée',sonifyFreq:'Fréquence',sonifyVol:'Volume',sonifyWave:'Forme d\x27onde',sonifyInfo:'Transformez les données en son',
    tooltipTitle:'Infobulles intelligentes',tooltipToggle:'Activer les infobulles',tip_start:'Lancer la simulation et observer la visualisation s\x27animer',tip_stop:'Mettre en pause la simulation en conservant l\x27état actuel',tip_reset:'Effacer toutes les données et revenir aux conditions initiales',tip_slider:'Glisser pour ajuster ce paramètre — la visualisation se met à jour en temps réel',tip_theme:'Basculer entre 8 thèmes visuels dont 2 thèmes clairs islamiques',tip_help:'Ouvrir le panneau d\x27aide avec FAQ, guides, wiki et défis',explorerTitle:'Explorateur d\x27espace paramétrique',explorerStart:'Auto-Explorer',explorerStop:'Arrêter l\x27exploration',explorerProgress:'Exploration des combinaisons...',explorerResult:'Exploration terminée',explorerInfo:'Teste systématiquement min/milieu/max pour chaque curseur et enregistre les résultats',
    
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
    eegStarted: 'Acquisition EEG d\u00e9marr\u00e9e', eegStopped: 'EEG arr\u00eat\u00e9', modeRelax: 'Mode: Relaxation \u2014 boost alpha', modeFocus: 'Mode: Concentration \u2014 boost b\u00eata', needEEG: 'D\u00e9marrez l\'EEG d\'abord',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Brainwave Radio ?',faq_a1:'Brainwave Radio est une simulation interactive qui démontre les concepts de bioélectronique. Transmit brain states via modulated radio. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système. La simulation modélise le comportement réel à l aide d équations mathématiques validées. Chaque paramètre correspond à une variable d ingénierie réelle. La visualisation rend visibles les processus invisibles.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Brainwave Radio ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Brainwave Radio ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de bioélectronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Electrodes detect tiny brain electrical signals (1 Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Bio Brainwave Radio ?',wiki_concept:'Bio Brainwave Radio est une technique utilisée en biomedical signals. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de biomedical signals. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Bio Brainwave Radio a des applications pratiques en biomedical signals. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Bio Brainwave Radio : Transmit brain states via modulated radio. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Dead Drop — Transfert BLE',related1_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related1_path:'../../45-time-manipulation/chrono-timing-attack-lab/index.html',related2_name:'Compteur ZPE',related2_desc:'Mesurer les fluctuations d\\',related2_path:'../../47-impossible-physics/phys-zero-point-meter/index.html',related3_name:'phys-gravitational-wave-sim',related3_desc:'',related3_path:'../../47-impossible-physics/phys-gravitational-wave-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Antenne Corporelle \\u2014 Mesure d\\',pathPrev_path:'../../43-bio-radio/bio-body-antenna/index.html',pathNext_name:'Modulateur Respiratoire \\u2014 Contr\\u00f4le RF',pathNext_path:'../../43-bio-radio/bio-breath-modulator/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quelle unité mesure la fréquence radio ?',quiz_q1a:'Watts',quiz_q1b:'Hertz',quiz_q1c:'Décibels',quiz_q1d:'Ohms',quiz_q1_answer:'1',quiz_q2:'Qu\'est-ce qu\'un réseau de neurones ?',quiz_q2a:'Fils physiques',quiz_q2b:'Système informatique inspiré des neurones',quiz_q2c:'Réseau social',quiz_q2d:'Réseau radio',quiz_q2_answer:'1',quiz_q3:'En quoi se mesure la fréquence ?',quiz_q3a:'Mètres',quiz_q3b:'Hertz',quiz_q3c:'Watts',quiz_q3d:'Volts',quiz_q3_answer:'1',quiz_q4:'Si la fréquence double, que devient la longueur d\'onde ?',quiz_q4a:'Double',quiz_q4b:'Divisée par 2',quiz_q4c:'Inchangée',quiz_q4d:'Triplée',quiz_q4_answer:'1',quiz_q5:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q5a:'Programmer des robots',quiz_q5b:'Systèmes apprenant des données',quiz_q5c:'Calcul manuel',quiz_q5d:'Conception matérielle',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'LIGO a détecté des ondes gravitationnelles en 2015, confirmant la prédiction centenaire d\'Einstein. Les capteurs ont mesuré des distorsions de l\'espace-temps de 10⁻²¹ mètres.',realworld2:'Voyager 1, lancé en 1977, communique depuis 24 milliards de km avec un émetteur de 23 watts. Les signaux prennent plus de 22 heures dans chaque sens.',realworld3:'Le LHC du CERN génère 1 pétaoctet par seconde lors des collisions. En 2012, il a confirmé le boson de Higgs, complétant le Modèle standard de la physique.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En bio-radio, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en bio-radio et révèlent la complexité cachée sous des systèmes simples en apparence.',proTipTitle:'💡 Conseils de pro',proTip1:'Vérifiez toujours le niveau de batterie avant les opérations terrain. Un micro:bit mourant produit des lectures capteur peu fiables.',proTip2:'Utilisez des numéros de groupe radio supérieurs à 100 pour éviter les interférences. Les groupes par défaut 0-10 sont encombrés.',funFactTitle:'🎯 Le saviez-vous ?',funFact:'La foudre atteint 30 000°C — cinq fois plus chaud que la surface du Soleil. Chaque éclair transporte assez d\x27énergie pour griller 100 000 tranches de pain.',mistakeTitle:'⚠️ Erreurs courantes',mistake1:'Changer plusieurs paramètres à la fois rend impossible l\x27isolation de la cause et de l\x27effet. Changez toujours UNE seule variable à la fois.',mistake2:'Sauter la mesure de référence. Sans connaître le comportement par défaut, vous ne pouvez pas mesurer l\x27impact de vos changements.',mistake3:'Ignorer le journal d\x27activité. Il enregistre chaque événement avec des horodatages — essentiel pour comprendre les séquences.'},
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
    diffTitle:'المستوى',diffBeginner:'🟢 مبتدئ',diffIntermediate:'🟡 متوسط',diffExpert:'🔴 خبير',diffInfo:'اختر مستوى التعقيد',spacedTitle:'📅 المراجعة المتباعدة',spacedReview:'مراجعة',spacedNext:'المراجعة التالية',spacedMastered:'مُتقَن',spacedNew:'جديد — لم يُدرَس بعد',spacedDue:'حان وقت المراجعة!',spacedInfo:'تذكيرات ذكية بناءً على منحنى النسيان',
    
    missionTitle:'\u0625\u062D\u0627\u0637\u0629 \u0627\u0644\u0645\u0647\u0645\u0629',missionClassified:'\u0633\u0631\u064A',missionObjective:'\u0647\u062F\u0641 \u0627\u0644\u0645\u0647\u0645\u0629:',missionAgent:'AGENT-30A6DD',missionSkip:'\u062A\u062E\u0637\u064A',missionGo:'\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0647\u0645\u0629',mission_obj:'\u0627\u0633\u062A\u0643\u0634\u0641 \u0648\u0623\u062A\u0642\u0646 \u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u2014 \u062D\u0644\u0644 \u0648\u062C\u0631\u0628 \u0648\u0623\u0643\u0645\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A.',nightVisionTitle:'\u0648\u0636\u0639 \u0627\u0644\u0631\u0624\u064A\u0629 \u0627\u0644\u0644\u064A\u0644\u064A\u0629',nightVisionOn:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 ON',nightVisionOff:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 OFF',nightVisionAuto:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A',
    termTitle:'>_ الطرفية',termPlaceholder:'اكتب أمراً...',termHelp:'الأوامر: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher',termUnknown:'أمر غير معروف. اكتب help للمساعدة.',termWelcome:'الطرفية جاهزة. اكتب help للبدء.',cipherTitle:'🔐 أدوات التشفير',cipherInput:'النص المدخل',cipherOutput:'النتيجة',cipherEncode:'تشفير',cipherDecode:'فك التشفير',cipherMethod:'الطريقة',cipherKey:'المفتاح',cipherCopy:'نسخ',
    
    particleTitle:'🎆 جزيئات',particleToggle:'تبديل الجزيئات',compareTitle:'📊 مقارنة',compareSave:'حفظ',compareLoad:'تحميل',compareDiff:'الفرق',compareClear:'مسح',compareSlotA:'تجربة أ',compareSlotB:'تجربة ب',compareResult:'نتيجة المقارنة',
    
    peerTitle:'👥 Mode Pair',peerConnect:'Connecter',peerDisconnect:'D\xe9connecter',peerStatus:'Statut pair',peerSend:'Envoy\xe9',peerReceive:'Re\xe7u',peerInfo:'Ouvrez cette app dans deux onglets pour synchroniser les param\xe8tres',heatmapTitle:'📅 Carte d\x27activit\xe9',heatmapToday:'Aujourd\x27hui',heatmapStreak:'S\xe9rie',heatmapTotal:'Total',heatmapLegend:'Moins \u2192 Plus',
    
    labTitle:'📓 دفتر المختبر',labGenerate:'📓 تقرير المختبر',labExport:'تصدير التقرير',labHypothesis:'الفرضية',labMethod:'المنهجية',labObservation:'الملاحظات',labConclusion:'الخلاصة',labSession:'الجلسة',recorderTitle:'âº مسجل البيانات',recorderStart:'âº تسجيل',recorderStop:'â¹ إيقاف',recorderClear:'مسح',recorderExport:'تصدير CSV',recorderPoints:'نقطة',recorderGraph:'رسم بياني',
    voiceTitle:'🎤 صوت',voiceOn:'الصوت مفعل',voiceOff:'الصوت معطل',voiceListening:'جاري الاستماع...',voiceCmd:'تم التعرف على الأمر',voiceHelp:'قل: ابدأ، توقف، مساعدة',voice_cmds:'ابدأ / توقف / مساعدة',shareTitle:'📤 مشاركة',shareBtn:'📤 مشاركة',shareCopied:'تم النسخ!',shareGenerate:'إنشاء ملخص',shareExport:'تصدير JSON',
    
    
    dailyTitle:'📅 تحدي اليوم',dailyChallenge:'تحدي اليوم',dailyHint:'إظهار التلميح',dailyStreak:'سلسلة',dailyComplete:'إكمال',daily_d1:'اشرح كيف يعمل هذا التطبيق لصديق في أقل من 60 ثانية.',daily_d2:'ابحث عن 3 تطبيقات واقعية للمفاهيم المعروضة هنا.',daily_d3:'غيّر معلمة واحدة إلى قيمتها القصوى ووثّق ما يحدث.',daily_d4:'ارسم مخططاً يوضح تدفق البيانات في هذه المحاكاة.',daily_d5:'اكتب الكود الزائف للخوارزمية الرئيسية المستخدمة في هذا التطبيق.',daily_d6:'قارن النتائج بالإعدادات الافتراضية والمعدلة ولاحظ 3 اختلافات.',daily_d7:'ضع فرضية حول ما يحدث إذا ضاعفت المعلمة الرئيسية ثم اختبرها.',mentorTitle:'🎓 دليل تعليمي',mentorStart:'بدء الدليل',mentorNext:'التالي',mentorPrev:'السابق',mentorDone:'إنهاء',mentorStep:'خطوة',mentor_s1:'انظر إلى منطقة العرض الرئيسية — هنا تعمل المحاكاة في الوقت الفعلي.',mentor_s2:'اضغط على ابدأ لتشغيل المحاكاة. راقب كيف يتفاعل العرض.',mentor_s3:'جرّب تعديل شريط تمرير واحد — لاحظ كيف يؤثر على النتيجة فوراً.',mentor_s4:'افتح لوحة المساعدة واستكشف تبويب الويكي لمعرفة أعمق.',mentor_s5:'أكمل تحدياً واحداً لاختبار فهمك للمفاهيم.',
    sonifyTitle:'🔊 تحويل البيانات إلى صوت',sonifyOn:'الصوت مُفعَل',sonifyOff:'الصوت مُعطَل',sonifyFreq:'التردد',sonifyVol:'الصوت',sonifyWave:'شكل الموجة',sonifyInfo:'حوّل البيانات إلى صوت',
    tooltipTitle:'تلميحات ذكية',tooltipToggle:'تبديل التلميحات',tip_start:'ابدأ المحاكاة وشاهد الرسم البياني ينبض بالحياة',tip_stop:'أوقف المحاكاة مؤقتاً مع الحفاظ على الحالة الحالية',tip_reset:'امسح جميع البيانات وعد إلى الشروط الأولية',tip_slider:'اسحب لضبط هذا المعامل — يتحدث الرسم البياني في الوقت الفعلي',tip_theme:'بدّل بين 8 مظاهر مرئية منها تصميمان إسلاميان فاتحان',tip_help:'افتح لوحة المساعدة مع الأسئلة الشائعة والأدلة والويكي والتحديات',explorerTitle:'مستكشف فضاء المعاملات',explorerStart:'استكشاف تلقائي',explorerStop:'إيقاف الاستكشاف',explorerProgress:'جارٍ استكشاف التوليفات...',explorerResult:'اكتمل الاستكشاف',explorerInfo:'يختبر بشكل منهجي الحد الأدنى/الوسط/الأقصى لكل منزلق ويسجل النتائج',
    
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
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'Dead Drop — نقل رسائل BLE',related1_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related1_path:'../../45-time-manipulation/chrono-timing-attack-lab/index.html',related2_name:'مقياس طاقة النقطة الصفرية',related2_desc:'قياس تقلبات طاقة النقطة الصفرية للفراغ الكمي',related2_path:'../../47-impossible-physics/phys-zero-point-meter/index.html',related3_name:'phys-gravitational-wave-sim',related3_desc:'',related3_path:'../../47-impossible-physics/phys-gravitational-wave-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'\\u0647\\u0648\\u0627\\u0626\\u064a \\u0627\\u0644\\u062c\\u0633\\u0645 \\u2014 \\u0642\\u064a\\u0627\\u0633 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0648\\u0642\\u0629',pathPrev_path:'../../43-bio-radio/bio-body-antenna/index.html',pathNext_name:'\\u0645\\u0639\\u062f\\u0644 \\u0627\\u0644\\u062a\\u0646\\u0641\\u0633 \\u2014 \\u062a\\u062d\\u0643\\u0645 RF',pathNext_path:'../../43-bio-radio/bio-breath-modulator/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما وحدة قياس التردد الراديوي؟',quiz_q1a:'واط',quiz_q1b:'هرتز',quiz_q1c:'ديسيبل',quiz_q1d:'أوم',quiz_q1_answer:'1',quiz_q2:'ما هي الشبكة العصبية؟',quiz_q2a:'أسلاك مادية',quiz_q2b:'نظام حوسبة مستوحى من الخلايا العصبية',quiz_q2c:'شبكة اجتماعية',quiz_q2d:'شبكة راديو',quiz_q2_answer:'1',quiz_q3:'بماذا تُقاس التردد؟',quiz_q3a:'أمتار',quiz_q3b:'هرتز',quiz_q3c:'واط',quiz_q3d:'فولت',quiz_q3_answer:'1',quiz_q4:'إذا تضاعف التردد، ماذا يحدث لطول الموجة؟',quiz_q4a:'يتضاعف',quiz_q4b:'ينقسم للنصف',quiz_q4c:'يبقى كما هو',quiz_q4d:'يتضاعف ثلاثاً',quiz_q4_answer:'1',quiz_q5:'ما هو التعلم الآلي؟',quiz_q5a:'برمجة الروبوتات',quiz_q5b:'أنظمة تتعلم من البيانات',quiz_q5c:'حساب يدوي',quiz_q5d:'تصميم العتاد',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'رصد مرصد ليغو موجات الجاذبية عام 2015 مؤكدًا تنبؤ أينشتاين قبل 100 عام. قاست المستشعرات تشوهات في الزمكان بمقدار 10⁻²¹ متر.',realworld2:'يتواصل المسبار فويجر 1 الذي أُطلق عام 1977 من مسافة 24 مليار كم باستخدام مرسل بقدرة 23 واط. تستغرق الإشارات أكثر من 22 ساعة في كل اتجاه.',realworld3:'يولد مصادم الهادرونات الكبير في سيرن 1 بيتابايت في الثانية أثناء التصادمات. في عام 2012 أكد بوزون هيغز مكملاً النموذج القياسي للفيزياء.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الراديو الحيوي معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الراديو الحيوي وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',proTipTitle:'💡 نصائح احترافية',proTip1:'تحقق دائمًا من مستوى البطارية قبل العمليات الميدانية. ينتج micro:bit الذي تنفد بطاريته قراءات مستشعر غير موثوقة.',proTip2:'استخدم أرقام مجموعات الراديو فوق 100 لتجنب التداخل مع مستخدمي micro:bit الآخرين. المجموعات الافتراضية 0-10 مزدحمة.',funFactTitle:'🎯 هل تعلم؟',funFact:'يصل البرق إلى درجة حرارة 30,000 درجة مئوية — خمس مرات أسخن من سطح الشمس.',mistakeTitle:'⚠️ أخطاء شائعة',mistake1:'تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.',mistake2:'تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.',peerTitle:'👥 \u0648\u0636\u0639 \u0627\u0644\u0646\u0638\u064a\u0631',peerConnect:'\u0627\u062a\u0635\u0627\u0644',peerDisconnect:'\u0642\u0637\u0639',peerStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0638\u064a\u0631',peerSend:'\u0623\u0631\u0633\u0644',peerReceive:'\u0627\u0633\u062a\u0644\u0645',peerInfo:'\u0627\u0641\u062a\u062d \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0641\u064a \u062a\u0628\u0648\u064a\u0628\u064a\u0646 \u0644\u0644\u0645\u0632\u0627\u0645\u0646\u0629',heatmapTitle:'📅 \u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0646\u0634\u0627\u0637',heatmapToday:'\u0627\u0644\u064a\u0648\u0645',heatmapStreak:'\u0633\u0644\u0633\u0644\u0629',heatmapTotal:'\u0627\u0644\u0645\u062c\u0645\u0648\u0639',heatmapLegend:'\u0623\u0642\u0644 \u2192 \u0623\u0643\u062b\u0631',mistake3:'تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.'}

};

/* ═══════ Difficulty Levels ═══════ */
function initDifficultyLevels(){
  if(document.getElementById('diffToggleBar'))return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='diff_'+appDir;
  var saved=localStorage.getItem(storageKey)||'intermediate';
  /* inject CSS */
  var style=document.createElement('style');
  style.textContent=''
    +'.diff-beginner .sim-controls input[type="range"]:nth-of-type(n+4),.diff-beginner .sim-controls .slider-row:nth-of-type(n+4){display:none !important;}'
    +'.diff-beginner label,.diff-beginner .sidebar-label{font-size:1rem !important;}'
    +'.diff-beginner .card-subtitle{font-size:0.95rem !important;}'
    +'.diff-expert{font-size:0.88rem;}'
    +'.diff-expert .card,.diff-expert .collapsible{padding:0.5rem !important;}'
    +'.diff-expert .card-header{padding:0.4rem 0.5rem !important;}'
    +'.diff-toggle-bar{display:flex;gap:0.4rem;align-items:center;padding:0.4rem 0.6rem;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);margin-bottom:0.5rem;flex-wrap:wrap;}'
    +'.diff-toggle-bar button{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;transition:all 0.2s;}'
    +'.diff-toggle-bar button.active{background:var(--accent,#d4a03c);color:var(--bg,#08091a);font-weight:700;border-color:var(--accent,#d4a03c);}'
    +'.diff-toggle-bar .diff-label{font-size:0.75rem;opacity:0.6;margin-right:0.3rem;}'
    +'#diffExpertData{display:none;margin:0.5rem 0;padding:0.6rem;border-radius:8px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:0.7rem;color:#8f8;max-height:120px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;}'
    +'.diff-expert #diffExpertData{display:block;}';
  document.head.appendChild(style);
  /* build toggle bar */
  var bar=document.createElement('div');
  bar.id='diffToggleBar';
  bar.className='diff-toggle-bar';
  bar.innerHTML='<span class="diff-label" data-i18n="diffTitle">'+(L.diffTitle||'Difficulty')+'</span>'
    +'<button data-diff="beginner" data-i18n="diffBeginner">'+(L.diffBeginner||'🟢 Beginner')+'</button>'
    +'<button data-diff="intermediate" data-i18n="diffIntermediate">'+(L.diffIntermediate||'🟡 Intermediate')+'</button>'
    +'<button data-diff="expert" data-i18n="diffExpert">'+(L.diffExpert||'🔴 Expert')+'</button>'
    +'<span style="font-size:0.65rem;opacity:0.4;margin-left:auto;" data-i18n="diffInfo">'+(L.diffInfo||'Choose your complexity level')+'</span>';
  var header=document.querySelector('.header');
  if(header&&header.parentNode){header.parentNode.insertBefore(bar,header.nextSibling);}
  else{var app=document.querySelector('.app')||document.body;app.insertBefore(bar,app.firstChild);}
  /* expert data readout */
  var expertDiv=document.createElement('div');
  expertDiv.id='diffExpertData';
  var mainCard=document.getElementById('mainCard');
  if(mainCard&&mainCard.parentNode){mainCard.parentNode.insertBefore(expertDiv,mainCard.nextSibling);}
  function setDiff(level){
    document.body.classList.remove('diff-beginner','diff-intermediate','diff-expert');
    document.body.classList.add('diff-'+level);
    bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-diff')===level);});
    localStorage.setItem(storageKey,level);
    if(level==='beginner'){
      var hw=document.querySelector('details.collapsible');
      if(hw&&!hw.open)hw.open=true;
    }
    if(level==='expert'){updateExpertData();}
    else{expertDiv.textContent='';}
  }
  function updateExpertData(){
    if(!document.body.classList.contains('diff-expert'))return;
    var data={};
    document.querySelectorAll('input[type="range"]').forEach(function(s){
      var label=s.previousElementSibling?s.previousElementSibling.textContent:s.id;
      data[label||s.id||'slider']=parseFloat(s.value).toFixed(4);
    });
    document.querySelectorAll('select').forEach(function(s){
      if(s.id!=='langSelect'&&s.id!=='themeSelect'){
        data[s.id||'select']=s.value;
      }
    });
    expertDiv.textContent=JSON.stringify(data,null,2);
  }
  bar.addEventListener('click',function(e){
    var btn=e.target.closest('button[data-diff]');
    if(btn)setDiff(btn.getAttribute('data-diff'));
  });
  setDiff(saved);
  /* update expert readout periodically */
  setInterval(function(){if(document.body.classList.contains('diff-expert'))updateExpertData();},2000);
  /* listen for slider changes */
  document.addEventListener('input',function(e){if(e.target.type==='range'&&document.body.classList.contains('diff-expert'))updateExpertData();});
}

/* ═══════ Spaced Repetition ═══════ */
function initSpacedRepetition(){
  if(document.getElementById('spacedPanel'))return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='spaced_'+appDir;
  var now=Date.now();
  var DAY=86400000;
  /* load or create record */
  var rec;
  try{rec=JSON.parse(localStorage.getItem(storageKey));}catch(e){rec=null;}
  if(!rec){rec={visits:0,lastVisit:0,interval:1,ease:2.5};}
  /* SM-2 inspired update */
  var timeSinceLast=now-rec.lastVisit;
  var intervalMs=rec.interval*DAY;
  if(rec.visits===0){
    rec.interval=1;
  }else if(rec.visits===1){
    rec.interval=3;
  }else{
    if(timeSinceLast<intervalMs*0.5){
      /* visited too early, keep interval */
    }else if(timeSinceLast>intervalMs){
      /* visited late, reduce ease slightly */
      rec.ease=Math.max(1.3,rec.ease-0.15);
      rec.interval=Math.round(rec.interval*rec.ease);
    }else{
      rec.interval=Math.round(rec.interval*rec.ease);
    }
  }
  rec.visits++;
  rec.lastVisit=now;
  localStorage.setItem(storageKey,JSON.stringify(rec));
  /* determine status */
  var nextReviewMs=rec.lastVisit+rec.interval*DAY;
  var status,statusIcon,statusClass;
  if(rec.visits<=1){
    status=L.spacedNew||'New — not yet studied';statusIcon='⚪';statusClass='spaced-new';
  }else if(now>nextReviewMs){
    status=L.spacedDue||'Due for review!';statusIcon='🔴';statusClass='spaced-due';
  }else if(nextReviewMs-now<DAY){
    status=(L.spacedNext||'Next review')+': '+(L.spacedReview||'Review')+' — tomorrow';statusIcon='🟡';statusClass='spaced-soon';
  }else{
    var daysLeft=Math.ceil((nextReviewMs-now)/DAY);
    status=(L.spacedMastered||'Mastered')+' — '+(L.spacedNext||'Next review')+' '+daysLeft+' days';statusIcon='🟢';statusClass='spaced-mastered';
  }
  /* scan other apps for due reviews */
  var totalVisited=0,dueCount=0,masteredCount=0;
  var dueApps=[];
  for(var i=0;i<localStorage.length;i++){
    var key=localStorage.key(i);
    if(key&&key.indexOf('spaced_')===0){
      try{
        var other=JSON.parse(localStorage.getItem(key));
        if(other&&other.visits>0){
          totalVisited++;
          var otherNext=other.lastVisit+other.interval*DAY;
          if(now>otherNext){
            dueCount++;
            dueApps.push(key.replace('spaced_',''));
          }else{
            masteredCount++;
          }
        }
      }catch(e){}
    }
  }
  /* inject CSS */
  var style=document.createElement('style');
  style.textContent=''
    +'#spacedPanel{padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);}'
    +'#spacedPanel h4{margin:0 0 0.4rem;font-size:0.9rem;}'
    +'.spaced-status{display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.85rem;}'
    +'.spaced-status .spaced-icon{font-size:1.1rem;}'
    +'.spaced-summary{display:flex;gap:1rem;flex-wrap:wrap;margin:0.5rem 0;font-size:0.75rem;opacity:0.7;}'
    +'.spaced-summary span{white-space:nowrap;}'
    +'.spaced-due-list{margin-top:0.5rem;font-size:0.75rem;max-height:80px;overflow-y:auto;}'
    +'.spaced-due-list a{color:var(--accent,#d4a03c);text-decoration:none;margin-right:0.5rem;}'
    +'.spaced-due-list a:hover{text-decoration:underline;}'
    +'#spacedMarkBtn{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid var(--accent,#d4a03c);background:rgba(var(--accent-rgb,212,175,55),0.15);color:inherit;cursor:pointer;font-size:0.78rem;margin-top:0.4rem;}'
    +'#spacedMarkBtn:hover{background:rgba(var(--accent-rgb,212,175,55),0.3);}';
  document.head.appendChild(style);
  /* build panel */
  var panel=document.createElement('div');
  panel.id='spacedPanel';
  var dueLinksHtml='';
  if(dueApps.length>0){
    dueLinksHtml='<div class="spaced-due-list"><strong>'+(L.spacedDue||'Due for review!')+'</strong><br>';
    dueApps.slice(0,8).forEach(function(d){
      dueLinksHtml+='<a href="../../'+d+'/index.html" title="'+d+'">'+d+'</a> ';
    });
    if(dueApps.length>8)dueLinksHtml+='<span>... +'+(dueApps.length-8)+' more</span>';
    dueLinksHtml+='</div>';
  }
  panel.innerHTML='<h4 data-i18n="spacedTitle">'+(L.spacedTitle||'📅 Spaced Review')+'</h4>'
    +'<div class="spaced-status"><span class="spaced-icon">'+statusIcon+'</span><span>'+status+'</span></div>'
    +'<div class="spaced-summary">'
    +'<span>📚 '+totalVisited+' visited</span>'
    +'<span>🔴 '+dueCount+' due</span>'
    +'<span>🟢 '+masteredCount+' on track</span>'
    +'</div>'
    +'<button id="spacedMarkBtn" data-i18n="spacedReview">✅ '+(L.spacedReview||'Mark as Reviewed')+'</button>'
    +dueLinksHtml
    +'<div style="font-size:0.65rem;opacity:0.4;margin-top:0.4rem;" data-i18n="spacedInfo">'+(L.spacedInfo||'Smart review reminders based on the forgetting curve')+'</div>';
  /* insert near sidebar footer or after last collapsible */
  var target=document.querySelector('.sidebar-footer');
  if(target&&target.parentNode){
    target.parentNode.insertBefore(panel,target);
  }else{
    var lastDetails=document.querySelectorAll('details.collapsible');
    if(lastDetails.length>0){
      var ld=lastDetails[lastDetails.length-1];
      ld.parentNode.insertBefore(panel,ld.nextSibling);
    }else{
      var app=document.querySelector('.app')||document.body;
      app.appendChild(panel);
    }
  }
  /* mark as reviewed button */
  var markBtn=document.getElementById('spacedMarkBtn');
  if(markBtn){
    markBtn.addEventListener('click',function(){
      rec.lastVisit=Date.now();
      if(rec.visits>=3){
        rec.interval=Math.round(rec.interval*rec.ease);
        rec.ease=Math.min(3.0,rec.ease+0.1);
      }
      localStorage.setItem(storageKey,JSON.stringify(rec));
      markBtn.textContent='✅ '+(L.spacedMastered||'Reviewed!');
      markBtn.disabled=true;
      markBtn.style.opacity='0.5';
    });
  }
}

document.addEventListener('DOMContentLoaded',function(){try{initDifficultyLevels();}catch(e){console.warn('Difficulty init:',e);}try{initSpacedRepetition();}catch(e){console.warn('Spaced init:',e);}});



/* ═══════ Mini Terminal ═══════ */
function initTerminal(){
  if(document.getElementById('miniTerminal')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var visible=false, history=[], histIdx=-1, MAX_LINES=100;
  var wrap=document.createElement('div');wrap.id='miniTerminal';
  wrap.style.cssText='position:fixed;bottom:0;left:0;right:0;height:260px;background:#0a0a0a;border-top:2px solid #0f0;z-index:99999;display:none;flex-direction:column;font-family:monospace;font-size:13px;transition:transform 0.25s ease;transform:translateY(100%);';
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-bottom:1px solid #0f0;color:#0f0;';
  hdr.innerHTML='<span style="flex:1;font-weight:bold;" data-i18n="termTitle">'+(L.termTitle||'>_ Terminal')+'</span><button id="termCloseBtn" style="background:none;border:none;color:#0f0;font-size:18px;cursor:pointer;">\u2715</button>';
  var out=document.createElement('div');out.id='termOutput';out.style.cssText='flex:1;overflow-y:auto;padding:8px 10px;color:#0f0;white-space:pre-wrap;word-break:break-all;';
  var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-top:1px solid #222;';
  row.innerHTML='<span style="color:#0f0;margin-right:6px;">$</span>';
  var inp=document.createElement('input');inp.id='termInput';inp.type='text';inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');inp.placeholder=L.termPlaceholder||'Type a command...';
  inp.style.cssText='flex:1;background:transparent;border:none;outline:none;color:#0f0;font-family:monospace;font-size:13px;caret-color:#0f0;';
  row.appendChild(inp);wrap.appendChild(hdr);wrap.appendChild(out);wrap.appendChild(row);document.body.appendChild(wrap);
  var togBtn=document.createElement('button');togBtn.id='termToggleBtn';togBtn.textContent='>_';togBtn.title='Terminal';
  togBtn.style.cssText='position:fixed;bottom:10px;right:10px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#111;color:#0f0;border:1px solid #0f0;font-family:monospace;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
  togBtn.onmouseenter=function(){this.style.opacity='1';};togBtn.onmouseleave=function(){this.style.opacity='0.7';};
  document.body.appendChild(togBtn);
  function show(){wrap.style.display='flex';setTimeout(function(){wrap.style.transform='translateY(0)';},10);visible=true;inp.focus();}
  function hide(){wrap.style.transform='translateY(100%)';setTimeout(function(){wrap.style.display='none';},260);visible=false;}
  function toggle(){visible?hide():show();}
  togBtn.addEventListener('click',toggle);
  document.getElementById('termCloseBtn').addEventListener('click',hide);
  document.addEventListener('keydown',function(e){if(e.key==='`'&&!e.ctrlKey&&!e.altKey&&document.activeElement!==inp&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();toggle();}});
  function appendLine(txt,color){
    var d=document.createElement('div');d.style.color=color||'#0f0';d.textContent=txt;out.appendChild(d);
    while(out.children.length>MAX_LINES)out.removeChild(out.firstChild);
    out.scrollTop=out.scrollHeight;
  }
  appendLine(L.termWelcome||'Terminal ready. Type help to get started.','#0f0');
  function exec(cmd){
    cmd=cmd.trim();if(!cmd)return;
    history.push(cmd);histIdx=history.length;
    appendLine('> '+cmd,'#888');
    var parts=cmd.split(/\s+/),c=parts[0].toLowerCase(),args=parts.slice(1);
    switch(c){
      case 'help':appendLine(L.termHelp||'Commands: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher','#0f0');break;
      case 'start':if(typeof window.startSim==='function'){window.startSim();appendLine('Simulation started.','#0f0');}else{var sb=document.querySelector('[onclick*="start"]')||document.getElementById('startBtn');if(sb){sb.click();appendLine('Start triggered.','#0f0');}else appendLine('No start function found.','#f44');}break;
      case 'stop':if(typeof window.stopSim==='function'){window.stopSim();appendLine('Simulation stopped.','#0f0');}else{var sb2=document.querySelector('[onclick*="stop"]')||document.getElementById('stopBtn');if(sb2){sb2.click();appendLine('Stop triggered.','#0f0');}else appendLine('No stop function found.','#f44');}break;
      case 'reset':if(typeof window.resetSim==='function'){window.resetSim();appendLine('Simulation reset.','#0f0');}else{var sb3=document.querySelector('[onclick*="reset"]')||document.getElementById('resetBtn');if(sb3){sb3.click();appendLine('Reset triggered.','#0f0');}else appendLine('No reset function found.','#f44');}break;
      case 'theme':if(args[0]&&typeof window.setTheme==='function'){window.setTheme(args[0]);appendLine('Theme set to '+args[0],'#0f0');}else if(!args[0]){appendLine('Usage: theme [name] — mosque, zellige, andalus, riad, medina, space, jungle, robot','#ff0');}else{appendLine('setTheme not available.','#f44');}break;
      case 'lang':if(args[0]&&/^(en|fr|ar)$/.test(args[0])){document.documentElement.lang=args[0];if(typeof window.applyLang==='function')window.applyLang(args[0]);appendLine('Language set to '+args[0],'#0f0');}else{appendLine('Usage: lang [en|fr|ar]','#ff0');}break;
      case 'set':if(args.length>=2){var sliders=document.querySelectorAll('input[type=range]');var found=false;sliders.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){s.value=parseFloat(args[1]);s.dispatchEvent(new Event('input',{bubbles:true}));found=true;appendLine('Set '+args[0]+' = '+args[1],'#0f0');}});if(!found)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: set [param] [value]','#ff0');}break;
      case 'get':if(args[0]){var sliders2=document.querySelectorAll('input[type=range]');var found2=false;sliders2.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){appendLine(args[0]+' = '+s.value,'#0f0');found2=true;}});if(!found2)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: get [param]','#ff0');}break;
      case 'list':var sliders3=document.querySelectorAll('input[type=range]');if(sliders3.length===0){appendLine('No parameters found.','#ff0');}else{sliders3.forEach(function(s){var lbl=(s.previousElementSibling?s.previousElementSibling.textContent:s.parentElement?s.parentElement.textContent:'?').trim().substring(0,40);appendLine('  '+lbl+' = '+s.value,'#0f0');});}break;
      case 'export':if(typeof window.exportLog==='function'){window.exportLog();appendLine('Export triggered.','#0f0');}else{appendLine('No export function available.','#f44');}break;
      case 'clear':out.innerHTML='';break;
      case 'status':var st=document.getElementById('statusText');appendLine('Status: '+(st?st.textContent:'unknown'),'#0f0');var sliders4=document.querySelectorAll('input[type=range]');appendLine('Parameters: '+sliders4.length,'#0f0');appendLine('Language: '+(document.documentElement.lang||'en'),'#0f0');break;
      case 'about':var ti=document.querySelector('[data-i18n="title"]');appendLine('App: '+(ti?ti.textContent:'Unknown'),'#0f0');appendLine('Framework: Vanilla JS + HTML5 Canvas','#0f0');appendLine('Trilingual: EN / FR / AR','#0f0');break;
      case 'cipher':if(typeof window.toggleCipherToolkit==='function'){window.toggleCipherToolkit();appendLine('Cipher toolkit opened.','#0f0');}else{appendLine('Cipher toolkit not available.','#f44');}break;
      default:appendLine(L.termUnknown||'Unknown command. Type help for available commands.','#f44');
    }
  }
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){exec(inp.value);inp.value='';}
    else if(e.key==='ArrowUp'){e.preventDefault();if(histIdx>0){histIdx--;inp.value=history[histIdx];}}
    else if(e.key==='ArrowDown'){e.preventDefault();if(histIdx<history.length-1){histIdx++;inp.value=history[histIdx];}else{histIdx=history.length;inp.value='';}}
  });
}
document.addEventListener('DOMContentLoaded',function(){try{initTerminal();}catch(e){console.warn('Terminal init:',e);}});


/* ═══════ Cipher Toolkit ═══════ */
function initCipherToolkit(){
  if(document.getElementById('cipherModal')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.'  :'.-.-.-',','  :'--..--','?'  :'..--..',' ':' / '};
  var RMORSE={};for(var k in MORSE)RMORSE[MORSE[k]]=k;
  function caesar(t,n,dec){n=parseInt(n)||3;if(dec)n=26-n;return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode((c.charCodeAt(0)-base+n)%26+base);});}
  function xorCipher(t,key){if(!key)key='K';var o='';for(var i=0;i<t.length;i++){o+=String.fromCharCode(t.charCodeAt(i)^key.charCodeAt(i%key.length));}return o;}
  function toMorse(t){return t.toUpperCase().split('').map(function(c){return MORSE[c]||c;}).join(' ');}
  function fromMorse(t){return t.split(' / ').map(function(w){return w.split(' ').map(function(c){return RMORSE[c]||c;}).join('');}).join(' ');}
  function rot13(t){return caesar(t,13,false);}
  function atbash(t){return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode(base+25-(c.charCodeAt(0)-base));});}
  function toBin(t){return t.split('').map(function(c){return ('00000000'+c.charCodeAt(0).toString(2)).slice(-8);}).join(' ');}
  function fromBin(t){return t.trim().split(/\s+/).map(function(b){return String.fromCharCode(parseInt(b,2));}).join('');}
  function encode(t,m,key){switch(m){case 'caesar':return caesar(t,key,false);case 'xor':return btoa(xorCipher(t,key));case 'morse':return toMorse(t);case 'base64':return btoa(unescape(encodeURIComponent(t)));case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return toBin(t);default:return t;}}
  function decode(t,m,key){switch(m){case 'caesar':return caesar(t,key,true);case 'xor':try{return xorCipher(atob(t),key);}catch(e){return 'Invalid input';}case 'morse':return fromMorse(t);case 'base64':try{return decodeURIComponent(escape(atob(t)));}catch(e){return 'Invalid Base64';}case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return fromBin(t);default:return t;}}
  var overlay=document.createElement('div');overlay.id='cipherOverlay';
  overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100000;display:none;align-items:center;justify-content:center;';
  var modal=document.createElement('div');modal.id='cipherModal';
  modal.style.cssText='background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:1.2rem;width:92%;max-width:420px;color:#e8e8e8;font-family:system-ui,sans-serif;max-height:90vh;overflow-y:auto;';
  modal.innerHTML='<div style="display:flex;align-items:center;margin-bottom:0.8rem;"><span style="flex:1;font-weight:bold;font-size:1.05rem;" data-i18n="cipherTitle">'+(L.cipherTitle||'\uD83D\uDD10 Cipher Toolkit')+'</span><button id="cipherCloseBtn" style="background:none;border:none;color:#e8e8e8;font-size:20px;cursor:pointer;">\u2715</button></div>'
    +'<textarea id="cipherIn" rows="3" placeholder="'+(L.cipherInput||'Input text')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;margin-bottom:0.6rem;" data-i18n-placeholder="cipherInput"></textarea>'
    +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;flex-wrap:wrap;">'
    +'<select id="cipherMethod" style="flex:1;min-width:120px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;"><option value="caesar">Caesar</option><option value="xor">XOR</option><option value="morse">Morse</option><option value="base64">Base64</option><option value="rot13">ROT13</option><option value="atbash">Atbash</option><option value="binary">Binary</option></select>'
    +'<input id="cipherKey" type="text" placeholder="'+(L.cipherKey||'Key')+'" value="3" style="width:70px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;" data-i18n-placeholder="cipherKey">'
    +'</div>'
    +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">'
    +'<button id="cipherEncBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,180,80,0.2);color:#0f0;cursor:pointer;font-size:0.85rem;" data-i18n="cipherEncode">'+(L.cipherEncode||'Encode')+'</button>'
    +'<button id="cipherDecBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,120,255,0.2);color:#4af;cursor:pointer;font-size:0.85rem;" data-i18n="cipherDecode">'+(L.cipherDecode||'Decode')+'</button>'
    +'</div>'
    +'<div style="position:relative;"><textarea id="cipherOut" rows="3" readonly placeholder="'+(L.cipherOutput||'Output')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#0f0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;" data-i18n-placeholder="cipherOutput"></textarea>'
    +'<button id="cipherCopyBtn" style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#e8e8e8;cursor:pointer;padding:2px 8px;font-size:0.75rem;" data-i18n="cipherCopy">'+(L.cipherCopy||'Copy')+'</button></div>';
  overlay.appendChild(modal);document.body.appendChild(overlay);
  var cipherBtn=document.createElement('button');cipherBtn.id='cipherToggleBtn';cipherBtn.textContent='\uD83D\uDD10';cipherBtn.title='Cipher';
  cipherBtn.style.cssText='position:fixed;bottom:10px;right:56px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#1a1a2e;color:#e8e8e8;border:1px solid rgba(255,255,255,0.15);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
  cipherBtn.onmouseenter=function(){this.style.opacity='1';};cipherBtn.onmouseleave=function(){this.style.opacity='0.7';};
  document.body.appendChild(cipherBtn);
  function showCipher(){overlay.style.display='flex';}
  function hideCipher(){overlay.style.display='none';}
  window.toggleCipherToolkit=function(){overlay.style.display==='flex'?hideCipher():showCipher();};
  cipherBtn.addEventListener('click',window.toggleCipherToolkit);
  document.getElementById('cipherCloseBtn').addEventListener('click',hideCipher);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hideCipher();});
  document.getElementById('cipherEncBtn').addEventListener('click',function(){
    var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
    document.getElementById('cipherOut').value=encode(t,m,k);
  });
  document.getElementById('cipherDecBtn').addEventListener('click',function(){
    var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
    document.getElementById('cipherOut').value=decode(t,m,k);
  });
  document.getElementById('cipherCopyBtn').addEventListener('click',function(){
    var o=document.getElementById('cipherOut');
    if(navigator.clipboard){navigator.clipboard.writeText(o.value).then(function(){document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);});}
    else{o.select();document.execCommand('copy');document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);}
  });
}
document.addEventListener('DOMContentLoaded',function(){try{initCipherToolkit();}catch(e){console.warn('Cipher init:',e);}});



/* ═══════ Particle Celebrations ═══════ */
function initParticles(){
  if(document.getElementById('particleCanvas')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var canvas=document.createElement('canvas');
  canvas.id='particleCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var particles=[];
  var animId=null;
  var colors=['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#00d2d3'];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  function drawStar(cx,cy,r){ctx.beginPath();for(var i=0;i<5;i++){var a=Math.PI/2+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r);a+=Math.PI/5;ctx.lineTo(cx+Math.cos(a)*r*0.4,cy-Math.sin(a)*r*0.4);}ctx.closePath();ctx.fill();}
  function spawnParticles(x,y,count){
    var n=count||Math.floor(50+Math.random()*30);
    for(var i=0;i<n;i++){
      var angle=Math.random()*Math.PI*2;
      var speed=2+Math.random()*6;
      var shape=Math.floor(Math.random()*3);
      particles.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
        color:colors[Math.floor(Math.random()*colors.length)],
        size:3+Math.random()*5,life:1,decay:0.008+Math.random()*0.012,
        shape:shape,rotation:Math.random()*Math.PI*2,rotSpeed:(Math.random()-0.5)*0.2});
    }
    if(!animId) animate();
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=particles.length-1;i>=0;i--){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.vx*=0.99;p.vy*=0.99;
      p.life-=p.decay;p.rotation+=p.rotSpeed;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=p.life;ctx.fillStyle=p.color;
      ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
      if(p.shape===0){ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}
      else if(p.shape===1){ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);}
      else{drawStar(0,0,p.size);}
      ctx.restore();
    }
    if(particles.length>0){animId=requestAnimationFrame(animate);}
    else{ctx.clearRect(0,0,canvas.width,canvas.height);animId=null;}
  }
  window.triggerCelebration=function(x,y){spawnParticles(x||window.innerWidth/2,y||window.innerHeight/2);};
  window.triggerFireworks=function(){
    for(var i=0;i<3;i++){
      (function(idx){setTimeout(function(){
        spawnParticles(100+Math.random()*(window.innerWidth-200),100+Math.random()*(window.innerHeight-300),70);
      },idx*400);})(i);
    }
  };
  /* Hook into achievement system */
  var origDispatch=window.dispatchEvent;
  window.addEventListener('achievement-unlocked',function(e){
    var rect=document.body.getBoundingClientRect();
    window.triggerCelebration(rect.width/2,rect.height/3);
  });
  /* Hook into quiz/challenge completion */
  document.addEventListener('click',function(e){
    var btn=e.target;
    if(!btn)return;
    var txt=(btn.textContent||'').toLowerCase();
    var idn=(btn.id||'').toLowerCase();
    /* Challenge reveal */
    if(idn.indexOf('reveal')>=0||idn.indexOf('answer')>=0||txt.indexOf('reveal')>=0){
      var r=btn.getBoundingClientRect();
      spawnParticles(r.left+r.width/2,r.top+r.height/2,30);
    }
    /* Quiz submit - check score after small delay */
    if(idn.indexOf('quiz')>=0&&(idn.indexOf('submit')>=0||txt.indexOf('submit')>=0)){
      setTimeout(function(){
        var scoreEl=document.querySelector('[id*="quizScore"]')||document.querySelector('[id*="score"]');
        if(scoreEl){
          var m=scoreEl.textContent.match(/(\d+)\s*[%\/]/);
          if(m){var pct=parseInt(m[1]);if(pct>60){window.triggerFireworks();}}
        }
      },500);
    }
    /* Daily challenge complete */
    if(idn.indexOf('daily')>=0&&(idn.indexOf('complete')>=0||idn.indexOf('done')>=0||txt.indexOf('complete')>=0)){
      window.triggerFireworks();
    }
  });
}

/* ═══════ Comparison Mode ═══════ */
function initComparisonMode(){
  if(document.getElementById('comparePanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appKey='compare_'+window.location.pathname.replace(/[^a-z0-9]/gi,'_');
  var saved=JSON.parse(localStorage.getItem(appKey)||'{"a":null,"b":null}');
  function getSliders(){
    var sliders=document.querySelectorAll('input[type="range"]');
    var data=[];
    sliders.forEach(function(s){
      var label='';
      var prev=s.previousElementSibling;
      if(prev&&(prev.tagName==='LABEL'||prev.tagName==='SPAN')){label=prev.textContent.trim();}
      if(!label){var lbl=s.closest('label');if(lbl){label=lbl.textContent.replace(/[\d.]+/g,'').trim();}}
      if(!label){var par=s.parentElement;if(par){var sp=par.querySelector('label,span,.label');if(sp)label=sp.textContent.trim();}}
      if(!label) label=s.id||s.name||('slider-'+data.length);
      data.push({id:s.id||('s'+data.length),label:label,value:parseFloat(s.value),min:parseFloat(s.min||0),max:parseFloat(s.max||100)});
    });
    return data;
  }
  function setSliders(data){
    if(!data)return;
    var sliders=document.querySelectorAll('input[type="range"]');
    data.forEach(function(d,i){
      if(sliders[i]){sliders[i].value=d.value;sliders[i].dispatchEvent(new Event('input',{bubbles:true}));}
    });
  }
  function buildTable(){
    if(!saved.a&&!saved.b) return '<div style="opacity:0.5;font-size:0.8rem;padding:0.5rem;">Save experiments to A and B slots to compare.</div>';
    var html='<table style="width:100%;border-collapse:collapse;font-size:0.78rem;margin-top:0.5rem;">';
    html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.15);"><th style="text-align:left;padding:4px;">Parameter</th>';
    html+='<th style="padding:4px;">'+(L.compareSlotA||'Exp A')+'</th>';
    html+='<th style="padding:4px;">'+(L.compareSlotB||'Exp B')+'</th>';
    html+='<th style="padding:4px;">\u0394 Change</th></tr>';
    var rows=saved.a||saved.b;
    if(rows){rows.forEach(function(r,i){
      var a=saved.a?saved.a[i]:null;
      var b=saved.b?saved.b[i]:null;
      var va=a?a.value:'-';var vb=b?b.value:'-';
      var delta='';var clr='rgba(255,255,255,0.5)';
      if(a&&b){
        var diff=b.value-a.value;
        if(a.value!==0){var pct=Math.round((diff/a.value)*100);delta=(diff>0?'+':'')+pct+'%';
          if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';else{clr='rgba(255,255,255,0.4)';delta='0%';}
        }else{delta=diff>0?'+'+diff.toFixed(1):diff.toFixed(1);if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';}
      }
      html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">';
      html+='<td style="padding:3px 4px;opacity:0.85;">'+(a?a.label:(b?b.label:''))+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;">'+(typeof va==='number'?va.toFixed(1):va)+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;">'+(typeof vb==='number'?vb.toFixed(1):vb)+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;color:'+clr+';font-weight:600;">'+delta+'</td></tr>';
    });}
    html+='</table>';return html;
  }
  function persist(){localStorage.setItem(appKey,JSON.stringify(saved));}
  /* Build UI */
  var panel=document.createElement('div');
  panel.id='comparePanel';
  panel.style.cssText='display:none;padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="font-weight:600;margin-bottom:0.5rem;" data-i18n="compareTitle">'+(L.compareTitle||'\xf0\x9f\x93\x8a Compare')+'</div>'
    +'<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;">'
    +'<button id="compareSaveA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(54,160,255,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' A</button>'
    +'<button id="compareSaveB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,107,107,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' B</button>'
    +'<button id="compareLoadA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' A</button>'
    +'<button id="compareLoadB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' B</button>'
    +'<button id="compareClear" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareClear">'+(L.compareClear||'Clear')+'</button>'
    +'</div>'
    +'<div id="compareTable"></div>';
  var toggleBtn=document.createElement('button');
  toggleBtn.id='compareToggleBtn';
  toggleBtn.style.cssText='padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;margin:0.3rem 0;';
  toggleBtn.setAttribute('data-i18n','compareTitle');
  toggleBtn.textContent=L.compareTitle||'\xf0\x9f\x93\x8a Compare';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(toggleBtn,target.nextSibling);toggleBtn.parentNode.insertBefore(panel,toggleBtn.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc){fc.appendChild(toggleBtn);fc.appendChild(panel);}}
  toggleBtn.addEventListener('click',function(){
    var v=panel.style.display;panel.style.display=v==='none'?'block':'none';
    if(v==='none'){document.getElementById('compareTable').innerHTML=buildTable();}
  });
  document.getElementById('compareSaveA').addEventListener('click',function(){saved.a=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
  document.getElementById('compareSaveB').addEventListener('click',function(){saved.b=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
  document.getElementById('compareLoadA').addEventListener('click',function(){setSliders(saved.a);});
  document.getElementById('compareLoadB').addEventListener('click',function(){setSliders(saved.b);});
  document.getElementById('compareClear').addEventListener('click',function(){saved={a:null,b:null};persist();document.getElementById('compareTable').innerHTML=buildTable();});
}
document.addEventListener('DOMContentLoaded',function(){try{initParticles();}catch(e){console.warn('Particles init:',e);}try{initComparisonMode();}catch(e){console.warn('Compare init:',e);}});








/* ═══════ LAB NOTEBOOK ═══════ */
function initLabNotebook(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.labTitle)return;var _labLog=[];var _labStart=Date.now();var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey=appDir+'_labLog';var btnGen=document.getElementById('labGenBtn');var btnExp=document.getElementById('labExpBtn');if(!btnGen)return;document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var prevVal=inp.value;inp.addEventListener('input',function(){_labLog.push({t:Date.now()-_labStart,param:inp.id||inp.name||'slider',oldVal:prevVal,newVal:inp.value});prevVal=inp.value;});});function genReport(){var title=document.title||appDir;var dur=Math.round((Date.now()-_labStart)/1000);var mins=Math.floor(dur/60);var secs=dur%60;var paramCounts={};var paramMins={};var paramMaxs={};_labLog.forEach(function(e){if(!paramCounts[e.param])paramCounts[e.param]=0;paramCounts[e.param]++;var v=parseFloat(e.newVal);if(!isNaN(v)){if(paramMins[e.param]===undefined||v<paramMins[e.param])paramMins[e.param]=v;if(paramMaxs[e.param]===undefined||v>paramMaxs[e.param])paramMaxs[e.param]=v;}});var params=Object.keys(paramCounts);var totalAdj=_labLog.length;var mostMod=params.length?params.reduce(function(a,b){return paramCounts[a]>paramCounts[b]?a:b;}):'-';var allSliders=document.querySelectorAll('input[type="range"],input[type="number"]');var coverage=allSliders.length?Math.round(params.length/allSliders.length*100):0;var obs='';params.forEach(function(p){obs+='  - '+p+': changed '+paramCounts[p]+' times';if(paramMins[p]!==undefined)obs+=', range '+paramMins[p]+'\u2192'+paramMaxs[p];obs+='\n';});var report='\u2550\u2550\u2550 LAB NOTEBOOK \u2550\u2550\u2550\n'+'App: '+title+'\n'+'Date: '+new Date().toISOString().slice(0,10)+'\n'+'Duration: '+mins+'m '+secs+'s\n\n'+L.labHypothesis+'\n"Changing '+mostMod+' affects '+title+' behavior"\n\n'+L.labMethod+'\nParameters tested: '+params.join(', ')+'\nTotal adjustments: '+totalAdj+'\n\n'+L.labObservation+'\n'+obs+'\n'+L.labConclusion+'\nMost sensitive parameter: '+mostMod+'\nExploration coverage: '+coverage+'%\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n';return report;}btnGen.onclick=function(){var report=genReport();var box=document.getElementById('labReportBox');if(box){box.textContent=report;box.style.display='block';}try{localStorage.setItem(storageKey,JSON.stringify({date:new Date().toISOString(),log:_labLog}));}catch(e){}if(typeof playSound==='function')playSound('success');};btnExp.onclick=function(){var report=genReport();var blob=new Blob([report],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=appDir+'-lab-report.txt';a.click();URL.revokeObjectURL(a.href);};}

/* ═══════ DATA RECORDER ═══════ */
function initDataRecorder(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.recorderTitle)return;var recBtn=document.getElementById('recStartBtn');var clearBtn=document.getElementById('recClearBtn');var expBtn=document.getElementById('recExpBtn');var recCanvas=document.getElementById('recCanvas');var recStatus=document.getElementById('recStatus');if(!recBtn||!recCanvas)return;var ctx=recCanvas.getContext('2d');var recording=false;var recData=[];var recTimer=null;var maxPts=500;function sampleValues(){var vals={};document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var k=inp.id||inp.name||'v'+Math.random().toString(36).slice(2,5);vals[k]=parseFloat(inp.value)||0;});document.querySelectorAll('[id]').forEach(function(el){if(el.tagName==='INPUT')return;var txt=el.textContent;var m=txt.match(/[\d]+\.?[\d]*/);if(m&&txt.length<20&&el.id)vals['_'+el.id]=parseFloat(m[0]);});return vals;}function drawGraph(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);if(recData.length<2)return;var keys=Object.keys(recData[0].values);var firstKey=keys[0];if(!firstKey)return;var vals=recData.map(function(d){return d.values[firstKey]||0;});var mn=Math.min.apply(null,vals);var mx=Math.max.apply(null,vals);if(mn===mx){mn-=1;mx+=1;}var w=recCanvas.width;var h=recCanvas.height;var pad=4;ctx.strokeStyle='#33ff88';ctx.lineWidth=1.5;ctx.beginPath();for(var i=0;i<vals.length;i++){var x=pad+(w-2*pad)*(i/(vals.length-1));var y=h-pad-(h-2*pad)*((vals[i]-mn)/(mx-mn));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#33ff8840';ctx.lineTo(w-pad,h-pad);ctx.lineTo(pad,h-pad);ctx.fill();}var rafId=null;function animLoop(){drawGraph();if(recording)rafId=requestAnimationFrame(animLoop);}recBtn.onclick=function(){if(!recording){recording=true;recBtn.textContent=L.recorderStop;recBtn.style.background='rgba(255,60,60,0.2)';recTimer=setInterval(function(){if(recData.length>=maxPts){clearInterval(recTimer);recording=false;recBtn.textContent=L.recorderStart;recBtn.style.background='';return;}recData.push({time:Date.now(),values:sampleValues()});recStatus.textContent=(L.recorderTitle||'Recording')+': '+recData.length+' '+(L.recorderPoints||'pts');},500);rafId=requestAnimationFrame(animLoop);}else{recording=false;clearInterval(recTimer);if(rafId)cancelAnimationFrame(rafId);recBtn.textContent=L.recorderStart;recBtn.style.background='';drawGraph();}};clearBtn.onclick=function(){recData=[];recStatus.textContent='';ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);};expBtn.onclick=function(){if(!recData.length)return;var keys=Object.keys(recData[0].values);var header='time,'+keys.join(',')+'\n';var rows=recData.map(function(d){return d.time+','+keys.map(function(k){return d.values[k]||0;}).join(',');}).join('\n');var csv=header+rows;var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';a.download=appDir+'-recording.csv';a.click();URL.revokeObjectURL(a.href);};drawGraph();}

document.addEventListener('DOMContentLoaded',function(){initLabNotebook();initDataRecorder();});



/* ═══════ MISSION BRIEFING ═══════ */

/* Layout fix: secondary panels hidden by default */
(function(){
  var s=document.createElement('style');
  s.textContent=`
    .secondary-panel{display:none;margin:8px 0;padding:10px;border-radius:8px;background:var(--card-bg,#1a1a2e);border:1px solid rgba(255,255,255,0.1)}
    .secondary-panel.visible{display:block}
    .panel-toggle{cursor:pointer;padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:inherit;font-size:12px;margin:2px}
    .panel-toggle.active{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.4)}
    .tools-bar{display:flex;flex-wrap:wrap;gap:4px;padding:6px;margin:4px 0;border-radius:6px;background:rgba(0,0,0,0.2)}
  `;
  document.head.appendChild(s);
})();

function initMissionBriefing(){var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var ssKey='mission_seen_'+appDir;if(sessionStorage.getItem(ssKey))return;sessionStorage.setItem(ssKey,'1');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var overlay=document.createElement('div');overlay.id='missionOverlay';overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:monospace;color:#00ff41;overflow:hidden;';var stamp=document.createElement('div');stamp.textContent=L.missionClassified||'CLASSIFIED';stamp.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(3) rotate(-15deg);font-size:4rem;font-weight:bold;color:#ff0000;opacity:0;animation:stampIn 0.6s ease-out 0.3s forwards;pointer-events:none;text-transform:uppercase;letter-spacing:0.3em;';overlay.appendChild(stamp);var box=document.createElement('div');box.style.cssText='max-width:600px;padding:2rem;text-align:center;opacity:0;transition:opacity 0.5s;';var titleEl=document.createElement('h2');titleEl.textContent=L.missionTitle||'MISSION BRIEFING';titleEl.style.cssText='color:#00ff41;font-size:1.5rem;margin-bottom:1rem;letter-spacing:0.2em;text-transform:uppercase;';box.appendChild(titleEl);var objLabel=document.createElement('div');objLabel.textContent=L.missionObjective||'Your mission objective:';objLabel.style.cssText='color:#00aa30;font-size:0.9rem;margin-bottom:0.5rem;';box.appendChild(objLabel);var typewriter=document.createElement('div');typewriter.style.cssText='color:#00ff41;font-size:1.1rem;min-height:3rem;line-height:1.6;text-align:left;border-left:2px solid #00ff41;padding-left:1rem;margin:1rem 0;';box.appendChild(typewriter);var agentEl=document.createElement('div');agentEl.textContent=L.missionAgent||'AGENT-000000';agentEl.style.cssText='color:#ffaa00;font-size:1.2rem;margin:1rem 0;letter-spacing:0.15em;';box.appendChild(agentEl);var goBtn=document.createElement('button');goBtn.textContent=L.missionGo||'ACCEPT MISSION';goBtn.style.cssText='background:#00ff41;color:#000;border:none;padding:0.8rem 2rem;font-size:1rem;font-family:monospace;font-weight:bold;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-top:1rem;';goBtn.onmouseover=function(){this.style.background='#00cc33';};goBtn.onmouseout=function(){this.style.background='#00ff41';};goBtn.onclick=function(){dismiss();};box.appendChild(goBtn);overlay.appendChild(box);var skipEl=document.createElement('div');skipEl.textContent=L.missionSkip||'Skip';skipEl.style.cssText='position:absolute;top:1rem;right:1.5rem;color:#555;font-size:0.8rem;cursor:pointer;';skipEl.onclick=function(){dismiss();};overlay.appendChild(skipEl);var styleEl=document.createElement('style');styleEl.textContent='@keyframes stampIn{from{transform:translate(-50%,-50%) scale(3) rotate(-15deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(-12deg);opacity:0.8}}';document.head.appendChild(styleEl);document.body.appendChild(overlay);var missionText=L.mission_obj||'Complete all objectives.';var charIdx=0;setTimeout(function(){stamp.style.opacity='0';stamp.style.transition='opacity 0.5s';setTimeout(function(){stamp.style.display='none';},500);box.style.opacity='1';var iv=setInterval(function(){if(charIdx<missionText.length){typewriter.textContent+=missionText[charIdx];charIdx++;}else{clearInterval(iv);}},30);},1500);var autoTimer=setTimeout(function(){dismiss();},15000);function dismiss(){clearTimeout(autoTimer);if(overlay.parentNode){overlay.style.opacity='0';overlay.style.transition='opacity 0.4s';setTimeout(function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);},400);}}}
try{document.addEventListener('DOMContentLoaded',function(){initMissionBriefing();});}catch(e){}

/* ═══════ NIGHT VISION MODE ═══════ */
function initNightVision(){var nvStyle=document.createElement('style');nvStyle.textContent='.night-vision{filter:hue-rotate(80deg) saturate(1.5);background:#001100 !important;}.night-vision *{color:#00ff41 !important;border-color:#00ff4133 !important;}.night-vision::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(0,255,65,0.03) 0px,rgba(0,255,65,0.03) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:99998;}.night-vision .card,.night-vision .sidebar{background:#001a00 !important;}';document.head.appendChild(nvStyle);var hour=new Date().getHours();var stored=localStorage.getItem('nightVisionPref');var active=stored!==null?(stored==='on'):(hour>=20||hour<6);if(active)document.body.classList.add('night-vision');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var btn=document.createElement('button');btn.className='btn-sm';btn.textContent='\uD83C\uDF19 NV';btn.title=L.nightVisionTitle||'Night Vision Mode';btn.style.cssText='margin-left:0.3rem;font-size:0.75rem;padding:0.2rem 0.5rem;cursor:pointer;';btn.onclick=function(){var isOn=document.body.classList.toggle('night-vision');localStorage.setItem('nightVisionPref',isOn?'on':'off');};var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');if(hdr){hdr.appendChild(btn);}else{btn.style.cssText+='position:fixed;top:0.5rem;right:0.5rem;z-index:9999;';document.body.appendChild(btn);}}
try{initNightVision();}catch(e){}

/* ═══════ DAILY CHALLENGE ═══════ */
function initDailyChallenge(){const L=LANG[document.documentElement.lang||'en'];const dc=document.getElementById('dailyChallenge');if(!dc||!L.dailyTitle)return;const dayIndex=new Date().getDay();const challengeKey='daily_d'+(dayIndex===0?7:dayIndex);const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const streakKey=appDir+'_streak';let streak=parseInt(localStorage.getItem(streakKey)||'0');const lastDate=localStorage.getItem(streakKey+'_date')||'';const today=new Date().toDateString();dc.innerHTML='<h3 data-i18n="dailyTitle">'+L.dailyTitle+'</h3>'+'<p style="font-size:0.95rem;margin:0.5rem 0;" data-i18n="'+challengeKey+'">'+(L[challengeKey]||'Complete today\x27s challenge!')+'</p>'+'<button class="btn-sm" id="dailyHintBtn" style="margin:0.3rem 0;" data-i18n="dailyHint">'+L.dailyHint+'</button>'+'<p id="dailyHintText" style="display:none;font-size:0.8rem;opacity:0.7;margin:0.3rem 0;">Think step by step. Break the problem into smaller parts.</p>'+'<div style="margin:0.5rem 0;font-size:1.1rem;">\ud83d\udd25 <span data-i18n="dailyStreak">'+L.dailyStreak+'</span>: <strong id="streakCount">'+streak+'</strong></div>'+'<button class="btn-sm" id="dailyCompleteBtn" data-i18n="dailyComplete">'+L.dailyComplete+'</button>';document.getElementById('dailyHintBtn').onclick=function(){const h=document.getElementById('dailyHintText');h.style.display=h.style.display==='none'?'block':'none';};document.getElementById('dailyCompleteBtn').onclick=function(){if(lastDate===today)return;streak++;localStorage.setItem(streakKey,streak);localStorage.setItem(streakKey+'_date',today);document.getElementById('streakCount').textContent=streak;this.textContent='\u2705';this.disabled=true;if(typeof playSound==='function')playSound('success');};}

/* ═══════ MENTOR MODE ═══════ */
function initMentorMode(){const L=LANG[document.documentElement.lang||'en'];const ov=document.getElementById('mentorOverlay');if(!ov||!L.mentorTitle)return;let step=0;const total=5;const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const doneKey=appDir+'_mentor_done';function renderStep(){const s=L['mentor_s'+(step+1)]||'Step '+(step+1);ov.innerHTML='<div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9998;" id="mentorBg"></div>'+'<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--card-bg,#1a1a2e);border:2px solid var(--accent,#d4af37);border-radius:12px;padding:1.5rem;max-width:400px;width:90%;text-align:center;color:var(--text,#fff);">'+'<h3 data-i18n="mentorTitle">'+L.mentorTitle+'</h3>'+'<p style="font-size:0.8rem;opacity:0.6;margin:0.3rem 0;">'+(L.mentorStep||'Step')+' '+(step+1)+'/'+total+'</p>'+'<p style="font-size:0.95rem;line-height:1.5;margin:1rem 0;" data-i18n="mentor_s'+(step+1)+'">'+s+'</p>'+'<div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;">'+(step>0?'<button class="btn-sm" id="mentorPrevBtn" data-i18n="mentorPrev">'+(L.mentorPrev||'Previous')+'</button>':'')+(step<total-1?'<button class="btn-sm" id="mentorNextBtn" data-i18n="mentorNext">'+(L.mentorNext||'Next')+'</button>':'<button class="btn-sm" id="mentorDoneBtn" data-i18n="mentorDone">'+(L.mentorDone||'Finish')+'</button>')+'</div></div>';var bg=document.getElementById('mentorBg');if(bg)bg.onclick=closeMentor;if(document.getElementById('mentorPrevBtn'))document.getElementById('mentorPrevBtn').onclick=function(){step--;renderStep();};if(document.getElementById('mentorNextBtn'))document.getElementById('mentorNextBtn').onclick=function(){step++;renderStep();};if(document.getElementById('mentorDoneBtn'))document.getElementById('mentorDoneBtn').onclick=closeMentor;}function closeMentor(){ov.innerHTML='';ov.style.display='none';localStorage.setItem(doneKey,'1');}var tb=document.getElementById('mentorTriggerBtn');if(tb)tb.onclick=function(){step=0;ov.style.display='block';renderStep();};}

document.addEventListener('DOMContentLoaded',function(){initDailyChallenge();initMentorMode();});


/* ═══════ Voice Command Engine ═══════ */
function initVoiceControl(){
  if(document.getElementById('voiceBtn'))return;
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR)return;
  var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var btn=document.createElement('button');
  btn.className='voice-btn';btn.id='voiceBtn';
  btn.setAttribute('data-i18n','voiceTitle');
  btn.textContent=lang.voiceTitle||'\ud83c\udfa4 Voice';
  btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  var ind=document.createElement('div');
  ind.className='voice-indicator';ind.id='voiceIndicator';
  ind.style.cssText='display:none;position:fixed;top:10px;right:10px;width:12px;height:12px;background:red;border-radius:50%;z-index:9999;';
  document.body.appendChild(ind);
  var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
  if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
  var recognition=new SR();
  recognition.continuous=true;recognition.interimResults=false;
  recognition.lang=document.documentElement.lang==='fr'?'fr-FR':document.documentElement.lang==='ar'?'ar-SA':'en-US';
  var active=false,silenceTimer=null;
  function stopListening(){
    active=false;recognition.stop();ind.style.display='none';
    btn.textContent=lang.voiceOff||'\ud83c\udfa4 Voice OFF';
    if(silenceTimer)clearTimeout(silenceTimer);
  }
  function startListening(){
    active=true;recognition.start();ind.style.display='block';
    ind.style.animation='voicePulse 1s infinite';
    btn.textContent=lang.voiceListening||'\ud83c\udfa4 Listening...';
    resetSilenceTimer();
  }
  function resetSilenceTimer(){
    if(silenceTimer)clearTimeout(silenceTimer);
    silenceTimer=setTimeout(function(){stopListening();},30000);
  }
  if(!document.getElementById('voicePulseStyle')){
    var st=document.createElement('style');st.id='voicePulseStyle';
    st.textContent='@keyframes voicePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}';
    document.head.appendChild(st);
  }
  var cmdMap={
    'start':function(){var b=document.getElementById('startBtn')||document.querySelector('[data-action=start]');if(b)b.click();},
    'stop':function(){var b=document.getElementById('stopBtn')||document.querySelector('[data-action=stop]');if(b)b.click();},
    'reset':function(){var b=document.getElementById('resetBtn')||document.querySelector('[data-action=reset]');if(b)b.click();},
    'help':function(){var b=document.getElementById('helpBtn');if(b)b.click();},
    'theme':function(){var b=document.getElementById('settingsBtn');if(b)b.click();},
    'next':function(){var a=document.getElementById('pathNextLink');if(a&&a.href)location.href=a.href;},
    'previous':function(){var a=document.getElementById('pathPrevLink');if(a&&a.href)location.href=a.href;},
    'd\xe9marrer':function(){cmdMap['start']();},
    'arr\xeater':function(){cmdMap['stop']();},
    'aide':function(){cmdMap['help']();},
    '\u0627\u0628\u062f\u0623':function(){cmdMap['start']();},
    '\u062a\u0648\u0642\u0641':function(){cmdMap['stop']();}
  };
  recognition.onresult=function(e){
    resetSilenceTimer();
    for(var i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal){
        var t=e.results[i][0].transcript.trim().toLowerCase();
        for(var c in cmdMap){if(t.indexOf(c)!==-1){cmdMap[c]();break;}}
      }
    }
  };
  recognition.onerror=function(){if(active)try{recognition.start();}catch(x){}};
  recognition.onend=function(){if(active)try{recognition.start();}catch(x){}};
  btn.addEventListener('click',function(){if(active)stopListening();else startListening();});
}
try{initVoiceControl();}catch(e){}

/* ═══════ Share Results Engine ═══════ */
function initShareSystem(){
  if(document.getElementById('shareBtn'))return;
  var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var btn=document.createElement('button');
  btn.className='share-btn';btn.id='shareBtn';
  btn.setAttribute('data-i18n','shareBtn');
  btn.textContent=lang.shareBtn||'\ud83d\udce4 Share';
  btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
  if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
  var expBtn=document.createElement('button');
  expBtn.className='share-btn';expBtn.id='shareExportBtn';
  expBtn.setAttribute('data-i18n','shareExport');
  expBtn.textContent=lang.shareExport||'\ud83d\udce4 Export JSON';
  expBtn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  if(tgt)tgt.appendChild(expBtn);else document.body.appendChild(expBtn);
  function gatherState(){
    var title=document.querySelector('h1')&&document.querySelector('h1').textContent||'Experiment';
    var params=[];
    document.querySelectorAll('input[type=range]').forEach(function(s){
      var lbl=s.previousElementSibling&&s.previousElementSibling.textContent||s.id||'param';
      params.push(lbl.trim()+': '+s.value);
    });
    var dot=document.getElementById('statusDot');
    var status=dot&&dot.classList.contains('active')?'Running':'Stopped';
    return{title:title,params:params,status:status};
  }
  function buildCard(st){
    var lines=['\ud83d\udd2c '+st.title+' \u2014 Experiment Results',
      '\u2501'.repeat(20),
      'Parameters: '+(st.params.length?st.params.join(' | '):'default'),
      'Status: '+st.status,
      '\u2501'.repeat(20),
      'Generated by Workshop-DIY'];
    return lines.join('\n');
  }
  function copyText(txt){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(function(){showToast(lang.shareCopied||'Copied!');}).catch(function(){fallbackCopy(txt);});
    }else{fallbackCopy(txt);}
  }
  function fallbackCopy(txt){
    var ta=document.createElement('textarea');ta.value=txt;
    ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);
    ta.select();try{document.execCommand('copy');showToast(lang.shareCopied||'Copied!');}catch(e){}
    document.body.removeChild(ta);
  }
  function showToast(msg){
    var t=document.getElementById('toastMessage');
    if(t){t.textContent=msg;var p=t.parentElement&&t.parentElement.parentElement;if(p)p.classList.add('show');setTimeout(function(){if(p)p.classList.remove('show');},2000);}
  }
  btn.addEventListener('click',function(){
    var st=gatherState();var card=buildCard(st);copyText(card);
  });
  expBtn.addEventListener('click',function(){
    var st=gatherState();
    var logs=[];
    var logEl=document.getElementById('logContainer');
    if(logEl)logEl.querySelectorAll('.log-entry,.log-line').forEach(function(e){logs.push(e.textContent);});
    var data={title:st.title,params:st.params,status:st.status,logs:logs,exported:new Date().toISOString()};
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=(st.title.replace(/[^a-z0-9]/gi,'_')||'export')+'_data.json';
    a.click();URL.revokeObjectURL(a.href);
  });
}
try{initShareSystem();}catch(e){}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
  if(document.getElementById('sonifyPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var panel=document.createElement('div');
  panel.id='sonifyPanel';
  panel.className='sonify-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
    +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
    +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
    +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
    +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
    +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
    +'</div>'
    +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
    +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
  var actx=null,osc=null,gain=null,analyser=null,running=false;
  var toggle=document.getElementById('sonifyToggle');
  var status=document.getElementById('sonifyStatus');
  var freqDisp=document.getElementById('sonifyFreqDisp');
  var volSlider=document.getElementById('sonifyVolSlider');
  var wCanvas=document.getElementById('sonifyWaveCanvas');
  var wCtx=wCanvas.getContext('2d');
  function startAudio(){
    if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
    if(actx.state==='suspended'){actx.resume();}
    analyser=actx.createAnalyser();analyser.fftSize=256;
    osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
    gain=actx.createGain();gain.gain.value=volSlider.value/300;
    osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
    osc.start();running=true;drawWave();
  }
  function stopAudio(){
    running=false;
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    try{if(analyser){analyser.disconnect();}}catch(e){}
    osc=null;gain=null;analyser=null;
    wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
  }
  function drawWave(){
    if(!running||!analyser)return;
    var buf=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);
    wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
    wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
    wCtx.beginPath();
    var sl=wCanvas.width/buf.length;var x=0;
    for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
    wCtx.stroke();requestAnimationFrame(drawWave);
  }
  function mapData(){
    var c=document.getElementById('simCanvas');
    if(!c)return 440;
    try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
  }
  var sonifyInterval=null;
  toggle.addEventListener('click',function(){
    if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
      status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
    }else{startAudio();
      sonifyInterval=setInterval(function(){
        if(!running||!osc)return;
        var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
        freqDisp.textContent=Math.round(f)+' Hz';
        if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
      },100);
      status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
    }
  });
  volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

/* ═══════ Smart Tooltips ═══════ */
function initTooltips(){
  if(document.getElementById('tooltipFloat')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var tipMap={};
  var allBtns=document.querySelectorAll('button');
  allBtns.forEach(function(b){
    var txt=(b.textContent||'').toLowerCase().trim();
    if(txt.indexOf('start')>-1||txt.indexOf('lancer')>-1||txt.indexOf('\u0627\u0628\u062f\u0623')>-1) tipMap[b.id||Math.random()]=L.tip_start||'Start the simulation';
    else if(txt.indexOf('stop')>-1||txt.indexOf('arr')>-1||txt.indexOf('\u0623\u0648\u0642\u0641')>-1) tipMap[b.id||Math.random()]=L.tip_stop||'Stop the simulation';
    else if(txt.indexOf('reset')>-1||txt.indexOf('effac')>-1||txt.indexOf('\u0627\u0645\u0633\u062d')>-1) tipMap[b.id||Math.random()]=L.tip_reset||'Reset to defaults';
    else if(txt.indexOf('theme')>-1||txt.indexOf('th\u00e8me')>-1||txt.indexOf('\u0627\u0644\u0645\u0638\u0647\u0631')>-1) tipMap[b.id||Math.random()]=L.tip_theme||'Change theme';
    else if(txt.indexOf('help')>-1||txt.indexOf('aide')>-1||txt.indexOf('\u0645\u0633\u0627\u0639\u062f')>-1) tipMap[b.id||Math.random()]=L.tip_help||'Open help';
  });
  var floatDiv=document.createElement('div');
  floatDiv.className='tooltip-float';
  floatDiv.id='tooltipFloat';
  floatDiv.style.cssText='display:none;position:fixed;z-index:9999;background:#1a1a2e;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;max-width:250px;pointer-events:none;transition:opacity 0.2s;opacity:0;';
  document.body.appendChild(floatDiv);
  var tooltipsEnabled=true;
  function showTip(e,text){
    if(!tooltipsEnabled) return;
    floatDiv.textContent=text;
    floatDiv.style.display='block';
    setTimeout(function(){floatDiv.style.opacity='1';},10);
    moveTip(e);
  }
  function moveTip(e){
    var isRTL=document.documentElement.dir==='rtl';
    var x=e.clientX,y=e.clientY;
    if(isRTL){
      floatDiv.style.left='';
      floatDiv.style.right=(window.innerWidth-x+12)+'px';
    } else {
      floatDiv.style.right='';
      floatDiv.style.left=(x+12)+'px';
    }
    floatDiv.style.top=(y+12)+'px';
  }
  function hideTip(){
    floatDiv.style.opacity='0';
    setTimeout(function(){floatDiv.style.display='none';},200);
  }
  allBtns.forEach(function(b){
    var key=b.id||Math.random();
    if(tipMap[key]){
      b.addEventListener('mouseenter',function(e){showTip(e,tipMap[key]);});
      b.addEventListener('mousemove',moveTip);
      b.addEventListener('mouseleave',hideTip);
    }
  });
  var sliders=document.querySelectorAll('input[type="range"]');
  sliders.forEach(function(s){
    var tipText=L.tip_slider||'Drag to adjust this parameter';
    s.addEventListener('mouseenter',function(e){showTip(e,tipText);});
    s.addEventListener('mousemove',moveTip);
    s.addEventListener('mouseleave',hideTip);
  });
  var toggleBtn=document.createElement('button');
  toggleBtn.className='btn-sm';
  toggleBtn.style.cssText='margin:0.3rem;font-size:12px;';
  toggleBtn.textContent=L.tooltipToggle||'Toggle Tooltips';
  toggleBtn.setAttribute('data-i18n','tooltipToggle');
  toggleBtn.addEventListener('click',function(){
    tooltipsEnabled=!tooltipsEnabled;
    toggleBtn.style.opacity=tooltipsEnabled?'1':'0.5';
  });
  var target=document.querySelector('.sidebar-footer')||document.querySelector('.card')||document.body;
  if(target) target.appendChild(toggleBtn);
}

/* ═══════ Parameter Space Explorer ═══════ */
function initExplorer(){
  if(document.getElementById('explorerPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var sliders=document.querySelectorAll('input[type="range"]');
  if(sliders.length===0) return;
  var panel=document.createElement('div');
  panel.id='explorerPanel';
  panel.className='explorer-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  var title=L.explorerTitle||'Parameter Space Explorer';
  var startLabel=L.explorerStart||'Auto-Explore';
  var stopLabel=L.explorerStop||'Stop Exploration';
  var infoText=L.explorerInfo||'Systematically tests min/mid/max for each slider and records results';
  panel.innerHTML='<h4 style="margin:0 0 0.5rem 0;font-size:14px;" data-i18n="explorerTitle">'+title+'</h4>'
    +'<p style="font-size:12px;opacity:0.7;margin:0 0 0.5rem 0;" data-i18n="explorerInfo">'+infoText+'</p>'
    +'<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:0.5rem;">'
    +'<button id="explorerStartBtn" class="btn-sm" data-i18n="explorerStart">'+startLabel+'</button>'
    +'<button id="explorerStopBtn" class="btn-sm" style="display:none;" data-i18n="explorerStop">'+stopLabel+'</button>'
    +'<button id="explorerApplyBtn" class="btn-sm" style="display:none;">Apply Best</button>'
    +'</div>'
    +'<div id="explorerProgress" style="display:none;margin-bottom:0.5rem;">'
    +'<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">'
    +'<div id="explorerBar" style="height:100%;background:var(--accent,#00ff88);width:0%;transition:width 0.3s;"></div>'
    +'</div>'
    +'<span id="explorerPct" style="font-size:11px;opacity:0.7;">0%</span>'
    +'</div>'
    +'<div id="explorerResults" style="font-size:11px;max-height:200px;overflow-y:auto;"></div>';
  var wikiSection=document.querySelector('.wiki-entry')||document.querySelector('.sidebar-body')||document.querySelector('.card');
  if(wikiSection&&wikiSection.parentNode){
    wikiSection.parentNode.insertBefore(panel,wikiSection);
  } else {
    document.body.appendChild(panel);
  }
  var exploring=false;
  var explorerTimer=null;
  var results=[];
  var bestCombo=null;
  var bestScore=-Infinity;
  var startBtn=document.getElementById('explorerStartBtn');
  var stopBtn=document.getElementById('explorerStopBtn');
  var applyBtn=document.getElementById('explorerApplyBtn');
  var progressDiv=document.getElementById('explorerProgress');
  var barDiv=document.getElementById('explorerBar');
  var pctSpan=document.getElementById('explorerPct');
  var resultsDiv=document.getElementById('explorerResults');
  function getCanvasScore(){
    var canvas=document.querySelector('canvas');
    if(!canvas) return Math.random()*100;
    try{
      var ctx=canvas.getContext('2d');
      var data=ctx.getImageData(0,0,Math.min(canvas.width,100),Math.min(canvas.height,100)).data;
      var sum=0,nonZero=0;
      for(var i=0;i<data.length;i+=16){sum+=data[i]+data[i+1]+data[i+2];if(data[i]||data[i+1]||data[i+2])nonZero++;}
      return nonZero>0?(sum/nonZero):0;
    }catch(e){return Math.random()*100;}
  }
  function generateCombinations(){
    var combos=[];
    var sliderArr=Array.from(sliders);
    var levels=sliderArr.map(function(s){
      var mn=parseFloat(s.min)||0,mx=parseFloat(s.max)||100;
      return [mn,(mn+mx)/2,mx];
    });
    if(sliderArr.length<=2){
      function cartesian(arrays,prefix){
        if(arrays.length===0){combos.push(prefix.slice());return;}
        var first=arrays[0],rest=arrays.slice(1);
        for(var i=0;i<first.length;i++){prefix.push(first[i]);cartesian(rest,prefix);prefix.pop();}
      }
      cartesian(levels,[]);
    } else {
      for(var si=0;si<sliderArr.length;si++){
        for(var li=0;li<3;li++){
          var combo=sliderArr.map(function(s){return parseFloat(s.value);});
          combo[si]=levels[si][li];
          combos.push(combo);
        }
      }
    }
    return combos;
  }
  function runExploration(){
    exploring=true;
    results=[];
    bestScore=-Infinity;
    bestCombo=null;
    startBtn.style.display='none';
    stopBtn.style.display='';
    applyBtn.style.display='none';
    progressDiv.style.display='block';
    resultsDiv.innerHTML='';
    var combos=generateCombinations();
    var idx=0;
    var sliderArr=Array.from(sliders);
    var origValues=sliderArr.map(function(s){return s.value;});
    function step(){
      if(!exploring||idx>=combos.length){
        finishExploration(sliderArr,origValues);
        return;
      }
      var combo=combos[idx];
      sliderArr.forEach(function(s,i){
        s.value=combo[i];
        s.dispatchEvent(new Event('input',{bubbles:true}));
      });
      var pct=Math.round((idx+1)/combos.length*100);
      barDiv.style.width=pct+'%';
      pctSpan.textContent=pct+'%';
      setTimeout(function(){
        var score=getCanvasScore();
        results.push({combo:combo.slice(),score:score});
        if(score>bestScore){bestScore=score;bestCombo=combo.slice();}
        idx++;
        explorerTimer=setTimeout(step,120);
      },80);
    }
    step();
  }
  function finishExploration(sliderArr,origValues){
    exploring=false;
    startBtn.style.display='';
    stopBtn.style.display='none';
    progressDiv.style.display='none';
    barDiv.style.width='0%';
    sliderArr.forEach(function(s,i){
      s.value=origValues[i];
      s.dispatchEvent(new Event('input',{bubbles:true}));
    });
    var html='<table style="width:100%;border-collapse:collapse;font-size:11px;"><tr style="border-bottom:1px solid rgba(255,255,255,0.15);">';
    sliderArr.forEach(function(s,i){html+='<th style="padding:2px 4px;text-align:left;">P'+(i+1)+'</th>';});
    html+='<th style="padding:2px 4px;text-align:left;">Score</th></tr>';
    var sorted=results.slice().sort(function(a,b){return b.score-a.score;});
    var top=sorted.slice(0,12);
    top.forEach(function(r,ri){
      var bg=ri===0?'rgba(0,255,136,0.15)':'transparent';
      html+='<tr style="background:'+bg+';border-bottom:1px solid rgba(255,255,255,0.05);">';
      r.combo.forEach(function(v){html+='<td style="padding:2px 4px;">'+parseFloat(v).toFixed(1)+'</td>';});
      html+='<td style="padding:2px 4px;font-weight:bold;">'+r.score.toFixed(1)+'</td></tr>';
    });
    html+='</table>';
    if(results.length>0){
      html+='<div style="margin-top:0.3rem;font-size:11px;opacity:0.7;">'+(L.explorerResult||'Exploration Complete')+' — '+results.length+' combos tested</div>';
    }
    resultsDiv.innerHTML=html;
    if(bestCombo){
      applyBtn.style.display='';
      try{localStorage.setItem('wdiy-explorer-best',JSON.stringify(bestCombo));}catch(e){}
    }
  }
  startBtn.addEventListener('click',function(){
    if(!exploring) runExploration();
  });
  stopBtn.addEventListener('click',function(){
    exploring=false;
  });
  applyBtn.addEventListener('click',function(){
    var combo=bestCombo;
    try{var stored=localStorage.getItem('wdiy-explorer-best');if(stored) combo=JSON.parse(stored);}catch(e){}
    if(!combo) return;
    var sliderArr=Array.from(sliders);
    sliderArr.forEach(function(s,i){
      if(combo[i]!==undefined){s.value=combo[i];s.dispatchEvent(new Event('input',{bubbles:true}));}
    });
  });
}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
  if(document.getElementById('sonifyPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var panel=document.createElement('div');
  panel.id='sonifyPanel';
  panel.className='sonify-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
    +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
    +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
    +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
    +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
    +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
    +'</div>'
    +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
    +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
  var actx=null,osc=null,gain=null,analyser=null,running=false;
  var toggle=document.getElementById('sonifyToggle');
  var status=document.getElementById('sonifyStatus');
  var freqDisp=document.getElementById('sonifyFreqDisp');
  var volSlider=document.getElementById('sonifyVolSlider');
  var wCanvas=document.getElementById('sonifyWaveCanvas');
  var wCtx=wCanvas.getContext('2d');
  function startAudio(){
    if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
    if(actx.state==='suspended'){actx.resume();}
    analyser=actx.createAnalyser();analyser.fftSize=256;
    osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
    gain=actx.createGain();gain.gain.value=volSlider.value/300;
    osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
    osc.start();running=true;drawWave();
  }
  function stopAudio(){
    running=false;
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    try{if(analyser){analyser.disconnect();}}catch(e){}
    osc=null;gain=null;analyser=null;
    wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
  }
  function drawWave(){
    if(!running||!analyser)return;
    var buf=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);
    wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
    wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
    wCtx.beginPath();
    var sl=wCanvas.width/buf.length;var x=0;
    for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
    wCtx.stroke();requestAnimationFrame(drawWave);
  }
  function mapData(){
    var c=document.getElementById('simCanvas');
    if(!c)return 440;
    try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
  }
  var sonifyInterval=null;
  toggle.addEventListener('click',function(){
    if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
      status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
    }else{startAudio();
      sonifyInterval=setInterval(function(){
        if(!running||!osc)return;
        var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
        freqDisp.textContent=Math.round(f)+' Hz';
        if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
      },100);
      status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
    }
  });
  volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}

/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

/* ═══════ FRAMEWORK (same pattern as bio-body-antenna) ═══════ */
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
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
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){initTooltips();initExplorer();});}else{initTooltips();initExplorer();}

/* ═══════ PEER MODE (BroadcastChannel) ═══════ */
function initPeerMode(){var L=LANG[document.documentElement.lang||'en'];if(!L.peerTitle)return;if(typeof BroadcastChannel==='undefined'){console.warn('BroadcastChannel not available');return;}var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var channelName='peer_'+appDir;var bc=new BroadcastChannel(channelName);var peerActive=false;var msgCount=0;var container=document.getElementById('peerModePanel');if(!container){container=document.createElement('div');container.id='peerModePanel';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var anchor=document.getElementById('dailyChallenge');if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(container,anchor);}else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}container.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span style="font-size:0.95rem;font-weight:700;" data-i18n="peerTitle">'+L.peerTitle+'</span>'+'<button id="peerToggleBtn" class="btn-sm" style="padding:0.3rem 0.8rem;border-radius:16px;cursor:pointer;" data-i18n="peerConnect">'+L.peerConnect+'</button>'+'<span id="peerStatusDot" style="font-size:0.85rem;">\ud83d\udd34 Solo</span>'+'<span id="peerMsgCount" style="font-size:0.75rem;opacity:0.6;margin-left:auto;">0 synced</span></div>'+'<p style="font-size:0.7rem;opacity:0.5;margin:0.3rem 0 0;" data-i18n="peerInfo">'+L.peerInfo+'</p>';var btn=document.getElementById('peerToggleBtn');var dot=document.getElementById('peerStatusDot');var counter=document.getElementById('peerMsgCount');btn.onclick=function(){peerActive=!peerActive;if(peerActive){btn.textContent=L.peerDisconnect||'Disconnect';dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');bc.postMessage({type:'ping'});}else{btn.textContent=L.peerConnect||'Connect';dot.textContent='\ud83d\udd34 Solo';}};bc.onmessage=function(e){if(!peerActive)return;var d=e.data;if(d&&d.type==='param'){var el=document.querySelector('[name="'+d.name+'"],#'+d.name);if(el&&el.type==='range'){el.value=d.value;el.dispatchEvent(new Event('input',{bubbles:true}));}msgCount++;counter.textContent=msgCount+' synced';}if(d&&d.type==='ping'){dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');}};document.querySelectorAll('input[type="range"]').forEach(function(slider){slider.addEventListener('input',function(){if(!peerActive)return;var nm=slider.name||slider.id||'';if(!nm)return;bc.postMessage({type:'param',name:nm,value:slider.value});msgCount++;counter.textContent=msgCount+' synced';});});}

/* ═══════ ACTIVITY HEATMAP ═══════ */
function initActivityHeatmap(){var L=LANG[document.documentElement.lang||'en'];if(!L.heatmapTitle)return;var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey='activity_'+appDir;var data;try{data=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch(e){data={};}if(!data.dates)data.dates={};var today=new Date().toISOString().slice(0,10);data.dates[today]=(data.dates[today]||0)+1;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}var container=document.getElementById('activityHeatmap');if(!container){container=document.createElement('div');container.id='activityHeatmap';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var peer=document.getElementById('peerModePanel');if(peer&&peer.parentNode){peer.parentNode.insertBefore(container,peer.nextSibling);}else{var dc=document.getElementById('dailyChallenge');if(dc&&dc.parentNode)dc.parentNode.insertBefore(container,dc);else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}}var colors=['#161b22','#0e4429','#006d32','#26a641','#39d353'];function getColor(n){if(n===0)return colors[0];if(n===1)return colors[1];if(n<=3)return colors[2];if(n<=5)return colors[3];return colors[4];}var canvas=document.createElement('canvas');canvas.width=280;canvas.height=100;canvas.style.cssText='width:280px;max-width:100%;height:100px;border-radius:6px;cursor:pointer;display:block;margin:0.4rem 0;';var ctx=canvas.getContext('2d');var cellSize=10;var gap=2;var todayDate=new Date();todayDate.setHours(0,0,0,0);var startDate=new Date(todayDate);startDate.setDate(startDate.getDate()-(52*7-1));var tooltip=document.createElement('div');tooltip.style.cssText='display:none;position:absolute;z-index:9999;background:#1a1a2e;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;pointer-events:none;white-space:nowrap;';container.style.position='relative';container.appendChild(tooltip);var cellMap=[];function drawGrid(){ctx.clearRect(0,0,280,100);var d=new Date(startDate);for(var week=0;week<52;week++){for(var day=0;day<7;day++){var ds=d.toISOString().slice(0,10);var count=data.dates[ds]||0;var x=week*(cellSize+gap);var y=day*(cellSize+gap);ctx.fillStyle=getColor(count);ctx.fillRect(x,y,cellSize,cellSize);if(ds===today){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,cellSize-1,cellSize-1);}cellMap.push({x:x,y:y,date:ds,count:count});d.setDate(d.getDate()+1);}}}drawGrid();canvas.addEventListener('click',function(e){var rect=canvas.getBoundingClientRect();var scaleX=280/rect.width;var mx=(e.clientX-rect.left)*scaleX;var my=(e.clientY-rect.top)*(100/rect.height);for(var i=0;i<cellMap.length;i++){var c=cellMap[i];if(mx>=c.x&&mx<=c.x+cellSize&&my>=c.y&&my<=c.y+cellSize){tooltip.textContent=c.date+': '+c.count+' visits';tooltip.style.display='block';tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+10)+'px';tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-20)+'px';setTimeout(function(){tooltip.style.display='none';},2500);return;}}});var streak=0;var checkDate=new Date(todayDate);while(true){var ds=checkDate.toISOString().slice(0,10);if(data.dates[ds]&&data.dates[ds]>0){streak++;}else{break;}checkDate.setDate(checkDate.getDate()-1);}var totalSessions=0;Object.values(data.dates).forEach(function(v){totalSessions+=v;});var stats=document.createElement('div');stats.style.cssText='font-size:0.75rem;opacity:0.7;display:flex;gap:1rem;flex-wrap:wrap;';stats.innerHTML='<span data-i18n="heatmapToday">'+(L.heatmapToday||'Today')+'</span>: '+(data.dates[today]||0)+' | '+'<span data-i18n="heatmapStreak">'+(L.heatmapStreak||'Streak')+'</span>: '+streak+' days | '+'<span data-i18n="heatmapTotal">'+(L.heatmapTotal||'Total')+'</span>: '+totalSessions;var legend=document.createElement('div');legend.style.cssText='font-size:0.65rem;opacity:0.5;margin-top:0.2rem;';legend.innerHTML='<span data-i18n="heatmapLegend">'+(L.heatmapLegend||'Less \u2192 More')+'</span> ';colors.forEach(function(c){legend.innerHTML+='<span style="display:inline-block;width:10px;height:10px;background:'+c+';border-radius:2px;margin:0 1px;vertical-align:middle;"></span>';});container.innerHTML='<div style="font-size:0.95rem;font-weight:700;" data-i18n="heatmapTitle">'+L.heatmapTitle+'</div>';container.appendChild(canvas);container.appendChild(stats);container.appendChild(legend);container.style.position='relative';container.appendChild(tooltip);}

document.addEventListener('DOMContentLoaded',function(){try{initPeerMode();}catch(e){console.warn('Peer init:',e);}try{initActivityHeatmap();}catch(e){console.warn('Heatmap init:',e);}});


/* === LAYOUT CLEANUP === */
(function(){
  /* Hide dynamically-created panels: wrap them in <details> so they collapse */
  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(function(){
      /* Panels to collapse (id -> label) */
      var panels = {
        'dailyChallenge': '\uD83D\uDCC5 Daily Challenge',
        'peerModePanel': '\uD83D\uDC65 Peer Mode',
        'activityHeatmap': '\uD83D\uDFE9 Activity Heatmap',
        'labRecorderPanel': '\uD83D\uDCD3 Lab & Recorder',
        'sonifyPanel': '\uD83D\uDD0A Sonification',
        'explorerPanel': '\uD83D\uDD0D Parameter Explorer',
        'spacedPanel': '\uD83D\uDCC5 Spaced Repetition'
      };
      Object.keys(panels).forEach(function(id){
        var el = document.getElementById(id);
        if(!el || el.parentElement.tagName === 'DETAILS') return;
        var det = document.createElement('details');
        det.className = 'collapsible tool-panel';
        det.style.cssText = 'margin:6px 0;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0;overflow:hidden';
        var sum = document.createElement('summary');
        sum.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:13px;font-weight:600;list-style:none;background:rgba(0,0,0,0.2);color:inherit';
        sum.textContent = panels[id];
        det.appendChild(sum);
        el.parentNode.insertBefore(det, el);
        el.style.display = '';
        el.style.padding = '8px 12px';
        det.appendChild(el);
      });
      /* Also wrap the compare button area */
      var cmpBtn = document.querySelector('.compare-toggle,.compare-btn,[onclick*="compare"],[id*="compare"]');
      if(cmpBtn && cmpBtn.parentElement.tagName !== 'DETAILS'){
        cmpBtn.style.fontSize = '12px';
      }
      /* Clean up: move floating buttons to a tools bar if many exist */
      var floats = document.querySelectorAll('[style*="position:fixed"][style*="bottom"]');
      if(floats.length > 2){
        var bar = document.createElement('div');
        bar.style.cssText = 'position:fixed;bottom:10px;right:10px;display:flex;gap:6px;z-index:9990;flex-direction:column;align-items:flex-end';
        bar.id = 'toolsFloat';
        floats.forEach(function(f){
          if(f.id === 'mentorOverlay' || f.id === 'tooltipFloat' || f.id === 'voiceIndicator' || f.id === 'particleCanvas') return;
          f.style.position = 'relative';
          f.style.bottom = 'auto';
          f.style.right = 'auto';
          f.style.margin = '0';
          bar.appendChild(f);
        });
        if(bar.children.length > 0) document.body.appendChild(bar);
      }
    }, 500);
  });
})();
