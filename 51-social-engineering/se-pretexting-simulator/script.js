/**
 * SE-Pretexting-Simulator — Workshop DIY v1.0
 * Canvas-based pretexting social engineering simulation.
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

const LANG = {
  en:{title:'Pretexting Simulator',subtitle:'Build & analyze social engineering pretexts',disconnected:'Disconnected',connected:'Connected',mainSection:'Pretexting Simulator',mainDesc:'Craft and test social engineering pretexts in a safe environment',sectionA:'How It Works',sectionB:'Challenge',buildBtn:'Build Pretext',executeBtn:'Execute Scenario',analyzeBtn:'Analyze',scenTech:'IT Support Impersonation',scenExec:'CEO Urgent Request',scenVendor:'Vendor Invoice Scam',scenHR:'HR Benefits Update',howStep1:'The attacker creates a false identity and backstory to establish trust.',howStep2:'They research the target using OSINT to make the pretext believable.',howStep3:'During interaction, they manipulate trust and authority biases.',howStep4:'The target reveals sensitive information or performs harmful actions.',challenge1:'What makes a pretext convincing?',challenge2:'How can organizations defend against pretexting?',challenge3:'Design a pretext detection checklist.',challengeReveal1:'Specific details about the target, urgency preventing verification, authority figures discouraging questioning, and emotional triggers.',challengeReveal2:'Verification procedures, employee training, callback protocols, and a culture encouraging questioning of unusual requests.',challengeReveal3:'Check: unusual urgency, caller verifiability, procedure bypasses, emotional pressure, credential requests, independent verification possibility.',revealBtn:'Reveal Answer',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',theme:'Theme',soundEffects:'🔊 Sound effects',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Select a pretexting scenario from the dropdown.',howto_2:'Click Build Pretext to construct the narrative.',howto_3:'Click Execute to simulate the interaction.',howto_4:'Click Analyze to review attack vectors and defenses.',wiki_t1:'🕵️ Pretexting',wiki_d1:'Creating a fabricated scenario to engage a victim with a false identity.',wiki_t2:'💪 Authority Bias',wiki_d2:'Psychological tendency to obey authority figures without question.',wiki_t3:'🛡️ Defense',wiki_d3:'Multi-factor verification, callback procedures, and awareness training.',ready:'🕵️ Pretexting Simulator ready — select a scenario!',building:'Constructing pretext narrative...',built:'Pretext constructed for: %s',executing:'Executing pretexting scenario...',trustRising:'Trust level: %t% — target engaging...',executed:'Scenario complete. Trust: %t%. Compromised: %r',analyzing:'Analyzing attack vectors...',analyzed:'Analysis complete. %n vulnerabilities found.',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Research Target',step1Desc:'The attacker creates a false identity and backstory to establish trust.',step2Title:'Build Pretext',step2Desc:'They research the target using OSINT to make the pretext believable.',step3Title:'Execute Attack',step3Desc:'During interaction, they manipulate trust and authority biases.',step4Title:'Analyze & Defend',step4Desc:'The target reveals sensitive information or performs harmful actions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates social engineering! 🔬 You get to experiment with human psychology in security in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real human psychology in security so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real social manipulation awareness! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Se Impersonation Toolkit and Se Social Media Recon! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr:{title:'Simulateur de Prétexte',subtitle:'Construire et analyser des prétextes d\'ingénierie sociale',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Simulateur de Prétexte',mainDesc:'Créez et testez des prétextes en toute sécurité',sectionA:'Comment ça Marche',sectionB:'Défi',buildBtn:'Construire',executeBtn:'Exécuter',analyzeBtn:'Analyser',scenTech:'Usurpation Support IT',scenExec:'Demande Urgente PDG',scenVendor:'Arnaque Facture',scenHR:'Mise à Jour RH',howStep1:'L\'attaquant crée une fausse identité pour établir la confiance.',howStep2:'Il recherche la cible avec l\'OSINT pour crédibiliser le prétexte.',howStep3:'Il manipule la confiance et les biais d\'autorité de la cible.',howStep4:'La cible révèle des informations sensibles ou agit au profit de l\'attaquant.',challenge1:'Qu\'est-ce qui rend un prétexte convaincant?',challenge2:'Comment se défendre contre le prétexte?',challenge3:'Concevez une checklist de détection.',challengeReveal1:'Détails spécifiques, urgence, figures d\'autorité et déclencheurs émotionnels.',challengeReveal2:'Procédures de vérification, formation, protocoles de rappel et culture du questionnement.',challengeReveal3:'Vérifiez: urgence inhabituelle, vérifiabilité, contournement de procédures, pression émotionnelle.',revealBtn:'Révéler',activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',soundEffects:'🔊 Effets sonores',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Sélectionnez un scénario.',howto_2:'Cliquez Construire pour créer le narratif.',howto_3:'Cliquez Exécuter pour simuler l\'interaction.',howto_4:'Cliquez Analyser pour les vecteurs d\'attaque.',wiki_t1:'🕵️ Prétexte',wiki_d1:'Créer un scénario fabriqué avec une fausse identité.',wiki_t2:'💪 Biais d\'Autorité',wiki_d2:'Tendance à obéir sans questionner.',wiki_t3:'🛡️ Défense',wiki_d3:'Vérification, rappel et formation à la sensibilisation.',ready:'🕵️ Simulateur prêt — choisissez un scénario!',building:'Construction du narratif...',built:'Prétexte construit: %s',executing:'Exécution du scénario...',trustRising:'Confiance: %t% — cible engagée...',executed:'Terminé. Confiance: %t%. Compromis: %r',analyzing:'Analyse des vecteurs...',analyzed:'Analyse terminée. %n vulnérabilités.',logCleared:'Journal effacé',copied:'Copié!',copyFail:'Échec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Rechercher la cible',step1Desc:'L\'attaquant crée une fausse identité pour établir la confiance.',step2Title:'Construire le prétexte',step2Desc:'Il recherche la cible avec l\'OSINT pour crédibiliser le prétexte.',step3Title:'Exécuter l\'attaque',step3Desc:'Il manipule la confiance et les biais d\'autorité de la cible.',step4Title:'Analyser et défendre',step4Desc:'La cible révèle des informations sensibles ou agit au profit de l\'attaquant.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule social engineering ! 🔬 Tu peux expérimenter avec human psychology in security en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais human psychology in security.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai social manipulation awareness ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Se Impersonation Toolkit and Se Social Media Recon ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'محاكي الذرائع',subtitle:'بناء وتحليل ذرائع الهندسة الاجتماعية',disconnected:'غير متصل',connected:'متصل',mainSection:'محاكي الذرائع',mainDesc:'صياغة واختبار ذرائع في بيئة آمنة',sectionA:'كيف يعمل',sectionB:'التحدي',buildBtn:'بناء الذريعة',executeBtn:'تنفيذ السيناريو',analyzeBtn:'تحليل',scenTech:'انتحال الدعم التقني',scenExec:'طلب عاجل من المدير',scenVendor:'احتيال فاتورة',scenHR:'تحديث الموارد البشرية',howStep1:'يصنع المهاجم هوية مزيفة وقصة لبناء الثقة.',howStep2:'يبحث عن الهدف باستخدام OSINT لتصديق الذريعة.',howStep3:'خلال التفاعل يتلاعب بالثقة وتحيزات السلطة.',howStep4:'يكشف الهدف معلومات حساسة أو ينفذ إجراءات ضارة.',challenge1:'ما الذي يجعل الذريعة مقنعة؟',challenge2:'كيف تدافع المؤسسات ضد التذرع؟',challenge3:'صمم قائمة تحقق لكشف الذرائع.',challengeReveal1:'تفاصيل محددة والإلحاح وشخصيات سلطوية ومحفزات عاطفية.',challengeReveal2:'إجراءات التحقق والتدريب وبروتوكولات الاتصال العكسي وثقافة التساؤل.',challengeReveal3:'تحقق: إلحاح غير عادي، قابلية التحقق، تجاوز الإجراءات، ضغط عاطفي.',revealBtn:'اكشف الإجابة',activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'🔊 المؤثرات الصوتية',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اختر سيناريو من القائمة.',howto_2:'انقر بناء لصياغة السردية.',howto_3:'انقر تنفيذ لمحاكاة التفاعل.',howto_4:'انقر تحليل لمراجعة النواقل.',wiki_t1:'🕵️ التذرع',wiki_d1:'إنشاء سيناريو مفبرك بهوية مزيفة.',wiki_t2:'💪 تحيز السلطة',wiki_d2:'ميل لطاعة السلطة دون تساؤل.',wiki_t3:'🛡️ الدفاع',wiki_d3:'التحقق والاتصال العكسي والتدريب.',ready:'🕵️ محاكي الذرائع جاهز!',building:'جارٍ بناء السردية...',built:'تم بناء الذريعة: %s',executing:'جارٍ تنفيذ السيناريو...',trustRising:'الثقة: %t% — الهدف يتفاعل...',executed:'اكتمل. الثقة: %t%. مخترق: %r',analyzing:'جارٍ تحليل النواقل...',analyzed:'اكتمل التحليل. %n ثغرات.',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',working:'جارٍ...',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'البحث عن الهدف',step1Desc:'يصنع المهاجم هوية مزيفة وقصة لبناء الثقة.',step2Title:'بناء الذريعة',step2Desc:'يبحث عن الهدف باستخدام OSINT لتصديق الذريعة.',step3Title:'تنفيذ الهجوم',step3Desc:'خلال التفاعل يتلاعب بالثقة وتحيزات السلطة.',step4Title:'تحليل ودفاع',step4Desc:'يكشف الهدف معلومات حساسة أو ينفذ إجراءات ضارة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي social engineering! 🔬 يمكنك التجربة مع human psychology in security في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج human psychology in security حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا social manipulation awareness حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Se Impersonation Toolkit and Se Social Media Recon! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}

/* ═══════ FRAMEWORK ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='pretexting-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}
window.revealChallenge=function(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');};

/* ═══════ CANVAS — Social Network Graph ═══════ */
let netAnim,trustLevel=0,scenarioActive=false;
const nodes=[],edges=[];let highlightNode=-1;
function getAccent(){return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';}

function initNetworkCanvas(){
  const c=$('networkCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  function resize(){c.width=c.offsetWidth*(window.devicePixelRatio||1);c.height=260*(window.devicePixelRatio||1);ctx.scale(window.devicePixelRatio||1,window.devicePixelRatio||1);}
  resize();window.addEventListener('resize',resize);
  const W=()=>c.width/(window.devicePixelRatio||1),H=()=>260;

  const labels=['Attacker','Target','IT Dept','CEO','HR','Finance','Vendor','Email'];
  const icons=['🕵️','👤','💻','👔','📋','💰','📦','📧'];
  for(let i=0;i<labels.length;i++){
    const a=(i/labels.length)*Math.PI*2-Math.PI/2;
    nodes.push({x:0.5+Math.cos(a)*0.35,y:0.5+Math.sin(a)*0.35,label:labels[i],icon:icons[i],pulse:0,compromised:false,vx:(Math.random()-0.5)*0.0004,vy:(Math.random()-0.5)*0.0004});
  }
  edges.push({from:0,to:1},{from:0,to:7},{from:1,to:2},{from:1,to:3},{from:1,to:4},{from:1,to:5},{from:3,to:5},{from:6,to:5},{from:7,to:1});

  let t=0;const packets=[];
  window._sendPkt=function(f,to,mal){packets.push({from:f,to:to,p:0,mal:mal||false});};

  function draw(){
    const w=W(),h=H();
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    const accent=getAccent();

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.02)';ctx.lineWidth=1;
    for(let y=0;y<h;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}

    nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0.1||n.x>0.9)n.vx*=-1;if(n.y<0.1||n.y>0.9)n.vy*=-1;});

    // Edges
    edges.forEach(e=>{
      const a=nodes[e.from],b=nodes[e.to];
      ctx.strokeStyle=e.active?accent:'rgba(255,255,255,0.06)';ctx.lineWidth=e.active?2:1;
      ctx.beginPath();ctx.moveTo(a.x*w,a.y*h);ctx.lineTo(b.x*w,b.y*h);ctx.stroke();
    });

    // Packets
    for(let i=packets.length-1;i>=0;i--){
      const p=packets[i];p.p+=0.02;if(p.p>1){packets.splice(i,1);continue;}
      const a=nodes[p.from],b=nodes[p.to];
      const px=a.x*w+(b.x*w-a.x*w)*p.p,py=a.y*h+(b.y*h-a.y*h)*p.p;
      ctx.fillStyle=p.mal?'#ff4444':accent;ctx.shadowColor=p.mal?'#ff4444':accent;ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    }

    // Nodes
    nodes.forEach((n,i)=>{
      const nx=n.x*w,ny=n.y*h;
      if(n.pulse>0){ctx.strokeStyle=n.compromised?'rgba(255,68,68,'+n.pulse+')':'rgba(212,160,60,'+n.pulse+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(nx,ny,20+10*(1-n.pulse),0,Math.PI*2);ctx.stroke();n.pulse-=0.012;}
      ctx.fillStyle=n.compromised?'rgba(255,68,68,0.2)':i===highlightNode?'rgba(212,160,60,0.3)':'rgba(255,255,255,0.05)';
      ctx.strokeStyle=n.compromised?'#ff4444':i===highlightNode?accent:'rgba(255,255,255,0.12)';
      ctx.lineWidth=i===highlightNode?2:1;ctx.beginPath();ctx.arc(nx,ny,18,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.icon,nx,ny);
      ctx.fillStyle='rgba(255,255,255,0.45)';ctx.font='7px Orbitron,monospace';ctx.fillText(n.label,nx,ny+28);
    });

    // Trust bar
    if(scenarioActive||trustLevel>0){
      ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(10,8,w-20,10);
      ctx.fillStyle=trustLevel<30?'#44ff44':trustLevel<70?'#ffaa00':'#ff4444';
      ctx.fillRect(10,8,(w-20)*trustLevel/100,10);
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='left';
      ctx.fillText('TRUST: '+Math.round(trustLevel)+'%',14,16);
    }
    t++;netAnim=requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ SIMULATION ═══════ */
const SCENARIOS={tech:{name:'IT Support',steps:['Calling target as "IT Help Desk"...','Claiming urgent security patch needed...','Requesting remote access credentials...','Target provides VPN password!']},exec:{name:'CEO Fraud',steps:['Spoofing CEO email address...','Creating urgency: "Wire transfer NOW"...','Bypassing approval with authority...','Finance initiates unauthorized transfer!']},vendor:{name:'Vendor Scam',steps:['Impersonating known vendor...','Sending modified invoice with new bank...','Following up with urgency call...','Payment redirected to attacker!']},hr:{name:'HR Update',steps:['Posing as HR department...','Requesting personal info for "benefits"...','Creating fake portal...','Employee submits SSN and bank details!']}};
let currentScenario=null;

function doBuild(){
  const key=$('scenarioSelect')?$('scenarioSelect').value:'tech';
  currentScenario=SCENARIOS[key];setStatus(true);
  log(T('building'),'info');showToast(T('building'));
  nodes[0].pulse=1;highlightNode=0;
  setTimeout(()=>{hideToast();log(T('built').replace('%s',currentScenario.name),'success');
    const db=$('dialogueBox');if(db)db.textContent='[PRETEXT] Scenario: '+currentScenario.name+'\n[PRETEXT] Identity established\n[PRETEXT] Target profiled\n[PRETEXT] Backstory ready';
  },1500);
}

function doExecute(){
  if(!currentScenario){log('Build a pretext first','error');return;}
  scenarioActive=true;trustLevel=0;
  log(T('executing'),'info');showToast(T('executing'));
  const steps=currentScenario.steps;let si=0;const db=$('dialogueBox'),tm=$('trustMeter');
  const iv=setInterval(()=>{
    if(si>=steps.length){clearInterval(iv);hideToast();scenarioActive=false;
      const comp=trustLevel>60;nodes[1].compromised=comp;nodes[1].pulse=1;
      log(T('executed').replace('%t',Math.round(trustLevel)).replace('%r',comp?'YES':'NO'),'success');
      if(db)db.textContent+='\n[RESULT] Trust: '+Math.round(trustLevel)+'% | Compromised: '+(comp?'YES':'NO');return;}
    trustLevel+=15+Math.random()*12;trustLevel=Math.min(95,trustLevel);
    if(tm)tm.style.width=trustLevel+'%';
    log(T('trustRising').replace('%t',Math.round(trustLevel)),'info');
    if(db){db.textContent+='\n[STEP '+(si+1)+'] '+steps[si];db.scrollTop=db.scrollHeight;}
    _sendPkt(0,1,true);
    if(si===1)_sendPkt(0,7,true);if(si===2){_sendPkt(1,2,false);highlightNode=1;nodes[1].pulse=1;}
    if(si===3){_sendPkt(1,5,true);nodes[5].pulse=1;}
    si++;
  },2000);
}

function doAnalyze(){
  if(!currentScenario){log('Build a pretext first','error');return;}
  log(T('analyzing'),'info');showToast(T('analyzing'));
  setTimeout(()=>{hideToast();const n=3+Math.floor(Math.random()*4);
    log(T('analyzed').replace('%n',n),'success');
    const db=$('dialogueBox');
    if(db){db.textContent+='\n\n[ANALYSIS] Vulnerabilities: '+n+'\n[VULN] Authority bias — no verification\n[VULN] Urgency pressure — bypasses rational thought\n[VULN] No callback verification\n[DEFENSE] Mandatory verification for sensitive requests\n[DEFENSE] Social engineering training\n[DEFENSE] Out-of-band confirmation channels';db.scrollTop=db.scrollHeight;}
    edges.forEach(e=>e.active=false);highlightNode=-1;
  },2000);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();initHijriDate();initLogFilters();initHelpTabs();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');
  if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initNetworkCanvas();
  if($('buildBtn'))$('buildBtn').onclick=doBuild;if($('executeBtn'))$('executeBtn').onclick=doExecute;if($('analyzeBtn'))$('analyzeBtn').onclick=doAnalyze;
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
