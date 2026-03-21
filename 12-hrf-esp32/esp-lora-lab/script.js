/**
 * LoRa Lab — Workshop DIY v1.2
 * ESP32 LoRa chirp spread spectrum simulator
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.4-2.4c-2.6-1.8-3.9-2.6-6.4-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9z"/></svg>`;
const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch(type) {
    case 'click': osc.frequency.value=800; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break;
    case 'success': osc.frequency.value=523; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break;
    case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break;
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
    title: '📶 LoRa Lab', subtitle: 'Long Range Radio — Chirp Spread Spectrum',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Chirp Spread Spectrum Waterfall', mainDesc: 'ESP32 LoRa sends km range, see chirp spectrum',
    sectionA: 'Range Calculator — Distance vs Power', sectionB: 'LoRa Message Log', sectionC: 'LoRa Theory — How Chirps Work',
    sfLabel: 'Spreading Factor:', bwLabel: 'BW:', txPower: 'TX Power:',
    sendBtn: '📡 Send', estRange: 'Est. Range:', dataRate: 'Rate:', airtime: 'Airtime:',
    theory1: 'LoRa uses Chirp Spread Spectrum (CSS) modulation. Each symbol is a frequency sweep (chirp) across the entire bandwidth.',
    theory2: 'Higher Spreading Factors (SF7-SF12) trade data rate for range. SF12 is 64x slower than SF7 but reaches much farther.',
    theory3: 'The waterfall shows how chirps sweep from low to high frequency. Each starting frequency encodes a different symbol value.',
    theory4: 'Link budget: LoRa achieves -137 dBm sensitivity at SF12/125kHz, enabling 15+ km range in open terrain.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language', theme: 'Theme',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'The main display shows the Lora Lab simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for 📶 LoRa Lab. Choose your input s',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Range Calculator — Distance vs Power" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_themes_title: '🎨 Themes', wiki_themes:'8 built-in themes. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_i18n_title: '🌐 Languages', wiki_i18n:'EN/FR/AR with RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_log_title: '📜 Activity Log', wiki_log:'TX/RX event log. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy:'100% local simulation. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', ready: '📶 LoRa Lab ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    msgSent: 'Message sent via LoRa', chirpAnim: 'Chirp animation active',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Up',step1Desc:'Configure the parameters for 📶 LoRa Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Range Calculator — Distance vs Power" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "LoRa Message Log". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is 📶 LoRa Lab?',faq_a1:'Lora Lab is an interactive simulation that demonstrates radar systems concepts. ESP32 LoRa sends km range, see chirp spectrum. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real RF engineering behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Select SF and bandwidth from controls. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Ble Xray and Esp Collision Visualizer. Each app in this category teaches a different aspect of RF engineering. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',demo_s1:'Welcome to 📶 LoRa Lab! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Select SF and bandwidth from controls. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Range Calculator — Distance vs Power" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Lora Lab! This is like a science experiment on your computer. You get to control a real radar systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for 📶 LoRa Lab. Choose yo Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'📶 LoRa Lab: ESP32 LoRa sends km range, see chirp spectrum. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Range Calculator — Distance vs Power" and "LoRa Message Log" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'GSM Tower Mapper',related1_desc:'Scan and map nearby cell towers',related1_path:'../../10-hrf-sigint/hrf-gsm-tower-mapper/index.html',related2_name:'Radio Telescope — Hydrogen Line',related2_desc:'1420.405 MHz hydrogen emission spectrum',related2_path:'../../10-hrf-sigint/hrf-radio-telescope/index.html',related3_name:'IMSI Catcher Sim',related3_desc:'Simulate fake base station interception',related3_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Dual TX Collision Zone',pathPrev_path:'../../12-hrf-esp32/esp-collision-visualizer/index.html',pathNext_name:'SDR Stream Status',pathNext_path:'../../12-hrf-esp32/esp-rf-bridge/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is frequency measured in?',quiz_q1a:'Meters',quiz_q1b:'Hertz',quiz_q1c:'Watts',quiz_q1d:'Volts',quiz_q1_answer:'1',quiz_q2:'What is the electromagnetic spectrum?',quiz_q2a:'A type of antenna',quiz_q2b:'Range of all electromagnetic frequencies',quiz_q2c:'A sound wave chart',quiz_q2d:'A color wheel',quiz_q2_answer:'1',quiz_q3:'What does a spectrum analyzer display?',quiz_q3a:'Temperature',quiz_q3b:'Signal amplitude vs frequency',quiz_q3c:'Network traffic',quiz_q3d:'Battery level',quiz_q3_answer:'1',quiz_q4:'What is a neural network?',quiz_q4a:'Physical wires',quiz_q4b:'Computing system inspired by biological neurons',quiz_q4c:'Social network',quiz_q4d:'Radio network',quiz_q4_answer:'1',quiz_q5:'What wireless capabilities does ESP32 have?',quiz_q5a:'Wi-Fi only',quiz_q5b:'Bluetooth only',quiz_q5c:'Wi-Fi and Bluetooth',quiz_q5d:'None',quiz_q5_answer:'2',realworldTitle:'🌍 Real-World Stories',realworld1:'In 2017, GPS spoofing in the Black Sea made 20+ ships believe they were 25 miles inland at an airport. This demonstrated that satellite navigation — relied on by aviation, shipping, and military — can be fooled by fake RF signals.',realworld2:'In 2015, researchers showed that a $20 SDR dongle could track every aircraft in range by decoding unencrypted ADS-B transponder signals. This revealed a fundamental security gap in global aviation surveillance.',realworld3:'The Stuxnet worm (2010) destroyed 1,000 Iranian nuclear centrifuges by manipulating their PLCs via infected USB drives. It was the first cyber weapon to cause physical destruction and crossed the digital-physical boundary.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In radio navigation, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in radio navigation and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'📶 LoRa Lab demonstrates a fundamental concept in radio navigation. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in 📶 LoRa Lab have direct real-world applications. Professionals in radio navigation use these same concepts daily. In industry, SDR and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with radio navigation carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.'},
    wiki_history_title: '📜 History of Radar Systems',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Lora Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Lora Lab',
    wiki_math: 'The mathematics behind Lora Lab: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. LoRa spreading factors SF7-SF12 trade range for data rate. SF12 has 4× the range of SF7 but 1/64 the data rate. Link budget can reach 157 dB.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radar systems practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radar systems. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radar systems: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radar systems.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radar Systems carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Spreading Factor',
    gloss3_def: 'A LoRa parameter (SF7-SF12) that controls the chirp rate. Higher SF means more chips per bit — longer range and better noise immunity at the cost of slower data rate.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Lora Lab demonstrates key principles from radar systems. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. LoRa uses chirp spread spectrum modulation for long-range (10+ km), low-power communication. LoRaWAN adds a network layer for managing IoT devices. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radar systems?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radar systems systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: '📶 Labo LoRa', subtitle: 'Radio Longue Portee — Spectre Chirp',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Cascade Chirp Spread Spectrum', mainDesc: 'ESP32 LoRa envoie a des km, voir le spectre chirp',
    sectionA: 'Calculateur de portee — Distance vs Puissance', sectionB: 'Journal Messages LoRa', sectionC: 'Theorie LoRa — Fonctionnement des chirps',
    sfLabel: 'Facteur d\'etalement:', bwLabel: 'BP:', txPower: 'Puissance TX:',
    sendBtn: '📡 Envoyer', estRange: 'Portee est.:', dataRate: 'Debit:', airtime: 'Temps air:',
    theory1: 'LoRa utilise la modulation CSS (Chirp Spread Spectrum). Chaque symbole est un balayage de frequence sur toute la bande.',
    theory2: 'Les facteurs d\'etalement plus eleves (SF7-SF12) echangent le debit contre la portee.',
    theory3: 'La cascade montre comment les chirps balayent de basse a haute frequence.',
    theory4: 'Bilan de liaison: LoRa atteint -137 dBm de sensibilite a SF12/125kHz, permettant 15+ km.',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Parametres', language: 'Langue', theme: 'Theme',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'L écran principal affiche la simulation Lora Lab. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for 📶 LoRa Lab. Choose your input s', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 themes integres.',
    wiki_i18n_title: '🌐 Langues', wiki_i18n: 'EN/FR/AR avec RTL.',
    wiki_log_title: '📜 Journal', wiki_log: 'Journal TX/RX.',
    wiki_privacy_title: '🔒 Confidentialite', wiki_privacy: 'Simulation 100% locale.',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Reactif musique',
    splashHint: 'appuyer pour passer', ready: '📶 Labo LoRa pret!',
    logCleared: 'Journal efface', copied: 'Copie!', copyFail: 'Echec',
    working: 'En cours…', langChanged: '🌐 Langue → Francais', themeChanged: '🎨 Theme →',
    msgSent: 'Message envoye via LoRa',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer',step1Desc:'Configure les paramètres de 📶 LoRa Lab. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 📶 LoRa Lab ?',faq_a1:'Lora Lab est une simulation interactive qui démontre les concepts de systèmes radar. ESP32 LoRa sends km range, see chirp spectrum. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',demo_s1:'Bienvenue dans 📶 LoRa Lab ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir. Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Lora Lab ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de systèmes radar — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the parameters for 📶 LoRa Lab. Choose yo Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',purpose:'📶 LoRa Lab : ESP32 LoRa sends km range, see chirp spectrum. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Cartographe GSM',related1_desc:'Scanner et cartographier les antennes',related1_path:'../../10-hrf-sigint/hrf-gsm-tower-mapper/index.html',related2_name:'Radiotélescope — Raie Hydrogène',related2_desc:'Spectre d\\',related2_path:'../../10-hrf-sigint/hrf-radio-telescope/index.html',related3_name:'Sim Capteur IMSI',related3_desc:'Simuler interception par fausse station',related3_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Zone de collision double TX',pathPrev_path:'../../12-hrf-esp32/esp-collision-visualizer/index.html',pathNext_name:'Statut du flux SDR',pathNext_path:'../../12-hrf-esp32/esp-rf-bridge/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'En quoi se mesure la fréquence ?',quiz_q1a:'Mètres',quiz_q1b:'Hertz',quiz_q1c:'Watts',quiz_q1d:'Volts',quiz_q1_answer:'1',quiz_q2:'Qu\'est-ce que le spectre électromagnétique ?',quiz_q2a:'Un type d\'antenne',quiz_q2b:'L\'ensemble des fréquences EM',quiz_q2c:'Un graphique d\'ondes sonores',quiz_q2d:'Un cercle chromatique',quiz_q2_answer:'1',quiz_q3:'Qu\'affiche un analyseur de spectre ?',quiz_q3a:'Température',quiz_q3b:'Amplitude du signal vs fréquence',quiz_q3c:'Trafic réseau',quiz_q3d:'Niveau batterie',quiz_q3_answer:'1',quiz_q4:'Qu\'est-ce qu\'un réseau de neurones ?',quiz_q4a:'Fils physiques',quiz_q4b:'Système informatique inspiré des neurones',quiz_q4c:'Réseau social',quiz_q4d:'Réseau radio',quiz_q4_answer:'1',quiz_q5:'Quelles capacités sans fil a l\'ESP32 ?',quiz_q5a:'Wi-Fi uniquement',quiz_q5b:'Bluetooth uniquement',quiz_q5c:'Wi-Fi et Bluetooth',quiz_q5d:'Aucune',quiz_q5_answer:'2',realworldTitle:'🌍 Histoires réelles',realworld1:'En 2017, le spoofing GPS en mer Noire a fait croire à plus de 20 navires qu\'ils se trouvaient à 25 milles à l\'intérieur des terres dans un aéroport.',realworld2:'En 2015, des chercheurs ont montré qu\'un dongle SDR à 20$ pouvait suivre chaque avion à portée en décodant les signaux ADS-B non chiffrés des transpondeurs.',realworld3:'Le ver Stuxnet (2010) a détruit 1000 centrifugeuses nucléaires iraniennes en manipulant leurs automates programmables via des clés USB infectées.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En radionavigation, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en radionavigation et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'📶 LoRa Lab illustre un concept fondamental en radionavigation. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans 📶 LoRa Lab ont des applications directes dans le monde réel. Les professionnels de radionavigation utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, SDR et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en radionavigation implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
    wiki_history_title: '📜 Histoire de systèmes radar',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Lora Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Lora Lab',
    wiki_math: 'Les mathématiques derrière Lora Lab : Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. LoRa spreading factors SF7-SF12 trade range for data rate. SF12 has 4× the range of SF7 but 1/64 the data rate. Link budget can reach 157 dB.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de systèmes radar utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour systèmes radar. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en systèmes radar : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Systèmes radar implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Spreading Factor',
    gloss3_def: 'A LoRa parameter (SF7-SF12) that controls the chirp rate. Higher SF means more chips per bit — longer range and better noise immunity at the cost of slower data rate.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Lora Lab démontre les principes clés de systèmes radar. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. LoRa uses chirp spread spectrum modulation for long-range (10+ km), low-power communication. LoRaWAN adds a network layer for managing IoT devices. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radar systems dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '📶 مختبر LoRa', subtitle: 'راديو بعيد المدى — طيف Chirp',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'شلال طيف Chirp المنتشر', mainDesc: 'ESP32 LoRa يرسل لمسافات كيلومترات',
    sectionA: 'حاسبة المدى — المسافة مقابل القوة', sectionB: 'سجل رسائل LoRa', sectionC: 'نظرية LoRa — كيف تعمل Chirps',
    sfLabel: 'عامل الانتشار:', bwLabel: 'عرض النطاق:', txPower: 'قوة الإرسال:',
    sendBtn: '📡 إرسال', estRange: 'المدى المقدر:', dataRate: 'المعدل:', airtime: 'وقت البث:',
    theory1: 'يستخدم LoRa تعديل CSS. كل رمز هو مسح تردد عبر كامل عرض النطاق.',
    theory2: 'عوامل الانتشار الأعلى تستبدل معدل البيانات بالمدى.',
    theory3: 'يُظهر الشلال كيف تمسح chirps من تردد منخفض إلى عالٍ.',
    theory4: 'ميزانية الربط: يحقق LoRa حساسية -137 dBm عند SF12/125kHz، مما يتيح مدى 15+ كم.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة', theme: 'المظهر',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Lora Lab. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for 📶 LoRa Lab. Choose your input s', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_themes_title: '🎨 المظاهر', wiki_themes: '8 مظاهر مدمجة.',
    wiki_i18n_title: '🌐 اللغات', wiki_i18n: 'EN/FR/AR مع RTL.',
    wiki_log_title: '📜 سجل النشاط', wiki_log: 'سجل أحداث TX/RX.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'محاكاة محلية 100%.',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس',
    breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    splashHint: 'انقر للتخطي', ready: '📶 مختبر LoRa جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    working: 'جارٍ…', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    msgSent: 'تم إرسال الرسالة عبر LoRa',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'إعداد',step1Desc:'اضبط معاملات 📶 LoRa Lab. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو 📶 LoRa Lab؟',faq_a1:'Lora Lab هي محاكاة تفاعلية توضح مفاهيم أنظمة الرادار. ESP32 LoRa sends km range, see chirp spectrum. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',demo_s1:'مرحباً في 📶 LoRa Lab! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Lora Lab! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـأنظمة الرادار — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the parameters for 📶 LoRa Lab. Choose yo لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',purpose:'📶 LoRa Lab: ESP32 LoRa sends km range, see chirp spectrum. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أنظمة الرادار',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. يبني Lora Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Lora Lab',
    wiki_math: 'الرياضيات وراء Lora Lab: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. LoRa spreading factors SF7-SF12 trade range for data rate. SF12 has 4× the range of SF7 but 1/64 the data rate. Link budget can reach 157 dB.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أنظمة الرادار المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أنظمة الرادار. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أنظمة الرادار: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أنظمة الرادار يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Spreading Factor',
    gloss3_def: 'A LoRa parameter (SF7-SF12) that controls the chirp rate. Higher SF means more chips per bit — longer range and better noise immunity at the cost of slower data rate.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Lora Lab يوضح المبادئ الأساسية في أنظمة الرادار. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. LoRa uses chirp spread spectrum modulation for long-range (10+ km), low-power communication. LoRaWAN adds a network layer for managing IoT devices. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradar systems في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'خريطة ابراج GSM',related1_desc:'مسح ورسم خريطة ابراج الاتصالات',related1_path:'../../10-hrf-sigint/hrf-gsm-tower-mapper/index.html',related2_name:'تلسكوب راديوي — خط الهيدروجين',related2_desc:'طيف انبعاث الهيدروجين عند 1420.405 ميغاهرتز',related2_path:'../../10-hrf-sigint/hrf-radio-telescope/index.html',related3_name:'\\u0645\\u062d\\u0627\\u0643\\u064a IMSI',related3_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u0627\\u0639\\u062a\\u0631\\u0627\\u0636 \\u0627\\u0644\\u0627\\u062a\\u0635\\u0627\\u0644\\u0627\\u062a',related3_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'منطقة تصادم TX مزدوج',pathPrev_path:'../../12-hrf-esp32/esp-collision-visualizer/index.html',pathNext_name:'حالة بث SDR',pathNext_path:'../../12-hrf-esp32/esp-rf-bridge/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'بماذا تُقاس التردد؟',quiz_q1a:'أمتار',quiz_q1b:'هرتز',quiz_q1c:'واط',quiz_q1d:'فولت',quiz_q1_answer:'1',quiz_q2:'ما هو الطيف الكهرومغناطيسي؟',quiz_q2a:'نوع هوائي',quiz_q2b:'نطاق جميع الترددات الكهرومغناطيسية',quiz_q2c:'مخطط موجات صوتية',quiz_q2d:'عجلة ألوان',quiz_q2_answer:'1',quiz_q3:'ماذا يعرض محلل الطيف؟',quiz_q3a:'الحرارة',quiz_q3b:'سعة الإشارة مقابل التردد',quiz_q3c:'حركة الشبكة',quiz_q3d:'مستوى البطارية',quiz_q3_answer:'1',quiz_q4:'ما هي الشبكة العصبية؟',quiz_q4a:'أسلاك مادية',quiz_q4b:'نظام حوسبة مستوحى من الخلايا العصبية',quiz_q4c:'شبكة اجتماعية',quiz_q4d:'شبكة راديو',quiz_q4_answer:'1',quiz_q5:'ما إمكانيات ESP32 اللاسلكية؟',quiz_q5a:'واي فاي فقط',quiz_q5b:'بلوتوث فقط',quiz_q5c:'واي فاي وبلوتوث',quiz_q5d:'لا شيء',quiz_q5_answer:'2',realworldTitle:'🌍 قصص واقعية',realworld1:'في عام 2017 جعل انتحال GPS في البحر الأسود أكثر من 20 سفينة تعتقد أنها على بعد 25 ميلاً داخل البر في مطار.',realworld2:'في عام 2015 أثبت باحثون أن جهاز SDR بقيمة 20 دولارًا يمكنه تتبع كل طائرة في النطاق عبر فك تشفير إشارات ADS-B غير المشفرة.',realworld3:'دمرت دودة ستكسنت (2010) ألف جهاز طرد مركزي نووي إيراني من خلال التلاعب بوحدات التحكم المنطقية عبر أقراص USB مصابة.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الملاحة الراديوية معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الملاحة الراديوية وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'📶 LoRa Lab يوضح مفهومًا أساسيًا في الملاحة الراديوية. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في 📶 LoRa Lab لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في الملاحة الراديوية هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ SDR وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال الملاحة الراديوية يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';

/* ═══════ THEME MELODIES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],zellige:[440,523,659],andalus:[294,370,440],
  space:[523,659,784],jungle:[262,330,392],robot:[440,554,659],
  riad:[349,440,523],medina:[294,349,440],retro:[523,262,523]
};
function playThemeMelody(name){
  if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx();
  const notes=THEME_MELODIES[name]||THEME_MELODIES['mosque-gold'];
  notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;o.type='sine';
    g.gain.value=0.06;const t=audioCtx.currentTime+i*0.15;
    g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);});
}

/* ═══════ SPLASH ═══════ */
function dismissSplash(){const s=$('splash');if(s)s.style.opacity='0';setTimeout(()=>{if(s)s.style.display='none'},500);}
setTimeout(dismissSplash,3000);

/* ═══════ i18n ENGINE ═══════ */
function setLanguage(lang){
  currentLang=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(LANG[lang]&&LANG[lang][k])el.textContent=LANG[lang][k];
  });
  localStorage.setItem('lora-lang',lang);
  log(LANG[lang]?.langChanged||'Language changed','info');
}

/* ═══════ THEME ENGINE ═══════ */
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('lora-theme',name);
  playThemeMelody(name);
  log((LANG[currentLang]?.themeChanged||'Theme →')+' '+name,'info');
}

/* ═══════ LOG ═══════ */
function log(msg,type='info'){
  const c=$('logContainer'); if(!c)return;
  const line=document.createElement('div');
  line.className='log-line log-'+type;
  const ts=new Date().toLocaleTimeString();
  line.innerHTML=`<span class="log-ts">${ts}</span> <span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line); c.scrollTop=c.scrollHeight;
}

/* ═══════ TOAST ═══════ */
function showToast(msg,ms){
  const t=$('toastIndicator'),m=$('toastMessage');
  if(m)m.textContent=msg; if(t)t.classList.add('show');
  if(ms)setTimeout(hideToast,ms);
}
function hideToast(){const t=$('toastIndicator');if(t)t.classList.remove('show');}

/* ═══════ STATUS ═══════ */
function setStatus(on){
  const d=$('statusDot'),t=$('statusText');
  if(d){d.style.background=on?'#0f0':'#f44';}
  if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||'';
}

/* ═══════ PANELS ═══════ */
function openHelp(){$('helpPanel')?.classList.add('open');$('helpOverlay')?.classList.add('show');}
function closeHelp(){$('helpPanel')?.classList.remove('open');$('helpOverlay')?.classList.remove('show');}
function openSettings(){$('settingsPanel')?.classList.add('open');$('settingsOverlay')?.classList.add('show');}
function closeSettings(){$('settingsPanel')?.classList.remove('open');$('settingsOverlay')?.classList.remove('show');}
function openLog(){$('logPanel')?.classList.add('open');}
function closeLog(){$('logPanel')?.classList.remove('open');}
function toggleLog(){$('logPanel')?.classList.toggle('open');}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}

/* ═══════ LORA SIMULATION ═══════ */
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;
let wfData = [];
let chirpActive = false;
let chirpPhase = 0;
let animFrame;

function getLoraParams() {
  const sf = parseInt($('sfSelect')?.value || 12);
  const bw = parseInt($('bwSelect')?.value || 125);
  const power = parseInt($('powerSelect')?.value || 20);
  const dataRate = Math.round(sf * (bw * 1000) / Math.pow(2, sf) * 0.8);
  const snrTable = {7:-7.5,8:-10,9:-12.5,10:-15,11:-17.5,12:-20};
  const sensitivity = -174 + 10*Math.log10(bw*1000) + 6 + (snrTable[sf]||-20);
  const linkBudget = power - sensitivity;
  const range = Math.pow(10, (linkBudget - 32.44 - 20*Math.log10(868)) / 20);
  const tSym = Math.pow(2,sf) / (bw*1000) * 1000;
  const nSym = 8 + Math.max(Math.ceil((80-4*sf+28)/(4*sf))*5, 0);
  const airtime = Math.round((12.25+nSym)*tSym);
  return {sf,bw,power,dataRate,sensitivity:Math.round(sensitivity),range:range.toFixed(1),airtime,linkBudget:Math.round(linkBudget)};
}

function updateRangeDisplay(){
  const p=getLoraParams();
  const rv=$('rangeValue'),dr=$('dataRateValue'),at=$('airtimeValue');
  if(rv)rv.textContent=p.range+' km';
  if(dr)dr.textContent=p.dataRate+' bps';
  if(at)at.textContent=p.airtime+' ms';
}

function initWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height; wfData=[];
  for(let i=0;i<H;i++){const row=new Float32Array(W);for(let x=0;x<W;x++)row[x]=Math.random()*0.05;wfData.push(row);}
}

function addChirpLine(sf){
  if(!wfCtx)return;
  const W=wfCanvas.width;
  const row=new Float32Array(W);
  for(let x=0;x<W;x++)row[x]=Math.random()*0.08;
  if(chirpActive){
    const cw=W/(sf-5), center=chirpPhase%W;
    for(let i=-cw/2;i<cw/2;i++){
      const idx=Math.floor((center+i+W)%W);
      if(idx>=0&&idx<W){const d=Math.abs(i)/(cw/2);row[idx]=Math.max(row[idx],(1-d*d)*0.9+Math.random()*0.1);}
    }
    chirpPhase+=W/(sf*2);
  }
  wfData.push(row);
  if(wfData.length>wfCanvas.height)wfData.shift();
}

function drawWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height;
  const img=wfCtx.createImageData(W,H);
  for(let y=0;y<Math.min(wfData.length,H);y++){
    const row=wfData[y];
    for(let x=0;x<W;x++){
      const v=row[x],idx=(y*W+x)*4;
      if(v<0.25){img.data[idx]=0;img.data[idx+1]=Math.floor(v*4*255);img.data[idx+2]=255;}
      else if(v<0.5){img.data[idx]=0;img.data[idx+1]=255;img.data[idx+2]=Math.floor((1-(v-0.25)*4)*255);}
      else if(v<0.75){img.data[idx]=Math.floor((v-0.5)*4*255);img.data[idx+1]=255;img.data[idx+2]=0;}
      else{img.data[idx]=255;img.data[idx+1]=Math.floor((1-(v-0.75)*4)*255);img.data[idx+2]=0;}
      img.data[idx+3]=255;
    }
  }
  wfCtx.putImageData(img,0,0);
  wfCtx.fillStyle='rgba(255,255,255,0.7)';wfCtx.font='10px Orbitron,monospace';
  wfCtx.fillText('868.0 MHz',5,12);wfCtx.fillText('868.125 MHz',W-80,12);
}

function drawRangeGraph(){
  const canvas=$('rangeCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(i*W/10,0);ctx.lineTo(i*W/10,H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*H/10);ctx.lineTo(W,i*H/10);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='11px Orbitron,monospace';
  ctx.fillText('TX Power (dBm)',W/2-50,H-5);
  ctx.save();ctx.rotate(-Math.PI/2);ctx.fillText('Range (km)',-H/2-30,14);ctx.restore();
  const sfs=[{sf:7,color:'#0f0'},{sf:9,color:'#44f'},{sf:12,color:'#a0f'}];
  const powers=[2,5,8,10,12,14,17,20],maxRange=25;
  sfs.forEach(({sf,color})=>{
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    powers.forEach((p,i)=>{
      const snr={7:-7.5,9:-12.5,12:-20};const sens=-174+10*Math.log10(125000)+6+snr[sf];
      const lb=p-sens;const range=Math.pow(10,(lb-32.44-20*Math.log10(868))/20);
      const x=40+(p-2)/18*(W-60),y=H-30-Math.min(range,maxRange)/maxRange*(H-50);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });ctx.stroke();
    ctx.fillStyle=color;
    powers.forEach(p=>{
      const snr={7:-7.5,9:-12.5,12:-20};const sens=-174+10*Math.log10(125000)+6+snr[sf];
      const lb=p-sens;const range=Math.pow(10,(lb-32.44-20*Math.log10(868))/20);
      const x=40+(p-2)/18*(W-60),y=H-30-Math.min(range,maxRange)/maxRange*(H-50);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
    });
  });
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='9px monospace';
  powers.forEach(p=>{const x=40+(p-2)/18*(W-60);ctx.fillText(p+'',x-5,H-18);});
  for(let r=0;r<=maxRange;r+=5){const y=H-30-r/maxRange*(H-50);ctx.fillText(r+'km',2,y+3);}
}

function sendLoraMessage(){
  const msg=$('msgInput')?.value||'HELLO';
  if(!msg.trim())return;
  const p=getLoraParams();
  chirpActive=true;chirpPhase=0;playSound('click');
  log(`TX [SF${p.sf}/${p.bw}kHz/${p.power}dBm] "${msg}" — ${p.airtime}ms airtime`,'tx');
  setStatus(true);showToast(LANG[currentLang]?.msgSent||'Sent',2000);
  const ll=$('loraLog');
  if(ll){
    const ts=new Date().toLocaleTimeString();
    ll.innerHTML+=`<div style="margin-bottom:4px;color:#0f0">📡 ${ts} TX SF${p.sf} BW${p.bw} PWR${p.power} → "${msg}" [${p.airtime}ms]</div>`;
    setTimeout(()=>{
      const rssi=-40-Math.random()*80,snr=10-Math.random()*15;
      ll.innerHTML+=`<div style="margin-bottom:4px;color:#4af">📥 ${new Date().toLocaleTimeString()} RX RSSI:${rssi.toFixed(0)}dBm SNR:${snr.toFixed(1)}dB → "${msg}"</div>`;
      log(`RX "${msg}" RSSI:${rssi.toFixed(0)}dBm SNR:${snr.toFixed(1)}dB`,'rx');
      ll.scrollTop=ll.scrollHeight;
    },p.airtime+500);
  }
  setTimeout(()=>{chirpActive=false;},p.airtime+200);
  $('msgInput').value='';
}

function animate(){addChirpLine(getLoraParams().sf);drawWaterfall();animFrame=requestAnimationFrame(animate);}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const lw=$('logoWrap'),sl=$('splashLogo');
  if(lw)lw.innerHTML=LOGO_SVG;if(sl)sl.innerHTML=LOGO_SVG;
  const savedLang=localStorage.getItem('lora-lang')||'en';
  const savedTheme=localStorage.getItem('lora-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',openHelp);
  $('helpCloseBtn')?.addEventListener('click',closeHelp);
  $('helpOverlay')?.addEventListener('click',closeHelp);
  $('settingsBtn')?.addEventListener('click',openSettings);
  $('settingsCloseBtn')?.addEventListener('click',closeSettings);
  $('settingsOverlay')?.addEventListener('click',closeSettings);
  $('logBtn')?.addEventListener('click',toggleLog);
  $('logCloseBtn')?.addEventListener('click',closeLog);
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked;});
  $('sendBtn')?.addEventListener('click',sendLoraMessage);
  $('msgInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendLoraMessage();});
  $('sfSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});
  $('bwSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});
  $('powerSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});

  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log(LANG[currentLang]?.logCleared||'Cleared','info');});
  $('copyLogBtn')?.addEventListener('click',()=>{
    navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast(LANG[currentLang]?.copied||'Copied',1500)).catch(()=>showToast(LANG[currentLang]?.copyFail||'Failed',1500));
  });
  $('exportLogBtn')?.addEventListener('click',()=>{
    const blob=new Blob([$('logContainer')?.innerText||''],{type:'text/plain'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lora-lab-log.txt';a.click();
  });

  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none';});
    });
  });

  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const tgt=tab.dataset.tab;
      if(tgt==='faq')$('helpFaq')?.classList.add('active');
      if(tgt==='howto')$('helpHowto')?.classList.add('active');
      if(tgt==='wiki')$('helpWiki')?.classList.add('active');
    });
  });

  initWaterfall();updateRangeDisplay();drawRangeGraph();animate();
  setStatus(false);log(LANG[currentLang]?.ready||'Ready','success');

  setInterval(()=>{
    if(!chirpActive&&Math.random()<0.3){chirpActive=true;chirpPhase=Math.random()*(wfCanvas?.width||800);setTimeout(()=>{chirpActive=false;},500+Math.random()*1000);}
  },3000);
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — LoRa Lab: Chirp spread spectrum with
   upchirp/downchirp visualization, spreading factor display,
   and long-range signal propagation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simLoraCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const chirps=[],waveRings=[];let sf=7,bw=125,txCount=0;
  const SFs=[7,8,9,10,11,12];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080812;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  /* Chirp signal — frequency sweep */
  class Chirp{
    constructor(up){this.up=up;this.x=up?40:W-40;this.progress=0;this.speed=0.005+Math.random()*0.005;this.alive=true;this.sf=sf;this.y=H/2;}
    update(){this.progress+=this.speed;if(this.progress>=1)this.alive=false;return this.alive;}
    draw(){
      const startX=this.up?40:W-40,endX=this.up?W-40:40;
      const px=startX+(endX-startX)*this.progress;
      // Draw chirp waveform
      ctx.beginPath();
      const samples=60;
      for(let i=0;i<=samples;i++){
        const t=i/samples*this.progress;
        const sx=startX+(endX-startX)*t;
        const freq=this.up?(0.5+t*3):(3.5-t*3);
        const amp=20*(1-Math.abs(t-this.progress)*3);
        const sy=this.y+Math.sin(t*freq*30+frameCount*0.1)*Math.max(0,amp);
        if(i===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);
      }
      ctx.strokeStyle=this.up?'rgba(0,200,255,0.6)':'rgba(255,150,0,0.6)';ctx.lineWidth=2;ctx.stroke();
      // Head dot
      ctx.beginPath();ctx.arc(px,this.y,5,0,Math.PI*2);ctx.fillStyle=this.up?'#0cf':'#f90';ctx.fill();
      ctx.font='7px monospace';ctx.fillStyle=this.up?'#0cf':'#f90';ctx.textAlign='center';
      ctx.fillText(this.up?'UPCHIRP':'DOWNCHIRP',px,this.y-14);
    }
  }

  /* Long range signal ring */
  class WaveRing{
    constructor(x,y){this.x=x;this.y=y;this.r=10;this.maxR=200;this.alpha=0.4;}
    update(){this.r+=0.5;this.alpha=0.4*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.strokeStyle='rgba(0,200,255,'+this.alpha+')';ctx.lineWidth=1;ctx.stroke();}
  }

  /* Frequency-time spectrogram at bottom */
  function drawSpectrogram(){
    const sh=60,sy=H-sh-20;
    ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,sy,W,sh);
    ctx.strokeStyle='#fff1';ctx.strokeRect(0,sy,W,sh);
    // Moving chirp pattern
    const sliceW=3;
    for(let x=0;x<W;x+=sliceW){
      const t=(x+frameCount*2)%W/W;
      const freq=t*sh;
      ctx.fillStyle='rgba(0,180,255,'+(0.1+Math.sin(t*Math.PI)*0.2)+')';
      ctx.fillRect(x,sy+sh-freq-2,sliceW,3);
      // Mirror downchirp
      ctx.fillStyle='rgba(255,150,0,'+(0.05+Math.cos(t*Math.PI)*0.1)+')';
      ctx.fillRect(x,sy+freq,sliceW,3);
    }
    ctx.font='7px monospace';ctx.fillStyle='#666';ctx.textAlign='left';ctx.fillText('Freq',4,sy+10);ctx.fillText('Time \u2192',W-40,sy+sh-4);
  }

  /* Gateway and end-device */
  function drawDevices(){
    // End device (left)
    ctx.save();ctx.shadowColor='#0cf';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(40,H/2,16,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.15)';ctx.fill();ctx.strokeStyle='#0cf';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4E1}',40,H/2);
    ctx.font='7px monospace';ctx.fillStyle='#0cf';ctx.fillText('End Device',40,H/2+24);ctx.restore();
    // Gateway (right)
    ctx.save();ctx.shadowColor='#6bcb77';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(W-40,H/2,16,0,Math.PI*2);ctx.fillStyle='rgba(107,203,119,0.15)';ctx.fill();ctx.strokeStyle='#6bcb77';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F3F0}',W-40,H/2);
    ctx.font='7px monospace';ctx.fillStyle='#6bcb77';ctx.fillText('Gateway',W-40,H/2+24);ctx.restore();
  }

  function drawSFIndicator(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-50,8,100,30);ctx.strokeStyle='#0cf3';ctx.strokeRect(W/2-50,8,100,30);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='center';ctx.fillText('SF'+sf+' BW'+bw+'kHz',W/2,28);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,175,56);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,175,56);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='left';ctx.fillText('LORA LAB',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('SF: '+sf+'  BW: '+bw+'kHz',16,40);ctx.fillText('Transmissions: '+txCount,16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,18,0.14)';ctx.fillRect(0,0,W,H);
    // Cycle SF
    if(frameCount%300===0){sf=SFs[Math.floor(Math.random()*SFs.length)];bw=[125,250,500][Math.floor(Math.random()*3)];}
    // Spawn chirps
    if(frameCount%80===0){chirps.push(new Chirp(true));waveRings.push(new WaveRing(40,H/2));txCount++;}
    if(frameCount%120===0){chirps.push(new Chirp(false));waveRings.push(new WaveRing(W-40,H/2));}
    for(let i=waveRings.length-1;i>=0;i--){if(!waveRings[i].update())waveRings.splice(i,1);else waveRings[i].draw();}
    drawDevices();
    for(let i=chirps.length-1;i>=0;i--){if(!chirps[i].update())chirps.splice(i,1);else chirps[i].draw();}
    drawSpectrogram();drawSFIndicator();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
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
