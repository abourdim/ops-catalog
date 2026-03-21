/** Workshop DIY — Bio Walking Gait ID v1.0 — WiFi CSI identifies people by walking pattern */
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

const LANG={en:{
    ...LANG_BASE.en,title:'Bio Walking Gait ID',subtitle:'WiFi CSI identifies people by walk',disconnected:'Disconnected',connected:'Connected',mainSection:'Gait ID \u2014 WiFi Person Identification',mainDesc:'WiFi channel state information identifies people by walking pattern',ready:'\ud83d\udeb6 Gait ID ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Attach Sensors',step1Desc:'Place biosensors on the body to measure physiological signals. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Capture Biosignal',step2Desc:'The sensor captures real-time biological data like heart rate or muscle activity.',step3Title:'Process & Modulate',step3Desc:'Biosignal data is processed and converted into a radio-compatible format. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Transmit & Decode',step4Desc:'The bio-encoded signal is transmitted wirelessly and decoded at the receiver. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Bio Walking Gait ID?',faq_a1:'Walking Gait Id is an interactive simulation that demonstrates bioelectronics concepts. WiFi channel state information identifies people by walking pattern. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real biomedical signals principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Walking Gait ID! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Walking Gait Id! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Place biosensors on the body to measure physiologi Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Walking Gait ID?',wiki_concept:'Bio Walking Gait ID is a technique used in biomedical signals. WiFi channel state information identifies people by walking pattern. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Place biosensors on the body to measure physiological signals. Second: The sensor captures real-time biological data like heart rate or muscle activity. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Walking Gait ID has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Walking Gait ID: WiFi channel state information identifies people by walking pattern. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Attach Sensors through Capture Biosignal to Process & Modulate and Transmit & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Walking Gait Id builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Walking Gait Id',
    wiki_math: 'The mathematics behind Walking Gait Id: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Walking Gait Id demonstrates key principles from bioelectronics. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'phys-em-drive-simulator',related1_desc:'',related1_path:'../../47-impossible-physics/phys-em-drive-simulator/index.html',related2_name:'Nanosecond Radar',related2_desc:'Visualize ultra-precise timing pulses and measure nanosecond intervals',related2_path:'../../45-time-manipulation/chrono-nanosecond-radar/index.html',related3_name:'phys-bell-inequality-rf',related3_desc:'',related3_path:'../../47-impossible-physics/phys-bell-inequality-rf/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Voice RF \\u2014 Harmonic Authentication',pathPrev_path:'../../43-bio-radio/bio-voice-rf-fingerprint/index.html',pathNext_name:'',pathNext_path:'',
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is a neural network?',quiz_q1a:'Physical wires',quiz_q1b:'Computing system inspired by biological neurons',quiz_q1c:'Social network',quiz_q1d:'Radio network',quiz_q1_answer:'1',quiz_q2:'Which protocol secures modern Wi-Fi networks?',quiz_q2a:'WEP',quiz_q2b:'WPA3',quiz_q2c:'HTTP',quiz_q2d:'FTP',quiz_q2_answer:'1',quiz_q3:'What is machine learning?',quiz_q3a:'Programming robots',quiz_q3b:'Systems that learn from data',quiz_q3c:'Manual computation',quiz_q3d:'Hardware design',quiz_q3_answer:'1',quiz_q4:'What frequency bands does Wi-Fi commonly use?',quiz_q4a:'900 MHz',quiz_q4b:'2.4 GHz and 5 GHz',quiz_q4c:'10 GHz',quiz_q4d:'100 MHz',quiz_q4_answer:'1',quiz_q5:'Which unit measures radio frequency?',quiz_q5a:'Watts',quiz_q5b:'Hertz',quiz_q5c:'Decibels',quiz_q5d:'Ohms',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'CERN\'s LHC generates 1 petabyte/second during collisions. The Worldwide LHC Computing Grid spans 170 centers in 42 countries. In 2012, it confirmed the Higgs boson, completing the Standard Model of physics.',realworld2:'LIGO detected gravitational waves in 2015, confirming Einstein\'s 100-year-old prediction. The sensors measured spacetime distortions of 10⁻²¹ meters — one ten-thousandth the width of a proton.',realworld3:'Voyager 1, launched in 1977, communicates from 24 billion km away using a 23-watt transmitter — the power of a fridge light bulb. Signals take 22+ hours each way. The Deep Space Network uses 70m dishes to receive them.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In bio-radio, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in bio-radio and reveal the hidden complexity beneath simple-looking systems.',proTipTitle:'💡 Pro Tips',proTip1:'The micro:bit accelerometer is sensitive to temperature changes. Let your device warm up for 2 minutes before taking precise measurements.',proTip2:'Always check your battery level before field operations. A dying micro:bit produces unreliable sensor readings that can corrupt your entire dataset.',funFactTitle:'🎯 Did You Know?',funFact:'A neutron star is so dense that a teaspoon of its material would weigh about 6 billion tons on Earth — roughly the weight of every car, truck, and bus on the planet combined.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},fr:{title:'Bio Identification Marche',subtitle:'WiFi CSI identifie par la d\u00e9marche',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\ud83d\udeb6 ID marche pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Fixer les capteurs',step1Desc:'Place les biocapteurs sur le corps pour mesurer les signaux physiologiques. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Capturer le biosignal',step2Desc:'Le capteur enregistre les données biologiques en temps réel.',step3Title:'Traiter et moduler',step3Desc:'Les données sont traitées et converties en format radio compatible. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Émettre et décoder',step4Desc:'Le signal bio-encodé est transmis sans fil et décodé au récepteur. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Walking Gait Id est une simulation interactive qui démontre les concepts de bioélectronique. WiFi channel state information identifies people by walking pattern. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Brainwave Radio and Bio Muscle Telegraph ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Walking Gait Id s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Walking Gait Id',
    wiki_math: 'Les mathématiques derrière Walking Gait Id : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Walking Gait Id démontre les principes clés de bioélectronique. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'phys-em-drive-simulator',related1_desc:'',related1_path:'../../47-impossible-physics/phys-em-drive-simulator/index.html',related2_name:'Radar Nanoseconde',related2_desc:'Visualiser des impulsions temporelles ultra-precises',related2_path:'../../45-time-manipulation/chrono-nanosecond-radar/index.html',related3_name:'phys-bell-inequality-rf',related3_desc:'',related3_path:'../../47-impossible-physics/phys-bell-inequality-rf/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Voix RF \\u2014 Authentification Harmonique',pathPrev_path:'../../43-bio-radio/bio-voice-rf-fingerprint/index.html',pathNext_name:'',pathNext_path:'',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'Le LHC du CERN génère 1 pétaoctet par seconde lors des collisions. En 2012, il a confirmé le boson de Higgs, complétant le Modèle standard de la physique.',realworld2:'LIGO a détecté des ondes gravitationnelles en 2015, confirmant la prédiction centenaire d\'Einstein. Les capteurs ont mesuré des distorsions de l\'espace-temps de 10⁻²¹ mètres.',realworld3:'Voyager 1, lancé en 1977, communique depuis 24 milliards de km avec un émetteur de 23 watts. Les signaux prennent plus de 22 heures dans chaque sens.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En bio-radio, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en bio-radio et révèlent la complexité cachée sous des systèmes simples en apparence.'},ar:{title:'\u062a\u0639\u0631\u064a\u0641 \u0627\u0644\u0645\u0634\u064a',subtitle:'WiFi CSI \u064a\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0634\u062e\u0627\u0635 \u0628\u0627\u0644\u0645\u0634\u064a',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\ud83d\udeb6 \u062a\u0639\u0631\u064a\u0641 \u0627\u0644\u0645\u0634\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',step1Title:'تثبيت المستشعرات',step1Desc:'ضع المستشعرات الحيوية على الجسم لقياس الإشارات الفسيولوجية. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'التقاط الإشارة الحيوية',step2Desc:'يلتقط المستشعر البيانات البيولوجية في الوقت الفعلي.',step3Title:'معالجة وتعديل',step3Desc:'تتم معالجة البيانات وتحويلها إلى صيغة متوافقة مع الراديو. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'إرسال وفك تشفير',step4Desc:'يتم بث الإشارة المشفرة حيوياً لاسلكياً وفك تشفيرها. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Walking Gait Id هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. WiFi channel state information identifies people by walking pattern. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Brainwave Radio and Bio Muscle Telegraph! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Walking Gait Id على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Walking Gait Id',
    wiki_math: 'الرياضيات وراء Walking Gait Id: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Walking Gait Id يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'phys-em-drive-simulator',related1_desc:'',related1_path:'../../47-impossible-physics/phys-em-drive-simulator/index.html',related2_name:'رادار النانوثانية',related2_desc:'تصور نبضات التوقيت فائقة الدقة وقياس فترات النانوثانية',related2_path:'../../45-time-manipulation/chrono-nanosecond-radar/index.html',related3_name:'phys-bell-inequality-rf',related3_desc:'',related3_path:'../../47-impossible-physics/phys-bell-inequality-rf/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'\\u0628\\u0635\\u0645\\u0629 \\u0635\\u0648\\u062a\\u064a\\u0629 RF \\u2014 \\u0645\\u0635\\u0627\\u062f\\u0642\\u0629',pathPrev_path:'../../43-bio-radio/bio-voice-rf-fingerprint/index.html',pathNext_name:'',pathNext_path:'',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'يولد مصادم الهادرونات الكبير في سيرن 1 بيتابايت في الثانية أثناء التصادمات. في عام 2012 أكد بوزون هيغز مكملاً النموذج القياسي للفيزياء.',realworld2:'رصد مرصد ليغو موجات الجاذبية عام 2015 مؤكدًا تنبؤ أينشتاين قبل 100 عام. قاست المستشعرات تشوهات في الزمكان بمقدار 10⁻²¹ متر.',realworld3:'يتواصل المسبار فويجر 1 الذي أُطلق عام 1977 من مسافة 24 مليار كم باستخدام مرسل بقدرة 23 واط. تستغرق الإشارات أكثر من 22 ساعة في كل اتجاه.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الراديو الحيوي معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الراديو الحيوي وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.'}};
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}


function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

let scanning=false,walkers=[{name:'Alice',color:'#33ff33',stride:0.7,speed:1.2,phase:0},{name:'Bob',color:'#ff6633',stride:0.9,speed:0.9,phase:Math.PI},{name:'Charlie',color:'#6699ff',stride:0.6,speed:1.5,phase:Math.PI/2}],currentWalker=0,csiData=[];
function initApp(){const canvas=$('gaitCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;const W=canvas.width,H=canvas.height;let t=0;
function frame(){ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t+=.016;if(scanning){const w=walkers[currentWalker];w.phase+=.016*w.speed*4;const step=Math.sin(w.phase)*w.stride;const csi=step*50+Math.sin(t*20)*5+(Math.random()-.5)*8;csiData.push(csi);if(csiData.length>W)csiData.shift();const sn=$('statPerson'),ss=$('statStride'),sp=$('statSpeed');if(sn)sn.textContent=w.name;if(ss)ss.textContent=w.stride.toFixed(2);if(sp)sp.textContent=w.speed.toFixed(1)}
if(csiData.length>1){ctx.beginPath();ctx.strokeStyle=walkers[currentWalker].color;ctx.lineWidth=2;csiData.forEach((v,i)=>{const x=i,y=H/2-v;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke()}
// Walking figure
if(scanning){const w=walkers[currentWalker];const fx=W/2,fy=H*.75;const leg=Math.sin(w.phase)*15;ctx.strokeStyle=w.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(fx,fy-40,8,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(fx,fy-32);ctx.lineTo(fx,fy-10);ctx.moveTo(fx,fy-10);ctx.lineTo(fx-leg,fy+10);ctx.moveTo(fx,fy-10);ctx.lineTo(fx+leg,fy+10);ctx.moveTo(fx,fy-25);ctx.lineTo(fx-10,fy-15);ctx.moveTo(fx,fy-25);ctx.lineTo(fx+10,fy-15);ctx.stroke();ctx.fillStyle=w.color;ctx.font='12px Orbitron';ctx.textAlign='center';ctx.fillText(w.name,fx,fy+25);ctx.textAlign='left'}
// Gait signature box
ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(W-200,10,190,80);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(W-200,10,190,80);ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.fillText('GAIT SIGNATURE',W-190,25);walkers.forEach((w,i)=>{ctx.fillStyle=i===currentWalker?w.color:'rgba(255,255,255,.3)';ctx.fillText(`${w.name}: stride=${w.stride} spd=${w.speed}`,W-190,40+i*16)});
ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';ctx.fillText('WiFi CSI AMPLITUDE',10,20);
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),nextBtn=$('nextBtn'),trainBtn=$('trainBtn'),idBtn=$('idBtn');
if(startBtn)startBtn.onclick=()=>{scanning=!scanning;setStatus(scanning);log(scanning?'CSI capture started':'Stopped','info')};
if(nextBtn)nextBtn.onclick=()=>{currentWalker=(currentWalker+1)%walkers.length;csiData=[];log(`Switched to ${walkers[currentWalker].name}`,'info')};
if(trainBtn)trainBtn.onclick=()=>{log(`Training model on ${walkers[currentWalker].name}'s gait pattern (${csiData.length} samples)`,'success');showToast('Model trained!',1500)};
if(idBtn)idBtn.onclick=()=>{const w=walkers[currentWalker];const conf=Math.round(85+Math.random()*12);log(`Identified: ${w.name} (confidence: ${conf}%) stride=${w.stride}m speed=${w.speed}m/s`,'success');showToast(`Person: ${w.name} (${conf}%)`,2000)}}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ GAIT ID CANVAS VISUALIZATION (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootGaitViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(0,255,120,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=500;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- data stores --- */
    var csiHistory=[],gaitPatterns=[],particles=[],floorGrid=[];
    var NUM_WALKERS=4;
    var walkerDefs=[
      {name:'Alice',color:'#33ff33',stride:0.72,speed:1.1,freq:2.3,bodyH:58,legLen:30},
      {name:'Bob',color:'#ff6633',stride:0.95,speed:0.85,freq:1.7,bodyH:66,legLen:35},
      {name:'Charlie',color:'#6699ff',stride:0.62,speed:1.4,freq:3.0,bodyH:52,legLen:26},
      {name:'Dana',color:'#ff33cc',stride:0.80,speed:1.0,freq:2.0,bodyH:56,legLen:28}
    ];
    var activeWalker=0,phase=0,matchConf=0,identified=false;
    var csiBuffer=new Float32Array(W);
    var spectrogramRows=[];
    var MAX_SPEC_ROWS=120;

    /* --- WiFi router positions --- */
    var routers=[{x:80,y:90},{x:W-80,y:90},{x:80,y:H-60},{x:W-80,y:H-60}];

    /* --- init particles for CSI field --- */
    for(var i=0;i<60;i++){
      particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*0.8,vy:(Math.random()-.5)*0.8,life:Math.random(),size:1+Math.random()*2});
    }

    /* --- floor grid lines --- */
    for(var gx=0;gx<W;gx+=40)floorGrid.push({x1:gx,y1:H*0.55,x2:gx+20,y2:H*0.95});

    /* --- helper: draw stick figure --- */
    function drawWalker(cx,cy,w,ph,scale){
      var s=scale||1;
      var legSwing=Math.sin(ph)*w.legLen*s;
      var armSwing=Math.sin(ph+Math.PI)*12*s;
      var headR=7*s;
      var bodyLen=w.bodyH*s*0.4;
      ctx.strokeStyle=w.color;ctx.lineWidth=2.5*s;ctx.lineCap='round';
      // head
      ctx.beginPath();ctx.arc(cx,cy-bodyLen-headR,headR,0,Math.PI*2);ctx.stroke();
      // body
      ctx.beginPath();ctx.moveTo(cx,cy-bodyLen);ctx.lineTo(cx,cy);ctx.stroke();
      // legs
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-legSwing,cy+w.legLen*s);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+legSwing,cy+w.legLen*s);ctx.stroke();
      // arms
      ctx.beginPath();ctx.moveTo(cx,cy-bodyLen*0.7);ctx.lineTo(cx-armSwing-10*s,cy-bodyLen*0.3);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy-bodyLen*0.7);ctx.lineTo(cx+armSwing+10*s,cy-bodyLen*0.3);ctx.stroke();
      // name tag
      ctx.fillStyle=w.color;ctx.font=(10*s)+'px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(w.name,cx,cy+w.legLen*s+14*s);ctx.textAlign='left';
    }

    /* --- helper: heatmap color --- */
    function heatColor(v){
      var r=Math.min(255,Math.max(0,v*3*255))|0;
      var g=Math.min(255,Math.max(0,(v-0.3)*3*255))|0;
      var b=Math.min(255,Math.max(0,(1-v)*180))|0;
      return 'rgb('+r+','+g+','+b+')';
    }

    /* --- helper: draw WiFi rings --- */
    function drawRouter(rx,ry,strength){
      for(var r=0;r<3;r++){
        var rad=12+r*14+Math.sin(t*3+r)*4;
        ctx.beginPath();ctx.arc(rx,ry,rad,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,255,200,'+(0.15-r*0.04)*strength+')';
        ctx.lineWidth=1;ctx.stroke();
      }
      ctx.fillStyle='rgba(0,255,200,0.6)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('AP',rx-6,ry+3);
    }

    /* --- helper: generate CSI value --- */
    function genCSI(w,ph){
      var step=Math.sin(ph)*w.stride;
      var harmonic=Math.sin(ph*2)*0.3+Math.sin(ph*3)*0.15;
      var noise=(Math.random()-0.5)*0.15;
      return step+harmonic+noise;
    }

    /* --- main animation --- */
    function frame(){
      /* fade background */
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      var w=walkerDefs[activeWalker];
      phase+=0.016*w.speed*4;

      /* ---- SECTION 1: Top — CSI Waveform ---- */
      var csiVal=genCSI(w,phase);
      /* shift buffer */
      for(var i=0;i<W-1;i++)csiBuffer[i]=csiBuffer[i+1];
      csiBuffer[W-1]=csiVal;

      /* draw CSI trace */
      ctx.save();ctx.beginPath();ctx.rect(0,0,W,H*0.28);ctx.clip();
      ctx.fillStyle='rgba(6,6,16,0.35)';ctx.fillRect(0,0,W,H*0.28);
      ctx.beginPath();ctx.strokeStyle=w.color;ctx.lineWidth=1.8;
      for(var i=0;i<W;i++){
        var y=H*0.14-csiBuffer[i]*H*0.08;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      /* glow */
      ctx.strokeStyle=w.color.replace(')',',0.25)').replace('rgb','rgba');
      ctx.lineWidth=5;ctx.beginPath();
      for(var i=0;i<W;i++){
        var y=H*0.14-csiBuffer[i]*H*0.08;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      ctx.restore();

      /* labels */
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('WiFi CSI AMPLITUDE  |  CHANNEL STATE INFORMATION',10,14);
      ctx.fillText('TIME \u2192',W-60,H*0.27);

      /* ---- SECTION 2: Middle — Spectrogram ---- */
      var specY0=H*0.29,specH=H*0.22;
      /* build spectrum row from CSI */
      var specRow=[];
      for(var b=0;b<64;b++){
        var freq=b/64*w.freq*6;
        var amp=0;
        for(var h=1;h<=5;h++){
          var hf=w.freq*h;
          var diff=Math.abs(freq-hf);
          amp+=Math.exp(-diff*diff/2)/(h*0.7);
        }
        amp+=Math.random()*0.08;
        specRow.push(Math.min(1,amp*0.45));
      }
      spectrogramRows.push(specRow);
      if(spectrogramRows.length>MAX_SPEC_ROWS)spectrogramRows.shift();

      /* draw spectrogram */
      var cellW=W/64, cellH=specH/MAX_SPEC_ROWS;
      for(var row=0;row<spectrogramRows.length;row++){
        for(var col=0;col<64;col++){
          ctx.fillStyle=heatColor(spectrogramRows[row][col]);
          ctx.fillRect(col*cellW,specY0+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('GAIT SPECTROGRAM',10,specY0+12);
      ctx.fillText('FREQ \u2192',W-55,specY0+12);

      /* ---- SECTION 3: Bottom-left — Walking Scene ---- */
      var sceneX0=0,sceneY0=H*0.54,sceneW=W*0.55,sceneH=H*0.46;

      /* floor grid */
      ctx.strokeStyle='rgba(100,200,255,0.06)';ctx.lineWidth=0.5;
      for(var gx=sceneX0;gx<sceneX0+sceneW;gx+=30){
        ctx.beginPath();ctx.moveTo(gx,sceneY0+sceneH*0.3);ctx.lineTo(gx,sceneY0+sceneH);ctx.stroke();
      }
      for(var gy=sceneY0+sceneH*0.3;gy<sceneY0+sceneH;gy+=20){
        ctx.beginPath();ctx.moveTo(sceneX0,gy);ctx.lineTo(sceneX0+sceneW,gy);ctx.stroke();
      }

      /* WiFi routers in scene */
      drawRouter(sceneX0+40,sceneY0+20,0.8);
      drawRouter(sceneX0+sceneW-40,sceneY0+20,0.8);

      /* CSI field particles */
      ctx.globalAlpha=0.25;
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        p.x+=p.vx+Math.sin(t+i)*0.3;p.y+=p.vy+Math.cos(t+i*0.7)*0.2;
        if(p.x<sceneX0)p.x=sceneX0+sceneW;
        if(p.x>sceneX0+sceneW)p.x=sceneX0;
        if(p.y<sceneY0)p.y=sceneY0+sceneH;
        if(p.y>sceneY0+sceneH)p.y=sceneY0;
        p.life=0.3+Math.sin(t*2+i)*0.3;
        ctx.fillStyle=w.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);
      }
      ctx.globalAlpha=1;

      /* draw active walker in center */
      var wcx=sceneX0+sceneW*0.5+Math.sin(t*w.speed)*40;
      var wcy=sceneY0+sceneH*0.6;
      drawWalker(wcx,wcy,w,phase,1.2);

      /* draw footprint trail */
      ctx.fillStyle=w.color+'22';
      for(var f=0;f<8;f++){
        var fx=wcx-80+f*22;
        var fy=wcy+w.legLen*1.2+4+Math.sin(f*Math.PI)*3;
        ctx.beginPath();ctx.ellipse(fx,fy,5,2.5,0,0,Math.PI*2);ctx.fill();
      }

      /* ---- SECTION 4: Bottom-right — Gait Signature Panel ---- */
      var panelX=W*0.57,panelY=H*0.54,panelW=W*0.42,panelH=H*0.44;
      ctx.fillStyle='rgba(0,0,0,0.45)';
      ctx.fillRect(panelX,panelY,panelW,panelH);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
      ctx.strokeRect(panelX,panelY,panelW,panelH);

      ctx.fillStyle='#fff';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('GAIT DATABASE',panelX+10,panelY+18);

      /* walker profiles */
      for(var wi=0;wi<walkerDefs.length;wi++){
        var wd=walkerDefs[wi];
        var rowY=panelY+35+wi*42;
        var isActive=wi===activeWalker;

        /* highlight active */
        if(isActive){
          ctx.fillStyle=wd.color+'15';
          ctx.fillRect(panelX+4,rowY-10,panelW-8,38);
          ctx.strokeStyle=wd.color+'55';ctx.lineWidth=1;
          ctx.strokeRect(panelX+4,rowY-10,panelW-8,38);
        }

        /* color dot */
        ctx.fillStyle=wd.color;ctx.beginPath();ctx.arc(panelX+18,rowY+4,5,0,Math.PI*2);ctx.fill();

        /* name and stats */
        ctx.fillStyle=isActive?'#fff':'rgba(255,255,255,0.45)';ctx.font='10px Orbitron,monospace';
        ctx.fillText(wd.name,panelX+30,rowY+7);
        ctx.fillStyle=isActive?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
        ctx.fillText('stride='+wd.stride.toFixed(2)+'m  spd='+wd.speed.toFixed(1)+'m/s  f='+wd.freq.toFixed(1)+'Hz',panelX+30,rowY+20);

        /* mini gait waveform */
        ctx.beginPath();ctx.strokeStyle=isActive?wd.color:wd.color+'44';ctx.lineWidth=1;
        for(var mx=0;mx<60;mx++){
          var mv=Math.sin(mx*0.15*wd.freq)*6+Math.sin(mx*0.3*wd.freq)*2;
          var my=rowY+4+mv;
          if(mx===0)ctx.moveTo(panelX+panelW-75+mx,my);else ctx.lineTo(panelX+panelW-75+mx,my);
        }
        ctx.stroke();
      }

      /* confidence meter */
      matchConf+=(identified?95+Math.sin(t*2)*3:0-matchConf)*0.03;
      var confY=panelY+panelH-30;
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('MATCH CONFIDENCE',panelX+10,confY);
      ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(panelX+140,confY-10,panelW-155,12);
      var confW=(panelW-155)*matchConf/100;
      var confColor=matchConf>80?'#33ff33':matchConf>50?'#ffcc00':'#ff3333';
      ctx.fillStyle=confColor;ctx.fillRect(panelX+140,confY-10,confW,12);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText(Math.round(matchConf)+'%',panelX+panelW-35,confY);

      /* ---- HUD elements ---- */
      /* border frame */
      ctx.strokeStyle='rgba(0,255,200,0.08)';ctx.lineWidth=1;
      ctx.strokeRect(1,1,W-2,H-2);
      /* corner decorations */
      var cl=20;ctx.strokeStyle='rgba(0,255,200,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });

      /* scanning indicator */
      ctx.fillStyle='rgba(0,255,100,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('LIVE',W-55,17);

      /* divider lines */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,H*0.28);ctx.lineTo(W,H*0.28);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,H*0.53);ctx.lineTo(W,H*0.53);ctx.stroke();
      ctx.beginPath();ctx.moveTo(W*0.56,H*0.53);ctx.lineTo(W*0.56,H);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* --- controls --- */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      /* click on walker profile to switch */
      for(var wi=0;wi<walkerDefs.length;wi++){
        var rowY=H*0.54+35+wi*42;
        if(mx>W*0.57&&mx<W&&my>rowY-10&&my<rowY+30){
          activeWalker=wi;identified=false;matchConf=0;
          spectrogramRows=[];
          break;
        }
      }
      /* click on confidence area to identify */
      if(my>H*0.54+H*0.44-35){
        identified=!identified;
      }
    });

    /* auto-cycle walkers */
    setInterval(function(){
      if(!identified){
        activeWalker=(activeWalker+1)%walkerDefs.length;
        spectrogramRows=[];
      }
    },8000);

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootGaitViz);
  else setTimeout(bootGaitViz,200);
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
