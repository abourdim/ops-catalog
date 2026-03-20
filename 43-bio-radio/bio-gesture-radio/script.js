/**
 * Workshop DIY — Bio Gesture Radio v1.0
 * Hand gestures modulate BLE for covert sign language
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
  osc.connect(gain); gain.connect(audioCtx.destination);
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
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {
    title: 'Bio Gesture Radio',
    subtitle: 'Hand gestures modulate BLE signals',
    disconnected: 'Disconnected',
    connected: 'Connected',
    mainSection: 'Gesture Radio \u2014 Covert Sign Language via BLE',
    mainDesc: 'Hand gestures detected and transmitted as modulated BLE packets',
    sectionA: 'A \u2014 How It Works',
    sectionC: 'C \u2014 Challenges',
    startDetect: 'Start Detection',
    stopDetect: 'Stop',
    nextGesture: 'Next Gesture',
    txBLE: 'TX via BLE',
    encryptBtn: 'Encrypt',
    statGesture: 'gesture',
    statDetected: 'detected',
    statBLE: 'BLE',
    statRSSI: 'dBm',
    step1Title: 'Gesture Sensing',
    step1Desc: 'Flex sensors on each finger detect hand shape. micro:bit reads analog values from 5 flex resistors.',
    step2Title: 'Pattern Matching',
    step2Desc: 'Finger positions matched against a gesture library. 5 binary fingers = 32 possible combinations.',
    step3Title: 'BLE Broadcast',
    step3Desc: 'Recognized gesture encoded into BLE advertising packets. Low power, short range, covert transmission.',
    step4Title: 'Remote Decode',
    step4Desc: 'Receiver micro:bit decodes gestures back to sign language. Covert communication channel!',
    ch1Title: 'Build a Vocabulary',
    ch1Desc: 'Create a set of 10 gestures and assign them words. Can your partner decode your secret message?',
    ch2Title: 'Speed Challenge',
    ch2Desc: 'How many gestures per minute can you reliably transmit and decode? Try to beat 20 gestures/min!',
    ch3Title: 'Encrypted Signs',
    ch3Desc: 'Add encryption to your gesture codes. Even if intercepted, the BLE packets reveal nothing!',
    howto_1: 'Click Start Detection to begin gesture recognition.',
    howto_2: 'Click Next Gesture to cycle through available gestures.',
    howto_3: 'Click TX via BLE to broadcast the current gesture.',
    howto_4: 'Click Encrypt to toggle encrypted BLE transmission mode.',
    wiki_gest_title: '\u270b Gesture Recognition',
    wiki_gest: '5 flex sensors create a binary finger map. Each gesture is a unique 5-bit pattern matched against a library.',
    wiki_ble_title: '\ud83d\udce1 BLE Advertising',
    wiki_ble: 'BLE advertising packets carry up to 31 bytes of data. Gesture codes fit in 2-3 bytes with room for sequence numbers.',
    wiki_enc_title: '\ud83d\udd12 Encryption',
    wiki_enc: 'XOR cipher with a pre-shared key. Each gesture code is encrypted before BLE transmission, making interception useless.',
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
    newVersion: 'UPDATE',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\u270b Bio Gesture Radio ready \u2014 sign to transmit!',
    logCleared: 'Log cleared',
    copied: 'Copied!',
    copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English',
    themeChanged: '\ud83c\udfa8 Theme \u2192',
    detecting: 'Gesture detection active...',
    stopped: 'Detection stopped',
    gestureDetected: 'Gesture detected:',
    bleSent: 'BLE packet sent:',
    encrypted: 'Encryption enabled',
    decrypted: 'Encryption disabled',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates bio-signals! 🔬 You get to experiment with body signals into radio in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real body signals into radio so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real biometric radio technology! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Bio Heartbeat Mesh and Bio Thermal Signature! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title: 'Bio Radio Gestuelle',
    subtitle: 'Gestes de la main modulent le BLE',
    disconnected: 'D\u00e9connect\u00e9',
    connected: 'Connect\u00e9',
    mainSection: 'Radio Gestuelle \u2014 Langage des signes secret via BLE',
    mainDesc: 'Gestes de la main d\u00e9tect\u00e9s et transmis en paquets BLE modul\u00e9s',
    sectionA: 'A \u2014 Comment \u00e7a marche',
    sectionC: 'C \u2014 D\u00e9fis',
    startDetect: 'D\u00e9marrer D\u00e9tection',
    stopDetect: 'Arr\u00eat',
    nextGesture: 'Geste Suivant',
    txBLE: 'TX via BLE',
    encryptBtn: 'Chiffrer',
    statGesture: 'geste',
    statDetected: 'd\u00e9tect\u00e9s',
    statBLE: 'BLE',
    statRSSI: 'dBm',
    step1Title: 'D\u00e9tection des Gestes',
    step1Desc: 'Des capteurs flex sur chaque doigt d\u00e9tectent la forme de la main. Le micro:bit lit les valeurs analogiques.',
    step2Title: 'Reconnaissance',
    step2Desc: 'Les positions des doigts sont compar\u00e9es \u00e0 une biblioth\u00e8que de gestes. 5 doigts = 32 combinaisons.',
    step3Title: 'Diffusion BLE',
    step3Desc: 'Le geste reconnu est encod\u00e9 en paquets publicitaires BLE. Faible puissance, courte port\u00e9e.',
    step4Title: 'D\u00e9codage Distant',
    step4Desc: 'Le micro:bit r\u00e9cepteur d\u00e9code les gestes en langage des signes. Communication secr\u00e8te!',
    ch1Title: 'Construire un Vocabulaire',
    ch1Desc: 'Cr\u00e9ez un ensemble de 10 gestes et attribuez-leur des mots.',
    ch2Title: 'D\u00e9fi de Vitesse',
    ch2Desc: 'Combien de gestes par minute pouvez-vous transmettre? Essayez 20 gestes/min!',
    ch3Title: 'Signes Chiffr\u00e9s',
    ch3Desc: 'Ajoutez le chiffrement \u00e0 vos codes gestuels.',
    howto_1: 'Cliquez D\u00e9marrer pour commencer la reconnaissance.',
    howto_2: 'Cliquez Geste Suivant pour parcourir les gestes.',
    howto_3: 'Cliquez TX via BLE pour diffuser le geste actuel.',
    howto_4: 'Cliquez Chiffrer pour activer le mode chiffr\u00e9.',
    wiki_gest_title: '\u270b Reconnaissance Gestuelle',
    wiki_gest: '5 capteurs flex cr\u00e9ent une carte binaire des doigts. Chaque geste est un motif unique de 5 bits.',
    wiki_ble_title: '\ud83d\udce1 Publicit\u00e9 BLE',
    wiki_ble: 'Les paquets BLE transportent jusqu\'\u00e0 31 octets. Les codes gestuels tiennent en 2-3 octets.',
    wiki_enc_title: '\ud83d\udd12 Chiffrement',
    wiki_enc: 'Chiffrement XOR avec cl\u00e9 partag\u00e9e. Chaque code est chiffr\u00e9 avant transmission BLE.',
    activityLog: 'Journal',
    eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me',
    help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'R\u00e9actif musique', splashHint: 'appuyer pour passer',
    working: 'En cours\u2026', newVersion: 'MAJ',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\u270b Radio Gestuelle pr\u00eate \u2014 signez pour transmettre!',
    logCleared: 'Journal effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais',
    themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    detecting: 'D\u00e9tection de gestes active...',
    stopped: 'D\u00e9tection arr\u00eat\u00e9e',
    gestureDetected: 'Geste d\u00e9tect\u00e9:',
    bleSent: 'Paquet BLE envoy\u00e9:',
    encrypted: 'Chiffrement activ\u00e9',
    decrypted: 'Chiffrement d\u00e9sactiv\u00e9',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Heartbeat Mesh and Bio Thermal Signature ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title: '\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a',
    subtitle: '\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0627\u0644\u064a\u062f \u062a\u0639\u062f\u0644 \u0625\u0634\u0627\u0631\u0627\u062a BLE',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',
    connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u2014 \u0644\u063a\u0629 \u0625\u0634\u0627\u0631\u0629 \u0633\u0631\u064a\u0629 \u0639\u0628\u0631 BLE',
    mainDesc: '\u0643\u0634\u0641 \u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0627\u0644\u064a\u062f \u0648\u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0643\u062d\u0632\u0645 BLE \u0645\u0639\u062f\u0644\u0629',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',
    sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startDetect: '\u0628\u062f\u0621 \u0627\u0644\u0643\u0634\u0641',
    stopDetect: '\u0625\u064a\u0642\u0627\u0641',
    nextGesture: '\u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629',
    txBLE: '\u0625\u0631\u0633\u0627\u0644 BLE',
    encryptBtn: '\u062a\u0634\u0641\u064a\u0631',
    statGesture: '\u0625\u064a\u0645\u0627\u0621\u0629',
    statDetected: '\u0645\u0643\u062a\u0634\u0641',
    statBLE: 'BLE',
    statRSSI: '\u062f\u064a\u0633\u064a\u0628\u0644',
    step1Title: '\u0627\u0633\u062a\u0634\u0639\u0627\u0631 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a',
    step1Desc: '\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a \u0627\u0644\u0627\u0646\u062d\u0646\u0627\u0621 \u0639\u0644\u0649 \u0643\u0644 \u0625\u0635\u0628\u0639 \u062a\u0643\u0634\u0641 \u0634\u0643\u0644 \u0627\u0644\u064a\u062f.',
    step2Title: '\u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0623\u0646\u0645\u0627\u0637',
    step2Desc: '\u0645\u0648\u0627\u0642\u0639 \u0627\u0644\u0623\u0635\u0627\u0628\u0639 \u062a\u0642\u0627\u0631\u0646 \u0628\u0645\u0643\u062a\u0628\u0629 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a. 5 \u0623\u0635\u0627\u0628\u0639 = 32 \u062a\u0648\u0644\u064a\u0641\u0629.',
    step3Title: '\u0628\u062b BLE',
    step3Desc: '\u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0629 \u0627\u0644\u0645\u0639\u0631\u0648\u0641\u0629 \u062a\u064f\u0634\u0641\u0631 \u0641\u064a \u062d\u0632\u0645 BLE \u0625\u0639\u0644\u0627\u0646\u064a\u0629.',
    step4Title: '\u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631 \u0639\u0646 \u0628\u0639\u062f',
    step4Desc: '\u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644 \u064a\u0641\u0643 \u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a. \u0642\u0646\u0627\u0629 \u0627\u062a\u0635\u0627\u0644 \u0633\u0631\u064a\u0629!',
    ch1Title: '\u0628\u0646\u0627\u0621 \u0645\u0641\u0631\u062f\u0627\u062a',
    ch1Desc: '\u0623\u0646\u0634\u0626 10 \u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0648\u062e\u0635\u0635 \u0644\u0647\u0627 \u0643\u0644\u0645\u0627\u062a.',
    ch2Title: '\u062a\u062d\u062f\u064a \u0627\u0644\u0633\u0631\u0639\u0629',
    ch2Desc: '\u0643\u0645 \u0625\u064a\u0645\u0627\u0621\u0629 \u0641\u064a \u0627\u0644\u062f\u0642\u064a\u0642\u0629 \u064a\u0645\u0643\u0646\u0643 \u0625\u0631\u0633\u0627\u0644\u0647\u0627\u061f',
    ch3Title: '\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0645\u0634\u0641\u0631\u0629',
    ch3Desc: '\u0623\u0636\u0641 \u0627\u0644\u062a\u0634\u0641\u064a\u0631 \u0625\u0644\u0649 \u0631\u0645\u0648\u0632 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a.',
    howto_1: '\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 \u0627\u0644\u0643\u0634\u0641 \u0644\u0628\u062f\u0621 \u0627\u0644\u062a\u0639\u0631\u0641.',
    howto_2: '\u0627\u0646\u0642\u0631 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629 \u0644\u0644\u062a\u0646\u0642\u0644.',
    howto_3: '\u0627\u0646\u0642\u0631 \u0625\u0631\u0633\u0627\u0644 BLE \u0644\u0628\u062b \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0629.',
    howto_4: '\u0627\u0646\u0642\u0631 \u062a\u0634\u0641\u064a\u0631 \u0644\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0645\u0634\u0641\u0631.',
    wiki_gest_title: '\u270b \u0627\u0644\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a',
    wiki_gest: '5 \u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a \u062a\u0646\u0634\u0626 \u062e\u0631\u064a\u0637\u0629 \u062b\u0646\u0627\u0626\u064a\u0629 \u0644\u0644\u0623\u0635\u0627\u0628\u0639.',
    wiki_ble_title: '\ud83d\udce1 \u0625\u0639\u0644\u0627\u0646 BLE',
    wiki_ble: '\u062d\u0632\u0645 BLE \u062a\u062d\u0645\u0644 31 \u0628\u0627\u064a\u062a. \u0631\u0645\u0648\u0632 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u062a\u062d\u062a\u0627\u062c 2-3 \u0628\u0627\u064a\u062a.',
    wiki_enc_title: '\ud83d\udd12 \u0627\u0644\u062a\u0634\u0641\u064a\u0631',
    wiki_enc: '\u062a\u0634\u0641\u064a\u0631 XOR \u0628\u0645\u0641\u062a\u0627\u062d \u0645\u0634\u062a\u0631\u0643. \u0643\u0644 \u0631\u0645\u0632 \u064a\u064f\u0634\u0641\u0631 \u0642\u0628\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',
    eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0627\u0644\u0644\u063a\u0629', theme: '\u0627\u0644\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',
    whisperMode: '\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633', breathingGuide: '\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637',
    musicMode: '\u062a\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064a\u0642\u064a', splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',
    working: '\u062c\u0627\u0631\u064d\u2026', newVersion: '\u062a\u062d\u062f\u064a\u062b',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\u270b \u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u062c\u0627\u0647\u0632 \u2014 \u0623\u0634\u0631 \u0644\u0644\u0625\u0631\u0633\u0627\u0644!',
    logCleared: '\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644',
    copied: '\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!', copyFail: '\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062e',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    detecting: '\u0643\u0634\u0641 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0646\u0634\u0637...',
    stopped: '\u062a\u0645 \u0627\u0644\u0625\u064a\u0642\u0627\u0641',
    gestureDetected: '\u0625\u064a\u0645\u0627\u0621\u0629 \u0645\u0643\u062a\u0634\u0641\u0629:',
    bleSent: '\u062d\u0632\u0645\u0629 BLE \u0645\u0631\u0633\u0644\u0629:',
    encrypted: '\u0627\u0644\u062a\u0634\u0641\u064a\u0631 \u0645\u0641\u0639\u0644',
    decrypted: '\u0627\u0644\u062a\u0634\u0641\u064a\u0631 \u0645\u0639\u0637\u0644',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Heartbeat Mesh and Bio Thermal Signature! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};

/* ═══════ LANGUAGE ═══════ */

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.title = `${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang];
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(`${s.themeChanged} ${s['t_' + name] || name}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;
const logHistory = [];

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
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
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `gesture-radio-log-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click(); URL.revokeObjectURL(a.href);
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
function showToast(msg, ms = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (ms > 0) toastTimer = setTimeout(hideToast, ms);
}
function hideToast() {
  const el = $('toastIndicator'); if (el) el.style.display = 'none';
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
  const s = $('splash'); if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}
function initSplash() {
  const s = $('splash'); if (!s) return;
  const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ HELPERS ═══════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah'); if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

function calcHijriDate() {
  try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); }
  catch { return ''; }
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630\u0623\u0624\u0626\u0625\u0621\u0629\u0649\u0622';

function toggleMatrix() {
  const canvas = $('matrixCanvas'); if (!canvas) return;
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

/* ═══════ BREATHING + DHIKR ═══════ */

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() {
  breathingActive = !breathingActive;
  document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive));
}
function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount;
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null, whisperActive = false;
function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('\ud83c\udfa4 Speech not supported', 'error'); return; }
  if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('\ud83c\udfa4 Whisper off', 'info'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR(); recognition.continuous = true; recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) { const t = e.results[i][0].transcript.trim(); if (t) log(`\ud83c\udfa4 ${t}`, 'rx'); } } };
  recognition.onerror = e => log(`\ud83c\udfa4 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start(); whisperActive = true;
  log('\ud83c\udfa4 Whisper mode on', 'success');
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null, musicActive = false, musicAnim = null;
function toggleMusicMode() {
  if (musicActive) { musicActive = false; if (musicAnim) cancelAnimationFrame(musicAnim); document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; }); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const src = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser(); musicAnalyser.fftSize = 256;
    src.connect(musicAnalyser); musicActive = true;
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    function viz() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      bands.forEach((b, i) => { b.style.height = (2 + (i === 0 ? bass : 0) * 10) + 'px'; b.style.opacity = 0.4 + bass * 0.6; });
      musicAnim = requestAnimationFrame(viz);
    }
    viz();
  }).catch(() => log('\ud83c\udfb5 Mic denied', 'error'));
}

/* ═══════ PANELS ═══════ */

function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); }
function closePanel(pid, oid, rid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); const b = $(rid); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
      const tgt = $(id); if (tgt) tgt.classList.add('active');
    });
  });
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; });
}

/* ═══════ DEBUG ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel'); if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, last = performance.now();
  function tick() {
    frames++;
    const now = performance.now();
    if (now - last >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      frames = 0; last = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ GESTURE RADIO SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

const GESTURES = [
  { name: 'PEACE',     icon: '\u270c\ufe0f',      pattern: [0,1,1,0,0], color: '#33ff33' },
  { name: 'FIST',      icon: '\u270a',             pattern: [1,1,1,1,1], color: '#ff6633' },
  { name: 'OPEN',      icon: '\ud83d\udd90\ufe0f', pattern: [0,0,0,0,0], color: '#66bbff' },
  { name: 'POINT',     icon: '\ud83d\udc46',       pattern: [0,1,0,0,0], color: '#ffcc00' },
  { name: 'OK',        icon: '\ud83d\udc4c',       pattern: [1,0,0,0,1], color: '#ff33cc' },
  { name: 'THUMBS UP', icon: '\ud83d\udc4d',       pattern: [0,0,0,0,1], color: '#33ffcc' },
  { name: 'ROCK',      icon: '\ud83e\udd18',       pattern: [0,1,0,0,1], color: '#ff9933' },
  { name: 'CALL',      icon: '\ud83e\udd19',       pattern: [1,0,0,0,0], color: '#9966ff' },
];

let detecting = false;
let currentGesture = 2; // OPEN
let gestureLog = [];
let blePackets = [];
let encryptMode = false;
let encryptKey = 0xA7;
let bleRSSI = -60;
let totalTx = 0;
let flexValues = [0, 0, 0, 0, 0];

function initGestureApp() {
  const canvas = $('gestCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;

  // Draw a hand with finger states
  function drawHand(gesture) {
    const cx = W * 0.22, cy = H * 0.48;
    const g = gesture;

    // Palm
    ctx.save();
    ctx.shadowColor = g.color;
    ctx.shadowBlur = detecting ? 15 : 5;

    ctx.beginPath();
    ctx.ellipse(cx, cy, 38, 45, 0, 0, Math.PI * 2);
    ctx.fillStyle = g.color + '22';
    ctx.fill();
    ctx.strokeStyle = g.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Wrist
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 45);
    ctx.lineTo(cx - 12, cy + 80);
    ctx.lineTo(cx + 12, cy + 80);
    ctx.lineTo(cx + 15, cy + 45);
    ctx.strokeStyle = g.color + '88';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fingers
    const fingerAngles = [-0.9, -0.45, 0, 0.45, 0.9];
    const fingerLens = [38, 50, 55, 50, 40];
    const fingerNames = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

    fingerAngles.forEach((a, i) => {
      const bent = g.pattern[i];
      const len = bent ? fingerLens[i] * 0.35 : fingerLens[i];
      const startX = cx + Math.sin(a) * 32;
      const startY = cy - Math.cos(a) * 38;
      const endX = startX + Math.sin(a) * len;
      const endY = startY - Math.cos(a) * len;

      // Flex sensor value visualization
      const flexV = flexValues[i];
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      if (bent) {
        // Bent finger with curve
        const midX = (startX + endX) / 2 + Math.cos(a) * 8;
        const midY = (startY + endY) / 2;
        ctx.quadraticCurveTo(midX, midY, endX, endY);
      } else {
        ctx.lineTo(endX, endY);
      }
      ctx.strokeStyle = bent ? '#ff4444' : g.color;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Fingertip circle
      ctx.beginPath();
      ctx.arc(endX, endY, 4, 0, Math.PI * 2);
      ctx.fillStyle = bent ? '#ff4444' : g.color;
      ctx.fill();

      // Flex sensor readout
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '7px Orbitron';
      ctx.fillText(`${Math.round(flexV * 100)}%`, endX + 6, endY + 3);
    });

    ctx.restore();

    // Gesture label below hand
    ctx.fillStyle = g.color;
    ctx.font = 'bold 18px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`${g.icon} ${g.name}`, cx, H - 15);
    ctx.textAlign = 'left';

    // Pattern binary display
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`[${g.pattern.join(',')}]`, cx, H - 35);
    ctx.textAlign = 'left';
  }

  // BLE packet visualization area
  function drawBLEZone() {
    const bx = W * 0.48, by = 15, bw = W * 0.50, bh = H * 0.55;

    // BLE zone background
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(bx, by, bw, bh);

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Orbitron';
    ctx.fillText(encryptMode ? '\ud83d\udd12 BLE ENCRYPTED BROADCAST' : '\ud83d\udce1 BLE BROADCAST', bx + 8, by + 15);

    // Signal strength indicator
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px Orbitron';
    ctx.fillText(`RSSI: ${bleRSSI}dBm`, bx + bw - 90, by + 15);

    // Draw BLE packets
    blePackets.forEach((p, i) => {
      p.x += p.speed;
      p.life -= 0.008;
      if (p.life <= 0) { blePackets.splice(i, 1); return; }

      ctx.globalAlpha = p.life;

      // Packet body
      ctx.beginPath();
      ctx.arc(bx + p.x, by + p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Ripple
      if (p.life > 0.5) {
        ctx.beginPath();
        ctx.arc(bx + p.x, by + p.y, p.size + (1 - p.life) * 20, 0, Math.PI * 2);
        ctx.strokeStyle = p.color + '44';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Encrypted glyph
      if (p.encrypted) {
        ctx.fillStyle = '#ffcc00';
        ctx.font = '7px Orbitron';
        ctx.fillText('\ud83d\udd12', bx + p.x - 4, by + p.y - p.size - 3);
      }
    });
    ctx.globalAlpha = 1;

    // Channel grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let gy = 0; gy < 5; gy++) {
      const yy = by + 25 + gy * (bh - 30) / 5;
      ctx.beginPath(); ctx.moveTo(bx, yy); ctx.lineTo(bx + bw, yy); ctx.stroke();
    }

    // BLE channel labels
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '7px Orbitron';
    ['CH37', 'CH38', 'CH39'].forEach((ch, i) => {
      ctx.fillText(ch, bx + 5, by + 40 + i * 50);
    });
  }

  // Packet data panel
  function drawDataPanel() {
    const px = W * 0.48, py = H * 0.60, pw = W * 0.50, ph = H * 0.36;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(px, py, pw, ph);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('PACKET DATA', px + 8, py + 14);

    const g = GESTURES[currentGesture];
    const raw = g.pattern.map(b => b.toString()).join('');
    const hexCode = g.pattern.reduce((acc, b, i) => acc | (b << (4 - i)), 0);
    const hexStr = hexCode.toString(16).padStart(2, '0').toUpperCase();
    const encHex = encryptMode ? ((hexCode ^ encryptKey) & 0xFF).toString(16).padStart(2, '0').toUpperCase() : hexStr;

    ctx.fillStyle = '#33ff33';
    ctx.font = '10px monospace';
    let y = py + 30;
    ctx.fillText(`Gesture: ${g.name}`, px + 10, y); y += 16;
    ctx.fillText(`Binary:  ${raw}`, px + 10, y); y += 16;
    ctx.fillText(`Raw:     0x${hexStr}`, px + 10, y); y += 16;

    if (encryptMode) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillText(`Key:     0x${encryptKey.toString(16).toUpperCase()}`, px + 10, y); y += 16;
      ctx.fillText(`Cipher:  0x${encHex}`, px + 10, y); y += 16;
    }

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(`TX count: ${totalTx}`, px + 10, y); y += 16;
    ctx.fillText(`BLE RSSI: ${bleRSSI} dBm`, px + 10, y);

    // Sequence visualization
    if (gestureLog.length > 0) {
      const seqY = py + ph - 18;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '8px Orbitron';
      ctx.fillText('SEQUENCE:', px + pw - 200, seqY);
      const recent = gestureLog.slice(-6);
      recent.forEach((g2, i) => {
        ctx.fillStyle = g2.gesture.color + 'aa';
        ctx.fillText(g2.gesture.icon, px + pw - 140 + i * 22, seqY);
      });
    }
  }

  // Flex sensor bars
  function drawFlexBars() {
    const fx = W * 0.01, fy = 15, fw = W * 0.12, fh = H * 0.45;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(fx, fy, fw, fh);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px Orbitron';
    ctx.fillText('FLEX SENSORS', fx + 3, fy + 12);

    const names = ['T', 'I', 'M', 'R', 'P'];
    const g = GESTURES[currentGesture];
    names.forEach((n, i) => {
      const barX = fx + 5 + i * (fw - 10) / 5;
      const barW = (fw - 20) / 5;
      const barH = fh - 30;
      const val = flexValues[i];

      // Bar background
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(barX, fy + 18, barW, barH);

      // Bar fill
      const fillH = barH * val;
      ctx.fillStyle = g.pattern[i] ? '#ff4444aa' : g.color + '88';
      ctx.fillRect(barX, fy + 18 + barH - fillH, barW, fillH);

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '8px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(n, barX + barW / 2, fy + fh - 2);
      ctx.textAlign = 'left';
    });
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;

    // Update flex sensor values
    const g = GESTURES[currentGesture];
    g.pattern.forEach((bent, i) => {
      const target = bent ? 0.8 + Math.random() * 0.15 : 0.1 + Math.random() * 0.1;
      flexValues[i] += (target - flexValues[i]) * 0.1;
    });

    // Auto-detect gestures when running
    if (detecting && Math.random() < 0.015) {
      currentGesture = (currentGesture + 1) % GESTURES.length;
      const gg = GESTURES[currentGesture];
      gestureLog.push({ gesture: gg, time: Date.now() });
      const sg = $('statGesture'), sc = $('statCount');
      if (sg) sg.textContent = gg.name;
      if (sc) sc.textContent = gestureLog.length;
      log(`${LANG[currentLang].gestureDetected} ${gg.icon} ${gg.name}`, 'rx');

      // Auto-TX when detecting
      emitBLEPackets(gg);
    }

    // BLE RSSI drift
    bleRSSI = -55 + Math.sin(t * 0.5) * 8 + (Math.random() - 0.5) * 3;
    const sr = $('statRSSI');
    if (sr) sr.textContent = Math.round(bleRSSI);

    drawFlexBars();
    drawHand(GESTURES[currentGesture]);
    drawBLEZone();
    drawDataPanel();

    requestAnimationFrame(frame);
  }
  frame();

  // Emit BLE packets visualization
  function emitBLEPackets(gesture) {
    for (let i = 0; i < 15; i++) {
      blePackets.push({
        x: 0,
        y: 20 + Math.random() * (H * 0.50),
        speed: 1.2 + Math.random() * 1.5,
        life: 1,
        size: 3 + Math.random() * 3,
        color: gesture.color,
        encrypted: encryptMode,
      });
    }
    totalTx++;
    const sb = $('statBLE');
    if (sb) sb.textContent = `TX#${totalTx}`;

    // BLE bar
    const fill = $('bleFill'), label = $('bleLabel');
    if (fill) fill.style.width = Math.min(100, totalTx * 5) + '%';
    if (label) label.textContent = `BLE TX #${totalTx} — ${gesture.name}`;
  }

  // Controls
  const startBtn = $('startBtn');
  const gestBtn = $('gestBtn');
  const txBtn = $('txBtn');
  const encBtn = $('encryptBtn');

  if (startBtn) startBtn.onclick = () => {
    detecting = !detecting;
    setStatus(detecting);
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = detecting ? LANG[currentLang].stopDetect : LANG[currentLang].startDetect;
    log(detecting ? LANG[currentLang].detecting : LANG[currentLang].stopped, 'info');
  };

  if (gestBtn) gestBtn.onclick = () => {
    currentGesture = (currentGesture + 1) % GESTURES.length;
    const gg = GESTURES[currentGesture];
    gestureLog.push({ gesture: gg, time: Date.now() });
    const sg = $('statGesture'), sc = $('statCount');
    if (sg) sg.textContent = gg.name;
    if (sc) sc.textContent = gestureLog.length;
    const gd = $('gestDisplay');
    if (gd) gd.textContent = `${gg.icon} ${gg.name}`;
    log(`Manual: ${gg.icon} ${gg.name} [${gg.pattern}]`, 'info');
    playSound('click');
  };

  if (txBtn) txBtn.onclick = () => {
    const gg = GESTURES[currentGesture];
    emitBLEPackets(gg);
    const hex = gg.pattern.reduce((a, b, i) => a | (b << (4 - i)), 0);
    const encHex = encryptMode ? ((hex ^ encryptKey) & 0xFF) : hex;
    log(`${LANG[currentLang].bleSent} ${gg.name} [0x${encHex.toString(16).toUpperCase()}]${encryptMode ? ' \ud83d\udd12' : ''}`, 'tx');
    showToast(`${gg.icon} Sent via BLE`, 1200);
  };

  if (encBtn) encBtn.onclick = () => {
    encryptMode = !encryptMode;
    encBtn.classList.toggle('active', encryptMode);
    log(encryptMode ? LANG[currentLang].encrypted : LANG[currentLang].decrypted, encryptMode ? 'success' : 'info');
    playSound(encryptMode ? 'success' : 'click');
  };
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

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

  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = toggleWhisper;
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn2 = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn2) dhikrBtn2.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = toggleMusicMode;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); }
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

  const hd = $('hijriDate');
  if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }

  initDebug();

  // Logo triple-click for matrix
  let logoClicks = 0, logoTimer = null;
  const logo = $('logoWrap');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      logoClicks++;
      if (logoTimer) clearTimeout(logoTimer);
      if (logoClicks >= 3) { logoClicks = 0; toggleMatrix(); }
      else logoTimer = setTimeout(() => logoClicks = 0, 500);
    });
  }

  log(LANG[currentLang].ready, 'success');
  setTimeout(initGestureApp, 50);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();


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
