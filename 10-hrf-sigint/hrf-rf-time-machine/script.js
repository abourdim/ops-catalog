/**
 * RF Time Machine — Spectrum DVR — Workshop DIY
 * Record, rewind, and replay RF spectrum waterfall
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;switch(t){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);break;}}

const LANG={
  en:{title:'RF Time Machine',subtitle:'⏪ Record and replay spectrum',disconnected:'Disconnected',connected:'Connected',mainSection:'RF Time Machine — Spectrum DVR',mainDesc:'Record, rewind, and replay RF spectrum',sectionA:'Live Spectrum',sectionB:'Recording Info',sectionC:'Spectrum DVR Explained',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click Record to start capturing spectrum frames.',howto_2:'Watch the waterfall build up with simulated signals.',howto_3:'Click Stop then use the timeline scrubber to rewind.',howto_4:'Click Play to replay the recorded spectrum.',wiki_dvr_title:'⏪ Spectrum DVR',wiki_dvr:'Record and replay RF spectrum.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'All data stays in your browser.',working:'Working...',ready:'⏪ RF Time Machine ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',record:'⏺ Record',stopScan:'⏹ Stop',play:'▶ Play',rewind:'⏪ Rewind',timeline:'Timeline:',framesLabel:'Frames',durationLabel:'Duration',centerLabel:'Center (MHz)',bwLabel:'BW (MHz)',dvrInfo:'A Spectrum DVR records FFT frames over time, creating a rewindable waterfall display. This allows you to go back and analyze signals you may have missed.',recStarted:'⏺ Recording started — 100.0 MHz center',recStopped:'⏹ Recording stopped',playStarted:'▶ Playback started',rewinding:'⏪ Rewinding',signalDetected:'📡 Signal detected at',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR or HackRF. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Hrf Gsm Tower Mapper and Hrf Ism Band Explorer! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr:{title:'Machine a remonter le temps RF',subtitle:'⏪ Enregistrer et rejouer le spectre',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Machine RF — DVR Spectral',mainDesc:'Enregistrer, rembobiner et rejouer le spectre',sectionA:'Spectre en direct',sectionB:'Info enregistrement',sectionC:'DVR Spectral explique',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez Enregistrer pour capturer des trames spectrales.',howto_2:'Observez le waterfall se construire.',howto_3:'Arretez puis utilisez la timeline pour rembobiner.',howto_4:'Cliquez Lecture pour rejouer le spectre.',wiki_dvr_title:'⏪ DVR Spectral',wiki_dvr:'Enregistrer et rejouer le spectre RF.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Tout reste local.',working:'En cours...',ready:'⏪ Machine RF prete !',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',record:'⏺ Enregistrer',stopScan:'⏹ Arreter',play:'▶ Lecture',rewind:'⏪ Rembobiner',timeline:'Timeline :',framesLabel:'Trames',durationLabel:'Duree',centerLabel:'Centre (MHz)',bwLabel:'BW (MHz)',dvrInfo:'Un DVR spectral enregistre des trames FFT dans le temps pour creer un waterfall rembobinable.',recStarted:'⏺ Enregistrement demarre',recStopped:'⏹ Enregistrement arrete',playStarted:'▶ Lecture demarree',rewinding:'⏪ Rembobinage',signalDetected:'📡 Signal detecte a',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Gsm Tower Mapper and Hrf Ism Band Explorer ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar:{title:'آلة الزمن RF',subtitle:'⏪ تسجيل واعادة الطيف',disconnected:'غير متصل',connected:'متصل',mainSection:'آلة الزمن RF — مسجل الطيف',mainDesc:'تسجيل وترجيع واعادة تشغيل الطيف',sectionA:'الطيف المباشر',sectionB:'معلومات التسجيل',sectionC:'شرح مسجل الطيف',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اضغط تسجيل لبدء التقاط اطارات الطيف.',howto_2:'شاهد الشلال يتشكل مع الاشارات.',howto_3:'اوقف ثم استخدم شريط الوقت للترجيع.',howto_4:'اضغط تشغيل لاعادة عرض الطيف.',wiki_dvr_title:'⏪ مسجل الطيف',wiki_dvr:'تسجيل واعادة الطيف RF.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'كل البيانات محلية.',working:'جارٍ...',ready:'⏪ آلة الزمن RF جاهزة!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',record:'⏺ تسجيل',stopScan:'⏹ ايقاف',play:'▶ تشغيل',rewind:'⏪ ترجيع',timeline:'الجدول الزمني:',framesLabel:'اطارات',durationLabel:'المدة',centerLabel:'المركز (MHz)',bwLabel:'عرض النطاق (MHz)',dvrInfo:'مسجل الطيف يسجل اطارات FFT عبر الزمن لانشاء عرض شلال قابل للترجيع.',recStarted:'⏺ بدا التسجيل',recStopped:'⏹ توقف التسجيل',playStarted:'▶ بدا التشغيل',rewinding:'⏪ ترجيع',signalDetected:'📡 اشارة مكتشفة عند',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Gsm Tower Mapper and Hrf Ism Band Explorer! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}

let logContainer,typewriterEnabled=true;const logHistory=[];
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');logHistory.push({msg,type,ts:Date.now()});applyLogFilter();}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await new Promise(r=>setTimeout(r,8+Math.random()*12));}el.classList.remove('typing');}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const text=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`rf-timemachine-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(()=>{const e=$('toastIndicator');if(e)e.style.display='none';},ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(r);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab,tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const target=$(tid);if(target)target.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let whisperActive=false;function toggleWhisper(){whisperActive=!whisperActive;log(whisperActive?'🎤 Whisper on':'🎤 Whisper off','info');}
let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing on':'🫁 Breathing off','info');}
let dhikrCount=0;function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;playSound('click');}
function toggleMusicMode(){log('🎵 Music toggled','info');}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const cv=$('matrixCanvas');if(!cv)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);cv.classList.remove('active');return;}matrixRunning=true;cv.classList.add('active');const ctx=cv.getContext('2d');cv.width=window.innerWidth;cv.height=window.innerHeight;const cols=Math.floor(cv.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,cv.width,cv.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>cv.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* =======================================================================
   RF TIME MACHINE — SPECTRUM DVR SIMULATION ENGINE
   ======================================================================= */
const NUM_BINS=256;
const CENTER_FREQ=100.0; // MHz
const BW=2.4; // MHz
const MAX_FRAMES=300; // max recorded frames

let recording=false,playing=false,animFrame=null,simInterval=null;
let frames=[]; // array of Float32Array(NUM_BINS)
let playIdx=0;
let currentFrame=new Float32Array(NUM_BINS);

// Simulated signal sources that come and go
let signals=[];
function genSignals(){
  signals=[];
  // Persistent FM station
  signals.push({bin:Math.floor(NUM_BINS*0.5),width:6,power:25+Math.random()*10,drift:0,life:Infinity,age:0});
  // Some intermittent signals
  for(let i=0;i<3;i++){
    signals.push({bin:20+Math.floor(Math.random()*(NUM_BINS-40)),width:2+Math.random()*5,power:10+Math.random()*20,drift:(Math.random()-0.5)*0.3,life:20+Math.floor(Math.random()*60),age:0});
  }
}

function gaussNoise(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

function generateFrame(){
  const data=new Float32Array(NUM_BINS);
  for(let i=0;i<NUM_BINS;i++)data[i]=-90+gaussNoise()*3;
  signals.forEach(sig=>{
    if(sig.age>sig.life)return;
    sig.age++;sig.bin+=sig.drift;
    for(let i=0;i<NUM_BINS;i++){
      const dist=(i-sig.bin)/sig.width;
      data[i]+=sig.power*Math.exp(-0.5*dist*dist);
    }
  });
  // Remove dead signals and occasionally add new ones
  signals=signals.filter(s=>s.age<=s.life);
  if(Math.random()<0.05){
    const newSig={bin:20+Math.floor(Math.random()*(NUM_BINS-40)),width:2+Math.random()*5,power:10+Math.random()*20,drift:(Math.random()-0.5)*0.3,life:15+Math.floor(Math.random()*40),age:0};
    signals.push(newSig);
    const freq=(CENTER_FREQ-BW/2+(newSig.bin/NUM_BINS)*BW).toFixed(3);
    log(`${LANG[currentLang].signalDetected} ${freq} MHz (${newSig.power.toFixed(0)} dB)`,'rx');
  }
  return data;
}

function formatTime(sec){const m=Math.floor(sec/60),s=sec%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

function updateInfo(){
  const rf=$('recFrames');if(rf)rf.textContent=frames.length;
  const rd=$('recDuration');if(rd)rd.textContent=frames.length+'s';
  const rc=$('recCenter');if(rc)rc.textContent=CENTER_FREQ.toFixed(1);
  const rb=$('recBW');if(rb)rb.textContent=BW.toFixed(1);
  const td=$('timeDisplay');
  if(td){
    if(recording)td.textContent=`${formatTime(frames.length)} (REC)`;
    else if(playing)td.textContent=`${formatTime(playIdx)} / ${formatTime(frames.length)}`;
    else td.textContent=`${formatTime(frames.length)} / ${formatTime(frames.length)}`;
  }
}

function recordTick(){
  const frame=generateFrame();
  currentFrame=frame;
  frames.push(new Float32Array(frame));
  if(frames.length>MAX_FRAMES)frames.shift();
  const scrubber=$('timelineScrubber');
  if(scrubber){scrubber.max=frames.length;scrubber.value=frames.length;}
  const st=$('scrubTime');if(st)st.textContent='LIVE';
  updateInfo();
}

/* ======= WATERFALL DRAWING ======= */
function powerToColor(power){
  const norm=Math.max(0,Math.min(1,(power+90)/50));
  if(norm<0.33)return `rgb(0,0,${Math.floor(norm*3*255)})`;
  if(norm<0.66){const v=(norm-0.33)*3;return `rgb(${Math.floor(v*255)},${Math.floor(v*200)},${Math.floor((1-v)*255)})`;}
  const v=(norm-0.66)*3;return `rgb(255,${Math.floor(255-v*100)},${Math.floor(v*255)})`;
}

function drawWaterfall(){
  const cv=$('waterfallCanvas');if(!cv)return;
  const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;
  ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);

  const startIdx=playing?Math.max(0,playIdx-H):Math.max(0,frames.length-H);
  const endIdx=playing?playIdx:frames.length;
  const visibleFrames=frames.slice(startIdx,endIdx);

  for(let row=0;row<visibleFrames.length;row++){
    const frame=visibleFrames[row];
    const y=H-(visibleFrames.length-row);
    for(let i=0;i<NUM_BINS;i++){
      const x=(i/NUM_BINS)*W;
      const w=Math.ceil(W/NUM_BINS)+1;
      ctx.fillStyle=powerToColor(frame[i]);
      ctx.fillRect(x,y,w,1);
    }
  }

  // Frequency labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
  for(let i=0;i<=6;i++){
    const f=CENTER_FREQ-BW/2+(i/6)*BW;
    ctx.fillText(f.toFixed(2),(i/6)*W,H-4);
  }
  // Status
  ctx.textAlign='left';ctx.fillStyle=recording?'rgba(255,80,80,0.8)':'rgba(100,200,255,0.4)';
  ctx.fillText(recording?'⏺ RECORDING':'DVR — '+formatTime(frames.length),8,14);
  if(playing){ctx.fillStyle='rgba(80,255,80,0.8)';ctx.fillText(`▶ PLAYING ${formatTime(playIdx)}`,8,26);}
}

function drawSpectrum(){
  const cv=$('spectrumCanvas');if(!cv)return;
  const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(100,200,255,0.06)';ctx.lineWidth=1;
  for(let i=0;i<=8;i++){ctx.beginPath();ctx.moveTo((i/8)*W,0);ctx.lineTo((i/8)*W,H);ctx.stroke();}
  const minDb=-95,maxDb=-40;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<NUM_BINS;i++){const x=(i/NUM_BINS)*W;const y=H-((currentFrame[i]-minDb)/(maxDb-minDb))*(H-20);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.stroke();ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle=accent.replace(')',',0.08)').replace('rgb','rgba');ctx.fill();
}

function drawLoop(){
  drawWaterfall();drawSpectrum();
  if(recording||playing)animFrame=requestAnimationFrame(drawLoop);
}

function startRecording(){
  if(recording)return;recording=true;playing=false;setStatus(true);
  genSignals();frames=[];
  log(LANG[currentLang].recStarted,'success');
  simInterval=setInterval(recordTick,200);
  drawLoop();
}

function stopAll(){
  recording=false;playing=false;setStatus(false);
  if(simInterval){clearInterval(simInterval);simInterval=null;}
  if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;}
  log(LANG[currentLang].recStopped,'info');
  drawWaterfall();drawSpectrum();
}

function startPlayback(){
  if(frames.length===0)return;
  if(recording)stopAll();
  playing=true;playIdx=0;setStatus(true);
  log(LANG[currentLang].playStarted,'success');
  function playTick(){
    if(!playing||playIdx>=frames.length){playing=false;setStatus(false);updateInfo();drawWaterfall();drawSpectrum();return;}
    currentFrame=frames[playIdx];playIdx++;
    const scrubber=$('timelineScrubber');if(scrubber)scrubber.value=playIdx;
    const st=$('scrubTime');if(st)st.textContent=formatTime(playIdx);
    updateInfo();
    setTimeout(playTick,100);
  }
  drawLoop();playTick();
}

function rewindToStart(){
  if(recording)stopAll();
  playIdx=0;playing=false;
  if(frames.length>0)currentFrame=frames[0];
  const scrubber=$('timelineScrubber');if(scrubber)scrubber.value=0;
  const st=$('scrubTime');if(st)st.textContent=formatTime(0);
  log(LANG[currentLang].rewinding,'info');
  updateInfo();drawWaterfall();drawSpectrum();
}

function scrubTo(idx){
  if(frames.length===0)return;
  idx=Math.max(0,Math.min(idx,frames.length-1));
  playIdx=idx;currentFrame=frames[idx];
  const st=$('scrubTime');if(st)st.textContent=formatTime(idx);
  updateInfo();drawWaterfall();drawSpectrum();
}

/* ======= INIT ======= */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();

  // App-specific buttons
  const recBtn=$('recordBtn'),stopBtn=$('stopBtn'),playBtn=$('playBtn'),rewBtn=$('rewindBtn');
  if(recBtn)recBtn.onclick=startRecording;
  if(stopBtn)stopBtn.onclick=stopAll;
  if(playBtn)playBtn.onclick=startPlayback;
  if(rewBtn)rewBtn.onclick=rewindToStart;

  const scrubber=$('timelineScrubber');
  if(scrubber)scrubber.addEventListener('input',()=>{if(!recording)scrubTo(parseInt(scrubber.value));});

  drawWaterfall();drawSpectrum();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — RF Time Machine
   Animated 3D-perspective waterfall with time axis + signal ghost trails
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const history=[];
function boot(){
  let el=document.getElementById('tmSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='tmSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function genLine(){
  const n=128,d=new Float32Array(n);
  for(let i=0;i<n;i++)d[i]=-90+(Math.random()-.5)*6;
  const ns=2+Math.floor(Math.random()*3);
  for(let s=0;s<ns;s++){const c=10+Math.random()*(n-20),w=2+Math.random()*6,p=15+Math.random()*30;
    for(let i=0;i<n;i++){const dist=(i-c)/w;d[i]+=p*Math.exp(-.5*dist*dist);}}
  return d;
}
function tick(){
  t+=.016;
  if(history.length===0||Math.random()<.3)history.unshift(genLine());
  if(history.length>40)history.pop();
  cx.fillStyle='#040810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // 3D perspective waterfall
  const rows=Math.min(history.length,30);
  for(let r=rows-1;r>=0;r--){
    const line=history[r],n=line.length;
    const yOff=H-20-r*5,xOff=r*2,scale=1-r*.015;
    const alpha=1-r/rows;
    cx.strokeStyle=`rgba(100,200,255,${alpha*.3})`;cx.lineWidth=1;cx.beginPath();
    for(let i=0;i<n;i++){
      const x=xOff+(i/n)*(W-r*4)*scale;
      const norm=Math.max(0,Math.min(1,(line[i]+90)/50));
      const y=yOff-norm*40*scale;
      if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.stroke();
    // Fill under curve
    cx.lineTo(xOff+(W-r*4)*scale,yOff);cx.lineTo(xOff,yOff);cx.closePath();
    cx.fillStyle=`rgba(100,200,255,${alpha*.03})`;cx.fill();
  }
  // Time arrow
  cx.strokeStyle=acc+'88';cx.lineWidth=1.5;cx.setLineDash([4,4]);
  cx.beginPath();cx.moveTo(W-30,H-10);cx.lineTo(W-30,20);cx.stroke();
  cx.fillStyle=acc;cx.beginPath();cx.moveTo(W-30,15);cx.lineTo(W-34,25);cx.lineTo(W-26,25);cx.closePath();cx.fill();
  cx.setLineDash([]);
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('3D Spectrum Timeline — DVR Perspective View',8,14);
  cx.textAlign='right';cx.fillText('TIME ↑',W-10,H/2);
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
