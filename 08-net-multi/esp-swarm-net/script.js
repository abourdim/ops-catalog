/**
 * Workshop DIY — Swarm Net v1.0
 * ESP-NOW Fleet Coordination Simulator
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7c0-4.2.1-7.8.1-7.9z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

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
    title: 'Swarm Net', subtitle: '🐝 swarm · 📡 ESP-NOW · 🎯 formation',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Swarm Net — ESP-NOW Fleet', mainDesc: 'Coordinated swarm intelligence with browser command center',
    sectionA: 'How It Works', sectionB: 'Lab', sectionC: 'Challenge',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'The main display shows the Swarm Net simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The network is scanned to discover active devices and servic',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_swarm_title: '🐝 Swarm Robotics', wiki_swarm: 'Swarm robotics coordinates large numbers of simple robots to perform tasks through local interactions, without centralized control.',
    wiki_espnow_title: '📡 ESP-NOW Protocol', wiki_espnow: 'ESP-NOW supports up to 20 encrypted peers with 250-byte payloads at sub-millisecond latency. No router needed.',
    wiki_formation_title: '🎯 Formation Control', wiki_formation: 'Formation control assigns each agent a unique slot in a geometric pattern. Consensus algorithms keep the group coherent.',
    wiki_telemetry_title: '📊 Telemetry', wiki_telemetry: 'Telemetry is the automatic measurement and wireless transmission of data from remote sources to a monitoring station.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🐝 Swarm Net ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    chatPlaceholder: 'Talk to the robot...', splashHint: 'tap to skip', newVersion: 'UPDATE',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    speedLabel: 'Speed:', countLabel: 'Nodes:',
    fScatter: 'Scatter', fLine: 'Line', fCircle: 'Circle', fVshape: 'V-Shape', fGrid: 'Grid',
    sendCmd: 'Send', cmdPlaceholder: 'Command (e.g. rotate, halt, patrol)...',
    teleFormation: 'Formation', teleNodes: 'Active Nodes', teleMessages: 'Messages', teleCoherence: 'Coherence',
    step1: 'Each ESP32 node broadcasts its position via ESP-NOW, a low-latency peer-to-peer protocol.',
    step2: 'The command center sends formation orders (line, circle, scatter) to all nodes simultaneously.',
    step3: 'Nodes calculate their target position based on formation type and smoothly move toward it.',
    step4: 'Telemetry (position, battery, signal) flows back to the dashboard in real-time via ESP-NOW relay.',
    labTip1: 'Use formation buttons to see how nodes reorganize in real-time.',
    labTip2: 'Adjust the speed slider to control how fast nodes converge to their target positions.',
    labTip3: 'Type commands like "rotate", "halt", or "patrol" to send orders to the swarm.',
    labTip4: 'Click on the canvas to set a rally point — all nodes will converge there.',
    challenge1: 'Get all nodes into circle formation with 100% coherence in under 5 seconds.',
    challenge2: 'Send a "patrol" command and observe how nodes sweep the canvas area systematically.',
    challenge3: 'Set a rally point, then switch to V-shape formation — watch the swarm reorganize mid-flight.',
    cmdReceived: 'Command received', cmdRotate: 'Rotating formation', cmdHalt: 'All nodes halted',
    cmdPatrol: 'Patrol mode engaged', cmdRally: 'Rally point set', cmdUnknown: 'Unknown command',
    formationChanged: 'Formation →', rallySet: 'Rally point set',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is Swarm Net?',faq_a1:'Swarm Net is an interactive simulation that demonstrates network systems concepts. Coordinated swarm intelligence with browser command center. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real distributed networks behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real distributed networks principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32 x3+. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Consensus Lab and Esp Cyber Range. Each app in this category teaches a different aspect of distributed networks.',demo_s1:'Welcome to Swarm Net! Look at the main display — this is where the distributed networks simulation runs.',demo_s2:'Choose a formation using the buttons below the canvas to command the swarm. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of distributed networks.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Swarm Net! This is like a science experiment on your computer. You get to control a real network systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The network is scanned to discover active devices  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches distributed networks concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Swarm Net: Coordinated swarm intelligence with browser command center. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Rf Hacking',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Swarm Net builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Swarm Net',
    wiki_math: 'The mathematics behind Swarm Net: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced RF hacking practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to RF hacking. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with RF hacking: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in RF hacking.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Rf Hacking carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Header',
    gloss1_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Swarm Net demonstrates key principles from network systems. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world RF hacking?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional RF hacking systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Swarm Net', subtitle: '🐝 essaim · 📡 ESP-NOW · 🎯 formation',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Swarm Net — Flotte ESP-NOW', mainDesc: 'Intelligence d\'essaim coordonnée avec centre de commande navigateur',
    sectionA: 'Comment ça marche', sectionB: 'Labo', sectionC: 'Défi',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'L écran principal affiche la simulation Swarm Net. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The network is scanned to discover active devices and servic',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_swarm_title: '🐝 Robotique d\'Essaim', wiki_swarm: 'La robotique d\'essaim coordonne de nombreux robots simples pour accomplir des tâches par interactions locales.',
    wiki_espnow_title: '📡 Protocole ESP-NOW', wiki_espnow: 'ESP-NOW supporte jusqu\'à 20 pairs chiffrés avec des paquets de 250 octets à latence sub-milliseconde.',
    wiki_formation_title: '🎯 Contrôle de Formation', wiki_formation: 'Le contrôle de formation assigne à chaque agent une place unique dans un motif géométrique.',
    wiki_telemetry_title: '📊 Télémétrie', wiki_telemetry: 'La télémétrie est la mesure automatique et la transmission sans fil de données depuis des sources distantes.',
    working: 'En cours…',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🐝 Swarm Net prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Réactif musique',
    chatPlaceholder: 'Parle au robot...', splashHint: 'appuyer pour passer', newVersion: 'MAJ',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    speedLabel: 'Vitesse :', countLabel: 'Nœuds :',
    fScatter: 'Dispersé', fLine: 'Ligne', fCircle: 'Cercle', fVshape: 'V', fGrid: 'Grille',
    sendCmd: 'Envoyer', cmdPlaceholder: 'Commande (ex: rotate, halt, patrol)...',
    teleFormation: 'Formation', teleNodes: 'Nœuds Actifs', teleMessages: 'Messages', teleCoherence: 'Cohérence',
    step1: 'Chaque nœud ESP32 diffuse sa position via ESP-NOW, un protocole pair-à-pair à faible latence.',
    step2: 'Le centre de commande envoie des ordres de formation à tous les nœuds simultanément.',
    step3: 'Les nœuds calculent leur position cible selon le type de formation et s\'y déplacent en douceur.',
    step4: 'La télémétrie revient au tableau de bord en temps réel via relais ESP-NOW.',
    labTip1: 'Utilisez les boutons de formation pour voir la réorganisation des nœuds en temps réel.',
    labTip2: 'Ajustez le curseur de vitesse pour contrôler la convergence des nœuds.',
    labTip3: 'Tapez des commandes comme "rotate", "halt" ou "patrol" pour donner des ordres.',
    labTip4: 'Cliquez sur le canevas pour définir un point de ralliement.',
    challenge1: 'Mettez tous les nœuds en formation cercle avec 100% de cohérence en moins de 5 secondes.',
    challenge2: 'Envoyez "patrol" et observez comment les nœuds balaient la zone systématiquement.',
    challenge3: 'Définissez un point de ralliement, puis passez en V — regardez le réorganisation en vol.',
    cmdReceived: 'Commande reçue', cmdRotate: 'Rotation de la formation', cmdHalt: 'Tous les nœuds arrêtés',
    cmdPatrol: 'Mode patrouille engagé', cmdRally: 'Point de ralliement défini', cmdUnknown: 'Commande inconnue',
    formationChanged: 'Formation →', rallySet: 'Point de ralliement défini',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Swarm Net ?',faq_a1:'Swarm Net est une simulation interactive qui démontre les concepts de systèmes réseau. Coordinated swarm intelligence with browser command center. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de réseaux distribués. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de réseaux distribués. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut ESP32 x3+. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de réseaux distribués.',demo_s1:'Bienvenue dans Swarm Net ! Regarde l\'écran principal — c\'est ici que la simulation de réseaux distribués fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de réseaux distribués.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'How to discover devices and services on a network. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'How to spot and stop network attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Swarm Net ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de systèmes réseau — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how The network is scanned to discover active devices  Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de réseaux distribués par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Trace de Paquets',ch1Desc:'Envoie un message et trace chaque saut. Combien de nœuds traverse-t-il ? Que se passe-t-il si un tombe ?',ch2Title:'Chasse à la Latence',ch2Desc:'Trouve le goulot d\'étranglement en mesurant la latence à chaque nœud. Quel lien est le plus lent et pourquoi ?',ch3Title:'Audit de Sécurité',ch3Desc:'Trouve le canal non chiffré dans le réseau. Quelles informations vois-tu ? Comment le corriger ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',purpose:'Swarm Net : Coordinated swarm intelligence with browser command center. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de piratage RF',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Swarm Net s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Swarm Net',
    wiki_math: 'Les mathématiques derrière Swarm Net : Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de piratage RF utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour piratage RF. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en piratage RF : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Piratage rf implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Header',
    gloss1_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Swarm Net démontre les principes clés de systèmes réseau. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec RF hacking dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'Swarm Net', subtitle: '🐝 سرب · 📡 ESP-NOW · 🎯 تشكيل',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'شبكة السرب — أسطول ESP-NOW', mainDesc: 'ذكاء سرب منسق مع مركز قيادة في المتصفح',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Swarm Net. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The network is scanned to discover active devices and servic',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_swarm_title: '🐝 روبوتات السرب', wiki_swarm: 'تنسق روبوتات السرب أعدادًا كبيرة من الروبوتات البسيطة لأداء المهام.',
    wiki_espnow_title: '📡 بروتوكول ESP-NOW', wiki_espnow: 'يدعم ESP-NOW حتى 20 نظيرًا مشفرًا بزمن انتقال أقل من ميلي ثانية.',
    wiki_formation_title: '🎯 التحكم في التشكيل', wiki_formation: 'يعين التحكم في التشكيل لكل عامل مكانًا فريدًا في نمط هندسي.',
    wiki_telemetry_title: '📊 القياس عن بُعد', wiki_telemetry: 'القياس عن بُعد هو القياس التلقائي والإرسال اللاسلكي للبيانات من مصادر بعيدة.',
    working: 'جارٍ…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '🐝 شبكة السرب جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    chatPlaceholder: 'تحدث مع الروبوت...', splashHint: 'انقر للتخطي', newVersion: 'تحديث',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    speedLabel: 'السرعة:', countLabel: 'العقد:',
    fScatter: 'تفرق', fLine: 'خط', fCircle: 'دائرة', fVshape: 'V', fGrid: 'شبكة',
    sendCmd: 'إرسال', cmdPlaceholder: 'أمر (مثل: rotate, halt, patrol)...',
    teleFormation: 'التشكيل', teleNodes: 'العقد النشطة', teleMessages: 'الرسائل', teleCoherence: 'التماسك',
    step1: 'كل عقدة ESP32 تبث موقعها عبر ESP-NOW.',
    step2: 'يرسل مركز القيادة أوامر التشكيل لجميع العقد في وقت واحد.',
    step3: 'تحسب العقد موقعها المستهدف وتتحرك بسلاسة نحوه.',
    step4: 'تتدفق القياسات إلى لوحة المعلومات في الوقت الفعلي عبر ترحيل ESP-NOW.',
    labTip1: 'استخدم أزرار التشكيل لمشاهدة إعادة تنظيم العقد.',
    labTip2: 'اضبط شريط السرعة للتحكم في سرعة التقارب.',
    labTip3: 'اكتب أوامر مثل "rotate" أو "halt" أو "patrol".',
    labTip4: 'انقر على اللوحة لتحديد نقطة تجمع.',
    challenge1: 'اجعل جميع العقد في تشكيل دائري مع تماسك 100% في أقل من 5 ثوانٍ.',
    challenge2: 'أرسل أمر "patrol" ولاحظ كيف تمسح العقد المساحة.',
    challenge3: 'حدد نقطة تجمع ثم انتقل إلى تشكيل V — شاهد إعادة التنظيم.',
    cmdReceived: 'تم استلام الأمر', cmdRotate: 'تدوير التشكيل', cmdHalt: 'توقف جميع العقد',
    cmdPatrol: 'وضع الدورية مُفعّل', cmdRally: 'تم تحديد نقطة التجمع', cmdUnknown: 'أمر غير معروف',
    formationChanged: 'التشكيل →', rallySet: 'تم تحديد نقطة التجمع',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Swarm Net؟',faq_a1:'Swarm Net هي محاكاة تفاعلية توضح مفاهيم أنظمة الشبكات. Coordinated swarm intelligence with browser command center. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الشبكات الموزعة. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الشبكات الموزعة. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج ESP32 x3+. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الشبكات الموزعة.',demo_s1:'مرحباً في Swarm Net! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الشبكات الموزعة.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالشبكات الموزعة.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'How to discover devices and services on a network. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'How to spot and stop network attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Swarm Net! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـأنظمة الشبكات — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how The network is scanned to discover active devices  لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الشبكات الموزعة من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تتبع الحزم',ch1Desc:'أرسل رسالة وتتبع كل قفزة. كم عقدة تمر بها؟ ماذا يحدث إذا سقطت واحدة؟',ch2Title:'البحث عن التأخير',ch2Desc:'اعثر على عنق الزجاجة بقياس التأخير في كل عقدة. أي رابط الأبطأ ولماذا؟',ch3Title:'تدقيق الأمان',ch3Desc:'ابحث عن القناة غير المشفرة. ما المعلومات التي تراها؟ كيف تصلحها؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',purpose:'Swarm Net: Coordinated swarm intelligence with browser command center. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ اختراق التردد',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. يبني Swarm Net على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Swarm Net',
    wiki_math: 'الرياضيات وراء Swarm Net: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو اختراق التردد المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في اختراق التردد. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في اختراق التردد: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'اختراق التردد يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Header',
    gloss1_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Swarm Net يوضح المبادئ الأساسية في أنظمة الشبكات. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـRF hacking في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

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

const THEME_MELODIES = { 'mosque-gold': [330,392,523], 'zellige': [440,523,659], 'andalus': [294,370,440], 'space': [523,659,784], 'jungle': [262,330,392], 'robot': [440,554,659], 'riad': [349,440,523], 'medina': [294,349,440], 'retro': [523,262,523] };

function playThemeMelody(name) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name]; if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); });
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang];
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${s['t_' + name] || name}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer, typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = `log-line ${type}`;
  const txt = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) { logContainer.appendChild(d); twAppend(d, txt); } else { d.textContent = txt; logContainer.appendChild(d); }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); }
  applyLogFilter();
}

async function twAppend(el, text) { el.textContent = ''; for (let i = 0; i < text.length; i++) { el.textContent += text[i]; await new Promise(r => setTimeout(r, 8 + Math.random() * 12)); } }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const b = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(u); }

/* ═══════ TOAST / STATUS / SPLASH ═══════ */

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
function pulseBismillah(type) { const b = document.querySelector('.bismillah'); if (!b) return; b.classList.remove('pulse-success','pulse-error'); void b.offsetWidth; b.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success'); setTimeout(() => b.classList.remove('pulse-success','pulse-error'), 700); }

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }

/* ═══════ PANELS ═══════ */

function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o, r) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); const b = $(r); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel','helpOverlay'); }
function closeHelp() { closePanel('helpPanel','helpOverlay','helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel','settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel','settingsOverlay','settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'), cs = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); cs.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const n = tab.dataset.tab; const tgt = $('help' + n.charAt(0).toUpperCase() + n.slice(1)); if (tgt) tgt.classList.add('active'); }); }); }

/* ═══════ BREATHING / HIJRI / KONAMI / MATRIX ═══════ */

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE — RETRO MODE!', 'success'); } } else konamiIdx = 0; }); }

let matrixRunning = false, matrixAnim = null;
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); const chars = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذ'; (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, drops[i]*16); if (drops[i]*16>c.height&&Math.random()>0.975) drops[i]=0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); })(); }
let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() { const l = $('logoWrap'); if (!l) return; l.style.cursor = 'pointer'; l.addEventListener('click', () => { logoClickCount++; if (logoClickTimer) clearTimeout(logoClickTimer); if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); } else logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }); }

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h||!p) return; let d = false, sx, sw; const rtl = () => document.documentElement.dir === 'rtl'; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; h.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = rtl() ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { if (!d) return; d = false; h.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }); try { const s = localStorage.getItem('wdiy-log-width'); if (s) document.documentElement.style.setProperty('--log-width', s); } catch {} }

/* ═══════ SWARM SIMULATION ═══════ */

const SWARM = {
  nodes: [], canvas: null, ctx: null, formation: 'scatter', speed: 5, animFrame: null,
  msgCount: 0, rallyPoint: null, rotating: false, rotationAngle: 0, halted: false,
  patrolling: false, patrolIdx: 0,
  colors: ['#d4a03c','#38bdf8','#4ade80','#c084fc','#a3e635','#3b82f6','#f97316','#ef4444','#22d3ee','#f472b6','#facc15','#34d399'],
};

class SwarmNode {
  constructor(id, x, y, color) { this.id = id; this.x = x; this.y = y; this.tx = x; this.ty = y; this.color = color; this.trail = []; this.radius = 10; }
}

function swarmInit() {
  SWARM.canvas = $('swarmCanvas'); if (!SWARM.canvas) return;
  SWARM.ctx = SWARM.canvas.getContext('2d');
  swarmResize(); window.addEventListener('resize', swarmResize);

  SWARM.canvas.addEventListener('click', e => {
    const r = SWARM.canvas.getBoundingClientRect();
    SWARM.rallyPoint = { x: e.clientX - r.left, y: e.clientY - r.top };
    SWARM.nodes.forEach(n => { n.tx = SWARM.rallyPoint.x + (Math.random()-.5)*30; n.ty = SWARM.rallyPoint.y + (Math.random()-.5)*30; });
    SWARM.halted = false;
    log(`📍 ${LANG[currentLang].rallySet} (${Math.round(SWARM.rallyPoint.x)}, ${Math.round(SWARM.rallyPoint.y)})`, 'info');
    SWARM.msgCount++; updateTelemetry();
  });

  document.querySelectorAll('[data-formation]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-formation]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); SWARM.formation = btn.dataset.formation;
      SWARM.halted = false; SWARM.patrolling = false;
      swarmSetFormation(SWARM.formation);
      log(`🎯 ${LANG[currentLang].formationChanged} ${LANG[currentLang]['f' + cap(SWARM.formation)] || SWARM.formation}`, 'tx');
      SWARM.msgCount++; updateTelemetry(); playSound('click');
    });
  });

  const spd = $('swarmSpeed'); if (spd) spd.addEventListener('input', () => { SWARM.speed = parseInt(spd.value); });
  const cnt = $('swarmCount'), cv = $('countVal');
  if (cnt) cnt.addEventListener('input', () => { if (cv) cv.textContent = cnt.value; swarmGen(parseInt(cnt.value)); swarmSetFormation(SWARM.formation); updateTelemetry(); });

  const cmdBtn = $('cmdSendBtn'), cmdIn = $('cmdInput');
  if (cmdBtn) cmdBtn.addEventListener('click', swarmCmd);
  if (cmdIn) cmdIn.addEventListener('keydown', e => { if (e.key === 'Enter') swarmCmd(); });

  swarmGen(6); swarmSetFormation('scatter'); swarmRender();
}

function swarmResize() { if (!SWARM.canvas) return; const r = SWARM.canvas.parentElement.getBoundingClientRect(); SWARM.canvas.width = r.width - 2; SWARM.canvas.height = 320; }

function swarmGen(n) {
  SWARM.nodes = [];
  const w = SWARM.canvas ? SWARM.canvas.width : 400, h = SWARM.canvas ? SWARM.canvas.height : 320;
  for (let i = 0; i < n; i++) SWARM.nodes.push(new SwarmNode(i, 40 + Math.random() * (w-80), 40 + Math.random() * (h-80), SWARM.colors[i % SWARM.colors.length]));
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function swarmSetFormation(type) {
  const w = SWARM.canvas ? SWARM.canvas.width : 400, h = SWARM.canvas ? SWARM.canvas.height : 320;
  const cx = w/2, cy = h/2, n = SWARM.nodes.length;
  SWARM.nodes.forEach((nd, i) => {
    switch (type) {
      case 'line': nd.tx = 60 + (w-120) * (i / Math.max(n-1,1)); nd.ty = cy; break;
      case 'circle': { const a = (2*Math.PI*i)/n, r = Math.min(w,h)*0.35; nd.tx = cx + r*Math.cos(a); nd.ty = cy + r*Math.sin(a); break; }
      case 'vshape': { const half = Math.floor(n/2); if (i===0) { nd.tx = cx; nd.ty = cy-60; } else if (i<=half) { nd.tx = cx-i*40; nd.ty = cy-60+i*30; } else { nd.tx = cx+(i-half)*40; nd.ty = cy-60+(i-half)*30; } break; }
      case 'grid': { const cols = Math.ceil(Math.sqrt(n)); const gx = i%cols, gy = Math.floor(i/cols), sp = 50; nd.tx = cx-(cols-1)*sp/2+gx*sp; nd.ty = cy-(Math.ceil(n/cols)-1)*sp/2+gy*sp; break; }
      default: nd.tx = 40+Math.random()*(w-80); nd.ty = 40+Math.random()*(h-80);
    }
  });
}

function swarmCmd() {
  const input = $('cmdInput'); if (!input) return;
  const cmd = input.value.trim().toLowerCase(); input.value = ''; if (!cmd) return;
  const s = LANG[currentLang]; log(`📤 TX CMD: "${cmd}"`, 'tx'); SWARM.msgCount++;
  switch (cmd) {
    case 'rotate': SWARM.rotating = !SWARM.rotating; SWARM.halted = false; log(`🔄 ${s.cmdRotate}`, 'success'); break;
    case 'halt': SWARM.halted = true; SWARM.rotating = false; SWARM.patrolling = false; log(`🛑 ${s.cmdHalt}`, 'info'); break;
    case 'patrol': SWARM.patrolling = true; SWARM.halted = false; SWARM.patrolIdx = 0; log(`🔍 ${s.cmdPatrol}`, 'success'); break;
    case 'scatter': SWARM.formation = 'scatter'; SWARM.halted = false; SWARM.rotating = false; SWARM.patrolling = false; swarmSetFormation('scatter'); document.querySelectorAll('[data-formation]').forEach(b => b.classList.toggle('active', b.dataset.formation === 'scatter')); log(`💨 ${s.formationChanged} ${s.fScatter}`, 'tx'); break;
    case 'rally': { const w = SWARM.canvas.width, h = SWARM.canvas.height; SWARM.rallyPoint = {x:w/2,y:h/2}; SWARM.nodes.forEach(n => { n.tx = w/2+(Math.random()-.5)*30; n.ty = h/2+(Math.random()-.5)*30; }); SWARM.halted = false; log(`📍 ${s.cmdRally}`, 'success'); break; }
    default: log(`❓ ${s.cmdUnknown}: "${cmd}"`, 'error');
  }
  updateTelemetry(); playSound('click');
}

function updateTelemetry() {
  const s = LANG[currentLang];
  const tf = $('teleFormation'), tn = $('teleNodes'), tm = $('teleMessages'), tc = $('teleCoherence');
  if (tf) tf.textContent = s['f' + cap(SWARM.formation)] || SWARM.formation;
  if (tn) tn.textContent = SWARM.nodes.length;
  if (tm) tm.textContent = SWARM.msgCount;
  let td = 0; SWARM.nodes.forEach(n => { td += Math.hypot(n.x-n.tx, n.y-n.ty); });
  if (tc) tc.textContent = Math.max(0, Math.round((1 - td/(SWARM.nodes.length*200))*100)) + '%';
}

function swarmRender() {
  let last = 0;
  function frame(time) {
    const dt = Math.min((time - last) / 16, 3); last = time;
    if (!SWARM.halted) {
      const spd = SWARM.speed * 0.8 * dt;
      const w = SWARM.canvas ? SWARM.canvas.width : 400, h = SWARM.canvas ? SWARM.canvas.height : 320;
      if (SWARM.rotating) { SWARM.rotationAngle += 0.02*dt; const cx = w/2, cy = h/2; SWARM.nodes.forEach((nd,i) => { const a = (2*Math.PI*i)/SWARM.nodes.length + SWARM.rotationAngle, r = Math.min(w,h)*0.3; nd.tx = cx+r*Math.cos(a); nd.ty = cy+r*Math.sin(a); }); }
      if (SWARM.patrolling) { const pts = [{x:w*.2,y:h*.2},{x:w*.8,y:h*.2},{x:w*.8,y:h*.8},{x:w*.2,y:h*.8}]; const tgt = pts[SWARM.patrolIdx%pts.length]; let allC = true; SWARM.nodes.forEach((n,i) => { n.tx = tgt.x+(i-SWARM.nodes.length/2)*20; n.ty = tgt.y; if (Math.hypot(n.x-n.tx,n.y-n.ty)>15) allC = false; }); if (allC) { SWARM.patrolIdx++; SWARM.msgCount++; } }
      SWARM.nodes.forEach(n => { const dx = n.tx-n.x, dy = n.ty-n.y, d = Math.hypot(dx,dy); if (d>1) { n.x += (dx/d)*spd; n.y += (dy/d)*spd; } n.trail.push({x:n.x,y:n.y}); if (n.trail.length>15) n.trail.shift(); });
      updateTelemetry();
    }
    swarmDraw();
    SWARM.animFrame = requestAnimationFrame(frame);
  }
  SWARM.animFrame = requestAnimationFrame(frame);
}

function swarmDraw() {
  const ctx = SWARM.ctx; if (!ctx||!SWARM.canvas) return;
  const w = SWARM.canvas.width, h = SWARM.canvas.height;
  ctx.clearRect(0,0,w,h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()||'#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()||'#8a7e6e';

  // Communication lines
  for (let i = 0; i < SWARM.nodes.length; i++) for (let j = i+1; j < SWARM.nodes.length; j++) {
    const a = SWARM.nodes[i], b = SWARM.nodes[j], d = Math.hypot(a.x-b.x,a.y-b.y);
    if (d<150) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle = mutedCol + Math.round((1-d/150)*40).toString(16).padStart(2,'0'); ctx.lineWidth = 0.8; ctx.stroke(); }
  }

  // Trails
  SWARM.nodes.forEach(n => { if (n.trail.length<2) return; ctx.beginPath(); ctx.moveTo(n.trail[0].x,n.trail[0].y); for (let i=1;i<n.trail.length;i++) ctx.lineTo(n.trail[i].x,n.trail[i].y); ctx.strokeStyle = n.color+'30'; ctx.lineWidth = 2; ctx.stroke(); });

  // Rally point
  if (SWARM.rallyPoint) { ctx.beginPath(); ctx.arc(SWARM.rallyPoint.x,SWARM.rallyPoint.y,8+Math.sin(Date.now()/300)*3,0,Math.PI*2); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#ef444440'; ctx.fill(); }

  // Nodes
  SWARM.nodes.forEach(n => {
    ctx.beginPath(); ctx.arc(n.x,n.y,n.radius+4,0,Math.PI*2); ctx.fillStyle = n.color+'15'; ctx.fill();
    ctx.beginPath(); ctx.arc(n.x,n.y,n.radius,0,Math.PI*2); ctx.fillStyle = n.color+'40'; ctx.fill(); ctx.strokeStyle = n.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = 'bold 10px Tajawal,sans-serif'; ctx.fillStyle = textCol; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String.fromCharCode(65+n.id), n.x, n.y);
  });

  // ESP-NOW pulse
  if (Date.now()%2000<100) { const s = SWARM.nodes[Math.floor(Math.random()*SWARM.nodes.length)]; if (s) { ctx.beginPath(); ctx.arc(s.x,s.y,25,0,Math.PI*2); ctx.strokeStyle = s.color+'60'; ctx.lineWidth = 1; ctx.stroke(); } }
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
  const sndT = $('soundToggle');
  if (sndT) { try { soundEnabled = localStorage.getItem('wdiy-sound')==='true'; } catch {} sndT.checked = soundEnabled; sndT.addEventListener('change', () => { soundEnabled = sndT.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  const brBtn = $('breathingBtn'), dkD = $('dhikrDisplay'), dkB = $('dhikrBtn');
  if (brBtn) brBtn.onclick = () => { toggleBreathing(); if (dkD) dkD.style.display = breathingActive ? 'flex' : 'none'; };
  if (dkB) dkB.onclick = incrementDhikr;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}
  initKonami(); initMatrixTrigger(); initHijriDate();
  swarmInit(); setStatus(true);
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Swarm Net: ESP-NOW fleet coordination
   with swarm agents, formation patterns, and mesh communication
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const bots=[],msgs=[],trails=[];let formation='scatter',msgCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#060810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class Bot{
    constructor(x,y,id){this.x=x;this.y=y;this.id=id;this.tx=x;this.ty=y;this.vx=0;this.vy=0;
      this.hue=200+Math.random()*60;this.pulse=Math.random()*Math.PI*2;this.trail=[];}
    update(){
      const dx=this.tx-this.x,dy=this.ty-this.y;this.vx+=(dx*0.01-this.vx*0.05);this.vy+=(dy*0.01-this.vy*0.05);
      this.x+=this.vx;this.y+=this.vy;this.pulse+=0.04;
      this.trail.push({x:this.x,y:this.y,alpha:1});if(this.trail.length>20)this.trail.shift();
      this.trail.forEach(t=>t.alpha-=0.03);
    }
    draw(){
      // Trail
      this.trail.forEach(t=>{if(t.alpha<=0)return;ctx.beginPath();ctx.arc(t.x,t.y,2,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',70%,60%,'+(t.alpha*0.2)+')';ctx.fill();});
      const glow=3+Math.sin(this.pulse)*2;ctx.save();ctx.shadowColor='hsl('+this.hue+',80%,60%)';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,8,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',60%,50%,0.3)';ctx.fill();
      ctx.strokeStyle='hsl('+this.hue+',80%,60%)';ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;
      ctx.font='6px monospace';ctx.textAlign='center';ctx.fillStyle='hsl('+this.hue+',80%,70%)';ctx.fillText('B'+this.id,this.x,this.y+14);ctx.restore();
    }
  }

  class Msg{
    constructor(src,tgt){this.sx=src.x;this.sy=src.y;this.tx=tgt.x;this.ty=tgt.y;this.progress=0;this.alive=true;}
    update(){this.progress+=0.04;if(this.progress>=1)this.alive=false;return this.alive;}
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress;
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='rgba(255,217,61,'+(1-this.progress)+')';ctx.fill();
    }
  }

  function drawMesh(){
    for(let i=0;i<bots.length;i++)for(let j=i+1;j<bots.length;j++){
      const dx=bots[i].x-bots[j].x,dy=bots[i].y-bots[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){ctx.beginPath();ctx.moveTo(bots[i].x,bots[i].y);ctx.lineTo(bots[j].x,bots[j].y);
        ctx.strokeStyle='rgba(100,200,255,'+(0.15*(1-d/100))+')';ctx.lineWidth=1;ctx.stroke();}
    }
  }

  function setFormation(){
    const formations=['circle','grid','scatter','vee'];
    formation=formations[Math.floor(Math.random()*formations.length)];
    const cx=W/2,cy=H/2;
    bots.forEach((b,i)=>{
      if(formation==='circle'){const a=Math.PI*2/bots.length*i;b.tx=cx+Math.cos(a)*80;b.ty=cy+Math.sin(a)*80;}
      else if(formation==='grid'){const cols=Math.ceil(Math.sqrt(bots.length));b.tx=cx-60+(i%cols)*30;b.ty=cy-60+Math.floor(i/cols)*30;}
      else if(formation==='vee'){b.tx=cx+i*15-bots.length*7;b.ty=cy-Math.abs(i-bots.length/2)*15;}
      else{b.tx=40+Math.random()*(W-80);b.ty=40+Math.random()*(H-80);}
    });
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,68);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,185,68);
    ctx.font='10px monospace';ctx.fillStyle='#00ccff';ctx.textAlign='left';ctx.fillText('SWARM NET',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Bots: '+bots.length+'  Formation: '+formation,16,40);
    ctx.fillText('Messages: '+msgCount,16,54);ctx.fillText('Frame: '+frameCount,16,68);ctx.restore();
  }

  function init(){
    ensureCanvas();
    for(let i=0;i<12;i++)bots.push(new Bot(W/2+(Math.random()-0.5)*100,H/2+(Math.random()-0.5)*100,i));
    setFormation();animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(6,8,16,0.12)';ctx.fillRect(0,0,W,H);
    drawMesh();bots.forEach(b=>{b.update();b.draw();});
    // Random ESP-NOW messages
    if(frameCount%15===0&&bots.length>1){const a=bots[Math.floor(Math.random()*bots.length)];let b;do{b=bots[Math.floor(Math.random()*bots.length)];}while(b===a);msgs.push(new Msg(a,b));msgCount++;}
    for(let i=msgs.length-1;i>=0;i--){if(!msgs[i].update())msgs.splice(i,1);else msgs[i].draw();}
    if(frameCount%300===0)setFormation();
    drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,250);
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
