/**
 * Workshop DIY — Bio Body Antenna v1.0
 * Human body as 1.8 MHz antenna — impedance measurement
 * Self-contained: i18n · framework · simulation
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;

const FOOTER_ICON = '';
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
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {
    title: 'Bio Body Antenna',
    subtitle: 'Your body is a 1.8 MHz antenna',
    disconnected: 'Disconnected',
    connected: 'Connected',
    mainSection: 'Body Antenna — Impedance Measurement',
    mainDesc: 'Human body as 1.8 MHz receiving antenna with impedance analysis',
    sectionA: 'A — How It Works',
    sectionB: 'B — Live Spectrum',
    sectionC: 'C — Challenges',
    startScan: 'Start Scan',
    stopScan: 'Stop',
    touchBody: 'Touch Body',
    groundBtn: 'Ground',
    sweepBtn: 'Freq Sweep',
    statSWR: 'SWR',
    statGain: 'dBi',
    statZ: '\u2126 impedance',
    step1Title: 'Body as Antenna',
    step1Desc: 'The human body acts as a ~1.7m antenna, resonant near 1.8 MHz. micro:bit ADC measures the RF signal picked up.',
    step2Title: 'Impedance Probe',
    step2Desc: 'A simple bridge circuit measures body impedance — the complex resistance to RF signals at different frequencies.',
    step3Title: 'SWR Calculation',
    step3Desc: 'Standing Wave Ratio shows how well the body antenna is matched. SWR = 1.0 is perfect, higher means mismatch.',
    step4Title: 'Signal Detection',
    step4Desc: 'Touch detection changes the antenna pattern. Grounding improves reception. Nearby AM stations become audible!',
    ch1Title: 'Find the Resonance',
    ch1Desc: 'Use frequency sweep to find the exact frequency where your body has lowest SWR. Every person is different!',
    ch2Title: 'Ground Effect',
    ch2Desc: 'Touch a grounded metal surface while scanning. What happens to the impedance reading?',
    ch3Title: 'AM Radio Pickup',
    ch3Desc: 'Sweep 500 kHz to 1700 kHz. Can you detect any AM radio stations using your body as antenna?',
    faq_q1: 'Can my body really be an antenna?',
    faq_a1: 'Yes! Any conductive object can receive RF. The human body, being ~1.7m tall and conductive, resonates near 1.8 MHz as a quarter-wave antenna.',
    faq_q2: 'What is impedance?',
    faq_a2: 'Impedance (Z) is the total opposition to current flow in an AC circuit. It has real (resistance) and imaginary (reactance) parts: Z = R + jX.',
    faq_q3: 'Is this safe?',
    faq_a3: 'Absolutely. We are only measuring signals already passing through your body. No energy is transmitted into you.',
    faq_q4: 'What is SWR?',
    faq_a4: 'Standing Wave Ratio measures antenna matching quality. SWR=1.0 is perfect match, SWR>3.0 means significant mismatch and power loss.',
    howto_1: 'Click Start Scan to begin impedance measurement.',
    howto_2: 'Click Touch Body to simulate skin contact with the probe.',
    howto_3: 'Click Freq Sweep to scan across 0.5-5 MHz range.',
    howto_4: 'Click Ground to simulate connecting your body to earth ground.',
    wiki_ant_title: '\ud83d\udce1 Body Antenna Theory',
    wiki_ant: 'A 1.7m human body resonates at ~1.8 MHz (quarter-wave). Grounding one end creates a monopole antenna with ~36 ohm impedance at resonance.',
    wiki_imp_title: '\u26a1 Impedance',
    wiki_imp: 'Z = R + jX. Real part R is resistance, imaginary part jX is reactance. Measured in ohms. SWR indicates matching quality.',
    wiki_swr_title: '\ud83d\udcca Standing Wave Ratio',
    wiki_swr: 'SWR = (1+|Gamma|)/(1-|Gamma|) where Gamma is the reflection coefficient. Lower SWR means better antenna matching and more efficient signal reception.',
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
    chatPlaceholder: 'Talk to the robot...',
    newVersion: 'UPDATE',
    t_mosque: 'Mosque',
    t_zellige: 'Zellige',
    t_andalus: 'Andalus',
    t_riad: 'Riad',
    t_medina: 'Medina',
    t_space: 'Space',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\ud83d\udce1 Bio Body Antenna ready — touch to scan!',
    logCleared: 'Log cleared',
    copied: 'Copied!',
    copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English',
    themeChanged: '\ud83c\udfa8 Theme \u2192',
    scanning: 'Scanning impedance...',
    touched: 'Body contact detected!',
    grounded: 'Grounded \u2014 impedance dropped!',
    sweepDone: 'Frequency sweep complete',
    resonanceFound: 'Resonance found at',
  ,sectionCode:'Device Code'},
  fr: {
    title: 'Bio Antenne Corporelle',
    subtitle: 'Votre corps est une antenne 1.8 MHz',
    disconnected: 'D\u00e9connect\u00e9',
    connected: 'Connect\u00e9',
    mainSection: 'Antenne Corporelle \u2014 Mesure d\'imp\u00e9dance',
    mainDesc: 'Corps humain comme antenne 1.8 MHz avec analyse d\'imp\u00e9dance',
    sectionA: 'A \u2014 Comment \u00e7a marche',
    sectionB: 'B \u2014 Spectre en direct',
    sectionC: 'C \u2014 D\u00e9fis',
    startScan: 'D\u00e9marrer Scan',
    stopScan: 'Arr\u00eat',
    touchBody: 'Toucher Corps',
    groundBtn: 'Masse',
    sweepBtn: 'Balayage Fr\u00e9q',
    statSWR: 'TOS',
    statGain: 'dBi',
    statZ: '\u2126 imp\u00e9dance',
    step1Title: 'Corps Antenne',
    step1Desc: 'Le corps humain (~1.7m) agit comme une antenne, r\u00e9sonnant pr\u00e8s de 1.8 MHz. L\'ADC du micro:bit mesure le signal RF.',
    step2Title: 'Sonde Imp\u00e9dance',
    step2Desc: 'Un circuit pont mesure l\'imp\u00e9dance corporelle \u2014 la r\u00e9sistance complexe aux signaux RF.',
    step3Title: 'Calcul TOS',
    step3Desc: 'Le TOS montre la qualit\u00e9 d\'adaptation. TOS = 1.0 est parfait.',
    step4Title: 'D\u00e9tection Signal',
    step4Desc: 'Le toucher modifie le diagramme. La mise \u00e0 la masse am\u00e9liore la r\u00e9ception.',
    ch1Title: 'Trouver la R\u00e9sonance',
    ch1Desc: 'Balayez les fr\u00e9quences pour trouver votre r\u00e9sonance corporelle.',
    ch2Title: 'Effet de Masse',
    ch2Desc: 'Touchez un m\u00e9tal reli\u00e9 \u00e0 la terre pendant le scan.',
    ch3Title: 'R\u00e9ception AM',
    ch3Desc: 'Balayez 500 kHz \u00e0 1700 kHz. D\u00e9tectez des stations AM!',
    faq_q1: 'Mon corps peut-il \u00eatre une antenne?',
    faq_a1: 'Oui! Le corps humain (~1.7m) r\u00e9sonne pr\u00e8s de 1.8 MHz en tant qu\'antenne quart d\'onde.',
    faq_q2: 'Qu\'est-ce que l\'imp\u00e9dance?',
    faq_a2: 'Z = R + jX est l\'opposition totale au courant AC. Partie r\u00e9elle R = r\u00e9sistance, partie imaginaire jX = r\u00e9actance.',
    faq_q3: 'Est-ce s\u00fbr?',
    faq_a3: 'Oui, nous mesurons uniquement les signaux ambiants passant d\u00e9j\u00e0 par votre corps.',
    faq_q4: 'Qu\'est-ce que le TOS?',
    faq_a4: 'Le Taux d\'Ondes Stationnaires mesure l\'adaptation. TOS=1.0 est parfait, TOS>3.0 signifie un d\u00e9s\u00e9quilibre important.',
    howto_1: 'Cliquez D\u00e9marrer Scan pour commencer.',
    howto_2: 'Cliquez Toucher Corps pour simuler le contact.',
    howto_3: 'Cliquez Balayage Fr\u00e9q pour scanner 0.5-5 MHz.',
    howto_4: 'Cliquez Masse pour simuler la mise \u00e0 la terre.',
    wiki_ant_title: '\ud83d\udce1 Th\u00e9orie Antenne',
    wiki_ant: 'Un corps de 1.7m r\u00e9sonne \u00e0 ~1.8 MHz (quart d\'onde). La mise \u00e0 la terre cr\u00e9e un monop\u00f4le de ~36 ohms.',
    wiki_imp_title: '\u26a1 Imp\u00e9dance',
    wiki_imp: 'Z = R + jX en ohms. Le TOS indique la qualit\u00e9 d\'adaptation.',
    wiki_swr_title: '\ud83d\udcca Taux d\'Ondes Stationnaires',
    wiki_swr: 'TOS = (1+|Gamma|)/(1-|Gamma|). Plus le TOS est bas, meilleure est l\'adaptation de l\'antenne.',
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
    chatPlaceholder: 'Parle au robot...',
    newVersion: 'MAJ',
    t_mosque: 'Mosqu\u00e9e',
    t_zellige: 'Zellige',
    t_andalus: 'Andalous',
    t_riad: 'Riad',
    t_medina: 'M\u00e9dina',
    t_space: 'Espace',
    t_jungle: 'Jungle',
    t_robot: 'Robot',
    ready: '\ud83d\udce1 Antenne corporelle pr\u00eate \u2014 touchez pour scanner!',
    logCleared: 'Journal effac\u00e9',
    copied: 'Copi\u00e9!',
    copyFail: '\u00c9chec copie',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais',
    themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
    scanning: 'Scan imp\u00e9dance...',
    touched: 'Contact corporel d\u00e9tect\u00e9!',
    grounded: 'Mass\u00e9 \u2014 imp\u00e9dance r\u00e9duite!',
    sweepDone: 'Balayage termin\u00e9',
    resonanceFound: 'R\u00e9sonance trouv\u00e9e \u00e0',
  ,sectionCode:'Code Appareil'},
  ar: {
    title: '\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645',
    subtitle: '\u062c\u0633\u0645\u0643 \u0647\u0648\u0627\u0626\u064a 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',
    connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u2014 \u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    mainDesc: '\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a \u0643\u0647\u0648\u0627\u0626\u064a \u0627\u0633\u062a\u0642\u0628\u0627\u0644 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 \u0645\u0639 \u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',
    sectionB: '\u0628 \u2014 \u0627\u0644\u0637\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631',
    sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startScan: '\u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d',
    stopScan: '\u0625\u064a\u0642\u0627\u0641',
    touchBody: '\u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645',
    groundBtn: '\u062a\u0623\u0631\u064a\u0636',
    sweepBtn: '\u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    statSWR: 'TOS',
    statGain: 'dBi',
    statZ: '\u2126 \u0645\u0639\u0627\u0648\u0642\u0629',
    step1Title: '\u0627\u0644\u062c\u0633\u0645 \u0643\u0647\u0648\u0627\u0626\u064a',
    step1Desc: '\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a (~1.7\u0645) \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632. ADC \u0627\u0644\u0645\u0627\u064a\u0643\u0631\u0648\u0628\u062a \u064a\u0642\u064a\u0633 \u0627\u0644\u0625\u0634\u0627\u0631\u0629.',
    step2Title: '\u0645\u0633\u0628\u0627\u0631 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    step2Desc: '\u062f\u0627\u0626\u0631\u0629 \u062c\u0633\u0631 \u0628\u0633\u064a\u0637\u0629 \u062a\u0642\u064a\u0633 \u0645\u0639\u0627\u0648\u0642\u0629 \u0627\u0644\u062c\u0633\u0645.',
    step3Title: '\u062d\u0633\u0627\u0628 TOS',
    step3Desc: 'TOS \u064a\u0648\u0636\u062d \u062c\u0648\u062f\u0629 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. TOS=1.0 \u0645\u062b\u0627\u0644\u064a.',
    step4Title: '\u0643\u0634\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0629',
    step4Desc: '\u0627\u0644\u0644\u0645\u0633 \u064a\u063a\u064a\u0631 \u0646\u0645\u0637 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u062d\u0633\u0646 \u0627\u0644\u0627\u0633\u062a\u0642\u0628\u0627\u0644.',
    ch1Title: '\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0631\u0646\u064a\u0646',
    ch1Desc: '\u0627\u0633\u062a\u062e\u062f\u0645 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f \u0644\u0625\u064a\u062c\u0627\u062f \u062a\u0631\u062f\u062f \u0631\u0646\u064a\u0646 \u062c\u0633\u0645\u0643.',
    ch2Title: '\u062a\u0623\u062b\u064a\u0631 \u0627\u0644\u062a\u0623\u0631\u064a\u0636',
    ch2Desc: '\u0627\u0644\u0645\u0633 \u0645\u0639\u062f\u0646\u064b\u0627 \u0645\u0624\u0631\u0636\u064b\u0627 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0645\u0633\u062d.',
    ch3Title: '\u0627\u0644\u062a\u0642\u0627\u0637 AM',
    ch3Desc: '\u0627\u0645\u0633\u062d 500 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632 \u0625\u0644\u0649 1700 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632.',
    faq_q1: '\u0647\u0644 \u064a\u0645\u0643\u0646 \u0644\u062c\u0633\u0645\u064a \u0623\u0646 \u064a\u0643\u0648\u0646 \u0647\u0648\u0627\u0626\u064a\u061f',
    faq_a1: '\u0646\u0639\u0645! \u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a (~1.7\u0645) \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 \u0643\u0647\u0648\u0627\u0626\u064a \u0631\u0628\u0639 \u0645\u0648\u062c\u0629.',
    faq_q2: '\u0645\u0627 \u0647\u064a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629\u061f',
    faq_a2: 'Z = R + jX \u0647\u064a \u0627\u0644\u0645\u0642\u0627\u0648\u0645\u0629 \u0627\u0644\u0643\u0644\u064a\u0629 \u0644\u0644\u062a\u064a\u0627\u0631 \u0627\u0644\u0645\u062a\u0631\u062f\u062f.',
    faq_q3: '\u0647\u0644 \u0647\u0630\u0627 \u0622\u0645\u0646\u061f',
    faq_a3: '\u0646\u0639\u0645\u060c \u0646\u0642\u064a\u0633 \u0641\u0642\u0637 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u062d\u064a\u0637\u0629 \u0627\u0644\u062a\u064a \u062a\u0645\u0631 \u0639\u0628\u0631 \u062c\u0633\u0645\u0643.',
    faq_q4: '\u0645\u0627 \u0647\u0648 TOS\u061f',
    faq_a4: 'TOS \u064a\u0642\u064a\u0633 \u062c\u0648\u062f\u0629 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. TOS=1.0 \u0645\u062b\u0627\u0644\u064a.',
    howto_1: '\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d \u0644\u0628\u062f\u0621 \u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629.',
    howto_2: '\u0627\u0646\u0642\u0631 \u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645 \u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0644\u0627\u0645\u0633.',
    howto_3: '\u0627\u0646\u0642\u0631 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f \u0644\u0644\u0645\u0633\u062d 0.5-5 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632.',
    howto_4: '\u0627\u0646\u0642\u0631 \u062a\u0623\u0631\u064a\u0636 \u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0648\u0635\u064a\u0644 \u0628\u0627\u0644\u0623\u0631\u0636.',
    wiki_ant_title: '\ud83d\udce1 \u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0647\u0648\u0627\u0626\u064a',
    wiki_ant: '\u062c\u0633\u0645 1.7\u0645 \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f ~1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632 (\u0631\u0628\u0639 \u0645\u0648\u062c\u0629). \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u0646\u0634\u0626 \u0647\u0648\u0627\u0626\u064a \u0623\u062d\u0627\u062f\u064a \u0627\u0644\u0642\u0637\u0628 ~36 \u0623\u0648\u0645.',
    wiki_imp_title: '\u26a1 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629',
    wiki_imp: 'Z = R + jX \u0628\u0627\u0644\u0623\u0648\u0645. TOS \u064a\u0634\u064a\u0631 \u0625\u0644\u0649 \u062c\u0648\u062f\u0629 \u0627\u0644\u062a\u0637\u0627\u0628\u0642.',
    wiki_swr_title: '\ud83d\udcca \u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u0648\u062c\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629',
    wiki_swr: 'TOS = (1+|\u0393|)/(1-|\u0393|). \u0643\u0644\u0645\u0627 \u0627\u0646\u062e\u0641\u0636 TOS \u0643\u0627\u0646 \u0627\u0644\u062a\u0637\u0627\u0628\u0642 \u0623\u0641\u0636\u0644.',
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
    chatPlaceholder: '\u062a\u062d\u062f\u062b \u0645\u0639 \u0627\u0644\u0631\u0648\u0628\u0648\u062a...',
    newVersion: '\u062a\u062d\u062f\u064a\u062b',
    t_mosque: '\u0645\u0633\u062c\u062f',
    t_zellige: '\u0632\u0644\u064a\u062c',
    t_andalus: '\u0623\u0646\u062f\u0644\u0633',
    t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629',
    t_space: '\u0641\u0636\u0627\u0621',
    t_jungle: '\u0623\u062f\u063a\u0627\u0644',
    t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\ud83d\udce1 \u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u062c\u0627\u0647\u0632 \u2014 \u0627\u0644\u0645\u0633 \u0644\u0644\u0645\u0633\u062d!',
    logCleared: '\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644',
    copied: '\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',
    copyFail: '\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062e',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    scanning: '\u0645\u0633\u062d \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629...',
    touched: '\u062a\u0645 \u0643\u0634\u0641 \u062a\u0644\u0627\u0645\u0633 \u0627\u0644\u062c\u0633\u0645!',
    grounded: '\u0645\u0624\u0631\u0636 \u2014 \u0627\u0646\u062e\u0641\u0636\u062a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629!',
    sweepDone: '\u0627\u0643\u062a\u0645\u0644 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    resonanceFound: '\u062a\u0645 \u0625\u064a\u062c\u0627\u062f \u0627\u0644\u0631\u0646\u064a\u0646 \u0639\u0646\u062f',
  ,sectionCode:'كود الجهاز'}
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
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

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
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
  playSound('success');
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  const filters = document.querySelectorAll('.log-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
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
  if (el && t) {
    t.textContent = msg || LANG[currentLang].working;
    el.style.display = 'block';
  }
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

/* ═══════ SLEEP ═══════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════ TYPEWRITER ═══════ */

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

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
  } catch { return ''; }
}

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  const h = calcHijriDate();
  if (h) el.textContent = h;
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
  try {
    const stored = localStorage.getItem('wdiy-latest-version');
    if (stored && stored !== APP_VERSION) {
      const btn = $('settingsBtn');
      if (btn && !btn.querySelector('.version-update')) {
        const badge = document.createElement('span');
        badge.className = 'version-update';
        badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
        btn.style.position = 'relative';
        badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
        btn.appendChild(badge);
      }
    }
  } catch {}
}

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
  try {
    const msg = { type, data, from: document.title, ts: Date.now() };
    localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
    localStorage.removeItem(APP_MSG_KEY);
  } catch {}
}

function onAppMessage(callback) {
  window.addEventListener('storage', e => {
    if (e.key !== APP_MSG_KEY || !e.newValue) return;
    try { callback(JSON.parse(e.newValue)); } catch {}
  });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; activateRetroTheme(); }
    } else { konamiIdx = 0; }
  });
}

function activateRetroTheme() {
  setTheme('retro');
  log('\ud83d\udd79\ufe0f KONAMI CODE ACTIVATED \u2014 RETRO MODE!', 'success');
  playSound('success');
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
  return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' ');
}

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, ''));
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(100);
    } else if (ch === '-') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(300);
    } else if (ch === '/') { await sleep(400); continue; }
    else if (ch === ' ') { await sleep(200); continue; }
    dot.style.background = orig; dot.style.boxShadow = '';
    await sleep(100);
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
  document.addEventListener('mouseup', () => {
    if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
  });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630\u0623\u0624\u0626\u0625\u0621\u0629\u0649\u0622\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false;
    cancelAnimationFrame(matrixAnim);
    canvas.classList.remove('active');
    log('\ud83d\udd34 Matrix rain off', 'info');
    return;
  }
  matrixRunning = true;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);

  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
  log('\ud83d\udfe2 Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); }
    else { logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }
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
  log('\ud83d\udc1b Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
  if (!window.DeviceMotionEvent) return;
  let lastShake = 0;
  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > 25 && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      generateBugReport();
    }
  });
}

function generateBugReport() {
  if (!logContainer) logContainer = $('logContainer');
  const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
  const report = {
    app: document.title, version: APP_VERSION,
    timestamp: new Date().toISOString(), userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`, viewport: `${innerWidth}x${innerHeight}`,
    theme: document.documentElement.dataset.theme, lang: currentLang,
    log: lines.slice(-50)
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `bug-report-${Date.now()}.json`; a.click();
  URL.revokeObjectURL(url);
  log('\ud83d\udcf1 Bug report exported (shake)', 'success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) {
        logContainer.removeChild(logContainer.lastChild);
        logHistory.pop();
        playSound('click');
      }
    }
  });
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523],
  'zellige': [440, 523, 659],
  'andalus': [294, 370, 440],
  'space': [523, 659, 784],
  'jungle': [262, 330, 392],
  'robot': [440, 554, 659],
  'riad': [349, 440, 523],
  'medina': [294, 349, 440],
  'retro': [523, 262, 523],
};

function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;
  if (breathingActive) {
    bands.forEach(b => b.classList.add('breathing'));
    log('\ud83e\udec1 Breathing guide on \u2014 inhale... exhale...', 'info');
  } else {
    bands.forEach(b => b.classList.remove('breathing'));
    if (dhikrCount > 0) log(`\ud83d\udcff Dhikr count: ${dhikrCount}`, 'success');
    dhikrCount = 0;
    log('\ud83e\udec1 Breathing guide off', 'info');
  }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    log('\ud83c\udfa4 Speech not supported', 'error');
    return;
  }
  if (whisperActive) {
    if (recognition) recognition.stop();
    whisperActive = false;
    log('\ud83c\udfa4 Whisper mode off', 'info');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const text = e.results[i][0].transcript.trim();
        if (text) log(`\ud83c\udfa4 ${text}`, 'rx');
      }
    }
  };
  recognition.onerror = e => log(`\ud83c\udfa4 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start();
  whisperActive = true;
  log('\ud83c\udfa4 Whisper mode on \u2014 speak!', 'success');
}

/* ═══════ GHOST USERS ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.className = 'ghost-canvas';
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;

  window.addEventListener('resize', () => {
    ghostCanvas.width = innerWidth; ghostCanvas.height = innerHeight;
  });

  document.addEventListener('mousemove', e => {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify({ id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now() }));
    } catch {}
  });

  const ghosts = {};
  window.addEventListener('storage', e => {
    if (e.key !== GHOST_KEY || !e.newValue) return;
    try {
      const d = JSON.parse(e.newValue);
      if (d.id === myGhostId) return;
      ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
    } catch {}
  });

  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      const age = (now - g.ts) / 3000;
      ghostCtx.globalAlpha = 0.3 * (1 - age);
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
      ghostCtx.fillStyle = accent; ghostCtx.fill();
      ghostCtx.beginPath(); ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ghostCtx.fillStyle = '#fff'; ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ NIGHT MODE ═══════ */

function initNightMode() {
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;
  if (isNight) {
    try {
      const manual = localStorage.getItem('wdiy-theme');
      if (!manual) { setTheme('mosque-gold'); log('\ud83c\udf19 Night mode', 'info'); }
    } catch {}
  }
}

/* ═══════ LOGO TRACKER ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2);
    const dy = (e.clientY - cy) / (innerHeight / 2);
    const tiltX = dy * 8, tiltY = -dx * 8;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
    const shift = dist * 4;
    logo.style.transform = `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dx * shift}px) translateY(${dy * shift}px)`;
  });
  document.addEventListener('mouseleave', () => {
    logo.style.transition = 'transform .5s ease-out';
    logo.style.transform = '';
    setTimeout(() => { logo.style.transition = ''; }, 500);
  });
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => { b.style.height = ''; b.style.opacity = ''; });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('\ud83c\udfb5 Music mode off', 'info');
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser();
    musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser);
    musicActive = true;
    log('\ud83c\udfb5 Music mode on!', 'success');
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      bands.forEach((b, i) => {
        const v = i === 0 ? bass : treble;
        b.style.height = (2 + v * 10) + 'px';
        b.style.opacity = 0.4 + v * 0.6;
      });
      cards.forEach(c => { c.style.transform = `scale(${1 + bass * 0.015})`; c.style.transition = 'transform 0.05s'; });
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => log('\ud83c\udfb5 Microphone access denied', 'error'));
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle');
  const panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';

  handle.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startW = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('active');
    document.body.style.cursor = ''; document.body.style.userSelect = '';
    try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {}
  });

  handle.addEventListener('touchstart', e => {
    dragging = true; startX = e.touches[0].clientX; startW = panel.offsetWidth;
    handle.classList.add('active'); e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('active');
    try { localStorage.setItem('wdiy-log-width', getComputedStyle(document.documentElement).getPropertyValue('--log-width')); } catch {}
  });

  try {
    const saved = localStorage.getItem('wdiy-log-width');
    if (saved) document.documentElement.style.setProperty('--log-width', saved);
  } catch {}
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
  const btn = $(returnFocusId);
  if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }

let logWasOpen = false;

function openSettings() {
  const logEl = $('logPanel');
  logWasOpen = logEl && logEl.classList.contains('open');
  if (logWasOpen) closeLog();
  openPanel('settingsPanel', 'settingsOverlay');
}

function closeSettings() {
  closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
  if (logWasOpen) { openLog(); logWasOpen = false; }
}

function openLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.add('open');
  document.body.classList.add('log-open');
}

function closeLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.remove('open');
  document.body.classList.remove('log-open');
  const btn = $('logBtn');
  if (btn) btn.focus();
}

function toggleLog() {
  const sb = $('logPanel');
  if (sb && sb.classList.contains('open')) closeLog();
  else openLog();
}

function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab');
  const contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const target = $(targetId);
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

/* ═══════ AI CHAT ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
  const s = LANG[currentLang];
  chatHistory.push({ role: 'user', content: userMsg });
  log(`\ud83d\udcac You: ${userMsg}`, 'tx');
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 150,
        system: `You are the Workshop-DIY robot assistant in a kids educational app about body antennas and RF. Keep responses SHORT (1-2 sentences). Language: ${currentLang}. Be encouraging. Add relevant emojis.`,
        messages: chatHistory.slice(-10)
      })
    });
    const data = await resp.json();
    const reply = data.content?.[0]?.text || '\ud83e\udd16 ...';
    chatHistory.push({ role: 'assistant', content: reply });
    log(`\ud83e\udd16 ${reply}`, 'rx');
    playSound('success');
  } catch { log('\ud83e\udd16 Brain offline', 'error'); }
}

function initAIChat() {
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  const chatRow = document.createElement('div');
  chatRow.className = 'chat-input-row';
  chatRow.innerHTML = `<input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." data-i18n-placeholder="chatPlaceholder" /><button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">\ud83e\udd16</span></button>`;
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  const input = $('chatInput'), sendBtn = $('chatSendBtn');
  const send = () => { const msg = input.value.trim(); if (!msg) return; input.value = ''; aiRespond(msg); };
  if (sendBtn) sendBtn.onclick = send;
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
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
    soundTgl.addEventListener('change', () => {
      soundEnabled = soundTgl.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
      if (soundEnabled) playSound('click');
    });
  }

  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  const breathBtn = $('breathingBtn');
  const dhikrDisp = $('dhikrDisplay');
  const dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => {
    toggleBreathing();
    if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
  };
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

  checkVersion();
  onAppMessage(msg => log(`\ud83d\udce8 ${msg.from}: ${msg.type}`, 'rx'));

  initKonami();
  initMorseLog();
  initMatrixTrigger();
  initDebug();
  initShakeReport();
  initTimeTravel();
  initHijriDate();
  initGhostUsers();
  initNightMode();
  initLogoTracker();
  initAIChat();

  log(LANG[currentLang].ready, 'success');

  // Init app-specific simulation
  setTimeout(initAntennaApp, 50);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BIO BODY ANTENNA SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let antennaAnim = null;
let isScanning = false;
let isTouching = false;
let isGrounded = false;
let currentFreq = 1.8;
let bodyZ = { r: 150, x: 45 };
let swr = 2.1;
let gain = -12;
let sweepData = [];
let sweepActive = false;

function initAntennaApp() {
  const canvas = $('antennaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width;
  const H = canvas.height;
  let t = 0;
  let wavePhase = 0;
  let bodyGlow = 0;

  // Human body outline points (stick figure)
  const bodyPts = [
    { x: 0.50, y: 0.08 }, { x: 0.50, y: 0.22 }, { x: 0.38, y: 0.18 },
    { x: 0.50, y: 0.22 }, { x: 0.62, y: 0.18 }, { x: 0.50, y: 0.22 },
    { x: 0.50, y: 0.48 }, { x: 0.42, y: 0.70 }, { x: 0.38, y: 0.92 },
    { x: 0.42, y: 0.70 }, { x: 0.50, y: 0.48 }, { x: 0.58, y: 0.70 },
    { x: 0.62, y: 0.92 }
  ];

  function drawBody(ctx, glow) {
    ctx.save();
    const color = glow > 0 ? '51,255,51' : '212,160,60';
    ctx.strokeStyle = `rgba(${color},${0.6 + glow * 0.4})`;
    ctx.lineWidth = 3 + glow * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = glow > 0 ? '#33ff33' : '#d4a03c';
    ctx.shadowBlur = glow * 20;
    ctx.beginPath();
    bodyPts.forEach((p, i) => {
      const px = p.x * W * 0.3 + W * 0.35;
      const py = p.y * H;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    // Head circle
    ctx.beginPath();
    ctx.arc(0.5 * W * 0.3 + W * 0.35, 0.05 * H, H * 0.04, 0, Math.PI * 2);
    ctx.stroke();
    // Ground line
    if (isGrounded) {
      ctx.strokeStyle = 'rgba(255,204,0,0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      const gx = 0.5 * W * 0.3 + W * 0.35;
      ctx.beginPath();
      ctx.moveTo(gx, 0.92 * H);
      ctx.lineTo(gx, H);
      ctx.stroke();
      ctx.setLineDash([]);
      // Ground symbol
      for (let gi = 0; gi < 3; gi++) {
        const gw = 20 - gi * 6;
        ctx.beginPath();
        ctx.moveTo(gx - gw, H - 2 - gi * 5);
        ctx.lineTo(gx + gw, H - 2 - gi * 5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawWaves(ctx, phase, strength) {
    const cx = 0.5 * W * 0.3 + W * 0.35;
    for (let ring = 0; ring < 8; ring++) {
      const r = 40 + ring * 30 + phase * 10;
      const alpha = Math.max(0, (1 - ring / 8) * strength * 0.5);
      ctx.beginPath();
      ctx.arc(cx, H * 0.45, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(51,255,51,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawSpectrum(ctx) {
    const sx = W * 0.68;
    const sy = 30;
    const sw = W * 0.28;
    const sh = H - 60;

    // Box
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(sx, sy, sw, sh);

    // Grid
    for (let i = 0; i < 5; i++) {
      const gy = sy + sh * i / 4;
      ctx.beginPath();
      ctx.moveTo(sx, gy);
      ctx.lineTo(sx + sw, gy);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Orbitron,monospace';
    ctx.fillText('0.5MHz', sx, sy + sh + 12);
    ctx.fillText('5MHz', sx + sw - 30, sy + sh + 12);
    ctx.fillText('|Z|', sx - 20, sy + 10);

    // Sweep data
    if (sweepData.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#33ff33';
      ctx.lineWidth = 2;
      sweepData.forEach((d, i) => {
        const px = sx + i / sweepData.length * sw;
        const py = sy + sh - d.z / 600 * sh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // SWR overlay
      ctx.beginPath();
      ctx.strokeStyle = '#ff6633';
      ctx.lineWidth = 1;
      sweepData.forEach((d, i) => {
        const px = sx + i / sweepData.length * sw;
        const py = sy + sh - Math.min(d.swr / 10, 1) * sh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Current freq marker
    const fx = sx + ((currentFreq - 0.5) / 4.5) * sw;
    ctx.beginPath();
    ctx.moveTo(fx, sy);
    ctx.lineTo(fx, sy + sh);
    ctx.strokeStyle = 'rgba(255,204,0,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 11px Orbitron';
    ctx.fillText(`${currentFreq.toFixed(3)}`, fx - 20, sy - 5);
  }

  function drawImpedance(ctx) {
    const ix = W * 0.02;
    const iy = H * 0.75;
    const iw = W * 0.55;
    const ih = H * 0.2;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(ix, iy, iw, ih);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(ix, iy, iw, ih);

    ctx.fillStyle = '#d4a03c';
    ctx.font = 'bold 13px Orbitron';
    ctx.fillText(`Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`, ix + 10, iy + 20);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Orbitron';
    ctx.fillText(`SWR: ${swr.toFixed(2)}  Gain: ${gain.toFixed(1)} dBi`, ix + 10, iy + 40);
    ctx.fillText(`Freq: ${currentFreq.toFixed(3)} MHz`, ix + 10, iy + 58);

    // Touch / Ground indicators
    if (isTouching) {
      ctx.fillStyle = '#33ff33';
      ctx.fillText('\u270b TOUCH', ix + iw - 80, iy + 20);
    }
    if (isGrounded) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillText('\u26a1 GND', ix + iw - 80, iy + 40);
    }
  }

  function drawSmithChart(ctx) {
    const scx = W * 0.12;
    const scy = H * 0.35;
    const scr = H * 0.15;

    // Outer circle
    ctx.beginPath();
    ctx.arc(scx, scy, scr, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner circles
    for (let r = 0.25; r < 1; r += 0.25) {
      ctx.beginPath();
      ctx.arc(scx + scr * (1 - r), scy, scr * r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.stroke();
    }

    // Impedance point
    const normR = bodyZ.r / 50;
    const normX = bodyZ.x / 50;
    const gamma_r = (normR * normR + normX * normX - 1) / ((normR + 1) * (normR + 1) + normX * normX);
    const gamma_i = (2 * normX) / ((normR + 1) * (normR + 1) + normX * normX);
    const px = scx + gamma_r * scr;
    const py = scy - gamma_i * scr;

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = isScanning ? '#33ff33' : '#d4a03c';
    ctx.shadowColor = isScanning ? '#33ff33' : '#d4a03c';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Orbitron';
    ctx.fillText('Smith', scx - 14, scy + scr + 12);
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;
    wavePhase = (wavePhase + 0.03) % 1;

    if (isScanning) bodyGlow = Math.min(1, bodyGlow + 0.02);
    else bodyGlow = Math.max(0, bodyGlow - 0.01);

    drawWaves(ctx, wavePhase, isScanning ? 0.8 : 0.1);
    drawBody(ctx, bodyGlow);
    drawSmithChart(ctx);
    drawSpectrum(ctx);
    drawImpedance(ctx);

    // Noise floor particles
    if (isScanning) {
      for (let i = 0; i < 20; i++) {
        const nx = Math.random() * W;
        const ny = Math.random() * H;
        ctx.fillStyle = `rgba(51,255,51,${Math.random() * 0.1})`;
        ctx.fillRect(nx, ny, 2, 2);
      }
    }

    // Ambient RF waves from left
    if (isScanning) {
      for (let w = 0; w < 5; w++) {
        const wx = (t * 60 + w * 80) % (W * 0.6);
        const wy = H * 0.3 + Math.sin(wx * 0.02 + w) * 40;
        ctx.beginPath();
        ctx.moveTo(wx, wy - 10);
        ctx.lineTo(wx + 20, wy);
        ctx.lineTo(wx, wy + 10);
        ctx.strokeStyle = `rgba(100,200,255,${0.15 - w * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    antennaAnim = requestAnimationFrame(frame);
  }
  frame();

  // Wire up controls
  const startBtn = $('startBtn');
  const touchBtn = $('touchBtn');
  const groundBtnEl = $('groundBtn');
  const sweepBtnEl = $('sweepBtn');

  if (startBtn) startBtn.onclick = () => {
    isScanning = !isScanning;
    setStatus(isScanning);
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = isScanning ? (LANG[currentLang].stopScan || 'Stop') : LANG[currentLang].startScan;
    log(isScanning ? LANG[currentLang].scanning : 'Scan stopped', 'info');
    if (isScanning) updateImpedance();
  };

  if (touchBtn) touchBtn.onclick = () => {
    isTouching = !isTouching;
    touchBtn.classList.toggle('active', isTouching);
    log(LANG[currentLang].touched, 'success');
    updateImpedance();
  };

  if (groundBtnEl) groundBtnEl.onclick = () => {
    isGrounded = !isGrounded;
    groundBtnEl.classList.toggle('active', isGrounded);
    log(LANG[currentLang].grounded, 'success');
    updateImpedance();
  };

  if (sweepBtnEl) sweepBtnEl.onclick = startSweep;
}

function updateImpedance() {
  const f = currentFreq;
  const resonantF = 1.8 + (isTouching ? -0.15 : 0.05) + (isGrounded ? -0.3 : 0);
  const delta = Math.abs(f - resonantF);

  bodyZ.r = 36 + delta * 80 + (isTouching ? -10 : 20) + (isGrounded ? -15 : 0) + Math.random() * 5;
  bodyZ.x = (f - resonantF) * 120 + Math.random() * 10;

  const zMag = Math.sqrt(bodyZ.r * bodyZ.r + bodyZ.x * bodyZ.x);
  swr = Math.max(1, (zMag > 50 ? zMag / 50 : 50 / zMag));
  gain = -15 + 10 / swr + (isGrounded ? 3 : 0);

  // Update UI elements
  const fill = $('impedanceFill');
  const label = $('impedanceLabel');
  if (fill) fill.style.width = Math.min(100, zMag / 5) + '%';
  if (label) label.textContent = `Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`;

  const sf = $('statFreq');
  const ss = $('statSWR');
  const sg = $('statGain');
  const sz = $('statZ');
  const fd = $('freqDisplay');

  if (sf) sf.textContent = currentFreq.toFixed(3);
  if (ss) ss.textContent = swr.toFixed(1);
  if (sg) sg.textContent = gain.toFixed(1);
  if (sz) sz.textContent = Math.round(zMag);
  if (fd) fd.textContent = `${currentFreq.toFixed(3)} MHz`;
}

async function startSweep() {
  if (sweepActive) return;
  sweepActive = true;
  sweepData = [];
  const s = LANG[currentLang];

  log('Starting frequency sweep 0.5-5.0 MHz...', 'info');
  showToast(s.scanning, 3000);

  let bestSWR = 999;
  let bestFreq = 1.8;

  for (let f = 0.5; f <= 5.0; f += 0.05) {
    currentFreq = f;
    updateImpedance();

    const zMag = Math.sqrt(bodyZ.r * bodyZ.r + bodyZ.x * bodyZ.x);
    sweepData.push({ f, z: zMag, swr });

    if (swr < bestSWR) { bestSWR = swr; bestFreq = f; }
    await sleep(30);
  }

  currentFreq = bestFreq;
  updateImpedance();

  log(`${s.sweepDone}! ${s.resonanceFound} ${bestFreq.toFixed(3)} MHz (SWR ${bestSWR.toFixed(2)})`, 'success');
  hideToast();
  sweepActive = false;
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
