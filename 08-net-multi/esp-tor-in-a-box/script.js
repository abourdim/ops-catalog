/**
 * Workshop DIY — Tor in a Box v1.0
 * Physical Onion Routing — 3-layer XOR encryption simulation
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];
const APP_VERSION='1.0';
let soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;
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
title:'Tor in a Box',subtitle:'🧅 onion · 🔐 layers · 🛡️ privacy',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Tor in a Box — Physical Onion Routing',mainDesc:'3 ESP32s as relay nodes, real multi-layer encryption',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',
help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'The main display shows the Tor In A Box simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
wiki_tor_title:'🧅 Tor Network',wiki_tor:'Tor هي شبكة حرة للاتصال المجهول عبر 3+ عقد ترحيل. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_xor_title:'🔐 XOR Cipher',wiki_xor:'تشفير XOR يطبق مفتاحًا على مستوى البت. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_relay_title:'📡 Relay Types',wiki_relay:'عقدة الحارس: القفزة الأولى. عقدة الوسط: وسيطة. عقدة المخرج: القفزة الأخيرة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
wiki_anon_title:'🛡️ Anonymity',wiki_anon:'لا تعرف أي عقدة ترحيل كلاً من المصدر والوجهة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'🧅 Tor in a Box ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
sendBtn:'Encrypt & Send',msgPlaceholder:'Type a secret message...',
step1:'The sender wraps the message in 3 encryption layers (like an onion), one key per relay node.',
step2:'Relay 1 (Guard) peels the first layer using its key, revealing the next relay address.',
step3:'Relay 2 (Middle) peels the second layer, revealing the exit relay address.',
step4:'Relay 3 (Exit) peels the final layer, revealing the original plaintext message.',
labTip1:'Type a message and click Encrypt & Send to see triple-layer encryption in action.',
labTip2:'Watch each relay node peel one encryption layer as the message travels through.',
labTip3:'The keys shown are random XOR keys generated for each message.',
labTip4:'Notice how each relay only knows the previous and next hop, never the full path.',
challenge1:'Send a message and verify that each relay only decrypts one layer.',
challenge2:'Compare the encrypted data at each hop. Can any single relay read the plaintext?',
challenge3:'Explain why onion routing needs at least 3 relays for anonymity.',
layerWrapped:'Layer {n} wrapped (Key {n})',layerPeeled:'Relay {n} peeled layer (Key {n})',
plainRevealed:'Exit relay revealed plaintext!',encrypting:'Encrypting 3 layers...',
noMsg:'Please type a message',guardRelay:'Guard Relay',middleRelay:'Middle Relay',exitRelay:'Exit Relay',
sender:'Sender',receiver:'Receiver',
layerLabel:'Layer {n}',plainLabel:'Plaintext',fullEncLabel:'Fully Encrypted',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is Tor in a Box?',faq_a1:'Tor In A Box is an interactive simulation that demonstrates network systems concepts. 3 ESP32s as relay nodes, real multi-layer encryption. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real distributed networks behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real distributed networks principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32 x3+. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Consensus Lab and Esp Cyber Range. Each app in this category teaches a different aspect of distributed networks.',demo_s1:'Welcome to Tor in a Box! Look at the main display — this is where the distributed networks simulation runs.',demo_s2:'Type a secret message in the input field. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of distributed networks.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Tor In A Box! This is like a science experiment on your computer. You get to control a real network systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The network is scanned to discover active devices  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches distributed networks concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Tor in a Box: 3 ESP32s as relay nodes, real multi-layer encryption. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Rf Hacking',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Tor In A Box builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Tor In A Box',
    wiki_math: 'The mathematics behind Tor In A Box: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext. Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced RF hacking practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to RF hacking. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with RF hacking: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in RF hacking.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Rf Hacking carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'One-Time Pad',
    gloss2_def: 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    gloss3_term: 'Header',
    gloss3_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss4_term: 'Port',
    gloss4_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Tor In A Box demonstrates key principles from network systems. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world RF hacking?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional RF hacking systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
fr:{
title:'Tor in a Box',subtitle:'🧅 oignon · 🔐 couches · 🛡️ confidentialité',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Tor in a Box — Routage en Oignon Physique',mainDesc:'3 ESP32 comme relais, chiffrement multi-couches réel',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements et messages',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',
help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'L écran principal affiche la simulation Tor In A Box. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Cliquez Chiffrer & Envoyer pour emballer le message en 3 couches.',
howto_3:'Regardez le paquet traverser les relais Garde, Milieu et Sortie.',howto_4:'Observez l\'affichage des couches pelées à chaque saut.',
wiki_tor_title:'🧅 Réseau Tor',wiki_tor:'Tor est un réseau libre pour la communication anonyme via 3+ relais.',
wiki_xor_title:'🔐 Chiffrement XOR',wiki_xor:'Le XOR applique une clé bit à bit. A XOR K = chiffré, chiffré XOR K = A.',
wiki_relay_title:'📡 Types de Relais',wiki_relay:'Relais garde : premier saut. Relais milieu : intermédiaire. Relais sortie : dernier saut.',
wiki_anon_title:'🛡️ Anonymat',wiki_anon:'Aucun relais ne connaît à la fois l\'origine et la destination.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'🧅 Tor in a Box prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
sendBtn:'Chiffrer & Envoyer',msgPlaceholder:'Tapez un message secret...',
step1:'L\'expéditeur emballe le message en 3 couches de chiffrement, une clé par relais.',
step2:'Le Relais 1 (Garde) pèle la première couche avec sa clé.',
step3:'Le Relais 2 (Milieu) pèle la deuxième couche.',
step4:'Le Relais 3 (Sortie) pèle la couche finale, révélant le message original.',
labTip1:'Tapez un message et cliquez Chiffrer & Envoyer pour voir le triple chiffrement.',
labTip2:'Regardez chaque relais peler une couche de chiffrement.',
labTip3:'Les clés sont des clés XOR aléatoires générées pour chaque message.',
labTip4:'Chaque relais ne connaît que le saut précédent et suivant.',
challenge1:'Envoyez un message et vérifiez que chaque relais ne déchiffre qu\'une couche.',
challenge2:'Comparez les données chiffrées à chaque saut. Un seul relais peut-il lire le texte ?',
challenge3:'Expliquez pourquoi le routage en oignon nécessite au moins 3 relais.',
layerWrapped:'Couche {n} emballée (Clé {n})',layerPeeled:'Relais {n} a pelé la couche (Clé {n})',
plainRevealed:'Le relais de sortie a révélé le texte clair !',encrypting:'Chiffrement de 3 couches...',
noMsg:'Veuillez taper un message',guardRelay:'Relais Garde',middleRelay:'Relais Milieu',exitRelay:'Relais Sortie',
sender:'Expéditeur',receiver:'Destinataire',
layerLabel:'Couche {n}',plainLabel:'Texte clair',fullEncLabel:'Entièrement chiffré',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Tor In A Box est une simulation interactive qui démontre les concepts de systèmes réseau. 3 ESP32s as relay nodes, real multi-layer encryption. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Internet Simulator and Esp Gossip Protocol ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de piratage RF',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Tor In A Box s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Tor In A Box',
    wiki_math: 'Les mathématiques derrière Tor In A Box : Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext. Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de piratage RF utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour piratage RF. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en piratage RF : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Piratage rf implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'One-Time Pad',
    gloss2_def: 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    gloss3_term: 'Header',
    gloss3_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss4_term: 'Port',
    gloss4_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Tor In A Box démontre les principes clés de systèmes réseau. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec RF hacking dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
ar:{
title:'Tor in a Box',subtitle:'🧅 بصلة · 🔐 طبقات · 🛡️ خصوصية',
disconnected:'غير متصل',connected:'متصل',
mainSection:'Tor in a Box — توجيه بصلي فيزيائي',mainDesc:'3 ESP32 كعقد ترحيل، تشفير متعدد الطبقات حقيقي',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',
help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
howto_1:'تعرض الشاشة الرئيسية محاكاة Tor In A Box. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'انقر تشفير وإرسال لتغليف الرسالة بـ3 طبقات.',
howto_3:'شاهد الحزمة تعبر عقد الحارس والوسط والمخرج.',howto_4:'لاحظ عرض الطبقات وهي تُقشر في كل قفزة.',
wiki_tor_title:'🧅 شبكة Tor',wiki_tor:'Tor هي شبكة حرة للاتصال المجهول عبر 3+ عقد ترحيل.',
wiki_xor_title:'🔐 تشفير XOR',wiki_xor:'تشفير XOR يطبق مفتاحًا على مستوى البت.',
wiki_relay_title:'📡 أنواع العقد',wiki_relay:'عقدة الحارس: القفزة الأولى. عقدة الوسط: وسيطة. عقدة المخرج: القفزة الأخيرة.',
wiki_anon_title:'🛡️ المجهولية',wiki_anon:'لا تعرف أي عقدة ترحيل كلاً من المصدر والوجهة.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'🧅 Tor in a Box جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
sendBtn:'تشفير وإرسال',msgPlaceholder:'اكتب رسالة سرية...',
step1:'يغلف المرسل الرسالة بـ3 طبقات تشفير، مفتاح واحد لكل عقدة.',
step2:'العقدة 1 (الحارس) تقشر الطبقة الأولى بمفتاحها.',
step3:'العقدة 2 (الوسط) تقشر الطبقة الثانية.',
step4:'العقدة 3 (المخرج) تقشر الطبقة الأخيرة وتكشف الرسالة الأصلية.',
labTip1:'اكتب رسالة وانقر تشفير وإرسال لمشاهدة التشفير الثلاثي.',
labTip2:'شاهد كل عقدة تقشر طبقة تشفير واحدة.',
labTip3:'المفاتيح المعروضة هي مفاتيح XOR عشوائية لكل رسالة.',
labTip4:'لاحظ أن كل عقدة تعرف فقط القفزة السابقة والتالية.',
challenge1:'أرسل رسالة وتحقق أن كل عقدة تفك طبقة واحدة فقط.',
challenge2:'قارن البيانات المشفرة في كل قفزة. هل يمكن لعقدة واحدة قراءة النص؟',
challenge3:'اشرح لماذا يحتاج التوجيه البصلي إلى 3 عقد على الأقل.',
layerWrapped:'تم تغليف الطبقة {n} (المفتاح {n})',layerPeeled:'العقدة {n} قشرت الطبقة (المفتاح {n})',
plainRevealed:'عقدة المخرج كشفت النص الأصلي!',encrypting:'تشفير 3 طبقات...',
noMsg:'الرجاء كتابة رسالة',guardRelay:'عقدة الحارس',middleRelay:'عقدة الوسط',exitRelay:'عقدة المخرج',
sender:'المرسل',receiver:'المستقبل',
layerLabel:'الطبقة {n}',plainLabel:'نص عادي',fullEncLabel:'مشفر بالكامل',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Tor In A Box هي محاكاة تفاعلية توضح مفاهيم أنظمة الشبكات. 3 ESP32s as relay nodes, real multi-layer encryption. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Internet Simulator and Esp Gossip Protocol! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ اختراق التردد',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. يبني Tor In A Box على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Tor In A Box',
    wiki_math: 'الرياضيات وراء Tor In A Box: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext. Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو اختراق التردد المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في اختراق التردد. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في اختراق التردد: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'اختراق التردد يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'One-Time Pad',
    gloss2_def: 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    gloss3_term: 'Header',
    gloss3_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss4_term: 'Port',
    gloss4_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Tor In A Box يوضح المبادئ الأساسية في أنظمة الشبكات. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـRF hacking في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const txt=`[${new Date().toLocaleTimeString()}] ${msg}`;d.textContent=txt;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
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
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ═══════ TOR / ONION ROUTING SIMULATION ═══════ */

const TOR_NODES = [
  { id:'sender', label:'Sender',    icon:'📤', color:'#3b82f6', x:0.06, y:0.5 },
  { id:'guard',  label:'Guard',     icon:'🛡️', color:'#f97316', x:0.28, y:0.5 },
  { id:'middle', label:'Middle',    icon:'🔀', color:'#a3e635', x:0.50, y:0.5 },
  { id:'exit',   label:'Exit',      icon:'🚪', color:'#c084fc', x:0.72, y:0.5 },
  { id:'receiver',label:'Receiver', icon:'📥', color:'#22d3ee', x:0.94, y:0.5 },
];

const TOR_LINKS = [['sender','guard'],['guard','middle'],['middle','exit'],['exit','receiver']];

let torCanvas, torCtx, torPacket = null;
let keys = [0, 0, 0];

function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ ((key >> (i % 4) * 8) & 0xFF));
  }
  return result;
}

function toHex(str) {
  return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function genKey() { return Math.floor(Math.random() * 0xFFFFFFFF); }

function torInit() {
  torCanvas = $('torCanvas'); if (!torCanvas) return;
  torCtx = torCanvas.getContext('2d');
  torResize(); window.addEventListener('resize', torResize);

  const btn = $('torSendBtn'), input = $('torMsgInput');
  if (btn) btn.addEventListener('click', torSend);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') torSend(); });

  torRender();
}

function torResize() {
  if (!torCanvas) return;
  const r = torCanvas.parentElement.getBoundingClientRect();
  torCanvas.width = r.width - 2;
  torCanvas.height = 220;
}

function torSend() {
  if (torPacket) return;
  const input = $('torMsgInput');
  const msg = input ? input.value.trim() : '';
  const s = LANG[currentLang];
  if (!msg) { log(`❌ ${s.noMsg}`, 'error'); return; }

  // Generate 3 random keys
  keys = [genKey(), genKey(), genKey()];
  $('key1').textContent = `Key 1: 0x${keys[0].toString(16).toUpperCase()}`;
  $('key2').textContent = `Key 2: 0x${keys[1].toString(16).toUpperCase()}`;
  $('key3').textContent = `Key 3: 0x${keys[2].toString(16).toUpperCase()}`;

  // Encrypt in 3 layers: layer3(layer2(layer1(plaintext)))
  const layer1 = xorEncrypt(msg, keys[2]);       // exit key
  const layer2 = xorEncrypt(layer1, keys[1]);     // middle key
  const layer3 = xorEncrypt(layer2, keys[0]);     // guard key

  const layerDisp = $('layerDisplay');
  if (layerDisp) layerDisp.innerHTML = '';

  log(`📤 TX: "${msg}" → ${s.encrypting}`, 'tx');
  log(`🔐 ${s.layerWrapped.replace('{n}','3')} → ${toHex(layer1).slice(0,30)}...`, 'info');
  log(`🔐 ${s.layerWrapped.replace('{n}','2')} → ${toHex(layer2).slice(0,30)}...`, 'info');
  log(`🔐 ${s.layerWrapped.replace('{n}','1')} → ${toHex(layer3).slice(0,30)}...`, 'info');

  addLayerBox(s.fullEncLabel, toHex(layer3), 'encrypted');

  // Animate through relays
  const path = ['sender','guard','middle','exit','receiver'];
  const layers = [layer3, layer2, layer1, msg];
  torPacket = { path, hopIdx: 0, progress: 0, layers, msg, currentLayer: 0 };

  function animate() {
    if (!torPacket) return;
    torPacket.progress += 0.02;
    if (torPacket.progress >= 1) {
      torPacket.progress = 0;
      const arrived = torPacket.path[torPacket.hopIdx + 1];

      if (arrived === 'guard') {
        const decrypted = xorEncrypt(layers[0], keys[0]);
        addLayerBox(`${s.guardRelay} — ${s.layerPeeled.replace(/\{n\}/g,'1')}`, toHex(decrypted), 'encrypted');
        log(`🛡️ ${s.layerPeeled.replace(/\{n\}/g,'1')}`, 'rx');
      } else if (arrived === 'middle') {
        const decrypted = xorEncrypt(layers[1], keys[1]);
        addLayerBox(`${s.middleRelay} — ${s.layerPeeled.replace(/\{n\}/g,'2')}`, toHex(decrypted), 'encrypted');
        log(`🔀 ${s.layerPeeled.replace(/\{n\}/g,'2')}`, 'rx');
      } else if (arrived === 'exit') {
        addLayerBox(`${s.exitRelay} — ${s.plainRevealed}`, `"${msg}"`, 'decrypted');
        log(`🚪 ${s.plainRevealed}: "${msg}"`, 'success');
      } else if (arrived === 'receiver') {
        addLayerBox(s.plainLabel, `"${msg}"`, 'plain');
        log(`📥 RX: "${msg}"`, 'success');
        showToast(s.plainRevealed, 2500);
        torPacket = null; return;
      }

      torPacket.hopIdx++;
      if (torPacket.hopIdx >= torPacket.path.length - 1) { torPacket = null; return; }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function addLayerBox(title, content, cls) {
  const disp = $('layerDisplay'); if (!disp) return;
  const box = document.createElement('div');
  box.className = `layer-box ${cls}`;
  box.innerHTML = `<div class="layer-title">${title}</div>${content}`;
  disp.appendChild(box);
}

function torRender() {
  function frame() { torDraw(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function torDraw() {
  const ctx = torCtx; if (!ctx || !torCanvas) return;
  const w = torCanvas.width, h = torCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';

  // Links
  TOR_LINKS.forEach(([aId, bId]) => {
    const a = TOR_NODES.find(n => n.id === aId), b = TOR_NODES.find(n => n.id === bId);
    if (!a || !b) return;
    const pa = { x: a.x * w, y: a.y * h }, pb = { x: b.x * w, y: b.y * h };
    ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
    ctx.strokeStyle = mutedCol + '40'; ctx.lineWidth = 3; ctx.stroke();
    // Onion layer indicators
    ctx.setLineDash([6, 4]); ctx.strokeStyle = mutedCol + '20'; ctx.stroke(); ctx.setLineDash([]);
  });

  // Nodes
  TOR_NODES.forEach((node, idx) => {
    const px = node.x * w, py = node.y * h;
    // Concentric circles for onion layers (relay nodes only)
    if (idx >= 1 && idx <= 3) {
      for (let r = 3; r >= 1; r--) {
        ctx.beginPath(); ctx.arc(px, py, 16 + r * 8, 0, Math.PI * 2);
        ctx.fillStyle = node.color + (r === 3 ? '08' : r === 2 ? '10' : '18'); ctx.fill();
        ctx.strokeStyle = node.color + '30'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '30'; ctx.fill();
    ctx.strokeStyle = node.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(node.icon, px, py);
    ctx.font = 'bold 9px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.fillText(node.label, px, py + 34);
  });

  // Packet animation
  if (torPacket && torPacket.hopIdx < torPacket.path.length - 1) {
    const from = TOR_NODES.find(n => n.id === torPacket.path[torPacket.hopIdx]);
    const to = TOR_NODES.find(n => n.id === torPacket.path[torPacket.hopIdx + 1]);
    if (from && to) {
      const fx = from.x * w, fy = from.y * h, tx = to.x * w, ty = to.y * h;
      const px = fx + (tx - fx) * torPacket.progress;
      const py = fy + (ty - fy) * torPacket.progress;
      // Draw onion layers around packet based on remaining layers
      const remainingLayers = 3 - torPacket.hopIdx;
      for (let r = remainingLayers; r >= 1; r--) {
        ctx.beginPath(); ctx.arc(px, py, 6 + r * 5, 0, Math.PI * 2);
        const colors = ['#ef4444', '#f97316', '#facc15'];
        ctx.fillStyle = colors[r - 1] + '40'; ctx.fill();
        ctx.strokeStyle = colors[r - 1]; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e'; ctx.fill();
    }
  }
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
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
  torInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Tor in a Box: Onion routing with 3-relay
   packet journey, layer peeling, and encryption visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const relays=[],onionPkts=[],layerParticles=[];let circuitCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0814;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const RELAY_TYPES=[
    {name:'Client',icon:'\u{1F4BB}',color:'#4d96ff'},
    {name:'Guard',icon:'\u{1F6E1}',color:'#ff6b6b'},
    {name:'Middle',icon:'\u{1F9C5}',color:'#ffd93d'},
    {name:'Exit',icon:'\u{1F6AA}',color:'#6bcb77'},
    {name:'Destination',icon:'\u{1F310}',color:'#e879f9'}
  ];

  class Relay{
    constructor(x,y,type){this.x=x;this.y=y;this.type=type;this.pulse=Math.random()*Math.PI*2;this.active=false;this.activeTimer=0;}
    draw(){
      this.pulse+=0.03;if(this.active){this.activeTimer--;if(this.activeTimer<=0)this.active=false;}
      const glow=4+Math.sin(this.pulse)*2;ctx.save();ctx.shadowColor=this.active?'#fff':this.type.color;ctx.shadowBlur=glow+(this.active?6:0);
      ctx.beginPath();ctx.arc(this.x,this.y,22,0,Math.PI*2);ctx.fillStyle=this.active?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.05)';ctx.fill();
      ctx.strokeStyle=this.type.color;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
      ctx.font='16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.type.icon,this.x,this.y);
      ctx.font='8px monospace';ctx.fillStyle=this.type.color;ctx.fillText(this.type.name,this.x,this.y+30);ctx.restore();
    }
  }

  class OnionPacket{
    constructor(){this.step=0;this.progress=0;this.speed=0.012;this.layers=3;this.alive=true;this.peeling=false;this.peelTimer=0;}
    update(){
      if(this.peeling){this.peelTimer++;if(this.peelTimer>20){this.peeling=false;this.peelTimer=0;this.layers=Math.max(0,this.layers-1);this.step++;this.progress=0;}return this.alive;}
      this.progress+=this.speed;
      if(this.progress>=1){
        if(this.step<relays.length-2){relays[this.step+1].active=true;relays[this.step+1].activeTimer=30;
          this.peeling=true;this.peelTimer=0;
          for(let i=0;i<10;i++){const r=relays[this.step+1];layerParticles.push({x:r.x,y:r.y,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*4,life:1,color:RELAY_TYPES[this.step+1].color});}
        }else{this.alive=false;circuitCount++;}
      }
      return this.alive;
    }
    draw(){
      if(this.step>=relays.length-1)return;
      const src=relays[this.step],tgt=relays[this.step+1];
      const px=src.x+(tgt.x-src.x)*this.progress,py=src.y+(tgt.y-src.y)*this.progress;
      // Onion layers
      const colors=['#ff6b6b','#ffd93d','#6bcb77'];
      for(let l=this.layers-1;l>=0;l--){
        ctx.beginPath();ctx.arc(px,py,8+l*4,0,Math.PI*2);ctx.fillStyle=colors[l]+'44';ctx.fill();
        ctx.strokeStyle=colors[l];ctx.lineWidth=1;ctx.stroke();
      }
      // Core dot
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      // Layer count label
      ctx.font='7px monospace';ctx.fillStyle='#ffd93d';ctx.textAlign='center';ctx.fillText(this.layers+' layers',px,py-14);
    }
  }

  function drawCircuit(){
    for(let i=0;i<relays.length-1;i++){
      ctx.beginPath();ctx.moveTo(relays[i].x,relays[i].y);ctx.lineTo(relays[i+1].x,relays[i+1].y);
      ctx.strokeStyle='rgba(150,100,200,0.12)';ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);
    }
  }

  function drawOnionDiagram(){
    const ox=W-60,oy=40;
    ctx.save();ctx.globalAlpha=0.6;
    [20,15,10].forEach((r,i)=>{ctx.beginPath();ctx.arc(ox,oy,r,0,Math.PI*2);ctx.fillStyle=['#ff6b6b44','#ffd93d44','#6bcb7744'][i];ctx.fill();ctx.strokeStyle=['#ff6b6b','#ffd93d','#6bcb77'][i];ctx.lineWidth=1;ctx.stroke();});
    ctx.font='7px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('Onion',ox,oy+28);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,58);ctx.strokeStyle='#c084fc33';ctx.strokeRect(8,8,185,58);
    ctx.font='10px monospace';ctx.fillStyle='#c084fc';ctx.textAlign='left';ctx.fillText('TOR IN A BOX',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Relays: '+relays.length+'  Circuits: '+circuitCount,16,40);
    ctx.fillText('Active: '+onionPkts.length,16,54);ctx.restore();
  }

  function init(){
    ensureCanvas();
    const spacing=W/(RELAY_TYPES.length+1);
    RELAY_TYPES.forEach((t,i)=>{relays.push(new Relay(spacing*(i+1),H/2+(Math.sin(i)*30),t));});
    animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,8,20,0.14)';ctx.fillRect(0,0,W,H);
    drawCircuit();drawOnionDiagram();relays.forEach(r=>r.draw());
    if(frameCount%150===0)onionPkts.push(new OnionPacket());
    for(let i=onionPkts.length-1;i>=0;i--){if(!onionPkts[i].update())onionPkts.splice(i,1);else onionPkts[i].draw();}
    for(let i=layerParticles.length-1;i>=0;i--){const p=layerParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.025;if(p.life<=0)layerParticles.splice(i,1);
      else{ctx.beginPath();ctx.arc(p.x,p.y,3*p.life,0,Math.PI*2);ctx.fillStyle=p.color+Math.floor(p.life*200).toString(16).padStart(2,'0');ctx.fill();}}
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
