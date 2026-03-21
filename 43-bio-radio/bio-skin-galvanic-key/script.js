/**
 * Workshop DIY — Bio Skin Galvanic Key v1.0
 * Skin conductance as cryptographic key generation
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); const o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain(); o2.connect(g2); g2.connect(audioCtx.destination); g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine'; g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o2.start(t + 0.15); o2.stop(t + 0.4); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
    case 'tx': osc.frequency.value = 1200; osc.type = 'sawtooth'; gain.gain.value = 0.04; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); osc.start(t); osc.stop(t + 0.15); break;
  }
}

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
    title: 'Bio Skin Galvanic Key', subtitle: 'Skin conductance as crypto key',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Galvanic Skin Response \u2014 Crypto Key Gen', mainDesc: 'Electrodermal activity generates unique cryptographic keys',
    sectionA: 'A \u2014 How It Works', sectionC: 'C \u2014 Challenges',
    startGSR: 'Start GSR', stopGSR: 'Stop', stressMode: 'Stress', calmMode: 'Calm', genKey: 'Generate Key',
    statGSR: 'GSR', statStress: 'Stress', statEntropy: 'bits', statKeys: 'keys',
    step1Title: 'Skin Electrodes', step1Desc: 'Two electrodes on fingertips measure electrical conductance. Sweat glands change conductivity.',
    step2Title: 'GSR Measurement', step2Desc: 'micro:bit ADC reads skin conductance in microsiemens. Emotions cause rapid fluctuations.',
    step3Title: 'LSB Extraction', step3Desc: 'Least significant bits of ADC readings contain high-entropy noise for key generation.',
    step4Title: 'Key Output', step4Desc: '256-bit AES key generated from GSR entropy. Each key is biometrically unique.',
    ch1Title: 'Stress Key', ch1Desc: 'Generate a key while stressed vs calm. Are both equally random?',
    ch2Title: 'Twin Test', ch2Desc: 'Two people generate keys. Even twins produce different GSR patterns.',
    ch3Title: 'Entropy Analysis', ch3Desc: 'Generate 100 keys and check distribution. Is it uniform?',
    howto_1:'The main display shows the Skin Galvanic Key simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Two electrodes on fingertips measure electrical conductance.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.', howto_3:'Scroll down to the expandable sections. "A \u2014 How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    wiki_gsr_title: '\ud83d\udca7 Galvanic Skin Response', wiki_gsr:'Skin conductance: 1-20 microsiemens. Stress increases sweat and conductance. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_entropy_title: '\ud83d\udd22 Entropy Harvesting', wiki_entropy: 'LSBs of analog readings are dominated by thermal noise, providing quality entropy.',
    keyPlaceholder: 'Crypto key will appear here...',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages', clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '\u2699\ufe0f Settings', language: 'Language', theme: 'Theme', help: '\u2753 Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', working: 'Working\u2026',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83d\udca7 Galvanic Key ready \u2014 touch to generate!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English', themeChanged: '\ud83c\udfa8 Theme \u2192',
    gsrStarted: 'GSR measurement started', gsrStopped: 'GSR stopped', needData: 'Collect more GSR data (need 50+ samples)', keyGenerated: 'Key generated',sectionCode:'Device Code',faq_q1:'What is Bio Skin Galvanic Key?',faq_a1:'Skin Galvanic Key is an interactive simulation that demonstrates bioelectronics concepts. Electrodermal activity generates unique cryptographic keys. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start GSR to begin measurement. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u0627\u0644\u0645\u0648\u0635\u0644\u064a\u0629: 1-20 \u00b5S. \u0627\u0644\u0625\u062c\u0647\u0627\u062f \u064a\u0632\u064a\u062f \u0627\u0644\u0639\u0631\u0642.',faq_q5:'What should I experiment with?',faq_a5:'Generate a key while stressed vs calm. Are both equally random?',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Skin Galvanic Key! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start GSR to begin measurement. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Skin Galvanic Key! This is like a science experiment on your computer. You get to control a real bioelectronics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Two electrodes on fingertips measure electrical co Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Skin Galvanic Key?',wiki_concept:'Bio Skin Galvanic Key is a technique used in biomedical signals. Electrodermal activity generates unique cryptographic keys. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Two electrodes on fingertips measure electrical conductance. Sweat glands change conductivity. Second: micro:bit ADC reads skin conductance in microsiemens. Emotions cause rapid fluctuations. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Skin Galvanic Key has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Skin Galvanic Key: Electrodermal activity generates unique cryptographic keys. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Skin Electrodes through GSR Measurement to LSB Extraction and Key Output.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Skin Galvanic Key builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Skin Galvanic Key',
    wiki_math: 'The mathematics behind Skin Galvanic Key: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. Each AES round: SubBytes (S-box), ShiftRows, MixColumns (matrix multiply in GF(2⁸)), AddRoundKey (XOR). The S-box computes multiplicative inverse in GF(2⁸).',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'S-Box',
    gloss3_def: 'Substitution Box — a lookup table that replaces each byte with another byte. In AES, the S-box is designed to resist linear and differential cryptanalysis.',
    gloss4_term: 'Noise Figure',
    gloss4_def: 'A measure of how much noise a device adds to a signal, in dB. NF = 0 dB means no added noise (ideal). A good LNA has NF < 1 dB; a mixer might be 6-10 dB.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Skin Galvanic Key demonstrates key principles from bioelectronics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. AES (Advanced Encryption Standard) is a symmetric block cipher using 128-bit blocks and 128/192/256-bit keys. It applies 10-14 rounds of substitution-permutation. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Bio Cl\u00e9 Galvanique', subtitle: 'Conductance cutan\u00e9e comme cl\u00e9 crypto',
    disconnected: 'D\u00e9connect\u00e9', connected: 'Connect\u00e9',
    mainSection: 'R\u00e9ponse Galvanique \u2014 G\u00e9n\u00e9ration Cl\u00e9', mainDesc: 'L\'activit\u00e9 \u00e9lectrodermale g\u00e9n\u00e8re des cl\u00e9s',
    sectionA: 'A \u2014 Fonctionnement', sectionC: 'C \u2014 D\u00e9fis',
    startGSR: 'D\u00e9marrer GSR', stopGSR: 'Arr\u00eat', stressMode: 'Stress', calmMode: 'Calme', genKey: 'G\u00e9n\u00e9rer Cl\u00e9',
    statGSR: 'GSR', statStress: 'Stress', statEntropy: 'bits', statKeys: 'cl\u00e9s',
    step1Title: '\u00c9lectrodes', step1Desc: 'Deux \u00e9lectrodes sur les doigts mesurent la conductance.',
    step2Title: 'Mesure GSR', step2Desc: 'L\'ADC du micro:bit lit la conductance en microsiemens.',
    step3Title: 'Extraction LSB', step3Desc: 'Les bits de poids faible contiennent du bruit haute entropie.',
    step4Title: 'Cl\u00e9 de sortie', step4Desc: 'Cl\u00e9 AES 256 bits g\u00e9n\u00e9r\u00e9e. Unique biom\u00e9triquement.',
    ch1Title: 'Cl\u00e9 Stress', ch1Desc: 'G\u00e9n\u00e9rez stress\u00e9 vs calme. Les deux al\u00e9atoires?',
    ch2Title: 'Test Jumeaux', ch2Desc: 'M\u00eame jumeaux, diff\u00e9rents motifs GSR.',
    ch3Title: 'Analyse Entropie', ch3Desc: 'G\u00e9n\u00e9rez 100 cl\u00e9s. Distribution uniforme?',
    howto_1:'L écran principal affiche la simulation Skin Galvanic Key. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Two electrodes on fingertips measure electrical conductance.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.', howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    wiki_gsr_title: '\ud83d\udca7 R\u00e9ponse Galvanique', wiki_gsr: 'Conductance: 1-20 \u00b5S. Le stress augmente la sueur.',
    wiki_entropy_title: '\ud83d\udd22 R\u00e9colte d\'Entropie', wiki_entropy: 'Les LSB analogiques contiennent du bruit thermique.',
    keyPlaceholder: 'La cl\u00e9 crypto appara\u00eetra ici...',
    activityLog: 'Journal', eventsMsg: '\u00c9v\u00e9nements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me', help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sons', whisperMode: 'Murmure', breathingGuide: 'Respiration', dhikrTap: 'Tap', musicMode: 'Musique',
    splashHint: 'appuyer', working: 'En cours\u2026',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83d\udca7 Cl\u00e9 galvanique pr\u00eate!',
    logCleared: 'Effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec',
    langChanged: '\ud83c\udf10 Fran\u00e7ais', themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    gsrStarted: 'Mesure GSR d\u00e9marr\u00e9e', gsrStopped: 'GSR arr\u00eat\u00e9', needData: 'Collectez plus (50+ \u00e9chantillons)', keyGenerated: 'Cl\u00e9 g\u00e9n\u00e9r\u00e9e',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Skin Galvanic Key ?',faq_a1:'Skin Galvanic Key est une simulation interactive qui démontre les concepts de bioélectronique. Electrodermal activity generates unique cryptographic keys. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Skin Galvanic Key ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Skin Galvanic Key ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de bioélectronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Two electrodes on fingertips measure electrical co Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Bio Skin Galvanic Key ?',wiki_concept:'Bio Skin Galvanic Key est une technique utilisée en biomedical signals. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de biomedical signals. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Bio Skin Galvanic Key a des applications pratiques en biomedical signals. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Bio Skin Galvanic Key : Electrodermal activity generates unique cryptographic keys. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Skin Galvanic Key s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Skin Galvanic Key',
    wiki_math: 'Les mathématiques derrière Skin Galvanic Key : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. Each AES round: SubBytes (S-box), ShiftRows, MixColumns (matrix multiply in GF(2⁸)), AddRoundKey (XOR). The S-box computes multiplicative inverse in GF(2⁸).',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'S-Box',
    gloss3_def: 'Substitution Box — a lookup table that replaces each byte with another byte. In AES, the S-box is designed to resist linear and differential cryptanalysis.',
    gloss4_term: 'Noise Figure',
    gloss4_def: 'A measure of how much noise a device adds to a signal, in dB. NF = 0 dB means no added noise (ideal). A good LNA has NF < 1 dB; a mixer might be 6-10 dB.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Skin Galvanic Key démontre les principes clés de bioélectronique. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. AES (Advanced Encryption Standard) is a symmetric block cipher using 128-bit blocks and 128/192/256-bit keys. It applies 10-14 rounds of substitution-permutation. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '\u0645\u0641\u062a\u0627\u062d \u0627\u0644\u062c\u0644\u062f \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a', subtitle: '\u0645\u0648\u0635\u0644\u064a\u0629 \u0627\u0644\u062c\u0644\u062f \u0643\u0645\u0641\u062a\u0627\u062d \u062a\u0634\u0641\u064a\u0631',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0627\u0644\u062c\u0644\u062f \u2014 \u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d', mainDesc: '\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a \u0644\u0644\u062c\u0644\u062f \u064a\u0648\u0644\u062f \u0645\u0641\u0627\u062a\u064a\u062d',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC: '\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',
    startGSR: '\u0628\u062f\u0621 GSR', stopGSR: '\u0625\u064a\u0642\u0627\u0641', stressMode: '\u0625\u062c\u0647\u0627\u062f', calmMode: '\u0647\u062f\u0648\u0621', genKey: '\u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d',
    statGSR: 'GSR', statStress: '\u0625\u062c\u0647\u0627\u062f', statEntropy: '\u0628\u062a', statKeys: '\u0645\u0641\u0627\u062a\u064a\u062d',
    step1Title: '\u0623\u0642\u0637\u0627\u0628 \u0627\u0644\u062c\u0644\u062f', step1Desc: '\u0642\u0637\u0628\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0635\u0627\u0628\u0639 \u064a\u0642\u064a\u0633\u0627\u0646 \u0627\u0644\u0645\u0648\u0635\u0644\u064a\u0629.',
    step2Title: '\u0642\u064a\u0627\u0633 GSR', step2Desc: 'ADC \u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0642\u0631\u0623 \u0627\u0644\u0645\u0648\u0635\u0644\u064a\u0629 \u0628\u0627\u0644\u0645\u064a\u0643\u0631\u0648\u0633\u064a\u0645\u0646\u0632.',
    step3Title: '\u0627\u0633\u062a\u062e\u0631\u0627\u062c LSB', step3Desc: '\u0627\u0644\u0628\u062a\u0627\u062a \u0627\u0644\u0623\u0642\u0644 \u0623\u0647\u0645\u064a\u0629 \u062a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u0639\u0627\u0644\u064a.',
    step4Title: '\u0627\u0644\u0645\u0641\u062a\u0627\u062d', step4Desc: '\u0645\u0641\u062a\u0627\u062d AES 256 \u0628\u062a \u0641\u0631\u064a\u062f \u0628\u064a\u0648\u0645\u062a\u0631\u064a\u064b\u0627.',
    ch1Title: '\u0645\u0641\u062a\u0627\u062d \u0627\u0644\u0625\u062c\u0647\u0627\u062f', ch1Desc: '\u0648\u0644\u0651\u062f \u0645\u0641\u062a\u0627\u062d \u0645\u062c\u0647\u062f\u064b\u0627 \u0648\u0647\u0627\u062f\u0626\u064b\u0627.',
    ch2Title: '\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u062a\u0648\u0623\u0645', ch2Desc: '\u062d\u062a\u0649 \u0627\u0644\u062a\u0648\u0627\u0626\u0645 \u064a\u0646\u062a\u062c\u0648\u0646 \u0623\u0646\u0645\u0627\u0637 \u0645\u062e\u062a\u0644\u0641\u0629.',
    ch3Title: '\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0625\u0646\u062a\u0631\u0648\u0628\u064a', ch3Desc: '\u0648\u0644\u0651\u062f 100 \u0645\u0641\u062a\u0627\u062d. \u0647\u0644 \u0627\u0644\u062a\u0648\u0632\u064a\u0639 \u0645\u0646\u062a\u0638\u0645\u061f',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Skin Galvanic Key. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Two electrodes on fingertips measure electrical conductance.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.', howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    wiki_gsr_title: '\ud83d\udca7 \u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0627\u0644\u062c\u0644\u062f', wiki_gsr: '\u0627\u0644\u0645\u0648\u0635\u0644\u064a\u0629: 1-20 \u00b5S. \u0627\u0644\u0625\u062c\u0647\u0627\u062f \u064a\u0632\u064a\u062f \u0627\u0644\u0639\u0631\u0642.',
    wiki_entropy_title: '\ud83d\udd22 \u062d\u0635\u0627\u062f \u0627\u0644\u0625\u0646\u062a\u0631\u0648\u0628\u064a', wiki_entropy: 'LSB \u0627\u0644\u062a\u0646\u0627\u0638\u0631\u064a\u0629 \u062a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u0636\u0648\u0636\u0627\u0621 \u062d\u0631\u0627\u0631\u064a.',
    keyPlaceholder: '\u0627\u0644\u0645\u0641\u062a\u0627\u062d \u0633\u064a\u0638\u0647\u0631 \u0647\u0646\u0627...',
    activityLog: '\u0633\u062c\u0644', eventsMsg: '\u0623\u062d\u062f\u0627\u062b', clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0627\u0644\u0644\u063a\u0629', theme: '\u0627\u0644\u0645\u0638\u0647\u0631', help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0635\u0648\u062a', whisperMode: '\u0647\u0645\u0633', breathingGuide: '\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637', musicMode: '\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint: '\u0627\u0646\u0642\u0631', working: '\u062c\u0627\u0631\u064d\u2026',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636', t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83d\udca7 \u0645\u0641\u062a\u0627\u062d \u0627\u0644\u062c\u0644\u062f \u062c\u0627\u0647\u0632!',
    logCleared: '\u062a\u0645 \u0627\u0644\u0645\u0633\u062d', copied: '\u062a\u0645!', copyFail: '\u0641\u0634\u0644',
    langChanged: '\ud83c\udf10 \u0639\u0631\u0628\u064a\u0629', themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    gsrStarted: '\u0628\u062f\u0623 \u0642\u064a\u0627\u0633 GSR', gsrStopped: '\u062a\u0648\u0642\u0641 GSR', needData: '\u0627\u062c\u0645\u0639 \u0628\u064a\u0627\u0646\u0627\u062a \u0623\u0643\u062b\u0631 (50+)', keyGenerated: '\u062a\u0645 \u062a\u0648\u0644\u064a\u062f \u0627\u0644\u0645\u0641\u062a\u0627\u062d',sectionCode:'كود الجهاز',faq_q1:'ما هو Bio Skin Galvanic Key؟',faq_a1:'Skin Galvanic Key هي محاكاة تفاعلية توضح مفاهيم الإلكترونيات الحيوية. Electrodermal activity generates unique cryptographic keys. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الإشارات الطبية الحيوية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الإشارات الطبية الحيوية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الإشارات الطبية الحيوية.',demo_s1:'مرحباً في Bio Skin Galvanic Key! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الإشارات الطبية الحيوية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالإشارات الطبية الحيوية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Skin Galvanic Key! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالإلكترونيات الحيوية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Two electrodes on fingertips measure electrical co لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الإشارات الطبية الحيوية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Bio Skin Galvanic Key؟',wiki_concept:'Bio Skin Galvanic Key هي تقنية تُستخدم في biomedical signals. في البيئات المهنية، تتطلب هذه التقنية Mixed وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من biomedical signals. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Bio Skin Galvanic Key له تطبيقات عملية في biomedical signals. يستخدم المحترفون تقنيات مماثلة مع Mixed. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Bio Skin Galvanic Key: Electrodermal activity generates unique cryptographic keys. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Skin Galvanic Key على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Skin Galvanic Key',
    wiki_math: 'الرياضيات وراء Skin Galvanic Key: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. Each AES round: SubBytes (S-box), ShiftRows, MixColumns (matrix multiply in GF(2⁸)), AddRoundKey (XOR). The S-box computes multiplicative inverse in GF(2⁸).',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'S-Box',
    gloss3_def: 'Substitution Box — a lookup table that replaces each byte with another byte. In AES, the S-box is designed to resist linear and differential cryptanalysis.',
    gloss4_term: 'Noise Figure',
    gloss4_def: 'A measure of how much noise a device adds to a signal, in dB. NF = 0 dB means no added noise (ideal). A good LNA has NF < 1 dB; a mixer might be 6-10 dB.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Skin Galvanic Key يوضح المبادئ الأساسية في الإلكترونيات الحيوية. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. AES (Advanced Encryption Standard) is a symmetric block cipher using 128-bit blocks and 128/192/256-bit keys. It applies 10-14 rounds of substitution-permutation. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK ═══════ */
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.title = `${s.title} \u2014 Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const notes = THEME_MELODIES[n]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((f, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_' + name] || name}`, 'info'); }

let logContainer; const logHistory = []; let typewriterEnabled = true;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; const ft = `[${new Date().toLocaleTimeString()}] ${msg}`; if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, ft); } else { d.textContent = ft; logContainer.appendChild(d); } logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') { playSound('success'); pulseBismillah('success'); } else if (type === 'error') { playSound('error'); pulseBismillah('error'); } logHistory.push({ msg, type, ts: Date.now() }); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `gsr-key-log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); URL.revokeObjectURL(u); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none'; }); }

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function typewriterAppend(el, text) { el.classList.add('typing'); el.textContent = ''; for (let i = 0; i < text.length; i++) { el.textContent += text[i]; if (el.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight; await sleep(12 + Math.random() * 18); } el.classList.remove('typing'); }
function pulseBismillah(type) { const b = document.querySelector('.bismillah'); if (!b) return; b.classList.remove('pulse-success', 'pulse-error'); void b.offsetWidth; b.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success'); setTimeout(() => b.classList.remove('pulse-success', 'pulse-error'), 700); }
function calcHijriDate() { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch { return ''; } }

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri,serif'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }

let morseTimeout = null; function initMorseLog() { document.addEventListener('mousedown', e => { const line = e.target.closest('.log-line'); if (!line) return; morseTimeout = setTimeout(() => { const dot = document.querySelector('.status-dot'); if (dot) { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; setTimeout(() => { dot.style.background = ''; dot.style.boxShadow = ''; }, 500); } }, 600); }); document.addEventListener('mouseup', () => { if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; } }); }

let musicActive = false;
function toggleMusicMode() { if (musicActive) { musicActive = false; document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; }); log('\ud83c\udfb5 Music off', 'info'); return; } navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { if (!audioCtx) audioCtx = new AudioCtx(); const src = audioCtx.createMediaStreamSource(stream); const ana = audioCtx.createAnalyser(); ana.fftSize = 256; src.connect(ana); musicActive = true; log('\ud83c\udfb5 Music on!', 'success'); const data = new Uint8Array(ana.frequencyBinCount); const bands = document.querySelectorAll('.deco-band'); function vis() { if (!musicActive) return; ana.getByteFrequencyData(data); const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255; bands.forEach(b => { b.style.height = (2 + bass * 10) + 'px'; b.style.opacity = 0.4 + bass * 0.6; }); requestAnimationFrame(vis); } vis(); }).catch(() => log('\ud83c\udfb5 Mic denied', 'error')); }

let recognition = null, whisperActive = false;
function toggleWhisper() { if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('\ud83c\udfa4 Not supported', 'error'); return; } if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('\ud83c\udfa4 Off', 'info'); return; } const SR = window.SpeechRecognition || window.webkitSpeechRecognition; recognition = new SR(); recognition.continuous = true; recognition.interimResults = false; recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US'; recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) log(`\ud83c\udfa4 ${e.results[i][0].transcript.trim()}`, 'rx'); } }; recognition.onerror = e => log(`\ud83c\udfa4 ${e.error}`, 'error'); recognition.onend = () => { if (whisperActive) recognition.start(); }; recognition.start(); whisperActive = true; log('\ud83c\udfa4 Whisper on!', 'success'); }

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h || !p) return; let d = false, sx, sw; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = document.documentElement.dir === 'rtl' ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { d = false; }); }

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); }
function closePanel(pid, oid, rid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); const b = $(rid); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (tgt) tgt.classList.add('active'); }); }); }
function trapFocus(e) { for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) { const s = $(id); if (!s || !s.classList.contains('open')) continue; const f = s.querySelectorAll(FOCUSABLE); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } return; } }

function sendAppMessage(type, data) { try { localStorage.setItem('wdiy-app-msg', JSON.stringify({ type, data, from: document.title, ts: Date.now() })); localStorage.removeItem('wdiy-app-msg'); } catch {} }
function onAppMessage(cb) { window.addEventListener('storage', e => { if (e.key !== 'wdiy-app-msg' || !e.newValue) return; try { cb(JSON.parse(e.newValue)); } catch {} }); }

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; toggleMatrix(); } } else konamiIdx = 0; }); }
function initLogoTracker() { const l = $('logoWrap'); if (!l) return; document.addEventListener('mousemove', e => { const r = l.getBoundingClientRect(); const dx = (e.clientX - r.left - r.width / 2) / (innerWidth / 2), dy = (e.clientY - r.top - r.height / 2) / (innerHeight / 2); l.style.transform = `perspective(200px) rotateX(${dy * 8}deg) rotateY(${-dx * 8}deg)`; }); }
function initDebug() { if (!new URLSearchParams(location.search).has('debug')) return; const p = $('debugPanel'); if (!p) return; p.classList.add('active'); let frames = 0, lt = performance.now(); function tick() { frames++; const n = performance.now(); if (n - lt >= 1000) { $('debugFps').textContent = frames + ' FPS'; frames = 0; lt = n; } requestAnimationFrame(tick); } requestAnimationFrame(tick); }

function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn'); if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog; initLogFilters();
  const hB = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay'); if (hB) hB.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp; initHelpTabs();
  const sB = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay'); if (sB) sB.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lB = $('logBtn'), lC = $('logCloseBtn'); if (lB) lB.onclick = toggleLog; if (lC) lC.onclick = closeLog; initLogResize();
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.addEventListener('change', () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }
  const wB = $('whisperBtn'); if (wB) wB.onclick = toggleWhisper;
  const bB = $('breathingBtn'), dD = $('dhikrDisplay'), dB = $('dhikrBtn'); if (bB) bB.onclick = () => { toggleBreathing(); if (dD) dD.style.display = breathingActive ? 'flex' : 'none'; }; if (dB) dB.onclick = incrementDhikr;
  const mB = $('musicBtn'); if (mB) mB.onclick = toggleMusicMode;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); if (e.key === 'Tab') trapFocus(e); });
  const ls = $('langSelect'); if (ls) ls.addEventListener('change', () => setLanguage(ls.value));
  const ts = $('themeSelect'); if (ts) ts.addEventListener('change', () => setTheme(ts.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  onAppMessage(msg => log(`\ud83d\udce8 ${msg.from}: ${msg.type}`, 'rx'));
  initKonami(); initMorseLog(); initDebug(); initLogoTracker();
  const hd = $('hijriDate'); if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }
  let lClicks = 0, lTimer = null; if (lw) { lw.style.cursor = 'pointer'; lw.addEventListener('click', () => { lClicks++; if (lTimer) clearTimeout(lTimer); if (lClicks >= 3) { lClicks = 0; toggleMatrix(); } else lTimer = setTimeout(() => lClicks = 0, 500); }); }
  log(LANG[currentLang].ready, 'success');
  setTimeout(initGSRApp, 50);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ GALVANIC SKIN KEY SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let gsrRunning = false, gsrMode = 'normal', gsrData = [], keysGen = 0;
let gsrVal = 4.7, stressLevel = 32;

function initGSRApp() {
  const canvas = $('gsrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function drawGSRTrace() {
    if (gsrData.length < 2) return;
    // Area fill
    ctx.beginPath(); ctx.moveTo(0, H * 0.7);
    gsrData.forEach((v, i) => { ctx.lineTo(i * (W / gsrData.length), H * 0.7 - v / 20 * H * 0.6); });
    ctx.lineTo(gsrData.length * (W / gsrData.length), H * 0.7); ctx.closePath();
    ctx.fillStyle = 'rgba(0,204,255,0.06)'; ctx.fill();
    // Line
    ctx.beginPath(); ctx.strokeStyle = '#00ccff'; ctx.lineWidth = 2.5; ctx.shadowColor = '#00ccff'; ctx.shadowBlur = 8;
    gsrData.forEach((v, i) => { const x = i * (W / gsrData.length), y = H * 0.7 - v / 20 * H * 0.6; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke(); ctx.shadowBlur = 0;
  }

  function drawStressMeter() {
    const mw = 180, mh = 28, mx = W / 2 - mw / 2, my = H - 50;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(mx, my, mw, mh);
    const gradient = ctx.createLinearGradient(mx, 0, mx + mw, 0);
    gradient.addColorStop(0, '#33ff33'); gradient.addColorStop(0.5, '#ffcc00'); gradient.addColorStop(1, '#ff3333');
    ctx.fillStyle = gradient; ctx.fillRect(mx + 2, my + 2, (mw - 4) * stressLevel / 100, mh - 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.strokeRect(mx, my, mw, mh);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText(`Stress: ${stressLevel}%`, mx + mw / 2, my + 19); ctx.textAlign = 'left';
  }

  function drawYAxis() {
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '9px Orbitron';
    for (let i = 0; i <= 20; i += 5) {
      const y = H * 0.7 - i / 20 * H * 0.6;
      ctx.fillText(`${i}\u00b5S`, W - 38, y + 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W - 42, y); ctx.stroke();
    }
  }

  function drawKeyVisualizer() {
    const kx = 10, ky = 15, kw = W * 0.35, kh = 80;
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(kx, ky, kw, kh);
    ctx.strokeStyle = 'rgba(0,204,255,0.2)'; ctx.strokeRect(kx, ky, kw, kh);
    ctx.fillStyle = '#00ccff'; ctx.font = 'bold 10px Orbitron';
    ctx.fillText('ENTROPY POOL', kx + 8, ky + 16);

    // Show entropy accumulation as small squares
    const poolSize = Math.min(gsrData.length, 200);
    const sqSize = 4;
    const cols = Math.floor((kw - 10) / (sqSize + 1));
    for (let i = 0; i < poolSize && i < cols * 6; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const val = Math.round(gsrData[gsrData.length - poolSize + i] * 1000) & 0xFF;
      const hue = val / 255 * 180;
      ctx.fillStyle = `hsla(${hue},70%,50%,0.7)`;
      ctx.fillRect(kx + 5 + col * (sqSize + 1), ky + 22 + row * (sqSize + 1), sqSize, sqSize);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '8px Orbitron';
    ctx.fillText(`${gsrData.length} samples`, kx + 8, ky + kh - 5);
  }

  function drawFingerProbe() {
    if (!gsrRunning) return;
    const fx = W * 0.55, fy = 40;
    // Hand outline
    ctx.strokeStyle = `rgba(0,204,255,${0.3 + Math.sin(t * 0.05) * 0.15})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 50);
    ctx.lineTo(fx - 15, fy + 30);
    ctx.lineTo(fx - 15, fy);
    ctx.lineTo(fx - 5, fy);
    ctx.lineTo(fx - 5, fy + 25);
    ctx.lineTo(fx + 5, fy + 25);
    ctx.lineTo(fx + 5, fy - 5);
    ctx.lineTo(fx + 15, fy - 5);
    ctx.lineTo(fx + 15, fy + 25);
    ctx.lineTo(fx + 25, fy + 25);
    ctx.lineTo(fx + 25, fy + 5);
    ctx.lineTo(fx + 35, fy + 5);
    ctx.lineTo(fx + 35, fy + 50);
    ctx.closePath();
    ctx.stroke();
    // Electrode indicators
    ctx.beginPath(); ctx.arc(fx - 10, fy + 10, 3, 0, Math.PI * 2); ctx.fillStyle = '#ff3333'; ctx.fill();
    ctx.beginPath(); ctx.arc(fx + 10, fy + 10, 3, 0, Math.PI * 2); ctx.fillStyle = '#33ff33'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '8px Orbitron';
    ctx.fillText('ELECTRODES', fx - 12, fy + 65);
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 0, W, H);
    t++;

    if (gsrRunning) {
      const target = gsrMode === 'stress' ? 12 : gsrMode === 'calm' ? 2 : 4.7;
      gsrVal += (target - gsrVal) * 0.008 + (Math.random() - 0.5) * 0.25 + Math.sin(t * 0.02) * 0.05;
      gsrVal = Math.max(0.5, Math.min(20, gsrVal));
      stressLevel = Math.round(Math.min(100, Math.max(0, (gsrVal - 2) / 16 * 100)));
      gsrData.push(gsrVal);
      if (gsrData.length > 600) gsrData.shift();

      const gd = $('gsrDisplay'), sg = $('statGSR'), ss = $('statStress');
      if (gd) gd.textContent = `GSR: ${gsrVal.toFixed(1)} \u00b5S | Stress: ${stressLevel}%`;
      if (sg) sg.textContent = gsrVal.toFixed(1);
      if (ss) ss.textContent = stressLevel;

      const sf = $('stressFill'), sl = $('stressLabel');
      if (sf) sf.style.width = stressLevel + '%';
      if (sl) sl.textContent = `Stress: ${stressLevel}%`;
    }

    drawGrid();
    drawGSRTrace();
    drawYAxis();
    drawStressMeter();
    drawKeyVisualizer();
    drawFingerProbe();

    // Noise particles
    if (gsrRunning) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(0,204,255,${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
      }
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn = $('startBtn'), stressBtn = $('stressBtn'), calmBtn = $('calmBtn'), genKeyBtn = $('genKeyBtn');

  if (startBtn) startBtn.onclick = () => {
    gsrRunning = !gsrRunning; setStatus(gsrRunning);
    const span = startBtn.querySelector('[data-i18n]'), s = LANG[currentLang];
    if (span) span.textContent = gsrRunning ? (s.stopGSR || 'Stop') : s.startGSR;
    log(gsrRunning ? s.gsrStarted : s.gsrStopped, 'info');
  };

  if (stressBtn) stressBtn.onclick = () => { gsrMode = 'stress'; stressBtn.classList.add('active'); if (calmBtn) calmBtn.classList.remove('active'); log('Mode: Stress simulation', 'info'); playSound('click'); };
  if (calmBtn) calmBtn.onclick = () => { gsrMode = 'calm'; calmBtn.classList.add('active'); if (stressBtn) stressBtn.classList.remove('active'); log('Mode: Calm/relaxed', 'info'); playSound('click'); };

  if (genKeyBtn) genKeyBtn.onclick = () => {
    const s = LANG[currentLang];
    if (gsrData.length < 50) { log(s.needData, 'error'); return; }
    const keyBytes = [];
    for (let i = 0; i < 32; i++) {
      const idx = Math.floor(Math.random() * gsrData.length);
      const lsb = Math.round(gsrData[idx] * 1000) & 0xFF;
      const lsb2 = Math.round(gsrData[(idx + 7) % gsrData.length] * 1000) & 0xFF;
      const lsb3 = Math.round(gsrData[(idx + 13) % gsrData.length] * 1000) & 0xFF;
      keyBytes.push((lsb ^ lsb2 ^ (lsb3 >> 1)) & 0xFF);
    }
    const hex = keyBytes.map(b => b.toString(16).padStart(2, '0')).join('');
    const out = $('keyOutput');
    if (out) out.textContent = hex;
    keysGen++;
    const se = $('statEntropy'), sk = $('statKeys');
    if (se) se.textContent = keyBytes.length * 8;
    if (sk) sk.textContent = keysGen;
    log(`${s.keyGenerated}: ${hex.slice(0, 32)}... (256 bits)`, 'success');
    showToast(`${s.keyGenerated}! 256 bits`, 1500);
    sendAppMessage('key-generated', { bits: 256 });
  };
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ GALVANIC SKIN KEY ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootGSRViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(0,204,255,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- state --- */
    var gsrBuffer=new Float32Array(W);
    var scrBuffer=new Float32Array(W); /* skin conductance response */
    var stressLevel2=30;
    var entropyPool=[];var MAX_POOL=256;
    var keyHistory=[];var MAX_KEYS=5;
    var arousalLevel=0.3;
    var eda_tonic=4.5; /* tonic level (SCL) */
    var eda_phasic=0;  /* phasic (SCR) */
    var spectrogramData=[];var MAX_SPEC=60;
    var autoStress=true,stressWave=0;
    var keyBits=[];
    var gsrMode2='normal';
    var modeTimer=0;

    /* --- hand diagram with electrode positions --- */
    function drawHand(ox,oy,w,h,conductance){
      /* palm outline */
      ctx.strokeStyle='rgba(0,204,255,'+(0.2+conductance*0.02)+')';ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(ox+w*0.3,oy+h*0.1);
      /* fingers */
      ctx.lineTo(ox+w*0.22,oy-h*0.15);ctx.lineTo(ox+w*0.18,oy-h*0.15);ctx.lineTo(ox+w*0.20,oy+h*0.08);
      ctx.lineTo(ox+w*0.12,oy-h*0.20);ctx.lineTo(ox+w*0.08,oy-h*0.18);ctx.lineTo(ox+w*0.12,oy+h*0.05);
      ctx.lineTo(ox+w*0.05,oy-h*0.10);ctx.lineTo(ox+w*0.01,oy-h*0.07);ctx.lineTo(ox+w*0.08,oy+h*0.12);
      ctx.lineTo(ox+w*0.01,oy+h*0.05);ctx.lineTo(ox-w*0.02,oy+h*0.10);ctx.lineTo(ox+w*0.05,oy+h*0.20);
      /* palm */
      ctx.lineTo(ox+w*0.02,oy+h*0.55);ctx.lineTo(ox+w*0.08,oy+h*0.70);
      ctx.lineTo(ox+w*0.25,oy+h*0.72);ctx.lineTo(ox+w*0.35,oy+h*0.55);
      ctx.closePath();ctx.stroke();

      /* palm fill with conductance glow */
      ctx.fillStyle='rgba(0,204,255,'+(0.02+conductance*0.008)+')';ctx.fill();

      /* electrode positions */
      var e1x=ox+w*0.10,e1y=oy+h*0.35;
      var e2x=ox+w*0.28,e2y=oy+h*0.35;

      /* electrode A (red) */
      ctx.beginPath();ctx.arc(e1x,e1y,6,0,Math.PI*2);
      ctx.fillStyle='rgba(255,50,50,'+(0.5+Math.sin(t*3)*0.2)+')';ctx.fill();
      ctx.strokeStyle='#ff3333';ctx.lineWidth=1;ctx.stroke();

      /* electrode B (green) */
      ctx.beginPath();ctx.arc(e2x,e2y,6,0,Math.PI*2);
      ctx.fillStyle='rgba(50,255,50,'+(0.5+Math.sin(t*3+1)*0.2)+')';ctx.fill();
      ctx.strokeStyle='#33ff33';ctx.lineWidth=1;ctx.stroke();

      /* sweat droplets animation */
      if(stressLevel2>40){
        for(var d=0;d<3;d++){
          var dx=ox+w*0.05+Math.random()*w*0.25;
          var dy=oy+h*0.1+Math.random()*h*0.4;
          var ds=1+Math.random()*2;
          ctx.beginPath();ctx.arc(dx,dy,ds,0,Math.PI*2);
          ctx.fillStyle='rgba(0,204,255,'+(0.1+Math.random()*0.15)+')';ctx.fill();
        }
      }

      /* current flow arrow */
      ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(e1x+8,e1y);ctx.lineTo(e2x-8,e2y);ctx.stroke();ctx.setLineDash([]);
      var arrowX=(e1x+e2x)/2,arrowY=e1y-8;
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText('I = '+(conductance*0.1).toFixed(1)+'\u00b5A',arrowX,arrowY);ctx.textAlign='left';

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('ELECTRODE PLACEMENT',ox-10,oy-h*0.22);
    }

    /* --- draw entropy visualization --- */
    function drawEntropyViz(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('ENTROPY POOL ('+entropyPool.length+'/'+MAX_POOL+')',ox+5,oy+12);

      /* colored squares */
      var sqSize=5;
      var cols=Math.floor((w-10)/(sqSize+1));
      var rows=Math.floor((h-25)/(sqSize+1));
      for(var i=0;i<entropyPool.length&&i<cols*rows;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var val=entropyPool[i];
        var hue2=val/255*360;
        ctx.fillStyle='hsla('+hue2+',70%,50%,0.8)';
        ctx.fillRect(ox+5+col*(sqSize+1),oy+18+row*(sqSize+1),sqSize,sqSize);
      }

      /* progress bar */
      var progY=oy+h-8;
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(ox+5,progY,w-10,5);
      ctx.fillStyle=entropyPool.length>=MAX_POOL?'#33ff33':'#00ccff';
      ctx.fillRect(ox+5,progY,(w-10)*entropyPool.length/MAX_POOL,5);
    }

    /* --- draw key history --- */
    function drawKeyHistory(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('GENERATED KEYS',ox+5,oy+12);

      keyHistory.forEach(function(k,i){
        var ky=oy+24+i*28;
        if(ky+20>oy+h)return;
        ctx.fillStyle='rgba(0,204,255,0.6)';ctx.font='7px monospace';
        ctx.fillText('#'+(i+1)+': '+k.hex.substring(0,32)+'...',ox+5,ky);
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='6px Orbitron,monospace';
        ctx.fillText(k.bits+' bits | entropy: '+k.entropy.toFixed(1),ox+5,ky+12);
        /* mini bit visualization */
        for(var bi=0;bi<Math.min(32,k.bits/8);bi++){
          var bval=parseInt(k.hex.substring(bi*2,bi*2+2),16);
          ctx.fillStyle='hsla('+(bval/255*180)+',60%,50%,0.5)';
          ctx.fillRect(ox+w-40-bi*3,ky-4,2,10);
        }
      });
    }

    /* --- draw GSR spectrogram --- */
    function drawGSRSpectrogram(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('EDA SPECTROGRAM (0-2Hz)',ox+5,oy+12);

      var cellW=w/32,cellH=(h-16)/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col2=0;col2<32;col2++){
          var v=spectrogramData[row][col2];
          ctx.fillStyle='rgb('+(Math.min(255,v*500)|0)+','+(Math.min(255,Math.max(0,(v-0.2)*600))|0)+','+(Math.max(0,(0.5-v)*300)|0)+')';
          ctx.fillRect(ox+col2*cellW,oy+16+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
    }

    /* --- generate crypto key from pool --- */
    function generateKey(){
      if(entropyPool.length<32)return;
      var keyBytes=[];
      for(var i=0;i<32;i++){
        var b1=entropyPool[i%entropyPool.length];
        var b2=entropyPool[(i*7+3)%entropyPool.length];
        var b3=entropyPool[(i*13+11)%entropyPool.length];
        keyBytes.push((b1^b2^(b3>>1))&0xFF);
      }
      var hex=keyBytes.map(function(b){return b.toString(16).padStart(2,'0');}).join('');

      /* calc entropy */
      var counts={};keyBytes.forEach(function(v2){counts[v2]=(counts[v2]||0)+1;});
      var ent=0,n=keyBytes.length;
      Object.values(counts).forEach(function(c){var p=c/n;ent-=p*Math.log2(p);});

      keyHistory.unshift({hex:hex,bits:256,entropy:ent});
      if(keyHistory.length>MAX_KEYS)keyHistory.pop();
      keyBits=keyBytes;
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto stress cycling */
      modeTimer+=0.016;
      if(modeTimer>8){modeTimer=0;gsrMode2=gsrMode2==='calm'?'stress':'calm';}
      stressWave=gsrMode2==='stress'?0.7:0.2;

      /* simulate GSR */
      arousalLevel+=(stressWave-arousalLevel)*0.01+(Math.random()-0.5)*0.02;
      arousalLevel=Math.max(0,Math.min(1,arousalLevel));
      eda_tonic=3+arousalLevel*10+Math.sin(t*0.05)*0.5;
      eda_phasic=Math.random()<0.05?arousalLevel*3*(1+Math.random()):eda_phasic*0.95;
      var gsrVal2=eda_tonic+eda_phasic+(Math.random()-0.5)*0.2;
      gsrVal2=Math.max(0.5,Math.min(20,gsrVal2));
      stressLevel2=Math.round(Math.min(100,Math.max(0,(gsrVal2-2)/16*100)));

      /* shift buffers */
      for(var i=0;i<W-1;i++){gsrBuffer[i]=gsrBuffer[i+1];scrBuffer[i]=scrBuffer[i+1];}
      gsrBuffer[W-1]=gsrVal2;
      scrBuffer[W-1]=eda_phasic;

      /* entropy collection */
      var lsb=(Math.round(gsrVal2*1000))&0xFF;
      entropyPool.push(lsb);if(entropyPool.length>MAX_POOL)entropyPool.shift();

      /* auto key generation every 200 samples */
      if(entropyPool.length>=MAX_POOL&&t%3<0.02)generateKey();

      /* spectrogram row */
      var specRow=[];
      for(var sb=0;sb<32;sb++){
        var freq2=sb*2/32;var amp2=0.02;
        amp2+=Math.exp(-(freq2-0.3)*(freq2-0.3)/0.05)*arousalLevel*0.5;
        amp2+=Math.exp(-(freq2-0.8)*(freq2-0.8)/0.1)*eda_phasic*0.3;
        amp2+=Math.random()*0.02;
        specRow.push(Math.min(1,amp2));
      }
      spectrogramData.push(specRow);if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      /* ---- LAYOUT ---- */

      /* Top: GSR trace */
      var traceH=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,0,W,traceH);
      /* tonic baseline */
      ctx.beginPath();ctx.strokeStyle='rgba(0,204,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([4,8]);
      var baseY=traceH-eda_tonic/20*(traceH-10)-5;
      ctx.moveTo(0,baseY);ctx.lineTo(W,baseY);ctx.stroke();ctx.setLineDash([]);
      /* GSR trace */
      ctx.beginPath();ctx.strokeStyle='#00ccff';ctx.lineWidth=2;ctx.shadowColor='#00ccff';ctx.shadowBlur=6;
      for(var i2=0;i2<W;i2++){
        var y=traceH-gsrBuffer[i2]/20*(traceH-10)-5;
        if(i2===0)ctx.moveTo(i2,y);else ctx.lineTo(i2,y);
      }
      ctx.stroke();ctx.shadowBlur=0;
      /* SCR overlay */
      ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1;
      for(var i3=0;i3<W;i3++){
        var y2=traceH-scrBuffer[i3]/5*(traceH*0.3)-5;
        if(i3===0)ctx.moveTo(i3,y2);else ctx.lineTo(i3,y2);
      }
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('ELECTRODERMAL ACTIVITY (EDA)',5,12);
      ctx.fillStyle='#00ccff';ctx.fillText('SCL: '+eda_tonic.toFixed(1)+'\u00b5S',5,traceH-5);
      ctx.fillStyle='#ff6633';ctx.fillText('SCR: '+eda_phasic.toFixed(2)+'\u00b5S',120,traceH-5);
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillText('0\u00b5S',W-30,traceH-5);ctx.fillText('20\u00b5S',W-35,14);

      /* Middle-left: Hand diagram */
      var handOX=100,handOY=traceH+80,handW=120,handH=160;
      drawHand(handOX,handOY,handW,handH,gsrVal2);

      /* Middle-center: Entropy pool */
      drawEntropyViz(W*0.32,traceH+8,W*0.33,H*0.28);

      /* Middle-right: Spectrogram */
      drawGSRSpectrogram(W*0.66,traceH+8,W*0.34-5,H*0.28);

      /* Bottom-left: Key history */
      drawKeyHistory(0,traceH+H*0.30+12,W*0.50,H*0.28);

      /* Bottom-right: Stats & stress meter */
      var stX=W*0.52,stY=traceH+H*0.30+12,stW=W*0.48-5,stH=H*0.28;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(stX,stY,stW,stH);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('BIOMETRIC CRYPTO METRICS',stX+10,stY+14);

      /* stress meter */
      var meterY=stY+22;
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(stX+10,meterY,stW-20,12);
      var sg=ctx.createLinearGradient(stX+10,0,stX+stW-10,0);
      sg.addColorStop(0,'#33ff33');sg.addColorStop(0.5,'#ffcc00');sg.addColorStop(1,'#ff3333');
      ctx.fillStyle=sg;ctx.fillRect(stX+10,meterY,(stW-20)*stressLevel2/100,12);
      ctx.fillStyle='#fff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText('Arousal: '+stressLevel2+'%',stX+stW/2,meterY+10);ctx.textAlign='left';

      var stats4=[
        ['GSR Value',gsrVal2.toFixed(1)+' \u00b5S'],
        ['Tonic (SCL)',eda_tonic.toFixed(1)+' \u00b5S'],
        ['Phasic (SCR)',eda_phasic.toFixed(2)+' \u00b5S'],
        ['Entropy Pool',entropyPool.length+'/'+MAX_POOL],
        ['Keys Generated',keyHistory.length.toString()],
        ['Mode',gsrMode2.toUpperCase()],
        ['Key Size','256 bits'],
        ['LSB Byte','0x'+(lsb<16?'0':'')+lsb.toString(16)]
      ];
      stats4.forEach(function(s,si){
        var sx=stX+10+(si%2)*stW*0.48;
        var sy=stY+48+Math.floor(si/2)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(s[0]+':',sx,sy);
        ctx.fillStyle='#00ccff';ctx.fillText(s[1],sx+85,sy);
      });

      /* Very bottom: Key bit visualization */
      var kbY=H-30;
      ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(0,kbY,W,30);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('LAST KEY BITS:',5,kbY+12);
      if(keyBits.length>0){
        for(var kb=0;kb<Math.min(keyBits.length,64);kb++){
          var kx=75+kb*(W-85)/64;
          var kh=keyBits[kb]/255*18;
          ctx.fillStyle='hsla('+(keyBits[kb]/255*180)+',60%,50%,0.7)';
          ctx.fillRect(kx,kbY+22-kh,Math.max(1,(W-85)/64-1),kh);
        }
      }

      /* HUD */
      ctx.strokeStyle='rgba(0,204,255,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl4=18;ctx.strokeStyle='rgba(0,204,255,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl4);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl4,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(0,204,255,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('GSR',W-55,17);

      requestAnimationFrame(frame);
    }

    cvs.addEventListener('click',function(){
      gsrMode2=gsrMode2==='calm'?'stress':'calm';modeTimer=0;
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootGSRViz);
  else setTimeout(bootGSRViz,200);
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
