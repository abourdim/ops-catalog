/**
 * WiFi Dissector — Workshop DIY v1.2
 * 802.11 frame decode with color-coded fields
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}}

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
    title:'🔬 WiFi Dissector', subtitle:'802.11 Frame Decode',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'802.11 Frame Hex Viewer', mainDesc:'Color-coded 802.11 field decoder',
    sectionA:'Layer-by-Layer Decode', sectionB:'Capture Statistics', sectionC:'802.11 Frame Theory',
    frameType:'Frame type:', generate:'Generate Frame', capture:'Auto Capture',
    theory1:'Every WiFi frame starts with a 2-byte Frame Control field encoding type (management/control/data) and flags (ToDS, FromDS, retry, etc.).',
    theory2:'Up to 4 MAC addresses can appear: receiver, transmitter, BSSID, and source. Which are present depends on ToDS/FromDS bits.',
    theory3:'Management frames (beacons, probes, auth) carry information elements (IEs) with tagged parameters like SSID, supported rates, and channel.',
    theory4:'The 4-byte FCS (CRC-32) at the end protects frame integrity. Frames failing FCS check are silently discarded by hardware.',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    settings:'Settings', language:'Language', theme:'Theme', soundEffects:'Sound effects',
    activityLog:'Activity Log',
    howto_1:'The main display shows the Wifi Dissector simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for 🔬 WiFi Dissector. Choose your i', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Layer-by-Layer Decode" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    splashHint:'tap to skip', ready:'🔬 WiFi Dissector ready!',
    langChanged:'Language → English', themeChanged:'Theme →',
    logCleared:'Log cleared', copied:'Copied!',
    frameGenerated:'Frame generated', captureStarted:'Auto capture started', captureStopped:'Auto capture stopped',step1Title:'Set Up',step1Desc:'Configure the parameters for 🔬 WiFi Dissector. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Layer-by-Layer Decode" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Capture Statistics". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is 🔬 WiFi Dissector?',faq_a1:'Wifi Dissector is an interactive simulation that demonstrates radar systems concepts. Color-coded 802.11 field decoder. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real RF engineering behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Select frame type from dropdown. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Ble Xray and Esp Collision Visualizer. Each app in this category teaches a different aspect of RF engineering. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',demo_s1:'Welcome to 🔬 WiFi Dissector! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Select frame type from dropdown. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Layer-by-Layer Decode" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Wifi Dissector! This is like a science experiment on your computer. You get to control a real radar systems simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for 🔬 WiFi Dissector. Cho Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',wiki_concept_title:'🔬 What is 🔬 WiFi Dissector?',wiki_concept:'🔬 WiFi Dissector is a technique used in RF engineering. Color-coded 802.11 field decoder. In professional settings, this technology requires HackRF + ESP32 and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for 🔬 WiFi Dissector. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real RF engineering, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'🔬 WiFi Dissector has practical applications in RF engineering. Professionals use similar techniques with HackRF + ESP32 in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'🔬 WiFi Dissector: Color-coded 802.11 field decoder. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Layer-by-Layer Decode" and "Capture Statistics" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'IMSI Catcher Sim',related1_desc:'Simulate fake base station interception',related1_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',related2_name:'Micro Radar — EM Map',related2_desc:'Build a radar display from sensor data',related2_path:'../../11-hrf-microbit/bit-micro-radar/index.html',related3_name:'Directed Energy Simulator',related3_desc:'High-power RF beam simulation and phased array steering',related3_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'3-Protocol Concurrent Monitor',pathPrev_path:'../../12-hrf-esp32/esp-rf-iot-audit/index.html',pathNext_name:'',pathNext_path:'',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What frequency bands does Wi-Fi commonly use?',quiz_q1a:'900 MHz',quiz_q1b:'2.4 GHz and 5 GHz',quiz_q1c:'10 GHz',quiz_q1d:'100 MHz',quiz_q1_answer:'1',quiz_q2:'What is frequency measured in?',quiz_q2a:'Meters',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'What does SSID stand for?',quiz_q3a:'Signal Strength ID',quiz_q3b:'Service Set Identifier',quiz_q3c:'Secure System ID',quiz_q3d:'Simple Signal ID',quiz_q3_answer:'1',quiz_q4:'What voltage does ESP32 operate at?',quiz_q4a:'5V',quiz_q4b:'3.3V',quiz_q4c:'1.8V',quiz_q4d:'12V',quiz_q4_answer:'1',quiz_q5:'What is machine learning?',quiz_q5a:'Programming robots',quiz_q5b:'Systems that learn from data',quiz_q5c:'Manual computation',quiz_q5d:'Hardware design',quiz_q5_answer:'1'},
    wiki_history_title: '📜 History of Radar Systems',
    wiki_history: 'WiFi was released in 1997 as IEEE 802.11 at 2 Mbps. WiFi 6 (802.11ax) now reaches 9.6 Gbps using MU-MIMO and OFDMA. Wifi Dissector builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Wifi Dissector',
    wiki_math: 'The mathematics behind Wifi Dissector: Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radar systems practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radar systems. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radar systems: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radar systems.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radar Systems carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'SSID',
    gloss1_def: 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Wifi Dissector demonstrates key principles from radar systems. WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radar systems?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radar systems systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'🔬 Dissecteur WiFi', subtitle:'Decodage trame 802.11',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Visualiseur Hex 802.11', mainDesc:'Decodeur de champs 802.11 colore',
    sectionA:'Decodage couche par couche', sectionB:'Statistiques de capture', sectionC:'Theorie trame 802.11',
    frameType:'Type de trame:', generate:'Generer trame', capture:'Capture auto',
    theory1:'Chaque trame WiFi commence par un champ Frame Control de 2 octets encodant le type et les drapeaux.',
    theory2:'Jusqu\'a 4 adresses MAC peuvent apparaitre selon les bits ToDS/FromDS.',
    theory3:'Les trames de gestion transportent des elements d\'information (IE) avec des parametres comme SSID et canal.',
    theory4:'Le FCS 4 octets (CRC-32) protege l\'integrite. Les trames echouant sont rejetees.',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    settings:'Parametres', language:'Langue', theme:'Theme', soundEffects:'Effets sonores',
    activityLog:'Journal',
    howto_1:'L écran principal affiche la simulation Wifi Dissector. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for 🔬 WiFi Dissector. Choose your i', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    splashHint:'appuyer pour passer', ready:'🔬 Dissecteur WiFi pret!',
    langChanged:'Langue → Francais', themeChanged:'Theme →',
    logCleared:'Journal efface', copied:'Copie!',
    frameGenerated:'Trame generee', captureStarted:'Capture auto demarree', captureStopped:'Capture auto arretee',step1Title:'Configurer',step1Desc:'Configure les paramètres de 🔬 WiFi Dissector. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 🔬 WiFi Dissector ?',faq_a1:'Wifi Dissector est une simulation interactive qui démontre les concepts de systèmes radar. Color-coded 802.11 field decoder. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',demo_s1:'Bienvenue dans 🔬 WiFi Dissector ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir. Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Wifi Dissector ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de systèmes radar — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the parameters for 🔬 WiFi Dissector. Cho Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',wiki_concept_title:'🔬 Qu\'est-ce que 🔬 WiFi Dissector ?',wiki_concept:'🔬 WiFi Dissector est une technique utilisée en RF engineering. Dans un contexte professionnel, cette technologie nécessite HackRF + ESP32 et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de RF engineering. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'🔬 WiFi Dissector a des applications pratiques en RF engineering. Les professionnels utilisent des techniques similaires avec HackRF + ESP32. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'🔬 WiFi Dissector : Color-coded 802.11 field decoder. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Sim Capteur IMSI',related1_desc:'Simuler interception par fausse station',related1_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',related2_name:'Micro Radar — Carte EM',related2_desc:'Construire un affichage radar à partir de capteurs',related2_path:'../../11-hrf-microbit/bit-micro-radar/index.html',related3_name:'Simulateur Energie Dirigee',related3_desc:'Simulation faisceau RF haute puissance',related3_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Moniteur 3 protocoles',pathPrev_path:'../../12-hrf-esp32/esp-rf-iot-audit/index.html',pathNext_name:'',pathNext_path:'',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quelles bandes de fréquences utilise le Wi-Fi ?',quiz_q1a:'900 MHz',quiz_q1b:'2,4 GHz et 5 GHz',quiz_q1c:'10 GHz',quiz_q1d:'100 MHz',quiz_q1_answer:'1',quiz_q2:'En quoi se mesure la fréquence ?',quiz_q2a:'Mètres',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'Que signifie SSID ?',quiz_q3a:'Signal Strength ID',quiz_q3b:'Service Set Identifier',quiz_q3c:'Secure System ID',quiz_q3d:'Simple Signal ID',quiz_q3_answer:'1',quiz_q4:'À quelle tension fonctionne l\'ESP32 ?',quiz_q4a:'5V',quiz_q4b:'3,3V',quiz_q4c:'1,8V',quiz_q4d:'12V',quiz_q4_answer:'1',quiz_q5:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q5a:'Programmer des robots',quiz_q5b:'Systèmes apprenant des données',quiz_q5c:'Calcul manuel',quiz_q5d:'Conception matérielle',quiz_q5_answer:'1'},
    wiki_history_title: '📜 Histoire de systèmes radar',
    wiki_history: 'WiFi was released in 1997 as IEEE 802.11 at 2 Mbps. WiFi 6 (802.11ax) now reaches 9.6 Gbps using MU-MIMO and OFDMA. Wifi Dissector s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Wifi Dissector',
    wiki_math: 'Les mathématiques derrière Wifi Dissector : Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de systèmes radar utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour systèmes radar. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en systèmes radar : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Systèmes radar implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'SSID',
    gloss1_def: 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Wifi Dissector démontre les principes clés de systèmes radar. WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radar systems dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'🔬 محلل WiFi', subtitle:'فك تشفير إطار 802.11',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'عارض Hex لإطار 802.11', mainDesc:'محلل حقول 802.11 ملون',
    sectionA:'فك التشفير طبقة بطبقة', sectionB:'إحصائيات الالتقاط', sectionC:'نظرية إطار 802.11',
    frameType:'نوع الإطار:', generate:'إنشاء إطار', capture:'التقاط تلقائي',
    theory1:'يبدأ كل إطار WiFi بحقل Frame Control بحجم 2 بايت يشفر النوع والأعلام.',
    theory2:'يمكن أن تظهر حتى 4 عناوين MAC حسب بتات ToDS/FromDS.',
    theory3:'إطارات الإدارة تحمل عناصر معلومات مع معلمات مثل SSID والقناة.',
    theory4:'يحمي FCS بحجم 4 بايت (CRC-32) سلامة الإطار.',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    settings:'الإعدادات', language:'اللغة', theme:'المظهر', soundEffects:'مؤثرات صوتية',
    activityLog:'سجل النشاط',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Wifi Dissector. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for 🔬 WiFi Dissector. Choose your i', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    splashHint:'انقر للتخطي', ready:'🔬 محلل WiFi جاهز!',
    langChanged:'اللغة ← العربية', themeChanged:'المظهر ←',
    logCleared:'تم مسح السجل', copied:'تم النسخ!',
    frameGenerated:'تم إنشاء الإطار', captureStarted:'بدأ الالتقاط التلقائي', captureStopped:'توقف الالتقاط التلقائي',step1Title:'إعداد',step1Desc:'اضبط معاملات 🔬 WiFi Dissector. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو 🔬 WiFi Dissector؟',faq_a1:'Wifi Dissector هي محاكاة تفاعلية توضح مفاهيم أنظمة الرادار. Color-coded 802.11 field decoder. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',demo_s1:'مرحباً في 🔬 WiFi Dissector! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Wifi Dissector! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـأنظمة الرادار — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the parameters for 🔬 WiFi Dissector. Cho لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',wiki_concept_title:'🔬 ما هو 🔬 WiFi Dissector؟',wiki_concept:'🔬 WiFi Dissector هي تقنية تُستخدم في RF engineering. في البيئات المهنية، تتطلب هذه التقنية HackRF + ESP32 وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من RF engineering. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'🔬 WiFi Dissector له تطبيقات عملية في RF engineering. يستخدم المحترفون تقنيات مماثلة مع HackRF + ESP32. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'🔬 WiFi Dissector: Color-coded 802.11 field decoder. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أنظمة الرادار',
    wiki_history: 'WiFi was released in 1997 as IEEE 802.11 at 2 Mbps. WiFi 6 (802.11ax) now reaches 9.6 Gbps using MU-MIMO and OFDMA. يبني Wifi Dissector على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Wifi Dissector',
    wiki_math: 'الرياضيات وراء Wifi Dissector: Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أنظمة الرادار المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أنظمة الرادار. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أنظمة الرادار: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أنظمة الرادار يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'SSID',
    gloss1_def: 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Wifi Dissector يوضح المبادئ الأساسية في أنظمة الرادار. WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradar systems في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0645\\u062d\\u0627\\u0643\\u064a IMSI',related1_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u0627\\u0639\\u062a\\u0631\\u0627\\u0636 \\u0627\\u0644\\u0627\\u062a\\u0635\\u0627\\u0644\\u0627\\u062a',related1_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',related2_name:'رادار مصغّر — خريطة EM',related2_desc:'بناء شاشة رادار من بيانات المستشعرات',related2_path:'../../11-hrf-microbit/bit-micro-radar/index.html',related3_name:'\\u0645\\u062d\\u0627\\u0643\\u064a \\u0627\\u0644\\u0637\\u0627\\u0642\\u0629 \\u0627\\u0644\\u0645\\u0648\\u062c\\u0647\\u0629',related3_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u062d\\u0632\\u0645\\u0629 RF \\u0639\\u0627\\u0644\\u064a\\u0629 \\u0627\\u0644\\u0637\\u0627\\u0642\\u0629',related3_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مراقب 3 بروتوكولات',pathPrev_path:'../../12-hrf-esp32/esp-rf-iot-audit/index.html',pathNext_name:'',pathNext_path:'',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما نطاقات التردد التي يستخدمها الواي فاي؟',quiz_q1a:'900 ميغاهرتز',quiz_q1b:'2.4 و 5 غيغاهرتز',quiz_q1c:'10 غيغاهرتز',quiz_q1d:'100 ميغاهرتز',quiz_q1_answer:'1',quiz_q2:'بماذا تُقاس التردد؟',quiz_q2a:'أمتار',quiz_q2b:'هرتز',quiz_q2c:'واط',quiz_q2d:'فولت',quiz_q2_answer:'1',quiz_q3:'ماذا يعني SSID؟',quiz_q3a:'معرف قوة الإشارة',quiz_q3b:'معرف مجموعة الخدمة',quiz_q3c:'معرف النظام الآمن',quiz_q3d:'معرف الإشارة البسيط',quiz_q3_answer:'1',quiz_q4:'على أي جهد يعمل ESP32؟',quiz_q4a:'5 فولت',quiz_q4b:'3.3 فولت',quiz_q4c:'1.8 فولت',quiz_q4d:'12 فولت',quiz_q4_answer:'1',quiz_q5:'ما هو التعلم الآلي؟',quiz_q5a:'برمجة الروبوتات',quiz_q5b:'أنظمة تتعلم من البيانات',quiz_q5c:'حساب يدوي',quiz_q5d:'تصميم العتاد',quiz_q5_answer:'1'}
};
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}


function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


/* ═══════ SPLASH ═══════ */
function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);

/* ═══════ CORE ═══════ */
function setLanguage(lang){
  currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});
  localStorage.setItem('dissector-lang',lang);log(LANG[lang]?.langChanged||'Language changed','info');
}
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('dissector-theme',name);
}
function log(msg,type='info'){
  const c=$('logContainer');if(!c)return;const line=document.createElement('div');
  line.className='log-line log-'+type;const ts=new Date().toLocaleTimeString();
  line.innerHTML=`<span class="log-ts">${ts}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line);c.scrollTop=c.scrollHeight;
}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(hideToast,ms)}
function hideToast(){const t=$('toastIndicator');if(t)t.classList.remove('show')}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}

/* ═══════ PANELS ═══════ */
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ 802.11 FRAME SIMULATION ═══════ */
function randByte(){return Math.floor(Math.random()*256)}
function hex(b){return b.toString(16).padStart(2,'0').toUpperCase()}
function randMAC(){return Array.from({length:6},()=>hex(randByte())).join(':')}

const FRAME_DEFS = {
  beacon: {fc:[0x80,0x00],type:'Management',subtype:'Beacon',hasAddr3:true,hasSeq:true,bodyLen:32},
  probe:  {fc:[0x40,0x00],type:'Management',subtype:'Probe Request',hasAddr3:true,hasSeq:true,bodyLen:16},
  data:   {fc:[0x08,0x01],type:'Data',subtype:'Data',hasAddr3:true,hasSeq:true,bodyLen:48},
  ack:    {fc:[0xD4,0x00],type:'Control',subtype:'ACK',hasAddr3:false,hasSeq:false,bodyLen:0},
  rts:    {fc:[0xB4,0x00],type:'Control',subtype:'RTS',hasAddr3:false,hasSeq:false,bodyLen:0},
  auth:   {fc:[0xB0,0x00],type:'Management',subtype:'Authentication',hasAddr3:true,hasSeq:true,bodyLen:6},
};

let currentFrame = null;
let captureStats = {beacon:0,probe:0,data:0,ack:0,rts:0,auth:0};
let captureInterval = null;

function generateFrame(type){
  const def = FRAME_DEFS[type];
  const frame = {type, def, bytes:[], fields:[]};
  let offset = 0;

  // Frame Control (2 bytes)
  frame.bytes.push(def.fc[0], def.fc[1]);
  frame.fields.push({name:'Frame Control',cls:'f-fc',start:offset,len:2,
    detail:`Type: ${def.type}, Subtype: ${def.subtype}, FC: 0x${hex(def.fc[0])}${hex(def.fc[1])}`});
  offset+=2;

  // Duration (2 bytes)
  const dur = randByte() & 0x7F;
  frame.bytes.push(dur, 0x00);
  frame.fields.push({name:'Duration/ID',cls:'f-dur',start:offset,len:2,detail:`Duration: ${dur} microseconds`});
  offset+=2;

  // Address 1 - Receiver (6 bytes)
  const addr1 = Array.from({length:6},()=>randByte());
  frame.bytes.push(...addr1);
  frame.fields.push({name:'Address 1 (RA)',cls:'f-addr1',start:offset,len:6,detail:`Receiver: ${addr1.map(hex).join(':')}`});
  offset+=6;

  if(type !== 'ack'){
    // Address 2 - Transmitter (6 bytes)
    const addr2 = Array.from({length:6},()=>randByte());
    frame.bytes.push(...addr2);
    frame.fields.push({name:'Address 2 (TA)',cls:'f-addr2',start:offset,len:6,detail:`Transmitter: ${addr2.map(hex).join(':')}`});
    offset+=6;
  }

  if(def.hasAddr3){
    // Address 3 - BSSID (6 bytes)
    const addr3 = Array.from({length:6},()=>randByte());
    frame.bytes.push(...addr3);
    frame.fields.push({name:'Address 3 (BSSID)',cls:'f-addr3',start:offset,len:6,detail:`BSSID: ${addr3.map(hex).join(':')}`});
    offset+=6;
  }

  if(def.hasSeq){
    // Sequence Control (2 bytes)
    const seq = Math.floor(Math.random()*4096);
    const frag = 0;
    frame.bytes.push((seq<<4|frag)&0xFF, (seq>>4)&0xFF);
    frame.fields.push({name:'Sequence Control',cls:'f-seq',start:offset,len:2,detail:`Seq#: ${seq}, Frag#: ${frag}`});
    offset+=2;
  }

  if(def.bodyLen > 0){
    const body = Array.from({length:def.bodyLen},()=>randByte());
    frame.bytes.push(...body);
    frame.fields.push({name:'Frame Body',cls:'f-body',start:offset,len:def.bodyLen,detail:`Payload: ${def.bodyLen} bytes`});
    offset+=def.bodyLen;
  }

  // FCS (4 bytes) - simulated CRC
  const fcs = Array.from({length:4},()=>randByte());
  frame.bytes.push(...fcs);
  frame.fields.push({name:'FCS (CRC-32)',cls:'f-fcs',start:offset,len:4,detail:`FCS: 0x${fcs.map(hex).join('')}`});

  currentFrame = frame;
  captureStats[type]++;
  renderHex();
  renderDecode();
  drawStats();
  log(`${LANG[currentLang]?.frameGenerated||'Frame generated'}: ${def.subtype} (${frame.bytes.length} bytes)`, 'success');
  playSound('click');
}

function renderHex(){
  const el = $('hexDisplay');
  if(!el || !currentFrame) return;
  let html = '';
  const fieldMap = [];
  currentFrame.fields.forEach(f=>{
    for(let i=f.start;i<f.start+f.len;i++) fieldMap[i] = f;
  });
  currentFrame.bytes.forEach((b,i)=>{
    const f = fieldMap[i];
    const cls = f ? f.cls : '';
    const title = f ? `${f.name}: ${f.detail}` : '';
    html += `<span class="hex-byte ${cls}" title="${title}">${hex(b)}</span>`;
    if((i+1)%16===0) html += '<br>';
  });
  el.innerHTML = html;
}

function renderDecode(){
  const el = $('decodePanel');
  if(!el || !currentFrame) return;
  let html = `<div class="decode-row"><div class="decode-label">Frame Type</div><div>${currentFrame.def.type} / ${currentFrame.def.subtype}</div></div>`;
  html += `<div class="decode-row"><div class="decode-label">Total Length</div><div>${currentFrame.bytes.length} bytes</div></div>`;
  currentFrame.fields.forEach(f=>{
    const bytes = currentFrame.bytes.slice(f.start, f.start+f.len).map(hex).join(' ');
    html += `<div class="decode-row"><div class="decode-label">${f.name}</div><div>${f.detail}<br><span style="opacity:.5;font-size:.85em">[${bytes}]</span></div></div>`;
  });
  // Decode Frame Control bits
  const fc0 = currentFrame.bytes[0], fc1 = currentFrame.bytes[1];
  const protVer = fc0 & 0x03;
  const ftype = (fc0 >> 2) & 0x03;
  const fsub = (fc0 >> 4) & 0x0F;
  const toDS = fc1 & 0x01;
  const fromDS = (fc1 >> 1) & 0x01;
  const retry = (fc1 >> 3) & 0x01;
  html += `<div class="decode-row" style="margin-top:8px;border-top:2px solid var(--accent)"><div class="decode-label">FC Bits Detail</div><div>Protocol: ${protVer}, Type: ${ftype}, Subtype: ${fsub}, ToDS: ${toDS}, FromDS: ${fromDS}, Retry: ${retry}</div></div>`;
  el.innerHTML = html;
}

function drawStats(){
  const canvas = $('statsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,W,H);
  const types = Object.keys(captureStats);
  const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#6a0572'];
  const max = Math.max(1, ...Object.values(captureStats));
  const bw = W / types.length - 20;
  types.forEach((t,i)=>{
    const x = i * (bw+20) + 20;
    const h = (captureStats[t]/max) * (H-50);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, H-30-h, bw, h);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.font = '11px Orbitron,monospace';
    ctx.fillText(t, x, H-14);
    ctx.fillText(captureStats[t]+'', x+bw/2-5, H-34-h);
  });
  const info = $('statsInfo');
  if(info){
    const total = Object.values(captureStats).reduce((a,b)=>a+b,0);
    info.textContent = `Total frames: ${total}`;
  }
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang = localStorage.getItem('dissector-lang')||'en';
  const savedTheme = localStorage.getItem('dissector-theme')||'mosque-gold';
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
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log(LANG[currentLang]?.logCleared||'Cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast(LANG[currentLang]?.copied||'Copied',1500))});

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const map={faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'};
      $(map[tab.dataset.tab])?.classList.add('active');
    });
  });

  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'});
    });
  });

  // Frame generation
  $('generateBtn')?.addEventListener('click',()=>{
    const type = $('frameTypeSelect')?.value || 'beacon';
    generateFrame(type);
  });

  // Auto capture
  $('captureBtn')?.addEventListener('click',()=>{
    if(captureInterval){
      clearInterval(captureInterval);captureInterval=null;
      setStatus(false);
      $('captureBtn').textContent = LANG[currentLang]?.capture || 'Auto Capture';
      log(LANG[currentLang]?.captureStopped||'Auto capture stopped','info');
    } else {
      captureInterval = setInterval(()=>{
        const types = Object.keys(FRAME_DEFS);
        const weights = [30,15,40,10,3,2]; // beacon heavy, data heavy
        const total = weights.reduce((a,b)=>a+b,0);
        let r = Math.random()*total, idx=0;
        for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0){idx=i;break}}
        generateFrame(types[idx]);
      },1200);
      setStatus(true);
      $('captureBtn').textContent = 'Stop';
      log(LANG[currentLang]?.captureStarted||'Auto capture started','success');
    }
  });

  // Initial frame
  generateFrame('beacon');
  setStatus(false);
  log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — WiFi Dissector: 802.11 frame visualization
   with color-coded fields, hex bytes, and frame flow animation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simDissectorCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const wifiFrames=[],hexDrops=[];let captureCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const FRAME_TYPES=[
    {name:'Beacon',color:'#4d96ff',fields:['FC','Dur','BSSID','SA','DA','Seq','SSID','Rates','CH','FCS']},
    {name:'Probe Req',color:'#ffd93d',fields:['FC','Dur','DA','SA','BSSID','Seq','SSID','FCS']},
    {name:'Data',color:'#6bcb77',fields:['FC','Dur','Addr1','Addr2','Addr3','Seq','Payload','FCS']},
    {name:'ACK',color:'#ff78ae',fields:['FC','Dur','RA','FCS']},
    {name:'Auth',color:'#e879f9',fields:['FC','Dur','DA','SA','BSSID','Seq','AuthAlg','Status','FCS']},
    {name:'RTS',color:'#ff6b6b',fields:['FC','Dur','RA','TA','FCS']}
  ];

  class WiFiFrame{
    constructor(){
      this.type=FRAME_TYPES[Math.floor(Math.random()*FRAME_TYPES.length)];
      this.x=-50;this.y=30+Math.random()*(H-100);this.vx=1+Math.random()*1.5;
      this.alive=true;this.fieldWidth=Math.max(16,Math.floor((W-100)/this.type.fields.length));
      this.hex=Array.from({length:this.type.fields.length*2},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0'));
    }
    update(){this.x+=this.vx;if(this.x>W+100)this.alive=false;return this.alive;}
    draw(){
      const fh=20,totalW=this.type.fields.length*this.fieldWidth;
      // Frame background
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(this.x,this.y,totalW,fh+14);
      // Type label
      ctx.font='bold 8px monospace';ctx.fillStyle=this.type.color;ctx.textAlign='left';ctx.fillText(this.type.name,this.x,this.y-4);
      // Fields
      this.type.fields.forEach((f,i)=>{
        const fx=this.x+i*this.fieldWidth;
        ctx.fillStyle=this.type.color+'33';ctx.fillRect(fx,this.y,this.fieldWidth-2,fh);
        ctx.strokeStyle=this.type.color+'66';ctx.lineWidth=1;ctx.strokeRect(fx,this.y,this.fieldWidth-2,fh);
        ctx.font='7px monospace';ctx.fillStyle=this.type.color;ctx.textAlign='center';ctx.fillText(f,fx+this.fieldWidth/2-1,this.y+8);
        // Hex bytes below
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='6px monospace';
        const hexStr=this.hex[i*2]||'00';ctx.fillText(hexStr,fx+this.fieldWidth/2-1,this.y+fh+8);
      });
    }
  }

  /* Hex rain background */
  class HexDrop{
    constructor(){this.x=Math.random()*W;this.y=-10;this.speed=0.5+Math.random()*1;this.char=Math.floor(Math.random()*256).toString(16).padStart(2,'0');}
    update(){this.y+=this.speed;if(this.y>H){this.y=-10;this.x=Math.random()*W;this.char=Math.floor(Math.random()*256).toString(16).padStart(2,'0');}return true;}
    draw(){ctx.font='8px monospace';ctx.fillStyle='rgba(100,150,255,0.06)';ctx.textAlign='center';ctx.fillText(this.char,this.x,this.y);}
  }

  /* Frame type histogram */
  function drawHistogram(){
    const counts={};FRAME_TYPES.forEach(t=>counts[t.name]=0);wifiFrames.forEach(f=>counts[f.type.name]++);
    const bw=Math.min(50,(W-40)/FRAME_TYPES.length-6),sx=(W-FRAME_TYPES.length*(bw+6))/2;
    const by=H-8;
    FRAME_TYPES.forEach((t,i)=>{
      const bx=sx+i*(bw+6),bh=Math.min(30,counts[t.name]*4);
      ctx.fillStyle=t.color+'44';ctx.fillRect(bx,by-bh,bw,bh);ctx.strokeStyle=t.color;ctx.lineWidth=1;ctx.strokeRect(bx,by-bh,bw,bh);
      ctx.font='6px monospace';ctx.fillStyle=t.color;ctx.textAlign='center';ctx.fillText(t.name.slice(0,6),bx+bw/2,by+6);
    });
  }

  /* Protocol control field decoder */
  function drawFCDecoder(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(W-140,8,132,44);ctx.strokeStyle='#fff2';ctx.strokeRect(W-140,8,132,44);
    ctx.font='8px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='left';ctx.fillText('Frame Control Bits',W-134,20);
    const bits=['ToDS','FromDS','Retry','PwrMgt','More','WEP','Order','Prot'];
    bits.forEach((b,i)=>{const on=Math.random()>0.5;ctx.fillStyle=on?'#6bcb77':'#444';ctx.fillText((on?'1':'0')+' '+b,W-134+(i%4)*33,32+(Math.floor(i/4)*12));});
    ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,56);ctx.strokeStyle='#4d96ff33';ctx.strokeRect(8,8,185,56);
    ctx.font='10px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='left';ctx.fillText('\u{1F52C} WIFI DISSECTOR',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Frames: '+captureCount+'  Active: '+wifiFrames.length,16,40);
    ctx.fillText('Types: '+FRAME_TYPES.length,16,54);ctx.restore();
  }

  function init(){
    ensureCanvas();
    for(let i=0;i<60;i++)hexDrops.push(new HexDrop());
    animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,16,0.14)';ctx.fillRect(0,0,W,H);
    hexDrops.forEach(d=>{d.update();d.draw();});
    if(frameCount%30===0){wifiFrames.push(new WiFiFrame());captureCount++;}
    for(let i=wifiFrames.length-1;i>=0;i--){if(!wifiFrames[i].update())wifiFrames.splice(i,1);else wifiFrames[i].draw();}
    drawHistogram();if(frameCount%60<30)drawFCDecoder();drawHUD();animId=requestAnimationFrame(animate);
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
