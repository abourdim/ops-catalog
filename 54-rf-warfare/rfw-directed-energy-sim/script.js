/**
 * Workshop DIY — Directed Energy Sim v1.2
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
    ...LANG_BASE.en,title:'Directed Energy Sim',subtitle:'Directed Energy Simulator',disconnected:'Idle',connected:'FIRING',mainSection:'Directed Energy Simulator',mainDesc:'High-power RF beam simulation and phased array steering',sectionA:'Target Tracking',sectionB:'DEW Technology',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set beam angle and width.',howto_2:'Configure power and frequency.',howto_3:'Click Fire Beam to engage.',howto_4:'Use Auto-Track for moving targets.',working:'Working...',ready:'DEW Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',fireBeam:'Fire Beam',ceaseBeam:'Cease Fire',autoTrack:'Auto-Track',resetSim:'Reset',beamParams:'Beam Parameters',powerParams:'Power Settings',beamAngle:'Beam Angle:',beamWidth:'Beam Width:',outputPower:'Output (kW):',frequency:'Frequency (GHz):',engStatus:'Engagement Status',targetHint:'Tracked targets and engagement data.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Directed Energy Sim?',faq_a1:'Directed Energy Sim lets you high-power rf beam simulation and phased array steering. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you scan the electromagnetic spectrum to identify hostile rf emissions. Then you analyze the threat signal: frequency, power, modulation, and direction.',faq_q3:'What do the controls do?',faq_a3:'Set beam angle and width. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real electronic warfare principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Directed Energy Sim! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Set beam angle and width. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Target Tracking" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how electronic warfare works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Target Tracking" and "DEW Technology" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Sim Energie Dirigee',subtitle:'Simulateur Energie Dirigee',disconnected:'Inactif',connected:'TIR',mainSection:'Simulateur Energie Dirigee',mainDesc:'Simulation faisceau RF haute puissance',sectionA:'Suivi Cibles',sectionB:'Technologie AED',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Regler angle et largeur.',howto_2:'Configurer puissance et frequence.',howto_3:'Cliquer Tir.',howto_4:'Utiliser Suivi Auto.',working:'En cours...',ready:'Sim AED pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',fireBeam:'Tir Faisceau',ceaseBeam:'Cesser le Feu',autoTrack:'Suivi Auto',resetSim:'Reinitialiser',beamParams:'Parametres Faisceau',powerParams:'Parametres Puissance',beamAngle:'Angle:',beamWidth:'Largeur:',outputPower:'Puissance (kW):',frequency:'Frequence (GHz):',engStatus:'Statut Engagement',targetHint:'Cibles suivies et donnees.',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Spoofing Detector and Rfw Satellite Injection Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0648\u062c\u0647\u0629',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0648\u062c\u0647\u0629',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0625\u0637\u0644\u0627\u0642',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0648\u062c\u0647\u0629',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062d\u0632\u0645\u0629 RF \u0639\u0627\u0644\u064a\u0629 \u0627\u0644\u0637\u0627\u0642\u0629',sectionA:'\u062a\u062a\u0628\u0639 \u0627\u0644\u0623\u0647\u062f\u0627\u0641',sectionB:'\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0627\u0644\u0633\u0644\u0627\u062d',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062d\u0627\u0643\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',fireBeam:'\u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u062d\u0632\u0645\u0629',ceaseBeam:'\u0648\u0642\u0641 \u0627\u0644\u0646\u0627\u0631',autoTrack:'\u062a\u062a\u0628\u0639 \u062a\u0644\u0642\u0627\u0626\u064a',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',beamParams:'\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u062d\u0632\u0645\u0629',powerParams:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0637\u0627\u0642\u0629',beamAngle:'\u0627\u0644\u0632\u0627\u0648\u064a\u0629:',beamWidth:'\u0627\u0644\u0639\u0631\u0636:',outputPower:'\u0627\u0644\u0642\u062f\u0631\u0629:',frequency:'\u0627\u0644\u062a\u0631\u062f\u062f:',engStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u0627\u0634\u062a\u0628\u0627\u0643',targetHint:'\u0627\u0644\u0623\u0647\u062f\u0627\u0641 \u0627\u0644\u0645\u062a\u062a\u0628\u0639\u0629.',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Spoofing Detector and Rfw Satellite Injection Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='dew-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ DEW DATA ═══════ */
let firing=false,autoTracking=false,time=0;
let targets=[];let powerHistory=new Array(200).fill(0);

function initTargets(){
  targets=[];
  for(let i=0;i<5;i++){
    targets.push({id:'TGT-'+(i+1),x:200+Math.random()*500,y:50+Math.random()*200,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*1,range:(2+Math.random()*8).toFixed(1),engaged:false,health:100});
  }
}

/* ═══════ BEAM CANVAS ═══════ */
function drawBeam(){
  const c=$('beamCanvas');if(!c)return;
  const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid
  for(let i=0;i<20;i++){ctx.beginPath();ctx.moveTo(i*W/20,0);ctx.lineTo(i*W/20,H);ctx.strokeStyle='rgba(0,255,136,0.05)';ctx.lineWidth=1;ctx.stroke();}
  for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(0,i*H/10);ctx.lineTo(W,i*H/10);ctx.strokeStyle='rgba(0,255,136,0.05)';ctx.stroke();}

  const angle=parseInt($('angleInput')?.value||0)*Math.PI/180;
  const beamW=parseInt($('widthInput')?.value||10)*Math.PI/180;
  const power=parseInt($('powerInput')?.value||100);
  const emX=W/2,emY=H-20;

  // Move targets
  targets.forEach(tgt=>{
    tgt.x+=tgt.vx;tgt.y+=tgt.vy;
    if(tgt.x<50||tgt.x>W-50)tgt.vx*=-1;
    if(tgt.y<30||tgt.y>H-80)tgt.vy*=-1;
  });

  // Auto-track nearest target
  if(autoTracking&&targets.length>0){
    let nearest=targets[0],minD=Infinity;
    targets.forEach(t=>{const d=Math.hypot(t.x-emX,t.y-emY);if(d<minD){minD=d;nearest=t;}});
    const tgtAngle=Math.atan2(-(nearest.y-emY),nearest.x-emX)-Math.PI/2;
    $('angleInput').value=Math.round(tgtAngle*180/Math.PI);
    $('angleLabel').textContent=Math.round(tgtAngle*180/Math.PI)+' deg';
  }

  // Draw beam
  if(firing){
    const beamLen=H*1.2;
    const a1=angle-Math.PI/2-beamW/2;
    const a2=angle-Math.PI/2+beamW/2;
    const grad=ctx.createRadialGradient(emX,emY,0,emX,emY,beamLen);
    grad.addColorStop(0,'rgba(255,100,0,0.6)');
    grad.addColorStop(0.3,'rgba(255,50,0,0.3)');
    grad.addColorStop(1,'rgba(255,0,0,0)');
    ctx.beginPath();ctx.moveTo(emX,emY);
    ctx.lineTo(emX+Math.cos(a1)*beamLen,emY+Math.sin(a1)*beamLen);
    ctx.arc(emX,emY,beamLen,a1,a2);
    ctx.closePath();ctx.fillStyle=grad;ctx.fill();

    // Heat shimmer
    for(let i=0;i<20;i++){
      const dist=Math.random()*beamLen*0.8;
      const ba=angle-Math.PI/2+(Math.random()-0.5)*beamW;
      const px=emX+Math.cos(ba)*dist;const py=emY+Math.sin(ba)*dist;
      ctx.beginPath();ctx.arc(px,py,1+Math.random()*3,0,Math.PI*2);
      ctx.fillStyle='rgba(255,200,0,'+(0.2+Math.random()*0.3)+')';ctx.fill();
    }

    // Check hits
    targets.forEach(tgt=>{
      const tgtA=Math.atan2(tgt.y-emY,tgt.x-emX);
      const diff=Math.abs(tgtA-(angle-Math.PI/2));
      tgt.engaged=diff<beamW/2;
      if(tgt.engaged&&tgt.health>0) tgt.health=Math.max(0,tgt.health-power*0.005);
    });
  } else {
    targets.forEach(t=>t.engaged=false);
  }

  // Draw targets
  targets.forEach(tgt=>{
    ctx.beginPath();ctx.arc(tgt.x,tgt.y,8,0,Math.PI*2);
    const color=tgt.health<=0?'rgba(100,100,100,0.5)':tgt.engaged?'rgba(255,50,50,0.9)':'rgba(0,200,255,0.8)';
    ctx.fillStyle=color;ctx.fill();
    if(tgt.engaged&&tgt.health>0){ctx.beginPath();ctx.arc(tgt.x,tgt.y,14+Math.sin(time*6)*4,0,Math.PI*2);ctx.strokeStyle='rgba(255,100,0,0.6)';ctx.lineWidth=2;ctx.stroke();}
    ctx.fillStyle=tgt.health<=0?'#666':tgt.engaged?'#ff6666':'#66ccff';
    ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(tgt.id,tgt.x,tgt.y-12);
    // Health bar
    ctx.fillStyle='rgba(50,50,50,0.8)';ctx.fillRect(tgt.x-15,tgt.y+12,30,4);
    ctx.fillStyle=tgt.health>50?'rgba(0,200,100,0.8)':tgt.health>20?'rgba(255,200,0,0.8)':'rgba(255,50,50,0.8)';
    ctx.fillRect(tgt.x-15,tgt.y+12,30*tgt.health/100,4);
  });

  // Emitter
  ctx.beginPath();ctx.arc(emX,emY,10,0,Math.PI*2);ctx.fillStyle=firing?'rgba(255,100,0,0.9)':'rgba(0,255,136,0.7)';ctx.fill();
  ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('DEW',emX,emY+25);

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DIRECTED ENERGY — BEAM VIEW',10,18);
  if(firing){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('FIRING — '+power+' kW',10,34);}
}

/* ═══════ POWER CANVAS ═══════ */
function drawPowerView(){
  const c=$('powerCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const power=parseInt($('powerInput')?.value||100);
  const newVal=firing?power*(0.8+Math.random()*0.4):Math.random()*5;
  powerHistory.push(newVal);if(powerHistory.length>200)powerHistory.shift();
  ctx.beginPath();
  powerHistory.forEach((v,i)=>{const x=i*(W/200);const y=H-10-v/600*H*0.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=firing?'rgba(255,100,0,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('POWER OUTPUT (kW)',5,14);
}

function animate(){time+=0.016;drawBeam();drawPowerView();updateStats();requestAnimationFrame(animate);}

function updateStats(){
  const stats=$('engStats');if(!stats)return;
  const engaged=targets.filter(t=>t.engaged).length;
  const destroyed=targets.filter(t=>t.health<=0).length;
  stats.innerHTML='<b>Targets:</b> '+targets.length+' ('+engaged+' engaged)<br><b>Neutralized:</b> '+destroyed+'<br><b>Auto-Track:</b> '+(autoTracking?'<span style="color:#ffcc00">ON</span>':'OFF')+'<br><b>Status:</b> '+(firing?'<span style="color:#ff4444">FIRING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

function updateTargetList(){
  const lib=$('targetList');if(!lib)return;lib.innerHTML='';
  targets.forEach(t=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(t.engaged?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(t.health<=0?'#666':t.engaged?'#ff6666':'#66ccff')+'">'+t.id+'</span><span>Range: '+t.range+' km</span><span>Health: '+t.health.toFixed(0)+'%</span><span style="color:'+(t.health<=0?'#666':t.engaged?'#ff4444':'#00cc88')+'">'+(t.health<=0?'DESTROYED':t.engaged?'ENGAGED':'TRACKED')+'</span>';
    lib.appendChild(row);
  });
}

function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Phased Array:</b> Electronically steered beam using antenna element phasing.','<b>HPM (High-Power Microwave):</b> Concentrated microwave energy for electronics disruption.','<b>Millimeter Wave:</b> 30-300 GHz beams for active denial systems.','<b>Adaptive Beamforming:</b> Real-time beam shaping for optimal target engagement.','<b>Power Density:</b> W/m² at target determines effectiveness.','<b>Thermal Effects:</b> Heating targets through RF energy absorption.'].join('<br><br>');}

function initControls(){
  $('angleInput').oninput=()=>{$('angleLabel').textContent=$('angleInput').value+' deg';};
  $('widthInput').oninput=()=>{$('widthLabel').textContent=$('widthInput').value+' deg';};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' kW';};
  $('freqInput').oninput=()=>{$('freqLabel').textContent=$('freqInput').value+' GHz';};

  $('fireBtn').onclick=()=>{firing=!firing;setStatus(firing);$('fireBtn').querySelector('[data-i18n]').textContent=firing?LANG[currentLang].ceaseBeam:LANG[currentLang].fireBeam;log(firing?'BEAM FIRING — '+$('powerInput').value+' kW @ '+$('freqInput').value+' GHz':'CEASE FIRE',firing?'error':'info');if(firing)showToast('Beam active...',2000);};
  $('trackBtn').onclick=()=>{autoTracking=!autoTracking;log(autoTracking?'Auto-tracking ENABLED':'Auto-tracking DISABLED',autoTracking?'success':'info');playSound(autoTracking?'success':'click');};
  $('resetBtn').onclick=()=>{firing=false;autoTracking=false;setStatus(false);initTargets();powerHistory=new Array(200).fill(0);$('fireBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].fireBeam;log('Simulation reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initTargets();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateTargetList,1000);
});

/* ═══════ ENHANCED RF CANVAS — DIRECTED ENERGY ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _thermalData=[];let _phasedArray=[];let _atmosphericLoss=new Array(200).fill(0);
let _beamProfile=new Float32Array(200).fill(0);let _heatParticles=[];

class HeatParticle{constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*1.5;this.vy=-1-Math.random()*2;this.life=1;this.decay=0.02+Math.random()*0.02;this.size=2+Math.random()*3;}
update(){this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;return this.life>0;}
draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);
  const r=255,g=Math.floor(200*this.life),b=0;ctx.fillStyle='rgba('+r+','+g+','+b+','+this.life*0.4+')';ctx.fill();}}

/* ── Phased Array Element Visualization ── */
function drawPhasedArray(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PHASED ARRAY ELEMENT STATUS',5,12);
  const isFire=typeof firing!=='undefined'&&firing;
  const angle=parseInt(_$('angleInput')?.value||0);
  const rows=8,cols=16;const elemW=Math.min(12,(W-20)/cols-2);const elemH=Math.min(12,(H-30)/rows-2);
  for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){
    const x=10+c*(elemW+2);const y=25+r*(elemH+2);
    const phase=(c-cols/2)*angle*0.02;const amplitude=isFire?0.5+Math.sin(phase+_t*10)*0.5:0.2;
    const red=isFire?Math.floor(amplitude*255):50;const grn=isFire?Math.floor(200-amplitude*150):100;
    ctx.fillStyle='rgba('+red+','+grn+',50,'+(0.3+amplitude*0.6)+')';
    ctx.fillRect(x,y,elemW,elemH);
    if(isFire&&amplitude>0.7){ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=1;ctx.strokeRect(x,y,elemW,elemH);}
  }}
  if(isFire){ctx.fillStyle='rgba(255,100,0,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText('BEAM ANGLE: '+angle+'°',W-10,H-5);}
}

/* ── Thermal Loading Profile ── */
function drawThermalProfile(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('THERMAL LOADING (%)',5,12);
  const isFire=typeof firing!=='undefined'&&firing;
  const power=parseInt(_$('powerInput')?.value||100);
  const thermalLoad=isFire?Math.min(100,power*0.3+_t*0.5+Math.random()*5):Math.max(0,(_thermalData[_thermalData.length-1]||20)-0.3);
  _thermalData.push(thermalLoad);if(_thermalData.length>200)_thermalData.shift();
  // Background zones
  ctx.fillStyle='rgba(255,50,50,0.05)';ctx.fillRect(0,20,W,(H-30)*0.3);
  ctx.fillStyle='rgba(255,200,0,0.05)';ctx.fillRect(0,20+(H-30)*0.3,W,(H-30)*0.3);
  ctx.fillStyle='rgba(0,200,100,0.05)';ctx.fillRect(0,20+(H-30)*0.6,W,(H-30)*0.4);
  ctx.beginPath();
  _thermalData.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  const color=thermalLoad>80?'rgba(255,50,50,0.8)':thermalLoad>50?'rgba(255,200,0,0.7)':'rgba(0,200,100,0.6)';
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=color;ctx.font='14px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(thermalLoad.toFixed(0)+'%',W-10,30);
  if(thermalLoad>80){ctx.fillStyle='rgba(255,50,50,'+Math.abs(Math.sin(_t*5))*0.5+')';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('⚠ OVERHEAT WARNING',W/2,H/2);}
}

/* ── Power Density at Range ── */
function drawPowerDensity(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('POWER DENSITY AT TARGET (W/m²)',5,12);
  const power=parseInt(_$('powerInput')?.value||100);
  const freq=parseFloat(_$('freqInput')?.value||10);
  const beamW=parseInt(_$('widthInput')?.value||10);
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const range=(x/W)*20;const area=Math.PI*(range*1000*Math.tan(beamW*Math.PI/360))**2||1;
    const pd=power*1000/area;
    const logPd=Math.log10(Math.max(pd,0.001))*10;
    const y=H-10-((logPd+20)/60)*(H-25);
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(255,100,0,0.7)';ctx.lineWidth=2;ctx.stroke();
  // Damage thresholds
  [{name:'Electronics Damage',val:100,color:'rgba(255,50,50,0.4)'},{name:'Sensor Disruption',val:10,color:'rgba(255,200,0,0.4)'},{name:'Comm Degradation',val:1,color:'rgba(0,200,255,0.4)'}].forEach(th=>{
    const logTh=Math.log10(th.val)*10;const y=H-10-((logTh+20)/60)*(H-25);
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle=th.color;ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=th.color;ctx.font='7px Orbitron,monospace';ctx.textAlign='right';ctx.fillText(th.name,W-5,y-3);
  });
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
  for(let r=0;r<=20;r+=5){ctx.fillText(r+'km',(r/20)*W,H-1);}
}

/* ── Atmospheric Absorption Graph ── */
function drawAtmosphericLoss(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ATMOSPHERIC ABSORPTION (dB/km)',5,12);
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const freq=x/W*300;// 0-300 GHz
    let loss=0.01;
    // Water vapor peaks
    if(Math.abs(freq-22)<3)loss+=0.2;if(Math.abs(freq-183)<5)loss+=3;if(Math.abs(freq-325)<10)loss+=5;
    // Oxygen peaks
    if(Math.abs(freq-60)<10)loss+=15;if(Math.abs(freq-118)<5)loss+=1;
    loss+=freq*0.001;
    const y=H-10-(Math.min(loss,20)/20)*(H-25);
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  // Current frequency marker
  const freq=parseFloat(_$('freqInput')?.value||10);const markerX=(freq/300)*W;
  ctx.beginPath();ctx.moveTo(markerX,20);ctx.lineTo(markerX,H-10);
  ctx.strokeStyle='rgba(255,200,0,0.6)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(255,200,0,0.6)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText(freq+' GHz',markerX,18);
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_heatParticles.length-1;i>=0;i--)if(!_heatParticles[i].update())_heatParticles.splice(i,1);
  const bc=_$('beamCanvas');
  if(bc){const ctx=bc.getContext('2d');
    if(typeof firing!=='undefined'&&firing&&typeof targets!=='undefined'){
      targets.forEach(tgt=>{if(tgt.engaged&&tgt.health>0){
        for(let i=0;i<3;i++)_heatParticles.push(new HeatParticle(tgt.x,tgt.y));
      }});
      _heatParticles.forEach(p=>p.draw(ctx));
    }
  }
  const pc=_$('powerCanvas');
  if(pc){const ctx=pc.getContext('2d');const W=pc.width,H=pc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawThermalProfile(ctx,W,H);}
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
