/**
 * SDR Build Receiver — Workshop DIY v1.0
 * Build a software receiver from scratch. Step-by-step DSP pipeline visualization.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}

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
    title:'SDR Build Receiver',subtitle:'Build a Software Receiver from Scratch',
    disconnected:'Disconnected',connected:'Running',
    mainSection:'Receiver Pipeline',mainDesc:'Step-by-step DSP: antenna to audio output',
    sectionA:'Signal Metrics',sectionB:'Receiver Theory',sectionC:'Build Progress',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',
    settings:'Settings',language:'Language',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    howto_1:'The main display shows the Build Receiver simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for SDR Build Receiver. Choose your',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Signal Metrics" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_themes_title:'Themes',wiki_themes:'8 built-in themes with Islamic art inspiration. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_i18n_title:'Languages',wiki_i18n:'Trilingual: English, Francais, Arabic with RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    working:'Working...',filterAll:'All',soundEffects:'Sound effects',
    ready:'Receiver builder ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    stepLabel:'Pipeline Step',freqLabel:'Carrier Frequency (Hz)',modType:'Modulation',
    noiseLabel:'Noise Level',
    step0:'1. Antenna Input',step1:'2. RF Amplifier',step2:'3. Mixer / Down-converter',
    step3:'4. IF Filter',step4:'5. Demodulator',step5:'6. Audio Output',
    startRx:'Start Receiver',stopRx:'Stop',resetRx:'Reset',
    rfPower:'RF Input Power:',snrLabel:'SNR:',ifFreq:'IF Frequency:',
    audioFreq:'Audio Freq:',agcGain:'AGC Gain:',
    theoryIntro:'A superheterodyne receiver converts RF signals to baseband audio through these stages:',
    theory1:'Antenna captures electromagnetic waves as voltage signals',
    theory2:'LNA amplifies weak signals while adding minimal noise',
    theory3:'Mixer multiplies RF with local oscillator for frequency conversion',
    theory4:'IF filter selects desired signal bandwidth',
    theory5:'Demodulator extracts baseband audio from carrier',
    theory6:'AGC maintains consistent output level',
    buildDesc:'Track your receiver build progress. Each step unlocks when you explore the pipeline.',
    splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',
    rxStarted:'Receiver started',rxStopped:'Receiver stopped',rxReset:'Receiver reset',
    stepChanged:'Viewing step:',buildComplete:'All stages explored! Receiver complete!',
    pipeStages:['Antenna','LNA','Mixer','IF Filter','Demod','Audio'],
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Set Up',step1Desc:'Configure the parameters for SDR Build Receiver. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Signal Metrics" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Receiver Theory". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is SDR Build Receiver?',faq_a1:'Build Receiver is an interactive simulation that demonstrates SDR learning concepts. Step-by-step DSP: antenna to audio output. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real SDR learning behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Select a pipeline step to visualize that receiver stage. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real SDR learning principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Exam Lab and Sdr Protocol Reverse. Each app in this category teaches a different aspect of SDR learning.',demo_s1:'Welcome to SDR Build Receiver! Look at the main display — this is where the SDR learning simulation runs.',demo_s2:'Select a pipeline step to visualize that receiver stage. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Signal Metrics" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of SDR learning.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Build Receiver! This is like a science experiment on your computer. You get to control a real SDR learning simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for SDR Build Receiver. C Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches SDR learning concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is SDR Build Receiver?',wiki_concept:'SDR Build Receiver is a technique used in SDR learning. Step-by-step DSP: antenna to audio output. In professional settings, this technology requires HackRF One and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for SDR Build Receiver. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real SDR learning, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'SDR Build Receiver has practical applications in SDR learning. Professionals use similar techniques with HackRF One in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'SDR Build Receiver: Step-by-step DSP: antenna to audio output. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure SDR through Capture Signal to Process & Filter and Visualize Output.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Signal Metrics" and "Receiver Theory" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Emergency Comms',
    wiki_history: 'Heinrich Hertz built the first antenna in 1886. From dipoles to phased arrays, antenna design has enabled everything from AM radio to 5G beamforming. Build Receiver builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Build Receiver',
    wiki_math: 'The mathematics behind Build Receiver: Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced emergency comms practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to emergency comms. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with emergency comms: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in emergency comms.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Emergency Comms carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Gain (dBi)',
    gloss1_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Build Receiver demonstrates key principles from SDR learning. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world emergency comms?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional emergency comms systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Construire un Recepteur SDR',subtitle:'Construisez un recepteur logiciel pas a pas',
    disconnected:'Deconnecte',connected:'En marche',
    mainSection:'Pipeline Recepteur',mainDesc:'DSP etape par etape: antenne vers sortie audio',
    sectionA:'Metriques Signal',sectionB:'Theorie du Recepteur',sectionC:'Progression',
    activityLog:'Journal',eventsMsg:'Evenements et messages',
    clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',
    settings:'Parametres',language:'Langue',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    howto_1:'L écran principal affiche la simulation Build Receiver. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for SDR Build Receiver. Choose your',howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_themes_title:'Themes',wiki_themes:'8 themes integres.',
    wiki_i18n_title:'Langues',wiki_i18n:'Trilingue avec RTL.',
    working:'En cours...',filterAll:'Tout',soundEffects:'Effets sonores',
    ready:'Constructeur de recepteur pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
    stepLabel:'Etape du Pipeline',freqLabel:'Frequence Porteuse (Hz)',modType:'Modulation',
    noiseLabel:'Niveau de Bruit',
    step0:'1. Entree Antenne',step1:'2. Amplificateur RF',step2:'3. Melangeur',
    step3:'4. Filtre FI',step4:'5. Demodulateur',step5:'6. Sortie Audio',
    startRx:'Demarrer',stopRx:'Arreter',resetRx:'Reinitialiser',
    rfPower:'Puissance RF:',snrLabel:'RSB:',ifFreq:'Frequence FI:',
    audioFreq:'Freq Audio:',agcGain:'Gain AGC:',
    theoryIntro:'Un recepteur superheterodyne convertit les signaux RF en audio:',
    theory1:'L\'antenne capture les ondes electromagnetiques',
    theory2:'Le LNA amplifie les signaux faibles',
    theory3:'Le melangeur convertit la frequence',
    theory4:'Le filtre FI selectionne la bande passante',
    theory5:'Le demodulateur extrait l\'audio',
    theory6:'L\'AGC maintient un niveau constant',
    buildDesc:'Suivez votre progression. Chaque etape se debloque en explorant le pipeline.',
    splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',
    rxStarted:'Recepteur demarre',rxStopped:'Recepteur arrete',rxReset:'Recepteur reinitialise',
    stepChanged:'Etape:',buildComplete:'Toutes les etapes explorees! Recepteur complet!',
    pipeStages:['Antenne','LNA','Melangeur','Filtre FI','Demod','Audio'],
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configurer',step1Desc:'Configure les paramètres de SDR Build Receiver. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que SDR Build Receiver ?',faq_a1:'Build Receiver est une simulation interactive qui démontre les concepts de apprentissage SDR. Step-by-step DSP: antenna to audio output. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de apprentissage SDR. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de apprentissage SDR. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF One. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de apprentissage SDR.',demo_s1:'Bienvenue dans SDR Build Receiver ! Regarde l\'écran principal — c\'est ici que la simulation de apprentissage SDR fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de apprentissage SDR.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Build Receiver ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de apprentissage SDR — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the parameters for SDR Build Receiver. C Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de apprentissage SDR par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que SDR Build Receiver ?',wiki_concept:'SDR Build Receiver est une technique utilisée en SDR learning. Dans un contexte professionnel, cette technologie nécessite HackRF One et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de SDR learning. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'SDR Build Receiver a des applications pratiques en SDR learning. Les professionnels utilisent des techniques similaires avec HackRF One. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'SDR Build Receiver : Step-by-step DSP: antenna to audio output. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de communications urgentes',
    wiki_history: 'Heinrich Hertz built the first antenna in 1886. From dipoles to phased arrays, antenna design has enabled everything from AM radio to 5G beamforming. Build Receiver s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Build Receiver',
    wiki_math: 'Les mathématiques derrière Build Receiver : Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de communications urgentes utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour communications urgentes. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en communications urgentes : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Communications urgentes implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Gain (dBi)',
    gloss1_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Build Receiver démontre les principes clés de apprentissage SDR. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec emergency comms dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'بناء مستقبل SDR',subtitle:'ابنِ مستقبل برمجي خطوة بخطوة',
    disconnected:'غير متصل',connected:'يعمل',
    mainSection:'خط انابيب المستقبل',mainDesc:'DSP خطوة بخطوة: من الهوائي الى الصوت',
    sectionA:'مقاييس الاشارة',sectionB:'نظرية المستقبل',sectionC:'تقدم البناء',
    activityLog:'سجل النشاط',eventsMsg:'الاحداث والرسائل',
    clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',
    settings:'الاعدادات',language:'اللغة',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Build Receiver. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for SDR Build Receiver. Choose your',howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر مدمجة.',
    wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
    working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات صوتية',
    ready:'منشئ المستقبل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    stepLabel:'مرحلة خط الانابيب',freqLabel:'تردد الحامل (هرتز)',modType:'التضمين',
    noiseLabel:'مستوى الضوضاء',
    step0:'1. مدخل الهوائي',step1:'2. مضخم RF',step2:'3. الخلاط',
    step3:'4. مرشح IF',step4:'5. مزيل التضمين',step5:'6. مخرج الصوت',
    startRx:'ابدا المستقبل',stopRx:'ايقاف',resetRx:'اعادة',
    rfPower:'طاقة RF:',snrLabel:'نسبة الاشارة للضوضاء:',ifFreq:'تردد IF:',
    audioFreq:'تردد الصوت:',agcGain:'كسب AGC:',
    theoryIntro:'المستقبل السوبرهيتيرودين يحول اشارات RF الى صوت:',
    theory1:'الهوائي يلتقط الموجات الكهرومغناطيسية',
    theory2:'مضخم الضوضاء المنخفض يضخم الاشارات الضعيفة',
    theory3:'الخلاط يحول التردد',
    theory4:'مرشح IF يختار عرض النطاق',
    theory5:'مزيل التضمين يستخرج الصوت',
    theory6:'AGC يحافظ على مستوى ثابت',
    buildDesc:'تتبع تقدم بناء المستقبل. كل مرحلة تفتح عند الاستكشاف.',
    splashHint:'انقر للتخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',
    rxStarted:'بدا المستقبل',rxStopped:'توقف المستقبل',rxReset:'اعادة ضبط المستقبل',
    stepChanged:'المرحلة:',buildComplete:'تم استكشاف جميع المراحل! المستقبل مكتمل!',
    pipeStages:['هوائي','LNA','خلاط','مرشح IF','ازالة تضمين','صوت'],
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'
  ,step1Title:'إعداد',step1Desc:'اضبط معاملات SDR Build Receiver. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو SDR Build Receiver؟',faq_a1:'Build Receiver هي محاكاة تفاعلية توضح مفاهيم تعلم SDR. Step-by-step DSP: antenna to audio output. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في تعلم SDR. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من تعلم SDR. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF One. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من تعلم SDR.',demo_s1:'مرحباً في SDR Build Receiver! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة تعلم SDR.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـتعلم SDR.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Build Receiver! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـتعلم SDR — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the parameters for SDR Build Receiver. C لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم تعلم SDR من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو SDR Build Receiver؟',wiki_concept:'SDR Build Receiver هي تقنية تُستخدم في SDR learning. في البيئات المهنية، تتطلب هذه التقنية HackRF One وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من SDR learning. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'SDR Build Receiver له تطبيقات عملية في SDR learning. يستخدم المحترفون تقنيات مماثلة مع HackRF One. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'SDR Build Receiver: Step-by-step DSP: antenna to audio output. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ اتصالات الطوارئ',
    wiki_history: 'Heinrich Hertz built the first antenna in 1886. From dipoles to phased arrays, antenna design has enabled everything from AM radio to 5G beamforming. يبني Build Receiver على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Build Receiver',
    wiki_math: 'الرياضيات وراء Build Receiver: Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو اتصالات الطوارئ المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في اتصالات الطوارئ. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في اتصالات الطوارئ: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'اتصالات الطوارئ يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Gain (dBi)',
    gloss1_def: 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Build Receiver يوضح المبادئ الأساسية في تعلم SDR. An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـemergency comms في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='build-receiver-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════ PANELS ═══════ */
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

/* ═══════ RECEIVER SIMULATION ═══════ */
let rxRunning=false, animFrame=null, sampleRate=8192;
const stagesVisited = new Set();
const PIPE_LABELS_EN = ['Antenna','LNA','Mixer','IF Filter','Demod','Audio'];

function generateCarrier(freq, n, noiseLevel) {
  const buf = new Float32Array(n), dt = 1/sampleRate;
  for (let i=0; i<n; i++) {
    const t = i*dt;
    buf[i] = Math.sin(2*Math.PI*freq*t) + (Math.random()-0.5)*noiseLevel*2;
  }
  return buf;
}

function modulateSignal(carrier, freq, n, modType) {
  const buf = new Float32Array(n), dt = 1/sampleRate;
  const msgFreq = 300;
  for (let i=0; i<n; i++) {
    const t = i*dt;
    const msg = Math.sin(2*Math.PI*msgFreq*t);
    if (modType === 'am') {
      buf[i] = carrier[i] * (1 + 0.7*msg);
    } else if (modType === 'fm') {
      buf[i] = Math.sin(2*Math.PI*freq*t + 5*Math.sin(2*Math.PI*msgFreq*t)) + (carrier[i]-Math.sin(2*Math.PI*freq*t*dt))*0.1;
    } else { // ssb
      buf[i] = msg * Math.cos(2*Math.PI*freq*t) - Math.cos(2*Math.PI*msgFreq*t + Math.PI/2) * Math.sin(2*Math.PI*freq*t);
      buf[i] += (Math.random()-0.5)*0.1;
    }
  }
  return buf;
}

function amplify(buf, gain) {
  const out = new Float32Array(buf.length);
  for (let i=0; i<buf.length; i++) out[i] = Math.max(-1, Math.min(1, buf[i]*gain));
  return out;
}

function mixDown(buf, freq, loOffset, n) {
  const out = new Float32Array(n), dt = 1/sampleRate;
  const loFreq = freq - loOffset;
  for (let i=0; i<n; i++) {
    out[i] = buf[i] * Math.cos(2*Math.PI*loFreq*i*dt);
  }
  return out;
}

function ifFilter(buf) {
  const out = new Float32Array(buf.length);
  const alpha = 0.15;
  out[0] = buf[0];
  for (let i=1; i<buf.length; i++) out[i] = out[i-1] + alpha*(buf[i]-out[i-1]);
  return out;
}

function demodulate(buf, modType, freq, n) {
  const out = new Float32Array(n), dt = 1/sampleRate;
  if (modType === 'am') {
    for (let i=0; i<n; i++) out[i] = Math.abs(buf[i]);
    const lp = new Float32Array(n);
    lp[0] = out[0];
    for (let i=1; i<n; i++) lp[i] = lp[i-1] + 0.05*(out[i]-lp[i-1]);
    return lp;
  } else if (modType === 'fm') {
    for (let i=1; i<n; i++) {
      const phase1 = Math.atan2(buf[i], buf[i-1]||0.001);
      out[i] = phase1 / Math.PI;
    }
    return out;
  } else {
    for (let i=0; i<n; i++) {
      out[i] = buf[i] * 2 * Math.cos(2*Math.PI*455*i*dt);
    }
    const lp = new Float32Array(n);
    lp[0] = out[0];
    for (let i=1; i<n; i++) lp[i] = lp[i-1] + 0.08*(out[i]-lp[i-1]);
    return lp;
  }
}

function agc(buf) {
  const out = new Float32Array(buf.length);
  let env = 0.5;
  for (let i=0; i<buf.length; i++) {
    const abs = Math.abs(buf[i]);
    env = env*0.99 + abs*0.01;
    const gain = env > 0.01 ? 0.5/env : 1;
    out[i] = buf[i] * gain;
  }
  return out;
}

function drawPipeline(ctx, w, h, step) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0,0,w,h);
  const labels = LANG[currentLang].pipeStages || PIPE_LABELS_EN;
  const n = labels.length;
  const bw = (w-40)/(n), bh = 40, y0 = (h-bh)/2;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  for (let i=0; i<n; i++) {
    const x = 20 + i*bw;
    const visited = stagesVisited.has(i);
    const active = i === step;
    ctx.fillStyle = active ? accent : visited ? '#2a4a2a' : '#1a1a2e';
    ctx.strokeStyle = active ? '#fff' : visited ? '#4a8a4a' : '#333';
    ctx.lineWidth = active ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x+4, y0, bw-8, bh, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = active ? '#000' : '#ccc';
    ctx.font = '11px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x+bw/2, y0+bh/2+4);
    if (i < n-1) {
      ctx.strokeStyle = '#555';
      ctx.beginPath();
      ctx.moveTo(x+bw-4, h/2);
      ctx.lineTo(x+bw+4, h/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+bw+1, h/2-4);
      ctx.lineTo(x+bw+4, h/2);
      ctx.lineTo(x+bw+1, h/2+4);
      ctx.stroke();
    }
  }
}

function drawSignal(buf, canvasId, color, label) {
  const c = $(canvasId); if (!c) return;
  const ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = '#1a2a3a';
  for (let i=0; i<5; i++) { ctx.beginPath(); ctx.moveTo(0,i*h/5); ctx.lineTo(w,i*h/5); ctx.stroke(); }
  ctx.strokeStyle = color || '#00ff88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const step = Math.max(1, Math.floor(buf.length/w));
  for (let i=0; i<w; i++) {
    const idx = Math.min(i*step, buf.length-1);
    const y = h/2 - buf[idx]*(h/2)*0.8;
    if (i===0) ctx.moveTo(0,y); else ctx.lineTo(i,y);
  }
  ctx.stroke();
  if (label) {
    ctx.fillStyle = '#8899aa';
    ctx.font = '11px Orbitron, monospace';
    ctx.fillText(label, 8, 16);
  }
}

function updateMetrics(carrier, demod, freq, noiseLevel) {
  const rfPow = -30 + (1-noiseLevel)*40;
  const snr = (1-noiseLevel)*30 + 5;
  const ifF = 455;
  let rms = 0;
  for (let i=0; i<demod.length; i++) rms += demod[i]*demod[i];
  rms = Math.sqrt(rms/demod.length);
  const audioF = 300;
  const agcG = 20*Math.log10(0.5/(rms+0.001));
  $('rfPowerVal').textContent = rfPow.toFixed(1) + ' dBm';
  $('snrVal').textContent = snr.toFixed(1) + ' dB';
  $('ifFreqVal').textContent = ifF + ' Hz';
  $('audioFreqVal').textContent = audioF + ' Hz';
  $('agcVal').textContent = agcG.toFixed(1) + ' dB';
}

function updateBuildProgress() {
  const el = $('buildProgress');
  if (!el) return;
  const labels = LANG[currentLang].pipeStages || PIPE_LABELS_EN;
  el.innerHTML = '';
  for (let i=0; i<6; i++) {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;gap:8px;margin:4px 0;';
    const icon = stagesVisited.has(i) ? '&#9989;' : '&#9744;';
    d.innerHTML = `<span style="font-size:18px;">${icon}</span><span style="color:${stagesVisited.has(i)?'#4a8':'#888'}">${labels[i]}</span>`;
    el.appendChild(d);
  }
  if (stagesVisited.size === 6) {
    const comp = document.createElement('div');
    comp.style.cssText = 'margin-top:10px;padding:8px;border-radius:6px;background:var(--accent,#d4a03c);color:#000;font-weight:bold;text-align:center;';
    comp.textContent = LANG[currentLang].buildComplete;
    el.appendChild(comp);
  }
}

const N = 1024;
function rxLoop() {
  if (!rxRunning) return;
  const step = +$('stepSelect').value;
  const freq = +$('freqSlider').value;
  const modType = $('modSelect').value;
  const noiseLevel = +$('noiseSlider').value / 100;

  stagesVisited.add(step);

  const carrier = generateCarrier(freq, N, noiseLevel);
  const modulated = modulateSignal(carrier, freq, N, modType);
  const amplified = amplify(modulated, 1.5);
  const mixed = mixDown(amplified, freq, 455, N);
  const filtered = ifFilter(mixed);
  const demodulated = demodulate(filtered, modType, freq, N);
  const output = agc(demodulated);

  const pipeC = $('pipelineCanvas');
  if (pipeC) drawPipeline(pipeC.getContext('2d'), pipeC.width, pipeC.height, step);

  const signals = [carrier, amplified, mixed, filtered, demodulated, output];
  const colors = ['#ff4444','#ff8844','#44aaff','#44ff88','#ffaa00','#00ff88'];
  const labels_en = ['RF Input','Amplified','IF Mixed','IF Filtered','Demodulated','Audio Output'];
  drawSignal(signals[step], 'signalCanvas', colors[step], labels_en[step]);

  if (step >= 4) {
    drawSignal(output, 'demodCanvas', '#00ff88', 'Audio Output');
  } else {
    const dc = $('demodCanvas');
    if (dc) { const dctx = dc.getContext('2d'); dctx.fillStyle='#0a0a1a'; dctx.fillRect(0,0,dc.width,dc.height);
      dctx.fillStyle='#555'; dctx.font='12px Orbitron,monospace'; dctx.fillText('Reach step 5-6 to see audio output',10,dc.height/2); }
  }

  updateMetrics(carrier, output, freq, noiseLevel);
  updateBuildProgress();

  animFrame = requestAnimationFrame(rxLoop);
}

function startRx() {
  if (rxRunning) return;
  rxRunning = true;
  setStatus(true);
  log(LANG[currentLang].rxStarted, 'success');
  rxLoop();
}

function stopRx() {
  rxRunning = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang].rxStopped, 'info');
}

function resetRx() {
  stopRx();
  $('freqSlider').value = 2000; $('freqVal').textContent = '2000 Hz';
  $('noiseSlider').value = 20; $('noiseVal').textContent = '20%';
  $('stepSelect').value = '0'; $('modSelect').value = 'am';
  stagesVisited.clear();
  ['signalCanvas','demodCanvas','pipelineCanvas'].forEach(id => {
    const c = $(id); if (c) c.getContext('2d').clearRect(0,0,c.width,c.height);
  });
  $('rfPowerVal').textContent='-- dBm'; $('snrVal').textContent='-- dB';
  $('ifFreqVal').textContent='-- Hz'; $('audioFreqVal').textContent='-- Hz'; $('agcVal').textContent='-- dB';
  updateBuildProgress();
  log(LANG[currentLang].rxReset, 'info');
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
  $('startBtn').onclick=startRx; $('stopBtn').onclick=stopRx; $('resetBtn').onclick=resetRx;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' Hz';};
  $('noiseSlider').oninput=function(){$('noiseVal').textContent=this.value+'%';};
  $('stepSelect').onchange=function(){log(LANG[currentLang].stepChanged+' '+this.selectedOptions[0].textContent,'info');};
  updateBuildProgress();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Build Receiver
   Animated superheterodyne block diagram + signal flow
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('rxSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='rxSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#050a10;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='#050a10';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const blocks=[{x:20,w:80,label:'ANTENNA'},{x:120,w:80,label:'LNA'},{x:220,w:80,label:'MIXER'},{x:320,w:80,label:'IF FILTER'},{x:420,w:80,label:'DEMOD'},{x:520,w:80,label:'AUDIO'},{x:620,w:80,label:'ADC'}];
  blocks.forEach((b,i)=>{
    const y=H*.3;
    cx.fillStyle='rgba(100,200,255,.06)';cx.fillRect(b.x,y,b.w,45);
    cx.strokeStyle=i<=Math.floor(t*2)%blocks.length?acc:'rgba(100,200,255,.15)';
    cx.lineWidth=i<=Math.floor(t*2)%blocks.length?2:1;cx.strokeRect(b.x,y,b.w,45);
    cx.fillStyle=i<=Math.floor(t*2)%blocks.length?acc:'rgba(200,230,255,.5)';
    cx.font='9px Orbitron,monospace';cx.textAlign='center';cx.fillText(b.label,b.x+b.w/2,y+28);
    if(i<blocks.length-1){
      cx.strokeStyle='rgba(100,200,255,.15)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(b.x+b.w,y+22);cx.lineTo(blocks[i+1].x,y+22);cx.stroke();
      const dot=(t*60+i*20)%(blocks[i+1].x-b.x-b.w);
      cx.fillStyle=acc;cx.beginPath();cx.arc(b.x+b.w+dot,y+22,3,0,Math.PI*2);cx.fill();
    }
  });
  // LO indicator
  cx.fillStyle='rgba(245,158,11,.3)';cx.font='8px monospace';cx.textAlign='center';
  cx.fillText('LO',260,H*.3-8);cx.strokeStyle='rgba(245,158,11,.2)';cx.lineWidth=1;
  cx.beginPath();cx.moveTo(260,H*.3-3);cx.lineTo(260,H*.3);cx.stroke();
  // Signal trace at bottom
  cx.strokeStyle=acc+'88';cx.lineWidth=1;cx.beginPath();
  for(let i=0;i<W;i++){const x=i,tt=i/W+t;
    const stage=Math.floor(i/W*blocks.length);
    const freq=stage<2?40:stage<4?15:5;
    const amp=stage<1?.3:stage<3?.5:.7;
    const y=H*.78-Math.sin(tt*freq)*H*.12*amp;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Superheterodyne Receiver — Signal Flow',8,14);
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
