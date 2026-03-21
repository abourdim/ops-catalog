/**
 * SDR DSP Workbench — Workshop DIY v1.0
 * Interactive DSP signal processing workbench with waterfall/spectrum display
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}

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
    title:'SDR DSP Workbench',subtitle:'📡 DSP Workbench — Build your signal chain',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'DSP Workbench',mainDesc:'Chain DSP blocks: source, filter, FFT, output',
    sectionA:'Signal Analysis',sectionB:'DSP Chain Builder',sectionC:'DSP Theory',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',
    settings:'⚙️ Settings',language:'Language',
    help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    howto_1:'Select a signal source (sine, square, noise, etc.).',
    howto_2:'Adjust frequency and filter cutoff with sliders.',
    howto_3:'Click Start to see live spectrum and waterfall display.',
    howto_4:'Use DSP Chain Builder to add effects.',
    wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes with Islamic art inspiration.',
    wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual: English, Francais, Arabic with RTL.',
    wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped, color-coded log.',
    wiki_privacy_title:'🔒 Privacy',wiki_privacy:'All data stays in your browser.',
    working:'Working…',filterAll:'All',soundEffects:'Sound effects',
    ready:'📡 DSP Workbench ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    sigSource:'Signal Source',freqLabel:'Frequency (Hz)',filterType:'Filter',
    cutoffLabel:'Cutoff (Hz)',fftSizeLabel:'FFT Size',
    startDsp:'▶ Start',stopDsp:'⏹ Stop',resetDsp:'↺ Reset',
    peakFreq:'Peak Frequency:',bandwidth:'Bandwidth (-3dB):',snrLabel:'SNR:',
    rmsLevel:'RMS Level:',crestFactor:'Crest Factor:',
    chainDesc:'Build a custom DSP processing chain by adding blocks.',
    theoryIntro:'Digital Signal Processing transforms signals using mathematical operations.',
    theory1:'FFT decomposes time-domain signals into frequency components',
    theory2:'Filters remove unwanted frequencies (LP, HP, BP, Notch)',
    theory3:'Nyquist: sample rate must be at least 2x maximum frequency',
    theory4:'Windowing reduces spectral leakage (Hann, Hamming, Blackman)',
    theory5:'Convolution applies filter impulse response to signal',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
    dspStarted:'▶ DSP processing started',dspStopped:'⏹ DSP processing stopped',
    dspReset:'↺ DSP reset',blockAdded:'Block added:',chainCleared:'Chain cleared',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What is SDR DSP Workbench?',faq_a1:'SDR DSP Workbench lets you chain dsp blocks: source, filter, fft, output. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the center frequency, sample rate, and gain for the sdr receiver. Then you raw i/q samples are captured from the radio spectrum in real time.',faq_q3:'What do the controls do?',faq_a3:'Select a signal source (sine, square, noise, etc.). Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'البيانات تبقى في متصفحك.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Demod Challenge and Sdr Fft Racing. Each app in this category teaches a different aspect of digital signal processing.',demo_s1:'Welcome to SDR DSP Workbench! Look at the main display — this is where the digital signal processing simulation runs.',demo_s2:'Select a signal source (sine, square, noise, etc.). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Signal Analysis" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital signal processing.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how digital signal processing works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital signal processing concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Signal Analysis" and "DSP Chain Builder" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Atelier DSP SDR',subtitle:'📡 Atelier DSP — Construisez votre chaine',
    disconnected:'Deconnecte',connected:'Connecte',
    mainSection:'Atelier DSP',mainDesc:'Chaine DSP: source, filtre, FFT, sortie',
    sectionA:'Analyse du Signal',sectionB:'Constructeur de Chaine',sectionC:'Theorie DSP',
    activityLog:'Journal',eventsMsg:'Evenements et messages',
    clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',
    settings:'⚙️ Parametres',language:'Langue',
    help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    howto_1:'Selectionnez une source de signal.',howto_2:'Ajustez frequence et coupure.',
    howto_3:'Cliquez Demarrer pour le spectre en direct.',howto_4:'Ajoutez des effets dans le constructeur.',
    wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes integres.',
    wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
    wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',
    wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Donnees locales uniquement.',
    working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',
    ready:'📡 Atelier DSP pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
    sigSource:'Source Signal',freqLabel:'Frequence (Hz)',filterType:'Filtre',
    cutoffLabel:'Coupure (Hz)',fftSizeLabel:'Taille FFT',
    startDsp:'▶ Demarrer',stopDsp:'⏹ Arreter',resetDsp:'↺ Reinitialiser',
    peakFreq:'Frequence pic:',bandwidth:'Bande passante:',snrLabel:'RSB:',
    rmsLevel:'Niveau RMS:',crestFactor:'Facteur de crete:',
    chainDesc:'Construisez une chaine DSP personnalisee.',
    theoryIntro:'Le traitement numerique transforme les signaux par operations mathematiques.',
    theory1:'La FFT decompose les signaux en composantes frequentielles',
    theory2:'Les filtres suppriment les frequences indesirables',
    theory3:'Nyquist: echantillonnage >= 2x frequence max',
    theory4:'Le fenetrage reduit les fuites spectrales',
    theory5:'La convolution applique la reponse impulsionnelle',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',
    dspStarted:'▶ Traitement DSP demarre',dspStopped:'⏹ Traitement arrete',
    dspReset:'↺ DSP reinitialise',blockAdded:'Bloc ajoute:',chainCleared:'Chaine videe',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que SDR DSP Workbench ?',faq_a1:'SDR DSP Workbench te permet de simuler traitement du signal numérique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de traitement du signal numérique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de traitement du signal numérique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF One. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de traitement du signal numérique.',demo_s1:'Bienvenue dans SDR DSP Workbench ! Regarde l\'écran principal — c\'est ici que la simulation de traitement du signal numérique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de traitement du signal numérique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne traitement du signal numérique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de traitement du signal numérique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'ورشة DSP للراديو البرمجي',subtitle:'📡 ورشة DSP — ابنِ سلسلة معالجة الاشارات',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'ورشة DSP',mainDesc:'سلسلة DSP: مصدر، مرشح، FFT، مخرج',
    sectionA:'تحليل الاشارة',sectionB:'بناء سلسلة DSP',sectionC:'نظرية DSP',
    activityLog:'سجل النشاط',eventsMsg:'الاحداث والرسائل',
    clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',
    settings:'⚙️ الاعدادات',language:'اللغة',
    help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
    howto_1:'اختر مصدر اشارة.',howto_2:'اضبط التردد وتردد القطع.',
    howto_3:'اضغط ابدا لرؤية الطيف.',howto_4:'استخدم بناء السلسلة لاضافة تاثيرات.',
    wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر مدمجة.',
    wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
    wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ وملون.',
    wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'البيانات تبقى في متصفحك.',
    working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',
    ready:'📡 ورشة DSP جاهزة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    sigSource:'مصدر الاشارة',freqLabel:'التردد (هرتز)',filterType:'المرشح',
    cutoffLabel:'تردد القطع (هرتز)',fftSizeLabel:'حجم FFT',
    startDsp:'▶ ابدا',stopDsp:'⏹ ايقاف',resetDsp:'↺ اعادة',
    peakFreq:'تردد الذروة:',bandwidth:'عرض النطاق:',snrLabel:'نسبة الاشارة للضوضاء:',
    rmsLevel:'مستوى RMS:',crestFactor:'عامل القمة:',
    chainDesc:'ابنِ سلسلة معالجة DSP مخصصة.',
    theoryIntro:'معالجة الاشارات الرقمية تحول الاشارات بعمليات رياضية.',
    theory1:'FFT تحلل اشارات المجال الزمني الى مكونات ترددية',
    theory2:'المرشحات تزيل الترددات غير المرغوبة',
    theory3:'نايكويست: معدل العينات >= 2x اقصى تردد',
    theory4:'النوافذ تقلل التسرب الطيفي',
    theory5:'الالتفاف يطبق استجابة المرشح النبضية',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
    dspStarted:'▶ بدا معالجة DSP',dspStopped:'⏹ توقف معالجة DSP',
    dspReset:'↺ اعادة ضبط DSP',blockAdded:'تمت اضافة كتلة:',chainCleared:'تم تفريغ السلسلة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'
  ,step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ما هو SDR DSP Workbench؟',faq_a1:'SDR DSP Workbench يتيح لك محاكاة معالجة الإشارات الرقمية. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في معالجة الإشارات الرقمية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من معالجة الإشارات الرقمية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF One. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من معالجة الإشارات الرقمية.',demo_s1:'مرحباً في SDR DSP Workbench! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة معالجة الإشارات الرقمية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـمعالجة الإشارات الرقمية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل معالجة الإشارات الرقمية من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم معالجة الإشارات الرقمية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='dsp-workbench-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════ PANELS ═══════ */
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ DSP SIMULATION ═══════ */
let dspRunning=false,animFrame=null,sampleRate=8192,fftSizeVal=1024;
const chainBlocks=[];

function generateSignal(type,freq,n){
  const buf=new Float32Array(n),dt=1/sampleRate;
  for(let i=0;i<n;i++){const t=i*dt;
    switch(type){
      case 'sine':buf[i]=Math.sin(2*Math.PI*freq*t);break;
      case 'square':buf[i]=Math.sign(Math.sin(2*Math.PI*freq*t));break;
      case 'sawtooth':buf[i]=2*(freq*t-Math.floor(freq*t+.5));break;
      case 'noise':buf[i]=Math.random()*2-1;break;
      case 'chirp':buf[i]=Math.sin(2*Math.PI*(freq*.5+freq*1.5*(i/n))*t);break;
      case 'am':buf[i]=Math.sin(2*Math.PI*freq*t)*(.5+.5*Math.sin(2*Math.PI*(freq/10)*t));break;
      case 'fm':buf[i]=Math.sin(2*Math.PI*freq*t+5*Math.sin(2*Math.PI*(freq/8)*t));break;
    }
    buf[i]+=(Math.random()-.5)*.05;
  }
  return buf;
}
function applyFilter(buf,type,cutoff){
  if(type==='none')return buf;
  const out=new Float32Array(buf.length),rc=1/(2*Math.PI*cutoff),dt=1/sampleRate,a=dt/(rc+dt);
  if(type==='lowpass'){out[0]=buf[0];for(let i=1;i<buf.length;i++)out[i]=out[i-1]+a*(buf[i]-out[i-1]);return out;}
  if(type==='highpass'){out[0]=buf[0];for(let i=1;i<buf.length;i++)out[i]=(1-a)*(out[i-1]+buf[i]-buf[i-1]);return out;}
  if(type==='bandpass'){return applyFilter(applyFilter(buf,'lowpass',cutoff*1.2),'highpass',cutoff*.8);}
  if(type==='notch'){const bp=applyFilter(buf,'bandpass',cutoff);for(let i=0;i<buf.length;i++)out[i]=buf[i]-bp[i];return out;}
  return buf;
}
function applyChainEffects(buf){
  let out=buf;
  for(const block of chainBlocks){
    const p=new Float32Array(out.length);
    if(block==='gain'){for(let i=0;i<out.length;i++)p[i]=Math.max(-1,Math.min(1,out[i]*2));out=p;}
    else if(block==='delay'){for(let i=0;i<out.length;i++)p[i]=out[i]+(i>=100?out[i-100]*.5:0);out=p;}
    else if(block==='compress'){for(let i=0;i<out.length;i++){const v=out[i];p[i]=v>0?Math.sqrt(v):-Math.sqrt(-v);}out=p;}
    else if(block==='distort'){for(let i=0;i<out.length;i++)p[i]=Math.tanh(out[i]*3);out=p;}
  }
  return out;
}
function computeFFT(buf){
  const N=fftSizeVal,data=new Float32Array(N),mag=new Float32Array(N/2);
  for(let i=0;i<N&&i<buf.length;i++)data[i]=buf[i]*.5*(1-Math.cos(2*Math.PI*i/(N-1)));
  for(let k=0;k<N/2;k++){let re=0,im=0;for(let n=0;n<N;n++){const a=-2*Math.PI*k*n/N;re+=data[n]*Math.cos(a);im+=data[n]*Math.sin(a);}mag[k]=Math.sqrt(re*re+im*im)/N;}
  return mag;
}
function drawSpectrum(mag){
  const c=$('spectrumCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=0;i<10;i++){const y=i/10*h;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  for(let i=0;i<10;i++){const x=i/10*w;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  const mx=Math.max(...mag)||1;
  for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.stroke();ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
  ctx.fillStyle=accent.replace(')',',0.15)').replace('rgb','rgba');ctx.fill();
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  ctx.fillText('0 Hz',4,h-4);ctx.fillText((sampleRate/2)+' Hz',w-60,h-4);
}
function drawWaterfall(mag){
  const c=$('waterfallCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const img=ctx.getImageData(0,0,w,h-1);ctx.putImageData(img,0,1);
  const mx=Math.max(...mag)||1;
  for(let i=0;i<w;i++){
    const idx=Math.floor(i/w*mag.length),val=mag[idx]/mx;
    const db=Math.max(0,Math.min(1,(20*Math.log10(val+1e-10)+60)/60));
    let r,g,b;
    if(db<.25){r=0;g=0;b=Math.floor(db*4*255);}
    else if(db<.5){r=0;g=Math.floor((db-.25)*4*255);b=255;}
    else if(db<.75){r=Math.floor((db-.5)*4*255);g=255;b=255-Math.floor((db-.5)*4*255);}
    else{r=255;g=255-Math.floor((db-.75)*4*255);b=0;}
    ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(i,0,1,1);
  }
}
function updateAnalysis(mag){
  const mx=Math.max(...mag)||1,pi=mag.indexOf(Math.max(...mag));
  const peakHz=(pi/mag.length)*(sampleRate/2);
  $('peakFreqVal').textContent=peakHz.toFixed(0)+' Hz';
  const th=mx*.707;let lo=0,hi=mag.length-1;
  for(let i=pi;i>=0;i--)if(mag[i]<th){lo=i;break;}
  for(let i=pi;i<mag.length;i++)if(mag[i]<th){hi=i;break;}
  $('bwVal').textContent=(((hi-lo)/mag.length)*(sampleRate/2)).toFixed(0)+' Hz';
  const sp=mag[pi]*mag[pi];let np=0;
  for(let i=0;i<mag.length;i++)if(Math.abs(i-pi)>10)np+=mag[i]*mag[i];
  np/=(mag.length-20);
  $('snrVal').textContent=(10*Math.log10(sp/(np+1e-20))).toFixed(1)+' dB';
  let rms=0;for(let i=0;i<mag.length;i++)rms+=mag[i]*mag[i];rms=Math.sqrt(rms/mag.length);
  $('rmsVal').textContent=(20*Math.log10(rms+1e-20)).toFixed(1)+' dBFS';
  $('crestVal').textContent=(mx/(rms+1e-20)).toFixed(2);
}
function dspLoop(){
  if(!dspRunning)return;
  const src=$('sigSource').value,freq=+$('freqSlider').value,ft=$('filterType').value,co=+$('cutoffSlider').value;
  fftSizeVal=+$('fftSize').value;
  let buf=generateSignal(src,freq,fftSizeVal);
  buf=applyFilter(buf,ft,co);buf=applyChainEffects(buf);
  const mag=computeFFT(buf);drawSpectrum(mag);drawWaterfall(mag);updateAnalysis(mag);
  animFrame=requestAnimationFrame(dspLoop);
}
function startDsp(){if(dspRunning)return;dspRunning=true;setStatus(true);log(LANG[currentLang].dspStarted,'success');dspLoop();}
function stopDsp(){dspRunning=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].dspStopped,'info');}
function resetDsp(){
  stopDsp();$('freqSlider').value=1000;$('freqVal').textContent='1000 Hz';$('cutoffSlider').value=2000;$('cutoffVal').textContent='2000 Hz';
  $('sigSource').value='sine';$('filterType').value='none';$('fftSize').value='1024';
  const wc=$('waterfallCanvas'),sc=$('spectrumCanvas');
  if(wc)wc.getContext('2d').clearRect(0,0,wc.width,wc.height);if(sc)sc.getContext('2d').clearRect(0,0,sc.width,sc.height);
  $('peakFreqVal').textContent='-- Hz';$('bwVal').textContent='-- Hz';$('snrVal').textContent='-- dB';$('rmsVal').textContent='-- dBFS';$('crestVal').textContent='--';
  chainBlocks.length=0;renderChain();log(LANG[currentLang].dspReset,'info');
}

/* ═══════ CHAIN UI ═══════ */
function addChainBlock(type){chainBlocks.push(type);renderChain();log(LANG[currentLang].blockAdded+' '+type,'info');}
function clearChain(){chainBlocks.length=0;renderChain();log(LANG[currentLang].chainCleared,'info');}
function renderChain(){
  const el=$('chainBlocks');if(!el)return;el.innerHTML='';
  chainBlocks.forEach((b,i)=>{
    const s=document.createElement('span');s.style.cssText='display:inline-block;padding:4px 10px;border-radius:6px;background:var(--accent,#d4a03c);color:#000;font-size:12px;font-weight:bold;cursor:pointer;';
    s.textContent=b.toUpperCase();s.title='Click to remove';s.onclick=()=>{chainBlocks.splice(i,1);renderChain();};el.appendChild(s);
    if(i<chainBlocks.length-1){const a=document.createElement('span');a.textContent=' → ';a.style.color='var(--text-secondary,#aaa)';el.appendChild(a);}
  });
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('startBtn').onclick=startDsp;$('stopBtn').onclick=stopDsp;$('resetBtn').onclick=resetDsp;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' Hz';};
  $('cutoffSlider').oninput=function(){$('cutoffVal').textContent=this.value+' Hz';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — DSP Workbench
   Animated signal flow diagram + live oscilloscope trace
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('dspSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='dspSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a12;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.03;cx.fillStyle='#060a12';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Signal flow blocks
  const blocks=[{x:40,label:'SRC'},{x:180,label:'FILTER'},{x:320,label:'FFT'},{x:460,label:'DSP'},{x:600,label:'OUT'}];
  blocks.forEach((b,i)=>{
    cx.fillStyle='rgba(100,200,255,.08)';cx.fillRect(b.x,H*.3,100,40);
    cx.strokeStyle='rgba(100,200,255,.2)';cx.strokeRect(b.x,H*.3,100,40);
    cx.fillStyle=acc;cx.font='10px Orbitron,monospace';cx.textAlign='center';
    cx.fillText(b.label,b.x+50,H*.3+25);
    // Animated dots along arrows
    if(i<blocks.length-1){
      const nx=blocks[i+1].x;cx.strokeStyle='rgba(100,200,255,.15)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(b.x+100,H*.3+20);cx.lineTo(nx,H*.3+20);cx.stroke();
      const dx=((t*80+i*30)%(nx-b.x-100));
      cx.fillStyle=acc;cx.beginPath();cx.arc(b.x+100+dx,H*.3+20,3,0,Math.PI*2);cx.fill();
    }
  });
  // Oscilloscope trace at bottom
  const oY=H*.65,oH=H*.3;
  cx.strokeStyle='rgba(100,200,255,.06)';cx.lineWidth=.5;
  cx.beginPath();cx.moveTo(0,oY+oH/2);cx.lineTo(W,oY+oH/2);cx.stroke();
  cx.strokeStyle=acc;cx.lineWidth=1.5;cx.beginPath();
  const freq=typeof document.getElementById('freqSlider')!=='undefined'&&document.getElementById('freqSlider')?+document.getElementById('freqSlider').value:1000;
  for(let i=0;i<W;i++){
    const x=i,tt=i/W*.1+t;
    const y=oY+oH/2-Math.sin(2*Math.PI*freq*tt*.001)*oH*.4*(1+.3*Math.sin(t*2));
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('DSP Signal Flow — Live Oscilloscope',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
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
