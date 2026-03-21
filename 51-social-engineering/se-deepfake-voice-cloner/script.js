/**
 * SE-Deepfake-Voice-Cloner — Workshop DIY v1.0
 * Rich canvas-based voice cloning simulation for security awareness.
 * Framework: Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

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
    title:'Deepfake Voice Cloner', subtitle:'Simulate AI voice cloning threats',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Deepfake Voice Cloner', mainDesc:'AI voice cloning simulation for security awareness',
    sectionA:'Clone Analysis Lab', sectionB:'How It Works', sectionC:'Challenge',
    recordBtn:'Record', cloneBtn:'Clone Voice', playOrig:'Play Original', playClone:'Play Cloned', detectBtn:'Detect Fake',
    similarityLabel:'Clone Similarity', similarityDesc:'AI model confidence', spectrumLabel:'Frequency Spectrum',
    voiceMale:'Male Voice', voiceFemale:'Female Voice', voiceChild:'Child Voice',
    howStep1:'A voice sample is recorded and converted to a spectrogram representation.',
    howStep2:'An AI model analyzes the voice\'s unique characteristics (timbre, pitch, cadence).',
    howStep3:'The model generates a synthetic clone that mimics the original voice patterns.',
    howStep4:'Detection algorithms analyze spectral anomalies to identify deepfake artifacts.',
    challenge1:'How can you tell a cloned voice from a real one?',
    challenge2:'Why is deepfake voice cloning dangerous for social engineering?',
    challenge3:'Design a defense protocol against voice deepfakes.',
    challengeReveal1:'Look for metallic resonance at high frequencies, unnatural micro-pauses, and consistent pitch that lacks natural human variation.',
    challengeReveal2:'Attackers can impersonate executives in phone calls (vishing), authorize fraudulent wire transfers, or manipulate employees into revealing sensitive information.',
    challengeReveal3:'Use code words for sensitive requests, implement callback verification on separate channels, deploy real-time deepfake detection AI, and never authorize financial transactions based solely on voice.',
    revealBtn:'Reveal Answer',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', filterAll:'All',
    settings:'⚙️ Settings', language:'Language', theme:'Theme', soundEffects:'🔊 Sound effects',
    help:'❓ Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'The main display shows the Deepfake Voice Cloner simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how A voice sample is recorded and converted to a spectrogram re',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Clone Analysis Lab" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_t1:'🎙️ Voice Synthesis. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.', wiki_d1:'Neural TTS models like WaveNet learn voice characteristics from short samples to generate convincing synthetic speech.',
    wiki_t2:'🔍 Spectral Detection. Sensors convert physical phenomena (light, sound, temperature, motion) into electrical signals that a computer can process. The key specifications are sensitivity (smallest change it can detect), range (min to max values), and accuracy (how close to the true value).', wiki_d2:'Spectral analysis reveals anomalies in frequency distribution that betray synthetic audio generation.',
    wiki_t3:'🛡️ Social Engineering Risk. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.', wiki_d3:'Voice cloning enables vishing attacks where attackers impersonate trusted individuals over phone calls.',
    ready:'🎙️ Deepfake Voice Cloner ready — select a voice and record!',
    recording:'Recording voice sample...', recordDone:'Voice sample captured (%hz Hz detected).',
    cloning:'Cloning voice with neural model...', cloneDone:'Voice clone generated — %sim% similarity!',
    detecting:'Running deepfake detection algorithms...', detected:'Artifacts detected: metallic resonance at %hz Hz, phase score 0.%ps',
    playingOrig:'Playing original sample...', playingClone:'Playing cloned sample...',
    noSample:'Record a voice sample first.', noClone:'Clone a voice first.',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    working:'Working...', splashHint:'tap to skip',
    langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Research Target',step1Desc:'A voice sample is recorded and converted to a spectrogram representation. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Build Pretext',step2Desc:'An AI model analyzes the voice\'s unique characteristics (timbre, pitch, cadence).',step3Title:'Execute Attack',step3Desc:'The model generates a synthetic clone that mimics the original voice patterns. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Analyze & Defend',step4Desc:'Detection algorithms analyze spectral anomalies to identify deepfake artifacts. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Deepfake Voice Cloner?',faq_a1:'Deepfake Voice Cloner is an interactive simulation that demonstrates social engineering concepts. AI voice cloning simulation for security awareness. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real social engineering awareness behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real social engineering awareness principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Se Baiting Trap Designer and Se Credential Harvester. Each app in this category teaches a different aspect of social engineering awareness.',demo_s1:'Welcome to Deepfake Voice Cloner! Look at the main display — this is where the social engineering awareness simulation runs.',demo_s2:'Select a voice type (male, female, child) from the dropdown. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Clone Analysis Lab" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of social engineering awareness.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Deepfake Voice Cloner! This is like a science experiment on your computer. You get to control a real social engineering simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how A voice sample is recorded and converted to a spec Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches social engineering awareness concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Deepfake Voice Cloner?',wiki_concept:'Deepfake Voice Cloner is a technique used in social engineering awareness. AI voice cloning simulation for security awareness. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: A voice sample is recorded and converted to a spectrogram representation. Second: An AI model analyzes the voice\\. The simulation runs these stages in real time, showing you intermediate results at each step. In real social engineering awareness, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Deepfake Voice Cloner has practical applications in social engineering awareness. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Deepfake Voice Cloner: AI voice cloning simulation for security awareness. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Research Target through Build Pretext to Execute Attack and Analyze & Defend.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Clone Analysis Lab" and "How It Works" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Frequency Deconfliction Manager',related1_desc:'Spectrum allocation, conflict detection, and frequency planning',related1_path:'../../54-rf-warfare/rfw-frequency-deconfliction/index.html',related2_name:'NAS Vault Dashboard',related2_desc:'Encrypted network-attached storage server',related2_path:'../../37-pi-core/pi-nas-vault/index.html',related3_name:'Drone Hijacker Sim',related3_desc:'Simulate drone RF link hijacking',related3_path:'../../54-rf-warfare/rfw-drone-hijacker-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Credential Harvester',pathPrev_path:'../../51-social-engineering/se-credential-harvester/index.html',pathNext_name:'Dumpster Diving Simulator',pathNext_path:'../../51-social-engineering/se-dumpster-diving-sim/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is social engineering?',quiz_q1a:'Building bridges',quiz_q1b:'Manipulating people to reveal information',quiz_q1c:'Network design',quiz_q1d:'Software testing',quiz_q1_answer:'1',quiz_q2:'What is a firewall?',quiz_q2a:'Antenna type',quiz_q2b:'Network security system filtering traffic',quiz_q2c:'Encryption algorithm',quiz_q2d:'Physical barrier',quiz_q2_answer:'1',quiz_q3:'What does AI stand for?',quiz_q3a:'Automated Input',quiz_q3b:'Artificial Intelligence',quiz_q3c:'Analog Interface',quiz_q3d:'Active Integration',quiz_q3_answer:'1',quiz_q4:'What is machine learning?',quiz_q4a:'Programming robots',quiz_q4b:'Systems that learn from data',quiz_q4c:'Manual computation',quiz_q4d:'Hardware design',quiz_q4_answer:'1',quiz_q5:'What does 2FA stand for?',quiz_q5a:'Two-Factor Authentication',quiz_q5b:'Two-File Access',quiz_q5c:'Twin Firewall Approach',quiz_q5d:'Two-Frequency Allocation',quiz_q5_answer:'0'},
    wiki_history_title: '📜 History of Social Engineering',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Deepfake Voice Cloner builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Deepfake Voice Cloner',
    wiki_math: 'The mathematics behind Deepfake Voice Cloner: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced social engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to social engineering. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with social engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in social engineering.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Social Engineering carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Deepfake Voice Cloner demonstrates key principles from social engineering. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world social engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional social engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Clonage Vocal Deepfake', subtitle:'Simuler les menaces de clonage vocal IA',
    disconnected:'Déconnecté', connected:'Connecté',
    mainSection:'Clonage Vocal Deepfake', mainDesc:'Simulation de clonage vocal IA pour la sensibilisation à la sécurité',
    sectionA:'Laboratoire d\'Analyse', sectionB:'Comment ça Marche', sectionC:'Défi',
    recordBtn:'Enregistrer', cloneBtn:'Cloner la Voix', playOrig:'Jouer Original', playClone:'Jouer Cloné', detectBtn:'Détecter le Faux',
    similarityLabel:'Similarité du Clone', similarityDesc:'Confiance du modèle IA', spectrumLabel:'Spectre Fréquentiel',
    voiceMale:'Voix Masculine', voiceFemale:'Voix Féminine', voiceChild:'Voix d\'Enfant',
    howStep1:'Un échantillon vocal est enregistré et converti en représentation spectrogramme.',
    howStep2:'Un modèle IA analyse les caractéristiques uniques de la voix (timbre, hauteur, cadence).',
    howStep3:'Le modèle génère un clone synthétique imitant les patterns vocaux originaux.',
    howStep4:'Les algorithmes de détection analysent les anomalies spectrales pour identifier les artefacts deepfake.',
    challenge1:'Comment distinguer une voix clonée d\'une vraie?',
    challenge2:'Pourquoi le clonage vocal deepfake est-il dangereux pour l\'ingénierie sociale?',
    challenge3:'Concevez un protocole de défense contre les deepfakes vocaux.',
    challengeReveal1:'Cherchez la résonance métallique aux hautes fréquences, les micro-pauses non naturelles et une hauteur constante sans variation humaine naturelle.',
    challengeReveal2:'Les attaquants peuvent usurper l\'identité de dirigeants lors d\'appels (vishing), autoriser des virements frauduleux ou manipuler des employés pour révéler des informations sensibles.',
    challengeReveal3:'Utilisez des mots de passe pour les demandes sensibles, vérification par rappel sur des canaux séparés, déployez une IA de détection en temps réel, n\'autorisez jamais de transactions financières basées uniquement sur la voix.',
    revealBtn:'Révéler la Réponse',
    activityLog:'Journal d\'Activité', eventsMsg:'Événements et messages',
    clear:'Effacer', copy:'Copier', export:'Exporter', filterAll:'Tout',
    settings:'⚙️ Paramètres', language:'Langue', theme:'Thème', soundEffects:'🔊 Effets sonores',
    help:'❓ Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'L écran principal affiche la simulation Deepfake Voice Cloner. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how A voice sample is recorded and converted to a spectrogram re',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_t1:'🎙️ Synthèse Vocale', wiki_d1:'Les modèles TTS neuronaux apprennent les caractéristiques vocales pour générer de la parole synthétique convaincante.',
    wiki_t2:'🔍 Détection Spectrale', wiki_d2:'L\'analyse spectrale révèle les anomalies de distribution fréquentielle trahissant la génération audio synthétique.',
    wiki_t3:'🛡️ Risque d\'Ingénierie Sociale', wiki_d3:'Le clonage vocal permet des attaques de vishing où les attaquants usurpent l\'identité de personnes de confiance.',
    ready:'🎙️ Clonage Vocal Deepfake prêt — sélectionnez une voix!',
    recording:'Enregistrement de l\'échantillon vocal...', recordDone:'Échantillon vocal capturé (%hz Hz détecté).',
    cloning:'Clonage vocal avec le modèle neuronal...', cloneDone:'Clone vocal généré — %sim% de similarité!',
    detecting:'Exécution des algorithmes de détection...', detected:'Artefacts détectés: résonance métallique à %hz Hz, score de phase 0.%ps',
    playingOrig:'Lecture de l\'échantillon original...', playingClone:'Lecture de l\'échantillon cloné...',
    noSample:'Enregistrez d\'abord un échantillon vocal.', noClone:'Clonez d\'abord une voix.',
    logCleared:'Journal effacé', copied:'Copié!', copyFail:'Échec de copie',
    working:'En cours...', splashHint:'appuyer pour passer',
    langChanged:'🌐 Langue → Français', themeChanged:'🎨 Thème →',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Rechercher la cible',step1Desc:'Un échantillon vocal est enregistré et converti en représentation spectrogramme.',step2Title:'Construire le prétexte',step2Desc:'Un modèle IA analyse les caractéristiques uniques de la voix (timbre, hauteur, cadence).',step3Title:'Exécuter l\'attaque',step3Desc:'Le modèle génère un clone synthétique imitant les patterns vocaux originaux. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Analyser et défendre',step4Desc:'Les algorithmes de détection analysent les anomalies spectrales pour identifier les artefacts deepfake.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Deepfake Voice Cloner ?',faq_a1:'Deepfake Voice Cloner est une simulation interactive qui démontre les concepts de ingénierie sociale. AI voice cloning simulation for security awareness. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de sensibilisation à l\'ingénierie sociale. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de sensibilisation à l\'ingénierie sociale. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de sensibilisation à l\'ingénierie sociale.',demo_s1:'Bienvenue dans Deepfake Voice Cloner ! Regarde l\'écran principal — c\'est ici que la simulation de sensibilisation à l\'ingénierie sociale fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de sensibilisation à l\'ingénierie sociale.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Deepfake Voice Cloner ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de ingénierie sociale — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how A voice sample is recorded and converted to a spec Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de sensibilisation à l\'ingénierie sociale par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chiffrer et Décoder',ch1Desc:'Chiffre un message puis essaie de le décoder manuellement sans regarder la clé. Quels motifs repères-tu dans le texte chiffré ?',ch2Title:'Test de Furtivité',ch2Desc:'Essaie de compléter la mission avec l\'empreinte signal la plus faible possible. Peux-tu descendre sous le seuil de détection ?',ch3Title:'Course à l\'Interception',ch3Desc:'Lance une transmission et mesure le temps de détection. Qu\'est-ce qui affecte ce délai ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Deepfake Voice Cloner ?',wiki_concept:'Deepfake Voice Cloner est une technique utilisée en social engineering awareness. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de social engineering awareness. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Deepfake Voice Cloner a des applications pratiques en social engineering awareness. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Deepfake Voice Cloner : AI voice cloning simulation for security awareness. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Gestionnaire de Deconfliction',related1_desc:'Allocation spectrale et resolution de conflits',related1_path:'../../54-rf-warfare/rfw-frequency-deconfliction/index.html',related2_name:'Tableau de bord coffre NAS',related2_desc:'Serveur de stockage réseau chiffré',related2_path:'../../37-pi-core/pi-nas-vault/index.html',related3_name:'Sim Piratage Drone',related3_desc:'Simuler le piratage de lien RF drone',related3_path:'../../54-rf-warfare/rfw-drone-hijacker-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Collecteur d\\',pathPrev_path:'../../51-social-engineering/se-credential-harvester/index.html',pathNext_name:'Simulateur de Fouille de Poubelles',pathNext_path:'../../51-social-engineering/se-dumpster-diving-sim/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Qu\'est-ce que l\'ingénierie sociale ?',quiz_q1a:'Construire des ponts',quiz_q1b:'Manipuler les gens pour obtenir des informations',quiz_q1c:'Conception réseau',quiz_q1d:'Test logiciel',quiz_q1_answer:'1',quiz_q2:'Qu\'est-ce qu\'un pare-feu ?',quiz_q2a:'Type d\'antenne',quiz_q2b:'Système de sécurité réseau filtrant le trafic',quiz_q2c:'Algorithme de chiffrement',quiz_q2d:'Barrière physique',quiz_q2_answer:'1',quiz_q3:'Que signifie IA ?',quiz_q3a:'Entrée automatisée',quiz_q3b:'Intelligence Artificielle',quiz_q3c:'Interface analogique',quiz_q3d:'Intégration active',quiz_q3_answer:'1',quiz_q4:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q4a:'Programmer des robots',quiz_q4b:'Systèmes apprenant des données',quiz_q4c:'Calcul manuel',quiz_q4d:'Conception matérielle',quiz_q4_answer:'1',quiz_q5:'Que signifie 2FA ?',quiz_q5a:'Authentification à deux facteurs',quiz_q5b:'Accès à deux fichiers',quiz_q5c:'Approche double pare-feu',quiz_q5d:'Allocation double fréquence',quiz_q5_answer:'0'},
    wiki_history_title: '📜 Histoire de ingénierie sociale',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Deepfake Voice Cloner s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Deepfake Voice Cloner',
    wiki_math: 'Les mathématiques derrière Deepfake Voice Cloner : With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de ingénierie sociale utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour ingénierie sociale. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en ingénierie sociale : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Ingénierie sociale implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Deepfake Voice Cloner démontre les principes clés de ingénierie sociale. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec social engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'مُستنسخ الصوت المزيّف', subtitle:'محاكاة تهديدات استنساخ الصوت بالذكاء الاصطناعي',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'مُستنسخ الصوت المزيّف', mainDesc:'محاكاة استنساخ الصوت للتوعية الأمنية',
    sectionA:'مختبر تحليل الاستنساخ', sectionB:'كيف يعمل', sectionC:'التحدي',
    recordBtn:'تسجيل', cloneBtn:'استنساخ الصوت', playOrig:'تشغيل الأصلي', playClone:'تشغيل المستنسخ', detectBtn:'كشف التزييف',
    similarityLabel:'تشابه الاستنساخ', similarityDesc:'ثقة نموذج الذكاء الاصطناعي', spectrumLabel:'طيف التردد',
    voiceMale:'صوت ذكر', voiceFemale:'صوت أنثى', voiceChild:'صوت طفل',
    howStep1:'يتم تسجيل عينة صوتية وتحويلها إلى تمثيل طيفي.',
    howStep2:'يحلل نموذج الذكاء الاصطناعي الخصائص الفريدة للصوت (الجرس، النبرة، الإيقاع).',
    howStep3:'يولّد النموذج نسخة صناعية تحاكي أنماط الصوت الأصلية.',
    howStep4:'تحلل خوارزميات الكشف الشذوذ الطيفي لتحديد آثار التزييف العميق.',
    challenge1:'كيف يمكنك التمييز بين صوت مستنسخ وصوت حقيقي؟',
    challenge2:'لماذا يُعتبر استنساخ الصوت المزيّف خطيرًا في الهندسة الاجتماعية؟',
    challenge3:'صمم بروتوكول دفاع ضد التزييف الصوتي العميق.',
    challengeReveal1:'ابحث عن الرنين المعدني في الترددات العالية، والتوقفات الدقيقة غير الطبيعية، والنبرة الثابتة التي تفتقر للتنوع البشري الطبيعي.',
    challengeReveal2:'يمكن للمهاجمين انتحال شخصية المدراء التنفيذيين في المكالمات الهاتفية، والموافقة على تحويلات مالية احتيالية، أو التلاعب بالموظفين لكشف معلومات حساسة.',
    challengeReveal3:'استخدم كلمات سر للطلبات الحساسة، وتحقق عبر الاتصال العكسي على قنوات منفصلة، وانشر ذكاء اصطناعي للكشف الفوري، ولا توافق أبدًا على معاملات مالية بناءً على الصوت فقط.',
    revealBtn:'اكشف الإجابة',
    activityLog:'سجل النشاط', eventsMsg:'الأحداث والرسائل',
    clear:'مسح', copy:'نسخ', export:'تصدير', filterAll:'الكل',
    settings:'⚙️ الإعدادات', language:'اللغة', theme:'المظهر', soundEffects:'🔊 المؤثرات الصوتية',
    help:'❓ مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Deepfake Voice Cloner. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how A voice sample is recorded and converted to a spectrogram re',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_t1:'🎙️ التوليف الصوتي', wiki_d1:'نماذج TTS العصبية مثل WaveNet تتعلم خصائص الصوت لتوليد كلام صناعي مقنع.',
    wiki_t2:'🔍 الكشف الطيفي', wiki_d2:'التحليل الطيفي يكشف الشذوذ في توزيع الترددات الذي يفضح توليد الصوت الصناعي.',
    wiki_t3:'🛡️ مخاطر الهندسة الاجتماعية', wiki_d3:'يُمكّن استنساخ الصوت من هجمات التصيد الصوتي حيث ينتحل المهاجمون شخصية أفراد موثوقين.',
    ready:'🎙️ مُستنسخ الصوت المزيّف جاهز — اختر صوتًا وسجّل!',
    recording:'جارٍ تسجيل العينة الصوتية...', recordDone:'تم التقاط العينة الصوتية (%hz هرتز).',
    cloning:'جارٍ استنساخ الصوت بالنموذج العصبي...', cloneDone:'تم توليد الصوت المستنسخ — %sim% تشابه!',
    detecting:'جارٍ تشغيل خوارزميات الكشف...', detected:'تم اكتشاف شوائب: رنين معدني عند %hz هرتز، نتيجة الطور 0.%ps',
    playingOrig:'جارٍ تشغيل العينة الأصلية...', playingClone:'جارٍ تشغيل العينة المستنسخة...',
    noSample:'سجّل عينة صوتية أولًا.', noClone:'استنسخ صوتًا أولًا.',
    logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    working:'جارٍ...', splashHint:'انقر للتخطي',
    langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'البحث عن الهدف',step1Desc:'يتم تسجيل عينة صوتية وتحويلها إلى تمثيل طيفي. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'بناء الذريعة',step2Desc:'يحلل نموذج الذكاء الاصطناعي الخصائص الفريدة للصوت (الجرس، النبرة، الإيقاع).',step3Title:'تنفيذ الهجوم',step3Desc:'يولّد النموذج نسخة صناعية تحاكي أنماط الصوت الأصلية. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تحليل ودفاع',step4Desc:'تحلل خوارزميات الكشف الشذوذ الطيفي لتحديد آثار التزييف العميق. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Deepfake Voice Cloner؟',faq_a1:'Deepfake Voice Cloner هي محاكاة تفاعلية توضح مفاهيم الهندسة الاجتماعية. AI voice cloning simulation for security awareness. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في التوعية بالهندسة الاجتماعية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من التوعية بالهندسة الاجتماعية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من التوعية بالهندسة الاجتماعية.',demo_s1:'مرحباً في Deepfake Voice Cloner! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة التوعية بالهندسة الاجتماعية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالتوعية بالهندسة الاجتماعية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Deepfake Voice Cloner! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالهندسة الاجتماعية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how A voice sample is recorded and converted to a spec لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم التوعية بالهندسة الاجتماعية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تشفير وفك تشفير',ch1Desc:'شفّر رسالة ثم حاول فك تشفيرها يدوياً بدون النظر للمفتاح. ما الأنماط التي تلاحظها؟',ch2Title:'اختبار التخفي',ch2Desc:'حاول إكمال المهمة بأقل بصمة إشارة ممكنة. هل يمكنك النزول تحت عتبة الكشف؟',ch3Title:'سباق الاعتراض',ch3Desc:'ابدأ بثاً وقِس سرعة اعتراضه. ما الذي يؤثر على وقت الكشف؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Deepfake Voice Cloner؟',wiki_concept:'Deepfake Voice Cloner هي تقنية تُستخدم في social engineering awareness. في البيئات المهنية، تتطلب هذه التقنية Mixed وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من social engineering awareness. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Deepfake Voice Cloner له تطبيقات عملية في social engineering awareness. يستخدم المحترفون تقنيات مماثلة مع Mixed. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Deepfake Voice Cloner: AI voice cloning simulation for security awareness. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الهندسة الاجتماعية',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. يبني Deepfake Voice Cloner على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Deepfake Voice Cloner',
    wiki_math: 'الرياضيات وراء Deepfake Voice Cloner: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الهندسة الاجتماعية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الهندسة الاجتماعية. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الهندسة الاجتماعية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الهندسة الاجتماعية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Deepfake Voice Cloner يوضح المبادئ الأساسية في الهندسة الاجتماعية. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـsocial engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0645\\u062f\\u064a\\u0631 \\u0641\\u0636 \\u0627\\u0644\\u062a\\u0639\\u0627\\u0631\\u0636',related1_desc:'\\u062a\\u062e\\u0635\\u064a\\u0635 \\u0627\\u0644\\u0637\\u064a\\u0641 \\u0648\\u0643\\u0634\\u0641 \\u0627\\u0644\\u062a\\u0639\\u0627\\u0631\\u0636',related1_path:'../../54-rf-warfare/rfw-frequency-deconfliction/index.html',related2_name:'لوحة تحكم خزنة NAS',related2_desc:'خادم تخزين شبكي مشفر',related2_path:'../../37-pi-core/pi-nas-vault/index.html',related3_name:'\\u0645\\u062d\\u0627\\u0643\\u064a \\u0627\\u062e\\u062a\\u0637\\u0627\\u0641',related3_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u0627\\u062e\\u062a\\u0637\\u0627\\u0641 \\u0631\\u0648\\u0627\\u0628\\u0637 RF',related3_path:'../../54-rf-warfare/rfw-drone-hijacker-sim/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'جامع بيانات الاعتماد',pathPrev_path:'../../51-social-engineering/se-credential-harvester/index.html',pathNext_name:'محاكي البحث في النفايات',pathNext_path:'../../51-social-engineering/se-dumpster-diving-sim/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما هي الهندسة الاجتماعية؟',quiz_q1a:'بناء الجسور',quiz_q1b:'التلاعب بالناس للكشف عن معلومات',quiz_q1c:'تصميم الشبكات',quiz_q1d:'اختبار البرمجيات',quiz_q1_answer:'1',quiz_q2:'ما هو جدار الحماية؟',quiz_q2a:'نوع هوائي',quiz_q2b:'نظام أمن شبكة يفلتر حركة المرور',quiz_q2c:'خوارزمية تشفير',quiz_q2d:'حاجز مادي',quiz_q2_answer:'1',quiz_q3:'ماذا تعني AI؟',quiz_q3a:'إدخال آلي',quiz_q3b:'الذكاء الاصطناعي',quiz_q3c:'واجهة تناظرية',quiz_q3d:'تكامل نشط',quiz_q3_answer:'1',quiz_q4:'ما هو التعلم الآلي؟',quiz_q4a:'برمجة الروبوتات',quiz_q4b:'أنظمة تتعلم من البيانات',quiz_q4c:'حساب يدوي',quiz_q4d:'تصميم العتاد',quiz_q4_answer:'1',quiz_q5:'ماذا تعني 2FA؟',quiz_q5a:'المصادقة الثنائية',quiz_q5b:'الوصول لملفين',quiz_q5c:'نهج جدار حماية مزدوج',quiz_q5d:'تخصيص تردد مزدوج',quiz_q5_answer:'0'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';
function T(k){ return (LANG[currentLang]||LANG.en)[k]||k; }

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled) return;
  if(!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if(type==='click'){ o.frequency.value=800; o.type='sine'; g.gain.exponentialRampToValueAtTime(0.001,t+0.08); o.start(t); o.stop(t+0.08); }
  else if(type==='success'){ o.frequency.value=523; o.type='sine'; g.gain.exponentialRampToValueAtTime(0.001,t+0.3); o.start(t); o.stop(t+0.3); }
  else if(type==='error'){ o.frequency.value=200; o.type='square'; g.gain.exponentialRampToValueAtTime(0.001,t+0.25); o.start(t); o.stop(t+0.25); }
}

/* ═══════ LANGUAGE ═══════ */
function setLanguage(lang){
  currentLang = lang;
  const s = LANG[lang]; if(!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if(s[k]!=null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if(s[k]!=null) o.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if(s[k]!=null) el.placeholder = s[k]; });
  document.title = s.title + ' — Workshop DIY';
  document.documentElement.dir = lang==='ar'?'rtl':'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if(sel) sel.value = lang;
  try{ localStorage.setItem('wdiy-lang', lang); } catch{}
  log(s.langChanged, 'info');
}

/* ═══════ THEME ═══════ */
function setTheme(name){
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if(sel) sel.value = name;
  try{ localStorage.setItem('wdiy-theme', name); } catch{}
  log(T('themeChanged') + ' ' + name, 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type='info'){
  if(!logContainer) logContainer = $('logContainer'); if(!logContainer) return;
  const d = document.createElement('div'); d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if(type==='success') playSound('success'); else if(type==='error') playSound('error');
  applyLogFilter();
}
function clearLog(){ if(!logContainer) logContainer=$('logContainer'); if(logContainer) logContainer.innerHTML=''; log(T('logCleared')); }
async function copyLog(){
  if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return;
  const t = Array.from(logContainer.children).map(d=>d.textContent).join('\n');
  try{ await navigator.clipboard.writeText(t); log(T('copied'),'success'); } catch{ log(T('copyFail'),'error'); }
}
function exportLog(){
  if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return;
  const t = Array.from(logContainer.children).map(d=>d.textContent).join('\n');
  const b = new Blob([t],{type:'text/plain'}), u = URL.createObjectURL(b), a = document.createElement('a');
  a.href = u; a.download = 'deepfake-voice-log-'+new Date().toISOString().slice(0,10)+'.txt'; a.click(); URL.revokeObjectURL(u);
}

/* ═══════ TOAST ═══════ */
function showToast(msg, ms=0){ const el=$('toastIndicator'),t=$('toastMessage'); if(el&&t){ t.textContent=msg||T('working'); el.style.display='block'; } if(ms>0) setTimeout(hideToast,ms); }
function hideToast(){ const el=$('toastIndicator'); if(el) el.style.display='none'; }

/* ═══════ STATUS ═══════ */
function setStatus(c){ const t=$('statusText'); if(t) t.textContent=c?T('connected'):T('disconnected'); const p=$('statusPill'); if(p) p.classList.toggle('connected',c); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){ const s=$('splash'); if(!s) return; s.classList.add('hidden'); if(splashTimer) clearTimeout(splashTimer); setTimeout(()=>s.remove(),600); playSound('click'); }
function initSplash(){ const s=$('splash'); if(!s) return; splashTimer=setTimeout(dismissSplash,2500); }

/* ═══════ LOG FILTER ═══════ */
let activeLogFilter = 'all';
function initLogFilters(){ document.querySelectorAll('.log-filter').forEach(btn=>{ btn.addEventListener('click',()=>{ document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeLogFilter=btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter(){ if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; Array.from(logContainer.children).forEach(l=>{ l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none'; }); }

/* ═══════ HIJRI ═══════ */
function initHijriDate(){ const el=$('hijriDate'); if(!el) return; try{ el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date()); }catch{} }

/* ═══════ PANELS ═══════ */
function openPanel(pid,oid){ const s=$(pid),o=$(oid); if(s) s.classList.add('open'); if(o) o.classList.add('open'); }
function closePanel(pid,oid){ const s=$(pid),o=$(oid); if(s) s.classList.remove('open'); if(o) o.classList.remove('open'); }
function openHelp(){ openPanel('helpPanel','helpOverlay'); }
function closeHelp(){ closePanel('helpPanel','helpOverlay'); }
function openSettings(){ openPanel('settingsPanel','settingsOverlay'); }
function closeSettings(){ closePanel('settingsPanel','settingsOverlay'); }
function openLog(){ const s=$('logPanel'); if(s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog(){ const s=$('logPanel'); if(s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog(){ const s=$('logPanel'); s&&s.classList.contains('open')?closeLog():openLog(); }
function initHelpTabs(){ document.querySelectorAll('.help-tab').forEach(tab=>{ tab.addEventListener('click',()=>{ document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active')); tab.classList.add('active'); const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1); const el=$(id); if(el) el.classList.add('active'); }); }); }

/* ═══════ CHALLENGE ═══════ */
window.revealChallenge = function(i){ const el=$('answer'+i); if(el) el.classList.toggle('visible'); };

/* ═══════ CANVAS — Waveform Visualization ═══════ */
let waveAnim, isRecording = false, isCloned = false;
let origData = [], cloneData = [];
let similarity = 0, detectedFreq = 0;
let recordPhase = 0;

function getAccent(){ return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c'; }

function initWaveCanvas(){
  const c = $('waveCanvas'); if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = c.offsetWidth * (window.devicePixelRatio||1); c.height = 220 * (window.devicePixelRatio||1); ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1); }
  resize(); window.addEventListener('resize', resize);
  const W = ()=> c.width/(window.devicePixelRatio||1);
  const H = ()=> 220;
  let t = 0;
  const particles = [];
  for(let i=0;i<60;i++) particles.push({ x:Math.random(), y:Math.random(), s:Math.random()*2+0.5, a:Math.random()*0.4+0.1 });

  function draw(){
    const w=W(), h=H();
    ctx.fillStyle = 'rgba(10,10,26,0.15)';
    ctx.fillRect(0,0,w,h);
    const accent = getAccent();

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for(let y=0;y<h;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    for(let x=0;x<w;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }

    // Floating particles
    ctx.fillStyle = accent;
    particles.forEach(p => {
      p.x += 0.001 * p.s;
      p.y += Math.sin(t*0.02 + p.x*10) * 0.001;
      if(p.x > 1) p.x = 0;
      ctx.globalAlpha = p.a * (isRecording ? 1 : 0.3);
      ctx.beginPath(); ctx.arc(p.x*w, p.y*h, p.s, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Voice waveform
    const voice = $('voiceSelect') ? $('voiceSelect').value : 'male';
    const baseF = voice==='male'?120 : voice==='female'?220 : 340;
    const amp = isRecording ? 60 + Math.sin(t*0.03)*20 : 12;
    const cloneAmp = isCloned ? amp * 0.9 : 0;

    // Original waveform
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.shadowColor = accent;
    ctx.shadowBlur = isRecording ? 8 : 2;
    ctx.beginPath();
    for(let x=0; x<w; x++){
      const n = Math.sin(x*0.015+t*0.06)*amp + Math.sin(x*baseF/6000+t*0.04)*amp*0.4 + Math.sin(x*0.04+t*0.08)*amp*0.2;
      const y = h/2 + n * (isRecording ? 1 : 0.3);
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();

    // Clone waveform (red, slightly offset)
    if(isCloned){
      ctx.strokeStyle = '#ff4444';
      ctx.shadowColor = '#ff4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for(let x=0; x<w; x++){
        const n = Math.sin(x*0.015+t*0.06+0.3)*cloneAmp + Math.sin(x*baseF/6000+t*0.04+0.2)*cloneAmp*0.35 + Math.sin(x*0.04+t*0.08)*cloneAmp*0.25;
        const y = h/2 + n * 0.85;
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Recording indicator
    if(isRecording){
      ctx.fillStyle = 'rgba(255,0,0,' + (0.5+Math.sin(t*0.1)*0.5) + ')';
      ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px Orbitron, monospace';
      ctx.fillText('REC', 30, 24);
      // Level meter
      const level = 0.4 + Math.sin(t*0.07)*0.3 + Math.random()*0.2;
      ctx.fillStyle = accent;
      ctx.fillRect(w-110, 10, level*100, 8);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeRect(w-110, 10, 100, 8);
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Orbitron, monospace';
    ctx.fillText('ORIGINAL', 10, h-10);
    if(isCloned){
      ctx.fillStyle = 'rgba(255,68,68,0.6)';
      ctx.fillText('CLONE', 80, h-10);
    }

    // Frequency text
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillText(baseF + ' Hz BASE', w-100, h-10);

    t++;
    waveAnim = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ CANVAS — Spectrogram Analysis ═══════ */
let specAnim;
function initSpecCanvas(){
  const c = $('specCanvas'); if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = c.offsetWidth * (window.devicePixelRatio||1); c.height = 200 * (window.devicePixelRatio||1); ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1); }
  resize(); window.addEventListener('resize', resize);
  const W = ()=> c.width/(window.devicePixelRatio||1);
  const H = ()=> 200;
  let t = 0;
  let scrollOffset = 0;

  function draw(){
    const w=W(), h=H();
    const accent = getAccent();

    // Waterfall spectrogram effect
    if(origData.length > 0){
      // Shift existing content left
      const imgData = ctx.getImageData(2*(window.devicePixelRatio||1), 0, c.width, c.height);
      ctx.putImageData(imgData, 0, 0);

      // Draw new column on right
      const bars = 64;
      const bh = h / bars;
      for(let i=0; i<bars; i++){
        const origV = origData[i] || 0;
        const cloneV = cloneData[i] || 0;
        const intensity = origV / 180;
        const cloneIntensity = cloneV / 180;

        // Original (blue-green heat)
        const r = Math.floor(intensity * 50);
        const g = Math.floor(intensity * 200 + Math.sin(t*0.05+i)*20);
        const b = Math.floor(intensity * 255);
        ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.fillRect(w-3, h - (i+1)*bh, 3, bh);

        // Clone overlay (red heat)
        if(isCloned && cloneV > 0){
          const cr = Math.floor(cloneIntensity * 255);
          const cg = Math.floor(cloneIntensity * 60);
          ctx.fillStyle = `rgba(${cr},${cg},0,0.4)`;
          ctx.fillRect(w-3, h - (i+1)*bh, 3, bh);
        }
      }

      // Anomaly markers
      if(isCloned && t % 30 < 5){
        const anomalyBin = Math.floor(Math.random()*20) + 40;
        if(anomalyBin < bars){
          ctx.fillStyle = 'rgba(255,255,0,0.8)';
          ctx.fillRect(w-4, h - (anomalyBin+1)*bh, 4, bh*2);
        }
      }
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,w,h);
    }

    // Frequency labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px Orbitron, monospace';
    ctx.fillText('8 kHz', 4, 12);
    ctx.fillText('4 kHz', 4, h/2);
    ctx.fillText('0 Hz', 4, h-4);

    // Legend
    ctx.fillStyle = 'rgba(100,200,255,0.6)';
    ctx.fillRect(w-120, 6, 10, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '8px Orbitron, monospace';
    ctx.fillText('ORIG', w-106, 13);
    if(isCloned){
      ctx.fillStyle = 'rgba(255,80,0,0.6)';
      ctx.fillRect(w-65, 6, 10, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('CLONE', w-51, 13);
    }

    // Animate spectral data
    if(origData.length > 0){
      for(let i=0; i<origData.length; i++){
        origData[i] += (Math.random()-0.5)*8;
        origData[i] = Math.max(10, Math.min(180, origData[i]));
        if(cloneData[i] !== undefined){
          cloneData[i] += (Math.random()-0.5)*10;
          cloneData[i] = Math.max(5, Math.min(180, cloneData[i]));
        }
      }
    }

    t++;
    specAnim = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ SIMULATION ACTIONS ═══════ */
function doRecord(){
  if(isRecording) return;
  isRecording = true;
  setStatus(true);
  log(T('recording'), 'info');
  showToast(T('recording'));

  const voice = $('voiceSelect') ? $('voiceSelect').value : 'male';
  const baseF = voice==='male'?120 : voice==='female'?220 : 340;
  detectedFreq = baseF + Math.floor(Math.random()*60);

  origData = [];
  for(let i=0; i<64; i++){
    const base = voice==='male'?80 : voice==='female'?60 : 40;
    origData.push(base + Math.random()*100);
  }

  $('freqVal').textContent = detectedFreq + ' Hz';
  $('pitchLabel').textContent = 'Pitch: ' + (detectedFreq<180?'Low':detectedFreq<280?'Medium':'High');

  setTimeout(()=>{
    isRecording = false;
    hideToast();
    log(T('recordDone').replace('%hz', detectedFreq), 'success');
  }, 2500);
}

function doClone(){
  if(origData.length===0){ log(T('noSample'),'error'); return; }
  log(T('cloning'), 'info');
  showToast(T('cloning'));

  let progress = 0;
  const iv = setInterval(()=>{
    progress += Math.random()*12;
    similarity = Math.min(97, Math.round(progress));
    $('similarityVal').textContent = similarity + ' %';
    $('simMeter').style.width = similarity + '%';
    cloneData = origData.map(v => v * (0.82 + Math.random()*0.35));
    if(progress >= 97){
      clearInterval(iv);
      isCloned = true;
      hideToast();
      log(T('cloneDone').replace('%sim', similarity), 'success');
      const dl = $('detectionLog');
      if(dl) dl.textContent += '\n[AI] Clone generated: ' + similarity + '% similarity\n[AI] Model: WaveNet-SE v3.2 | Params: 3.2M\n[AI] Latency: ' + (Math.random()*50+80).toFixed(1) + ' ms';
    }
  }, 250);
}

function doDetect(){
  if(!isCloned){ log(T('noClone'),'error'); return; }
  log(T('detecting'), 'info');
  showToast(T('detecting'));
  setTimeout(()=>{
    hideToast();
    const anomalyHz = Math.round(detectedFreq * 2.3 + Math.random()*500);
    const phaseScore = Math.round(Math.random()*30 + 65);
    log(T('detected').replace('%hz', anomalyHz).replace('%ps', phaseScore), 'success');
    const dl = $('detectionLog');
    if(dl){
      dl.textContent += '\n[DETECT] Spectral anomaly at ' + anomalyHz + ' Hz';
      dl.textContent += '\n[DETECT] Phase discontinuity: 0.' + phaseScore;
      dl.textContent += '\n[DETECT] Harmonic distortion: ' + (Math.random()*5+2).toFixed(2) + ' dB';
      dl.textContent += '\n[DETECT] Micro-pause pattern: ANOMALOUS';
      dl.textContent += '\n[VERDICT] ⚠ LIKELY DEEPFAKE (confidence: ' + (85+Math.random()*14).toFixed(1) + '%)';
      dl.scrollTop = dl.scrollHeight;
    }
  }, 2000);
}

function doPlayOrig(){
  if(origData.length===0){ log(T('noSample'),'error'); return; }
  log(T('playingOrig'), 'info');
  // Visual pulse on canvas
  origData = origData.map(v => v * 1.3);
  setTimeout(()=>{ origData = origData.map(v => v / 1.3); }, 1000);
}

function doPlayClone(){
  if(!isCloned){ log(T('noClone'),'error'); return; }
  log(T('playingClone'), 'info');
  cloneData = cloneData.map(v => v * 1.3);
  setTimeout(()=>{ cloneData = cloneData.map(v => v / 1.3); }, 1000);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  initHijriDate();
  initLogFilters();
  initHelpTabs();

  // Buttons
  if($('clearLogBtn')) $('clearLogBtn').onclick = clearLog;
  if($('copyLogBtn')) $('copyLogBtn').onclick = copyLog;
  if($('exportLogBtn')) $('exportLogBtn').onclick = exportLog;
  if($('helpBtn')) $('helpBtn').onclick = openHelp;
  if($('helpCloseBtn')) $('helpCloseBtn').onclick = closeHelp;
  if($('helpOverlay')) $('helpOverlay').onclick = closeHelp;
  if($('settingsBtn')) $('settingsBtn').onclick = openSettings;
  if($('settingsCloseBtn')) $('settingsCloseBtn').onclick = closeSettings;
  if($('settingsOverlay')) $('settingsOverlay').onclick = closeSettings;
  if($('logBtn')) $('logBtn').onclick = toggleLog;
  if($('logCloseBtn')) $('logCloseBtn').onclick = closeLog;

  // Sound
  const st = $('soundToggle');
  if(st){ try{ soundEnabled = localStorage.getItem('wdiy-sound')==='true'; }catch{} st.checked=soundEnabled; st.addEventListener('change',()=>{ soundEnabled=st.checked; try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{} }); }

  // Language & Theme
  const ls=$('langSelect'), ts=$('themeSelect');
  if(ls) ls.addEventListener('change', ()=>setLanguage(ls.value));
  if(ts) ts.addEventListener('change', ()=>setTheme(ts.value));
  try{ const sl=localStorage.getItem('wdiy-lang'), st2=localStorage.getItem('wdiy-theme'); if(st2) setTheme(st2); if(sl) setLanguage(sl); }catch{}

  // Escape
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeHelp(); closeSettings(); closeLog(); } });

  // Canvas
  initWaveCanvas();
  initSpecCanvas();

  // Sim buttons
  if($('recordBtn')) $('recordBtn').onclick = doRecord;
  if($('cloneBtn')) $('cloneBtn').onclick = doClone;
  if($('playOrigBtn')) $('playOrigBtn').onclick = doPlayOrig;
  if($('playCloneBtn')) $('playCloneBtn').onclick = doPlayClone;
  if($('detectBtn')) $('detectBtn').onclick = doDetect;

  log(T('ready'), 'success');
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
