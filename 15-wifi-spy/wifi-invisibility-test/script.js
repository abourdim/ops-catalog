/**
 * Invisibility Test — WiFi Privacy Score
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
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
    ...LANG_BASE.en,title:'Invisibility Test',subtitle:'Test how invisible your device is',disconnected:'Disconnected',connected:'Testing',mainSection:'Invisibility Test',mainDesc:'MAC randomization & probe suppression',sectionA:'Test Results',sectionB:'Recommendations',sectionC:'How It Works',start:'Test',stop:'Stop',score:'Score',tests:'Tests',passed:'Passed',failed:'Failed',howItWorksText:'Tests your device invisibility through MAC randomization, probe suppression, and more.',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Test Results" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_t1:'\u0627\u0644\u0625\u062e\u0641\u0627\u0621. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_d1:'\u062a\u0642\u0644\u064a\u0644 \u0627\u0644\u062a\u062a\u0628\u0639. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_t2:'\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_d2:'\u0645\u062d\u0644\u064a. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Invisibility Test ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language \u2192 English',themeChanged:'Theme \u2192',simStarted:'Testing started',simStopped:'Testing stopped',step1Title:'Scan Airwaves',step1Desc:'WiFi adapter scans all channels to discover nearby access points and clients.',step2Title:'Identify Targets',step2Desc:'Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.',step3Title:'Analyze Traffic',step3Desc:'Captured frames are decoded to reveal communication patterns and vulnerabilities.',step4Title:'Detect Threats',step4Desc:'Security analysis identifies rogue APs, weak encryption, and suspicious activity.',sectionCode:'Device Code',faq_q1:'What is Invisibility Test?',faq_a1:'Invisibility Test lets you mac randomization & probe suppression. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real WiFi monitoring behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real WiFi monitoring principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need WiFi adapter. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Wifi Covert Exfil and Wifi Ghost Detector. Each app in this category teaches a different aspect of WiFi monitoring.',demo_s1:'Welcome to Invisibility Test! Look at the main display — this is where the WiFi monitoring simulation runs.',demo_s2:'Click Test to start. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Test Results" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of WiFi monitoring.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how WiFi monitoring works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches WiFi monitoring concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Python (Scapy)',codeSnippet:'from scapy.all import *\\n\\ndef packet_handler(pkt):\\n    if pkt.haslayer(Dot11Beacon):\\n        ssid = pkt[Dot11Elt].info.decode(errors="ignore")\\n        bssid = pkt[Dot11].addr2\\n        channel = int(ord(pkt[Dot11Elt:3].info))\\n        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else "N/A"\\n        print(f"SSID: {ssid:30s}  BSSID: {bssid}  CH: {channel:2d}  Signal: {signal}")\\n\\nprint("Sniffing WiFi beacons... (requires monitor mode)")\\nsniff(iface="wlan0mon", prn=packet_handler, store=0)',codeExplain:'This script uses Scapy to capture WiFi beacon frames — the packets that access points broadcast every ~100ms to announce their presence. Each beacon contains the network name (SSID), MAC address (BSSID), channel number, and signal strength. Your WiFi adapter must be in monitor mode (airmon-ng start wlan0) to capture raw 802.11 frames.',wiki_concept_title:'🔬 What is Invisibility Test?',wiki_concept:'Invisibility Test is a technique used in WiFi monitoring. MAC randomization & probe suppression. In professional settings, this technology requires WiFi adapter and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: WiFi adapter scans all channels to discover nearby access points and clients. Second: Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type. The simulation runs these stages in real time, showing you intermediate results at each step. In real WiFi monitoring, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Invisibility Test has practical applications in WiFi monitoring. Professionals use similar techniques with WiFi adapter in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Invisibility Test: MAC randomization & probe suppression. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan Airwaves through Identify Targets to Analyze Traffic and Detect Threats.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Test Results" and "Recommendations" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Wifi Surveillance',
    wiki_history: 'The field of WiFi surveillance has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed WiFi surveillance by enabling software-defined approaches. Modern practitioners use tools like WiFi adapter to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Invisibility Test',
    wiki_math: 'The mathematics underpinning invisibility test involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced WiFi surveillance practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to WiFi surveillance. Hardware-based solutions using WiFi adapter offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with WiFi surveillance: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in WiFi surveillance.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Wifi Surveillance carries important ethical and legal responsibilities. Many countries regulate the use of WiFi adapter and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
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
    theory: 'Understanding the theory behind invisibility test requires grasping several interconnected concepts from WiFi surveillance. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world WiFi surveillance?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional WiFi surveillance systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use WiFi adapter hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
fr:{title:'Test d\'Invisibilite',subtitle:'Testez votre invisibilite WiFi',disconnected:'Deconnecte',connected:'Test',mainSection:'Test d\'Invisibilite',mainDesc:'Verification MAC et sondage',sectionA:'Resultats',sectionB:'Recommandations',sectionC:'Comment ca marche',start:'Tester',stop:'Arreter',score:'Score',tests:'Tests',passed:'Reussi',failed:'Echoue',howItWorksText:'Teste l\'invisibilite WiFi de votre appareil.',howto_1:'Cliquez Tester.',howto_2:'Observez.',howto_3:'Resultats.',howto_4:'Recommandations.',wiki_t1:'Invisibilite',wiki_d1:'Reduire le suivi.',wiki_t2:'Confidentialite',wiki_d2:'Tout reste local.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue \u2192 Francais',themeChanged:'Theme \u2192',simStarted:'Test demarre',simStopped:'Arrete',step1Title:'Scanner les ondes',step1Desc:'L\'adaptateur WiFi scanne tous les canaux pour découvrir les points d\'accès.',step2Title:'Identifier les cibles',step2Desc:'Les appareils détectés sont identifiés par MAC, SSID et puissance du signal.',step3Title:'Analyser le trafic',step3Desc:'Les trames capturées sont décodées pour révéler les schémas de communication.',step4Title:'Détecter les menaces',step4Desc:'L\'analyse de sécurité identifie les AP pirates et les faiblesses.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule WiFi ! 🔬 Tu peux expérimenter avec WiFi signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais WiFi signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai wireless networks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Wifi Persona Builder and Wifi Covert Exfil ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 Histoire de surveillance WiFi',
    wiki_history: 'Le domaine de surveillance WiFi a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme WiFi adapter pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Invisibility Test',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de surveillance WiFi utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour surveillance WiFi. Les solutions matérielles avec WiFi adapter offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en surveillance WiFi : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Surveillance wifi implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de WiFi adapter. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
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
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de WiFi surveillance. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec WiFi surveillance dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel WiFi adapter et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
ar:{title:'\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0625\u062e\u0641\u0627\u0621',subtitle:'\u0627\u062e\u062a\u0628\u0631 \u0625\u062e\u0641\u0627\u0621 \u062c\u0647\u0627\u0632\u0643',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0627\u062e\u062a\u0628\u0627\u0631',mainSection:'\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0625\u062e\u0641\u0627\u0621',mainDesc:'\u0641\u062d\u0635 MAC \u0648\u0627\u0644\u0627\u0633\u062a\u0642\u0635\u0627\u0621',sectionA:'\u0627\u0644\u0646\u062a\u0627\u0626\u062c',sectionB:'\u062a\u0648\u0635\u064a\u0627\u062a',sectionC:'\u0643\u064a\u0641 \u064a\u0639\u0645\u0644',start:'\u0627\u062e\u062a\u0628\u0627\u0631',stop:'\u0625\u064a\u0642\u0627\u0641',score:'\u0646\u062a\u064a\u062c\u0629',tests:'\u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a',passed:'\u0646\u062c\u062d',failed:'\u0641\u0634\u0644',howItWorksText:'\u064a\u062e\u062a\u0628\u0631 \u0625\u062e\u0641\u0627\u0621 \u062c\u0647\u0627\u0632\u0643.',howto_1:'\u0627\u0646\u0642\u0631 \u0627\u062e\u062a\u0628\u0627\u0631.',howto_2:'\u0634\u0627\u0647\u062f.',howto_3:'\u0631\u0627\u062c\u0639.',howto_4:'\u0627\u062a\u0628\u0639.',wiki_t1:'\u0627\u0644\u0625\u062e\u0641\u0627\u0621',wiki_d1:'\u062a\u0642\u0644\u064a\u0644 \u0627\u0644\u062a\u062a\u0628\u0639.',wiki_t2:'\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629',wiki_d2:'\u0645\u062d\u0644\u064a.',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d...',langChanged:'\u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631 \u2190',simStarted:'\u0628\u062f\u0623',simStopped:'\u062a\u0648\u0642\u0641',step1Title:'مسح الموجات',step1Desc:'يفحص محول WiFi جميع القنوات لاكتشاف نقاط الوصول القريبة.',step2Title:'تحديد الأهداف',step2Desc:'يتم تحديد الأجهزة المكتشفة بواسطة MAC و SSID وقوة الإشارة.',step3Title:'تحليل حركة البيانات',step3Desc:'يتم فك تشفير الإطارات الملتقطة لكشف أنماط الاتصال.',step4Title:'كشف التهديدات',step4Desc:'يحدد التحليل الأمني نقاط الوصول المزيفة ونقاط الضعف.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي WiFi! 🔬 يمكنك التجربة مع WiFi signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج WiFi signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا wireless networks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Wifi Persona Builder and Wifi Covert Exfil! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 تاريخ مراقبة الواي فاي',
    wiki_history: 'تطور مجال مراقبة الواي فاي بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل WiFi adapter لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Invisibility Test',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو مراقبة الواي فاي المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في مراقبة الواي فاي. توفر الحلول المادية باستخدام WiFi adapter أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في مراقبة الواي فاي: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'مراقبة الواي فاي يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام WiFi adapter والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
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
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من WiFi surveillance. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـWiFi surveillance في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة WiFi adapter وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`invisibility-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ======= APP LOGIC — Invisibility Test ======= */
const TESTS=['MAC Randomization','Probe Request Suppression','DHCP Hostname Leak','mDNS Broadcast','WiFi Direct Discovery','Preferred Network List','Power Save Timing','Sequence Number Analysis','Beacon Response Time','Association Pattern'];
let simRunning=false,simInterval=null,testIdx=0,results=[],canvas,ctx;

function initCanvas(){canvas=$('simCanvas');if(!canvas)return;ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;ctx.scale(2,2);}

function drawCanvas(){
  if(!ctx)return;const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.1)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,r=Math.min(w,h)/3;
  const score=results.length?results.filter(r=>r.pass).length/results.length:0;
  // background ring
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=12;ctx.stroke();
  // score arc
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*score);
  ctx.strokeStyle=score>0.7?'#22c55e':score>0.4?'#fbbf24':'#ef4444';ctx.lineWidth=12;ctx.lineCap='round';ctx.stroke();
  // test dots around ring
  TESTS.forEach((t,i)=>{
    const a=-Math.PI/2+Math.PI*2*i/TESTS.length;
    const px=cx+Math.cos(a)*(r+20),py=cy+Math.sin(a)*(r+20);
    ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
    if(i<results.length)ctx.fillStyle=results[i].pass?'#22c55e':results[i].warn?'#fbbf24':'#ef4444';
    else ctx.fillStyle='rgba(255,255,255,0.15)';
    ctx.fill();
  });
  // center text
  ctx.fillStyle='#fff';ctx.font='bold 28px Orbitron,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(Math.round(score*100)+'%',cx,cy-5);
  ctx.font='10px sans-serif';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText('INVISIBILITY',cx,cy+18);
}

function runTest(){
  if(testIdx>=TESTS.length){stopSim();return;}
  const name=TESTS[testIdx];const pass=Math.random()>0.4;const warn=!pass&&Math.random()>0.5;
  results.push({name,pass,warn});testIdx++;
  log(`${name}: ${pass?'PASS':warn?'WARN':'FAIL'}`,pass?'success':warn?'info':'error');
  // Update results UI
  const res=$('testResults');if(res){
    const d=document.createElement('div');d.className='test-item';
    const cls=pass?'pass':warn?'warn':'fail';
    d.innerHTML=`<span>${name}</span><span class="${cls}">${pass?'PASS':warn?'WARN':'FAIL'}</span>`;
    res.appendChild(d);
  }
  const passed=results.filter(r=>r.pass).length;
  $('overallScore').textContent=Math.round(passed/results.length*100)+'%';
  $('testsRun').textContent=results.length;
  $('testsPassed').textContent=passed;
  $('testsFailed').textContent=results.filter(r=>!r.pass&&!r.warn).length;
  // Recommendations
  const rec=$('recommendations');if(rec){
    const tips=results.filter(r=>!r.pass).map(r=>'<div style="padding:4px 0;border-bottom:1px solid var(--border)">Fix: '+r.name+'</div>');
    rec.innerHTML=tips.length?tips.join(''):'<div style="color:#22c55e">All tests passed!</div>';
  }
  drawCanvas();
}

function startSim(){if(simRunning)return;simRunning=true;setStatus(true);$('startBtn').disabled=true;$('stopBtn').disabled=false;results=[];testIdx=0;const res=$('testResults');if(res)res.innerHTML='';initCanvas();log(LANG[currentLang].simStarted,'success');simInterval=setInterval(runTest,900);}
function stopSim(){simRunning=false;if(simInterval)clearInterval(simInterval);setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;log(LANG[currentLang].simStopped,'info');}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — Invisibility Shield Visualizer ═══════ */
(function invisibilityShieldCanvas(){
  const CVS_ID='invisShieldVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🛡️</span> Invisibility Shield</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const scanBeams=[];let _raf=null,frameCount=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    const cx=w/2,cy=h/2;
    const score=(typeof results!=='undefined'&&results.length>0)?results.filter(r=>r.pass).length/results.length:0;
    const shieldR=Math.min(w,h)*0.28;
    // Shield rings — more rings = better protection
    const numRings=Math.max(1,Math.floor(score*6));
    for(let i=numRings;i>=1;i--){
      const r=shieldR*(0.5+i*0.1);
      const pulse=Math.sin(frameCount*0.02+i*0.5)*3;
      ctx.beginPath();ctx.arc(cx,cy,r+pulse,0,Math.PI*2);
      const alpha=score>0.7?0.12:score>0.4?0.08:0.04;
      const color=score>0.7?'34,197,94':score>0.4?'251,191,36':'239,68,68';
      ctx.strokeStyle=`rgba(${color},${alpha*i})`;ctx.lineWidth=2;ctx.stroke();
    }
    // Hexagonal shield pattern
    const hexR=shieldR*0.8;
    for(let ring=1;ring<=3;ring++){
      const hr=hexR*ring/3;
      for(let a=0;a<6;a++){
        const angle=a*Math.PI/3-Math.PI/6;const nextAngle=(a+1)*Math.PI/3-Math.PI/6;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(angle)*hr,cy+Math.sin(angle)*hr);
        ctx.lineTo(cx+Math.cos(nextAngle)*hr,cy+Math.sin(nextAngle)*hr);
        const shieldAlpha=score*0.15*ring/3;
        ctx.strokeStyle=`rgba(34,197,94,${shieldAlpha})`;ctx.lineWidth=1;ctx.stroke();
      }
    }
    // Center device icon
    ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);
    ctx.fillStyle='rgba(59,130,246,0.3)';ctx.fill();
    ctx.strokeStyle='#3b82f6';ctx.lineWidth=1.5;ctx.stroke();
    ctx.font='10px sans-serif';ctx.fillStyle='#3b82f6';ctx.textAlign='center';ctx.fillText('📱',cx,cy+4);
    // Incoming scan beams (threats)
    if(frameCount%15===0){
      const angle=Math.random()*Math.PI*2;
      scanBeams.push({angle,dist:shieldR*2.5,speed:2+Math.random()*2,blocked:Math.random()<score});
    }
    scanBeams.forEach((beam,i)=>{
      beam.dist-=beam.speed;
      const bx=cx+Math.cos(beam.angle)*beam.dist;
      const by=cy+Math.sin(beam.angle)*beam.dist;
      if(beam.dist<shieldR&&beam.blocked){
        // Deflection sparks
        for(let s=0;s<3;s++){
          const sa=beam.angle+Math.PI+(Math.random()-0.5)*1;
          const sd=shieldR+Math.random()*15;
          const sx=cx+Math.cos(sa)*sd,sy=cy+Math.sin(sa)*sd;
          ctx.beginPath();ctx.arc(sx,sy,1.5,0,Math.PI*2);
          ctx.fillStyle='#22c55e';ctx.globalAlpha=0.5;ctx.fill();ctx.globalAlpha=1;
        }
        scanBeams.splice(i,1);return;
      }
      if(beam.dist<15&&!beam.blocked){
        // Hit — device exposed
        ctx.beginPath();ctx.arc(cx,cy,18,0,Math.PI*2);
        ctx.fillStyle='rgba(239,68,68,0.2)';ctx.fill();
        scanBeams.splice(i,1);return;
      }
      if(beam.dist<0){scanBeams.splice(i,1);return;}
      // Draw beam
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(beam.angle)*(beam.dist+15),cy+Math.sin(beam.angle)*(beam.dist+15));
      ctx.lineTo(bx,by);
      ctx.strokeStyle=beam.blocked?'rgba(239,68,68,0.3)':'rgba(239,68,68,0.5)';ctx.lineWidth=2;ctx.stroke();
      // Beam head
      ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fillStyle='#ef4444';ctx.fill();
    });
    if(scanBeams.length>30)scanBeams.splice(0,10);
    // Score display
    ctx.font='bold 22px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillStyle=score>0.7?'#22c55e':score>0.4?'#fbbf24':'#ef4444';
    ctx.fillText(Math.round(score*100)+'%',cx,h-25);
    ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.fillText('INVISIBILITY SCORE',cx,h-12);
    // Test progress dots
    if(typeof TESTS!=='undefined'){
      const dotStartX=cx-TESTS.length*6;
      TESTS.forEach((t,i)=>{
        ctx.beginPath();ctx.arc(dotStartX+i*12,h-40,3,0,Math.PI*2);
        if(typeof results!=='undefined'&&i<results.length){
          ctx.fillStyle=results[i].pass?'#22c55e':results[i].warn?'#fbbf24':'#ef4444';
        }else{
          ctx.fillStyle='rgba(255,255,255,0.1)';
        }
        ctx.fill();
      });
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
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
