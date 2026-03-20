/**
 * SDR Spectrum Observatory — Workshop DIY v1.0
 * 24/7 spectrum monitoring and anomaly detection.
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,c+.08);o.start(c);o.stop(c+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,c+.3);o.start(c);o.stop(c+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+.25);o.start(c);o.stop(c+.25);}}
const LANG={
  en:{title:'Spectrum Observatory',subtitle:'24/7 Spectrum Monitoring',disconnected:'Idle',connected:'Monitoring',mainSection:'Spectrum Monitor',mainDesc:'Continuous spectrum monitoring and anomaly detection',sectionA:'Observatory Stats',sectionB:'Observatory Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Select frequency band.',howto_2:'Set alert threshold.',howto_3:'Start monitoring.',howto_4:'Watch for alerts.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'Observatory ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',bandLabel:'Frequency Band',threshLabel:'Alert Threshold (dB)',startMon:'Start Monitoring',stopMon:'Stop',resetMon:'Reset',scanTime:'Monitoring Time:',anomalies:'Anomalies:',peakSig:'Peak Signal:',noiseFloor:'Noise Floor:',occupancy:'Occupancy:',guideIntro:'Spectrum observatory monitors RF bands:',guide1:'Real-time spectrum and waterfall',guide2:'Automatic anomaly detection',guide3:'Band occupancy stats',guide4:'Alert system for unexpected TX',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',monStarted:'Monitoring started',monStopped:'Stopped',monReset:'Reset',anomalyDetected:'ANOMALY detected at',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates software-defined radio! 🔬 You get to experiment with radio signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real digital signal processing! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Sdr Universal Decoder and Sdr Os! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr:{title:'Observatoire Spectral',subtitle:'Surveillance Spectrale 24/7',disconnected:'Inactif',connected:'Surveillance',mainSection:'Moniteur Spectral',mainDesc:'Surveillance continue et detection d\'anomalies',sectionA:'Statistiques',sectionB:'Guide',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Selectionnez la bande.',howto_2:'Definissez le seuil.',howto_3:'Demarrez.',howto_4:'Surveillez les alertes.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'Observatoire pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',bandLabel:'Bande',threshLabel:'Seuil (dB)',startMon:'Demarrer',stopMon:'Arreter',resetMon:'Reinitialiser',scanTime:'Temps:',anomalies:'Anomalies:',peakSig:'Signal pic:',noiseFloor:'Plancher:',occupancy:'Occupation:',guideIntro:'L\'observatoire surveille les bandes RF:',guide1:'Spectre et cascade en temps reel',guide2:'Detection automatique d\'anomalies',guide3:'Statistiques d\'occupation',guide4:'Alertes pour transmissions inattendues',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',monStarted:'Surveillance demarree',monStopped:'Arretee',monReset:'Reinitialise',anomalyDetected:'ANOMALIE detectee a',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Universal Decoder and Sdr Os ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'مرصد الطيف',subtitle:'مراقبة الطيف على مدار الساعة',disconnected:'خامل',connected:'مراقبة',mainSection:'مراقب الطيف',mainDesc:'مراقبة مستمرة للطيف وكشف الشذوذ',sectionA:'احصائيات',sectionB:'الدليل',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',howto_1:'اختر نطاق التردد.',howto_2:'اضبط حد التنبيه.',howto_3:'ابدا المراقبة.',howto_4:'راقب التنبيهات.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'المرصد جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',bandLabel:'نطاق التردد',threshLabel:'حد التنبيه (dB)',startMon:'بدء المراقبة',stopMon:'ايقاف',resetMon:'اعادة',scanTime:'وقت المراقبة:',anomalies:'الشذوذات:',peakSig:'ذروة الاشارة:',noiseFloor:'ارضية الضوضاء:',occupancy:'الاشغال:',guideIntro:'مرصد الطيف يراقب نطاقات RF:',guide1:'طيف وشلال في الوقت الحقيقي',guide2:'كشف تلقائي للشذوذ',guide3:'احصائيات الاشغال',guide4:'نظام تنبيه للارسالات غير المتوقعة',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',monStarted:'بدات المراقبة',monStopped:'توقفت',monReset:'اعادة ضبط',anomalyDetected:'تم كشف شذوذ عند',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Universal Decoder and Sdr Os! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;$('langSelect').value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){$('logContainer').innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='observatory-log.txt';a.click();URL.revokeObjectURL(u);}
function setStatus(c){const s=LANG[currentLang];$('statusText').textContent=c?s.connected:s.disconnected;$('statusPill').classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();}));}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){try{$('hijriDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;function openSettings(){logWasOpen=$('logPanel')?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ SPECTRUM OBSERVATORY SIMULATION ═══════ */
let running=false,animFrame=null,startTime=0,anomalyCount=0;
const BANDS={fm:{lo:88,hi:108,unit:'MHz',sigs:[{f:0.15,p:-20},{f:0.35,p:-25},{f:0.55,p:-22},{f:0.75,p:-28}]},air:{lo:118,hi:137,unit:'MHz',sigs:[{f:0.2,p:-35},{f:0.6,p:-40}]},ism:{lo:433,hi:434,unit:'MHz',sigs:[{f:0.5,p:-30}]},cell:{lo:700,hi:900,unit:'MHz',sigs:[{f:0.1,p:-25},{f:0.3,p:-20},{f:0.5,p:-22},{f:0.7,p:-18},{f:0.9,p:-24}]},wifi:{lo:2400,hi:2500,unit:'MHz',sigs:[{f:0.25,p:-20},{f:0.5,p:-18},{f:0.75,p:-22}]}};

function genSpectrum(band){
  const N=400,spec=new Float32Array(N);
  const b=BANDS[band];if(!b)return spec;
  for(let i=0;i<N;i++){spec[i]=-60+Math.random()*5;}
  for(const s of b.sigs){const ci=Math.floor(s.f*N),spread=10+Math.random()*5;for(let i=Math.max(0,ci-15);i<Math.min(N,ci+15);i++){const d=Math.abs(i-ci);spec[i]=Math.max(spec[i],s.p+Math.random()*3-d*d*0.1);}}
  // Random anomaly
  if(Math.random()<0.03){const ai=Math.floor(Math.random()*N);spec[ai]=-10+Math.random()*5;}
  return spec;
}

function drawSpectrum(spec,thresh){
  const c=$('spectrumCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,i*h/6);ctx.lineTo(w,i*h/6);ctx.stroke();}
  // Threshold line
  const thY=h*(1-(thresh+60)/60);ctx.strokeStyle='#ff333355';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,thY);ctx.lineTo(w,thY);ctx.stroke();ctx.setLineDash([]);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<spec.length;i++){const x=i/spec.length*w,y=h*(1-(spec[i]+60)/60);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=accent.replace(')',',0.1)').replace('rgb','rgba');ctx.fill();
  const b=BANDS[$('bandSelect').value];
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  if(b){ctx.fillText(b.lo+' '+b.unit,4,h-4);ctx.fillText(b.hi+' '+b.unit,w-70,h-4);}
}

function drawWaterfall(spec){
  const c=$('waterfallCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  const img=ctx.getImageData(0,0,w,h-1);ctx.putImageData(img,0,1);
  for(let i=0;i<w;i++){const si=Math.floor(i/w*spec.length),val=Math.max(0,Math.min(1,(spec[si]+60)/60));
    let r,g,b;if(val<.25){r=0;g=0;b=Math.floor(val*4*255);}else if(val<.5){r=0;g=Math.floor((val-.25)*4*255);b=255;}
    else if(val<.75){r=Math.floor((val-.5)*4*255);g=255;b=255-Math.floor((val-.5)*4*255);}else{r=255;g=255-Math.floor((val-.75)*4*255);b=0;}
    ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(i,0,1,1);}
}

function drawAlerts(spec,thresh){
  const c=$('alertCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  let hasAnomaly=false;
  for(let i=0;i<spec.length;i++){if(spec[i]>thresh){const x=i/spec.length*w;ctx.fillStyle='#ff3333';ctx.fillRect(x-2,5,4,h-10);hasAnomaly=true;}}
  if(hasAnomaly){ctx.fillStyle='#ff3333';ctx.font='12px Orbitron,monospace';ctx.fillText('ALERT: Signal above threshold!',10,h/2+4);}
  else{ctx.fillStyle='#44ff44';ctx.font='12px Orbitron,monospace';ctx.fillText('All clear - no anomalies',10,h/2+4);}
  return hasAnomaly;
}

function monLoop(){if(!running)return;
  const band=$('bandSelect').value,thresh=+$('threshSlider').value;
  const spec=genSpectrum(band);drawSpectrum(spec,thresh);drawWaterfall(spec);
  const hasAnomaly=drawAlerts(spec,thresh);
  if(hasAnomaly&&Math.random()<0.1){anomalyCount++;const b=BANDS[band];
    const f=(b.lo+Math.random()*(b.hi-b.lo)).toFixed(1);
    log(LANG[currentLang].anomalyDetected+' '+f+' '+b.unit,'error');playSound('error');}
  const peak=Math.max(...spec),noise=spec.reduce((a,b)=>a+b,0)/spec.length;
  let occ=0;for(let i=0;i<spec.length;i++)if(spec[i]>-45)occ++;occ=Math.round(occ/spec.length*100);
  $('scanTimeVal').textContent=Math.floor((Date.now()-startTime)/1000)+'s';
  $('anomaliesVal').textContent=anomalyCount;$('peakSigVal').textContent=peak.toFixed(1)+' dB';
  $('noiseFloorVal').textContent=noise.toFixed(1)+' dB';$('occupancyVal').textContent=occ+'%';
  animFrame=requestAnimationFrame(monLoop);}
function startMon(){if(running)return;running=true;startTime=Date.now();setStatus(true);log(LANG[currentLang].monStarted,'success');monLoop();}
function stopMon(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].monStopped,'info');}
function resetMon(){stopMon();anomalyCount=0;['spectrumCanvas','waterfallCanvas','alertCanvas'].forEach(id=>{const c=$(id);c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('scanTimeVal').textContent='0s';$('anomaliesVal').textContent='0';$('peakSigVal').textContent='-- dB';$('noiseFloorVal').textContent='-- dB';$('occupancyVal').textContent='0%';
  log(LANG[currentLang].monReset,'info');}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});$('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startMon;$('stopBtn').onclick=stopMon;$('resetBtn').onclick=resetMon;
  $('threshSlider').oninput=function(){$('threshVal').textContent=this.value+' dB';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Spectrum Observatory
   Animated wideband panoramic spectrum + anomaly detection
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const specHist=[];
function boot(){
  let el=document.getElementById('obsSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='obsSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#030608;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function genSpec(){
  const n=256,d=new Float32Array(n);
  for(let i=0;i<n;i++)d[i]=-100+(Math.random()-.5)*4;
  // Known bands
  const bands=[{c:30,w:8,p:25},{c:80,w:5,p:20},{c:128,w:15,p:30},{c:180,w:4,p:18},{c:220,w:10,p:22}];
  bands.forEach(b=>{for(let i=0;i<n;i++){const dist=(i-b.c)/b.w;d[i]+=b.p*Math.exp(-.5*dist*dist);}});
  // Random transient
  if(Math.random()<.1){const c=Math.floor(Math.random()*n),w=1+Math.random()*3;
    for(let i=0;i<n;i++){const dist=(i-c)/w;d[i]+=35*Math.exp(-.5*dist*dist);}}
  return d;
}
function pCol(v){const n=Math.max(0,Math.min(1,(v+100)/60));
  if(n<.25)return[0,0,n*4*200|0];if(n<.5){const t=(n-.25)*4;return[0,t*200|0,200];}
  if(n<.75){const t=(n-.5)*4;return[t*255|0,200,(1-t)*200|0];}
  const u=(n-.75)*4;return[255,200+u*55|0,u*200|0];
}
function tick(){
  t+=.016;
  specHist.unshift(genSpec());if(specHist.length>H-25)specHist.pop();
  cx.fillStyle='#030608';cx.fillRect(0,0,W,H);
  // Waterfall
  for(let r=0;r<specHist.length;r++){
    const line=specHist[r];
    for(let i=0;i<256;i++){
      const[rr,g,b]=pCol(line[i]);
      cx.fillStyle=`rgb(${rr},${g},${b})`;
      cx.fillRect(i/256*W,20+r,Math.ceil(W/256)+1,1);
    }
  }
  // Overlay current spectrum line at top
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  if(specHist.length>0){
    cx.strokeStyle=acc+'88';cx.lineWidth=1;cx.beginPath();
    const cur=specHist[0];
    for(let i=0;i<256;i++){const x=i/256*W;const y=20-((cur[i]+100)/60)*18;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}
    cx.stroke();
  }
  // Band labels
  cx.fillStyle='rgba(255,255,255,.15)';cx.font='7px monospace';cx.textAlign='center';
  const labels=[{x:30,l:'HF'},{x:80,l:'VHF'},{x:128,l:'UHF'},{x:180,l:'L-Band'},{x:220,l:'S-Band'}];
  labels.forEach(lb=>{cx.fillText(lb.l,lb.x/256*W,16);});
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Panoramic Spectrum Observatory — Wideband Monitor',8,12);
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
