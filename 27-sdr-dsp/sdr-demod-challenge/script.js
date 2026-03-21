/**
 * SDR Demod Challenge — Workshop DIY v1.0
 * Gamified modulation identification with spectrum/waterfall
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="10 5"><animate attributeName="stroke-dashoffset" values="0;60" dur="3s" repeatCount="indefinite"/></circle><text x="35" y="58" font-size="28" fill="currentColor">?</text></svg>`;
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
    ...LANG_BASE.en,title:'SDR Demod Challenge',subtitle:'🎯 Demod Challenge — Identify mystery signals',disconnected:'Disconnected',connected:'Connected',mainSection:'Demod Challenge',mainDesc:'Identify the modulation, decode the message',sectionA:'Scoreboard',sectionB:'Demod Toolbox',sectionC:'Signal Recognition Guide',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'Click New Challenge for a mystery signal.',howto_2:'Study spectrum and waterfall patterns.',howto_3:'Use demod tools for clues.',howto_4:'Click the correct modulation to score!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🎯 Demod Challenge ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
levelLabel:'Level',score:'Score:',streak:'Streak:',yourGuess:'Your Guess — What modulation is this?',newChallenge:'🎲 New Challenge',hintBtn:'💡 Hint',revealBtn:'👁 Reveal',
totalAttempts:'Total Attempts:',correct:'Correct:',accuracy:'Accuracy:',bestStreak:'Best Streak:',
theoryIntro:'Tips for identifying modulation by spectrum:',theory1:'AM: carrier + two symmetric sidebands',theory2:'FM: wider bandwidth, spread carrier energy',theory3:'SSB: single sideband, no carrier',theory4:'BPSK/QPSK: sinc-shaped spectrum',theory5:'CW: narrow spike, on-off keying on waterfall',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
correctGuess:'✅ Correct!',wrongGuess:'❌ Wrong!',hintMsg:'💡 Hint:',revealed:'👁 Answer:',newChal:'🎲 New challenge loaded',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What is SDR Demod Challenge?',faq_a1:'SDR Demod Challenge lets you identify the modulation, decode the message. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the center frequency, sample rate, and gain for the sdr receiver. Then you raw i/q samples are captured from the radio spectrum in real time.',faq_q3:'What do the controls do?',faq_a3:'Click New Challenge for a mystery signal. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real digital signal processing principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Dsp Workbench and Sdr Fft Racing. Each app in this category teaches a different aspect of digital signal processing.',demo_s1:'Welcome to SDR Demod Challenge! Look at the main display — this is where the digital signal processing simulation runs.',demo_s2:'Click New Challenge for a mystery signal. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Scoreboard" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital signal processing.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how digital signal processing works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital signal processing concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Scoreboard" and "Demod Toolbox" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Defi Demodulation SDR',subtitle:'🎯 Defi Demod — Identifiez les signaux mysteres',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Defi Demodulation',mainDesc:'Identifiez la modulation, decodez le message',sectionA:'Tableau de Score',sectionB:'Boite a Outils Demod',sectionC:'Guide de Reconnaissance',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'Cliquez Nouveau Defi.',howto_2:'Etudiez spectre et waterfall.',howto_3:'Utilisez les outils demod.',howto_4:'Cliquez la bonne modulation!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🎯 Defi Demod pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
levelLabel:'Niveau',score:'Score:',streak:'Serie:',yourGuess:'Votre Reponse — Quelle modulation?',newChallenge:'🎲 Nouveau Defi',hintBtn:'💡 Indice',revealBtn:'👁 Reveler',
totalAttempts:'Tentatives:',correct:'Correct:',accuracy:'Precision:',bestStreak:'Meilleure Serie:',
theoryIntro:'Astuces pour identifier la modulation par le spectre:',theory1:'AM: porteuse + deux bandes laterales',theory2:'FM: bande plus large',theory3:'SSB: bande laterale unique',theory4:'BPSK/QPSK: spectre en sinc',theory5:'CW: pic etroit, manipulation par tout ou rien',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',
correctGuess:'✅ Correct!',wrongGuess:'❌ Faux!',hintMsg:'💡 Indice:',revealed:'👁 Reponse:',newChal:'🎲 Nouveau defi charge',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Fft Racing and Sdr Signal Generator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'تحدي ازالة التعديل SDR',subtitle:'🎯 تحدي ازالة التعديل — حدد الاشارات الغامضة',disconnected:'غير متصل',connected:'متصل',mainSection:'تحدي ازالة التعديل',mainDesc:'حدد التعديل وفك تشفير الرسالة',sectionA:'لوحة النتائج',sectionB:'ادوات ازالة التعديل',sectionC:'دليل التعرف على الاشارات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
howto_1:'اضغط تحدي جديد.',howto_2:'ادرس الطيف والشلال.',howto_3:'استخدم ادوات ازالة التعديل.',howto_4:'اضغط التعديل الصحيح للتسجيل!',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🎯 تحدي ازالة التعديل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
levelLabel:'المستوى',score:'النقاط:',streak:'التتابع:',yourGuess:'تخمينك — ما هذا التعديل؟',newChallenge:'🎲 تحدي جديد',hintBtn:'💡 تلميح',revealBtn:'👁 كشف',
totalAttempts:'اجمالي المحاولات:',correct:'صحيح:',accuracy:'الدقة:',bestStreak:'افضل تتابع:',
theoryIntro:'نصائح لتحديد التعديل من الطيف:',theory1:'AM: حامل + نطاقين جانبيين متماثلين',theory2:'FM: عرض نطاق اوسع',theory3:'SSB: نطاق جانبي واحد بدون حامل',theory4:'BPSK/QPSK: طيف شكل sinc',theory5:'CW: ذروة ضيقة، نمط تشغيل/ايقاف',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
correctGuess:'✅ صحيح!',wrongGuess:'❌ خطا!',hintMsg:'💡 تلميح:',revealed:'👁 الجواب:',newChal:'🎲 تم تحميل تحدي جديد',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Fft Racing and Sdr Signal Generator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuessButtons();}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='demod-challenge-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
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

/* ═══════ CHALLENGE ENGINE ═══════ */
const MODS=['AM','FM','SSB','BPSK','QPSK','CW','Noise','Chirp'];
const HINTS={AM:'Two symmetric sidebands around carrier',FM:'Wide bandwidth, spread energy',SSB:'One sideband only, no carrier',BPSK:'Sinc spectrum, 180-degree phase shifts',QPSK:'Wider sinc, 4 phase states',CW:'Very narrow, on-off pattern',Noise:'Flat broadband spectrum',Chirp:'Frequency sweeps upward over time'};
let currentMod='',level=1,score=0,streak=0,bestStreak=0,totalAttempts=0,correctCount=0;
let signalBuf=null,animFrame=null;
const SR=8192,N=1024;

function generateChallenge(){
  currentMod=MODS[Math.floor(Math.random()*MODS.length)];
  const buf=new Float32Array(N),dt=1/SR,fc=800+Math.random()*400;
  for(let i=0;i<N;i++){const t=i*dt;
    switch(currentMod){
      case'AM':buf[i]=(1+.7*Math.sin(2*Math.PI*50*t))*Math.cos(2*Math.PI*fc*t);break;
      case'FM':{const ph=2*Math.PI*fc*t+8*Math.sin(2*Math.PI*30*t);buf[i]=Math.cos(ph);break;}
      case'SSB':{const m=Math.sin(2*Math.PI*80*t),h=Math.cos(2*Math.PI*80*t);buf[i]=m*Math.cos(2*Math.PI*fc*t)-h*Math.sin(2*Math.PI*fc*t);break;}
      case'BPSK':{const bit=Math.floor(i/64)%2?1:-1;buf[i]=bit*Math.cos(2*Math.PI*fc*t);break;}
      case'QPSK':{const s2=Math.floor(i/64)%4;const ang=[.785,2.356,3.927,5.498][s2];buf[i]=Math.cos(2*Math.PI*fc*t+ang);break;}
      case'CW':{const on=Math.sin(2*Math.PI*2*t)>0?1:0;buf[i]=on*Math.cos(2*Math.PI*fc*t);break;}
      case'Noise':buf[i]=Math.random()*2-1;break;
      case'Chirp':buf[i]=Math.sin(2*Math.PI*(fc*.5+fc*2*(i/N))*t);break;
    }
    buf[i]+=(Math.random()-.5)*.15;
  }
  signalBuf=buf;
  drawAll();
  $('feedback').textContent='';$('feedback').style.color='';
  $('levelNum').textContent=level;
  setStatus(true);
  log(LANG[currentLang].newChal,'info');
}

function computeSpec(buf){
  const mag=new Float32Array(N/2);
  for(let k=0;k<N/2;k++){let re=0,im=0;for(let n=0;n<N;n++){const a=-2*Math.PI*k*n/N;re+=buf[n]*Math.cos(a);im+=buf[n]*Math.sin(a);}mag[k]=Math.sqrt(re*re+im*im)/N;}
  return mag;
}

function drawAll(){
  if(!signalBuf)return;
  const mag=computeSpec(signalBuf);
  // Spectrum
  const c1=$('specCanvas');if(c1){const ctx=c1.getContext('2d'),w=c1.width,h=c1.height;
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    const mx=Math.max(...mag)||1;
    ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
    for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
    ctx.stroke();ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Mystery Spectrum',4,12);
  }
  // Waterfall
  const c2=$('waterfallCanvas');if(c2){const ctx=c2.getContext('2d'),w=c2.width,h=c2.height;
    const img=ctx.getImageData(0,0,w,h-2);ctx.putImageData(img,0,2);
    const mx=Math.max(...mag)||1;
    for(let x=0;x<w;x++){
      const idx=Math.floor(x/w*mag.length),val=mag[idx]/mx;
      const db=Math.max(0,Math.min(1,(20*Math.log10(val+1e-10)+60)/60));
      let r,g,b;
      if(db<.25){r=0;g=0;b=Math.floor(db*4*255);}else if(db<.5){r=0;g=Math.floor((db-.25)*4*255);b=255;}
      else if(db<.75){r=Math.floor((db-.5)*4*255);g=255;b=255-Math.floor((db-.5)*4*255);}
      else{r=255;g=255-Math.floor((db-.75)*4*255);b=0;}
      ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(x,0,1,2);
    }
  }
}

function makeGuess(guess){
  totalAttempts++;
  const fb=$('feedback');
  if(guess===currentMod){
    correctCount++;streak++;score+=10+streak*2;
    if(streak>bestStreak)bestStreak=streak;
    level=Math.min(10,Math.floor(correctCount/3)+1);
    fb.textContent=LANG[currentLang].correctGuess+' +'+( 10+streak*2)+' pts';fb.style.color='#4f4';
    log(LANG[currentLang].correctGuess+' '+currentMod,'success');
    setTimeout(generateChallenge,1500);
  }else{
    streak=0;score=Math.max(0,score-5);
    fb.textContent=LANG[currentLang].wrongGuess+' -5 pts';fb.style.color='#f44';
    log(LANG[currentLang].wrongGuess+' (was '+currentMod+', guessed '+guess+')','error');
  }
  $('scoreVal').textContent=score;$('streakVal').textContent=streak;
  $('totalVal').textContent=totalAttempts;$('correctVal').textContent=correctCount;
  $('accVal').textContent=totalAttempts?Math.round(correctCount/totalAttempts*100)+'%':'0%';
  $('bestStreakVal').textContent=bestStreak;$('levelNum').textContent=level;
}

function showHint(){
  const h=HINTS[currentMod]||'Look at the spectrum shape carefully.';
  $('feedback').textContent=LANG[currentLang].hintMsg+' '+h;$('feedback').style.color='#ff8';
  log(LANG[currentLang].hintMsg+' '+h,'info');
}
function revealAnswer(){
  $('feedback').textContent=LANG[currentLang].revealed+' '+currentMod;$('feedback').style.color='#4af';
  streak=0;$('streakVal').textContent=0;
  log(LANG[currentLang].revealed+' '+currentMod,'info');
}

function tryDemod(type){
  if(!signalBuf)return;
  const c=$('demodCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const out=new Float32Array(N);const fc=1000,dt=1/SR;
  if(type==='envelope'){for(let i=0;i<N;i++)out[i]=Math.abs(signalBuf[i]);for(let i=1;i<N;i++)out[i]=out[i-1]+.05*(out[i]-out[i-1]);}
  else if(type==='coherent'){for(let i=0;i<N;i++)out[i]=signalBuf[i]*Math.cos(2*Math.PI*fc*i*dt)*2;for(let i=1;i<N;i++)out[i]=out[i-1]+.02*(out[i]-out[i-1]);}
  else if(type==='fm'){for(let i=1;i<N;i++){const p1=Math.atan2(signalBuf[i],signalBuf[Math.max(0,i-1)]);let dp=p1;if(dp>Math.PI)dp-=2*Math.PI;if(dp<-Math.PI)dp+=2*Math.PI;out[i]=dp;}}
  else if(type==='psk'){for(let i=0;i<N;i++){const sym=Math.floor(i/64);const prev=Math.max(0,(sym-1)*64);out[i]=signalBuf[i]*signalBuf[prev]>0?1:-1;}}
  ctx.strokeStyle='#4f4';ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,N);for(let i=0;i<show;i++){const x=i/show*w,y=h/2-out[i]*h*.3;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();ctx.fillStyle='#4f4';ctx.font='10px monospace';ctx.fillText('Demod: '+type,4,12);
  log('Tried demod: '+type,'tx');
}

function buildGuessButtons(){
  const el=$('guessButtons');if(!el)return;el.innerHTML='';
  MODS.forEach(m=>{const b=document.createElement('button');b.className='btn-sm';b.textContent=m;b.onclick=()=>makeGuess(m);el.appendChild(b);});
}

// Animate waterfall continuously
let wfAnim=null;
function wfLoop(){if(!signalBuf){wfAnim=requestAnimationFrame(wfLoop);return;}
  // Re-generate with slight variation for waterfall scrolling
  const fc=800+Math.random()*400,dt=1/SR;
  for(let i=0;i<N;i++){const t=i*dt;
    switch(currentMod){
      case'AM':signalBuf[i]=(1+.7*Math.sin(2*Math.PI*50*t))*Math.cos(2*Math.PI*fc*t);break;
      case'FM':signalBuf[i]=Math.cos(2*Math.PI*fc*t+8*Math.sin(2*Math.PI*30*t));break;
      case'SSB':{const m=Math.sin(2*Math.PI*80*t);signalBuf[i]=m*Math.cos(2*Math.PI*fc*t);break;}
      case'BPSK':signalBuf[i]=(Math.floor(i/64)%2?1:-1)*Math.cos(2*Math.PI*fc*t);break;
      case'QPSK':signalBuf[i]=Math.cos(2*Math.PI*fc*t+[.785,2.356,3.927,5.498][Math.floor(i/64)%4]);break;
      case'CW':signalBuf[i]=(Math.sin(2*Math.PI*2*t)>0?1:0)*Math.cos(2*Math.PI*fc*t);break;
      case'Noise':signalBuf[i]=Math.random()*2-1;break;
      case'Chirp':signalBuf[i]=Math.sin(2*Math.PI*(fc*.5+fc*2*(i/N))*t);break;
    }
    signalBuf[i]+=(Math.random()-.5)*.15;
  }
  drawAll();wfAnim=requestAnimationFrame(wfLoop);
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
  $('newChalBtn').onclick=generateChallenge;$('hintBtn').onclick=showHint;$('revealBtn').onclick=revealAnswer;
  buildGuessButtons();generateChallenge();wfLoop();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Demod Challenge
   Animated signal constellation scramble + score fireworks
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const pts=[];
function boot(){
  let el=document.getElementById('demodSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='demodSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='rgba(6,8,14,.12)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Rotating constellation
  const ccx=W*.25,ccy=H/2,cr=H*.35;
  cx.strokeStyle='rgba(100,200,255,.08)';cx.lineWidth=1;
  cx.beginPath();cx.arc(ccx,ccy,cr,0,Math.PI*2);cx.stroke();
  cx.beginPath();cx.moveTo(ccx-cr-5,ccy);cx.lineTo(ccx+cr+5,ccy);cx.stroke();
  cx.beginPath();cx.moveTo(ccx,ccy-cr-5);cx.lineTo(ccx,ccy+cr+5);cx.stroke();
  const numPts=32;
  for(let i=0;i<numPts;i++){
    const a=i/numPts*Math.PI*2+t*.5;const r2=cr*(.4+.3*Math.sin(i*1.7+t));
    const px=ccx+Math.cos(a)*r2+(Math.random()-.5)*4;
    const py=ccy+Math.sin(a)*r2+(Math.random()-.5)*4;
    cx.fillStyle=acc;cx.globalAlpha=.5;cx.beginPath();cx.arc(px,py,2.5,0,Math.PI*2);cx.fill();cx.globalAlpha=1;
  }
  // Signal type indicator ring
  const modTypes=['AM','FM','SSB','BPSK','QPSK','CW'];
  modTypes.forEach((m,i)=>{
    const a=i/modTypes.length*Math.PI*2-Math.PI/2+t*.2;
    const mx=W*.65+Math.cos(a)*60,my=H/2+Math.sin(a)*60;
    const isCurrent=typeof currentMod!=='undefined'&&currentMod===m;
    cx.fillStyle=isCurrent?acc:'rgba(100,200,255,.2)';cx.font=isCurrent?'bold 11px monospace':'9px monospace';
    cx.textAlign='center';cx.fillText(m,mx,my+4);
    if(isCurrent){cx.strokeStyle=acc+'66';cx.lineWidth=1;cx.beginPath();cx.arc(mx,my,16,0,Math.PI*2);cx.stroke();}
  });
  // Score/streak display
  const sc=typeof score!=='undefined'?score:0,st=typeof streak!=='undefined'?streak:0;
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(W*.55,8,90,20);
  cx.fillStyle='#4f4';cx.font='10px Orbitron,monospace';cx.textAlign='center';
  cx.fillText(`${sc} pts | x${st}`,W*.55+45,22);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Signal Identification — Constellation View',8,14);
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
