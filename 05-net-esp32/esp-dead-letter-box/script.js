/**
 * Workshop DIY — esp-dead-letter-box v1.0
 * WiFi Dead Drop — Hidden AP with Encrypted File Vault
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
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
    title:'Dead Letter Box',subtitle:'📦 scan · 🔐 decrypt · 📂 extract',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Dead Letter Box — WiFi Dead Drops',mainDesc:'ESP32 hidden WiFi AP where agents find encrypted files',
    sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',
    help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    scanBtn:'Scan Networks',probeBtn:'Active Probe',decryptBtn:'Decrypt Selected',downloadBtn:'Download',
    keyPlaceholder:'Decryption key...',fileVault:'File Vault',
    howStep1:'An ESP32 creates a hidden WiFi access point — invisible to normal scans.',
    howStep2:'Agents who know the SSID connect and access the encrypted file vault.',
    howStep3:'Files are XOR-encrypted. Only agents with the key can decrypt them.',
    howStep4:'The dead drop is ephemeral — the ESP32 can be powered off and moved.',
    challenge1:'Why are hidden SSIDs not truly hidden?',
    challenge2:'What makes XOR encryption weak?',
    challenge3:'How could you make a dead drop more secure?',
    challengeReveal1:'Hidden SSIDs are omitted from beacon frames, but are still visible in probe responses, association requests, and data frames.',
    challengeReveal2:'XOR with a short key repeats, making it vulnerable to frequency analysis. If the plaintext is known, the key is trivially recovered.',
    challengeReveal3:'Use AES encryption, MAC address filtering, time-limited AP activation, and one-time download tokens.',
    revealBtn:'Reveal Answer',labDesc:'Try scanning with different signal strengths. Hidden APs require active probing.',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_ap_title:'📡 Hidden Access Points',wiki_ap:'APs المخفية لا تبث SSID لكنها تستجيب لطلبات الاستقصاء. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_xor_title:'🔑 XOR Encryption',wiki_xor:'شيفرة متماثلة: نص XOR مفتاح = مشفّر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_drop_title:'📦 Dead Drop Protocol',wiki_drop:'العميل يخفي ESP32 بـ AP مخفي. عميل آخر يمسح ويتصل ويحمّل. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_esp_title:'📡 ESP32 SoftAP',wiki_esp:'ESP32 يمكنه العمل كنقطة وصول WiFi مع رؤية SSID قابلة للتكوين. WiFi (IEEE 802.11) operates on 2.4 GHz and 5 GHz bands. Devices find networks through beacon frames broadcast by access points every ~100ms. Modern WiFi uses OFDM modulation to achieve speeds over 1 Gbps by sending data on multiple subcarriers simultaneously.',
    working:'Working…',scanning:'Scanning networks...',probing:'Active probing...',
    noKey:'Enter a decryption key first',noFile:'Select a file first',decrypted:'File decrypted!',
    apFound:'networks found',hiddenFound:'hidden AP detected!',connected:'Connected',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'📦 Dead Letter Box ready — scan for hidden networks!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',step1Title:'Scan',step1Desc:'An ESP32 creates a hidden WiFi access point — invisible to normal scans.',step2Title:'Capture',step2Desc:'Agents who know the SSID connect and access the encrypted file vault.',step3Title:'Analyze',step3Desc:'Files are XOR-encrypted. Only agents with the key can decrypt them.',step4Title:'Report',step4Desc:'The dead drop is ephemeral — the ESP32 can be powered off and moved.',sectionCode:'Device Code',faq_q1:'What is Dead Letter Box?',faq_a1:'Dead Letter Box lets you esp32 hidden wifi ap where agents find encrypted files. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real networking behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real networking principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Arp Detective and Esp Captive Portal. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to Dead Letter Box! Look at the main display — this is where the networking simulation runs.',demo_s2:'Click Scan Networks to discover nearby access points. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'Dead Letter Box: ESP32 hidden WiFi AP where agents find encrypted files. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Rf Security',
    wiki_history: 'The field of RF security has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed RF security by enabling software-defined approaches. Modern practitioners use tools like HackRF SDR to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Dead Letter Box',
    wiki_math: 'The mathematics underpinning dead letter box involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced RF security practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to RF security. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with RF security: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in RF security.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Rf Security carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Signal',
    gloss1_def: 'A varying quantity (voltage, electromagnetic wave, or data stream) that carries information. In this simulation, signals are represented visually so you can see how they change over time and respond to your controls.',
    gloss2_term: 'Parameter',
    gloss2_def: 'A configurable value that changes system behavior. Each slider and input in this app controls a specific parameter. Changing parameters lets you explore cause-and-effect relationships in the simulation.',
    gloss3_term: 'Simulation',
    gloss3_def: 'A software model that mimics real-world behavior. This app simulates real equipment and processes so you can learn safely without hardware. The physics and mathematics are real — only the signals are virtual.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules that defines how data is formatted, transmitted, and received. Protocols ensure that different devices can communicate. Examples include WiFi (802.11), Bluetooth, HTTP, and TCP/IP.',
    gloss5_term: 'Frequency',
    gloss5_def: 'The number of cycles a signal completes per second, measured in Hertz (Hz). Higher frequencies carry more data but travel shorter distances. Radio frequencies range from 3 kHz to 300 GHz.',
    gloss6_term: 'Encryption',
    gloss6_def: 'The process of converting readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and a key. Only someone with the correct key can decrypt and read the original data.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Understanding the theory behind dead letter box requires grasping several interconnected concepts from RF security. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world RF security?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional RF security systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{
    title:'Dead Letter Box',subtitle:'📦 scanner · 🔐 déchiffrer · 📂 extraire',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Dead Letter Box — Boîtes aux lettres mortes WiFi',mainDesc:'Point d\'accès WiFi caché ESP32 avec coffre-fort de fichiers chiffrés',
    sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements et messages',
    clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',
    help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    scanBtn:'Scanner les réseaux',probeBtn:'Sonde active',decryptBtn:'Déchiffrer',downloadBtn:'Télécharger',
    keyPlaceholder:'Clé de déchiffrement...',fileVault:'Coffre-fort de fichiers',
    howStep1:'Un ESP32 crée un point d\'accès WiFi caché — invisible aux scans normaux.',
    howStep2:'Les agents qui connaissent le SSID se connectent et accèdent au coffre-fort.',
    howStep3:'Les fichiers sont chiffrés en XOR. Seuls les agents avec la clé peuvent déchiffrer.',
    howStep4:'Le drop est éphémère — l\'ESP32 peut être éteint et déplacé.',
    challenge1:'Pourquoi les SSID cachés ne sont-ils pas vraiment cachés ?',
    challenge2:'Qu\'est-ce qui rend le chiffrement XOR faible ?',
    challenge3:'Comment rendre un dead drop plus sûr ?',
    challengeReveal1:'Les SSID cachés sont absents des trames beacon mais visibles dans les réponses aux sondes.',
    challengeReveal2:'XOR avec une clé courte se répète, vulnérable à l\'analyse fréquentielle.',
    challengeReveal3:'Utiliser AES, filtrage MAC, activation temporelle et jetons de téléchargement unique.',
    revealBtn:'Révéler',labDesc:'Essayez de scanner avec différentes puissances de signal.',
    howto_1:'Cliquez Scanner pour découvrir les points d\'accès.',
    howto_2:'Cherchez les AP cachés marqués en rouge.',
    howto_3:'Cliquez un AP caché pour vous connecter au coffre-fort.',
    howto_4:'Entrez la clé et cliquez Déchiffrer.',
    wiki_ap_title:'📡 Points d\'accès cachés',wiki_ap:'Les AP cachés ne diffusent pas leur SSID mais répondent aux sondes directes.',
    wiki_xor_title:'🔑 Chiffrement XOR',wiki_xor:'Chiffrement symétrique : texte XOR clé = chiffré.',
    wiki_drop_title:'📦 Protocole Dead Drop',wiki_drop:'L\'agent cache un ESP32 avec AP caché. Un autre scanne, se connecte et télécharge.',
    wiki_esp_title:'📡 ESP32 SoftAP',wiki_esp:'L\'ESP32 peut fonctionner comme point d\'accès WiFi avec visibilité configurable.',
    working:'En cours…',scanning:'Scan des réseaux...',probing:'Sonde active...',
    noKey:'Entrez d\'abord une clé',noFile:'Sélectionnez un fichier',decrypted:'Fichier déchiffré !',
    apFound:'réseaux trouvés',hiddenFound:'AP caché détecté !',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'📦 Dead Letter Box prêt — scannez les réseaux cachés !',
    logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',newVersion:'MAJ',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',step1Title:'Scanner',step1Desc:'Un ESP32 crée un point d\'accès WiFi caché — invisible aux scans normaux.',step2Title:'Capturer',step2Desc:'Les agents qui connaissent le SSID se connectent et accèdent au coffre-fort.',step3Title:'Analyser',step3Desc:'Les fichiers sont chiffrés en XOR. Seuls les agents avec la clé peuvent déchiffrer.',step4Title:'Rapporter',step4Desc:'Le drop est éphémère — l\'ESP32 peut être éteint et déplacé.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Honeypot and Esp Wifi Thermometer ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de sécurité RF',
    wiki_history: 'Le domaine de sécurité RF a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme HackRF SDR pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Dead Letter Box',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de sécurité RF utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour sécurité RF. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en sécurité RF : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Sécurité rf implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Signal',
    gloss1_def: 'Une grandeur variable (tension, onde électromagnétique ou flux de données) qui transporte des informations. Dans cette simulation, les signaux sont représentés visuellement pour observer leurs changements.',
    gloss2_term: 'Paramètre',
    gloss2_def: 'Une valeur configurable qui modifie le comportement du système. Chaque curseur de cette app contrôle un paramètre spécifique. Modifier les paramètres permet d explorer les relations cause-effet.',
    gloss3_term: 'Simulation',
    gloss3_def: 'Un modèle logiciel qui imite le comportement réel. Cette app simule de vrais équipements pour apprendre en toute sécurité sans matériel. La physique et les mathématiques sont réelles — seuls les signaux sont virtuels.',
    gloss4_term: 'Protocole',
    gloss4_def: 'Un ensemble de règles définissant le format, la transmission et la réception des données. Les protocoles permettent la communication entre appareils différents. Exemples : WiFi, Bluetooth, HTTP, TCP/IP.',
    gloss5_term: 'Fréquence',
    gloss5_def: 'Le nombre de cycles qu un signal complète par seconde, mesuré en Hertz (Hz). Les fréquences plus élevées transportent plus de données mais parcourent de plus courtes distances.',
    gloss6_term: 'Chiffrement',
    gloss6_def: 'Le processus de conversion de données lisibles (texte clair) en format illisible (texte chiffré) à l aide d un algorithme mathématique et d une clé. Seule la bonne clé permet de déchiffrer.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de RF security. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec RF security dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{
    title:'Dead Letter Box',subtitle:'📦 مسح · 🔐 فك تشفير · 📂 استخراج',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'Dead Letter Box — صناديق بريد WiFi الميتة',mainDesc:'نقطة وصول WiFi مخفية ESP32 حيث يجد العملاء ملفات مشفرة',
    sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
    clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',
    help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    scanBtn:'مسح الشبكات',probeBtn:'تحقيق نشط',decryptBtn:'فك التشفير',downloadBtn:'تنزيل',
    keyPlaceholder:'مفتاح فك التشفير...',fileVault:'خزنة الملفات',
    howStep1:'ESP32 ينشئ نقطة وصول WiFi مخفية — غير مرئية للمسح العادي.',
    howStep2:'العملاء الذين يعرفون SSID يتصلون ويصلون لخزنة الملفات المشفرة.',
    howStep3:'الملفات مشفرة بـ XOR. فقط العملاء مع المفتاح يمكنهم فك التشفير.',
    howStep4:'نقطة الإيداع مؤقتة — يمكن إيقاف ESP32 ونقله.',
    challenge1:'لماذا SSIDs المخفية ليست مخفية فعلاً؟',
    challenge2:'ما الذي يجعل تشفير XOR ضعيفاً؟',
    challenge3:'كيف يمكنك جعل dead drop أكثر أماناً؟',
    challengeReveal1:'SSIDs المخفية غائبة عن إطارات البث لكنها مرئية في استجابات الاستقصاء.',
    challengeReveal2:'XOR بمفتاح قصير يتكرر، مما يجعله عرضة لتحليل التردد.',
    challengeReveal3:'استخدم تشفير AES وتصفية MAC وتفعيل محدود بالوقت ورموز تنزيل لمرة واحدة.',
    revealBtn:'اكشف الإجابة',labDesc:'جرب المسح بقوى إشارة مختلفة.',
    howto_1:'انقر مسح الشبكات لاكتشاف نقاط الوصول.',
    howto_2:'ابحث عن APs المخفية المحددة باللون الأحمر.',
    howto_3:'انقر AP مخفي للاتصال وكشف خزنة الملفات.',
    howto_4:'أدخل مفتاح فك التشفير وانقر فك التشفير.',
    wiki_ap_title:'📡 نقاط وصول مخفية',wiki_ap:'APs المخفية لا تبث SSID لكنها تستجيب لطلبات الاستقصاء.',
    wiki_xor_title:'🔑 تشفير XOR',wiki_xor:'شيفرة متماثلة: نص XOR مفتاح = مشفّر.',
    wiki_drop_title:'📦 بروتوكول Dead Drop',wiki_drop:'العميل يخفي ESP32 بـ AP مخفي. عميل آخر يمسح ويتصل ويحمّل.',
    wiki_esp_title:'📡 ESP32 SoftAP',wiki_esp:'ESP32 يمكنه العمل كنقطة وصول WiFi مع رؤية SSID قابلة للتكوين.',
    working:'جارٍ…',scanning:'مسح الشبكات...',probing:'تحقيق نشط...',
    noKey:'أدخل مفتاحاً أولاً',noFile:'اختر ملفاً أولاً',decrypted:'تم فك تشفير الملف!',
    apFound:'شبكات وجدت',hiddenFound:'AP مخفي مكتشف!',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'📦 Dead Letter Box جاهز — امسح الشبكات المخفية!',
    logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',newVersion:'تحديث',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',step1Title:'مسح',step1Desc:'ESP32 ينشئ نقطة وصول WiFi مخفية — غير مرئية للمسح العادي.',step2Title:'التقاط',step2Desc:'العملاء الذين يعرفون SSID يتصلون ويصلون لخزنة الملفات المشفرة.',step3Title:'تحليل',step3Desc:'الملفات مشفرة بـ XOR. فقط العملاء مع المفتاح يمكنهم فك التشفير.',step4Title:'تقرير',step4Desc:'نقطة الإيداع مؤقتة — يمكن إيقاف ESP32 ونقله.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Honeypot and Esp Wifi Thermometer! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ أمن الترددات',
    wiki_history: 'تطور مجال أمن الترددات بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل HackRF SDR لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Dead Letter Box',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أمن الترددات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أمن الترددات. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أمن الترددات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أمن الترددات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'إشارة',
    gloss1_def: 'كمية متغيرة (جهد كهربائي أو موجة كهرومغناطيسية أو تدفق بيانات) تحمل معلومات. في هذه المحاكاة، تُمثل الإشارات بصرياً لمراقبة تغيراتها مع الوقت.',
    gloss2_term: 'معامل',
    gloss2_def: 'قيمة قابلة للتكوين تغير سلوك النظام. كل شريط تمرير في هذا التطبيق يتحكم في معامل محدد. تغيير المعاملات يتيح لك استكشاف علاقات السبب والنتيجة.',
    gloss3_term: 'محاكاة',
    gloss3_def: 'نموذج برمجي يحاكي السلوك الحقيقي. يحاكي هذا التطبيق معدات وعمليات حقيقية للتعلم بأمان بدون أجهزة. الفيزياء والرياضيات حقيقية — الإشارات فقط افتراضية.',
    gloss4_term: 'بروتوكول',
    gloss4_def: 'مجموعة قواعد تحدد كيفية تنسيق البيانات وإرسالها واستقبالها. تضمن البروتوكولات تواصل الأجهزة المختلفة. أمثلة: واي فاي وبلوتوث و HTTP و TCP/IP.',
    gloss5_term: 'تردد',
    gloss5_def: 'عدد الدورات التي تكملها إشارة في الثانية، يُقاس بالهرتز. الترددات الأعلى تحمل بيانات أكثر لكنها تنتقل لمسافات أقصر. تتراوح ترددات الراديو من 3 كيلوهرتز إلى 300 غيغاهرتز.',
    gloss6_term: 'تشفير',
    gloss6_def: 'عملية تحويل البيانات المقروءة (نص عادي) إلى صيغة غير مقروءة (نص مشفر) باستخدام خوارزمية رياضية ومفتاح. فقط من يملك المفتاح الصحيح يمكنه فك التشفير.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من RF security. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـRF security في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function checkVersion(){try{const stored=localStorage.getItem('wdiy-latest-version');if(stored&&stored!==APP_VERSION){const btn=$('settingsBtn');if(btn&&!btn.querySelector('.version-update')){const badge=document.createElement('span');badge.className='version-update';badge.textContent='UPDATE';btn.style.position='relative';badge.style.cssText='position:absolute;top:-6px;inset-inline-end:-6px;';btn.appendChild(badge);}}}catch{}}
function sendAppMessage(type,data){try{localStorage.setItem('wdiy-app-msg',JSON.stringify({type,data,from:document.title,ts:Date.now()}));localStorage.removeItem('wdiy-app-msg');}catch{}}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return;}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;
function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const panel=$('debugPanel');if(!panel)return;panel.classList.add('active');let frames=0,last=performance.now();function tick(){frames++;const now=performance.now();if(now-last>=1000){$('debugFps').textContent=frames+' FPS';frames=0;last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{dragging=false;});try{const saved=localStorage.getItem('wdiy-log-width');if(saved)document.documentElement.style.setProperty('--log-width',saved);}catch{}}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const logEl=$('logPanel');logWasOpen=logEl&&logEl.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');});});}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  initLogResize();
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=()=>log('🎤 Whisper toggled','info');
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtnEl=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtnEl)dhikrBtnEl.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=()=>log('🎵 Music toggled','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  checkVersion();onAppMessage(msg=>log(`📨 ${msg.from}: ${msg.type}`,'rx'));
  initKonami();initMatrixTrigger();initDebug();initHijriDate();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   DEAD LETTER BOX SIMULATION
   ═══════════════════════════════════════════════════════════════ */

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function revealChallenge(idx){const el=$('answer'+idx);if(!el)return;el.classList.toggle('visible');playSound('click');}

// Fake AP database
const FAKE_APS=[
  {ssid:'Home-WiFi-5G',bssid:'AA:BB:CC:11:22:33',channel:6,signal:-45,hidden:false,encryption:'WPA2'},
  {ssid:'CoffeeShop_Free',bssid:'DD:EE:FF:44:55:66',channel:1,signal:-62,hidden:false,encryption:'Open'},
  {ssid:'DIRECT-ESP32',bssid:'11:22:33:AA:BB:CC',channel:11,signal:-38,hidden:false,encryption:'WPA2'},
  {ssid:'[HIDDEN]',bssid:'DE:AD:BE:EF:00:01',channel:3,signal:-55,hidden:true,encryption:'WPA2',realSsid:'DEAD-DROP-7'},
  {ssid:'Neighbor_Net',bssid:'99:88:77:66:55:44',channel:6,signal:-72,hidden:false,encryption:'WPA2'},
  {ssid:'[HIDDEN]',bssid:'CA:FE:BA:BE:00:02',channel:9,signal:-48,hidden:true,encryption:'WPA2',realSsid:'GHOST-VAULT'},
  {ssid:'IoT-Gateway',bssid:'FE:DC:BA:98:76:54',channel:1,signal:-58,hidden:false,encryption:'WPA3'},
];

// Fake files in the vault
const VAULT_FILES=[
  {name:'mission-brief.txt',size:'2.4 KB',content:'Operation Nightfall: Rendezvous at coordinates 36.7N 3.0E at 0200 hours. Use callsign FALCON.',encrypted:true},
  {name:'agent-list.dat',size:'1.1 KB',content:'ALPHA:field BRAVO:handler CHARLIE:tech DELTA:extraction ECHO:comms',encrypted:true},
  {name:'cipher-key.bin',size:'512 B',content:'KEY=WORKSHOP-DIY-2026 ROTATE=7 SALT=ESP32MESH',encrypted:true},
  {name:'coordinates.gpx',size:'3.7 KB',content:'<waypoint lat="36.752887" lon="3.042048" name="SAFE-HOUSE-A"/><waypoint lat="36.737232" lon="3.086472" name="EXFIL-POINT"/>',encrypted:true},
];

let selectedAP=null;
let selectedFile=null;

function xorCipher(text,key){
  if(!key)return text;
  let result='';
  for(let i=0;i<text.length;i++){
    result+=String.fromCharCode(text.charCodeAt(i)^key.charCodeAt(i%key.length));
  }
  return result;
}

function toHex(str){
  return Array.from(str).map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join(' ');
}

// Encrypt all vault files on load
function encryptVault(){
  const key='ESPION';
  for(const f of VAULT_FILES){
    f.cipher=xorCipher(f.content,key);
    f.hexCipher=toHex(f.cipher);
  }
}

function renderAPList(aps){
  const list=$('apList');if(!list)return;
  list.innerHTML='';
  for(const ap of aps){
    const div=document.createElement('div');
    div.className='ap-item';
    if(ap===selectedAP)div.classList.add('selected');
    div.innerHTML=`
      <span class="ap-name">${ap.hidden?'<span class="ap-hidden">[HIDDEN]</span>':ap.ssid}</span>
      <span class="ap-signal">${ap.bssid} CH:${ap.channel} ${ap.signal}dBm ${ap.encryption}</span>
    `;
    div.addEventListener('click',()=>{
      if(ap.hidden){
        selectedAP=ap;
        log(`📡 Connecting to hidden AP: ${ap.realSsid} (${ap.bssid})`,'tx');
        showToast('Connecting...',1500);
        setTimeout(()=>{
          setStatus(true);
          log(`✅ Connected to ${ap.realSsid}`,'success');
          showVault();
        },1200);
      }else{
        log(`📡 ${ap.ssid} — not a dead drop`,'info');
      }
      renderAPList(aps);
    });
    list.appendChild(div);
  }
}

function showVault(){
  const area=$('vaultArea');if(area)area.style.display='block';
  renderFileList();
}

function renderFileList(){
  const list=$('fileList');if(!list)return;
  list.innerHTML='';
  for(let i=0;i<VAULT_FILES.length;i++){
    const f=VAULT_FILES[i];
    const div=document.createElement('div');
    div.className='vault-item';
    if(f===selectedFile)div.style.borderColor='var(--accent)';
    div.innerHTML=`
      <div>
        <div class="file-name">${f.name}</div>
        <div class="file-size">${f.size}</div>
      </div>
      <span class="file-status ${f.encrypted?'encrypted':'decrypted'}">${f.encrypted?'ENCRYPTED':'DECRYPTED'}</span>
    `;
    div.addEventListener('click',()=>{
      selectedFile=f;
      const output=$('decryptOutput');
      if(output)output.textContent=f.encrypted?f.hexCipher:f.content;
      log(`📄 Selected: ${f.name}`,'info');
      renderFileList();
    });
    list.appendChild(div);
  }
}

function initDeadLetterBox(){
  encryptVault();

  const scanBtn=$('scanBtn');
  if(scanBtn)scanBtn.addEventListener('click',async()=>{
    const s=LANG[currentLang];
    log(s.scanning,'info');
    showToast(s.scanning,2000);
    setStatus(false);
    await sleep(1500+Math.random()*1000);
    const signalStr=parseInt(($('signalSlider')||{}).value||70);
    const visible=FAKE_APS.filter(ap=>!ap.hidden||signalStr>50);
    renderAPList(visible);
    const hiddenCount=visible.filter(a=>a.hidden).length;
    log(`📡 ${visible.length} ${s.apFound}${hiddenCount>0?' — '+hiddenCount+' '+s.hiddenFound:''}`,'success');
    hideToast();
  });

  const probeBtn=$('probeBtn');
  if(probeBtn)probeBtn.addEventListener('click',async()=>{
    const s=LANG[currentLang];
    log(s.probing,'info');
    showToast(s.probing,2500);
    await sleep(2000);
    renderAPList(FAKE_APS);
    const hiddenCount=FAKE_APS.filter(a=>a.hidden).length;
    log(`📡 Active probe: ${FAKE_APS.length} ${s.apFound} — ${hiddenCount} ${s.hiddenFound}`,'success');
    hideToast();
  });

  const decryptBtn=$('decryptBtn');
  if(decryptBtn)decryptBtn.addEventListener('click',()=>{
    const s=LANG[currentLang];
    const key=($('keyInput')||{}).value||'';
    if(!key){log(s.noKey,'error');showToast(s.noKey,1500);return;}
    if(!selectedFile){log(s.noFile,'error');showToast(s.noFile,1500);return;}
    const decrypted=xorCipher(selectedFile.cipher,key);
    const output=$('decryptOutput');
    if(output)output.textContent=decrypted;
    if(key==='ESPION'){
      selectedFile.encrypted=false;
      selectedFile.content=decrypted;
      log(`🔓 ${selectedFile.name} ${s.decrypted}`,'success');
      showToast(s.decrypted,1500);
    }else{
      log(`🔐 ${selectedFile.name} — wrong key, garbled output`,'error');
    }
    renderFileList();
  });

  const downloadBtn=$('downloadBtn');
  if(downloadBtn)downloadBtn.addEventListener('click',()=>{
    if(!selectedFile)return;
    const content=selectedFile.encrypted?selectedFile.hexCipher:selectedFile.content;
    const blob=new Blob([content],{type:'text/plain'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=selectedFile.name;
    a.click();
    log(`💾 Downloaded: ${selectedFile.name}`,'success');
  });

  const signalSlider=$('signalSlider'),signalValue=$('signalValue');
  if(signalSlider&&signalValue){
    signalSlider.addEventListener('input',()=>{signalValue.textContent=signalSlider.value+'%';});
  }
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initDeadLetterBox);}else{setTimeout(initDeadLetterBox,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Dead Letter Box: Encrypted file vault
   with WiFi dead-drop network visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';
  let canvas,ctx,animId,W,H,frameCount=0;
  const nodes=[],fileDrops=[],signals=[],hexCols=[];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){
      canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0a1a;';
      const t=document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body;
      t.appendChild(canvas);
    }
    const r=canvas.getBoundingClientRect();
    canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);
    W=r.width;H=r.height;
  }

  class APNode{
    constructor(x,y,label){this.x=x;this.y=y;this.label=label;this.radius=28;this.pulse=0;}
    draw(){
      this.pulse+=0.03;const glow=6+Math.sin(this.pulse)*3;
      ctx.save();ctx.shadowColor='#00ffcc';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      ctx.fillStyle='rgba(0,255,204,0.12)';ctx.fill();
      ctx.strokeStyle='#00ffcc';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#00ffcc';ctx.font='bold 16px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('\u{1F510}',this.x,this.y);
      ctx.font='9px monospace';ctx.fillStyle='rgba(0,255,204,0.7)';
      ctx.fillText(this.label,this.x,this.y+this.radius+12);ctx.restore();
    }
  }

  class AgentDevice{
    constructor(){
      const a=Math.random()*Math.PI*2,d=100+Math.random()*80;
      this.cx=W/2;this.cy=H/2;this.angle=a;this.dist=d;
      this.x=this.cx+Math.cos(a)*d;this.y=this.cy+Math.sin(a)*d;
      this.speed=0.003+Math.random()*0.004;
      this.color=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff78ae'][Math.floor(Math.random()*5)];
      this.id='AG-'+Math.random().toString(36).slice(2,5).toUpperCase();
      this.transferProgress=0;this.transferring=Math.random()>0.5;
    }
    update(){
      this.angle+=this.speed;
      this.x=this.cx+Math.cos(this.angle)*this.dist;
      this.y=this.cy+Math.sin(this.angle)*this.dist;
      if(this.transferring){this.transferProgress+=0.008;if(this.transferProgress>1){this.transferProgress=0;this.transferring=Math.random()>0.3;}}
      else if(Math.random()<0.003){this.transferring=true;this.transferProgress=0;}
    }
    draw(){
      if(this.transferring){
        const g=ctx.createLinearGradient(this.x,this.y,this.cx,this.cy);
        g.addColorStop(0,this.color);g.addColorStop(1,'rgba(0,255,204,0.4)');
        ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.cx,this.cy);
        ctx.strokeStyle=g;ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
        const px=this.x+(this.cx-this.x)*this.transferProgress;
        const py=this.y+(this.cy-this.y)*this.transferProgress;
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      }
      ctx.beginPath();ctx.arc(this.x,this.y,8,0,Math.PI*2);ctx.fillStyle=this.color;ctx.fill();
      ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.6)';ctx.textAlign='center';
      ctx.fillText(this.id,this.x,this.y-12);
    }
  }

  class FileDrop{
    constructor(){
      this.x=W/2+(Math.random()-0.5)*50;this.y=H/2+(Math.random()-0.5)*50;
      this.vx=(Math.random()-0.5)*0.3;this.vy=(Math.random()-0.5)*0.3;
      this.size=10+Math.random()*8;this.encrypted=Math.random()>0.3;this.alpha=0.6+Math.random()*0.4;
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;
      const dx=this.x-W/2,dy=this.y-H/2,d=Math.sqrt(dx*dx+dy*dy);
      if(d>60){this.vx-=dx*0.001;this.vy-=dy*0.001;}
    }
    draw(){
      ctx.save();ctx.globalAlpha=this.alpha;
      ctx.fillStyle=this.encrypted?'#ff4444':'#00ff88';
      ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size*1.2);
      ctx.strokeStyle=this.encrypted?'#ff8888':'#88ffbb';ctx.lineWidth=1;
      ctx.strokeRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size*1.2);
      ctx.fillStyle='#fff';ctx.font=(this.size*0.6)+'px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(this.encrypted?'\u{1F512}':'\u{1F4C4}',this.x,this.y);ctx.restore();
    }
  }

  class SignalRing{
    constructor(){this.x=W/2;this.y=H/2;this.radius=30;this.maxRadius=180;this.alpha=0.5;}
    update(){this.radius+=0.8;this.alpha=0.5*(1-this.radius/this.maxRadius);return this.radius<this.maxRadius;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,204,'+this.alpha+')';ctx.lineWidth=1.5;ctx.stroke();}
  }

  function initHexRain(){
    const cols=Math.floor(W/18);
    for(let i=0;i<cols;i++){
      hexCols.push({x:i*18,y:Math.random()*H,speed:0.5+Math.random()*1.5,chars:[]});
      for(let j=0;j<8;j++) hexCols[i].chars.push(Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase());
    }
  }
  function drawHexRain(){
    ctx.font='10px monospace';ctx.textAlign='left';
    hexCols.forEach(col=>{
      col.y+=col.speed;if(col.y>H+100)col.y=-100;
      col.chars.forEach((ch,i)=>{ctx.fillStyle='rgba(0,255,120,'+(0.04+i/col.chars.length*0.06)+')';ctx.fillText(ch,col.x,col.y+i*12);});
      if(Math.random()<0.02){const idx=Math.floor(Math.random()*col.chars.length);col.chars[idx]=Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase();}
    });
  }

  function drawHUD(){
    const agents=nodes.length,active=nodes.filter(n=>n.transferring).length;
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(8,8,180,68);
    ctx.strokeStyle='#00ffcc33';ctx.strokeRect(8,8,180,68);
    ctx.font='10px monospace';ctx.fillStyle='#00ffcc';ctx.textAlign='left';
    ctx.fillText('DEAD DROP STATUS',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Agents: '+agents+'  Active: '+active,16,40);
    ctx.fillText('Files: '+fileDrops.length+'  Encrypted: '+fileDrops.filter(f=>f.encrypted).length,16,54);
    ctx.fillText('Signals: '+signals.length+'  Frame: '+frameCount,16,68);ctx.restore();
  }

  let apNode;
  function init(){
    ensureCanvas();initHexRain();
    apNode=new APNode(W/2,H/2,'HIDDEN-AP');
    for(let i=0;i<8;i++) nodes.push(new AgentDevice());
    for(let i=0;i<5;i++) fileDrops.push(new FileDrop());
    animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,W,H);
    drawHexRain();
    if(frameCount%60===0)signals.push(new SignalRing());
    for(let i=signals.length-1;i>=0;i--){if(!signals[i].update())signals.splice(i,1);else signals[i].draw();}
    fileDrops.forEach(f=>{f.update();f.draw();});
    apNode.draw();nodes.forEach(n=>{n.update();n.draw();});
    if(Math.random()<0.005&&nodes.length<14)nodes.push(new AgentDevice());
    if(Math.random()<0.003&&nodes.length>4)nodes.splice(Math.floor(Math.random()*nodes.length),1);
    if(Math.random()<0.004&&fileDrops.length<10)fileDrops.push(new FileDrop());
    drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,200);
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
