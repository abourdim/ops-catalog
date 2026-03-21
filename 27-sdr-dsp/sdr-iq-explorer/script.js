/**
 * SDR IQ Explorer — Workshop DIY v1.0
 * Visualize I/Q data — Lissajous, phase plane, magnitude, instantaneous frequency
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="40" stroke="currentColor" fill="none" stroke-width="2" opacity=".3"/><circle cx="50" cy="50" r="5" fill="currentColor"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#iqpath"/></animateMotion></circle><path id="iqpath" d="M90 50 A40 40 0 1 1 89.99 50" fill="none" stroke="none"/><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" opacity=".2" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" opacity=".2" stroke-width="1"/><text x="92" y="54" fill="currentColor" font-size="10">I</text><text x="52" y="14" fill="currentColor" font-size="10">Q</text></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

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
    ...LANG_BASE.en,title:'SDR IQ Explorer',subtitle:'🔄 IQ Explorer — Visualize complex signals',disconnected:'Disconnected',connected:'Connected',mainSection:'IQ Explorer',mainDesc:'Lissajous, phase plane, magnitude and frequency',sectionA:'IQ Statistics',sectionB:'IQ Correction',sectionC:'IQ Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "IQ Statistics" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات مع RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔄 IQ Explorer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
iqMode:'IQ Signal Mode',freqLabel:'Frequency (Hz)',gainImb:'Gain Imbalance (dB)',phaseImb:'Phase Imbalance (deg)',startIQ:'▶ Start',stopIQ:'⏹ Stop',
iqCorr:'IQ Correlation:',imgRej:'Image Rejection:',instFreq:'Inst. Frequency:',
corrDesc:'Auto IQ imbalance correction compensates gain and phase offset in real-time.',applyCorr:'Apply Auto-Correction',
theoryIntro:'I/Q representation is fundamental to SDR:',theory1:'Complex signal: s(t) = I(t) + jQ(t)',theory2:'Magnitude: |s| = sqrt(I² + Q²)',theory3:'Phase: φ = atan2(Q, I)',theory4:'IQ imbalance causes image frequency leakage',theory5:'Lissajous pattern reveals phase relationships',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',iqStarted:'▶ IQ running',iqStopped:'⏹ Stopped',corrApplied:'Auto-correction applied',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Up',step1Desc:'Configure the parameters for SDR IQ Explorer. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "IQ Statistics" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "IQ Correction". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is SDR IQ Explorer?',faq_a1:'SDR IQ Explorer lets you lissajous, phase plane, magnitude and frequency. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the center frequency, sample rate, and gain for the sdr receiver. Then you raw i/q samples are captured from the radio spectrum in real time.',faq_q3:'What do the controls do?',faq_a3:'Select an IQ signal mode. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real digital signal processing principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Demod Challenge and Sdr Dsp Workbench. Each app in this category teaches a different aspect of digital signal processing.',demo_s1:'Welcome to SDR IQ Explorer! Look at the main display — this is where the digital signal processing simulation runs.',demo_s2:'Select an IQ signal mode. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "IQ Statistics" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital signal processing.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how digital signal processing works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital signal processing concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'SDR IQ Explorer: Lissajous, phase plane, magnitude and frequency. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure SDR through Capture Signal to Process & Filter and Visualize Output.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "IQ Statistics" and "IQ Correction" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Explorateur IQ SDR',subtitle:'🔄 Explorateur IQ — Visualisez les signaux complexes',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Explorateur IQ',mainDesc:'Lissajous, plan de phase, magnitude et frequence',sectionA:'Statistiques IQ',sectionB:'Correction IQ',sectionC:'Theorie IQ',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'Selectionnez un mode IQ.',howto_2:'Ajustez frequence et desequilibre.',howto_3:'Observez les affichages Lissajous et temporel.',howto_4:'Essayez l\'auto-correction IQ.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🔄 Explorateur IQ pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
iqMode:'Mode Signal IQ',freqLabel:'Frequence (Hz)',gainImb:'Desequilibre Gain (dB)',phaseImb:'Desequilibre Phase (deg)',startIQ:'▶ Demarrer',stopIQ:'⏹ Arreter',
iqCorr:'Correlation IQ:',imgRej:'Rejet Image:',instFreq:'Freq. Inst.:',
corrDesc:'La correction automatique compense le desequilibre IQ.',applyCorr:'Appliquer Auto-Correction',
theoryIntro:'La representation I/Q est fondamentale au SDR:',theory1:'Signal complexe: s(t) = I(t) + jQ(t)',theory2:'Magnitude: |s| = sqrt(I² + Q²)',theory3:'Phase: φ = atan2(Q, I)',theory4:'Le desequilibre IQ cause une fuite d\'image',theory5:'Les figures de Lissajous revelent les relations de phase',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',iqStarted:'▶ IQ en cours',iqStopped:'⏹ Arrete',corrApplied:'Auto-correction appliquee',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Demod Challenge and Sdr Dsp Workbench ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'مستكشف IQ للراديو البرمجي',subtitle:'🔄 مستكشف IQ — تصور الاشارات المركبة',disconnected:'غير متصل',connected:'متصل',mainSection:'مستكشف IQ',mainDesc:'ليساجو، مستوى الطور، السعة والتردد',sectionA:'احصائيات IQ',sectionB:'تصحيح IQ',sectionC:'نظرية IQ',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
howto_1:'اختر وضع اشارة IQ.',howto_2:'اضبط التردد والاختلال.',howto_3:'شاهد عروض ليساجو والمجال الزمني.',howto_4:'جرب التصحيح التلقائي لاختلال IQ.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🔄 مستكشف IQ جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
iqMode:'وضع اشارة IQ',freqLabel:'التردد (هرتز)',gainImb:'اختلال الكسب (ديسيبل)',phaseImb:'اختلال الطور (درجة)',startIQ:'▶ ابدا',stopIQ:'⏹ ايقاف',
iqCorr:'ارتباط IQ:',imgRej:'رفض الصورة:',instFreq:'التردد اللحظي:',
corrDesc:'التصحيح التلقائي يعوض اختلال الكسب والطور.',applyCorr:'تطبيق التصحيح التلقائي',
theoryIntro:'تمثيل I/Q اساسي في SDR:',theory1:'اشارة مركبة: s(t) = I(t) + jQ(t)',theory2:'السعة: |s| = sqrt(I² + Q²)',theory3:'الطور: φ = atan2(Q, I)',theory4:'اختلال IQ يسبب تسرب تردد الصورة',theory5:'انماط ليساجو تكشف علاقات الطور',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',iqStarted:'▶ IQ يعمل',iqStopped:'⏹ متوقف',corrApplied:'تم تطبيق التصحيح التلقائي',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Demod Challenge and Sdr Dsp Workbench! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='iq-explorer-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
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

/* ═══════ IQ SIMULATION ═══════ */
let running=false,animFrame=null;
const SR=8192,N=1024;
let corrGain=1,corrPhase=0,autoCorr=false;
let tOff=0;

function generateIQ(mode,freq,gainImb,phaseImb){
  const I=new Float32Array(N),Q=new Float32Array(N);
  const dt=1/SR;
  const gLin=Math.pow(10,gainImb/20);
  const phRad=phaseImb*Math.PI/180;
  for(let i=0;i<N;i++){
    const t=(tOff+i)*dt;
    let ii=0,qq=0;
    switch(mode){
      case 'cw':ii=Math.cos(2*Math.PI*freq*t);qq=Math.sin(2*Math.PI*freq*t);break;
      case 'dual':ii=Math.cos(2*Math.PI*freq*t)+.5*Math.cos(2*Math.PI*freq*2.7*t);qq=Math.sin(2*Math.PI*freq*t)+.5*Math.sin(2*Math.PI*freq*2.7*t);break;
      case 'sweep':{const f=freq*.5+freq*1.5*(i/N);ii=Math.cos(2*Math.PI*f*t);qq=Math.sin(2*Math.PI*f*t);break;}
      case 'chirp':{const f=freq+freq*3*t;ii=Math.cos(2*Math.PI*f*t);qq=Math.sin(2*Math.PI*f*t);break;}
      case 'qpsk':{const sym=Math.floor(i/64)%4;const angle=[Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4][sym];ii=Math.cos(angle+2*Math.PI*freq*t);qq=Math.sin(angle+2*Math.PI*freq*t);break;}
      case 'noise':ii=(Math.random()-.5)*2;qq=(Math.random()-.5)*2;break;
      case 'imbalance':ii=Math.cos(2*Math.PI*freq*t);qq=Math.sin(2*Math.PI*freq*t);break;
    }
    // Apply imbalance
    I[i]=ii;
    Q[i]=qq*gLin*Math.cos(phRad)+ii*gLin*Math.sin(phRad);
    // Add small noise
    I[i]+=(Math.random()-.5)*.02;Q[i]+=(Math.random()-.5)*.02;
    // Apply correction if enabled
    if(autoCorr){Q[i]=Q[i]/corrGain-I[i]*Math.tan(corrPhase);}
  }
  tOff+=N;
  return {I,Q};
}

function drawIQPlane(I,Q){
  const c=$('iqCanvas');if(!c)return;const ctx=c.getContext('2d'),s=c.width,cx=s/2,cy=s/2,r=s/2-10;
  ctx.fillStyle='rgba(10,10,26,0.3)';ctx.fillRect(0,0,s,s);
  ctx.strokeStyle='#223';ctx.lineWidth=.5;
  ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(s,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,s);ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,r*.7,0,2*Math.PI);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle=accent;
  for(let i=0;i<I.length;i+=2){
    const px=cx+I[i]*r*.8,py=cy-Q[i]*r*.8;
    ctx.globalAlpha=.4;ctx.beginPath();ctx.arc(px,py,1.5,0,2*Math.PI);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';
  ctx.fillText('I',s-14,cy-4);ctx.fillText('Q',cx+4,12);
}

function drawTimeIQ(I,Q){
  const c=$('timeIQCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/4);ctx.lineTo(w,h/4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,3*h/4);ctx.lineTo(w,3*h/4);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const show=Math.min(512,I.length);
  // I channel
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<show;i++){const x=i/show*w,y=h/4-I[i]*h*.2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  // Q channel
  ctx.strokeStyle='#4af';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<show;i++){const x=i/show*w,y=3*h/4-Q[i]*h*.2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('I channel',4,12);
  ctx.fillStyle='#4af';ctx.fillText('Q channel',4,h/2+12);
}

function drawPhase(I,Q){
  const c=$('phaseCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  ctx.strokeStyle='#f84';ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,I.length);
  for(let i=0;i<show;i++){
    const ph=Math.atan2(Q[i],I[i]);
    const x=i/show*w,y=h/2-ph/(Math.PI)*h*.45;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }ctx.stroke();
  // Magnitude
  ctx.strokeStyle='#8f8';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<show;i++){
    const mag=Math.sqrt(I[i]*I[i]+Q[i]*Q[i]);
    const x=i/show*w,y=h-mag*h*.4;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }ctx.stroke();
  ctx.fillStyle='#f84';ctx.font='10px monospace';ctx.fillText('Phase',4,12);
  ctx.fillStyle='#8f8';ctx.fillText('Magnitude',60,12);
}

function updateStats(I,Q){
  let irms=0,qrms=0,corr=0;
  for(let i=0;i<N;i++){irms+=I[i]*I[i];qrms+=Q[i]*Q[i];corr+=I[i]*Q[i];}
  irms=Math.sqrt(irms/N);qrms=Math.sqrt(qrms/N);corr=corr/N/(irms*qrms+1e-20);
  $('irmsVal').textContent=irms.toFixed(4);$('qrmsVal').textContent=qrms.toFixed(4);
  $('corrVal').textContent=corr.toFixed(4);
  // Image rejection
  const imbDb=20*Math.log10(Math.abs(irms-qrms)/(irms+qrms+1e-20)+1e-10);
  $('imgVal').textContent=(-imbDb).toFixed(1)+' dB';
  // Inst freq
  let fSum=0,cnt=0;
  for(let i=1;i<Math.min(256,N);i++){
    const p1=Math.atan2(Q[i],I[i]),p0=Math.atan2(Q[i-1],I[i-1]);
    let dp=p1-p0;if(dp>Math.PI)dp-=2*Math.PI;if(dp<-Math.PI)dp+=2*Math.PI;
    fSum+=dp*SR/(2*Math.PI);cnt++;
  }
  $('instVal').textContent=(fSum/cnt).toFixed(0)+' Hz';
}

function applyAutoCorrection(){
  // Estimate imbalance from current data
  const mode=$('iqMode').value,freq=+$('freqSlider').value;
  const gi=+$('gainSlider').value/10,pi=+$('phaseSlider').value;
  corrGain=Math.pow(10,gi/20);
  corrPhase=pi*Math.PI/180;
  autoCorr=true;
  const el=$('corrResult');if(el)el.textContent=`Correction: gain=${corrGain.toFixed(3)}, phase=${(corrPhase*180/Math.PI).toFixed(1)} deg`;
  log(LANG[currentLang].corrApplied,'success');
}

function simLoop(){
  if(!running)return;
  const mode=$('iqMode').value,freq=+$('freqSlider').value;
  const gi=+$('gainSlider').value/10,pi=+$('phaseSlider').value;
  const{I,Q}=generateIQ(mode,freq,gi,pi);
  drawIQPlane(I,Q);drawTimeIQ(I,Q);drawPhase(I,Q);updateStats(I,Q);
  animFrame=requestAnimationFrame(simLoop);
}
function startSim(){if(running)return;running=true;tOff=0;setStatus(true);log(LANG[currentLang].iqStarted,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].iqStopped,'info');}

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
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  $('correctBtn').onclick=applyAutoCorrection;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' Hz';};
  $('gainSlider').oninput=function(){$('gainVal').textContent=(this.value/10).toFixed(1)+' dB';};
  $('phaseSlider').oninput=function(){$('phaseImbVal').textContent=this.value+' deg';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — IQ Explorer
   Animated phasor wheel + instantaneous frequency meter
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const trail=[];
function boot(){
  let el=document.getElementById('iqSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='iqSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.03;cx.fillStyle='rgba(6,8,16,.15)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Phasor wheel
  const pcx=120,pcy=H/2,pr=70;
  cx.strokeStyle='rgba(100,200,255,.1)';cx.lineWidth=1;
  cx.beginPath();cx.arc(pcx,pcy,pr,0,Math.PI*2);cx.stroke();
  cx.beginPath();cx.moveTo(pcx-pr-5,pcy);cx.lineTo(pcx+pr+5,pcy);cx.stroke();
  cx.beginPath();cx.moveTo(pcx,pcy-pr-5);cx.lineTo(pcx,pcy+pr+5);cx.stroke();
  const angle=t*3;const px=pcx+Math.cos(angle)*pr*.8,py=pcy-Math.sin(angle)*pr*.8;
  trail.push({x:px,y:py,a:1});if(trail.length>80)trail.shift();
  trail.forEach((p,i)=>{p.a*=.97;cx.fillStyle=`rgba(${parseInt(acc.slice(1,3),16)||212},${parseInt(acc.slice(3,5),16)||160},${parseInt(acc.slice(5,7),16)||60},${p.a*.4})`;cx.beginPath();cx.arc(p.x,p.y,2,0,Math.PI*2);cx.fill();});
  cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();cx.moveTo(pcx,pcy);cx.lineTo(px,py);cx.stroke();
  cx.fillStyle=acc;cx.beginPath();cx.arc(px,py,4,0,Math.PI*2);cx.fill();
  // Frequency meter on right
  const mX=W*.35,mW=W*.6,mH=H-40;
  cx.strokeStyle='rgba(100,200,255,.06)';cx.lineWidth=.5;
  cx.beginPath();cx.moveTo(mX,20+mH/2);cx.lineTo(mX+mW,20+mH/2);cx.stroke();
  cx.strokeStyle='#f84';cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<200;i++){
    const x=mX+i/200*mW;const tt=i/200+t;
    const freq=Math.sin(tt*2)*30+50;
    const y=20+mH/2-freq*mH*.005;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(248,132,68,.4)';cx.font='8px monospace';cx.fillText('Inst. Frequency',mX+5,18);
  // Magnitude
  cx.strokeStyle='#8f8';cx.lineWidth=1;cx.beginPath();
  for(let i=0;i<200;i++){
    const x=mX+i/200*mW;const tt=i/200+t;
    const mag=.8+.2*Math.sin(tt*5);
    const y=20+mH-mag*mH*.3;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(136,255,136,.4)';cx.font='8px monospace';cx.fillText('Magnitude',mX+5,mH+15);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('IQ Phasor Wheel — Frequency + Magnitude',8,14);
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
