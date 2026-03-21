/**
 * SDR Filter Forge — Workshop DIY v1.0
 * Design, visualize and test digital filters for SDR
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 80 Q25 20 50 50 Q75 80 90 20" stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round"><animate attributeName="d" values="M10 80 Q25 20 50 50 Q75 80 90 20;M10 50 Q25 80 50 50 Q75 20 90 50;M10 80 Q25 20 50 50 Q75 80 90 20" dur="3s" repeatCount="indefinite"/></path><circle cx="30" cy="40" r="5" fill="currentColor" opacity=".6"><animate attributeName="cy" values="40;60;40" dur="2s" repeatCount="indefinite"/></circle><circle cx="70" cy="60" r="5" fill="currentColor" opacity=".6"><animate attributeName="cy" values="60;40;60" dur="2s" repeatCount="indefinite"/></circle></svg>`;
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
    ...LANG_BASE.en,title:'SDR Filter Forge',subtitle:'🔬 Filter Forge — Design your digital filters',disconnected:'Disconnected',connected:'Connected',mainSection:'Filter Forge',mainDesc:'Design, visualize and test digital filters',sectionA:'Filter Coefficients',sectionB:'Live Test Signal',sectionC:'Filter Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Choose a filter type and parameters.',howto_2:'Adjust order and cutoff.',howto_3:'Click Design to see frequency response.',howto_4:'Click Test to apply to a sample signal.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔬 Filter Forge ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',filterDesign:'Filter Design',orderLabel:'Filter Order',cutoffLabel:'Cutoff (normalized 0-1)',designBtn:'🔨 Design',testBtn:'🧪 Test',resetBtn:'↺ Reset',testDesc:'Apply filter to test signal — see before/after.',theoryIntro:'Digital filters selectively pass or block frequency components:',theory1:'FIR — always stable, linear phase',theory2:'IIR — more efficient, can be unstable',theory3:'Butterworth — maximally flat passband',theory4:'Pole-Zero plot — poles inside unit circle = stable',theory5:'Group delay — phase distortion measure',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',designed:'🔨 Filter designed',tested:'🧪 Filter tested on signal',resetDone:'↺ Filter reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What is SDR Filter Forge?',faq_a1:'SDR Filter Forge lets you design, visualize and test digital filters. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the center frequency, sample rate, and gain for the sdr receiver. Then you raw i/q samples are captured from the radio spectrum in real time.',faq_q3:'What do the controls do?',faq_a3:'Choose a filter type and parameters. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real digital signal processing principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Demod Challenge and Sdr Dsp Workbench. Each app in this category teaches a different aspect of digital signal processing.',demo_s1:'Welcome to SDR Filter Forge! Look at the main display — this is where the digital signal processing simulation runs.',demo_s2:'Choose a filter type and parameters. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Filter Coefficients" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital signal processing.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how digital signal processing works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital signal processing concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Filter Coefficients" and "Live Test Signal" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Forge de Filtres SDR',subtitle:'🔬 Forge de Filtres — Concevez vos filtres numeriques',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Forge de Filtres',mainDesc:'Concevez, visualisez et testez des filtres numeriques',sectionA:'Coefficients du Filtre',sectionB:'Signal Test en Direct',sectionC:'Theorie des Filtres',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Choisissez un type de filtre.',howto_2:'Ajustez l\'ordre et la coupure.',howto_3:'Cliquez Concevoir pour la reponse.',howto_4:'Cliquez Tester pour appliquer au signal.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes integres.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🔬 Forge de Filtres prete!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',filterDesign:'Conception Filtre',orderLabel:'Ordre du Filtre',cutoffLabel:'Coupure (normalisee 0-1)',designBtn:'🔨 Concevoir',testBtn:'🧪 Tester',resetBtn:'↺ Reinitialiser',testDesc:'Appliquer le filtre a un signal test.',theoryIntro:'Les filtres numeriques passent ou bloquent selectivement les frequences:',theory1:'FIR — toujours stable, phase lineaire',theory2:'IIR — plus efficace, peut etre instable',theory3:'Butterworth — reponse maximalement plate',theory4:'Diagramme poles-zeros — poles dans le cercle unite = stable',theory5:'Retard de groupe — mesure de distorsion de phase',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',designed:'🔨 Filtre concu',tested:'🧪 Filtre teste',resetDone:'↺ Filtre reinitialise',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Fft Racing and Sdr Demod Challenge ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'مسبك المرشحات SDR',subtitle:'🔬 مسبك المرشحات — صمم مرشحاتك الرقمية',disconnected:'غير متصل',connected:'متصل',mainSection:'مسبك المرشحات',mainDesc:'صمم وتصور واختبر المرشحات الرقمية',sectionA:'معاملات المرشح',sectionB:'اشارة اختبار حية',sectionC:'نظرية المرشحات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',howto_1:'اختر نوع المرشح.',howto_2:'اضبط الرتبة والقطع.',howto_3:'اضغط تصميم لرؤية الاستجابة.',howto_4:'اضغط اختبار لتطبيقه على اشارة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر مدمجة.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🔬 مسبك المرشحات جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',filterDesign:'تصميم المرشح',orderLabel:'رتبة المرشح',cutoffLabel:'القطع (معياري 0-1)',designBtn:'🔨 تصميم',testBtn:'🧪 اختبار',resetBtn:'↺ اعادة',testDesc:'طبق المرشح على اشارة اختبار.',theoryIntro:'المرشحات الرقمية تمرر او تحجب مكونات التردد بشكل انتقائي:',theory1:'FIR — مستقر دائما، طور خطي',theory2:'IIR — اكثر كفاءة، قد يكون غير مستقر',theory3:'باترورث — استجابة مسطحة قصوى',theory4:'مخطط القطب-الصفر — الاقطاب داخل دائرة الوحدة = مستقر',theory5:'تاخير المجموعة — قياس تشوه الطور',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',designed:'🔨 تم تصميم المرشح',tested:'🧪 تم اختبار المرشح',resetDone:'↺ تم اعادة ضبط المرشح',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Fft Racing and Sdr Demod Challenge! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='filter-forge-log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ FILTER DESIGN ENGINE ═══════ */
let filterCoeffs=[];
let filterType='fir-lp';

function designFIR(order,cutoff,type){
  const h=new Float32Array(order);
  const M=order-1;
  for(let n=0;n<=M;n++){
    const w=.54-.46*Math.cos(2*Math.PI*n/M); // Hamming window
    if(n===M/2){h[n]=cutoff*w;}
    else{const x=n-M/2;h[n]=(Math.sin(Math.PI*cutoff*x)/(Math.PI*x))*w;}
  }
  if(type.includes('hp')){for(let i=0;i<order;i++)h[i]=-h[i];h[Math.floor(M/2)]+=1;}
  if(type.includes('bp')){
    const lp=designFIR(order,cutoff*1.3,'fir-lp');
    const hp=designFIR(order,cutoff*.7,'fir-hp');
    for(let i=0;i<order;i++)h[i]=lp[i]+hp[i];
  }
  return h;
}

function designIIR(order,cutoff,type){
  // Simple Butterworth approximation using cascaded biquads
  const sections=Math.ceil(order/2);
  const coeffs=[];
  const wc=Math.tan(Math.PI*cutoff/2);
  for(let i=0;i<sections;i++){
    const theta=Math.PI*(2*i+1)/(2*order);
    const a1=-2*Math.cos(theta);
    const q=1/(2*Math.cos(theta));
    if(type.includes('lp')){
      coeffs.push({b:[wc*wc,2*wc*wc,wc*wc],a:[1+wc/q+wc*wc,2*(wc*wc-1),1-wc/q+wc*wc]});
    }else if(type.includes('hp')){
      coeffs.push({b:[1,-2,1],a:[1+wc/q+wc*wc,2*(wc*wc-1),1-wc/q+wc*wc]});
    }else{
      coeffs.push({b:[wc,0,-wc],a:[1+wc/q+wc*wc,2*(wc*wc-1),1-wc/q+wc*wc]});
    }
  }
  return coeffs;
}

function computeFreqResponse(coeffs,isFIR,N){
  const mag=new Float32Array(N);
  for(let k=0;k<N;k++){
    const w=Math.PI*k/N;
    if(isFIR){
      let re=0,im=0;
      for(let n=0;n<coeffs.length;n++){re+=coeffs[n]*Math.cos(-w*n);im+=coeffs[n]*Math.sin(-w*n);}
      mag[k]=Math.sqrt(re*re+im*im);
    }else{
      let totalMag=1;
      for(const sec of coeffs){
        let reN=0,imN=0,reD=0,imD=0;
        for(let n=0;n<sec.b.length;n++){reN+=sec.b[n]*Math.cos(-w*n);imN+=sec.b[n]*Math.sin(-w*n);}
        for(let n=0;n<sec.a.length;n++){reD+=sec.a[n]*Math.cos(-w*n);imD+=sec.a[n]*Math.sin(-w*n);}
        const magN=Math.sqrt(reN*reN+imN*imN);
        const magD=Math.sqrt(reD*reD+imD*imD);
        totalMag*=magN/(magD+1e-20);
      }
      mag[k]=totalMag;
    }
  }
  return mag;
}

function drawFreqResponse(mag){
  const c=$('freqResponseCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(0,i/10*h);ctx.lineTo(w,i/10*h);ctx.stroke();}
  for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(i/10*w,0);ctx.lineTo(i/10*w,h);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const maxM=Math.max(...mag)||1;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<mag.length;i++){
    const x=i/mag.length*w;
    const db=20*Math.log10(mag[i]/maxM+1e-10);
    const y=h-((db+60)/60)*h;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  ctx.fillText('0',4,h-4);ctx.fillText('π',w-12,h-4);ctx.fillText('0 dB',4,12);ctx.fillText('-60 dB',4,h-14);
}

function drawPoleZero(coeffs,isFIR){
  const c=$('poleZeroCanvas');if(!c)return;
  const ctx=c.getContext('2d'),s=c.width,r=s/2-20,cx=s/2,cy=s/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,s,s);
  // Unit circle
  ctx.strokeStyle='#334';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-r-10,cy);ctx.lineTo(cx+r+10,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-r-10);ctx.lineTo(cx,cy+r+10);ctx.stroke();
  ctx.fillStyle='#556';ctx.font='10px monospace';ctx.fillText('Re',cx+r+2,cy-4);ctx.fillText('Im',cx+4,cy-r-4);
  // Zeros (o) and Poles (x)
  if(isFIR){
    // FIR: zeros from polynomial roots approximation (just show on unit circle for display)
    const N=coeffs.length;
    for(let k=0;k<N;k++){
      const angle=2*Math.PI*k/N;
      const zx=cx+r*Math.cos(angle)*.8;const zy=cy-r*Math.sin(angle)*.8;
      ctx.strokeStyle='#0ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(zx,zy,4,0,2*Math.PI);ctx.stroke();
    }
  }else{
    // IIR: show poles and zeros from biquad sections
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    for(const sec of coeffs){
      // Approximate pole positions
      const a1=-sec.a[1]/sec.a[0],a2=sec.a[2]/sec.a[0];
      const disc=a1*a1-4*a2;
      if(disc>=0){
        const p1=(a1+Math.sqrt(disc))/2,p2=(a1-Math.sqrt(disc))/2;
        [[p1,0],[p2,0]].forEach(([pr,pi])=>{
          const px=cx+pr*r;const py=cy-pi*r;
          ctx.strokeStyle='#f44';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(px-4,py-4);ctx.lineTo(px+4,py+4);ctx.stroke();
          ctx.beginPath();ctx.moveTo(px+4,py-4);ctx.lineTo(px-4,py+4);ctx.stroke();
        });
      }else{
        const realP=a1/2,imagP=Math.sqrt(-disc)/2;
        [[realP,imagP],[realP,-imagP]].forEach(([pr,pi])=>{
          const px=cx+pr*r;const py=cy-pi*r;
          ctx.strokeStyle='#f44';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(px-4,py-4);ctx.lineTo(px+4,py+4);ctx.stroke();
          ctx.beginPath();ctx.moveTo(px+4,py-4);ctx.lineTo(px-4,py+4);ctx.stroke();
        });
      }
      // Zeros
      const b1=-sec.b[1]/sec.b[0],b2=sec.b[2]/sec.b[0];
      const dz=b1*b1-4*b2;
      if(dz>=0){
        [[( b1+Math.sqrt(dz))/2,0],[(b1-Math.sqrt(dz))/2,0]].forEach(([zr,zi])=>{
          const zx=cx+zr*r;const zy=cy-zi*r;
          ctx.strokeStyle='#0ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(zx,zy,4,0,2*Math.PI);ctx.stroke();
        });
      }
    }
  }
  ctx.fillStyle='#0ff';ctx.font='10px monospace';ctx.fillText('○ zeros',8,16);
  ctx.fillStyle='#f44';ctx.fillText('× poles',8,30);
}

function showCoeffs(coeffs,isFIR){
  const el=$('coeffDisplay');if(!el)return;
  if(isFIR){
    el.textContent='FIR Coefficients (h[n]):\n'+Array.from(coeffs).map((v,i)=>`h[${i}] = ${v.toFixed(8)}`).join('\n');
  }else{
    let txt='IIR Biquad Sections:\n';
    coeffs.forEach((sec,i)=>{
      txt+=`\nSection ${i+1}:\n  b = [${sec.b.map(v=>v.toFixed(6)).join(', ')}]\n  a = [${sec.a.map(v=>v.toFixed(6)).join(', ')}]\n`;
    });
    el.textContent=txt;
  }
}

function designFilter(){
  const type=$('filterDesign').value;
  const order=+$('orderSlider').value;
  const cutoff=+$('cutoffSlider').value/100;
  const isFIR=type.startsWith('fir');
  let coeffs;
  if(isFIR){coeffs=designFIR(order,cutoff,type);}
  else{coeffs=designIIR(order,cutoff,type);}
  filterCoeffs=coeffs;filterType=type;
  const mag=computeFreqResponse(coeffs,isFIR,400);
  drawFreqResponse(mag);
  drawPoleZero(coeffs,isFIR);
  showCoeffs(coeffs,isFIR);
  setStatus(true);
  log(LANG[currentLang].designed+` (${type}, order=${order}, fc=${cutoff.toFixed(2)})`,'success');
}

function testFilter(){
  if(!filterCoeffs.length&&!filterCoeffs.b){log('Design a filter first','error');return;}
  const c=$('testCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const N=512;
  // Generate multi-frequency test signal
  const sig=new Float32Array(N);
  for(let i=0;i<N;i++){
    sig[i]=.3*Math.sin(2*Math.PI*5*i/N)+.3*Math.sin(2*Math.PI*20*i/N)+.3*Math.sin(2*Math.PI*50*i/N)+(Math.random()-.5)*.1;
  }
  // Apply filter
  const isFIR=filterType.startsWith('fir');
  let filtered;
  if(isFIR){
    filtered=new Float32Array(N);
    for(let i=0;i<N;i++){let s=0;for(let j=0;j<filterCoeffs.length;j++){if(i-j>=0)s+=filterCoeffs[j]*sig[i-j];}filtered[i]=s;}
  }else{
    filtered=new Float32Array(sig);
    for(const sec of filterCoeffs){
      const out=new Float32Array(N);let x1=0,x2=0,y1=0,y2=0;
      for(let i=0;i<N;i++){
        out[i]=(sec.b[0]*filtered[i]+sec.b[1]*x1+sec.b[2]*x2-sec.a[1]*y1-sec.a[2]*y2)/sec.a[0];
        x2=x1;x1=filtered[i];y2=y1;y1=out[i];
      }
      filtered=out;
    }
  }
  // Draw original (dim)
  ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<N;i++){const x=i/N*w,y=h/2-sig[i]*h*.4;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  // Draw filtered (accent)
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<N;i++){const x=i/N*w,y=h/2-filtered[i]*h*.4;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.fillStyle='#555';ctx.font='10px monospace';ctx.fillText('Original',4,12);
  ctx.fillStyle=accent;ctx.fillText('Filtered',4,24);
  log(LANG[currentLang].tested,'success');
}

function resetFilter(){
  filterCoeffs=[];
  $('orderSlider').value=16;$('orderVal').textContent='16';
  $('cutoffSlider').value=50;$('cutoffVal').textContent='0.50';
  $('filterDesign').value='fir-lp';
  [$('freqResponseCanvas'),$('poleZeroCanvas'),$('testCanvas')].forEach(c=>{if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('coeffDisplay').textContent='Design a filter to see coefficients here.';
  setStatus(false);
  log(LANG[currentLang].resetDone,'info');
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
  $('designBtn').onclick=designFilter;$('testBtn').onclick=testFilter;$('resetBtn').onclick=resetFilter;
  $('orderSlider').oninput=function(){$('orderVal').textContent=this.value;};
  $('cutoffSlider').oninput=function(){$('cutoffVal').textContent=(this.value/100).toFixed(2);};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Filter Forge
   Animated impulse response + cascading filter stages
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('filterSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='filterSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Animated impulse response
  cx.strokeStyle=acc;cx.lineWidth=1.5;cx.beginPath();
  const irW=W*.45;
  for(let i=0;i<200;i++){
    const x=20+i/200*irW;const n=i-100;
    const sinc=n===0?1:Math.sin(Math.PI*n*.1)/(Math.PI*n*.1);
    const win=.54-.46*Math.cos(2*Math.PI*i/200);
    const decay=Math.exp(-Math.abs(n)*.01)*Math.sin(t*3+n*.05)*.1;
    const y=H/2-(sinc*win+decay)*H*.35;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='8px monospace';cx.fillText('Impulse Response h[n]',25,20);
  // Filter cascade blocks on right
  const stages=[{label:'LPF',fc:'500'},{label:'HPF',fc:'200'},{label:'BPF',fc:'350'}];
  stages.forEach((s,i)=>{
    const sx=W*.55+i*90,sy=H*.25;
    cx.fillStyle='rgba(100,200,255,.06)';cx.fillRect(sx,sy,75,50);
    cx.strokeStyle='rgba(100,200,255,.2)';cx.strokeRect(sx,sy,75,50);
    cx.fillStyle=acc;cx.font='10px Orbitron,monospace';cx.textAlign='center';
    cx.fillText(s.label,sx+37,sy+22);cx.fillStyle='rgba(200,230,255,.3)';cx.font='8px monospace';
    cx.fillText('fc='+s.fc,sx+37,sy+38);
    if(i<stages.length-1){
      cx.strokeStyle='rgba(100,200,255,.15)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(sx+75,sy+25);cx.lineTo(sx+90,sy+25);cx.stroke();
      const dx=(t*40)%15;cx.fillStyle=acc;cx.beginPath();cx.arc(sx+75+dx,sy+25,2,0,Math.PI*2);cx.fill();
    }
  });
  // Passband shape at bottom
  cx.strokeStyle='#4f4';cx.lineWidth=1;cx.beginPath();
  for(let i=0;i<W;i++){
    const f=i/W;const lp=1/(1+Math.pow(f/.3,8));
    const y=H-10-lp*50;if(i===0)cx.moveTo(i,y);else cx.lineTo(i,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Filter Forge — Impulse + Cascade Stages',8,14);
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
