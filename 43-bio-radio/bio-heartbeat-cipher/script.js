/**
 * Workshop DIY — Bio Heartbeat Cipher v1.0
 * Heartbeat R-R intervals as one-time pad encryption
 * Self-contained: i18n · framework · simulation
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click':
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08); break;
    case 'success':
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
    case 'heartbeat':
      osc.frequency.value = 60; osc.type = 'sine';
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t); osc.stop(t + 0.15);
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.connect(gain3); gain3.connect(audioCtx.destination);
      osc3.frequency.value = 80; osc3.type = 'sine';
      gain3.gain.value = 0.06;
      gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc3.start(t + 0.12); osc3.stop(t + 0.3); break;
    case 'encrypt':
      osc.frequency.value = 440; osc.type = 'sawtooth';
      gain.gain.value = 0.04;
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t); osc.stop(t + 0.2); break;
  }
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
    title: 'Bio Heartbeat Cipher',
    subtitle: 'Your heartbeat encrypts messages',
    disconnected: 'Disconnected',
    connected: 'Connected',
    mainSection: 'Heartbeat Cipher \u2014 OTP Encryption',
    mainDesc: 'R-R intervals generate one-time pad keys',
    sectionA: 'A \u2014 How It Works',
    sectionC: 'C \u2014 Challenges',
    startHeart: 'Start Heartbeat',
    stopHeart: 'Stop',
    genKey: 'Generate Key',
    encryptBtn: 'Encrypt',
    decryptBtn: 'Decrypt',
    statRR: 'R-R',
    statEntropy: 'bits entropy',
    statKeys: 'keys',
    step1Title: 'Heartbeat Sensing',
    step1Desc: 'micro:bit detects heartbeat via pulse sensor. Each beat\'s R-R interval is unique and unpredictable.',
    step2Title: 'R-R Extraction',
    step2Desc: 'Heart rate variability (HRV) provides true biological randomness from the autonomic nervous system.',
    step3Title: 'OTP Key Generation',
    step3Desc: 'R-R intervals are hashed and mixed to create one-time pad keys with high entropy.',
    step4Title: 'XOR Encryption',
    step4Desc: 'Message XOR key = ciphertext. The key is never reused, providing perfect secrecy.',
    ch1Title: 'Entropy Test',
    ch1Desc: 'Generate 10 keys. Are they all unique? Check by comparing hex strings.',
    ch2Title: 'Exercise Effect',
    ch2Desc: 'Faster heartbeat = more or less entropy? Think about HRV changes during exercise.',
    ch3Title: 'Perfect Secrecy',
    ch3Desc: 'Encrypt the same message twice with different keys. The ciphertexts should look completely different!',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "A \u2014 How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_otp_title: '\ud83d\udd11 One-Time Pad',
    wiki_otp: 'Random key XOR message produces ciphertext. Proven unbreakable by Claude Shannon in 1949. Key must never be reused.',
    wiki_hrv_title: '\ud83d\udc93 Heart Rate Variability',
    wiki_hrv: 'HRV measures variation between consecutive heartbeats. Influenced by the autonomic nervous system, it contains genuine biological entropy.',
    wiki_xor_title: '\u26a1 XOR Cipher',
    wiki_xor: 'XOR (exclusive or) flips bits using the key. Same operation encrypts and decrypts: plaintext XOR key = cipher, cipher XOR key = plaintext.',
    activityLog: 'Activity Log',
    eventsMsg: 'Events & messages',
    clear: 'Clear',
    copy: 'Copy',
    export: 'Export',
    filterAll: 'All',
    settings: '\u2699\ufe0f Settings',
    language: 'Language',
    theme: 'Theme',
    help: '\u2753 Help',
    faq: 'FAQ',
    howto: 'How-To',
    wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects',
    whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide',
    dhikrTap: 'Tap',
    musicMode: 'Music reactive',
    splashHint: 'tap to skip',
    working: 'Working\u2026',
    msgPlaceholder: 'Type secret message...',
    cipherPlaceholder: 'Encrypted output appears here...',
    t_mosque: 'Mosque',
    t_zellige: 'Zellige',
    t_andalus: 'Andalus',
    t_riad: 'Riad',
    t_medina: 'Medina',
    t_space: 'Space',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\u2764 Heartbeat Cipher ready \u2014 start your pulse!',
    logCleared: 'Log cleared',
    copied: 'Copied!',
    copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English',
    themeChanged: '\ud83c\udfa8 Theme \u2192',
    needBeats: 'Need at least 8 heartbeats for key generation',
    keyGenerated: 'Key generated',
    enterMsg: 'Enter a message first',
    needKey: 'Generate a key first',
    encrypted: 'Encrypted',
    decrypted: 'Decrypted',
    heartStarted: 'Heartbeat simulation started',
    heartStopped: 'Heartbeat stopped',
    beatDetected: 'Beat detected',sectionCode:'Device Code',faq_q1:'What is Bio Heartbeat Cipher?',faq_a1:'Bio Heartbeat Cipher lets you r-r intervals generate one-time pad keys. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start Heartbeat to begin collecting R-R intervals. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u0645\u0641\u062a\u0627\u062d \u0639\u0634\u0648\u0627\u0626\u064a XOR \u0631\u0633\u0627\u0644\u0629 = \u0646\u0635 \u0645\u0634\u0641\u0631. \u0623\u062b\u0628\u062a \u0634\u0627\u0646\u0648\u0646 \u0639\u062f\u0645 \u0642\u0627\u0628\u0644\u064a\u062a\u0647 \u0644\u0644\u0643\u0633\u0631 1949.',faq_q5:'What should I experiment with?',faq_a5:'Generate 10 keys. Are they all unique? Check by comparing hex strings.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:' + ',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Heartbeat Cipher! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start Heartbeat to begin collecting R-R intervals. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how biomedical signals works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Bio Heartbeat Cipher: R-R intervals generate one-time pad keys. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Heartbeat Sensing through R-R Extraction to OTP Key Generation and XOR Encryption.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'The field of bioelectronics has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed bioelectronics by enabling software-defined approaches. Modern practitioners use tools like biosensors to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Heartbeat Cipher',
    wiki_math: 'The mathematics underpinning heartbeat cipher involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Signal',
    gloss1_def: 'A varying quantity (voltage, electromagnetic wave, or data stream) that carries information. In this simulation, signals are represented visually so you can see how they change over time and respond to your controls.',
    gloss2_term: 'Parameter',
    gloss2_def: 'A configurable value that changes system behavior. Each slider and input in this app controls a specific parameter. Changing parameters lets you explore cause-and-effect relationships in the simulation.',
    gloss3_term: 'Simulation',
    gloss3_def: 'A software model that mimics real-world behavior. This app simulates real equipment and processes so you can learn safely without hardware. The physics and mathematics are real — only the signals are virtual.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules that defines how data is formatted, transmitted, and received. Protocols ensure that different devices can communicate. Examples include WiFi (802.11), Bluetooth, HTTP, and TCP/IP.',
    gloss5_term: 'Frequency',
    gloss5_def: 'The number of cycles a signal completes per second, measured in Hertz (Hz). Higher frequencies carry more data but travel shorter distances. Radio frequencies range from 3 kHz to 300 GHz.',
    gloss6_term: 'Encryption',
    gloss6_def: 'The process of converting readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and a key. Only someone with the correct key can decrypt and read the original data.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Understanding the theory behind heartbeat cipher requires grasping several interconnected concepts from bioelectronics. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Bio Chiffre Cardiaque',
    subtitle: 'Votre battement chiffre les messages',
    disconnected: 'D\u00e9connect\u00e9',
    connected: 'Connect\u00e9',
    mainSection: 'Chiffre Cardiaque \u2014 Chiffrement OTP',
    mainDesc: 'Les intervalles R-R g\u00e9n\u00e8rent des cl\u00e9s OTP',
    sectionA: 'A \u2014 Comment \u00e7a marche',
    sectionC: 'C \u2014 D\u00e9fis',
    startHeart: 'D\u00e9marrer Pouls',
    stopHeart: 'Arr\u00eat',
    genKey: 'G\u00e9n\u00e9rer Cl\u00e9',
    encryptBtn: 'Chiffrer',
    decryptBtn: 'D\u00e9chiffrer',
    statRR: 'R-R',
    statEntropy: 'bits entropie',
    statKeys: 'cl\u00e9s',
    step1Title: 'D\u00e9tection Cardiaque',
    step1Desc: 'Le micro:bit d\u00e9tecte le pouls. Chaque intervalle R-R est unique et impr\u00e9visible.',
    step2Title: 'Extraction R-R',
    step2Desc: 'La variabilit\u00e9 cardiaque (VFC) fournit un hasard biologique du syst\u00e8me nerveux autonome.',
    step3Title: 'G\u00e9n\u00e9ration Cl\u00e9 OTP',
    step3Desc: 'Les intervalles R-R sont hach\u00e9s pour cr\u00e9er des cl\u00e9s OTP de haute entropie.',
    step4Title: 'Chiffrement XOR',
    step4Desc: 'Message XOR cl\u00e9 = texte chiffr\u00e9. La cl\u00e9 n\'est jamais r\u00e9utilis\u00e9e.',
    ch1Title: 'Test d\'Entropie',
    ch1Desc: 'G\u00e9n\u00e9rez 10 cl\u00e9s. Sont-elles toutes uniques?',
    ch2Title: 'Effet Exercice',
    ch2Desc: 'Battement plus rapide = plus ou moins d\'entropie?',
    ch3Title: 'Secret Parfait',
    ch3Desc: 'Chiffrez le m\u00eame message deux fois avec des cl\u00e9s diff\u00e9rentes.' + 'est une d\u00e9monstration. Le concept montre comment le hasard biologique peut g\u00e9n\u00e9rer des cl\u00e9s.',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_otp_title: '\ud83d\udd11 Masque Jetable',
    wiki_otp: 'Cl\u00e9 al\u00e9atoire XOR message = texte chiffr\u00e9. Prouv\u00e9 inviolable par Shannon 1949.',
    wiki_hrv_title: '\ud83d\udc93 Variabilit\u00e9 Cardiaque',
    wiki_hrv: 'La VFC mesure la variation entre battements. Elle contient une entropie biologique r\u00e9elle.',
    wiki_xor_title: '\u26a1 Chiffre XOR',
    wiki_xor: 'XOR (ou exclusif) inverse les bits. M\u00eame op\u00e9ration pour chiffrer et d\u00e9chiffrer.',
    activityLog: 'Journal',
    eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer',
    copy: 'Copier',
    export: 'Exporter',
    filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres',
    language: 'Langue',
    theme: 'Th\u00e8me',
    help: '\u2753 Aide',
    faq: 'FAQ',
    howto: 'Guide',
    wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores',
    whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire',
    dhikrTap: 'Tap',
    musicMode: 'R\u00e9actif musique',
    splashHint: 'appuyer pour passer',
    working: 'En cours\u2026',
    msgPlaceholder: 'Tapez un message secret...',
    cipherPlaceholder: 'Le texte chiffr\u00e9 appara\u00eet ici...',
    t_mosque: 'Mosqu\u00e9e',
    t_zellige: 'Zellige',
    t_andalus: 'Andalous',
    t_riad: 'Riad',
    t_medina: 'M\u00e9dina',
    t_space: 'Espace',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\u2764 Chiffre cardiaque pr\u00eat \u2014 d\u00e9marrez votre pouls!',
    logCleared: 'Journal effac\u00e9',
    copied: 'Copi\u00e9!',
    copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais',
    themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    needBeats: 'Il faut au moins 8 battements',
    keyGenerated: 'Cl\u00e9 g\u00e9n\u00e9r\u00e9e',
    enterMsg: 'Entrez un message d\'abord',
    needKey: 'G\u00e9n\u00e9rez une cl\u00e9 d\'abord',
    encrypted: 'Chiffr\u00e9',
    decrypted: 'D\u00e9chiffr\u00e9',
    heartStarted: 'Simulation cardiaque d\u00e9marr\u00e9e',
    heartStopped: 'Pouls arr\u00eat\u00e9',
    beatDetected: 'Battement d\u00e9tect\u00e9',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Bio Heartbeat Cipher ?',faq_a1:'Bio Heartbeat Cipher te permet de simuler signaux biomédicaux. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de signaux biomédicaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de signaux biomédicaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:' + ',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de signaux biomédicaux.',demo_s1:'Bienvenue dans Bio Heartbeat Cipher ! Regarde l\'écran principal — c\'est ici que la simulation de signaux biomédicaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de signaux biomédicaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne signaux biomédicaux en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de signaux biomédicaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Bio Heartbeat Cipher : R-R intervals generate one-time pad keys. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'Le domaine de bioélectronique a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme biosensors pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Heartbeat Cipher',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Signal',
    gloss1_def: 'Une grandeur variable (tension, onde électromagnétique ou flux de données) qui transporte des informations. Dans cette simulation, les signaux sont représentés visuellement pour observer leurs changements.',
    gloss2_term: 'Paramètre',
    gloss2_def: 'Une valeur configurable qui modifie le comportement du système. Chaque curseur de cette app contrôle un paramètre spécifique. Modifier les paramètres permet d explorer les relations cause-effet.',
    gloss3_term: 'Simulation',
    gloss3_def: 'Un modèle logiciel qui imite le comportement réel. Cette app simule de vrais équipements pour apprendre en toute sécurité sans matériel. La physique et les mathématiques sont réelles — seuls les signaux sont virtuels.',
    gloss4_term: 'Protocole',
    gloss4_def: 'Un ensemble de règles définissant le format, la transmission et la réception des données. Les protocoles permettent la communication entre appareils différents. Exemples : WiFi, Bluetooth, HTTP, TCP/IP.',
    gloss5_term: 'Fréquence',
    gloss5_def: 'Le nombre de cycles qu un signal complète par seconde, mesuré en Hertz (Hz). Les fréquences plus élevées transportent plus de données mais parcourent de plus courtes distances.',
    gloss6_term: 'Chiffrement',
    gloss6_def: 'Le processus de conversion de données lisibles (texte clair) en format illisible (texte chiffré) à l aide d un algorithme mathématique et d une clé. Seule la bonne clé permet de déchiffrer.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de bioelectronics. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: '\u0634\u0641\u0631\u0629 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628',
    subtitle: '\u0646\u0628\u0636 \u0642\u0644\u0628\u0643 \u064a\u0634\u0641\u0631 \u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',
    connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0634\u0641\u0631\u0629 \u0627\u0644\u0642\u0644\u0628 \u2014 \u062a\u0634\u0641\u064a\u0631 OTP',
    mainDesc: '\u0641\u062a\u0631\u0627\u062a R-R \u062a\u0648\u0644\u062f \u0645\u0641\u0627\u062a\u064a\u062d OTP',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',
    sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startHeart: '\u0628\u062f\u0621 \u0627\u0644\u0646\u0628\u0636',
    stopHeart: '\u0625\u064a\u0642\u0627\u0641',
    genKey: '\u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d',
    encryptBtn: '\u062a\u0634\u0641\u064a\u0631',
    decryptBtn: '\u0641\u0643 \u062a\u0634\u0641\u064a\u0631',
    statRR: 'R-R',
    statEntropy: '\u0628\u062a \u0625\u0646\u062a\u0631\u0648\u0628\u064a',
    statKeys: '\u0645\u0641\u0627\u062a\u064a\u062d',
    step1Title: '\u0627\u0633\u062a\u0634\u0639\u0627\u0631 \u0627\u0644\u0646\u0628\u0636',
    step1Desc: '\u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0643\u0634\u0641 \u0627\u0644\u0646\u0628\u0636. \u0643\u0644 \u0641\u062a\u0631\u0629 R-R \u0641\u0631\u064a\u062f\u0629.',
    step2Title: '\u0627\u0633\u062a\u062e\u0631\u0627\u062c R-R',
    step2Desc: '\u062a\u063a\u064a\u0631 \u0645\u0639\u062f\u0644 \u0627\u0644\u0642\u0644\u0628 \u064a\u0648\u0641\u0631 \u0639\u0634\u0648\u0627\u0626\u064a\u0629 \u0628\u064a\u0648\u0644\u0648\u062c\u064a\u0629 \u062d\u0642\u064a\u0642\u064a\u0629.',
    step3Title: '\u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d OTP',
    step3Desc: '\u064a\u062a\u0645 \u062a\u062c\u0632\u0626\u0629 \u0641\u062a\u0631\u0627\u062a R-R \u0644\u0625\u0646\u0634\u0627\u0621 \u0645\u0641\u0627\u062a\u064a\u062d \u0639\u0627\u0644\u064a\u0629 \u0627\u0644\u0625\u0646\u062a\u0631\u0648\u0628\u064a.',
    step4Title: '\u062a\u0634\u0641\u064a\u0631 XOR',
    step4Desc: '\u0627\u0644\u0631\u0633\u0627\u0644\u0629 XOR \u0627\u0644\u0645\u0641\u062a\u0627\u062d = \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0634\u0641\u0631. \u0627\u0644\u0645\u0641\u062a\u0627\u062d \u0644\u0627 \u064a\u064f\u0639\u0627\u062f \u0627\u0633\u062a\u062e\u062f\u0627\u0645\u0647.',
    ch1Title: '\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0625\u0646\u062a\u0631\u0648\u0628\u064a',
    ch1Desc: '\u0648\u0644\u0651\u062f 10 \u0645\u0641\u0627\u062a\u064a\u062d. \u0647\u0644 \u0643\u0644\u0647\u0627 \u0641\u0631\u064a\u062f\u0629\u061f',
    ch2Title: '\u062a\u0623\u062b\u064a\u0631 \u0627\u0644\u062a\u0645\u0631\u064a\u0646',
    ch2Desc: '\u0646\u0628\u0636 \u0623\u0633\u0631\u0639 = \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u0623\u0643\u062b\u0631 \u0623\u0645 \u0623\u0642\u0644\u061f',
    ch3Title: '\u0627\u0644\u0633\u0631\u064a\u0629 \u0627\u0644\u062a\u0627\u0645\u0629',
    ch3Desc: '\u0634\u0641\u0651\u0631 \u0646\u0641\u0633 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0645\u0631\u062a\u064a\u0646 \u0628\u0645\u0641\u0627\u062a\u064a\u062d \u0645\u062e\u062a\u0644\u0641\u0629.',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_otp_title: '\ud83d\udd11 \u0627\u0644\u0642\u0646\u0627\u0639 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0644\u0645\u0631\u0629',
    wiki_otp: '\u0645\u0641\u062a\u0627\u062d \u0639\u0634\u0648\u0627\u0626\u064a XOR \u0631\u0633\u0627\u0644\u0629 = \u0646\u0635 \u0645\u0634\u0641\u0631. \u0623\u062b\u0628\u062a \u0634\u0627\u0646\u0648\u0646 \u0639\u062f\u0645 \u0642\u0627\u0628\u0644\u064a\u062a\u0647 \u0644\u0644\u0643\u0633\u0631 1949.',
    wiki_hrv_title: '\ud83d\udc93 \u062a\u063a\u064a\u0631 \u0645\u0639\u062f\u0644 \u0627\u0644\u0642\u0644\u0628',
    wiki_hrv: '\u064a\u0642\u064a\u0633 \u0627\u0644\u062a\u063a\u064a\u0631 \u0628\u064a\u0646 \u0627\u0644\u0646\u0628\u0636\u0627\u062a \u0627\u0644\u0645\u062a\u062a\u0627\u0644\u064a\u0629. \u064a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u0628\u064a\u0648\u0644\u0648\u062c\u064a.',
    wiki_xor_title: '\u26a1 \u062a\u0634\u0641\u064a\u0631 XOR',
    wiki_xor: 'XOR \u064a\u0639\u0643\u0633 \u0627\u0644\u0628\u062a\u0627\u062a. \u0646\u0641\u0633 \u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u0644\u0644\u062a\u0634\u0641\u064a\u0631 \u0648\u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',
    eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear: '\u0645\u0633\u062d',
    copy: '\u0646\u0633\u062e',
    export: '\u062a\u0635\u062f\u064a\u0631',
    filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',
    language: '\u0627\u0644\u0644\u063a\u0629',
    theme: '\u0627\u0644\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',
    faq: '\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629',
    howto: '\u062f\u0644\u064a\u0644',
    wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',
    whisperMode: '\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633',
    breathingGuide: '\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',
    dhikrTap: '\u0627\u0636\u063a\u0637',
    musicMode: '\u062a\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064a\u0642\u064a',
    splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',
    working: '\u062c\u0627\u0631\u064d\u2026',
    msgPlaceholder: '\u0627\u0643\u062a\u0628 \u0631\u0633\u0627\u0644\u0629 \u0633\u0631\u064a\u0629...',
    cipherPlaceholder: '\u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0634\u0641\u0631 \u064a\u0638\u0647\u0631 \u0647\u0646\u0627...',
    t_mosque: '\u0645\u0633\u062c\u062f',
    t_zellige: '\u0632\u0644\u064a\u062c',
    t_andalus: '\u0623\u0646\u062f\u0644\u0633',
    t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629',
    t_space: '\u0641\u0636\u0627\u0621',
    t_jungle: '\u0623\u062f\u063a\u0627\u0644',
    t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\u2764 \u0634\u0641\u0631\u0629 \u0627\u0644\u0642\u0644\u0628 \u062c\u0627\u0647\u0632\u0629 \u2014 \u0627\u0628\u062f\u0623 \u0646\u0628\u0636\u0643!',
    logCleared: '\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644',
    copied: '\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',
    copyFail: '\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062e',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    needBeats: '\u064a\u0644\u0632\u0645 8 \u0646\u0628\u0636\u0627\u062a \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644',
    keyGenerated: '\u062a\u0645 \u062a\u0648\u0644\u064a\u062f \u0627\u0644\u0645\u0641\u062a\u0627\u062d',
    enterMsg: '\u0623\u062f\u062e\u0644 \u0631\u0633\u0627\u0644\u0629 \u0623\u0648\u0644\u0627\u064b',
    needKey: '\u0648\u0644\u0651\u062f \u0645\u0641\u062a\u0627\u062d\u064b\u0627 \u0623\u0648\u0644\u0627\u064b',
    encrypted: '\u062a\u0645 \u0627\u0644\u062a\u0634\u0641\u064a\u0631',
    decrypted: '\u062a\u0645 \u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631',
    heartStarted: '\u0628\u062f\u0623\u062a \u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u0646\u0628\u0636',
    heartStopped: '\u062a\u0648\u0642\u0641 \u0627\u0644\u0646\u0628\u0636',
    beatDetected: '\u062a\u0645 \u0643\u0634\u0641 \u0646\u0628\u0636\u0629',sectionCode:'كود الجهاز',faq_q1:'ما هو Bio Heartbeat Cipher؟',faq_a1:'Bio Heartbeat Cipher يتيح لك محاكاة الإشارات الطبية الحيوية. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الإشارات الطبية الحيوية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الإشارات الطبية الحيوية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الإشارات الطبية الحيوية.',demo_s1:'مرحباً في Bio Heartbeat Cipher! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الإشارات الطبية الحيوية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالإشارات الطبية الحيوية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل الإشارات الطبية الحيوية من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الإشارات الطبية الحيوية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Bio Heartbeat Cipher: R-R intervals generate one-time pad keys. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'تطور مجال الإلكترونيات الحيوية بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل biosensors لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Heartbeat Cipher',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'إشارة',
    gloss1_def: 'كمية متغيرة (جهد كهربائي أو موجة كهرومغناطيسية أو تدفق بيانات) تحمل معلومات. في هذه المحاكاة، تُمثل الإشارات بصرياً لمراقبة تغيراتها مع الوقت.',
    gloss2_term: 'معامل',
    gloss2_def: 'قيمة قابلة للتكوين تغير سلوك النظام. كل شريط تمرير في هذا التطبيق يتحكم في معامل محدد. تغيير المعاملات يتيح لك استكشاف علاقات السبب والنتيجة.',
    gloss3_term: 'محاكاة',
    gloss3_def: 'نموذج برمجي يحاكي السلوك الحقيقي. يحاكي هذا التطبيق معدات وعمليات حقيقية للتعلم بأمان بدون أجهزة. الفيزياء والرياضيات حقيقية — الإشارات فقط افتراضية.',
    gloss4_term: 'بروتوكول',
    gloss4_def: 'مجموعة قواعد تحدد كيفية تنسيق البيانات وإرسالها واستقبالها. تضمن البروتوكولات تواصل الأجهزة المختلفة. أمثلة: واي فاي وبلوتوث و HTTP و TCP/IP.',
    gloss5_term: 'تردد',
    gloss5_def: 'عدد الدورات التي تكملها إشارة في الثانية، يُقاس بالهرتز. الترددات الأعلى تحمل بيانات أكثر لكنها تنتقل لمسافات أقصر. تتراوح ترددات الراديو من 3 كيلوهرتز إلى 300 غيغاهرتز.',
    gloss6_term: 'تشفير',
    gloss6_def: 'عملية تحويل البيانات المقروءة (نص عادي) إلى صيغة غير مقروءة (نص مشفر) باستخدام خوارزمية رياضية ومفتاح. فقط من يملك المفتاح الصحيح يمكنه فك التشفير.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من bioelectronics. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

/* ═══════ LANGUAGE ═══════ */

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const k = el.dataset.i18nPlaceholder;
    if (s[k] != null) el.placeholder = s[k];
  });
  document.title = `${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523], 'zellige': [440, 523, 659], 'andalus': [294, 370, 440],
  'space': [523, 659, 784], 'jungle': [262, 330, 392], 'robot': [440, 554, 659],
  'riad': [349, 440, 523], 'medina': [294, 349, 440]
};

function playThemeMelody(name) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06;
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2);
  });
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;
const logHistory = [];
let typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); }
  logHistory.push({ msg, type, ts: Date.now() });
  applyLogFilter();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const text = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `heartbeat-cipher-log-${new Date().toISOString().slice(0, 10)}.txt`; a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLogFilter = btn.dataset.filter;
      applyLogFilter();
      playSound('click');
    });
  });
}

function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;

function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}

function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;

function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}

function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ UTILITIES ═══════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typewriterAppend(element, text) {
  element.classList.add('typing');
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

function calcHijriDate() {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  } catch { return ''; }
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630\u0623\u0624\u0626\u0625\u0621\u0629\u0649\u0622';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; }
  matrixRunning = true; canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1);
  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ MORSE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', ' ':'/'
};

let morseTimeout = null, morseActive = false;

function textToMorse(text) { return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' '); }

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, ''));
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(100); }
    else if (ch === '-') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(300); }
    else if (ch === '/') { await sleep(400); continue; }
    else if (ch === ' ') { await sleep(200); continue; }
    dot.style.background = orig; dot.style.boxShadow = ''; await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => { if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; } });
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null, musicActive = false, musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; });
    log('\ud83c\udfb5 Music mode off', 'info'); return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser(); musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser); musicActive = true;
    log('\ud83c\udfb5 Music mode on!', 'success');
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      bands.forEach((b, i) => { const v = i === 0 ? bass : treble; b.style.height = (2 + v * 10) + 'px'; b.style.opacity = 0.4 + v * 0.6; });
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => log('\ud83c\udfb5 Microphone access denied', 'error'));
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null, whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('\ud83c\udfa4 Speech not supported', 'error'); return; }
  if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('\ud83c\udfa4 Whisper mode off', 'info'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR(); recognition.continuous = true; recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) { const text = e.results[i][0].transcript.trim(); if (text) log(`\ud83c\udfa4 ${text}`, 'rx'); } } };
  recognition.onerror = e => log(`\ud83c\udfa4 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start(); whisperActive = true;
  log('\ud83c\udfa4 Whisper mode on \u2014 speak!', 'success');
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false, dhikrCount = 0;

function toggleBreathing() {
  breathingActive = !breathingActive;
  document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive));
  if (breathingActive) log('\ud83e\udec1 Breathing guide on', 'info');
  else { if (dhikrCount > 0) log(`\ud83d\udcff Dhikr count: ${dhikrCount}`, 'success'); dhikrCount = 0; log('\ud83e\udec1 Breathing guide off', 'info'); }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++; playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; });
  handle.addEventListener('touchstart', e => { dragging = true; startX = e.touches[0].clientX; startW = panel.offsetWidth; handle.classList.add('active'); e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', e => { if (!dragging) return; const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); }, { passive: true });
  document.addEventListener('touchend', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); });
  try { const saved = localStorage.getItem('wdiy-log-width'); if (saved) document.documentElement.style.setProperty('--log-width', saved); } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('open');
  if (sb) { const first = sb.querySelector(FOCUSABLE); if (first) first.focus(); }
}

function closePanel(panelId, overlayId, returnFocusId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  const btn = $(returnFocusId); if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }

let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); const btn = $('logBtn'); if (btn) btn.focus(); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const n = tab.dataset.tab;
      const target = $('help' + n.charAt(0).toUpperCase() + n.slice(1));
      if (target) target.classList.add('active');
    });
  });
}

function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id);
    if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
}

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
  try { const msg = { type, data, from: document.title, ts: Date.now() }; localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg)); localStorage.removeItem(APP_MSG_KEY); } catch {}
}

function onAppMessage(callback) {
  window.addEventListener('storage', e => { if (e.key !== APP_MSG_KEY || !e.newValue) return; try { callback(JSON.parse(e.newValue)); } catch {} });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; toggleMatrix(); log('\ud83d\udd79\ufe0f KONAMI CODE!', 'success'); } }
    else { konamiIdx = 0; }
  });
}

/* ═══════ LOGO TRACKER ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2), dy = (e.clientY - cy) / (innerHeight / 2);
    logo.style.transform = `perspective(200px) rotateX(${dy * 8}deg) rotateY(${-dx * 8}deg)`;
  });
}

/* ═══════ DEBUG PANEL ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel');
  if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, lastTime = performance.now();
  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      frames = 0; lastTime = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;
  if (exb) exb.onclick = exportLog;
  initLogFilters();

  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp;
  if (hClose) hClose.onclick = closeHelp;
  if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings;
  if (sClose) sClose.onclick = closeSettings;
  if (sOv) sOv.onclick = closeSettings;

  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog;
  if (lClose) lClose.onclick = closeLog;
  initLogResize();

  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); });
  }

  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

  const musicBtn = $('musicBtn');
  if (musicBtn) musicBtn.onclick = toggleMusicMode;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllPanels();
    if (e.key === 'Tab') trapFocus(e);
  });

  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  onAppMessage(msg => log(`\ud83d\udce8 ${msg.from}: ${msg.type}`, 'rx'));
  initKonami();
  initMorseLog();
  initDebug();
  initLogoTracker();

  const hd = $('hijriDate');
  if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }

  // Triple-click logo for matrix
  let logoClicks = 0, logoTimer = null;
  const logoEl = $('logoWrap');
  if (logoEl) {
    logoEl.style.cursor = 'pointer';
    logoEl.addEventListener('click', () => {
      logoClicks++;
      if (logoTimer) clearTimeout(logoTimer);
      if (logoClicks >= 3) { logoClicks = 0; toggleMatrix(); }
      else logoTimer = setTimeout(() => logoClicks = 0, 500);
    });
  }

  log(LANG[currentLang].ready, 'success');
  setTimeout(initHeartbeatApp, 50);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ HEARTBEAT CIPHER SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let heartAnim = null;
let heartRunning = false;
let rrIntervals = [];
let otpKey = [];
let keysGenerated = 0;
let bpm = 72;
let beatPhase = 0;
let ecgData = [];
let rrHistory = [];

function initHeartbeatApp() {
  const canvas = $('heartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width;
  const H = canvas.height;
  let t = 0;
  let lastBeatTime = 0;

  // Realistic ECG waveform generator
  function generateECG(phase) {
    const p = phase % 1;
    if (p < 0.04) return Math.sin(p / 0.04 * Math.PI) * 0.25; // P wave
    if (p < 0.08) return 0;
    if (p < 0.10) return -0.15; // Q dip
    if (p < 0.14) return Math.sin((p - 0.10) / 0.04 * Math.PI) * 1.0; // R peak
    if (p < 0.18) return -0.25; // S dip
    if (p < 0.22) return -0.25 * (1 - (p - 0.18) / 0.04); // S recovery
    if (p < 0.35) return Math.sin((p - 0.22) / 0.13 * Math.PI) * 0.18; // T wave
    if (p < 0.40) return Math.sin((p - 0.35) / 0.05 * Math.PI) * 0.05; // U wave (subtle)
    return 0;
  }

  // Draw heart icon that pulses
  function drawHeartIcon(ctx, cx, cy, size, glow) {
    ctx.save();
    const scale = 1 + glow * 0.15;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.4);
    ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.3);
    ctx.fillStyle = `rgba(255,51,102,${0.3 + glow * 0.7})`;
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = glow * 30;
    ctx.fill();
    ctx.restore();
  }

  // Draw grid background
  function drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // Major grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let x = 0; x < W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  // Draw ECG trace
  function drawECG(ctx) {
    if (ecgData.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 10;
    ecgData.forEach((v, i) => {
      const x = i;
      const y = H * 0.35 - v * H * 0.25;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Scan line
    if (heartRunning && ecgData.length > 0) {
      const scanX = ecgData.length - 1;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, H * 0.5);
      ctx.strokeStyle = 'rgba(255,51,102,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Draw R-R interval panel
  function drawRRPanel(ctx) {
    const px = W * 0.65;
    const py = 15;
    const pw = W * 0.33;
    const ph = 120;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(px, py, pw, ph);

    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 11px Orbitron';
    ctx.fillText('R-R Intervals (ms)', px + 10, py + 18);

    if (rrIntervals.length > 0) {
      const last12 = rrIntervals.slice(-12);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '9px Orbitron';
      last12.forEach((rr, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        ctx.fillText(`${rr}`, px + 10 + col * 55, py + 38 + row * 16);
      });

      // Mini R-R bar chart
      const barY = py + ph - 25;
      const barH = 20;
      const barW = pw / last12.length - 2;
      last12.forEach((rr, i) => {
        const norm = (rr - 600) / 600;
        const h = Math.max(3, norm * barH);
        const r = rr < 750 ? 255 : rr > 950 ? 100 : 200;
        const g = rr > 950 ? 255 : rr < 750 ? 100 : 200;
        ctx.fillStyle = `rgba(${r},${g},100,0.6)`;
        ctx.fillRect(px + 5 + i * (barW + 2), barY + barH - h, barW, h);
      });
    }
  }

  // Draw OTP key visualization
  function drawKeyDisplay(ctx) {
    if (otpKey.length === 0) return;
    const py = H * 0.58;
    const ph = H * 0.12;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, py, W - 20, ph);
    ctx.strokeStyle = 'rgba(51,255,51,0.2)';
    ctx.strokeRect(10, py, W - 20, ph);

    ctx.fillStyle = '#33ff33';
    ctx.font = 'bold 10px Orbitron';
    ctx.fillText('OTP KEY:', 20, py + 16);

    // Key bytes as colored blocks
    const blockW = Math.min(10, (W - 120) / otpKey.length);
    otpKey.forEach((b, i) => {
      if (i * blockW + 90 > W - 20) return;
      const hue = b / 255 * 120; // 0=red, 120=green
      ctx.fillStyle = `hsla(${hue},80%,50%,0.8)`;
      ctx.fillRect(90 + i * blockW, py + 5, blockW - 1, ph - 10);
    });

    // Hex string below
    ctx.fillStyle = 'rgba(51,255,51,0.7)';
    ctx.font = '8px Orbitron';
    const hexStr = otpKey.map(b => b.toString(16).padStart(2, '0')).join(' ');
    ctx.fillText(hexStr.slice(0, Math.floor((W - 40) / 6)), 20, py + ph + 12);
  }

  // Draw entropy meter
  function drawEntropyMeter(ctx) {
    const mx = 15;
    const my = H * 0.75;
    const mw = W * 0.4;
    const mh = 30;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(mx, my, mw, mh);

    const entropyBits = rrIntervals.length > 0 ? Math.round(Math.log2(rrIntervals.length) * otpKey.length) : 0;
    const norm = Math.min(1, entropyBits / 512);

    const gradient = ctx.createLinearGradient(mx, 0, mx + mw, 0);
    gradient.addColorStop(0, '#ff3333');
    gradient.addColorStop(0.3, '#ffcc00');
    gradient.addColorStop(0.7, '#33ff33');
    gradient.addColorStop(1, '#00ccff');
    ctx.fillStyle = gradient;
    ctx.fillRect(mx, my, mw * norm, mh);

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(mx, my, mw, mh);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`Entropy: ${entropyBits} bits`, mx + mw / 2, my + 19);
    ctx.textAlign = 'left';
  }

  // Draw encryption status
  function drawCryptoStatus(ctx) {
    const sx = W * 0.5;
    const sy = H * 0.75;
    const sw = W * 0.47;
    const sh = 50;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(sx, sy, sw, sh);

    ctx.fillStyle = '#d4a03c';
    ctx.font = 'bold 11px Orbitron';
    ctx.fillText(`BPM: ${bpm}`, sx + 10, sy + 18);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Orbitron';
    ctx.fillText(`Key bytes: ${otpKey.length} | R-R samples: ${rrIntervals.length}`, sx + 10, sy + 35);
    ctx.fillText(`Keys generated: ${keysGenerated}`, sx + 10, sy + 48);

    // Heart icon
    if (heartRunning) {
      const glow = Math.abs(Math.sin(t * 3));
      drawHeartIcon(ctx, sx + sw - 30, sy + 25, 15, glow);
    }
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;

    drawGrid(ctx);

    if (heartRunning) {
      const interval = 60 / bpm;
      beatPhase += 0.016 / interval;

      if (beatPhase >= 1) {
        beatPhase -= 1;
        // Generate R-R interval with realistic variability
        const baseRR = Math.round(interval * 1000);
        const hrv = Math.round((Math.random() - 0.5) * 80 + Math.sin(t * 0.7) * 30);
        const rr = Math.max(500, Math.min(1500, baseRR + hrv));
        rrIntervals.push(rr);
        if (rrIntervals.length > 200) rrIntervals.shift();

        // Simulate natural BPM variation
        bpm = Math.round(68 + Math.sin(t * 0.3) * 8 + Math.sin(t * 0.07) * 4 + (Math.random() - 0.5) * 3);

        playSound('heartbeat');

        const bd = $('bpmDisplay'), sb = $('statBPM'), sr = $('statRR');
        if (bd) bd.textContent = `\u2764 ${bpm} BPM`;
        if (sb) sb.textContent = bpm;
        if (sr) sr.textContent = rr;
      }

      const ecgVal = generateECG(beatPhase);
      ecgData.push(ecgVal);
      if (ecgData.length > W) ecgData.shift();

      // Noise particles at R peak
      if (generateECG(beatPhase) > 0.8) {
        for (let i = 0; i < 5; i++) {
          const nx = ecgData.length - 1 + (Math.random() - 0.5) * 20;
          const ny = H * 0.35 - 0.8 * H * 0.25 + (Math.random() - 0.5) * 30;
          ctx.fillStyle = `rgba(255,51,102,${Math.random() * 0.5})`;
          ctx.fillRect(nx, ny, 2, 2);
        }
      }
    }

    drawECG(ctx);
    drawRRPanel(ctx);
    drawKeyDisplay(ctx);
    drawEntropyMeter(ctx);
    drawCryptoStatus(ctx);

    heartAnim = requestAnimationFrame(frame);
  }
  frame();

  // Wire up controls
  const startBtn = $('startBtn');
  const genKeyBtn = $('genKeyBtn');
  const encBtn = $('encryptBtn');
  const decBtn = $('decryptBtn');

  if (startBtn) startBtn.onclick = () => {
    heartRunning = !heartRunning;
    setStatus(heartRunning);
    const span = startBtn.querySelector('[data-i18n]');
    const s = LANG[currentLang];
    if (span) span.textContent = heartRunning ? (s.stopHeart || 'Stop') : s.startHeart;
    log(heartRunning ? s.heartStarted : s.heartStopped, 'info');
    if (heartRunning) {
      sendAppMessage('heartbeat-started', { bpm });
    }
  };

  if (genKeyBtn) genKeyBtn.onclick = generateOTPKey;
  if (encBtn) encBtn.onclick = encryptMessage;
  if (decBtn) decBtn.onclick = decryptMessage;
}

function generateOTPKey() {
  const s = LANG[currentLang];
  if (rrIntervals.length < 8) { log(s.needBeats, 'error'); return; }
  otpKey = [];

  // Hash R-R intervals with mixing to generate key bytes
  for (let i = 0; i < rrIntervals.length && otpKey.length < 64; i++) {
    const rr = rrIntervals[i];
    const rr2 = rrIntervals[(i + 3) % rrIntervals.length];
    const rr3 = rrIntervals[(i + 7) % rrIntervals.length];
    // Mix multiple intervals for better entropy
    otpKey.push(((rr * 31 + i * 17) ^ (rr2 >> 2)) & 0xFF);
    otpKey.push(((rr >> 3) ^ (rr << 2) ^ rr3) & 0xFF);
  }

  keysGenerated++;
  const entropy = Math.round(Math.log2(rrIntervals.length) * otpKey.length);

  const se = $('statEntropy'), sk = $('statKeys');
  if (se) se.textContent = entropy;
  if (sk) sk.textContent = keysGenerated;

  // Update key strength bar
  const fill = $('keyStrengthFill'), label = $('keyStrengthLabel');
  const strength = Math.min(100, entropy / 5.12);
  if (fill) fill.style.width = strength + '%';
  if (label) label.textContent = `Key Entropy: ${entropy} bits`;

  log(`${s.keyGenerated}: ${otpKey.length} bytes, ~${entropy} bits entropy`, 'success');
  showToast(`${s.keyGenerated}! ${otpKey.length} bytes`, 1500);
  sendAppMessage('key-generated', { bytes: otpKey.length, entropy });
}

function encryptMessage() {
  const s = LANG[currentLang];
  const msg = ($('msgInput') || {}).value || '';
  if (!msg) { log(s.enterMsg, 'error'); return; }
  if (otpKey.length === 0) { log(s.needKey, 'error'); return; }

  let cipher = '';
  for (let i = 0; i < msg.length; i++) {
    cipher += String.fromCharCode(msg.charCodeAt(i) ^ otpKey[i % otpKey.length]);
  }
  const hex = Array.from(cipher).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
  const out = $('cipherOutput');
  if (out) out.textContent = hex;

  log(`${s.encrypted}: ${hex.slice(0, 60)}...`, 'tx');
  playSound('encrypt');
  sendAppMessage('encrypted', { length: msg.length });
}

function decryptMessage() {
  const s = LANG[currentLang];
  const out = $('cipherOutput');
  if (!out || !out.textContent.trim() || out.textContent === s.cipherPlaceholder) { log(s.enterMsg, 'error'); return; }
  if (otpKey.length === 0) { log(s.needKey, 'error'); return; }

  const hex = out.textContent.trim().split(' ');
  let plain = '';
  for (let i = 0; i < hex.length; i++) {
    const byte = parseInt(hex[i], 16);
    if (!isNaN(byte)) plain += String.fromCharCode(byte ^ otpKey[i % otpKey.length]);
  }

  out.textContent = plain;
  log(`${s.decrypted}: ${plain}`, 'rx');
  playSound('success');
}


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
