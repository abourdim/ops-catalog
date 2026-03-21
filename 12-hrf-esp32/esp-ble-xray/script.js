/**
 * BLE X-Ray — Workshop DIY v1.2
 * 2.4GHz BLE frequency hopping visualizer
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=t==='click'?800:523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

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
    title:'💙 BLE X-Ray', subtitle:'1600 hops/sec Frequency Hopping',
    disconnected:'Disconnected', connected:'Scanning',
    mainSection:'2.4 GHz BLE Channel Waterfall', mainDesc:'Watch BLE frequency hopping in real-time',
    sectionA:'Channel Usage Histogram', sectionB:'BLE Device List', sectionC:'BLE Frequency Hopping Theory',
    startScan:'Start Scan', stop:'Stop', hopSpeed:'Hop Speed:',
    theory1:'BLE uses 40 channels in the 2.4 GHz ISM band (2402-2480 MHz), each 2 MHz wide. 37 are data channels, 3 are advertising (37, 38, 39).',
    theory2:'Connected devices hop across data channels at 1600 hops/second using an algorithm seeded by the access address.',
    theory3:'Adaptive Frequency Hopping (AFH) lets BLE skip channels with interference from WiFi, improving coexistence.',
    theory4:'The waterfall shows channel activity over time. Bright dots indicate active transmissions on that channel.',
    splashHint:'tap to skip', ready:'💙 BLE X-Ray ready!',
    langChanged:'Language → English', scanStarted:'Scan started', scanStopped:'Scan stopped',step1Title:'Set Up',step1Desc:'Configure the parameters for 💙 BLE X-Ray. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start Scan" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Channel Usage Histogram" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "BLE Device List". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is 💙 BLE X-Ray?',faq_a1:'Ble Xray is an interactive simulation that demonstrates radar systems concepts. Watch BLE frequency hopping in real-time. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real RF engineering behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Collision Visualizer and Esp Lora Lab. Each app in this category teaches a different aspect of RF engineering. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',demo_s1:'Welcome to 💙 BLE X-Ray! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Channel Usage Histogram" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Ble Xray! This is like a science experiment on your computer. You get to control a real radar systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for 💙 BLE X-Ray. Choose y Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',wiki_concept_title:'🔬 What is 💙 BLE X-Ray?',wiki_concept:'💙 BLE X-Ray is a technique used in RF engineering. Watch BLE frequency hopping in real-time. In professional settings, this technology requires HackRF + ESP32 and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for 💙 BLE X-Ray. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start Scan" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real RF engineering, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'💙 BLE X-Ray has practical applications in RF engineering. Professionals use similar techniques with HackRF + ESP32 in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'💙 BLE X-Ray: Watch BLE frequency hopping in real-time. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Channel Usage Histogram" and "BLE Device List" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Capture The Flag — Physical CTF',related1_desc:'ESP32s broadcast clues, teams compete',related1_path:'../../04-spy-combos/kit-capture-the-flag/index.html',related2_name:'Lightning Map',related2_desc:'Detect and map lightning strikes from radio sferics',related2_path:'../../29-sdr-aviation/sdr-lightning/index.html',related3_name:'IMSI Catcher Sim',related3_desc:'Simulate fake base station interception',related3_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'',pathPrev_path:'',pathNext_name:'Dual TX Collision Zone',pathNext_path:'../../12-hrf-esp32/esp-collision-visualizer/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What voltage does ESP32 operate at?',quiz_q1a:'5V',quiz_q1b:'3.3V',quiz_q1c:'1.8V',quiz_q1d:'12V',quiz_q1_answer:'1',quiz_q2:'What is the ESP32\'s CPU architecture?',quiz_q2a:'ARM',quiz_q2b:'Xtensa dual-core',quiz_q2c:'RISC-V only',quiz_q2d:'x86',quiz_q2_answer:'1',quiz_q3:'What does AI stand for?',quiz_q3a:'Automated Input',quiz_q3b:'Artificial Intelligence',quiz_q3c:'Analog Interface',quiz_q3d:'Active Integration',quiz_q3_answer:'1',quiz_q4:'What wireless capabilities does ESP32 have?',quiz_q4a:'Wi-Fi only',quiz_q4b:'Bluetooth only',quiz_q4c:'Wi-Fi and Bluetooth',quiz_q4d:'None',quiz_q4_answer:'2',quiz_q5:'What is machine learning?',quiz_q5a:'Programming robots',quiz_q5b:'Systems that learn from data',quiz_q5c:'Manual computation',quiz_q5d:'Hardware design',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'The Stuxnet worm (2010) destroyed 1,000 Iranian nuclear centrifuges by manipulating their PLCs via infected USB drives. It was the first cyber weapon to cause physical destruction and crossed the digital-physical boundary.',realworld2:'In 2017, GPS spoofing in the Black Sea made 20+ ships believe they were 25 miles inland at an airport. This demonstrated that satellite navigation — relied on by aviation, shipping, and military — can be fooled by fake RF signals.',realworld3:'In 2015, researchers showed that a $20 SDR dongle could track every aircraft in range by decoding unencrypted ADS-B transponder signals. This revealed a fundamental security gap in global aviation surveillance.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In radio navigation, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in radio navigation and reveal the hidden complexity beneath simple-looking systems.'},
    wiki_history_title: '📜 History of Radar Systems',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Ble Xray builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Ble Xray',
    wiki_math: 'The mathematics behind Ble Xray: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radar systems practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radar systems. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radar systems: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radar systems.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radar Systems carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'Port',
    gloss3_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Ble Xray demonstrates key principles from radar systems. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radar systems?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radar systems systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'💙 BLE X-Ray', subtitle:'1600 sauts/sec Saut de frequence',
    disconnected:'Deconnecte', connected:'En scan',
    mainSection:'Cascade BLE 2.4 GHz', mainDesc:'Visualisez le saut de frequence BLE en temps reel',
    sectionA:'Histogramme d\'utilisation', sectionB:'Liste appareils BLE', sectionC:'Theorie saut de frequence BLE',
    startScan:'Demarrer scan', stop:'Arreter', hopSpeed:'Vitesse de saut:',
    theory1:'BLE utilise 40 canaux dans la bande ISM 2.4 GHz (2402-2480 MHz), chacun de 2 MHz. 37 canaux de donnees, 3 de publicite.',
    theory2:'Les appareils connectes sautent entre les canaux a 1600 sauts/seconde.',
    theory3:'Le saut de frequence adaptatif (AFH) permet d\'eviter les canaux perturbes par le WiFi.',
    theory4:'La cascade montre l\'activite des canaux au fil du temps.',
    splashHint:'appuyer pour passer', ready:'💙 BLE X-Ray pret!',
    langChanged:'Langue → Francais', scanStarted:'Scan demarre', scanStopped:'Scan arrete',step1Title:'Configurer',step1Desc:'Configure les paramètres de 💙 BLE X-Ray. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start Scan" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 💙 BLE X-Ray ?',faq_a1:'Ble Xray est une simulation interactive qui démontre les concepts de systèmes radar. Watch BLE frequency hopping in real-time. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',demo_s1:'Bienvenue dans 💙 BLE X-Ray ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir. Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Ble Xray ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de systèmes radar — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the parameters for 💙 BLE X-Ray. Choose y Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',wiki_concept_title:'🔬 Qu\'est-ce que 💙 BLE X-Ray ?',wiki_concept:'💙 BLE X-Ray est une technique utilisée en RF engineering. Dans un contexte professionnel, cette technologie nécessite HackRF + ESP32 et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de RF engineering. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'💙 BLE X-Ray a des applications pratiques en RF engineering. Les professionnels utilisent des techniques similaires avec HackRF + ESP32. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'💙 BLE X-Ray : Watch BLE frequency hopping in real-time. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Capture The Flag — CTF Physique',related1_desc:'Les ESP32 diffusent des indices, les équipes s\\',related1_path:'../../04-spy-combos/kit-capture-the-flag/index.html',related2_name:'Carte Foudre',related2_desc:'Détecter les impacts de foudre',related2_path:'../../29-sdr-aviation/sdr-lightning/index.html',related3_name:'Sim Capteur IMSI',related3_desc:'Simuler interception par fausse station',related3_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'',pathPrev_path:'',pathNext_name:'Zone de collision double TX',pathNext_path:'../../12-hrf-esp32/esp-collision-visualizer/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'À quelle tension fonctionne l\'ESP32 ?',quiz_q1a:'5V',quiz_q1b:'3,3V',quiz_q1c:'1,8V',quiz_q1d:'12V',quiz_q1_answer:'1',quiz_q2:'Quelle est l\'architecture CPU de l\'ESP32 ?',quiz_q2a:'ARM',quiz_q2b:'Xtensa double coeur',quiz_q2c:'RISC-V uniquement',quiz_q2d:'x86',quiz_q2_answer:'1',quiz_q3:'Que signifie IA ?',quiz_q3a:'Entrée automatisée',quiz_q3b:'Intelligence Artificielle',quiz_q3c:'Interface analogique',quiz_q3d:'Intégration active',quiz_q3_answer:'1',quiz_q4:'Quelles capacités sans fil a l\'ESP32 ?',quiz_q4a:'Wi-Fi uniquement',quiz_q4b:'Bluetooth uniquement',quiz_q4c:'Wi-Fi et Bluetooth',quiz_q4d:'Aucune',quiz_q4_answer:'2',quiz_q5:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q5a:'Programmer des robots',quiz_q5b:'Systèmes apprenant des données',quiz_q5c:'Calcul manuel',quiz_q5d:'Conception matérielle',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'Le ver Stuxnet (2010) a détruit 1000 centrifugeuses nucléaires iraniennes en manipulant leurs automates programmables via des clés USB infectées.',realworld2:'En 2017, le spoofing GPS en mer Noire a fait croire à plus de 20 navires qu\'ils se trouvaient à 25 milles à l\'intérieur des terres dans un aéroport.',realworld3:'En 2015, des chercheurs ont montré qu\'un dongle SDR à 20$ pouvait suivre chaque avion à portée en décodant les signaux ADS-B non chiffrés des transpondeurs.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En radionavigation, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en radionavigation et révèlent la complexité cachée sous des systèmes simples en apparence.'},
    wiki_history_title: '📜 Histoire de systèmes radar',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Ble Xray s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Ble Xray',
    wiki_math: 'Les mathématiques derrière Ble Xray : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de systèmes radar utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour systèmes radar. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en systèmes radar : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Systèmes radar implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'Port',
    gloss3_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Ble Xray démontre les principes clés de systèmes radar. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radar systems dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'💙 BLE X-Ray', subtitle:'1600 قفزة/ثانية تردد القفز',
    disconnected:'غير متصل', connected:'جارٍ المسح',
    mainSection:'شلال قنوات BLE 2.4 GHz', mainDesc:'شاهد قفز التردد BLE في الوقت الفعلي',
    sectionA:'مخطط استخدام القنوات', sectionB:'قائمة أجهزة BLE', sectionC:'نظرية قفز تردد BLE',
    startScan:'بدء المسح', stop:'إيقاف', hopSpeed:'سرعة القفز:',
    theory1:'يستخدم BLE 40 قناة في نطاق ISM 2.4 GHz. 37 قناة بيانات و3 قنوات إعلان.',
    theory2:'تقفز الأجهزة المتصلة بين القنوات بمعدل 1600 قفزة/ثانية.',
    theory3:'يتيح AFH تخطي القنوات المتداخلة مع WiFi.',
    theory4:'يعرض الشلال نشاط القنوات عبر الزمن.',
    splashHint:'انقر للتخطي', ready:'💙 BLE X-Ray جاهز!',
    langChanged:'اللغة ← العربية', scanStarted:'بدأ المسح', scanStopped:'توقف المسح',step1Title:'إعداد',step1Desc:'اضبط معاملات 💙 BLE X-Ray. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start Scan" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو 💙 BLE X-Ray؟',faq_a1:'Ble Xray هي محاكاة تفاعلية توضح مفاهيم أنظمة الرادار. Watch BLE frequency hopping in real-time. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',demo_s1:'مرحباً في 💙 BLE X-Ray! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Ble Xray! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـأنظمة الرادار — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the parameters for 💙 BLE X-Ray. Choose y لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',wiki_concept_title:'🔬 ما هو 💙 BLE X-Ray؟',wiki_concept:'💙 BLE X-Ray هي تقنية تُستخدم في RF engineering. في البيئات المهنية، تتطلب هذه التقنية HackRF + ESP32 وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من RF engineering. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'💙 BLE X-Ray له تطبيقات عملية في RF engineering. يستخدم المحترفون تقنيات مماثلة مع HackRF + ESP32. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'💙 BLE X-Ray: Watch BLE frequency hopping in real-time. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أنظمة الرادار',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Ble Xray على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Ble Xray',
    wiki_math: 'الرياضيات وراء Ble Xray: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أنظمة الرادار المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أنظمة الرادار. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أنظمة الرادار: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أنظمة الرادار يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'Port',
    gloss3_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Ble Xray يوضح المبادئ الأساسية في أنظمة الرادار. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradar systems في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'التقط العلم — CTF فعلي',related1_desc:'أجهزة ESP32 تبث الأدلة، الفرق تتنافس',related1_path:'../../04-spy-combos/kit-capture-the-flag/index.html',related2_name:'خريطة البرق',related2_desc:'كشف ضربات البرق',related2_path:'../../29-sdr-aviation/sdr-lightning/index.html',related3_name:'\\u0645\\u062d\\u0627\\u0643\\u064a IMSI',related3_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u0627\\u0639\\u062a\\u0631\\u0627\\u0636 \\u0627\\u0644\\u0627\\u062a\\u0635\\u0627\\u0644\\u0627\\u062a',related3_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'',pathPrev_path:'',pathNext_name:'منطقة تصادم TX مزدوج',pathNext_path:'../../12-hrf-esp32/esp-collision-visualizer/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'على أي جهد يعمل ESP32؟',quiz_q1a:'5 فولت',quiz_q1b:'3.3 فولت',quiz_q1c:'1.8 فولت',quiz_q1d:'12 فولت',quiz_q1_answer:'1',quiz_q2:'ما بنية معالج ESP32؟',quiz_q2a:'ARM',quiz_q2b:'Xtensa ثنائي النواة',quiz_q2c:'RISC-V فقط',quiz_q2d:'x86',quiz_q2_answer:'1',quiz_q3:'ماذا تعني AI؟',quiz_q3a:'إدخال آلي',quiz_q3b:'الذكاء الاصطناعي',quiz_q3c:'واجهة تناظرية',quiz_q3d:'تكامل نشط',quiz_q3_answer:'1',quiz_q4:'ما إمكانيات ESP32 اللاسلكية؟',quiz_q4a:'واي فاي فقط',quiz_q4b:'بلوتوث فقط',quiz_q4c:'واي فاي وبلوتوث',quiz_q4d:'لا شيء',quiz_q4_answer:'2',quiz_q5:'ما هو التعلم الآلي؟',quiz_q5a:'برمجة الروبوتات',quiz_q5b:'أنظمة تتعلم من البيانات',quiz_q5c:'حساب يدوي',quiz_q5d:'تصميم العتاد',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'دمرت دودة ستكسنت (2010) ألف جهاز طرد مركزي نووي إيراني من خلال التلاعب بوحدات التحكم المنطقية عبر أقراص USB مصابة.',realworld2:'في عام 2017 جعل انتحال GPS في البحر الأسود أكثر من 20 سفينة تعتقد أنها على بعد 25 ميلاً داخل البر في مطار.',realworld3:'في عام 2015 أثبت باحثون أن جهاز SDR بقيمة 20 دولارًا يمكنه تتبع كل طائرة في النطاق عبر فك تشفير إشارات ADS-B غير المشفرة.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الملاحة الراديوية معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الملاحة الراديوية وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.'}
};
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}


function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);

function setLanguage(lang){
  currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});
  localStorage.setItem('ble-lang',lang);log(LANG[lang]?.langChanged||'Language changed','info');
}
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('ble-theme',name);
}
function log(msg,type='info'){
  const c=$('logContainer');if(!c)return;const line=document.createElement('div');
  line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line);c.scrollTop=c.scrollHeight;
}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ BLE SIMULATION ═══════ */
const NUM_CHANNELS = 40;
const ADV_CHANNELS = [37, 38, 39];
const DATA_CHANNELS = Array.from({length:37}, (_,i) => i);
let scanning = false, animFrame = null;
let hopCount = 0, pktCount = 0;
let currentChannel = 0;
let channelHist = new Uint32Array(NUM_CHANNELS);
let wfData = [];
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;

// Simulated BLE devices
const SIM_DEVICES = [
  {name:'iPhone-BLE', mac:'A4:83:E7:1F:22:01', rssi:-45, type:'Phone'},
  {name:'Galaxy-Watch', mac:'B8:27:EB:33:44:02', rssi:-62, type:'Wearable'},
  {name:'AirPods-Pro', mac:'DC:A6:32:55:66:03', rssi:-38, type:'Audio'},
  {name:'Fitbit-HR', mac:'E4:5F:01:77:88:04', rssi:-71, type:'Fitness'},
  {name:'Smart-Lock', mac:'00:1A:7D:99:AA:05', rssi:-55, type:'IoT'},
  {name:'BLE-Beacon', mac:'12:34:56:78:9A:06', rssi:-80, type:'Beacon'},
];

// Hopping algorithm (simplified)
let hopIncrement = 13; // prime, wraps around 37 data channels
function nextHop(){
  currentChannel = (currentChannel + hopIncrement) % 37;
  // Occasionally hit advertising channels
  if(Math.random() < 0.08) currentChannel = ADV_CHANNELS[Math.floor(Math.random()*3)];
  return currentChannel;
}

function initWaterfall(){
  if(!wfCtx) return;
  wfData = [];
  for(let i=0;i<wfCanvas.height;i++){
    const row = new Float32Array(NUM_CHANNELS);
    for(let j=0;j<NUM_CHANNELS;j++) row[j] = Math.random()*0.03;
    wfData.push(row);
  }
}

function addWaterfallLine(){
  const row = new Float32Array(NUM_CHANNELS);
  for(let j=0;j<NUM_CHANNELS;j++) row[j] = Math.random()*0.04; // noise floor

  // Add active hop
  const ch = nextHop();
  row[ch] = 0.7 + Math.random()*0.3;
  channelHist[ch]++;
  hopCount++;

  // Simulate other devices hopping too
  const numOther = Math.floor(Math.random()*3);
  for(let k=0;k<numOther;k++){
    const otherCh = Math.floor(Math.random()*37);
    row[otherCh] = Math.max(row[otherCh], 0.3 + Math.random()*0.4);
    channelHist[otherCh]++;
    pktCount++;
  }
  pktCount++;

  wfData.push(row);
  if(wfData.length > wfCanvas.height) wfData.shift();

  $('currentCh').textContent = ch;
  $('currentFreq').textContent = 2402 + ch * 2;
  $('hopCount').textContent = hopCount;
  $('pktCount').textContent = pktCount;
}

function drawWaterfall(){
  if(!wfCtx) return;
  const W = wfCanvas.width, H = wfCanvas.height;
  const img = wfCtx.createImageData(W, H);
  const colW = W / NUM_CHANNELS;

  for(let y=0; y<Math.min(wfData.length, H); y++){
    const row = wfData[y];
    for(let ch=0; ch<NUM_CHANNELS; ch++){
      const v = row[ch];
      const x0 = Math.floor(ch * colW);
      const x1 = Math.floor((ch+1) * colW);
      let r,g,b;
      if(v < 0.2){r=0;g=0;b=Math.floor(v*5*80)}
      else if(v < 0.5){r=0;g=Math.floor((v-.2)*3.3*200);b=255}
      else if(v < 0.8){r=Math.floor((v-.5)*3.3*255);g=200;b=Math.floor((1-(v-.5)*3.3)*255)}
      else{r=255;g=Math.floor((1-(v-.8)*5)*200);b=0}
      for(let x=x0;x<x1&&x<W;x++){
        const idx=(y*W+x)*4;
        img.data[idx]=r;img.data[idx+1]=g;img.data[idx+2]=b;img.data[idx+3]=255;
      }
    }
  }
  wfCtx.putImageData(img,0,0);

  // Channel labels
  wfCtx.fillStyle='rgba(255,255,255,.5)';wfCtx.font='9px Orbitron,monospace';
  for(let ch=0;ch<NUM_CHANNELS;ch+=5){
    wfCtx.fillText(ch+'', ch*colW+2, 10);
  }
  // Advertising channel markers
  wfCtx.fillStyle='rgba(255,0,0,.6)';
  ADV_CHANNELS.forEach(ch=>{
    const x=ch*colW;wfCtx.fillRect(x,0,colW,2);
  });
}

function drawHistogram(){
  const canvas=$('histCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const max=Math.max(1,...channelHist);
  const bw=W/NUM_CHANNELS;
  for(let ch=0;ch<NUM_CHANNELS;ch++){
    const h=(channelHist[ch]/max)*(H-30);
    const isAdv = ADV_CHANNELS.includes(ch);
    ctx.fillStyle=isAdv?'#f44':'#0af';
    ctx.fillRect(ch*bw+1, H-20-h, bw-2, h);
  }
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px monospace';
  for(let ch=0;ch<NUM_CHANNELS;ch+=5) ctx.fillText(ch+'', ch*bw+2, H-6);
  ctx.fillText('ADV',37*bw-10,H-6);
}

function renderDevices(){
  const el=$('deviceList');if(!el)return;
  el.innerHTML = SIM_DEVICES.map(d=>{
    const rssi = d.rssi + Math.floor(Math.random()*6-3);
    const bars = rssi > -50 ? '████' : rssi > -65 ? '███░' : rssi > -75 ? '██░░' : '█░░░';
    return `<div style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between"><span style="color:#0af">${d.name}</span><span style="opacity:.6">${d.mac}</span><span>${bars} ${rssi}dBm</span><span style="color:var(--accent)">${d.type}</span></div>`;
  }).join('');
}

let speedMult = 4;
function animate(){
  if(!scanning) return;
  for(let i=0;i<speedMult;i++) addWaterfallLine();
  drawWaterfall();
  if(hopCount % 50 === 0) drawHistogram();
  if(hopCount % 100 === 0) renderDevices();
  animFrame = requestAnimationFrame(animate);
}

function startScan(){
  if(scanning) return;
  scanning = true;
  setStatus(true);
  log(LANG[currentLang]?.scanStarted||'Scan started','success');
  playSound('click');
  animate();
}

function stopScan(){
  scanning = false;
  if(animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.scanStopped||'Scan stopped','info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang=localStorage.getItem('ble-lang')||'en';
  const savedTheme=localStorage.getItem('ble-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',()=>openPanel('helpPanel','helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('helpOverlay')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('settingsBtn')?.addEventListener('click',()=>openPanel('settingsPanel','settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('logBtn')?.addEventListener('click',()=>$('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click',()=>$('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked});
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log('Log cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast('Copied!',1500))});

  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      ({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'})[tab.dataset.tab]&&$( ({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'})[tab.dataset.tab])?.classList.add('active');
    });
  });

  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'});
    });
  });

  $('startBtn')?.addEventListener('click', startScan);
  $('stopBtn')?.addEventListener('click', stopScan);
  $('hopSpeed')?.addEventListener('change',e=>{speedMult=parseInt(e.target.value)});

  initWaterfall();drawWaterfall();drawHistogram();renderDevices();
  setStatus(false);
  log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — BLE X-Ray: 2.4GHz frequency hopping
   waterfall with channel activity, adaptive hopping, and
   advertising channel highlights
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simBleCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const channels=40,channelW=0,hopHistory=[];
  let currentCh=0,hopTimer=0,advTimer=0;
  const ADV_CHANNELS=[37,38,39];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080818;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  function drawChannelGrid(){
    const cw=W/channels;
    ctx.font='7px monospace';ctx.textAlign='center';
    for(let i=0;i<channels;i++){
      const x=i*cw;
      const isAdv=ADV_CHANNELS.includes(i);
      ctx.strokeStyle=isAdv?'rgba(255,100,100,0.15)':'rgba(100,100,255,0.06)';
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H-20);ctx.stroke();
      ctx.fillStyle=isAdv?'#ff6b6b':'rgba(100,150,255,0.3)';
      ctx.fillText(i,x+cw/2,H-6);
    }
  }

  function drawWaterfall(){
    const cw=W/channels;const rowH=3;
    // Shift existing content down
    if(frameCount>1){
      const imgData=ctx.getImageData(0,0,canvas.width,(H-20)*(devicePixelRatio||1));
      ctx.putImageData(imgData,0,rowH*(devicePixelRatio||1));
    }
    // Draw new row at top
    ctx.fillStyle='rgba(8,8,24,0.95)';ctx.fillRect(0,0,W,rowH);
    // Active channel
    const x=currentCh*cw;
    const isAdv=ADV_CHANNELS.includes(currentCh);
    const intensity=0.5+Math.random()*0.5;
    ctx.fillStyle=isAdv?'rgba(255,100,100,'+intensity+')':'rgba(0,180,255,'+intensity+')';
    ctx.fillRect(x,0,cw,rowH);
    // Noise on random channels
    for(let i=0;i<3;i++){
      const nc=Math.floor(Math.random()*channels);
      ctx.fillStyle='rgba(50,100,50,'+(Math.random()*0.15)+')';
      ctx.fillRect(nc*cw,0,cw,rowH);
    }
    // WiFi interference band (channels 1-14 overlap)
    if(Math.random()<0.1){
      const wifiStart=Math.floor(Math.random()*10);
      ctx.fillStyle='rgba(255,200,0,0.06)';
      ctx.fillRect(wifiStart*cw,0,cw*5,rowH);
    }
  }

  function drawCurrentHop(){
    const cw=W/channels,x=currentCh*cw+cw/2;
    ctx.save();ctx.shadowColor='#0cf';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(x,8,4,0,Math.PI*2);ctx.fillStyle='#0cf';ctx.fill();ctx.restore();
    ctx.font='8px monospace';ctx.fillStyle='#0cf';ctx.textAlign='center';ctx.fillText('CH '+currentCh,x,22);
  }

  function drawFreqLabel(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-80,H-38,160,16);
    ctx.font='9px monospace';ctx.fillStyle='#aaa';ctx.textAlign='center';
    const freq=2402+currentCh*2;ctx.fillText('2.4 GHz ISM Band \u2014 '+freq+' MHz',W/2,H-28);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,170,56);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,170,56);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='left';ctx.fillText('\u{1F499} BLE X-RAY',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Channel: '+currentCh+'  Freq: '+(2402+currentCh*2)+' MHz',16,40);
    ctx.fillText('Hops: '+frameCount+'  1600 hop/s',16,54);ctx.restore();
  }

  function hop(){
    // Adaptive frequency hopping — skip some channels
    const blocked=new Set();
    for(let i=0;i<5;i++)blocked.add(Math.floor(Math.random()*37));
    let next;
    if(Math.random()<0.15){next=ADV_CHANNELS[Math.floor(Math.random()*3)];}
    else{do{next=Math.floor(Math.random()*37);}while(blocked.has(next));}
    currentCh=next;
    hopHistory.push(currentCh);if(hopHistory.length>100)hopHistory.shift();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;hopTimer++;
    if(hopTimer>=2){hopTimer=0;hop();}
    drawWaterfall();drawChannelGrid();drawCurrentHop();drawFreqLabel();drawHUD();
    animId=requestAnimationFrame(animate);
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
