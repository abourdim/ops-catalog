/**
 * SDR OS — Workshop DIY v1.0
 * Full SDR operating system in browser with virtual desktop and SDR apps.
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}
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
    ...LANG_BASE.en,title:'SDR OS',subtitle:'Full SDR Operating System in Browser',disconnected:'Boot',connected:'Online',mainSection:'SDR Desktop',mainDesc:'Virtual desktop with SDR applications',sectionA:'System Monitor',sectionB:'OS Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Select an SDR app.',howto_2:'Click Launch.',howto_3:'Monitor system resources.',howto_4:'Reboot to reset.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'SDR OS booted!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',appLabel:'Launch App',launchApp:'Launch',closeApp:'Close App',reboot:'Reboot',cpu:'CPU:',mem:'Memory:',sdrDev:'SDR Device:',uptime:'Uptime:',appsRunning:'Apps:',guideIntro:'SDR OS provides a complete SDR environment:',guide1:'Launch multiple SDR apps on virtual desktop',guide2:'Spectrum analyzer shows frequency domain',guide3:'Waterfall shows time-frequency',guide4:'Signal recorder captures IQ data',guide5:'Demodulator supports AM/FM/SSB/Digital',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',launched:'Launched:',closed:'App closed',rebooted:'OS rebooted',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates software-defined radio! 🔬 You get to experiment with radio signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real digital signal processing! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Sdr Server and Sdr Universal Decoder! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr:{title:'SDR OS',subtitle:'Systeme d\'exploitation SDR complet',disconnected:'Demarrage',connected:'En ligne',mainSection:'Bureau SDR',mainDesc:'Bureau virtuel avec applications SDR',sectionA:'Moniteur Systeme',sectionB:'Guide OS',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Selectionnez une app.',howto_2:'Cliquez Lancer.',howto_3:'Surveillez les ressources.',howto_4:'Redemarrez pour reinitialiser.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'SDR OS demarre!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',appLabel:'Lancer App',launchApp:'Lancer',closeApp:'Fermer',reboot:'Redemarrer',cpu:'CPU:',mem:'Memoire:',sdrDev:'Appareil SDR:',uptime:'Temps:',appsRunning:'Apps:',guideIntro:'SDR OS fournit un environnement SDR complet:',guide1:'Lancez plusieurs apps SDR',guide2:'Analyseur de spectre',guide3:'Affichage en cascade',guide4:'Enregistreur de signaux',guide5:'Demodulateur multi-mode',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',launched:'Lance:',closed:'App fermee',rebooted:'OS redemarre',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Server and Sdr Universal Decoder ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'نظام SDR',subtitle:'نظام تشغيل SDR كامل في المتصفح',disconnected:'تشغيل',connected:'متصل',mainSection:'سطح مكتب SDR',mainDesc:'سطح مكتب افتراضي مع تطبيقات SDR',sectionA:'مراقب النظام',sectionB:'دليل النظام',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',howto_1:'اختر تطبيق SDR.',howto_2:'انقر تشغيل.',howto_3:'راقب موارد النظام.',howto_4:'اعد التشغيل للضبط.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'تم تشغيل نظام SDR!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',appLabel:'تشغيل تطبيق',launchApp:'تشغيل',closeApp:'اغلاق',reboot:'اعادة تشغيل',cpu:'المعالج:',mem:'الذاكرة:',sdrDev:'جهاز SDR:',uptime:'وقت التشغيل:',appsRunning:'التطبيقات:',guideIntro:'نظام SDR يوفر بيئة كاملة:',guide1:'شغل عدة تطبيقات SDR',guide2:'محلل الطيف يعرض مجال التردد',guide3:'عرض الشلال للوقت-التردد',guide4:'مسجل الاشارات يلتقط بيانات IQ',guide5:'مزيل التضمين يدعم عدة انماط',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',launched:'تم تشغيل:',closed:'تم اغلاق التطبيق',rebooted:'تم اعادة تشغيل النظام',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Server and Sdr Universal Decoder! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){$('logContainer').innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='sdr-os-log.txt';a.click();URL.revokeObjectURL(u);}
function setStatus(c){const s=LANG[currentLang];$('statusText').textContent=c?s.connected:s.disconnected;$('statusPill').classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();}));}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){try{$('hijriDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;function openSettings(){logWasOpen=$('logPanel')?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ OS DESKTOP SIMULATION ═══════ */
let animFrame=null,bootTime=Date.now();
const openApps=[];const appColors={spectrum:'#ff4444',waterfall:'#4488ff',recorder:'#44ff88',demod:'#ffaa00',scanner:'#ff44ff',terminal:'#88ff88'};
const appNames={spectrum:'Spectrum',waterfall:'Waterfall',recorder:'Recorder',demod:'Demodulator',scanner:'Scanner',terminal:'Terminal'};

function drawDesktop(){
  const c=$('desktopCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  // Desktop background
  ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,w,h);
  // Grid pattern
  ctx.strokeStyle='#111133';ctx.lineWidth=0.5;
  for(let i=0;i<w;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
  // Taskbar
  ctx.fillStyle='#111133';ctx.fillRect(0,h-30,w,30);
  ctx.fillStyle='#8899aa';ctx.font='11px Orbitron,monospace';
  const time=new Date().toLocaleTimeString();
  ctx.fillText('SDR-OS v1.0',8,h-10);ctx.fillText(time,w-80,h-10);
  ctx.fillText('Apps: '+openApps.length,w/2-30,h-10);
  // Draw open app windows
  openApps.forEach((app,i)=>{
    const wx=20+i*130,wy=20,ww=250,wh=160;
    // Window chrome
    ctx.fillStyle='#1a1a3a';ctx.fillRect(wx,wy,ww,wh);
    ctx.strokeStyle=appColors[app]||'#555';ctx.lineWidth=2;ctx.strokeRect(wx,wy,ww,wh);
    // Title bar
    ctx.fillStyle='#222244';ctx.fillRect(wx,wy,ww,20);
    ctx.fillStyle=appColors[app]||'#fff';ctx.font='10px Orbitron,monospace';
    ctx.fillText(appNames[app]||app,wx+8,wy+14);
    // App content simulation
    const cx=wx+5,cy=wy+25,cw=ww-10,ch=wh-30;
    if(app==='spectrum'||app==='scanner'){
      ctx.strokeStyle=appColors[app];ctx.lineWidth=1;ctx.beginPath();
      for(let x=0;x<cw;x++){const f=x/cw;const v=Math.sin(f*30+Date.now()/200)*0.3+Math.random()*0.2+0.3;ctx.lineTo(cx+x,cy+ch-v*ch);}
      ctx.stroke();
    }else if(app==='waterfall'){
      for(let y=0;y<ch;y+=2){for(let x=0;x<cw;x+=3){const v=Math.random();const r=v>0.5?Math.floor(v*255):0;const b=v<=0.5?Math.floor(v*2*255):255-Math.floor((v-0.5)*2*255);ctx.fillStyle=`rgb(${r},0,${b})`;ctx.fillRect(cx+x,cy+y,3,2);}}
    }else if(app==='recorder'){
      ctx.fillStyle='#ff3333';ctx.beginPath();ctx.arc(cx+20,cy+ch/2,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#aaa';ctx.font='10px monospace';ctx.fillText('REC '+((Date.now()-bootTime)/1000).toFixed(0)+'s',cx+35,cy+ch/2+4);
      ctx.fillStyle='#333';ctx.fillRect(cx+5,cy+ch-20,cw-10,12);ctx.fillStyle='#44ff44';
      ctx.fillRect(cx+5,cy+ch-20,((Date.now()/100)%100)/100*(cw-10),12);
    }else if(app==='demod'){
      ctx.strokeStyle='#ffaa00';ctx.lineWidth=1;ctx.beginPath();
      for(let x=0;x<cw;x++){const t=x/cw+Date.now()/1000;ctx.lineTo(cx+x,cy+ch/2+Math.sin(t*20)*ch*0.3);}
      ctx.stroke();
      ctx.fillStyle='#aaa';ctx.font='9px monospace';ctx.fillText('FM 98.5 MHz',cx+5,cy+14);
    }else if(app==='terminal'){
      ctx.fillStyle='#000';ctx.fillRect(cx,cy,cw,ch);
      ctx.fillStyle='#00ff00';ctx.font='9px monospace';
      const lines=['sdr@os:~$ rtl_sdr -f 100e6','Found 1 device(s)','Sampling at 2.048 MSPS','Reading samples...','sdr@os:~$ _'];
      lines.forEach((l,li)=>ctx.fillText(l,cx+4,cy+12+li*12));
    }
  });
  // Desktop icons if no apps
  if(openApps.length===0){
    ctx.fillStyle='#556';ctx.font='14px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('SDR OS Desktop',w/2,h/2-10);ctx.fillText('Launch an app to begin',w/2,h/2+15);ctx.textAlign='left';
  }
  // Update system monitor
  $('cpuVal').textContent=Math.min(100,openApps.length*15+Math.floor(Math.random()*10))+'%';
  $('memVal').textContent=(64+openApps.length*128)+' MB';
  $('uptimeVal').textContent=Math.floor((Date.now()-bootTime)/1000)+'s';
  $('appsVal').textContent=openApps.length;
  animFrame=requestAnimationFrame(drawDesktop);
}

function launchApp(){
  const app=$('appSelect').value;
  if(openApps.includes(app)){log(appNames[app]+' already running','error');return;}
  if(openApps.length>=4){log('Max 4 apps','error');return;}
  openApps.push(app);setStatus(true);
  log(LANG[currentLang].launched+' '+appNames[app],'success');
}
function closeApp(){
  if(openApps.length===0)return;
  const removed=openApps.pop();
  log(LANG[currentLang].closed+' ('+appNames[removed]+')','info');
  if(openApps.length===0)setStatus(false);
}
function rebootOS(){
  openApps.length=0;bootTime=Date.now();setStatus(false);
  const c=$('desktopCanvas');c.getContext('2d').clearRect(0,0,c.width,c.height);
  $('cpuVal').textContent='0%';$('memVal').textContent='0 MB';$('uptimeVal').textContent='0s';$('appsVal').textContent='0';
  log(LANG[currentLang].rebooted,'info');
  setTimeout(()=>{setStatus(true);log('Boot complete','success');},500);
}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});
  $('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('launchBtn').onclick=launchApp;$('closeAppBtn').onclick=closeApp;$('rebootBtn').onclick=rebootOS;
  setStatus(true);drawDesktop();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — SDR OS
   Animated desktop environment + system monitor + task manager
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const cpuHist=[];const memHist=[];
function boot(){
  let el=document.getElementById('osSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='osSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#0a0c14;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.016;cx.fillStyle='#0a0c14';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // CPU usage history
  cpuHist.push(20+Math.random()*60+Math.sin(t)*15);if(cpuHist.length>100)cpuHist.shift();
  memHist.push(40+Math.random()*20+Math.sin(t*.5)*10);if(memHist.length>100)memHist.shift();
  // CPU graph
  const gx=20,gy=25,gw=W*.44,gh=H*.4;
  cx.fillStyle='rgba(100,200,255,.03)';cx.fillRect(gx,gy,gw,gh);
  cx.strokeStyle='rgba(100,200,255,.1)';cx.lineWidth=.5;
  for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(gx,gy+i*gh/4);cx.lineTo(gx+gw,gy+i*gh/4);cx.stroke();}
  cx.strokeStyle='#22c55e';cx.lineWidth=1.5;cx.beginPath();
  cpuHist.forEach((v,i)=>{const x=gx+i/100*gw,y=gy+gh-v/100*gh;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);});cx.stroke();
  cx.fillStyle='#22c55e';cx.font='9px monospace';cx.fillText(`CPU: ${cpuHist[cpuHist.length-1]?.toFixed(0)||0}%`,gx+5,gy+12);
  // Memory graph
  const mx=W*.52,my=25,mw=W*.44,mh=H*.4;
  cx.fillStyle='rgba(100,200,255,.03)';cx.fillRect(mx,my,mw,mh);
  cx.strokeStyle='#4fc3f7';cx.lineWidth=1.5;cx.beginPath();
  memHist.forEach((v,i)=>{const x=mx+i/100*mw,y=my+mh-v/100*mh;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);});cx.stroke();
  cx.fillStyle='#4fc3f7';cx.font='9px monospace';cx.fillText(`MEM: ${memHist[memHist.length-1]?.toFixed(0)||0}%`,mx+5,my+12);
  // Process list at bottom
  const procs=[{name:'sdr_receiver',cpu:15+Math.random()*10,pid:1024},{name:'fft_worker',cpu:8+Math.random()*5,pid:1025},
    {name:'demod_am',cpu:3+Math.random()*3,pid:1026},{name:'waterfall_ui',cpu:12+Math.random()*8,pid:1027},
    {name:'audio_out',cpu:2+Math.random()*2,pid:1028},{name:'spectrum_log',cpu:1+Math.random(),pid:1029}];
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(0,H*.55,W,H*.45);
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('PID     PROCESS              CPU%',20,H*.55+14);
  procs.forEach((p,i)=>{
    cx.fillStyle='rgba(200,230,255,.3)';cx.font='8px monospace';
    cx.fillText(`${p.pid}    ${p.name.padEnd(20)} ${p.cpu.toFixed(1)}%`,20,H*.55+28+i*14);
    cx.fillStyle=acc+'44';cx.fillRect(280,H*.55+19+i*14,p.cpu*3,8);
  });
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('SDR-OS System Monitor',8,14);
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
