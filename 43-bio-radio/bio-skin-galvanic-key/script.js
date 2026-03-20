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

const LANG = {
  en: {
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
    howto_1: 'Click Start GSR to begin measurement.', howto_2: 'Collect at least 50 samples.', howto_3: 'Click Generate Key for a 256-bit key.',
    wiki_gsr_title: '\ud83d\udca7 Galvanic Skin Response', wiki_gsr: 'Skin conductance: 1-20 microsiemens. Stress increases sweat and conductance.',
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
    gsrStarted: 'GSR measurement started', gsrStopped: 'GSR stopped', needData: 'Collect more GSR data (need 50+ samples)', keyGenerated: 'Key generated',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates bio-signals! 🔬 You get to experiment with body signals into radio in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real body signals into radio so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real biometric radio technology! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Bio Brainwave Radio and Bio Nerve Impulse Detector! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr: {
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
    howto_1: 'Cliquez D\u00e9marrer GSR.', howto_2: 'Collectez 50+ \u00e9chantillons.', howto_3: 'Cliquez G\u00e9n\u00e9rer Cl\u00e9.',
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
    gsrStarted: 'Mesure GSR d\u00e9marr\u00e9e', gsrStopped: 'GSR arr\u00eat\u00e9', needData: 'Collectez plus (50+ \u00e9chantillons)', keyGenerated: 'Cl\u00e9 g\u00e9n\u00e9r\u00e9e',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Brainwave Radio and Bio Nerve Impulse Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar: {
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
    howto_1: '\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 GSR.', howto_2: '\u0627\u062c\u0645\u0639 50+ \u0639\u064a\u0646\u0629.', howto_3: '\u0627\u0646\u0642\u0631 \u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d.',
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
    gsrStarted: '\u0628\u062f\u0623 \u0642\u064a\u0627\u0633 GSR', gsrStopped: '\u062a\u0648\u0642\u0641 GSR', needData: '\u0627\u062c\u0645\u0639 \u0628\u064a\u0627\u0646\u0627\u062a \u0623\u0643\u062b\u0631 (50+)', keyGenerated: '\u062a\u0645 \u062a\u0648\u0644\u064a\u062f \u0627\u0644\u0645\u0641\u062a\u0627\u062d',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Brainwave Radio and Bio Nerve Impulse Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
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
