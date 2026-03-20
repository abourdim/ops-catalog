/**
 * FM Pirate Radio — DJ Booth
 * Workshop DIY — v1.2
 * Broadcast a tiny FM station from your browser
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
    title:'FM Pirate Radio', subtitle:'FM Pirate Radio \u2014 DJ Booth',
    disconnected:'Off Air', connected:'ON AIR',
    mainSection:'DJ Booth', mainDesc:'Broadcast a tiny FM station from your browser',
    sectionA:'FM Modulation Visualization', sectionB:'How FM Radio Works', sectionC:'Pirate Radio History',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', theme:'Theme',
    settings:'\u2699\uFE0F Settings', language:'Language',
    help:'\u2753 Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'Select a frequency on the FM dial (87.5-108.0 MHz).',
    howto_2:'Choose an audio source: TTS text or tone generator.',
    howto_3:'Click GO LIVE to start broadcasting.',
    howto_4:'Watch the VU meter and FM modulation visualization.',
    wiki_fm_title:'FM Modulation', wiki_fm:'FM encodes audio by varying the carrier frequency. Higher audio amplitude = wider frequency deviation.',
    wiki_vu_title:'VU Meter', wiki_vu:'Volume Unit meter shows audio level in real time. Green = good, yellow = loud, red = clipping.',
    working:'Working\u2026',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 FM Pirate Radio ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    filterAll:'All', soundEffects:'Sound effects',
    whisperMode:'Whisper mode', breathingGuide:'Breathing guide', dhikrTap:'Tap',
    musicMode:'Music reactive', splashHint:'tap to skip',
    langChanged:'\uD83C\uDF10 Language \u2192 English', themeChanged:'\uD83C\uDFA8 Theme \u2192',
    offAir:'OFF AIR', onAir:'ON AIR', freqSelect:'Frequency Selector',
    audioSource:'Audio Source', ttsMode:'TTS Text', toneMode:'Tone Generator',
    ttsPlaceholder:'Type message to broadcast...',
    toneFreq:'Tone (Hz):', waveform:'Waveform:',
    vuMeter:'VU Meter', broadcast:'Broadcast',
    goLive:'GO LIVE', stopLive:'STOP',
    fmModHint:'Shows how audio modulates the FM carrier frequency.',
    guideTitle:'How FM Radio Works',
    guideP1:'Frequency Modulation (FM) encodes information by varying the frequency of a carrier wave proportional to the audio signal.',
    guideP2:'FM broadcast uses 87.5\u2013108 MHz with 75 kHz deviation and 200 kHz channel spacing.',
    guideP3:'Pirate radio stations broadcast without a license, historically on FM and AM bands.',
    histTitle:'Famous Pirate Radio Stations',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR or HackRF. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Hrf Rf Fingerprinter and Hrf Radio Telescope! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr: {
    title:'Radio Pirate FM', subtitle:'Radio Pirate FM \u2014 Cabine DJ',
    disconnected:'Hors antenne', connected:'EN DIRECT',
    mainSection:'Cabine DJ', mainDesc:'Diffusez une petite station FM depuis votre navigateur',
    sectionA:'Visualisation Modulation FM', sectionB:'Comment fonctionne la FM', sectionC:'Histoire Radio Pirate',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements et messages',
    clear:'Effacer', copy:'Copier', export:'Exporter', theme:'Th\u00e8me',
    settings:'\u2699\uFE0F Param\u00e8tres', language:'Langue',
    help:'\u2753 Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'S\u00e9lectionnez une fr\u00e9quence FM (87.5-108.0 MHz).',
    howto_2:'Choisissez une source audio.',
    howto_3:'Cliquez EN DIRECT pour commencer.',
    howto_4:'Observez le VU-m\u00e8tre et la modulation.',
    wiki_fm_title:'Modulation FM', wiki_fm:'La FM encode l\'audio en variant la fr\u00e9quence porteuse.',
    wiki_vu_title:'VU-m\u00e8tre', wiki_vu:'Affiche le niveau audio en temps r\u00e9el.',
    working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'M\u00e9dina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 Radio Pirate FM pr\u00eate !',
    logCleared:'Journal effac\u00e9', copied:'Copi\u00e9 !', copyFail:'\u00c9chec',
    filterAll:'Tout', soundEffects:'Effets sonores',
    whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire', dhikrTap:'Tap',
    musicMode:'R\u00e9actif musique', splashHint:'appuyer pour passer',
    langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais', themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
    offAir:'HORS ANTENNE', onAir:'EN DIRECT', freqSelect:'S\u00e9lecteur de Fr\u00e9quence',
    audioSource:'Source Audio', ttsMode:'Texte TTS', toneMode:'G\u00e9n\u00e9rateur',
    ttsPlaceholder:'Tapez un message \u00e0 diffuser...',
    toneFreq:'Tonalit\u00e9 (Hz) :', waveform:'Forme d\'onde :',
    vuMeter:'VU-m\u00e8tre', broadcast:'Diffusion',
    goLive:'EN DIRECT', stopLive:'ARR\u00caTER',
    fmModHint:'Montre comment l\'audio module la porteuse FM.',
    guideTitle:'Comment la radio FM fonctionne',
    guideP1:'La Modulation de Fr\u00e9quence encode l\'information en variant la fr\u00e9quence.',
    guideP2:'La FM utilise 87.5\u2013108 MHz avec 75 kHz de d\u00e9viation.',
    guideP3:'Les radios pirates \u00e9mettent sans licence.',
    histTitle:'Stations Pirates C\u00e9l\u00e8bres',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Rf Fingerprinter and Hrf Radio Telescope ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar: {
    title:'\u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 FM', subtitle:'\u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 FM \u2014 \u0643\u0627\u0628\u064A\u0646\u0629 DJ',
    disconnected:'\u062E\u0627\u0631\u062C \u0627\u0644\u0628\u062B', connected:'\u0639\u0644\u0649 \u0627\u0644\u0647\u0648\u0627\u0621',
    mainSection:'\u0643\u0627\u0628\u064A\u0646\u0629 DJ', mainDesc:'\u0628\u062B \u0645\u062D\u0637\u0629 FM \u0635\u063A\u064A\u0631\u0629 \u0645\u0646 \u0645\u062A\u0635\u0641\u062D\u0643',
    sectionA:'\u062A\u0635\u0648\u0631 \u062A\u0639\u062F\u064A\u0644 FM', sectionB:'\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0631\u0627\u062F\u064A\u0648 FM', sectionC:'\u062A\u0627\u0631\u064A\u062E \u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629',
    activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear:'\u0645\u0633\u062D', copy:'\u0646\u0633\u062E', export:'\u062A\u0635\u062F\u064A\u0631', theme:'\u0627\u0644\u0645\u0638\u0647\u0631',
    settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A', language:'\u0627\u0644\u0644\u063A\u0629',
    help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629', faq:'\u0623\u0633\u0626\u0644\u0629', howto:'\u0643\u064A\u0641', wiki:'\u0648\u064A\u0643\u064A',
    howto_1:'\u0627\u062E\u062A\u0631 \u062A\u0631\u062F\u062F FM.', howto_2:'\u0627\u062E\u062A\u0631 \u0645\u0635\u062F\u0631 \u0635\u0648\u062A.',
    howto_3:'\u0627\u0646\u0642\u0631 \u0628\u062B \u0645\u0628\u0627\u0634\u0631.', howto_4:'\u0631\u0627\u0642\u0628 \u0645\u0642\u064A\u0627\u0633 VU.',
    wiki_fm_title:'\u062A\u0639\u062F\u064A\u0644 FM', wiki_fm:'FM \u064A\u0634\u0641\u0631 \u0627\u0644\u0635\u0648\u062A \u0628\u062A\u063A\u064A\u064A\u0631 \u062A\u0631\u062F\u062F \u0627\u0644\u0645\u0648\u062C\u0629 \u0627\u0644\u062D\u0627\u0645\u0644\u0629.',
    wiki_vu_title:'\u0645\u0642\u064A\u0627\u0633 VU', wiki_vu:'\u064A\u0639\u0631\u0636 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0635\u0648\u062A \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A.',
    working:'\u062C\u0627\u0631\u064D\u2026',
    t_mosque:'\u0645\u0633\u062C\u062F', t_zellige:'\u0632\u0644\u064A\u062C', t_andalus:'\u0623\u0646\u062F\u0644\u0633', t_riad:'\u0631\u064A\u0627\u0636', t_medina:'\u0645\u062F\u064A\u0646\u0629',
    t_space:'\u0641\u0636\u0627\u0621', t_jungle:'\u0623\u062F\u063A\u0627\u0644', t_robot:'\u0631\u0648\u0628\u0648\u062A',
    ready:'\uD83D\uDE80 \u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 \u062C\u0627\u0647\u0632!',
    logCleared:'\u062A\u0645 \u0645\u0633\u062D \u0627\u0644\u0633\u062C\u0644', copied:'\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!', copyFail:'\u0641\u0634\u0644',
    filterAll:'\u0627\u0644\u0643\u0644', soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A \u0635\u0648\u062A\u064A\u0629',
    whisperMode:'\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633', breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633', dhikrTap:'\u0627\u0636\u063A\u0637',
    musicMode:'\u062A\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064A\u0642\u064A', splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',
    langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629', themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    offAir:'\u062E\u0627\u0631\u062C \u0627\u0644\u0628\u062B', onAir:'\u0639\u0644\u0649 \u0627\u0644\u0647\u0648\u0627\u0621',
    freqSelect:'\u0645\u062D\u062F\u062F \u0627\u0644\u062A\u0631\u062F\u062F',
    audioSource:'\u0645\u0635\u062F\u0631 \u0627\u0644\u0635\u0648\u062A', ttsMode:'\u0646\u0635 TTS', toneMode:'\u0645\u0648\u0644\u062F \u0646\u063A\u0645\u0627\u062A',
    ttsPlaceholder:'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629 \u0644\u0644\u0628\u062B...',
    toneFreq:'\u0627\u0644\u0646\u063A\u0645\u0629 (Hz):', waveform:'\u0634\u0643\u0644 \u0627\u0644\u0645\u0648\u062C\u0629:',
    vuMeter:'\u0645\u0642\u064A\u0627\u0633 VU', broadcast:'\u0628\u062B',
    goLive:'\u0628\u062B \u0645\u0628\u0627\u0634\u0631', stopLive:'\u0625\u064A\u0642\u0627\u0641',
    fmModHint:'\u064A\u0639\u0631\u0636 \u0643\u064A\u0641 \u064A\u0639\u062F\u0644 \u0627\u0644\u0635\u0648\u062A \u062D\u0627\u0645\u0644 FM.',
    guideTitle:'\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0631\u0627\u062F\u064A\u0648 FM',
    guideP1:'FM \u064A\u0634\u0641\u0631 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0628\u062A\u063A\u064A\u064A\u0631 \u062A\u0631\u062F\u062F \u0627\u0644\u0645\u0648\u062C\u0629.',
    guideP2:'FM \u064A\u0633\u062A\u062E\u062F\u0645 87.5-108 MHz.',
    guideP3:'\u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 \u064A\u0628\u062B \u0628\u062F\u0648\u0646 \u062A\u0631\u062E\u064A\u0635.',
    histTitle:'\u0645\u062D\u0637\u0627\u062A \u0642\u0631\u0627\u0635\u0646\u0629 \u0634\u0647\u064A\u0631\u0629',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Rf Fingerprinter and Hrf Radio Telescope! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k=el.dataset.i18n; if(s[k]!=null) el.textContent=s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k=opt.dataset.i18nOpt; if(s[k]!=null) opt.textContent=s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k=el.dataset.i18nPlaceholder; if(s[k]!=null) el.placeholder=s[k]; });
  document.title = `${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir = lang==='ar'?'rtl':'ltr';
  document.documentElement.lang = lang;
  const sel=$('langSelect'); if(sel) sel.value=lang;
  try{localStorage.setItem('wdiy-lang',lang);}catch{}
  log(s.langChanged,'info');
  buildGuide(); buildHistory();
}

/* ═══════ THEMES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],
  'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],
  'riad':[349,440,523],'medina':[294,349,440]
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
}

/* ═══════ BREATHING + DHIKR ═══════ */
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive){bands.forEach(b=>b.classList.add('breathing'));log('Breathing guide on','info');}else{bands.forEach(b=>b.classList.remove('breathing'));log('Breathing guide off','info');}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: FM PIRATE RADIO SIMULATION
   ═══════════════════════════════════════════════════════════════ */

let broadcasting = false;
let fmFreqMHz = 98.0;
let audioMode = 'tts'; // 'tts' or 'tone'
let toneHz = 440;
let toneWaveform = 'sine';
let vuAnimFrame = null;
let fmModAnimFrame = null;
let waveAnimFrame = null;

/* Audio engine */
let toneOsc = null, toneGain = null;
let analyser = null;
let audioSourceNode = null;

/* Canvases */
let dialCanvas, dialCtx;
let vuCanvas, vuCtx;
let waveCanvas, waveCtx;
let fmModCanvas, fmModCtx;

/* Simulated audio level */
let simLevel = 0;
let simPhase = 0;

function drawDial() {
  if (!dialCtx) return;
  const w = dialCanvas.width, h = dialCanvas.height;
  dialCtx.clearRect(0, 0, w, h);

  // Background
  dialCtx.fillStyle = 'rgba(0,0,0,0.3)';
  dialCtx.fillRect(0, 0, w, h);

  // Dial markings
  const fMin = 87.5, fMax = 108.0;
  const majorStep = 2, minorStep = 0.5;

  for (let f = fMin; f <= fMax; f += minorStep) {
    const x = ((f - fMin) / (fMax - fMin)) * (w - 40) + 20;
    const isMajor = Math.abs(f - Math.round(f / majorStep) * majorStep) < 0.01;

    dialCtx.beginPath();
    dialCtx.strokeStyle = isMajor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)';
    dialCtx.lineWidth = isMajor ? 2 : 1;
    dialCtx.moveTo(x, h - 10);
    dialCtx.lineTo(x, h - (isMajor ? 50 : 30));
    dialCtx.stroke();

    if (isMajor) {
      dialCtx.fillStyle = 'rgba(255,255,255,0.6)';
      dialCtx.font = '11px sans-serif';
      dialCtx.textAlign = 'center';
      dialCtx.fillText(f.toFixed(0), x, h - 55);
    }
  }

  // Needle
  const nx = ((fmFreqMHz - fMin) / (fMax - fMin)) * (w - 40) + 20;
  dialCtx.beginPath();
  dialCtx.strokeStyle = broadcasting ? '#ff3333' : 'var(--accent, #d4a03c)';
  dialCtx.lineWidth = 3;
  dialCtx.moveTo(nx, h - 5);
  dialCtx.lineTo(nx, 10);
  dialCtx.stroke();

  // Needle glow
  dialCtx.beginPath();
  dialCtx.arc(nx, 8, 4, 0, Math.PI * 2);
  dialCtx.fillStyle = broadcasting ? '#ff3333' : '#d4a03c';
  dialCtx.fill();

  // Station names at known frequencies
  const stations = [
    {f:88.9,name:'NPR'},{f:92.3,name:'ROCK'},{f:95.5,name:'POP'},
    {f:98.7,name:'JAZZ'},{f:101.1,name:'TALK'},{f:104.3,name:'HITS'},{f:107.5,name:'R&B'}
  ];
  stations.forEach(s => {
    const sx = ((s.f - fMin) / (fMax - fMin)) * (w - 40) + 20;
    dialCtx.fillStyle = 'rgba(255,200,50,0.5)';
    dialCtx.font = '9px sans-serif';
    dialCtx.textAlign = 'center';
    dialCtx.fillText(s.name, sx, 28);
  });
}

function drawVU() {
  if (!vuCtx) return;
  const w = vuCanvas.width, h = vuCanvas.height;
  vuCtx.clearRect(0, 0, w, h);
  vuCtx.fillStyle = 'rgba(0,0,0,0.3)';
  vuCtx.fillRect(0, 0, w, h);

  const level = broadcasting ? simLevel : 0;
  const bars = 30;
  const barW = (w - 10) / bars;

  for (let i = 0; i < bars; i++) {
    const threshold = i / bars;
    const active = level > threshold;
    let color;
    if (i < bars * 0.6) color = active ? '#22c55e' : 'rgba(34,197,94,0.15)';
    else if (i < bars * 0.8) color = active ? '#eab308' : 'rgba(234,179,8,0.15)';
    else color = active ? '#ef4444' : 'rgba(239,68,68,0.15)';

    vuCtx.fillStyle = color;
    vuCtx.fillRect(5 + i * barW, 8, barW - 2, h - 16);
  }

  // dB labels
  vuCtx.fillStyle = 'rgba(255,255,255,0.4)';
  vuCtx.font = '9px sans-serif';
  vuCtx.textAlign = 'center';
  vuCtx.fillText('-20', w * 0.15, h - 2);
  vuCtx.fillText('-6', w * 0.55, h - 2);
  vuCtx.fillText('0', w * 0.78, h - 2);
  vuCtx.fillText('+3', w * 0.93, h - 2);
}

function drawWaveform() {
  if (!waveCtx) return;
  const w = waveCanvas.width, h = waveCanvas.height;
  waveCtx.clearRect(0, 0, w, h);

  if (!broadcasting) return;

  waveCtx.beginPath();
  waveCtx.strokeStyle = '#22c55e';
  waveCtx.lineWidth = 1.5;

  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 8 + simPhase;
    const y = h / 2 + Math.sin(t) * simLevel * h * 0.4 +
              Math.sin(t * 2.3) * simLevel * h * 0.15;
    if (x === 0) waveCtx.moveTo(x, y); else waveCtx.lineTo(x, y);
  }
  waveCtx.stroke();
}

function drawFMMod() {
  if (!fmModCtx) return;
  const w = fmModCanvas.width, h = fmModCanvas.height;
  fmModCtx.clearRect(0, 0, w, h);
  fmModCtx.fillStyle = 'rgba(0,0,0,0.2)';
  fmModCtx.fillRect(0, 0, w, h);

  const third = h / 3;

  // Labels
  fmModCtx.fillStyle = 'rgba(255,255,255,0.5)';
  fmModCtx.font = '10px sans-serif';
  fmModCtx.fillText('Audio Signal', 5, 14);
  fmModCtx.fillText('Carrier', 5, third + 14);
  fmModCtx.fillText('FM Modulated', 5, third * 2 + 14);

  const amp = broadcasting ? simLevel : 0.3;

  // Audio signal (baseband)
  fmModCtx.beginPath();
  fmModCtx.strokeStyle = '#22c55e';
  fmModCtx.lineWidth = 1.5;
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 6 + simPhase * 0.5;
    const y = third * 0.5 + Math.sin(t) * amp * third * 0.35;
    if (x === 0) fmModCtx.moveTo(x, y); else fmModCtx.lineTo(x, y);
  }
  fmModCtx.stroke();

  // Carrier (pure sine)
  fmModCtx.beginPath();
  fmModCtx.strokeStyle = '#3b82f6';
  fmModCtx.lineWidth = 1;
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 40;
    const y = third + third * 0.5 + Math.sin(t) * third * 0.3;
    if (x === 0) fmModCtx.moveTo(x, y); else fmModCtx.lineTo(x, y);
  }
  fmModCtx.stroke();

  // FM modulated (frequency varies with audio)
  fmModCtx.beginPath();
  fmModCtx.strokeStyle = '#f59e0b';
  fmModCtx.lineWidth = 1.5;
  let phase = 0;
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 6 + simPhase * 0.5;
    const audioVal = Math.sin(t) * amp;
    const carrierFreq = 40 + audioVal * 20;
    phase += carrierFreq / w * Math.PI;
    const y = third * 2 + third * 0.5 + Math.sin(phase) * third * 0.3;
    if (x === 0) fmModCtx.moveTo(x, y); else fmModCtx.lineTo(x, y);
  }
  fmModCtx.stroke();

  // Center lines
  [third * 0.5, third * 1.5, third * 2.5].forEach(y => {
    fmModCtx.beginPath();
    fmModCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    fmModCtx.setLineDash([4, 4]);
    fmModCtx.moveTo(0, y);
    fmModCtx.lineTo(w, y);
    fmModCtx.stroke();
    fmModCtx.setLineDash([]);
  });
}

function simLoop() {
  if (broadcasting) {
    simPhase += 0.08;
    if (audioMode === 'tts') {
      simLevel = 0.4 + Math.sin(Date.now() / 300) * 0.2 + Math.sin(Date.now() / 700) * 0.15 + Math.random() * 0.1;
    } else {
      simLevel = 0.5 + Math.sin(Date.now() / 500) * 0.1 + Math.random() * 0.05;
    }
    simLevel = Math.max(0, Math.min(1, simLevel));
  } else {
    simLevel *= 0.95;
  }

  drawVU();
  drawWaveform();
  drawFMMod();
  vuAnimFrame = requestAnimationFrame(simLoop);
}

function goLive() {
  if (broadcasting) return;
  broadcasting = true;
  $('goLiveBtn').disabled = true;
  $('stopLiveBtn').disabled = false;
  setStatus(true);
  const bs = $('broadcastStatus');
  if (bs) { bs.textContent = LANG[currentLang].onAir; bs.style.color = '#ef4444'; bs.style.fontWeight = 'bold'; }
  drawDial();
  log(`ON AIR at ${fmFreqMHz.toFixed(1)} MHz [${audioMode.toUpperCase()}]`, 'tx');
  playSound('success');

  if (audioMode === 'tts') {
    const text = $('ttsText')?.value || 'Hello from pirate radio!';
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9; u.pitch = 1;
      speechSynthesis.speak(u);
      log(`TTS: "${text}"`, 'tx');
    }
  }
}

function stopLive() {
  broadcasting = false;
  $('goLiveBtn').disabled = false;
  $('stopLiveBtn').disabled = true;
  setStatus(false);
  const bs = $('broadcastStatus');
  if (bs) { bs.textContent = LANG[currentLang].offAir; bs.style.color = ''; bs.style.fontWeight = ''; }
  drawDial();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  log('OFF AIR', 'info');
}

function buildGuide() {
  const el = $('fmGuide');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;
}

function buildHistory() {
  const el = $('pirateHistory');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.histTitle}</strong><br><br>` +
    '<div style="display:grid;grid-template-columns:1fr 1fr 2fr;gap:4px 8px;">' +
    '<strong style="font-size:.7rem;">Name</strong><strong style="font-size:.7rem;">Era</strong><strong style="font-size:.7rem;">Notes</strong>' +
    '<span>Radio Caroline</span><span style="color:var(--accent);">1964</span><span style="color:var(--text-muted);">Ship-based, North Sea, UK pop music revolution</span>' +
    '<span>Radio Luxembourg</span><span style="color:var(--accent);">1933</span><span style="color:var(--text-muted);">Long-wave commercial broadcaster</span>' +
    '<span>Radio Veronica</span><span style="color:var(--accent);">1960</span><span style="color:var(--text-muted);">Dutch offshore pirate station</span>' +
    '<span>WFMU</span><span style="color:var(--accent);">1958</span><span style="color:var(--text-muted);">Freeform community radio, NJ</span>' +
    '<span>Micro FM</span><span style="color:var(--accent);">2000s</span><span style="color:var(--text-muted);">Low-power FM movement worldwide</span>' +
    '</div>';
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;

  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog; if(cpb)cpb.onclick=copyLog; if(exb)exb.onclick=exportLog;
  initLogFilters();

  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp; if(hClose)hClose.onclick=closeHelp; if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();

  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings; if(sClose)sClose.onclick=closeSettings; if(sOv)sOv.onclick=closeSettings;

  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog; if(lClose)lClose.onclick=closeLog;
  initLogResize();

  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}

  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});

  const langSel=$('langSelect'); if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}

  initHijriDate();

  /* ═══ FM PIRATE RADIO SETUP ═══ */
  dialCanvas = $('dialCanvas');
  vuCanvas = $('vuCanvas');
  waveCanvas = $('waveformCanvas');
  fmModCanvas = $('fmModCanvas');
  if (dialCanvas) dialCtx = dialCanvas.getContext('2d');
  if (vuCanvas) vuCtx = vuCanvas.getContext('2d');
  if (waveCanvas) waveCtx = waveCanvas.getContext('2d');
  if (fmModCanvas) fmModCtx = fmModCanvas.getContext('2d');

  // FM frequency slider
  const fmSlider = $('fmFreq'), freqDisp = $('freqDisplay');
  if (fmSlider) fmSlider.addEventListener('input', () => {
    fmFreqMHz = parseInt(fmSlider.value) / 10;
    if (freqDisp) freqDisp.textContent = fmFreqMHz.toFixed(1);
    drawDial();
    log(`Tuned to ${fmFreqMHz.toFixed(1)} MHz`, 'info');
  });

  // Audio source buttons
  const srcTTS = $('srcTTS'), srcTone = $('srcTone');
  const ttsPanel = $('ttsPanel'), tonePanel = $('tonePanel');
  if (srcTTS) srcTTS.onclick = () => {
    audioMode = 'tts';
    srcTTS.classList.add('primary'); srcTone.classList.remove('primary');
    if (ttsPanel) ttsPanel.style.display = '';
    if (tonePanel) tonePanel.style.display = 'none';
    log('Audio source: TTS', 'info');
  };
  if (srcTone) srcTone.onclick = () => {
    audioMode = 'tone';
    srcTone.classList.add('primary'); srcTTS.classList.remove('primary');
    if (ttsPanel) ttsPanel.style.display = 'none';
    if (tonePanel) tonePanel.style.display = '';
    log('Audio source: Tone Generator', 'info');
  };

  // Tone controls
  const toneSlider = $('toneFreqSlider'), toneVal = $('toneFreqVal');
  if (toneSlider) toneSlider.addEventListener('input', () => {
    toneHz = parseInt(toneSlider.value);
    if (toneVal) toneVal.textContent = toneHz + ' Hz';
  });

  // TTS speak button
  const ttsSpeak = $('ttsSpeak');
  if (ttsSpeak) ttsSpeak.onclick = () => {
    if (!broadcasting) { log('Go LIVE first to broadcast TTS', 'error'); return; }
    const text = $('ttsText')?.value || 'Hello from pirate radio!';
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(u);
      log(`TTS: "${text}"`, 'tx');
    }
  };

  // Broadcast controls
  const goBtn = $('goLiveBtn'), stopBtn = $('stopLiveBtn');
  if (goBtn) goBtn.onclick = goLive;
  if (stopBtn) stopBtn.onclick = stopLive;

  drawDial();
  buildGuide();
  buildHistory();
  simLoop();

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
