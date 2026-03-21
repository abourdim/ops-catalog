/**
 * Workshop DIY — Password Cracker v1.2
 * Attack Simulator — Brute force, dictionary, rainbow table
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}else{o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}}

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
    ...LANG_BASE.en,title:'Password Cracker',subtitle:'🔓 Watch brute force, dictionary, and rainbow attacks',disconnected:'Disconnected',connected:'Connected',mainSection:'Attack Simulator',mainDesc:'Enter a password and watch different attacks try to crack it',sectionA:'Attack Methods Explained',sectionB:'Strong Password Guide',sectionC:'Password Strength Analyzer',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Password Cracker simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Set up the simulation parameters and choose your encryption ',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Methods Explained" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_log_title:'📜 Activity Log',wiki_log:'سجل مؤرخ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'محلي اولا. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🔓 Password Cracker ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',bruteBtn:'Brute Force',dictBtn:'Dictionary',rainbowBtn:'Rainbow Table',stopBtn:'Stop',attempts:'Attempts',timeElapsed:'Time',speed:'Speed',cracked:'PASSWORD CRACKED!',methodsText:'Brute Force: every combination. Dictionary: wordlist. Rainbow Table: pre-computed hashes.',strongPwText:'Use 12+ chars, mix types. Avoid dictionary words. Use password manager. Enable 2FA.',analyzerText:'Analyze password strength and estimated crack time.',analyzeBtn:'Analyze Strength',attacking:'Attacking...',stopped:'Attack stopped',weak:'WEAK',medium:'MEDIUM',strong:'STRONG',veryStrong:'VERY STRONG',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Password Cracker?',faq_a1:'Password Cracker is an interactive simulation that demonstrates covert operations concepts. Enter a password and watch different attacks try to crack it. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real digital security behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real digital security principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Web Burner Chat and Web Cipher Suite. Each app in this category teaches a different aspect of digital security. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',demo_s1:'Welcome to Password Cracker! Look at the main display — this is where the digital security simulation runs.',demo_s2:'Enter a password. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Methods Explained" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Cryptography',learn1Desc:'How secret codes protect messages from spies. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cybersecurity',learn2Title:'Wireless Communication',learn2Desc:'How devices send invisible signals through the air. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Wireless',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Security',learn4Title:'Math in Security',learn4Desc:'How numbers and algorithms make unbreakable codes. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Math',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Password Cracker! This is like a science experiment on your computer. You get to control a real covert operations simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Set up the simulation parameters and choose your e Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Password Cracker: Enter a password and watch different attacks try to crack it. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure through Process to Transmit and Verify.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Methods Explained" and "Strong Password Guide" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Radio Intelligence',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Password Cracker builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Web Password Cracker',
    wiki_math: 'The mathematics behind Password Cracker: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radio intelligence practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radio intelligence. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radio intelligence: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radio intelligence.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radio Intelligence carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Password Cracker demonstrates key principles from covert operations. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radio intelligence?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radio intelligence systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Metadata Scrub Engine',related1_desc:'EXIF, GPS coordinates, author & hidden tag removal',related1_path:'../../55-escape-evasion/esc-metadata-scrubber/index.html',related2_name:'esc-burner-identity-gen',related2_desc:'',related2_path:'../../55-escape-evasion/esc-burner-identity-gen/index.html',related3_name:'Invisible Fence — Perimeter Security',related3_desc:'Map and monitor a sensor perimeter network',related3_path:'../../40-agent-microbit/bit-invisible-fence/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Tor Network Visualization',pathPrev_path:'../../03-spy-browser/web-onion-simulator/index.html',pathNext_name:'Spot the Fake',pathNext_path:'../../03-spy-browser/web-phishing-trainer/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does SIGINT stand for?',quiz_q1a:'Signal Integration',quiz_q1b:'Signals Intelligence',quiz_q1c:'Simple Interception',quiz_q1d:'System Intelligence',quiz_q1_answer:'1',quiz_q2:'What is frequency measured in?',quiz_q2a:'Meters',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'What does AI stand for?',quiz_q3a:'Automated Input',quiz_q3b:'Artificial Intelligence',quiz_q3c:'Analog Interface',quiz_q3d:'Active Integration',quiz_q3_answer:'1',quiz_q4:'What is a dead drop?',quiz_q4a:'Failed connection',quiz_q4b:'Secret location for exchanging messages',quiz_q4c:'Broken antenna',quiz_q4d:'Empty frequency',quiz_q4_answer:'1',quiz_q5:'What is steganography?',quiz_q5a:'Loud communication',quiz_q5b:'Hiding messages within other data',quiz_q5c:'Deleting files',quiz_q5d:'Broadcasting signals',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'In 2017, GPS spoofing in the Black Sea made 20+ ships believe they were 25 miles inland at an airport. This demonstrated that satellite navigation — relied on by aviation, shipping, and military — can be fooled by fake RF signals.',realworld2:'In 2015, researchers showed that a $20 SDR dongle could track every aircraft in range by decoding unencrypted ADS-B transponder signals. This revealed a fundamental security gap in global aviation surveillance.',realworld3:'The Stuxnet worm (2010) destroyed 1,000 Iranian nuclear centrifuges by manipulating their PLCs via infected USB drives. It was the first cyber weapon to cause physical destruction and crossed the digital-physical boundary.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In RF analysis, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in RF analysis and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Password Cracker demonstrates a fundamental concept in RF analysis. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Password Cracker have direct real-world applications. Professionals in RF analysis use these same concepts daily. In industry, HackRF and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with RF analysis carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.',proTipTitle:'💡 Pro Tips',proTip1:'Calibrate your HackRF frequency offset using a known signal (like an FM station). Most units have a 1-20 ppm crystal error that shifts all frequencies.',proTip2:'Always use an external LNA (Low Noise Amplifier) for weak signal reception. The HackRF\\x27s built-in amplifier has a high noise figure that masks faint signals.',funFactTitle:'🎯 Did You Know?',funFact:'The Sun is the strongest radio source in our sky. Solar flares can disrupt HF radio communications worldwide for hours — ham operators call these events \\x27radio blackouts.\\x27',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
  fr:{title:'Craqueur de Mot de Passe',subtitle:'🔓 Regardez les attaques brute force, dictionnaire et rainbow',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Simulateur d\'Attaque',mainDesc:'Entrez un mot de passe et regardez les attaques',sectionA:'Methodes d\'Attaque',sectionB:'Guide Mots de Passe',sectionC:'Analyseur de Force',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Password Cracker. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Set up the simulation parameters and choose your encryption ',howto_2:'Choisissez le type d\'attaque.',howto_3:'Regardez l\'attaque.',howto_4:'Analysez la force.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🔓 Craqueur pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',bruteBtn:'Force Brute',dictBtn:'Dictionnaire',rainbowBtn:'Table Rainbow',stopBtn:'Stop',attempts:'Tentatives',timeElapsed:'Temps',speed:'Vitesse',cracked:'MOT DE PASSE CRAQUE !',methodsText:'Force Brute: chaque combinaison. Dictionnaire: liste de mots. Rainbow: hachages precalcules.',strongPwText:'Utilisez 12+ caracteres, melangez les types. Utilisez un gestionnaire.',analyzerText:'Analysez la force et le temps de craquage.',analyzeBtn:'Analyser la Force',attacking:'Attaque en cours...',stopped:'Attaque arretee',weak:'FAIBLE',medium:'MOYEN',strong:'FORT',veryStrong:'TRES FORT',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Password Cracker est une simulation interactive qui démontre les concepts de opérations secrètes. Enter a password and watch different attacks try to crack it. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages.',faq_q3:'Que dois-je essayer d\'abord ?',faq_a3:'Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐',faq_q5:'Je peux le casser ?',faq_a5:'Essaie la section Labo ! Vois si tu peux craquer le code. C\'est comme ça que pensent les vrais chercheurs ! 💪',faq_q6:'Quel matériel me faut-il ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d\'internet.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Phishing Trainer and Web Metadata Detective ! Chacune enseigne quelque chose de différent. 🚀. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',demo_s1:'Bienvenue ! Explorons cet outil d\'espion. D\'abord, regarde le panneau de contrôle. 🕵️',demo_s2:'Clique sur le bouton principal pour démarrer. Regarde la visualisation s\'animer ! ⚡',demo_s3:'Maintenant change un réglage — déplace un curseur ou choisis une option. Tu vois la différence ? 🔄',demo_s4:'Vérifie les résultats. Les chiffres et graphiques montrent ce qui s\'est passé. 📊',demo_s5:'Bravo ! 🎉 Essaie maintenant la section Labo pour des expériences pratiques !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Cryptographie',learn1Desc:'Comment les codes secrets protègent les messages',learn1Tag:'Cybersécurité',learn2Title:'Communication sans fil',learn2Desc:'Comment les appareils envoient des signaux invisibles',learn2Tag:'Sans fil',learn3Title:'OPSEC',learn3Desc:'Comment garder tes opérations secrètes et sécurisées',learn3Tag:'Sécurité',learn4Title:'Maths en sécurité',learn4Desc:'Comment les nombres créent des codes incassables',learn4Tag:'Maths',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de renseignement radio',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Password Cracker s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Web Password Cracker',
    wiki_math: 'Les mathématiques derrière Password Cracker : Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de renseignement radio utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour renseignement radio. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en renseignement radio : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Renseignement radio implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Password Cracker démontre les principes clés de opérations secrètes. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radio intelligence dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Moteur de Nettoyage',related1_desc:'Suppression EXIF, GPS, auteur',related1_path:'../../55-escape-evasion/esc-metadata-scrubber/index.html',related2_name:'esc-burner-identity-gen',related2_desc:'',related2_path:'../../55-escape-evasion/esc-burner-identity-gen/index.html',related3_name:'Clôture Invisible — Sécurité Périmétrique',related3_desc:'Cartographier et surveiller un réseau de capteurs périmétrique',related3_path:'../../40-agent-microbit/bit-invisible-fence/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Visualisation Reseau Tor',pathPrev_path:'../../03-spy-browser/web-onion-simulator/index.html',pathNext_name:'Trouvez le Faux',pathNext_path:'../../03-spy-browser/web-phishing-trainer/index.html',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'En 2017, le spoofing GPS en mer Noire a fait croire à plus de 20 navires qu\'ils se trouvaient à 25 milles à l\'intérieur des terres dans un aéroport.',realworld2:'En 2015, des chercheurs ont montré qu\'un dongle SDR à 20$ pouvait suivre chaque avion à portée en décodant les signaux ADS-B non chiffrés des transpondeurs.',realworld3:'Le ver Stuxnet (2010) a détruit 1000 centrifugeuses nucléaires iraniennes en manipulant leurs automates programmables via des clés USB infectées.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En analyse RF, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en analyse RF et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Password Cracker illustre un concept fondamental en analyse RF. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Password Cracker ont des applications directes dans le monde réel. Les professionnels de analyse RF utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, HackRF et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en analyse RF implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
  ar:{title:'كاسر كلمات المرور',subtitle:'🔓 شاهد هجمات القوة العمياء والقاموس وجدول قوس قزح',disconnected:'غير متصل',connected:'متصل',mainSection:'محاكي الهجوم',mainDesc:'ادخل كلمة مرور وشاهد الهجمات المختلفة',sectionA:'شرح طرق الهجوم',sectionB:'دليل كلمات المرور القوية',sectionC:'محلل قوة كلمة المرور',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'تعرض الشاشة الرئيسية محاكاة Password Cracker. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Set up the simulation parameters and choose your encryption ',howto_2:'اختر نوع الهجوم.',howto_3:'شاهد الهجوم.',howto_4:'حلل القوة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🔓 كاسر كلمات المرور جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',bruteBtn:'قوة عمياء',dictBtn:'قاموس',rainbowBtn:'جدول قوس قزح',stopBtn:'ايقاف',attempts:'المحاولات',timeElapsed:'الوقت',speed:'السرعة',cracked:'تم كسر كلمة المرور!',methodsText:'القوة العمياء: كل التركيبات. القاموس: قائمة كلمات. Rainbow: تجزئات محسوبة مسبقا.',strongPwText:'استخدم 12+ حرفا واخلط الانواع. استخدم مدير كلمات المرور.',analyzerText:'حلل قوة كلمة المرور ووقت الكسر المقدر.',analyzeBtn:'تحليل القوة',attacking:'جاري الهجوم...',stopped:'توقف الهجوم',weak:'ضعيف',medium:'متوسط',strong:'قوي',veryStrong:'قوي جدا',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Password Cracker هي محاكاة تفاعلية توضح مفاهيم العمليات السرية. Enter a password and watch different attacks try to crack it. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت.',faq_q8:'ماذا أجرب بعد ذلك؟',faq_a8:'جرب Web Phishing Trainer and Web Metadata Detective! كل واحد يعلّم شيئاً مختلفاً. 🚀. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',demo_s1:'مرحباً! لنستكشف أداة التجسس هذه. أولاً، انظر إلى لوحة التحكم الرئيسية. 🕵️',demo_s2:'اضغط على الزر الرئيسي لبدء المحاكاة. شاهد التصور يتحرك! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'الآن جرب تغيير إعداد — حرك شريط تمرير أو اختر خياراً مختلفاً. هل ترى الفرق؟ 🔄',demo_s4:'تحقق من النتائج. الأرقام والرسوم البيانية تُظهر ما حدث. 📊',demo_s5:'أحسنت! 🎉 جرب الآن قسم المختبر للتجارب العملية!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'التشفير',learn1Desc:'كيف تحمي الشفرات السرية الرسائل',learn1Tag:'أمن سيبراني',learn2Title:'الاتصال اللاسلكي',learn2Desc:'كيف ترسل الأجهزة إشارات غير مرئية',learn2Tag:'لاسلكي',learn3Title:'أمن العمليات',learn3Desc:'كيف تحافظ على سرية عملياتك وأمانها',learn3Tag:'أمان',learn4Title:'الرياضيات في الأمن',learn4Desc:'كيف تصنع الأرقام والخوارزميات شفرات غير قابلة للكسر',learn4Tag:'رياضيات',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ الاستخبارات اللاسلكية',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. يبني Password Cracker على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Web Password Cracker',
    wiki_math: 'الرياضيات وراء Password Cracker: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الاستخبارات اللاسلكية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الاستخبارات اللاسلكية. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الاستخبارات اللاسلكية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الاستخبارات اللاسلكية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Password Cracker يوضح المبادئ الأساسية في العمليات السرية. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradio intelligence في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'محرك التنظيف',related1_desc:'إزالة EXIF وGPS والمؤلف',related1_path:'../../55-escape-evasion/esc-metadata-scrubber/index.html',related2_name:'esc-burner-identity-gen',related2_desc:'',related2_path:'../../55-escape-evasion/esc-burner-identity-gen/index.html',related3_name:'السياج الخفي — أمن المحيط',related3_desc:'رسم ومراقبة شبكة مستشعرات محيطية',related3_path:'../../40-agent-microbit/bit-invisible-fence/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'تصور شبكة Tor',pathPrev_path:'../../03-spy-browser/web-onion-simulator/index.html',pathNext_name:'اكتشف المزيف',pathNext_path:'../../03-spy-browser/web-phishing-trainer/index.html',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'في عام 2017 جعل انتحال GPS في البحر الأسود أكثر من 20 سفينة تعتقد أنها على بعد 25 ميلاً داخل البر في مطار.',realworld2:'في عام 2015 أثبت باحثون أن جهاز SDR بقيمة 20 دولارًا يمكنه تتبع كل طائرة في النطاق عبر فك تشفير إشارات ADS-B غير المشفرة.',realworld3:'دمرت دودة ستكسنت (2010) ألف جهاز طرد مركزي نووي إيراني من خلال التلاعب بوحدات التحكم المنطقية عبر أقراص USB مصابة.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في تحليل الترددات معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في تحليل الترددات وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Password Cracker يوضح مفهومًا أساسيًا في تحليل الترددات. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Password Cracker لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في تحليل الترددات هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ HackRF وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال تحليل الترددات يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ PASSWORD CRACKER SIMULATION ═══════ */

const DICT_WORDS=['password','123456','qwerty','abc123','monkey','master','dragon','111111','baseball','iloveyou','trustno1','sunshine','letmein','welcome','shadow','ashley','football','jesus','michael','ninja','mustang','password1','123456789','12345678','1234567','secret','secret123','admin','login','hello','charlie','donald','batman','access','thunder','matrix','pass123','test123','love123','hunter2'];
const CHARS='abcdefghijklmnopqrstuvwxyz';const CHARS_FULL='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
let attacking=false;let attackTimer=null;

function stopAttack(){attacking=false;if(attackTimer){clearInterval(attackTimer);attackTimer=null;}const s=LANG[currentLang];$('stopBtn')&&($('stopBtn').style.display='none');hideToast();log(s.stopped,'info');}

async function bruteForceAttack(){
  if(attacking)return;attacking=true;
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'abc';
  const display=$('attackDisplay'),progress=$('progressBar'),attempts=$('attemptCount'),timeDisp=$('timeDisplay'),speedDisp=$('speedDisplay'),resultBox=$('resultBox'),stopBtn=$('stopBtn');
  if(stopBtn)stopBtn.style.display='';if(resultBox)resultBox.style.display='none';
  showToast(s.attacking);log(`💪 Brute Force: "${pw}" (${pw.length} chars)`,'tx');setStatus(true);
  let count=0;const start=Date.now();let found='';
  const maxIter=pw.length*200;

  for(let pos=0;pos<pw.length&&attacking;pos++){
    const target=pw[pos];let charSet=CHARS_FULL;
    for(let i=0;i<charSet.length&&attacking;i++){
      count++;const elapsed=(Date.now()-start)/1000;
      found=pw.slice(0,pos)+charSet[i]+'_'.repeat(Math.max(0,pw.length-pos-1));
      if(display)display.textContent=found;
      if(attempts)attempts.textContent=count.toLocaleString();
      if(timeDisp)timeDisp.textContent=elapsed.toFixed(1)+'s';
      if(speedDisp)speedDisp.textContent=Math.round(count/Math.max(elapsed,0.1))+'/s';
      if(progress)progress.style.width=((pos*charSet.length+i)/(pw.length*charSet.length)*100)+'%';
      if(charSet[i]===target)break;
      if(i%3===0)await sleep(15);
    }
  }
  if(attacking){
    if(display){display.textContent=pw;display.style.color='#33ff33';}
    if(progress)progress.style.width='100%';
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.innerHTML=`🔓 ${s.cracked}<br><span style="font-family:Orbitron;font-size:1.5rem;letter-spacing:3px;">${pw}</span>`;}
    hideToast();log(`🔓 ${s.cracked} "${pw}" in ${((Date.now()-start)/1000).toFixed(1)}s (${count} attempts)`,'success');
    setTimeout(()=>{if(display)display.style.color='#33ff33';},100);
  }
  attacking=false;if(stopBtn)stopBtn.style.display='none';
}

async function dictionaryAttack(){
  if(attacking)return;attacking=true;
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'abc';
  const display=$('attackDisplay'),progress=$('progressBar'),attempts=$('attemptCount'),timeDisp=$('timeDisplay'),speedDisp=$('speedDisplay'),resultBox=$('resultBox'),stopBtn=$('stopBtn');
  if(stopBtn)stopBtn.style.display='';if(resultBox)resultBox.style.display='none';
  showToast(s.attacking);log(`📖 Dictionary Attack: "${pw}"`,'tx');setStatus(true);
  const start=Date.now();let found=false;

  for(let i=0;i<DICT_WORDS.length&&attacking;i++){
    const word=DICT_WORDS[i];
    if(display)display.textContent=word;
    if(attempts)attempts.textContent=(i+1).toString();
    const elapsed=(Date.now()-start)/1000;
    if(timeDisp)timeDisp.textContent=elapsed.toFixed(1)+'s';
    if(speedDisp)speedDisp.textContent=Math.round((i+1)/Math.max(elapsed,0.1))+'/s';
    if(progress)progress.style.width=((i+1)/DICT_WORDS.length*100)+'%';
    if(word===pw.toLowerCase()){found=true;break;}
    await sleep(80);
  }
  if(found&&attacking){
    if(display){display.textContent=pw;display.style.color='#33ff33';}
    if(progress)progress.style.width='100%';
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.innerHTML=`📖 ${s.cracked}<br><span style="font-family:Orbitron;font-size:1.5rem;">${pw}</span>`;}
    log(`📖 ${s.cracked} "${pw}" — found in dictionary!`,'success');
  }else if(attacking){
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.textContent='Not found in dictionary. Password survived!';}
    log('📖 Password not in dictionary','info');
  }
  hideToast();attacking=false;if(stopBtn)stopBtn.style.display='none';
}

async function rainbowAttack(){
  if(attacking)return;attacking=true;
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'abc';
  const display=$('attackDisplay'),progress=$('progressBar'),attempts=$('attemptCount'),timeDisp=$('timeDisplay'),speedDisp=$('speedDisplay'),resultBox=$('resultBox'),stopBtn=$('stopBtn');
  if(stopBtn)stopBtn.style.display='';if(resultBox)resultBox.style.display='none';
  showToast(s.attacking);log(`🌈 Rainbow Table Attack: "${pw}"`,'tx');setStatus(true);
  const start=Date.now();

  // Fake hash computation display
  const fakeHash=Array.from(pw).map(c=>c.charCodeAt(0).toString(16)).join('')+'a3f8c1d9e2b7';
  if(display)display.textContent='Computing hash...';
  await sleep(500);
  if(display)display.textContent='SHA256: '+fakeHash.slice(0,24)+'...';
  if(attempts)attempts.textContent='1';
  await sleep(400);

  // Lookup animation
  const tableSize=50+Math.floor(Math.random()*100);
  for(let i=0;i<tableSize&&attacking;i++){
    const fakeEntry=Array.from({length:12},()=>CHARS_FULL[Math.floor(Math.random()*CHARS_FULL.length)]).join('');
    if(display)display.textContent=`[${i+1}/${tableSize}] ${fakeEntry} → ${Math.random().toString(16).slice(2,14)}`;
    if(progress)progress.style.width=((i+1)/tableSize*100)+'%';
    if(attempts)attempts.textContent=(i+2).toString();
    const elapsed=(Date.now()-start)/1000;
    if(timeDisp)timeDisp.textContent=elapsed.toFixed(1)+'s';
    if(speedDisp)speedDisp.textContent=Math.round((i+2)/Math.max(elapsed,0.1))+'/s';
    await sleep(30);
  }
  if(attacking){
    if(display){display.textContent=pw;display.style.color='#33ff33';}
    if(progress)progress.style.width='100%';
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.innerHTML=`🌈 ${s.cracked}<br>Hash match found!<br><span style="font-family:Orbitron;font-size:1.5rem;">${pw}</span>`;}
    log(`🌈 ${s.cracked} via rainbow table in ${((Date.now()-start)/1000).toFixed(1)}s`,'success');
  }
  hideToast();attacking=false;if(stopBtn)stopBtn.style.display='none';
}

function analyzePassword(){
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'';
  const results=$('analyzeResults');if(!results)return;results.style.display='block';
  let score=0;const len=pw.length;
  if(len>=8)score+=1;if(len>=12)score+=1;if(len>=16)score+=1;
  if(/[a-z]/.test(pw))score+=1;if(/[A-Z]/.test(pw))score+=1;
  if(/[0-9]/.test(pw))score+=1;if(/[^a-zA-Z0-9]/.test(pw))score+=1;
  if(DICT_WORDS.includes(pw.toLowerCase()))score=Math.max(score-3,0);
  let label,color;
  if(score<=2){label=s.weak;color='#ff2222';}
  else if(score<=4){label=s.medium;color='#ffaa00';}
  else if(score<=5){label=s.strong;color='#33cc55';}
  else{label=s.veryStrong;color='#00ccff';}
  const charset=(/[^a-zA-Z0-9]/.test(pw)?95:/[A-Z]/.test(pw)?62:/[0-9]/.test(pw)?36:26);
  const combos=Math.pow(charset,len);
  const bruteTime=combos/1e9;// at 1 billion/sec
  let timeStr;
  if(bruteTime<1)timeStr='< 1 second';else if(bruteTime<60)timeStr=Math.round(bruteTime)+' seconds';else if(bruteTime<3600)timeStr=Math.round(bruteTime/60)+' minutes';else if(bruteTime<86400)timeStr=Math.round(bruteTime/3600)+' hours';else if(bruteTime<31536000)timeStr=Math.round(bruteTime/86400)+' days';else timeStr=Math.round(bruteTime/31536000).toLocaleString()+' years';
  results.innerHTML=`<div style="text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:${color};font-family:Orbitron;">${label}</div><div style="font-size:.8rem;margin-top:.3rem;">Score: ${score}/7</div><div style="margin:.5rem 0;height:8px;border-radius:4px;background:#1a1a2e;"><div style="height:100%;width:${score/7*100}%;background:${color};border-radius:4px;transition:width .3s;"></div></div><div style="font-size:.8rem;">Length: ${len} | Charset: ${charset} chars</div><div style="font-size:.8rem;">Brute force time (1B/s): <strong>${timeStr}</strong></div>${DICT_WORDS.includes(pw.toLowerCase())?'<div style="color:#ff4444;margin-top:.3rem;font-weight:700;">Found in common dictionary!</div>':''}</div>`;
  log(`📊 Password analysis: ${label} (${score}/7)`,'info');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  $('bruteBtn')&&($('bruteBtn').onclick=bruteForceAttack);
  $('dictBtn')&&($('dictBtn').onclick=dictionaryAttack);
  $('rainbowBtn')&&($('rainbowBtn').onclick=rainbowAttack);
  $('stopBtn')&&($('stopBtn').onclick=stopAttack);
  $('analyzeBtn')&&($('analyzeBtn').onclick=analyzePassword);

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Password Entropy Visualizer Canvas ═══════ */
(function(){
let eCanvas,eCtx;const entropyBars=[];const crackParticles=[];
function createEC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Real-Time Attack Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=280;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawE(){
  if(!eCtx)return;const w=eCanvas.width,h=eCanvas.height;
  eCtx.fillStyle='rgba(6,13,26,0.08)';eCtx.fillRect(0,0,w,h);
  // Matrix rain background
  eCtx.fillStyle='rgba(51,255,51,0.03)';eCtx.font='10px monospace';
  for(let i=0;i<15;i++){const x=Math.random()*w,y=Math.random()*h;
    eCtx.fillText(CHARS_FULL[Math.floor(Math.random()*CHARS_FULL.length)],x,y);}
  // Password strength meter (animated bars)
  const pw=($('passwordInput')||{}).value||'';
  const metrics=[
    {label:'Length',val:Math.min(pw.length/20,1),color:'#4488ff'},
    {label:'Lowercase',val:/[a-z]/.test(pw)?1:0,color:'#33cc55'},
    {label:'Uppercase',val:/[A-Z]/.test(pw)?1:0,color:'#ffcc00'},
    {label:'Numbers',val:/[0-9]/.test(pw)?1:0,color:'#ff8800'},
    {label:'Symbols',val:/[^a-zA-Z0-9]/.test(pw)?1:0,color:'#ff4444'},
    {label:'Entropy',val:Math.min(pw.length*4/100,1),color:'#cc44ff'},
  ];
  const barW=70,barH=12,startX=30,startY=30;
  metrics.forEach((m,i)=>{
    const y=startY+i*(barH+14);
    // Animated fill
    if(!entropyBars[i])entropyBars[i]=0;
    entropyBars[i]+=(m.val-entropyBars[i])*0.08;
    eCtx.fillStyle='rgba(255,255,255,0.05)';eCtx.fillRect(startX+60,y,200,barH);
    eCtx.fillStyle=m.color+'88';eCtx.fillRect(startX+60,y,200*entropyBars[i],barH);
    eCtx.strokeStyle=m.color+'44';eCtx.lineWidth=1;eCtx.strokeRect(startX+60,y,200,barH);
    eCtx.fillStyle=m.color;eCtx.font='9px Orbitron,monospace';eCtx.textAlign='right';
    eCtx.fillText(m.label,startX+55,y+10);
    eCtx.textAlign='left';eCtx.fillText(Math.round(entropyBars[i]*100)+'%',startX+265,y+10);
  });
  // Crack attempt visualization (right side)
  const cx=w-180,cy=h/2;
  const lockSize=40;const crackT=Date.now()/1000;
  // Lock icon
  eCtx.strokeStyle=attacking?'#ff4444':'#33cc55';eCtx.lineWidth=3;
  eCtx.beginPath();eCtx.arc(cx,cy-lockSize/2,lockSize/3,Math.PI,0);eCtx.stroke();
  eCtx.fillStyle=attacking?'rgba(255,68,68,0.2)':'rgba(51,204,85,0.2)';
  eCtx.fillRect(cx-lockSize/2,cy-lockSize/4,lockSize,lockSize*0.7);
  eCtx.strokeRect(cx-lockSize/2,cy-lockSize/4,lockSize,lockSize*0.7);
  // Crack rays when attacking
  if(attacking){
    for(let i=0;i<8;i++){
      const a=crackT*2+i*Math.PI/4;const r=lockSize+Math.sin(crackT*5+i)*15;
      eCtx.beginPath();eCtx.moveTo(cx,cy);
      eCtx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      eCtx.strokeStyle='rgba(255,68,68,'+(0.1+Math.sin(crackT*3+i)*0.1)+')';
      eCtx.lineWidth=2;eCtx.stroke();
    }
    // Spawn crack particles
    if(Math.random()>0.7)crackParticles.push({x:cx,y:cy,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:1,color:'#ff4444'});
  }
  // Particles
  for(let i=crackParticles.length-1;i>=0;i--){
    const p=crackParticles[i];p.life-=0.02;p.x+=p.vx;p.y+=p.vy;
    if(p.life<=0){crackParticles.splice(i,1);continue;}
    eCtx.globalAlpha=p.life;eCtx.beginPath();eCtx.arc(p.x,p.y,2,0,Math.PI*2);
    eCtx.fillStyle=p.color;eCtx.fill();eCtx.globalAlpha=1;
  }
  // Brute force attempt counter
  eCtx.fillStyle='rgba(255,255,255,0.3)';eCtx.font='8px monospace';eCtx.textAlign='left';
  const charset=(/[^a-zA-Z0-9]/.test(pw)?95:/[A-Z]/.test(pw)?62:/[0-9]/.test(pw)?36:26);
  const combos=Math.pow(charset,pw.length||1);
  eCtx.fillText('Charset: '+charset+' | Combinations: '+combos.toExponential(2),10,h-8);
  eCtx.fillText('Status: '+(attacking?'ATTACKING':'IDLE'),10,h-20);
  requestAnimationFrame(drawE);
}
function initEC(){eCanvas=createEC();if(!eCanvas)return;eCtx=eCanvas.getContext('2d');
  const input=$('passwordInput');if(input)input.addEventListener('input',()=>{});
  drawE();}
setTimeout(initEC,1500);
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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this spy tool. First, look at the main control panel above. 🕵️', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary button to start the simulation. Watch the visualization come alive! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now try changing a setting — slide a slider or pick a different option. See how it changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results below. The numbers and graphs show you what happened in real time. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Great job! 🎉 Now try the Lab section below for hands-on experiments. You\'re a real spy now!', target:'#mainCard', delay:3000},
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
