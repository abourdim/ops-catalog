/**
 * Length Extension Lab — Workshop DIY v1.0
 * Demonstrate length extension attack on Merkle-Damgard hashes
 */
const $=id=>document.getElementById(id);
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
 ...LANG_BASE.en,
 diffTitle:'Difficulty',diffBeginner:'🟢 Beginner',diffIntermediate:'🟡 Intermediate',diffExpert:'🔴 Expert',diffInfo:'Choose your complexity level',spacedTitle:'📅 Spaced Review',spacedReview:'Review',spacedNext:'Next review',spacedMastered:'Mastered',spacedNew:'New — not yet studied',spacedDue:'Due for review!',spacedInfo:'Smart review reminders based on the forgetting curve',
 
 termTitle:'>_ Terminal',termPlaceholder:'Type a command...',termHelp:'Commands: help, start, stop, reset, theme [name], lang [en|fr|ar], set [param] [value], get [param], list, export, clear, status, about, cipher',termUnknown:'Unknown command. Type help for available commands.',termWelcome:'Terminal ready. Type help to get started.',cipherTitle:'🔐 Cipher Toolkit',cipherInput:'Input text',cipherOutput:'Output',cipherEncode:'Encode',cipherDecode:'Decode',cipherMethod:'Method',cipherKey:'Key',cipherCopy:'Copy',
 
 particleTitle:'🎆 Particles',particleToggle:'Toggle Particles',compareTitle:'📊 Compare',compareSave:'Save',compareLoad:'Load',compareDiff:'Difference',compareClear:'Clear',compareSlotA:'Experiment A',compareSlotB:'Experiment B',compareResult:'Comparison Result',
 
 labTitle:'📓 Lab Notebook',labGenerate:'📓 Lab Report',labExport:'Export Report',labHypothesis:'HYPOTHESIS',labMethod:'METHOD',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:' Data Recorder',recorderStart:' Record',recorderStop:' Stop',recorderClear:'Clear',recorderExport:'Export CSV',recorderPoints:'pts',recorderGraph:'Graph',dailyTitle:'📅 Daily Challenge',dailyChallenge:'Today\x27s Challenge',dailyHint:'Show Hint',dailyStreak:'Streak',dailyComplete:'Mark Complete',daily_d1:'Explain how Cry Length Extension Lab works to a friend in under 60 seconds.',daily_d2:'Find 3 real-world applications of Crypto Attacks concepts shown here.',daily_d3:'Change one parameter to its extreme value and document what happens.',daily_d4:'Draw a diagram showing the data flow in this Crypto Attacks simulation.',daily_d5:'Write pseudocode for the main algorithm used in this app.',daily_d6:'Compare results at default vs modified settings and note 3 differences.',daily_d7:'Create a hypothesis about what happens if you double the main parameter, then test it.',mentorTitle:'🎓 Guided Tutorial',mentorStart:'Start Tutorial',mentorNext:'Next',mentorPrev:'Previous',mentorDone:'Finish',mentorStep:'Step',mentor_s1:'Look at the main visualization area — this is where the simulation runs in real time.',mentor_s2:'Press Start to begin the simulation. Watch how the display reacts to your input.',mentor_s3:'Try adjusting one slider — watch how it affects the output immediately.',mentor_s4:'Open the Help panel and explore the Wiki tab for deeper knowledge.',mentor_s5:'Complete one challenge to test your understanding of the concepts.',
 sonifyTitle:'🔊 Data Sonification',sonifyOn:'Sonification ON',sonifyOff:'Sonification OFF',sonifyFreq:'Frequency',sonifyVol:'Volume',sonifyWave:'Waveform',sonifyInfo:'Turn data into sound',
 tooltipTitle:'Smart Tooltips',tooltipToggle:'Toggle Tooltips',tip_start:'Start the simulation and watch the visualization come alive',tip_stop:'Pause the simulation while preserving current state',tip_reset:'Clear all data and return to initial conditions',tip_slider:'Drag to adjust this parameter — the visualization updates in real time',tip_theme:'Switch between 8 visual themes including 2 light Islamic designs',tip_help:'Open the help panel with FAQ, guides, wiki, and challenges',explorerTitle:'Parameter Space Explorer',explorerStart:'Auto-Explore',explorerStop:'Stop Exploration',explorerProgress:'Exploring combinations...',explorerResult:'Exploration Complete',explorerInfo:'Systematically tests min/mid/max for each slider and records results',
 title:'Length Extension Lab',subtitle:'Exploit Merkle-Damgard hash to forge MACs',mainSection:'Length Extension Attack',mainDesc:'Forge valid MAC by extending known hash without the secret',computeMAC:'Compute MAC',forgeMAC:'Forge Extended MAC',results:'Results',vizTitle:'Merkle-Damgard Visualization',vizHint:'See how the hash chain allows extension',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',macComputed:'MAC computed',forged:'MAC forged successfully!',howto_1:'The main display shows the Length Extension Lab simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Length Extension Lab. Choose yo',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_md:'ميركل-دامغارد: معالجة بالكتل، سلسلة مخرجات الضغط. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_ext:'التمديد: استخدام مخرج التجزئة كحالة أولية. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_hmac:'HMAC: تجزئتان متداخلتان تمنعان التمديد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',mathExplain:'Length Extension Attack:\n\nGiven: MAC = H(secret || message)\nKnown: len(secret), message, MAC\nGoal: compute H(secret || message || padding || append)\n\nSteps:\n1. Reconstruct padding for (secret || message)\n2. Set hash internal state = MAC value\n3. Continue hashing: H_state(append)\n4. Result = valid MAC for extended message\n\nPadding (MD): message || 0x80 || 0x00...00 || length_bits',step1Title:'Set Up',step1Desc:'Configure the parameters for Length Extension Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Attack Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Math Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Length Extension Lab?',faq_a1:'Length Extension Lab lets you forge valid mac by extending known hash without the secret. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Length Extension Lab! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter original message. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Length Extension Lab! This is like a science experiment on your computer. You get to control a real crypto attacks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Length Extension Lab. Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32) # 32 bytes = 256 bits\\niv = os.urandom(16) # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key: {key.hex()}")\\nprint(f"IV: {iv.hex()}")\\nprint(f"Plaintext: {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered: {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Length Extension Lab?',wiki_concept:'Length Extension Lab is a technique used in cryptography. Forge valid MAC by extending known hash without the secret. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Length Extension Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Length Extension Lab has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Length Extension Lab: Forge valid MAC by extending known hash without the secret. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
 wiki_history_title: '📜 History of Reverse Engineering',
 wiki_history: 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards. Length Extension Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
 wiki_math_title: '📐 Mathematics Behind Length Extension Lab',
 wiki_math: 'The mathematics behind Length Extension Lab: Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
 wiki_advanced_title: '🔬 Advanced Techniques',
 wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced reverse engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
 wiki_compare_title: '⚖️ Comparing Approaches',
 wiki_compare: 'There are several approaches to reverse engineering. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
 wiki_debug_title: '🔧 Troubleshooting Guide',
 wiki_debug: 'Common issues when working with reverse engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in reverse engineering.',
 wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
 wiki_ethics: 'Reverse Engineering carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
 gloss1_term: 'Collision',
 gloss1_def: 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
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
 theory: 'Length Extension Lab demonstrates key principles from crypto attacks. Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change). Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
 faq_q9: 'What common mistakes should I avoid?',
 faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
 faq_q10: 'How does this relate to real-world reverse engineering?',
 faq_a10: 'This simulation models the same physics and mathematics used in professional reverse engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
 glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Anti-Drone RF System',related1_desc:'Detect, track, and neutralize drones via RF jamming',related1_path:'../../54-rf-warfare/rfw-anti-drone-system/index.html',related2_name:'Directed Energy Simulator',related2_desc:'High-power RF beam simulation and phased array steering',related2_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',related3_name:'Remote Station Dashboard',related3_desc:'Full remote antenna operation and control station',related3_path:'../../38-pi-antenna/pi-remote-antenna-station/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'KPA Key Recovery',pathPrev_path:'../../53-crypto-attacks/cry-known-plaintext-attack/index.html',pathNext_name:'Meet-in-the-Middle Attack',pathNext_path:'../../53-crypto-attacks/cry-meet-in-middle-lab/index.html',
 printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is public key cryptography?',quiz_q1a:'Using same key for encrypt/decrypt',quiz_q1b:'Using a key pair (public and private)',quiz_q1c:'No keys needed',quiz_q1d:'Password-based only',quiz_q1_answer:'1',quiz_q2:'What does AI stand for?',quiz_q2a:'Automated Input',quiz_q2b:'Artificial Intelligence',quiz_q2c:'Analog Interface',quiz_q2d:'Active Integration',quiz_q2_answer:'1',quiz_q3:'What is a hash function?',quiz_q3a:'Encryption method',quiz_q3b:'One-way function producing fixed-size output',quiz_q3c:'Compression algorithm',quiz_q3d:'Random number generator',quiz_q3_answer:'1',quiz_q4:'What does RSA stand for?',quiz_q4a:'Random Secure Algorithm',quiz_q4b:'Rivest-Shamir-Adleman',quiz_q4c:'Rapid Signal Authentication',quiz_q4d:'Radio Security Architecture',quiz_q4_answer:'1',quiz_q5:'What is a neural network?',quiz_q5a:'Physical wires',quiz_q5b:'Computing system inspired by biological neurons',quiz_q5c:'Social network',quiz_q5d:'Radio network',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'Alan Turing\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.',realworld2:'The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.',realworld3:'Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In AI frontier, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in AI frontier and reveal the hidden complexity beneath simple-looking systems.',proTipTitle:'💡 Pro Tips',proTip1:'Open your browser\\x27s Developer Console (F12) to see the raw data behind the visualization. The simulation logs every calculation — this is how you verify the math.',proTip2:'Use your browser\\x27s Performance tab to measure frame rate. If the simulation drops below 30fps, reduce the data points or update interval for smoother animation.',funFactTitle:'🎯 Did You Know?',funFact:'A 256-bit AES key has more possible combinations (2²⁵⁶) than atoms in the observable universe (≈2²⁶⁶). Even checking a trillion keys per second, brute-forcing would take longer than the age of the universe.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.',voiceTitle:'🎤 Voice',voiceOn:'Voice ON',voiceOff:'Voice OFF',voiceListening:'Listening...',voiceCmd:'Command recognised',voiceHelp:'Say: start, stop, reset, help, theme, next, previous',voice_cmds:'start / stop / reset / help / theme / next / previous',shareTitle:'📤 Share',shareBtn:'📤 Share',shareCopied:'Copied to clipboard!',shareGenerate:'Generate Summary',shareExport:'Export JSON',missionTitle:'MISSION BRIEFING',missionClassified:'CLASSIFIED',missionObjective:'Your mission objective:',missionAgent:'AGENT-373D87',missionSkip:'Skip',missionGo:'ACCEPT MISSION',mission_obj:'Explore and master Length Extension Lab \u2014 analyze, experiment, and complete all challenges.',nightVisionTitle:'Night Vision Mode',nightVisionOn:'NV ON',nightVisionOff:'NV OFF',nightVisionAuto:'Auto NV',},
fr:{tooltipTitle:'Infobulles intelligentes',tooltipToggle:'Activer les infobulles',tip_start:'Lancer la simulation et observer la visualisation s\x27animer',tip_stop:'Mettre en pause la simulation en conservant l\x27état actuel',tip_reset:'Effacer toutes les données et revenir aux conditions initiales',tip_slider:'Glisser pour ajuster ce paramètre — la visualisation se met à jour en temps réel',tip_theme:'Basculer entre 8 thèmes visuels dont 2 thèmes clairs islamiques',tip_help:'Ouvrir le panneau d\x27aide avec FAQ, guides, wiki et défis',explorerTitle:'Explorateur d\x27espace paramétrique',explorerStart:'Auto-Explorer',explorerStop:'Arrêter l\x27exploration',explorerProgress:'Exploration des combinaisons...',explorerResult:'Exploration terminée',explorerInfo:'Teste systématiquement min/milieu/max pour chaque curseur et enregistre les résultats',title:'Labo Extension de Longueur',subtitle:'Exploitez Merkle-Damgard pour forger des MACs',mainSection:'Attaque Extension de Longueur',mainDesc:'Forgez un MAC valide en etendant un condensat connu',computeMAC:'Calculer MAC',forgeMAC:'Forger MAC Etendu',results:'Resultats',vizTitle:'Visualisation Merkle-Damgard',peerTitle:'👥 Peer Mode',peerConnect:'Connect',peerDisconnect:'Disconnect',peerStatus:'Peer Status',peerSend:'Sent',peerReceive:'Received',peerInfo:'Open this app in two tabs to sync parameters via BroadcastChannel',heatmapTitle:'📅 Activity Heatmap',heatmapToday:'Today',heatmapStreak:'Streak',heatmapTotal:'Total',heatmapLegend:'Less \u2192 More',vizHint:'Voyez comment la chaine permet l\'extension',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',macComputed:'MAC calcule',forged:'MAC forge avec succes!',howto_1:'L écran principal affiche la simulation Length Extension Lab. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Length Extension Lab. Choose yo',howto_2:'Cliquez Calculer MAC.',howto_3:'Entrez les donnees a ajouter.',howto_4:'Cliquez Forger.',wiki_md:'Merkle-Damgard: traite par blocs, chaine les sorties.',wiki_ext:'Extension: utilise le hash comme etat initial, continue le hachage.',wiki_hmac:'HMAC: deux hachages imbriques empechent l\'extension.',mathExplain:'Attaque Extension de Longueur:\nDonne: MAC = H(secret || message)\nBut: H(secret || message || padding || ajout)',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Length Extension Lab est une simulation interactive qui démontre les concepts de attaques crypto. Forge valid MAC by extending known hash without the secret. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Timing Oracle Attack and Cry Meet In Middle Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
 wiki_history_title: '📜 Histoire de rétro-ingénierie',
 wiki_history: 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards. Length Extension Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
 wiki_math_title: '📐 Mathématiques de Length Extension Lab',
 wiki_math: 'Les mathématiques derrière Length Extension Lab : Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
 wiki_advanced_title: '🔬 Techniques avancées',
 wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de rétro-ingénierie utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
 wiki_compare_title: '⚖️ Comparaison des approches',
 wiki_compare: 'Il existe plusieurs approches pour rétro-ingénierie. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
 wiki_debug_title: '🔧 Guide de dépannage',
 wiki_debug: 'Problèmes courants en rétro-ingénierie : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
 wiki_ethics_title: '⚖️ Éthique et aspects légaux',
 wiki_ethics: 'Rétro-ingénierie implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
 gloss1_term: 'Collision',
 gloss1_def: 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
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
 theory: 'Length Extension Lab démontre les principes clés de attaques crypto. Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change). Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
 faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
 faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
 faq_q10: 'Quel est le lien avec reverse engineering dans le monde réel ?',
 faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
 glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Systeme RF Anti-Drone',related1_desc:'Detecter, suivre et neutraliser les drones',related1_path:'../../54-rf-warfare/rfw-anti-drone-system/index.html',related2_name:'Simulateur Energie Dirigee',related2_desc:'Simulation faisceau RF haute puissance',related2_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',related3_name:'Tableau de bord station distante',related3_desc:'Station de contrôle et d\\',related3_path:'../../38-pi-antenna/pi-remote-antenna-station/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Recuperation de Cle',pathPrev_path:'../../53-crypto-attacks/cry-known-plaintext-attack/index.html',pathNext_name:'Attaque par le Milieu',pathNext_path:'../../53-crypto-attacks/cry-meet-in-middle-lab/index.html',
 printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'équipe d\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.',realworld2:'L\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.',realworld3:'Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En frontière IA, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en frontière IA et révèlent la complexité cachée sous des systèmes simples en apparence.',voiceTitle:'🎤 Voix',voiceOn:'Voix ON',voiceOff:'Voix OFF',voiceListening:'Écoute...',voiceCmd:'Commande reconnue',voiceHelp:'Dites : démarrer, arrêter, aide, thème, suivant, précédent',voice_cmds:'démarrer / arrêter / aide / thème / suivant / précédent',shareTitle:'📤 Partager',shareBtn:'📤 Partager',shareCopied:'Copié dans le presse-papiers !',shareGenerate:'Générer le résumé',shareExport:'Exporter JSON',missionTitle:'BRIEFING DE MISSION',missionClassified:'CLASSIFI\xc9',missionObjective:'Objectif de mission :',missionAgent:'AGENT-373D87',missionSkip:'Passer',missionGo:'ACCEPTER LA MISSION',mission_obj:'Explorer et ma\xeetrisez Length Extension Lab \u2014 analysez, exp\xe9rimentez et compl\xe9tez tous les d\xe9fis.',nightVisionTitle:'Mode Vision Nocturne',nightVisionOn:'VN ON',nightVisionOff:'VN OFF',nightVisionAuto:'VN Auto',},
ar:{tooltipTitle:'تلميحات ذكية',tooltipToggle:'تبديل التلميحات',tip_start:'ابدأ المحاكاة وشاهد الرسم البياني ينبض بالحياة',tip_stop:'أوقف المحاكاة مؤقتاً مع الحفاظ على الحالة الحالية',tip_reset:'امسح جميع البيانات وعد إلى الشروط الأولية',tip_slider:'اسحب لضبط هذا المعامل — يتحدث الرسم البياني في الوقت الفعلي',tip_theme:'بدّل بين 8 مظاهر مرئية منها تصميمان إسلاميان فاتحان',tip_help:'افتح لوحة المساعدة مع الأسئلة الشائعة والأدلة والويكي والتحديات',explorerTitle:'مستكشف فضاء المعاملات',explorerStart:'استكشاف تلقائي',explorerStop:'إيقاف الاستكشاف',explorerProgress:'جارٍ استكشاف التوليفات...',explorerResult:'اكتمل الاستكشاف',explorerInfo:'يختبر بشكل منهجي الحد الأدنى/الوسط/الأقصى لكل منزلق ويسجل النتائج',title:'مختبر تمديد الطول',subtitle:'استغل بنية ميركل-دامغارد لتزوير MACs',mainSection:'هجوم تمديد الطول',peerTitle:'👥 Mode Pair',peerConnect:'Connecter',peerDisconnect:'D\xe9connecter',peerStatus:'Statut pair',peerSend:'Envoy\xe9',peerReceive:'Re\xe7u',peerInfo:'Ouvrez cette app dans deux onglets pour synchroniser les param\xe8tres',heatmapTitle:'📅 Carte d\x27activit\xe9',heatmapToday:'Aujourd\x27hui',heatmapStreak:'S\xe9rie',heatmapTotal:'Total',heatmapLegend:'Moins \u2192 Plus',mainDesc:'زوّر MAC صالح بتمديد تجزئة معروفة بدون السر',computeMAC:'حساب MAC',forgeMAC:'تزوير MAC ممتد',results:'النتائج',vizTitle:'تصور ميركل-دامغارد',vizHint:'شاهد كيف تسمح السلسلة بالتمديد',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',macComputed:'تم حساب MAC',forged:'تم تزوير MAC بنجاح!',howto_1:'تعرض الشاشة الرئيسية محاكاة Length Extension Lab. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Length Extension Lab. Choose yo',howto_2:'اضغط حساب MAC.',howto_3:'أدخل البيانات المراد إضافتها.',howto_4:'اضغط تزوير.',wiki_md:'ميركل-دامغارد: معالجة بالكتل، سلسلة مخرجات الضغط.',wiki_ext:'التمديد: استخدام مخرج التجزئة كحالة أولية.',wiki_hmac:'HMAC: تجزئتان متداخلتان تمنعان التمديد.',mathExplain:'هجوم تمديد الطول:\nمعطى: MAC = H(سر || رسالة)\nالهدف: H(سر || رسالة || حشو || إضافة)',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Length Extension Lab هي محاكاة تفاعلية توضح مفاهيم هجمات التشفير. Forge valid MAC by extending known hash without the secret. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Timing Oracle Attack and Cry Meet In Middle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
 wiki_history_title: '📜 تاريخ الهندسة العكسية',
 wiki_history: 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards. يبني Length Extension Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
 wiki_math_title: '📐 الرياضيات وراء Length Extension Lab',
 wiki_math: 'الرياضيات وراء Length Extension Lab: Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
 wiki_advanced_title: '🔬 تقنيات متقدمة',
 wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الهندسة العكسية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
 wiki_compare_title: '⚖️ مقارنة الأساليب',
 wiki_compare: 'هناك عدة أساليب في الهندسة العكسية. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
 wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
 wiki_debug: 'مشاكل شائعة في الهندسة العكسية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
 wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
 wiki_ethics: 'الهندسة العكسية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
 gloss1_term: 'Collision',
 gloss1_def: 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
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
 theory: 'Length Extension Lab يوضح المبادئ الأساسية في هجمات التشفير. Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change). Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
 faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
 faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
 faq_q10: 'كيف يرتبط هذا بـreverse engineering في العالم الحقيقي؟',
 faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
 glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0646\\u0638\\u0627\\u0645 RF \\u0645\\u0636\\u0627\\u062f \\u0644\\u0644\\u0637\\u0627\\u0626\\u0631\\u0627\\u062a',related1_desc:'\\u0643\\u0634\\u0641 \\u0648\\u062a\\u062a\\u0628\\u0639 \\u0648\\u062a\\u062d\\u064a\\u064a\\u062f \\u0627\\u0644\\u0637\\u0627\\u0626\\u0631\\u0627\\u062a \\u0628\\u062f\\u0648\\u0646 \\u0637\\u064a\\u0627\\u0631',related1_path:'../../54-rf-warfare/rfw-anti-drone-system/index.html',related2_name:'\\u0645\\u062d\\u0627\\u0643\\u064a \\u0627\\u0644\\u0637\\u0627\\u0642\\u0629 \\u0627\\u0644\\u0645\\u0648\\u062c\\u0647\\u0629',related2_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u062d\\u0632\\u0645\\u0629 RF \\u0639\\u0627\\u0644\\u064a\\u0629 \\u0627\\u0644\\u0637\\u0627\\u0642\\u0629',related2_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',related3_name:'لوحة تحكم المحطة البعيدة',related3_desc:'محطة تحكم وتشغيل هوائي عن بعد كاملة',related3_path:'../../38-pi-antenna/pi-remote-antenna-station/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'استرجاع المفتاح',pathPrev_path:'../../53-crypto-attacks/cry-known-plaintext-attack/index.html',pathNext_name:'هجوم اللقاء في المنتصف',pathNext_path:'../../53-crypto-attacks/cry-meet-in-middle-lab/index.html',
 printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945.',realworld2:'اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة.',realworld3:'كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في حدود الذكاء معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في حدود الذكاء وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',voiceTitle:'🎤 صوت',voiceOn:'الصوت مفعل',voiceOff:'الصوت معطل',voiceListening:'جاري الاستماع...',voiceCmd:'تم التعرف على الأمر',voiceHelp:'قل: ابدأ، توقف، مساعدة',voice_cmds:'ابدأ / توقف / مساعدة',shareTitle:'📤 مشاركة',shareBtn:'📤 مشاركة',shareCopied:'تم النسخ!',shareGenerate:'إنشاء ملخص',shareExport:'تصدير JSON',peerTitle:'👥 \u0648\u0636\u0639 \u0627\u0644\u0646\u0638\u064a\u0631',peerConnect:'\u0627\u062a\u0635\u0627\u0644',peerDisconnect:'\u0642\u0637\u0639',peerStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0638\u064a\u0631',peerSend:'\u0623\u0631\u0633\u0644',peerReceive:'\u0627\u0633\u062a\u0644\u0645',peerInfo:'\u0627\u0641\u062a\u062d \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0641\u064a \u062a\u0628\u0648\u064a\u0628\u064a\u0646 \u0644\u0644\u0645\u0632\u0627\u0645\u0646\u0629',heatmapTitle:'📅 \u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0646\u0634\u0627\u0637',heatmapToday:'\u0627\u0644\u064a\u0648\u0645',heatmapStreak:'\u0633\u0644\u0633\u0644\u0629',heatmapTotal:'\u0627\u0644\u0645\u062c\u0645\u0648\u0639',heatmapLegend:'\u0623\u0642\u0644 \u2192 \u0623\u0643\u062b\u0631',missionTitle:'\u0625\u062D\u0627\u0637\u0629 \u0627\u0644\u0645\u0647\u0645\u0629',missionClassified:'\u0633\u0631\u064A',missionObjective:'\u0647\u062F\u0641 \u0627\u0644\u0645\u0647\u0645\u0629:',missionAgent:'AGENT-373D87',missionSkip:'\u062A\u062E\u0637\u064A',missionGo:'\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0647\u0645\u0629',mission_obj:'\u0627\u0633\u062A\u0643\u0634\u0641 \u0648\u0623\u062A\u0642\u0646 \u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u2014 \u062D\u0644\u0644 \u0648\u062C\u0631\u0628 \u0648\u0623\u0643\u0645\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A.',nightVisionTitle:'\u0648\u0636\u0639 \u0627\u0644\u0631\u0624\u064A\u0629 \u0627\u0644\u0644\u064A\u0644\u064A\u0629',nightVisionOn:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 ON',nightVisionOff:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 OFF',nightVisionAuto:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A',}};

/* ═══════ Difficulty Levels ═══════ */
function initDifficultyLevels(){
 if(document.getElementById('diffToggleBar'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='diff_'+appDir;
 var saved=localStorage.getItem(storageKey)||'intermediate';
 /* inject CSS */
 var style=document.createElement('style');
 style.textContent=''
 +'.diff-beginner .sim-controls input[type="range"]:nth-of-type(n+4),.diff-beginner .sim-controls .slider-row:nth-of-type(n+4){display:none !important;}'
 +'.diff-beginner label,.diff-beginner .sidebar-label{font-size:1rem !important;}'
 +'.diff-beginner .card-subtitle{font-size:0.95rem !important;}'
 +'.diff-expert{font-size:0.88rem;}'
 +'.diff-expert .card,.diff-expert .collapsible{padding:0.5rem !important;}'
 +'.diff-expert .card-header{padding:0.4rem 0.5rem !important;}'
 +'.diff-toggle-bar{display:flex;gap:0.4rem;align-items:center;padding:0.4rem 0.6rem;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);margin-bottom:0.5rem;flex-wrap:wrap;}'
 +'.diff-toggle-bar button{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;transition:all 0.2s;}'
 +'.diff-toggle-bar button.active{background:var(--accent,#d4a03c);color:var(--bg,#08091a);font-weight:700;border-color:var(--accent,#d4a03c);}'
 +'.diff-toggle-bar .diff-label{font-size:0.75rem;opacity:0.6;margin-right:0.3rem;}'
 +'#diffExpertData{display:none;margin:0.5rem 0;padding:0.6rem;border-radius:8px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:0.7rem;color:#8f8;max-height:120px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;}'
 +'.diff-expert #diffExpertData{display:block;}';
 document.head.appendChild(style);
 /* build toggle bar */
 var bar=document.createElement('div');
 bar.id='diffToggleBar';
 bar.className='diff-toggle-bar';
 bar.innerHTML='<span class="diff-label" data-i18n="diffTitle">'+(L.diffTitle||'Difficulty')+'</span>'
 +'<button data-diff="beginner" data-i18n="diffBeginner">'+(L.diffBeginner||'🟢 Beginner')+'</button>'
 +'<button data-diff="intermediate" data-i18n="diffIntermediate">'+(L.diffIntermediate||'🟡 Intermediate')+'</button>'
 +'<button data-diff="expert" data-i18n="diffExpert">'+(L.diffExpert||'🔴 Expert')+'</button>'
 +'<span style="font-size:0.65rem;opacity:0.4;margin-left:auto;" data-i18n="diffInfo">'+(L.diffInfo||'Choose your complexity level')+'</span>';
 var header=document.querySelector('.header');
 if(header&&header.parentNode){header.parentNode.insertBefore(bar,header.nextSibling);}
 else{var app=document.querySelector('.app')||document.body;app.insertBefore(bar,app.firstChild);}
 /* expert data readout */
 var expertDiv=document.createElement('div');
 expertDiv.id='diffExpertData';
 var mainCard=document.getElementById('mainCard');
 if(mainCard&&mainCard.parentNode){mainCard.parentNode.insertBefore(expertDiv,mainCard.nextSibling);}
 function setDiff(level){
 document.body.classList.remove('diff-beginner','diff-intermediate','diff-expert');
 document.body.classList.add('diff-'+level);
 bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-diff')===level);});
 localStorage.setItem(storageKey,level);
 if(level==='beginner'){
 var hw=document.querySelector('details.collapsible');
 if(hw&&!hw.open)hw.open=true;
 }
 if(level==='expert'){updateExpertData();}
 else{expertDiv.textContent='';}
 }
 function updateExpertData(){
 if(!document.body.classList.contains('diff-expert'))return;
 var data={};
 document.querySelectorAll('input[type="range"]').forEach(function(s){
 var label=s.previousElementSibling?s.previousElementSibling.textContent:s.id;
 data[label||s.id||'slider']=parseFloat(s.value).toFixed(4);
 });
 document.querySelectorAll('select').forEach(function(s){
 if(s.id!=='langSelect'&&s.id!=='themeSelect'){
 data[s.id||'select']=s.value;
 }
 });
 expertDiv.textContent=JSON.stringify(data,null,2);
 }
 bar.addEventListener('click',function(e){
 var btn=e.target.closest('button[data-diff]');
 if(btn)setDiff(btn.getAttribute('data-diff'));
 });
 setDiff(saved);
 /* update expert readout periodically */
 setInterval(function(){if(document.body.classList.contains('diff-expert'))updateExpertData();},2000);
 /* listen for slider changes */
 document.addEventListener('input',function(e){if(e.target.type==='range'&&document.body.classList.contains('diff-expert'))updateExpertData();});
}

/* ═══════ Spaced Repetition ═══════ */
function initSpacedRepetition(){
 if(document.getElementById('spacedPanel'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='spaced_'+appDir;
 var now=Date.now();
 var DAY=86400000;
 /* load or create record */
 var rec;
 try{rec=JSON.parse(localStorage.getItem(storageKey));}catch(e){rec=null;}
 if(!rec){rec={visits:0,lastVisit:0,interval:1,ease:2.5};}
 /* SM-2 inspired update */
 var timeSinceLast=now-rec.lastVisit;
 var intervalMs=rec.interval*DAY;
 if(rec.visits===0){
 rec.interval=1;
 }else if(rec.visits===1){
 rec.interval=3;
 }else{
 if(timeSinceLast<intervalMs*0.5){
 /* visited too early, keep interval */
 }else if(timeSinceLast>intervalMs){
 /* visited late, reduce ease slightly */
 rec.ease=Math.max(1.3,rec.ease-0.15);
 rec.interval=Math.round(rec.interval*rec.ease);
 }else{
 rec.interval=Math.round(rec.interval*rec.ease);
 }
 }
 rec.visits++;
 rec.lastVisit=now;
 localStorage.setItem(storageKey,JSON.stringify(rec));
 /* determine status */
 var nextReviewMs=rec.lastVisit+rec.interval*DAY;
 var status,statusIcon,statusClass;
 if(rec.visits<=1){
 status=L.spacedNew||'New — not yet studied';statusIcon='⚪';statusClass='spaced-new';
 }else if(now>nextReviewMs){
 status=L.spacedDue||'Due for review!';statusIcon='🔴';statusClass='spaced-due';
 }else if(nextReviewMs-now<DAY){
 status=(L.spacedNext||'Next review')+': '+(L.spacedReview||'Review')+' — tomorrow';statusIcon='🟡';statusClass='spaced-soon';
 }else{
 var daysLeft=Math.ceil((nextReviewMs-now)/DAY);
 status=(L.spacedMastered||'Mastered')+' — '+(L.spacedNext||'Next review')+''+daysLeft+' days';statusIcon='🟢';statusClass='spaced-mastered';
 }
 /* scan other apps for due reviews */
 var totalVisited=0,dueCount=0,masteredCount=0;
 var dueApps=[];
 for(var i=0;i<localStorage.length;i++){
 var key=localStorage.key(i);
 if(key&&key.indexOf('spaced_')===0){
 try{
 var other=JSON.parse(localStorage.getItem(key));
 if(other&&other.visits>0){
 totalVisited++;
 var otherNext=other.lastVisit+other.interval*DAY;
 if(now>otherNext){
 dueCount++;
 dueApps.push(key.replace('spaced_',''));
 }else{
 masteredCount++;
 }
 }
 }catch(e){}
 }
 }
 /* inject CSS */
 var style=document.createElement('style');
 style.textContent=''
 +'#spacedPanel{padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);}'
 +'#spacedPanel h4{margin:0 0 0.4rem;font-size:0.9rem;}'
 +'.spaced-status{display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.85rem;}'
 +'.spaced-status .spaced-icon{font-size:1.1rem;}'
 +'.spaced-summary{display:flex;gap:1rem;flex-wrap:wrap;margin:0.5rem 0;font-size:0.75rem;opacity:0.7;}'
 +'.spaced-summary span{white-space:nowrap;}'
 +'.spaced-due-list{margin-top:0.5rem;font-size:0.75rem;max-height:80px;overflow-y:auto;}'
 +'.spaced-due-list a{color:var(--accent,#d4a03c);text-decoration:none;margin-right:0.5rem;}'
 +'.spaced-due-list a:hover{text-decoration:underline;}'
 +'#spacedMarkBtn{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid var(--accent,#d4a03c);background:rgba(var(--accent-rgb,212,175,55),0.15);color:inherit;cursor:pointer;font-size:0.78rem;margin-top:0.4rem;}'
 +'#spacedMarkBtn:hover{background:rgba(var(--accent-rgb,212,175,55),0.3);}';
 document.head.appendChild(style);
 /* build panel */
 var panel=document.createElement('div');
 panel.id='spacedPanel';
 var dueLinksHtml='';
 if(dueApps.length>0){
 dueLinksHtml='<div class="spaced-due-list"><strong>'+(L.spacedDue||'Due for review!')+'</strong><br>';
 dueApps.slice(0,8).forEach(function(d){
 dueLinksHtml+='<a href="../../'+d+'/index.html" title="'+d+'">'+d+'</a> ';
 });
 if(dueApps.length>8)dueLinksHtml+='<span>... +'+(dueApps.length-8)+' more</span>';
 dueLinksHtml+='</div>';
 }
 panel.innerHTML='<h4 data-i18n="spacedTitle">'+(L.spacedTitle||'📅 Spaced Review')+'</h4>'
 +'<div class="spaced-status"><span class="spaced-icon">'+statusIcon+'</span><span>'+status+'</span></div>'
 +'<div class="spaced-summary">'
 +'<span>📚 '+totalVisited+' visited</span>'
 +'<span>🔴 '+dueCount+' due</span>'
 +'<span>🟢 '+masteredCount+' on track</span>'
 +'</div>'
 +'<button id="spacedMarkBtn" data-i18n="spacedReview">✅ '+(L.spacedReview||'Mark as Reviewed')+'</button>'
 +dueLinksHtml
 +'<div style="font-size:0.65rem;opacity:0.4;margin-top:0.4rem;" data-i18n="spacedInfo">'+(L.spacedInfo||'Smart review reminders based on the forgetting curve')+'</div>';
 /* insert near sidebar footer or after last collapsible */
 var target=document.querySelector('.sidebar-footer');
 if(target&&target.parentNode){
 target.parentNode.insertBefore(panel,target);
 }else{
 var lastDetails=document.querySelectorAll('details.collapsible');
 if(lastDetails.length>0){
 var ld=lastDetails[lastDetails.length-1];
 ld.parentNode.insertBefore(panel,ld.nextSibling);
 }else{
 var app=document.querySelector('.app')||document.body;
 app.appendChild(panel);
 }
 }
 /* mark as reviewed button */
 var markBtn=document.getElementById('spacedMarkBtn');
 if(markBtn){
 markBtn.addEventListener('click',function(){
 rec.lastVisit=Date.now();
 if(rec.visits>=3){
 rec.interval=Math.round(rec.interval*rec.ease);
 rec.ease=Math.min(3.0,rec.ease+0.1);
 }
 localStorage.setItem(storageKey,JSON.stringify(rec));
 markBtn.textContent='✅ '+(L.spacedMastered||'Reviewed!');
 markBtn.disabled=true;
 markBtn.style.opacity='0.5';
 });
 }
}

document.addEventListener('DOMContentLoaded',function(){try{initDifficultyLevels();}catch(e){console.warn('Difficulty init:',e);}try{initSpacedRepetition();}catch(e){console.warn('Spaced init:',e);}});



/* ═══════ Mini Terminal ═══════ */
function initTerminal(){
 if(document.getElementById('miniTerminal')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var visible=false, history=[], histIdx=-1, MAX_LINES=100;
 var wrap=document.createElement('div');wrap.id='miniTerminal';
 wrap.style.cssText='position:fixed;bottom:0;left:0;right:0;height:260px;background:#0a0a0a;border-top:2px solid #0f0;z-index:99999;display:none;flex-direction:column;font-family:monospace;font-size:13px;transition:transform 0.25s ease;transform:translateY(100%);';
 var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-bottom:1px solid #0f0;color:#0f0;';
 hdr.innerHTML='<span style="flex:1;font-weight:bold;" data-i18n="termTitle">'+(L.termTitle||'>_ Terminal')+'</span><button id="termCloseBtn" style="background:none;border:none;color:#0f0;font-size:18px;cursor:pointer;">\u2715</button>';
 var out=document.createElement('div');out.id='termOutput';out.style.cssText='flex:1;overflow-y:auto;padding:8px 10px;color:#0f0;white-space:pre-wrap;word-break:break-all;';
 var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-top:1px solid #222;';
 row.innerHTML='<span style="color:#0f0;margin-right:6px;">$</span>';
 var inp=document.createElement('input');inp.id='termInput';inp.type='text';inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');inp.placeholder=L.termPlaceholder||'Type a command...';
 inp.style.cssText='flex:1;background:transparent;border:none;outline:none;color:#0f0;font-family:monospace;font-size:13px;caret-color:#0f0;';
 row.appendChild(inp);wrap.appendChild(hdr);wrap.appendChild(out);wrap.appendChild(row);document.body.appendChild(wrap);
 var togBtn=document.createElement('button');togBtn.id='termToggleBtn';togBtn.textContent='>_';togBtn.title='Terminal';
 togBtn.style.cssText='position:fixed;bottom:10px;right:10px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#111;color:#0f0;border:1px solid #0f0;font-family:monospace;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
 togBtn.onmouseenter=function(){this.style.opacity='1';};togBtn.onmouseleave=function(){this.style.opacity='0.7';};
 document.body.appendChild(togBtn);
 function show(){wrap.style.display='flex';setTimeout(function(){wrap.style.transform='translateY(0)';},10);visible=true;inp.focus();}
 function hide(){wrap.style.transform='translateY(100%)';setTimeout(function(){wrap.style.display='none';},260);visible=false;}
 function toggle(){visible?hide():show();}
 togBtn.addEventListener('click',toggle);
 document.getElementById('termCloseBtn').addEventListener('click',hide);
 document.addEventListener('keydown',function(e){if(e.key==='`'&&!e.ctrlKey&&!e.altKey&&document.activeElement!==inp&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();toggle();}});
 function appendLine(txt,color){
 var d=document.createElement('div');d.style.color=color||'#0f0';d.textContent=txt;out.appendChild(d);
 while(out.children.length>MAX_LINES)out.removeChild(out.firstChild);
 out.scrollTop=out.scrollHeight;
 }
 appendLine(L.termWelcome||'Terminal ready. Type help to get started.','#0f0');
 function exec(cmd){
 cmd=cmd.trim();if(!cmd)return;
 history.push(cmd);histIdx=history.length;
 appendLine('> '+cmd,'#888');
 var parts=cmd.split(/\s+/),c=parts[0].toLowerCase(),args=parts.slice(1);
 switch(c){
 case 'help':appendLine(L.termHelp||'Commands: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher','#0f0');break;
 case 'start':if(typeof window.startSim==='function'){window.startSim();appendLine('Simulation started.','#0f0');}else{var sb=document.querySelector('[onclick*="start"]')||document.getElementById('startBtn');if(sb){sb.click();appendLine('Start triggered.','#0f0');}else appendLine('No start function found.','#f44');}break;
 case 'stop':if(typeof window.stopSim==='function'){window.stopSim();appendLine('Simulation stopped.','#0f0');}else{var sb2=document.querySelector('[onclick*="stop"]')||document.getElementById('stopBtn');if(sb2){sb2.click();appendLine('Stop triggered.','#0f0');}else appendLine('No stop function found.','#f44');}break;
 case 'reset':if(typeof window.resetSim==='function'){window.resetSim();appendLine('Simulation reset.','#0f0');}else{var sb3=document.querySelector('[onclick*="reset"]')||document.getElementById('resetBtn');if(sb3){sb3.click();appendLine('Reset triggered.','#0f0');}else appendLine('No reset function found.','#f44');}break;
 case 'theme':if(args[0]&&typeof window.setTheme==='function'){window.setTheme(args[0]);appendLine('Theme set to '+args[0],'#0f0');}else if(!args[0]){appendLine('Usage: theme [name] — mosque, zellige, andalus, riad, medina, space, jungle, robot','#ff0');}else{appendLine('setTheme not available.','#f44');}break;
 case 'lang':if(args[0]&&/^(en|fr|ar)$/.test(args[0])){document.documentElement.lang=args[0];if(typeof window.applyLang==='function')window.applyLang(args[0]);appendLine('Language set to '+args[0],'#0f0');}else{appendLine('Usage: lang [en|fr|ar]','#ff0');}break;
 case 'set':if(args.length>=2){var sliders=document.querySelectorAll('input[type=range]');var found=false;sliders.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){s.value=parseFloat(args[1]);s.dispatchEvent(new Event('input',{bubbles:true}));found=true;appendLine('Set '+args[0]+' = '+args[1],'#0f0');}});if(!found)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: set [param] [value]','#ff0');}break;
 case 'get':if(args[0]){var sliders2=document.querySelectorAll('input[type=range]');var found2=false;sliders2.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){appendLine(args[0]+' = '+s.value,'#0f0');found2=true;}});if(!found2)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: get [param]','#ff0');}break;
 case 'list':var sliders3=document.querySelectorAll('input[type=range]');if(sliders3.length===0){appendLine('No parameters found.','#ff0');}else{sliders3.forEach(function(s){var lbl=(s.previousElementSibling?s.previousElementSibling.textContent:s.parentElement?s.parentElement.textContent:'?').trim().substring(0,40);appendLine(''+lbl+' = '+s.value,'#0f0');});}break;
 case 'export':if(typeof window.exportLog==='function'){window.exportLog();appendLine('Export triggered.','#0f0');}else{appendLine('No export function available.','#f44');}break;
 case 'clear':out.innerHTML='';break;
 case 'status':var st=document.getElementById('statusText');appendLine('Status: '+(st?st.textContent:'unknown'),'#0f0');var sliders4=document.querySelectorAll('input[type=range]');appendLine('Parameters: '+sliders4.length,'#0f0');appendLine('Language: '+(document.documentElement.lang||'en'),'#0f0');break;
 case 'about':var ti=document.querySelector('[data-i18n="title"]');appendLine('App: '+(ti?ti.textContent:'Unknown'),'#0f0');appendLine('Framework: Vanilla JS + HTML5 Canvas','#0f0');appendLine('Trilingual: EN / FR / AR','#0f0');break;
 case 'cipher':if(typeof window.toggleCipherToolkit==='function'){window.toggleCipherToolkit();appendLine('Cipher toolkit opened.','#0f0');}else{appendLine('Cipher toolkit not available.','#f44');}break;
 default:appendLine(L.termUnknown||'Unknown command. Type help for available commands.','#f44');
 }
 }
 inp.addEventListener('keydown',function(e){
 if(e.key==='Enter'){exec(inp.value);inp.value='';}
 else if(e.key==='ArrowUp'){e.preventDefault();if(histIdx>0){histIdx--;inp.value=history[histIdx];}}
 else if(e.key==='ArrowDown'){e.preventDefault();if(histIdx<history.length-1){histIdx++;inp.value=history[histIdx];}else{histIdx=history.length;inp.value='';}}
 });
}
document.addEventListener('DOMContentLoaded',function(){try{initTerminal();}catch(e){console.warn('Terminal init:',e);}});


/* ═══════ Cipher Toolkit ═══════ */
function initCipherToolkit(){
 if(document.getElementById('cipherModal')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.' :'.-.-.-',',' :'--..--','?' :'..--..','':' / '};
 var RMORSE={};for(var k in MORSE)RMORSE[MORSE[k]]=k;
 function caesar(t,n,dec){n=parseInt(n)||3;if(dec)n=26-n;return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode((c.charCodeAt(0)-base+n)%26+base);});}
 function xorCipher(t,key){if(!key)key='K';var o='';for(var i=0;i<t.length;i++){o+=String.fromCharCode(t.charCodeAt(i)^key.charCodeAt(i%key.length));}return o;}
 function toMorse(t){return t.toUpperCase().split('').map(function(c){return MORSE[c]||c;}).join('');}
 function fromMorse(t){return t.split(' / ').map(function(w){return w.split('').map(function(c){return RMORSE[c]||c;}).join('');}).join('');}
 function rot13(t){return caesar(t,13,false);}
 function atbash(t){return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode(base+25-(c.charCodeAt(0)-base));});}
 function toBin(t){return t.split('').map(function(c){return ('00000000'+c.charCodeAt(0).toString(2)).slice(-8);}).join('');}
 function fromBin(t){return t.trim().split(/\s+/).map(function(b){return String.fromCharCode(parseInt(b,2));}).join('');}
 function encode(t,m,key){switch(m){case 'caesar':return caesar(t,key,false);case 'xor':return btoa(xorCipher(t,key));case 'morse':return toMorse(t);case 'base64':return btoa(unescape(encodeURIComponent(t)));case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return toBin(t);default:return t;}}
 function decode(t,m,key){switch(m){case 'caesar':return caesar(t,key,true);case 'xor':try{return xorCipher(atob(t),key);}catch(e){return 'Invalid input';}case 'morse':return fromMorse(t);case 'base64':try{return decodeURIComponent(escape(atob(t)));}catch(e){return 'Invalid Base64';}case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return fromBin(t);default:return t;}}
 var overlay=document.createElement('div');overlay.id='cipherOverlay';
 overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100000;display:none;align-items:center;justify-content:center;';
 var modal=document.createElement('div');modal.id='cipherModal';
 modal.style.cssText='background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:1.2rem;width:92%;max-width:420px;color:#e8e8e8;font-family:system-ui,sans-serif;max-height:90vh;overflow-y:auto;';
 modal.innerHTML='<div style="display:flex;align-items:center;margin-bottom:0.8rem;"><span style="flex:1;font-weight:bold;font-size:1.05rem;" data-i18n="cipherTitle">'+(L.cipherTitle||'\uD83D\uDD10 Cipher Toolkit')+'</span><button id="cipherCloseBtn" style="background:none;border:none;color:#e8e8e8;font-size:20px;cursor:pointer;">\u2715</button></div>'
 +'<textarea id="cipherIn" rows="3" placeholder="'+(L.cipherInput||'Input text')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;margin-bottom:0.6rem;" data-i18n-placeholder="cipherInput"></textarea>'
 +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;flex-wrap:wrap;">'
 +'<select id="cipherMethod" style="flex:1;min-width:120px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;"><option value="caesar">Caesar</option><option value="xor">XOR</option><option value="morse">Morse</option><option value="base64">Base64</option><option value="rot13">ROT13</option><option value="atbash">Atbash</option><option value="binary">Binary</option></select>'
 +'<input id="cipherKey" type="text" placeholder="'+(L.cipherKey||'Key')+'" value="3" style="width:70px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;" data-i18n-placeholder="cipherKey">'
 +'</div>'
 +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">'
 +'<button id="cipherEncBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,180,80,0.2);color:#0f0;cursor:pointer;font-size:0.85rem;" data-i18n="cipherEncode">'+(L.cipherEncode||'Encode')+'</button>'
 +'<button id="cipherDecBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,120,255,0.2);color:#4af;cursor:pointer;font-size:0.85rem;" data-i18n="cipherDecode">'+(L.cipherDecode||'Decode')+'</button>'
 +'</div>'
 +'<div style="position:relative;"><textarea id="cipherOut" rows="3" readonly placeholder="'+(L.cipherOutput||'Output')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#0f0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;" data-i18n-placeholder="cipherOutput"></textarea>'
 +'<button id="cipherCopyBtn" style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#e8e8e8;cursor:pointer;padding:2px 8px;font-size:0.75rem;" data-i18n="cipherCopy">'+(L.cipherCopy||'Copy')+'</button></div>';
 overlay.appendChild(modal);document.body.appendChild(overlay);
 var cipherBtn=document.createElement('button');cipherBtn.id='cipherToggleBtn';cipherBtn.textContent='\uD83D\uDD10';cipherBtn.title='Cipher';
 cipherBtn.style.cssText='position:fixed;bottom:10px;right:56px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#1a1a2e;color:#e8e8e8;border:1px solid rgba(255,255,255,0.15);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
 cipherBtn.onmouseenter=function(){this.style.opacity='1';};cipherBtn.onmouseleave=function(){this.style.opacity='0.7';};
 document.body.appendChild(cipherBtn);
 function showCipher(){overlay.style.display='flex';}
 function hideCipher(){overlay.style.display='none';}
 window.toggleCipherToolkit=function(){overlay.style.display==='flex'?hideCipher():showCipher();};
 cipherBtn.addEventListener('click',window.toggleCipherToolkit);
 document.getElementById('cipherCloseBtn').addEventListener('click',hideCipher);
 overlay.addEventListener('click',function(e){if(e.target===overlay)hideCipher();});
 document.getElementById('cipherEncBtn').addEventListener('click',function(){
 var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
 document.getElementById('cipherOut').value=encode(t,m,k);
 });
 document.getElementById('cipherDecBtn').addEventListener('click',function(){
 var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
 document.getElementById('cipherOut').value=decode(t,m,k);
 });
 document.getElementById('cipherCopyBtn').addEventListener('click',function(){
 var o=document.getElementById('cipherOut');
 if(navigator.clipboard){navigator.clipboard.writeText(o.value).then(function(){document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);});}
 else{o.select();document.execCommand('copy');document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);}
 });
}
document.addEventListener('DOMContentLoaded',function(){try{initCipherToolkit();}catch(e){console.warn('Cipher init:',e);}});



/* ═══════ Particle Celebrations ═══════ */
function initParticles(){
 if(document.getElementById('particleCanvas')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var canvas=document.createElement('canvas');
 canvas.id='particleCanvas';
 canvas.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
 document.body.appendChild(canvas);
 var ctx=canvas.getContext('2d');
 var particles=[];
 var animId=null;
 var colors=['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#00d2d3'];
 function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
 resize();window.addEventListener('resize',resize);
 function drawStar(cx,cy,r){ctx.beginPath();for(var i=0;i<5;i++){var a=Math.PI/2+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r);a+=Math.PI/5;ctx.lineTo(cx+Math.cos(a)*r*0.4,cy-Math.sin(a)*r*0.4);}ctx.closePath();ctx.fill();}
 function spawnParticles(x,y,count){
 var n=count||Math.floor(50+Math.random()*30);
 for(var i=0;i<n;i++){
 var angle=Math.random()*Math.PI*2;
 var speed=2+Math.random()*6;
 var shape=Math.floor(Math.random()*3);
 particles.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
 color:colors[Math.floor(Math.random()*colors.length)],
 size:3+Math.random()*5,life:1,decay:0.008+Math.random()*0.012,
 shape:shape,rotation:Math.random()*Math.PI*2,rotSpeed:(Math.random()-0.5)*0.2});
 }
 if(!animId) animate();
 }
 function animate(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 for(var i=particles.length-1;i>=0;i--){
 var p=particles[i];
 p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.vx*=0.99;p.vy*=0.99;
 p.life-=p.decay;p.rotation+=p.rotSpeed;
 if(p.life<=0){particles.splice(i,1);continue;}
 ctx.save();ctx.globalAlpha=p.life;ctx.fillStyle=p.color;
 ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
 if(p.shape===0){ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}
 else if(p.shape===1){ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);}
 else{drawStar(0,0,p.size);}
 ctx.restore();
 }
 if(particles.length>0){animId=requestAnimationFrame(animate);}
 else{ctx.clearRect(0,0,canvas.width,canvas.height);animId=null;}
 }
 window.triggerCelebration=function(x,y){spawnParticles(x||window.innerWidth/2,y||window.innerHeight/2);};
 window.triggerFireworks=function(){
 for(var i=0;i<3;i++){
 (function(idx){setTimeout(function(){
 spawnParticles(100+Math.random()*(window.innerWidth-200),100+Math.random()*(window.innerHeight-300),70);
 },idx*400);})(i);
 }
 };
 /* Hook into achievement system */
 var origDispatch=window.dispatchEvent;
 window.addEventListener('achievement-unlocked',function(e){
 var rect=document.body.getBoundingClientRect();
 window.triggerCelebration(rect.width/2,rect.height/3);
 });
 /* Hook into quiz/challenge completion */
 document.addEventListener('click',function(e){
 var btn=e.target;
 if(!btn)return;
 var txt=(btn.textContent||'').toLowerCase();
 var idn=(btn.id||'').toLowerCase();
 /* Challenge reveal */
 if(idn.indexOf('reveal')>=0||idn.indexOf('answer')>=0||txt.indexOf('reveal')>=0){
 var r=btn.getBoundingClientRect();
 spawnParticles(r.left+r.width/2,r.top+r.height/2,30);
 }
 /* Quiz submit - check score after small delay */
 if(idn.indexOf('quiz')>=0&&(idn.indexOf('submit')>=0||txt.indexOf('submit')>=0)){
 setTimeout(function(){
 var scoreEl=document.querySelector('[id*="quizScore"]')||document.querySelector('[id*="score"]');
 if(scoreEl){
 var m=scoreEl.textContent.match(/(\d+)\s*[%\/]/);
 if(m){var pct=parseInt(m[1]);if(pct>60){window.triggerFireworks();}}
 }
 },500);
 }
 /* Daily challenge complete */
 if(idn.indexOf('daily')>=0&&(idn.indexOf('complete')>=0||idn.indexOf('done')>=0||txt.indexOf('complete')>=0)){
 window.triggerFireworks();
 }
 });
}

/* ═══════ Comparison Mode ═══════ */
function initComparisonMode(){
 if(document.getElementById('comparePanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appKey='compare_'+window.location.pathname.replace(/[^a-z0-9]/gi,'_');
 var saved=JSON.parse(localStorage.getItem(appKey)||'{"a":null,"b":null}');
 function getSliders(){
 var sliders=document.querySelectorAll('input[type="range"]');
 var data=[];
 sliders.forEach(function(s){
 var label='';
 var prev=s.previousElementSibling;
 if(prev&&(prev.tagName==='LABEL'||prev.tagName==='SPAN')){label=prev.textContent.trim();}
 if(!label){var lbl=s.closest('label');if(lbl){label=lbl.textContent.replace(/[\d.]+/g,'').trim();}}
 if(!label){var par=s.parentElement;if(par){var sp=par.querySelector('label,span,.label');if(sp)label=sp.textContent.trim();}}
 if(!label) label=s.id||s.name||('slider-'+data.length);
 data.push({id:s.id||('s'+data.length),label:label,value:parseFloat(s.value),min:parseFloat(s.min||0),max:parseFloat(s.max||100)});
 });
 return data;
 }
 function setSliders(data){
 if(!data)return;
 var sliders=document.querySelectorAll('input[type="range"]');
 data.forEach(function(d,i){
 if(sliders[i]){sliders[i].value=d.value;sliders[i].dispatchEvent(new Event('input',{bubbles:true}));}
 });
 }
 function buildTable(){
 if(!saved.a&&!saved.b) return '<div style="opacity:0.5;font-size:0.8rem;padding:0.5rem;">Save experiments to A and B slots to compare.</div>';
 var html='<table style="width:100%;border-collapse:collapse;font-size:0.78rem;margin-top:0.5rem;">';
 html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.15);"><th style="text-align:left;padding:4px;">Parameter</th>';
 html+='<th style="padding:4px;">'+(L.compareSlotA||'Exp A')+'</th>';
 html+='<th style="padding:4px;">'+(L.compareSlotB||'Exp B')+'</th>';
 html+='<th style="padding:4px;">\u0394 Change</th></tr>';
 var rows=saved.a||saved.b;
 if(rows){rows.forEach(function(r,i){
 var a=saved.a?saved.a[i]:null;
 var b=saved.b?saved.b[i]:null;
 var va=a?a.value:'-';var vb=b?b.value:'-';
 var delta='';var clr='rgba(255,255,255,0.5)';
 if(a&&b){
 var diff=b.value-a.value;
 if(a.value!==0){var pct=Math.round((diff/a.value)*100);delta=(diff>0?'+':'')+pct+'%';
 if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';else{clr='rgba(255,255,255,0.4)';delta='0%';}
 }else{delta=diff>0?'+'+diff.toFixed(1):diff.toFixed(1);if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';}
 }
 html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">';
 html+='<td style="padding:3px 4px;opacity:0.85;">'+(a?a.label:(b?b.label:''))+'</td>';
 html+='<td style="padding:3px 4px;text-align:center;">'+(typeof va==='number'?va.toFixed(1):va)+'</td>';
 html+='<td style="padding:3px 4px;text-align:center;">'+(typeof vb==='number'?vb.toFixed(1):vb)+'</td>';
 html+='<td style="padding:3px 4px;text-align:center;color:'+clr+';font-weight:600;">'+delta+'</td></tr>';
 });}
 html+='</table>';return html;
 }
 function persist(){localStorage.setItem(appKey,JSON.stringify(saved));}
 /* Build UI */
 var panel=document.createElement('div');
 panel.id='comparePanel';
 panel.style.cssText='display:none;padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 panel.innerHTML='<div style="font-weight:600;margin-bottom:0.5rem;" data-i18n="compareTitle">'+(L.compareTitle||'\xf0\x9f\x93\x8a Compare')+'</div>'
 +'<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;">'
 +'<button id="compareSaveA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(54,160,255,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' A</button>'
 +'<button id="compareSaveB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,107,107,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' B</button>'
 +'<button id="compareLoadA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' A</button>'
 +'<button id="compareLoadB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' B</button>'
 +'<button id="compareClear" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareClear">'+(L.compareClear||'Clear')+'</button>'
 +'</div>'
 +'<div id="compareTable"></div>';
 var toggleBtn=document.createElement('button');
 toggleBtn.id='compareToggleBtn';
 toggleBtn.style.cssText='padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;margin:0.3rem 0;';
 toggleBtn.setAttribute('data-i18n','compareTitle');
 toggleBtn.textContent=L.compareTitle||'\xf0\x9f\x93\x8a Compare';
 var target=document.getElementById('mainCard');
 if(target&&target.parentNode){target.parentNode.insertBefore(toggleBtn,target.nextSibling);toggleBtn.parentNode.insertBefore(panel,toggleBtn.nextSibling);}
 else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc){fc.appendChild(toggleBtn);fc.appendChild(panel);}}
 toggleBtn.addEventListener('click',function(){
 var v=panel.style.display;panel.style.display=v==='none'?'block':'none';
 if(v==='none'){document.getElementById('compareTable').innerHTML=buildTable();}
 });
 document.getElementById('compareSaveA').addEventListener('click',function(){saved.a=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
 document.getElementById('compareSaveB').addEventListener('click',function(){saved.b=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
 document.getElementById('compareLoadA').addEventListener('click',function(){setSliders(saved.a);});
 document.getElementById('compareLoadB').addEventListener('click',function(){setSliders(saved.b);});
 document.getElementById('compareClear').addEventListener('click',function(){saved={a:null,b:null};persist();document.getElementById('compareTable').innerHTML=buildTable();});
}
document.addEventListener('DOMContentLoaded',function(){try{initParticles();}catch(e){console.warn('Particles init:',e);}try{initComparisonMode();}catch(e){console.warn('Compare init:',e);}});









/* ═══════ LAB NOTEBOOK ═══════ */
function initLabNotebook(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.labTitle)return;var _labLog=[];var _labStart=Date.now();var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey=appDir+'_labLog';var btnGen=document.getElementById('labGenBtn');var btnExp=document.getElementById('labExpBtn');if(!btnGen)return;document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var prevVal=inp.value;inp.addEventListener('input',function(){_labLog.push({t:Date.now()-_labStart,param:inp.id||inp.name||'slider',oldVal:prevVal,newVal:inp.value});prevVal=inp.value;});});function genReport(){var title=document.title||appDir;var dur=Math.round((Date.now()-_labStart)/1000);var mins=Math.floor(dur/60);var secs=dur%60;var paramCounts={};var paramMins={};var paramMaxs={};_labLog.forEach(function(e){if(!paramCounts[e.param])paramCounts[e.param]=0;paramCounts[e.param]++;var v=parseFloat(e.newVal);if(!isNaN(v)){if(paramMins[e.param]===undefined||v<paramMins[e.param])paramMins[e.param]=v;if(paramMaxs[e.param]===undefined||v>paramMaxs[e.param])paramMaxs[e.param]=v;}});var params=Object.keys(paramCounts);var totalAdj=_labLog.length;var mostMod=params.length?params.reduce(function(a,b){return paramCounts[a]>paramCounts[b]?a:b;}):'-';var allSliders=document.querySelectorAll('input[type="range"],input[type="number"]');var coverage=allSliders.length?Math.round(params.length/allSliders.length*100):0;var obs='';params.forEach(function(p){obs+=' - '+p+': changed '+paramCounts[p]+' times';if(paramMins[p]!==undefined)obs+=', range '+paramMins[p]+'\u2192'+paramMaxs[p];obs+='\n';});var report='\u2550\u2550\u2550 LAB NOTEBOOK \u2550\u2550\u2550\n'+'App: '+title+'\n'+'Date: '+new Date().toISOString().slice(0,10)+'\n'+'Duration: '+mins+'m '+secs+'s\n\n'+L.labHypothesis+'\n"Changing '+mostMod+' affects '+title+' behavior"\n\n'+L.labMethod+'\nParameters tested: '+params.join(', ')+'\nTotal adjustments: '+totalAdj+'\n\n'+L.labObservation+'\n'+obs+'\n'+L.labConclusion+'\nMost sensitive parameter: '+mostMod+'\nExploration coverage: '+coverage+'%\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n';return report;}btnGen.onclick=function(){var report=genReport();var box=document.getElementById('labReportBox');if(box){box.textContent=report;box.style.display='block';}try{localStorage.setItem(storageKey,JSON.stringify({date:new Date().toISOString(),log:_labLog}));}catch(e){}if(typeof playSound==='function')playSound('success');};btnExp.onclick=function(){var report=genReport();var blob=new Blob([report],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=appDir+'-lab-report.txt';a.click();URL.revokeObjectURL(a.href);};}

/* ═══════ DATA RECORDER ═══════ */
function initDataRecorder(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.recorderTitle)return;var recBtn=document.getElementById('recStartBtn');var clearBtn=document.getElementById('recClearBtn');var expBtn=document.getElementById('recExpBtn');var recCanvas=document.getElementById('recCanvas');var recStatus=document.getElementById('recStatus');if(!recBtn||!recCanvas)return;var ctx=recCanvas.getContext('2d');var recording=false;var recData=[];var recTimer=null;var maxPts=500;function sampleValues(){var vals={};document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var k=inp.id||inp.name||'v'+Math.random().toString(36).slice(2,5);vals[k]=parseFloat(inp.value)||0;});document.querySelectorAll('[id]').forEach(function(el){if(el.tagName==='INPUT')return;var txt=el.textContent;var m=txt.match(/[\d]+\.?[\d]*/);if(m&&txt.length<20&&el.id)vals['_'+el.id]=parseFloat(m[0]);});return vals;}function drawGraph(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);if(recData.length<2)return;var keys=Object.keys(recData[0].values);var firstKey=keys[0];if(!firstKey)return;var vals=recData.map(function(d){return d.values[firstKey]||0;});var mn=Math.min.apply(null,vals);var mx=Math.max.apply(null,vals);if(mn===mx){mn-=1;mx+=1;}var w=recCanvas.width;var h=recCanvas.height;var pad=4;ctx.strokeStyle='#33ff88';ctx.lineWidth=1.5;ctx.beginPath();for(var i=0;i<vals.length;i++){var x=pad+(w-2*pad)*(i/(vals.length-1));var y=h-pad-(h-2*pad)*((vals[i]-mn)/(mx-mn));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#33ff8840';ctx.lineTo(w-pad,h-pad);ctx.lineTo(pad,h-pad);ctx.fill();}var rafId=null;function animLoop(){drawGraph();if(recording)rafId=requestAnimationFrame(animLoop);}recBtn.onclick=function(){if(!recording){recording=true;recBtn.textContent=L.recorderStop;recBtn.style.background='rgba(255,60,60,0.2)';recTimer=setInterval(function(){if(recData.length>=maxPts){clearInterval(recTimer);recording=false;recBtn.textContent=L.recorderStart;recBtn.style.background='';return;}recData.push({time:Date.now(),values:sampleValues()});recStatus.textContent=(L.recorderTitle||'Recording')+': '+recData.length+''+(L.recorderPoints||'pts');},500);rafId=requestAnimationFrame(animLoop);}else{recording=false;clearInterval(recTimer);if(rafId)cancelAnimationFrame(rafId);recBtn.textContent=L.recorderStart;recBtn.style.background='';drawGraph();}};clearBtn.onclick=function(){recData=[];recStatus.textContent='';ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);};expBtn.onclick=function(){if(!recData.length)return;var keys=Object.keys(recData[0].values);var header='time,'+keys.join(',')+'\n';var rows=recData.map(function(d){return d.time+','+keys.map(function(k){return d.values[k]||0;}).join(',');}).join('\n');var csv=header+rows;var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';a.download=appDir+'-recording.csv';a.click();URL.revokeObjectURL(a.href);};drawGraph();}

document.addEventListener('DOMContentLoaded',function(){initLabNotebook();initDataRecorder();});



/* ═══════ MISSION BRIEFING ═══════ */

/* Layout fix: secondary panels hidden by default */
(function(){
 var s=document.createElement('style');
 s.textContent=`
 .secondary-panel{display:none;margin:8px 0;padding:10px;border-radius:8px;background:var(--card-bg,#1a1a2e);border:1px solid rgba(255,255,255,0.1)}
 .secondary-panel.visible{display:block}
 .panel-toggle{cursor:pointer;padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:inherit;font-size:12px;margin:2px}
 .panel-toggle.active{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.4)}
 .tools-bar{display:flex;flex-wrap:wrap;gap:4px;padding:6px;margin:4px 0;border-radius:6px;background:rgba(0,0,0,0.2)}
 `;
 document.head.appendChild(s);
})();

function initMissionBriefing(){var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var ssKey='mission_seen_'+appDir;if(sessionStorage.getItem(ssKey))return;sessionStorage.setItem(ssKey,'1');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var overlay=document.createElement('div');overlay.id='missionOverlay';overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:monospace;color:#00ff41;overflow:hidden;';var stamp=document.createElement('div');stamp.textContent=L.missionClassified||'CLASSIFIED';stamp.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(3) rotate(-15deg);font-size:4rem;font-weight:bold;color:#ff0000;opacity:0;animation:stampIn 0.6s ease-out 0.3s forwards;pointer-events:none;text-transform:uppercase;letter-spacing:0.3em;';overlay.appendChild(stamp);var box=document.createElement('div');box.style.cssText='max-width:600px;padding:2rem;text-align:center;opacity:0;transition:opacity 0.5s;';var titleEl=document.createElement('h2');titleEl.textContent=L.missionTitle||'MISSION BRIEFING';titleEl.style.cssText='color:#00ff41;font-size:1.5rem;margin-bottom:1rem;letter-spacing:0.2em;text-transform:uppercase;';box.appendChild(titleEl);var objLabel=document.createElement('div');objLabel.textContent=L.missionObjective||'Your mission objective:';objLabel.style.cssText='color:#00aa30;font-size:0.9rem;margin-bottom:0.5rem;';box.appendChild(objLabel);var typewriter=document.createElement('div');typewriter.style.cssText='color:#00ff41;font-size:1.1rem;min-height:3rem;line-height:1.6;text-align:left;border-left:2px solid #00ff41;padding-left:1rem;margin:1rem 0;';box.appendChild(typewriter);var agentEl=document.createElement('div');agentEl.textContent=L.missionAgent||'AGENT-000000';agentEl.style.cssText='color:#ffaa00;font-size:1.2rem;margin:1rem 0;letter-spacing:0.15em;';box.appendChild(agentEl);var goBtn=document.createElement('button');goBtn.textContent=L.missionGo||'ACCEPT MISSION';goBtn.style.cssText='background:#00ff41;color:#000;border:none;padding:0.8rem 2rem;font-size:1rem;font-family:monospace;font-weight:bold;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-top:1rem;';goBtn.onmouseover=function(){this.style.background='#00cc33';};goBtn.onmouseout=function(){this.style.background='#00ff41';};goBtn.onclick=function(){dismiss();};box.appendChild(goBtn);overlay.appendChild(box);var skipEl=document.createElement('div');skipEl.textContent=L.missionSkip||'Skip';skipEl.style.cssText='position:absolute;top:1rem;right:1.5rem;color:#555;font-size:0.8rem;cursor:pointer;';skipEl.onclick=function(){dismiss();};overlay.appendChild(skipEl);var styleEl=document.createElement('style');styleEl.textContent='@keyframes stampIn{from{transform:translate(-50%,-50%) scale(3) rotate(-15deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(-12deg);opacity:0.8}}';document.head.appendChild(styleEl);document.body.appendChild(overlay);var missionText=L.mission_obj||'Complete all objectives.';var charIdx=0;setTimeout(function(){stamp.style.opacity='0';stamp.style.transition='opacity 0.5s';setTimeout(function(){stamp.style.display='none';},500);box.style.opacity='1';var iv=setInterval(function(){if(charIdx<missionText.length){typewriter.textContent+=missionText[charIdx];charIdx++;}else{clearInterval(iv);}},30);},1500);var autoTimer=setTimeout(function(){dismiss();},15000);function dismiss(){clearTimeout(autoTimer);if(overlay.parentNode){overlay.style.opacity='0';overlay.style.transition='opacity 0.4s';setTimeout(function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);},400);}}}
try{document.addEventListener('DOMContentLoaded',function(){initMissionBriefing();});}catch(e){}

/* ═══════ NIGHT VISION MODE ═══════ */
function initNightVision(){var nvStyle=document.createElement('style');nvStyle.textContent='.night-vision{filter:hue-rotate(80deg) saturate(1.5);background:#001100 !important;}.night-vision *{color:#00ff41 !important;border-color:#00ff4133 !important;}.night-vision::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(0,255,65,0.03) 0px,rgba(0,255,65,0.03) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:99998;}.night-vision .card,.night-vision .sidebar{background:#001a00 !important;}';document.head.appendChild(nvStyle);var hour=new Date().getHours();var stored=localStorage.getItem('nightVisionPref');var active=stored!==null?(stored==='on'):(hour>=20||hour<6);if(active)document.body.classList.add('night-vision');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var btn=document.createElement('button');btn.className='btn-icon-only';btn.textContent='NV';btn.title=L.nightVisionTitle||'Night Vision Mode';btn.style.cssText='font-size:0.65rem;cursor:pointer;';btn.onclick=function(){var isOn=document.body.classList.toggle('night-vision');localStorage.setItem('nightVisionPref',isOn?'on':'off');};var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');if(hdr){hdr.appendChild(btn);}else{btn.style.cssText+='position:fixed;top:0.5rem;right:0.5rem;z-index:9999;';document.body.appendChild(btn);}}
try{initNightVision();}catch(e){}

/* ═══════ DAILY CHALLENGE ═══════ */
function initDailyChallenge(){const L=LANG[document.documentElement.lang||'en'];const dc=document.getElementById('dailyChallenge');if(!dc||!L.dailyTitle)return;const dayIndex=new Date().getDay();const challengeKey='daily_d'+(dayIndex===0?7:dayIndex);const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const streakKey=appDir+'_streak';let streak=parseInt(localStorage.getItem(streakKey)||'0');const lastDate=localStorage.getItem(streakKey+'_date')||'';const today=new Date().toDateString();dc.innerHTML='<h3 data-i18n="dailyTitle">'+L.dailyTitle+'</h3>'+'<p style="font-size:0.95rem;margin:0.5rem 0;" data-i18n="'+challengeKey+'">'+(L[challengeKey]||'Complete today\x27s challenge!')+'</p>'+'<button class="btn-sm" id="dailyHintBtn" style="margin:0.3rem 0;" data-i18n="dailyHint">'+L.dailyHint+'</button>'+'<p id="dailyHintText" style="display:none;font-size:0.8rem;opacity:0.7;margin:0.3rem 0;">Think step by step. Break the problem into smaller parts.</p>'+'<div style="margin:0.5rem 0;font-size:1.1rem;">\ud83d\udd25 <span data-i18n="dailyStreak">'+L.dailyStreak+'</span>: <strong id="streakCount">'+streak+'</strong></div>'+'<button class="btn-sm" id="dailyCompleteBtn" data-i18n="dailyComplete">'+L.dailyComplete+'</button>';document.getElementById('dailyHintBtn').onclick=function(){const h=document.getElementById('dailyHintText');h.style.display=h.style.display==='none'?'block':'none';};document.getElementById('dailyCompleteBtn').onclick=function(){if(lastDate===today)return;streak++;localStorage.setItem(streakKey,streak);localStorage.setItem(streakKey+'_date',today);document.getElementById('streakCount').textContent=streak;this.textContent='\u2705';this.disabled=true;if(typeof playSound==='function')playSound('success');};}

/* ═══════ MENTOR MODE ═══════ */
function initMentorMode(){const L=LANG[document.documentElement.lang||'en'];const ov=document.getElementById('mentorOverlay');if(!ov||!L.mentorTitle)return;let step=0;const total=5;const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const doneKey=appDir+'_mentor_done';function renderStep(){const s=L['mentor_s'+(step+1)]||'Step '+(step+1);ov.innerHTML='<div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9998;" id="mentorBg"></div>'+'<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--card-bg,#1a1a2e);border:2px solid var(--accent,#d4af37);border-radius:12px;padding:1.5rem;max-width:400px;width:90%;text-align:center;color:var(--text,#fff);">'+'<h3 data-i18n="mentorTitle">'+L.mentorTitle+'</h3>'+'<p style="font-size:0.8rem;opacity:0.6;margin:0.3rem 0;">'+(L.mentorStep||'Step')+''+(step+1)+'/'+total+'</p>'+'<p style="font-size:0.95rem;line-height:1.5;margin:1rem 0;" data-i18n="mentor_s'+(step+1)+'">'+s+'</p>'+'<div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;">'+(step>0?'<button class="btn-sm" id="mentorPrevBtn" data-i18n="mentorPrev">'+(L.mentorPrev||'Previous')+'</button>':'')+(step<total-1?'<button class="btn-sm" id="mentorNextBtn" data-i18n="mentorNext">'+(L.mentorNext||'Next')+'</button>':'<button class="btn-sm" id="mentorDoneBtn" data-i18n="mentorDone">'+(L.mentorDone||'Finish')+'</button>')+'</div></div>';var bg=document.getElementById('mentorBg');if(bg)bg.onclick=closeMentor;if(document.getElementById('mentorPrevBtn'))document.getElementById('mentorPrevBtn').onclick=function(){step--;renderStep();};if(document.getElementById('mentorNextBtn'))document.getElementById('mentorNextBtn').onclick=function(){step++;renderStep();};if(document.getElementById('mentorDoneBtn'))document.getElementById('mentorDoneBtn').onclick=closeMentor;}function closeMentor(){ov.innerHTML='';ov.style.display='none';localStorage.setItem(doneKey,'1');}var tb=document.getElementById('mentorTriggerBtn');if(tb)tb.onclick=function(){step=0;ov.style.display='block';renderStep();};}

document.addEventListener('DOMContentLoaded',function(){initDailyChallenge();initMentorMode();});


/* ═══════ Voice Command Engine ═══════ */
function initVoiceControl(){
 if(document.getElementById('voiceBtn'))return;
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR)return;
 var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var btn=document.createElement('button');
 btn.className='voice-btn';btn.id='voiceBtn';
 btn.setAttribute('data-i18n','voiceTitle');
 btn.textContent=lang.voiceTitle||'\ud83c\udfa4 Voice';
 btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
 var ind=document.createElement('div');
 ind.className='voice-indicator';ind.id='voiceIndicator';
 ind.style.cssText='display:none;position:fixed;top:10px;right:10px;width:12px;height:12px;background:red;border-radius:50%;z-index:9999;';
 document.body.appendChild(ind);
 var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
 if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
 var recognition=new SR();
 recognition.continuous=true;recognition.interimResults=false;
 recognition.lang=document.documentElement.lang==='fr'?'fr-FR':document.documentElement.lang==='ar'?'ar-SA':'en-US';
 var active=false,silenceTimer=null;
 function stopListening(){
 active=false;recognition.stop();ind.style.display='none';
 btn.textContent=lang.voiceOff||'\ud83c\udfa4 Voice OFF';
 if(silenceTimer)clearTimeout(silenceTimer);
 }
 function startListening(){
 active=true;recognition.start();ind.style.display='block';
 ind.style.animation='voicePulse 1s infinite';
 btn.textContent=lang.voiceListening||'\ud83c\udfa4 Listening...';
 resetSilenceTimer();
 }
 function resetSilenceTimer(){
 if(silenceTimer)clearTimeout(silenceTimer);
 silenceTimer=setTimeout(function(){stopListening();},30000);
 }
 if(!document.getElementById('voicePulseStyle')){
 var st=document.createElement('style');st.id='voicePulseStyle';
 st.textContent='@keyframes voicePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}';
 document.head.appendChild(st);
 }
 var cmdMap={
 'start':function(){var b=document.getElementById('startBtn')||document.querySelector('[data-action=start]');if(b)b.click();},
 'stop':function(){var b=document.getElementById('stopBtn')||document.querySelector('[data-action=stop]');if(b)b.click();},
 'reset':function(){var b=document.getElementById('resetBtn')||document.querySelector('[data-action=reset]');if(b)b.click();},
 'help':function(){var b=document.getElementById('helpBtn');if(b)b.click();},
 'theme':function(){var b=document.getElementById('settingsBtn');if(b)b.click();},
 'next':function(){var a=document.getElementById('pathNextLink');if(a&&a.href)location.href=a.href;},
 'previous':function(){var a=document.getElementById('pathPrevLink');if(a&&a.href)location.href=a.href;},
 'd\xe9marrer':function(){cmdMap['start']();},
 'arr\xeater':function(){cmdMap['stop']();},
 'aide':function(){cmdMap['help']();},
 '\u0627\u0628\u062f\u0623':function(){cmdMap['start']();},
 '\u062a\u0648\u0642\u0641':function(){cmdMap['stop']();}
 };
 recognition.onresult=function(e){
 resetSilenceTimer();
 for(var i=e.resultIndex;i<e.results.length;i++){
 if(e.results[i].isFinal){
 var t=e.results[i][0].transcript.trim().toLowerCase();
 for(var c in cmdMap){if(t.indexOf(c)!==-1){cmdMap[c]();break;}}
 }
 }
 };
 recognition.onerror=function(){if(active)try{recognition.start();}catch(x){}};
 recognition.onend=function(){if(active)try{recognition.start();}catch(x){}};
 btn.addEventListener('click',function(){if(active)stopListening();else startListening();});
}
try{initVoiceControl();}catch(e){}

/* ═══════ Share Results Engine ═══════ */
function initShareSystem(){
 if(document.getElementById('shareBtn'))return;
 var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var btn=document.createElement('button');
 btn.className='share-btn';btn.id='shareBtn';
 btn.setAttribute('data-i18n','shareBtn');
 btn.textContent=lang.shareBtn||'\ud83d\udce4 Share';
 btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
 var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
 if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
 var expBtn=document.createElement('button');
 expBtn.className='btn-icon-only';expBtn.id='shareExportBtn';
 expBtn.setAttribute('data-i18n','shareExport');
 expBtn.textContent=lang.shareExport||'\ud83d\udce4 Export JSON';
 expBtn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
 if(tgt)tgt.appendChild(expBtn);else document.body.appendChild(expBtn);
 function gatherState(){
 var title=document.querySelector('h1')&&document.querySelector('h1').textContent||'Experiment';
 var params=[];
 document.querySelectorAll('input[type=range]').forEach(function(s){
 var lbl=s.previousElementSibling&&s.previousElementSibling.textContent||s.id||'param';
 params.push(lbl.trim()+': '+s.value);
 });
 var dot=document.getElementById('statusDot');
 var status=dot&&dot.classList.contains('active')?'Running':'Stopped';
 return{title:title,params:params,status:status};
 }
 function buildCard(st){
 var lines=['\ud83d\udd2c '+st.title+' \u2014 Experiment Results',
 '\u2501'.repeat(20),
 'Parameters: '+(st.params.length?st.params.join(' | '):'default'),
 'Status: '+st.status,
 '\u2501'.repeat(20),
 'Generated by Workshop-DIY'];
 return lines.join('\n');
 }
 function copyText(txt){
 if(navigator.clipboard&&navigator.clipboard.writeText){
 navigator.clipboard.writeText(txt).then(function(){showToast(lang.shareCopied||'Copied!');}).catch(function(){fallbackCopy(txt);});
 }else{fallbackCopy(txt);}
 }
 function fallbackCopy(txt){
 var ta=document.createElement('textarea');ta.value=txt;
 ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);
 ta.select();try{document.execCommand('copy');showToast(lang.shareCopied||'Copied!');}catch(e){}
 document.body.removeChild(ta);
 }
 function showToast(msg){
 var t=document.getElementById('toastMessage');
 if(t){t.textContent=msg;var p=t.parentElement&&t.parentElement.parentElement;if(p)p.classList.add('show');setTimeout(function(){if(p)p.classList.remove('show');},2000);}
 }
 btn.addEventListener('click',function(){
 var st=gatherState();var card=buildCard(st);copyText(card);
 });
 expBtn.addEventListener('click',function(){
 var st=gatherState();
 var logs=[];
 var logEl=document.getElementById('logContainer');
 if(logEl)logEl.querySelectorAll('.log-entry,.log-line').forEach(function(e){logs.push(e.textContent);});
 var data={title:st.title,params:st.params,status:st.status,logs:logs,exported:new Date().toISOString()};
 var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);
 a.download=(st.title.replace(/[^a-z0-9]/gi,'_')||'export')+'_data.json';
 a.click();URL.revokeObjectURL(a.href);
 });
}
try{initShareSystem();}catch(e){}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
 if(document.getElementById('sonifyPanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var panel=document.createElement('div');
 panel.id='sonifyPanel';
 panel.className='sonify-panel';
 panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
 +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
 +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
 +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
 +'</div>'
 +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
 +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
 +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
 +'</div>'
 +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
 +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
 var target=document.getElementById('mainCard');
 if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
 else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
 var actx=null,osc=null,gain=null,analyser=null,running=false;
 var toggle=document.getElementById('sonifyToggle');
 var status=document.getElementById('sonifyStatus');
 var freqDisp=document.getElementById('sonifyFreqDisp');
 var volSlider=document.getElementById('sonifyVolSlider');
 var wCanvas=document.getElementById('sonifyWaveCanvas');
 var wCtx=wCanvas.getContext('2d');
 function startAudio(){
 if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
 if(actx.state==='suspended'){actx.resume();}
 analyser=actx.createAnalyser();analyser.fftSize=256;
 osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
 gain=actx.createGain();gain.gain.value=volSlider.value/300;
 osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
 osc.start();running=true;drawWave();
 }
 function stopAudio(){
 running=false;
 try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
 try{if(gain){gain.disconnect();}}catch(e){}
 try{if(analyser){analyser.disconnect();}}catch(e){}
 osc=null;gain=null;analyser=null;
 wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
 }
 function drawWave(){
 if(!running||!analyser)return;
 var buf=new Uint8Array(analyser.frequencyBinCount);
 analyser.getByteTimeDomainData(buf);
 wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
 wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
 wCtx.beginPath();
 var sl=wCanvas.width/buf.length;var x=0;
 for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
 wCtx.stroke();requestAnimationFrame(drawWave);
 }
 function mapData(){
 var c=document.getElementById('simCanvas');
 if(!c)return 440;
 try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
 }
 var sonifyInterval=null;
 toggle.addEventListener('click',function(){
 if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
 status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
 }else{startAudio();
 sonifyInterval=setInterval(function(){
 if(!running||!osc)return;
 var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
 freqDisp.textContent=Math.round(f)+' Hz';
 if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
 },100);
 status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
 }
 });
 volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

/* ═══════ Smart Tooltips ═══════ */
function initTooltips(){
 if(document.getElementById('tooltipFloat')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var tipMap={};
 var allBtns=document.querySelectorAll('button');
 allBtns.forEach(function(b){
 var txt=(b.textContent||'').toLowerCase().trim();
 if(txt.indexOf('start')>-1||txt.indexOf('lancer')>-1||txt.indexOf('\u0627\u0628\u062f\u0623')>-1) tipMap[b.id||Math.random()]=L.tip_start||'Start the simulation';
 else if(txt.indexOf('stop')>-1||txt.indexOf('arr')>-1||txt.indexOf('\u0623\u0648\u0642\u0641')>-1) tipMap[b.id||Math.random()]=L.tip_stop||'Stop the simulation';
 else if(txt.indexOf('reset')>-1||txt.indexOf('effac')>-1||txt.indexOf('\u0627\u0645\u0633\u062d')>-1) tipMap[b.id||Math.random()]=L.tip_reset||'Reset to defaults';
 else if(txt.indexOf('theme')>-1||txt.indexOf('th\u00e8me')>-1||txt.indexOf('\u0627\u0644\u0645\u0638\u0647\u0631')>-1) tipMap[b.id||Math.random()]=L.tip_theme||'Change theme';
 else if(txt.indexOf('help')>-1||txt.indexOf('aide')>-1||txt.indexOf('\u0645\u0633\u0627\u0639\u062f')>-1) tipMap[b.id||Math.random()]=L.tip_help||'Open help';
 });
 var floatDiv=document.createElement('div');
 floatDiv.className='tooltip-float';
 floatDiv.id='tooltipFloat';
 floatDiv.style.cssText='display:none;position:fixed;z-index:9999;background:#1a1a2e;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;max-width:250px;pointer-events:none;transition:opacity 0.2s;opacity:0;';
 document.body.appendChild(floatDiv);
 var tooltipsEnabled=true;
 function showTip(e,text){
 if(!tooltipsEnabled) return;
 floatDiv.textContent=text;
 floatDiv.style.display='block';
 setTimeout(function(){floatDiv.style.opacity='1';},10);
 moveTip(e);
 }
 function moveTip(e){
 var isRTL=document.documentElement.dir==='rtl';
 var x=e.clientX,y=e.clientY;
 if(isRTL){
 floatDiv.style.left='';
 floatDiv.style.right=(window.innerWidth-x+12)+'px';
 } else {
 floatDiv.style.right='';
 floatDiv.style.left=(x+12)+'px';
 }
 floatDiv.style.top=(y+12)+'px';
 }
 function hideTip(){
 floatDiv.style.opacity='0';
 setTimeout(function(){floatDiv.style.display='none';},200);
 }
 allBtns.forEach(function(b){
 var key=b.id||Math.random();
 if(tipMap[key]){
 b.addEventListener('mouseenter',function(e){showTip(e,tipMap[key]);});
 b.addEventListener('mousemove',moveTip);
 b.addEventListener('mouseleave',hideTip);
 }
 });
 var sliders=document.querySelectorAll('input[type="range"]');
 sliders.forEach(function(s){
 var tipText=L.tip_slider||'Drag to adjust this parameter';
 s.addEventListener('mouseenter',function(e){showTip(e,tipText);});
 s.addEventListener('mousemove',moveTip);
 s.addEventListener('mouseleave',hideTip);
 });
 var toggleBtn=document.createElement('button');
 toggleBtn.className='btn-sm';
 toggleBtn.style.cssText='margin:0.3rem;font-size:12px;';
 toggleBtn.textContent=L.tooltipToggle||'Toggle Tooltips';
 toggleBtn.setAttribute('data-i18n','tooltipToggle');
 toggleBtn.addEventListener('click',function(){
 tooltipsEnabled=!tooltipsEnabled;
 toggleBtn.style.opacity=tooltipsEnabled?'1':'0.5';
 });
 var target=document.querySelector('.sidebar-footer')||document.querySelector('.card')||document.body;
 if(target) target.appendChild(toggleBtn);
}

/* ═══════ Parameter Space Explorer ═══════ */
function initExplorer(){
 if(document.getElementById('explorerPanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var sliders=document.querySelectorAll('input[type="range"]');
 if(sliders.length===0) return;
 var panel=document.createElement('div');
 panel.id='explorerPanel';
 panel.className='explorer-panel';
 panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 var title=L.explorerTitle||'Parameter Space Explorer';
 var startLabel=L.explorerStart||'Auto-Explore';
 var stopLabel=L.explorerStop||'Stop Exploration';
 var infoText=L.explorerInfo||'Systematically tests min/mid/max for each slider and records results';
 panel.innerHTML='<h4 style="margin:0 0 0.5rem 0;font-size:14px;" data-i18n="explorerTitle">'+title+'</h4>'
 +'<p style="font-size:12px;opacity:0.7;margin:0 0 0.5rem 0;" data-i18n="explorerInfo">'+infoText+'</p>'
 +'<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:0.5rem;">'
 +'<button id="explorerStartBtn" class="btn-sm" data-i18n="explorerStart">'+startLabel+'</button>'
 +'<button id="explorerStopBtn" class="btn-sm" style="display:none;" data-i18n="explorerStop">'+stopLabel+'</button>'
 +'<button id="explorerApplyBtn" class="btn-sm" style="display:none;">Apply Best</button>'
 +'</div>'
 +'<div id="explorerProgress" style="display:none;margin-bottom:0.5rem;">'
 +'<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">'
 +'<div id="explorerBar" style="height:100%;background:var(--accent,#00ff88);width:0%;transition:width 0.3s;"></div>'
 +'</div>'
 +'<span id="explorerPct" style="font-size:11px;opacity:0.7;">0%</span>'
 +'</div>'
 +'<div id="explorerResults" style="font-size:11px;max-height:200px;overflow-y:auto;"></div>';
 var wikiSection=document.querySelector('.wiki-entry')||document.querySelector('.sidebar-body')||document.querySelector('.card');
 if(wikiSection&&wikiSection.parentNode){
 wikiSection.parentNode.insertBefore(panel,wikiSection);
 } else {
 document.body.appendChild(panel);
 }
 var exploring=false;
 var explorerTimer=null;
 var results=[];
 var bestCombo=null;
 var bestScore=-Infinity;
 var startBtn=document.getElementById('explorerStartBtn');
 var stopBtn=document.getElementById('explorerStopBtn');
 var applyBtn=document.getElementById('explorerApplyBtn');
 var progressDiv=document.getElementById('explorerProgress');
 var barDiv=document.getElementById('explorerBar');
 var pctSpan=document.getElementById('explorerPct');
 var resultsDiv=document.getElementById('explorerResults');
 function getCanvasScore(){
 var canvas=document.querySelector('canvas');
 if(!canvas) return Math.random()*100;
 try{
 var ctx=canvas.getContext('2d');
 var data=ctx.getImageData(0,0,Math.min(canvas.width,100),Math.min(canvas.height,100)).data;
 var sum=0,nonZero=0;
 for(var i=0;i<data.length;i+=16){sum+=data[i]+data[i+1]+data[i+2];if(data[i]||data[i+1]||data[i+2])nonZero++;}
 return nonZero>0?(sum/nonZero):0;
 }catch(e){return Math.random()*100;}
 }
 function generateCombinations(){
 var combos=[];
 var sliderArr=Array.from(sliders);
 var levels=sliderArr.map(function(s){
 var mn=parseFloat(s.min)||0,mx=parseFloat(s.max)||100;
 return [mn,(mn+mx)/2,mx];
 });
 if(sliderArr.length<=2){
 function cartesian(arrays,prefix){
 if(arrays.length===0){combos.push(prefix.slice());return;}
 var first=arrays[0],rest=arrays.slice(1);
 for(var i=0;i<first.length;i++){prefix.push(first[i]);cartesian(rest,prefix);prefix.pop();}
 }
 cartesian(levels,[]);
 } else {
 for(var si=0;si<sliderArr.length;si++){
 for(var li=0;li<3;li++){
 var combo=sliderArr.map(function(s){return parseFloat(s.value);});
 combo[si]=levels[si][li];
 combos.push(combo);
 }
 }
 }
 return combos;
 }
 function runExploration(){
 exploring=true;
 results=[];
 bestScore=-Infinity;
 bestCombo=null;
 startBtn.style.display='none';
 stopBtn.style.display='';
 applyBtn.style.display='none';
 progressDiv.style.display='block';
 resultsDiv.innerHTML='';
 var combos=generateCombinations();
 var idx=0;
 var sliderArr=Array.from(sliders);
 var origValues=sliderArr.map(function(s){return s.value;});
 function step(){
 if(!exploring||idx>=combos.length){
 finishExploration(sliderArr,origValues);
 return;
 }
 var combo=combos[idx];
 sliderArr.forEach(function(s,i){
 s.value=combo[i];
 s.dispatchEvent(new Event('input',{bubbles:true}));
 });
 var pct=Math.round((idx+1)/combos.length*100);
 barDiv.style.width=pct+'%';
 pctSpan.textContent=pct+'%';
 setTimeout(function(){
 var score=getCanvasScore();
 results.push({combo:combo.slice(),score:score});
 if(score>bestScore){bestScore=score;bestCombo=combo.slice();}
 idx++;
 explorerTimer=setTimeout(step,120);
 },80);
 }
 step();
 }
 function finishExploration(sliderArr,origValues){
 exploring=false;
 startBtn.style.display='';
 stopBtn.style.display='none';
 progressDiv.style.display='none';
 barDiv.style.width='0%';
 sliderArr.forEach(function(s,i){
 s.value=origValues[i];
 s.dispatchEvent(new Event('input',{bubbles:true}));
 });
 var html='<table style="width:100%;border-collapse:collapse;font-size:11px;"><tr style="border-bottom:1px solid rgba(255,255,255,0.15);">';
 sliderArr.forEach(function(s,i){html+='<th style="padding:2px 4px;text-align:left;">P'+(i+1)+'</th>';});
 html+='<th style="padding:2px 4px;text-align:left;">Score</th></tr>';
 var sorted=results.slice().sort(function(a,b){return b.score-a.score;});
 var top=sorted.slice(0,12);
 top.forEach(function(r,ri){
 var bg=ri===0?'rgba(0,255,136,0.15)':'transparent';
 html+='<tr style="background:'+bg+';border-bottom:1px solid rgba(255,255,255,0.05);">';
 r.combo.forEach(function(v){html+='<td style="padding:2px 4px;">'+parseFloat(v).toFixed(1)+'</td>';});
 html+='<td style="padding:2px 4px;font-weight:bold;">'+r.score.toFixed(1)+'</td></tr>';
 });
 html+='</table>';
 if(results.length>0){
 html+='<div style="margin-top:0.3rem;font-size:11px;opacity:0.7;">'+(L.explorerResult||'Exploration Complete')+' — '+results.length+' combos tested</div>';
 }
 resultsDiv.innerHTML=html;
 if(bestCombo){
 applyBtn.style.display='';
 try{localStorage.setItem('wdiy-explorer-best',JSON.stringify(bestCombo));}catch(e){}
 }
 }
 startBtn.addEventListener('click',function(){
 if(!exploring) runExploration();
 });
 stopBtn.addEventListener('click',function(){
 exploring=false;
 });
 applyBtn.addEventListener('click',function(){
 var combo=bestCombo;
 try{var stored=localStorage.getItem('wdiy-explorer-best');if(stored) combo=JSON.parse(stored);}catch(e){}
 if(!combo) return;
 var sliderArr=Array.from(sliders);
 sliderArr.forEach(function(s,i){
 if(combo[i]!==undefined){s.value=combo[i];s.dispatchEvent(new Event('input',{bubbles:true}));}
 });
 });
}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
 if(document.getElementById('sonifyPanel')) return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var panel=document.createElement('div');
 panel.id='sonifyPanel';
 panel.className='sonify-panel';
 panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
 panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
 +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
 +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
 +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
 +'</div>'
 +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
 +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
 +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
 +'</div>'
 +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
 +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
 var target=document.getElementById('mainCard');
 if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
 else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
 var actx=null,osc=null,gain=null,analyser=null,running=false;
 var toggle=document.getElementById('sonifyToggle');
 var status=document.getElementById('sonifyStatus');
 var freqDisp=document.getElementById('sonifyFreqDisp');
 var volSlider=document.getElementById('sonifyVolSlider');
 var wCanvas=document.getElementById('sonifyWaveCanvas');
 var wCtx=wCanvas.getContext('2d');
 function startAudio(){
 if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
 if(actx.state==='suspended'){actx.resume();}
 analyser=actx.createAnalyser();analyser.fftSize=256;
 osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
 gain=actx.createGain();gain.gain.value=volSlider.value/300;
 osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
 osc.start();running=true;drawWave();
 }
 function stopAudio(){
 running=false;
 try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
 try{if(gain){gain.disconnect();}}catch(e){}
 try{if(analyser){analyser.disconnect();}}catch(e){}
 osc=null;gain=null;analyser=null;
 wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
 }
 function drawWave(){
 if(!running||!analyser)return;
 var buf=new Uint8Array(analyser.frequencyBinCount);
 analyser.getByteTimeDomainData(buf);
 wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
 wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
 wCtx.beginPath();
 var sl=wCanvas.width/buf.length;var x=0;
 for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
 wCtx.stroke();requestAnimationFrame(drawWave);
 }
 function mapData(){
 var c=document.getElementById('simCanvas');
 if(!c)return 440;
 try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
 }
 var sonifyInterval=null;
 toggle.addEventListener('click',function(){
 if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
 status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
 }else{startAudio();
 sonifyInterval=setInterval(function(){
 if(!running||!osc)return;
 var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
 freqDisp.textContent=Math.round(f)+' Hz';
 if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
 },100);
 status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
 }
 });
 volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}

/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-le-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-le-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ SIMPLIFIED HASH (Merkle-Damgard-like) ═══════ */
const SECRET='mysecretkey';let originalMAC=null,blocks=[],forgedBlocks=[];
function simpleHash(data,initState=0x67452301){let h=initState;const bs=[];for(let i=0;i<data.length;i++){h=((h<<5)+h+data.charCodeAt(i))>>>0;if((i+1)%8===0||i===data.length-1)bs.push({block:data.slice(Math.max(0,i-7),i+1),state:h})}return{hash:h,blocks:bs}}
function computeMAC(){const msg=$('msgInput').value;const fullMsg=SECRET+msg;const result=simpleHash(fullMsg);originalMAC=result.hash;blocks=result.blocks;
 const s=LANG[currentLang];log(s.macComputed,'success');
 $('resultsBox').textContent=`Original Message: "${msg}"\nMAC = H(secret || msg) = 0x${originalMAC.toString(16).padStart(8,'0')}\nSecret length: ${SECRET.length} (unknown to attacker)\nBlocks processed: ${blocks.length}`;drawCanvas()}

function forgeMAC(){if(!originalMAC){computeMAC()}const append=$('appendInput').value;const padding='\x80'+'\x00'.repeat(7);
 const extResult=simpleHash(padding+append,originalMAC);forgedBlocks=extResult.blocks;
 const forgedHash=extResult.hash;
 // Verify: compute actual hash of full extended message
 const fullExtended=SECRET+$('msgInput').value+padding+append;const verify=simpleHash(fullExtended);
 const s=LANG[currentLang];
 $('resultsBox').textContent+=`\n\n--- LENGTH EXTENSION ATTACK ---\nAppended data: "${append}"\nForged MAC: 0x${forgedHash.toString(16).padStart(8,'0')}\nVerification: 0x${verify.hash.toString(16).padStart(8,'0')}\nMatch: ${forgedHash===verify.hash?'YES - FORGED!':'NO'}\n\nAttacker created valid MAC for:\n"${$('msgInput').value}${padding}${append}"\nwithout knowing the secret!`;
 log(s.forged,'success');drawCanvas()}

const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
 const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
 ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Merkle-Damgard Hash Chain',10,22);
 // Draw original chain
 if(blocks.length>0){ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Original: H(secret || message)',10,45);
 const bw=Math.min(80,(w-40)/(blocks.length+1)),by=60,bh=50;
 // IV
 ctx.fillStyle='#4ade8033';ctx.fillRect(10,by,bw-4,bh);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText('IV',14,by+15);ctx.fillText('0x67452301',14,by+30);
 blocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(x-4,by+bh/2);ctx.lineTo(x,by+bh/2);ctx.stroke();
 ctx.fillStyle=i<blocks.length-1?`${accent}33`:'#f8717133';ctx.fillRect(x,by,bw-4,bh);ctx.fillStyle=i<blocks.length-1?accent:'#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,by+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,by+35)})}
 // Draw forged extension
 if(forgedBlocks.length>0){const fy=140;ctx.fillStyle='#f87171';ctx.font='10px Tajawal';ctx.fillText('Forged Extension: resume from MAC state',10,fy-5);
 const bw=Math.min(80,(w-40)/(forgedBlocks.length+1)),bh=50;
 ctx.fillStyle='#f8717133';ctx.fillRect(10,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='9px monospace';ctx.fillText('MAC state',14,fy+15);ctx.fillText('0x'+originalMAC.toString(16).padStart(8,'0'),14,fy+35);
 forgedBlocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle='#f87171';ctx.beginPath();ctx.moveTo(x-4,fy+bh/2);ctx.lineTo(x,fy+bh/2);ctx.stroke();
 ctx.fillStyle='#f8717133';ctx.fillRect(x,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,fy+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,fy+35)})}
 // Explanation
 ctx.fillStyle=muted;ctx.font='11px Tajawal';ctx.fillText('The attacker uses the MAC output as the new initial state,',10,h-40);ctx.fillText('then continues hashing with the appended data.',10,h-24)}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Merkle-Damgard',p:s.wiki_md},{t:'Extension',p:s.wiki_ext},{t:'HMAC Defense',p:s.wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'Merkle-Damgard',p:LANG[currentLang].wiki_md},{t:'Extension',p:LANG[currentLang].wiki_ext},{t:'HMAC',p:LANG[currentLang].wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{
 splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
 try{const l=localStorage.getItem('cry-le-lang');if(l&&LANG[l])setLanguage(l)}catch{}
 try{const t=localStorage.getItem('cry-le-theme');if(t)setTheme(t)}catch{}
 $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
 $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
 $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
 $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
 $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
 document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
 $('hashBtn').onclick=computeMAC;$('forgeBtn').onclick=forgeMAC;
 buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED LENGTH EXTENSION VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0;

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
 const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
 const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
 _x.clearRect(0,0,w,h);_t++;

 // === Merkle-Damgard Architecture (top) ===
 _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
 _x.fillText('Merkle-Damgard Hash Construction',10,16);

 const nBlocks=7,bW=Math.min(85,(w-60)/(nBlocks+1)),bH=30,bY=30;
 // IV
 _x.fillStyle='#c084fc33';_x.fillRect(5,bY,bW*0.6,bH);_x.strokeStyle='#c084fc66';_x.strokeRect(5,bY,bW*0.6,bH);
 _x.fillStyle='#c084fc';_x.font='bold 8px SF Mono';_x.textAlign='center';_x.fillText('IV',5+bW*0.3,bY+12);
 const animState=(0x67452301+_t*137)>>>0;
 _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(`0x${(animState&0xFFFF).toString(16)}`,5+bW*0.3,bY+24);_x.textAlign='left';

 for(let i=0;i<nBlocks;i++){
 const x=5+bW*0.6+5+i*bW;
 const isSecret=i<2;
 const isMsg=i>=2&&i<5;
 const isPad=i===5;
 const isExt=i===6;
 const color=isSecret?'#f87171':isMsg?'#4ade80':isPad?'#fbbf24':'#c084fc';

 // Compression function box
 _x.fillStyle=color+'22';_x.fillRect(x,bY,bW-5,bH);_x.strokeStyle=color+'66';_x.strokeRect(x,bY,bW-5,bH);

 // Arrow from previous
 _x.strokeStyle=color+'88';_x.beginPath();_x.moveTo(x-5,bY+bH/2);_x.lineTo(x,bY+bH/2);_x.stroke();
 _x.fillStyle=color;_x.beginPath();_x.moveTo(x,bY+bH/2);_x.lineTo(x-4,bY+bH/2-3);_x.lineTo(x-4,bY+bH/2+3);_x.fill();

 // Block label
 _x.fillStyle=color;_x.font='bold 7px SF Mono';_x.textAlign='center';
 const label=isSecret?`SECRET[${i}]`:isMsg?`MSG[${i-2}]`:isPad?'PAD':'EXTEND';
 _x.fillText(label,x+bW/2-2.5,bY+12);

 // State value
 const state=((_t*31+i*0x9E3779B9)>>>0)&0xFFFF;
 _x.fillStyle=mut;_x.font='7px SF Mono';
 _x.fillText(`h=${state.toString(16)}`,x+bW/2-2.5,bY+24);
 _x.textAlign='left';

 // Input from top (message block)
 _x.strokeStyle=color+'44';
 _x.beginPath();_x.moveTo(x+bW/2-2.5,bY-5);_x.lineTo(x+bW/2-2.5,bY);_x.stroke();
 _x.fillStyle=color+'33';_x.fillRect(x+5,bY-18,bW-15,13);
 _x.fillStyle=color;_x.font='6px SF Mono';_x.textAlign='center';
 _x.fillText(isSecret?'[secret]':isMsg?`m${i-2}`:'pad/ext',x+bW/2-2.5,bY-9);_x.textAlign='left';
 }

 // Output label
 const outX=5+bW*0.6+5+nBlocks*bW;
 _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';
 _x.fillText('MAC',outX,bY+18);

 // === Attack Anatomy (middle) ===
 const aaY=bY+bH+30;
 _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
 _x.fillText('Length Extension Attack Steps',10,aaY);

 const attackSteps=[
 {step:'1',desc:'Attacker knows: H(secret || msg), len(secret), msg',color:'#60a5fa'},
 {step:'2',desc:'Reconstruct padding: msg || 0x80 || zeros || length',color:'#fbbf24'},
 {step:'3',desc:'Set internal state = known MAC output value',color:'#f87171'},
 {step:'4',desc:'Continue hashing: H_state(appended_data)',color:'#c084fc'},
 {step:'5',desc:'Result = valid MAC for (secret||msg||pad||append)',color:'#4ade80'}
 ];

 attackSteps.forEach((s,i)=>{
 const y=aaY+10+i*20;
 const isActive=Math.floor(_t/50)%attackSteps.length===i;
 _x.fillStyle=isActive?s.color+'33':'rgba(255,255,255,.02)';
 _x.fillRect(10,y,w*0.48-5,18);
 _x.fillStyle=isActive?s.color:mut;_x.font='9px SF Mono';
 _x.fillText(`[${s.step}] ${s.desc}`,14,y+13);
 if(isActive){
 _x.fillStyle=s.color;
 _x.beginPath();_x.arc(w*0.48,y+9,3,0,Math.PI*2);_x.fill();
 }
 });

 // === Vulnerable vs Immune Hashes (middle-right) ===
 const vhX=w*0.52,vhY=aaY;
 _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
 _x.fillText('Hash Function Vulnerability',vhX,vhY);

 const hashes=[
 {name:'MD5',bits:128,vulnerable:true,broken:true},
 {name:'SHA-1',bits:160,vulnerable:true,broken:true},
 {name:'SHA-256',bits:256,vulnerable:true,broken:false},
 {name:'SHA-512',bits:512,vulnerable:true,broken:false},
 {name:'SHA-3',bits:256,vulnerable:false,broken:false},
 {name:'BLAKE2',bits:256,vulnerable:false,broken:false},
 {name:'HMAC-*',bits:0,vulnerable:false,broken:false}
 ];

 const hhW=w*0.46,hhBarW=hhW-80;
 hashes.forEach((hf,i)=>{
 const y=vhY+10+i*16;
 _x.fillStyle=hf.vulnerable?'#f8717122':'#4ade8022';
 _x.fillRect(vhX,y,hhW,14);
 _x.fillStyle=hf.vulnerable?(hf.broken?'#f87171':'#fbbf24'):'#4ade80';
 _x.font='bold 8px SF Mono';_x.fillText(hf.name,vhX+4,y+10);
 // Status
 const status=hf.vulnerable?(hf.broken?'VULNERABLE+BROKEN':'VULNERABLE (MD construct)'):'IMMUNE';
 _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(status,vhX+60,y+10);
 // Indicator
 _x.fillStyle=hf.vulnerable?'#f87171':'#4ade80';
 _x.beginPath();_x.arc(vhX+hhW-10,y+7,4,0,Math.PI*2);_x.fill();
 });

 // === MD Padding Visualization (bottom) ===
 const pdY=Math.max(aaY+115,vhY+130);
 _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
 _x.fillText('Merkle-Damgard Padding (64-byte block)',10,pdY);

 const totalBytes=64;
 const byteW=Math.min(12,(w-20)/totalBytes);
 const msgLen=(_t%30)+5;
 for(let i=0;i<totalBytes;i++){
 const x=10+i*byteW;
 let color,label;
 if(i<msgLen){color='#4ade80';label=((0x41+i)&0x7F).toString(16)}
 else if(i===msgLen){color='#fbbf24';label='80'}
 else if(i<56){color=mut+'22';label='00'}
 else{color='#c084fc';label=((msgLen*8)>>(56-i)*8&0xFF).toString(16).padStart(2,'0').slice(-2)}
 _x.fillStyle=typeof color==='string'&&color.length<8?color+'33':color;
 _x.fillRect(x,pdY+10,byteW-1,18);
 _x.fillStyle=typeof color==='string'&&color.length<8?color:mut;
 _x.font='bold 6px SF Mono';_x.textAlign='center';
 _x.fillText(label,x+byteW/2,pdY+22);_x.textAlign='left';
 }

 // Legend
 const legY=pdY+34;
 [{c:'#4ade80',t:'Message'},{c:'#fbbf24',t:'0x80'},{c:mut,t:'Zero fill'},{c:'#c084fc',t:'Length (bits)'}].forEach((l,i)=>{
 const lx=10+i*90;
 _x.fillStyle=l.c;_x.fillRect(lx,legY,8,8);
 _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText(l.t,lx+12,legY+8);
 });

 // === HMAC Defense Diagram (bottom-right) ===
 const hmY=pdY+50;
 if(hmY+40<h){
 _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
 _x.fillText('HMAC = H(K xor opad || H(K xor ipad || msg)) -- immune to extension',10,hmY);
 const pipeW=w-20,pipeH=20;
 const stages=['K xor ipad','H_inner(msg)','K xor opad','H_outer','HMAC'];
 const stW=pipeW/stages.length;
 stages.forEach((s,i)=>{
 const x=10+i*stW;
 const progress=(_t%100)/100;
 const active=progress*stages.length>i&&progress*stages.length<i+1;
 _x.fillStyle=active?'#4ade8044':'rgba(255,255,255,.03)';
 _x.fillRect(x,hmY+8,stW-4,pipeH);
 _x.strokeStyle=active?'#4ade80':mut+'33';_x.strokeRect(x,hmY+8,stW-4,pipeH);
 _x.fillStyle=active?'#4ade80':mut;_x.font='bold 7px SF Mono';_x.textAlign='center';
 _x.fillText(s,x+stW/2-2,hmY+22);_x.textAlign='left';
 if(i<stages.length-1){_x.fillStyle=acc;_x.beginPath();_x.moveTo(x+stW-4,hmY+18);_x.lineTo(x+stW,hmY+15);_x.lineTo(x+stW,hmY+21);_x.fill()}
 });
 }

 requestAnimationFrame(draw);
}
draw();
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

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){initTooltips();initExplorer();});}else{initTooltips();initExplorer();}

/* ═══════ PEER MODE (BroadcastChannel) ═══════ */
function initPeerMode(){var L=LANG[document.documentElement.lang||'en'];if(!L.peerTitle)return;if(typeof BroadcastChannel==='undefined'){console.warn('BroadcastChannel not available');return;}var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var channelName='peer_'+appDir;var bc=new BroadcastChannel(channelName);var peerActive=false;var msgCount=0;var container=document.getElementById('peerModePanel');if(!container){container=document.createElement('div');container.id='peerModePanel';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var anchor=document.getElementById('dailyChallenge');if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(container,anchor);}else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}container.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span style="font-size:0.95rem;font-weight:700;" data-i18n="peerTitle">'+L.peerTitle+'</span>'+'<button id="peerToggleBtn" class="btn-sm" style="padding:0.3rem 0.8rem;border-radius:16px;cursor:pointer;" data-i18n="peerConnect">'+L.peerConnect+'</button>'+'<span id="peerStatusDot" style="font-size:0.85rem;">\ud83d\udd34 Solo</span>'+'<span id="peerMsgCount" style="font-size:0.75rem;opacity:0.6;margin-left:auto;">0 synced</span></div>'+'<p style="font-size:0.7rem;opacity:0.5;margin:0.3rem 0 0;" data-i18n="peerInfo">'+L.peerInfo+'</p>';var btn=document.getElementById('peerToggleBtn');var dot=document.getElementById('peerStatusDot');var counter=document.getElementById('peerMsgCount');btn.onclick=function(){peerActive=!peerActive;if(peerActive){btn.textContent=L.peerDisconnect||'Disconnect';dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');bc.postMessage({type:'ping'});}else{btn.textContent=L.peerConnect||'Connect';dot.textContent='\ud83d\udd34 Solo';}};bc.onmessage=function(e){if(!peerActive)return;var d=e.data;if(d&&d.type==='param'){var el=document.querySelector('[name="'+d.name+'"],#'+d.name);if(el&&el.type==='range'){el.value=d.value;el.dispatchEvent(new Event('input',{bubbles:true}));}msgCount++;counter.textContent=msgCount+' synced';}if(d&&d.type==='ping'){dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');}};document.querySelectorAll('input[type="range"]').forEach(function(slider){slider.addEventListener('input',function(){if(!peerActive)return;var nm=slider.name||slider.id||'';if(!nm)return;bc.postMessage({type:'param',name:nm,value:slider.value});msgCount++;counter.textContent=msgCount+' synced';});});}

/* ═══════ ACTIVITY HEATMAP ═══════ */
function initActivityHeatmap(){var L=LANG[document.documentElement.lang||'en'];if(!L.heatmapTitle)return;var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey='activity_'+appDir;var data;try{data=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch(e){data={};}if(!data.dates)data.dates={};var today=new Date().toISOString().slice(0,10);data.dates[today]=(data.dates[today]||0)+1;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}var container=document.getElementById('activityHeatmap');if(!container){container=document.createElement('div');container.id='activityHeatmap';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var peer=document.getElementById('peerModePanel');if(peer&&peer.parentNode){peer.parentNode.insertBefore(container,peer.nextSibling);}else{var dc=document.getElementById('dailyChallenge');if(dc&&dc.parentNode)dc.parentNode.insertBefore(container,dc);else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}}var colors=['#161b22','#0e4429','#006d32','#26a641','#39d353'];function getColor(n){if(n===0)return colors[0];if(n===1)return colors[1];if(n<=3)return colors[2];if(n<=5)return colors[3];return colors[4];}var canvas=document.createElement('canvas');canvas.width=280;canvas.height=100;canvas.style.cssText='width:280px;max-width:100%;height:100px;border-radius:6px;cursor:pointer;display:block;margin:0.4rem 0;';var ctx=canvas.getContext('2d');var cellSize=10;var gap=2;var todayDate=new Date();todayDate.setHours(0,0,0,0);var startDate=new Date(todayDate);startDate.setDate(startDate.getDate()-(52*7-1));var tooltip=document.createElement('div');tooltip.style.cssText='display:none;position:absolute;z-index:9999;background:#1a1a2e;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;pointer-events:none;white-space:nowrap;';container.style.position='relative';container.appendChild(tooltip);var cellMap=[];function drawGrid(){ctx.clearRect(0,0,280,100);var d=new Date(startDate);for(var week=0;week<52;week++){for(var day=0;day<7;day++){var ds=d.toISOString().slice(0,10);var count=data.dates[ds]||0;var x=week*(cellSize+gap);var y=day*(cellSize+gap);ctx.fillStyle=getColor(count);ctx.fillRect(x,y,cellSize,cellSize);if(ds===today){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,cellSize-1,cellSize-1);}cellMap.push({x:x,y:y,date:ds,count:count});d.setDate(d.getDate()+1);}}}drawGrid();canvas.addEventListener('click',function(e){var rect=canvas.getBoundingClientRect();var scaleX=280/rect.width;var mx=(e.clientX-rect.left)*scaleX;var my=(e.clientY-rect.top)*(100/rect.height);for(var i=0;i<cellMap.length;i++){var c=cellMap[i];if(mx>=c.x&&mx<=c.x+cellSize&&my>=c.y&&my<=c.y+cellSize){tooltip.textContent=c.date+': '+c.count+' visits';tooltip.style.display='block';tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+10)+'px';tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-20)+'px';setTimeout(function(){tooltip.style.display='none';},2500);return;}}});var streak=0;var checkDate=new Date(todayDate);while(true){var ds=checkDate.toISOString().slice(0,10);if(data.dates[ds]&&data.dates[ds]>0){streak++;}else{break;}checkDate.setDate(checkDate.getDate()-1);}var totalSessions=0;Object.values(data.dates).forEach(function(v){totalSessions+=v;});var stats=document.createElement('div');stats.style.cssText='font-size:0.75rem;opacity:0.7;display:flex;gap:1rem;flex-wrap:wrap;';stats.innerHTML='<span data-i18n="heatmapToday">'+(L.heatmapToday||'Today')+'</span>: '+(data.dates[today]||0)+' | '+'<span data-i18n="heatmapStreak">'+(L.heatmapStreak||'Streak')+'</span>: '+streak+' days | '+'<span data-i18n="heatmapTotal">'+(L.heatmapTotal||'Total')+'</span>: '+totalSessions;var legend=document.createElement('div');legend.style.cssText='font-size:0.65rem;opacity:0.5;margin-top:0.2rem;';legend.innerHTML='<span data-i18n="heatmapLegend">'+(L.heatmapLegend||'Less \u2192 More')+'</span> ';colors.forEach(function(c){legend.innerHTML+='<span style="display:inline-block;width:10px;height:10px;background:'+c+';border-radius:2px;margin:0 1px;vertical-align:middle;"></span>';});container.innerHTML='<div style="font-size:0.95rem;font-weight:700;" data-i18n="heatmapTitle">'+L.heatmapTitle+'</div>';container.appendChild(canvas);container.appendChild(stats);container.appendChild(legend);container.style.position='relative';container.appendChild(tooltip);}

document.addEventListener('DOMContentLoaded',function(){try{initPeerMode();}catch(e){console.warn('Peer init:',e);}try{initActivityHeatmap();}catch(e){console.warn('Heatmap init:',e);}});


/* === LAYOUT CLEANUP === */
(function(){
 /* Hide dynamically-created panels: wrap them in <details> so they collapse */
 document.addEventListener('DOMContentLoaded',function(){
 setTimeout(function(){
 /* Panels to collapse (id -> label) */
 var panels = {
 'dailyChallenge': '\uD83D\uDCC5 Daily Challenge',
 'peerModePanel': '\uD83D\uDC65 Peer Mode',
 'activityHeatmap': '\uD83D\uDFE9 Activity Heatmap',
 'labRecorderPanel': '\uD83D\uDCD3 Lab & Recorder',
 'sonifyPanel': '\uD83D\uDD0A Sonification',
 'explorerPanel': '\uD83D\uDD0D Parameter Explorer',
 'spacedPanel': '\uD83D\uDCC5 Spaced Repetition'
 };
 Object.keys(panels).forEach(function(id){
 var el = document.getElementById(id);
 if(!el || el.parentElement.tagName === 'DETAILS') return;
 var det = document.createElement('details');
 det.className = 'collapsible tool-panel';
 det.style.cssText = 'margin:6px 0;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0;overflow:hidden';
 var sum = document.createElement('summary');
 sum.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:13px;font-weight:600;list-style:none;background:rgba(0,0,0,0.2);color:inherit';
 sum.textContent = panels[id];
 det.appendChild(sum);
 el.parentNode.insertBefore(det, el);
 el.style.display = '';
 el.style.padding = '8px 12px';
 det.appendChild(el);
 });
 /* Also wrap the compare button area */
 var cmpBtn = document.querySelector('.compare-toggle,.compare-btn,[onclick*="compare"],[id*="compare"]');
 if(cmpBtn && cmpBtn.parentElement.tagName !== 'DETAILS'){
 cmpBtn.style.fontSize = '12px';
 }
 /* Clean up: move floating buttons to a tools bar if many exist */
 var floats = document.querySelectorAll('[style*="position:fixed"][style*="bottom"]');
 if(floats.length > 2){
 var bar = document.createElement('div');
 bar.style.cssText = 'position:fixed;bottom:10px;right:10px;display:flex;gap:6px;z-index:9990;flex-direction:column;align-items:flex-end';
 bar.id = 'toolsFloat';
 floats.forEach(function(f){
 if(f.id === 'mentorOverlay' || f.id === 'tooltipFloat' || f.id === 'voiceIndicator' || f.id === 'particleCanvas') return;
 f.style.position = 'relative';
 f.style.bottom = 'auto';
 f.style.right = 'auto';
 f.style.margin = '0';
 bar.appendChild(f);
 });
 if(bar.children.length > 0) document.body.appendChild(bar);
 }
 }, 500);
 });
})();
