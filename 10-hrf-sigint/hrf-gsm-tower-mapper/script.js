/**
 * GSM Tower Mapper — Workshop DIY
 * Simulated cell tower scanning and mapping
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;switch(t){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);break;}}

const LANG={
  en:{title:'GSM Tower Mapper',subtitle:'🗼 Map cell towers',disconnected:'Disconnected',connected:'Connected',mainSection:'GSM Tower Mapper',mainDesc:'Scan and map nearby cell towers',sectionA:'Tower List',sectionB:'Signal Details',sectionC:'GSM/LTE Explained',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click "Start Scan" to begin tower detection.',howto_2:'Watch towers appear on the map with coverage circles.',howto_3:'Click a tower for signal details.',howto_4:'Check the tower list for all detected cells.',wiki_gsm_title:'🗼 GSM/LTE',wiki_gsm:'Cellular technologies using 700-2600 MHz bands.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'All data stays in your browser.',working:'Working...',ready:'🗼 GSM Tower Mapper ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',startScan:'Start Scan',stopScan:'Stop',towersFound:'towers',thCellId:'Cell ID',thLAC:'LAC',thBand:'Band',thMCC:'MCC/MNC',thSignal:'Signal',thDist:'Distance',selectTower:'Click a tower for details',gsmInfo:'GSM and LTE cell towers create a network of coverage cells. Each tower is identified by Cell ID, LAC, and MCC/MNC codes. With tools like grgsm_scanner or an RTL-SDR, you can detect nearby towers and map their locations.',scanStarted:'📡 Tower scan started',scanStopped:'🔴 Scan stopped',newTower:'New tower:',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR or HackRF. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Hrf Aircraft Radar and Hrf Pager Decoder! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr:{title:'Cartographe GSM',subtitle:'🗼 Cartographier les antennes',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Cartographe GSM',mainDesc:'Scanner et cartographier les antennes',sectionA:'Liste des antennes',sectionB:'Details du signal',sectionC:'GSM/LTE explique',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez "Demarrer" pour commencer le scan.',howto_2:'Les antennes apparaissent sur la carte.',howto_3:'Cliquez une antenne pour les details.',howto_4:'Consultez la liste des antennes.',wiki_gsm_title:'🗼 GSM/LTE',wiki_gsm:'Technologies cellulaires sur 700-2600 MHz.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Tout reste local.',working:'En cours...',ready:'🗼 Cartographe GSM pret !',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',startScan:'Demarrer',stopScan:'Arreter',towersFound:'antennes',thCellId:'Cell ID',thLAC:'LAC',thBand:'Bande',thMCC:'MCC/MNC',thSignal:'Signal',thDist:'Distance',selectTower:'Cliquez une antenne pour les details',gsmInfo:'Les antennes GSM et LTE creent un reseau de cellules de couverture.',scanStarted:'📡 Scan demarre',scanStopped:'🔴 Scan arrete',newTower:'Nouvelle antenne :',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Aircraft Radar and Hrf Pager Decoder ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar:{title:'خريطة ابراج GSM',subtitle:'🗼 رسم خريطة الابراج',disconnected:'غير متصل',connected:'متصل',mainSection:'خريطة ابراج GSM',mainDesc:'مسح ورسم خريطة ابراج الاتصالات',sectionA:'قائمة الابراج',sectionB:'تفاصيل الاشارة',sectionC:'شرح GSM/LTE',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اضغط "بدء المسح" لكشف الابراج.',howto_2:'شاهد الابراج تظهر على الخريطة.',howto_3:'اضغط برج لرؤية التفاصيل.',howto_4:'تابع قائمة الابراج.',wiki_gsm_title:'🗼 GSM/LTE',wiki_gsm:'تقنيات خلوية على 700-2600 ميغاهرتز.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'كل البيانات محلية.',working:'جارٍ...',ready:'🗼 خريطة الابراج جاهزة!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',startScan:'بدء المسح',stopScan:'ايقاف',towersFound:'برج',thCellId:'Cell ID',thLAC:'LAC',thBand:'النطاق',thMCC:'MCC/MNC',thSignal:'الاشارة',thDist:'المسافة',selectTower:'اضغط برج للتفاصيل',gsmInfo:'ابراج GSM وLTE تنشئ شبكة خلايا تغطية.',scanStarted:'📡 بدا المسح',scanStopped:'🔴 توقف المسح',newTower:'برج جديد:',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Aircraft Radar and Hrf Pager Decoder! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
function playThemeMelody(n){if(!soundEnabled||!audioCtx&&!(audioCtx=new AudioCtx()))return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}

let logContainer,typewriterEnabled=true;const logHistory=[];
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');logHistory.push({msg,type,ts:Date.now()});applyLogFilter();}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await new Promise(r=>setTimeout(r,8+Math.random()*12));}el.classList.remove('typing');}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const text=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`gsm-mapper-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(()=>{if(el)el.style.display='none';},ms);}
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
   GSM TOWER MAPPER — SIMULATION ENGINE
   ======================================================================= */
const OPERATORS=[{mcc:'603',mnc:'01',name:'Mobilis'},{mcc:'603',mnc:'02',name:'Djezzy'},{mcc:'603',mnc:'03',name:'Ooredoo'},{mcc:'208',mnc:'01',name:'Orange FR'},{mcc:'208',mnc:'10',name:'SFR'},{mcc:'234',mnc:'15',name:'Vodafone UK'}];
const BANDS=['GSM 900','GSM 1800','UMTS 2100','LTE 800','LTE 1800','LTE 2600'];
let towers=[],selectedTower=null,simRunning=false,simInterval=null,animFrame=null;

function createTower(){
  const op=OPERATORS[Math.floor(Math.random()*OPERATORS.length)];
  const band=BANDS[Math.floor(Math.random()*BANDS.length)];
  const x=0.1+Math.random()*0.8,y=0.1+Math.random()*0.8;
  const dist=(Math.sqrt((x-0.5)**2+(y-0.5)**2)*10).toFixed(1);
  return{id:Math.random().toString(36).slice(2,8),cellId:Math.floor(Math.random()*65535),lac:Math.floor(1000+Math.random()*9000),mcc:op.mcc,mnc:op.mnc,operator:op.name,band,x,y,signal:-50-Math.floor(Math.random()*50),dist:parseFloat(dist),coverage:0.05+Math.random()*0.12,pulsePhase:Math.random()*Math.PI*2};
}

function simTick(){
  if(Math.random()<0.2&&towers.length<15){
    const t=createTower();towers.push(t);
    log(`${LANG[currentLang].newTower} CID:${t.cellId} ${t.operator} ${t.band} (${t.signal} dBm)`,'rx');
  }
  towers.forEach(t=>{t.signal+=(Math.random()-0.5)*3;t.signal=Math.max(-110,Math.min(-40,t.signal));t.pulsePhase+=0.05;});
  updateTowerTable();updateTowerCount();
}

function updateTowerCount(){const el=$('towerCount');if(el)el.innerHTML=`${towers.length} <span data-i18n="towersFound">${LANG[currentLang].towersFound}</span>`;}

function updateTowerTable(){
  const tbody=$('towerBody');if(!tbody)return;tbody.innerHTML='';
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  towers.forEach(t=>{
    const tr=document.createElement('tr');const isSel=selectedTower&&selectedTower.id===t.id;
    tr.style.borderBottom='1px solid rgba(255,255,255,0.05)';if(isSel)tr.style.color=accent;tr.style.cursor='pointer';
    const sColor=t.signal>-70?'#81c784':t.signal>-85?'#ffb74d':'#e57373';
    tr.innerHTML=`<td style="padding:4px 8px">${t.cellId}</td><td style="padding:4px 8px">${t.lac}</td><td style="padding:4px 8px">${t.band}</td><td style="padding:4px 8px">${t.mcc}/${t.mnc}</td><td style="padding:4px 8px;color:${sColor}">${t.signal.toFixed(0)} dBm</td><td style="padding:4px 8px">${t.dist} km</td>`;
    tr.onclick=()=>selectTower(t);tbody.appendChild(tr);
  });
}

function selectTower(t){
  selectedTower=t;const info=$('towerInfo');if(!info)return;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  info.innerHTML=`<div style="color:${accent};font-size:.9rem;font-weight:bold;margin-bottom:8px;">🗼 ${t.operator} — ${t.band}</div><div><span style="opacity:.5">Cell ID:</span> ${t.cellId}</div><div><span style="opacity:.5">LAC:</span> ${t.lac}</div><div><span style="opacity:.5">MCC/MNC:</span> ${t.mcc}/${t.mnc}</div><div><span style="opacity:.5">Signal:</span> ${t.signal.toFixed(0)} dBm</div><div><span style="opacity:.5">Distance:</span> ${t.dist} km</div><div><span style="opacity:.5">Band:</span> ${t.band}</div>`;
  log(`🗼 Selected CID:${t.cellId} ${t.operator} ${t.band}`,'info');
}

/* ======= MAP DRAWING ======= */
function drawMap(){
  const cv=$('towerMap');if(!cv)return;const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
  // Grid
  ctx.strokeStyle='rgba(100,200,255,0.04)';ctx.lineWidth=1;
  for(let i=0;i<=10;i++){const x=(i/10)*W;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();const y=(i/10)*H;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // "You" marker at center
  ctx.fillStyle='rgba(100,200,255,0.5)';ctx.beginPath();ctx.arc(W/2,H/2,5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('YOU',W/2,H/2+16);
  // Towers
  towers.forEach(t=>{
    const px=t.x*W,py=t.y*H;const isSel=selectedTower&&selectedTower.id===t.id;
    // Coverage circle (pulsing)
    const pulse=0.8+0.2*Math.sin(t.pulsePhase);
    const coverageR=t.coverage*W*pulse;
    const sColor=t.signal>-70?'rgba(129,199,132,':'rgba(255,183,77,';
    ctx.fillStyle=sColor+(isSel?'0.12)':'0.06)');ctx.beginPath();ctx.arc(px,py,coverageR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=sColor+(isSel?'0.4)':'0.15)');ctx.lineWidth=1;ctx.beginPath();ctx.arc(px,py,coverageR,0,Math.PI*2);ctx.stroke();
    // Tower icon
    ctx.fillStyle=isSel?accent:'#4fc3f7';ctx.beginPath();ctx.moveTo(px,py-12);ctx.lineTo(px-6,py+4);ctx.lineTo(px+6,py+4);ctx.closePath();ctx.fill();
    ctx.fillRect(px-1,py+4,2,6);
    // Label
    ctx.fillStyle=isSel?accent:'rgba(200,230,255,0.6)';ctx.font=isSel?'bold 9px Orbitron,monospace':'8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText(`${t.operator}`,px+10,py-4);ctx.fillStyle='rgba(200,230,255,0.3)';ctx.font='7px Orbitron,monospace';
    ctx.fillText(`CID:${t.cellId} ${t.signal.toFixed(0)}dBm`,px+10,py+6);
    // Selection ring
    if(isSel){ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(px,py,18,0,Math.PI*2);ctx.stroke();}
  });
  // Line from YOU to selected tower
  if(selectedTower){ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(W/2,H/2);ctx.lineTo(selectedTower.x*W,selectedTower.y*H);ctx.stroke();ctx.setLineDash([]);}
  ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('GSM/LTE Tower Map — grgsm_scanner sim',8,H-8);
}

function drawLoop(){if(!simRunning)return;drawMap();animFrame=requestAnimationFrame(drawLoop);}

function initMapClick(){
  const cv=$('towerMap');if(!cv)return;
  cv.addEventListener('click',e=>{const rect=cv.getBoundingClientRect();const mx=(e.clientX-rect.left)/rect.width;const my=(e.clientY-rect.top)/rect.height;let closest=null,minDist=Infinity;towers.forEach(t=>{const d=Math.hypot(t.x-mx,t.y-my);if(d<minDist){minDist=d;closest=t;}});if(closest&&minDist<0.06)selectTower(closest);});
}

function startSim(){if(simRunning)return;simRunning=true;setStatus(true);log(LANG[currentLang].scanStarted,'success');for(let i=0;i<4+Math.floor(Math.random()*4);i++)towers.push(createTower());updateTowerTable();updateTowerCount();simInterval=setInterval(simTick,2500);drawLoop();}
function stopSim(){if(!simRunning)return;simRunning=false;setStatus(false);if(simInterval){clearInterval(simInterval);simInterval=null;}if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;}log(LANG[currentLang].scanStopped,'info');}

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
  const startBtn=$('startBtn'),stopBtn=$('stopBtn');if(startBtn)startBtn.onclick=startSim;if(stopBtn)stopBtn.onclick=stopSim;
  initMapClick();drawMap();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — GSM Tower Mapper
   Signal strength heatmap + animated coverage + signal bars
   ═══════════════════════════════════════════════════════════════ */
(function(){
const SIM_ID='gsmHeatSim';let cv,cx,W,H,on=false,af=null,t=0;
const HW=64,HH=48;let heat=new Float32Array(HW*HH);
function boot(){
  let el=document.getElementById(SIM_ID);
  if(!el){el=document.createElement('canvas');el.id=SIM_ID;el.width=780;el.height=260;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#050a14;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function hcol(v){if(v<.25)return[0,0,v*4*180|0];if(v<.5){const t=(v-.25)*4;return[0,t*200|0,180];}if(v<.75){const t=(v-.5)*4;return[t*255|0,200,(1-t)*180|0];}const u=(v-.75)*4;return[255,200+u*55|0,u*100|0];}
function tick(){
  if(!on)return;t+=.016;
  for(let i=0;i<HW*HH;i++)heat[i]*=.95;
  if(typeof towers!=='undefined')towers.forEach(tw=>{
    const px=tw.x*HW|0,py=tw.y*HH|0,r=tw.coverage*HW*1.5|0,pw=(-tw.signal+40)/70;
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
      const nx=px+dx,ny=py+dy;if(nx<0||nx>=HW||ny<0||ny>=HH)continue;
      const d=Math.sqrt(dx*dx+dy*dy)/r;if(d>1)continue;
      heat[ny*HW+nx]+=pw*(1-d*d)*.12;}
  });
  for(let i=0;i<HW*HH;i++)heat[i]=Math.min(1,heat[i]);
  cx.fillStyle='#050a14';cx.fillRect(0,0,W,H);
  const cw=W/HW,ch=(H-44)/HH;
  for(let y=0;y<HH;y++)for(let x=0;x<HW;x++){
    const v=heat[y*HW+x];if(v<.01)continue;
    const[r,g,b]=hcol(v);cx.fillStyle=`rgba(${r},${g},${b},${Math.min(.8,v)})`;
    cx.fillRect(x*cw,y*ch+18,cw+1,ch+1);}
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  if(typeof towers!=='undefined'){
    const bw=Math.min(36,W/Math.max(1,towers.length)-4);
    towers.forEach((tw,i)=>{
      const bx=8+i*(bw+3),bh=Math.max(2,((tw.signal+110)/70)*28);
      cx.fillStyle=tw.signal>-70?'#81c784':tw.signal>-85?'#ffb74d':'#e57373';
      cx.fillRect(bx,H-bh-2,bw,bh);
      cx.fillStyle='rgba(255,255,255,.3)';cx.font='6px monospace';cx.textAlign='center';
      cx.fillText(tw.cellId,bx+bw/2,H-bh-4);});}
  const sx=(t*55)%W;cx.strokeStyle=acc+'55';cx.lineWidth=1;cx.beginPath();cx.moveTo(sx,18);cx.lineTo(sx,H-38);cx.stroke();
  // Radar sweep
  const rcx=W-60,rcy=50,rr=35;
  cx.strokeStyle='rgba(100,200,255,.1)';cx.beginPath();cx.arc(rcx,rcy,rr,0,Math.PI*2);cx.stroke();
  const ra=t*1.2;cx.strokeStyle=acc+'88';cx.lineWidth=2;cx.beginPath();cx.moveTo(rcx,rcy);cx.lineTo(rcx+Math.cos(ra)*rr,rcy+Math.sin(ra)*rr);cx.stroke();
  for(let i=0;i<6;i++){const a=ra-i*.15;cx.strokeStyle=`rgba(100,200,255,${.3-i*.05})`;cx.beginPath();cx.moveTo(rcx,rcy);cx.lineTo(rcx+Math.cos(a)*rr,rcy+Math.sin(a)*rr);cx.stroke();}
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='10px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Signal Heatmap — Coverage Simulation',8,13);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();on=true;tick();},600);
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
