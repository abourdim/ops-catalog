/**
 * SDR Demod Challenge — Workshop DIY v1.0
 * Gamified modulation identification with spectrum/waterfall
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="10 5"><animate attributeName="stroke-dashoffset" values="0;60" dur="3s" repeatCount="indefinite"/></circle><text x="35" y="58" font-size="28" fill="currentColor">?</text></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

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
    ...LANG_BASE.en,title:'SDR Demod Challenge',subtitle:'🎯 Demod Challenge — Identify mystery signals',disconnected:'Disconnected',connected:'Connected',mainSection:'Demod Challenge',mainDesc:'Identify the modulation, decode the message',sectionA:'Scoreboard',sectionB:'Demod Toolbox',sectionC:'Signal Recognition Guide',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'The main display shows the Demod Challenge simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for SDR Demod Challenge. Choose you',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Scoreboard" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات مع RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🎯 Demod Challenge ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
levelLabel:'Level',score:'Score:',streak:'Streak:',yourGuess:'Your Guess — What modulation is this?',newChallenge:'🎲 New Challenge',hintBtn:'💡 Hint',revealBtn:'👁 Reveal',
totalAttempts:'Total Attempts:',correct:'Correct:',accuracy:'Accuracy:',bestStreak:'Best Streak:',
theoryIntro:'Tips for identifying modulation by spectrum:',theory1:'AM: carrier + two symmetric sidebands',theory2:'FM: wider bandwidth, spread carrier energy',theory3:'SSB: single sideband, no carrier',theory4:'BPSK/QPSK: sinc-shaped spectrum',theory5:'CW: narrow spike, on-off keying on waterfall',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
correctGuess:'✅ Correct!',wrongGuess:'❌ Wrong!',hintMsg:'💡 Hint:',revealed:'👁 Answer:',newChal:'🎲 New challenge loaded',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Up',step1Desc:'Configure the parameters for SDR Demod Challenge. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Scoreboard" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Demod Toolbox". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is SDR Demod Challenge?',faq_a1:'Demod Challenge is an interactive simulation that demonstrates SDR techniques concepts. Identify the modulation, decode the message. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real digital signal processing behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real digital signal processing principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Dsp Workbench and Sdr Fft Racing. Each app in this category teaches a different aspect of digital signal processing.',demo_s1:'Welcome to SDR Demod Challenge! Look at the main display — this is where the digital signal processing simulation runs.',demo_s2:'Click New Challenge for a mystery signal. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Scoreboard" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital signal processing.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Demod Challenge! This is like a science experiment on your computer. You get to control a real SDR techniques simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for SDR Demod Challenge.  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital signal processing concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'SDR Demod Challenge: Identify the modulation, decode the message. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure SDR through Capture Signal to Process & Filter and Visualize Output.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Scoreboard" and "Demod Toolbox" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Aviation Radio',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. Demod Challenge builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Demod Challenge',
    wiki_math: 'The mathematics behind Demod Challenge: QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced aviation radio practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to aviation radio. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with aviation radio: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in aviation radio.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Aviation Radio carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
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
    theory: 'Demod Challenge demonstrates key principles from SDR techniques. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world aviation radio?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional aviation radio systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'RF Waterfall Display',related1_desc:'Live waterfall showing WiFi, Bluetooth, FM, keyfobs',related1_path:'../../10-hrf-sigint/hrf-rf-waterfall/index.html',related2_name:'Receiver Pipeline',related2_desc:'Step-by-step DSP: antenna to audio output',related2_path:'../../33-sdr-learning/sdr-build-receiver/index.html',related3_name:'Radio Telescope — Hydrogen Line',related3_desc:'1420.405 MHz hydrogen emission spectrum',related3_path:'../../10-hrf-sigint/hrf-radio-telescope/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'',pathPrev_path:'',pathNext_name:'DSP Workbench',pathNext_path:'../../27-sdr-dsp/sdr-dsp-workbench/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does an SDR replace with software?',quiz_q1a:'Antenna',quiz_q1b:'Hardware radio components',quiz_q1c:'Power supply',quiz_q1d:'Display',quiz_q1_answer:'1',quiz_q2:'If frequency doubles, what happens to wavelength?',quiz_q2a:'Doubles',quiz_q2b:'Halves',quiz_q2c:'Stays same',quiz_q2d:'Triples',quiz_q2_answer:'1',quiz_q3:'What is FFT used for?',quiz_q3a:'File transfer',quiz_q3b:'Converting time-domain to frequency-domain',quiz_q3c:'Formatting text',quiz_q3d:'Finding files',quiz_q3_answer:'1',quiz_q4:'What is machine learning?',quiz_q4a:'Programming robots',quiz_q4b:'Systems that learn from data',quiz_q4c:'Manual computation',quiz_q4d:'Hardware design',quiz_q4_answer:'1',quiz_q5:'What is a neural network?',quiz_q5a:'Physical wires',quiz_q5b:'Computing system inspired by biological neurons',quiz_q5c:'Social network',quiz_q5d:'Radio network',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'Snowden\'s 2013 leaks revealed that NSA\'s PRISM program collected data directly from Google, Facebook, Apple, and Microsoft servers. XKeyscore could search nearly everything a user does on the internet in real time.',realworld2:'The Colonial Pipeline ransomware (2021) shut the largest US fuel pipeline for 5 days. A single compromised VPN password caused fuel shortages across 17 states. The company paid $4.4M in Bitcoin ransom.',realworld3:'The Mirai botnet (2016) enslaved 600,000 IoT devices — cameras, DVRs, routers — using 61 default passwords. Its 1.2 Tbps DDoS attack on Dyn DNS took down Twitter, Netflix, Reddit, and GitHub simultaneously.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In embedded security, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in embedded security and reveal the hidden complexity beneath simple-looking systems.',wiki_concept_title:'💡 Core Concept',wiki_concept:'SDR Demod Challenge demonstrates a fundamental concept in embedded security. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',wiki_realworld_title:'🌐 Real-World Applications',wiki_realworld:'The principles demonstrated in SDR Demod Challenge have direct real-world applications. Professionals in embedded security use these same concepts daily. In industry, ESP32 and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',wiki_safety_title:'⚠️ Safety & Responsibility',wiki_safety:'Working with embedded security carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.',proTipTitle:'💡 Pro Tips',proTip1:'Use channel hopping (channels 1, 6, 11) for WiFi scanning — these are the only non-overlapping 2.4GHz channels and catch 90% of traffic.',proTip2:'Add a 10μF capacitor across the ESP32 power pins. WiFi transmission causes current spikes that can crash the board without proper decoupling.',funFactTitle:'🎯 Did You Know?',funFact:'The first computer virus, Creeper (1971), displayed \\x27I\\x27m the creeper, catch me if you can!\\x27 on ARPANET terminals. The first antivirus, Reaper, was written specifically to chase and delete it.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
fr:{title:'Defi Demodulation SDR',subtitle:'🎯 Defi Demod — Identifiez les signaux mysteres',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Defi Demodulation',mainDesc:'Identifiez la modulation, decodez le message',sectionA:'Tableau de Score',sectionB:'Boite a Outils Demod',sectionC:'Guide de Reconnaissance',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'L écran principal affiche la simulation Demod Challenge. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for SDR Demod Challenge. Choose you',howto_2:'Etudiez spectre et waterfall.',howto_3:'Utilisez les outils demod.',howto_4:'Cliquez la bonne modulation!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🎯 Defi Demod pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
levelLabel:'Niveau',score:'Score:',streak:'Serie:',yourGuess:'Votre Reponse — Quelle modulation?',newChallenge:'🎲 Nouveau Defi',hintBtn:'💡 Indice',revealBtn:'👁 Reveler',
totalAttempts:'Tentatives:',correct:'Correct:',accuracy:'Precision:',bestStreak:'Meilleure Serie:',
theoryIntro:'Astuces pour identifier la modulation par le spectre:',theory1:'AM: porteuse + deux bandes laterales',theory2:'FM: bande plus large',theory3:'SSB: bande laterale unique',theory4:'BPSK/QPSK: spectre en sinc',theory5:'CW: pic etroit, manipulation par tout ou rien',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',
correctGuess:'✅ Correct!',wrongGuess:'❌ Faux!',hintMsg:'💡 Indice:',revealed:'👁 Reponse:',newChal:'🎲 Nouveau defi charge',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Demod Challenge est une simulation interactive qui démontre les concepts de techniques SDR. Identify the modulation, decode the message. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Fft Racing and Sdr Signal Generator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de radio aéronautique',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. Demod Challenge s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Demod Challenge',
    wiki_math: 'Les mathématiques derrière Demod Challenge : QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de radio aéronautique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour radio aéronautique. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en radio aéronautique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Radio aéronautique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
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
    theory: 'Demod Challenge démontre les principes clés de techniques SDR. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec aviation radio dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Affichage Cascade RF',related1_desc:'Cascade en direct : WiFi, Bluetooth, FM, t\\u00e9l\\u00e9commandes',related1_path:'../../10-hrf-sigint/hrf-rf-waterfall/index.html',related2_name:'Pipeline Recepteur',related2_desc:'DSP etape par etape: antenne vers sortie audio',related2_path:'../../33-sdr-learning/sdr-build-receiver/index.html',related3_name:'Radiotélescope — Raie Hydrogène',related3_desc:'Spectre d\\',related3_path:'../../10-hrf-sigint/hrf-radio-telescope/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'',pathPrev_path:'',pathNext_name:'Atelier DSP',pathNext_path:'../../27-sdr-dsp/sdr-dsp-workbench/index.html',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'Les fuites de Snowden en 2013 ont révélé que le programme PRISM de la NSA collectait des données directement depuis les serveurs de Google, Facebook, Apple et Microsoft.',realworld2:'Le ransomware Colonial Pipeline (2021) a fermé le plus grand oléoduc américain pendant 5 jours. Un seul mot de passe VPN compromis a causé des pénuries dans 17 états.',realworld3:'Le botnet Mirai (2016) a asservi 600 000 appareils IoT en utilisant 61 mots de passe par défaut. Son attaque DDoS de 1,2 Tbps a fait tomber Twitter, Netflix et Reddit.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En sécurité embarquée, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en sécurité embarquée et révèlent la complexité cachée sous des systèmes simples en apparence.',wiki_concept_title:'💡 Concept fondamental',wiki_concept:'SDR Demod Challenge illustre un concept fondamental en sécurité embarquée. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',wiki_realworld_title:'🌐 Applications réelles',wiki_realworld:'Les principes démontrés dans SDR Demod Challenge ont des applications directes dans le monde réel. Les professionnels de sécurité embarquée utilisent ces mêmes concepts quotidiennement. Dans l\'industrie, ESP32 et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',wiki_safety_title:'⚠️ Sécurité et responsabilité',wiki_safety:'Travailler en sécurité embarquée implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\'accède pas à de vrais réseaux.'},
ar:{title:'تحدي ازالة التعديل SDR',subtitle:'🎯 تحدي ازالة التعديل — حدد الاشارات الغامضة',disconnected:'غير متصل',connected:'متصل',mainSection:'تحدي ازالة التعديل',mainDesc:'حدد التعديل وفك تشفير الرسالة',sectionA:'لوحة النتائج',sectionB:'ادوات ازالة التعديل',sectionC:'دليل التعرف على الاشارات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
howto_1:'تعرض الشاشة الرئيسية محاكاة Demod Challenge. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for SDR Demod Challenge. Choose you',howto_2:'ادرس الطيف والشلال.',howto_3:'استخدم ادوات ازالة التعديل.',howto_4:'اضغط التعديل الصحيح للتسجيل!',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🎯 تحدي ازالة التعديل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
levelLabel:'المستوى',score:'النقاط:',streak:'التتابع:',yourGuess:'تخمينك — ما هذا التعديل؟',newChallenge:'🎲 تحدي جديد',hintBtn:'💡 تلميح',revealBtn:'👁 كشف',
totalAttempts:'اجمالي المحاولات:',correct:'صحيح:',accuracy:'الدقة:',bestStreak:'افضل تتابع:',
theoryIntro:'نصائح لتحديد التعديل من الطيف:',theory1:'AM: حامل + نطاقين جانبيين متماثلين',theory2:'FM: عرض نطاق اوسع',theory3:'SSB: نطاق جانبي واحد بدون حامل',theory4:'BPSK/QPSK: طيف شكل sinc',theory5:'CW: ذروة ضيقة، نمط تشغيل/ايقاف',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
correctGuess:'✅ صحيح!',wrongGuess:'❌ خطا!',hintMsg:'💡 تلميح:',revealed:'👁 الجواب:',newChal:'🎲 تم تحميل تحدي جديد',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Demod Challenge هي محاكاة تفاعلية توضح مفاهيم تقنيات SDR. Identify the modulation, decode the message. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Fft Racing and Sdr Signal Generator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الراديو الجوي',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. يبني Demod Challenge على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Demod Challenge',
    wiki_math: 'الرياضيات وراء Demod Challenge: QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الراديو الجوي المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الراديو الجوي. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الراديو الجوي: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الراديو الجوي يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
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
    theory: 'Demod Challenge يوضح المبادئ الأساسية في تقنيات SDR. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـaviation radio في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0639\\u0631\\u0636 \\u0634\\u0644\\u0627\\u0644 RF',related1_desc:'\\u0634\\u0644\\u0627\\u0644 \\u0645\\u0628\\u0627\\u0634\\u0631: WiFi\\u060C Bluetooth\\u060C FM\\u060C \\u0645\\u0641\\u0627\\u062A\\u064A\\u062D',related1_path:'../../10-hrf-sigint/hrf-rf-waterfall/index.html',related2_name:'خط انابيب المستقبل',related2_desc:'DSP خطوة بخطوة: من الهوائي الى الصوت',related2_path:'../../33-sdr-learning/sdr-build-receiver/index.html',related3_name:'تلسكوب راديوي — خط الهيدروجين',related3_desc:'طيف انبعاث الهيدروجين عند 1420.405 ميغاهرتز',related3_path:'../../10-hrf-sigint/hrf-radio-telescope/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'',pathPrev_path:'',pathNext_name:'ورشة DSP',pathNext_path:'../../27-sdr-dsp/sdr-dsp-workbench/index.html',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'كشفت تسريبات سنودن عام 2013 أن برنامج بريزم التابع لوكالة الأمن القومي جمع البيانات مباشرة من خوادم جوجل وفيسبوك وآبل ومايكروسوفت.',realworld2:'أدى هجوم الفدية على خط أنابيب كولونيال (2021) إلى إغلاق أكبر خط أنابيب وقود في أمريكا لمدة 5 أيام بسبب كلمة مرور VPN واحدة مخترقة.',realworld3:'استعبد بوتنت ميراي (2016) أكثر من 600 ألف جهاز إنترنت الأشياء باستخدام 61 كلمة مرور افتراضية.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في الأمن المدمج معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في الأمن المدمج وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',wiki_concept_title:'💡 المفهوم الأساسي',wiki_concept:'SDR Demod Challenge يوضح مفهومًا أساسيًا في الأمن المدمج. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',wiki_realworld_title:'🌐 التطبيقات الواقعية',wiki_realworld:'المبادئ المعروضة في SDR Demod Challenge لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في الأمن المدمج هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ ESP32 وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',wiki_safety_title:'⚠️ السلامة والمسؤولية',wiki_safety:'العمل في مجال الأمن المدمج يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuessButtons();}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='demod-challenge-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ CHALLENGE ENGINE ═══════ */
const MODS=['AM','FM','SSB','BPSK','QPSK','CW','Noise','Chirp'];
const HINTS={AM:'Two symmetric sidebands around carrier',FM:'Wide bandwidth, spread energy',SSB:'One sideband only, no carrier',BPSK:'Sinc spectrum, 180-degree phase shifts',QPSK:'Wider sinc, 4 phase states',CW:'Very narrow, on-off pattern',Noise:'Flat broadband spectrum',Chirp:'Frequency sweeps upward over time'};
let currentMod='',level=1,score=0,streak=0,bestStreak=0,totalAttempts=0,correctCount=0;
let signalBuf=null,animFrame=null;
const SR=8192,N=1024;

function generateChallenge(){
  currentMod=MODS[Math.floor(Math.random()*MODS.length)];
  const buf=new Float32Array(N),dt=1/SR,fc=800+Math.random()*400;
  for(let i=0;i<N;i++){const t=i*dt;
    switch(currentMod){
      case'AM':buf[i]=(1+.7*Math.sin(2*Math.PI*50*t))*Math.cos(2*Math.PI*fc*t);break;
      case'FM':{const ph=2*Math.PI*fc*t+8*Math.sin(2*Math.PI*30*t);buf[i]=Math.cos(ph);break;}
      case'SSB':{const m=Math.sin(2*Math.PI*80*t),h=Math.cos(2*Math.PI*80*t);buf[i]=m*Math.cos(2*Math.PI*fc*t)-h*Math.sin(2*Math.PI*fc*t);break;}
      case'BPSK':{const bit=Math.floor(i/64)%2?1:-1;buf[i]=bit*Math.cos(2*Math.PI*fc*t);break;}
      case'QPSK':{const s2=Math.floor(i/64)%4;const ang=[.785,2.356,3.927,5.498][s2];buf[i]=Math.cos(2*Math.PI*fc*t+ang);break;}
      case'CW':{const on=Math.sin(2*Math.PI*2*t)>0?1:0;buf[i]=on*Math.cos(2*Math.PI*fc*t);break;}
      case'Noise':buf[i]=Math.random()*2-1;break;
      case'Chirp':buf[i]=Math.sin(2*Math.PI*(fc*.5+fc*2*(i/N))*t);break;
    }
    buf[i]+=(Math.random()-.5)*.15;
  }
  signalBuf=buf;
  drawAll();
  $('feedback').textContent='';$('feedback').style.color='';
  $('levelNum').textContent=level;
  setStatus(true);
  log(LANG[currentLang].newChal,'info');
}

function computeSpec(buf){
  const mag=new Float32Array(N/2);
  for(let k=0;k<N/2;k++){let re=0,im=0;for(let n=0;n<N;n++){const a=-2*Math.PI*k*n/N;re+=buf[n]*Math.cos(a);im+=buf[n]*Math.sin(a);}mag[k]=Math.sqrt(re*re+im*im)/N;}
  return mag;
}

function drawAll(){
  if(!signalBuf)return;
  const mag=computeSpec(signalBuf);
  // Spectrum
  const c1=$('specCanvas');if(c1){const ctx=c1.getContext('2d'),w=c1.width,h=c1.height;
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    const mx=Math.max(...mag)||1;
    ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
    for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
    ctx.stroke();ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Mystery Spectrum',4,12);
  }
  // Waterfall
  const c2=$('waterfallCanvas');if(c2){const ctx=c2.getContext('2d'),w=c2.width,h=c2.height;
    const img=ctx.getImageData(0,0,w,h-2);ctx.putImageData(img,0,2);
    const mx=Math.max(...mag)||1;
    for(let x=0;x<w;x++){
      const idx=Math.floor(x/w*mag.length),val=mag[idx]/mx;
      const db=Math.max(0,Math.min(1,(20*Math.log10(val+1e-10)+60)/60));
      let r,g,b;
      if(db<.25){r=0;g=0;b=Math.floor(db*4*255);}else if(db<.5){r=0;g=Math.floor((db-.25)*4*255);b=255;}
      else if(db<.75){r=Math.floor((db-.5)*4*255);g=255;b=255-Math.floor((db-.5)*4*255);}
      else{r=255;g=255-Math.floor((db-.75)*4*255);b=0;}
      ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(x,0,1,2);
    }
  }
}

function makeGuess(guess){
  totalAttempts++;
  const fb=$('feedback');
  if(guess===currentMod){
    correctCount++;streak++;score+=10+streak*2;
    if(streak>bestStreak)bestStreak=streak;
    level=Math.min(10,Math.floor(correctCount/3)+1);
    fb.textContent=LANG[currentLang].correctGuess+' +'+( 10+streak*2)+' pts';fb.style.color='#4f4';
    log(LANG[currentLang].correctGuess+' '+currentMod,'success');
    setTimeout(generateChallenge,1500);
  }else{
    streak=0;score=Math.max(0,score-5);
    fb.textContent=LANG[currentLang].wrongGuess+' -5 pts';fb.style.color='#f44';
    log(LANG[currentLang].wrongGuess+' (was '+currentMod+', guessed '+guess+')','error');
  }
  $('scoreVal').textContent=score;$('streakVal').textContent=streak;
  $('totalVal').textContent=totalAttempts;$('correctVal').textContent=correctCount;
  $('accVal').textContent=totalAttempts?Math.round(correctCount/totalAttempts*100)+'%':'0%';
  $('bestStreakVal').textContent=bestStreak;$('levelNum').textContent=level;
}

function showHint(){
  const h=HINTS[currentMod]||'Look at the spectrum shape carefully.';
  $('feedback').textContent=LANG[currentLang].hintMsg+' '+h;$('feedback').style.color='#ff8';
  log(LANG[currentLang].hintMsg+' '+h,'info');
}
function revealAnswer(){
  $('feedback').textContent=LANG[currentLang].revealed+' '+currentMod;$('feedback').style.color='#4af';
  streak=0;$('streakVal').textContent=0;
  log(LANG[currentLang].revealed+' '+currentMod,'info');
}

function tryDemod(type){
  if(!signalBuf)return;
  const c=$('demodCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const out=new Float32Array(N);const fc=1000,dt=1/SR;
  if(type==='envelope'){for(let i=0;i<N;i++)out[i]=Math.abs(signalBuf[i]);for(let i=1;i<N;i++)out[i]=out[i-1]+.05*(out[i]-out[i-1]);}
  else if(type==='coherent'){for(let i=0;i<N;i++)out[i]=signalBuf[i]*Math.cos(2*Math.PI*fc*i*dt)*2;for(let i=1;i<N;i++)out[i]=out[i-1]+.02*(out[i]-out[i-1]);}
  else if(type==='fm'){for(let i=1;i<N;i++){const p1=Math.atan2(signalBuf[i],signalBuf[Math.max(0,i-1)]);let dp=p1;if(dp>Math.PI)dp-=2*Math.PI;if(dp<-Math.PI)dp+=2*Math.PI;out[i]=dp;}}
  else if(type==='psk'){for(let i=0;i<N;i++){const sym=Math.floor(i/64);const prev=Math.max(0,(sym-1)*64);out[i]=signalBuf[i]*signalBuf[prev]>0?1:-1;}}
  ctx.strokeStyle='#4f4';ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,N);for(let i=0;i<show;i++){const x=i/show*w,y=h/2-out[i]*h*.3;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();ctx.fillStyle='#4f4';ctx.font='10px monospace';ctx.fillText('Demod: '+type,4,12);
  log('Tried demod: '+type,'tx');
}

function buildGuessButtons(){
  const el=$('guessButtons');if(!el)return;el.innerHTML='';
  MODS.forEach(m=>{const b=document.createElement('button');b.className='btn-sm';b.textContent=m;b.onclick=()=>makeGuess(m);el.appendChild(b);});
}

// Animate waterfall continuously
let wfAnim=null;
function wfLoop(){if(!signalBuf){wfAnim=requestAnimationFrame(wfLoop);return;}
  // Re-generate with slight variation for waterfall scrolling
  const fc=800+Math.random()*400,dt=1/SR;
  for(let i=0;i<N;i++){const t=i*dt;
    switch(currentMod){
      case'AM':signalBuf[i]=(1+.7*Math.sin(2*Math.PI*50*t))*Math.cos(2*Math.PI*fc*t);break;
      case'FM':signalBuf[i]=Math.cos(2*Math.PI*fc*t+8*Math.sin(2*Math.PI*30*t));break;
      case'SSB':{const m=Math.sin(2*Math.PI*80*t);signalBuf[i]=m*Math.cos(2*Math.PI*fc*t);break;}
      case'BPSK':signalBuf[i]=(Math.floor(i/64)%2?1:-1)*Math.cos(2*Math.PI*fc*t);break;
      case'QPSK':signalBuf[i]=Math.cos(2*Math.PI*fc*t+[.785,2.356,3.927,5.498][Math.floor(i/64)%4]);break;
      case'CW':signalBuf[i]=(Math.sin(2*Math.PI*2*t)>0?1:0)*Math.cos(2*Math.PI*fc*t);break;
      case'Noise':signalBuf[i]=Math.random()*2-1;break;
      case'Chirp':signalBuf[i]=Math.sin(2*Math.PI*(fc*.5+fc*2*(i/N))*t);break;
    }
    signalBuf[i]+=(Math.random()-.5)*.15;
  }
  drawAll();wfAnim=requestAnimationFrame(wfLoop);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('newChalBtn').onclick=generateChallenge;$('hintBtn').onclick=showHint;$('revealBtn').onclick=revealAnswer;
  buildGuessButtons();generateChallenge();wfLoop();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Demod Challenge
   Animated signal constellation scramble + score fireworks
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const pts=[];
function boot(){
  let el=document.getElementById('demodSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='demodSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='rgba(6,8,14,.12)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Rotating constellation
  const ccx=W*.25,ccy=H/2,cr=H*.35;
  cx.strokeStyle='rgba(100,200,255,.08)';cx.lineWidth=1;
  cx.beginPath();cx.arc(ccx,ccy,cr,0,Math.PI*2);cx.stroke();
  cx.beginPath();cx.moveTo(ccx-cr-5,ccy);cx.lineTo(ccx+cr+5,ccy);cx.stroke();
  cx.beginPath();cx.moveTo(ccx,ccy-cr-5);cx.lineTo(ccx,ccy+cr+5);cx.stroke();
  const numPts=32;
  for(let i=0;i<numPts;i++){
    const a=i/numPts*Math.PI*2+t*.5;const r2=cr*(.4+.3*Math.sin(i*1.7+t));
    const px=ccx+Math.cos(a)*r2+(Math.random()-.5)*4;
    const py=ccy+Math.sin(a)*r2+(Math.random()-.5)*4;
    cx.fillStyle=acc;cx.globalAlpha=.5;cx.beginPath();cx.arc(px,py,2.5,0,Math.PI*2);cx.fill();cx.globalAlpha=1;
  }
  // Signal type indicator ring
  const modTypes=['AM','FM','SSB','BPSK','QPSK','CW'];
  modTypes.forEach((m,i)=>{
    const a=i/modTypes.length*Math.PI*2-Math.PI/2+t*.2;
    const mx=W*.65+Math.cos(a)*60,my=H/2+Math.sin(a)*60;
    const isCurrent=typeof currentMod!=='undefined'&&currentMod===m;
    cx.fillStyle=isCurrent?acc:'rgba(100,200,255,.2)';cx.font=isCurrent?'bold 11px monospace':'9px monospace';
    cx.textAlign='center';cx.fillText(m,mx,my+4);
    if(isCurrent){cx.strokeStyle=acc+'66';cx.lineWidth=1;cx.beginPath();cx.arc(mx,my,16,0,Math.PI*2);cx.stroke();}
  });
  // Score/streak display
  const sc=typeof score!=='undefined'?score:0,st=typeof streak!=='undefined'?streak:0;
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(W*.55,8,90,20);
  cx.fillStyle='#4f4';cx.font='10px Orbitron,monospace';cx.textAlign='center';
  cx.fillText(`${sc} pts | x${st}`,W*.55+45,22);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Signal Identification — Constellation View',8,14);
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
