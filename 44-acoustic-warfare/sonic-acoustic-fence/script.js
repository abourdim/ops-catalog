/**
 * Sonic Acoustic Fence — Workshop DIY v1.0
 * Ultrasonic Doppler perimeter detector
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx,analyser,micStream,freqArray,osc,gainNode;
let isArmed=false,animId=null,alertLevel=0,peakShift=0,intrusionCount=0;

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
    ...LANG_BASE.en,title:'Acoustic Fence',subtitle:'Ultrasonic Doppler Perimeter Detector',disconnected:'Idle',connected:'Armed',mainSection:'Acoustic Fence',mainDesc:'Emit ultrasonic tone, detect Doppler shifts from movement',sectionA:'Intrusion Events',sectionB:'Doppler Theory',arm:'Arm Fence',disarm:'Disarm',alertLevel:'Alert Level',dopplerShift:'Doppler Shift',fenceStatus:'Fence Status',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',filterAll:'All',soundEffects:'Sound effects',ready:'Acoustic Fence ready!',splashHint:'tap to skip',langChanged:'Language > English',themeChanged:'Theme >',armed:'Fence ARMED',disarmed:'Fence disarmed',intrusion:'INTRUSION DETECTED!',approaching:'APPROACHING',retreating:'RETREATING',secure:'SECURE',eventHint:'Motion events appear here.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Acoustic Fence?',faq_a1:'Acoustic Fence is an interactive simulation that demonstrates acoustic physics concepts. Emit ultrasonic tone, detect Doppler shifts from movement. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real acoustic science behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real acoustic science principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Keylogger. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Acoustic Fence! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Intrusion Events" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Acoustic Fence! This is like a science experiment on your computer. You get to control a real acoustic physics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Create a specific acoustic signal with precise fre Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Acoustic Fence?',wiki_concept:'Acoustic Fence is a technique used in acoustic science. Emit ultrasonic tone, detect Doppler shifts from movement. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Create a specific acoustic signal with precise frequency and amplitude. Second: The sound wave travels through air, walls, or other media to the target. The simulation runs these stages in real time, showing you intermediate results at each step. In real acoustic science, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Acoustic Fence has practical applications in acoustic science. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Acoustic Fence: Emit ultrasonic tone, detect Doppler shifts from movement. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Generate Sound through Propagate to Detect & Capture and Analyze & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Intrusion Events" and "Doppler Theory" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Physics',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Acoustic Fence builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Sonic Acoustic Fence',
    wiki_math: 'The mathematics behind Acoustic Fence: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced physics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to physics. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with physics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in physics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Physics carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'Resonance',
    gloss3_def: 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Acoustic Fence demonstrates key principles from acoustic physics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world physics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional physics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Cloture Acoustique',subtitle:'Detecteur Doppler Perimetrique',disconnected:'Inactif',connected:'Arme',mainSection:'Cloture Acoustique',mainDesc:'Emettre un ultrason, detecter les mouvements par effet Doppler',sectionA:'Evenements Intrusion',sectionB:'Theorie Doppler',arm:'Armer',disarm:'Desarmer',alertLevel:'Niveau Alerte',dopplerShift:'Decalage Doppler',fenceStatus:'Etat Cloture',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',filterAll:'Tout',soundEffects:'Effets sonores',ready:'Cloture acoustique prete!',splashHint:'appuyer pour passer',langChanged:'Langue > Francais',themeChanged:'Theme >',armed:'Cloture ARMEE',disarmed:'Cloture desarmee',intrusion:'INTRUSION DETECTEE!',approaching:'APPROCHE',retreating:'ELOIGNEMENT',secure:'SECURISE',eventHint:'Evenements de mouvement ici.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Acoustic Fence est une simulation interactive qui démontre les concepts de physique acoustique. Emit ultrasonic tone, detect Doppler shifts from movement. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais sound waves.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai acoustic science and attacks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sonic Whisper Network and Sonic Infrasound Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 Histoire de physique',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Acoustic Fence s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Sonic Acoustic Fence',
    wiki_math: 'Les mathématiques derrière Acoustic Fence : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de physique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour physique. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en physique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Physique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'Resonance',
    gloss3_def: 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Acoustic Fence démontre les principes clés de physique acoustique. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec physics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'السياج الصوتي',subtitle:'كاشف دوبلر المحيطي',disconnected:'خامل',connected:'مسلح',mainSection:'السياج الصوتي',mainDesc:'إصدار نغمة فوق صوتية وكشف الحركة بتأثير دوبلر',sectionA:'أحداث التسلل',sectionB:'نظرية دوبلر',arm:'تسليح',disarm:'إلغاء التسليح',alertLevel:'مستوى التنبيه',dopplerShift:'إزاحة دوبلر',fenceStatus:'حالة السياج',activityLog:'سجل النشاط',eventsMsg:'أحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'الإعدادات',language:'اللغة',help:'مساعدة',faq:'أسئلة',howto:'كيف',wiki:'ويكي',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'السياج الصوتي جاهز!',splashHint:'انقر للتخطي',langChanged:'اللغة > العربية',themeChanged:'المظهر >',armed:'السياج مسلح',disarmed:'السياج معطل',intrusion:'تسلل مكتشف!',approaching:'اقتراب',retreating:'ابتعاد',secure:'آمن',eventHint:'أحداث الحركة تظهر هنا.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Acoustic Fence هي محاكاة تفاعلية توضح مفاهيم الفيزياء الصوتية. Emit ultrasonic tone, detect Doppler shifts from movement. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج sound waves حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا acoustic science and attacks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sonic Whisper Network and Sonic Infrasound Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 تاريخ الفيزياء',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Acoustic Fence على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Sonic Acoustic Fence',
    wiki_math: 'الرياضيات وراء Acoustic Fence: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفيزياء المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفيزياء. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفيزياء: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفيزياء يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'Resonance',
    gloss3_def: 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Acoustic Fence يوضح المبادئ الأساسية في الفيزياء الصوتية. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـphysics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function showToast(m,ms=0){const e=$('toastIndicator'),t=$('toastMessage');if(e&&t){t.textContent=m;e.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const e=$('toastIndicator');if(e)e.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

/* ═══════ DOPPLER CANVAS ═══════ */
const canvas=$('dopplerCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let dopplerHistory=[];

function drawDoppler(){
  if(!ctx||!freqArray)return;
  analyser.getByteFrequencyData(freqArray);
  const toneFreq=parseInt($('toneSelect').value);
  const binHz=audioCtx.sampleRate/analyser.fftSize;
  const toneBin=Math.round(toneFreq/binHz);
  const searchRange=30;
  let maxVal=0,maxBin=toneBin;
  for(let i=Math.max(0,toneBin-searchRange);i<Math.min(freqArray.length,toneBin+searchRange);i++){
    if(freqArray[i]>maxVal){maxVal=freqArray[i];maxBin=i;}
  }
  const shift=(maxBin-toneBin)*binHz;
  const sensitivity=parseInt($('sensitivityRange').value);
  const threshold=15-sensitivity;
  dopplerHistory.push({shift,level:maxVal,time:Date.now()});
  if(dopplerHistory.length>canvas.width)dopplerHistory.shift();

  // Detect intrusion
  if(Math.abs(shift)>threshold&&maxVal>50){
    alertLevel=Math.min(100,alertLevel+5);
    if(alertLevel>60){
      $('alertText').textContent=T('intrusion');$('alertText').style.color='#ef4444';
      $('alertFill').style.background='#ef4444';
      if(alertLevel===65){intrusionCount++;addEvent(shift);log(T('intrusion'),'error');}
    }else{
      $('alertText').textContent=shift>0?T('approaching'):T('retreating');$('alertText').style.color='#f59e0b';$('alertFill').style.background='#f59e0b';
    }
  }else{alertLevel=Math.max(0,alertLevel-2);if(alertLevel<10){$('alertText').textContent=T('secure');$('alertText').style.color='#22c55e';$('alertFill').style.background='#22c55e';}}
  $('alertFill').style.width=alertLevel+'%';
  $('shiftValue').textContent=shift.toFixed(1)+' Hz';
  $('direction').textContent=Math.abs(shift)<threshold?'---':shift>0?'>>> APPROACHING':'<<< RETREATING';
  $('fenceInfo').innerHTML='Armed: '+toneFreq/1000+' kHz<br>Sensitivity: '+sensitivity+'/10<br>Intrusions: '+intrusionCount;

  // Draw
  ctx.fillStyle='rgba(10,10,26,0.08)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Center line
  ctx.strokeStyle='rgba(0,255,170,0.2)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,canvas.height/2);ctx.lineTo(canvas.width,canvas.height/2);ctx.stroke();ctx.setLineDash([]);
  // Doppler trace
  ctx.lineWidth=2;ctx.strokeStyle=alertLevel>60?'#ef4444':alertLevel>20?'#f59e0b':'#22c55e';ctx.beginPath();
  for(let i=0;i<dopplerHistory.length;i++){
    const y=canvas.height/2-dopplerHistory[i].shift*2;
    i===0?ctx.moveTo(i,y):ctx.lineTo(i,y);
  }
  ctx.stroke();
  // Level bars at right
  ctx.fillStyle='rgba(0,255,170,0.3)';
  for(let i=toneBin-searchRange;i<toneBin+searchRange;i++){
    const x=canvas.width-60+(i-(toneBin-searchRange));
    const h=freqArray[i]/255*canvas.height;
    ctx.fillRect(x,canvas.height-h,1,h);
  }
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px Orbitron';ctx.fillText('DOPPLER SHIFT',10,15);
  ctx.fillText('+Hz',canvas.width-75,15);ctx.fillText('-Hz',canvas.width-75,canvas.height-5);
}

function drawIdle(){
  if(!ctx)return;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(0,255,170,0.15)';ctx.font='13px Orbitron';ctx.textAlign='center';
  ctx.fillText('DOPPLER RADAR — Arm Fence to Start',canvas.width/2,canvas.height/2);ctx.textAlign='left';
}

function animate(){drawDoppler();animId=requestAnimationFrame(animate);}

function addEvent(shift){
  const el=$('eventLog');if(!el)return;const d=document.createElement('div');
  d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(239,68,68,.1);color:#ef4444;border-left:3px solid #ef4444;';
  d.textContent='['+new Date().toLocaleTimeString()+'] INTRUSION: Doppler shift '+shift.toFixed(1)+' Hz';
  el.appendChild(d);el.scrollTop=el.scrollHeight;
}

/* ═══════ ARM/DISARM ═══════ */
async function armFence(){
  if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const src=audioCtx.createMediaStreamSource(micStream);analyser=audioCtx.createAnalyser();analyser.fftSize=4096;
    src.connect(analyser);freqArray=new Uint8Array(analyser.frequencyBinCount);
    // Emit tone
    osc=audioCtx.createOscillator();gainNode=audioCtx.createGain();
    osc.connect(gainNode);gainNode.connect(audioCtx.destination);
    osc.frequency.value=parseInt($('toneSelect').value);osc.type='sine';gainNode.gain.value=0.3;osc.start();
    isArmed=true;setStatus(true);dopplerHistory=[];alertLevel=0;intrusionCount=0;
    animate();log(T('armed'),'success');
  }catch(e){log('Mic denied: '+e.message,'error');}
}
function disarmFence(){
  isArmed=false;setStatus(false);
  if(osc){try{osc.stop();}catch{}osc=null;}
  if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}
  if(animId){cancelAnimationFrame(animId);animId=null;}
  alertLevel=0;$('alertFill').style.width='0%';$('alertText').textContent=T('secure');$('alertText').style.color='#22c55e';
  log(T('disarmed'),'info');drawIdle();
}

function fillTheory(){const el=$('theoryInfo');if(!el)return;el.innerHTML='<b>Doppler Effect</b><br>When a sound source and observer move relative to each other, the observed frequency changes.<br><br><b>f_observed = f_source * (v + v_observer) / (v + v_source)</b><br><br>For our perimeter detector:<br>- We emit a constant ultrasonic tone<br>- The microphone picks up reflections<br>- Moving objects cause frequency shift in reflections<br>- Positive shift = object approaching<br>- Negative shift = object retreating<br><br><b>Applications:</b> Perimeter security, motion detection, speed measurement, medical ultrasound.';}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(dismissSplash,2500);
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);else setLanguage('en');}catch{setLanguage('en');}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  $('helpBtn').onclick=()=>{$('helpPanel').classList.toggle('open');$('helpOverlay').classList.toggle('active');};
  $('helpCloseBtn').onclick=$('helpOverlay').onclick=()=>{$('helpPanel').classList.remove('open');$('helpOverlay').classList.remove('active');};
  $('settingsBtn').onclick=()=>{$('settingsPanel').classList.toggle('open');$('settingsOverlay').classList.toggle('active');};
  $('settingsCloseBtn').onclick=$('settingsOverlay').onclick=()=>{$('settingsPanel').classList.remove('open');$('settingsOverlay').classList.remove('active');};
  $('logBtn').onclick=()=>$('logPanel').classList.toggle('open');$('logCloseBtn').onclick=()=>$('logPanel').classList.remove('open');
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');};});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();};});
  $('armBtn').onclick=armFence;$('disarmBtn').onclick=disarmFence;
  drawIdle();fillTheory();log(T('ready'),'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Acoustic Fence
   Animated ultrasonic perimeter with Doppler wave propagation,
   intrusion zones, and frequency-shift visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simAcousticFence';let cv,cx,W,H,af=null,t=0;
  const pulses=[];const intruders=[];const shiftHist=[];
  let fenceRadius=0,simIntrusions=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=280;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    fenceRadius=Math.min(W,H)*0.35;
  }

  class UltrasonicPulse{
    constructor(){this.r=20;this.maxR=fenceRadius+30;this.alpha=0.5;this.speed=1.8;}
    update(){this.r+=this.speed;this.alpha=0.5*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();cx.arc(W/2,H/2,this.r,0,Math.PI*2);
      cx.strokeStyle='rgba(0,255,170,'+this.alpha+')';cx.lineWidth=2;cx.stroke();
    }
  }

  class Intruder{
    constructor(){
      const angle=Math.random()*Math.PI*2;
      this.angle=angle;this.dist=fenceRadius+60;this.targetDist=40+Math.random()*60;
      this.speed=0.3+Math.random()*0.4;this.x=0;this.y=0;this.detected=false;
      this.life=300+Math.random()*200;this.age=0;this.dopplerShift=0;
    }
    update(){
      this.age++;
      if(this.dist>this.targetDist)this.dist-=this.speed;
      else{this.dist+=this.speed*0.5;this.targetDist=fenceRadius+60;}
      this.x=W/2+Math.cos(this.angle)*this.dist;
      this.y=H/2+Math.sin(this.angle)*this.dist;
      this.dopplerShift=this.dist>this.targetDist?this.speed*80:-this.speed*40;
      if(this.dist<fenceRadius&&!this.detected){this.detected=true;simIntrusions++;}
      return this.age<this.life;
    }
    draw(){
      const alpha=Math.min(1,(this.life-this.age)/40);
      cx.save();cx.globalAlpha=alpha;
      cx.beginPath();cx.arc(this.x,this.y,6,0,Math.PI*2);
      cx.fillStyle=this.detected?'rgba(239,68,68,0.6)':'rgba(245,158,11,0.5)';cx.fill();
      cx.strokeStyle=this.detected?'#ef4444':'#f59e0b';cx.lineWidth=1.5;cx.stroke();
      cx.font='9px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText('\u{1F6B6}',this.x,this.y);
      if(this.detected){
        cx.font='bold 7px monospace';cx.fillStyle='#ef4444';
        cx.fillText('ALERT',this.x,this.y-12);
      }
      cx.restore();
    }
  }

  function drawEmitter(){
    const pulse=4+Math.sin(t*3)*2;
    cx.save();cx.shadowColor='#00ffaa';cx.shadowBlur=pulse;
    cx.beginPath();cx.arc(W/2,H/2,18,0,Math.PI*2);
    cx.fillStyle='rgba(0,255,170,0.12)';cx.fill();
    cx.strokeStyle='#00ffaa';cx.lineWidth=2;cx.stroke();
    cx.shadowBlur=0;
    cx.font='14px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
    cx.fillText('\u{1F50A}',W/2,H/2);
    cx.font='7px monospace';cx.fillStyle='#00ffaa';
    cx.fillText('EMITTER',W/2,H/2+26);cx.restore();
  }

  function drawPerimeter(){
    cx.setLineDash([6,8]);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.lineWidth=1;
    cx.beginPath();cx.arc(W/2,H/2,fenceRadius,0,Math.PI*2);cx.stroke();
    cx.setLineDash([]);
    cx.fillStyle='rgba(0,255,170,0.04)';
    cx.beginPath();cx.arc(W/2,H/2,fenceRadius,0,Math.PI*2);cx.fill();
    // Zone labels
    cx.font='7px monospace';cx.fillStyle='rgba(0,255,170,0.3)';cx.textAlign='center';
    cx.fillText('SECURE ZONE',W/2,H/2+fenceRadius+12);
  }

  function drawDopplerGraph(){
    const gx=W-180,gy=20,gw=160,gh=80;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(gx,gy,gw,gh);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    if(shiftHist.length>1){
      cx.strokeStyle='#22c55e';cx.lineWidth=1.5;cx.beginPath();
      const step=gw/Math.max(1,shiftHist.length-1);
      shiftHist.forEach((v,i)=>{
        const x=gx+i*step;
        const y=gy+gh/2-v/200*gh*0.4;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(0,255,170,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('DOPPLER SHIFT',gx+4,gy+10);
    cx.fillText('+Hz',gx+4,gy+20);
    cx.textAlign='right';cx.fillText('-Hz',gx+gw-4,gy+gh-4);
    cx.textAlign='left';
  }

  function drawFreqBands(){
    const bx=20,by=H-50,bw=W*0.4,bh=35;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(bx,by,bw,bh);
    // Simulated ultrasonic frequency spectrum
    const bins=64;const binW=bw/bins;
    for(let i=0;i<bins;i++){
      const tonePos=bins*0.6;
      const dist=Math.abs(i-tonePos);
      let h2=Math.max(1,(1-dist/20)*bh*0.8+Math.random()*3);
      if(dist>20)h2=Math.random()*3;
      const approaching=intruders.some(n=>!n.detected&&n.dist<fenceRadius+20);
      const col=approaching&&dist<5?'rgba(239,68,68,0.7)':'rgba(0,255,170,'+(0.2+h2/bh*0.5)+')';
      cx.fillStyle=col;
      cx.fillRect(bx+i*binW,by+bh-h2,binW-1,h2);
    }
    cx.fillStyle='rgba(0,255,170,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('18 kHz                          22 kHz',bx+4,by+bh+10);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,180,68);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,180,68);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('\u{1F50A} ACOUSTIC FENCE',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Active Targets: '+intruders.length,16,40);
    cx.fillText('Intrusions: '+simIntrusions,16,54);
    const alertLvl=intruders.some(n=>n.detected)?'HIGH':'LOW';
    cx.fillStyle=alertLvl==='HIGH'?'#ef4444':'#22c55e';
    cx.fillText('Alert: '+alertLvl,16,68);
    cx.restore();
  }

  function drawScanSweep(){
    cx.save();cx.translate(W/2,H/2);cx.rotate(t*0.8);
    const grad=cx.createLinearGradient(0,0,fenceRadius,0);
    grad.addColorStop(0,'rgba(0,255,170,0.15)');grad.addColorStop(1,'rgba(0,255,170,0)');
    cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,fenceRadius,-0.12,0.12);cx.closePath();
    cx.fillStyle=grad;cx.fill();cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,14,0.12)';cx.fillRect(0,0,W,H);

    // Spawn pulses
    if(Math.floor(t*60)%20===0)pulses.push(new UltrasonicPulse());

    // Spawn intruders
    if(Math.random()<0.005&&intruders.length<6)intruders.push(new Intruder());

    // Aggregate doppler shift
    let avgShift=0;
    intruders.forEach(n=>{avgShift+=n.dopplerShift;});
    avgShift/=Math.max(1,intruders.length);
    avgShift+=(Math.random()-0.5)*10;
    shiftHist.push(avgShift);if(shiftHist.length>100)shiftHist.shift();

    drawPerimeter();drawScanSweep();

    // Pulses
    for(let i=pulses.length-1;i>=0;i--){
      if(!pulses[i].update())pulses.splice(i,1);
      else pulses[i].draw();
    }

    drawEmitter();

    // Intruders
    for(let i=intruders.length-1;i>=0;i--){
      if(!intruders[i].update())intruders.splice(i,1);
      else{
        intruders[i].draw();
        // Detection line to emitter
        if(intruders[i].dist<fenceRadius+10){
          cx.strokeStyle=intruders[i].detected?'rgba(239,68,68,0.15)':'rgba(245,158,11,0.08)';
          cx.lineWidth=1;cx.beginPath();
          cx.moveTo(intruders[i].x,intruders[i].y);cx.lineTo(W/2,H/2);cx.stroke();
        }
      }
    }

    drawDopplerGraph();drawFreqBands();drawHUD();

    // Footer
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Ultrasonic Doppler Perimeter — 20 kHz Emission Simulation',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
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
