/**
 * Workshop DIY — Consensus Lab v1.0
 * Raft/PBFT: 5-node cluster, leader election, log replication, heartbeats
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;}}

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

const LANG={
en:{
    ...LANG_BASE.en,
title:'Consensus Lab',subtitle:'🗳️ Raft · 📋 Log · 💓 Heartbeat · ⚡ Election',
disconnected:'Disconnected',connected:'Simulation Active',
mainSection:'Consensus Lab — Raft/PBFT',mainDesc:'Visualize distributed consensus with elections and replication',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',
clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',
help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'The main display shows the Consensus Lab simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The network is scanned to discover active devices and servic',
howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
wiki_raft_title:'🗳️ Raft Algorithm',wiki_raft:'Raft يحلل الإجماع إلى انتخاب قائد ونسخ سجل وسلامة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_pbft_title:'🛡️ PBFT',wiki_pbft:'PBFT يتعامل مع العقد الخبيثة. يتطلب 3f+1 عقدة لتحمل f أخطاء. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_hb_title:'💓 Heartbeats',wiki_hb:'القادة يرسلون نبضات دورية للحفاظ على سلطتهم. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_commit_title:'📋 Log Commit',wiki_commit:'يتم الالتزام بإدخال بمجرد نسخه على الأغلبية. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'🗳️ Consensus Lab ready — 5-node cluster initialized!',
logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
triggerElection:'Trigger Election',replicateLog:'Replicate Log',crashNode:'Crash Node',healNode:'Heal Node',splitBrain:'Split Brain',
step1:'In Raft, nodes start as Followers. When a Follower times out waiting for a heartbeat, it becomes a Candidate and requests votes.',
step2:'A Candidate wins the election by receiving votes from a majority of nodes. It then becomes the Leader for that term.',
step3:'The Leader sends periodic heartbeats to all Followers and replicates log entries to maintain consistency.',
step4:'If the Leader crashes, Followers detect the missing heartbeats and trigger a new election, incrementing the term number.',
labTip1:'Click Trigger Election to start a leader election and watch nodes vote.',
labTip2:'Use Replicate Log to see the leader push entries to followers.',
labTip3:'Crash a node and observe how the cluster handles the failure.',
labTip4:'Try Split Brain to partition the network and see what happens.',
challenge1:'Trigger an election and identify which node becomes Leader. Note the term number.',
challenge2:'Crash the Leader and observe how the cluster elects a new one automatically.',
challenge3:'Create a split brain scenario and explain why neither partition can commit.',
electionStarted:'⚡ Election started — Term',candidateRequesting:'🗳️ Node requesting votes',voteGranted:'✓ Vote granted by Node',leaderElected:'👑 Node elected as Leader for Term',heartbeat:'💓 Heartbeat from Leader to Followers',logReplicated:'📋 Log entry replicated to',committed:'✅ Entry committed by majority',nodeCrashed:'💥 Node crashed!',nodeHealed:'🩹 Node healed and rejoined',splitBrainActive:'⚠️ Network partitioned — Split brain!',splitBrainHealed:'✅ Network partition healed',noLeader:'❌ No leader — trigger an election first',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is Consensus Lab?',faq_a1:'Consensus Lab is an interactive simulation that demonstrates network systems concepts. Visualize distributed consensus with elections and replication. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real distributed networks behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real distributed networks principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32 x3+. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Cyber Range and Esp Gossip Protocol. Each app in this category teaches a different aspect of distributed networks.',demo_s1:'Welcome to Consensus Lab! Look at the main display — this is where the distributed networks simulation runs.',demo_s2:'Click Trigger Election to start a leader election among the 5 nodes. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of distributed networks.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Consensus Lab! This is like a science experiment on your computer. You get to control a real network systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The network is scanned to discover active devices  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches distributed networks concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Consensus Lab: Visualize distributed consensus with elections and replication. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Rf Hacking',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Consensus Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Consensus Lab',
    wiki_math: 'The mathematics behind Consensus Lab: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Consensus Lab demonstrates key principles from network systems. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world RF hacking?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional RF hacking systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
fr:{
title:'Labo Consensus',subtitle:'🗳️ Raft · 📋 Journal · 💓 Battement · ⚡ Élection',
disconnected:'Déconnecté',connected:'Simulation Active',
mainSection:'Labo Consensus — Raft/PBFT',mainDesc:'Visualisez le consensus distribué avec élections et réplication',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements et messages',
clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',
help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'L écran principal affiche la simulation Consensus Lab. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The network is scanned to discover active devices and servic',
howto_2:'Observez l\'animation de vote quand les nœuds envoient des messages RequestVote.',
howto_3:'Utilisez Répliquer Journal pour pousser de nouvelles entrées du leader vers les followers.',
howto_4:'Plantez ou guérissez des nœuds pour tester la tolérance aux pannes.',
wiki_raft_title:'🗳️ Algorithme Raft',wiki_raft:'Raft décompose le consensus en élection de leader, réplication de journal et sécurité.',
wiki_pbft_title:'🛡️ PBFT',wiki_pbft:'PBFT gère les nœuds malveillants. Nécessite 3f+1 nœuds pour tolérer f pannes.',
wiki_hb_title:'💓 Battements',wiki_hb:'Les leaders envoient des battements réguliers pour maintenir leur autorité.',
wiki_commit_title:'📋 Validation',wiki_commit:'Une entrée est validée une fois répliquée sur une majorité de nœuds.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'🗳️ Labo Consensus prêt — cluster de 5 nœuds initialisé !',
logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
triggerElection:'Déclencher Élection',replicateLog:'Répliquer Journal',crashNode:'Planter Nœud',healNode:'Guérir Nœud',splitBrain:'Split Brain',
step1:'Dans Raft, les nœuds démarrent comme Followers. Quand un Follower expire sans battement, il devient Candidat et demande des votes.',
step2:'Un Candidat gagne l\'élection en recevant les votes d\'une majorité. Il devient alors Leader pour ce terme.',
step3:'Le Leader envoie des battements périodiques et réplique les entrées du journal pour maintenir la cohérence.',
step4:'Si le Leader plante, les Followers détectent l\'absence de battements et déclenchent une nouvelle élection.',
labTip1:'Cliquez Déclencher Élection pour lancer une élection et regarder les nœuds voter.',
labTip2:'Utilisez Répliquer Journal pour voir le leader pousser des entrées.',
labTip3:'Plantez un nœud et observez comment le cluster gère la panne.',
labTip4:'Essayez Split Brain pour partitionner le réseau.',
challenge1:'Déclenchez une élection et identifiez le Leader. Notez le numéro de terme.',
challenge2:'Plantez le Leader et observez le cluster élire un nouveau leader automatiquement.',
challenge3:'Créez un split brain et expliquez pourquoi aucune partition ne peut valider.',
electionStarted:'⚡ Élection lancée — Terme',candidateRequesting:'🗳️ Nœud demande des votes',voteGranted:'✓ Vote accordé par Nœud',leaderElected:'👑 Nœud élu Leader pour le Terme',heartbeat:'💓 Battement du Leader aux Followers',logReplicated:'📋 Entrée répliquée vers',committed:'✅ Entrée validée par majorité',nodeCrashed:'💥 Nœud planté !',nodeHealed:'🩹 Nœud guéri et rejoint',splitBrainActive:'⚠️ Réseau partitionné — Split brain !',splitBrainHealed:'✅ Partition réseau guérie',noLeader:'❌ Pas de leader — déclenchez une élection d\'abord',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Consensus Lab est une simulation interactive qui démontre les concepts de systèmes réseau. Visualize distributed consensus with elections and replication. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Cyber Range and Esp Swarm Net ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de piratage RF',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Consensus Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Consensus Lab',
    wiki_math: 'Les mathématiques derrière Consensus Lab : Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Consensus Lab démontre les principes clés de systèmes réseau. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec RF hacking dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
ar:{
title:'مختبر الإجماع',subtitle:'🗳️ Raft · 📋 سجل · 💓 نبض · ⚡ انتخاب',
disconnected:'غير متصل',connected:'المحاكاة نشطة',
mainSection:'مختبر الإجماع — Raft/PBFT',mainDesc:'تصور الإجماع الموزع مع الانتخابات والنسخ',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',
help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
howto_1:'تعرض الشاشة الرئيسية محاكاة Consensus Lab. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The network is scanned to discover active devices and servic',
howto_2:'شاهد رسوم التصويت المتحركة عندما ترسل العقد رسائل طلب التصويت.',
howto_3:'استخدم نسخ السجل لدفع إدخالات جديدة من القائد إلى التابعين.',
howto_4:'أعطب أو اشفِ العقد لاختبار تحمل الأخطاء.',
wiki_raft_title:'🗳️ خوارزمية Raft',wiki_raft:'Raft يحلل الإجماع إلى انتخاب قائد ونسخ سجل وسلامة.',
wiki_pbft_title:'🛡️ PBFT',wiki_pbft:'PBFT يتعامل مع العقد الخبيثة. يتطلب 3f+1 عقدة لتحمل f أخطاء.',
wiki_hb_title:'💓 النبضات',wiki_hb:'القادة يرسلون نبضات دورية للحفاظ على سلطتهم.',
wiki_commit_title:'📋 التزام السجل',wiki_commit:'يتم الالتزام بإدخال بمجرد نسخه على الأغلبية.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'🗳️ مختبر الإجماع جاهز — تمت تهيئة مجموعة من 5 عقد!',
logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
triggerElection:'تشغيل الانتخاب',replicateLog:'نسخ السجل',crashNode:'تعطيل عقدة',healNode:'شفاء عقدة',splitBrain:'انقسام دماغي',
step1:'في Raft، تبدأ العقد كتابعين. عندما ينتهي وقت انتظار التابع للنبض، يصبح مرشحًا ويطلب أصواتًا.',
step2:'يفوز المرشح بالانتخاب بتلقي أصوات من أغلبية العقد. ثم يصبح القائد لذلك المصطلح.',
step3:'القائد يرسل نبضات دورية لجميع التابعين وينسخ إدخالات السجل للحفاظ على الاتساق.',
step4:'إذا تعطل القائد، يكتشف التابعون غياب النبضات ويبدأون انتخابًا جديدًا.',
labTip1:'انقر على تشغيل الانتخاب لبدء انتخاب قائد وشاهد العقد تصوّت.',
labTip2:'استخدم نسخ السجل لمشاهدة القائد يدفع إدخالات للتابعين.',
labTip3:'عطّل عقدة ولاحظ كيف تتعامل المجموعة مع الفشل.',
labTip4:'جرّب الانقسام الدماغي لتقسيم الشبكة.',
challenge1:'شغّل انتخابًا وحدد أي عقدة تصبح القائد. لاحظ رقم المصطلح.',
challenge2:'عطّل القائد ولاحظ كيف تنتخب المجموعة قائدًا جديدًا تلقائيًا.',
challenge3:'أنشئ سيناريو انقسام دماغي واشرح لماذا لا يمكن لأي قسم الالتزام.',
electionStarted:'⚡ بدأ الانتخاب — المصطلح',candidateRequesting:'🗳️ عقدة تطلب أصواتًا',voteGranted:'✓ تم منح صوت من العقدة',leaderElected:'👑 عقدة انتُخبت قائدًا للمصطلح',heartbeat:'💓 نبضة من القائد للتابعين',logReplicated:'📋 تم نسخ إدخال إلى',committed:'✅ تم الالتزام بالإدخال من الأغلبية',nodeCrashed:'💥 تعطلت العقدة!',nodeHealed:'🩹 تم شفاء العقدة وانضمامها',splitBrainActive:'⚠️ الشبكة مقسمة — انقسام دماغي!',splitBrainHealed:'✅ تم إصلاح تقسيم الشبكة',noLeader:'❌ لا يوجد قائد — شغّل انتخابًا أولاً',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Consensus Lab هي محاكاة تفاعلية توضح مفاهيم أنظمة الشبكات. Visualize distributed consensus with elections and replication. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Cyber Range and Esp Swarm Net! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ اختراق التردد',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. يبني Consensus Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Consensus Lab',
    wiki_math: 'الرياضيات وراء Consensus Lab: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Consensus Lab يوضح المبادئ الأساسية في أنظمة الشبكات. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـRF hacking في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const txt=`[${new Date().toLocaleTimeString()}] ${msg}`;d.textContent=txt;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`consensus-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
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
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}

/* ═══════ RAFT CONSENSUS SIMULATION ═══════ */

const NODE_COLORS = ['#3b82f6','#22d3ee','#a3e635','#f97316','#c084fc'];
const NODE_NAMES = ['N1','N2','N3','N4','N5'];
const STATE = { FOLLOWER:'Follower', CANDIDATE:'Candidate', LEADER:'Leader', CRASHED:'Crashed' };

let nodes = [];
let term = 0;
let leaderId = -1;
let logEntries = [];
let logEntryCounter = 0;
let splitBrainMode = false;
let animMessages = [];
let heartbeatInterval = null;
let canvas, ctx;

function initNodes(){
  nodes = NODE_NAMES.map((name,i) => ({
    id: i, name, state: STATE.FOLLOWER, color: NODE_COLORS[i],
    x: 0, y: 0, votes: 0, logCount: 0, partition: 0,
    pulseAlpha: 0, hbAlpha: 0
  }));
  leaderId = -1; term = 0; logEntries = []; logEntryCounter = 0;
  splitBrainMode = false; animMessages = [];
}

function layoutNodes(w,h){
  const cx=w/2, cy=h/2, r=Math.min(w,h)*0.35;
  nodes.forEach((n,i)=>{
    const a = -Math.PI/2 + (2*Math.PI*i)/nodes.length;
    n.x = cx + r*Math.cos(a);
    n.y = cy + r*Math.sin(a);
  });
}

function addRaftLog(msg, cls=''){
  const rl = $('raftLog');
  if(!rl) return;
  const d = document.createElement('div');
  d.className = 'entry'+(cls?' '+cls:'');
  d.textContent = `[T${term}] ${msg}`;
  rl.appendChild(d);
  rl.scrollTop = rl.scrollHeight;
}

function updateNodeStatusBar(){
  const bar = $('nodeStatusBar');
  if(!bar) return;
  bar.innerHTML = '';
  nodes.forEach(n=>{
    const chip = document.createElement('div');
    chip.className = 'node-chip';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = n.state===STATE.CRASHED?'#ef4444':n.state===STATE.LEADER?'#22c55e':n.state===STATE.CANDIDATE?'#fbbf24':n.color;
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode(`${n.name}: ${n.state} [${n.logCount}]`));
    bar.appendChild(chip);
  });
  $('termNum').textContent = term;
}

function sendAnimMessage(from, to, label, color){
  animMessages.push({ fromX:from.x, fromY:from.y, toX:to.x, toY:to.y, t:0, label, color });
}

function drawCanvas(){
  if(!canvas||!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // Draw partition line if split brain
  if(splitBrainMode){
    ctx.save();
    ctx.setLineDash([8,6]);
    ctx.strokeStyle='rgba(239,68,68,0.5)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle='rgba(239,68,68,0.3)';
    ctx.font='bold 11px sans-serif';
    ctx.textAlign='center';
    ctx.fillText('PARTITION',w/2,16);
  }

  // Draw links
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];
      if(a.state===STATE.CRASHED||b.state===STATE.CRASHED) continue;
      if(splitBrainMode && a.partition!==b.partition) continue;
      ctx.beginPath();
      ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle='rgba(255,255,255,0.08)';
      ctx.lineWidth=1;
      ctx.stroke();
    }
  }

  // Draw animated messages
  animMessages.forEach(m=>{
    const x = m.fromX + (m.toX-m.fromX)*m.t;
    const y = m.fromY + (m.toY-m.fromY)*m.t;
    ctx.beginPath();
    ctx.arc(x,y,5,0,Math.PI*2);
    ctx.fillStyle=m.color;
    ctx.fill();
    ctx.font='bold 9px sans-serif';
    ctx.fillStyle=m.color;
    ctx.textAlign='center';
    ctx.fillText(m.label,x,y-10);
    m.t += 0.03;
  });
  animMessages = animMessages.filter(m=>m.t<1);

  // Draw nodes
  nodes.forEach(n=>{
    // Heartbeat pulse
    if(n.hbAlpha>0){
      ctx.beginPath();
      ctx.arc(n.x,n.y,32+10*(1-n.hbAlpha),0,Math.PI*2);
      ctx.strokeStyle=`rgba(34,197,94,${n.hbAlpha})`;
      ctx.lineWidth=2;
      ctx.stroke();
      n.hbAlpha = Math.max(0,n.hbAlpha-0.02);
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(n.x,n.y,24,0,Math.PI*2);
    if(n.state===STATE.CRASHED){
      ctx.fillStyle='rgba(239,68,68,0.2)';
      ctx.strokeStyle='#ef4444';
    } else if(n.state===STATE.LEADER){
      ctx.fillStyle='rgba(34,197,94,0.2)';
      ctx.strokeStyle='#22c55e';
    } else if(n.state===STATE.CANDIDATE){
      ctx.fillStyle='rgba(251,191,36,0.2)';
      ctx.strokeStyle='#fbbf24';
    } else {
      ctx.fillStyle='rgba(255,255,255,0.05)';
      ctx.strokeStyle=n.color;
    }
    ctx.lineWidth=n.state===STATE.LEADER?3:2;
    ctx.fill();ctx.stroke();

    // Crown for leader
    if(n.state===STATE.LEADER){
      ctx.font='16px serif';
      ctx.textAlign='center';
      ctx.fillText('👑',n.x,n.y-28);
    }
    // X for crashed
    if(n.state===STATE.CRASHED){
      ctx.font='bold 20px sans-serif';
      ctx.textAlign='center';
      ctx.fillStyle='#ef4444';
      ctx.fillText('✕',n.x,n.y+7);
    } else {
      ctx.font='bold 12px sans-serif';
      ctx.textAlign='center';
      ctx.fillStyle='#fff';
      ctx.fillText(n.name,n.x,n.y+5);
    }

    // State label
    ctx.font='9px sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText(n.state,n.x,n.y+38);

    // Pulse effect
    if(n.pulseAlpha>0){
      ctx.beginPath();
      ctx.arc(n.x,n.y,28+15*(1-n.pulseAlpha),0,Math.PI*2);
      ctx.strokeStyle=`rgba(251,191,36,${n.pulseAlpha})`;
      ctx.lineWidth=2;
      ctx.stroke();
      n.pulseAlpha=Math.max(0,n.pulseAlpha-0.015);
    }
  });

  requestAnimationFrame(drawCanvas);
}

function getAliveNodes(partition){
  return nodes.filter(n=>n.state!==STATE.CRASHED && (!splitBrainMode || n.partition===partition));
}

async function triggerElection(){
  const s = LANG[currentLang];
  // Pick a random alive follower as candidate
  const followers = nodes.filter(n=>n.state===STATE.FOLLOWER);
  if(followers.length===0){
    log(s.noLeader,'error'); return;
  }
  // If there's a leader, demote first
  if(leaderId>=0 && nodes[leaderId].state===STATE.LEADER){
    nodes[leaderId].state=STATE.FOLLOWER;
  }

  term++;
  const candidate = followers[Math.floor(Math.random()*followers.length)];
  candidate.state = STATE.CANDIDATE;
  candidate.votes = 1; // votes for self
  candidate.pulseAlpha = 1;
  updateNodeStatusBar();
  log(`${s.electionStarted} ${term}`,'info');
  addRaftLog(`Election started by ${candidate.name}`,  'vote');
  playSound('click');

  // Request votes from alive nodes in same partition
  const alive = getAliveNodes(candidate.partition).filter(n=>n.id!==candidate.id);
  for(const voter of alive){
    sendAnimMessage(candidate, voter, 'ReqVote', '#fbbf24');
    await delay(300);
    voter.pulseAlpha = 1;
    candidate.votes++;
    addRaftLog(`${voter.name} voted for ${candidate.name}`, 'vote');
    log(`${s.voteGranted} ${voter.name}`,'tx');
    sendAnimMessage(voter, candidate, 'Vote', '#22d3ee');
    await delay(200);
  }

  // Check majority
  const total = getAliveNodes(candidate.partition).length;
  if(candidate.votes > total/2){
    candidate.state = STATE.LEADER;
    leaderId = candidate.id;
    updateNodeStatusBar();
    addRaftLog(`${candidate.name} elected Leader (${candidate.votes}/${total} votes)`, 'leader');
    log(`${s.leaderElected} ${candidate.name} — Term ${term}`,'success');
    playSound('success');
    setStatus(true);
    startHeartbeats();
  } else {
    candidate.state = STATE.FOLLOWER;
    updateNodeStatusBar();
    log('Election failed — no majority','error');
  }
}

function startHeartbeats(){
  if(heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(()=>{
    if(leaderId<0||nodes[leaderId].state!==STATE.LEADER) {
      clearInterval(heartbeatInterval); return;
    }
    const leader = nodes[leaderId];
    const followers = getAliveNodes(leader.partition).filter(n=>n.id!==leader.id);
    followers.forEach(f=>{
      sendAnimMessage(leader, f, 'HB', 'rgba(34,197,94,0.7)');
      f.hbAlpha = 1;
    });
  }, 2000);
}

async function replicateLog(){
  const s = LANG[currentLang];
  if(leaderId<0||nodes[leaderId].state!==STATE.LEADER){
    log(s.noLeader,'error'); return;
  }
  const leader = nodes[leaderId];
  logEntryCounter++;
  const entry = `cmd-${logEntryCounter}`;
  leader.logCount++;
  addRaftLog(`Leader ${leader.name} appends "${entry}"`, 'commit');
  log(`📋 Leader appends "${entry}"`,'info');
  playSound('click');

  const followers = getAliveNodes(leader.partition).filter(n=>n.id!==leader.id);
  let acks = 1;
  for(const f of followers){
    sendAnimMessage(leader, f, entry, '#c084fc');
    await delay(400);
    f.logCount++;
    acks++;
    sendAnimMessage(f, leader, 'ACK', '#86efac');
    addRaftLog(`${f.name} replicated "${entry}"`, 'commit');
    log(`${s.logReplicated} ${f.name}`,'tx');
    await delay(200);
  }

  const total = getAliveNodes(leader.partition).length;
  if(acks > total/2){
    addRaftLog(`"${entry}" committed (${acks}/${total})`, 'leader');
    log(`${s.committed} (${acks}/${total})`,'success');
    playSound('success');
  }
  updateNodeStatusBar();
}

function crashNode(){
  const s = LANG[currentLang];
  const alive = nodes.filter(n=>n.state!==STATE.CRASHED);
  if(alive.length<=1){ log('Cannot crash — only 1 node left','error'); return; }

  // Prefer crashing leader for more interesting behavior
  let target;
  if(leaderId>=0 && nodes[leaderId].state===STATE.LEADER && Math.random()<0.6){
    target = nodes[leaderId];
  } else {
    const nonLeader = alive.filter(n=>n.state!==STATE.LEADER);
    target = nonLeader.length>0 ? nonLeader[Math.floor(Math.random()*nonLeader.length)] : alive[0];
  }

  const wasLeader = target.state===STATE.LEADER;
  target.state = STATE.CRASHED;
  if(wasLeader){ leaderId = -1; clearInterval(heartbeatInterval); setStatus(false); }
  target.pulseAlpha = 1;
  updateNodeStatusBar();
  addRaftLog(`${target.name} CRASHED!${wasLeader?' (was Leader)':''}`, 'crash');
  log(`${s.nodeCrashed} ${target.name}${wasLeader?' (Leader)':''}`,'error');
  playSound('error');

  // Auto-elect if leader crashed
  if(wasLeader){
    setTimeout(()=>triggerElection(), 1500);
  }
}

function healNode(){
  const s = LANG[currentLang];
  const crashed = nodes.filter(n=>n.state===STATE.CRASHED);
  if(crashed.length===0){ log('No crashed nodes to heal','info'); return; }
  const target = crashed[Math.floor(Math.random()*crashed.length)];
  target.state = STATE.FOLLOWER;
  target.pulseAlpha = 1;
  updateNodeStatusBar();
  addRaftLog(`${target.name} healed and rejoined`, 'leader');
  log(`${s.nodeHealed} ${target.name}`,'success');
  playSound('success');
}

function toggleSplitBrain(){
  const s = LANG[currentLang];
  splitBrainMode = !splitBrainMode;
  if(splitBrainMode){
    // Partition: first 2 nodes vs last 3
    nodes.forEach((n,i)=> n.partition = i<2 ? 0 : 1);
    if(leaderId>=0 && nodes[leaderId].partition===0){
      // Leader in minority — loses authority
      nodes[leaderId].state = STATE.FOLLOWER;
      leaderId = -1;
      clearInterval(heartbeatInterval);
      setStatus(false);
    }
    addRaftLog('Network partitioned — split brain!', 'crash');
    log(s.splitBrainActive,'error');
    playSound('error');
  } else {
    nodes.forEach(n=> n.partition=0);
    addRaftLog('Partition healed', 'leader');
    log(s.splitBrainHealed,'success');
    playSound('success');
  }
  updateNodeStatusBar();
}

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

function initCanvas(){
  canvas = $('clusterCanvas');
  if(!canvas) return;
  ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = canvas.clientWidth * (window.devicePixelRatio||1);
    canvas.height = 320 * (window.devicePixelRatio||1);
    ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1);
    layoutNodes(canvas.clientWidth, 320);
  }
  resize();
  window.addEventListener('resize', resize);
  drawCanvas();
}

/* ═══════ INIT ═══════ */

function init(){
  initSplash();
  const lw = $('logoWrap');
  if(lw) lw.innerHTML = LOGO_SVG;

  initHelpTabs();
  initLogFilters();
  initLogResize();
  initHijriDate();
  initKonami();

  // Panels
  $('helpBtn').addEventListener('click', openHelp);
  $('helpCloseBtn').addEventListener('click', closeHelp);
  $('helpOverlay').addEventListener('click', closeHelp);
  $('settingsBtn').addEventListener('click', openSettings);
  $('settingsCloseBtn').addEventListener('click', closeSettings);
  $('settingsOverlay').addEventListener('click', closeSettings);
  $('logBtn').addEventListener('click', toggleLog);
  $('logCloseBtn').addEventListener('click', closeLog);
  $('clearLogBtn').addEventListener('click', clearLog);
  $('copyLogBtn').addEventListener('click', copyLog);
  $('exportLogBtn').addEventListener('click', exportLog);

  // Sound
  const st=$('soundToggle');
  if(st) st.addEventListener('change',()=>{soundEnabled=st.checked;playSound('click');});

  // Breathing
  const bb=$('breathingBtn');
  if(bb) bb.addEventListener('click',()=>{toggleBreathing();const dd=$('dhikrDisplay');if(dd)dd.style.display=breathingActive?'flex':'none';});
  const db=$('dhikrBtn');
  if(db) db.addEventListener('click',incrementDhikr);

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape') closeAllPanels();
  });

  const langSel=$('langSelect');
  if(langSel) langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');
  if(themeSel) themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  try{
    const sl=localStorage.getItem('wdiy-lang');
    const st2=localStorage.getItem('wdiy-theme');
    if(st2) setTheme(st2);
    if(sl) setLanguage(sl);
  }catch{}

  // Init Raft simulation
  initNodes();
  initCanvas();
  updateNodeStatusBar();

  // Button handlers
  $('electionBtn').addEventListener('click', triggerElection);
  $('replicateBtn').addEventListener('click', replicateLog);
  $('crashBtn').addEventListener('click', crashNode);
  $('healBtn').addEventListener('click', healNode);
  $('splitBrainBtn').addEventListener('click', toggleSplitBrain);

  setStatus(false);
  log(LANG[currentLang].ready,'success');
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();


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
