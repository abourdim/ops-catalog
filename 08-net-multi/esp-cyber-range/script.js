/**
 * Workshop DIY — Cyber Range v1.0
 * Red vs Blue — Attack/Defense Training Simulator
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}}

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

const LANG={
en:{
    ...LANG_BASE.en,
title:'Cyber Range',subtitle:'⚔️ red team · 🛡️ blue team · 🏢 network',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Cyber Range — Red vs Blue',mainDesc:'Physical network for attack/defense training',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'The main display shows the Cyber Range simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The network is scanned to discover active devices and servic',
howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
wiki_red_title:'⚔️ Red Team',wiki_red:'الفرق الحمراء تحاكي المهاجمين الحقيقيين. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_blue_title:'🛡️ Blue Team',wiki_blue:'الفرق الزرقاء تدافع بالجدران النارية وأنظمة كشف التسلل والتحديثات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_ids_title:'🔍 Intrusion Detection',wiki_ids:'نظام كشف التسلل يراقب أنماط حركة المرور للكشف عن الهجمات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_seg_title:'🔒 Network Segmentation',wiki_seg:'التجزئة تقسم الشبكة إلى مناطق معزولة لاحتواء الاختراقات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'⚔️ Cyber Range ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
redTeam:'Red Team',blueTeam:'Blue Team',
redTools:'Red Team — Attack',blueTools:'Blue Team — Defend',
atkPortScan:'Port Scan',atkExploit:'Exploit Vulnerability',atkLateral:'Lateral Movement',atkExfil:'Data Exfiltration',
defFirewall:'Enable Firewall',defIDS:'Deploy IDS',defPatch:'Patch Systems',defIsolate:'Isolate Segment',
step1:'The corporate network has servers, workstations, and a database connected through switches and routers.',
step2:'Red Team launches attacks: port scanning, exploiting vulnerabilities, and lateral movement.',
step3:'Blue Team defends: firewalls, IDS, patching, and isolating compromised segments.',
step4:'Points are scored for successful attacks and defenses. Highest score wins.',
labTip1:'Start by enabling the firewall (Blue) before Red Team attacks.',
labTip2:'Launch a port scan (Red) to discover open services, then exploit.',
labTip3:'Deploy IDS (Blue) to detect lateral movement.',
labTip4:'Watch the event feed for real-time notifications.',
challenge1:'As Red Team, exfiltrate data without Blue Team detecting you.',
challenge2:'As Blue Team, defend all assets with a perfect score.',
challenge3:'Play both sides: launch an attack, then counter it with the right defense.',
atkPortScanOK:'Port scan found 3 open ports on web server',atkPortScanBlocked:'Port scan blocked by firewall!',
atkExploitOK:'Exploited CVE-2024-1234 on web server!',atkExploitBlocked:'Exploit failed — systems are patched!',
atkLateralOK:'Moved laterally to database server',atkLateralBlocked:'Lateral movement detected by IDS!',
atkExfilOK:'Data exfiltrated: 2.3 GB stolen!',atkExfilBlocked:'Exfiltration blocked — segment isolated!',
defFirewallOK:'Firewall enabled — blocking unauthorized traffic',defIDSOK:'IDS deployed — monitoring for anomalies',
defPatchOK:'All systems patched — vulnerabilities closed',defIsolateOK:'Network segment isolated — containment active',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Cyber Range?',faq_a1:'Cyber Range is an interactive simulation that demonstrates network systems concepts. Physical network for attack/defense training. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real distributed networks behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real distributed networks principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32 x3+. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Consensus Lab and Esp Gossip Protocol. Each app in this category teaches a different aspect of distributed networks.',demo_s1:'Welcome to Cyber Range! Look at the main display — this is where the distributed networks simulation runs.',demo_s2:'Use Red Team buttons to launch attacks against the corporate network. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of distributed networks.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols. The simulation brings this concept to life through interactive visualization. Instead of reading about it in a textbook, you see it happen in real time and control the variables yourself.',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet. This principle connects to many real-world applications. Engineers, researchers, and security professionals use this knowledge daily. The hands-on experience here builds practical understanding.',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Cyber Range! This is like a science experiment on your computer. You get to control a real network systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The network is scanned to discover active devices  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches distributed networks concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Cyber Range: Physical network for attack/defense training. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Rf Hacking',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Cyber Range builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Cyber Range',
    wiki_math: 'The mathematics behind Cyber Range: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Cyber Range demonstrates key principles from network systems. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world RF hacking?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional RF hacking systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'DNS Resolution Journey',related1_desc:'Recursive DNS resolution step by step',related1_path:'../../06-net-browser/web-dns-odyssey/index.html',related2_name:'Packet Storm — Traffic Generator',related2_desc:'Generate fake network traffic with cyberpunk visualization',related2_path:'../../05-net-esp32/esp-packet-storm/index.html',related3_name:'AS Topology',related3_desc:'BGP route hijacking simulation',related3_path:'../../06-net-browser/web-bgp-simulator/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Consensus Lab — Raft/PBFT',pathPrev_path:'../../08-net-multi/esp-consensus-lab/index.html',pathNext_name:'Gossip Protocol — Epidemic Spread',pathNext_path:'../../08-net-multi/esp-gossip-protocol/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does AI stand for?',quiz_q1a:'Automated Input',quiz_q1b:'Artificial Intelligence',quiz_q1c:'Analog Interface',quiz_q1d:'Active Integration',quiz_q1_answer:'1',quiz_q2:'What is machine learning?',quiz_q2a:'Programming robots',quiz_q2b:'Systems that learn from data',quiz_q2c:'Manual computation',quiz_q2d:'Hardware design',quiz_q2_answer:'1',quiz_q3:'Which frequency range is UHF?',quiz_q3a:'3-30 MHz',quiz_q3b:'30-300 MHz',quiz_q3c:'300 MHz-3 GHz',quiz_q3d:'3-30 GHz',quiz_q3_answer:'2',quiz_q4:'If frequency doubles, what happens to wavelength?',quiz_q4a:'Doubles',quiz_q4b:'Halves',quiz_q4c:'Stays same',quiz_q4d:'Triples',quiz_q4_answer:'1',quiz_q5:'What is a neural network?',quiz_q5a:'Physical wires',quiz_q5b:'Computing system inspired by biological neurons',quiz_q5c:'Social network',quiz_q5d:'Radio network',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'The Aldrich Ames case (1994) revealed how a CIA mole used dead drops to pass classified intelligence to the Soviet Union for nearly a decade before detection, compromising over 100 operations.',realworld2:'Operation Ivy Bells (1970s-80s) was a joint NSA/Navy mission to tap Soviet undersea communication cables in the Sea of Okhotsk. Divers placed recording pods on the cable, retrieving them monthly by submarine.',realworld3:'Numbers Stations have broadcast encrypted shortwave messages to field agents since the Cold War. UVB-76 (the Buzzer) in Russia has transmitted a monotone buzz since 1982, occasionally interrupted by coded voice messages.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In night operations, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in night operations and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Cyber Range demonstrates a fundamental concept in night operations. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Cyber Range have direct real-world applications. Professionals in night operations use these same concepts daily. In industry, micro:bit and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with night operations carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.',proTipTitle:'💡 Pro Tips',proTip1:'Always check your battery level before field operations. A dying micro:bit produces unreliable sensor readings that can corrupt your entire dataset.',proTip2:'Use radio group numbers above 100 to avoid interference from other micro:bit users in the area. Default groups 0-10 are crowded.',funFactTitle:'🎯 Did You Know?',funFact:'During the Cold War, the CIA built a robot dragonfly in the 1970s to carry a miniature microphone. Project Insectothopter was abandoned because it couldn\\x27t fly in wind.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
fr:{
title:'Cyber Range',subtitle:'⚔️ équipe rouge · 🛡️ équipe bleue · 🏢 réseau',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Cyber Range — Rouge vs Bleu',mainDesc:'Réseau physique pour entraînement attaque/défense',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'L écran principal affiche la simulation Cyber Range. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Utilisez les boutons Équipe Bleue pour déployer des défenses.',
howto_3:'Regardez le canevas et le flux d\'événements.',howto_4:'Essayez de surpasser l\'équipe adverse.',
wiki_red_title:'⚔️ Équipe Rouge',wiki_red:'Les équipes rouges simulent de vrais attaquants.',
wiki_blue_title:'🛡️ Équipe Bleue',wiki_blue:'Les équipes bleues défendent avec pare-feu, IDS, correctifs.',
wiki_ids_title:'🔍 Détection d\'Intrusion',wiki_ids:'L\'IDS surveille le trafic pour détecter les attaques.',
wiki_seg_title:'🔒 Segmentation',wiki_seg:'La segmentation divise un réseau en zones isolées.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'⚔️ Cyber Range prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
redTeam:'Équipe Rouge',blueTeam:'Équipe Bleue',
redTools:'Équipe Rouge — Attaque',blueTools:'Équipe Bleue — Défense',
atkPortScan:'Scan de Ports',atkExploit:'Exploiter Vulnérabilité',atkLateral:'Mouvement Latéral',atkExfil:'Exfiltration de Données',
defFirewall:'Activer Pare-feu',defIDS:'Déployer IDS',defPatch:'Patcher Systèmes',defIsolate:'Isoler Segment',
step1:'Le réseau d\'entreprise a des serveurs, postes de travail et base de données connectés.',
step2:'L\'Équipe Rouge lance des attaques : scan de ports, exploitation, mouvement latéral.',
step3:'L\'Équipe Bleue défend : pare-feu, IDS, correctifs, isolation des segments.',
step4:'Des points sont marqués pour les attaques et défenses réussies.',
labTip1:'Commencez par activer le pare-feu avant les attaques.',labTip2:'Lancez un scan de ports pour découvrir les services.',
labTip3:'Déployez l\'IDS pour détecter le mouvement latéral.',labTip4:'Regardez le flux d\'événements en temps réel.',
challenge1:'En tant qu\'Équipe Rouge, exfiltrez des données sans être détecté.',
challenge2:'En tant qu\'Équipe Bleue, défendez avec un score parfait.',
challenge3:'Jouez les deux côtés : attaquez puis contrez avec la bonne défense.',
atkPortScanOK:'Scan trouvé 3 ports ouverts sur le serveur web',atkPortScanBlocked:'Scan bloqué par le pare-feu !',
atkExploitOK:'CVE-2024-1234 exploité sur le serveur !',atkExploitBlocked:'Exploit échoué — systèmes patchés !',
atkLateralOK:'Mouvement latéral vers le serveur de base de données',atkLateralBlocked:'Mouvement latéral détecté par l\'IDS !',
atkExfilOK:'Données exfiltrées : 2.3 Go volés !',atkExfilBlocked:'Exfiltration bloquée — segment isolé !',
defFirewallOK:'Pare-feu activé — trafic non autorisé bloqué',defIDSOK:'IDS déployé — surveillance des anomalies',
defPatchOK:'Systèmes patchés — vulnérabilités fermées',defIsolateOK:'Segment réseau isolé — confinement actif',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Cyber Range est une simulation interactive qui démontre les concepts de systèmes réseau. Physical network for attack/defense training. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Swarm Net and Esp Internet Simulator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles. La simulation donne vie à ce concept par la visualisation interactive. Au lieu de le lire dans un livre, vous le voyez se produire en temps réel et contrôlez les variables.',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets. Ce principe se connecte à de nombreuses applications réelles. Les ingénieurs et chercheurs utilisent ces connaissances quotidiennement.',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de piratage RF',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Cyber Range s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Cyber Range',
    wiki_math: 'Les mathématiques derrière Cyber Range : Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Cyber Range démontre les principes clés de systèmes réseau. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec RF hacking dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Voyage de Resolution DNS',related1_desc:'Resolution DNS recursive etape par etape',related1_path:'../../06-net-browser/web-dns-odyssey/index.html',related2_name:'Packet Storm — Générateur de trafic',related2_desc:'Générez du faux trafic réseau avec visualisation cyberpunk',related2_path:'../../05-net-esp32/esp-packet-storm/index.html',related3_name:'Topologie AS',related3_desc:'Simulation de detournement BGP',related3_path:'../../06-net-browser/web-bgp-simulator/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Labo Consensus — Raft/PBFT',pathPrev_path:'../../08-net-multi/esp-consensus-lab/index.html',pathNext_name:'Protocole Gossip — Propagation Épidémique',pathNext_path:'../../08-net-multi/esp-gossip-protocol/index.html',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'affaire Aldrich Ames (1994) a révélé comment une taupe de la CIA utilisait des boîtes aux lettres mortes pour transmettre des renseignements classifiés à l\'Union soviétique pendant près d\'une décennie.',realworld2:'L\'opération Ivy Bells (1970-80) était une mission conjointe NSA/Marine pour intercepter les câbles de communication sous-marins soviétiques en mer d\'Okhotsk.',realworld3:'Les stations de nombres diffusent des messages chiffrés par ondes courtes aux agents de terrain depuis la Guerre froide. UVB-76 émet un bourdonnement monotone depuis 1982.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En opérations nocturnes, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en opérations nocturnes et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Cyber Range illustre un concept fondamental en opérations nocturnes. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Cyber Range ont des applications directes dans le monde réel. Les professionnels de opérations nocturnes utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, micro:bit et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en opérations nocturnes implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
ar:{
title:'ميدان السيبراني',subtitle:'⚔️ فريق أحمر · 🛡️ فريق أزرق · 🏢 شبكة',
disconnected:'غير متصل',connected:'متصل',
mainSection:'الميدان السيبراني — أحمر ضد أزرق',mainDesc:'شبكة فيزيائية للتدريب على الهجوم والدفاع',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
howto_1:'تعرض الشاشة الرئيسية محاكاة Cyber Range. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'استخدم أزرار الفريق الأزرق لنشر الدفاعات.',
howto_3:'شاهد اللوحة وتغذية الأحداث.',howto_4:'حاول التفوق على الفريق المنافس.',
wiki_red_title:'⚔️ الفريق الأحمر',wiki_red:'الفرق الحمراء تحاكي المهاجمين الحقيقيين.',
wiki_blue_title:'🛡️ الفريق الأزرق',wiki_blue:'الفرق الزرقاء تدافع بالجدران النارية وأنظمة كشف التسلل والتحديثات.',
wiki_ids_title:'🔍 كشف التسلل',wiki_ids:'نظام كشف التسلل يراقب أنماط حركة المرور للكشف عن الهجمات.',
wiki_seg_title:'🔒 تجزئة الشبكة',wiki_seg:'التجزئة تقسم الشبكة إلى مناطق معزولة لاحتواء الاختراقات.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'⚔️ الميدان السيبراني جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
redTeam:'الفريق الأحمر',blueTeam:'الفريق الأزرق',
redTools:'الفريق الأحمر — هجوم',blueTools:'الفريق الأزرق — دفاع',
atkPortScan:'مسح المنافذ',atkExploit:'استغلال ثغرة',atkLateral:'حركة جانبية',atkExfil:'تسريب بيانات',
defFirewall:'تفعيل الجدار الناري',defIDS:'نشر نظام كشف التسلل',defPatch:'تحديث الأنظمة',defIsolate:'عزل القطاع',
step1:'شبكة الشركة تحتوي على خوادم ومحطات عمل وقاعدة بيانات.',
step2:'الفريق الأحمر يشن هجمات: مسح منافذ واستغلال ثغرات وحركة جانبية.',
step3:'الفريق الأزرق يدافع: جدران نارية وأنظمة كشف تسلل وتحديثات وعزل.',
step4:'يتم تسجيل نقاط للهجمات والدفاعات الناجحة.',
labTip1:'ابدأ بتفعيل الجدار الناري قبل الهجمات.',labTip2:'أطلق مسح منافذ لاكتشاف الخدمات.',
labTip3:'انشر نظام كشف التسلل للكشف عن الحركة الجانبية.',labTip4:'راقب تغذية الأحداث.',
challenge1:'كفريق أحمر، سرّب بيانات دون أن يكتشفك الفريق الأزرق.',
challenge2:'كفريق أزرق، ادفع بنتيجة مثالية بدون هجمات ناجحة.',
challenge3:'العب الجانبين: اشن هجومًا ثم صدّه بالدفاع المناسب.',
atkPortScanOK:'مسح المنافذ وجد 3 منافذ مفتوحة',atkPortScanBlocked:'مسح المنافذ حُظر بالجدار الناري!',
atkExploitOK:'تم استغلال CVE-2024-1234!',atkExploitBlocked:'فشل الاستغلال — الأنظمة محدّثة!',
atkLateralOK:'حركة جانبية نحو خادم قاعدة البيانات',atkLateralBlocked:'حركة جانبية كُشفت بنظام كشف التسلل!',
atkExfilOK:'تم تسريب 2.3 جيجابايت!',atkExfilBlocked:'التسريب حُظر — القطاع معزول!',
defFirewallOK:'الجدار الناري مُفعّل — حظر حركة المرور غير المصرح بها',defIDSOK:'نظام كشف التسلل مُنشر — مراقبة الشذوذ',
defPatchOK:'جميع الأنظمة محدّثة — الثغرات مُغلقة',defIsolateOK:'قطاع الشبكة معزول — الاحتواء نشط',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Cyber Range هي محاكاة تفاعلية توضح مفاهيم أنظمة الشبكات. Physical network for attack/defense training. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Swarm Net and Esp Internet Simulator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات. تجلب المحاكاة هذا المفهوم إلى الحياة من خلال التصور التفاعلي. بدلاً من القراءة عنه، تراه يحدث في الوقت الفعلي وتتحكم في المتغيرات بنفسك.',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت. يرتبط هذا المبدأ بتطبيقات عديدة في العالم الحقيقي. يستخدم المهندسون والباحثون هذه المعرفة يومياً.',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ اختراق التردد',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. يبني Cyber Range على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Cyber Range',
    wiki_math: 'الرياضيات وراء Cyber Range: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Cyber Range يوضح المبادئ الأساسية في أنظمة الشبكات. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـRF hacking في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'رحلة حل DNS',related1_desc:'حل DNS التكراري خطوة بخطوة',related1_path:'../../06-net-browser/web-dns-odyssey/index.html',related2_name:'Packet Storm — مولّد حركة مرور',related2_desc:'ولّد حركة شبكة مزيفة مع تصور سايبربانك',related2_path:'../../05-net-esp32/esp-packet-storm/index.html',related3_name:'طوبولوجيا AS',related3_desc:'محاكاة اختطاف مسارات BGP',related3_path:'../../06-net-browser/web-bgp-simulator/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مختبر الإجماع — Raft/PBFT',pathPrev_path:'../../08-net-multi/esp-consensus-lab/index.html',pathNext_name:'بروتوكول الثرثرة — انتشار وبائي',pathNext_path:'../../08-net-multi/esp-gossip-protocol/index.html',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'كشفت قضية ألدريتش أيمز (1994) كيف استخدم عميل مزدوج نقاط التسليم السرية لنقل معلومات استخبارية مصنفة للاتحاد السوفيتي لمدة عقد تقريبًا.',realworld2:'كانت عملية آيفي بيلز في السبعينيات والثمانينيات مهمة مشتركة بين وكالة الأمن القومي والبحرية للتنصت على كابلات الاتصالات السوفيتية تحت البحر.',realworld3:'تبث محطات الأرقام رسائل مشفرة عبر الموجات القصيرة للعملاء الميدانيين منذ الحرب الباردة.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في عمليات ليلية معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في عمليات ليلية وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Cyber Range يوضح مفهومًا أساسيًا في عمليات ليلية. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Cyber Range لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في عمليات ليلية هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ micro:bit وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال عمليات ليلية يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tgt=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ═══════ CYBER RANGE SIMULATION ═══════ */

const RANGE_NODES = [
  {id:'internet',label:'Internet',icon:'🌐',color:'#8a7e6e',x:0.08,y:0.15},
  {id:'fw',label:'Firewall',icon:'🛡️',color:'#f97316',x:0.25,y:0.15},
  {id:'router',label:'Router',icon:'🔀',color:'#a3e635',x:0.45,y:0.15},
  {id:'switch1',label:'Switch A',icon:'🔌',color:'#22d3ee',x:0.35,y:0.5},
  {id:'switch2',label:'Switch B',icon:'🔌',color:'#22d3ee',x:0.65,y:0.5},
  {id:'web',label:'Web Server',icon:'🖥️',color:'#3b82f6',x:0.20,y:0.82},
  {id:'workstation',label:'Workstation',icon:'💻',color:'#c084fc',x:0.45,y:0.82},
  {id:'db',label:'Database',icon:'🗄️',color:'#ef4444',x:0.70,y:0.82},
  {id:'ids',label:'IDS',icon:'🔍',color:'#facc15',x:0.88,y:0.35},
];

const RANGE_LINKS = [
  ['internet','fw'],['fw','router'],['router','switch1'],['router','switch2'],
  ['switch1','web'],['switch1','workstation'],['switch2','db'],['switch2','ids'],
];

let rangeCanvas, rangeCtx;
let redScore = 0, blueScore = 0;
let defenses = { firewall: false, ids: false, patch: false, isolate: false };
let attackAnims = []; // {from, to, progress, color, label}

function rangeInit() {
  rangeCanvas = $('rangeCanvas'); if (!rangeCanvas) return;
  rangeCtx = rangeCanvas.getContext('2d');
  rangeResize(); window.addEventListener('resize', rangeResize);

  // Red team buttons
  document.querySelectorAll('[data-attack]').forEach(btn => {
    btn.addEventListener('click', () => { handleAttack(btn.dataset.attack); playSound('click'); });
  });

  // Blue team buttons
  document.querySelectorAll('[data-defend]').forEach(btn => {
    btn.addEventListener('click', () => { handleDefense(btn.dataset.defend); playSound('click'); });
  });

  rangeRender();
}

function rangeResize() {
  if (!rangeCanvas) return;
  const r = rangeCanvas.parentElement.getBoundingClientRect();
  rangeCanvas.width = r.width - 2; rangeCanvas.height = 250;
}

function handleAttack(type) {
  const s = LANG[currentLang];
  let success = false, msg = '';

  switch (type) {
    case 'portscan':
      success = !defenses.firewall;
      msg = success ? s.atkPortScanOK : s.atkPortScanBlocked;
      addAnim('internet', 'web', success ? '#ef4444' : '#8a7e6e');
      break;
    case 'exploit':
      success = !defenses.patch;
      msg = success ? s.atkExploitOK : s.atkExploitBlocked;
      addAnim('internet', 'web', success ? '#ef4444' : '#8a7e6e');
      break;
    case 'lateral':
      success = !defenses.ids;
      msg = success ? s.atkLateralOK : s.atkLateralBlocked;
      addAnim('web', 'db', success ? '#ef4444' : '#8a7e6e');
      break;
    case 'exfil':
      success = !defenses.isolate;
      msg = success ? s.atkExfilOK : s.atkExfilBlocked;
      addAnim('db', 'internet', success ? '#ef4444' : '#8a7e6e');
      break;
  }

  if (success) { redScore += 10; log(`⚔️ ${msg}`, 'error'); }
  else { blueScore += 5; log(`🛡️ ${msg}`, 'success'); }

  addEvent(msg, success ? 'event-red' : 'event-blue');
  updateScores();
}

function handleDefense(type) {
  const s = LANG[currentLang];
  defenses[type] = true;
  let msg = '';
  switch (type) {
    case 'firewall': msg = s.defFirewallOK; addAnim('fw', 'router', '#3b82f6'); break;
    case 'ids': msg = s.defIDSOK; addAnim('ids', 'switch2', '#facc15'); break;
    case 'patch': msg = s.defPatchOK; addAnim('router', 'web', '#22c55e'); break;
    case 'isolate': msg = s.defIsolateOK; addAnim('switch2', 'db', '#3b82f6'); break;
  }
  blueScore += 5;
  log(`🛡️ ${msg}`, 'success');
  addEvent(msg, 'event-blue');
  updateScores();
}

function addAnim(fromId, toId, color) {
  attackAnims.push({ fromId, toId, progress: 0, color, startTime: Date.now() });
}

function addEvent(text, cls) {
  const feed = $('eventFeed'); if (!feed) return;
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function updateScores() {
  const rs = $('redScore'), bs = $('blueScore');
  if (rs) rs.textContent = redScore;
  if (bs) bs.textContent = blueScore;
}

function rangeRender() {
  function frame() { rangeDraw(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function rangeDraw() {
  const ctx = rangeCtx; if (!ctx || !rangeCanvas) return;
  const w = rangeCanvas.width, h = rangeCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';

  // Links
  RANGE_LINKS.forEach(([aId, bId]) => {
    const a = RANGE_NODES.find(n => n.id === aId), b = RANGE_NODES.find(n => n.id === bId);
    if (!a || !b) return;
    ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h);
    ctx.strokeStyle = mutedCol + '30'; ctx.lineWidth = 2; ctx.stroke();
  });

  // Defense indicators
  if (defenses.firewall) { const n = RANGE_NODES.find(n => n.id === 'fw'); ctx.beginPath(); ctx.arc(n.x*w, n.y*h, 24, 0, Math.PI*2); ctx.strokeStyle = '#3b82f680'; ctx.lineWidth = 3; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]); }
  if (defenses.ids) { const n = RANGE_NODES.find(n => n.id === 'ids'); ctx.beginPath(); ctx.arc(n.x*w, n.y*h, 24, 0, Math.PI*2); ctx.strokeStyle = '#facc1580'; ctx.lineWidth = 3; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]); }

  // Nodes
  RANGE_NODES.forEach(node => {
    const px = node.x * w, py = node.y * h;
    ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '25'; ctx.fill();
    ctx.strokeStyle = node.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(node.icon, px, py);
    ctx.font = 'bold 8px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.fillText(node.label, px, py + 26);
  });

  // Attack/defense animations
  const now = Date.now();
  attackAnims = attackAnims.filter(a => {
    const elapsed = (now - a.startTime) / 1000;
    if (elapsed > 1.5) return false;
    const progress = Math.min(elapsed / 1.0, 1);
    const from = RANGE_NODES.find(n => n.id === a.fromId);
    const to = RANGE_NODES.find(n => n.id === a.toId);
    if (!from || !to) return false;
    const fx = from.x * w, fy = from.y * h, tx = to.x * w, ty = to.y * h;
    const px = fx + (tx - fx) * progress, py = fy + (ty - fy) * progress;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = a.color; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = a.color + '30'; ctx.fill();
    return true;
  });
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const sndT=$('soundToggle');
  if(sndT){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}sndT.checked=soundEnabled;sndT.addEventListener('change',()=>{soundEnabled=sndT.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  const brBtn=$('breathingBtn'),dkD=$('dhikrDisplay'),dkB=$('dhikrBtn');
  if(brBtn)brBtn.onclick=()=>{toggleBreathing();if(dkD)dkD.style.display=breathingActive?'flex':'none';};
  if(dkB)dkB.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();
  rangeInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Cyber Range: Red vs Blue attack/defense
   training with network topology and live attack animations
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const netNodes=[],attacks=[],defenses=[],particles=[];
  let redScore=0,blueScore=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#080810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const NODE_TYPES=[
    {name:'Firewall',icon:'\u{1F6E1}',color:'#4d96ff'},
    {name:'Web Server',icon:'\u{1F5A5}',color:'#6bcb77'},
    {name:'Database',icon:'\u{1F4BE}',color:'#ffd93d'},
    {name:'Router',icon:'\u{1F500}',color:'#00ccff'},
    {name:'Workstation',icon:'\u{1F4BB}',color:'#ff78ae'},
    {name:'IDS',icon:'\u{1F50D}',color:'#e879f9'}
  ];

  class NetNode{
    constructor(x,y,type){this.x=x;this.y=y;this.type=type;this.shieldActive=false;this.shieldTimer=0;this.compromised=false;this.pulse=Math.random()*Math.PI*2;}
    draw(){
      this.pulse+=0.03;const glow=4+Math.sin(this.pulse)*2;
      ctx.save();
      if(this.compromised){ctx.shadowColor='#ff4444';ctx.shadowBlur=glow+4;}
      else if(this.shieldActive){ctx.shadowColor='#4d96ff';ctx.shadowBlur=glow+6;}
      else{ctx.shadowColor=this.type.color;ctx.shadowBlur=glow;}
      ctx.beginPath();ctx.arc(this.x,this.y,20,0,Math.PI*2);
      ctx.fillStyle=this.compromised?'rgba(255,40,40,0.2)':this.shieldActive?'rgba(77,150,255,0.2)':'rgba(255,255,255,0.05)';
      ctx.fill();ctx.strokeStyle=this.compromised?'#ff4444':this.shieldActive?'#4d96ff':this.type.color;ctx.lineWidth=2;ctx.stroke();
      if(this.shieldActive){ctx.beginPath();ctx.arc(this.x,this.y,26,0,Math.PI*2);ctx.strokeStyle='rgba(77,150,255,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);this.shieldTimer--;if(this.shieldTimer<=0)this.shieldActive=false;}
      ctx.shadowBlur=0;ctx.font='16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.type.icon,this.x,this.y);
      ctx.font='7px monospace';ctx.fillStyle=this.type.color;ctx.fillText(this.type.name,this.x,this.y+28);ctx.restore();
    }
  }

  class Attack{
    constructor(src,tgt){this.sx=src.x;this.sy=src.y;this.tx=tgt.x;this.ty=tgt.y;this.target=tgt;
      this.progress=0;this.speed=0.015+Math.random()*0.01;this.alive=true;
      this.type=['Port Scan','SQL Inject','Lateral Mv','Brute Force','XSS'][Math.floor(Math.random()*5)];
    }
    update(){
      this.progress+=this.speed;
      if(this.progress>=1){
        if(this.target.shieldActive){blueScore+=10;for(let i=0;i<8;i++)particles.push(new Particle(this.tx,this.ty,'#4d96ff'));}
        else{this.target.compromised=true;redScore+=10;for(let i=0;i<8;i++)particles.push(new Particle(this.tx,this.ty,'#ff4444'));setTimeout(()=>{this.target.compromised=false;},2000);}
        this.alive=false;
      }
      return this.alive;
    }
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress;
      ctx.beginPath();ctx.moveTo(this.sx,this.sy);ctx.lineTo(px,py);
      ctx.strokeStyle='rgba(255,60,60,0.5)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='#ff4444';ctx.fill();
      ctx.font='7px monospace';ctx.fillStyle='#ff6666';ctx.textAlign='center';ctx.fillText(this.type,px,py-10);
    }
  }

  class Particle{
    constructor(x,y,color){this.x=x;this.y=y;this.color=color;this.vx=(Math.random()-0.5)*4;this.vy=(Math.random()-0.5)*4;this.life=1;}
    update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.95;this.vy*=0.95;this.life-=0.03;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,2*this.life,0,Math.PI*2);ctx.fillStyle=this.color+Math.floor(this.life*200).toString(16).padStart(2,'0');ctx.fill();}
  }

  function drawLinks(){
    for(let i=0;i<netNodes.length;i++)for(let j=i+1;j<netNodes.length;j++){
      const dx=netNodes[i].x-netNodes[j].x,dy=netNodes[i].y-netNodes[j].y;
      if(Math.sqrt(dx*dx+dy*dy)<160){ctx.beginPath();ctx.moveTo(netNodes[i].x,netNodes[i].y);ctx.lineTo(netNodes[j].x,netNodes[j].y);ctx.strokeStyle='rgba(100,100,200,0.08)';ctx.lineWidth=1;ctx.stroke();}
    }
  }

  function drawScoreboard(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,200,74);ctx.strokeStyle='#8884';ctx.strokeRect(8,8,200,74);
    ctx.font='10px monospace';ctx.textAlign='left';
    ctx.fillStyle='#ff4444';ctx.fillText('\u2694 RED TEAM: '+redScore,16,26);
    ctx.fillStyle='#4d96ff';ctx.fillText('\u{1F6E1} BLUE TEAM: '+blueScore,16,42);
    ctx.fillStyle='#aaa';ctx.fillText('Nodes: '+netNodes.length+'  Attacks: '+attacks.length,16,58);
    ctx.fillText('Frame: '+frameCount,16,72);ctx.restore();
  }

  function drawGrid(){ctx.strokeStyle='rgba(100,100,200,0.04)';ctx.lineWidth=1;for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}}

  function init(){
    ensureCanvas();
    const cx=W/2,cy=H/2;
    for(let i=0;i<NODE_TYPES.length;i++){const a=Math.PI*2/NODE_TYPES.length*i,r=80+Math.random()*40;netNodes.push(new NetNode(cx+Math.cos(a)*r,cy+Math.sin(a)*r,NODE_TYPES[i]));}
    for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2,r=40+Math.random()*30;netNodes.push(new NetNode(cx+Math.cos(a)*r,cy+Math.sin(a)*r,NODE_TYPES[Math.floor(Math.random()*NODE_TYPES.length)]));}
    animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,16,0.15)';ctx.fillRect(0,0,W,H);drawGrid();drawLinks();
    netNodes.forEach(n=>n.draw());
    if(frameCount%120===0&&netNodes.length>1){const src=netNodes[Math.floor(Math.random()*netNodes.length)];let tgt;do{tgt=netNodes[Math.floor(Math.random()*netNodes.length)];}while(tgt===src);attacks.push(new Attack(src,tgt));}
    if(frameCount%90===0){const n=netNodes[Math.floor(Math.random()*netNodes.length)];n.shieldActive=true;n.shieldTimer=180;blueScore+=5;}
    for(let i=attacks.length-1;i>=0;i--){if(!attacks[i].update())attacks.splice(i,1);else attacks[i].draw();}
    for(let i=particles.length-1;i>=0;i--){if(!particles[i].update())particles.splice(i,1);else particles[i].draw();}
    drawScoreboard();animId=requestAnimationFrame(animate);
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
