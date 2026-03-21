/**
 * Aircraft Radar — ADS-B Receiver — Workshop DIY
 * Simulated ADS-B aircraft tracking with sky map, altitude chart, flight table
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABhSURBVDhPY2AYBaNhMBoGDAwMDP8ZGP4zMDD8h2IYGQM1M0Ixwy+oGAYGa2ZCMVTDK6gYE0JNLxMUwzTAMUwDHMM0wDFMAxzDNMAxTAMcwzTAMUwDHMM0UOswGA0DRgYGABIGGq0+CXOkAAAAAElFTkSuQmCC';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
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
    title: 'Aircraft Radar', subtitle: '✈️ Plot every aircraft overhead with altitude, speed, callsign',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Aircraft Radar — ADS-B Receiver', mainDesc: 'Plot every aircraft overhead with altitude, speed, callsign',
    sectionA: 'Altitude Chart', sectionB: 'Aircraft Table', sectionC: 'ADS-B Explained',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    theme: 'Theme', settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'The main display shows the Aircraft Radar simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Aircraft Radar. Choose your inp',
    howto_2:'Press the "Start Receiver" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Altitude Chart" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_adsb_title: '📡 ADS-B', wiki_adsb:'Automatic Dependent Surveillance-Broadcast on 1090 MHz. Frequency is measured in Hertz (cycles per second). Higher frequencies carry more data but travel shorter distances. Lower frequencies penetrate walls and terrain better but carry less information.',
    wiki_squawk_title: '🔢 Squawk Codes', wiki_squawk:'4-digit transponder codes. 7500=hijack, 7600=radio fail, 7700=emergency. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy:'Local-first, privacy-first. All data stays in your browser. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '✈️ Aircraft Radar ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', splashHint: 'tap to skip',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    startScan: 'Start Receiver', stopScan: 'Stop',
    aircraftTracked: 'aircraft tracked',
    callsignLabel: 'Callsign:', altitudeLabel: 'Altitude:', speedLabel: 'Speed:',
    headingLabel: 'Heading:', squawkLabel: 'Squawk:', typeLabel: 'Type:',
    thCallsign: 'Callsign', thAlt: 'Alt (ft)', thSpeed: 'Speed (kt)', thHeading: 'Hdg', thSquawk: 'Squawk', thType: 'Type',
    adsbInfo: 'ADS-B (Automatic Dependent Surveillance-Broadcast) is a surveillance technology where aircraft broadcast their GPS position, altitude, speed, and identification. Operating on 1090 MHz, these unencrypted signals can be received with an RTL-SDR dongle and a simple antenna. This app simulates the decoded output of an ADS-B receiver.',
    receiverStarted: '📡 ADS-B receiver started on 1090 MHz', receiverStopped: '🔴 Receiver stopped',
    newAircraft: 'New aircraft detected:', aircraftLost: 'Aircraft lost:',step1Title:'Set Up',step1Desc:'Configure the parameters for Aircraft Radar. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start Receiver" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Altitude Chart" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Aircraft Table". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Aircraft Radar?',faq_a1:'Aircraft Radar is an interactive simulation that demonstrates SIGINT concepts. Plot every aircraft overhead with altitude, speed, callsign. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real signal intelligence behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start Receiver" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real signal intelligence principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Hrf Fm Pirate Radio and Hrf Gsm Tower Mapper. Each app in this category teaches a different aspect of signal intelligence.',demo_s1:'Welcome to Aircraft Radar! Look at the main display — this is where the signal intelligence simulation runs.',demo_s2:'Click "Start Receiver" to begin simulated ADS-B reception. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Altitude Chart" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of signal intelligence.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Aircraft Radar! This is like a science experiment on your computer. You get to control a real SIGINT simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Aircraft Radar. Choos Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches signal intelligence concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'Aircraft Radar: Plot every aircraft overhead with altitude, speed, callsign. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Altitude Chart" and "Aircraft Table" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Exam Questions',related1_desc:'Test your SDR & RF knowledge',related1_path:'../../33-sdr-learning/sdr-exam-lab/index.html',related2_name:'2.4 GHz BLE Channel Waterfall',related2_desc:'Watch BLE frequency hopping in real-time',related2_path:'../../12-hrf-esp32/esp-ble-xray/index.html',related3_name:'Escape HQ — Spy Escape Room',related3_desc:'Solve puzzles with ESP32 locks and micro:bit gadgets',related3_path:'../../04-spy-combos/kit-escape-hq/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'',pathPrev_path:'',pathNext_name:'DJ Booth',pathNext_path:'../../10-hrf-sigint/hrf-fm-pirate-radio/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'Which frequency range is UHF?',quiz_q1a:'3-30 MHz',quiz_q1b:'30-300 MHz',quiz_q1c:'300 MHz-3 GHz',quiz_q1d:'3-30 GHz',quiz_q1_answer:'2',quiz_q2:'What is frequency measured in?',quiz_q2a:'Meters',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'If frequency doubles, what happens to wavelength?',quiz_q3a:'Doubles',quiz_q3b:'Halves',quiz_q3c:'Stays same',quiz_q3d:'Triples',quiz_q3_answer:'1',quiz_q4:'What does AI stand for?',quiz_q4a:'Automated Input',quiz_q4b:'Artificial Intelligence',quiz_q4c:'Analog Interface',quiz_q4d:'Active Integration',quiz_q4_answer:'1',quiz_q5:'What is machine learning?',quiz_q5a:'Programming robots',quiz_q5b:'Systems that learn from data',quiz_q5c:'Manual computation',quiz_q5d:'Hardware design',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'Numbers Stations have broadcast encrypted shortwave messages to field agents since the Cold War. UVB-76 (the Buzzer) in Russia has transmitted a monotone buzz since 1982, occasionally interrupted by coded voice messages.',realworld2:'The Aldrich Ames case (1994) revealed how a CIA mole used dead drops to pass classified intelligence to the Soviet Union for nearly a decade before detection, compromising over 100 operations.',realworld3:'Operation Ivy Bells (1970s-80s) was a joint NSA/Navy mission to tap Soviet undersea communication cables in the Sea of Okhotsk. Divers placed recording pods on the cable, retrieving them monthly by submarine.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In counter-surveillance, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in counter-surveillance and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Aircraft Radar demonstrates a fundamental concept in counter-surveillance. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Aircraft Radar have direct real-world applications. Professionals in counter-surveillance use these same concepts daily. In industry, ESP32 and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with counter-surveillance carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.',proTipTitle:'💡 Pro Tips',proTip1:'Add a 10μF capacitor across the ESP32 power pins. WiFi transmission causes current spikes that can crash the board without proper decoupling.',proTip2:'Enable deep sleep mode between scans to extend battery life by 10x. The ESP32 draws 240mA active but only 10μA in deep sleep.',funFactTitle:'🎯 Did You Know?',funFact:'The Great Seal bug — in 1945, Soviet children gifted the US ambassador a carved wooden Great Seal containing a passive listening device. It operated for 7 years before being discovered.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
    wiki_history_title: '📜 History of Sigint',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Aircraft Radar builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Aircraft Radar',
    wiki_math: 'The mathematics behind Aircraft Radar: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced SIGINT practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to SIGINT. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with SIGINT: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in SIGINT.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Sigint carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Doppler Shift',
    gloss2_def: 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Aircraft Radar demonstrates key principles from SIGINT. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world SIGINT?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional SIGINT systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Radar Aérien', subtitle: '✈️ Tracez chaque avion avec altitude, vitesse, indicatif',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Radar Aérien — Récepteur ADS-B', mainDesc: 'Tracez chaque avion avec altitude, vitesse, indicatif',
    sectionA: 'Graphique d\'altitude', sectionB: 'Table des avions', sectionC: 'ADS-B expliqué',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    theme: 'Thème', settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'L écran principal affiche la simulation Aircraft Radar. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Aircraft Radar. Choose your inp',
    howto_2:'Appuie sur "Start Receiver". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_adsb_title: '📡 ADS-B', wiki_adsb: 'Surveillance automatique dépendante par diffusion sur 1090 MHz.',
    wiki_squawk_title: '🔢 Codes Squawk', wiki_squawk: 'Codes transpondeur à 4 chiffres.',
    wiki_privacy_title: '🔒 Confidentialité', wiki_privacy: 'Tout reste dans votre navigateur.',
    working: 'En cours…',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '✈️ Radar aérien prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Réactif musique', splashHint: 'appuyer pour passer',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    startScan: 'Démarrer', stopScan: 'Arrêter',
    aircraftTracked: 'avions suivis',
    callsignLabel: 'Indicatif :', altitudeLabel: 'Altitude :', speedLabel: 'Vitesse :',
    headingLabel: 'Cap :', squawkLabel: 'Squawk :', typeLabel: 'Type :',
    thCallsign: 'Indicatif', thAlt: 'Alt (ft)', thSpeed: 'Vit (kt)', thHeading: 'Cap', thSquawk: 'Squawk', thType: 'Type',
    adsbInfo: 'L\'ADS-B est une technologie de surveillance où les avions diffusent leur position GPS, altitude, vitesse et identification sur 1090 MHz.',
    receiverStarted: '📡 Récepteur ADS-B démarré sur 1090 MHz', receiverStopped: '🔴 Récepteur arrêté',
    newAircraft: 'Nouvel avion détecté :', aircraftLost: 'Avion perdu :',step1Title:'Configurer',step1Desc:'Configure les paramètres de Aircraft Radar. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start Receiver" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Aircraft Radar ?',faq_a1:'Aircraft Radar est une simulation interactive qui démontre les concepts de renseignement électronique. Plot every aircraft overhead with altitude, speed, callsign. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de renseignement d\'origine électromagnétique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de renseignement d\'origine électromagnétique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF One. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de renseignement d\'origine électromagnétique.',demo_s1:'Bienvenue dans Aircraft Radar ! Regarde l\'écran principal — c\'est ici que la simulation de renseignement d\'origine électromagnétique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de renseignement d\'origine électromagnétique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Aircraft Radar ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de renseignement électronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the parameters for Aircraft Radar. Choos Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de renseignement d\'origine électromagnétique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',purpose:'Aircraft Radar : Plot every aircraft overhead with altitude, speed, callsign. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Questions d\\',related1_desc:'Testez vos connaissances SDR & RF',related1_path:'../../33-sdr-learning/sdr-exam-lab/index.html',related2_name:'Cascade BLE 2.4 GHz',related2_desc:'Visualisez le saut de frequence BLE en temps reel',related2_path:'../../12-hrf-esp32/esp-ble-xray/index.html',related3_name:'Escape HQ — Salle d\\',related3_desc:'Résolvez des énigmes avec des verrous ESP32 et gadgets micro:bit',related3_path:'../../04-spy-combos/kit-escape-hq/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'',pathPrev_path:'',pathNext_name:'Cabine DJ',pathNext_path:'../../10-hrf-sigint/hrf-fm-pirate-radio/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quelle plage de fréquences est UHF ?',quiz_q1a:'3-30 MHz',quiz_q1b:'30-300 MHz',quiz_q1c:'300 MHz-3 GHz',quiz_q1d:'3-30 GHz',quiz_q1_answer:'2',quiz_q2:'En quoi se mesure la fréquence ?',quiz_q2a:'Mètres',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'Si la fréquence double, que devient la longueur d\'onde ?',quiz_q3a:'Double',quiz_q3b:'Divisée par 2',quiz_q3c:'Inchangée',quiz_q3d:'Triplée',quiz_q3_answer:'1',quiz_q4:'Que signifie IA ?',quiz_q4a:'Entrée automatisée',quiz_q4b:'Intelligence Artificielle',quiz_q4c:'Interface analogique',quiz_q4d:'Intégration active',quiz_q4_answer:'1',quiz_q5:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q5a:'Programmer des robots',quiz_q5b:'Systèmes apprenant des données',quiz_q5c:'Calcul manuel',quiz_q5d:'Conception matérielle',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'Les stations de nombres diffusent des messages chiffrés par ondes courtes aux agents de terrain depuis la Guerre froide. UVB-76 émet un bourdonnement monotone depuis 1982.',realworld2:'L\'affaire Aldrich Ames (1994) a révélé comment une taupe de la CIA utilisait des boîtes aux lettres mortes pour transmettre des renseignements classifiés à l\'Union soviétique pendant près d\'une décennie.',realworld3:'L\'opération Ivy Bells (1970-80) était une mission conjointe NSA/Marine pour intercepter les câbles de communication sous-marins soviétiques en mer d\'Okhotsk.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En contre-surveillance, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en contre-surveillance et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Aircraft Radar illustre un concept fondamental en contre-surveillance. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Aircraft Radar ont des applications directes dans le monde réel. Les professionnels de contre-surveillance utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, ESP32 et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en contre-surveillance implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.',proTipTitle:'💡 Conseils de pro',proTip1:'Ajoutez un condensateur de 10μF aux bornes d\x27alimentation de l\x27ESP32. La transmission WiFi cause des pics de courant qui peuvent planter la carte sans découplage.',proTip2:'Activez le mode veille profonde entre les scans pour multiplier l\x27autonomie par 10. L\x27ESP32 consomme 240mA en actif mais seulement 10μA en veille profonde.',funFactTitle:'🎯 Le saviez-vous ?',funFact:'Le bug du Grand Sceau — en 1945, des enfants soviétiques ont offert à l\x27ambassadeur américain un Grand Sceau en bois contenant un dispositif d\x27écoute passif. Il a fonctionné 7 ans avant d\x27être découvert.',mistakeTitle:'⚠️ Erreurs courantes',mistake1:'Changer plusieurs paramètres à la fois rend impossible l\x27isolation de la cause et de l\x27effet. Changez toujours UNE seule variable à la fois.',mistake2:'Sauter la mesure de référence. Sans connaître le comportement par défaut, vous ne pouvez pas mesurer l\x27impact de vos changements.',mistake3:'Ignorer le journal d\x27activité. Il enregistre chaque événement avec des horodatages — essentiel pour comprendre les séquences.'},
    wiki_history_title: '📜 Histoire de renseignement électronique',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Aircraft Radar s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Aircraft Radar',
    wiki_math: 'Les mathématiques derrière Aircraft Radar : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de renseignement électronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour renseignement électronique. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en renseignement électronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Renseignement électronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Doppler Shift',
    gloss2_def: 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Aircraft Radar démontre les principes clés de renseignement électronique. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec SIGINT dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'رادار الطائرات', subtitle: '✈️ تتبع كل طائرة بالارتفاع والسرعة والإشارة',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'رادار الطائرات — مستقبل ADS-B', mainDesc: 'تتبع كل طائرة بالارتفاع والسرعة والإشارة',
    sectionA: 'مخطط الارتفاع', sectionB: 'جدول الطائرات', sectionC: 'شرح ADS-B',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    theme: 'المظهر', settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Aircraft Radar. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Aircraft Radar. Choose your inp',
    howto_2:'اضغط على "Start Receiver". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_adsb_title: '📡 ADS-B', wiki_adsb: 'مراقبة تلقائية بالبث على 1090 ميغاهرتز.',
    wiki_squawk_title: '🔢 رموز Squawk', wiki_squawk: 'رموز جهاز الإرسال والاستقبال من 4 أرقام.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    working: 'جارٍ…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '✈️ رادار الطائرات جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', splashHint: 'انقر للتخطي',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    startScan: 'بدء الاستقبال', stopScan: 'إيقاف',
    aircraftTracked: 'طائرة متتبعة',
    callsignLabel: 'الإشارة:', altitudeLabel: 'الارتفاع:', speedLabel: 'السرعة:',
    headingLabel: 'الاتجاه:', squawkLabel: 'Squawk:', typeLabel: 'النوع:',
    thCallsign: 'الإشارة', thAlt: 'الارتفاع', thSpeed: 'السرعة', thHeading: 'الاتجاه', thSquawk: 'Squawk', thType: 'النوع',
    adsbInfo: 'ADS-B هي تقنية مراقبة حيث تبث الطائرات موقعها GPS وارتفاعها وسرعتها وهويتها على 1090 ميغاهرتز.',
    receiverStarted: '📡 بدأ مستقبل ADS-B على 1090 ميغاهرتز', receiverStopped: '🔴 توقف المستقبل',
    newAircraft: 'طائرة جديدة:', aircraftLost: 'فقدت طائرة:',step1Title:'إعداد',step1Desc:'اضبط معاملات Aircraft Radar. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start Receiver" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو Aircraft Radar؟',faq_a1:'Aircraft Radar هي محاكاة تفاعلية توضح مفاهيم الاستخبارات الإلكترونية. Plot every aircraft overhead with altitude, speed, callsign. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في استخبارات الإشارات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من استخبارات الإشارات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF One. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من استخبارات الإشارات.',demo_s1:'مرحباً في Aircraft Radar! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة استخبارات الإشارات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـاستخبارات الإشارات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Aircraft Radar! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالاستخبارات الإلكترونية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the parameters for Aircraft Radar. Choos لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم استخبارات الإشارات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',purpose:'Aircraft Radar: Plot every aircraft overhead with altitude, speed, callsign. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الاستخبارات الإلكترونية',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Aircraft Radar على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Aircraft Radar',
    wiki_math: 'الرياضيات وراء Aircraft Radar: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الاستخبارات الإلكترونية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الاستخبارات الإلكترونية. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الاستخبارات الإلكترونية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الاستخبارات الإلكترونية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Doppler Shift',
    gloss2_def: 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Aircraft Radar يوضح المبادئ الأساسية في الاستخبارات الإلكترونية. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـSIGINT في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'اسئلة الامتحان',related1_desc:'اختبر معرفتك بـ SDR و RF',related1_path:'../../33-sdr-learning/sdr-exam-lab/index.html',related2_name:'شلال قنوات BLE 2.4 GHz',related2_desc:'شاهد قفز التردد BLE في الوقت الفعلي',related2_path:'../../12-hrf-esp32/esp-ble-xray/index.html',related3_name:'مقر الهروب — غرفة الهروب التجسسية',related3_desc:'حل الألغاز بأقفال ESP32 وأدوات micro:bit',related3_path:'../../04-spy-combos/kit-escape-hq/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'',pathPrev_path:'',pathNext_name:'\\u0643\\u0627\\u0628\\u064A\\u0646\\u0629 DJ',pathNext_path:'../../10-hrf-sigint/hrf-fm-pirate-radio/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما نطاق التردد UHF؟',quiz_q1a:'3-30 ميغاهرتز',quiz_q1b:'30-300 ميغاهرتز',quiz_q1c:'300 ميغاهرتز-3 غيغاهرتز',quiz_q1d:'3-30 غيغاهرتز',quiz_q1_answer:'2',quiz_q2:'بماذا تُقاس التردد؟',quiz_q2a:'أمتار',quiz_q2b:'هرتز',quiz_q2c:'واط',quiz_q2d:'فولت',quiz_q2_answer:'1',quiz_q3:'إذا تضاعف التردد، ماذا يحدث لطول الموجة؟',quiz_q3a:'يتضاعف',quiz_q3b:'ينقسم للنصف',quiz_q3c:'يبقى كما هو',quiz_q3d:'يتضاعف ثلاثاً',quiz_q3_answer:'1',quiz_q4:'ماذا تعني AI؟',quiz_q4a:'إدخال آلي',quiz_q4b:'الذكاء الاصطناعي',quiz_q4c:'واجهة تناظرية',quiz_q4d:'تكامل نشط',quiz_q4_answer:'1',quiz_q5:'ما هو التعلم الآلي؟',quiz_q5a:'برمجة الروبوتات',quiz_q5b:'أنظمة تتعلم من البيانات',quiz_q5c:'حساب يدوي',quiz_q5d:'تصميم العتاد',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'تبث محطات الأرقام رسائل مشفرة عبر الموجات القصيرة للعملاء الميدانيين منذ الحرب الباردة.',realworld2:'كشفت قضية ألدريتش أيمز (1994) كيف استخدم عميل مزدوج نقاط التسليم السرية لنقل معلومات استخبارية مصنفة للاتحاد السوفيتي لمدة عقد تقريبًا.',realworld3:'كانت عملية آيفي بيلز في السبعينيات والثمانينيات مهمة مشتركة بين وكالة الأمن القومي والبحرية للتنصت على كابلات الاتصالات السوفيتية تحت البحر.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في مكافحة المراقبة معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في مكافحة المراقبة وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Aircraft Radar يوضح مفهومًا أساسيًا في مكافحة المراقبة. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Aircraft Radar لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في مكافحة المراقبة هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ ESP32 وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال مكافحة المراقبة يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.',proTipTitle:'💡 نصائح احترافية',proTip1:'أضف مكثفًا بسعة 10 ميكروفاراد عبر دبابيس الطاقة في ESP32. يسبب إرسال الواي فاي ذروات تيار يمكن أن تتسبب في تعطل اللوحة.',proTip2:'فعّل وضع النوم العميق بين عمليات المسح لإطالة عمر البطارية 10 أضعاف. يستهلك ESP32 ما يصل إلى 240 مللي أمبير نشط ولكن 10 ميكروأمبير فقط في النوم العميق.',funFactTitle:'🎯 هل تعلم؟',funFact:'في عام 1945 أهدى أطفال سوفييت سفير الولايات المتحدة ختمًا خشبيًا يحتوي على جهاز تنصت سلبي. عمل لمدة 7 سنوات قبل اكتشافه.',mistakeTitle:'⚠️ أخطاء شائعة',mistake1:'تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.',mistake2:'تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.',mistake3:'تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],
  'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],
  'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]
};

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang]; const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

function playThemeMelody(name) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name]; if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06;
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ LOG ═══════ */
let logContainer;
let typewriterEnabled = true;
const logHistory = [];

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, fullText); }
  else { d.textContent = fullText; logContainer.appendChild(d); }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  logHistory.push({ msg, type, ts: Date.now() });
  applyLogFilter();
}

async function typewriterAppend(el, text) {
  el.classList.add('typing'); el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    if (el.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight;
    await sleep(8 + Math.random() * 12);
  }
  el.classList.remove('typing');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); }
}
function exportLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const text = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `aircraft-radar-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url);
}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click');
    });
  });
}
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ TOAST ═══════ */
let toastTimer = null;
function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }

/* ═══════ STATUS ═══════ */
function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ PANELS ═══════ */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const n = tab.dataset.tab, tid = 'help' + n.charAt(0).toUpperCase() + n.slice(1);
      const target = $(tid); if (target) target.classList.add('active');
    });
  });
}

function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; });
}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {}
}

/* ═══════ WHISPER / BREATHING / MUSIC (stubs) ═══════ */
let whisperActive = false;
function toggleWhisper() { whisperActive = !whisperActive; log(whisperActive ? '🎤 Whisper mode on' : '🎤 Whisper mode off', 'info'); }
let breathingActive = false;
function toggleBreathing() {
  breathingActive = !breathingActive;
  document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive));
  log(breathingActive ? '🫁 Breathing guide on' : '🫁 Breathing guide off', 'info');
}
let dhikrCount = 0;
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; playSound('click'); }
function toggleMusicMode() { log('🎵 Music mode toggled', 'info'); }

/* ═══════════════════════════════════════════════════════════
   AIRCRAFT RADAR — SIMULATION ENGINE
   ═══════════════════════════════════════════════════════════ */

const AIRLINES = ['DAH','AZA','BAW','DLH','AFR','UAE','THY','RYR','EZY','QTR','SAS','KLM','IBE','TAP','RAM'];
const AC_TYPES = ['B738','A320','B77W','A321','B789','A332','E190','B737','A319','CRJ9','B763','A20N','B38M','A359','B772'];

let aircraft = [];
let selectedAC = null;
let simRunning = false;
let simInterval = null;
let nextId = 1;

function randCallsign() {
  return AIRLINES[Math.floor(Math.random() * AIRLINES.length)] + (100 + Math.floor(Math.random() * 9000));
}

function randSquawk() {
  const digits = () => Math.floor(Math.random() * 8);
  return '' + digits() + digits() + digits() + digits();
}

function createAircraft() {
  const edge = Math.floor(Math.random() * 4);
  let x, y, vx, vy;
  const speed = 0.3 + Math.random() * 0.7;
  switch (edge) {
    case 0: x = -0.05; y = Math.random(); vx = speed; vy = (Math.random() - 0.5) * 0.3; break;
    case 1: x = 1.05; y = Math.random(); vx = -speed; vy = (Math.random() - 0.5) * 0.3; break;
    case 2: x = Math.random(); y = -0.05; vx = (Math.random() - 0.5) * 0.3; vy = speed; break;
    default: x = Math.random(); y = 1.05; vx = (Math.random() - 0.5) * 0.3; vy = -speed; break;
  }
  const alt = 5000 + Math.floor(Math.random() * 40000);
  const spd = 180 + Math.floor(Math.random() * 350);
  const heading = Math.round(Math.atan2(vx, -vy) * 180 / Math.PI + 360) % 360;
  return {
    id: nextId++,
    callsign: randCallsign(),
    x, y, vx: vx * 0.002, vy: vy * 0.002,
    altitude: alt,
    speed: spd,
    heading,
    squawk: randSquawk(),
    type: AC_TYPES[Math.floor(Math.random() * AC_TYPES.length)],
    altHistory: [alt],
    age: 0
  };
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  log(LANG[currentLang].receiverStarted, 'success');

  // Seed initial aircraft
  for (let i = 0; i < 5 + Math.floor(Math.random() * 4); i++) {
    const ac = createAircraft();
    ac.x = 0.1 + Math.random() * 0.8;
    ac.y = 0.1 + Math.random() * 0.8;
    aircraft.push(ac);
    log(`${LANG[currentLang].newAircraft} ${ac.callsign} (${ac.type}) FL${Math.floor(ac.altitude / 100)}`, 'rx');
  }

  simInterval = setInterval(simTick, 1000);
  drawLoop();
}

function stopSim() {
  if (!simRunning) return;
  simRunning = false;
  setStatus(false);
  if (simInterval) { clearInterval(simInterval); simInterval = null; }
  log(LANG[currentLang].receiverStopped, 'info');
}

function simTick() {
  // Move aircraft
  aircraft.forEach(ac => {
    ac.x += ac.vx;
    ac.y += ac.vy;
    ac.altitude += Math.floor((Math.random() - 0.5) * 200);
    ac.altitude = Math.max(1000, Math.min(45000, ac.altitude));
    ac.speed += Math.floor((Math.random() - 0.5) * 10);
    ac.speed = Math.max(150, Math.min(550, ac.speed));
    ac.altHistory.push(ac.altitude);
    if (ac.altHistory.length > 60) ac.altHistory.shift();
    ac.age++;
  });

  // Remove aircraft that left the area
  const before = aircraft.length;
  aircraft = aircraft.filter(ac => ac.x > -0.1 && ac.x < 1.1 && ac.y > -0.1 && ac.y < 1.1);
  if (aircraft.length < before) {
    log(`${LANG[currentLang].aircraftLost} ${before - aircraft.length} aircraft`, 'info');
  }

  // Occasionally add new aircraft
  if (Math.random() < 0.15 && aircraft.length < 20) {
    const ac = createAircraft();
    aircraft.push(ac);
    log(`${LANG[currentLang].newAircraft} ${ac.callsign} (${ac.type}) FL${Math.floor(ac.altitude / 100)}`, 'rx');
  }

  // Update count
  const countEl = $('aircraftCount');
  if (countEl) countEl.innerHTML = `${aircraft.length} <span data-i18n="aircraftTracked">${LANG[currentLang].aircraftTracked}</span>`;

  // Update table
  updateTable();
  drawAltChart();
}

/* ═══════ SKY MAP DRAWING ═══════ */
let skyCanvas, skyCtx;
let animFrame;

function drawLoop() {
  if (!simRunning) return;
  drawSkyMap();
  animFrame = requestAnimationFrame(drawLoop);
}

function drawSkyMap() {
  if (!skyCanvas) { skyCanvas = $('skyMap'); if (!skyCanvas) return; skyCtx = skyCanvas.getContext('2d'); }
  const W = skyCanvas.width, H = skyCanvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Background
  skyCtx.fillStyle = '#0a0e1a';
  skyCtx.fillRect(0, 0, W, H);

  // Grid rings
  skyCtx.strokeStyle = 'rgba(100,200,255,0.08)';
  skyCtx.lineWidth = 1;
  const cx = W / 2, cy = H / 2;
  for (let r = 50; r < Math.max(W, H); r += 80) {
    skyCtx.beginPath();
    skyCtx.arc(cx, cy, r, 0, Math.PI * 2);
    skyCtx.stroke();
  }
  // Crosshairs
  skyCtx.beginPath();
  skyCtx.moveTo(0, cy); skyCtx.lineTo(W, cy);
  skyCtx.moveTo(cx, 0); skyCtx.lineTo(cx, H);
  skyCtx.stroke();

  // Compass labels
  skyCtx.fillStyle = 'rgba(100,200,255,0.3)';
  skyCtx.font = '11px Orbitron, monospace';
  skyCtx.textAlign = 'center';
  skyCtx.fillText('N', cx, 14);
  skyCtx.fillText('S', cx, H - 6);
  skyCtx.fillText('E', W - 10, cy + 4);
  skyCtx.fillText('W', 12, cy + 4);

  // Draw aircraft
  aircraft.forEach(ac => {
    const px = ac.x * W;
    const py = ac.y * H;
    const isSelected = selectedAC && selectedAC.id === ac.id;

    // Trail
    skyCtx.strokeStyle = isSelected ? accent : 'rgba(100,200,255,0.15)';
    skyCtx.lineWidth = 1;
    skyCtx.beginPath();
    skyCtx.moveTo(px, py);
    skyCtx.lineTo(px - ac.vx * 5000, py - ac.vy * 5000);
    skyCtx.stroke();

    // Aircraft icon (triangle pointing in heading direction)
    const angle = ac.heading * Math.PI / 180;
    const size = isSelected ? 10 : 7;
    skyCtx.save();
    skyCtx.translate(px, py);
    skyCtx.rotate(angle);
    skyCtx.fillStyle = isSelected ? accent : '#4fc3f7';
    skyCtx.beginPath();
    skyCtx.moveTo(0, -size);
    skyCtx.lineTo(-size * 0.6, size * 0.6);
    skyCtx.lineTo(size * 0.6, size * 0.6);
    skyCtx.closePath();
    skyCtx.fill();
    skyCtx.restore();

    // Callsign label
    skyCtx.fillStyle = isSelected ? accent : 'rgba(200,230,255,0.7)';
    skyCtx.font = isSelected ? 'bold 10px Orbitron, monospace' : '9px Orbitron, monospace';
    skyCtx.textAlign = 'left';
    skyCtx.fillText(ac.callsign, px + 12, py - 4);
    skyCtx.fillStyle = 'rgba(200,230,255,0.4)';
    skyCtx.font = '8px Orbitron, monospace';
    skyCtx.fillText(`FL${Math.floor(ac.altitude / 100)} ${ac.speed}kt`, px + 12, py + 8);

    // Selection ring
    if (isSelected) {
      skyCtx.strokeStyle = accent;
      skyCtx.lineWidth = 1.5;
      skyCtx.beginPath();
      skyCtx.arc(px, py, 16, 0, Math.PI * 2);
      skyCtx.stroke();
    }
  });

  // Receiver label
  skyCtx.fillStyle = 'rgba(100,200,255,0.4)';
  skyCtx.font = '10px Orbitron, monospace';
  skyCtx.textAlign = 'left';
  skyCtx.fillText('RX: 1090.000 MHz  |  ADS-B  |  Mode-S', 8, H - 8);
}

/* ═══════ ALTITUDE CHART ═══════ */
function drawAltChart() {
  const canvas = $('altChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  // Y axis labels
  ctx.fillStyle = 'rgba(100,200,255,0.3)';
  ctx.font = '9px Orbitron, monospace';
  ctx.textAlign = 'right';
  for (let alt = 0; alt <= 45000; alt += 10000) {
    const y = H - (alt / 45000) * (H - 20) - 10;
    ctx.fillText(`FL${alt / 100}`, 38, y + 3);
    ctx.strokeStyle = 'rgba(100,200,255,0.06)';
    ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Draw each aircraft's altitude history
  const colors = ['#4fc3f7','#81c784','#ffb74d','#e57373','#ba68c8','#4db6ac','#fff176','#f06292','#90a4ae','#aed581'];
  aircraft.forEach((ac, idx) => {
    if (ac.altHistory.length < 2) return;
    const color = selectedAC && selectedAC.id === ac.id ? accent : colors[idx % colors.length];
    ctx.strokeStyle = color;
    ctx.lineWidth = selectedAC && selectedAC.id === ac.id ? 2 : 1;
    ctx.beginPath();
    ac.altHistory.forEach((alt, i) => {
      const x = 44 + (i / 60) * (W - 50);
      const y = H - (alt / 45000) * (H - 20) - 10;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Label at end
    const lastAlt = ac.altHistory[ac.altHistory.length - 1];
    const lx = 44 + ((ac.altHistory.length - 1) / 60) * (W - 50);
    const ly = H - (lastAlt / 45000) * (H - 20) - 10;
    ctx.fillStyle = color;
    ctx.font = '8px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(ac.callsign, lx + 4, ly - 2);
  });
}

/* ═══════ AIRCRAFT TABLE ═══════ */
function updateTable() {
  const tbody = $('aircraftBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  aircraft.forEach(ac => {
    const tr = document.createElement('tr');
    const isSel = selectedAC && selectedAC.id === ac.id;
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    if (isSel) tr.style.color = accent;
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
      <td style="padding:4px 8px;font-weight:${isSel?'bold':'normal'}">${ac.callsign}</td>
      <td style="padding:4px 8px">${ac.altitude.toLocaleString()}</td>
      <td style="padding:4px 8px">${ac.speed}</td>
      <td style="padding:4px 8px">${ac.heading}°</td>
      <td style="padding:4px 8px">${ac.squawk}</td>
      <td style="padding:4px 8px">${ac.type}</td>
    `;
    tr.onclick = () => selectAircraft(ac);
    tbody.appendChild(tr);
  });
}

function selectAircraft(ac) {
  selectedAC = ac;
  const info = $('flightInfo');
  if (info) info.style.display = 'block';
  $('infoCallsign').textContent = ac.callsign;
  $('infoAlt').textContent = ac.altitude.toLocaleString() + ' ft';
  $('infoSpeed').textContent = ac.speed + ' kt';
  $('infoHeading').textContent = ac.heading + '°';
  $('infoSquawk').textContent = ac.squawk;
  $('infoType').textContent = ac.type;
  log(`✈️ Selected ${ac.callsign} — FL${Math.floor(ac.altitude / 100)}`, 'info');
}

/* ═══════ SKY MAP CLICK ═══════ */
function initMapClick() {
  const canvas = $('skyMap');
  if (!canvas) return;
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    let closest = null, minDist = Infinity;
    aircraft.forEach(ac => {
      const d = Math.hypot(ac.x - mx, ac.y - my);
      if (d < minDist) { minDist = d; closest = ac; }
    });
    if (closest && minDist < 0.05) selectAircraft(closest);
  });
}

/* ═══════ MATRIX RAIN ═══════ */
let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix() {
  const canvas = $('matrixCanvas'); if (!canvas) return;
  if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; }
  matrixRunning = true; canvas.classList.add('active');
  const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1);
  function draw() { if (!matrixRunning) return; ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33'; ctx.font='14px Amiri,serif'; for(let i=0;i<drops.length;i++){const ch=ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)]; ctx.fillText(ch,i*16,drops[i]*16); if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0; drops[i]++;} matrixAnim=requestAnimationFrame(draw); }
  draw();
}
let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() {
  const logo = $('logoWrap'); if (!logo) return; logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => { logoClickCount++; if (logoClickTimer) clearTimeout(logoClickTimer); if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); } else { logoClickTimer = setTimeout(() => logoClickCount = 0, 500); } });
}

/* ═══════ KONAMI CODE ═══════ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() {
  document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE — RETRO!', 'success'); } } else konamiIdx = 0; });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Panels
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }

  // Settings features
  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = toggleWhisper;
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = toggleMusicMode;

  // Keys
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  // Language / theme
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sL = localStorage.getItem('wdiy-lang'), sT = localStorage.getItem('wdiy-theme'); if (sT) setTheme(sT); if (sL) setLanguage(sL); } catch {}

  initKonami();
  initMatrixTrigger();
  initHijriDate();

  // App-specific
  const startBtn = $('startBtn'), stopBtn = $('stopBtn');
  if (startBtn) startBtn.onclick = startSim;
  if (stopBtn) stopBtn.onclick = stopSim;
  initMapClick();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#settingsCloseBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#whisperBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#breathingBtn', delay:3000},
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
