/**
 * Workshop DIY — GPS Spoofing Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled) return;
  if(!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value=0.08;
  const t = audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}
}

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
  en:{
    ...LANG_BASE.en,title:'GPS Spoofing Sim',subtitle:'GPS Spoofing Simulator',disconnected:'Idle',connected:'Spoofing',mainSection:'GPS Spoofing Simulator',mainDesc:'Simulate satellite spoofing and position manipulation',sectionA:'Satellite Constellation',sectionB:'Spoofing Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Gps Spoofing Sim simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Satellite Constellation" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',working:'Working...',ready:'GPS Spoofing Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startSpoof:'Start Spoofing',detectSpoof:'Detect Spoof',resetSim:'Reset',spoofTarget:'Spoof Target',spoofParams:'Spoof Parameters',latitude:'Latitude:',longitude:'Longitude:',power:'Power (dBm):',satellites:'Spoofed Sats:',sigInfo:'Position Info',satHint:'GPS satellites and spoofed status.',transmitted:'Signal transmitted',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is GPS Spoofing Sim?',faq_a1:'Gps Spoofing Sim is an interactive simulation that demonstrates RF warfare concepts. Simulate satellite spoofing and position manipulation. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real electronic warfare behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Set target coordinates. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real electronic warfare principles. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to GPS Spoofing Sim! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Set target coordinates. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Satellite Constellation" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Gps Spoofing Sim! This is like a science experiment on your computer. You get to control a real RF warfare simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is GPS Spoofing Sim?',wiki_concept:'GPS Spoofing Sim is a technique used in electronic warfare. Simulate satellite spoofing and position manipulation. In professional settings, this technology requires HackRF and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Scan the electromagnetic spectrum to identify hostile RF emissions. Second: Analyze the threat signal: frequency, power, modulation, and direction. The simulation runs these stages in real time, showing you intermediate results at each step. In real electronic warfare, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'GPS Spoofing Sim has practical applications in electronic warfare. Professionals use similar techniques with HackRF in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'GPS Spoofing Sim: Simulate satellite spoofing and position manipulation. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Detect RF Threat through Characterize Signal to Deploy Countermeasure and Assess Effectiveness.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Satellite Constellation" and "Spoofing Techniques" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'GPS Tracker Builder — Covert Tracking Lab',related1_desc:'Build covert GPS trackers and learn vehicle/asset tracking detection',related1_path:'../../52-hardware-implants/imp-gps-tracker-builder/index.html',related2_name:'Incident Dashboard',related2_desc:'Monitor and respond to network outage scenarios',related2_path:'../../09-net-ultimate/web-operation-blackout/index.html',related3_name:'Antenna Profiler',related3_desc:'Visualize gain, radiation pattern and SWR',related3_path:'../../32-sdr-tools/sdr-antenna-profiler/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Frequency Deconfliction Manager',pathPrev_path:'../../54-rf-warfare/rfw-frequency-deconfliction/index.html',pathNext_name:'IMSI Catcher Sim',pathNext_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does AI stand for?',quiz_q1a:'Automated Input',quiz_q1b:'Artificial Intelligence',quiz_q1c:'Analog Interface',quiz_q1d:'Active Integration',quiz_q1_answer:'1',quiz_q2:'Which frequency range is UHF?',quiz_q2a:'3-30 MHz',quiz_q2b:'30-300 MHz',quiz_q2c:'300 MHz-3 GHz',quiz_q2d:'3-30 GHz',quiz_q2_answer:'2',quiz_q3:'What is a neural network?',quiz_q3a:'Physical wires',quiz_q3b:'Computing system inspired by biological neurons',quiz_q3c:'Social network',quiz_q3d:'Radio network',quiz_q3_answer:'1',quiz_q4:'What is frequency measured in?',quiz_q4a:'Meters',quiz_q4b:'Hertz',quiz_q4c:'Watts',quiz_q4d:'Volts',quiz_q4_answer:'1',quiz_q5:'If frequency doubles, what happens to wavelength?',quiz_q5a:'Doubles',quiz_q5b:'Halves',quiz_q5c:'Stays same',quiz_q5d:'Triples',quiz_q5_answer:'1'},
    wiki_history_title: '📜 History of Exploit Development',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. Gps Spoofing Sim builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Rfw Gps Spoofing Sim',
    wiki_math: 'The mathematics behind Gps Spoofing Sim: QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR. Position is found by solving 4 simultaneous equations: (x-xi)² + (y-yi)² + (z-zi)² = (c·(t-ti))² for each satellite i. Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced exploit development practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to exploit development. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with exploit development: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in exploit development.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Exploit Development carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss2_term: 'Pseudorange',
    gloss2_def: 'The estimated distance between a GPS receiver and a satellite, calculated from signal travel time. Four pseudoranges determine 3D position plus clock correction.',
    gloss3_term: 'Spread Spectrum',
    gloss3_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Gps Spoofing Sim demonstrates key principles from RF warfare. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. GPS uses 31+ satellites broadcasting precise time signals on L1 (1575.42 MHz) and L2 (1227.60 MHz). Four satellites give 3D position + time. RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world exploit development?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional exploit development systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr:{
    ...LANG_BASE.fr,title:'Sim Spoofing GPS',subtitle:'Simulateur de Spoofing GPS',disconnected:'Inactif',connected:'Spoofing',mainSection:'Simulateur Spoofing GPS',mainDesc:'Simuler le spoofing satellite et la manipulation de position',sectionA:'Constellation Satellite',sectionB:'Techniques de Spoofing',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Gps Spoofing Sim. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',working:'En cours...',ready:'Sim GPS pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startSpoof:'Demarrer Spoofing',detectSpoof:'Detecter Spoof',resetSim:'Reinitialiser',spoofTarget:'Cible Spoof',spoofParams:'Parametres Spoof',latitude:'Latitude:',longitude:'Longitude:',power:'Puissance (dBm):',satellites:'Sats Spoofes:',sigInfo:'Info Position',satHint:'Satellites GPS et leur statut.',transmitted:'Signal transmis',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que GPS Spoofing Sim ?',faq_a1:'Gps Spoofing Sim est une simulation interactive qui démontre les concepts de guerre RF. Simulate satellite spoofing and position manipulation. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de guerre électronique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de guerre électronique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de guerre électronique.',demo_s1:'Bienvenue dans GPS Spoofing Sim ! Regarde l\'écran principal — c\'est ici que la simulation de guerre électronique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir. Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de guerre électronique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Gps Spoofing Sim ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de guerre RF — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de guerre électronique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',wiki_concept_title:'🔬 Qu\'est-ce que GPS Spoofing Sim ?',wiki_concept:'GPS Spoofing Sim est une technique utilisée en electronic warfare. Dans un contexte professionnel, cette technologie nécessite HackRF et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de electronic warfare. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'GPS Spoofing Sim a des applications pratiques en electronic warfare. Les professionnels utilisent des techniques similaires avec HackRF. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'GPS Spoofing Sim : Simulate satellite spoofing and position manipulation. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Constructeur de traceur GPS',related1_desc:'Construisez des traceurs GPS cachés et apprenez la détection',related1_path:'../../52-hardware-implants/imp-gps-tracker-builder/index.html',related2_name:'Tableau d\\',related2_desc:'Surveillez et repondez aux pannes reseau',related2_path:'../../09-net-ultimate/web-operation-blackout/index.html',related3_name:'Profilage Antenne',related3_desc:'Visualiser gain, diagramme de rayonnement et ROS',related3_path:'../../32-sdr-tools/sdr-antenna-profiler/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Gestionnaire de Deconfliction',pathPrev_path:'../../54-rf-warfare/rfw-frequency-deconfliction/index.html',pathNext_name:'Sim Capteur IMSI',pathNext_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Que signifie IA ?',quiz_q1a:'Entrée automatisée',quiz_q1b:'Intelligence Artificielle',quiz_q1c:'Interface analogique',quiz_q1d:'Intégration active',quiz_q1_answer:'1',quiz_q2:'Quelle plage de fréquences est UHF ?',quiz_q2a:'3-30 MHz',quiz_q2b:'30-300 MHz',quiz_q2c:'300 MHz-3 GHz',quiz_q2d:'3-30 GHz',quiz_q2_answer:'2',quiz_q3:'Qu\'est-ce qu\'un réseau de neurones ?',quiz_q3a:'Fils physiques',quiz_q3b:'Système informatique inspiré des neurones',quiz_q3c:'Réseau social',quiz_q3d:'Réseau radio',quiz_q3_answer:'1',quiz_q4:'En quoi se mesure la fréquence ?',quiz_q4a:'Mètres',quiz_q4b:'Hertz',quiz_q4c:'Watts',quiz_q4d:'Volts',quiz_q4_answer:'1',quiz_q5:'Si la fréquence double, que devient la longueur d\'onde ?',quiz_q5a:'Double',quiz_q5b:'Divisée par 2',quiz_q5c:'Inchangée',quiz_q5d:'Triplée',quiz_q5_answer:'1'},
    wiki_history_title: '📜 Histoire de développement exploits',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. Gps Spoofing Sim s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Rfw Gps Spoofing Sim',
    wiki_math: 'Les mathématiques derrière Gps Spoofing Sim : QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR. Position is found by solving 4 simultaneous equations: (x-xi)² + (y-yi)² + (z-zi)² = (c·(t-ti))² for each satellite i. Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de développement exploits utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour développement exploits. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en développement exploits : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Développement exploits implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss2_term: 'Pseudorange',
    gloss2_def: 'The estimated distance between a GPS receiver and a satellite, calculated from signal travel time. Four pseudoranges determine 3D position plus clock correction.',
    gloss3_term: 'Spread Spectrum',
    gloss3_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Gps Spoofing Sim démontre les principes clés de guerre RF. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. GPS uses 31+ satellites broadcasting precise time signals on L1 (1575.42 MHz) and L2 (1227.60 MHz). Four satellites give 3D position + time. RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec exploit development dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar:{
    ...LANG_BASE.ar,title:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 GPS',subtitle:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 \u0625\u0634\u0627\u0631\u0627\u062a GPS',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0632\u064a\u064a\u0641',mainSection:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 GPS',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0632\u064a\u064a\u0641 \u0627\u0644\u0623\u0642\u0645\u0627\u0631 \u0627\u0644\u0635\u0646\u0627\u0639\u064a\u0629',sectionA:'\u0643\u0648\u0643\u0628\u0629 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062a\u0632\u064a\u064a\u0641',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062d\u0627\u0643\u064a GPS \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startSpoof:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',detectSpoof:'\u0643\u0634\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',spoofTarget:'\u0647\u062f\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',spoofParams:'\u0645\u0639\u0644\u0645\u0627\u062a',latitude:'\u062e\u0637 \u0627\u0644\u0639\u0631\u0636:',longitude:'\u062e\u0637 \u0627\u0644\u0637\u0648\u0644:',power:'\u0627\u0644\u0642\u062f\u0631\u0629:',satellites:'\u0623\u0642\u0645\u0627\u0631 \u0645\u0632\u064a\u0641\u0629:',sigInfo:'\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0648\u0642\u0639',satHint:'\u0623\u0642\u0645\u0627\u0631 GPS \u0648\u062d\u0627\u0644\u062a\u0647\u0627.',transmitted:'\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0629',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو GPS Spoofing Sim؟',faq_a1:'Gps Spoofing Sim هي محاكاة تفاعلية توضح مفاهيم الحرب الإلكترونية. Simulate satellite spoofing and position manipulation. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الحرب الإلكترونية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الحرب الإلكترونية. نفس المفاهيم يستخدمها المحترفون. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الحرب الإلكترونية.',demo_s1:'مرحباً في GPS Spoofing Sim! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الحرب الإلكترونية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالحرب الإلكترونية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Gps Spoofing Sim! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالحرب الإلكترونية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الحرب الإلكترونية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',wiki_concept_title:'🔬 ما هو GPS Spoofing Sim؟',wiki_concept:'GPS Spoofing Sim هي تقنية تُستخدم في electronic warfare. في البيئات المهنية، تتطلب هذه التقنية HackRF وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من electronic warfare. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'GPS Spoofing Sim له تطبيقات عملية في electronic warfare. يستخدم المحترفون تقنيات مماثلة مع HackRF. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'GPS Spoofing Sim: Simulate satellite spoofing and position manipulation. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ تطوير الثغرات',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. يبني Gps Spoofing Sim على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Rfw Gps Spoofing Sim',
    wiki_math: 'الرياضيات وراء Gps Spoofing Sim: QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR. Position is found by solving 4 simultaneous equations: (x-xi)² + (y-yi)² + (z-zi)² = (c·(t-ti))² for each satellite i. Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو تطوير الثغرات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في تطوير الثغرات. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في تطوير الثغرات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'تطوير الثغرات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss2_term: 'Pseudorange',
    gloss2_def: 'The estimated distance between a GPS receiver and a satellite, calculated from signal travel time. Four pseudoranges determine 3D position plus clock correction.',
    gloss3_term: 'Spread Spectrum',
    gloss3_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Gps Spoofing Sim يوضح المبادئ الأساسية في الحرب الإلكترونية. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. GPS uses 31+ satellites broadcasting precise time signals on L1 (1575.42 MHz) and L2 (1227.60 MHz). Four satellites give 3D position + time. RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـexploit development في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'مُنشئ متتبع GPS — مختبر التتبع السري',related1_desc:'بناء متتبعات GPS مخفية وتعلم كشف أجهزة التتبع',related1_path:'../../52-hardware-implants/imp-gps-tracker-builder/index.html',related2_name:'لوحة الحوادث',related2_desc:'راقب واستجب لسيناريوهات انقطاع الشبكة',related2_path:'../../09-net-ultimate/web-operation-blackout/index.html',related3_name:'محلل الهوائي',related3_desc:'عرض الكسب ونمط الإشعاع ومعامل الموجة الراكدة',related3_path:'../../32-sdr-tools/sdr-antenna-profiler/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'\\u0645\\u062f\\u064a\\u0631 \\u0641\\u0636 \\u0627\\u0644\\u062a\\u0639\\u0627\\u0631\\u0636',pathPrev_path:'../../54-rf-warfare/rfw-frequency-deconfliction/index.html',pathNext_name:'\\u0645\\u062d\\u0627\\u0643\\u064a IMSI',pathNext_path:'../../54-rf-warfare/rfw-imsi-catcher-sim/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ماذا تعني AI؟',quiz_q1a:'إدخال آلي',quiz_q1b:'الذكاء الاصطناعي',quiz_q1c:'واجهة تناظرية',quiz_q1d:'تكامل نشط',quiz_q1_answer:'1',quiz_q2:'ما نطاق التردد UHF؟',quiz_q2a:'3-30 ميغاهرتز',quiz_q2b:'30-300 ميغاهرتز',quiz_q2c:'300 ميغاهرتز-3 غيغاهرتز',quiz_q2d:'3-30 غيغاهرتز',quiz_q2_answer:'2',quiz_q3:'ما هي الشبكة العصبية؟',quiz_q3a:'أسلاك مادية',quiz_q3b:'نظام حوسبة مستوحى من الخلايا العصبية',quiz_q3c:'شبكة اجتماعية',quiz_q3d:'شبكة راديو',quiz_q3_answer:'1',quiz_q4:'بماذا تُقاس التردد؟',quiz_q4a:'أمتار',quiz_q4b:'هرتز',quiz_q4c:'واط',quiz_q4d:'فولت',quiz_q4_answer:'1',quiz_q5:'إذا تضاعف التردد، ماذا يحدث لطول الموجة؟',quiz_q5a:'يتضاعف',quiz_q5b:'ينقسم للنصف',quiz_q5c:'يبقى كما هو',quiz_q5d:'يتضاعف ثلاثاً',quiz_q5_answer:'1'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

/* ═══════ THEMES ═══════ */
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}

/* ═══════ TOAST ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}

/* ═══════ STATUS ═══════ */
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ PANELS ═══════ */
function initPanels(){
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');
  const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');
  if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};
  if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};
  if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};
  if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');
  const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');
  if(langSel)langSel.onchange=()=>setLanguage(langSel.value);
  if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);
  if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};
  const clearBtn=$('clearLogBtn'),copyBtn=$('copyLogBtn'),expBtn=$('exportLogBtn');
  if(clearBtn)clearBtn.onclick=clearLog;
  if(copyBtn)copyBtn.onclick=copyLog;
  if(expBtn)expBtn.onclick=exportLog;
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});
}

/* ═══════ GPS SATELLITE DATA ═══════ */
let satellites = [];
let spoofing = false;
let animFrame = null;
let time = 0;

function initSatellites(){
  satellites = [];
  for(let i=0;i<12;i++){
    satellites.push({
      id: 'PRN-'+(i+1),
      azimuth: Math.random()*360,
      elevation: 10+Math.random()*70,
      snr: 25+Math.random()*20,
      spoofed: false,
      orbitSpeed: 0.1+Math.random()*0.3,
      phase: Math.random()*Math.PI*2
    });
  }
}

/* ═══════ SKY VIEW CANVAS ═══════ */
function drawSkyView(){
  const c=$('skyCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width, H=c.height, cx=W/2, cy=H/2, R=Math.min(W,H)/2-30;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid circles
  for(let i=1;i<=3;i++){
    ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,255,136,0.15)';ctx.lineWidth=1;ctx.stroke();
  }
  // Cross hairs
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.stroke();

  // Labels
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='11px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-R-8);ctx.fillText('S',cx,cy+R+14);ctx.fillText('E',cx+R+14,cy+4);ctx.fillText('W',cx-R-14,cy+4);
  ctx.fillText('90',cx+8,cy+4);ctx.fillText('60',cx+R/3+10,cy+4);ctx.fillText('30',cx+R*2/3+10,cy+4);

  // Satellites
  const spoofCount = parseInt($('satCount')?.value||4);
  satellites.forEach((sat,i)=>{
    sat.azimuth += sat.orbitSpeed*0.3;
    if(sat.azimuth>360)sat.azimuth-=360;
    const az = sat.azimuth * Math.PI/180;
    const elR = (90-sat.elevation)/90;
    const sx = cx + Math.sin(az)*elR*R;
    const sy = cy - Math.cos(az)*elR*R;
    const isSpoofed = spoofing && i<spoofCount;
    sat.spoofed = isSpoofed;

    // Satellite marker
    ctx.beginPath();ctx.arc(sx,sy,isSpoofed?7:5,0,Math.PI*2);
    ctx.fillStyle=isSpoofed?'rgba(255,50,50,0.9)':'rgba(0,200,255,0.8)';ctx.fill();
    if(isSpoofed){
      ctx.beginPath();ctx.arc(sx,sy,12+Math.sin(time*3+i)*4,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=2;ctx.stroke();
    }
    ctx.fillStyle=isSpoofed?'#ff6666':'#66ccff';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(sat.id,sx,sy-10);
  });

  // Spoof target position marker
  if(spoofing){
    const spoofLat=parseFloat($('latInput')?.value||0);
    const spoofLon=parseFloat($('lonInput')?.value||0);
    const tx=cx+spoofLon/180*R*0.8;
    const ty=cy-spoofLat/90*R*0.8;
    ctx.beginPath();ctx.arc(tx,ty,6,0,Math.PI*2);ctx.fillStyle='rgba(255,200,0,0.9)';ctx.fill();
    ctx.beginPath();ctx.arc(tx,ty,15+Math.sin(time*4)*5,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#ffcc00';ctx.font='10px Orbitron,monospace';
    ctx.fillText('TARGET',tx,ty-18);
    ctx.fillText(spoofLat.toFixed(1)+'N '+spoofLon.toFixed(1)+'E',tx,ty+22);
  }

  // Title overlay
  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SKY VIEW - SATELLITE CONSTELLATION',10,18);
  if(spoofing){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('SPOOFING ACTIVE',10,34);}
}

/* ═══════ SIGNAL CANVAS ═══════ */
let signalHistory = new Array(200).fill(0);
function drawSignalView(){
  const c=$('signalCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Generate signal data
  const power=parseFloat($('powerInput')?.value||-10);
  const newVal=spoofing?-40+power+Math.random()*10:-60+Math.random()*5;
  signalHistory.push(newVal);
  if(signalHistory.length>200)signalHistory.shift();

  // Draw signal
  ctx.beginPath();
  signalHistory.forEach((v,i)=>{
    const x=i*(W/200);
    const y=H/2-(v+60)/(80)*H;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.strokeStyle=spoofing?'rgba(255,50,50,0.8)':'rgba(0,200,255,0.6)';ctx.lineWidth=2;ctx.stroke();

  // Threshold line
  const threshY=H/2-(-30+60)/80*H;
  ctx.beginPath();ctx.moveTo(0,threshY);ctx.lineTo(W,threshY);
  ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DETECTION THRESHOLD',5,threshY-5);
  ctx.fillText('SIGNAL POWER (dBm)',5,14);
}

/* ═══════ ANIMATION LOOP ═══════ */
function animate(){
  time+=0.016;
  drawSkyView();
  drawSignalView();
  updateStats();
  animFrame=requestAnimationFrame(animate);
}

function updateStats(){
  const stats=$('posStats');if(!stats)return;
  const lat=parseFloat($('latInput')?.value||0);
  const lon=parseFloat($('lonInput')?.value||0);
  const pwr=parseFloat($('powerInput')?.value||0);
  const sats=parseInt($('satCount')?.value||4);
  const spoofedCount=spoofing?sats:0;
  stats.innerHTML=
    '<b>Lat:</b> '+lat.toFixed(1)+'&deg; <b>Lon:</b> '+lon.toFixed(1)+'&deg;<br>'+
    '<b>Power:</b> '+pwr+' dBm<br>'+
    '<b>Satellites:</b> '+satellites.length+' ('+spoofedCount+' spoofed)<br>'+
    '<b>Status:</b> '+(spoofing?'<span style="color:#ff4444">SPOOFING</span>':'<span style="color:#00cc88">CLEAN</span>');
}

/* ═══════ SATELLITE LIBRARY ═══════ */
function updateSatLibrary(){
  const lib=$('satLibrary');if(!lib)return;
  lib.innerHTML='';
  satellites.forEach(sat=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+
      (sat.spoofed?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(sat.spoofed?'#ff6666':'#66ccff')+'">'+sat.id+'</span>'+
      '<span>Az:'+sat.azimuth.toFixed(0)+'&deg; El:'+sat.elevation.toFixed(0)+'&deg;</span>'+
      '<span>SNR:'+sat.snr.toFixed(0)+' dB</span>'+
      '<span style="color:'+(sat.spoofed?'#ff4444':'#00cc88')+'">'+(sat.spoofed?'SPOOFED':'CLEAN')+'</span>';
    lib.appendChild(row);
  });
}

/* ═══════ TECHNIQUES DATABASE ═══════ */
function initTechDatabase(){
  const db=$('techDatabase');if(!db)return;
  db.innerHTML=[
    '<b>Meaconing:</b> Rebroadcasting authentic GPS signals with delay.',
    '<b>Carry-off:</b> Gradually shifting receiver position by increasing fake signal power.',
    '<b>Nulling:</b> Using directional antennas to cancel real GPS signals.',
    '<b>Replay Attack:</b> Recording and replaying valid GPS signals.',
    '<b>Constellation Sim:</b> Generating full fake satellite constellation.',
    '<b>Time Injection:</b> Manipulating GPS time synchronization.',
  ].join('<br><br>');
}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('latInput').oninput=()=>{$('latLabel').textContent=parseFloat($('latInput').value).toFixed(1);};
  $('lonInput').oninput=()=>{$('lonLabel').textContent=parseFloat($('lonInput').value).toFixed(1);};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' dBm';};
  $('satCount').oninput=()=>{$('satLabel').textContent=$('satCount').value;};

  $('spoofBtn').onclick=()=>{
    spoofing=!spoofing;
    setStatus(spoofing);
    $('spoofBtn').querySelector('[data-i18n]').textContent=spoofing?'Stop Spoofing':LANG[currentLang].startSpoof;
    log(spoofing?'GPS spoofing STARTED — injecting fake signals':'GPS spoofing STOPPED',spoofing?'tx':'info');
    if(spoofing)showToast('Spoofing active...',2000);
  };

  $('detectBtn').onclick=()=>{
    showToast('Analyzing signal anomalies...',1500);
    setTimeout(()=>{
      if(spoofing){
        const pwr=parseFloat($('powerInput').value);
        const confidence=Math.min(99,50+Math.abs(pwr+10)*3+Math.random()*10);
        log('SPOOF DETECTED! Confidence: '+confidence.toFixed(1)+'% — Power anomaly: '+pwr+' dBm','error');
      } else {
        log('No spoofing detected. All signals nominal.','success');
      }
      hideToast();
    },1500);
  };

  $('resetBtn').onclick=()=>{
    spoofing=false;
    setStatus(false);
    initSatellites();
    signalHistory=new Array(200).fill(0);
    $('spoofBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startSpoof;
    log('Simulation reset','info');
    playSound('click');
  };
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();
  initPanels();
  initLogFilters();
  initSatellites();
  initTechDatabase();
  initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');
  animate();
  setInterval(updateSatLibrary,1000);
});

/* ═══════ ENHANCED RF CANVAS VISUALIZATION ═══════ */
(function(){
  const _$ = id => document.getElementById(id);
  let _t = 0, _frame = null;
  const _particles = [];
  const _spoofTrails = [];
  let _constellationPhase = 0;
  let _spectrumData = new Float32Array(512).fill(-90);
  let _waterfallBuf = [];
  const MAX_WF_ROWS = 120;

  /* ── Particle System for Signal Propagation ── */
  class SignalParticle {
    constructor(x, y, tx, ty, color, speed) {
      this.x = x; this.y = y; this.tx = tx; this.ty = ty;
      this.color = color; this.speed = speed || 2;
      this.life = 1; this.decay = 0.015 + Math.random() * 0.01;
      this.size = 1.5 + Math.random() * 2;
      const dx = tx - x, dy = ty - y, d = Math.sqrt(dx*dx + dy*dy);
      this.vx = (dx / d) * this.speed; this.vy = (dy / d) * this.speed;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      return this.life > 0;
    }
    draw(ctx) {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('1)', this.life * 0.8 + ')');
      ctx.fill();
    }
  }

  function spawnSatelliteParticles(cx, cy, sats, isSpoofing) {
    sats.forEach((sat, i) => {
      if (Math.random() > 0.06) return;
      const az = sat.azimuth * Math.PI / 180;
      const elR = (90 - sat.elevation) / 90;
      const sx = cx + Math.sin(az) * elR * 120;
      const sy = cy - Math.cos(az) * elR * 120;
      const col = sat.spoofed ? 'rgba(255,60,60,' : 'rgba(0,200,255,';
      _particles.push(new SignalParticle(sx, sy, cx, cy, col + '1)', 1.5 + Math.random()));
    });
  }

  /* ── Constellation Geometry Overlay ── */
  function drawConstellationGeometry(ctx, W, H, sats) {
    _constellationPhase += 0.005;
    const cx = W / 2, cy = H / 2;
    ctx.save(); ctx.globalAlpha = 0.12;
    sats.forEach((s1, i) => {
      sats.forEach((s2, j) => {
        if (j <= i) return;
        const az1 = s1.azimuth * Math.PI / 180, az2 = s2.azimuth * Math.PI / 180;
        const r1 = (90 - s1.elevation) / 90, r2 = (90 - s2.elevation) / 90;
        const x1 = cx + Math.sin(az1) * r1 * 100, y1 = cy - Math.cos(az1) * r1 * 100;
        const x2 = cx + Math.sin(az2) * r2 * 100, y2 = cy - Math.cos(az2) * r2 * 100;
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = (s1.spoofed || s2.spoofed) ? '#ff4444' : '#00ccff';
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      });
    });
    ctx.restore();
  }

  /* ── GDOP (Geometric Dilution of Precision) Heatmap ── */
  function drawGDOPHeatmap(ctx, W, H, sats) {
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 30;
    const step = 16;
    ctx.save(); ctx.globalAlpha = 0.08;
    for (let gx = 0; gx < W; gx += step) {
      for (let gy = 0; gy < H; gy += step) {
        const dx = gx - cx, dy = gy - cy;
        if (Math.sqrt(dx * dx + dy * dy) > R) continue;
        let minDist = Infinity;
        sats.forEach(s => {
          const az = s.azimuth * Math.PI / 180;
          const elR = (90 - s.elevation) / 90;
          const sx = cx + Math.sin(az) * elR * R;
          const sy = cy - Math.cos(az) * elR * R;
          const d = Math.sqrt((gx - sx) ** 2 + (gy - sy) ** 2);
          if (d < minDist) minDist = d;
        });
        const gdop = Math.min(1, minDist / 150);
        const r = Math.floor(gdop * 255), g = Math.floor((1 - gdop) * 200);
        ctx.fillStyle = 'rgb(' + r + ',' + g + ',50)';
        ctx.fillRect(gx, gy, step - 1, step - 1);
      }
    }
    ctx.restore();
  }

  /* ── Enhanced Spectrum Analyzer ── */
  function drawAdvancedSpectrum(ctx, W, H, isSpoofing, power) {
    // Generate realistic GPS L-band spectrum
    for (let i = 0; i < 512; i++) {
      const f = 1150 + (i / 512) * 700; // 1150-1850 MHz range
      let level = -90 + Math.random() * 3;
      // L1 signal at 1575.42 MHz
      const l1Diff = Math.abs(f - 1575.42);
      if (l1Diff < 12) level += 25 * Math.exp(-l1Diff * l1Diff / 50);
      // L2 at 1227.60 MHz
      const l2Diff = Math.abs(f - 1227.60);
      if (l2Diff < 10) level += 20 * Math.exp(-l2Diff * l2Diff / 40);
      // L5 at 1176.45 MHz
      const l5Diff = Math.abs(f - 1176.45);
      if (l5Diff < 10) level += 18 * Math.exp(-l5Diff * l5Diff / 35);
      if (isSpoofing) {
        if (l1Diff < 15) level += power + 20 + Math.random() * 8;
        if (l2Diff < 12) level += (power + 15) * 0.6 + Math.random() * 5;
      }
      _spectrumData[i] = _spectrumData[i] * 0.7 + level * 0.3;
    }
    // Draw spectrum
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,50,50,0.8)'); grad.addColorStop(0.5, 'rgba(255,200,0,0.6)');
    grad.addColorStop(1, 'rgba(0,200,100,0.4)');
    ctx.beginPath();
    for (let i = 0; i < 512; i++) {
      const x = (i / 512) * W;
      const y = H - 15 - ((_spectrumData[i] + 95) / 70) * (H - 30);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H - 15); ctx.lineTo(0, H - 15); ctx.closePath();
    ctx.fillStyle = isSpoofing ? 'rgba(255,50,50,0.1)' : 'rgba(0,200,255,0.08)';
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < 512; i++) {
      const x = (i / 512) * W;
      const y = H - 15 - ((_spectrumData[i] + 95) / 70) * (H - 30);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isSpoofing ? 'rgba(255,80,80,0.9)' : 'rgba(0,200,255,0.7)';
    ctx.lineWidth = 1.5; ctx.stroke();
    // Frequency labels
    ctx.fillStyle = 'rgba(0,255,136,0.35)'; ctx.font = '8px Orbitron,monospace'; ctx.textAlign = 'center';
    [1176, 1228, 1381, 1575, 1602, 1800].forEach(f => {
      const x = ((f - 1150) / 700) * W;
      ctx.fillText(f + '', x, H - 2);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 15);
      ctx.strokeStyle = 'rgba(0,255,136,0.06)'; ctx.lineWidth = 1; ctx.stroke();
    });
    // Band labels
    ctx.fillStyle = 'rgba(0,200,255,0.5)'; ctx.font = '9px Orbitron,monospace';
    const l5x = ((1176.45 - 1150) / 700) * W;
    const l2x = ((1227.60 - 1150) / 700) * W;
    const l1x = ((1575.42 - 1150) / 700) * W;
    ctx.fillText('L5', l5x, 12); ctx.fillText('L2', l2x, 12); ctx.fillText('L1', l1x, 12);
  }

  /* ── Waterfall Display ── */
  function drawWaterfall(ctx, W, H, isSpoofing) {
    const row = new Uint8Array(W);
    for (let x = 0; x < W; x++) {
      const idx = Math.floor((x / W) * 512);
      const val = Math.max(0, Math.min(255, (_spectrumData[idx] + 95) * 3.5));
      row[x] = val;
    }
    _waterfallBuf.unshift(row);
    if (_waterfallBuf.length > MAX_WF_ROWS) _waterfallBuf.pop();
    const rowH = H / MAX_WF_ROWS;
    _waterfallBuf.forEach((r, ri) => {
      for (let x = 0; x < W; x += 2) {
        const v = r[x];
        const red = v > 180 ? 255 : v > 100 ? v * 2 : v;
        const grn = v > 180 ? (255 - v) : v > 80 ? v : v * 0.5;
        const blu = v < 80 ? v * 2 : 0;
        ctx.fillStyle = 'rgb(' + (red | 0) + ',' + (grn | 0) + ',' + (blu | 0) + ')';
        ctx.fillRect(x, ri * rowH, 2, rowH + 1);
      }
    });
  }

  /* ── Doppler Shift Visualization ── */
  function drawDopplerShift(ctx, W, H, sats) {
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('DOPPLER SHIFT (Hz)', 5, 12);
    const barH = (H - 25) / Math.max(sats.length, 1);
    sats.forEach((sat, i) => {
      const doppler = Math.sin(_t * sat.orbitSpeed + sat.phase) * 4500;
      const y = 20 + i * barH;
      const bw = (doppler / 5000) * (W / 2 - 20);
      ctx.fillStyle = sat.spoofed ? 'rgba(255,60,60,0.4)' : 'rgba(0,200,255,0.3)';
      ctx.fillRect(W / 2, y, bw, barH - 2);
      ctx.fillStyle = sat.spoofed ? '#ff6666' : '#66ccff';
      ctx.font = '7px Orbitron,monospace'; ctx.textAlign = 'right';
      ctx.fillText(sat.id, W / 2 - 4, y + barH / 2 + 3);
      ctx.textAlign = 'left';
      ctx.fillText((doppler > 0 ? '+' : '') + doppler.toFixed(0), W / 2 + bw + 4, y + barH / 2 + 3);
    });
    // Zero line
    ctx.beginPath(); ctx.moveTo(W / 2, 18); ctx.lineTo(W / 2, H);
    ctx.strokeStyle = 'rgba(255,200,0,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }

  /* ── C/N0 (Carrier-to-Noise) Bar Chart ── */
  function drawCN0Bars(ctx, W, H, sats) {
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('C/N0 (dB-Hz)', 5, 12);
    const barW = Math.max(8, (W - 20) / sats.length - 4);
    sats.forEach((sat, i) => {
      const x = 10 + i * (barW + 4);
      let cn0 = 30 + sat.snr * 0.8 + Math.sin(_t + sat.phase) * 2;
      if (sat.spoofed) cn0 += 8 + Math.random() * 5;
      const barH = (cn0 / 55) * (H - 35);
      const col = sat.spoofed ? (cn0 > 45 ? 'rgba(255,50,50,0.7)' : 'rgba(255,100,60,0.5)')
                               : (cn0 > 40 ? 'rgba(0,200,100,0.6)' : 'rgba(0,150,255,0.5)');
      ctx.fillStyle = col;
      ctx.fillRect(x, H - 18 - barH, barW, barH);
      ctx.strokeStyle = sat.spoofed ? 'rgba(255,80,80,0.5)' : 'rgba(0,200,255,0.3)';
      ctx.lineWidth = 1; ctx.strokeRect(x, H - 18 - barH, barW, barH);
      ctx.fillStyle = sat.spoofed ? '#ff6666' : '#aaa';
      ctx.font = '7px Orbitron,monospace'; ctx.textAlign = 'center';
      ctx.fillText(sat.id.split('-')[1], x + barW / 2, H - 5);
      ctx.fillText(cn0.toFixed(0), x + barW / 2, H - 22 - barH);
    });
    // Threshold line
    const threshY = H - 18 - (35 / 55) * (H - 35);
    ctx.beginPath(); ctx.moveTo(5, threshY); ctx.lineTo(W - 5, threshY);
    ctx.strokeStyle = 'rgba(255,200,0,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,200,0,0.4)'; ctx.font = '7px Orbitron,monospace';
    ctx.textAlign = 'right'; ctx.fillText('MIN LOCK', W - 5, threshY - 3);
  }

  /* ── Position Error Scatter Plot ── */
  let _posErrors = [];
  function drawPositionError(ctx, W, H, isSpoofing, power) {
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('POSITION ERROR SCATTER (m)', 5, 12);
    const cx = W / 2, cy = H / 2 + 5;
    // Grid circles (meters)
    [20, 50, 100, 200].forEach(r => {
      const pr = r / 250 * Math.min(W, H) / 2;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,255,136,0.1)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(0,255,136,0.2)'; ctx.font = '7px Orbitron,monospace';
      ctx.textAlign = 'left'; ctx.fillText(r + 'm', cx + pr + 2, cy);
    });
    // Generate new error point
    if (_t % 0.1 < 0.02) {
      let ex, ey;
      if (isSpoofing) {
        const drift = (power + 10) * 3;
        ex = drift + (Math.random() - 0.3) * 40;
        ey = drift * 0.7 + (Math.random() - 0.5) * 30;
      } else {
        ex = (Math.random() - 0.5) * 15;
        ey = (Math.random() - 0.5) * 15;
      }
      _posErrors.push({ x: ex, y: ey, age: 0 });
      if (_posErrors.length > 80) _posErrors.shift();
    }
    _posErrors.forEach(p => {
      p.age += 0.01;
      const px = cx + (p.x / 250) * Math.min(W, H) / 2;
      const py = cy + (p.y / 250) * Math.min(W, H) / 2;
      const alpha = Math.max(0.1, 1 - p.age);
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      ctx.fillStyle = dist > 100 ? 'rgba(255,50,50,' + alpha + ')' :
                      dist > 30 ? 'rgba(255,200,0,' + alpha + ')' :
                      'rgba(0,200,100,' + alpha + ')';
      ctx.fill();
    });
    // Crosshair
    ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
  }

  /* ── Time Series: Pseudorange Residuals ── */
  let _pseudorangeResiduals = new Array(200).fill(0);
  function drawPseudorangeResiduals(ctx, W, H, isSpoofing, power) {
    const newVal = isSpoofing ? (power + 10) * 2 + Math.sin(_t * 2) * 15 + Math.random() * 10
                              : Math.random() * 4 - 2;
    _pseudorangeResiduals.push(newVal);
    if (_pseudorangeResiduals.length > 200) _pseudorangeResiduals.shift();
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('PSEUDORANGE RESIDUALS (m)', 5, 12);
    // Draw
    ctx.beginPath();
    _pseudorangeResiduals.forEach((v, i) => {
      const x = (i / 200) * W;
      const y = H / 2 - (v / 80) * (H / 2 - 15);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = isSpoofing ? 'rgba(255,80,80,0.8)' : 'rgba(0,200,255,0.7)';
    ctx.lineWidth = 1.5; ctx.stroke();
    // Zero line
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    // Alarm threshold
    [20, -20].forEach(th => {
      const y = H / 2 - (th / 80) * (H / 2 - 15);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = 'rgba(255,200,0,0.3)'; ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    });
  }

  /* ── Master Enhanced Render ── */
  function enhancedRender() {
    _t += 0.016;
    // Update particles
    for (let i = _particles.length - 1; i >= 0; i--) {
      if (!_particles[i].update()) _particles.splice(i, 1);
    }
    // Draw on sky canvas overlay
    const skyC = _$('skyCanvas');
    if (skyC) {
      const ctx = skyC.getContext('2d');
      const W = skyC.width, H = skyC.height;
      if (typeof satellites !== 'undefined' && satellites.length > 0) {
        drawConstellationGeometry(ctx, W, H, satellites);
        drawGDOPHeatmap(ctx, W, H, satellites);
        spawnSatelliteParticles(W / 2, H / 2, satellites, typeof spoofing !== 'undefined' && spoofing);
        _particles.forEach(p => p.draw(ctx));
      }
    }
    // Draw enhanced spectrum on signal canvas
    const sigC = _$('signalCanvas');
    if (sigC) {
      const ctx = sigC.getContext('2d');
      const W = sigC.width, H = sigC.height;
      const isSpoofing = typeof spoofing !== 'undefined' && spoofing;
      const pwr = parseFloat(_$('powerInput')?.value || -10);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      drawAdvancedSpectrum(ctx, W, H * 0.55, isSpoofing, pwr);
      ctx.save(); ctx.translate(0, H * 0.55);
      drawWaterfall(ctx, W, H * 0.45, isSpoofing);
      ctx.restore();
    }
    _frame = requestAnimationFrame(enhancedRender);
  }

  // Start after a short delay to not interfere with main init
  setTimeout(() => { enhancedRender(); }, 500);
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
