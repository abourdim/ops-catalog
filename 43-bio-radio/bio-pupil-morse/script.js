/**
 * Workshop DIY — Bio Pupil Morse v1.0
 * Pupil dilation as Morse code communication
 * Self-contained: i18n · framework · simulation
 */

const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); }
  else if (type === 'success') { osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); }
  else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
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
    title: 'Bio Pupil Morse', subtitle: 'Pupil dilation as Morse code',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Pupil Morse \u2014 Eye Dilation Communication',
    mainDesc: 'Pupil size changes detected and decoded as Morse code',
    sectionA: 'A \u2014 How It Works', sectionC: 'C \u2014 Challenges',
    startTrack: 'Start Tracking', stopTrack: 'Stop',
    dotBtn: 'Dot (.)', dashBtn: 'Dash (-)', spaceBtn: 'Space', decodeBtn: 'Decode',
    statPupil: 'mm pupil', statMorse: 'symbols', statDecoded: 'decoded', statWPM: 'WPM',
    step1Title: 'Pupil Detection', step1Desc: 'IR camera tracks pupil diameter changes in the 3-8mm range with sub-millimeter precision.',
    step2Title: 'Dilation Analysis', step2Desc: 'Voluntary dilation above threshold = signal. Short pulse = dot, long pulse = dash.',
    step3Title: 'Morse Decode', step3Desc: 'Dilation patterns mapped to International Morse Code alphabet and decoded to text.',
    step4Title: 'Covert Channel', step4Desc: 'Completely silent, invisible communication channel. No one can see you transmitting!',
    ch1Title: 'Spell Your Name', ch1Desc: 'Use pupil dilation to spell your name in Morse code.',
    ch2Title: 'Speed Record', ch2Desc: 'Try to achieve 5 words per minute using only pupil dilation.',
    ch3Title: 'Secret Message', ch3Desc: 'Send a secret message to a partner who decodes it.',
    howto_1:'The main display shows the Pupil Morse simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how IR camera tracks pupil diameter changes in the 3-8mm range w',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "A \u2014 How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_pupil_title: '\ud83d\udc41 Pupillometry', wiki_pupil: 'Pupils dilate 2-8mm. Affected by light, emotion, cognitive load, and voluntary control.',
    wiki_morse_title: '\ud83d\udcac Morse Code', wiki_morse: 'International Morse Code: dot=1 unit, dash=3 units, letter gap=3 units, word gap=7 units.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '\u2699\ufe0f Settings', language: 'Language', theme: 'Theme',
    help: '\u2753 Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects', whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', working: 'Working\u2026', newVersion: 'UPDATE',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83d\udc41 Bio Pupil Morse ready \u2014 blink to encode!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English', themeChanged: '\ud83c\udfa8 Theme \u2192',sectionCode:'Device Code',faq_q1:'What is Bio Pupil Morse?',faq_a1:'Pupil Morse is an interactive simulation that demonstrates bioelectronics concepts. Pupil size changes detected and decoded as Morse code. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start Tracking to begin pupil monitoring. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u0627\u0644\u062d\u062f\u0642\u0627\u062a: 2-8\u0645\u0645. \u062a\u062a\u0623\u062b\u0631 \u0628\u0627\u0644\u0636\u0648\u0621 \u0648\u0627\u0644\u0639\u0627\u0637\u0641\u0629.',faq_q5:'What should I experiment with?',faq_a5:'Use pupil dilation to spell your name in Morse code.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Pupil Morse! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start Tracking to begin pupil monitoring. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Pupil Morse! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how IR camera tracks pupil diameter changes in the 3-8 Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Pupil Morse?',wiki_concept:'Bio Pupil Morse is a technique used in biomedical signals. Pupil size changes detected and decoded as Morse code. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: IR camera tracks pupil diameter changes in the 3-8mm range with sub-millimeter precision. Second: Voluntary dilation above threshold = signal. Short pulse = dot, long pulse = dash. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Pupil Morse has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Pupil Morse: Pupil size changes detected and decoded as Morse code. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Pupil Detection through Dilation Analysis to Morse Decode and Covert Channel.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Pupil Morse builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Pupil Morse',
    wiki_math: 'The mathematics behind Pupil Morse: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
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
    theory: 'Pupil Morse demonstrates key principles from bioelectronics. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Bio Pupille Morse', subtitle: 'Dilatation pupillaire en code Morse',
    disconnected: 'D\u00e9connect\u00e9', connected: 'Connect\u00e9',
    mainSection: 'Pupille Morse \u2014 Communication par Dilatation',
    mainDesc: 'Changements de taille de pupille d\u00e9cod\u00e9s en Morse',
    sectionA: 'A \u2014 Comment \u00e7a marche', sectionC: 'C \u2014 D\u00e9fis',
    startTrack: 'D\u00e9marrer Suivi', stopTrack: 'Arr\u00eat',
    dotBtn: 'Point (.)', dashBtn: 'Trait (-)', spaceBtn: 'Espace', decodeBtn: 'D\u00e9coder',
    statPupil: 'mm pupille', statMorse: 'symboles', statDecoded: 'd\u00e9cod\u00e9', statWPM: 'MPM',
    step1Title: 'D\u00e9tection Pupillaire', step1Desc: 'Cam\u00e9ra IR suit les changements de diam\u00e8tre pupillaire (3-8mm).',
    step2Title: 'Analyse de Dilatation', step2Desc: 'Dilatation volontaire au-dessus du seuil = signal. Court = point, long = trait.',
    step3Title: 'D\u00e9codage Morse', step3Desc: 'Motifs de dilatation mapp\u00e9s sur l\'alphabet Morse international.',
    step4Title: 'Canal Secret', step4Desc: 'Canal de communication compl\u00e8tement silencieux et invisible!',
    ch1Title: '\u00c9pelez Votre Nom', ch1Desc: 'Utilisez la dilatation pupillaire pour \u00e9peler votre nom.',
    ch2Title: 'Record de Vitesse', ch2Desc: 'Essayez 5 mots par minute avec la dilatation pupillaire.',
    ch3Title: 'Message Secret', ch3Desc: 'Envoyez un message secret \u00e0 un partenaire.',
    howto_1:'L écran principal affiche la simulation Pupil Morse. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how IR camera tracks pupil diameter changes in the 3-8mm range w',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_pupil_title: '\ud83d\udc41 Pupillom\u00e9trie', wiki_pupil: 'Pupilles: 2-8mm. Affect\u00e9es par lumi\u00e8re, \u00e9motion, charge cognitive.',
    wiki_morse_title: '\ud83d\udcac Code Morse', wiki_morse: 'Point=1 unit\u00e9, trait=3 unit\u00e9s, espace lettre=3, espace mot=7.',
    activityLog: 'Journal', eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me',
    help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores', whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'R\u00e9actif musique',
    splashHint: 'appuyer pour passer', working: 'En cours\u2026', newVersion: 'MAJ',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83d\udc41 Pupille Morse pr\u00eat \u2014 clignez pour encoder!',
    logCleared: 'Journal effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais', themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Pupil Morse ?',faq_a1:'Pupil Morse est une simulation interactive qui démontre les concepts de bioélectronique. Pupil size changes detected and decoded as Morse code. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Pupil Morse ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Pupil Morse ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de bioélectronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how IR camera tracks pupil diameter changes in the 3-8 Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Bio Pupil Morse ?',wiki_concept:'Bio Pupil Morse est une technique utilisée en biomedical signals. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de biomedical signals. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Bio Pupil Morse a des applications pratiques en biomedical signals. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Bio Pupil Morse : Pupil size changes detected and decoded as Morse code. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Pupil Morse s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Pupil Morse',
    wiki_math: 'Les mathématiques derrière Pupil Morse : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
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
    theory: 'Pupil Morse démontre les principes clés de bioélectronique. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '\u0634\u0641\u0631\u0629 \u0627\u0644\u062d\u062f\u0642\u0629', subtitle: '\u062a\u0648\u0633\u0639 \u0627\u0644\u062d\u062f\u0642\u0629 \u0643\u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0634\u0641\u0631\u0629 \u0627\u0644\u062d\u062f\u0642\u0629 \u2014 \u0627\u062a\u0635\u0627\u0644 \u0628\u062a\u0648\u0633\u0639 \u0627\u0644\u0639\u064a\u0646',
    mainDesc: '\u0643\u0634\u0641 \u062a\u063a\u064a\u0631\u0627\u062a \u062d\u062c\u0645 \u0627\u0644\u062d\u062f\u0642\u0629 \u0648\u0641\u0643 \u062a\u0634\u0641\u064a\u0631\u0647\u0627 \u0643\u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startTrack: '\u0628\u062f\u0621 \u0627\u0644\u062a\u062a\u0628\u0639', stopTrack: '\u0625\u064a\u0642\u0627\u0641',
    dotBtn: '\u0646\u0642\u0637\u0629 (.)', dashBtn: '\u0634\u0631\u0637\u0629 (-)', spaceBtn: '\u0645\u0633\u0627\u0641\u0629', decodeBtn: '\u0641\u0643 \u0627\u0644\u0634\u0641\u0631\u0629',
    statPupil: '\u0645\u0645 \u062d\u062f\u0642\u0629', statMorse: '\u0631\u0645\u0648\u0632', statDecoded: '\u0645\u0641\u0643\u0648\u0643', statWPM: '\u0643/\u062f',
    step1Title: '\u0643\u0634\u0641 \u0627\u0644\u062d\u062f\u0642\u0629', step1Desc: '\u0643\u0627\u0645\u064a\u0631\u0627 \u062a\u062d\u062a \u0627\u0644\u062d\u0645\u0631\u0627\u0621 \u062a\u062a\u0628\u0639 \u062a\u063a\u064a\u0631\u0627\u062a \u0642\u0637\u0631 \u0627\u0644\u062d\u062f\u0642\u0629 (3-8\u0645\u0645).',
    step2Title: '\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062a\u0648\u0633\u0639', step2Desc: '\u062a\u0648\u0633\u0639 \u0625\u0631\u0627\u062f\u064a \u0641\u0648\u0642 \u0627\u0644\u0639\u062a\u0628\u0629 = \u0625\u0634\u0627\u0631\u0629. \u0642\u0635\u064a\u0631 = \u0646\u0642\u0637\u0629\u060c \u0637\u0648\u064a\u0644 = \u0634\u0631\u0637\u0629.',
    step3Title: '\u0641\u0643 \u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633', step3Desc: '\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u062a\u0648\u0633\u0639 \u062a\u064f\u062d\u0648\u0644 \u0625\u0644\u0649 \u0623\u0628\u062c\u062f\u064a\u0629 \u0645\u0648\u0631\u0633 \u0627\u0644\u062f\u0648\u0644\u064a\u0629.',
    step4Title: '\u0642\u0646\u0627\u0629 \u0633\u0631\u064a\u0629', step4Desc: '\u0642\u0646\u0627\u0629 \u0627\u062a\u0635\u0627\u0644 \u0635\u0627\u0645\u062a\u0629 \u0648\u063a\u064a\u0631 \u0645\u0631\u0626\u064a\u0629 \u062a\u0645\u0627\u0645\u064b\u0627!',
    ch1Title: '\u062a\u0647\u062c\u0626 \u0627\u0633\u0645\u0643', ch1Desc: '\u0627\u0633\u062a\u062e\u062f\u0645 \u062a\u0648\u0633\u0639 \u0627\u0644\u062d\u062f\u0642\u0629 \u0644\u062a\u0647\u062c\u0626 \u0627\u0633\u0645\u0643.',
    ch2Title: '\u0631\u0642\u0645 \u0642\u064a\u0627\u0633\u064a', ch2Desc: '\u062d\u0627\u0648\u0644 5 \u0643\u0644\u0645\u0627\u062a \u0641\u064a \u0627\u0644\u062f\u0642\u064a\u0642\u0629.',
    ch3Title: '\u0631\u0633\u0627\u0644\u0629 \u0633\u0631\u064a\u0629', ch3Desc: '\u0623\u0631\u0633\u0644 \u0631\u0633\u0627\u0644\u0629 \u0633\u0631\u064a\u0629 \u0644\u0634\u0631\u064a\u0643\u0643.',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Pupil Morse. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how IR camera tracks pupil diameter changes in the 3-8mm range w', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_pupil_title: '\ud83d\udc41 \u0642\u064a\u0627\u0633 \u0627\u0644\u062d\u062f\u0642\u0629', wiki_pupil: '\u0627\u0644\u062d\u062f\u0642\u0627\u062a: 2-8\u0645\u0645. \u062a\u062a\u0623\u062b\u0631 \u0628\u0627\u0644\u0636\u0648\u0621 \u0648\u0627\u0644\u0639\u0627\u0637\u0641\u0629.',
    wiki_morse_title: '\ud83d\udcac \u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633', wiki_morse: '\u0646\u0642\u0637\u0629=1 \u0648\u062d\u062f\u0629\u060c \u0634\u0631\u0637\u0629=3\u060c \u0641\u0627\u0635\u0644 \u062d\u0631\u0641=3\u060c \u0641\u0627\u0635\u0644 \u0643\u0644\u0645\u0629=7.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b',
    clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0627\u0644\u0644\u063a\u0629', theme: '\u0627\u0644\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0635\u0648\u062a', whisperMode: '\u0647\u0645\u0633', breathingGuide: '\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637',
    musicMode: '\u0645\u0648\u0633\u064a\u0642\u0649', splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a', working: '\u062c\u0627\u0631\u064d\u2026', newVersion: '\u062a\u062d\u062f\u064a\u062b',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83d\udc41 \u0634\u0641\u0631\u0629 \u0627\u0644\u062d\u062f\u0642\u0629 \u062c\u0627\u0647\u0632\u0629!',
    logCleared: '\u062a\u0645 \u0627\u0644\u0645\u0633\u062d', copied: '\u062a\u0645!', copyFail: '\u0641\u0634\u0644',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',sectionCode:'كود الجهاز',faq_q1:'ما هو Bio Pupil Morse؟',faq_a1:'Pupil Morse هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. Pupil size changes detected and decoded as Morse code. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الإشارات الطبية الحيوية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الإشارات الطبية الحيوية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الإشارات الطبية الحيوية.',demo_s1:'مرحباً في Bio Pupil Morse! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الإشارات الطبية الحيوية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالإشارات الطبية الحيوية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Pupil Morse! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالإلكترونيات الحيوية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how IR camera tracks pupil diameter changes in the 3-8 لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الإشارات الطبية الحيوية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Bio Pupil Morse؟',wiki_concept:'Bio Pupil Morse هي تقنية تُستخدم في biomedical signals. في البيئات المهنية، تتطلب هذه التقنية Mixed وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من biomedical signals. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Bio Pupil Morse له تطبيقات عملية في biomedical signals. يستخدم المحترفون تقنيات مماثلة مع Mixed. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Bio Pupil Morse: Pupil size changes detected and decoded as Morse code. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Pupil Morse على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Pupil Morse',
    wiki_math: 'الرياضيات وراء Pupil Morse: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
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
    theory: 'Pupil Morse يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK ═══════ */
let currentLang = 'en';
function setLanguage(l) { currentLang = l; const s = LANG[l]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(e => { const k = e.dataset.i18n; if (s[k] != null) e.textContent = s[k]; }); document.title = `${s.title} \u2014 Workshop DIY`; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = l; const sel = $('langSelect'); if (sel) sel.value = l; try { localStorage.setItem('wdiy-lang', l); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const sel = $('themeSelect'); if (sel) sel.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} const s = LANG[currentLang]; log(`${s.themeChanged} ${s['t_' + n] || n}`, 'info'); }

let logContainer; const logHistory = [];
function log(m, t = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${t}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${m}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (t === 'success') playSound('success'); else if (t === 'error') playSound('error'); logHistory.push({ m, t, ts: Date.now() }); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const b = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `pupil-morse-log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(b => { b.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(x => x.classList.remove('active')); b.classList.add('active'); activeLogFilter = b.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = activeLogFilter === 'all' || l.classList.contains(activeLogFilter) ? '' : 'none'; }); }

let toastTimer = null;
function showToast(m, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = m; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
function calcHijriDate() { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch { return ''; } }

function openPanel(p, o) { const s = $(p), v = $(o); if (s) s.classList.add('open'); if (v) v.classList.add('open'); }
function closePanel(p, o, r) { const s = $(p), v = $(o); if (s) s.classList.remove('open'); if (v) v.classList.remove('open'); const b = $(r); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(t => { t.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(x => x.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); t.classList.add('active'); const id = 'help' + t.dataset.tab.charAt(0).toUpperCase() + t.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); }); }); }
function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h || !p) return; let d = false, sx, sw; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = document.documentElement.dir === 'rtl' ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { d = false; }); }

let breathingActive = false;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); }
function incrementDhikr() { const c = $('dhikrCounter'); if (c) c.textContent = parseInt(c.textContent || '0') + 1; }

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ PUPIL MORSE SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

const MORSE_TABLE = {'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9','-----':'0'};

let tracking = false;
let pupilSize = 4.0;
let targetPupil = 4.0;
let morseStr = '';
let decoded = '';
let pupilData = [];
let symbolCount = 0;
let startTime = 0;
let lightLevel = 0.5;

function initPupilApp() {
  const canvas = $('pupilCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;

  function drawEye(size) {
    const cx = W * 0.25, cy = H * 0.45, r = 65;

    // Eye white (sclera)
    ctx.save();
    ctx.shadowColor = '#6699ff';
    ctx.shadowBlur = tracking ? 15 : 5;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#f0f0f0');
    grad.addColorStop(1, '#cccccc');
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Iris
    const irisGrad = ctx.createRadialGradient(cx, cy, size * 2, cx, cy, 28);
    irisGrad.addColorStop(0, '#2a1500');
    irisGrad.addColorStop(0.5, '#6b3500');
    irisGrad.addColorStop(1, '#4a2800');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // Iris texture (radial lines)
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * (size * 2.5 + 2), cy + Math.sin(angle) * (size * 2.5 + 2));
      ctx.lineTo(cx + Math.cos(angle) * 27, cy + Math.sin(angle) * 27);
      ctx.strokeStyle = 'rgba(139,90,43,0.3)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Pupil
    ctx.beginPath();
    ctx.arc(cx, cy, size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Light reflection
    ctx.beginPath();
    ctx.arc(cx - 6, cy - 6, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 8, cy + 3, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();

    // Eyelids
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.55, r + 5, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.55, r + 5, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fill();

    ctx.restore();

    // Pupil size label
    ctx.fillStyle = '#6699ff';
    ctx.font = 'bold 16px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`${size.toFixed(1)} mm`, cx, cy + r + 25);

    // Dilation indicator
    const dilated = size > 4.5;
    if (dilated) {
      ctx.fillStyle = '#33ff33';
      ctx.font = '11px Orbitron';
      ctx.fillText('DILATED', cx, cy + r + 42);
    }
    ctx.textAlign = 'left';
  }

  function drawPupilGraph() {
    const gx = W * 0.52, gy = 15, gw = W * 0.45, gh = H * 0.45;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(gx, gy, gw, gh);

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('PUPIL DIAMETER (mm)', gx + 5, gy + 12);
    ctx.fillText('8mm', gx + gw + 3, gy + 10);
    ctx.fillText('2mm', gx + gw + 3, gy + gh - 5);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let v = 2; v <= 8; v++) {
      const yy = gy + gh - ((v - 2) / 6) * gh;
      ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke();
    }

    // Threshold line
    const thY = gy + gh - ((4.5 - 2) / 6) * gh;
    ctx.strokeStyle = 'rgba(255,204,0,0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(gx, thY); ctx.lineTo(gx + gw, thY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,204,0,0.5)';
    ctx.font = '8px Orbitron';
    ctx.fillText('THRESHOLD 4.5mm', gx + 5, thY - 4);

    // Data line
    if (pupilData.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#6699ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#6699ff';
      ctx.shadowBlur = 4;
      const maxPts = gw;
      const data = pupilData.slice(-maxPts);
      data.forEach((v, i) => {
        const x = gx + (i / maxPts) * gw;
        const y = gy + gh - ((v - 2) / 6) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill area above threshold
      ctx.beginPath();
      ctx.fillStyle = 'rgba(51,255,51,0.08)';
      data.forEach((v, i) => {
        const x = gx + (i / maxPts) * gw;
        const y = Math.min(thY, gy + gh - ((v - 2) / 6) * gh);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.lineTo(gx + (data.length / maxPts) * gw, thY);
      ctx.lineTo(gx, thY);
      ctx.fill();
    }
  }

  function drawMorsePanel() {
    const mx = W * 0.52, my = H * 0.52, mw = W * 0.45, mh = H * 0.44;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(mx, my, mw, mh);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('MORSE DECODER', mx + 8, my + 14);

    // Morse string
    ctx.fillStyle = '#ffcc00';
    ctx.font = '18px Orbitron';
    const displayMorse = morseStr.length > 30 ? '...' + morseStr.slice(-30) : morseStr;
    ctx.fillText(displayMorse || '. . .', mx + 10, my + 42);

    // Decoded text
    ctx.fillStyle = '#33ff33';
    ctx.font = 'bold 16px Orbitron';
    ctx.fillText(decoded.toUpperCase() || '---', mx + 10, my + 72);

    // Morse alphabet reference (compact)
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '7px monospace';
    const refs = ['A .-', 'B -...', 'C -.-.', 'D -..', 'E .', 'F ..-.', 'G --.', 'H ....', 'I ..', 'S ...', 'O ---', 'T -'];
    refs.forEach((r, i) => {
      const col = Math.floor(i / 6);
      const row = i % 6;
      ctx.fillText(r, mx + 10 + col * 80, my + 92 + row * 12);
    });

    // Light level indicator
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '8px Orbitron';
    ctx.fillText('AMBIENT LIGHT', mx + mw - 100, my + mh - 8);
    ctx.fillStyle = `rgba(255,255,${Math.round(lightLevel * 200)},0.3)`;
    ctx.fillRect(mx + mw - 100, my + mh - 22, 80 * lightLevel, 10);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(mx + mw - 100, my + mh - 22, 80, 10);
  }

  function drawLightSimulator() {
    const lx = W * 0.02, ly = H * 0.72, lw = W * 0.44, lh = H * 0.24;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(lx, ly, lw, lh);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(lx, ly, lw, lh);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('IR CAMERA VIEW', lx + 8, ly + 14);

    // Simulated IR camera view
    const cx2 = lx + lw / 2, cy2 = ly + lh / 2 + 5;
    // Cross-hairs
    ctx.strokeStyle = 'rgba(51,255,51,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx2 - 30, cy2); ctx.lineTo(cx2 + 30, cy2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx2, cy2 - 25); ctx.lineTo(cx2, cy2 + 25); ctx.stroke();

    // Pupil detection circle
    const pr = pupilSize * 3;
    ctx.beginPath();
    ctx.arc(cx2, cy2, pr, 0, Math.PI * 2);
    ctx.strokeStyle = pupilSize > 4.5 ? '#33ff33' : '#6699ff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Measurement lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx2 - pr, cy2 + pr + 8); ctx.lineTo(cx2 + pr, cy2 + pr + 8); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '8px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`${pupilSize.toFixed(1)}mm`, cx2, cy2 + pr + 18);
    ctx.textAlign = 'left';
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;

    // Smooth pupil animation
    pupilSize += (targetPupil - pupilSize) * 0.15;

    // Natural pupil fluctuation when tracking
    if (tracking) {
      lightLevel = 0.5 + Math.sin(t * 0.3) * 0.15;
      const naturalSize = 3.5 + Math.sin(t * 1.5) * 0.3 + (Math.random() - 0.5) * 0.15;
      if (Math.abs(targetPupil - 4.0) < 0.3) targetPupil = naturalSize;
      pupilData.push(pupilSize);
      if (pupilData.length > W * 0.45) pupilData.shift();
    }

    // Update stats
    const sp = $('statPupil'), sm = $('statMorse'), sw = $('statWPM');
    if (sp) sp.textContent = pupilSize.toFixed(1);
    if (sm) sm.textContent = symbolCount;
    if (sw && startTime > 0) {
      const elapsed = (Date.now() - startTime) / 60000;
      if (elapsed > 0.01) sw.textContent = Math.round(decoded.split(' ').filter(w => w).length / elapsed);
    }

    drawEye(pupilSize);
    drawPupilGraph();
    drawMorsePanel();
    drawLightSimulator();

    requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn = $('startBtn'), dotBtn = $('dotBtn'), dashBtn = $('dashBtn');
  const spaceBtn = $('spaceBtn'), decBtn = $('decodeBtn');

  if (startBtn) startBtn.onclick = () => {
    tracking = !tracking;
    setStatus(tracking);
    if (tracking) startTime = Date.now();
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = tracking ? LANG[currentLang].stopTrack : LANG[currentLang].startTrack;
    log(tracking ? '\ud83d\udc41 Pupil tracking started' : '\ud83d\udc41 Tracking stopped', 'info');
  };

  if (dotBtn) dotBtn.onclick = () => {
    targetPupil = 5.5;
    morseStr += '.';
    symbolCount++;
    log('\u25cf Pupil dilate: DOT', 'tx');
    playSound('click');
    setTimeout(() => { targetPupil = 3.5; }, 200);
    updateMorseDisplay();
  };

  if (dashBtn) dashBtn.onclick = () => {
    targetPupil = 6.5;
    morseStr += '-';
    symbolCount++;
    log('\u25ac Pupil dilate: DASH', 'tx');
    playSound('click');
    setTimeout(() => { targetPupil = 3.5; }, 500);
    updateMorseDisplay();
  };

  if (spaceBtn) spaceBtn.onclick = () => {
    morseStr += ' ';
    log('\u2423 Letter space', 'info');
    updateMorseDisplay();
  };

  if (decBtn) decBtn.onclick = () => {
    const words = morseStr.trim().split(' / ').map(w =>
      w.trim().split(' ').map(c => MORSE_TABLE[c] || '?').join('')
    ).join(' ');
    decoded = words;
    const sd = $('statDecoded');
    if (sd) sd.textContent = decoded;
    log(`\ud83d\udd0d Decoded: ${words}`, 'success');
    morseStr = '';
    showToast(`Message: ${words}`, 2500);
    updateMorseDisplay();
  };

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (!tracking) return;
    if (e.code === 'Space' && !e.target.matches('input,select,textarea')) {
      e.preventDefault();
      morseStr += ' ';
      updateMorseDisplay();
    }
    if (e.code === 'Slash') {
      morseStr += ' / ';
      updateMorseDisplay();
    }
  });

  function updateMorseDisplay() {
    const md = $('morseDisplay');
    if (md) md.textContent = morseStr || '. . .';
    const fill = $('decodeFill'), label = $('decodeLabel');
    if (fill) fill.style.width = Math.min(100, symbolCount * 3) + '%';
    if (label) label.textContent = `${symbolCount} symbols | ${morseStr.split(' ').filter(s => s && s !== '/').length} chars`;
  }
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lBtn = $('logBtn'), lC = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lC) lC.onclick = closeLog;
  initLogResize();
  const st = $('soundToggle');
  if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  const bb = $('breathingBtn'), dd = $('dhikrDisplay'), db = $('dhikrBtn');
  if (bb) bb.onclick = () => { toggleBreathing(); if (dd) dd.style.display = breathingActive ? 'flex' : 'none'; };
  if (db) db.onclick = incrementDhikr;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  const ls = $('langSelect'); if (ls) ls.onchange = () => setLanguage(ls.value);
  const ts = $('themeSelect'); if (ts) ts.onchange = () => setTheme(ts.value);
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  const hd = $('hijriDate'); if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }
  let lc = 0, lt = null; const logo = $('logoWrap');
  if (logo) { logo.style.cursor = 'pointer'; logo.onclick = () => { lc++; if (lt) clearTimeout(lt); if (lc >= 3) { lc = 0; toggleMatrix(); } else lt = setTimeout(() => lc = 0, 500); }; }
  log(LANG[currentLang].ready, 'success');
  setTimeout(initPupilApp, 50);
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
