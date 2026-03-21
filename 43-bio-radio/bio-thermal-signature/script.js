/**
 * Workshop DIY — Bio Thermal Signature v1.0
 * Detect humans through walls via thermal RF
 */
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
    ...LANG_BASE.en,title:'Bio Thermal Signature',subtitle:'See through walls with thermal RF',disconnected:'Disconnected',connected:'Connected',mainSection:'Thermal Signature \u2014 Through-Wall Detection',mainDesc:'Detect human thermal signatures through walls using RF',ready:'\ud83c\udf21 Thermal Scanner ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Attach Sensors',step1Desc:'Place biosensors on the body to measure physiological signals. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Capture Biosignal',step2Desc:'The sensor captures real-time biological data like heart rate or muscle activity.',step3Title:'Process & Modulate',step3Desc:'Biosignal data is processed and converted into a radio-compatible format. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Transmit & Decode',step4Desc:'The bio-encoded signal is transmitted wirelessly and decoded at the receiver. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Bio Thermal Signature?',faq_a1:'Thermal Signature is an interactive simulation that demonstrates bioelectronics concepts. Detect human thermal signatures through walls using RF. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real biomedical signals principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Thermal Signature! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Thermal Signature! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Place biosensors on the body to measure physiologi Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Thermal Signature?',wiki_concept:'Bio Thermal Signature is a technique used in biomedical signals. Detect human thermal signatures through walls using RF. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Place biosensors on the body to measure physiological signals. Second: The sensor captures real-time biological data like heart rate or muscle activity. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Thermal Signature has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Thermal Signature: Detect human thermal signatures through walls using RF. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Attach Sensors through Capture Biosignal to Process & Modulate and Transmit & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Thermal Signature builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Thermal Signature',
    wiki_math: 'The mathematics behind Thermal Signature: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
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
    gloss2_term: 'Bandwidth',
    gloss2_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Thermal Signature demonstrates key principles from bioelectronics. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'phys-em-drive-simulator',related1_desc:'',related1_path:'../../47-impossible-physics/phys-em-drive-simulator/index.html',related2_name:'Acoustic Fence',related2_desc:'Emit ultrasonic tone, detect Doppler shifts from movement',related2_path:'../../44-acoustic-warfare/sonic-acoustic-fence/index.html',related3_name:'Dead Drop — BLE Message Transfer',related3_desc:'Encrypt and exchange secret messages via BLE simulation',related3_path:'../../44-acoustic-warfare/sonic-acoustic-covert-channel/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Sweat Crypto \\u2014 Bio-Chemical Key Generation',pathPrev_path:'../../43-bio-radio/bio-sweat-sensor-crypto/index.html',pathNext_name:'Voice RF \\u2014 Harmonic Authentication',pathNext_path:'../../43-bio-radio/bio-voice-rf-fingerprint/index.html',
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is machine learning?',quiz_q1a:'Programming robots',quiz_q1b:'Systems that learn from data',quiz_q1c:'Manual computation',quiz_q1d:'Hardware design',quiz_q1_answer:'1',quiz_q2:'What does AI stand for?',quiz_q2a:'Automated Input',quiz_q2b:'Artificial Intelligence',quiz_q2c:'Analog Interface',quiz_q2d:'Active Integration',quiz_q2_answer:'1',quiz_q3:'What does AM stand for in radio?',quiz_q3a:'Audio Modulation',quiz_q3b:'Amplitude Modulation',quiz_q3c:'Analog Modulation',quiz_q3d:'Active Modulation',quiz_q3_answer:'1',quiz_q4:'What is a neural network?',quiz_q4a:'Physical wires',quiz_q4b:'Computing system inspired by biological neurons',quiz_q4c:'Social network',quiz_q4d:'Radio network',quiz_q4_answer:'1',quiz_q5:'What is the speed of radio waves in a vacuum?',quiz_q5a:'Speed of sound',quiz_q5b:'Speed of light',quiz_q5c:'Half the speed of light',quiz_q5d:'Twice the speed of light',quiz_q5_answer:'1'},
  fr:{title:'Bio Signature Thermique',subtitle:'Voir \u00e0 travers les murs avec RF thermique',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Signature Thermique \u2014 D\u00e9tection Murale',mainDesc:'D\u00e9tecter les signatures thermiques humaines',ready:'\ud83c\udf21 Scanner thermique pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Fixer les capteurs',step1Desc:'Place les biocapteurs sur le corps pour mesurer les signaux physiologiques. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Capturer le biosignal',step2Desc:'Le capteur enregistre les données biologiques en temps réel.',step3Title:'Traiter et moduler',step3Desc:'Les données sont traitées et converties en format radio compatible. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Émettre et décoder',step4Desc:'Le signal bio-encodé est transmis sans fil et décodé au récepteur. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Thermal Signature est une simulation interactive qui démontre les concepts de bioélectronique. Detect human thermal signatures through walls using RF. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Muscle Telegraph and Bio Skin Galvanic Key ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Thermal Signature s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Thermal Signature',
    wiki_math: 'Les mathématiques derrière Thermal Signature : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
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
    gloss2_term: 'Bandwidth',
    gloss2_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Thermal Signature démontre les principes clés de bioélectronique. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'phys-em-drive-simulator',related1_desc:'',related1_path:'../../47-impossible-physics/phys-em-drive-simulator/index.html',related2_name:'Cloture Acoustique',related2_desc:'Emettre un ultrason, detecter les mouvements par effet Doppler',related2_path:'../../44-acoustic-warfare/sonic-acoustic-fence/index.html',related3_name:'Dead Drop — Transfert BLE',related3_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related3_path:'../../44-acoustic-warfare/sonic-acoustic-covert-channel/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Crypto Sueur \\u2014 G\\u00e9n\\u00e9ration de Cl\\u00e9 Biochimique',pathPrev_path:'../../43-bio-radio/bio-sweat-sensor-crypto/index.html',pathNext_name:'Voix RF \\u2014 Authentification Harmonique',pathNext_path:'../../43-bio-radio/bio-voice-rf-fingerprint/index.html',
    printBtn: '🖨️ Imprimer'},
  ar:{title:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629',subtitle:'\u0631\u0624\u064a\u0629 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646 \u0628\u0627\u0644\u062d\u0631\u0627\u0631\u0629 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u2014 \u0643\u0634\u0641 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646',mainDesc:'\u0643\u0634\u0641 \u0627\u0644\u0628\u0635\u0645\u0627\u062a \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u0627\u0644\u0628\u0634\u0631\u064a\u0629',ready:'\ud83c\udf21 \u0627\u0644\u0645\u0627\u0633\u062d \u0627\u0644\u062d\u0631\u0627\u0631\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',step1Title:'تثبيت المستشعرات',step1Desc:'ضع المستشعرات الحيوية على الجسم لقياس الإشارات الفسيولوجية. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'التقاط الإشارة الحيوية',step2Desc:'يلتقط المستشعر البيانات البيولوجية في الوقت الفعلي.',step3Title:'معالجة وتعديل',step3Desc:'تتم معالجة البيانات وتحويلها إلى صيغة متوافقة مع الراديو. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'إرسال وفك تشفير',step4Desc:'يتم بث الإشارة المشفرة حيوياً لاسلكياً وفك تشفيرها. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Thermal Signature هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. Detect human thermal signatures through walls using RF. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Muscle Telegraph and Bio Skin Galvanic Key! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Thermal Signature على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Thermal Signature',
    wiki_math: 'الرياضيات وراء Thermal Signature: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
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
    gloss2_term: 'Bandwidth',
    gloss2_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Thermal Signature يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'phys-em-drive-simulator',related1_desc:'',related1_path:'../../47-impossible-physics/phys-em-drive-simulator/index.html',related2_name:'السياج الصوتي',related2_desc:'إصدار نغمة فوق صوتية وكشف الحركة بتأثير دوبلر',related2_path:'../../44-acoustic-warfare/sonic-acoustic-fence/index.html',related3_name:'Dead Drop — نقل رسائل BLE',related3_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related3_path:'../../44-acoustic-warfare/sonic-acoustic-covert-channel/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'\\u062a\\u0634\\u0641\\u064a\\u0631 \\u0627\\u0644\\u0639\\u0631\\u0642 \\u2014 \\u062a\\u0648\\u0644\\u064a\\u062f \\u0645\\u0641\\u062a\\u0627\\u062d \\u0643\\u064a\\u0645\\u064a\\u0627\\u0626\\u064a',pathPrev_path:'../../43-bio-radio/bio-sweat-sensor-crypto/index.html',pathNext_name:'\\u0628\\u0635\\u0645\\u0629 \\u0635\\u0648\\u062a\\u064a\\u0629 RF \\u2014 \\u0645\\u0635\\u0627\\u062f\\u0642\\u0629',pathNext_path:'../../43-bio-radio/bio-voice-rf-fingerprint/index.html',
    printBtn: '🖨️ طباعة'}
};
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}


function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


let scanning=false,showWall=true,people=[],ambientTemp=22.4;

function initApp(){
  const canvas=$('thermalCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=340;
  const W=canvas.width,H=canvas.height;let t=0;

  function addPerson(){
    people.push({x:W*.6+Math.random()*W*.3,y:H*.2+Math.random()*H*.6,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.3,temp:36.5+Math.random()*1.5,size:20+Math.random()*15});
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,20,.15)';ctx.fillRect(0,0,W,H);t+=.016;
    if(!scanning){requestAnimationFrame(frame);return}

    // Room background - thermal gradient
    for(let y=0;y<H;y+=8){for(let x=0;x<W;x+=8){
      let heat=ambientTemp+Math.sin(x*.01+t)*0.5+Math.sin(y*.01)*0.3;
      // Add heat from people
      people.forEach(p=>{
        const dx=x-p.x,dy=y-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<p.size*3){
          let contribution=(p.temp-ambientTemp)*Math.exp(-dist*dist/(p.size*p.size*2));
          if(showWall&&x<W*.45)contribution*=.15;// Wall attenuates
          heat+=contribution;
        }
      });
      const norm=(heat-18)/25;// Normalize 18-43C range
      const r=Math.min(255,Math.max(0,norm*512));
      const g=Math.min(255,Math.max(0,(norm-.3)*512));
      const b=Math.min(255,Math.max(0,(1-norm)*200));
      ctx.fillStyle=`rgba(${r|0},${g|0},${b|0},.8)`;
      ctx.fillRect(x,y,8,8);
    }}

    // Wall
    if(showWall){
      ctx.fillStyle='rgba(100,100,120,.6)';ctx.fillRect(W*.42,0,W*.06,H);
      ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;ctx.strokeRect(W*.42,0,W*.06,H);
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='bold 11px Orbitron';
      ctx.save();ctx.translate(W*.44,H/2);ctx.rotate(-Math.PI/2);ctx.fillText('WALL',0,0);ctx.restore();
    }

    // Move people
    people.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<W*.5||p.x>W-20)p.vx*=-1;
      if(p.y<20||p.y>H-20)p.vy*=-1;
      // Person marker
      ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,0,.6)';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px Orbitron';
      ctx.fillText(`${p.temp.toFixed(1)}\u00b0C`,p.x+8,p.y-5);
    });

    // Sensor label
    ctx.fillStyle='rgba(0,255,150,.5)';ctx.font='10px Orbitron';ctx.fillText('SENSOR',10,20);
    ctx.fillText('TARGET ZONE',W*.6,20);

    // Update stats
    const sh=$('statHumans'),sd=$('statDist'),sc=$('statConf');
    if(sh)sh.textContent=people.length;
    if(sd)sd.textContent=(showWall?5:2).toFixed(0);
    if(sc)sc.textContent=Math.round(showWall?65+Math.random()*10:92+Math.random()*5);

    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),addBtn=$('addPersonBtn'),moveBtn=$('moveBtn'),wallBtn=$('wallBtn');
  if(startBtn)startBtn.onclick=()=>{scanning=!scanning;setStatus(scanning);log(scanning?'Thermal scan started':'Scan stopped','info')};
  if(addBtn)addBtn.onclick=()=>{addPerson();log(`Person added (total: ${people.length})`,'success');showToast(`${people.length} humans detected`,1200)};
  if(moveBtn)moveBtn.onclick=()=>{people.forEach(p=>{p.vx=(Math.random()-.5)*2;p.vy=(Math.random()-.5)*1.5});log('People moving','info')};
  if(wallBtn)wallBtn.onclick=()=>{showWall=!showWall;log(showWall?'Wall ON \u2014 signal attenuated':'Wall removed \u2014 clear view','info')};
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ THERMAL SIGNATURE CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootThermalViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,80,0,.15);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- thermal targets --- */
    var targets=[
      {x:W*0.65,y:H*0.35,vx:0.4,vy:0.2,temp:37.2,size:22,label:'Person A'},
      {x:W*0.75,y:H*0.6,vx:-0.3,vy:0.15,temp:36.8,size:18,label:'Person B'}
    ];
    var ambientT=22.0,wallX=W*0.42,wallW=W*0.05;
    var showWallV=true,scanActive=true;
    var heatMap=[];var hmW=100,hmH=65;
    var timeHistory=[];var MAX_HISTORY=200;
    var rfPulses=[];

    /* init heatmap */
    for(var i=0;i<hmW*hmH;i++)heatMap.push(ambientT);

    /* thermal palette: blue->cyan->green->yellow->red->white */
    function thermalColor(temp){
      var n=(temp-15)/30;// 15-45C range
      n=Math.max(0,Math.min(1,n));
      var r,g,b;
      if(n<0.25){r=0;g=Math.round(n*4*200);b=Math.round(150+n*4*105);}
      else if(n<0.5){var t2=(n-0.25)*4;r=Math.round(t2*200);g=200+Math.round(t2*55);b=Math.round(255-t2*200);}
      else if(n<0.75){var t2=(n-0.5)*4;r=200+Math.round(t2*55);g=Math.round(255-t2*100);b=Math.round(55-t2*55);}
      else{var t2=(n-0.75)*4;r=255;g=Math.round(155+t2*100);b=Math.round(t2*200);}
      return 'rgb('+r+','+g+','+b+')';
    }

    /* --- RF pulse for through-wall detection --- */
    function emitPulse(){
      rfPulses.push({x:30,y:H*0.38,r:0,maxR:W*0.8,speed:4,alpha:0.4});
    }

    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.15)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* ---- SECTION 1: Top — Through-wall thermal view ---- */
      var viewH=H*0.6;

      /* move targets */
      targets.forEach(function(tgt){
        tgt.x+=tgt.vx;tgt.y+=tgt.vy;
        if(tgt.x<W*0.5||tgt.x>W-25){tgt.vx*=-1;}
        if(tgt.y<30||tgt.y>viewH-25){tgt.vy*=-1;}
        tgt.temp=36.5+Math.sin(t+tgt.x*0.01)*0.8;
      });

      /* compute heatmap */
      var cellW=W/hmW,cellH=viewH/hmH;
      for(var hy=0;hy<hmH;hy++){
        for(var hx=0;hx<hmW;hx++){
          var px=hx*cellW+cellW/2,py=hy*cellH+cellH/2;
          var heat=ambientT+Math.sin(px*0.005+t)*0.3+Math.sin(py*0.007)*0.2;
          /* heat from targets */
          targets.forEach(function(tgt){
            var dx=px-tgt.x,dy=py-tgt.y;
            var dist=Math.sqrt(dx*dx+dy*dy);
            var contribution=(tgt.temp-ambientT)*Math.exp(-dist*dist/(tgt.size*tgt.size*3));
            /* wall attenuation */
            if(showWallV&&px<wallX)contribution*=0.12;
            heat+=contribution;
          });
          heatMap[hy*hmW+hx]=heat;
        }
      }

      /* draw heatmap */
      for(var hy=0;hy<hmH;hy++){
        for(var hx=0;hx<hmW;hx++){
          ctx.fillStyle=thermalColor(heatMap[hy*hmW+hx]);
          ctx.fillRect(hx*cellW,hy*cellH,cellW+0.5,cellH+0.5);
        }
      }

      /* wall */
      if(showWallV){
        ctx.fillStyle='rgba(80,80,100,0.55)';ctx.fillRect(wallX,0,wallW,viewH);
        ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.strokeRect(wallX,0,wallW,viewH);
        ctx.save();ctx.translate(wallX+wallW/2,viewH/2);ctx.rotate(-Math.PI/2);
        ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='bold 10px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText('WALL',0,0);ctx.restore();ctx.textAlign='left';
      }

      /* target markers */
      targets.forEach(function(tgt){
        ctx.strokeStyle='rgba(255,255,0,0.6)';ctx.lineWidth=1.5;
        /* crosshair */
        ctx.beginPath();ctx.moveTo(tgt.x-15,tgt.y);ctx.lineTo(tgt.x-8,tgt.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x+8,tgt.y);ctx.lineTo(tgt.x+15,tgt.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x,tgt.y-15);ctx.lineTo(tgt.x,tgt.y-8);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x,tgt.y+8);ctx.lineTo(tgt.x,tgt.y+15);ctx.stroke();
        /* ring */
        ctx.beginPath();ctx.arc(tgt.x,tgt.y,12,0,Math.PI*2);ctx.stroke();
        /* label */
        ctx.fillStyle='rgba(255,255,0,0.8)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(tgt.label+' '+tgt.temp.toFixed(1)+'\u00b0C',tgt.x+18,tgt.y-8);
      });

      /* RF pulses */
      if(scanActive&&Math.random()<0.03)emitPulse();
      for(var pi=rfPulses.length-1;pi>=0;pi--){
        var p=rfPulses[pi];p.r+=p.speed;p.alpha-=0.004;
        if(p.alpha<=0||p.r>p.maxR){rfPulses.splice(pi,1);continue;}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,-.4,.4);
        ctx.strokeStyle='rgba(0,255,200,'+Math.max(0,p.alpha)+')';ctx.lineWidth=1.5;ctx.stroke();
      }

      /* sensor icon */
      ctx.fillStyle='rgba(0,255,200,0.5)';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('RF SENSOR',8,18);
      ctx.strokeStyle='rgba(0,255,200,0.4)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(25,35,8,0,Math.PI*2);ctx.stroke();
      for(var a=0;a<3;a++){
        ctx.beginPath();ctx.arc(25,35,14+a*7,-0.5,0.5);ctx.stroke();
      }

      /* temperature scale bar */
      var scaleX=W-30,scaleY=20,scaleH=viewH-40;
      for(var sy=0;sy<scaleH;sy++){
        var stmp=45-(sy/scaleH)*30;
        ctx.fillStyle=thermalColor(stmp);ctx.fillRect(scaleX,scaleY+sy,18,1);
      }
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.strokeRect(scaleX,scaleY,18,scaleH);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('45\u00b0C',scaleX-25,scaleY+8);ctx.fillText('30\u00b0C',scaleX-25,scaleY+scaleH/2);ctx.fillText('15\u00b0C',scaleX-25,scaleY+scaleH);

      /* zone labels */
      ctx.fillStyle='rgba(0,255,200,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('SENSOR SIDE',10,viewH-10);
      ctx.fillText('TARGET ZONE',W*0.65,viewH-10);

      /* ---- SECTION 2: Bottom-left — Temperature history ---- */
      var histX=10,histY=viewH+15,histW=W*0.55,histH=H-viewH-30;

      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(histX,histY,histW,histH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(histX,histY,histW,histH);

      /* push new data */
      var histEntry={t:t};
      targets.forEach(function(tgt,i){histEntry['t'+i]=tgt.temp;});
      histEntry.ambient=ambientT;
      timeHistory.push(histEntry);
      if(timeHistory.length>MAX_HISTORY)timeHistory.shift();

      /* draw temp traces */
      var colors=['#ff6633','#6699ff','#ffcc00'];
      targets.forEach(function(tgt,ti){
        ctx.beginPath();ctx.strokeStyle=colors[ti]||'#fff';ctx.lineWidth=1.5;
        for(var i=0;i<timeHistory.length;i++){
          var x=histX+5+(i/MAX_HISTORY)*histW*0.95;
          var v=timeHistory[i]['t'+ti]||ambientT;
          var y=histY+histH-(v-15)/30*histH;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      });

      /* ambient line */
      var ambY=histY+histH-(ambientT-15)/30*histH;
      ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.setLineDash([3,3]);ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(histX,ambY);ctx.lineTo(histX+histW,ambY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('AMBIENT '+ambientT.toFixed(1)+'\u00b0C',histX+histW-100,ambY-3);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('TEMPERATURE HISTORY',histX+5,histY+12);
      /* legend */
      targets.forEach(function(tgt,i){
        ctx.fillStyle=colors[i];ctx.fillRect(histX+5+i*100,histY+histH-14,10,3);
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px Orbitron,monospace';
        ctx.fillText(tgt.label,histX+18+i*100,histY+histH-10);
      });

      /* ---- SECTION 3: Bottom-right — Detection stats ---- */
      var statX=histX+histW+15,statY=histY,statW=W-statX-15,statH=histH;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(statX,statY,statW,statH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(statX,statY,statW,statH);

      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('DETECTION STATUS',statX+10,statY+16);

      /* detection confidence */
      var conf=showWallV?(62+Math.sin(t*2)*8):(94+Math.sin(t*3)*3);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('Targets: '+targets.length,statX+10,statY+35);
      ctx.fillText('Wall: '+(showWallV?'ACTIVE':'REMOVED'),statX+10,statY+50);
      ctx.fillText('Confidence: '+conf.toFixed(0)+'%',statX+10,statY+65);
      ctx.fillText('Range: '+(showWallV?'5m':'2m'),statX+10,statY+80);
      ctx.fillText('Ambient: '+ambientT.toFixed(1)+'\u00b0C',statX+10,statY+95);

      /* confidence bar */
      var barY=statY+110;
      ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(statX+10,barY,statW-20,14);
      var confColor=conf>80?'#33ff33':conf>60?'#ffcc00':'#ff3333';
      ctx.fillStyle=confColor;ctx.fillRect(statX+10,barY,(statW-20)*conf/100,14);
      ctx.fillStyle='#fff';ctx.font='bold 8px Orbitron,monospace';
      ctx.fillText(conf.toFixed(0)+'%',statX+statW/2-10,barY+11);

      /* target temp readouts */
      targets.forEach(function(tgt,i){
        var ty=barY+25+i*30;
        ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(statX+18,ty+5,4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(tgt.label,statX+28,ty+3);
        ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron,monospace';
        ctx.fillText(tgt.temp.toFixed(1)+'\u00b0C',statX+28,ty+18);
      });

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(255,80,0,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,80,0,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      /* live dot */
      ctx.fillStyle='rgba(255,80,0,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('THERMAL',W-70,17);

      /* dividers */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,viewH+8);ctx.lineTo(W,viewH+8);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to add target */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      if(my<H*0.6&&mx>W*0.5){
        targets.push({x:mx,y:my,vx:(Math.random()-0.5)*0.8,vy:(Math.random()-0.5)*0.5,temp:36.5+Math.random()*1.5,size:18+Math.random()*8,label:'Person '+(targets.length+1)});
      }
      /* click wall to toggle */
      if(mx>wallX-10&&mx<wallX+wallW+10&&my<H*0.6){showWallV=!showWallV;}
    });

    /* auto-emit RF */
    setInterval(emitPulse,600);

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootThermalViz);
  else setTimeout(bootThermalViz,200);
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
