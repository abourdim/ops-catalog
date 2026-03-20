/**
 * Workshop DIY — Cognitive EW v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}
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
    ...LANG_BASE.en,title:'Cognitive EW',subtitle:'Cognitive Electronic Warfare',disconnected:'Idle',connected:'Learning',mainSection:'Cognitive EW Engine',mainDesc:'AI-driven adaptive electronic warfare with learning algorithms',sectionA:'AI Decision Log',sectionB:'Cognitive EW Theory',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set AI learning rate and speed.',howto_2:'Configure threat environment.',howto_3:'Train the AI model first.',howto_4:'Engage Cognitive EW to adapt.',working:'Working...',ready:'Cognitive EW ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',engageCEW:'Engage Cognitive EW',disengageCEW:'Disengage',trainAI:'Train AI Model',resetSim:'Reset',aiParams:'AI Parameters',threatParams:'Threat Environment',learningRate:'Learning Rate:',adaptSpeed:'Adaptation Speed:',threatDensity:'Threat Density:',threatAgility:'Threat Agility:',cogStatus:'Cognitive Status',decisionHint:'Real-time AI decisions and adaptations.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Drone Hijacker Sim and Rfw Radar Jammer Lab! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr:{title:'GE Cognitive',subtitle:'Guerre Electronique Cognitive',disconnected:'Inactif',connected:'Apprentissage',mainSection:'Moteur GE Cognitive',mainDesc:'Guerre electronique adaptative pilotee par IA',sectionA:'Journal Decisions IA',sectionB:'Theorie GE Cognitive',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours...',ready:'GE Cognitive pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',engageCEW:'Activer GE Cognitive',disengageCEW:'Desactiver',trainAI:'Entrainer IA',resetSim:'Reinitialiser',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Drone Hijacker Sim and Rfw Radar Jammer Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u064a\u0629',subtitle:'\u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u064a\u0629',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0639\u0644\u0645',mainSection:'\u0645\u062d\u0631\u0643 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0645\u0639\u0631\u0641\u064a\u0629',mainDesc:'\u062d\u0631\u0628 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u062a\u0643\u064a\u0641\u064a\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a',sectionA:'\u0633\u062c\u0644 \u0642\u0631\u0627\u0631\u0627\u062a \u0627\u0644\u0630\u0643\u0627\u0621',sectionB:'\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0645\u0639\u0631\u0641\u064a\u0629',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062d\u0631\u0643 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',engageCEW:'\u062a\u0634\u063a\u064a\u0644',disengageCEW:'\u0625\u064a\u0642\u0627\u0641',trainAI:'\u062a\u062f\u0631\u064a\u0628 \u0627\u0644\u0630\u0643\u0627\u0621',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Drone Hijacker Sim and Rfw Radar Jammer Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cew-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ COGNITIVE EW DATA ═══════ */
let engaged=false,trained=false,time=0,epoch=0;
let threats=[],decisions=[];
let effectivenessHistory=new Array(300).fill(50);
let lossHistory=new Array(200).fill(1);
let neuralNodes=[];

function initThreats(){threats=[];const n=parseInt($('densityInput')?.value||8);for(let i=0;i<n;i++){threats.push({id:'THR-'+(i+1),freq:100+Math.random()*5800,type:['Radar','Comms','Jammer','FHSS','Burst'][Math.floor(Math.random()*5)],power:-40+Math.random()*60,agile:Math.random()>0.5,countered:false,confidence:0});}}

function initNeuralNet(){neuralNodes=[];for(let layer=0;layer<4;layer++){const n=layer===0?6:layer===3?3:8;for(let i=0;i<n;i++){neuralNodes.push({layer,idx:i,x:0,y:0,activation:Math.random(),connections:[]});}}}

function drawCognitive(){
  const c=$('cogCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Left side: threat environment spectrum
  const specW=W*0.5;
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('THREAT ENVIRONMENT',10,16);
  // Noise floor
  ctx.beginPath();for(let x=0;x<specW;x++){let y=H*0.7+Math.random()*8;threats.forEach(t=>{const tx=(t.freq/6000)*specW;if(Math.abs(x-tx)<10)y-=((t.power+40)/100)*H*0.3;});if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=1;ctx.stroke();
  // Threat markers
  threats.forEach(t=>{
    const tx=(t.freq/6000)*specW;const ty=H*0.7-((t.power+40)/100)*H*0.3;
    ctx.beginPath();ctx.arc(tx,ty,t.countered?4:6,0,Math.PI*2);
    ctx.fillStyle=t.countered?'rgba(0,255,136,0.7)':'rgba(255,50,50,0.8)';ctx.fill();
    if(engaged&&!t.countered){ctx.beginPath();ctx.arc(tx,ty,10+Math.sin(time*4)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=1;ctx.stroke();}
    ctx.fillStyle=t.countered?'#00ff88':'#ff6666';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(t.type,tx,ty-10);
  });
  // AI response beams
  if(engaged){threats.forEach(t=>{if(t.countered){const tx=(t.freq/6000)*specW;const ty=H*0.7-((t.power+40)/100)*H*0.3;ctx.beginPath();ctx.moveTo(tx,H);ctx.lineTo(tx,ty);ctx.strokeStyle='rgba(0,255,136,0.3)';ctx.lineWidth=3;ctx.stroke();}});}

  // Right side: neural network visualization
  const nnX=specW+40;const nnW=W-nnX-20;
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('NEURAL NETWORK',nnX,16);
  const layers=[6,8,8,3];const layerLabels=['Input','Hidden 1','Hidden 2','Output'];
  layers.forEach((n,l)=>{
    const lx=nnX+l*(nnW/(layers.length-1));
    ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(layerLabels[l],lx,H-5);
    for(let i=0;i<n;i++){
      const ly=40+i*(H-60)/n;
      const activation=engaged?0.3+Math.random()*0.7:0.2;
      // Connections to next layer
      if(l<layers.length-1){const nextN=layers[l+1];for(let j=0;j<nextN;j++){const nx=nnX+(l+1)*(nnW/(layers.length-1));const ny=40+j*(H-60)/nextN;const w=engaged?Math.random():0.1;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(nx,ny);ctx.strokeStyle='rgba(0,200,255,'+(w*0.3)+')';ctx.lineWidth=w*2;ctx.stroke();}}
      ctx.beginPath();ctx.arc(lx,ly,5+activation*4,0,Math.PI*2);
      const g=Math.floor(activation*255);
      ctx.fillStyle='rgba('+Math.floor(g*0.3)+','+g+','+(255-g)+','+(0.4+activation*0.5)+')';ctx.fill();
      ctx.strokeStyle='rgba(0,200,255,0.4)';ctx.lineWidth=1;ctx.stroke();
    }
  });
  if(engaged){ctx.fillStyle='rgba(0,255,136,0.7)';ctx.fillText('EPOCH: '+epoch,nnX+nnW/2,30);}
}

function drawLearning(){
  const c=$('learnCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Effectiveness curve (left half)
  const halfW=W/2;
  const lr=parseInt($('lrInput')?.value||50)/100;
  if(engaged){const eff=Math.min(99,effectivenessHistory[effectivenessHistory.length-1]+lr*2+Math.random()*3-1);effectivenessHistory.push(eff);if(effectivenessHistory.length>300)effectivenessHistory.shift();}
  ctx.beginPath();effectivenessHistory.forEach((v,i)=>{const x=i*(halfW/300);const y=H-10-v/100*H*0.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,255,136,0.7)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('EFFECTIVENESS %',5,14);
  // Loss curve (right half)
  if(engaged){const loss=Math.max(0.01,lossHistory[lossHistory.length-1]-lr*0.005+Math.random()*0.01-0.005);lossHistory.push(loss);if(lossHistory.length>200)lossHistory.shift();}
  ctx.beginPath();lossHistory.forEach((v,i)=>{const x=halfW+20+i*((halfW-20)/200);const y=H-10-v*H*0.7;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,200,0,0.7)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('TRAINING LOSS',halfW+25,14);
}

function animate(){
  time+=0.016;
  if(engaged){
    epoch++;
    const lr=parseInt($('lrInput')?.value||50)/100;const adapt=parseInt($('adaptInput')?.value||70)/100;
    threats.forEach(t=>{
      if(!t.countered){t.confidence+=lr*adapt*0.5+Math.random()*0.3;if(t.confidence>60+Math.random()*30){t.countered=true;const actions=['Spot jamming','Null steering','Frequency hopping','Waveform adaptation','Power adjustment'];const action=actions[Math.floor(Math.random()*actions.length)];decisions.unshift({time:new Date().toLocaleTimeString(),threat:t.id,action,confidence:t.confidence.toFixed(0)});if(decisions.length>30)decisions.pop();log('AI: '+action+' on '+t.id+' ('+t.type+') — confidence '+t.confidence.toFixed(0)+'%','success');}}
      if(t.agile&&t.countered&&Math.random()>0.998){t.countered=false;t.confidence=0;t.freq=100+Math.random()*5800;log('THREAT '+t.id+' adapted — changing frequency','error');}
    });
  }
  drawCognitive();drawLearning();updateStats();requestAnimationFrame(animate);
}

function updateStats(){const stats=$('cogStats');if(!stats)return;const countered=threats.filter(t=>t.countered).length;const eff=effectivenessHistory[effectivenessHistory.length-1];stats.innerHTML='<b>Threats:</b> '+threats.length+' ('+countered+' countered)<br><b>Effectiveness:</b> '+eff.toFixed(0)+'%<br><b>Epoch:</b> '+epoch+'<br><b>Trained:</b> '+(trained?'<span style="color:#00ff88">YES</span>':'<span style="color:#888">NO</span>')+'<br><b>Status:</b> '+(engaged?'<span style="color:#00ff88">ENGAGED</span>':'<span style="color:#888">STANDBY</span>');}
function updateDecisionList(){const lib=$('decisionList');if(!lib)return;lib.innerHTML='';decisions.slice(0,15).forEach(d=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:rgba(0,255,136,0.05)';row.innerHTML='<span style="color:#00ff88">'+d.threat+'</span><span>'+d.action+'</span><span>'+d.confidence+'%</span><span style="color:#888">'+d.time+'</span>';lib.appendChild(row);});}
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Cognitive EW:</b> AI systems that sense, learn, and adapt to the EM environment.','<b>Reinforcement Learning:</b> AI learns optimal jamming strategies through trial and error.','<b>Waveform Synthesis:</b> Generating optimal countermeasure waveforms in real-time.','<b>Threat Classification:</b> Neural networks identify and categorize emitter types.','<b>Adaptive Response:</b> Automatically adjusting power, frequency, and technique.','<b>Adversarial Learning:</b> Both attacker and defender AI evolve simultaneously.'].join('<br><br>');}

function initControls(){
  $('lrInput').oninput=()=>{$('lrLabel').textContent=$('lrInput').value+'%';};
  $('adaptInput').oninput=()=>{$('adaptLabel').textContent=$('adaptInput').value+'%';};
  $('densityInput').oninput=()=>{$('densityLabel').textContent=$('densityInput').value;};
  $('agilityInput').oninput=()=>{$('agilityLabel').textContent=$('agilityInput').value+'%';};
  $('engageBtn').onclick=()=>{if(!trained){showToast('Train AI model first!',1500);return;}engaged=!engaged;setStatus(engaged);$('engageBtn').querySelector('[data-i18n]').textContent=engaged?LANG[currentLang].disengageCEW:LANG[currentLang].engageCEW;log(engaged?'Cognitive EW ENGAGED — AI adapting to threats':'Cognitive EW DISENGAGED',engaged?'success':'info');if(engaged)showToast('AI engaged...',2000);};
  $('trainBtn').onclick=()=>{showToast('Training neural network...',2500);setTimeout(()=>{trained=true;lossHistory=new Array(200).fill(1);for(let i=0;i<200;i++)lossHistory[i]=Math.max(0.05,1-i*0.004+Math.random()*0.05);log('AI model trained — '+200+' epochs, loss: '+lossHistory[lossHistory.length-1].toFixed(3),'success');hideToast();},2500);};
  $('resetBtn').onclick=()=>{engaged=false;trained=false;epoch=0;decisions=[];effectivenessHistory=new Array(300).fill(50);lossHistory=new Array(200).fill(1);setStatus(false);initThreats();$('engageBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].engageCEW;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initThreats();initNeuralNet();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateDecisionList,1000);
});

/* ═══════ ENHANCED RF CANVAS — COGNITIVE EW ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _rewardHistory=new Array(200).fill(0);let _qTable=[];
let _explorationRate=new Array(200).fill(1);let _strategyMatrix=[];
let _spectrumMemory=[];let _actionLog=[];

/* ── Q-Learning Value Function Heatmap ── */
function drawQValueHeatmap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('Q-VALUE FUNCTION HEATMAP',5,12);
  const isEng=typeof engaged!=='undefined'&&engaged;
  const states=12;const actions=8;const cellW=Math.min(30,(W-60)/actions);const cellH=Math.min(18,(H-35)/states);
  const actionLabels=['Spot','Barrage','Sweep','Null','Hop','Pulse','Adapt','Wait'];
  for(let s=0;s<states;s++){for(let a=0;a<actions;a++){
    const x=50+a*cellW;const y=25+s*cellH;
    let q=isEng?Math.sin(s*0.5+a*0.7+_t*0.1)*0.5+Math.random()*0.3:Math.random()*0.2-0.1;
    const norm=(q+1)/2;
    const r=norm<0.5?0:Math.floor((norm-0.5)*2*255);
    const g=norm>0.5?Math.floor((1-norm)*2*200):Math.floor(norm*2*200);
    const b=norm<0.3?Math.floor((0.3-norm)*3*200):0;
    ctx.fillStyle='rgba('+r+','+g+','+b+',0.6)';
    ctx.fillRect(x,y,cellW-1,cellH-1);
    if(cellW>15){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='5px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(q.toFixed(1),x+cellW/2,y+cellH/2+2);}
  }
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='6px Orbitron,monospace';ctx.textAlign='right';ctx.fillText('S'+s,48,25+s*cellH+cellH/2+2);}
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';
  actionLabels.forEach((l,i)=>{ctx.save();ctx.translate(50+i*cellW+cellW/2,23);ctx.rotate(-0.5);ctx.fillText(l,0,0);ctx.restore();});
}

/* ── Reward Accumulation Graph ── */
function drawRewardGraph(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CUMULATIVE REWARD',5,12);
  const isEng=typeof engaged!=='undefined'&&engaged;
  const lr=parseInt(_$('lrInput')?.value||50)/100;
  const reward=isEng?lr*2+Math.random()*3-0.5:0;
  _rewardHistory.push((_rewardHistory[_rewardHistory.length-1]||0)+reward);
  if(_rewardHistory.length>200)_rewardHistory.shift();
  const maxR=Math.max(1,..._rewardHistory.map(Math.abs));
  ctx.beginPath();
  _rewardHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H/2-(v/maxR)*(H/2-15);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,255,136,0.7)';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.stroke();
  const last=_rewardHistory[_rewardHistory.length-1];
  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText((last>0?'+':'')+last.toFixed(0),W-10,25);
}

/* ── Exploration vs Exploitation Indicator ── */
function drawExplorationRate(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('EXPLORATION vs EXPLOITATION (ε)',5,12);
  const isEng=typeof engaged!=='undefined'&&engaged;
  const ep=typeof epoch!=='undefined'?epoch:0;
  const epsilon=isEng?Math.max(0.05,1-ep*0.0005):1;
  _explorationRate.push(epsilon);if(_explorationRate.length>200)_explorationRate.shift();
  // Background zones
  ctx.fillStyle='rgba(255,200,0,0.04)';ctx.fillRect(0,20,W,(H-30)*0.5);
  ctx.fillStyle='rgba(0,200,255,0.04)';ctx.fillRect(0,20+(H-30)*0.5,W,(H-30)*0.5);
  ctx.fillStyle='rgba(255,200,0,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText('EXPLORE',W-5,30);ctx.fillStyle='rgba(0,200,255,0.3)';ctx.fillText('EXPLOIT',W-5,H-10);
  ctx.beginPath();
  _explorationRate.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,200,0,0.7)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(255,200,0,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText('ε='+epsilon.toFixed(3),W-10,H/2);
}

/* ── Strategy Evolution Diagram ── */
function drawStrategyEvolution(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('STRATEGY EVOLUTION',5,12);
  const isEng=typeof engaged!=='undefined'&&engaged;
  const strategies=['Spot Jam','Barrage','Sweep','Null Steer','Freq Hop','Adaptive'];
  const barH=Math.min(18,(H-25)/strategies.length);
  strategies.forEach((s,i)=>{
    const y=22+i*barH;
    let usage=isEng?20+Math.sin(_t*0.3+i*0.8)*15+Math.random()*10:10+Math.random()*5;
    if(isEng&&i===Math.floor(_t*0.2)%strategies.length)usage+=30;
    const barW=(usage/100)*(W-100);
    const colors=['rgba(255,80,80,0.5)','rgba(255,200,0,0.5)','rgba(0,200,255,0.5)','rgba(200,100,255,0.5)','rgba(0,255,136,0.5)','rgba(255,150,50,0.5)'];
    ctx.fillStyle=colors[i];ctx.fillRect(90,y,barW,barH-3);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText(s,88,y+barH/2);
    ctx.textAlign='left';ctx.fillText(usage.toFixed(0)+'%',92+barW,y+barH/2);
  });
}

/* ── Threat Adaptation Timeline ── */
function drawAdaptationTimeline(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('THREAT ADAPTATION CYCLES',5,12);
  const isEng=typeof engaged!=='undefined'&&engaged;
  if(!isEng){ctx.fillStyle='rgba(100,100,100,0.3)';ctx.font='11px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('ENGAGE TO VIEW',W/2,H/2);return;}
  if(typeof threats!=='undefined'){
    const barW=Math.max(10,(W-20)/threats.length-4);
    threats.forEach((t,i)=>{
      const x=10+i*(barW+4);
      // Confidence fill
      const confH=(t.confidence/100)*(H-35);
      ctx.fillStyle=t.countered?'rgba(0,200,100,0.4)':'rgba(255,80,80,0.3)';
      ctx.fillRect(x,H-10-confH,barW,confH);
      ctx.strokeStyle=t.countered?'rgba(0,200,100,0.6)':'rgba(255,80,80,0.5)';
      ctx.lineWidth=1;ctx.strokeRect(x,H-10-confH,barW,confH);
      // Threat type label
      ctx.fillStyle=t.countered?'#00ff88':'#ff6666';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(t.id,x+barW/2,H-2);
      ctx.fillText(t.type.slice(0,4),x+barW/2,25);
      // Agile indicator
      if(t.agile){ctx.fillStyle='rgba(255,200,0,0.6)';ctx.fillText('⟳',x+barW/2,35);}
    });
  }
}

/* ── Spectrum Awareness Memory ── */
function drawSpectrumMemory(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SPECTRUM AWARENESS MEMORY',5,12);
  const isEng=typeof engaged!=='undefined'&&engaged;
  // Memory buffer
  if(isEng){
    const row=new Uint8Array(W);
    for(let x=0;x<W;x++){
      let v=Math.random()*15;
      if(typeof threats!=='undefined')threats.forEach(t=>{const tx=(t.freq/6000)*W;if(Math.abs(x-tx)<10)v+=50+Math.random()*30;});
      row[x]=Math.min(255,v);
    }
    _spectrumMemory.unshift(row);if(_spectrumMemory.length>60)_spectrumMemory.pop();
  }
  const rowH=(H-20)/Math.max(_spectrumMemory.length,1);
  _spectrumMemory.forEach((r,ri)=>{
    for(let x=0;x<W;x+=3){const v=r[x];
      const g=Math.min(255,v*2);const b=v<100?v:0;
      ctx.fillStyle='rgba(0,'+g+','+b+','+(0.3+v/255*0.5)+')';
      ctx.fillRect(x,20+ri*rowH,3,rowH);}
  });
  if(!isEng){ctx.fillStyle='rgba(100,100,100,0.3)';ctx.font='11px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('NO MEMORY DATA',W/2,H/2);}
}

function enhancedRender(){
  _t+=0.016;
  const cc=_$('cogCanvas');
  if(cc){const ctx=cc.getContext('2d');
    drawStrategyEvolution(ctx,cc.width,cc.height);}
  const lc=_$('learnCanvas');
  if(lc){const ctx=lc.getContext('2d');const W=lc.width,H=lc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawRewardGraph(ctx,W,H*0.5);
    ctx.save();ctx.translate(0,H*0.5);drawExplorationRate(ctx,W,H*0.5);ctx.restore();}
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
