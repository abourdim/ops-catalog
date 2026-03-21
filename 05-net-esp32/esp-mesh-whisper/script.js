/**
 * Workshop DIY — esp-mesh-whisper v1.0
 * Self-Healing Mesh Network Simulation
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/></svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAA+ElEQVR42u3a0Q0AIQwDwO5/aToCH0goxDe1SH2tAwAAAAAAAAAAgJ+bvj8wJz8+RzgBz38AJ+D5D+AEPP8BnICffwAAAAAAAAAAnIDnP4AT8PwHcAKe/wBOwPMfAAAAAAAAAADgBDz/AZyA5z+AE/D8B3ACnv8AAAAAAAAAADgBz38AJ+D5D+AEPP8BnIDnPwAAAAAAAAAAwAl4/gM4Ac9/ACfg+Q/gBDz/AQAAAAAAAABwAp7/AE7A8x/ACXj+AzgBz38AAAAAAAAAAIAT8PwHcAKe/wBOwPMfwAl4/gMAAAAAAAAA4AQ8/wGcgOc/gBPw/AdwAp7/AAAAAAAAAMCJDz2VFRCvlLkAAAAASUVORK5CYII=';

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
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); const o2 = audioCtx.createOscillator(); const g2 = audioCtx.createGain(); o2.connect(g2); g2.connect(audioCtx.destination); g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine'; g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o2.start(t + 0.15); o2.stop(t + 0.4); break;
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
    title: 'Mesh Whisper', subtitle: '🕸️ mesh · 🔄 heal · 💬 whisper',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Mesh Whisper — Self-Healing Mesh', mainDesc: 'Messages hop node to node, mesh reroutes around failures',
    sectionA: 'How It Works', sectionB: 'Topology Lab', sectionC: 'Challenge',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    msgPlaceholder: 'Message to whisper...',
    sendBtn: 'Send', killBtn: 'Kill Node', healBtn: 'Heal All', resetBtn: 'Reset',
    howStep1: 'ESP32 nodes form a mesh network, each connecting to nearby neighbors.',
    howStep2: 'Messages use BFS routing to find the shortest path between nodes.',
    howStep3: 'When a node dies, the mesh detects the failure and reroutes traffic.',
    howStep4: 'Self-healing rebuilds links automatically when nodes come back online.',
    challenge1: 'What happens when you kill a critical bridge node?',
    challenge2: 'Why does BFS find the shortest path?',
    challenge3: 'How can a mesh network survive multiple node failures?',
    challengeReveal1: 'The mesh splits into two partitions. Messages between partitions fail until the node heals or new links form.',
    challengeReveal2: 'BFS explores all neighbors at distance 1 before distance 2, guaranteeing the first path found is the shortest in an unweighted graph.',
    challengeReveal3: 'Redundancy! Each node connects to multiple neighbors, creating alternate paths. The more connections, the more resilient the mesh.',
    revealBtn: 'Reveal Answer',
    avgHops: 'Avg Hops:', meshDensity: 'Mesh Density:', deadNodes: 'Dead Nodes:',
    howto_1:'The main display shows the Mesh Whisper simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how ESP32 nodes form a mesh network, each connecting to nearby n',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_mesh_title: '🕸️ Mesh Topology', wiki_mesh: 'Each node connects to nearby neighbors. Messages hop from node to node using BFS routing.',
    wiki_bfs_title: '🔍 BFS Routing', wiki_bfs: 'Breadth-First Search explores all neighbors before going deeper, finding the shortest path in unweighted graphs.',
    wiki_heal_title: '🔄 Self-Healing', wiki_heal: 'When nodes fail, the mesh detects broken links and finds alternate routes. Recovered nodes rejoin automatically.',
    wiki_esp_title: '📡 ESP-MESH', wiki_esp: 'ESP-MESH supports up to 1000 nodes. Each node can be both a station and an AP simultaneously.',
    working: 'Working…',
    noMsg: 'Enter a message first', noPath: 'No path found!', selectNodes: 'Click two nodes on the canvas first',
    msgSent: 'Message delivered!', nodeKilled: 'Node killed!', meshHealed: 'Mesh healed!', meshReset: 'Mesh reset!',
    sending: 'Routing message...', healing: 'Healing mesh...',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🕸️ Mesh Whisper ready — click nodes to select source & destination!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    chatPlaceholder: 'Talk to the robot...', splashHint: 'tap to skip', newVersion: 'UPDATE',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',step1Title:'Scan',step1Desc:'ESP32 nodes form a mesh network, each connecting to nearby neighbors. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Capture',step2Desc:'Messages use BFS routing to find the shortest path between nodes. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Analyze',step3Desc:'When a node dies, the mesh detects the failure and reroutes traffic. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Report',step4Desc:'Self-healing rebuilds links automatically when nodes come back online. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Mesh Whisper?',faq_a1:'Mesh Whisper is an interactive simulation that demonstrates network security concepts. Messages hop node to node, mesh reroutes around failures. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real networking behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real networking principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Arp Detective and Esp Captive Portal. Each app in this category teaches a different aspect of networking. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',demo_s1:'Welcome to Mesh Whisper! Look at the main display — this is where the networking simulation runs.',demo_s2:'Click on the mesh canvas to select source and destination nodes. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols. The simulation brings this concept to life through interactive visualization. Instead of reading about it in a textbook, you see it happen in real time and control the variables yourself.',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet. This principle connects to many real-world applications. Engineers, researchers, and security professionals use this knowledge daily. The hands-on experience here builds practical understanding.',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Mesh Whisper! This is like a science experiment on your computer. You get to control a real network security simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how ESP32 nodes form a mesh network, each connecting t Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Mesh Whisper: Messages hop node to node, mesh reroutes around failures. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Topology Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Swarm Net — ESP-NOW Fleet',related1_desc:'Coordinated swarm intelligence with browser command center',related1_path:'../../08-net-multi/esp-swarm-net/index.html',related2_name:'Consensus Lab — Raft/PBFT',related2_desc:'Visualize distributed consensus with elections and replication',related2_path:'../../08-net-multi/esp-consensus-lab/index.html',related3_name:'Dead Drop — BLE Message Transfer',related3_desc:'Encrypt and exchange secret messages via BLE simulation',related3_path:'../../50-civilization-hacks/civ-locust-swarm-radar/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'ESP Honeypot — Fake Services',pathPrev_path:'../../05-net-esp32/esp-honeypot/index.html',pathNext_name:'Network Cartographer — Radio Landscape',pathNext_path:'../../05-net-esp32/esp-network-cartographer/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is machine learning?',quiz_q1a:'Programming robots',quiz_q1b:'Systems that learn from data',quiz_q1c:'Manual computation',quiz_q1d:'Hardware design',quiz_q1_answer:'1',quiz_q2:'How many layers does the OSI model have?',quiz_q2a:'4',quiz_q2b:'5',quiz_q2c:'7',quiz_q2d:'10',quiz_q2_answer:'2',quiz_q3:'What layer does TCP operate on in the OSI model?',quiz_q3a:'Physical',quiz_q3b:'Data Link',quiz_q3c:'Network',quiz_q3d:'Transport',quiz_q3_answer:'3',quiz_q4:'What is the ESP32\'s CPU architecture?',quiz_q4a:'ARM',quiz_q4b:'Xtensa dual-core',quiz_q4c:'RISC-V only',quiz_q4d:'x86',quiz_q4_answer:'1',quiz_q5:'What does IP stand for?',quiz_q5a:'Internet Protocol',quiz_q5b:'Internal Program',quiz_q5c:'Input Process',quiz_q5d:'Information Path',quiz_q5_answer:'0',realworldTitle:'🌍 Real-World Stories',realworld1:'The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.',realworld2:'Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.',realworld3:'Alan Turing\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In steganography, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in steganography and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Mesh Whisper demonstrates a fundamental concept in steganography. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Mesh Whisper have direct real-world applications. Professionals in steganography use these same concepts daily. In industry, browser and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with steganography carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.'},
    wiki_history_title: '📜 History of Rf Security',
    wiki_history: 'DARPA funded early mesh research in the 1990s. Zigbee mesh (2004) and Thread (2015) brought mesh to IoT. WiFi mesh systems became popular for home networking. Mesh Whisper builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Mesh Whisper',
    wiki_math: 'The mathematics behind Mesh Whisper: In a mesh of N nodes, maximum links = N(N-1)/2. Routing algorithms (AODV, OLSR) find optimal paths. Flooding requires O(N) transmissions per message.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced RF security practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to RF security. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with RF security: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in RF security.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Rf Security carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Self-Healing',
    gloss1_def: 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
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
    theory: 'Mesh Whisper demonstrates key principles from network security. Mesh networks connect nodes in a many-to-many topology. Each node can relay traffic for others, creating self-healing paths. No single point of failure. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world RF security?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional RF security systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Mesh Whisper', subtitle: '🕸️ maillage · 🔄 guérir · 💬 murmurer',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Mesh Whisper — Maillage Auto-Réparant', mainDesc: 'Les messages sautent de noeud en noeud, le maillage contourne les pannes',
    sectionA: 'Comment ça marche', sectionB: 'Labo Topologie', sectionC: 'Défi',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    msgPlaceholder: 'Message à murmurer...',
    sendBtn: 'Envoyer', killBtn: 'Tuer Noeud', healBtn: 'Guérir Tout', resetBtn: 'Réinitialiser',
    howStep1: 'Les noeuds ESP32 forment un maillage réseau, chacun se connectant aux voisins proches.',
    howStep2: 'Les messages utilisent le routage BFS pour trouver le chemin le plus court.',
    howStep3: 'Quand un noeud meurt, le maillage détecte la panne et reroute le trafic.',
    howStep4: 'L\'auto-guérison reconstruit les liens quand les noeuds reviennent en ligne.',
    challenge1: 'Que se passe-t-il quand vous tuez un noeud pont critique ?',
    challenge2: 'Pourquoi BFS trouve-t-il le chemin le plus court ?',
    challenge3: 'Comment un maillage peut-il survivre à plusieurs pannes ?',
    challengeReveal1: 'Le maillage se divise en deux partitions. Les messages échouent jusqu\'à la guérison du noeud.',
    challengeReveal2: 'BFS explore tous les voisins à distance 1 avant distance 2, garantissant le chemin le plus court.',
    challengeReveal3: 'Redondance ! Chaque noeud se connecte à plusieurs voisins, créant des chemins alternatifs.',
    revealBtn: 'Révéler',
    avgHops: 'Sauts Moy:', meshDensity: 'Densité:', deadNodes: 'Noeuds Morts:',
    howto_1:'L écran principal affiche la simulation Mesh Whisper. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how ESP32 nodes form a mesh network, each connecting to nearby n',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_mesh_title: '🕸️ Topologie Maillage', wiki_mesh: 'Chaque noeud se connecte aux voisins. Les messages sautent de noeud en noeud via BFS.',
    wiki_bfs_title: '🔍 Routage BFS', wiki_bfs: 'La recherche en largeur explore tous les voisins avant d\'aller plus profond.',
    wiki_heal_title: '🔄 Auto-Guérison', wiki_heal: 'Quand les noeuds tombent, le maillage trouve des routes alternatives.',
    wiki_esp_title: '📡 ESP-MESH', wiki_esp: 'ESP-MESH supporte jusqu\'à 1000 noeuds simultanément.',
    working: 'En cours…',
    noMsg: 'Entrez un message', noPath: 'Aucun chemin trouvé !', selectNodes: 'Cliquez d\'abord deux noeuds',
    msgSent: 'Message livré !', nodeKilled: 'Noeud tué !', meshHealed: 'Maillage guéri !', meshReset: 'Maillage réinitialisé !',
    sending: 'Routage du message...', healing: 'Guérison du maillage...',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🕸️ Mesh Whisper prêt — cliquez les noeuds pour sélectionner source et destination !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Réactif musique',
    chatPlaceholder: 'Parle au robot...', splashHint: 'appuyer pour passer', newVersion: 'MAJ',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',step1Title:'Scanner',step1Desc:'Les noeuds ESP32 forment un maillage réseau, chacun se connectant aux voisins proches.',step2Title:'Capturer',step2Desc:'Les messages utilisent le routage BFS pour trouver le chemin le plus court. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Analyser',step3Desc:'Quand un noeud meurt, le maillage détecte la panne et reroute le trafic. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Rapporter',step4Desc:'L\'auto-guérison reconstruit les liens quand les noeuds reviennent en ligne. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Mesh Whisper ?',faq_a1:'Mesh Whisper est une simulation interactive qui démontre les concepts de sécurité réseau. Messages hop node to node, mesh reroutes around failures. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de réseaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de réseaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de réseaux. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',demo_s1:'Bienvenue dans Mesh Whisper ! Regarde l\'écran principal — c\'est ici que la simulation de réseaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de réseaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles. La simulation donne vie à ce concept par la visualisation interactive. Au lieu de le lire dans un livre, vous le voyez se produire en temps réel et contrôlez les variables.',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets. Ce principe se connecte à de nombreuses applications réelles. Les ingénieurs et chercheurs utilisent ces connaissances quotidiennement.',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'How to discover devices and services on a network. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'How to spot and stop network attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Mesh Whisper ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de sécurité réseau — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how ESP32 nodes form a mesh network, each connecting t Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de réseaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Trace de Paquets',ch1Desc:'Envoie un message et trace chaque saut. Combien de nœuds traverse-t-il ? Que se passe-t-il si un tombe ?',ch2Title:'Chasse à la Latence',ch2Desc:'Trouve le goulot d\'étranglement en mesurant la latence à chaque nœud. Quel lien est le plus lent et pourquoi ?',ch3Title:'Audit de Sécurité',ch3Desc:'Trouve le canal non chiffré dans le réseau. Quelles informations vois-tu ? Comment le corriger ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',purpose:'Mesh Whisper : Messages hop node to node, mesh reroutes around failures. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Swarm Net — Flotte ESP-NOW',related1_desc:'Intelligence d\\',related1_path:'../../08-net-multi/esp-swarm-net/index.html',related2_name:'Labo Consensus — Raft/PBFT',related2_desc:'Visualisez le consensus distribué avec élections et réplication',related2_path:'../../08-net-multi/esp-consensus-lab/index.html',related3_name:'Dead Drop — Transfert BLE',related3_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related3_path:'../../50-civilization-hacks/civ-locust-swarm-radar/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'ESP Honeypot — Faux Services',pathPrev_path:'../../05-net-esp32/esp-honeypot/index.html',pathNext_name:'Cartographe Réseau — Paysage Radio',pathNext_path:'../../05-net-esp32/esp-network-cartographer/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q1a:'Programmer des robots',quiz_q1b:'Systèmes apprenant des données',quiz_q1c:'Calcul manuel',quiz_q1d:'Conception matérielle',quiz_q1_answer:'1',quiz_q2:'Combien de couches a le modèle OSI ?',quiz_q2a:'4',quiz_q2b:'5',quiz_q2c:'7',quiz_q2d:'10',quiz_q2_answer:'2',quiz_q3:'Sur quelle couche OSI opère TCP ?',quiz_q3a:'Physique',quiz_q3b:'Liaison',quiz_q3c:'Réseau',quiz_q3d:'Transport',quiz_q3_answer:'3',quiz_q4:'Quelle est l\'architecture CPU de l\'ESP32 ?',quiz_q4a:'ARM',quiz_q4b:'Xtensa double coeur',quiz_q4c:'RISC-V uniquement',quiz_q4d:'x86',quiz_q4_answer:'1',quiz_q5:'Que signifie IP ?',quiz_q5a:'Internet Protocol',quiz_q5b:'Internal Program',quiz_q5c:'Input Process',quiz_q5d:'Information Path',quiz_q5_answer:'0',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.',realworld2:'Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.',realworld3:'L\'équipe d\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En stéganographie, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en stéganographie et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Mesh Whisper illustre un concept fondamental en stéganographie. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Mesh Whisper ont des applications directes dans le monde réel. Les professionnels de stéganographie utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, browser et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en stéganographie implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
    wiki_history_title: '📜 Histoire de sécurité RF',
    wiki_history: 'DARPA funded early mesh research in the 1990s. Zigbee mesh (2004) and Thread (2015) brought mesh to IoT. WiFi mesh systems became popular for home networking. Mesh Whisper s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Mesh Whisper',
    wiki_math: 'Les mathématiques derrière Mesh Whisper : In a mesh of N nodes, maximum links = N(N-1)/2. Routing algorithms (AODV, OLSR) find optimal paths. Flooding requires O(N) transmissions per message.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de sécurité RF utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour sécurité RF. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en sécurité RF : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Sécurité rf implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Self-Healing',
    gloss1_def: 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
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
    theory: 'Mesh Whisper démontre les principes clés de sécurité réseau. Mesh networks connect nodes in a many-to-many topology. Each node can relay traffic for others, creating self-healing paths. No single point of failure. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec RF security dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'Mesh Whisper', subtitle: '🕸️ شبكة · 🔄 شفاء · 💬 همس',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'Mesh Whisper — شبكة ذاتية الإصلاح', mainDesc: 'الرسائل تقفز من عقدة لعقدة، الشبكة تعيد التوجيه حول الأعطال',
    sectionA: 'كيف يعمل', sectionB: 'مختبر الطوبولوجيا', sectionC: 'التحدي',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    msgPlaceholder: 'رسالة للهمس...',
    sendBtn: 'إرسال', killBtn: 'قتل عقدة', healBtn: 'شفاء الكل', resetBtn: 'إعادة تعيين',
    howStep1: 'عقد ESP32 تشكل شبكة متداخلة، كل عقدة تتصل بالجيران القريبين.',
    howStep2: 'الرسائل تستخدم توجيه BFS لإيجاد أقصر مسار بين العقد.',
    howStep3: 'عندما تموت عقدة، الشبكة تكتشف العطل وتعيد توجيه حركة المرور.',
    howStep4: 'الإصلاح الذاتي يعيد بناء الروابط تلقائياً عندما تعود العقد.',
    challenge1: 'ماذا يحدث عندما تقتل عقدة جسر حرجة؟',
    challenge2: 'لماذا يجد BFS أقصر مسار؟',
    challenge3: 'كيف يمكن للشبكة أن تنجو من أعطال متعددة؟',
    challengeReveal1: 'الشبكة تنقسم إلى قسمين. الرسائل بين الأقسام تفشل حتى تُشفى العقدة.',
    challengeReveal2: 'BFS يستكشف كل الجيران على مسافة 1 قبل مسافة 2، مما يضمن أقصر مسار.',
    challengeReveal3: 'التكرار! كل عقدة تتصل بعدة جيران، مما يخلق مسارات بديلة.',
    revealBtn: 'اكشف الإجابة',
    avgHops: 'متوسط القفزات:', meshDensity: 'كثافة الشبكة:', deadNodes: 'العقد الميتة:',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Mesh Whisper. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how ESP32 nodes form a mesh network, each connecting to nearby n',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_mesh_title: '🕸️ طوبولوجيا الشبكة', wiki_mesh: 'كل عقدة تتصل بالجيران. الرسائل تقفز عبر توجيه BFS.',
    wiki_bfs_title: '🔍 توجيه BFS', wiki_bfs: 'البحث بالعرض يستكشف كل الجيران قبل التعمق.',
    wiki_heal_title: '🔄 الإصلاح الذاتي', wiki_heal: 'عند فشل العقد، الشبكة تجد مسارات بديلة.',
    wiki_esp_title: '📡 ESP-MESH', wiki_esp: 'ESP-MESH يدعم حتى 1000 عقدة في وقت واحد.',
    working: 'جارٍ…',
    noMsg: 'أدخل رسالة أولاً', noPath: 'لا مسار متاح!', selectNodes: 'انقر عقدتين أولاً',
    msgSent: 'تم توصيل الرسالة!', nodeKilled: 'تم قتل العقدة!', meshHealed: 'تم شفاء الشبكة!', meshReset: 'تم إعادة تعيين الشبكة!',
    sending: 'توجيه الرسالة...', healing: 'شفاء الشبكة...',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '🕸️ Mesh Whisper جاهز — انقر العقد لتحديد المصدر والوجهة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    chatPlaceholder: 'تحدث مع الروبوت...', splashHint: 'انقر للتخطي', newVersion: 'تحديث',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',step1Title:'مسح',step1Desc:'عقد ESP32 تشكل شبكة متداخلة، كل عقدة تتصل بالجيران القريبين. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'التقاط',step2Desc:'الرسائل تستخدم توجيه BFS لإيجاد أقصر مسار بين العقد. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'تحليل',step3Desc:'عندما تموت عقدة، الشبكة تكتشف العطل وتعيد توجيه حركة المرور. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تقرير',step4Desc:'الإصلاح الذاتي يعيد بناء الروابط تلقائياً عندما تعود العقد. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Mesh Whisper؟',faq_a1:'Mesh Whisper هي محاكاة تفاعلية توضح مفاهيم أمن الشبكات. Messages hop node to node, mesh reroutes around failures. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الشبكات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الشبكات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الشبكات. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',demo_s1:'مرحباً في Mesh Whisper! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الشبكات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالشبكات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات. تجلب المحاكاة هذا المفهوم إلى الحياة من خلال التصور التفاعلي. بدلاً من القراءة عنه، تراه يحدث في الوقت الفعلي وتتحكم في المتغيرات بنفسك.',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت. يرتبط هذا المبدأ بتطبيقات عديدة في العالم الحقيقي. يستخدم المهندسون والباحثون هذه المعرفة يومياً.',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'How to discover devices and services on a network. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'How to spot and stop network attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Mesh Whisper! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـأمن الشبكات — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how ESP32 nodes form a mesh network, each connecting t لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الشبكات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تتبع الحزم',ch1Desc:'أرسل رسالة وتتبع كل قفزة. كم عقدة تمر بها؟ ماذا يحدث إذا سقطت واحدة؟',ch2Title:'البحث عن التأخير',ch2Desc:'اعثر على عنق الزجاجة بقياس التأخير في كل عقدة. أي رابط الأبطأ ولماذا؟',ch3Title:'تدقيق الأمان',ch3Desc:'ابحث عن القناة غير المشفرة. ما المعلومات التي تراها؟ كيف تصلحها؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',purpose:'Mesh Whisper: Messages hop node to node, mesh reroutes around failures. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أمن الترددات',
    wiki_history: 'DARPA funded early mesh research in the 1990s. Zigbee mesh (2004) and Thread (2015) brought mesh to IoT. WiFi mesh systems became popular for home networking. يبني Mesh Whisper على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Mesh Whisper',
    wiki_math: 'الرياضيات وراء Mesh Whisper: In a mesh of N nodes, maximum links = N(N-1)/2. Routing algorithms (AODV, OLSR) find optimal paths. Flooding requires O(N) transmissions per message.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أمن الترددات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أمن الترددات. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أمن الترددات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أمن الترددات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Self-Healing',
    gloss1_def: 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
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
    theory: 'Mesh Whisper يوضح المبادئ الأساسية في أمن الشبكات. Mesh networks connect nodes in a many-to-many topology. Each node can relay traffic for others, creating self-healing paths. No single point of failure. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـRF security في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'شبكة السرب — أسطول ESP-NOW',related1_desc:'ذكاء سرب منسق مع مركز قيادة في المتصفح',related1_path:'../../08-net-multi/esp-swarm-net/index.html',related2_name:'مختبر الإجماع — Raft/PBFT',related2_desc:'تصور الإجماع الموزع مع الانتخابات والنسخ',related2_path:'../../08-net-multi/esp-consensus-lab/index.html',related3_name:'Dead Drop — نقل رسائل BLE',related3_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related3_path:'../../50-civilization-hacks/civ-locust-swarm-radar/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مصيدة ESP — خدمات وهمية',pathPrev_path:'../../05-net-esp32/esp-honeypot/index.html',pathNext_name:'رسام خرائط الشبكة — المشهد الراديوي',pathNext_path:'../../05-net-esp32/esp-network-cartographer/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما هو التعلم الآلي؟',quiz_q1a:'برمجة الروبوتات',quiz_q1b:'أنظمة تتعلم من البيانات',quiz_q1c:'حساب يدوي',quiz_q1d:'تصميم العتاد',quiz_q1_answer:'1',quiz_q2:'كم عدد طبقات نموذج OSI؟',quiz_q2a:'4',quiz_q2b:'5',quiz_q2c:'7',quiz_q2d:'10',quiz_q2_answer:'2',quiz_q3:'على أي طبقة OSI يعمل TCP؟',quiz_q3a:'الفيزيائية',quiz_q3b:'ربط البيانات',quiz_q3c:'الشبكة',quiz_q3d:'النقل',quiz_q3_answer:'3',quiz_q4:'ما بنية معالج ESP32؟',quiz_q4a:'ARM',quiz_q4b:'Xtensa ثنائي النواة',quiz_q4c:'RISC-V فقط',quiz_q4d:'x86',quiz_q4_answer:'1',quiz_q5:'ماذا تعني IP؟',quiz_q5a:'بروتوكول الإنترنت',quiz_q5b:'برنامج داخلي',quiz_q5c:'عملية إدخال',quiz_q5d:'مسار المعلومات',quiz_q5_answer:'0',realworldTitle:'🌍 قصص واقعية',realworld1:'اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة.',realworld2:'كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب.',realworld3:'فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في إخفاء المعلومات معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في إخفاء المعلومات وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Mesh Whisper يوضح مفهومًا أساسيًا في إخفاء المعلومات. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Mesh Whisper لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في إخفاء المعلومات هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ browser وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال إخفاء المعلومات يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}
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
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang]; const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const blob = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); }

/* ═══════ TOAST ═══════ */
let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }

/* ═══════ STATUS ═══════ */
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { if (activeLogFilter === 'all') { line.style.display = ''; return; } line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none'; }); }

/* ═══════ VERSION CHECK ═══════ */
function checkVersion() { try { const stored = localStorage.getItem('wdiy-latest-version'); if (stored && stored !== APP_VERSION) { const btn = $('settingsBtn'); if (btn && !btn.querySelector('.version-update')) { const badge = document.createElement('span'); badge.className = 'version-update'; badge.textContent = LANG[currentLang].newVersion || 'UPDATE'; btn.style.position = 'relative'; badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;'; btn.appendChild(badge); } } } catch {} }

/* ═══════ APP MESSAGING ═══════ */
function sendAppMessage(type, data) { try { const msg = { type, data, from: document.title, ts: Date.now() }; localStorage.setItem('wdiy-app-msg', JSON.stringify(msg)); localStorage.removeItem('wdiy-app-msg'); } catch {} }
function onAppMessage(cb) { window.addEventListener('storage', e => { if (e.key !== 'wdiy-app-msg' || !e.newValue) return; try { cb(JSON.parse(e.newValue)); } catch {} }); }

/* ═══════ KONAMI ═══════ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE ACTIVATED!', 'success'); } } else konamiIdx = 0; }); }

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

/* ═══════ MATRIX RAIN ═══════ */
let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix() { const canvas = $('matrixCanvas'); if (!canvas) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; } matrixRunning = true; canvas.classList.add('active'); const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight; const cols = Math.floor(canvas.width / 16); const drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri, serif'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }
let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() { const logo = $('logoWrap'); if (!logo) return; logo.style.cursor = 'pointer'; logo.addEventListener('click', () => { logoClickCount++; if (logoClickTimer) clearTimeout(logoClickTimer); if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); } else logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }); }

/* ═══════ DEBUG ═══════ */
function initDebug() { if (!new URLSearchParams(window.location.search).has('debug')) return; const panel = $('debugPanel'); if (!panel) return; panel.classList.add('active'); const fpsEl = $('debugFps'), memEl = $('debugMem'); let frames = 0, last = performance.now(); function tick() { frames++; const now = performance.now(); if (now - last >= 1000) { if (fpsEl) fpsEl.textContent = frames + ' FPS'; if (memEl && performance.memory) memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB'; frames = 0; last = now; } requestAnimationFrame(tick); } requestAnimationFrame(tick); }

/* ═══════ THEME MELODIES ═══════ */
const THEME_MELODIES = { 'mosque-gold': [330,392,523], 'zellige': [440,523,659], 'andalus': [294,370,440], 'space': [523,659,784], 'jungle': [262,330,392], 'robot': [440,554,659], 'riad': [349,440,523], 'medina': [294,349,440], 'retro': [523,262,523] };
function playThemeMelody(name) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((freq, i) => { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }

/* ═══════ BREATHING ═══════ */
let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { const bands = document.querySelectorAll('.deco-band'); breathingActive = !breathingActive; if (breathingActive) { bands.forEach(b => b.classList.add('breathing')); } else { bands.forEach(b => b.classList.remove('breathing')); dhikrCount = 0; } }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

/* ═══════ LOG RESIZE ═══════ */
function initLogResize() { const handle = $('logResizeHandle'), panel = $('logPanel'); if (!handle || !panel) return; let dragging = false, startX, startW; const isRtl = () => document.documentElement.dir === 'rtl'; handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { dragging = false; }); try { const saved = localStorage.getItem('wdiy-log-width'); if (saved) document.documentElement.style.setProperty('--log-width', saved); } catch {} }

/* ═══════ PANELS ═══════ */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const logEl = $('logPanel'); logWasOpen = logEl && logEl.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'); const contents = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (target) target.classList.add('active'); }); }); }

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = () => log('🎤 Whisper mode toggled', 'info');
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = () => log('🎵 Music mode toggled', 'info');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const savedLang = localStorage.getItem('wdiy-lang'); const savedTheme = localStorage.getItem('wdiy-theme'); if (savedTheme) setTheme(savedTheme); if (savedLang) setLanguage(savedLang); } catch {}
  checkVersion();
  onAppMessage(msg => log(`📨 ${msg.from}: ${msg.type}`, 'rx'));
  initKonami(); initMatrixTrigger(); initDebug(); initHijriDate();
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════════
   MESH WHISPER SIMULATION
   ═══════════════════════════════════════════════════════════════ */

const NODE_NAMES = ['ROOT','NODE-A','NODE-B','NODE-C','NODE-D','NODE-E','NODE-F','NODE-G','NODE-H'];
let meshNodes = [];
let meshLinks = [];
let selectedNodes = []; // [srcIdx, dstIdx]
let animPath = [];
let animStep = -1;
let animTimer = null;
let meshAnimId = null;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function revealChallenge(idx) {
  const el = $('answer' + idx);
  if (!el) return;
  el.classList.toggle('visible');
  playSound('click');
}

function createMesh() {
  const canvas = $('meshCanvas');
  if (!canvas) return;
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 300;
  meshNodes = [];
  meshLinks = [];
  selectedNodes = [];
  animPath = [];
  animStep = -1;

  // Place nodes in a grid-like pattern with some randomness
  const rows = 3, cols = 3;
  const padX = 60, padY = 50;
  const gapX = (W - padX * 2) / (cols - 1);
  const gapY = (H - padY * 2) / (rows - 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= NODE_NAMES.length) break;
      meshNodes.push({
        x: padX + c * gapX + (Math.random() - 0.5) * 30,
        y: padY + r * gapY + (Math.random() - 0.5) * 20,
        name: NODE_NAMES[idx],
        alive: true,
        radius: 18
      });
    }
  }

  // Create links: connect nearby nodes (grid neighbors + some diagonals)
  for (let i = 0; i < meshNodes.length; i++) {
    for (let j = i + 1; j < meshNodes.length; j++) {
      const dx = meshNodes[i].x - meshNodes[j].x;
      const dy = meshNodes[i].y - meshNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < gapX * 1.5) {
        meshLinks.push({ a: i, b: j, alive: true });
      }
    }
  }

  setStatus(true);
  updateNodeInfo();
  drawMesh();
}

function getNeighbors(nodeIdx) {
  const neighbors = [];
  for (const link of meshLinks) {
    if (!link.alive) continue;
    if (link.a === nodeIdx && meshNodes[link.b].alive) neighbors.push(link.b);
    if (link.b === nodeIdx && meshNodes[link.a].alive) neighbors.push(link.a);
  }
  return neighbors;
}

// BFS shortest path
function bfsPath(src, dst) {
  if (src === dst) return [src];
  if (!meshNodes[src].alive || !meshNodes[dst].alive) return null;
  const visited = new Set([src]);
  const queue = [[src]];
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const nb of getNeighbors(current)) {
      if (nb === dst) return [...path, nb];
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push([...path, nb]);
      }
    }
  }
  return null; // no path
}

function updateNodeInfo() {
  const info = $('nodeInfo');
  const aliveCount = meshNodes.filter(n => n.alive).length;
  const aliveLinks = meshLinks.filter(l => l.alive && meshNodes[l.a].alive && meshNodes[l.b].alive).length;
  let pathStr = '—';
  if (selectedNodes.length === 2) {
    const p = bfsPath(selectedNodes[0], selectedNodes[1]);
    pathStr = p ? p.map(i => meshNodes[i].name).join(' → ') : 'NO PATH';
  }
  if (info) info.textContent = `Nodes: ${aliveCount}/${meshNodes.length} | Links: ${aliveLinks} | Path: ${pathStr}`;

  // Update stats
  const dead = $('deadNodes');
  if (dead) dead.textContent = meshNodes.filter(n => !n.alive).length;
  const density = $('meshDensity');
  if (density) {
    const maxLinks = aliveCount * (aliveCount - 1) / 2;
    density.textContent = maxLinks > 0 ? (aliveLinks / maxLinks * 100).toFixed(1) + '%' : '—';
  }
  const avgH = $('avgHops');
  if (avgH) {
    let totalHops = 0, count = 0;
    const alive = meshNodes.map((n, i) => n.alive ? i : -1).filter(i => i >= 0);
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        const p = bfsPath(alive[i], alive[j]);
        if (p) { totalHops += p.length - 1; count++; }
      }
    }
    avgH.textContent = count > 0 ? (totalHops / count).toFixed(1) : '—';
  }
}

function drawMesh() {
  const canvas = $('meshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Draw links
  for (const link of meshLinks) {
    if (!link.alive) continue;
    const a = meshNodes[link.a], b = meshNodes[link.b];
    if (!a.alive || !b.alive) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);

    // Check if this link is part of the animated path
    let isOnPath = false;
    if (animPath.length > 1 && animStep >= 0) {
      for (let i = 0; i < animPath.length - 1 && i <= animStep; i++) {
        if ((link.a === animPath[i] && link.b === animPath[i + 1]) ||
            (link.b === animPath[i] && link.a === animPath[i + 1])) {
          isOnPath = true; break;
        }
      }
    }

    ctx.strokeStyle = isOnPath ? '#33ff33' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = isOnPath ? 3 : 1;
    ctx.stroke();
  }

  // Draw nodes
  for (let i = 0; i < meshNodes.length; i++) {
    const n = meshNodes[i];
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

    if (!n.alive) {
      ctx.fillStyle = 'rgba(192,57,43,0.3)';
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
    } else if (selectedNodes.includes(i)) {
      ctx.fillStyle = accent;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    } else if (animPath.includes(i) && animStep >= animPath.indexOf(i)) {
      ctx.fillStyle = '#33ff33';
      ctx.strokeStyle = '#33ff33';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
    }

    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = n.alive ? '#fff' : '#666';
    ctx.font = '9px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.name, n.x, n.y);
  }

  // Draw animated message packet
  if (animStep >= 0 && animStep < animPath.length - 1) {
    const from = meshNodes[animPath[animStep]];
    const to = meshNodes[animPath[animStep + 1]];
    const progress = (Date.now() % 500) / 500;
    const px = from.x + (to.x - from.x) * progress;
    const py = from.y + (to.y - from.y) * progress;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f39c12';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(243,156,18,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function animateLoop() {
  drawMesh();
  meshAnimId = requestAnimationFrame(animateLoop);
}

function initMeshCanvas() {
  const canvas = $('meshCanvas');
  if (!canvas) return;

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Find closest alive node
    let closest = -1, minDist = Infinity;
    for (let i = 0; i < meshNodes.length; i++) {
      if (!meshNodes[i].alive) continue;
      const dx = meshNodes[i].x - x, dy = meshNodes[i].y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 30 && d < minDist) { minDist = d; closest = i; }
    }

    if (closest < 0) return;
    playSound('click');

    if (selectedNodes.length < 2) {
      selectedNodes.push(closest);
      log(`📌 Selected: ${meshNodes[closest].name}`, 'info');
    } else {
      selectedNodes = [closest];
      animPath = [];
      animStep = -1;
      log(`📌 New source: ${meshNodes[closest].name}`, 'info');
    }
    updateNodeInfo();
    drawMesh();
  });

  createMesh();
  animateLoop();
}

// Send message animation
async function sendMessage() {
  const s = LANG[currentLang];
  const msg = ($('msgInput') || {}).value || '';
  if (!msg) { log(s.noMsg, 'error'); showToast(s.noMsg, 1500); return; }
  if (selectedNodes.length < 2) { log(s.selectNodes, 'error'); showToast(s.selectNodes, 1500); return; }

  const path = bfsPath(selectedNodes[0], selectedNodes[1]);
  if (!path) { log(s.noPath, 'error'); showToast(s.noPath, 1500); return; }

  animPath = path;
  animStep = 0;
  log(`📤 TX: "${msg}" via ${path.map(i => meshNodes[i].name).join(' → ')}`, 'tx');
  showToast(s.sending, 3000);

  for (let i = 0; i < path.length - 1; i++) {
    animStep = i;
    log(`  ↳ Hop ${i + 1}: ${meshNodes[path[i]].name} → ${meshNodes[path[i + 1]].name}`, 'info');
    await sleep(600);
  }

  animStep = path.length;
  log(`📥 RX: "${msg}" delivered to ${meshNodes[path[path.length - 1]].name}`, 'rx');
  log(s.msgSent, 'success');
  showToast(s.msgSent, 1500);
  setStatus(true);
}

// Kill a random alive non-selected node
function killNode() {
  const s = LANG[currentLang];
  const candidates = meshNodes.map((n, i) => n.alive && !selectedNodes.includes(i) ? i : -1).filter(i => i >= 0);
  if (candidates.length === 0) return;
  const victim = candidates[Math.floor(Math.random() * candidates.length)];
  meshNodes[victim].alive = false;
  animPath = [];
  animStep = -1;
  log(`💀 ${meshNodes[victim].name} killed!`, 'error');
  showToast(s.nodeKilled, 1200);
  updateNodeInfo();
}

// Heal all nodes
async function healMesh() {
  const s = LANG[currentLang];
  showToast(s.healing, 2000);
  for (const n of meshNodes) {
    if (!n.alive) {
      n.alive = true;
      log(`💚 ${n.name} healed!`, 'success');
      await sleep(300);
    }
  }
  for (const l of meshLinks) l.alive = true;
  animPath = [];
  animStep = -1;
  log(s.meshHealed, 'success');
  updateNodeInfo();
}

function initMeshSim() {
  const sendBtnEl = $('sendBtn');
  const killBtnEl = $('killBtn');
  const healBtnEl = $('healBtn');
  const resetBtnEl = $('resetBtn');

  if (sendBtnEl) sendBtnEl.addEventListener('click', sendMessage);
  if (killBtnEl) killBtnEl.addEventListener('click', killNode);
  if (healBtnEl) healBtnEl.addEventListener('click', healMesh);
  if (resetBtnEl) resetBtnEl.addEventListener('click', () => {
    createMesh();
    log(LANG[currentLang].meshReset, 'info');
  });

  setTimeout(initMeshCanvas, 300);
}

// Draw topology minimap
function initTopoCanvas() {
  const canvas = $('topoCanvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  function drawTopo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const scaleX = canvas.width / ($('meshCanvas')?.width || 500);
    const scaleY = canvas.height / 300;

    for (const link of meshLinks) {
      if (!link.alive) continue;
      const a = meshNodes[link.a], b = meshNodes[link.b];
      if (!a?.alive || !b?.alive) continue;
      ctx.beginPath();
      ctx.moveTo(a.x * scaleX, a.y * scaleY);
      ctx.lineTo(b.x * scaleX, b.y * scaleY);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (const n of meshNodes) {
      ctx.beginPath();
      ctx.arc(n.x * scaleX, n.y * scaleY, 8, 0, Math.PI * 2);
      ctx.fillStyle = n.alive ? accent : 'rgba(192,57,43,0.5)';
      ctx.fill();
    }
    requestAnimationFrame(drawTopo);
  }
  drawTopo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { initMeshSim(); setTimeout(initTopoCanvas, 500); });
} else {
  setTimeout(() => { initMeshSim(); setTimeout(initTopoCanvas, 500); }, 50);
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
