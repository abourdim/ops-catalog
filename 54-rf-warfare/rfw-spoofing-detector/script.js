/**
 * Workshop DIY — Spoofing Detector v1.2
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];

/* ═══════ SOUND ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}

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
  en:{
    ...LANG_BASE.en,title:'Spoofing Detector',subtitle:'Spoofing Detector',disconnected:'Idle',connected:'Scanning',mainSection:'Spoofing Detector',mainDesc:'Detect RF signal anomalies and spoofing attacks',sectionA:'Threat Alerts',sectionB:'Detection Methods',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set detection sensitivity.',howto_2:'Optionally inject a spoof type.',howto_3:'Click Start Scanning.',howto_4:'Run Deep Analysis for detailed report.',working:'Working...',ready:'Spoofing Detector ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startScan:'Start Scanning',stopScan:'Stop Scanning',deepAnalysis:'Deep Analysis',resetSim:'Reset',scanParams:'Scan Parameters',simParams:'Simulation',sensitivity:'Sensitivity:',threshold:'Threshold (dB):',spoofType:'Inject Spoof Type:',spoofStrength:'Spoof Strength:',detectorStatus:'Detector Status',alertHint:'Detected spoofing threats and anomalies.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Comms Interception Hub and Rfw Radar Jammer Lab! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr:{
    ...LANG_BASE.fr,title:'Detecteur de Spoofing',subtitle:'Detecteur de Spoofing',disconnected:'Inactif',connected:'Analyse',mainSection:'Detecteur de Spoofing',mainDesc:'Detecter les anomalies RF et attaques de spoofing',sectionA:'Alertes Menaces',sectionB:'Methodes de Detection',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Definir la sensibilite.',howto_2:'Injecter un type de spoof.',howto_3:'Cliquer Demarrer.',howto_4:'Lancer Analyse Profonde.',working:'En cours...',ready:'Detecteur pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startScan:'Demarrer Scan',stopScan:'Arreter Scan',deepAnalysis:'Analyse Profonde',resetSim:'Reinitialiser',scanParams:'Parametres Scan',simParams:'Simulation',sensitivity:'Sensibilite:',threshold:'Seuil (dB):',spoofType:'Type de Spoof:',spoofStrength:'Force du Spoof:',detectorStatus:'Statut Detecteur',alertHint:'Menaces detectees.',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Comms Interception Hub and Rfw Radar Jammer Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{
    ...LANG_BASE.ar,title:'\u0643\u0627\u0634\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',subtitle:'\u0643\u0627\u0634\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0641\u062d\u0635',mainSection:'\u0643\u0627\u0634\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',mainDesc:'\u0643\u0634\u0641 \u0634\u0630\u0648\u0630 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0648\u0647\u062c\u0645\u0627\u062a \u0627\u0644\u062a\u0632\u064a\u064a\u0641',sectionA:'\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0627\u0644\u062a\u0647\u062f\u064a\u062f',sectionB:'\u0637\u0631\u0642 \u0627\u0644\u0643\u0634\u0641',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0643\u0627\u0634\u0641 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startScan:'\u0628\u062f\u0621 \u0627\u0644\u0641\u062d\u0635',stopScan:'\u0625\u064a\u0642\u0627\u0641',deepAnalysis:'\u062a\u062d\u0644\u064a\u0644 \u0639\u0645\u064a\u0642',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',scanParams:'\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u0641\u062d\u0635',simParams:'\u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629',sensitivity:'\u0627\u0644\u062d\u0633\u0627\u0633\u064a\u0629:',threshold:'\u0627\u0644\u0639\u062a\u0628\u0629:',spoofType:'\u0646\u0648\u0639 \u0627\u0644\u062a\u0632\u064a\u064a\u0641:',spoofStrength:'\u0642\u0648\u0629 \u0627\u0644\u062a\u0632\u064a\u064a\u0641:',detectorStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u0643\u0627\u0634\u0641',alertHint:'\u062a\u0647\u062f\u064a\u062f\u0627\u062a \u0645\u0643\u062a\u0634\u0641\u0629.',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Comms Interception Hub and Rfw Radar Jammer Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG / TOAST / STATUS / SPLASH ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='spoof-det-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS / PANELS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ DETECTOR DATA ═══════ */
let scanning = false;
let time = 0;
let alerts = [];
let signalHistory = new Array(300).fill(0);
let anomalyHistory = new Array(300).fill(0);
let alertId = 0;

/* ═══════ DETECTOR CANVAS ═══════ */
function drawDetector(){
  const c=$('detectorCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  const sensitivity=parseInt($('sensitivityInput')?.value||70);
  const threshold=parseInt($('thresholdInput')?.value||10);
  const spoofType=$('spoofTypeSelect')?.value||'none';
  const strength=parseInt($('spoofStrength')?.value||50);

  // Grid
  for(let i=0;i<=10;i++){const x=i*W/10;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.lineWidth=1;ctx.stroke();}
  for(let i=0;i<=6;i++){const y=i*H/6;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();}

  // Generate signal with spoof injection
  let newSig = -60 + Math.random()*5;
  let anomaly = Math.random()*2;
  if(scanning && spoofType!=='none'){
    const s = strength/100;
    if(spoofType==='gps'){newSig+= s*25+Math.random()*10;anomaly+=s*15+Math.random()*5;}
    else if(spoofType==='wifi'){newSig+= s*20*Math.sin(time*2);anomaly+=s*10+Math.random()*8;}
    else if(spoofType==='replay'){newSig+= s*15*(Math.sin(time*5)>0?1:0);anomaly+=s*20*(Math.sin(time*5)>0?1:0);}
    else if(spoofType==='meaconing'){newSig+= s*18+Math.sin(time*0.5)*5;anomaly+=s*12+Math.random()*3;}
  }
  signalHistory.push(newSig);if(signalHistory.length>300)signalHistory.shift();
  anomalyHistory.push(anomaly);if(anomalyHistory.length>300)anomalyHistory.shift();

  // Draw signal
  ctx.beginPath();
  signalHistory.forEach((v,i)=>{const x=i*(W/300);const y=H*0.4-(v+60)/80*H*0.35;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=2;ctx.stroke();

  // Draw anomaly score
  ctx.beginPath();
  anomalyHistory.forEach((v,i)=>{const x=i*(W/300);const y=H-20-v/30*H*0.4;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,200,0,0.7)';ctx.lineWidth=2;ctx.stroke();

  // Threshold line
  const threshY=H-20-(threshold*sensitivity/100)/30*H*0.4;
  ctx.beginPath();ctx.moveTo(0,threshY);ctx.lineTo(W,threshY);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,50,50,0.5)';ctx.font='9px Orbitron,monospace';ctx.textAlign='right';ctx.fillText('ALERT THRESHOLD',W-5,threshY-5);

  // Alert when anomaly exceeds threshold
  if(scanning && anomaly>threshold*sensitivity/100*0.3 && Math.random()>0.95){
    alertId++;
    const a = {id:'ALT-'+alertId,type:spoofType!=='none'?spoofType:'noise',confidence:(50+anomaly*2+Math.random()*20).toFixed(1),time:new Date().toLocaleTimeString()};
    alerts.unshift(a);if(alerts.length>20)alerts.pop();
    log('ALERT: '+a.type.toUpperCase()+' anomaly detected — confidence '+a.confidence+'%','error');
  }

  // Scanning sweep line
  if(scanning){
    const sweepX=(time*80)%W;
    ctx.beginPath();ctx.moveTo(sweepX,0);ctx.lineTo(sweepX,H);ctx.strokeStyle='rgba(0,255,136,0.3)';ctx.lineWidth=1;ctx.stroke();
  }

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SIGNAL MONITOR',10,18);
  ctx.fillStyle='rgba(255,200,0,0.5)';ctx.fillText('ANOMALY SCORE',10,H-5);
  if(scanning){ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fillText('SCANNING...',W-120,18);}
}

/* ═══════ ANOMALY CANVAS ═══════ */
function drawAnomalyView(){
  const c=$('anomalyCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Radar-style display
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();

  // Sweep
  if(scanning){
    const angle=time*1.5;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);
    ctx.strokeStyle='rgba(0,255,136,0.6)';ctx.lineWidth=2;ctx.stroke();
    // Sweep glow
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle-0.3,angle);ctx.closePath();
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    grad.addColorStop(0,'rgba(0,255,136,0.15)');grad.addColorStop(1,'rgba(0,255,136,0)');
    ctx.fillStyle=grad;ctx.fill();
  }

  // Plot anomaly blips
  const spoofType=$('spoofTypeSelect')?.value||'none';
  if(scanning&&spoofType!=='none'){
    const strength=parseInt($('spoofStrength')?.value||50)/100;
    for(let i=0;i<3;i++){
      const angle=Math.random()*Math.PI*2;
      const dist=0.3+Math.random()*0.5;
      const bx=cx+Math.cos(angle)*dist*R;
      const by=cy+Math.sin(angle)*dist*R;
      const size=3+strength*5+Math.random()*3;
      ctx.beginPath();ctx.arc(bx,by,size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,50,50,'+(0.3+strength*0.5)+')';ctx.fill();
    }
  }

  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ANOMALY RADAR',10,14);
}

/* ═══════ ANIMATION ═══════ */
function animate(){time+=0.016;drawDetector();drawAnomalyView();updateStats();requestAnimationFrame(animate);}

function updateStats(){
  const stats=$('detectorStats');if(!stats)return;
  const spoofType=$('spoofTypeSelect')?.value||'none';
  const lastAnomaly=anomalyHistory[anomalyHistory.length-1];
  stats.innerHTML='<b>Mode:</b> '+(scanning?'SCANNING':'STANDBY')+'<br><b>Spoof:</b> '+spoofType.toUpperCase()+'<br><b>Anomaly:</b> '+lastAnomaly.toFixed(1)+'<br><b>Alerts:</b> '+alerts.length+'<br><b>Status:</b> '+(lastAnomaly>10?'<span style="color:#ff4444">THREAT</span>':'<span style="color:#00cc88">CLEAN</span>');
}

function updateAlertList(){
  const lib=$('alertList');if(!lib)return;lib.innerHTML='';
  alerts.slice(0,15).forEach(a=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:rgba(255,50,50,0.1)';
    row.innerHTML='<span style="color:#ff6666">'+a.id+'</span><span>'+a.type.toUpperCase()+'</span><span>'+a.confidence+'%</span><span style="color:#888">'+a.time+'</span>';
    lib.appendChild(row);
  });
}

function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Power Analysis:</b> Detect abnormally strong signals vs expected levels.','<b>Timing Analysis:</b> Check for propagation delay inconsistencies.','<b>Direction Finding:</b> Verify signal arrival angles match expected sources.','<b>Consistency Check:</b> Cross-reference multiple signal parameters.','<b>Cryptographic Auth:</b> Verify signal authentication signatures.','<b>Machine Learning:</b> Pattern recognition for known spoof signatures.'].join('<br><br>');}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('sensitivityInput').oninput=()=>{$('sensitivityLabel').textContent=$('sensitivityInput').value+'%';};
  $('thresholdInput').oninput=()=>{$('thresholdLabel').textContent=$('thresholdInput').value+' dB';};
  $('spoofStrength').oninput=()=>{$('spoofStrengthLabel').textContent=$('spoofStrength').value+'%';};

  $('scanBtn').onclick=()=>{
    scanning=!scanning;setStatus(scanning);
    $('scanBtn').querySelector('[data-i18n]').textContent=scanning?LANG[currentLang].stopScan:LANG[currentLang].startScan;
    log(scanning?'Scanning STARTED':'Scanning STOPPED',scanning?'rx':'info');
    if(scanning)showToast('Scanning...',2000);
  };
  $('analyzeBtn').onclick=()=>{
    showToast('Deep analysis in progress...',2500);
    setTimeout(()=>{
      const spoofType=$('spoofTypeSelect')?.value||'none';
      if(spoofType!=='none'){
        const conf=(60+Math.random()*35).toFixed(1);
        log('DEEP ANALYSIS: '+spoofType.toUpperCase()+' spoofing confirmed at '+conf+'% confidence','error');
      } else {log('DEEP ANALYSIS: No spoofing detected. Environment clean.','success');}
      hideToast();
    },2500);
  };
  $('resetBtn').onclick=()=>{scanning=false;alerts=[];signalHistory=new Array(300).fill(0);anomalyHistory=new Array(300).fill(0);setStatus(false);$('scanBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startScan;log('Reset complete','info');playSound('click');};
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateAlertList,1000);
});

/* ═══════ ENHANCED RF CANVAS — SPOOFING DETECTOR ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _directionData=new Array(360).fill(0);let _confHistory=new Array(200).fill(0);
let _signatureLib=[];let _corrMatrix=[];

/* ── Direction of Arrival Analysis ── */
function drawDOA(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DIRECTION OF ARRIVAL ANALYSIS',5,12);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-25;
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();}
  const isScan=typeof scanning!=='undefined'&&scanning;
  const spoofType=_$('spoofTypeSelect')?.value||'none';
  // Update DOA data
  for(let i=0;i<360;i++){
    let level=-80+Math.random()*3;
    if(isScan){
      [45,120,200,280,330].forEach(sat=>{if(Math.abs(i-sat)<15)level+=20+Math.random()*5;});
      if(spoofType!=='none'){const spoofDir=150+Math.sin(_t)*20;if(Math.abs(i-spoofDir)<25)level+=30+Math.random()*10;}
    }
    _directionData[i]=_directionData[i]*0.9+level*0.1;
  }
  // Draw polar plot
  ctx.beginPath();
  for(let i=0;i<360;i++){
    const a=i*Math.PI/180-Math.PI/2;const r=Math.max(0,(_directionData[i]+85)/50)*R;
    const px=cx+Math.cos(a)*r;const py=cy+Math.sin(a)*r;
    if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.fillStyle='rgba(0,200,255,0.1)';ctx.fill();
  ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=1;ctx.stroke();
  // Spoof indicator
  if(isScan&&spoofType!=='none'){
    const spoofDir=(150+Math.sin(_t)*20)*Math.PI/180-Math.PI/2;
    const sr=R*0.8;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(spoofDir)*sr,cy+Math.sin(spoofDir)*sr);
    ctx.strokeStyle='rgba(255,50,50,0.7)';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='8px Orbitron,monospace';
    ctx.fillText('SPOOF',cx+Math.cos(spoofDir)*sr,cy+Math.sin(spoofDir)*sr-8);
  }
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-R-5);ctx.fillText('S',cx,cy+R+10);ctx.fillText('E',cx+R+8,cy+3);ctx.fillText('W',cx-R-8,cy+3);
}

/* ── Confidence Level Timeline ── */
function drawConfidenceTimeline(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DETECTION CONFIDENCE TIMELINE',5,12);
  const isScan=typeof scanning!=='undefined'&&scanning;
  const spoofType=_$('spoofTypeSelect')?.value||'none';
  const strength=parseInt(_$('spoofStrength')?.value||50)/100;
  let conf=0;
  if(isScan&&spoofType!=='none')conf=40+strength*50+Math.random()*10;
  else if(isScan)conf=Math.random()*8;
  _confHistory.push(conf);if(_confHistory.length>200)_confHistory.shift();
  // Color zones
  ctx.fillStyle='rgba(255,50,50,0.05)';ctx.fillRect(0,20,W,(H-30)*0.3);
  ctx.fillStyle='rgba(255,200,0,0.05)';ctx.fillRect(0,20+(H-30)*0.3,W,(H-30)*0.3);
  ctx.fillStyle='rgba(0,200,100,0.05)';ctx.fillRect(0,20+(H-30)*0.6,W,(H-30)*0.4);
  // Labels
  ctx.fillStyle='rgba(255,50,50,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText('CRITICAL',W-5,30);ctx.fillStyle='rgba(255,200,0,0.3)';ctx.fillText('WARNING',W-5,30+(H-30)*0.3);
  ctx.fillStyle='rgba(0,200,100,0.3)';ctx.fillText('NORMAL',W-5,30+(H-30)*0.6);
  // Line
  ctx.beginPath();
  _confHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=conf>60?'rgba(255,50,50,0.8)':conf>30?'rgba(255,200,0,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=2;ctx.stroke();
}

/* ── Multi-Parameter Correlation Grid ── */
function drawCorrelationGrid(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('MULTI-PARAMETER ANOMALY CORRELATION',5,12);
  const params=['Power','Timing','DoA','C/No','Doppler','Code Phase'];
  const n=params.length;const cellW=Math.min(50,(W-60)/n);const cellH=Math.min(22,(H-40)/n);
  const isScan=typeof scanning!=='undefined'&&scanning;
  const spoofType=_$('spoofTypeSelect')?.value||'none';
  params.forEach((pa,i)=>{
    params.forEach((pb,j)=>{
      const x=50+j*cellW;const y=30+i*cellH;
      let corr=i===j?1:Math.random()*0.3;
      if(isScan&&spoofType!=='none'&&i<4&&j<4)corr=0.5+Math.random()*0.5;
      ctx.fillStyle=corr>0.7?'rgba(255,50,50,0.5)':corr>0.4?'rgba(255,200,0,0.3)':'rgba(0,200,255,0.15)';
      ctx.fillRect(x,y,cellW-2,cellH-2);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(corr.toFixed(1),x+cellW/2,y+cellH/2+2);
    });
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText(params[i],48,30+i*cellH+cellH/2+3);
    ctx.textAlign='center';ctx.fillText(params[i],50+i*cellW+cellW/2,28);
  });
}

/* ── Signal Authentication Status ── */
function drawAuthStatus(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SIGNAL AUTHENTICATION STATUS',5,12);
  const isScan=typeof scanning!=='undefined'&&scanning;
  const spoofType=_$('spoofTypeSelect')?.value||'none';
  const checks=[{name:'OSNMA Signature',pass:spoofType==='none'},{name:'Time Consistency',pass:spoofType!=='replay'},{name:'Power Level Check',pass:spoofType==='none'},{name:'Doppler Verification',pass:spoofType!=='meaconing'&&spoofType!=='gps'},{name:'Code Phase Alignment',pass:spoofType==='none'},{name:'Clock Drift Pattern',pass:spoofType!=='wifi'},{name:'Navigation Message Auth',pass:spoofType==='none'},{name:'Cross-Satellite Check',pass:Math.random()>0.3||spoofType==='none'}];
  checks.forEach((chk,i)=>{
    const y=25+i*20;const pass=!isScan||chk.pass;
    ctx.fillStyle=pass?'rgba(0,200,100,0.1)':'rgba(255,50,50,0.15)';ctx.fillRect(5,y,W-10,17);
    ctx.fillStyle=pass?'rgba(0,200,100,0.7)':'rgba(255,50,50,0.7)';ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText((pass?'✓':'✗')+' '+chk.name,10,y+12);
    ctx.textAlign='right';ctx.fillText(pass?'PASS':'FAIL',W-10,y+12);
  });
}

function enhancedRender(){
  _t+=0.016;
  const dc=_$('detectorCanvas');
  if(dc){const ctx=dc.getContext('2d');drawDOA(ctx,dc.width,dc.height);}
  const ac=_$('anomalyCanvas');
  if(ac){const ctx=ac.getContext('2d');const W=ac.width,H=ac.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawConfidenceTimeline(ctx,W,H);}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
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
