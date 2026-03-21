/**
 * Sonic Acoustic Levitator — Workshop DIY v1.0
 * ESP32 ultrasonic levitation array controller with standing wave visualization
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en', soundEnabled = false;
let isLevitating = false, animId = null, phase = 180, power = 80, freq = 40000, time = 0, particleY = 0, connected = false;

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
    title:'Acoustic Levitator', subtitle:'ESP32 Ultrasonic Levitation',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Acoustic Levitator', mainDesc:'Control ESP32 ultrasonic transducer array for acoustic levitation',
    sectionA:'Standing Wave Nodes', sectionB:'Levitation Physics', sectionC:'Challenge',
    connectBtn:'Connect ESP32', levitateBtn:'Levitate', dropBtn:'Drop',
    freqLabel:'Frequency:', phaseLabel:'Phase:', powerLabel:'Power:',
    espLabel:'ESP32', levLabel:'Levitation', arrayLabel:'Array Info',
    nodeHint:'Pressure node positions appear when levitation is active.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Acoustic Levitator ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    levOn:'Levitation ACTIVE — particle trapped at node',
    levOff:'Levitation stopped — particle dropped',
    espConnected:'ESP32 connected (simulation mode)',
    espDisconnected:'ESP32 not connected',
    connectFirst:'Connect ESP32 first',
    howto_1:'The main display shows the Acoustic Levitator simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Create a specific acoustic signal with precise frequency and',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Standing Wave Nodes" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_sw_title:'Standing Waves', wiki_sw:'When two identical waves travel in opposite directions, they create stationary nodes (zero amplitude) and antinodes (max amplitude). Objects are trapped at pressure nodes.',
    wiki_arp_title:'Acoustic Radiation Pressure', wiki_arp:'Sound waves carry momentum. At pressure nodes, forces from both sides balance, creating stable trap points for small objects.',
    wiki_esp_title:'ESP32 Driver Circuit', wiki_esp:'The ESP32 generates 40 kHz square waves via PWM, driving ultrasonic transducers through H-bridge drivers with precise per-channel phase control.',
    challenge1:'What happens to the levitation nodes if you change the frequency?',
    challenge2:'Why must the phase offset be exactly 180 degrees for optimal levitation?',
    challenge3:'Calculate the wavelength and number of nodes for a 40 kHz levitator with 10cm gap.',
    challengeReveal1:'Higher frequency = shorter wavelength = more nodes closer together. Lower frequency = fewer, wider-spaced nodes. The particle may fall if nodes shift too quickly.',
    challengeReveal2:'At 180 degrees, the top and bottom arrays create maximum destructive interference at the midpoint, forming the strongest pressure nodes. Other phase offsets reduce node stability.',
    challengeReveal3:'Wavelength = 343m/s / 40000Hz = 8.575mm. Node spacing = half-wavelength = 4.29mm. Number of nodes in 10cm gap = 100mm / 4.29mm = ~23 nodes.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Acoustic Levitator?',faq_a1:'Acoustic Levitator is an interactive simulation that demonstrates acoustic physics concepts. Control ESP32 ultrasonic transducer array for acoustic levitation. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real acoustic science behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real acoustic science principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Fence. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Acoustic Levitator! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Connect to the ESP32 controller (simulated). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Standing Wave Nodes" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Acoustic Levitator! This is like a science experiment on your computer. You get to control a real acoustic physics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Create a specific acoustic signal with precise fre Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Acoustic Levitator: Control ESP32 ultrasonic transducer array for acoustic levitation. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Generate Sound through Propagate to Detect & Capture and Analyze & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Standing Wave Nodes" and "Levitation Physics" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Zero-Point Energy Meter',related1_desc:'Measure simulated quantum vacuum zero-point energy fluctuations',related1_path:'../../47-impossible-physics/phys-zero-point-meter/index.html',related2_name:'Dead Drop — BLE Message Transfer',related2_desc:'Encrypt and exchange secret messages via BLE simulation',related2_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',related3_name:'Dead Drop — BLE Message Transfer',related3_desc:'Encrypt and exchange secret messages via BLE simulation',related3_path:'../../46-swarm-intelligence/swarm-slime-mold-router/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Dead Drop — BLE Message Transfer',pathPrev_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',pathNext_name:'Audio Steganography',pathNext_path:'../../44-acoustic-warfare/sonic-audio-steganography/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is ultrasound?',quiz_q1a:'Sound below 20 Hz',quiz_q1b:'Sound above 20,000 Hz',quiz_q1c:'Normal speech',quiz_q1d:'Radio waves',quiz_q1_answer:'1',quiz_q2:'What wireless capabilities does ESP32 have?',quiz_q2a:'Wi-Fi only',quiz_q2b:'Bluetooth only',quiz_q2c:'Wi-Fi and Bluetooth',quiz_q2d:'None',quiz_q2_answer:'2',quiz_q3:'What is the ESP32\'s CPU architecture?',quiz_q3a:'ARM',quiz_q3b:'Xtensa dual-core',quiz_q3c:'RISC-V only',quiz_q3d:'x86',quiz_q3_answer:'1',quiz_q4:'What is the speed of sound in air at 20°C?',quiz_q4a:'200 m/s',quiz_q4b:'343 m/s',quiz_q4c:'500 m/s',quiz_q4d:'1000 m/s',quiz_q4_answer:'1',quiz_q5:'What frequency range can humans hear?',quiz_q5a:'1-100 Hz',quiz_q5b:'20-20,000 Hz',quiz_q5c:'100-50,000 Hz',quiz_q5d:'1-1,000 Hz',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'Alan Turing\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.',realworld2:'The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.',realworld3:'Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In quantum computing, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in quantum computing and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'Acoustic Levitator demonstrates a fundamental concept in quantum computing. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in Acoustic Levitator have direct real-world applications. Professionals in quantum computing use these same concepts daily. In industry, browser and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with quantum computing carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.'},
    wiki_history_title: '📜 History of Physics',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Acoustic Levitator builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Sonic Acoustic Levitator',
    wiki_math: 'The mathematics behind Acoustic Levitator: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
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
    theory: 'Acoustic Levitator demonstrates key principles from acoustic physics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world physics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional physics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Levitateur Acoustique', subtitle:'Levitation Ultrasonique ESP32',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Levitateur Acoustique', mainDesc:'Controler le reseau de transducteurs ultrasoniques ESP32 pour la levitation',
    sectionA:'Noeuds d\'Ondes Stationnaires', sectionB:'Physique de la Levitation', sectionC:'Defi',
    connectBtn:'Connecter ESP32', levitateBtn:'Leviter', dropBtn:'Lacher',
    freqLabel:'Frequence:', phaseLabel:'Phase:', powerLabel:'Puissance:',
    espLabel:'ESP32', levLabel:'Levitation', arrayLabel:'Info Reseau',
    nodeHint:'Les positions des noeuds de pression apparaissent lorsque la levitation est active.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Levitateur acoustique pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    levOn:'Levitation ACTIVE — particule piegee au noeud',
    levOff:'Levitation arretee — particule lachee',
    espConnected:'ESP32 connecte (mode simulation)',
    espDisconnected:'ESP32 non connecte',
    connectFirst:'Connectez d\'abord l\'ESP32',
    howto_1:'L écran principal affiche la simulation Acoustic Levitator. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Create a specific acoustic signal with precise frequency and',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_sw_title:'Ondes Stationnaires', wiki_sw:'Quand deux ondes identiques voyagent en sens opposes, elles creent des noeuds stationnaires (amplitude zero) et des ventres (amplitude max).',
    wiki_arp_title:'Pression de Radiation Acoustique', wiki_arp:'Les ondes sonores transportent de la quantite de mouvement. Aux noeuds de pression, les forces des deux cotes s\'equilibrent.',
    wiki_esp_title:'Circuit Driver ESP32', wiki_esp:'L\'ESP32 genere des ondes carrees a 40 kHz via PWM, pilotant les transducteurs a travers des ponts en H avec controle de phase precis.',
    challenge1:'Que se passe-t-il si vous changez la frequence?',
    challenge2:'Pourquoi le decalage de phase doit-il etre exactement 180 degres?',
    challenge3:'Calculez la longueur d\'onde et le nombre de noeuds pour un levitateur 40 kHz avec 10cm d\'ecart.',
    challengeReveal1:'Frequence plus elevee = longueur d\'onde plus courte = plus de noeuds plus rapproches. Frequence plus basse = moins de noeuds plus espaces.',
    challengeReveal2:'A 180 degres, les reseaux haut et bas creent une interference destructive maximale au point median, formant les noeuds de pression les plus forts.',
    challengeReveal3:'Longueur d\'onde = 343m/s / 40000Hz = 8,575mm. Espacement des noeuds = demi-longueur d\'onde = 4,29mm. Nombre de noeuds dans 10cm = ~23.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Acoustic Levitator ?',faq_a1:'Acoustic Levitator est une simulation interactive qui démontre les concepts de physique acoustique. Control ESP32 ultrasonic transducer array for acoustic levitation. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de science acoustique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de science acoustique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de science acoustique.',demo_s1:'Bienvenue dans Acoustic Levitator ! Regarde l\'écran principal — c\'est ici que la simulation de science acoustique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de science acoustique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Acoustic Levitator ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de physique acoustique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Create a specific acoustic signal with precise fre Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de science acoustique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Acoustic Levitator : Control ESP32 ultrasonic transducer array for acoustic levitation. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Compteur ZPE',related1_desc:'Mesurer les fluctuations d\\',related1_path:'../../47-impossible-physics/phys-zero-point-meter/index.html',related2_name:'Dead Drop — Transfert BLE',related2_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related2_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',related3_name:'Dead Drop — Transfert BLE',related3_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related3_path:'../../46-swarm-intelligence/swarm-slime-mold-router/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Dead Drop — Transfert BLE',pathPrev_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',pathNext_name:'Steganographie Audio',pathNext_path:'../../44-acoustic-warfare/sonic-audio-steganography/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Qu\'est-ce que l\'ultrason ?',quiz_q1a:'Son sous 20 Hz',quiz_q1b:'Son au-dessus de 20 000 Hz',quiz_q1c:'Parole normale',quiz_q1d:'Ondes radio',quiz_q1_answer:'1',quiz_q2:'Quelles capacités sans fil a l\'ESP32 ?',quiz_q2a:'Wi-Fi uniquement',quiz_q2b:'Bluetooth uniquement',quiz_q2c:'Wi-Fi et Bluetooth',quiz_q2d:'Aucune',quiz_q2_answer:'2',quiz_q3:'Quelle est l\'architecture CPU de l\'ESP32 ?',quiz_q3a:'ARM',quiz_q3b:'Xtensa double coeur',quiz_q3c:'RISC-V uniquement',quiz_q3d:'x86',quiz_q3_answer:'1',quiz_q4:'Quelle est la vitesse du son dans l\'air à 20°C ?',quiz_q4a:'200 m/s',quiz_q4b:'343 m/s',quiz_q4c:'500 m/s',quiz_q4d:'1000 m/s',quiz_q4_answer:'1',quiz_q5:'Quelle plage de fréquences l\'humain peut-il entendre ?',quiz_q5a:'1-100 Hz',quiz_q5b:'20-20 000 Hz',quiz_q5c:'100-50 000 Hz',quiz_q5d:'1-1 000 Hz',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'équipe d\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.',realworld2:'L\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.',realworld3:'Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En informatique quantique, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en informatique quantique et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'Acoustic Levitator illustre un concept fondamental en informatique quantique. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans Acoustic Levitator ont des applications directes dans le monde réel. Les professionnels de informatique quantique utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, browser et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en informatique quantique implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
    wiki_history_title: '📜 Histoire de physique',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Acoustic Levitator s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Sonic Acoustic Levitator',
    wiki_math: 'Les mathématiques derrière Acoustic Levitator : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
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
    theory: 'Acoustic Levitator démontre les principes clés de physique acoustique. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec physics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'الرافعة الصوتية', subtitle:'رفع بالموجات فوق الصوتية ESP32',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'الرافعة الصوتية', mainDesc:'التحكم في مصفوفة محولات الموجات فوق الصوتية للرفع الصوتي',
    sectionA:'عقد الموجات المستقرة', sectionB:'فيزياء الرفع', sectionC:'التحدي',
    connectBtn:'توصيل ESP32', levitateBtn:'رفع', dropBtn:'إسقاط',
    freqLabel:'التردد:', phaseLabel:'الطور:', powerLabel:'القوة:',
    espLabel:'ESP32', levLabel:'الرفع', arrayLabel:'معلومات المصفوفة',
    nodeHint:'تظهر مواضع عقد الضغط عند تفعيل الرفع.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'الرافعة الصوتية جاهزة!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    levOn:'الرفع نشط — الجسيم محاصر في العقدة',
    levOff:'توقف الرفع — سقط الجسيم',
    espConnected:'ESP32 متصل (وضع المحاكاة)',
    espDisconnected:'ESP32 غير متصل',
    connectFirst:'وصّل ESP32 أولاً',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Acoustic Levitator. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Create a specific acoustic signal with precise frequency and',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_sw_title:'الموجات المستقرة', wiki_sw:'عندما تسير موجتان متطابقتان في اتجاهين متعاكسين، تنشأ عقد ثابتة (سعة صفر) وبطون (سعة قصوى).',
    wiki_arp_title:'ضغط الإشعاع الصوتي', wiki_arp:'الموجات الصوتية تحمل زخمًا. عند عقد الضغط تتوازن القوى من الجانبين مما يخلق نقاط حبس مستقرة.',
    wiki_esp_title:'دائرة تشغيل ESP32', wiki_esp:'يولّد ESP32 موجات مربعة 40 كيلوهرتز عبر PWM لتشغيل المحولات عبر جسور H مع تحكم دقيق بالطور.',
    challenge1:'ماذا يحدث لعقد الرفع إذا غيرت التردد؟',
    challenge2:'لماذا يجب أن تكون إزاحة الطور 180 درجة بالضبط؟',
    challenge3:'احسب طول الموجة وعدد العقد لرافعة 40 كيلوهرتز بفجوة 10 سم.',
    challengeReveal1:'تردد أعلى = طول موجة أقصر = عقد أكثر متقاربة. تردد أقل = عقد أقل متباعدة. قد يسقط الجسيم إذا تحولت العقد بسرعة.',
    challengeReveal2:'عند 180 درجة، تنشئ المصفوفتان العلوية والسفلية تداخلاً هداماً أقصى عند نقطة المنتصف، مكونة أقوى عقد ضغط.',
    challengeReveal3:'طول الموجة = 343/40000 = 8.575 مم. تباعد العقد = نصف طول الموجة = 4.29 مم. عدد العقد في 10 سم = ~23 عقدة.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Acoustic Levitator؟',faq_a1:'Acoustic Levitator هي محاكاة تفاعلية توضح مفاهيم الفيزياء الصوتية. Control ESP32 ultrasonic transducer array for acoustic levitation. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في علم الصوتيات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من علم الصوتيات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من علم الصوتيات.',demo_s1:'مرحباً في Acoustic Levitator! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة علم الصوتيات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـعلم الصوتيات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Acoustic Levitator! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالفيزياء الصوتية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Create a specific acoustic signal with precise fre لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم علم الصوتيات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Acoustic Levitator: Control ESP32 ultrasonic transducer array for acoustic levitation. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الفيزياء',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Acoustic Levitator على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Sonic Acoustic Levitator',
    wiki_math: 'الرياضيات وراء Acoustic Levitator: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
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
    theory: 'Acoustic Levitator يوضح المبادئ الأساسية في الفيزياء الصوتية. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـphysics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'مقياس طاقة النقطة الصفرية',related1_desc:'قياس تقلبات طاقة النقطة الصفرية للفراغ الكمي',related1_path:'../../47-impossible-physics/phys-zero-point-meter/index.html',related2_name:'Dead Drop — نقل رسائل BLE',related2_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related2_path:'../../45-time-manipulation/chrono-temporal-steganography/index.html',related3_name:'Dead Drop — نقل رسائل BLE',related3_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related3_path:'../../46-swarm-intelligence/swarm-slime-mold-router/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'Dead Drop — نقل رسائل BLE',pathPrev_path:'../../44-acoustic-warfare/sonic-acoustic-keylogger/index.html',pathNext_name:'الإخفاء الصوتي',pathNext_path:'../../44-acoustic-warfare/sonic-audio-steganography/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما هو الموجات فوق الصوتية؟',quiz_q1a:'صوت أقل من 20 هرتز',quiz_q1b:'صوت أعلى من 20,000 هرتز',quiz_q1c:'كلام عادي',quiz_q1d:'موجات راديو',quiz_q1_answer:'1',quiz_q2:'ما إمكانيات ESP32 اللاسلكية؟',quiz_q2a:'واي فاي فقط',quiz_q2b:'بلوتوث فقط',quiz_q2c:'واي فاي وبلوتوث',quiz_q2d:'لا شيء',quiz_q2_answer:'2',quiz_q3:'ما بنية معالج ESP32؟',quiz_q3a:'ARM',quiz_q3b:'Xtensa ثنائي النواة',quiz_q3c:'RISC-V فقط',quiz_q3d:'x86',quiz_q3_answer:'1',quiz_q4:'ما سرعة الصوت في الهواء عند 20 درجة مئوية؟',quiz_q4a:'200 م/ث',quiz_q4b:'343 م/ث',quiz_q4c:'500 م/ث',quiz_q4d:'1000 م/ث',quiz_q4_answer:'1',quiz_q5:'ما نطاق التردد الذي يسمعه الإنسان؟',quiz_q5a:'1-100 هرتز',quiz_q5b:'20-20,000 هرتز',quiz_q5c:'100-50,000 هرتز',quiz_q5d:'1-1,000 هرتز',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945.',realworld2:'اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة.',realworld3:'كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الحوسبة الكمية معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الحوسبة الكمية وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'Acoustic Levitator يوضح مفهومًا أساسيًا في الحوسبة الكمية. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في Acoustic Levitator لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في الحوسبة الكمية هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ browser وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال الحوسبة الكمية يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.title = (s.title || '') + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}
function setTheme(n) {
  document.documentElement.dataset.theme = n;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n));
  const s = $('themeSelect'); if (s) s.value = n;
  try { localStorage.setItem('wdiy-theme', n); } catch {}
  log(T('themeChanged') + ' ' + n, 'info');
}

let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div');
  d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); }
  catch { log('Copy failed', 'error'); }
}
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; });
}
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ CANVAS ═══════ */
const canvas = $('levCanvas'), ctx = canvas ? canvas.getContext('2d') : null;
const W = canvas ? canvas.width : 780, H = canvas ? canvas.height : 350;

function drawLevitator() {
  if (!ctx) return;
  time += 0.03;
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, topY = 30, botY = H - 30, arrayH = botY - topY;

  // Transducer arrays (top and bottom bars)
  ctx.fillStyle = '#333'; ctx.fillRect(cx - 150, topY - 10, 300, 15); ctx.fillRect(cx - 150, botY - 5, 300, 15);
  // Transducer dots
  for (let i = 0; i < 10; i++) {
    const x = cx - 135 + i * 30;
    ctx.fillStyle = isLevitating ? `hsl(${120 + i * 10},80%,50%)` : '#555';
    ctx.beginPath(); ctx.arc(x, topY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, botY, 5, 0, Math.PI * 2); ctx.fill();
  }

  if (isLevitating) {
    // Standing wave field
    const wavelength = 343000 / freq;
    const nodes = Math.floor(arrayH / (wavelength * 50));
    const phaseRad = phase * Math.PI / 180;
    for (let y = topY; y < botY; y++) {
      const normY = (y - topY) / arrayH;
      const pressure = Math.abs(Math.sin(normY * Math.PI * nodes + phaseRad)) * Math.cos(time * 3);
      const w = pressure * 100 * (power / 100);
      const hue = 120 - pressure * 120;
      ctx.fillStyle = `hsla(${hue},80%,50%,${pressure * 0.4})`;
      ctx.fillRect(cx - w, y, w * 2, 1);
    }
    // Node markers
    const nodePositions = [];
    for (let n = 0; n < nodes; n++) {
      const ny = topY + arrayH * (n + 0.5) / nodes;
      nodePositions.push(ny);
      ctx.strokeStyle = 'rgba(0,255,100,0.3)'; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(cx - 120, ny); ctx.lineTo(cx + 120, ny); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(0,255,100,0.5)'; ctx.font = '9px Orbitron';
      ctx.fillText('NODE ' + (n + 1), cx + 125, ny + 3);
    }
    // Levitating particle
    if (nodePositions.length > 0) {
      const targetY = nodePositions[Math.floor(nodePositions.length / 2)];
      particleY += (targetY - particleY) * 0.05;
      const wobble = Math.sin(time * 5) * 2;
      ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.arc(cx + wobble, particleY + Math.sin(time * 2) * 3, 6, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    // Wave propagation rings
    ctx.strokeStyle = 'rgba(0,200,255,0.15)'; ctx.lineWidth = 1;
    for (let w = 0; w < 3; w++) {
      const r = (time * 50 + w * 40) % 150;
      ctx.beginPath(); ctx.arc(cx, topY, r, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, botY, r, Math.PI, Math.PI * 2); ctx.stroke();
    }
  }

  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron';
  ctx.fillText('ACOUSTIC LEVITATION ARRAY', 10, 15);
  ctx.fillText('TOP ARRAY', cx - 30, topY - 15);
  ctx.fillText('BOTTOM ARRAY', cx - 40, botY + 25);
  if (isLevitating) ctx.fillText('STANDING WAVE ACTIVE', 10, H - 5);

  // Update info panel
  const wl = (343000 / freq);
  $('arrayInfo').innerHTML = 'Freq: ' + (freq / 1000) + ' kHz<br>Phase: ' + phase + '°<br>Power: ' + power + '%<br>λ: ' + wl.toFixed(2) + ' mm';

  animId = requestAnimationFrame(drawLevitator);
}

/* ═══════ ESP32 / LEVITATION ═══════ */
function connectESP() {
  connected = true; setStatus(true);
  $('espStatus').textContent = T('connected');
  $('espStatus').style.color = '#22c55e';
  log(T('espConnected'), 'success');
  showToast(T('espConnected'), 2000);
}
function startLevitation() {
  if (!connected) { log(T('connectFirst'), 'error'); return; }
  isLevitating = true;
  $('levStatus').textContent = 'ACTIVE'; $('levStatus').style.color = '#22c55e';
  log(T('levOn'), 'success');
  fillNodes();
}
function stopLevitation() {
  isLevitating = false;
  $('levStatus').textContent = 'OFF'; $('levStatus').style.color = '';
  log(T('levOff'), 'info');
}
function fillNodes() {
  const el = $('nodeList'); if (!el) return;
  el.innerHTML = '';
  const wavelength = 343000 / freq;
  const arrayH = H - 60;
  const nodes = Math.floor(arrayH / (wavelength * 50));
  for (let n = 0; n < nodes; n++) {
    const d = document.createElement('div');
    d.className = 'node-badge';
    d.style.cssText = 'display:block;padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;margin-bottom:4px;';
    d.textContent = 'Node ' + (n + 1) + ': position ' + ((n + 0.5) / nodes * 100).toFixed(1) + '% — stable trap point';
    el.appendChild(d);
  }
}
function fillPhysics() {
  const el = $('physicsInfo'); if (!el) return;
  el.innerHTML = '<b>Acoustic Levitation</b><br><br>Objects can be trapped at pressure nodes of a standing wave where the acoustic radiation force balances gravity.<br><br>' +
    '<b>Standing Wave:</b> Created when two opposing transducer arrays emit phase-locked ultrasonic waves. Constructive/destructive interference creates fixed pressure nodes and anti-nodes.<br><br>' +
    '<b>Key Parameters:</b><br>- Frequency: 25-40 kHz typical<br>- Phase: Controls node position<br>- Power: Must overcome gravity<br>- Wavelength at 40kHz: ~8.6mm<br><br>' +
    '<b>Gor\'kov Potential:</b> U = -(V_p/2) * [f1 * <p²>/(ρc²) - f2 * 3ρ<v²>/4]<br>Particles move to potential minima (pressure nodes).<br><br>' +
    '<b>Applications:</b> Containerless processing, pharmaceutical research, materials science, space experiments.';
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}

  // Panels
  $('helpBtn').onclick = () => { $('helpPanel').classList.toggle('open'); $('helpOverlay').classList.toggle('active'); };
  $('helpCloseBtn').onclick = $('helpOverlay').onclick = () => { $('helpPanel').classList.remove('open'); $('helpOverlay').classList.remove('active'); };
  $('settingsBtn').onclick = () => { $('settingsPanel').classList.toggle('open'); $('settingsOverlay').classList.toggle('active'); };
  $('settingsCloseBtn').onclick = $('settingsOverlay').onclick = () => { $('settingsPanel').classList.remove('open'); $('settingsOverlay').classList.remove('active'); };
  $('logBtn').onclick = () => $('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick = () => $('logPanel').classList.remove('open');
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog;
  $('langSelect').onchange = e => setLanguage(e.target.value);
  $('themeSelect').onchange = e => setTheme(e.target.value);
  $('soundToggle').onchange = e => { soundEnabled = e.target.checked; };

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
      if (tgt) tgt.classList.add('active');
    };
  });
  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter();
    };
  });

  // Controls
  $('connectBtn').onclick = connectESP;
  $('levitateBtn').onclick = startLevitation;
  $('dropBtn').onclick = stopLevitation;
  $('freqSelect').onchange = e => { freq = parseInt(e.target.value); if (isLevitating) fillNodes(); log('Frequency: ' + (freq/1000) + ' kHz', 'info'); };
  $('phaseRange').oninput = e => { phase = parseInt(e.target.value); $('phaseVal').textContent = phase + '\u00B0'; };
  $('powerRange').oninput = e => { power = parseInt(e.target.value); $('powerVal').textContent = power + '%'; };

  fillPhysics();
  drawLevitator();
  log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Acoustic Levitator
   Animated standing wave field with particle trapping,
   pressure node visualization, and transducer array display
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simAcousticLevitator';let cv,cx,W,H,af=null,t=0;
  const particles=[];const pressureNodes=[];const waveRings=[];
  let simFreq=40000,simPhase=180,simPower=80,levActive=true;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=340;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a14;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    initParticles();calcNodes();
  }

  function initParticles(){
    particles.length=0;
    for(let i=0;i<5;i++){
      particles.push({x:W/2+(Math.random()-.5)*40,y:H/2+(Math.random()-.5)*60,
        vx:0,vy:0,targetY:0,radius:3+Math.random()*3,wobble:Math.random()*Math.PI*2,
        hue:120+Math.random()*60,trapped:false});
    }
  }

  function calcNodes(){
    pressureNodes.length=0;
    const wavelength=343000/simFreq;
    const topY=50,botY=H-50,gap=botY-topY;
    const nodeCount=Math.floor(gap/(wavelength*50));
    for(let n=0;n<nodeCount;n++){
      const ny=topY+gap*(n+0.5)/nodeCount;
      pressureNodes.push({y:ny,strength:0.5+Math.random()*0.5});
    }
  }

  class WaveRing{
    constructor(x,y,dir){this.x=x;this.y=y;this.r=0;this.maxR=120;this.dir=dir;this.alpha=0.3;}
    update(){this.r+=1.5;this.alpha=0.3*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();
      if(this.dir>0)cx.arc(this.x,this.y,this.r,0,Math.PI);
      else cx.arc(this.x,this.y,this.r,Math.PI,Math.PI*2);
      cx.strokeStyle='rgba(0,200,255,'+this.alpha+')';cx.lineWidth=1.5;cx.stroke();
    }
  }

  function drawTransducerArray(y,isTop){
    const cx2=W/2;
    cx.fillStyle='#2a2a3a';
    cx.fillRect(cx2-180,isTop?y-12:y-3,360,15);
    cx.strokeStyle='rgba(0,255,170,0.3)';cx.lineWidth=1;
    cx.strokeRect(cx2-180,isTop?y-12:y-3,360,15);
    for(let i=0;i<12;i++){
      const x=cx2-165+i*30;
      const pulse=levActive?3+Math.sin(t*6+i*0.5)*2:0;
      cx.save();cx.shadowColor=levActive?'hsl('+(100+i*15)+',80%,50%)':'#333';
      cx.shadowBlur=pulse;
      cx.fillStyle=levActive?'hsl('+(100+i*15)+',80%,50%)':'#555';
      cx.beginPath();cx.arc(x,y,5,0,Math.PI*2);cx.fill();
      cx.restore();
    }
  }

  function drawStandingWaveField(){
    if(!levActive)return;
    const cx2=W/2,topY=50,botY=H-50,gap=botY-topY;
    const wavelength=343000/simFreq;
    const nodeCount=Math.floor(gap/(wavelength*50));
    const phaseRad=simPhase*Math.PI/180;

    for(let y=topY;y<botY;y+=2){
      const normY=(y-topY)/gap;
      const pressure=Math.abs(Math.sin(normY*Math.PI*nodeCount+phaseRad));
      const osc=Math.cos(t*4)*0.3+0.7;
      const w=pressure*osc*130*(simPower/100);
      const r=Math.floor(pressure*200);
      const g=Math.floor((1-pressure)*200);
      cx.fillStyle='rgba('+r+','+g+',100,'+(pressure*0.25)+')';
      cx.fillRect(cx2-w,y,w*2,2);
    }
  }

  function drawPressureNodes(){
    pressureNodes.forEach((n,i)=>{
      cx.setLineDash([4,4]);
      cx.strokeStyle='rgba(0,255,100,0.25)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(W/2-140,n.y);cx.lineTo(W/2+140,n.y);cx.stroke();
      cx.setLineDash([]);
      cx.fillStyle='rgba(0,255,100,0.4)';cx.font='8px monospace';
      cx.textAlign='left';
      cx.fillText('NODE '+(i+1)+' ['+n.strength.toFixed(2)+']',W/2+145,n.y+3);
    });
  }

  function updateParticles(){
    particles.forEach(p=>{
      if(levActive&&pressureNodes.length>0){
        let closest=pressureNodes[0],minD=Math.abs(p.y-pressureNodes[0].y);
        pressureNodes.forEach(n=>{const d=Math.abs(p.y-n.y);if(d<minD){minD=d;closest=n;}});
        p.targetY=closest.y;
        p.vy+=(p.targetY-p.y)*0.008;
        p.vy*=0.95;
        p.vx=(Math.sin(t*3+p.wobble)*0.3);
        p.trapped=minD<15;
      }else{
        p.vy+=0.15;p.vy*=0.98;p.vx*=0.98;
        p.trapped=false;
      }
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<W/2-130)p.x=W/2-130;if(p.x>W/2+130)p.x=W/2+130;
      if(p.y>H-55){p.y=H-55;p.vy*=-0.3;}
      if(p.y<55){p.y=55;p.vy*=-0.3;}
    });
  }

  function drawParticles(){
    particles.forEach(p=>{
      cx.save();
      if(p.trapped){cx.shadowColor='#00ff88';cx.shadowBlur=12;}
      cx.fillStyle=p.trapped?'#ffffff':'rgba(200,200,200,0.6)';
      cx.beginPath();cx.arc(p.x,p.y,p.radius,0,Math.PI*2);cx.fill();
      if(p.trapped){
        cx.strokeStyle='rgba(0,255,136,0.3)';cx.lineWidth=1;
        cx.beginPath();cx.arc(p.x,p.y,p.radius+6+Math.sin(t*5)*3,0,Math.PI*2);cx.stroke();
      }
      cx.restore();
    });
  }

  function drawSpectrumBar(){
    const bx=20,by=H-45,bw=200,bh=30;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(bx,by,bw,bh);
    const bins=64;const binW=bw/bins;
    for(let i=0;i<bins;i++){
      const freq=i/bins;
      const peak=Math.exp(-Math.pow((freq-0.5)*10,2));
      const h2=peak*bh*0.8+Math.random()*2;
      const hue=120+freq*120;
      cx.fillStyle='hsla('+hue+',70%,50%,0.6)';
      cx.fillRect(bx+i*binW,by+bh-h2,binW-0.5,h2);
    }
    cx.fillStyle='rgba(0,255,170,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ULTRASONIC SPECTRUM — 38-42 kHz',bx+4,by-4);
  }

  function drawPhysicsInfo(){
    const px=W-220,py=H-80,pw=200,ph=65;
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(0,255,170,0.12)';cx.strokeRect(px,py,pw,ph);
    cx.fillStyle='rgba(0,255,170,0.5)';cx.font='8px monospace';cx.textAlign='left';
    const wl=(343000/simFreq).toFixed(2);
    cx.fillText('Frequency: '+(simFreq/1000)+' kHz',px+8,py+14);
    cx.fillText('Wavelength: '+wl+' mm',px+8,py+28);
    cx.fillText('Phase: '+simPhase+'deg  Power: '+simPower+'%',px+8,py+42);
    cx.fillText('Nodes: '+pressureNodes.length+'  Particles: '+particles.length,px+8,py+56);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,220,54);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,220,54);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('ACOUSTIC LEVITATION ARRAY',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Standing Wave Trapping Simulation',16,40);
    cx.fillText('Trapped: '+particles.filter(p=>p.trapped).length+'/'+particles.length,16,54);
    cx.restore();
  }

  function drawGrid(){
    cx.strokeStyle='rgba(0,255,170,0.04)';cx.lineWidth=0.5;
    for(let x=0;x<W;x+=40){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
    for(let y=0;y<H;y+=40){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,10,20,0.15)';cx.fillRect(0,0,W,H);

    // Slowly cycle parameters
    simPhase=180+Math.sin(t*0.3)*20;
    simPower=70+Math.sin(t*0.2)*15;

    if(Math.floor(t*60)%30===0)waveRings.push(new WaveRing(W/2,50,1));
    if(Math.floor(t*60)%30===15)waveRings.push(new WaveRing(W/2,H-50,-1));

    drawGrid();
    drawStandingWaveField();
    drawPressureNodes();
    drawTransducerArray(50,true);
    drawTransducerArray(H-50,false);

    for(let i=waveRings.length-1;i>=0;i--){
      if(!waveRings[i].update())waveRings.splice(i,1);
      else waveRings[i].draw();
    }

    updateParticles();
    drawParticles();
    drawSpectrumBar();
    drawPhysicsInfo();
    drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Standing Wave Acoustic Levitation — Pressure Node Trapping',8,H-8);

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
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);
