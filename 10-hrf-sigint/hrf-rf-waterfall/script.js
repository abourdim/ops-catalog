/**
 * RF Waterfall — Spectrum Display
 * Workshop DIY — v1.2
 * Live waterfall showing WiFi, Bluetooth, FM, keyfobs
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch(type) {
    case 'click': osc.frequency.value=800; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break;
    case 'success': osc.frequency.value=523; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break;
    case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'RF Waterfall', subtitle:'RF Waterfall \u2014 Spectrum Display',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'RF Waterfall Display', mainDesc:'Live waterfall showing WiFi, Bluetooth, FM, keyfobs',
    sectionA:'Detected Signals', sectionB:'RF Spectrum Guide', sectionC:'Frequency Database',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', theme:'Theme',
    settings:'\u2699\uFE0F Settings', language:'Language',
    help:'\u2753 Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'Click Start Scan to begin the waterfall display.',
    howto_2:'Adjust center frequency and span to zoom into bands.',
    howto_3:'Use presets to quickly jump to FM, WiFi, or ISM bands.',
    howto_4:'Watch the signal list for detected transmissions.',
    wiki_waterfall_title:'Waterfall Display', wiki_waterfall:'A waterfall plot scrolls downward showing power across frequencies. Brighter colors = stronger signals.',
    wiki_bands_title:'Common Bands', wiki_bands:'FM: 88-108 MHz, ISM: 433/915 MHz, WiFi 2.4GHz, BLE, WiFi 5GHz.',
    wiki_themes_title:'Themes', wiki_themes:'8 built-in themes.',
    wiki_i18n_title:'Languages', wiki_i18n:'Trilingual: EN, FR, AR.',
    wiki_log_title:'Activity Log', wiki_log:'Timestamped, color-coded log.',
    wiki_privacy_title:'Privacy', wiki_privacy:'100% local. No tracking.',
    working:'Working\u2026',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 RF Waterfall ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    filterAll:'All', soundEffects:'Sound effects',
    whisperMode:'Whisper mode', breathingGuide:'Breathing guide', dhikrTap:'Tap',
    musicMode:'Music reactive', splashHint:'tap to skip',
    langChanged:'\uD83C\uDF10 Language \u2192 English', themeChanged:'\uD83C\uDFA8 Theme \u2192',
    startScan:'Start Scan', stopScan:'Stop', clearWf:'Clear',
    speed:'Speed:', freqTuner:'Frequency Tuner', centerFreq:'Center (MHz):',
    spanLabel:'Span (MHz):', fullSpan:'Full 0-6GHz', colorScale:'Color Scale (dBm)',
    signalHint:'Signals are detected automatically during scanning.',
    // Guide
    guideTitle:'Understanding the RF Spectrum',
    guideP1:'The electromagnetic spectrum from 0\u20136 GHz contains many services.',
    guideP2:'FM radio (88\u2013108 MHz), ISM bands (433 MHz keyfobs, 915 MHz sensors), WiFi (2.4 & 5 GHz), Bluetooth/BLE (2.4 GHz).',
    guideP3:'A waterfall display scrolls time downward. Each row is one sweep across your chosen frequency range.',
    // DB
    dbTitle:'Common Frequency Allocations',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR or HackRF. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Hrf Signal Hunter and Hrf Rf Fingerprinter! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title:'Cascade RF', subtitle:'Cascade RF \u2014 Affichage Spectral',
    disconnected:'D\u00e9connect\u00e9', connected:'Connect\u00e9',
    mainSection:'Affichage Cascade RF', mainDesc:'Cascade en direct : WiFi, Bluetooth, FM, t\u00e9l\u00e9commandes',
    sectionA:'Signaux D\u00e9tect\u00e9s', sectionB:'Guide du Spectre RF', sectionC:'Base de Fr\u00e9quences',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements et messages',
    clear:'Effacer', copy:'Copier', export:'Exporter', theme:'Th\u00e8me',
    settings:'\u2699\uFE0F Param\u00e8tres', language:'Langue',
    help:'\u2753 Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'Cliquez D\u00e9marrer pour lancer la cascade.', howto_2:'Ajustez la fr\u00e9quence et la plage.',
    howto_3:'Utilisez les pr\u00e9r\u00e9glages pour les bandes.', howto_4:'Surveillez la liste des signaux.',
    wiki_waterfall_title:'Affichage Cascade', wiki_waterfall:'La cascade d\u00e9file vers le bas montrant la puissance sur les fr\u00e9quences.',
    wiki_bands_title:'Bandes Courantes', wiki_bands:'FM: 88-108 MHz, ISM: 433/915 MHz, WiFi 2.4/5 GHz.',
    wiki_themes_title:'Th\u00e8mes', wiki_themes:'8 th\u00e8mes int\u00e9gr\u00e9s.',
    wiki_i18n_title:'Langues', wiki_i18n:'Trilingue : EN, FR, AR.',
    wiki_log_title:'Journal', wiki_log:'Journal horodat\u00e9 et color\u00e9.',
    wiki_privacy_title:'Confidentialit\u00e9', wiki_privacy:'100% local. Pas de tracking.',
    working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'M\u00e9dina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 Cascade RF pr\u00eate !',
    logCleared:'Journal effac\u00e9', copied:'Copi\u00e9 !', copyFail:'\u00c9chec',
    filterAll:'Tout', soundEffects:'Effets sonores',
    whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire', dhikrTap:'Tap',
    musicMode:'R\u00e9actif musique', splashHint:'appuyer pour passer',
    langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais', themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
    startScan:'D\u00e9marrer', stopScan:'Arr\u00eat', clearWf:'Effacer',
    speed:'Vitesse :', freqTuner:'Accord Fr\u00e9quence', centerFreq:'Centre (MHz) :',
    spanLabel:'Plage (MHz) :', fullSpan:'Plein 0-6GHz', colorScale:'\u00c9chelle Couleur (dBm)',
    signalHint:'Les signaux sont d\u00e9tect\u00e9s automatiquement pendant le scan.',
    guideTitle:'Comprendre le Spectre RF',
    guideP1:'Le spectre de 0 \u00e0 6 GHz contient de nombreux services.',
    guideP2:'FM (88\u2013108 MHz), ISM (433 MHz), WiFi (2.4 & 5 GHz), Bluetooth (2.4 GHz).',
    guideP3:'La cascade d\u00e9file le temps vers le bas. Chaque ligne est un balayage.',
    dbTitle:'Allocations de Fr\u00e9quences',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Signal Hunter and Hrf Rf Fingerprinter ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title:'\u0634\u0644\u0627\u0644 RF', subtitle:'\u0634\u0644\u0627\u0644 RF \u2014 \u0639\u0631\u0636 \u0627\u0644\u0637\u064A\u0641',
    disconnected:'\u063A\u064A\u0631 \u0645\u062A\u0635\u0644', connected:'\u0645\u062A\u0635\u0644',
    mainSection:'\u0639\u0631\u0636 \u0634\u0644\u0627\u0644 RF', mainDesc:'\u0634\u0644\u0627\u0644 \u0645\u0628\u0627\u0634\u0631: WiFi\u060C Bluetooth\u060C FM\u060C \u0645\u0641\u0627\u062A\u064A\u062D',
    sectionA:'\u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0634\u0641\u0629', sectionB:'\u062F\u0644\u064A\u0644 \u0627\u0644\u0637\u064A\u0641 RF', sectionC:'\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u062A\u0631\u062F\u062F\u0627\u062A',
    activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear:'\u0645\u0633\u062D', copy:'\u0646\u0633\u062E', export:'\u062A\u0635\u062F\u064A\u0631', theme:'\u0627\u0644\u0645\u0638\u0647\u0631',
    settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A', language:'\u0627\u0644\u0644\u063A\u0629',
    help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629', faq:'\u0623\u0633\u0626\u0644\u0629', howto:'\u0643\u064A\u0641', wiki:'\u0648\u064A\u0643\u064A',
    howto_1:'\u0627\u0646\u0642\u0631 \u0628\u062F\u0621 \u0627\u0644\u0645\u0633\u062D \u0644\u0628\u062F\u0621 \u0627\u0644\u0634\u0644\u0627\u0644.', howto_2:'\u0627\u0636\u0628\u0637 \u0627\u0644\u062A\u0631\u062F\u062F \u0648\u0627\u0644\u0646\u0637\u0627\u0642.',
    howto_3:'\u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0639\u0629.', howto_4:'\u0631\u0627\u0642\u0628 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A.',
    wiki_waterfall_title:'\u0639\u0631\u0636 \u0627\u0644\u0634\u0644\u0627\u0644', wiki_waterfall:'\u064A\u0639\u0631\u0636 \u0627\u0644\u0634\u0644\u0627\u0644 \u0627\u0644\u0637\u0627\u0642\u0629 \u0639\u0628\u0631 \u0627\u0644\u062A\u0631\u062F\u062F\u0627\u062A.',
    wiki_bands_title:'\u0627\u0644\u0646\u0637\u0627\u0642\u0627\u062A', wiki_bands:'FM: 88-108 MHz, ISM: 433/915 MHz, WiFi 2.4/5 GHz.',
    wiki_themes_title:'\u0627\u0644\u0645\u0638\u0627\u0647\u0631', wiki_themes:'8 \u0645\u0638\u0627\u0647\u0631.',
    wiki_i18n_title:'\u0627\u0644\u0644\u063A\u0627\u062A', wiki_i18n:'\u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0644\u063A\u0629.',
    wiki_log_title:'\u0627\u0644\u0633\u062C\u0644', wiki_log:'\u0633\u062C\u0644 \u0645\u0624\u0631\u062E.',
    wiki_privacy_title:'\u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629', wiki_privacy:'\u0645\u062D\u0644\u064A 100%.',
    working:'\u062C\u0627\u0631\u064D\u2026',
    t_mosque:'\u0645\u0633\u062C\u062F', t_zellige:'\u0632\u0644\u064A\u062C', t_andalus:'\u0623\u0646\u062F\u0644\u0633', t_riad:'\u0631\u064A\u0627\u0636', t_medina:'\u0645\u062F\u064A\u0646\u0629',
    t_space:'\u0641\u0636\u0627\u0621', t_jungle:'\u0623\u062F\u063A\u0627\u0644', t_robot:'\u0631\u0648\u0628\u0648\u062A',
    ready:'\uD83D\uDE80 \u0634\u0644\u0627\u0644 RF \u062C\u0627\u0647\u0632!',
    logCleared:'\u062A\u0645 \u0645\u0633\u062D \u0627\u0644\u0633\u062C\u0644', copied:'\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!', copyFail:'\u0641\u0634\u0644',
    filterAll:'\u0627\u0644\u0643\u0644', soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A \u0635\u0648\u062A\u064A\u0629',
    whisperMode:'\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633', breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633', dhikrTap:'\u0627\u0636\u063A\u0637',
    musicMode:'\u062A\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064A\u0642\u064A', splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',
    langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629', themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    startScan:'\u0628\u062F\u0621 \u0627\u0644\u0645\u0633\u062D', stopScan:'\u0625\u064A\u0642\u0627\u0641', clearWf:'\u0645\u0633\u062D',
    speed:'\u0627\u0644\u0633\u0631\u0639\u0629:', freqTuner:'\u0645\u0648\u0627\u0644\u0641 \u0627\u0644\u062A\u0631\u062F\u062F', centerFreq:'\u0627\u0644\u0645\u0631\u0643\u0632 (MHz):',
    spanLabel:'\u0627\u0644\u0646\u0637\u0627\u0642 (MHz):', fullSpan:'\u0643\u0627\u0645\u0644 0-6GHz', colorScale:'\u0645\u0642\u064A\u0627\u0633 \u0627\u0644\u0644\u0648\u0646 (dBm)',
    signalHint:'\u064A\u062A\u0645 \u0627\u0643\u062A\u0634\u0627\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627.',
    guideTitle:'\u0641\u0647\u0645 \u0627\u0644\u0637\u064A\u0641 RF',
    guideP1:'\u0627\u0644\u0637\u064A\u0641 \u0645\u0646 0 \u0625\u0644\u0649 6 GHz \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u062E\u062F\u0645\u0627\u062A \u0643\u062B\u064A\u0631\u0629.',
    guideP2:'FM (88-108 MHz)\u060C ISM (433 MHz)\u060C WiFi (2.4 & 5 GHz)\u060C Bluetooth.',
    guideP3:'\u0627\u0644\u0634\u0644\u0627\u0644 \u064A\u0645\u0631\u0631 \u0627\u0644\u0632\u0645\u0646 \u0644\u0644\u0623\u0633\u0641\u0644. \u0643\u0644 \u0633\u0637\u0631 \u0647\u0648 \u0645\u0633\u062D \u0648\u0627\u062D\u062F.',
    dbTitle:'\u062A\u062E\u0635\u064A\u0635\u0627\u062A \u0627\u0644\u062A\u0631\u062F\u062F\u0627\u062A',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Signal Hunter and Hrf Rf Fingerprinter! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k=el.dataset.i18n; if(s[k]!=null) el.textContent=s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k=opt.dataset.i18nOpt; if(s[k]!=null) opt.textContent=s[k]; });
  document.title = `${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir = lang==='ar'?'rtl':'ltr';
  document.documentElement.lang = lang;
  const sel=$('langSelect'); if(sel) sel.value=lang;
  try{localStorage.setItem('wdiy-lang',lang);}catch{}
  log(s.langChanged,'info');
  buildGuide(); buildDatabase();
}

/* ═══════ THEMES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],
  'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],
  'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]
};
function setTheme(name) {
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect'); if(sel) sel.value=name;
  try{localStorage.setItem('wdiy-theme',name);}catch{}
  playThemeMelody(name);
  const s=LANG[currentLang]; log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');
}
function playThemeMelody(n){
  if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx();
  const notes=THEME_MELODIES[n]; if(!notes)return; const t=audioCtx.currentTime;
  notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer'); if(!logContainer)return;
  const d=document.createElement('div'); d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d); logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success'); else if(type==='error')playSound('error');
  applyLogFilter();
}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ TOAST ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}

/* ═══════ STATUS ═══════ */
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ PANELS ═══════ */
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}

/* ═══════ LOG RESIZE ═══════ */
function initLogResize(){
  const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;
  let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';
  handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;handle.classList.add('active');document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});
  document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;handle.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';});
  try{const saved=localStorage.getItem('wdiy-log-width');if(saved)document.documentElement.style.setProperty('--log-width',saved);}catch{}
}

/* ═══════ BREATHING + DHIKR ═══════ */
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive){bands.forEach(b=>b.classList.add('breathing'));log('Breathing guide on','info');}else{bands.forEach(b=>b.classList.remove('breathing'));log('Breathing guide off','info');}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: RF WATERFALL SIMULATION
   ═══════════════════════════════════════════════════════════════ */

/* Known signal definitions (frequency in MHz, bandwidth in MHz) */
const KNOWN_SIGNALS = [
  { name:'FM Radio (88-108)', freqStart:88, freqEnd:108, power:-30, color:'#ff6600', type:'FM' },
  { name:'ISM 433 MHz (Keyfobs)', freqStart:432, freqEnd:434, power:-50, color:'#00ff00', type:'ISM' },
  { name:'ISM 868 MHz (EU)', freqStart:867, freqEnd:869, power:-60, color:'#00cc88', type:'ISM' },
  { name:'ISM 915 MHz (US)', freqStart:914, freqEnd:916, power:-55, color:'#88ff00', type:'ISM' },
  { name:'WiFi 2.4 GHz Ch1', freqStart:2401, freqEnd:2423, power:-40, color:'#0088ff', type:'WiFi' },
  { name:'WiFi 2.4 GHz Ch6', freqStart:2426, freqEnd:2448, power:-45, color:'#0066cc', type:'WiFi' },
  { name:'WiFi 2.4 GHz Ch11', freqStart:2451, freqEnd:2473, power:-42, color:'#0044aa', type:'WiFi' },
  { name:'BLE Advertising', freqStart:2402, freqEnd:2480, power:-75, color:'#cc00ff', type:'BLE' },
  { name:'WiFi 5 GHz (UNII-1)', freqStart:5150, freqEnd:5250, power:-48, color:'#ff0066', type:'WiFi' },
  { name:'WiFi 5 GHz (UNII-3)', freqStart:5725, freqEnd:5850, power:-52, color:'#ff0044', type:'WiFi' },
  { name:'GPS L1', freqStart:1574, freqEnd:1576, power:-90, color:'#ffff00', type:'GPS' },
  { name:'LTE Band 7 (2600)', freqStart:2500, freqEnd:2570, power:-65, color:'#ff8800', type:'LTE' },
];

/* Frequency database for Section C */
const FREQ_DB = [
  {band:'FM Broadcast', range:'88 \u2013 108 MHz', use:'Commercial radio stations'},
  {band:'ISM 433 MHz', range:'433.05 \u2013 434.79 MHz', use:'Keyfobs, weather stations, garage doors'},
  {band:'ISM 868 MHz', range:'868 \u2013 870 MHz', use:'LoRa, smart meters (Europe)'},
  {band:'ISM 915 MHz', range:'902 \u2013 928 MHz', use:'LoRa, RFID (Americas)'},
  {band:'GPS L1', range:'1575.42 MHz', use:'GPS navigation satellites'},
  {band:'WiFi 2.4 GHz', range:'2400 \u2013 2483 MHz', use:'WiFi, Bluetooth, ZigBee, microwave ovens'},
  {band:'LTE Band 7', range:'2500 \u2013 2690 MHz', use:'4G/LTE mobile data'},
  {band:'WiFi 5 GHz', range:'5150 \u2013 5850 MHz', use:'WiFi 5/6, radar (DFS)'},
];

let scanning = false;
let animFrame = null;
let wfCanvas, wfCtx, wfW, wfH;
let centerMHz = 2450, spanMHz = 500;
let scrollSpeed = 60;
let detectedSignals = new Map();

/* Color map: blue -> cyan -> green -> yellow -> red -> white */
function powerToColor(dBm) {
  // -120 dBm = noise floor (dark blue), 0 dBm = max (white)
  const t = Math.max(0, Math.min(1, (dBm + 120) / 120));
  let r,g,b;
  if (t < 0.2) { r=0; g=0; b=Math.floor(t/0.2*255); }
  else if (t < 0.4) { const u=(t-0.2)/0.2; r=0; g=Math.floor(u*255); b=255; }
  else if (t < 0.6) { const u=(t-0.4)/0.2; r=0; g=255; b=Math.floor((1-u)*255); }
  else if (t < 0.8) { const u=(t-0.6)/0.2; r=Math.floor(u*255); g=255; b=0; }
  else { const u=(t-0.8)/0.2; r=255; g=Math.floor((1-u)*255+u*255); b=Math.floor(u*255); }
  return `rgb(${r},${g},${b})`;
}

function freqToX(freqMHz) {
  const fMin = centerMHz - spanMHz/2;
  const fMax = centerMHz + spanMHz/2;
  return ((freqMHz - fMin) / (fMax - fMin)) * wfW;
}

function generateScanLine() {
  const fMin = centerMHz - spanMHz/2;
  const fMax = centerMHz + spanMHz/2;
  const line = new Float32Array(wfW);

  // Noise floor: -100 to -110 dBm
  for (let i = 0; i < wfW; i++) {
    line[i] = -105 + (Math.random() - 0.5) * 10;
  }

  // Add known signals
  const now = Date.now();
  KNOWN_SIGNALS.forEach(sig => {
    if (sig.freqEnd < fMin || sig.freqStart > fMax) return;

    // Intermittent signals
    const isActive = sig.type === 'FM' || sig.type === 'GPS' ||
                     (sig.type === 'WiFi' && Math.random() > 0.15) ||
                     (sig.type === 'BLE' && Math.random() > 0.6) ||
                     (sig.type === 'ISM' && Math.random() > 0.7) ||
                     (sig.type === 'LTE' && Math.random() > 0.2);
    if (!isActive) return;

    const x1 = Math.max(0, Math.floor(freqToX(sig.freqStart)));
    const x2 = Math.min(wfW - 1, Math.floor(freqToX(sig.freqEnd)));
    if (x2 <= x1) return;

    const cx = (x1 + x2) / 2;
    const hw = (x2 - x1) / 2;

    for (let x = Math.max(0, x1 - 5); x <= Math.min(wfW - 1, x2 + 5); x++) {
      const dist = Math.abs(x - cx) / (hw || 1);
      const envelope = Math.max(0, 1 - dist * dist);
      const power = sig.power + (Math.random() - 0.5) * 8;
      line[x] = Math.max(line[x], -105 + (power + 105) * envelope);
    }

    // Track detected signals
    if (!detectedSignals.has(sig.name)) {
      detectedSignals.set(sig.name, { ...sig, firstSeen: now, count: 0 });
      log(`Signal detected: ${sig.name} (${sig.freqStart}-${sig.freqEnd} MHz)`, 'rx');
      updateSignalList();
    }
    detectedSignals.get(sig.name).count++;
    detectedSignals.get(sig.name).lastSeen = now;
  });

  return line;
}

function drawWaterfallLine(line) {
  // Scroll existing content down by 1 pixel
  const imageData = wfCtx.getImageData(0, 0, wfW, wfH - 1);
  wfCtx.putImageData(imageData, 0, 1);

  // Draw new line at top
  for (let x = 0; x < wfW; x++) {
    wfCtx.fillStyle = powerToColor(line[x]);
    wfCtx.fillRect(x, 0, 1, 1);
  }
}

function updateSignalLabels() {
  const container = $('signalLabels');
  if (!container) return;
  container.innerHTML = '';

  const fMin = centerMHz - spanMHz/2;
  const fMax = centerMHz + spanMHz/2;

  KNOWN_SIGNALS.forEach(sig => {
    if (sig.freqEnd < fMin || sig.freqStart > fMax) return;
    const xPct = ((sig.freqStart + sig.freqEnd)/2 - fMin) / (fMax - fMin) * 100;
    if (xPct < 2 || xPct > 98) return;

    const label = document.createElement('div');
    label.style.cssText = `position:absolute;top:4px;left:${xPct}%;transform:translateX(-50%);font-size:.6rem;color:${sig.color};text-shadow:0 0 3px rgba(0,0,0,.8);white-space:nowrap;`;
    label.textContent = sig.name.split('(')[0].trim();
    container.appendChild(label);
  });

  // Frequency axis at bottom
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const freq = fMin + (fMax - fMin) * (i / steps);
    const label = document.createElement('div');
    label.style.cssText = `position:absolute;bottom:2px;left:${(i/steps*100)}%;transform:translateX(-50%);font-size:.55rem;color:rgba(255,255,255,.5);`;
    label.textContent = freq >= 1000 ? (freq/1000).toFixed(1)+'G' : Math.round(freq)+'M';
    container.appendChild(label);
  }
}

function updateSignalList() {
  const list = $('signalList');
  if (!list) return;
  list.innerHTML = '';

  detectedSignals.forEach((sig, name) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);';
    row.innerHTML = `
      <span style="width:10px;height:10px;border-radius:50%;background:${sig.color};flex-shrink:0;"></span>
      <span style="flex:1;font-size:.78rem;">${name}</span>
      <span style="font-size:.7rem;color:var(--text-muted);">${sig.power} dBm</span>
      <span style="font-size:.65rem;color:var(--accent);">#${sig.count}</span>
    `;
    list.appendChild(row);
  });
}

function drawLegend() {
  const c = $('legendCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  c.width = c.parentElement?.offsetWidth - 80 || 300;
  c.height = 16;
  for (let x = 0; x < c.width; x++) {
    const dBm = -120 + (x / c.width) * 120;
    ctx.fillStyle = powerToColor(dBm);
    ctx.fillRect(x, 0, 1, c.height);
  }
}

function scanLoop() {
  if (!scanning) return;
  const line = generateScanLine();
  drawWaterfallLine(line);
  animFrame = setTimeout(() => requestAnimationFrame(scanLoop), scrollSpeed);
}

function startScan() {
  if (scanning) return;
  scanning = true;
  $('startBtn').disabled = true;
  $('stopBtn').disabled = false;
  setStatus(true);
  log('Scan started: ' + centerMHz + ' MHz \u00b1' + (spanMHz/2) + ' MHz', 'success');
  updateSignalLabels();
  scanLoop();
}

function stopScan() {
  scanning = false;
  if (animFrame) clearTimeout(animFrame);
  $('startBtn').disabled = false;
  $('stopBtn').disabled = true;
  setStatus(false);
  log('Scan stopped. ' + detectedSignals.size + ' signals detected.', 'info');
}

function clearWaterfall() {
  if (wfCtx) wfCtx.fillRect(0, 0, wfW, wfH);
  detectedSignals.clear();
  updateSignalList();
  log('Waterfall cleared', 'info');
}

function buildGuide() {
  const el = $('spectrumGuide');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.guideTitle||'Understanding the RF Spectrum'}</strong><br><br>${s.guideP1||''}<br><br>${s.guideP2||''}<br><br>${s.guideP3||''}`;
}

function buildDatabase() {
  const el = $('freqDatabase');
  if (!el) return;
  const s = LANG[currentLang];
  let html = `<strong>${s.dbTitle||'Frequency Allocations'}</strong><br><br>`;
  html += '<div style="display:grid;grid-template-columns:1fr 1fr 2fr;gap:4px 8px;">';
  html += '<strong style="font-size:.7rem;">Band</strong><strong style="font-size:.7rem;">Range</strong><strong style="font-size:.7rem;">Use</strong>';
  FREQ_DB.forEach(r => {
    html += `<span>${r.band}</span><span style="color:var(--accent);">${r.range}</span><span style="color:var(--text-muted);">${r.use}</span>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;

  // Log buttons
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog; if(cpb)cpb.onclick=copyLog; if(exb)exb.onclick=exportLog;
  initLogFilters();

  // Help panel
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp; if(hClose)hClose.onclick=closeHelp; if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();

  // Settings panel
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings; if(sClose)sClose.onclick=closeSettings; if(sOv)sOv.onclick=closeSettings;

  // Log panel
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog; if(lClose)lClose.onclick=closeLog;
  initLogResize();

  // Sound toggle
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}

  // Whisper/Breathing/Music
  const whisperBtn=$('whisperBtn'); if(whisperBtn)whisperBtn.onclick=()=>log('Whisper mode requires microphone','info');
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn'); if(musicBtn)musicBtn.onclick=()=>log('Music mode not available in this app','info');

  // Escape/Tab
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});

  // Language/Theme dropdowns
  const langSel=$('langSelect'); if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  // Restore prefs
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}

  initHijriDate();

  /* ═══ WATERFALL SETUP ═══ */
  wfCanvas = $('waterfallCanvas');
  if (wfCanvas) {
    wfCtx = wfCanvas.getContext('2d');
    wfW = wfCanvas.width;
    wfH = wfCanvas.height;
    wfCtx.fillStyle = '#000';
    wfCtx.fillRect(0, 0, wfW, wfH);
  }

  // Controls
  $('startBtn').onclick = startScan;
  $('stopBtn').onclick = stopScan;
  $('clearWfBtn').onclick = clearWaterfall;

  // Speed slider
  const speedSlider = $('speedSlider');
  if (speedSlider) speedSlider.addEventListener('input', () => { scrollSpeed = parseInt(speedSlider.value); });

  // Center freq slider
  const cfSlider = $('centerFreq'), cfVal = $('centerFreqVal');
  if (cfSlider) cfSlider.addEventListener('input', () => {
    centerMHz = parseInt(cfSlider.value);
    if (cfVal) cfVal.textContent = centerMHz + ' MHz';
    updateSignalLabels();
  });

  // Span slider
  const spSlider = $('spanSlider'), spVal = $('spanVal');
  if (spSlider) spSlider.addEventListener('input', () => {
    spanMHz = parseInt(spSlider.value);
    if (spVal) spVal.textContent = spanMHz + ' MHz';
    updateSignalLabels();
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = parseInt(btn.dataset.center), s = parseInt(btn.dataset.span);
      centerMHz = c; spanMHz = s;
      if (cfSlider) cfSlider.value = c;
      if (cfVal) cfVal.textContent = c + ' MHz';
      if (spSlider) spSlider.value = s;
      if (spVal) spVal.textContent = s + ' MHz';
      updateSignalLabels();
      log(`Tuned to ${c} MHz, span ${s} MHz`, 'info');
      playSound('click');
    });
  });

  drawLegend();
  buildGuide();
  buildDatabase();
  updateSignalLabels();

  log(LANG[currentLang].ready, 'success');
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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#settingsCloseBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#whisperBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#breathingBtn', delay:3000},
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
