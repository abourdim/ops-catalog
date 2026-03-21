/**
 * Workshop DIY — Bio Nerve Impulse Detector v1.0
 * HackRF detects nerve impulses — Self-contained
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.08);o.start(t);o.stop(t+.08)}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25)}}
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

const LANG={en:{
    ...LANG_BASE.en,title:'Bio Nerve Impulse Detector',subtitle:'Detect nerve impulses via RF',disconnected:'Disconnected',connected:'Connected',mainSection:'Nerve Detector \u2014 Action Potential Monitor',mainDesc:'HackRF detects electromagnetic emissions from nerve impulses',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',btn1:'Start Detector',btn1Stop:'Stop',btn2:'Stimulate',btn3:'Burst Mode',btn4:'Reset Data',stat1:'spikes',stat2:'m/s velocity',stat3:'mV amplitude',stat4:'Hz rate',step1Title:'Nerve Signal',step1Desc:'Neurons fire action potentials: -70mV to +40mV in ~1ms creating EM emissions.',step2Title:'RF Detection',step2Desc:'HackRF SDR with high-gain antenna detects faint nerve emissions.',step3Title:'Signal Processing',step3Desc:'Band-pass filtering and averaging extract nerve signals from noise.',step4Title:'Nerve Mapping',step4Desc:'Different nerves have different conduction velocities (1-120 m/s).',ch1Title:'Find Your Nerve',ch1Desc:'Where do you detect the strongest signals?',ch2Title:'Reaction Time',ch2Desc:'Measure delay between stimulus and detected impulse.',ch3Title:'Nerve Orchestra',ch3Desc:'Stimulate multiple points and visualize the traveling wave.',howto_1:'Click Start Detector to begin monitoring.',howto_2:'Click Stimulate to trigger a nerve spike.',howto_3:'Use Burst Mode for rapid-fire stimulation.',wiki1_title:'\u26a1 Action Potentials',wiki1_text:'Resting -70mV, depolarization +40mV, repolarization, hyperpolarization, rest.',wiki2_title:'\ud83d\udce1 SDR Detection',wiki2_text:'HackRF 0.001-6GHz. Nerve signals in low kHz band.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\u26a1 Nerve Detector ready \u2014 detect the spark!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 Language \u2192 English',themeChanged:'\ud83c\udfa8 Theme \u2192',sectionCode:'Device Code',faq_q1:'What is Bio Nerve Impulse Detector?',faq_a1:'Bio Nerve Impulse Detector lets you hackrf detects electromagnetic emissions from nerve impulses. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you neurons fire action potentials: -70mv to +40mv in ~1ms creating em emissions. Then you hackrf sdr with high-gain antenna detects faint nerve emissions.',faq_q3:'What do the controls do?',faq_a3:'Click Start Detector to begin monitoring. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real biomedical signals principles.',faq_q5:'What should I experiment with?',faq_a5:'Where do you detect the strongest signals?',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Nerve Impulse Detector! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start Detector to begin monitoring. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "A \u2014 How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how biomedical signals works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "A \u2014 How It Works" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Bio D\u00e9tecteur Nerveux',subtitle:'D\u00e9tecter impulsions nerveuses par RF',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'D\u00e9tecteur Nerveux \u2014 Moniteur de Potentiel d\'Action',mainDesc:'HackRF d\u00e9tecte les \u00e9missions \u00e9lectromagn\u00e9tiques des nerfs',sectionA:'A \u2014 Comment \u00e7a marche',sectionC:'C \u2014 D\u00e9fis',btn1:'D\u00e9marrer',btn1Stop:'Arr\u00eat',btn2:'Stimuler',btn3:'Mode Rafale',btn4:'R\u00e9initialiser',stat1:'pics',stat2:'m/s',stat3:'mV',stat4:'Hz',step1Title:'Signal Nerveux',step1Desc:'Neurones: -70mV \u00e0 +40mV en ~1ms.',step2Title:'D\u00e9tection RF',step2Desc:'HackRF SDR d\u00e9tecte les \u00e9missions nerveuses.',step3Title:'Traitement',step3Desc:'Filtrage passe-bande extrait le signal du bruit.',step4Title:'Cartographie',step4Desc:'Vitesses de conduction: 1-120 m/s.',ch1Title:'Trouvez Votre Nerf',ch1Desc:'O\u00f9 le signal est-il le plus fort?',ch2Title:'Temps de R\u00e9action',ch2Desc:'Mesurez le d\u00e9lai stimulus-d\u00e9tection.',ch3Title:'Orchestre Nerveux',ch3Desc:'Stimulez plusieurs points.',howto_1:'Cliquez D\u00e9marrer.',howto_2:'Cliquez Stimuler pour un pic.',howto_3:'Mode Rafale pour stimulation rapide.',wiki1_title:'\u26a1 Potentiels d\'Action',wiki1_text:'Repos -70mV, d\u00e9polarisation +40mV.',wiki2_title:'\ud83d\udce1 D\u00e9tection SDR',wiki2_text:'HackRF 0.001-6GHz, signaux nerveux en bande kHz.',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sons',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\u26a1 D\u00e9tecteur nerveux pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 \u2192',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Skin Galvanic Key and Bio Heartbeat Cipher ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
ar:{title:'\u0643\u0627\u0634\u0641 \u0627\u0644\u0646\u0628\u0636\u0627\u062a \u0627\u0644\u0639\u0635\u0628\u064a\u0629',subtitle:'\u0643\u0634\u0641 \u0627\u0644\u0646\u0628\u0636\u0627\u062a \u0627\u0644\u0639\u0635\u0628\u064a\u0629 \u0639\u0628\u0631 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0643\u0627\u0634\u0641 \u0627\u0644\u0623\u0639\u0635\u0627\u0628 \u2014 \u0645\u0631\u0627\u0642\u0628\u0629 \u062c\u0647\u062f \u0627\u0644\u0641\u0639\u0644',mainDesc:'HackRF \u064a\u0643\u0634\u0641 \u0627\u0644\u0627\u0646\u0628\u0639\u0627\u062b\u0627\u062a \u0627\u0644\u0643\u0647\u0631\u0648\u0645\u063a\u0646\u0627\u0637\u064a\u0633\u064a\u0629 \u0644\u0644\u0623\u0639\u0635\u0627\u0628',sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',btn1:'\u0628\u062f\u0621 \u0627\u0644\u0643\u0627\u0634\u0641',btn1Stop:'\u0625\u064a\u0642\u0627\u0641',btn2:'\u062a\u062d\u0641\u064a\u0632',btn3:'\u0648\u0636\u0639 \u0627\u0644\u0631\u0634\u0642\u0629',btn4:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',stat1:'\u0646\u0628\u0636\u0627\u062a',stat2:'\u0645/\u062b',stat3:'mV',stat4:'Hz',step1Title:'\u0625\u0634\u0627\u0631\u0629 \u0639\u0635\u0628\u064a\u0629',step1Desc:'\u0627\u0644\u062e\u0644\u0627\u064a\u0627 \u0627\u0644\u0639\u0635\u0628\u064a\u0629: -70mV \u0625\u0644\u0649 +40mV.',step2Title:'\u0643\u0634\u0641 RF',step2Desc:'HackRF \u064a\u0643\u0634\u0641 \u0627\u0646\u0628\u0639\u0627\u062b\u0627\u062a \u0627\u0644\u0623\u0639\u0635\u0627\u0628.',step3Title:'\u0645\u0639\u0627\u0644\u062c\u0629',step3Desc:'\u062a\u0631\u0634\u064a\u062d \u0648\u0645\u062a\u0648\u0633\u0637 \u064a\u0633\u062a\u062e\u0644\u0635 \u0627\u0644\u0625\u0634\u0627\u0631\u0629.',step4Title:'\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0623\u0639\u0635\u0627\u0628',step4Desc:'\u0633\u0631\u0639\u0627\u062a \u062a\u0648\u0635\u064a\u0644: 1-120 \u0645/\u062b.',ch1Title:'\u0627\u0628\u062d\u062b \u0639\u0646 \u0639\u0635\u0628\u0643',ch1Desc:'\u0623\u064a\u0646 \u0627\u0644\u0625\u0634\u0627\u0631\u0629 \u0627\u0644\u0623\u0642\u0648\u0649\u061f',ch2Title:'\u0632\u0645\u0646 \u0627\u0644\u0631\u062f',ch2Desc:'\u0642\u0633 \u0627\u0644\u062a\u0623\u062e\u064a\u0631 \u0628\u064a\u0646 \u0627\u0644\u062a\u062d\u0641\u064a\u0632 \u0648\u0627\u0644\u0643\u0634\u0641.',ch3Title:'\u0623\u0648\u0631\u0643\u0633\u062a\u0631\u0627 \u0639\u0635\u0628\u064a\u0629',ch3Desc:'\u062d\u0641\u0632 \u0646\u0642\u0627\u0637 \u0645\u062a\u0639\u062f\u062f\u0629.',howto_1:'\u0627\u0646\u0642\u0631 \u0628\u062f\u0621.',howto_2:'\u0627\u0646\u0642\u0631 \u062a\u062d\u0641\u064a\u0632.',howto_3:'\u0648\u0636\u0639 \u0627\u0644\u0631\u0634\u0642\u0629 \u0644\u0644\u062a\u062d\u0641\u064a\u0632 \u0627\u0644\u0633\u0631\u064a\u0639.',wiki1_title:'\u26a1 \u062c\u0647\u062f \u0627\u0644\u0641\u0639\u0644',wiki1_text:'\u0631\u0627\u062d\u0629 -70mV\u060c \u0625\u0632\u0627\u0644\u0629 \u0627\u0633\u062a\u0642\u0637\u0627\u0628 +40mV.',wiki2_title:'\ud83d\udce1 SDR',wiki2_text:'HackRF 0.001-6GHz. \u0625\u0634\u0627\u0631\u0627\u062a \u0639\u0635\u0628\u064a\u0629 \u0628\u0646\u0637\u0627\u0642 kHz.',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',theme:'\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',breathingGuide:'\u062a\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063a\u0637',musicMode:'\u0645\u0648\u0633\u064a\u0642\u0649',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\u26a1 \u0643\u0627\u0634\u0641 \u0627\u0644\u0623\u0639\u0635\u0627\u0628 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\ud83c\udfa8 \u2190',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Skin Galvanic Key and Bio Heartbeat Cipher! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}};

/* ═══════ FRAMEWORK ═══════ */
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{};const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+n]||n}`,'info')}let logContainer;const logHistory=[];function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');logHistory.push({m,t,ts:Date.now()});applyLogFilter()}function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='nerve-log.txt';a.click()}let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter()})})}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none'})}let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}function sleep(ms){return new Promise(r=>setTimeout(r,ms))}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{return''}}function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const id='help'+t.dataset.tab.charAt(0).toUpperCase()+t.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active')})})}function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)}draw()}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ NERVE IMPULSE SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let detecting=false,nerveData=[],spikeCount=0,velocity=45,spikeRate=0,lastSpikeTime=0;

function actionPotential(phase){
  if(phase<0||phase>1)return -70;
  if(phase<.1)return -70+phase/.1*110;
  if(phase<.2)return 40-(phase-.1)/.1*120;
  if(phase<.4)return -80+(phase-.2)/.2*10;
  return -70;
}

function initNerveApp(){
  const canvas=$('nerveCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;
  const W=canvas.width,H=canvas.height;let t=0;

  function triggerSpike(){
    for(let i=0;i<20;i++)nerveData.push(actionPotential(i/20));
    spikeCount++;velocity=30+Math.random()*90;
    const now=Date.now();if(lastSpikeTime>0)spikeRate=1000/(now-lastSpikeTime);lastSpikeTime=now;
    const ss=$('statSpikes'),sv=$('statVelocity'),sa=$('statAmplitude'),sr=$('statFreq');
    if(ss)ss.textContent=spikeCount;if(sv)sv.textContent=Math.round(velocity);
    if(sa)sa.textContent='110';if(sr)sr.textContent=spikeRate.toFixed(1);
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t+=.016;

    if(detecting){
      const spike=Math.random()<.025;
      if(spike){triggerSpike();log(`\u26a1 Spike #${spikeCount} (${Math.round(velocity)}m/s)`,'rx')}
      else{nerveData.push(-70+(Math.random()-.5)*5)}
      if(nerveData.length>W)nerveData.shift();
    }

    // Draw nerve signal trace
    if(nerveData.length>1){
      ctx.beginPath();ctx.strokeStyle='#33ff33';ctx.lineWidth=2;
      ctx.shadowColor='#33ff33';ctx.shadowBlur=6;
      nerveData.forEach((v,i)=>{const x=i,y=H/2-(v+70)/180*H*.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();ctx.shadowBlur=0;
    }

    // Reference voltage lines
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.setLineDash([4,8]);
    [-70,0,40].forEach(mv=>{const y=H/2-(mv+70)/180*H*.8;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='8px Orbitron';ctx.fillText(`${mv}mV`,W-45,y-3)});
    ctx.setLineDash([]);

    // Info panel
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(W-200,8,192,100);
    ctx.fillStyle='#ffcc00';ctx.font='bold 10px Orbitron';ctx.fillText('Action Potential',W-190,22);
    ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px Orbitron';
    ctx.fillText(`Spikes: ${spikeCount}`,W-190,40);
    ctx.fillText(`Velocity: ${Math.round(velocity)} m/s`,W-190,54);
    ctx.fillText(`Rate: ${spikeRate.toFixed(1)} Hz`,W-190,68);
    ctx.fillText(`Resting: -70mV  Peak: +40mV`,W-190,82);
    ctx.fillText(`Amplitude: 110mV`,W-190,96);

    // Neuron diagram (simplified)
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(5,H-80,160,72);
    ctx.fillStyle='#6699ff';ctx.font='8px Orbitron';ctx.fillText('NEURON DIAGRAM',10,H-68);
    // Cell body
    ctx.beginPath();ctx.arc(50,H-40,12,0,Math.PI*2);ctx.fillStyle='#6699ff44';ctx.fill();ctx.strokeStyle='#6699ff';ctx.lineWidth=1.5;ctx.stroke();
    // Axon
    ctx.beginPath();ctx.moveTo(62,H-40);ctx.lineTo(150,H-40);ctx.strokeStyle='#33ff33';ctx.lineWidth=2;ctx.stroke();
    // Myelin sheaths
    for(let x=70;x<145;x+=18){ctx.beginPath();ctx.ellipse(x,H-40,7,5,0,0,Math.PI*2);ctx.fillStyle='#ffcc0033';ctx.fill();ctx.strokeStyle='#ffcc00';ctx.lineWidth=0.5;ctx.stroke()}
    // Traveling impulse
    if(detecting&&spikeCount>0){const ix=62+(t*100%88);ctx.beginPath();ctx.arc(ix,H-40,4,0,Math.PI*2);ctx.fillStyle='#33ff33';ctx.fill()}

    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),stimBtn=$('stimBtn'),burstBtn=$('burstBtn'),resetBtn=$('resetBtn');
  if(startBtn)startBtn.onclick=()=>{detecting=!detecting;setStatus(detecting);const span=startBtn.querySelector('[data-i18n]');if(span)span.textContent=detecting?LANG[currentLang].btn1Stop:LANG[currentLang].btn1;log(detecting?'\u26a1 Nerve detector active':'Stopped','info')};
  if(stimBtn)stimBtn.onclick=()=>{triggerSpike();log(`\u26a1 Manual spike #${spikeCount} (${Math.round(velocity)}m/s)`,'success');showToast('Spike detected!',800);playSound('click')};
  if(burstBtn)burstBtn.onclick=async()=>{log('\ud83d\udca5 Burst mode: 5 rapid spikes','info');for(let i=0;i<5;i++){triggerSpike();await sleep(100)}log(`Burst complete: ${spikeCount} total spikes`,'success');showToast('Burst complete!',1200)};
  if(resetBtn)resetBtn.onclick=()=>{nerveData=[];spikeCount=0;velocity=45;spikeRate=0;log('Data reset','info')};
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}}}
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none'};if(db)db.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}
  let lc=0,lt=null;const logo=$('logoWrap');if(logo){logo.style.cursor='pointer';logo.onclick=()=>{lc++;if(lt)clearTimeout(lt);if(lc>=3){lc=0;toggleMatrix()}else lt=setTimeout(()=>lc=0,500)}}
  log(LANG[currentLang].ready,'success');setTimeout(initNerveApp,50);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ NERVE IMPULSE DETECTOR CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootNerveViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(50,255,50,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* action potential shape */
    function ap(phase){
      if(phase<0||phase>1)return -70;
      if(phase<0.08)return -70+phase/0.08*110;
      if(phase<0.18)return 40-(phase-0.08)/0.1*120;
      if(phase<0.35)return -80+(phase-0.18)/0.17*10;
      return -70;
    }

    /* nerve fiber definitions */
    var nerves=[
      {name:'Motor Neuron',velocity:80,color:'#33ff33',myelinated:true,diameter:12},
      {name:'Sensory A-beta',velocity:55,color:'#6699ff',myelinated:true,diameter:8},
      {name:'Pain C-fiber',velocity:1.5,color:'#ff3366',myelinated:false,diameter:1}
    ];
    var activeNerve=0;

    /* data stores */
    var apBuffer=new Float32Array(W);
    var spikeCount=0,lastSpikeT=0,spikeRate=0;
    var rasterData=[];var MAX_RASTER=60;
    var conductionMap=[];var MAX_COND=120;
    var noiseFloor=[];
    var myelinPulses=[];

    /* init noise */
    for(var i=0;i<W;i++)noiseFloor.push(-70+(Math.random()-0.5)*5);

    /* trigger a spike */
    function triggerSpike(){
      var n=nerves[activeNerve];
      /* inject AP waveform */
      for(var i=0;i<30;i++){
        var idx=W-30+i;
        if(idx>=0&&idx<W)apBuffer[idx]=ap(i/30);
      }
      spikeCount++;
      var now=t;if(lastSpikeT>0)spikeRate=1/(now-lastSpikeT);lastSpikeT=now;

      /* raster entry */
      rasterData.push({time:t,nerve:activeNerve});
      if(rasterData.length>MAX_RASTER)rasterData.shift();

      /* conduction pulse */
      myelinPulses.push({x:0,speed:n.velocity/40,nerve:activeNerve,alpha:1});

      /* conduction map entry */
      var entry=[];
      for(var b=0;b<64;b++){
        var v=0.05;
        if(b<10)v+=Math.exp(-(b-3)*(b-3)/8)*0.8;
        entry.push(v+Math.random()*0.03);
      }
      conductionMap.push(entry);
      if(conductionMap.length>MAX_COND)conductionMap.shift();
    }

    /* auto-spike */
    var autoSpike=true;

    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto spikes */
      if(autoSpike&&Math.random()<0.04)triggerSpike();

      /* shift AP buffer */
      for(var i=0;i<W-1;i++)apBuffer[i]=apBuffer[i+1];
      apBuffer[W-1]=-70+(Math.random()-0.5)*4;

      var n=nerves[activeNerve];

      /* ---- SECTION 1: Top — Action Potential Trace ---- */
      var apY=0,apH=H*0.28;
      ctx.save();ctx.beginPath();ctx.rect(0,apY,W,apH);ctx.clip();
      ctx.fillStyle='rgba(6,6,16,0.3)';ctx.fillRect(0,apY,W,apH);

      /* reference lines */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.setLineDash([4,8]);ctx.lineWidth=0.5;
      [-70,0,40].forEach(function(mv){
        var y=apY+apH/2-(mv+70)/180*apH*0.8;
        ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,0.25)';ctx.font='7px Orbitron,monospace';
        ctx.fillText(mv+'mV',W-40,y-2);
      });
      ctx.setLineDash([]);

      /* AP trace */
      ctx.beginPath();ctx.strokeStyle=n.color;ctx.lineWidth=2;
      ctx.shadowColor=n.color;ctx.shadowBlur=8;
      for(var i=0;i<W;i++){
        var y=apY+apH/2-(apBuffer[i]+70)/180*apH*0.8;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();ctx.shadowBlur=0;
      ctx.restore();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('ACTION POTENTIAL MONITOR',10,apY+14);
      ctx.fillText(n.name+' | '+n.velocity+' m/s',10,apY+apH-8);

      /* ---- SECTION 2: Middle-left — Neuron Diagram ---- */
      var ndX=10,ndY=apH+10,ndW=W*0.42,ndH=H*0.32;
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ndX,ndY,ndW,ndH);

      /* soma (cell body) */
      var somaX=ndX+50,somaY=ndY+ndH/2;
      ctx.beginPath();ctx.arc(somaX,somaY,18,0,Math.PI*2);
      ctx.fillStyle=n.color+'22';ctx.fill();
      ctx.strokeStyle=n.color;ctx.lineWidth=1.5;ctx.stroke();

      /* dendrites */
      ctx.strokeStyle=n.color+'66';ctx.lineWidth=1;
      for(var d=0;d<5;d++){
        var angle=-Math.PI/2+d*Math.PI/6-Math.PI/6;
        ctx.beginPath();ctx.moveTo(somaX+18*Math.cos(angle),somaY+18*Math.sin(angle));
        var dx=somaX+40*Math.cos(angle)+Math.sin(t*2+d)*5;
        var dy=somaY+40*Math.sin(angle);
        ctx.lineTo(dx,dy);ctx.stroke();
        /* branches */
        ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+12*Math.cos(angle-0.4),dy+12*Math.sin(angle-0.4));ctx.stroke();
        ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+12*Math.cos(angle+0.4),dy+12*Math.sin(angle+0.4));ctx.stroke();
      }

      /* axon */
      var axonStartX=somaX+18,axonEndX=ndX+ndW-25,axonY=somaY;
      ctx.strokeStyle=n.color+'88';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(axonStartX,axonY);ctx.lineTo(axonEndX,axonY);ctx.stroke();

      /* myelin sheaths */
      if(n.myelinated){
        for(var mx=axonStartX+15;mx<axonEndX-15;mx+=22){
          ctx.beginPath();ctx.ellipse(mx,axonY,9,6,0,0,Math.PI*2);
          ctx.fillStyle='#ffcc0020';ctx.fill();
          ctx.strokeStyle='#ffcc0055';ctx.lineWidth=0.5;ctx.stroke();
        }
      }

      /* conduction pulses traveling */
      for(var pi=myelinPulses.length-1;pi>=0;pi--){
        var mp=myelinPulses[pi];
        mp.x+=mp.speed*2;mp.alpha-=0.005;
        if(mp.x>ndW||mp.alpha<=0){myelinPulses.splice(pi,1);continue;}
        var px=axonStartX+mp.x*(axonEndX-axonStartX)/ndW;
        ctx.beginPath();ctx.arc(px,axonY,5,0,Math.PI*2);
        ctx.fillStyle=nerves[mp.nerve].color+Math.round(Math.max(0,mp.alpha)*255).toString(16).padStart(2,'0');
        ctx.fill();
        /* trail */
        ctx.fillStyle=nerves[mp.nerve].color+'11';
        ctx.fillRect(axonStartX,axonY-3,px-axonStartX,6);
      }

      /* axon terminal */
      ctx.strokeStyle=n.color+'66';ctx.lineWidth=1;
      for(var tb=0;tb<3;tb++){
        var tx=axonEndX+8,ty=axonY-10+tb*10;
        ctx.beginPath();ctx.moveTo(axonEndX,axonY);ctx.lineTo(tx,ty);ctx.stroke();
        ctx.beginPath();ctx.arc(tx+4,ty,3,0,Math.PI*2);ctx.fillStyle=n.color+'44';ctx.fill();
      }

      /* nucleus */
      ctx.fillStyle=n.color+'55';ctx.beginPath();ctx.arc(somaX-3,somaY,7,0,Math.PI*2);ctx.fill();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('NEURON ANATOMY',ndX+5,ndY+12);
      ctx.fillText('soma',somaX-10,somaY+30);
      ctx.fillText('axon',ndX+ndW/2-10,axonY-10);
      if(n.myelinated)ctx.fillText('myelin',ndX+ndW/2-10,axonY+18);

      /* ---- SECTION 3: Middle-right — Raster Plot ---- */
      var rpX=ndX+ndW+15,rpY=ndY,rpW=W-rpX-10,rpH=ndH*0.5;
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(rpX,rpY,rpW,rpH);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('SPIKE RASTER PLOT',rpX+5,rpY+12);

      /* raster dots */
      var rasterTimeW=5;// seconds visible
      rasterData.forEach(function(rd){
        var age=t-rd.time;
        if(age>rasterTimeW)return;
        var x=rpX+rpW-(age/rasterTimeW)*rpW;
        var y=rpY+20+rd.nerve*(rpH-30)/nerves.length;
        ctx.fillStyle=nerves[rd.nerve].color;
        ctx.fillRect(x,y,2,8);
      });

      /* nerve labels */
      nerves.forEach(function(nv,ni){
        var y=rpY+24+ni*(rpH-30)/nerves.length;
        ctx.fillStyle=ni===activeNerve?nv.color:'rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
        ctx.fillText(nv.name.substring(0,8),rpX+rpW-60,y+6);
      });

      /* ---- SECTION 4: Conduction velocity map ---- */
      var cmX=rpX,cmY=rpY+rpH+8,cmW=rpW,cmH=ndH-rpH-8;
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(cmX,cmY,cmW,cmH);

      var cmCellW=cmW/64,cmCellH=cmH/MAX_COND;
      for(var row=0;row<conductionMap.length;row++){
        for(var col=0;col<64;col++){
          var v=conductionMap[row][col];
          ctx.fillStyle='rgb('+(Math.min(255,v*400)|0)+','+(Math.min(255,Math.max(0,v*800-100))|0)+','+(Math.max(0,(0.5-v)*200)|0)+')';
          ctx.fillRect(cmX+col*cmCellW,cmY+row*cmCellH,cmCellW+0.5,cmCellH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('CONDUCTION MAP',cmX+5,cmY+12);

      /* ---- SECTION 5: Bottom — Stats & Nerve Selector ---- */
      var btY=ndY+ndH+12,btH=H-btY-10;

      /* stats panel */
      var stX=10,stW=W*0.55;
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(stX,btY,stW,btH);

      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('NERVE IMPULSE STATISTICS',stX+10,btY+16);

      var stats=[
        ['Total Spikes',spikeCount.toString()],
        ['Velocity',n.velocity+' m/s'],
        ['Amplitude','110 mV (-70 to +40)'],
        ['Spike Rate',(spikeRate>0?spikeRate.toFixed(1):'--')+' Hz'],
        ['Fiber Type',n.myelinated?'Myelinated':'Unmyelinated'],
        ['Fiber Diameter',n.diameter+' \u00b5m'],
        ['Active Nerve',n.name]
      ];
      stats.forEach(function(s,i){
        var sx=stX+10+(i%2)*stW*0.48;
        var sy=btY+32+Math.floor(i/2)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(s[0]+':',sx,sy);
        ctx.fillStyle=n.color;ctx.fillText(s[1],sx+100,sy);
      });

      /* AP phase diagram */
      var phX=stX+10,phY=btY+btH-55,phW=stW-20,phH=45;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(phX,phY,phW,phH);
      ctx.beginPath();ctx.strokeStyle=n.color;ctx.lineWidth=1.5;
      for(var i=0;i<phW;i++){
        var phase=i/phW;
        var mv=ap(phase);
        var y=phY+phH/2-(mv+70)/180*phH*0.8;
        if(i===0)ctx.moveTo(phX+i,y);else ctx.lineTo(phX+i,y);
      }
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.25)';ctx.font='6px Orbitron,monospace';
      ctx.fillText('AP TEMPLATE',phX+2,phY+8);
      ctx.fillText('REST',phX+2,phY+phH-3);
      ctx.fillText('DEPOL',phX+phW*0.08,phY+8);
      ctx.fillText('REPOL',phX+phW*0.15,phY+phH-3);
      ctx.fillText('HYPER',phX+phW*0.25,phY+phH-3);

      /* nerve selector */
      var nsX=stX+stW+15,nsW=W-nsX-10;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(nsX,btY,nsW,btH);

      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('NERVE FIBER SELECTOR',nsX+10,btY+16);

      nerves.forEach(function(nv,ni){
        var ny=btY+32+ni*35;
        var isAct=ni===activeNerve;
        if(isAct){ctx.fillStyle=nv.color+'15';ctx.fillRect(nsX+5,ny-8,nsW-10,30);}
        ctx.fillStyle=nv.color;ctx.beginPath();ctx.arc(nsX+18,ny+5,5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=isAct?'#fff':'rgba(255,255,255,0.4)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(nv.name,nsX+30,ny+3);
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
        ctx.fillText(nv.velocity+'m/s  '+nv.diameter+'\u00b5m  '+(nv.myelinated?'myelinated':'unmyel.'),nsX+30,ny+16);
      });

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(50,255,50,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(50,255,50,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(50,255,50,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('NERVE',W-65,17);

      /* dividers */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,apH+5);ctx.lineTo(W,apH+5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,btY-5);ctx.lineTo(W,btY-5);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to switch nerve / trigger spike */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      var btY=H*0.28+10+H*0.32+12;
      var nsX=W*0.55+25;

      /* nerve selector */
      nerves.forEach(function(nv,ni){
        var ny=btY+32+ni*35;
        if(mx>nsX&&mx<W&&my>ny-8&&my<ny+25){activeNerve=ni;spikeCount=0;spikeRate=0;conductionMap=[];rasterData=[];}
      });

      /* click on AP trace to trigger spike */
      if(my<H*0.28){triggerSpike();}
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootNerveViz);
  else setTimeout(bootNerveViz,200);
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
