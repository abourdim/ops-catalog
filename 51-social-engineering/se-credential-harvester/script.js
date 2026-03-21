/**
 * se-credential-harvester — Workshop DIY v1.0
 * Understand how fake login pages steal credentials
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
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
    ...LANG_BASE.en,title:'Credential Harvester',subtitle:'Understand how fake login pages steal credentials',disconnected:'Disconnected',connected:'Connected',mainSection:'Credential Harvester',mainDesc:'Understand how fake login pages steal credentials',sectionA:'Fake Page Builder',sectionB:'Harvest Monitor',sectionC:'Defense Tips',btn1:'Build Page',btn2:'Analyze URL',metric1Label:'Threat Level',metric1Desc:'Current assessment',metric2Label:'Confidence',metric2Desc:'Analysis confidence',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click the primary button to start.',howto_2:'Observe the canvas visualization.',howto_3:'Use the secondary button to analyze.',howto_4:'Review the intelligence log.',wiki_t1:'Credential Harvester',wiki_d1:'Creating fake login pages that capture usernames and passwords.',ready:'Credential Harvester ready.',action1:'Running primary scan...',action1Done:'Primary scan complete!',action2:'Running analysis...',action2Done:'Analysis complete. Results logged.',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'Language \u2192 English',themeChanged:'Theme \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Research Target',step1Desc:'Gather information about the target using open sources and social media.',step2Title:'Build Pretext',step2Desc:'Create a believable cover story or scenario to manipulate the target.',step3Title:'Execute Attack',step3Desc:'Deploy the social engineering technique and observe the target\'s response.',step4Title:'Analyze & Defend',step4Desc:'Review what worked, why it worked, and how to defend against it.',sectionCode:'Device Code',faq_q1:'What is Credential Harvester?',faq_a1:'Credential Harvester lets you understand how fake login pages steal credentials. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you gather information about the target using open sources and social media. Then you create a believable cover story or scenario to manipulate the target.',faq_q3:'What do the controls do?',faq_a3:'Click the primary button to start. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'إنشاء صفحات تسجيل دخول مزيفة.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Se Baiting Trap Designer and Se Deepfake Voice Cloner. Each app in this category teaches a different aspect of social engineering awareness.',demo_s1:'Welcome to Credential Harvester! Look at the main display — this is where the social engineering awareness simulation runs.',demo_s2:'Click the primary button to start. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Fake Page Builder" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of social engineering awareness.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how social engineering awareness works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches social engineering awareness concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Fake Page Builder" and "Harvest Monitor" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Collecteur d'Identifiants',subtitle:'Comprendre les fausses pages de connexion',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Collecteur d'Identifiants',mainDesc:'Comprendre les fausses pages de connexion',sectionA:'Constructeur de Page',sectionB:'Moniteur',sectionC:'Conseils',btn1:'Construire',btn2:'Analyser',metric1Label:'Niveau de Menace',metric1Desc:'\u00c9valuation actuelle',metric2Label:'Confiance',metric2Desc:'Confiance de l\'analyse',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez le bouton principal.',howto_2:'Observez la visualisation.',howto_3:'Utilisez le bouton secondaire.',howto_4:'Consultez le journal.',wiki_t1:'Collecteur d'Identifiants',wiki_d1:'Créer de fausses pages de connexion.',ready:'Collecteur d'Identifiants pr\u00eat.',action1:'Scan principal en cours...',action1Done:'Scan termin\u00e9!',action2:'Analyse en cours...',action2Done:'Analyse termin\u00e9e.',logCleared:'Journal effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'Langue \u2192 Fran\u00e7ais',themeChanged:'Th\u00e8me \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Rechercher la cible',step1Desc:'Collecte des informations sur la cible via sources ouvertes et réseaux sociaux.',step2Title:'Construire le prétexte',step2Desc:'Crée une histoire de couverture crédible pour manipuler la cible.',step3Title:'Exécuter l\'attaque',step3Desc:'Déploie la technique d\'ingénierie sociale et observe la réponse.',step4Title:'Analyser et défendre',step4Desc:'Analyse ce qui a fonctionné et comment s\'en protéger.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule social engineering ! 🔬 Tu peux expérimenter avec human psychology in security en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais human psychology in security.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai social manipulation awareness ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Se Watering Hole Architect and Se Tailgating Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'جامع بيانات الاعتماد',subtitle:'فهم صفحات تسجيل الدخول المزيفة',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'جامع بيانات الاعتماد',mainDesc:'فهم صفحات تسجيل الدخول المزيفة',sectionA:'باني الصفحات',sectionB:'المراقب',sectionC:'نصائح',btn1:'بناء',btn2:'تحليل',metric1Label:'\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062a\u0647\u062f\u064a\u062f',metric1Desc:'\u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u062d\u0627\u0644\u064a',metric2Label:'\u0627\u0644\u062b\u0642\u0629',metric2Desc:'\u062b\u0642\u0629 \u0627\u0644\u062a\u062d\u0644\u064a\u0644',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',howto_1:'\u0627\u0646\u0642\u0631 \u0627\u0644\u0632\u0631 \u0627\u0644\u0631\u0626\u064a\u0633\u064a.',howto_2:'\u0631\u0627\u0642\u0628 \u0627\u0644\u062a\u0635\u0648\u0631.',howto_3:'\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0632\u0631 \u0627\u0644\u062b\u0627\u0646\u0648\u064a.',howto_4:'\u0631\u0627\u062c\u0639 \u0627\u0644\u0633\u062c\u0644.',wiki_t1:'جامع بيانات الاعتماد',wiki_d1:'إنشاء صفحات تسجيل دخول مزيفة.',ready:'جامع بيانات الاعتماد \u062c\u0627\u0647\u0632.',action1:'\u062c\u0627\u0631\u064d \u0627\u0644\u0645\u0633\u062d...',action1Done:'\u0627\u0643\u062a\u0645\u0644 \u0627\u0644\u0645\u0633\u062d!',action2:'\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0644\u064a\u0644...',action2Done:'\u0627\u0643\u062a\u0645\u0644 \u0627\u0644\u062a\u062d\u0644\u064a\u0644.',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',step1Title:'البحث عن الهدف',step1Desc:'اجمع معلومات عن الهدف باستخدام المصادر المفتوحة ووسائل التواصل.',step2Title:'بناء الذريعة',step2Desc:'أنشئ قصة تغطية مقنعة للتلاعب بالهدف.',step3Title:'تنفيذ الهجوم',step3Desc:'انشر تقنية الهندسة الاجتماعية وراقب استجابة الهدف.',step4Title:'تحليل ودفاع',step4Desc:'راجع ما نجح ولماذا وكيفية الدفاع ضده.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي social engineering! 🔬 يمكنك التجربة مع human psychology in security في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج human psychology in security حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا social manipulation awareness حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Se Watering Hole Architect and Se Tailgating Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}

/* ═══════ FRAMEWORK ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else{o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' \u2014 Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}

/* ═══════ CANVAS SIM ═══════ */
function initSimCanvas(){
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d');c.width=c.offsetWidth||800;c.height=250;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  
  const cols=Math.floor(c.width/14);const drops=Array(cols).fill(1);const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=accent;ctx.font='12px monospace';
    for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*14,drops[i]*14);
      if(drops[i]*14>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}
    requestAnimationFrame(draw);}draw();
}
function initAnalysisCanvas(){
  const c2=$('analysisCanvas');if(!c2)return;const ctx2=c2.getContext('2d');c2.width=c2.offsetWidth||800;c2.height=200;
  const accent2=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  
  let t2=0;const data2=Array(50).fill(0);
  function draw2(){ctx2.fillStyle='rgba(0,0,0,0.05)';ctx2.fillRect(0,0,c2.width,c2.height);
    data2.push(Math.random()*100);if(data2.length>50)data2.shift();
    ctx2.strokeStyle=accent2;ctx2.lineWidth=2;ctx2.beginPath();
    data2.forEach((v,i)=>{const x=i*(c2.width/50),y=c2.height-v*1.8;i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);});ctx2.stroke();
    ctx2.fillStyle='#fff';ctx2.font='10px Orbitron,monospace';ctx2.fillText('ANALYSIS METRICS',10,15);
    t2++;requestAnimationFrame(draw2);}draw2();
}

/* ═══════ ACTIONS ═══════ */
let metric1=0,metric2=0;
function doAction1(){
  log(T('action1'),'info');showToast(T('action1'));setStatus(true);
  let p=0;const iv=setInterval(()=>{p+=Math.random()*20;metric1=Math.min(100,Math.round(p));
    $('metric1Val').textContent=metric1>70?'HIGH':metric1>40?'MEDIUM':'LOW';
    $('metric1Val').style.color=metric1>70?'#f44':metric1>40?'#fa4':'#4f4';
    metric2=Math.min(99,Math.round(p*0.9));$('metric2Val').textContent=metric2+'%';
    if(p>=100){clearInterval(iv);hideToast();log(T('action1Done'),'success');
      const il=$('intelLog');if(il)il.textContent+='\n[SCAN] Threat level: '+(metric1>70?'HIGH':'MEDIUM')+'\n[SCAN] Confidence: '+metric2+'%\n[SCAN] Vectors identified: '+Math.round(Math.random()*5+3);}
  },300);
}
function doAction2(){
  log(T('action2'),'info');showToast(T('action2'));
  setTimeout(()=>{hideToast();log(T('action2Done'),'success');
    const il=$('intelLog');if(il)il.textContent+='\n[ANALYSIS] Pattern match score: '+Math.round(Math.random()*30+70)+'%\n[ANALYSIS] Risk indicators: '+Math.round(Math.random()*4+2)+'\n[ANALYSIS] Recommendation: Increase monitoring.';
  },1800);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initHijriDate();initSimCanvas();initAnalysisCanvas();
  if($('btn1'))$('btn1').onclick=doAction1;
  if($('btn2'))$('btn2').onclick=doAction2;
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();


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
