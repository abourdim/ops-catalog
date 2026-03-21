/**
 * Workshop DIY — Bio Breath Modulator v1.0
 * Breathing pattern modulates RF carrier
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.08);o.start(t);o.stop(t+.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3);const o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.connect(g2);g2.connect(audioCtx.destination);g2.gain.value=.08;o2.frequency.value=659;o2.type='sine';g2.gain.exponentialRampToValueAtTime(.001,t+.4);o2.start(t+.15);o2.stop(t+.4);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25);break;case'tx':o.frequency.value=1200;o.type='sawtooth';g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.001,t+.15);o.start(t);o.stop(t+.15);break;case'breathe':o.frequency.value=180;o.type='sine';g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.001,t+.6);o.start(t);o.stop(t+.6);break}}

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

const LANG={
  en:{
    ...LANG_BASE.en,title:'Bio Breath Modulator',subtitle:'Breathing modulates RF carrier',disconnected:'Disconnected',connected:'Connected',
    mainSection:'Breath Modulator \u2014 RF Carrier Control',mainDesc:'Your breathing pattern modulates a radio frequency carrier signal',
    sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',
    startBreath:'Start Breathing',stopBreath:'Stop',inhaleBtn:'Inhale',exhaleBtn:'Exhale',txBtn:'TX On',txOff:'TX Off',
    statRate:'BrPM',statDepth:'Depth',statCarrier:'MHz',statDev:'MHz dev',
    step1Title:'Breath Sensor',step1Desc:'Thermistor near nostrils detects airflow temperature changes during breathing.',
    step2Title:'Envelope Extraction',step2Desc:'ADC captures breathing waveform. Low-pass filter extracts the slow envelope.',
    step3Title:'FM Modulation',step3Desc:'Breathing envelope modulates 433.92 MHz carrier via frequency deviation.',
    step4Title:'Demodulation',step4Desc:'Receiver demodulates FM signal to reconstruct breathing pattern remotely.',
    ch1Title:'Breath Sync',ch1Desc:'Can two people synchronize breathing using the transmitted signal?',
    ch2Title:'Rate Control',ch2Desc:'Slow to 6 BrPM. Watch the carrier frequency change.',
    ch3Title:'Morse Breathing',ch3Desc:'Encode a message: deep breath = dash, shallow = dot.',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "A \u2014 How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    wiki_fm_title:'\ud83d\udce1 FM Modulation',wiki_fm:'f(t) = fc + kf*m(t). fc=carrier, kf=sensitivity, m(t)=breathing signal.',
    wiki_resp_title:'\ud83e\udec1 Respiratory Rate',wiki_resp:'Normal: 12-20 BrPM. Athletes: 6-10. Stress increases rate.',
    activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',
    settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    soundEffects:'\ud83d\udd0a Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',working:'Working\u2026',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'\ud83e\udec1 Breath Modulator ready \u2014 breathe to transmit!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 English',themeChanged:'\ud83c\udfa8 Theme \u2192',
    breathStarted:'Breathing simulation started',breathStopped:'Stopped',sectionCode:'Device Code',faq_q1:'What is Bio Breath Modulator?',faq_a1:'Bio Breath Modulator lets you your breathing pattern modulates a radio frequency carrier signal. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you thermistor near nostrils detects airflow temperature changes during breathing. Then you adc captures breathing waveform. low-pass filter extracts the slow envelope.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'f(t) = fc + kf*m(t). \u0627\u0644\u062d\u0627\u0645\u0644 + \u0625\u0634\u0627\u0631\u0629 \u0627\u0644\u062a\u0646\u0641\u0633.',faq_q5:'What should I experiment with?',faq_a5:'Can two people synchronize breathing using the transmitted signal?',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Breath Modulator! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start to begin simulation. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how biomedical signals works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Bio Breath Modulator: Your breathing pattern modulates a radio frequency carrier signal. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Breath Sensor through Envelope Extraction to FM Modulation and Demodulation.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Bio Modulateur Respiratoire',subtitle:'La respiration module la porteuse RF',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',
    mainSection:'Modulateur Respiratoire \u2014 Contr\u00f4le RF',mainDesc:'Votre respiration module un signal porteur radio',
    sectionA:'A \u2014 Fonctionnement',sectionC:'C \u2014 D\u00e9fis',
    startBreath:'D\u00e9marrer',stopBreath:'Arr\u00eat',inhaleBtn:'Inspirer',exhaleBtn:'Expirer',txBtn:'TX On',txOff:'TX Off',
    statRate:'RpM',statDepth:'Prof.',statCarrier:'MHz',statDev:'MHz d\u00e9v',
    step1Title:'Capteur Souffle',step1Desc:'Thermistance pr\u00e8s du nez d\u00e9tecte le flux d\'air.',
    step2Title:'Extraction Enveloppe',step2Desc:'L\'ADC capture la forme d\'onde respiratoire.',
    step3Title:'Modulation FM',step3Desc:'L\'enveloppe module la porteuse 433.92 MHz.',
    step4Title:'D\u00e9modulation',step4Desc:'Le r\u00e9cepteur reconstruit le sch\u00e9ma respiratoire.',
    ch1Title:'Sync Respiration',ch1Desc:'Deux personnes synchronisent leur respiration?',
    ch2Title:'Contr\u00f4le Rythme',ch2Desc:'Ralentissez \u00e0 6 RpM.',
    ch3Title:'Morse Respiratoire',ch3Desc:'Profond = tiret, superficiel = point.',
    howto_1:'Cliquez D\u00e9marrer.',howto_2:'Inspirer/Expirer pour contr\u00f4le manuel.',howto_3:'TX On pour transmettre.',
    wiki_fm_title:'\ud83d\udce1 Modulation FM',wiki_fm:'f(t) = fc + kf*m(t). fc=porteuse, m(t)=signal respiratoire.',
    wiki_resp_title:'\ud83e\udec1 Rythme Respiratoire',wiki_resp:'Normal: 12-20 RpM. Athl\u00e8tes: 6-10.',
    activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',
    settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    soundEffects:'\ud83d\udd0a Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',
    splashHint:'appuyer',working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'\ud83e\udec1 Modulateur pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 \u2192',
    breathStarted:'Simulation respiratoire d\u00e9marr\u00e9e',breathStopped:'Arr\u00eat\u00e9',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Muscle Telegraph and Bio Nerve Impulse Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',subtitle:'\u0627\u0644\u062a\u0646\u0641\u0633 \u064a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',
    mainSection:'\u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 \u2014 \u062a\u062d\u0643\u0645 RF',mainDesc:'\u0646\u0645\u0637 \u062a\u0646\u0641\u0633\u0643 \u064a\u0639\u062f\u0644 \u0625\u0634\u0627\u0631\u0629 \u0631\u0627\u062f\u064a\u0648',
    sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',
    startBreath:'\u0628\u062f\u0621',stopBreath:'\u0625\u064a\u0642\u0627\u0641',inhaleBtn:'\u0634\u0647\u064a\u0642',exhaleBtn:'\u0632\u0641\u064a\u0631',txBtn:'\u0625\u0631\u0633\u0627\u0644',txOff:'\u0625\u064a\u0642\u0627\u0641',
    statRate:'\u0646/\u062f',statDepth:'\u0639\u0645\u0642',statCarrier:'MHz',statDev:'MHz \u0627\u0646\u062d\u0631\u0627\u0641',
    step1Title:'\u0645\u0633\u062a\u0634\u0639\u0631 \u0627\u0644\u0646\u0641\u0633',step1Desc:'\u062b\u0631\u0645\u0633\u062a\u0648\u0631 \u064a\u0643\u0634\u0641 \u062a\u063a\u064a\u0631 \u062f\u0631\u062c\u0629 \u062d\u0631\u0627\u0631\u0629 \u0627\u0644\u0647\u0648\u0627\u0621.',
    step2Title:'\u0627\u0633\u062a\u062e\u0631\u0627\u062c \u0627\u0644\u063a\u0644\u0627\u0641',step2Desc:'ADC \u064a\u0644\u062a\u0642\u0637 \u0645\u0648\u062c\u0629 \u0627\u0644\u062a\u0646\u0641\u0633.',
    step3Title:'\u062a\u0639\u062f\u064a\u0644 FM',step3Desc:'\u063a\u0644\u0627\u0641 \u0627\u0644\u062a\u0646\u0641\u0633 \u064a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 433.92 MHz.',
    step4Title:'\u0641\u0643 \u0627\u0644\u062a\u0639\u062f\u064a\u0644',step4Desc:'\u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644 \u064a\u0639\u064a\u062f \u0628\u0646\u0627\u0621 \u0646\u0645\u0637 \u0627\u0644\u062a\u0646\u0641\u0633.',
    ch1Title:'\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u062a\u0646\u0641\u0633',ch1Desc:'\u0647\u0644 \u064a\u0645\u0643\u0646 \u0644\u0634\u062e\u0635\u064a\u0646 \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629\u061f',
    ch2Title:'\u062a\u062d\u0643\u0645 \u0627\u0644\u0645\u0639\u062f\u0644',ch2Desc:'\u0623\u0628\u0637\u0626 \u0625\u0644\u0649 6 \u0646/\u062f.',
    ch3Title:'\u0645\u0648\u0631\u0633 \u062a\u0646\u0641\u0633\u064a',ch3Desc:'\u0639\u0645\u064a\u0642 = \u0634\u0631\u0637\u0629\u060c \u0636\u062d\u0644 = \u0646\u0642\u0637\u0629.',
    howto_1:'\u0627\u0646\u0642\u0631 \u0628\u062f\u0621.',howto_2:'\u0634\u0647\u064a\u0642/\u0632\u0641\u064a\u0631 \u0644\u0644\u062a\u062d\u0643\u0645.',howto_3:'\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0628\u062b.',
    wiki_fm_title:'\ud83d\udce1 \u062a\u0639\u062f\u064a\u0644 FM',wiki_fm:'f(t) = fc + kf*m(t). \u0627\u0644\u062d\u0627\u0645\u0644 + \u0625\u0634\u0627\u0631\u0629 \u0627\u0644\u062a\u0646\u0641\u0633.',
    wiki_resp_title:'\ud83e\udec1 \u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',wiki_resp:'\u0637\u0628\u064a\u0639\u064a: 12-20 \u0646/\u062f. \u0631\u064a\u0627\u0636\u064a: 6-10.',
    activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',
    settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',
    soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',whisperMode:'\u0647\u0645\u0633',breathingGuide:'\u062a\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063a\u0637',musicMode:'\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',
    t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',
    ready:'\ud83e\udec1 \u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',
    breathStarted:'\u0628\u062f\u0623\u062a \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629',breathStopped:'\u062a\u0648\u0642\u0641',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Muscle Telegraph and Bio Nerve Impulse Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK (compact) ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const TM={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playTM(n){if(!soundEnabled||!n)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=TM[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=.06;g.gain.exponentialRampToValueAtTime(.001,t+.2+i*.15+.15);o.start(t+i*.15);o.stop(t+i*.15+.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playTM(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}

let logContainer;const logHistory=[];let typewriterEnabled=true;
function log(m,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);twAppend(d,ft)}else{d.textContent=ft;logContainer.appendChild(d)}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');logHistory.push({msg:m,type,ts:Date.now()});applyLF()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='breath-log.txt';a.click()}

let aLF='all';
function initLF(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');aLF=b.dataset.filter;applyLF();playSound('click')})})}
function applyLF(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(aLF==='all'||l.classList.contains(aLF))?'':'none'})}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function twAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18)}el.classList.remove('typing')}
function calcHijri(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{return''}}

let matrixOn=false,mAnim=null;const AC='\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixOn){matrixOn=false;cancelAnimationFrame(mAnim);c.classList.remove('active');return}matrixOn=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixOn)return;ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(AC[Math.floor(Math.random()*AC.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++}mAnim=requestAnimationFrame(draw)}draw()}

let morseTO=null;function initMorse(){document.addEventListener('mousedown',e=>{const l=e.target.closest('.log-line');if(!l)return;morseTO=setTimeout(()=>{const d=document.querySelector('.status-dot');if(d){d.style.background='#33ff33';d.style.boxShadow='0 0 8px #33ff33';setTimeout(()=>{d.style.background='';d.style.boxShadow=''},500)}},600)});document.addEventListener('mouseup',()=>{if(morseTO){clearTimeout(morseTO);morseTO=null}})}

let musicOn=false;function toggleMusic(){if(musicOn){musicOn=false;document.querySelectorAll('.deco-band').forEach(b=>{b.style.height='';b.style.opacity=''});return}navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{if(!audioCtx)audioCtx=new AudioCtx();const src=audioCtx.createMediaStreamSource(s),ana=audioCtx.createAnalyser();ana.fftSize=256;src.connect(ana);musicOn=true;const data=new Uint8Array(ana.frequencyBinCount);function vis(){if(!musicOn)return;ana.getByteFrequencyData(data);const bass=data.slice(0,10).reduce((a,b)=>a+b,0)/10/255;document.querySelectorAll('.deco-band').forEach(b=>{b.style.height=(2+bass*10)+'px';b.style.opacity=.4+bass*.6});requestAnimationFrame(vis)}vis()}).catch(()=>{})}

let rec=null,whisperOn=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window))return;if(whisperOn){if(rec)rec.stop();whisperOn=false;return}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;rec=new SR();rec.continuous=true;rec.interimResults=false;rec.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)log(`\ud83c\udfa4 ${e.results[i][0].transcript.trim()}`,'rx')};rec.onend=()=>{if(whisperOn)rec.start()};rec.start();whisperOn=true}

let breathGuideOn=false,dhikrN=0;
function toggleBG(){breathGuideOn=!breathGuideOn;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathGuideOn))}
function incDhikr(){if(!breathGuideOn)return;dhikrN++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrN}

function initLR(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}

function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const tgt=$('help'+t.dataset.tab.charAt(0).toUpperCase()+t.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const s=$(id);if(!s||!s.classList.contains('open'))continue;const f=s.querySelectorAll('button,[href],input,select,textarea');if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}return}}

function sendMsg(type,data){try{localStorage.setItem('wdiy-app-msg',JSON.stringify({type,data,from:document.title,ts:Date.now()}));localStorage.removeItem('wdiy-app-msg')}catch{}}
function onMsg(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue))}catch{}})}

const KN=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let ki=0;
function initKN(){document.addEventListener('keydown',e=>{if(e.key===KN[ki]){ki++;if(ki===KN.length){ki=0;toggleMatrix()}}else ki=0})}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLF();
  const hB=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');if(hB)hB.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;initHelpTabs();
  const sB=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');if(sB)sB.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lB=$('logBtn'),lC=$('logCloseBtn');if(lB)lB.onclick=toggleLog;if(lC)lC.onclick=closeLog;initLR();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}}}
  const wB=$('whisperBtn');if(wB)wB.onclick=toggleWhisper;
  const bB=$('breathingBtn'),dD=$('dhikrDisplay'),dB=$('dhikrBtn');if(bB)bB.onclick=()=>{toggleBG();if(dD)dD.style.display=breathGuideOn?'flex':'none'};if(dB)dB.onclick=incDhikr;
  const mB=$('musicBtn');if(mB)mB.onclick=toggleMusic;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}if(e.key==='Tab')trapFocus(e)});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);
  const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  onMsg(m=>log(`\ud83d\udce8 ${m.from}: ${m.type}`,'rx'));initKN();initMorse();
  const hd=$('hijriDate');if(hd){const h=calcHijri();if(h)hd.textContent=h}
  let lClicks=0,lTimer=null;if(lw){lw.style.cursor='pointer';lw.addEventListener('click',()=>{lClicks++;if(lTimer)clearTimeout(lTimer);if(lClicks>=3){lClicks=0;toggleMatrix()}else lTimer=setTimeout(()=>lClicks=0,500)})}
  log(LANG[currentLang].ready,'success');
  setTimeout(initBreathApp,50);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════ */
/* ═══════ BREATH MODULATOR SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════ */

let breathRunning=false,breathPhase=0,breathRate=14,breathDepth=50,isTx=false;
let breathData=[],carrierData=[];

function initBreathApp(){
  const canvas=$('breathCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=340;
  const W=canvas.width,H=canvas.height;let t=0;

  function drawGrid(){
    ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  }

  function drawBreathEnvelope(){
    if(breathData.length<2)return;
    // Fill area
    ctx.beginPath();ctx.moveTo(0,H*.35);
    breathData.forEach((v,i)=>{ctx.lineTo(i,H*.35-v+H*.15)});
    ctx.lineTo(breathData.length-1,H*.35);ctx.closePath();
    ctx.fillStyle='rgba(102,255,204,.06)';ctx.fill();
    // Line
    ctx.beginPath();ctx.strokeStyle='#66ffcc';ctx.lineWidth=3;ctx.shadowColor='#66ffcc';ctx.shadowBlur=12;
    breathData.forEach((v,i)=>{const x=i,y=H*.25-v+H*.15;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
    ctx.stroke();ctx.shadowBlur=0;
  }

  function drawCarrier(){
    if(carrierData.length<2||!isTx)return;
    ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1;
    carrierData.forEach((v,i)=>{const x=i,y=H*.72+v;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
    ctx.stroke();
    // Carrier envelope ghost
    ctx.beginPath();ctx.strokeStyle='rgba(255,102,51,.15)';ctx.lineWidth=1;
    breathData.forEach((v,i)=>{const x=i,y=H*.72-v*.3;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
    ctx.stroke();
  }

  function drawLabels(){
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';
    ctx.fillText('BREATH ENVELOPE',10,20);
    ctx.fillText('RF CARRIER (433.92 MHz FM)',10,H*.57+15);
    // Divider
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.setLineDash([4,8]);
    ctx.beginPath();ctx.moveTo(0,H*.52);ctx.lineTo(W,H*.52);ctx.stroke();ctx.setLineDash([]);
  }

  function drawLungIcon(){
    if(!breathRunning)return;
    const cx=W-70,cy=H*.25;
    const expand=breathDepth/100;
    // Left lung
    ctx.beginPath();
    ctx.ellipse(cx-12,cy,8+expand*8,18+expand*12,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(102,255,204,${.1+expand*.15})`;ctx.fill();
    ctx.strokeStyle=`rgba(102,255,204,${.3+expand*.3})`;ctx.lineWidth=1.5;ctx.stroke();
    // Right lung
    ctx.beginPath();
    ctx.ellipse(cx+12,cy,8+expand*8,18+expand*12,0,0,Math.PI*2);
    ctx.fill();ctx.stroke();
    // Trachea
    ctx.beginPath();ctx.moveTo(cx,cy-25);ctx.lineTo(cx,cy-5);
    ctx.moveTo(cx,cy-5);ctx.lineTo(cx-12,cy+5);
    ctx.moveTo(cx,cy-5);ctx.lineTo(cx+12,cy+5);
    ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='8px Orbitron';ctx.textAlign='center';
    ctx.fillText(`${breathDepth}%`,cx,cy+35);ctx.textAlign='left';
  }

  function drawFreqDisplay(){
    if(!breathRunning)return;
    const envelope=Math.sin(breathPhase)*.5+.5;
    const freq=433.92+envelope*.5;
    const dev=envelope*.5;
    const fx=W-140,fy=H*.6,fw=130,fh=60;
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(fx,fy,fw,fh);
    ctx.strokeStyle='rgba(255,102,51,.3)';ctx.strokeRect(fx,fy,fw,fh);
    ctx.fillStyle='#ff6633';ctx.font='bold 16px Orbitron';ctx.textAlign='center';
    ctx.fillText(`${freq.toFixed(2)}`,fx+fw/2,fy+25);
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='9px Orbitron';
    ctx.fillText('MHz',fx+fw/2,fy+38);
    ctx.fillText(`\u0394f = \u00b1${(dev*1000).toFixed(0)} kHz`,fx+fw/2,fy+52);
    ctx.textAlign='left';
  }

  function drawTxIndicator(){
    if(!isTx)return;
    const ix=10,iy=H*.57;
    // Animated TX rings
    for(let i=0;i<4;i++){
      const r=10+i*8+(t*40)%50;
      const a=Math.max(0,(1-i/4)*.4);
      ctx.beginPath();ctx.arc(ix+30,iy+30,r,-Math.PI*.3,Math.PI*.3);
      ctx.strokeStyle=`rgba(255,102,51,${a})`;ctx.lineWidth=1.5;ctx.stroke();
    }
    ctx.fillStyle='#ff6633';ctx.font='bold 10px Orbitron';ctx.fillText('TX ON',ix+50,iy+25);
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(0,0,W,H);t+=.016;

    if(breathRunning){
      breathPhase+=.016*breathRate/60*Math.PI*2;
      const envelope=Math.sin(breathPhase)*.5+.5;
      breathDepth=Math.round(envelope*100);
      const carrierFreq=433.92+envelope*.5;
      breathData.push(envelope*H*.3);if(breathData.length>W)breathData.shift();
      const carrier=Math.sin(t*carrierFreq*2)*22*envelope;
      carrierData.push(carrier);if(carrierData.length>W)carrierData.shift();
      breathRate=Math.round(12+Math.sin(t*.08)*3+Math.random()*.5);

      const bd=$('breathDisplay'),sr=$('statRate'),sd=$('statDepth'),sc=$('statCarrier'),sv=$('statDev');
      const phase=envelope>.5?'Inhale...':'Exhale...';
      if(bd)bd.textContent=`${phase} | Rate: ${breathRate} BrPM | Carrier: ${carrierFreq.toFixed(2)} MHz`;
      if(sr)sr.textContent=breathRate;if(sd)sd.textContent=breathDepth;
      if(sc)sc.textContent=carrierFreq.toFixed(2);if(sv)sv.textContent=(envelope*.5).toFixed(2);

      const mf=$('modFill'),ml=$('modLabel');
      if(mf)mf.style.width=breathDepth+'%';
      if(ml)ml.textContent=`Modulation Depth: ${breathDepth}%`;

      // Play ambient breath sound at cycle boundaries
      if(Math.abs(envelope-.5)<.02&&Math.sin(breathPhase)>0)playSound('breathe');
    }

    drawGrid();
    drawBreathEnvelope();
    drawCarrier();
    drawLabels();
    drawLungIcon();
    drawFreqDisplay();
    drawTxIndicator();

    // Ambient particles
    if(breathRunning){
      for(let i=0;i<2;i++){
        ctx.fillStyle=`rgba(102,255,204,${Math.random()*.08})`;
        ctx.fillRect(Math.random()*W,Math.random()*H*.5,2,2);
      }
      if(isTx){
        for(let i=0;i<2;i++){
          ctx.fillStyle=`rgba(255,102,51,${Math.random()*.08})`;
          ctx.fillRect(Math.random()*W,H*.55+Math.random()*H*.4,2,2);
        }
      }
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn=$('startBtn'),inhaleBtn=$('inhaleBtn'),exhaleBtn=$('exhaleBtn'),txBtn=$('txBtn');
  if(startBtn)startBtn.onclick=()=>{
    breathRunning=!breathRunning;setStatus(breathRunning);
    const span=startBtn.querySelector('[data-i18n]'),s=LANG[currentLang];
    if(span)span.textContent=breathRunning?(s.stopBreath||'Stop'):s.startBreath;
    log(breathRunning?s.breathStarted:s.breathStopped,'info');
  };
  if(inhaleBtn)inhaleBtn.onclick=()=>{breathPhase=Math.PI/2;log('Manual inhale','info');playSound('click')};
  if(exhaleBtn)exhaleBtn.onclick=()=>{breathPhase=3*Math.PI/2;log('Manual exhale','info');playSound('click')};
  if(txBtn)txBtn.onclick=()=>{
    isTx=!isTx;
    const span=txBtn.querySelector('[data-i18n]'),s=LANG[currentLang];
    if(span)span.textContent=isTx?(s.txOff||'TX Off'):(s.txBtn||'TX On');
    log(isTx?'TX: Carrier modulation ON':'TX: Carrier OFF',isTx?'tx':'info');
    showToast(isTx?'Transmitting...':'TX Off',1500);
    if(isTx)playSound('tx');
    sendMsg('breath-tx',{active:isTx,rate:breathRate});
  };
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ BREATH MODULATOR ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootBreathViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(102,255,204,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- state --- */
    var breathPhase=0,breathRate2=14,breathDepth2=50;
    var breathHistory=new Float32Array(W);
    var carrierHistory=new Float32Array(W);
    var fmDeviationHistory=[];var MAX_DEV=120;
    var spectrogramData=[];var MAX_SPEC=80;
    var breathCycles=0,lastPeak=0;
    var autoBreath=true;
    var coherence=0.5;

    /* --- lung model parameters --- */
    var lungVolume=0.3,tidalVolume=0.5,residualVol=0.25;

    /* --- respiratory waveform generator --- */
    function breathWave(phase){
      var p=phase%(Math.PI*2);
      /* more natural breathing: fast inhale, slow exhale */
      var inhale=Math.sin(p)*0.5+0.5;
      return inhale>0.5?Math.pow((inhale-0.5)*2,0.7)*0.5+0.5:Math.pow((0.5-inhale)*2,0.5)*0.5;
    }

    /* --- draw anatomical lung diagram --- */
    function drawLungs(ox,oy,w,h,expand){
      ctx.strokeStyle='rgba(102,255,204,'+(0.2+expand*0.3)+')';ctx.lineWidth=1.5;
      /* trachea */
      ctx.beginPath();ctx.moveTo(ox+w/2,oy);ctx.lineTo(ox+w/2,oy+h*0.25);ctx.stroke();
      /* bronchi */
      ctx.beginPath();ctx.moveTo(ox+w/2,oy+h*0.25);ctx.quadraticCurveTo(ox+w*0.35,oy+h*0.30,ox+w*0.30,oy+h*0.40);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ox+w/2,oy+h*0.25);ctx.quadraticCurveTo(ox+w*0.65,oy+h*0.30,ox+w*0.70,oy+h*0.40);ctx.stroke();
      /* left lung */
      var le=8+expand*12;
      ctx.beginPath();ctx.ellipse(ox+w*0.32,oy+h*0.55,w*0.18+le,h*0.28+le*0.8,0,0,Math.PI*2);
      ctx.fillStyle='rgba(102,255,204,'+(0.05+expand*0.1)+')';ctx.fill();
      ctx.strokeStyle='rgba(102,255,204,'+(0.25+expand*0.3)+')';ctx.stroke();
      /* right lung (slightly bigger) */
      ctx.beginPath();ctx.ellipse(ox+w*0.68,oy+h*0.53,w*0.20+le,h*0.30+le*0.8,0,0,Math.PI*2);
      ctx.fill();ctx.stroke();
      /* diaphragm */
      ctx.beginPath();ctx.moveTo(ox+w*0.10,oy+h*0.82+expand*5);
      ctx.quadraticCurveTo(ox+w/2,oy+h*0.75-expand*10,ox+w*0.90,oy+h*0.82+expand*5);
      ctx.strokeStyle='rgba(255,204,0,'+(0.2+expand*0.2)+')';ctx.lineWidth=2;ctx.stroke();
      /* alveoli detail */
      for(var ai=0;ai<6;ai++){
        var ax=ox+w*0.25+ai%3*w*0.10+Math.sin(ai)*8;
        var ay=oy+h*0.45+Math.floor(ai/3)*h*0.12;
        var ar=3+expand*4+Math.sin(t*2+ai)*1;
        ctx.beginPath();ctx.arc(ax,ay,ar,0,Math.PI*2);
        ctx.fillStyle='rgba(102,255,204,'+(0.1+expand*0.15)+')';ctx.fill();
      }
      for(var ai2=0;ai2<6;ai2++){
        var ax2=ox+w*0.60+ai2%3*w*0.10+Math.cos(ai2)*8;
        var ay2=oy+h*0.43+Math.floor(ai2/3)*h*0.12;
        var ar2=3+expand*4+Math.sin(t*2+ai2+1)*1;
        ctx.beginPath();ctx.arc(ax2,ay2,ar2,0,Math.PI*2);
        ctx.fill();
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RESPIRATORY ANATOMY',ox+5,oy-5);
      ctx.fillText('Vol: '+(lungVolume*100).toFixed(0)+'%',ox+5,oy+h+12);
    }

    /* --- draw FM modulation diagram --- */
    function drawFMDiagram(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('FM MODULATION ANALYSIS',ox+5,oy+12);

      /* carrier signal */
      var third=h/3;
      ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1;
      for(var i=0;i<w;i++){
        var env=breathHistory[Math.floor(i/w*W)]/100;
        var freq2=10+env*30;
        var y=oy+third*0.5+Math.sin(i*freq2*0.02)*third*0.3;
        if(i===0)ctx.moveTo(ox+i,y);else ctx.lineTo(ox+i,y);
      }
      ctx.stroke();
      ctx.fillStyle='rgba(255,102,51,0.4)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('FM CARRIER',ox+5,oy+22);

      /* deviation history */
      if(fmDeviationHistory.length>1){
        ctx.beginPath();ctx.strokeStyle='#ffcc00';ctx.lineWidth=1.2;
        fmDeviationHistory.forEach(function(v,i2){
          var x=ox+(i2/MAX_DEV)*w;
          var y=oy+third+third*0.5-v/100*third*0.8;
          if(i2===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
        ctx.fillStyle='rgba(255,204,0,0.4)';ctx.fillText('FREQ DEVIATION',ox+5,oy+third+12);
      }

      /* breathing coherence */
      var cohY=oy+third*2;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(ox+5,cohY+5,w-10,14);
      ctx.fillStyle=coherence>0.7?'#33ff33':coherence>0.4?'#ffcc00':'#ff3366';
      ctx.fillRect(ox+5,cohY+5,(w-10)*coherence,14);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BREATH COHERENCE: '+(coherence*100).toFixed(0)+'%',ox+5,cohY+32);
    }

    /* --- draw breathing spectrogram --- */
    function drawBreathSpectrogram(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RESPIRATORY SPECTROGRAM',ox+5,oy+12);

      var cellW=w/48,cellH=(h-16)/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col=0;col<48;col++){
          var v=spectrogramData[row][col];
          ctx.fillStyle='rgb('+(Math.min(255,v*400)|0)+','+(Math.min(255,Math.max(0,v*600-80))|0)+','+(Math.max(0,(0.6-v)*300)|0)+')';
          ctx.fillRect(ox+col*cellW,oy+16+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto breathing simulation */
      if(autoBreath){
        breathPhase+=0.016*breathRate2/60*Math.PI*2;
        var envelope=breathWave(breathPhase);
        breathDepth2=Math.round(envelope*100);
        lungVolume=residualVol+envelope*tidalVolume;
        breathRate2=12+Math.sin(t*0.08)*3+Math.random()*0.5;

        /* detect breath cycles */
        if(envelope>0.95&&t-lastPeak>1){breathCycles++;lastPeak=t;}

        /* coherence from rate stability */
        coherence+=(0.7+Math.sin(t*0.2)*0.2-coherence)*0.02;
      }

      /* shift buffers */
      for(var i=0;i<W-1;i++){breathHistory[i]=breathHistory[i+1];carrierHistory[i]=carrierHistory[i+1];}
      breathHistory[W-1]=breathDepth2;
      var carrierFreq2=433.92+breathDepth2/100*0.5;
      carrierHistory[W-1]=Math.sin(t*carrierFreq2*2)*22*(breathDepth2/100);

      /* FM deviation */
      fmDeviationHistory.push(breathDepth2*0.5);
      if(fmDeviationHistory.length>MAX_DEV)fmDeviationHistory.shift();

      /* spectrogram row */
      var specRow=[];
      for(var sb=0;sb<48;sb++){
        var freq3=sb*0.5;var amp3=0.02;
        amp3+=Math.exp(-(freq3-breathRate2/60)*(freq3-breathRate2/60)/0.05)*breathDepth2/100*0.6;
        amp3+=Math.exp(-(freq3-breathRate2/30)*(freq3-breathRate2/30)/0.1)*breathDepth2/100*0.2;
        amp3+=Math.random()*0.02;
        specRow.push(Math.min(1,amp3));
      }
      spectrogramData.push(specRow);if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      /* ---- LAYOUT ---- */

      /* Top-left: Breath waveform */
      var waveY=0,waveH2=H*0.25;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,waveY,W*0.58,waveH2);
      ctx.beginPath();ctx.strokeStyle='#66ffcc';ctx.lineWidth=2.5;ctx.shadowColor='#66ffcc';ctx.shadowBlur=8;
      for(var i2=0;i2<W*0.58;i2++){
        var idx2=Math.floor(i2/(W*0.58)*W);
        var y=waveY+waveH2-breathHistory[idx2]/100*(waveH2-10)-5;
        if(i2===0)ctx.moveTo(i2,y);else ctx.lineTo(i2,y);
      }
      ctx.stroke();ctx.shadowBlur=0;
      /* breath area fill */
      ctx.beginPath();ctx.moveTo(0,waveY+waveH2);
      for(var i3=0;i3<W*0.58;i3++){
        var idx3=Math.floor(i3/(W*0.58)*W);
        ctx.lineTo(i3,waveY+waveH2-breathHistory[idx3]/100*(waveH2-10)-5);
      }
      ctx.lineTo(W*0.58,waveY+waveH2);ctx.closePath();
      ctx.fillStyle='rgba(102,255,204,0.06)';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BREATHING WAVEFORM',5,waveY+12);
      ctx.fillText(breathRate2.toFixed(0)+' BrPM  |  Depth: '+breathDepth2+'%  |  Cycles: '+breathCycles,5,waveY+waveH2-5);

      /* Top-right: Lung anatomy */
      drawLungs(W*0.60,5,W*0.38,waveH2-10,breathDepth2/100);

      /* Middle-left: FM carrier trace */
      var fmY=waveH2+8,fmH=H*0.18;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,fmY,W*0.58,fmH);
      ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1.2;
      for(var i4=0;i4<W*0.58;i4++){
        var idx4=Math.floor(i4/(W*0.58)*W);
        var y2=fmY+fmH/2+carrierHistory[idx4];
        if(i4===0)ctx.moveTo(i4,y2);else ctx.lineTo(i4,y2);
      }
      ctx.stroke();
      /* envelope ghost */
      ctx.beginPath();ctx.strokeStyle='rgba(255,102,51,0.2)';ctx.lineWidth=1;
      for(var i5=0;i5<W*0.58;i5++){
        var idx5=Math.floor(i5/(W*0.58)*W);
        ctx.lineTo(i5,fmY+fmH/2-breathHistory[idx5]/100*fmH*0.3);
      }
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RF CARRIER (433.92 MHz FM)',5,fmY+12);

      /* Middle-right: FM modulation panel */
      drawFMDiagram(W*0.60,fmY,W*0.40-5,fmH);

      /* Bottom-left: Spectrogram */
      var specY2=fmY+fmH+8;
      drawBreathSpectrogram(0,specY2,W*0.55,H*0.22);

      /* Bottom-right: Stats */
      var stX=W*0.56,stY2=specY2,stW2=W*0.44-5,stH2=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(stX,stY2,stW2,stH2);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('RESPIRATORY METRICS',stX+10,stY2+14);
      var stats2=[
        ['Breath Rate',breathRate2.toFixed(1)+' BrPM'],
        ['Depth',breathDepth2+'%'],
        ['Lung Volume',(lungVolume*100).toFixed(0)+'%'],
        ['FM Carrier',(433.92+breathDepth2/100*0.5).toFixed(2)+' MHz'],
        ['Deviation','\u00b1'+(breathDepth2*5).toFixed(0)+' kHz'],
        ['Coherence',(coherence*100).toFixed(0)+'%'],
        ['Cycles',breathCycles.toString()],
        ['Phase',(breathDepth2>50?'INHALE':'EXHALE')]
      ];
      stats2.forEach(function(s,si){
        var sx2=stX+10+(si%2)*stW2*0.48;
        var sy2=stY2+30+Math.floor(si/2)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(s[0]+':',sx2,sy2);
        ctx.fillStyle='#66ffcc';ctx.fillText(s[1],sx2+80,sy2);
      });

      /* Very bottom: phase indicator */
      var phY=specY2+stH2+10;
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,phY,W,H-phY);
      /* breathing phase circle */
      var pcx=W/2,pcy=phY+(H-phY)/2;
      var pr2=Math.min(30,(H-phY)/2-5);
      ctx.beginPath();ctx.arc(pcx,pcy,pr2,0,Math.PI*2);
      ctx.strokeStyle='rgba(102,255,204,0.2)';ctx.lineWidth=2;ctx.stroke();
      var angle2=breathPhase%(Math.PI*2);
      ctx.beginPath();ctx.moveTo(pcx,pcy);
      ctx.lineTo(pcx+Math.cos(angle2-Math.PI/2)*pr2,pcy+Math.sin(angle2-Math.PI/2)*pr2);
      ctx.strokeStyle='#66ffcc';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText('BREATH PHASE',pcx,phY+12);ctx.textAlign='left';

      /* HUD */
      ctx.strokeStyle='rgba(102,255,204,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl2=18;ctx.strokeStyle='rgba(102,255,204,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl2);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl2,c[1]);ctx.stroke();
      });

      requestAnimationFrame(frame);
    }

    cvs.addEventListener('click',function(){
      breathRate2=6+Math.random()*18;
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootBreathViz);
  else setTimeout(bootBreathViz,200);
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
