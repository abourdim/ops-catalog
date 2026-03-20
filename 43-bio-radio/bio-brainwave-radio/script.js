/**
 * Workshop DIY — Bio Brainwave Radio v1.0
 * EEG brainwaves to radio transmission
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); const o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain(); o2.connect(g2); g2.connect(audioCtx.destination); g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine'; g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o2.start(t + 0.15); o2.stop(t + 0.4); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
    case 'tx': osc.frequency.value = 1200; osc.type = 'sawtooth'; gain.gain.value = 0.04; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); osc.start(t); osc.stop(t + 0.15); break;
    case 'brain': osc.frequency.value = 300; osc.type = 'sine'; gain.gain.value = 0.05; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); osc.start(t); osc.stop(t + 0.4); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'Bio Brainwave Radio', subtitle: 'EEG brainwaves to radio transmission',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Brainwave Radio \u2014 EEG to RF', mainDesc: 'Transmit brain states via modulated radio',
    sectionA: 'A \u2014 How It Works', sectionC: 'C \u2014 Challenges',
    startEEG: 'Start EEG', stopEEG: 'Stop', relaxMode: 'Relax', focusMode: 'Focus', transmit: 'Transmit',
    statAlpha: 'Alpha', statTheta: 'Theta', statBeta: 'Beta', statFocus: 'Focus',
    step1Title: 'EEG Pickup', step1Desc: 'Electrodes detect tiny brain electrical signals (10-100 microvolts).',
    step2Title: 'FFT Analysis', step2Desc: 'Fast Fourier Transform decomposes signals into Delta, Theta, Alpha, Beta bands.',
    step3Title: 'RF Modulation', step3Desc: 'Brain state data modulates a radio carrier. Focus level controls modulation.',
    step4Title: 'Transmission', step4Desc: 'micro:bit transmits the signal. Another micro:bit receives and decodes brain state.',
    ch1Title: 'Alpha Boost', ch1Desc: 'Close your eyes and relax. Can you boost alpha above 15 Hz?',
    ch2Title: 'Focus Challenge', ch2Desc: 'Reach 80% focus by increasing beta wave activity.',
    ch3Title: 'Brain-to-Brain', ch3Desc: 'Transmit your brain state to a partner. Can they guess your state?',
    howto_1: 'Click Start EEG to begin brainwave simulation.', howto_2: 'Select Relax or Focus to change state.', howto_3: 'Click Transmit to send brain state via radio.',
    wiki_eeg_title: '\ud83e\udde0 EEG Bands', wiki_eeg: 'Delta (0.5-4Hz), Theta (4-8Hz), Alpha (8-13Hz), Beta (13-30Hz), Gamma (30-100Hz).',
    wiki_bci_title: '\ud83d\udce1 Brain-Computer Interface', wiki_bci: 'BCI reads brain signals to control devices. EEG is the most common non-invasive method.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages', clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '\u2699\ufe0f Settings', language: 'Language', theme: 'Theme', help: '\u2753 Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', working: 'Working\u2026',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83e\udde0 Brainwave Radio ready \u2014 connect your mind!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English', themeChanged: '\ud83c\udfa8 Theme \u2192',
    eegStarted: 'EEG acquisition started', eegStopped: 'EEG stopped', modeRelax: 'Mode: Relaxation \u2014 boosting alpha', modeFocus: 'Mode: Focus \u2014 boosting beta', needEEG: 'Start EEG first',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates bio-signals! 🔬 You get to experiment with body signals into radio in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real body signals into radio so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real biometric radio technology! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Bio Voice Rf Fingerprint and Bio Skin Galvanic Key! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'Bio Radio C\u00e9r\u00e9brale', subtitle: 'EEG vers transmission radio',
    disconnected: 'D\u00e9connect\u00e9', connected: 'Connect\u00e9',
    mainSection: 'Radio C\u00e9r\u00e9brale \u2014 EEG vers RF', mainDesc: 'Transmettre les \u00e9tats c\u00e9r\u00e9braux par radio',
    sectionA: 'A \u2014 Comment \u00e7a marche', sectionC: 'C \u2014 D\u00e9fis',
    startEEG: 'D\u00e9marrer EEG', stopEEG: 'Arr\u00eat', relaxMode: 'Relaxation', focusMode: 'Concentration', transmit: 'Transmettre',
    statAlpha: 'Alpha', statTheta: 'Th\u00eata', statBeta: 'B\u00eata', statFocus: 'Focus',
    step1Title: 'Capteur EEG', step1Desc: 'Les \u00e9lectrodes d\u00e9tectent les signaux \u00e9lectriques du cerveau (10-100 \u00b5V).',
    step2Title: 'Analyse FFT', step2Desc: 'La FFT d\u00e9compose les signaux en bandes: Delta, Th\u00eata, Alpha, B\u00eata.',
    step3Title: 'Modulation RF', step3Desc: 'Les donn\u00e9es c\u00e9r\u00e9brales modulent une porteuse radio.',
    step4Title: 'Transmission', step4Desc: 'Le micro:bit transmet le signal modul\u00e9. Un autre re\u00e7oit et d\u00e9code.',
    ch1Title: 'Boost Alpha', ch1Desc: 'Fermez les yeux. Boostez alpha au-dessus de 15 Hz.',
    ch2Title: 'D\u00e9fi Focus', ch2Desc: 'Atteignez 80% de concentration.',
    ch3Title: 'Cerveau-\u00e0-Cerveau', ch3Desc: 'Transmettez votre \u00e9tat \u00e0 un partenaire.',
    howto_1: 'Cliquez D\u00e9marrer EEG.', howto_2: 'S\u00e9lectionnez Relaxation ou Concentration.', howto_3: 'Cliquez Transmettre.',
    wiki_eeg_title: '\ud83e\udde0 Bandes EEG', wiki_eeg: 'Delta (0.5-4Hz), Th\u00eata (4-8Hz), Alpha (8-13Hz), B\u00eata (13-30Hz), Gamma (30-100Hz).',
    wiki_bci_title: '\ud83d\udce1 Interface Cerveau-Machine', wiki_bci: 'Les syst\u00e8mes ICM lisent les signaux c\u00e9r\u00e9braux. L\'EEG est la m\u00e9thode non-invasive la plus courante.',
    activityLog: 'Journal', eventsMsg: '\u00c9v\u00e9nements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me', help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Effets sonores', whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'R\u00e9actif musique',
    splashHint: 'appuyer pour passer', working: 'En cours\u2026',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\ud83e\udde0 Radio c\u00e9r\u00e9brale pr\u00eate \u2014 connectez votre esprit!',
    logCleared: 'Journal effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais', themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    eegStarted: 'Acquisition EEG d\u00e9marr\u00e9e', eegStopped: 'EEG arr\u00eat\u00e9', modeRelax: 'Mode: Relaxation \u2014 boost alpha', modeFocus: 'Mode: Concentration \u2014 boost b\u00eata', needEEG: 'D\u00e9marrez l\'EEG d\'abord',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Voice Rf Fingerprint and Bio Skin Galvanic Key ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar: {
    title: '\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0645\u0648\u062c\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a\u064a\u0629', subtitle: 'EEG \u0625\u0644\u0649 \u0625\u0631\u0633\u0627\u0644 \u0631\u0627\u062f\u064a\u0648\u064a',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u062f\u0645\u0627\u063a \u2014 EEG \u0625\u0644\u0649 RF', mainDesc: '\u0628\u062b \u062d\u0627\u0644\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u0639\u0628\u0631 \u0631\u0627\u062f\u064a\u0648',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startEEG: '\u0628\u062f\u0621 EEG', stopEEG: '\u0625\u064a\u0642\u0627\u0641', relaxMode: '\u0627\u0633\u062a\u0631\u062e\u0627\u0621', focusMode: '\u062a\u0631\u0643\u064a\u0632', transmit: '\u0625\u0631\u0633\u0627\u0644',
    statAlpha: '\u0623\u0644\u0641\u0627', statTheta: '\u062b\u064a\u062a\u0627', statBeta: '\u0628\u064a\u062a\u0627', statFocus: '\u062a\u0631\u0643\u064a\u0632',
    step1Title: '\u0627\u0644\u062a\u0642\u0627\u0637 EEG', step1Desc: '\u0627\u0644\u0623\u0642\u0637\u0627\u0628 \u062a\u0643\u0634\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a\u0629 \u0627\u0644\u062f\u0645\u0627\u063a\u064a\u0629 (10-100 \u0645\u064a\u0643\u0631\u0648\u0641\u0648\u0644\u062a).',
    step2Title: '\u062a\u062d\u0644\u064a\u0644 FFT', step2Desc: 'FFT \u064a\u062d\u0644\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0625\u0644\u0649 \u0646\u0637\u0627\u0642\u0627\u062a: \u062f\u0644\u062a\u0627\u060c \u062b\u064a\u062a\u0627\u060c \u0623\u0644\u0641\u0627\u060c \u0628\u064a\u062a\u0627.',
    step3Title: '\u062a\u0639\u062f\u064a\u0644 RF', step3Desc: '\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u062a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 \u0631\u0627\u062f\u064a\u0648.',
    step4Title: '\u0627\u0644\u0625\u0631\u0633\u0627\u0644', step4Desc: '\u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0631\u0633\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0629. \u0622\u062e\u0631 \u064a\u0633\u062a\u0642\u0628\u0644 \u0648\u064a\u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631.',
    ch1Title: '\u0628\u0648\u0633\u062a \u0623\u0644\u0641\u0627', ch1Desc: '\u0623\u063a\u0644\u0642 \u0639\u064a\u0646\u064a\u0643 \u0648\u0627\u0633\u062a\u0631\u062e. \u0647\u0644 \u062a\u0631\u0641\u0639 \u0623\u0644\u0641\u0627 \u0641\u0648\u0642 15\u061f',
    ch2Title: '\u062a\u062d\u062f\u064a \u0627\u0644\u062a\u0631\u0643\u064a\u0632', ch2Desc: '\u0627\u0628\u0644\u063a 80% \u062a\u0631\u0643\u064a\u0632 \u0628\u0631\u0641\u0639 \u0628\u064a\u062a\u0627.',
    ch3Title: '\u062f\u0645\u0627\u063a-\u0625\u0644\u0649-\u062f\u0645\u0627\u063a', ch3Desc: '\u0623\u0631\u0633\u0644 \u062d\u0627\u0644\u062a\u0643 \u0644\u0634\u0631\u064a\u0643. \u0647\u0644 \u064a\u062e\u0645\u0646\u061f',
    howto_1: '\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 EEG.', howto_2: '\u0627\u062e\u062a\u0631 \u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u0623\u0648 \u062a\u0631\u0643\u064a\u0632.', howto_3: '\u0627\u0646\u0642\u0631 \u0625\u0631\u0633\u0627\u0644.',
    wiki_eeg_title: '\ud83e\udde0 \u0646\u0637\u0627\u0642\u0627\u062a EEG', wiki_eeg: '\u062f\u0644\u062a\u0627 (0.5-4Hz)\u060c \u062b\u064a\u062a\u0627 (4-8Hz)\u060c \u0623\u0644\u0641\u0627 (8-13Hz)\u060c \u0628\u064a\u062a\u0627 (13-30Hz)\u060c \u063a\u0627\u0645\u0627 (30-100Hz).',
    wiki_bci_title: '\ud83d\udce1 \u0648\u0627\u062c\u0647\u0629 \u062f\u0645\u0627\u063a-\u062d\u0627\u0633\u0648\u0628', wiki_bci: '\u062a\u0642\u0631\u0623 \u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u0644\u0644\u062a\u062d\u0643\u0645 \u0628\u0627\u0644\u0623\u062c\u0647\u0632\u0629.',
    activityLog: '\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg: '\u0627\u0644\u0623\u062d\u062f\u0627\u062b', clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0627\u0644\u0644\u063a\u0629', theme: '\u0627\u0644\u0645\u0638\u0647\u0631', help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0635\u0648\u062a', whisperMode: '\u0647\u0645\u0633', breathingGuide: '\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637', musicMode: '\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a', working: '\u062c\u0627\u0631\u064d\u2026',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636', t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83e\udde0 \u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u062f\u0645\u0627\u063a \u062c\u0627\u0647\u0632!',
    logCleared: '\u062a\u0645 \u0627\u0644\u0645\u0633\u062d', copied: '\u062a\u0645!', copyFail: '\u0641\u0634\u0644',
    langChanged: '\ud83c\udf10 \u0639\u0631\u0628\u064a\u0629', themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    eegStarted: '\u0628\u062f\u0623 \u0627\u0644\u062a\u0642\u0627\u0637 EEG', eegStopped: '\u062a\u0648\u0642\u0641 EEG', modeRelax: '\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u2014 \u0628\u0648\u0633\u062a \u0623\u0644\u0641\u0627', modeFocus: '\u062a\u0631\u0643\u064a\u0632 \u2014 \u0628\u0648\u0633\u062a \u0628\u064a\u062a\u0627', needEEG: '\u0627\u0628\u062f\u0623 EEG \u0623\u0648\u0644\u0627\u064b',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Voice Rf Fingerprint and Bio Skin Galvanic Key! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK (same pattern as bio-body-antenna) ═══════ */
let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.title = `${s.title} \u2014 Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }

const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const notes = THEME_MELODIES[n]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((f, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; const s = LANG[currentLang]; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${s.themeChanged} ${s['t_' + name] || name}`, 'info'); }

let logContainer; const logHistory = []; let typewriterEnabled = true;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`; if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, fullText); } else { d.textContent = fullText; logContainer.appendChild(d); } logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') { playSound('success'); pulseBismillah('success'); } else if (type === 'error') { playSound('error'); pulseBismillah('error'); } logHistory.push({ msg, type, ts: Date.now() }); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const text = Array.from(logContainer.children).map(d => d.textContent).join('\n'); const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `brainwave-radio-log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); URL.revokeObjectURL(url); log(LANG[currentLang].copied, 'success'); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { if (activeLogFilter === 'all') { line.style.display = ''; return; } line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none'; }); }

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }
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
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri,serif'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }

const MORSE_MAP = {'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', ' ':'/'};
let morseTimeout = null, morseActive2 = false;
async function blinkMorse(text) { if (morseActive2) return; morseActive2 = true; const dot = document.querySelector('.status-dot'); if (!dot) { morseActive2 = false; return; } const orig = dot.style.background; const morse = text.toLowerCase().split('').map(c => MORSE_MAP[c] || '').join(' '); for (const ch of morse) { if (!morseActive2) break; if (ch === '.') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(100); } else if (ch === '-') { dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33'; await sleep(300); } else if (ch === '/' || ch === ' ') { await sleep(200); continue; } dot.style.background = orig; dot.style.boxShadow = ''; await sleep(100); } dot.style.background = ''; dot.style.boxShadow = ''; morseActive2 = false; }
function initMorseLog() { document.addEventListener('mousedown', e => { const line = e.target.closest('.log-line'); if (!line) return; morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600); }); document.addEventListener('mouseup', () => { if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; } }); }

let musicAnalyser = null, musicActive = false, musicAnim2 = null;
function toggleMusicMode() { if (musicActive) { musicActive = false; if (musicAnim2) cancelAnimationFrame(musicAnim2); document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; }); log('\ud83c\udfb5 Music off', 'info'); return; } navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { if (!audioCtx) audioCtx = new AudioCtx(); const src = audioCtx.createMediaStreamSource(stream); musicAnalyser = audioCtx.createAnalyser(); musicAnalyser.fftSize = 256; src.connect(musicAnalyser); musicActive = true; log('\ud83c\udfb5 Music on!', 'success'); const data = new Uint8Array(musicAnalyser.frequencyBinCount); const bands = document.querySelectorAll('.deco-band'); function vis() { if (!musicActive) return; musicAnalyser.getByteFrequencyData(data); const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255; bands.forEach(b => { b.style.height = (2 + bass * 10) + 'px'; b.style.opacity = 0.4 + bass * 0.6; }); musicAnim2 = requestAnimationFrame(vis); } vis(); }).catch(() => log('\ud83c\udfb5 Mic denied', 'error')); }

let recognition = null, whisperActive = false;
function toggleWhisper() { if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('\ud83c\udfa4 Not supported', 'error'); return; } if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; log('\ud83c\udfa4 Whisper off', 'info'); return; } const SR = window.SpeechRecognition || window.webkitSpeechRecognition; recognition = new SR(); recognition.continuous = true; recognition.interimResults = false; recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US'; recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) { const t = e.results[i][0].transcript.trim(); if (t) log(`\ud83c\udfa4 ${t}`, 'rx'); } } }; recognition.onerror = e => log(`\ud83c\udfa4 ${e.error}`, 'error'); recognition.onend = () => { if (whisperActive) recognition.start(); }; recognition.start(); whisperActive = true; log('\ud83c\udfa4 Whisper on!', 'success'); }

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); if (breathingActive) log('\ud83e\udec1 Breathing on', 'info'); else { if (dhikrCount > 0) log(`\ud83d\udcff Dhikr: ${dhikrCount}`, 'success'); dhikrCount = 0; log('\ud83e\udec1 Breathing off', 'info'); } }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h || !p) return; let d = false, sx, sw; const rtl = () => document.documentElement.dir === 'rtl'; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; h.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = rtl() ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, window.innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { if (!d) return; d = false; h.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }); h.addEventListener('touchstart', e => { d = true; sx = e.touches[0].clientX; sw = p.offsetWidth; h.classList.add('active'); e.preventDefault(); }, { passive: false }); document.addEventListener('touchmove', e => { if (!d) return; const dx = rtl() ? (e.touches[0].clientX - sx) : (sx - e.touches[0].clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, window.innerWidth * 0.6)) + 'px'); }, { passive: true }); document.addEventListener('touchend', () => { if (!d) return; d = false; h.classList.remove('active'); }); try { const s = localStorage.getItem('wdiy-log-width'); if (s) document.documentElement.style.setProperty('--log-width', s); } catch {} }

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); if (s) { const f = s.querySelector(FOCUSABLE); if (f) f.focus(); } }
function closePanel(pid, oid, rid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); const b = $(rid); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); const b = $('logBtn'); if (b) b.focus(); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const n = tab.dataset.tab; const tgt = $('help' + n.charAt(0).toUpperCase() + n.slice(1)); if (tgt) tgt.classList.add('active'); }); }); }
function trapFocus(e) { for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) { const s = $(id); if (!s || !s.classList.contains('open')) continue; const f = s.querySelectorAll(FOCUSABLE); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } return; } }

const APP_MSG_KEY = 'wdiy-app-msg';
function sendAppMessage(type, data) { try { localStorage.setItem(APP_MSG_KEY, JSON.stringify({ type, data, from: document.title, ts: Date.now() })); localStorage.removeItem(APP_MSG_KEY); } catch {} }
function onAppMessage(cb) { window.addEventListener('storage', e => { if (e.key !== APP_MSG_KEY || !e.newValue) return; try { cb(JSON.parse(e.newValue)); } catch {} }); }

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; toggleMatrix(); log('\ud83d\udd79\ufe0f KONAMI!', 'success'); } } else konamiIdx = 0; }); }
function initLogoTracker() { const l = $('logoWrap'); if (!l) return; document.addEventListener('mousemove', e => { const r = l.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const dx = (e.clientX - cx) / (innerWidth / 2), dy = (e.clientY - cy) / (innerHeight / 2); l.style.transform = `perspective(200px) rotateX(${dy * 8}deg) rotateY(${-dx * 8}deg)`; }); }
function initDebug() { if (!new URLSearchParams(window.location.search).has('debug')) return; const p = $('debugPanel'); if (!p) return; p.classList.add('active'); const fe = $('debugFps'), me = $('debugMem'); let frames = 0, lt = performance.now(); function tick() { frames++; const n = performance.now(); if (n - lt >= 1000) { if (fe) fe.textContent = frames + ' FPS'; if (me && performance.memory) me.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB'; frames = 0; lt = n; } requestAnimationFrame(tick); } requestAnimationFrame(tick); }

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn'); if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog; initLogFilters();
  const hB = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay'); if (hB) hB.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp; initHelpTabs();
  const sB = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay'); if (sB) sB.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lB = $('logBtn'), lC = $('logCloseBtn'); if (lB) lB.onclick = toggleLog; if (lC) lC.onclick = closeLog; initLogResize();
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.addEventListener('change', () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
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
  let lClicks = 0, lTimer = null; const le = $('logoWrap'); if (le) { le.style.cursor = 'pointer'; le.addEventListener('click', () => { lClicks++; if (lTimer) clearTimeout(lTimer); if (lClicks >= 3) { lClicks = 0; toggleMatrix(); } else lTimer = setTimeout(() => lClicks = 0, 500); }); }
  log(LANG[currentLang].ready, 'success');
  setTimeout(initBrainwaveApp, 50);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BRAINWAVE RADIO SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let eegRunning = false, brainMode = 'normal';
let alpha = 10, theta = 6, beta = 22, delta = 3, focusLevel = 50;
let eegData = { alpha: [], theta: [], beta: [], delta: [] };
let txCount = 0;

function initBrainwaveApp() {
  const canvas = $('brainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;
  const colors = { alpha: '#33ff33', theta: '#6699ff', beta: '#ff3366', delta: '#ffcc00' };
  const bandNames = ['delta', 'theta', 'alpha', 'beta'];
  const bandH = H / 4 - 12;

  function genWave(freq, amp, noise) {
    return Math.sin(t * freq * 0.1) * amp + Math.sin(t * freq * 0.23) * (amp * 0.3) + Math.sin(t * freq * 0.07) * (amp * 0.15) + (Math.random() - 0.5) * noise;
  }

  function drawBrainIcon(cx, cy, glow) {
    ctx.save();
    ctx.beginPath();
    // Simplified brain shape
    ctx.moveTo(cx - 15, cy);
    ctx.bezierCurveTo(cx - 15, cy - 20, cx - 5, cy - 25, cx, cy - 20);
    ctx.bezierCurveTo(cx + 5, cy - 25, cx + 15, cy - 20, cx + 15, cy);
    ctx.bezierCurveTo(cx + 15, cy + 10, cx + 5, cy + 15, cx, cy + 12);
    ctx.bezierCurveTo(cx - 5, cy + 15, cx - 15, cy + 10, cx - 15, cy);
    ctx.fillStyle = `rgba(150,100,255,${0.2 + glow * 0.5})`;
    ctx.shadowColor = '#9966ff';
    ctx.shadowBlur = glow * 20;
    ctx.fill();
    // Center line
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 12);
    ctx.strokeStyle = `rgba(255,255,255,${0.2 + glow * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawSpectralBars() {
    const bx = W - 140, by = 15, bw = 125, bh = 80;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 9px Orbitron';
    ctx.fillText('SPECTRAL POWER', bx + 5, by + 12);

    const vals = [delta, theta, alpha, beta];
    const maxVal = 40;
    const barW = 22;
    vals.forEach((v, i) => {
      const h = Math.min(bh - 25, (v / maxVal) * (bh - 25));
      ctx.fillStyle = colors[bandNames[i]];
      ctx.fillRect(bx + 8 + i * (barW + 5), by + bh - h - 5, barW, h);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '7px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(bandNames[i][0].toUpperCase(), bx + 8 + i * (barW + 5) + barW / 2, by + bh - 1);
      ctx.textAlign = 'left';
    });
  }

  function drawTransmissionRings() {
    if (!eegRunning) return;
    const cx = W * 0.12, cy = H * 0.5;
    for (let ring = 0; ring < 5; ring++) {
      const r = 15 + ring * 12 + (t * 30) % 80;
      const a = Math.max(0, (1 - ring / 5) * 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI * 0.3, Math.PI * 0.3);
      ctx.strokeStyle = `rgba(150,100,255,${a})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    drawBrainIcon(cx, cy, eegRunning ? Math.abs(Math.sin(t * 2)) : 0);
  }

  function drawFocusMeter() {
    const mx = W - 140, my = H - 50, mw = 125, mh = 35;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(mx, my, mw, mh);

    const gradient = ctx.createLinearGradient(mx, 0, mx + mw, 0);
    gradient.addColorStop(0, '#6699ff');
    gradient.addColorStop(0.5, '#33ff33');
    gradient.addColorStop(1, '#ff3366');
    ctx.fillStyle = gradient;
    ctx.fillRect(mx + 2, my + 2, (mw - 4) * focusLevel / 100, mh - 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(mx, my, mw, mh);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`Focus: ${focusLevel}%`, mx + mw / 2, my + 22);
    ctx.textAlign = 'left';
  }

  function drawModeIndicator() {
    const label = brainMode === 'relax' ? 'RELAX' : brainMode === 'focus' ? 'FOCUS' : 'NORMAL';
    const color = brainMode === 'relax' ? '#33ff33' : brainMode === 'focus' ? '#ff3366' : '#ffcc00';
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Orbitron';
    ctx.fillText(label, W * 0.4, 28);
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, W, H);
    t += 1;

    if (eegRunning) {
      const targetA = brainMode === 'relax' ? 16 : brainMode === 'focus' ? 6 : 10;
      const targetB = brainMode === 'focus' ? 36 : brainMode === 'relax' ? 14 : 22;
      const targetT = brainMode === 'relax' ? 9 : brainMode === 'focus' ? 4 : 6;
      alpha += (targetA - alpha) * 0.015 + (Math.random() - 0.5) * 0.4;
      beta += (targetB - beta) * 0.015 + (Math.random() - 0.5) * 0.4;
      theta += (targetT - theta) * 0.015 + (Math.random() - 0.5) * 0.3;
      delta = 2.5 + Math.sin(t * 0.01) * 1 + Math.random() * 0.5;
      focusLevel = Math.round(Math.min(100, Math.max(0, beta / (alpha + 0.1) * 28)));

      const vals = { alpha: genWave(alpha, 30, 5), theta: genWave(theta, 25, 4), beta: genWave(beta, 22, 8), delta: genWave(delta, 35, 3) };
      Object.keys(vals).forEach(k => { eegData[k].push(vals[k]); if (eegData[k].length > W) eegData[k].shift(); });

      // Update HTML stats
      const sa = $('statAlpha'), st2 = $('statTheta'), sb = $('statBeta'), sf = $('statFocus'), bd = $('bandDisplay');
      if (sa) sa.textContent = alpha.toFixed(1);
      if (st2) st2.textContent = theta.toFixed(1);
      if (sb) sb.textContent = beta.toFixed(1);
      if (sf) sf.textContent = focusLevel;
      if (bd) bd.textContent = `Alpha: ${alpha.toFixed(1)} Hz | Theta: ${theta.toFixed(1)} Hz | Beta: ${beta.toFixed(1)} Hz | Delta: ${delta.toFixed(1)} Hz`;

      const ff = $('focusFill'), fl = $('focusLabel');
      if (ff) ff.style.width = focusLevel + '%';
      if (fl) fl.textContent = `Focus: ${focusLevel}%`;
    }

    // Draw 4 EEG channels
    bandNames.forEach((band, i) => {
      const y0 = i * (bandH + 8) + 35;

      // Channel background
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, y0, W * 0.75, bandH);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeRect(0, y0, W * 0.75, bandH);

      // Band label
      ctx.fillStyle = colors[band];
      ctx.font = 'bold 10px Orbitron';
      ctx.fillText(band.toUpperCase(), 5, y0 + 14);

      // Frequency label
      const freqRanges = { delta: '0.5-4 Hz', theta: '4-8 Hz', alpha: '8-13 Hz', beta: '13-30 Hz' };
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '8px Orbitron';
      ctx.fillText(freqRanges[band], 5, y0 + bandH - 4);

      // Waveform
      const data = eegData[band];
      if (data.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = colors[band];
      ctx.lineWidth = 1.5;
      ctx.shadowColor = colors[band];
      ctx.shadowBlur = 4;
      data.forEach((v, j) => {
        const x = j * (W * 0.75 / data.length);
        const y = y0 + bandH / 2 - v;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    drawTransmissionRings();
    drawSpectralBars();
    drawFocusMeter();
    drawModeIndicator();

    // Ambient brain particles
    if (eegRunning) {
      for (let i = 0; i < 3; i++) {
        const px = Math.random() * W * 0.75;
        const py = Math.random() * H;
        ctx.fillStyle = `rgba(150,100,255,${Math.random() * 0.15})`;
        ctx.fillRect(px, py, 2, 2);
      }
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Wire up controls
  const startBtn = $('startBtn'), relaxBtn = $('relaxBtn'), focusBtn = $('focusBtn'), txBtn = $('txBtn');
  const s = LANG[currentLang];

  if (startBtn) startBtn.onclick = () => {
    eegRunning = !eegRunning;
    setStatus(eegRunning);
    const span = startBtn.querySelector('[data-i18n]');
    const s2 = LANG[currentLang];
    if (span) span.textContent = eegRunning ? (s2.stopEEG || 'Stop') : s2.startEEG;
    log(eegRunning ? s2.eegStarted : s2.eegStopped, 'info');
    if (eegRunning) playSound('brain');
  };

  if (relaxBtn) relaxBtn.onclick = () => {
    brainMode = 'relax';
    relaxBtn.classList.add('active');
    if (focusBtn) focusBtn.classList.remove('active');
    log(LANG[currentLang].modeRelax, 'info');
    playSound('click');
  };

  if (focusBtn) focusBtn.onclick = () => {
    brainMode = 'focus';
    focusBtn.classList.add('active');
    if (relaxBtn) relaxBtn.classList.remove('active');
    log(LANG[currentLang].modeFocus, 'info');
    playSound('click');
  };

  if (txBtn) txBtn.onclick = () => {
    if (!eegRunning) { log(LANG[currentLang].needEEG, 'error'); return; }
    txCount++;
    const state = focusLevel > 60 ? 'FOCUS' : focusLevel > 40 ? 'NORMAL' : 'RELAX';
    log(`TX #${txCount}: Brain state [${state}] A:${alpha.toFixed(1)} B:${beta.toFixed(1)} T:${theta.toFixed(1)} Focus:${focusLevel}%`, 'tx');
    showToast(`Transmitted: ${state} (${focusLevel}%)`, 1500);
    playSound('tx');
    sendAppMessage('brain-state', { state, focus: focusLevel, alpha: alpha.toFixed(1), beta: beta.toFixed(1) });
  };
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BRAINWAVE RADIO ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootBrainViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(150,100,255,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- EEG band definitions --- */
    var bands=[
      {name:'Delta',freq:2,min:0.5,max:4,color:'#ffcc00',amp:35},
      {name:'Theta',freq:6,min:4,max:8,color:'#6699ff',amp:25},
      {name:'Alpha',freq:10,min:8,max:13,color:'#33ff33',amp:30},
      {name:'Beta',freq:22,min:13,max:30,color:'#ff3366',amp:22},
      {name:'Gamma',freq:45,min:30,max:100,color:'#cc66ff',amp:12}
    ];
    var bandBuffers={};
    bands.forEach(function(b){bandBuffers[b.name]=new Float32Array(W);});

    /* --- brain topographic map electrodes (10-20 system) --- */
    var electrodes=[
      {name:'Fp1',x:0.38,y:0.18},{name:'Fp2',x:0.62,y:0.18},
      {name:'F3',x:0.30,y:0.32},{name:'F4',x:0.70,y:0.32},{name:'Fz',x:0.50,y:0.28},
      {name:'C3',x:0.25,y:0.48},{name:'C4',x:0.75,y:0.48},{name:'Cz',x:0.50,y:0.45},
      {name:'P3',x:0.30,y:0.62},{name:'P4',x:0.70,y:0.62},{name:'Pz',x:0.50,y:0.60},
      {name:'O1',x:0.38,y:0.76},{name:'O2',x:0.62,y:0.76},
      {name:'T3',x:0.15,y:0.48},{name:'T4',x:0.85,y:0.48}
    ];

    /* --- state --- */
    var brainState='normal';var stateTimer=0;
    var coherenceVal=0.45;
    var topoData=[];
    for(var ei=0;ei<electrodes.length;ei++)topoData.push(0);
    var spectrogramData=[];var MAX_SPEC=80;
    var focusHistory=[];var MAX_FOCUS=200;
    var asymmetry=0;

    /* auto-cycle brain states */
    function autoState(){
      stateTimer+=0.016;
      if(stateTimer>6){
        stateTimer=0;
        var states=['normal','relax','focus','meditate'];
        brainState=states[Math.floor(Math.random()*states.length)];
      }
    }

    /* generate EEG signal for a band */
    function genEEG(freq,amp,noise){
      return Math.sin(t*freq*0.1)*amp
        +Math.sin(t*freq*0.23)*(amp*0.3)
        +Math.sin(t*freq*0.07)*(amp*0.15)
        +(Math.random()-0.5)*noise;
    }

    /* --- draw brain topographic map --- */
    function drawTopoMap(ox,oy,size){
      /* head outline */
      ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(ox+size/2,oy+size/2,size/2-5,0,Math.PI*2);ctx.stroke();
      /* nose */
      ctx.beginPath();ctx.moveTo(ox+size/2-8,oy+4);ctx.lineTo(ox+size/2,oy-4);ctx.lineTo(ox+size/2+8,oy+4);ctx.stroke();
      /* ears */
      ctx.beginPath();ctx.ellipse(ox-2,oy+size/2,5,12,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(ox+size+2,oy+size/2,5,12,0,0,Math.PI*2);ctx.stroke();

      /* heatmap interpolation */
      var imgW=80,imgH=80;
      for(var py=0;py<imgH;py++){
        for(var px=0;px<imgW;px++){
          var nx=px/imgW,ny=py/imgH;
          var dx=nx-0.5,dy=ny-0.5;
          if(dx*dx+dy*dy>0.23)continue;
          var val=0,wt=0;
          for(var ei2=0;ei2<electrodes.length;ei2++){
            var ex=electrodes[ei2].x,ey=electrodes[ei2].y;
            var d=Math.sqrt((nx-ex)*(nx-ex)+(ny-ey)*(ny-ey));
            var w=1/(d*d+0.01);
            val+=topoData[ei2]*w;wt+=w;
          }
          val=val/wt;
          var norm=Math.max(0,Math.min(1,(val+1)/2));
          var r=Math.min(255,norm*510)|0;
          var g=Math.min(255,Math.max(0,(norm-0.3)*400))|0;
          var b2=Math.max(0,(1-norm*2)*200)|0;
          ctx.fillStyle='rgba('+r+','+g+','+b2+',0.7)';
          ctx.fillRect(ox+px*(size/imgW),oy+py*(size/imgH),size/imgW+0.5,size/imgH+0.5);
        }
      }

      /* electrode dots */
      electrodes.forEach(function(e,i){
        var ex2=ox+e.x*size,ey2=oy+e.y*size;
        ctx.beginPath();ctx.arc(ex2,ey2,3,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='6px Orbitron,monospace';
        ctx.fillText(e.name,ex2+5,ey2-2);
      });

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('EEG TOPOGRAPHIC MAP',ox+5,oy-8);
    }

    /* --- draw power spectrum bars --- */
    function drawPowerSpectrum(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(ox,oy,w,h);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BAND POWER SPECTRUM',ox+5,oy+12);

      var barW=(w-20)/bands.length-4;
      bands.forEach(function(b,i){
        var bx=ox+12+i*(barW+4);
        var last=bandBuffers[b.name][W-1];
        var norm=Math.abs(last)/b.amp;
        var barH=Math.min(h-30,norm*(h-30));

        var grad=ctx.createLinearGradient(bx,oy+h-5,bx,oy+h-5-barH);
        grad.addColorStop(0,b.color);grad.addColorStop(1,b.color+'33');
        ctx.fillStyle=grad;ctx.fillRect(bx,oy+h-5-barH,barW,barH);

        ctx.fillStyle=b.color;ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(b.name[0]+b.name[1],bx+barW/2,oy+h-8-barH);
        ctx.fillStyle='rgba(255,255,255,0.3)';
        ctx.fillText(b.min+'-'+b.max,bx+barW/2,oy+h+8);
        ctx.textAlign='left';
      });
    }

    /* --- draw coherence & asymmetry panel --- */
    function drawCoherencePanel(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('HEMISPHERIC ANALYSIS',ox+5,oy+14);

      /* coherence bar */
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(ox+10,oy+24,w-20,14);
      ctx.fillStyle=coherenceVal>0.7?'#33ff33':coherenceVal>0.4?'#ffcc00':'#ff3366';
      ctx.fillRect(ox+10,oy+24,(w-20)*coherenceVal,14);
      ctx.fillStyle='#fff';ctx.font='8px Orbitron,monospace';
      ctx.fillText('Coherence: '+(coherenceVal*100).toFixed(0)+'%',ox+10,oy+52);

      /* asymmetry indicator */
      var acx=ox+w/2,acy=oy+72;
      ctx.beginPath();ctx.moveTo(ox+10,acy);ctx.lineTo(ox+w-10,acy);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(acx+asymmetry*((w-20)/2),acy,5,0,Math.PI*2);
      ctx.fillStyle=asymmetry>0?'#ff3366':'#6699ff';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('L',ox+12,acy+4);ctx.fillText('R',ox+w-18,acy+4);
      ctx.textAlign='center';ctx.fillText('ASYMMETRY',acx,acy+16);ctx.textAlign='left';

      /* brain state */
      var stateColors={normal:'#ffcc00',relax:'#33ff33',focus:'#ff3366',meditate:'#cc66ff'};
      ctx.fillStyle=stateColors[brainState]||'#fff';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('STATE: '+brainState.toUpperCase(),ox+10,oy+h-10);
    }

    /* --- draw focus/attention timeline --- */
    function drawFocusTimeline(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('FOCUS / ATTENTION TIMELINE',ox+5,oy+12);

      if(focusHistory.length>1){
        ctx.beginPath();ctx.strokeStyle='#ff3366';ctx.lineWidth=1.5;
        focusHistory.forEach(function(v,i){
          var fx=ox+(i/MAX_FOCUS)*w;
          var fy=oy+h-v/100*(h-20)-5;
          if(i===0)ctx.moveTo(fx,fy);else ctx.lineTo(fx,fy);
        });
        ctx.stroke();

        /* fill */
        ctx.beginPath();ctx.moveTo(ox,oy+h);
        focusHistory.forEach(function(v,i){
          ctx.lineTo(ox+(i/MAX_FOCUS)*w,oy+h-v/100*(h-20)-5);
        });
        ctx.lineTo(ox+(focusHistory.length/MAX_FOCUS)*w,oy+h);ctx.closePath();
        ctx.fillStyle='rgba(255,51,102,0.08)';ctx.fill();
      }
    }

    /* --- draw EEG spectrogram --- */
    function drawSpectrogram(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('EEG SPECTROGRAM (0-50Hz)',ox+5,oy+12);

      var cellW=w/64,cellH=h/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col=0;col<64;col++){
          var v=spectrogramData[row][col];
          var r2=Math.min(255,v*600)|0;
          var g2=Math.min(255,Math.max(0,(v-0.15)*500))|0;
          var b3=Math.max(0,(0.5-v)*200)|0;
          ctx.fillStyle='rgb('+r2+','+g2+','+b3+')';
          ctx.fillRect(ox+col*cellW,oy+16+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
    }

    /* --- main render loop --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      autoState();

      /* generate EEG data per band */
      var targetAlpha=brainState==='relax'?1.3:brainState==='meditate'?1.5:brainState==='focus'?0.5:1.0;
      var targetBeta=brainState==='focus'?1.5:brainState==='relax'?0.6:1.0;
      var targetTheta=brainState==='meditate'?1.4:brainState==='relax'?1.2:0.8;

      bands.forEach(function(b){
        var buf=bandBuffers[b.name];
        var scale=b.name==='Alpha'?targetAlpha:b.name==='Beta'?targetBeta:b.name==='Theta'?targetTheta:1.0;
        for(var i=0;i<W-1;i++)buf[i]=buf[i+1];
        buf[W-1]=genEEG(b.freq,b.amp*scale,b.amp*0.15);
      });

      /* update topographic data */
      electrodes.forEach(function(e,i){
        var alphaVal=bandBuffers['Alpha'][W-1]/bands[2].amp;
        var betaVal=bandBuffers['Beta'][W-1]/bands[3].amp;
        var zone=e.y<0.35?'frontal':e.y<0.55?'central':'posterior';
        var val=0;
        if(zone==='frontal')val=betaVal*0.6+alphaVal*0.3;
        else if(zone==='central')val=alphaVal*0.5+betaVal*0.3;
        else val=alphaVal*0.7+betaVal*0.2;
        val+=(Math.random()-0.5)*0.2;
        topoData[i]+=(val-topoData[i])*0.1;
      });

      /* coherence and asymmetry */
      var leftPow=0,rightPow=0,lc2=0,rc2=0;
      electrodes.forEach(function(e,i){
        if(e.x<0.5){leftPow+=Math.abs(topoData[i]);lc2++;}
        else{rightPow+=Math.abs(topoData[i]);rc2++;}
      });
      leftPow/=lc2;rightPow/=rc2;
      coherenceVal+=(1-Math.abs(leftPow-rightPow)*2-coherenceVal)*0.05;
      coherenceVal=Math.max(0,Math.min(1,coherenceVal));
      asymmetry+=(((rightPow-leftPow)/(rightPow+leftPow+0.01))-asymmetry)*0.05;

      /* focus level */
      var betaNow=Math.abs(bandBuffers['Beta'][W-1]);
      var alphaNow=Math.abs(bandBuffers['Alpha'][W-1]);
      var focus2=Math.min(100,Math.max(0,betaNow/(alphaNow+0.1)*28));
      focusHistory.push(focus2);if(focusHistory.length>MAX_FOCUS)focusHistory.shift();

      /* build spectrogram row */
      var specRow=[];
      for(var sb=0;sb<64;sb++){
        var freq2=sb*50/64;var amp2=0.02;
        bands.forEach(function(b){
          amp2+=Math.exp(-(freq2-b.freq)*(freq2-b.freq)/(b.freq*2))*Math.abs(bandBuffers[b.name][W-1])/b.amp*0.4;
        });
        amp2+=Math.random()*0.02;
        specRow.push(Math.min(1,amp2));
      }
      spectrogramData.push(specRow);if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      /* ---- LAYOUT ---- */

      /* Section 1: Top — 5 EEG waveforms stacked */
      var waveH=H*0.30;var bandH2=waveH/bands.length;
      bands.forEach(function(b,bi){
        var y0=bi*bandH2;
        ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,y0,W*0.55,bandH2-1);
        /* waveform */
        var buf2=bandBuffers[b.name];
        ctx.beginPath();ctx.strokeStyle=b.color;ctx.lineWidth=1.2;
        ctx.shadowColor=b.color;ctx.shadowBlur=3;
        for(var i2=0;i2<W*0.55;i2++){
          var idx=Math.floor(i2/(W*0.55)*W);
          var y=y0+bandH2/2-buf2[idx]/b.amp*(bandH2*0.4);
          if(i2===0)ctx.moveTo(i2,y);else ctx.lineTo(i2,y);
        }
        ctx.stroke();ctx.shadowBlur=0;
        ctx.fillStyle=b.color;ctx.font='7px Orbitron,monospace';
        ctx.fillText(b.name+' ('+b.min+'-'+b.max+'Hz)',3,y0+10);
      });

      /* Section 2: Top-right — Topographic map */
      drawTopoMap(W*0.56,0,W*0.22);

      /* Section 3: Power spectrum */
      drawPowerSpectrum(W*0.56,W*0.22+10,W*0.44-10,(H*0.30)-W*0.22-10);

      /* Section 4: Middle — Spectrogram */
      drawSpectrogram(0,waveH+5,W*0.55,H*0.22);

      /* Section 5: Middle-right — Coherence panel */
      drawCoherencePanel(W*0.56,waveH+5,W*0.44-10,H*0.22);

      /* Section 6: Bottom — Focus timeline */
      drawFocusTimeline(0,waveH+H*0.22+15,W-10,H*0.18);

      /* Section 7: Bottom stats */
      var stY=waveH+H*0.22+H*0.18+25;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(0,stY,W,H-stY);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('NEURAL METRICS',10,stY+14);
      var metrics=[
        ['Alpha Power',(Math.abs(bandBuffers['Alpha'][W-1])).toFixed(1)+' \u00b5V'],
        ['Beta Power',(Math.abs(bandBuffers['Beta'][W-1])).toFixed(1)+' \u00b5V'],
        ['Focus',focus2.toFixed(0)+'%'],
        ['Coherence',(coherenceVal*100).toFixed(0)+'%'],
        ['Asymmetry',(asymmetry>0?'R':'L')+' '+(Math.abs(asymmetry)*100).toFixed(0)+'%'],
        ['State',brainState.toUpperCase()],
        ['Theta/Beta',((Math.abs(bandBuffers['Theta'][W-1]))/(Math.abs(bandBuffers['Beta'][W-1])+0.1)).toFixed(2)]
      ];
      metrics.forEach(function(m,mi){
        var mx2=10+(mi%4)*W*0.24;
        var my2=stY+28+Math.floor(mi/4)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(m[0]+':',mx2,my2);
        ctx.fillStyle='#cc66ff';ctx.fillText(m[1],mx2+90,my2);
      });

      /* HUD corners */
      ctx.strokeStyle='rgba(150,100,255,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(150,100,255,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(150,100,255,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('EEG',W-55,17);

      requestAnimationFrame(frame);
    }

    /* click to cycle brain state */
    cvs.addEventListener('click',function(){
      var states=['normal','relax','focus','meditate'];
      var idx=states.indexOf(brainState);
      brainState=states[(idx+1)%states.length];
      stateTimer=0;
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootBrainViz);
  else setTimeout(bootBrainViz,200);
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
