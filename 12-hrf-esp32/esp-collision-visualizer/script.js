/**
 * Collision Visualizer — Workshop DIY v1.2
 * 2.4GHz signal collision and BER simulator
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

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
  en:{
    ...LANG_BASE.en,title:'💥 Collision Visualizer',subtitle:'2.4GHz Signal Collision',disconnected:'Idle',connected:'Simulating',mainSection:'Dual TX Collision Zone',mainDesc:'Two transmitters, one frequency — watch bits collide',sectionA:'BER Over Time',sectionB:'Collision Analysis',sectionC:'Collision Theory',startSim:'Start Simulation',stop:'Stop',theory1:'When two transmitters broadcast on the same frequency simultaneously, their signals overlap and interfere, causing bit errors.',theory2:'The Bit Error Rate (BER) depends on relative power. Equal power causes maximum interference.',theory3:'CSMA/CA (WiFi) and frequency hopping (BLE) minimize collisions but cannot eliminate them in the 2.4 GHz band.',theory4:'The simulation shows how power difference between TX1 and TX2 affects BER — stronger signals dominate (capture effect).',splashHint:'tap to skip',ready:'💥 Collision Visualizer ready!',langChanged:'Language → English',simStarted:'Collision simulation started',simStopped:'Simulation stopped',step1Title:'Set Up',step1Desc:'Configure the parameters for 💥 Collision Visualizer. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "BER Over Time" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Collision Analysis". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is 💥 Collision Visualizer?',faq_a1:'💥 Collision Visualizer lets you two transmitters, one frequency — watch bits collide. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real RF engineering behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Ble Xray and Esp Lora Lab. Each app in this category teaches a different aspect of RF engineering.',demo_s1:'Welcome to 💥 Collision Visualizer! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "BER Over Time" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how RF engineering works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',wiki_concept_title:'🔬 What is 💥 Collision Visualizer?',wiki_concept:'💥 Collision Visualizer is a technique used in RF engineering. Two transmitters, one frequency — watch bits collide. In professional settings, this technology requires HackRF + ESP32 and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for 💥 Collision Visualizer. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real RF engineering, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'💥 Collision Visualizer has practical applications in RF engineering. Professionals use similar techniques with HackRF + ESP32 in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'💥 Collision Visualizer: Two transmitters, one frequency — watch bits collide. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "BER Over Time" and "Collision Analysis" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Radar Systems',
    wiki_history: 'The field of radar systems has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed radar systems by enabling software-defined approaches. Modern practitioners use tools like HackRF SDR to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Collision Visualizer',
    wiki_math: 'The mathematics underpinning collision visualizer involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radar systems practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radar systems. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radar systems: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radar systems.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radar Systems carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
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
    theory: 'Understanding the theory behind collision visualizer requires grasping several interconnected concepts from radar systems. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radar systems?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radar systems systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr:{
    ...LANG_BASE.fr,title:'💥 Visualiseur de Collision',subtitle:'Collision de signaux 2.4GHz',disconnected:'Inactif',connected:'Simulation',mainSection:'Zone de collision double TX',mainDesc:'Deux emetteurs, une frequence — observez les collisions',sectionA:'BER au fil du temps',sectionB:'Analyse des collisions',sectionC:'Theorie des collisions',startSim:'Demarrer simulation',stop:'Arreter',theory1:'Quand deux emetteurs transmettent sur la meme frequence, leurs signaux interferent, causant des erreurs de bits.',theory2:'Le taux d\'erreur binaire depend de la puissance relative. Puissance egale = interference maximale.',theory3:'CSMA/CA et le saut de frequence minimisent les collisions mais ne les eliminent pas.',theory4:'La simulation montre comment la difference de puissance affecte le BER — effet de capture.',splashHint:'appuyer pour passer',ready:'💥 Visualiseur pret!',langChanged:'Langue → Francais',simStarted:'Simulation demarree',simStopped:'Simulation arretee',step1Title:'Configurer',step1Desc:'Configure les paramètres de 💥 Collision Visualizer. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 💥 Collision Visualizer ?',faq_a1:'💥 Collision Visualizer te permet de simuler ingénierie RF. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF.',demo_s1:'Bienvenue dans 💥 Collision Visualizer ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne ingénierie RF en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',wiki_concept_title:'🔬 Qu\'est-ce que 💥 Collision Visualizer ?',wiki_concept:'💥 Collision Visualizer est une technique utilisée en RF engineering. Dans un contexte professionnel, cette technologie nécessite HackRF + ESP32 et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de RF engineering. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'💥 Collision Visualizer a des applications pratiques en RF engineering. Les professionnels utilisent des techniques similaires avec HackRF + ESP32. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'💥 Collision Visualizer : Two transmitters, one frequency — watch bits collide. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de systèmes radar',
    wiki_history: 'Le domaine de systèmes radar a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme HackRF SDR pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Collision Visualizer',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de systèmes radar utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour systèmes radar. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en systèmes radar : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Systèmes radar implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
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
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de radar systems. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radar systems dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar:{
    ...LANG_BASE.ar,title:'💥 عارض التصادم',subtitle:'تصادم إشارات 2.4GHz',disconnected:'خامل',connected:'محاكاة',mainSection:'منطقة تصادم TX مزدوج',mainDesc:'مرسلان، تردد واحد — شاهد تصادم البتات',sectionA:'BER عبر الزمن',sectionB:'تحليل التصادم',sectionC:'نظرية التصادم',startSim:'بدء المحاكاة',stop:'إيقاف',theory1:'عندما يبث مرسلان على نفس التردد، تتداخل إشاراتهما مسببة أخطاء في البتات.',theory2:'يعتمد معدل خطأ البت على القوة النسبية. القوة المتساوية تسبب أقصى تداخل.',theory3:'CSMA/CA وقفز التردد يقللان التصادمات لكن لا يمنعانها.',theory4:'تُظهر المحاكاة كيف يؤثر فرق القوة بين TX1 وTX2 على BER.',splashHint:'انقر للتخطي',ready:'💥 عارض التصادم جاهز!',langChanged:'اللغة ← العربية',simStarted:'بدأت المحاكاة',simStopped:'توقفت المحاكاة',step1Title:'إعداد',step1Desc:'اضبط معاملات 💥 Collision Visualizer. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو 💥 Collision Visualizer؟',faq_a1:'💥 Collision Visualizer يتيح لك محاكاة هندسة الترددات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات.',demo_s1:'مرحباً في 💥 Collision Visualizer! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل هندسة الترددات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',wiki_concept_title:'🔬 ما هو 💥 Collision Visualizer؟',wiki_concept:'💥 Collision Visualizer هي تقنية تُستخدم في RF engineering. في البيئات المهنية، تتطلب هذه التقنية HackRF + ESP32 وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من RF engineering. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'💥 Collision Visualizer له تطبيقات عملية في RF engineering. يستخدم المحترفون تقنيات مماثلة مع HackRF + ESP32. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'💥 Collision Visualizer: Two transmitters, one frequency — watch bits collide. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أنظمة الرادار',
    wiki_history: 'تطور مجال أنظمة الرادار بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل HackRF SDR لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Collision Visualizer',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أنظمة الرادار المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أنظمة الرادار. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أنظمة الرادار: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أنظمة الرادار يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
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
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من radar systems. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradar systems في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);
function setLanguage(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});localStorage.setItem('collision-lang',lang);log(LANG[lang]?.langChanged||'Lang','info')}
function setTheme(name){document.documentElement.setAttribute('data-theme',name);if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');else document.documentElement.classList.remove('light-theme');localStorage.setItem('collision-theme',name)}
function log(msg,type='info'){const c=$('logContainer');if(!c)return;const line=document.createElement('div');line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;c.appendChild(line);c.scrollTop=c.scrollHeight}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ COLLISION SIMULATION ═══════ */
let simulating = false, animFrame = null;
let totalBits = 0, errorBits = 0, collisionCount = 0;
let berHistory = [];
let bitBuffer = [];
const canvas = $('collisionCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function calcBER(p1, p2){
  // BER based on SIR (signal to interference ratio)
  const sir = Math.abs(p1 - p2); // dB difference
  if(sir > 10) return 0.001; // capture effect — almost no errors
  if(sir > 6) return 0.01;
  if(sir > 3) return 0.05;
  return 0.15 + (1 - sir/3) * 0.2; // equal power = ~35% BER max
}

function generateBits(count, ber){
  const bits = [];
  for(let i = 0; i < count; i++){
    const sent = Math.random() < 0.5 ? 1 : 0;
    const error = Math.random() < ber;
    bits.push({sent, received: error ? (1 - sent) : sent, error});
    totalBits++;
    if(error){errorBits++;collisionCount++}
  }
  return bits;
}

function drawCollision(){
  if(!ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const t = Date.now() / 1000;

  // Draw TX1 signal (blue, from left)
  ctx.strokeStyle = '#3ba5f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x = 0; x < W; x++){
    const amp = (p1 / 20) * (H / 4);
    const decay = Math.max(0, 1 - x / (W * 0.7));
    const y = H / 2 + Math.sin(x * 0.05 + t * 3) * amp * decay;
    if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw TX2 signal (orange, from right)
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x = 0; x < W; x++){
    const amp = (p2 / 20) * (H / 4);
    const decay = Math.max(0, 1 - (W - x) / (W * 0.7));
    const y = H / 2 + Math.sin(x * 0.06 + t * 2.5 + 1.5) * amp * decay;
    if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Collision zone (red overlay in the middle)
  const overlapStart = W * 0.25, overlapEnd = W * 0.75;
  const ber = calcBER(p1, p2);
  const alpha = Math.min(0.4, ber * 1.5);
  ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
  ctx.fillRect(overlapStart, 0, overlapEnd - overlapStart, H);

  // Labels
  ctx.fillStyle = '#3ba5f7';
  ctx.font = '12px Orbitron,monospace';
  ctx.fillText(`TX1: ${p1}dBm`, 10, 18);
  ctx.fillStyle = '#f97316';
  ctx.fillText(`TX2: ${p2}dBm`, W - 100, 18);
  ctx.fillStyle = '#f44';
  ctx.fillText('COLLISION ZONE', W / 2 - 60, 18);
}

function updateBitStream(){
  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const ber = calcBER(p1, p2);
  const newBits = generateBits(16, ber);
  bitBuffer.push(...newBits);
  if(bitBuffer.length > 512) bitBuffer = bitBuffer.slice(-512);

  // Render bit stream
  const el = $('bitStream');
  if(el){
    el.innerHTML = bitBuffer.map(b =>
      `<span class="${b.error ? 'bit-err' : 'bit-ok'}">${b.received}</span>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  // Update stats
  const currentBER = totalBits > 0 ? (errorBits / totalBits * 100) : 0;
  $('berVal').textContent = currentBER.toFixed(2) + '%';
  $('collisions').textContent = collisionCount;
  $('goodBits').textContent = totalBits - errorBits;
  $('totalBits').textContent = totalBits;

  berHistory.push(currentBER);
  if(berHistory.length > 200) berHistory.shift();
}

function drawBERChart(){
  const c = $('berCanvas');
  if(!c) return;
  const cx = c.getContext('2d'), W = c.width, H = c.height;
  cx.fillStyle = '#000';
  cx.fillRect(0, 0, W, H);
  if(berHistory.length < 2) return;
  const max = Math.max(1, ...berHistory);
  cx.strokeStyle = '#f44';
  cx.lineWidth = 2;
  cx.beginPath();
  berHistory.forEach((v, i) => {
    const x = i / (berHistory.length - 1) * W;
    const y = H - 10 - (v / max) * (H - 20);
    if(i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
  });
  cx.stroke();
  cx.fillStyle = 'rgba(255,255,255,.4)';
  cx.font = '10px monospace';
  cx.fillText('BER %', 4, 14);
  cx.fillText(max.toFixed(1) + '%', 4, 28);
}

function updateAnalysis(){
  const el = $('analysisPanel');
  if(!el) return;
  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const sir = Math.abs(p1 - p2);
  const ber = calcBER(p1, p2);
  const capture = sir > 6;
  el.innerHTML = `<div>TX1 Power: <strong>${p1} dBm</strong></div><div>TX2 Power: <strong>${p2} dBm</strong></div><div>Power Difference (SIR): <strong>${sir} dB</strong></div><div>Instantaneous BER: <strong style="color:${ber>.1?'#f44':ber>.01?'#f90':'#0f0'}">${(ber*100).toFixed(2)}%</strong></div><div>Capture Effect: <strong style="color:${capture?'#0f0':'#f44'}">${capture?'YES — stronger signal dominates':'NO — heavy interference'}</strong></div><hr style="border-color:rgba(255,255,255,.1);margin:8px 0"><div>Total bits: ${totalBits} | Errors: ${errorBits} | Good: ${totalBits-errorBits}</div><div>${sir < 3 ? 'Both signals at similar power — maximum collision damage!' : sir < 6 ? 'Partial capture — significant errors remain' : 'Strong capture effect — weaker signal suppressed'}</div>`;
}

function animate(){
  if(!simulating) return;
  drawCollision();
  updateBitStream();
  if(totalBits % 100 < 20) drawBERChart();
  if(totalBits % 50 < 20) updateAnalysis();
  animFrame = requestAnimationFrame(animate);
}

function startSim(){
  if(simulating) return;
  simulating = true;
  totalBits = 0; errorBits = 0; collisionCount = 0;
  berHistory = []; bitBuffer = [];
  setStatus(true); playSound('click');
  log(LANG[currentLang]?.simStarted || 'Simulation started', 'success');
  animate();
}
function stopSim(){
  simulating = false;
  if(animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.simStopped || 'Simulation stopped', 'info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('collision-lang') || 'en';
  const savedTheme = localStorage.getItem('collision-theme') || 'mosque-gold';
  if($('langSelect')) $('langSelect').value = savedLang;
  if($('themeSelect')) $('themeSelect').value = savedTheme;
  setLanguage(savedLang); setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click', () => openPanel('helpPanel', 'helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click', () => closePanel('helpPanel', 'helpOverlay'));
  $('helpOverlay')?.addEventListener('click', () => closePanel('helpPanel', 'helpOverlay'));
  $('settingsBtn')?.addEventListener('click', () => openPanel('settingsPanel', 'settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click', () => closePanel('settingsPanel', 'settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click', () => closePanel('settingsPanel', 'settingsOverlay'));
  $('logBtn')?.addEventListener('click', () => $('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click', () => $('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change', e => setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change', e => setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change', e => { soundEnabled = e.target.checked });
  $('clearLogBtn')?.addEventListener('click', () => { $('logContainer').innerHTML = ''; log('Log cleared', 'info') });
  $('copyLogBtn')?.addEventListener('click', () => { navigator.clipboard.writeText($('logContainer')?.innerText || '').then(() => showToast('Copied!', 1500)) });

  $('tx1Power')?.addEventListener('input', e => { $('tx1Val').textContent = e.target.value });
  $('tx2Power')?.addEventListener('input', e => { $('tx2Val').textContent = e.target.value });

  document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); $({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'}[tab.dataset.tab])?.classList.add('active') }) });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); const f = btn.dataset.filter; document.querySelectorAll('.log-line').forEach(l => { l.style.display = (f === 'all' || l.classList.contains('log-' + f)) ? '' : 'none' }) }) });

  $('simBtn')?.addEventListener('click', startSim);
  $('stopBtn')?.addEventListener('click', stopSim);

  setStatus(false);
  log(LANG[currentLang]?.ready || 'Ready', 'success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Collision Visualizer: Dual transmitter
   signal collision zone with BER visualization and capture effect
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCollCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const waves1=[],waves2=[],sparks=[];
  let ber=0,totalBitsVis=0,errorBitsVis=0;
  const tx1={x:0,y:0,power:0.7,freq:2.44};
  const tx2={x:0,y:0,power:0.5,freq:2.44};

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
    tx1.x=W*0.2;tx1.y=H/2;tx2.x=W*0.8;tx2.y=H/2;
  }

  class Wave{
    constructor(x,y,color){this.x=x;this.y=y;this.r=0;this.maxR=Math.min(W,H)*0.6;this.alpha=0.5;this.color=color;}
    update(){this.r+=2;this.alpha=0.5*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.strokeStyle=this.color.replace('1)',this.alpha+')');ctx.lineWidth=2;ctx.stroke();}
  }

  class Spark{
    constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*5;this.vy=(Math.random()-0.5)*5;this.life=1;this.size=2+Math.random()*2;}
    update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.95;this.vy*=0.95;this.life-=0.03;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,200,50,'+this.life+')';ctx.fill();}
  }

  function drawTX(tx,label,color){
    ctx.save();ctx.shadowColor=color;ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(tx.x,tx.y,18,0,Math.PI*2);ctx.fillStyle=color.replace('1)','0.2)');ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4E1}',tx.x,tx.y);
    ctx.font='8px monospace';ctx.fillStyle=color;ctx.fillText(label,tx.x,tx.y+26);
    // Power bar
    ctx.fillStyle='#222';ctx.fillRect(tx.x-20,tx.y+32,40,5);
    ctx.fillStyle=color;ctx.fillRect(tx.x-20,tx.y+32,40*tx.power,5);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText(Math.floor(tx.power*100)+'%',tx.x,tx.y+46);
    ctx.restore();
  }

  function drawCollisionZone(){
    const cx=W/2,cy=H/2;
    // Interference pattern
    const berLevel=Math.min(1,ber);
    ctx.save();ctx.globalAlpha=0.2+berLevel*0.3;
    const grad=ctx.createRadialGradient(cx,cy,10,cx,cy,80);
    grad.addColorStop(0,'rgba(255,100,50,'+(berLevel*0.5)+')');
    grad.addColorStop(1,'rgba(255,100,50,0)');
    ctx.fillStyle=grad;ctx.fillRect(cx-80,cy-80,160,160);ctx.restore();
    // Collision label
    if(berLevel>0.1){
      ctx.font='bold 10px monospace';ctx.fillStyle='rgba(255,200,50,'+(0.5+Math.sin(frameCount*0.1)*0.3)+')';
      ctx.textAlign='center';ctx.fillText('\u{1F4A5} COLLISION ZONE',cx,cy-40);
    }
  }

  function drawSignalWaveform(){
    const y1=H*0.15,y2=H*0.85,ww=W*0.6,sx=(W-ww)/2;
    // TX1 waveform
    ctx.beginPath();ctx.moveTo(sx,y1);
    for(let x=0;x<ww;x++){const v=Math.sin((x+frameCount*3)*0.05)*tx1.power*20;ctx.lineTo(sx+x,y1+v);}
    ctx.strokeStyle='rgba(255,100,100,0.4)';ctx.lineWidth=1;ctx.stroke();
    // TX2 waveform
    ctx.beginPath();ctx.moveTo(sx,y2);
    for(let x=0;x<ww;x++){const v=Math.sin((x+frameCount*3)*0.05+1)*tx2.power*20;ctx.lineTo(sx+x,y2+v);}
    ctx.strokeStyle='rgba(100,100,255,0.4)';ctx.lineWidth=1;ctx.stroke();
    // Combined (center)
    ctx.beginPath();ctx.moveTo(sx,H/2);
    for(let x=0;x<ww;x++){const v1=Math.sin((x+frameCount*3)*0.05)*tx1.power*15;const v2=Math.sin((x+frameCount*3)*0.05+1)*tx2.power*15;ctx.lineTo(sx+x,H/2+v1+v2);}
    ctx.strokeStyle='rgba(255,200,100,0.3)';ctx.lineWidth=1;ctx.stroke();
  }

  function drawBERMeter(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-80,H-30,160,22);
    ctx.strokeStyle='#fff2';ctx.strokeRect(W/2-80,H-30,160,22);
    const g=ctx.createLinearGradient(W/2-80,0,W/2+80,0);g.addColorStop(0,'#6bcb77');g.addColorStop(0.5,'#ffd93d');g.addColorStop(1,'#ff4444');
    ctx.fillStyle='#222';ctx.fillRect(W/2-75,H-26,150,14);ctx.fillStyle=g;ctx.fillRect(W/2-75,H-26,150*Math.min(1,ber),14);
    ctx.font='8px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('BER: '+(ber*100).toFixed(1)+'%',W/2,H-16);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,56);ctx.strokeStyle='#f903';ctx.strokeRect(8,8,185,56);
    ctx.font='10px monospace';ctx.fillStyle='#ff9944';ctx.textAlign='left';ctx.fillText('\u{1F4A5} COLLISION VISUALIZER',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Bits: '+totalBitsVis+'  Errors: '+errorBitsVis,16,40);
    ctx.fillText('BER: '+(ber*100).toFixed(2)+'%',16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,8,16,0.14)';ctx.fillRect(0,0,W,H);
    // Slowly vary power
    tx1.power=0.5+Math.sin(frameCount*0.005)*0.3;tx2.power=0.5+Math.cos(frameCount*0.007)*0.3;
    // BER calculation based on power difference
    const diff=Math.abs(tx1.power-tx2.power);ber=Math.max(0.01,0.5-diff*1.5);
    totalBitsVis+=10;errorBitsVis+=Math.round(ber*10);
    // Waves
    if(frameCount%12===0){waves1.push(new Wave(tx1.x,tx1.y,'rgba(255,100,100,1)'));waves2.push(new Wave(tx2.x,tx2.y,'rgba(100,100,255,1)'));}
    for(let i=waves1.length-1;i>=0;i--){if(!waves1[i].update())waves1.splice(i,1);else waves1[i].draw();}
    for(let i=waves2.length-1;i>=0;i--){if(!waves2[i].update())waves2.splice(i,1);else waves2[i].draw();}
    drawCollisionZone();drawSignalWaveform();
    // Collision sparks
    if(ber>0.2&&frameCount%4===0){for(let i=0;i<2;i++)sparks.push(new Spark(W/2+(Math.random()-0.5)*40,H/2+(Math.random()-0.5)*40));}
    for(let i=sparks.length-1;i>=0;i--){if(!sparks[i].update())sparks.splice(i,1);else sparks[i].draw();}
    drawTX(tx1,'TX1','rgba(255,100,100,1)');drawTX(tx2,'TX2','rgba(100,100,255,1)');
    drawBERMeter();drawHUD();animId=requestAnimationFrame(animate);
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
